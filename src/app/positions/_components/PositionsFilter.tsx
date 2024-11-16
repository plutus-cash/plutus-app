import { Tabs, TabsTrigger, TabsList } from "@radix-ui/react-tabs";
import { Input } from "../../../components/ui/input";

export function PositionsFilter() {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="chains">Chains</TabsTrigger>
        </TabsList>
      </Tabs>
      <Input placeholder="Search assets..." className="max-w-sm   " />
    </div>
  );
}
