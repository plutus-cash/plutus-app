import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, arbitrum, type AppKitNetwork, optimism, base } from "@reown/appkit/networks";

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const networks = [mainnet, arbitrum, optimism, base] as [AppKitNetwork, ...AppKitNetwork[]];

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;

// Subgraph Configuration
export const SUBGRAPH_URLS = {
  arbitrum: process.env.NEXT_PUBLIC_ARBITRUM_SUBGRAPH_URL ?? "",
  base: process.env.NEXT_PUBLIC_BASE_SUBGRAPH_URL ?? "",
} as const;

export const CHAIN_ID: Record<string, number> = {
  arbitrum: 42161,
  base: 8453,
  ethereum: 1,
  optimism: 10,
} as const;
