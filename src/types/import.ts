export interface ImportedFitnessCertificate {
  rakeId: string;
  certificateType: string;
  validFrom: string;
  validTo: string;
  status: string;
  remarks?: string;
}

export interface ImportedJobCard {
  woId: string;
  rakeId: string;
  description: string;
  severity: "critical" | "major" | "minor";
  status: "open" | "closed" | "pending";
  createdDate: string;
}

export interface ImportedMileage {
  rakeId: string;
  totalKm: number;
  dailyKm: number;
  targetKm: number;
  date: string;
}

export interface ImportedBranding {
  rakeId: string;
  brandId: string;
  requiredHours: number;
  deliveredHours: number;
  priority: "high" | "medium" | "low";
}

export interface ImportedCleaning {
  rakeId: string;
  lastCleaned: string;
  status: "completed" | "pending" | "overdue";
}

export type ImportType = 
  | "fitness-certificates"
  | "job-cards"
  | "mileage"
  | "branding"
  | "cleaning";

export interface ImportResult {
  success: boolean;
  recordsImported: number;
  errors: string[];
  warnings: string[];
}
