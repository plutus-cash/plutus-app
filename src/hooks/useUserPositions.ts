import { useAccount, useReadContract } from "wagmi";

const POSITIONS_CONTRACT = "0x15806163De683Af2CAB832C940C24e5924F7332e";

const abi = [
  {
    type: "function",
    name: "getPositions",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [
      {
        type: "address",
        name: "owner",
      },
    ],
    outputs: [
      {
        type: "tuple[]",
        name: "result",
        components: [
          {
            type: "string",
            name: "platform",
          },
          {
            type: "uint256",
            name: "tokenId",
          },
          {
            type: "address",
            name: "poolId",
          },
          {
            type: "address",
            name: "token0",
          },
          {
            type: "address",
            name: "token1",
          },
          {
            type: "uint256",
            name: "decimals0",
          },
          {
            type: "uint256",
            name: "decimals1",
          },
          {
            type: "string",
            name: "symbol0",
          },
          {
            type: "string",
            name: "symbol1",
          },
          {
            type: "uint256",
            name: "amount0",
          },
          {
            type: "uint256",
            name: "amount1",
          },
          {
            type: "uint256",
            name: "fee0",
          },
          {
            type: "uint256",
            name: "fee1",
          },
          {
            type: "uint256",
            name: "emissions",
          },
          {
            type: "int24",
            name: "tickLower",
          },
          {
            type: "int24",
            name: "tickUpper",
          },
          {
            type: "int24",
            name: "currentTick",
          },
          {
            type: "bool",
            name: "isStaked",
          },
        ],
      },
    ],
  },
] as const;

export interface Position {
  platform: string;
  tokenId: bigint;
  poolId: string;
  token0: string;
  token1: string;
  amount0: bigint;
  amount1: bigint;
  fee0: bigint;
  fee1: bigint;
  emissions: bigint;
  tickLower: number;
  tickUpper: number;
  currentTick: number;
  isStaked: boolean;
}

export function useUserPositions() {
  const { address } = useAccount();

  const { data, isError, isLoading, error } = useReadContract({
    address: POSITIONS_CONTRACT,
    abi,
    functionName: "getPositions",
    args: address ? [address] : undefined,
    chainId: 42161,
  });

  return {
    positions:
      !isError && data
        ? data.map((position) => ({
            ...position,
            chainId: "Arbitrum",
          }))
        : [],
    isError,
    isLoading,
    error,
  };
}
