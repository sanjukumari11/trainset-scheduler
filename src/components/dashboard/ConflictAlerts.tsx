import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConflictAlert } from "@/types/trainset";

interface ConflictAlertsProps {
  alerts: ConflictAlert[];
}

export function ConflictAlerts({ alerts }: ConflictAlertsProps) {
  const getSeverityIcon = (severity: ConflictAlert["severity"]) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "info":
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const getSeverityBadgeVariant = (severity: ConflictAlert["severity"]) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "warning":
        return "outline";
      case "info":
        return "secondary";
    }
  };

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Conflict Alerts</h2>
      <ScrollArea className="h-[400px]">
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
            >
              <div className="mt-0.5">{getSeverityIcon(alert.severity)}</div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{alert.rakeId}</span>
                  <Badge variant={getSeverityBadgeVariant(alert.severity)}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-foreground">{alert.message}</p>
                <p className="text-xs text-muted-foreground">
                  {alert.timestamp.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
