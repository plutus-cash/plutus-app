import { useQuery } from "@tanstack/react-query";
import { fetchTokenBalances } from "@/app/_components/TokenSelector/balanceFetcher";
import { Token } from "@/app/_components/TokenSelector/constants";

export function useTokenBalances(address: string | undefined) {
  return useQuery<Token[]>({
    queryKey: ["tokenBalances", address],
    queryFn: () => fetchTokenBalances(address!),
    enabled: Boolean(address && address.startsWith("0x") && address.length === 42),
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
    refetchInterval: 60000, // Refetch every minute
  });
}
