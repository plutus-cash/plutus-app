"use client";

import { AssetTable } from "./AssetTable";
import { usePoolStore } from "@/store/usePoolStore";
import type { Pool } from "@/types";

interface PoolSelectorProps {
  pools: Array<Pool>;
}

export function PoolSelector({ pools }: PoolSelectorProps) {
  const setSelectedPool = usePoolStore((state) => state.setSelectedPool);

  return <AssetTable pools={pools} itemsPerPage={10} onSelectedPool={setSelectedPool} />;
}
