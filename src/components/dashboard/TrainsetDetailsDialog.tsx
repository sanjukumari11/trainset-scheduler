import { CheckCircle2, XCircle, AlertTriangle, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Trainset } from "@/types/trainset";

interface TrainsetDetailsDialogProps {
  trainset: Trainset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TrainsetDetailsDialog({ trainset, open, onOpenChange }: TrainsetDetailsDialogProps) {
  if (!trainset) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  const getStatusIcon = (status: string) => {
    if (status === "valid" || status === "completed" || status === "closed") {
      return <CheckCircle2 className="h-4 w-4 text-success" />;
    }
    if (status === "expiring" || status === "pending") {
      return <AlertTriangle className="h-4 w-4 text-warning" />;
    }
    return <XCircle className="h-4 w-4 text-destructive" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{trainset.rakeId} - Detailed Analysis</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Overall Service Readiness</span>
              <span className={`text-3xl font-bold ${getScoreColor(trainset.serviceReadiness.overall)}`}>
                {trainset.serviceReadiness.overall}%
              </span>
            </div>
            <Progress value={trainset.serviceReadiness.overall} className="h-3" />
          </div>

          <Separator />

          {/* Component Scores */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-foreground">Component Scores</h3>
            <div className="grid gap-3">
              {Object.entries(trainset.serviceReadiness)
                .filter(([key]) => key !== "overall")
                .map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className="w-24 text-sm capitalize text-muted-foreground">{key}</span>
                    <Progress value={value} className="flex-1" />
                    <span className={`w-12 text-right font-semibold ${getScoreColor(value)}`}>
                      {value}%
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <Separator />

          {/* Fitness Certificates */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-foreground">Fitness Certificates</h3>
            <div className="space-y-2">
              {trainset.fitnessCertificates.map((cert, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(cert.status)}
                    <span className="font-medium text-foreground">{cert.type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      Valid until: {cert.validTo.toLocaleDateString("en-IN")}
                    </span>
                    <Badge variant={cert.status === "valid" ? "default" : "destructive"}>
                      {cert.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Job Cards */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-foreground">Job Cards</h3>
            {trainset.jobCards.length === 0 ? (
              <div className="flex items-center gap-2 rounded-lg bg-success/10 p-3 text-success">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">No open job cards</span>
              </div>
            ) : (
              <div className="space-y-2">
                {trainset.jobCards.map((job) => (
                  <div key={job.id} className="rounded-lg bg-muted/30 p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{job.id}</span>
                      <Badge
                        variant={
                          job.severity === "critical"
                            ? "destructive"
                            : job.severity === "major"
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {job.severity}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{job.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Branding & Mileage */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold text-foreground">Branding Exposure</h3>
              <div className="space-y-2 rounded-lg bg-muted/30 p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Brand</span>
                  <span className="font-semibold text-foreground">{trainset.branding.brandId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Delivered</span>
                  <span className="font-semibold text-foreground">
                    {trainset.branding.deliveredHours}h / {trainset.branding.requiredHours}h
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Priority</span>
                  <Badge>{trainset.branding.priority}</Badge>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold text-foreground">Mileage Balance</h3>
              <div className="space-y-2 rounded-lg bg-muted/30 p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Daily KM</span>
                  <span className="font-semibold text-foreground">{trainset.mileage.dailyKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Target KM</span>
                  <span className="font-semibold text-foreground">{trainset.mileage.targetKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Deviation</span>
                  <span
                    className={`font-semibold ${
                      Math.abs(trainset.mileage.deviation) > 50 ? "text-warning" : "text-success"
                    }`}
                  >
                    {trainset.mileage.deviation > 0 ? "+" : ""}
                    {trainset.mileage.deviation} km
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Stabling & Cleaning */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold text-foreground">Stabling Position</h3>
              <div className="space-y-2 rounded-lg bg-muted/30 p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Bay</span>
                  <span className="font-semibold text-foreground">{trainset.stabling.bayId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Shunting</span>
                  <Badge>{trainset.stabling.shuntingDifficulty}</Badge>
                </div>
                {trainset.stabling.constraints.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-muted-foreground">Constraints:</span>
                    <p className="text-sm text-foreground">{trainset.stabling.constraints.join(", ")}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold text-foreground">Cleaning Status</h3>
              <div className="space-y-2 rounded-lg bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(trainset.cleaning.status)}
                    <span className="font-semibold capitalize text-foreground">{trainset.cleaning.status}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Cleaned</span>
                  <span className="text-sm text-foreground">
                    {trainset.cleaning.lastCleaned.toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Conflicts */}
          {trainset.conflicts.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">Active Conflicts</h3>
                <div className="space-y-2">
                  {trainset.conflicts.map((conflict, idx) => (
                    <div key={idx} className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3">
                      <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
                      <p className="text-sm text-destructive">{conflict}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
