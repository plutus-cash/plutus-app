import { chains } from "../_components/TokenSelector/constants";

// Constants from Uniswap v3 SDK
const MIN_TICK = -887272;
const MAX_TICK = 887272;

export const TICK_SPACINGS: { [amount: number]: number } = {
  100: 1,
  500: 10,
  3000: 60,
  10000: 200,
};

export function priceToTick(price: string): number {
  return Math.floor(Math.log(parseFloat(price)) / Math.log(1.0001));
}

export function tickToPrice(tick: number): string {
  return (1.0001 ** tick).toFixed(5);
}

export function nearestUsableTick(tick: number, tickSpacing: number): number {
  const rounded = Math.round(tick / tickSpacing) * tickSpacing;
  if (rounded < MIN_TICK) return MIN_TICK;
  if (rounded > MAX_TICK) return MAX_TICK;
  return rounded;
}

export function getChainIcon(chain: string): React.ReactNode {
  return chains.find((c) => c.id.toLowerCase() === chain.toLowerCase())?.icon;
}
