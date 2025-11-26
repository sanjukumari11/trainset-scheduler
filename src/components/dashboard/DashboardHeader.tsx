import { Train, Calendar, Clock, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface DashboardHeaderProps {
  onExport?: () => void;
  onImport?: () => void;
}

export function DashboardHeader({ onExport, onImport }: DashboardHeaderProps) {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(
        now.toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Train className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">KMRL Trainset Induction Planner</h1>
              <p className="text-sm text-muted-foreground">Operations Control Center</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground">{currentDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground">{currentTime}</span>
            </div>
            {onImport && (
              <Button variant="outline" size="sm" onClick={onImport} className="gap-2">
                <Upload className="h-4 w-4" />
                Import CSV
              </Button>
            )}
            {onExport && (
              <Button variant="default" size="sm" onClick={onExport} className="gap-2">
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
