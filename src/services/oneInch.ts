import { FusionSDK } from "@1inch/fusion-sdk";

export async function createFusionOrder(fromTokenAddress: string, toTokenAddress: string, amount: string, fromChain: number, walletAddress: string) {
  if (!fromChain) throw new Error("Unsupported chain");

  const sdk = new FusionSDK({
    url: "https://fusion.1inch.io",
    network: fromChain,
    authKey: process.env.NEXT_PUBLIC_1INCH_API_KEY,
  });

  const order = await sdk.createOrder({
    fromTokenAddress,
    toTokenAddress,
    amount,
    walletAddress,
  });

  return order;
}

export async function getQuote(fromTokenAddress: string, toTokenAddress: string, amount: string, chain: string) {
  const response = await fetch(
    `https://api.1inch.io/v5.0/${chain}/quote?` +
      new URLSearchParams({
        fromTokenAddress,
        toTokenAddress,
        amount,
      })
  );

  return response.json();
}
