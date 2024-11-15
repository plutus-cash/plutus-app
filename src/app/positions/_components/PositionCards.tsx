import { HelpCircle } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";

interface Position {
  label: string;
  value: string;
  showHelp: boolean;
}

interface PositionCardsProps {
  positions: Position[];
}

export function PositionCards({ positions }: PositionCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {positions.map((position, index) => (
        <Card key={index} className="bg-muted">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{position.label}</span>
              {position.showHelp && <HelpCircle className="w-4 h-4 text-muted-foreground" />}
            </div>
            <div className="text-3xl font-bold mt-1">{position.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
