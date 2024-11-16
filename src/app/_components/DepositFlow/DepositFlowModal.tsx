import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState, useMemo, useEffect } from "react";
import type { DepositState } from "../DepositPanel";
import { useAccount, useSwitchChain, useWalletClient, useWriteContract, useReadContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { Steps } from "./Steps";
import { useToast } from "@/hooks/use-toast";
import { createDepositOrders } from "@/services/deposit";
import { CHAIN_ID, config } from "@/config";
import { erc20Abi, parseUnits } from "viem";
import { waitForTransactionReceipt } from "@wagmi/core";
import { OrderStatus } from "@1inch/cross-chain-sdk";

interface DepositFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  depositState: DepositState;
}

// First, define an interface for the step structure
interface Step {
  title: string;
  description: string;
  action: () => Promise<void>;
  shouldSkip?: () => boolean;
}

export function DepositFlowModal({ isOpen, onClose, depositState }: DepositFlowModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [orders, setOrders] = useState<{
    monitorOrder0: () => Promise<OrderStatus>;
    monitorOrder1: () => Promise<OrderStatus>;
  } | null>(null);
  const [orderStatus0, setOrderStatus0] = useState<OrderStatus | null>(null);
  const [orderStatus1, setOrderStatus1] = useState<OrderStatus | null>(null);
  const { address, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { data: walletClient } = useWalletClient();

  const targetChainId = CHAIN_ID[depositState.chain];
  const needsChainSwitch = chain?.id !== targetChainId;

  const { data: allowance } = useReadContract({
    address: depositState.tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address as `0x${string}`, "0x111111125421cA6dc452d289314280a0f8842A65" as `0x${string}`],
    query: {
      enabled: !!address && !!depositState.tokenAddress,
    },
  });

  const checkAllowance = () => {
    if (!allowance || !depositState.amount) return false;
    const amount = parseUnits(depositState.amount, depositState.decimals);
    return allowance >= amount;
  };

  useEffect(() => {
    let isMounted = true;

    const monitorOrders = async () => {
      if (!orders || !orders.monitorOrder0 || !orders.monitorOrder1) return;

      try {
        const [status0, status1] = await Promise.all([orders.monitorOrder0(), orders.monitorOrder1()]);

        if (isMounted) {
          setOrderStatus0(status0);
          setOrderStatus1(status1);

          // If both orders are complete, move to next step
          if ((status0 === OrderStatus.Executed || status0 === OrderStatus.Refunded) && (status1 === OrderStatus.Executed || status1 === OrderStatus.Refunded)) {
            setCurrentStep(3); // Move to Add Liquidity step
          }
        }
      } catch (error) {
        console.error("Error monitoring orders:", error);
        toast({
          title: "Error Monitoring Orders",
          description: "Failed to monitor swap orders status",
          variant: "destructive",
          duration: 5000,
        });
      }
    };

    if (orders) {
      monitorOrders();
    }

    return () => {
      isMounted = false;
    };
  }, [orders, toast]);

  const baseSteps = [
    {
      title: "Approve tokens",
      description: "Approve tokens for swapping",
      action: async () => {
        if (!address || !chain?.id || !depositState.pool) return;
        try {
          setIsLoading(true);

          // Check if already approved
          const isApproved = checkAllowance();
          if (isApproved) {
            setCurrentStep(needsChainSwitch ? 2 : 1);
            return;
          }

          const amount = parseUnits(depositState.amount, depositState.decimals);
          const hash = await writeContractAsync({
            abi: erc20Abi,
            functionName: "approve",
            address: depositState.tokenAddress as `0x${string}`,
            args: ["0x111111125421cA6dc452d289314280a0f8842A65" as `0x${string}`, amount],
          });

          await waitForTransactionReceipt(config, { hash });
          setCurrentStep(needsChainSwitch ? 2 : 1);
        } catch (error) {
          console.error(error);
          toast({
            title: "Error Approving Token",
            description: error instanceof Error ? error.message : "Failed to approve token",
            variant: "destructive",
            duration: 5000,
          });
        } finally {
          setIsLoading(false);
        }
      },
      shouldSkip: () => checkAllowance(),
    },
    {
      title: "Create orders",
      description: "Create swap orders",
      action: async () => {
        if (!address || !chain?.id || !depositState.pool) return;

        try {
          setIsLoading(true);
          const createdOrders = await createDepositOrders({
            pool: depositState.pool,
            fromTokenAddress: depositState.tokenAddress,
            amount: parseUnits(depositState.amount, depositState.decimals).toString(),
            userAddress: address,
            userChain: chain.id.toString(),
            walletClient: walletClient!,
          });
          setOrders({
            monitorOrder0: () => {
              if (createdOrders.monitorOrder0 && typeof createdOrders.monitorOrder0 === "function") {
                return createdOrders.monitorOrder0();
              }
              throw new Error("Monitor function not available on order");
            },
            monitorOrder1: () => {
              if (createdOrders.monitorOrder1 && typeof createdOrders.monitorOrder1 === "function") {
                return createdOrders.monitorOrder1();
              }
              throw new Error("Monitor function not available on order");
            },
          });
          setCurrentStep(2);
        } catch (error) {
          console.error(error);
          toast({
            title: "Error Creating Orders",
            description: error instanceof Error ? error.message : "Failed to create swap orders",
            variant: "destructive",
            duration: 5000,
          });
        } finally {
          setIsLoading(false);
        }
      },
    },
    {
      title: "Monitor swaps",
      description: "Waiting for swaps to complete",
      action: async () => {
        // This step is passive - just waiting for the useEffect to monitor orders
      },
    },
    {
      title: "Add liquidity",
      description: "Add liquidity to pool",
      action: async () => {
        // Add liquidity logic here
        onClose();
      },
    },
  ];

  const switchNetworkStep = {
    title: "Switch Network",
    description: "Switch to the correct network",
    action: async () => {
      try {
        setIsLoading(true);
        await switchChain({ chainId: targetChainId });
        setCurrentStep(1);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error Switching Network",
          description: "Please switch your network manually",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    },
  };

  // When rendering Steps component, filter out skipped steps
  const filteredSteps = useMemo(() => {
    const steps = needsChainSwitch ? [switchNetworkStep, ...baseSteps] : baseSteps;
    return steps.filter((step: Step) => !step.shouldSkip || !step.shouldSkip());
  }, [needsChainSwitch, allowance, depositState.amount]);

  // Add safety check for currentStep
  const safeCurrentStep = Math.min(currentStep, filteredSteps.length - 1);
  const currentStepData = filteredSteps[safeCurrentStep];

  // Early return if no steps are available
  if (!filteredSteps.length) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Select a token</DialogTitle>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Select a token</h3>
          </div>
          <Steps steps={filteredSteps} currentStep={safeCurrentStep} />

          {currentStep === 2 && (
            <div className="space-y-2 text-sm">
              <div>Order 1 Status: {orderStatus0 || "Pending"}</div>
              <div>Order 2 Status: {orderStatus1 || "Pending"}</div>
            </div>
          )}

          <Button className="w-full" disabled={isLoading || currentStep === 2} onClick={() => currentStepData?.action()}>
            {isLoading ? "Processing..." : currentStep === 2 ? "Monitoring orders..." : currentStepData?.title || "Processing"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
