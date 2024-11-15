import { Button } from "../../../components/ui/button";
import { HelpCircle, LayoutDashboard, Settings } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";

export function PositionsTable() {
  return (
    <Card className="bg-muted">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Asset</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                Deposit
                <ArrowUpDown className="w-4 h-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                Daily Rewards
                <HelpCircle className="w-4 h-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                Earned
                <HelpCircle className="w-4 h-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                APR
                <HelpCircle className="w-4 h-4" />
              </div>
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-background" />
                  <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-background" />
                </div>
                <span>CLI-USDC/USDC+</span>
                <span className="px-2 py-1 text-xs rounded-full bg-secondary">0.01%</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="w-24 h-2 bg-secondary rounded-full">
                <div className="w-[1%] h-full bg-primary rounded-full" />
              </div>
            </TableCell>
            <TableCell>$31.00</TableCell>
            <TableCell>$0.01</TableCell>
            <TableCell>{"<$0.01"}</TableCell>
            <TableCell>13.32%</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <LayoutDashboard className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
}
