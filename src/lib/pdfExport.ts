import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import { Trainset, ConflictAlert } from "@/types/trainset";

export async function generateInductionListPDF(
  trainsets: Trainset[],
  conflicts: ConflictAlert[],
  date: Date
) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("KMRL Trainset Induction List", 105, 20, { align: "center" });
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Generated: ${date.toLocaleDateString("en-IN")} ${date.toLocaleTimeString("en-IN", { 
      hour: "2-digit", 
      minute: "2-digit" 
    })}`,
    105,
    28,
    { align: "center" }
  );

  let yPos = 40;

  // Summary Statistics
  const ready = trainsets.filter((t) => t.serviceStatus === "ready").length;
  const suboptimal = trainsets.filter((t) => t.serviceStatus === "suboptimal").length;
  const blocked = trainsets.filter((t) => t.serviceStatus === "blocked").length;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Fleet Summary", 14, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Ready: ${ready}  |  Suboptimal: ${suboptimal}  |  Blocked: ${blocked}  |  Total: ${trainsets.length}`, 14, yPos);
  yPos += 10;

  // Ranked Induction List Table
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Ranked Induction List", 14, yPos);
  yPos += 5;

  const inductionData = trainsets.map((t, idx) => [
    (idx + 1).toString(),
    t.rakeId,
    t.serviceStatus.toUpperCase(),
    `${t.serviceReadiness.overall}%`,
    t.branding.brandId,
    t.stabling.bayId,
    t.jobCards.length.toString(),
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["#", "Rake ID", "Status", "Readiness", "Branding", "Bay", "Jobs"]],
    body: inductionData,
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246], fontStyle: "bold" },
    styles: { fontSize: 9 },
    columnStyles: {
      2: { 
        cellWidth: 25,
        fontStyle: "bold",
      }
    },
    didParseCell: function (data) {
      if (data.section === "body" && data.column.index === 2) {
        const status = data.cell.text[0];
        if (status === "READY") {
          data.cell.styles.textColor = [34, 197, 94];
        } else if (status === "SUBOPTIMAL") {
          data.cell.styles.textColor = [234, 179, 8];
        } else if (status === "BLOCKED") {
          data.cell.styles.textColor = [239, 68, 68];
        }
      }
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Conflict Alerts Section
  if (conflicts.length > 0) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Conflict Alerts", 14, yPos);
    yPos += 5;

    const conflictData = conflicts.map((c) => [
      c.rakeId,
      c.severity.toUpperCase(),
      c.message,
      c.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Rake ID", "Severity", "Message", "Time"]],
      body: conflictData,
      theme: "grid",
      headStyles: { fillColor: [239, 68, 68], fontStyle: "bold" },
      styles: { fontSize: 9 },
      columnStyles: {
        2: { cellWidth: 90 },
      },
      didParseCell: function (data) {
        if (data.section === "body" && data.column.index === 1) {
          const severity = data.cell.text[0];
          if (severity === "CRITICAL") {
            data.cell.styles.textColor = [239, 68, 68];
            data.cell.styles.fontStyle = "bold";
          } else if (severity === "WARNING") {
            data.cell.styles.textColor = [234, 179, 8];
          } else if (severity === "INFO") {
            data.cell.styles.textColor = [59, 130, 246];
          }
        }
      },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Detailed Trainset Information
  doc.addPage();
  yPos = 20;

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Detailed Trainset Information", 105, yPos, { align: "center" });
  yPos += 12;

  for (const trainset of trainsets) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    // Trainset Header
    doc.setFillColor(240, 240, 240);
    doc.rect(14, yPos - 5, 182, 10, "F");
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`${trainset.rakeId} - Service Readiness: ${trainset.serviceReadiness.overall}%`, 16, yPos);
    yPos += 10;

    // Component Scores
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const components = Object.entries(trainset.serviceReadiness)
      .filter(([key]) => key !== "overall")
      .map(([key, value]) => `${key}: ${value}%`)
      .join("  |  ");
    doc.text(components, 16, yPos);
    yPos += 8;

    // Key Information
    const info = [
      `Branding: ${trainset.branding.brandId} (${trainset.branding.deliveredHours}h/${trainset.branding.requiredHours}h)`,
      `Mileage: ${trainset.mileage.dailyKm}km daily (Target: ${trainset.mileage.targetKm}km, Dev: ${trainset.mileage.deviation}km)`,
      `Stabling: Bay ${trainset.stabling.bayId} (${trainset.stabling.shuntingDifficulty})`,
      `Cleaning: ${trainset.cleaning.status} (Last: ${trainset.cleaning.lastCleaned.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })})`,
      `Job Cards: ${trainset.jobCards.length} open`,
    ];

    info.forEach((line) => {
      doc.text(line, 16, yPos);
      yPos += 5;
    });

    // Conflicts for this trainset
    if (trainset.conflicts.length > 0) {
      yPos += 2;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(239, 68, 68);
      doc.text("⚠ Conflicts:", 16, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 5;
      trainset.conflicts.forEach((conflict) => {
        doc.text(`  • ${conflict}`, 20, yPos);
        yPos += 4;
      });
      doc.setTextColor(0, 0, 0);
    }

    yPos += 8;
  }

  // QR Code Page
  doc.addPage();
  yPos = 20;

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Mobile Access", 105, yPos, { align: "center" });
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Scan this QR code to access the live dashboard on your mobile device",
    105,
    yPos,
    { align: "center" }
  );
  yPos += 15;

  // Generate QR Code
  const dashboardUrl = window.location.origin;
  const qrDataUrl = await QRCode.toDataURL(dashboardUrl, {
    width: 200,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });

  // Add QR code to PDF
  doc.addImage(qrDataUrl, "PNG", 55, yPos, 100, 100);
  yPos += 110;

  doc.setFontSize(9);
  doc.text(dashboardUrl, 105, yPos, { align: "center" });

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `KMRL Trainset Induction Planner - Page ${i} of ${pageCount}`,
      105,
      287,
      { align: "center" }
    );
  }

  // Save the PDF
  const filename = `KMRL_Induction_List_${date.toISOString().split("T")[0]}_${date.getHours()}-${date.getMinutes()}.pdf`;
  doc.save(filename);
}
