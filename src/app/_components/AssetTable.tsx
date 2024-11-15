"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Pool } from "@/app/_context/PoolContext";

interface AssetTableProps {
  pools: Pool[];
  itemsPerPage?: number;
  onSelectedPool?: (pool: Pool) => void;
}

export function AssetTable({ pools, itemsPerPage = 10, onSelectedPool }: AssetTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(pools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPools = pools.slice(startIndex, endIndex);

  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Asset</TableHead>
              <TableHead className="w-[200px]">TVL</TableHead>
              <TableHead className="w-[150px]">Fee Tier</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPools.map((pool, index) => (
              <TableRow key={`${pool.name}-${index}`} className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => onSelectedPool?.(pool)}>
                <TableCell className="font-medium">{pool.name.length > 20 ? `${pool.name.slice(0, 20)}...` : pool.name}</TableCell>
                <TableCell>{pool.tvl.length > 20 ? `${pool.tvl.slice(0, 20)}...` : pool.tvl}</TableCell>
                <TableCell>{pool.feeTier && pool.feeTier.length > 20 ? `${pool.feeTier.slice(0, 20)}...` : pool.feeTier}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="hover:bg-muted" aria-label="Download asset details">
                    <Download className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {currentPools.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
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
