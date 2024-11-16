"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { getChainIcon } from "../_utils/ticks";
import { Pool } from "@/types";

interface AssetTableProps {
  pools: Pool[];
  itemsPerPage?: number;
  onSelectedPool?: (pool: Pool) => void;
  selectedPool?: Pool | null;
}

export function AssetTable({ pools, itemsPerPage = 10, onSelectedPool, selectedPool }: AssetTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(pools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPools = pools.slice(startIndex, endIndex);

  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Pool</TableHead>
              <TableHead className="w-[150px]">Chain</TableHead>
              <TableHead className="w-[200px]">TVL</TableHead>
              <TableHead className="w-[150px]">Fee Tier</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPools.map((pool, index) => (
              <TableRow
                key={`${pool.address}-${index}`}
                className={`hover:bg-muted/50 transition-colors cursor-pointer ${selectedPool?.address === pool.address ? "bg-muted" : ""}`}
                onClick={() => onSelectedPool?.(pool)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500 ring-2 ring-white" />
                      <div className="w-6 h-6 rounded-full bg-blue-500 ring-2 ring-white" />
                    </div>
                    <span>
                      {pool.token0.symbol}/{pool.token1.symbol}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="capitalize">
                  <div className="w-6 h-6">{getChainIcon(pool.chain)}</div>
                </TableCell>
                <TableCell>${formatNumber(Number(pool.tvl))}</TableCell>
                <TableCell>{(pool.feeTier / 10000).toFixed(2)}%</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="hover:bg-muted" aria-label="Download asset details">
                    <Download className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {currentPools.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No pools found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, pools.length)}</span> of{" "}
          <span className="font-medium">{pools.length}</span> entries
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1} className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages} className="gap-1">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
