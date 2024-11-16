"use client";

import { useEffect, useState } from "react";
import { HelpCircle, ArrowUpDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUserPositions } from "@/hooks/useUserPositions";
import { fetchTokenPrices } from "@/app/_components/TokenSelector/priceFetcher";

const TABLE_HEADERS = [
  { label: "Chain", icon: null },
  { label: "Pool name", icon: null },
  { label: "Position size", icon: <ArrowUpDown className="w-4 h-4" /> },
  { label: "Earned", icon: <HelpCircle className="w-4 h-4" /> },
  { label: "Stake status", icon: null },
  { label: "Platform", icon: null },
] as const;

interface TokenPrices {
  [chain: string]: {
    [address: string]: number;
  };
}

export function PositionsTable() {
  const { positions, isLoading: positionsLoading, isError } = useUserPositions();
  const [tokenPrices, setTokenPrices] = useState<TokenPrices>({});
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);

  // Fetch prices when positions change
  useEffect(() => {
    const fetchPrices = async () => {
      setIsLoadingPrices(true);
      try {
        const prices = await fetchTokenPrices();
        setTokenPrices(prices);
      } catch (error) {
        console.error("Error fetching token prices:", error);
      }
      setIsLoadingPrices(false);
    };

    fetchPrices();
  }, []);

  const getTokenValue = (tokenAddress: string, amount: bigint, chainId: string) => {
    const price = tokenPrices[chainId]?.[tokenAddress.toLowerCase()] ?? 0;
    return (Number(amount) / 1e18) * price; // Assuming 18 decimals
  };

  // Check loading states
  const isLoading = positionsLoading || isLoadingPrices;
  const hasError = isError;

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">Loading positions...</div>
      </Card>
    );
  }

  if (hasError) {
    return (
      <Card className="p-6">
        <div className="text-center text-destructive">Error loading positions</div>
      </Card>
    );
  }

  // Combine positions from all chains
  const allPositions = positions?.flatMap((position) => ({
    ...position,
    chainId: position.chainId,
  }));

  return (
    <Card className="">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {TABLE_HEADERS.map(({ label, icon }) => (
              <TableHead key={label}>
                <div className="flex items-center gap-1">
                  {label}
                  {icon}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {allPositions?.map((position, index) => (
            <TableRow key={`${position.tokenId}-${index}`}>
              <TableCell className="capitalize">{position.chainId}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-background" />
                    <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-background" />
                  </div>
                  <span className="text-xs font-mono">
                    {position.symbol0}/{position.symbol1}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    ${formatCurrency(getTokenValue(position.token0, position.amount0, position.chainId) + getTokenValue(position.token1, position.amount1, position.chainId))}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    ${formatCurrency(getTokenValue(position.token0, position.fee0, position.chainId) + getTokenValue(position.token1, position.fee1, position.chainId))}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 text-xs rounded-full ${position.isStaked ? "bg-green-500/20 text-green-600" : "bg-red-500/20 text-red-600"}`}>
                  {position.isStaked ? "Staked" : "Unstaked"}
                </span>
              </TableCell>
              <TableCell>{position.platform}</TableCell>
            </TableRow>
          ))}
          {allPositions?.length === 0 && (
            <TableRow>
              <TableCell colSpan={TABLE_HEADERS.length} className="text-center py-6 text-muted-foreground">
                No positions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
