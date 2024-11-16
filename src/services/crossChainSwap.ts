import { SDK, HashLock, PresetEnum, OrderStatus, BlockchainProviderConnector, EIP712TypedData } from "@1inch/cross-chain-sdk";
import { randomBytes } from "crypto";
import { WalletClient } from "viem";

interface CrossChainSwapParams {
  fromChain: number;
  toChain: number;
  fromTokenAddress: string;
  toTokenAddress: string;
  amount: string;
  walletAddress: string;
  walletClient?: WalletClient;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
class WalletClientConnector implements BlockchainProviderConnector {
  constructor(private walletClient: WalletClient) {}

  async signTypedData(walletAddress: string, typedData: EIP712TypedData): Promise<string> {
    try {
      const signature = await this.walletClient.signTypedData({
        account: walletAddress as `0x${string}`,
        domain: typedData.domain,
        types: typedData.types,
        primaryType: typedData.primaryType,
        message: typedData.message,
      });
      return signature;
    } catch (error) {
      console.error("Error signing typed data:", error);
      throw error;
    }
  }

  async ethCall(contractAddress: string, callData: string): Promise<string> {
    try {
      const result = await this.walletClient.transport.request({
        method: "eth_call",
        params: [
          {
            to: contractAddress as `0x${string}`,
            data: callData as `0x${string}`,
          },
          "latest",
        ],
      });

      if (!result) {
        throw new Error("Empty result from eth_call");
      }

      return result as string;
    } catch (error) {
      console.error("Error in eth_call:", error);
      throw error;
    }
  }
}

export async function createCrossChainSwap(params: CrossChainSwapParams) {
  const { fromChain, toChain, fromTokenAddress, toTokenAddress, amount, walletAddress, walletClient } = params;
  console.log(fromChain, toChain, fromTokenAddress, toTokenAddress, amount, walletAddress, walletClient);
  if (!fromChain || !toChain) {
    throw new Error("Unsupported chain");
  }

  if (!walletClient) {
    throw new Error("Wallet client is required");
  }

  const connector = new WalletClientConnector(walletClient);

  const sdk = new SDK({
    url: "/api/fusion",
    authKey: process.env.NEXT_PUBLIC_1INCH_API_KEY!,
    blockchainProvider: connector,
  });

  const quote = await sdk.getQuote({
    srcChainId: fromChain,
    dstChainId: toChain,
    srcTokenAddress: fromTokenAddress,
    dstTokenAddress: toTokenAddress,
    amount,
    enableEstimate: true,
    walletAddress,
  });

  const preset = PresetEnum.fast;

  const secrets = Array.from({
    length: quote.presets[preset].secretsCount,
  }).map(() => "0x" + randomBytes(32).toString("hex"));

  const hashLock = secrets.length === 1 ? HashLock.forSingleFill(secrets[0]) : HashLock.forMultipleFills(HashLock.getMerkleLeaves(secrets));

  const secretHashes = secrets.map((s) => HashLock.hashSecret(s));

  const { hash, quoteId, order } = await sdk.createOrder(quote, {
    walletAddress,
    hashLock,
    preset,
    source: "plutus-fusion",
    secretHashes,
  });

  await sdk.submitOrder(quote.srcChainId, order, quoteId, secretHashes);

  const monitorOrder = async () => {
    while (true) {
      const secretsToShare = await sdk.getReadyToAcceptSecretFills(hash);

      if (secretsToShare.fills.length) {
        for (const { idx } of secretsToShare.fills) {
          await sdk.submitSecret(hash, secrets[idx]);
        }
      }

      const { status } = await sdk.getOrderStatus(hash);

      if (status === OrderStatus.Executed || status === OrderStatus.Expired || status === OrderStatus.Refunded) {
        return status;
      }

      await sleep(1000);
    }
  };

  return {
    order,
    hash,
    secrets,
    secretHashes,
    monitorOrder,
  };
}
