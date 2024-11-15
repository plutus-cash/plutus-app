import { PositionCards } from "@/app/positions/_components/PositionCards";
import { PositionsFilter } from "@/app/positions/_components/PositionsFilter";
import { PositionsTable } from "@/app/positions/_components/PositionsTable";

export default function PositionsPage() {
  const positions = [
    { label: "Total Deposits", value: "$31.00", showHelp: false },
    { label: "Earned", value: "<$0.01", showHelp: false },
    { label: "Daily Rewards", value: "$0.01", showHelp: true },
    { label: "APR", value: "13.32%", showHelp: true },
  ];

  return (
    <div className="container mx-auto p-4 bg-background space-y-6">
      <PositionCards positions={positions} />
      <PositionsFilter />
      <PositionsTable />
    </div>
  );
}
