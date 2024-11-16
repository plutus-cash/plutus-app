"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";
import { SearchInput } from "./SearchInput";
import { ChainSelector } from "./ChainSelector";
import { TokenList } from "./TokenList";
import { getChainIcon } from "@/app/_utils/ticks";
import { useQuery } from "@tanstack/react-query";
import { fetchTokenBalances } from "./balanceFetcher";
import type { Token } from "./constants";
import { useTokenBalances } from "@/hooks/useTokenBalances";

interface TokenSelectorProps {
  userAddress: string;
  onSelect?: (token: Token) => void;
  selectedTokenAddress?: string;
}

export function TokenSelector({ userAddress, onSelect, selectedTokenAddress }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedChain, setSelectedChain] = useState("all");

  const { data: tokens, isLoading } = useTokenBalances(userAddress);

  const filteredTokens = tokens?.filter(
    (token) => (selectedChain === "all" || token.chain === selectedChain) && (token.name.toLowerCase().includes(search.toLowerCase()) || token.symbol.toLowerCase().includes(search.toLowerCase()))
  );

  const handleTokenSelect = (token: Token) => {
    onSelect?.(token);
    setIsOpen(false);
    setSearch("");
    setSelectedChain("all");
  };

  const selectedTokenData = tokens?.find((t) => t.address === selectedTokenAddress);

  return (
    <>
      <Button variant="outline" className="w-full justify-between" onClick={() => setIsOpen(true)}>
        {selectedTokenData ? (
          <div className="flex items-center gap-2">
            {getChainIcon(selectedTokenData.chain ?? "")}
            <span>{selectedTokenData.symbol}</span>
            <span className="text-sm text-muted-foreground">({selectedTokenData.balance.toFixed(4)})</span>
          </div>
        ) : (
          <span>Select a token</span>
        )}
        <ChevronDown className="w-4 h-4 opacity-50" />
      </Button>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setSearch("");
            setSelectedChain("all");
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Select a token</DialogTitle>
          <div className="space-y-4">
            <SearchInput value={search} onChange={setSearch} />

            <ChainSelector selectedChain={selectedChain} onChainChange={setSelectedChain} />

            {isLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-12 bg-muted rounded-lg" />
                <div className="h-12 bg-muted rounded-lg" />
              </div>
            ) : (
              <div>
                <h4 className="text-sm text-muted-foreground font-medium mb-2">Your tokens</h4>
                <TokenList tokens={filteredTokens || []} onSelect={handleTokenSelect} selectedTokenAddress={selectedTokenAddress} />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function isValidAddress(address: string): boolean {
  return address.startsWith("0x") && address.length === 42;
}
