import { createCrossChainSwap } from "./crossChainSwap";

import { Pool } from "@/types";
import { WalletClient } from "viem";
// import { createFusionOrder } from "./oneInch";
import { CHAIN_ID } from "@/config";

interface DepositParams {
  pool: Pool;
  fromTokenAddress: string;
  amount: string;
  userAddress: string;
  userChain: string;
  walletClient?: WalletClient;
}

export async function createDepositOrders(params: DepositParams) {
  const { pool, fromTokenAddress, amount, userAddress, userChain, walletClient } = params;
  console.log("POOOL", pool, fromTokenAddress, amount, userAddress, userChain, walletClient);
  const amountPerToken = Number(amount) / 2;

  // If user is on the same chain as the pool, use regular swap
  // if (userChain === pool.chain) {
  //   const [order0, order1] = await Promise.all([
  //     createFusionOrder(fromTokenAddress, pool.token0.id, amountPerToken.toString(), Number(userChain), userAddress),
  //     createFusionOrder(fromTokenAddress, pool.token1.id, amountPerToken.toString(), Number(userChain), userAddress),
  //   ]);

  //   return { order0, order1 };
  // }

  console.log("walletClient", walletClient);
  // For cross-chain swaps, use Fusion+
  const [swap0, swap1] = await Promise.all([
    createCrossChainSwap({
      fromChain: Number(userChain),
      toChain: CHAIN_ID[pool.chain],
      fromTokenAddress,
      toTokenAddress: pool.token0.id,
      amount: amountPerToken.toString(),
      walletAddress: userAddress,
      walletClient,
    }),
    createCrossChainSwap({
      fromChain: Number(userChain),
      toChain: CHAIN_ID[pool.chain],
      fromTokenAddress,
      toTokenAddress: pool.token1.id,
      amount: amountPerToken.toString(),
      walletAddress: userAddress,
      walletClient,
    }),
  ]);

  return {
    order0: swap0.order,
    order1: swap1.order,
    secrets0: swap0.secrets,
    secrets1: swap1.secrets,
    secretHashes0: swap0.secretHashes,
    secretHashes1: swap1.secretHashes,
    monitorOrder0: swap0.monitorOrder,
    monitorOrder1: swap1.monitorOrder,
  };
}
