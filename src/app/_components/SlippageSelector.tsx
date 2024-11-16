"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SlippageSelectorProps {
  value: number;
  onChange: (value: string) => void;
}

const PRESET_VALUES = ["0.1", "0.5", "1.0", "3.0"];

export function SlippageSelector({ value, onChange }: SlippageSelectorProps) {
  return (
    <div>
      <label className="text-sm font-medium">Slippage (%)</label>
      <div className="flex items-center space-x-2 mt-2">
        {PRESET_VALUES.map((preset) => (
          <Button key={preset} variant={value === Number(preset) ? "default" : "outline"} size="sm" onClick={() => onChange(preset)}>
            {preset}
          </Button>
        ))}
        <Input className="w-20" placeholder="Custom" value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}
