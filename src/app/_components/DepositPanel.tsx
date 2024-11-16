"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SlippageSelector } from "./SlippageSelector";
import { TICK_SPACINGS, priceToTick, nearestUsableTick } from "@/app/_utils/ticks";
import { PriceRangeSelector } from "./PriceRangeSelector";
import { TokenSelector } from "./TokenSelector";
import { useAccount } from "wagmi";
import { usePoolStore } from "@/store/usePoolStore";
import { Pool } from "@/types";
import { DepositFlowModal } from "./DepositFlow/DepositFlowModal";
import { useTokenBalances } from "@/hooks/useTokenBalances";

export interface DepositState {
  pool: Pool | undefined;
  token: string;
  decimals: number;
  tokenAddress: string;
  amount: string;
  chain: string;
  minPrice: string;
  maxPrice: string;
  tickLower: number;
  tickUpper: number;
  slippage: number;
  balance?: string;
}

const initialState: DepositState = {
  pool: undefined,
  token: "",
  tokenAddress: "",
  decimals: 18,
  amount: "",
  chain: "",
  minPrice: "0.9999",
  maxPrice: "1.0",
  tickLower: 0,
  tickUpper: 0,
  slippage: 0.5,
};

export function DepositPanel() {
  const selectedPool = usePoolStore((state) => state.selectedPool);
  const [depositState, setDepositState] = useState<DepositState>(initialState);
  const { address: userAddress, isConnected } = useAccount();
  const [isDepositFlowOpen, setIsDepositFlowOpen] = useState(false);
  const { data: tokens } = useTokenBalances(userAddress);

  useEffect(() => {
    if (selectedPool) {
      setDepositState((prev) => ({
        ...prev,
        pool: selectedPool,
      }));
    }
  }, [selectedPool]);

  const handleInputChange = useCallback((field: keyof DepositState, value: string | number) => {
    setDepositState((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handlePriceRangeChange = useCallback(
    (min: string, max: string) => {
      const feeTier = depositState.pool?.feeTier ?? 3000;
      const tickLower = nearestUsableTick(priceToTick(min), TICK_SPACINGS[feeTier]);
      const tickUpper = nearestUsableTick(priceToTick(max), TICK_SPACINGS[feeTier]);

      setDepositState((prev) => ({
        ...prev,
        minPrice: min,
        maxPrice: max,
        tickLower,
        tickUpper,
      }));
    },
    [depositState.pool?.feeTier]
  );

  const selectedToken = useMemo(() => {
    if (!tokens || !depositState.tokenAddress || !depositState.chain) return null;
    return tokens.find((token) => token.address.toLowerCase() === depositState.tokenAddress.toLowerCase() && token.chain === depositState.chain);
  }, [tokens, depositState.tokenAddress, depositState.chain]);

  const handleMaxAmount = useCallback(() => {
    if (!selectedToken) return;
    handleInputChange("amount", selectedToken.balance.toString());
  }, [selectedToken, handleInputChange]);

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {!depositState.pool ? (
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Select a pool</h3>
            <Button variant="outline" size="sm">
              View farm
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 ring-2 ring-white" />
                  <div className="w-6 h-6 rounded-full bg-blue-500 ring-2 ring-white" />
                </div>
                <div className="font-medium">
                  {depositState.pool.token0.symbol}/{depositState.pool.token1.symbol}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Select token</label>
                {isConnected && userAddress ? (
                  <TokenSelector
                    userAddress={userAddress}
                    selectedTokenAddress={depositState.tokenAddress}
                    onSelect={(token) => {
                      handleInputChange("token", token.symbol);
                      handleInputChange("tokenAddress", token.address);
                      handleInputChange("chain", token.chain ?? "");
                      handleInputChange("decimals", token.decimals);
                    }}
                  />
                ) : (
                  <div className="p-4 text-center text-gray-500">Please connect your wallet to view tokens</div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">{depositState.token || "Token"} amount</label>
                  <label className="text-sm text-gray-500">Balance: {selectedToken ? Number(selectedToken.balance).toFixed(4) : "0"}</label>
                </div>
                <div className="flex space-x-2">
                  <Input type="number" placeholder="0.00" value={depositState.amount} onChange={(e) => handleInputChange("amount", e.target.value)} className="flex-1" />
                  <Button variant="outline" size="sm" className="whitespace-nowrap" onClick={handleMaxAmount}>
                    MAX
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <PriceRangeSelector minPrice={depositState.minPrice} maxPrice={depositState.maxPrice} onPriceChange={handlePriceRangeChange} />

              <SlippageSelector value={depositState.slippage} onChange={(value) => handleInputChange("slippage", value)} />

              <Button className="w-full" onClick={() => setIsDepositFlowOpen(true)}>
                Deposit
              </Button>
            </div>
          </>
        )}
      </CardContent>
      <DepositFlowModal isOpen={isDepositFlowOpen} onClose={() => setIsDepositFlowOpen(false)} depositState={depositState} />
    </Card>
  );
}
