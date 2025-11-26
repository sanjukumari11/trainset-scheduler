import { useState } from "react";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ImportType, ImportResult } from "@/types/import";
import { processCSVImport } from "@/lib/csvParser";
import { toast } from "sonner";

interface DataImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const importTypeLabels: Record<ImportType, string> = {
  "fitness-certificates": "Fitness Certificates",
  "job-cards": "Job Cards (Maximo)",
  mileage: "Mileage Data",
  branding: "Branding Priorities",
  cleaning: "Cleaning Status",
};

const csvTemplates: Record<ImportType, string> = {
  "fitness-certificates": "RakeID,CertificateType,ValidFrom,ValidTo,Status,Remarks",
  "job-cards": "WO_ID,RakeID,Description,Severity,Status,CreatedDate",
  mileage: "RakeID,TotalKM,DailyKM,TargetKM,Date",
  branding: "RakeID,BrandID,RequiredHours,DeliveredHours,Priority",
  cleaning: "RakeID,LastCleaned,Status",
};

export function DataImportDialog({ open, onOpenChange }: DataImportDialogProps) {
  const [importType, setImportType] = useState<ImportType | "">("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".csv")) {
        toast.error("Please select a CSV file");
        return;
      }
      setSelectedFile(file);
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile || !importType) {
      toast.error("Please select a file and import type");
      return;
    }

    setImporting(true);
    setImportResult(null);

    try {
      const result = await processCSVImport(selectedFile, importType);
      setImportResult(result);

      if (result.success) {
        toast.success(`Successfully imported ${result.recordsImported} records`);
      } else {
        toast.error("Import failed. Please check the errors below.");
      }
    } catch (error) {
      toast.error("Failed to process import");
      console.error(error);
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    if (!importType) {
      toast.error("Please select an import type first");
      return;
    }

    const template = csvTemplates[importType];
    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${importType}_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Template downloaded");
  };

  const handleReset = () => {
    setImportType("");
    setSelectedFile(null);
    setImportResult(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import CSV Data
          </DialogTitle>
          <DialogDescription>
            Upload CSV files to import trainset data into the system
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Import Type Selection */}
          <div className="space-y-2">
            <Label>Import Type</Label>
            <Select
              value={importType}
              onValueChange={(value) => setImportType(value as ImportType)}
              disabled={importing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select data type to import" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {Object.entries(importTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Template Download */}
          {importType && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-sm">
                  Need a template? Download the CSV template for {importTypeLabels[importType]}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadTemplate}
                  className="ml-4"
                >
                  Download Template
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* File Upload */}
          <div className="space-y-2">
            <Label>CSV File</Label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  disabled={!importType || importing}
                  className="absolute inset-0 z-10 cursor-pointer opacity-0"
                  id="csv-upload"
                />
                <div className="flex items-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    {selectedFile ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          {selectedFile.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFile(null)}
                          disabled={importing}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Click or drag CSV file here
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Import Progress */}
          {importing && (
            <div className="space-y-2">
              <Label>Processing...</Label>
              <Progress value={50} className="h-2" />
            </div>
          )}

          {/* Import Results */}
          {importResult && (
            <div className="space-y-3">
              <Alert variant={importResult.success ? "default" : "destructive"}>
                {importResult.success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  {importResult.success ? (
                    <div>
                      <strong>Import Successful!</strong>
                      <p className="mt-1 text-sm">
                        {importResult.recordsImported} records imported successfully
                      </p>
                    </div>
                  ) : (
                    <div>
                      <strong>Import Failed</strong>
                      <p className="mt-1 text-sm">
                        {importResult.errors.length} error(s) found
                      </p>
                    </div>
                  )}
                </AlertDescription>
              </Alert>

              {/* Errors */}
              {importResult.errors.length > 0 && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                  <h4 className="mb-2 text-sm font-semibold text-destructive">Errors:</h4>
                  <ul className="space-y-1 text-xs text-destructive">
                    {importResult.errors.map((error, idx) => (
                      <li key={idx}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warnings */}
              {importResult.warnings.length > 0 && (
                <div className="rounded-lg border border-warning/50 bg-warning/10 p-3">
                  <h4 className="mb-2 text-sm font-semibold text-warning">Warnings:</h4>
                  <ul className="space-y-1 text-xs text-warning">
                    {importResult.warnings.map((warning, idx) => (
                      <li key={idx}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between gap-3">
            <Button variant="outline" onClick={handleReset} disabled={importing}>
              Reset
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={importing}>
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={!selectedFile || !importType || importing}
              >
                {importing ? "Importing..." : "Import Data"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
