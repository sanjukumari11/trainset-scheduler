export interface FitnessCertificate {
  type: string;
  validFrom: Date;
  validTo: Date;
  status: "valid" | "expiring" | "expired";
}

export interface JobCard {
  id: string;
  severity: "critical" | "major" | "minor";
  status: "open" | "closed";
  description: string;
}

export interface BrandingInfo {
  brandId: string;
  requiredHours: number;
  deliveredHours: number;
  priority: "high" | "medium" | "low";
}

export interface MileageData {
  totalKm: number;
  dailyKm: number;
  deviation: number;
  targetKm: number;
}

export interface StablingInfo {
  bayId: string;
  position: number;
  constraints: string[];
  shuntingDifficulty: "easy" | "medium" | "hard";
}

export interface CleaningStatus {
  lastCleaned: Date;
  nextDue: Date;
  status: "completed" | "pending" | "overdue";
}

export interface ServiceReadiness {
  overall: number;
  fitness: number;
  jobCards: number;
  branding: number;
  mileage: number;
  cleaning: number;
  stabling: number;
}

export type ServiceStatus = "ready" | "suboptimal" | "blocked";

export interface Trainset {
  rakeId: string;
  currentBay: string;
  brandingTag: string;
  serviceStatus: ServiceStatus;
  serviceReadiness: ServiceReadiness;
  fitnessCertificates: FitnessCertificate[];
  jobCards: JobCard[];
  branding: BrandingInfo;
  mileage: MileageData;
  stabling: StablingInfo;
  cleaning: CleaningStatus;
  conflicts: string[];
  lastService: Date;
  nextMaintenance: Date;
}

export interface ConflictAlert {
  id: string;
  rakeId: string;
  severity: "critical" | "warning" | "info";
  type: "fitness" | "jobcard" | "branding" | "mileage" | "cleaning" | "stabling";
  message: string;
  timestamp: Date;
}
