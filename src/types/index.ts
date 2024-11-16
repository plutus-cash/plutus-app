export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logo: string;
  balance: string;
}

export interface Chain {
  id: number;
  name: string;
  rpcUrl: string;
}
