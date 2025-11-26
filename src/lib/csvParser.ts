import { 
  ImportedFitnessCertificate, 
  ImportedJobCard, 
  ImportedMileage,
  ImportedBranding,
  ImportedCleaning,
  ImportType,
  ImportResult
} from "@/types/import";

export function parseCSV(csvText: string): string[][] {
  const lines = csvText.split("\n").filter(line => line.trim());
  return lines.map(line => {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    
    values.push(current.trim());
    return values;
  });
}

export function validateFitnessCertificates(
  data: string[][]
): { valid: ImportedFitnessCertificate[]; errors: string[] } {
  const valid: ImportedFitnessCertificate[] = [];
  const errors: string[] = [];
  const headers = data[0].map(h => h.toLowerCase());

  const requiredFields = ["rakeid", "certificatetype", "validfrom", "validto", "status"];
  const missingFields = requiredFields.filter(
    field => !headers.some(h => h.includes(field.replace("_", "")))
  );

  if (missingFields.length > 0) {
    errors.push(`Missing required columns: ${missingFields.join(", ")}`);
    return { valid, errors };
  }

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row.length < 5) continue;

    const record: ImportedFitnessCertificate = {
      rakeId: row[0],
      certificateType: row[1],
      validFrom: row[2],
      validTo: row[3],
      status: row[4].toLowerCase(),
      remarks: row[5] || "",
    };

    if (!record.rakeId || !record.certificateType) {
      errors.push(`Row ${i + 1}: Missing rake ID or certificate type`);
      continue;
    }

    valid.push(record);
  }

  return { valid, errors };
}

export function validateJobCards(
  data: string[][]
): { valid: ImportedJobCard[]; errors: string[] } {
  const valid: ImportedJobCard[] = [];
  const errors: string[] = [];
  const headers = data[0].map(h => h.toLowerCase());

  const requiredFields = ["woid", "rakeid", "description", "severity", "status"];
  const missingFields = requiredFields.filter(
    field => !headers.some(h => h.includes(field.replace("_", "")))
  );

  if (missingFields.length > 0) {
    errors.push(`Missing required columns: ${missingFields.join(", ")}`);
    return { valid, errors };
  }

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row.length < 5) continue;

    const severity = row[3].toLowerCase();
    const status = row[4].toLowerCase();

    if (!["critical", "major", "minor"].includes(severity)) {
      errors.push(`Row ${i + 1}: Invalid severity "${row[3]}"`);
      continue;
    }

    if (!["open", "closed", "pending"].includes(status)) {
      errors.push(`Row ${i + 1}: Invalid status "${row[4]}"`);
      continue;
    }

    const record: ImportedJobCard = {
      woId: row[0],
      rakeId: row[1],
      description: row[2],
      severity: severity as "critical" | "major" | "minor",
      status: status as "open" | "closed" | "pending",
      createdDate: row[5] || new Date().toISOString(),
    };

    valid.push(record);
  }

  return { valid, errors };
}

export function validateMileage(
  data: string[][]
): { valid: ImportedMileage[]; errors: string[] } {
  const valid: ImportedMileage[] = [];
  const errors: string[] = [];
  const headers = data[0].map(h => h.toLowerCase());

  const requiredFields = ["rakeid", "totalkm", "dailykm", "targetkm"];
  const missingFields = requiredFields.filter(
    field => !headers.some(h => h.includes(field.replace("_", "")))
  );

  if (missingFields.length > 0) {
    errors.push(`Missing required columns: ${missingFields.join(", ")}`);
    return { valid, errors };
  }

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row.length < 4) continue;

    const totalKm = parseFloat(row[1]);
    const dailyKm = parseFloat(row[2]);
    const targetKm = parseFloat(row[3]);

    if (isNaN(totalKm) || isNaN(dailyKm) || isNaN(targetKm)) {
      errors.push(`Row ${i + 1}: Invalid numeric values`);
      continue;
    }

    const record: ImportedMileage = {
      rakeId: row[0],
      totalKm,
      dailyKm,
      targetKm,
      date: row[4] || new Date().toISOString(),
    };

    valid.push(record);
  }

  return { valid, errors };
}

