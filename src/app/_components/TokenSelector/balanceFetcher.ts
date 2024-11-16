import { createPublicClient, http, formatUnits, Chain, PublicClient } from "viem";
import { arbitrum, mainnet, optimism, base } from "viem/chains";
import { tokenConfigs, type Token } from "./constants";
import { fetchTokenPrices } from "./priceFetcher";

const BATCH_SIZE = 50; // Number of tokens to fetch in parallel

const erc20Abi = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

const chainConfigs: Record<string, { chain: Chain; client?: PublicClient }> = {
  arbitrum: {
    chain: arbitrum,
  },
  ethereum: {
    chain: mainnet,
  },
  optimism: {
    chain: optimism,
  },
  base: {
    chain: base,
  },
};

// Initialize clients
Object.entries(chainConfigs).forEach(([chainId, config]) => {
  config.client = createPublicClient({
    chain: config.chain,
    transport: http(),
  });
});

export async function fetchTokenBalances(address: string): Promise<Token[]> {
  if (!address?.startsWith("0x") || address.length !== 42) {
    throw new Error("Invalid Ethereum address format");
  }

  const formattedAddress = address as `0x${string}`;
  const prices = await fetchTokenPrices();
  const balances: Token[] = [];

  // Process chains in parallel
  await Promise.all(
    Object.entries(tokenConfigs).map(async ([chain, chainTokens]) => {
      const client = chainConfigs[chain]?.client;
      if (!client) return;

      // Process tokens in batches
      const tokenEntries = Object.entries(chainTokens);
      for (let i = 0; i < tokenEntries.length; i += BATCH_SIZE) {
        const batch = tokenEntries.slice(i, i + BATCH_SIZE);

        await Promise.all(
          batch.map(async ([_, tokenConfig]) => {
            try {
              const price = prices[chain]?.[tokenConfig.address] ?? 0;
              const balance =
                tokenConfig.symbol === "ETH"
                  ? await client.getBalance({ address: formattedAddress })
                  : await client.readContract({
                      address: tokenConfig.address as `0x${string}`,
                      abi: erc20Abi,
                      functionName: "balanceOf",
                      args: [formattedAddress],
                    });

              const formattedBalance = Number(formatUnits(balance, tokenConfig.decimals));

              if (formattedBalance > 0) {
                balances.push({
                  symbol: tokenConfig.symbol,
                  name: tokenConfig.name,
                  balance: formattedBalance,
                  balanceUsd: formattedBalance * price,
                  chain,
                  address: tokenConfig.address as `0x${string}`,
                  decimals: tokenConfig.decimals,
                });
              }
            } catch (error) {
              console.error(`Error fetching balance for ${tokenConfig.symbol} on ${chain}:`, error);
            }
          })
        );
      }
    })
  );

  return balances.sort((a, b) => b.balanceUsd - a.balanceUsd);
}
