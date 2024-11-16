import { Layers } from "lucide-react";
import ArbitrumIcon from "@/assets/svg/arbitrum.svg";
import EthereumIcon from "@/assets/svg/ethereum.svg";
import OptimismIcon from "@/assets/svg/optimism.svg";
import BaseIcon from "@/assets/svg/base.svg";

export interface Token {
  symbol: string;
  address: string;
  name: string;
  balance: number;
  balanceUsd: number;
  decimals: number;
  icon?: string;
  chain?: string;
}
export interface Chain {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export const chains: Chain[] = [
  { id: "all", name: "All Chains", icon: <Layers /> },
  { id: "arbitrum", name: "Arbitrum", icon: <ArbitrumIcon /> },
  { id: "ethereum", name: "Ethereum", icon: <EthereumIcon /> },
  { id: "optimism", name: "Optimism", icon: <OptimismIcon /> },
  { id: "base", name: "Base", icon: <BaseIcon /> },
];

export interface TokenConfig {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
}

export const tokenConfigs: Record<string, Record<string, TokenConfig>> = {
  arbitrum: {
    USDC: {
      symbol: "USDC",
      name: "USD Coin",
      address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      decimals: 6,
    },
    USDT: {
      symbol: "USDT",
      name: "Tether USD",
      address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
      decimals: 6,
    },
    ETH: {
      symbol: "ETH",
      name: "Ethereum",
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
    },
  },
  base: {
    USDC: {
      symbol: "USDC",
      name: "USD Coin",
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      decimals: 6,
    },
    ETH: {
      symbol: "ETH",
      name: "Ethereum",
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
    },
    USDT: {
      symbol: "USDT",
      name: "Tether USD",
      address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
      decimals: 6,
    },
  },
  optimism: {
    USDC: {
      symbol: "USDC",
      name: "USD Coin",
      address: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
      decimals: 6,
    },
    ETH: {
      symbol: "ETH",
      name: "Ethereum",
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
    },
    USDT: {
      symbol: "USDT",
      name: "Tether USD",
      address: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
      decimals: 6,
    },
  },
};
