import { create } from "zustand";
import type { Pool } from "@/types";

interface PoolState {
  selectedPool: Pool | null;
  pools: Pool[];
  setSelectedPool: (pool: Pool | null) => void;
  setPools: (pools: Pool[]) => void;
}

export const usePoolStore = create<PoolState>((set) => ({
  selectedPool: null,
  pools: [],
  setSelectedPool: (pool) => set({ selectedPool: pool }),
  setPools: (pools) => set({ pools }),
}));
