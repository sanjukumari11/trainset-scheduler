import { CheckCircle2, AlertTriangle, XCircle, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trainset } from "@/types/trainset";

interface TrainsetCardProps {
  trainset: Trainset;
  onClick: () => void;
}

export function TrainsetCard({ trainset, onClick }: TrainsetCardProps) {
  const getStatusIcon = () => {
    switch (trainset.serviceStatus) {
      case "ready":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "suboptimal":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "blocked":
        return <XCircle className="h-5 w-5 text-destructive" />;
    }
  };

  const getStatusBadge = () => {
    switch (trainset.serviceStatus) {
      case "ready":
        return <Badge className="bg-success text-success-foreground">Ready</Badge>;
      case "suboptimal":
        return <Badge className="bg-warning text-warning-foreground">Suboptimal</Badge>;
      case "blocked":
        return <Badge className="bg-destructive text-destructive-foreground">Blocked</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  return (
    <Card className="p-6 transition-all hover:shadow-lg">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <h3 className="text-xl font-bold text-foreground">{trainset.rakeId}</h3>
              <p className="text-sm text-muted-foreground">Bay {trainset.currentBay}</p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Service Readiness</span>
            <span className={`text-2xl font-bold ${getScoreColor(trainset.serviceReadiness.overall)}`}>
              {trainset.serviceReadiness.overall}%
            </span>
          </div>
          <Progress value={trainset.serviceReadiness.overall} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">Branding</p>
            <p className="font-semibold text-foreground">{trainset.brandingTag}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Daily KM</p>
            <p className="font-semibold text-foreground">{trainset.mileage.dailyKm}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Open Jobs</p>
            <p className="font-semibold text-foreground">{trainset.jobCards.length}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Next Maint.</p>
            <p className="font-semibold text-foreground">
              {trainset.nextMaintenance.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
            </p>
          </div>
        </div>

        {trainset.conflicts.length > 0 && (
          <div className="rounded-md bg-destructive/10 p-3">
            <p className="text-xs font-medium text-destructive">{trainset.conflicts[0]}</p>
          </div>
        )}

        <Button variant="outline" className="w-full" onClick={onClick}>
          View Details
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