export function validateBranding(
  data: string[][]
): { valid: ImportedBranding[]; errors: string[] } {
  const valid: ImportedBranding[] = [];
  const errors: string[] = [];
  const headers = data[0].map(h => h.toLowerCase());

  const requiredFields = ["rakeid", "brandid", "requiredhours", "deliveredhours", "priority"];
  const missingFields = requiredFields.filter(
    field => !headers.some(h => h.includes(field.replace("_", "")))
  );

  if (missingFields.length > 0) {
    errors.push(`Missing required columns: ${missingFields.join(", ")}`);
    return { valid, errors };
  }

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row.length < 5) continue;

    const priority = row[4].toLowerCase();
    if (!["high", "medium", "low"].includes(priority)) {
      errors.push(`Row ${i + 1}: Invalid priority "${row[4]}"`);
      continue;
    }

    const record: ImportedBranding = {
      rakeId: row[0],
      brandId: row[1],
      requiredHours: parseFloat(row[2]),
      deliveredHours: parseFloat(row[3]),
      priority: priority as "high" | "medium" | "low",
    };

    valid.push(record);
  }

  return { valid, errors };
}

export function validateCleaning(
  data: string[][]
): { valid: ImportedCleaning[]; errors: string[] } {
  const valid: ImportedCleaning[] = [];
  const errors: string[] = [];
  const headers = data[0].map(h => h.toLowerCase());

  const requiredFields = ["rakeid", "lastcleaned", "status"];
  const missingFields = requiredFields.filter(
    field => !headers.some(h => h.includes(field.replace("_", "")))
  );

  if (missingFields.length > 0) {
    errors.push(`Missing required columns: ${missingFields.join(", ")}`);
    return { valid, errors };
  }

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row.length < 3) continue;

    const status = row[2].toLowerCase();
    if (!["completed", "pending", "overdue"].includes(status)) {
      errors.push(`Row ${i + 1}: Invalid status "${row[2]}"`);
      continue;
    }

    const record: ImportedCleaning = {
      rakeId: row[0],
      lastCleaned: row[1],
      status: status as "completed" | "pending" | "overdue",
    };

    valid.push(record);
  }

  return { valid, errors };
}

export async function processCSVImport(
  file: File,
  type: ImportType
): Promise<ImportResult> {
  try {
    const text = await file.text();
    const data = parseCSV(text);

    if (data.length < 2) {
      return {
        success: false,
        recordsImported: 0,
        errors: ["CSV file is empty or has no data rows"],
        warnings: [],
      };
    }

    let validRecords: any[] = [];
    let errors: string[] = [];

    switch (type) {
      case "fitness-certificates":
        ({ valid: validRecords, errors } = validateFitnessCertificates(data));
        break;
      case "job-cards":
        ({ valid: validRecords, errors } = validateJobCards(data));
        break;
      case "mileage":
        ({ valid: validRecords, errors } = validateMileage(data));
        break;
      case "branding":
        ({ valid: validRecords, errors } = validateBranding(data));
        break;
      case "cleaning":
        ({ valid: validRecords, errors } = validateCleaning(data));
        break;
      default:
        return {
          success: false,
          recordsImported: 0,
          errors: ["Unknown import type"],
          warnings: [],
        };
    }

    const warnings: string[] = [];
    if (validRecords.length < data.length - 1) {
      warnings.push(
        `Imported ${validRecords.length} of ${data.length - 1} records. Some records were skipped due to errors.`
      );
    }

    return {
      success: validRecords.length > 0,
      recordsImported: validRecords.length,
      errors,
      warnings,
    };
  } catch (error) {
    return {
      success: false,
      recordsImported: 0,
      errors: [`Failed to process CSV: ${error instanceof Error ? error.message : "Unknown error"}`],
      warnings: [],
    };
  }
}
