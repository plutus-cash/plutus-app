import { SUBGRAPH_URLS } from "@/config";
import { getBuiltGraphSDK } from "../../../.graphclient";
import { PoolSelector } from "./PoolSelector";

export async function PoolsData() {
  const data = [];
  for (const [, value] of Object.entries(SUBGRAPH_URLS)) {
    const apiKey = process.env.API_KEY ?? "";
    const sdk = getBuiltGraphSDK({ uniswapv3: value.replace("{api-key}", apiKey) });
    const pools = await sdk.GetAllPools();
    data.push(pools);
  }

  const formattedAssets = data.flatMap((chainData) =>
    chainData.pools.map((pool) => ({
      name: `${pool.token0.symbol}/${pool.token1.symbol}`,
      tvl: `$${Number(pool.totalValueLockedUSD).toLocaleString()}`,
      feeTier: `${Number(pool.feeTier) / 10000}%`,
      rewards: undefined,
      apr: undefined,
      apy: undefined,
    }))
  );

  return <PoolSelector pools={formattedAssets} />;
}
