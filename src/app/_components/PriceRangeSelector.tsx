import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PriceRangeSelectorProps {
  minPrice: string;
  maxPrice: string;
  onPriceChange: (min: string, max: string) => void;
}

export function PriceRangeSelector({ minPrice, maxPrice, onPriceChange }: PriceRangeSelectorProps) {
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  useEffect(() => {
    setLocalMin(minPrice);
    setLocalMax(maxPrice);
  }, [minPrice, maxPrice]);

  const handleMinChange = (value: string) => {
    setLocalMin(value);
    onPriceChange(value, localMax);
  };

  const handleMaxChange = (value: string) => {
    setLocalMax(value);
    onPriceChange(localMin, value);
  };

  const adjustPrice = (field: "min" | "max", adjustment: number) => {
    const value = field === "min" ? localMin : localMax;
    const newValue = (parseFloat(value) + adjustment).toFixed(5);
    if (field === "min") {
      handleMinChange(newValue);
    } else {
      handleMaxChange(newValue);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Min price {localMin} (0%)</label>
        <div className="flex space-x-2">
          <Input value={localMin} onChange={(e) => handleMinChange(e.target.value)} type="number" step="0.00001" />
          <Button variant="outline" onClick={() => adjustPrice("min", -0.00001)}>
            -
          </Button>
          <Button variant="outline" onClick={() => adjustPrice("min", 0.00001)}>
            +
          </Button>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Max price {localMax} (0.01%)</label>
        <div className="flex space-x-2">
          <Input value={localMax} onChange={(e) => handleMaxChange(e.target.value)} type="number" step="0.00001" />
          <Button variant="outline" onClick={() => adjustPrice("max", -0.00001)}>
            -
          </Button>
          <Button variant="outline" onClick={() => adjustPrice("max", 0.00001)}>
            +
          </Button>
        </div>
      </div>
    </div>
  );
}
