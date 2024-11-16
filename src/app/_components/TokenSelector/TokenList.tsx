import { cn } from "@/lib/utils";
import { Token } from "./constants";

interface TokenListProps {
  tokens: Token[];
  onSelect: (token: Token) => void;
  selectedTokenAddress?: string;
}

export function TokenList({ tokens, onSelect, selectedTokenAddress }: TokenListProps) {
  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto">
      {tokens.map((token) => {
        const isSelected = token.address === selectedTokenAddress;

        return (
          <button
            key={`${token.address}-${token.chain}`}
            className={cn("w-full flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg transition-colors", isSelected && "bg-gray-100")}
            onClick={() => onSelect(token)}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500" />
              <div className="text-left">
                <div className="font-medium">{token.name}</div>
                <div className="text-sm text-gray-500">
                  {token.symbol}
                  {token.chain && <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 rounded-full">{token.chain}</span>}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">${token.balanceUsd.toFixed(2)}</div>
              <div className="text-sm text-gray-500">{token.balance.toFixed(5)}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
