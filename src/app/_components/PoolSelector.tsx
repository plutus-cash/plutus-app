"use client";

import { AssetTable } from "./AssetTable";
import { usePool } from "@/app/_context/PoolContext";

interface PoolSelectorProps {
  pools: Array<{
    name: string;
    tvl: string;
    feeTier: string;
    rewards?: string;
    apr?: string;
    apy?: string;
  }>;
}

export function PoolSelector({ pools }: PoolSelectorProps) {
  const { setSelectedPool } = usePool();

  return <AssetTable pools={pools} itemsPerPage={10} onSelectedPool={setSelectedPool} />;
}
