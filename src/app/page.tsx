import { DepositPanel } from "@/app/_components/DepositPanel";
import { SearchInput } from "@/app/_components/SearchInput";
import { PoolsData } from "@/app/_components/PoolsData";
import { PoolProvider } from "@/app/_context/PoolContext";

export default function YieldPage() {
  return (
    <PoolProvider>
      <div className="container mx-auto p-4 grid md:grid-cols-[1fr_400px] gap-4">
        <div className="space-y-4">
          <SearchInput />
          <PoolsData />
        </div>
        <DepositPanel />
      </div>
    </PoolProvider>
  );
}
