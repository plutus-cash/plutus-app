"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface Pool {
  name: string;
  tvl: string;
  feeTier: string;
  rewards?: string;
  apr?: string;
  apy?: string;
}

interface PoolContextType {
  selectedPool: Pool | null;
  setSelectedPool: (pool: Pool | null) => void;
}

const PoolContext = createContext<PoolContextType | undefined>(undefined);

export function PoolProvider({ children }: { children: ReactNode }) {
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);

  return <PoolContext.Provider value={{ selectedPool, setSelectedPool }}>{children}</PoolContext.Provider>;
}

export function usePool() {
  const context = useContext(PoolContext);
  if (context === undefined) {
    throw new Error("usePool must be used within a PoolProvider");
  }
  return context;
}
