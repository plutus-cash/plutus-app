export interface Asset {
  name: string;
  tvl: string;
  rewards?: string;
  apr?: string;
  apy?: string;
  feeTier?: string;
}

export interface Token {
  id: string;
  symbol: string;
  address: string;
  chain?: string;
}

export interface Chain {
  id: string;
  name: string;
  icon?: string;
}

export interface Pool {
  address: string;
  token0: { id: string; symbol: string };
  token1: { id: string; symbol: string };
  tvl: string;
  feeTier: number;
  chain: string;
  rewards?: string;
  apr?: string;
  apy?: string;
}
