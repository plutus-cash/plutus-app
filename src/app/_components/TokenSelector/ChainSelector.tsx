import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { chains } from "./constants";

interface ChainSelectorProps {
  selectedChain: string;
  onChainChange: (chain: string) => void;
}

export function ChainSelector({ selectedChain, onChainChange }: ChainSelectorProps) {
  return (
    <Tabs defaultValue="all" value={selectedChain} onValueChange={onChainChange}>
      <TabsList className="w-full h-auto flex flex-wrap gap-2 bg-transparent">
        {chains.map((chain) => (
          <TabsTrigger key={chain.id} value={chain.id} className="px-3 py-1 data-[state=active]:bg-primary/10 rounded-full">
            {chain.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
