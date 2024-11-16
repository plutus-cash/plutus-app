import { Chain, Token } from "@/types";
import { create } from "zustand";

interface TokenState {
  selectedToken: Token | null;
  selectedChain: Chain | null;
  searchQuery: string;
  setSelectedToken: (token: Token | null) => void;
  setSelectedChain: (chain: Chain | null) => void;
  setSearchQuery: (query: string) => void;
}

export const useTokenStore = create<TokenState>((set) => ({
  selectedToken: null,
  selectedChain: null,
  searchQuery: "",
  setSelectedToken: (token) => set({ selectedToken: token }),
  setSelectedChain: (chain) => set({ selectedChain: chain }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
