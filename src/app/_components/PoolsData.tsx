import { SUBGRAPH_URLS } from "@/config";
import { getBuiltGraphSDK } from "../../../.graphclient";
import { PoolSelector } from "./PoolSelector";
import { usePoolStore } from "@/store/usePoolStore";

export async function PoolsData() {
  const data = [];
  for (const [key, value] of Object.entries(SUBGRAPH_URLS)) {
    const apiKey = process.env.API_KEY ?? "";
    const sdk = getBuiltGraphSDK({ uniswapv3: value.replace("{api-key}", apiKey) });
    const pools = await sdk.GetAllPools();
    data.push({ ...pools, chain: key });
  }

  const formattedAssets = data.flatMap((chainData) =>
    chainData.pools.map((pool) => ({
      address: pool.id,
      token0: { id: pool.token0.id, symbol: pool.token0.symbol },
      token1: { id: pool.token1.id, symbol: pool.token1.symbol },
      chain: chainData.chain,
      tvl: pool.totalValueLockedUSD,
      feeTier: pool.feeTier,
      rewards: undefined,
      apr: undefined,
      apy: undefined,
    }))
  );

  usePoolStore.getState().setPools(formattedAssets);
  return <PoolSelector pools={formattedAssets} />;
}
