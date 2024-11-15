"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ChevronDown } from "lucide-react";
import { SlippageSelector } from "./SlippageSelector";
import { usePool } from "@/app/_context/PoolContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface DepositState {
  asset: string;
  amount: string;
  minPrice: string;
  maxPrice: string;
  autoRebalance: boolean;
  autoRewards: boolean;
  slippage: string;
}

interface Token {
  symbol: string;
  color: string;
}

const popularTokens: Token[] = [
  { symbol: "USDC", color: "bg-blue-500" },
  { symbol: "USDT", color: "bg-green-500" },
  { symbol: "DAI", color: "bg-yellow-500" },
  { symbol: "WETH", color: "bg-purple-500" },
  { symbol: "WBTC", color: "bg-orange-500" },
];

export function DepositPanel() {
  const { selectedPool } = usePool();
  const [state, setState] = useState<DepositState | undefined>(undefined);

  useEffect(() => {
    if (selectedPool) {
      setState({
        asset: selectedPool.name,
        amount: "",
        minPrice: "0.99990",
        maxPrice: "1.00000",
        autoRebalance: false,
        autoRewards: false,
        slippage: "0.5",
      });
    }
  }, [selectedPool]);

  const handleInputChange = useCallback((field: keyof DepositState, value: string | boolean) => {
    setState((prev) => prev && { ...prev, [field]: value });
  }, []);

  if (!state) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Please select a pool first</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{selectedPool?.name ?? "Select a pool"}</h3>
          <Button variant="outline" size="sm">
            View farm
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Token to send</label>
            <div className="flex items-center mt-2 space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center">
                      <span className={`w-6 h-6 rounded-full ${popularTokens.find((t) => t.symbol === state.asset)?.color || "bg-gray-500"} mr-2`} />
                      USDC
                    </span>
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                  {popularTokens.map((token) => (
                    <DropdownMenuItem key={token.symbol} onClick={() => handleInputChange("asset", token.symbol)} className="cursor-pointer">
                      <span className="flex items-center">
                        <span className={`w-6 h-6 rounded-full ${token.color} mr-2`} />
                        {token.symbol}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Input placeholder="0" value={state.amount} onChange={(e) => handleInputChange("amount", e.target.value)} />
              <Button variant="outline" size="sm">
                MAX
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Automate Rebalancing</label>
              <Switch checked={state.autoRebalance} onCheckedChange={(checked) => handleInputChange("autoRebalance", checked)} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Automate Rewards</label>
              <Switch checked={state.autoRewards} onCheckedChange={(checked) => handleInputChange("autoRewards", checked)} />
            </div>
          </div>

          <SlippageSelector value={state.slippage} onChange={(value) => handleInputChange("slippage", value)} />

          <Button className="w-full">Deposit</Button>
        </div>
      </CardContent>
    </Card>
  );
}
