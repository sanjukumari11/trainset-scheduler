import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { ConflictAlerts } from "@/components/dashboard/ConflictAlerts";
import { TrainsetCard } from "@/components/dashboard/TrainsetCard";
import { TrainsetDetailsDialog } from "@/components/dashboard/TrainsetDetailsDialog";
import { WhatIfSimulator } from "@/components/dashboard/WhatIfSimulator";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { mockTrainsets, mockConflictAlerts } from "@/data/mockTrainsets";
import { Trainset } from "@/types/trainset";

const Index = () => {
  const [selectedTrainset, setSelectedTrainset] = useState<Trainset | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [brandingFilter, setBrandingFilter] = useState("all");

  const handleTrainsetClick = (trainset: Trainset) => {
    setSelectedTrainset(trainset);
    setDialogOpen(true);
  };

  const filteredTrainsets = mockTrainsets.filter((trainset) => {
    const matchesSearch = trainset.rakeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || trainset.serviceStatus === statusFilter;
    const matchesBranding = brandingFilter === "all" || trainset.brandingTag === brandingFilter;
    return matchesSearch && matchesStatus && matchesBranding;
  });

  const readyCount = mockTrainsets.filter((t) => t.serviceStatus === "ready").length;
  const suboptimalCount = mockTrainsets.filter((t) => t.serviceStatus === "suboptimal").length;
  const blockedCount = mockTrainsets.filter((t) => t.serviceStatus === "blocked").length;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          <StatsOverview
            readyCount={readyCount}
            suboptimalCount={suboptimalCount}
            blockedCount={blockedCount}
            totalCount={mockTrainsets.length}
          />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <FilterPanel
                onSearchChange={setSearchQuery}
                onStatusFilter={setStatusFilter}
                onBrandingFilter={setBrandingFilter}
              />

              <div>
                <h2 className="mb-4 text-xl font-semibold text-foreground">
                  Trainset Fleet Overview
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredTrainsets.map((trainset) => (
                    <TrainsetCard
                      key={trainset.rakeId}
                      trainset={trainset}
                      onClick={() => handleTrainsetClick(trainset)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <ConflictAlerts alerts={mockConflictAlerts} />
              <WhatIfSimulator />
            </div>
          </div>
        </div>
      </main>

      <TrainsetDetailsDialog
        trainset={selectedTrainset}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Index;
