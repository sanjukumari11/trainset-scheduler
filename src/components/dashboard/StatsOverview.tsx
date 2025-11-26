import { CheckCircle2, AlertTriangle, XCircle, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatsOverviewProps {
  readyCount: number;
  suboptimalCount: number;
  blockedCount: number;
  totalCount: number;
}

export function StatsOverview({ readyCount, suboptimalCount, blockedCount, totalCount }: StatsOverviewProps) {
  const stats = [
    {
      label: "Ready for Service",
      value: readyCount,
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Suboptimal",
      value: suboptimalCount,
      icon: AlertTriangle,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      label: "Blocked",
      value: blockedCount,
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      label: "Total Fleet",
      value: totalCount,
      icon: Activity,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
