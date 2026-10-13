import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
export class ExportService {
  /**
   * Generates and triggers download of a CSV file of tasks
   */
  static exportToCSV(tasks, categories, filename = "taskflow_tasks_export.csv") {
    const categoryMap = /* @__PURE__ */ new Map();
    categories.forEach((c) => categoryMap.set(c.id, c.name));
    const headers = [
      "ID",
      "Title",
      "Description",
      "Category",
      "Priority",
      "Status",
      "Start Date",
      "Due Date",
      "Completed At",
      "Created At",
      "Updated At"
    ];
    const escapeCSV = (val) => {
      if (val === void 0 || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };
    const rows = tasks.map((t) => [
      escapeCSV(t.id),
      escapeCSV(t.title),
      escapeCSV(t.description),
      escapeCSV(t.category_id ? categoryMap.get(t.category_id) || "Uncategorized" : "None"),
      escapeCSV(t.priority),
      escapeCSV(t.status),
      escapeCSV(t.start_date ? new Date(t.start_date).toLocaleDateString() : ""),
      escapeCSV(new Date(t.due_date).toLocaleDateString()),
      escapeCSV(t.completed_at ? new Date(t.completed_at).toLocaleDateString() : ""),
      escapeCSV(new Date(t.created_at).toLocaleString()),
      escapeCSV(new Date(t.updated_at).toLocaleString())
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  /**
   * Generates and triggers download of a formatted PDF Report using jsPDF & autoTable
   * Matching ReportLab specifications
   */
  static exportToPDF(tasks, categories, filters, title = "TaskFlow Executive Productivity Report") {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4"
    });
    const categoryMap = /* @__PURE__ */ new Map();
    categories.forEach((c) => categoryMap.set(c.id, c.name));
    const primaryIndigo = [79, 70, 229];
    const darkSlate = [30, 41, 59];
    const lightMuted = [100, 116, 139];
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 595.28, 70, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("TASKFLOW", 40, 38);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Smart Task Management System | Internship Project Report", 40, 54);
    doc.setFontSize(9);
    doc.text(`Generated: ${(/* @__PURE__ */ new Date()).toLocaleDateString()} ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}`, 555, 38, { align: "right" });
    doc.text("Status: Official Export", 555, 52, { align: "right" });
    let currentY = 95;
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(title, 40, currentY);
    currentY += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(lightMuted[0], lightMuted[1], lightMuted[2]);
    const filterParts = [];
    if (filters?.status && filters.status !== "ALL") filterParts.push(`Status: ${filters.status}`);
    if (filters?.priority && filters.priority !== "ALL") filterParts.push(`Priority: ${filters.priority}`);
    if (filters?.category_id && filters.category_id !== "ALL") {
      filterParts.push(`Category: ${categoryMap.get(filters.category_id) || "Custom"}`);
    }
    if (filters?.date_filter && filters.date_filter !== "ALL") filterParts.push(`Date Filter: ${filters.date_filter}`);
    const filterSummary = filterParts.length > 0 ? filterParts.join(" | ") : "All tasks included (No filters applied)";
    doc.text(`Scope: ${filterSummary}`, 40, currentY);
    currentY += 24;
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "COMPLETED").length;
    const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const todo = tasks.filter((t) => t.status === "TODO").length;
    const completionRate = total > 0 ? Math.round(completed / total * 100) : 0;
    const cards = [
      { label: "Total Tasks", value: total.toString(), color: [241, 245, 249], border: [203, 213, 225] },
      { label: "Completed", value: completed.toString(), color: [236, 253, 245], border: [167, 243, 208] },
      { label: "In Progress", value: inProgress.toString(), color: [238, 242, 255], border: [199, 210, 254] },
      { label: "Pending / To Do", value: todo.toString(), color: [254, 242, 242], border: [254, 202, 202] },
      { label: "Completion %", value: `${completionRate}%`, color: [245, 243, 255], border: [221, 214, 254] }
    ];
    const cardWidth = 98;
    const cardHeight = 44;
    let cardX = 40;
    cards.forEach((c) => {
      doc.setFillColor(c.color[0], c.color[1], c.color[2]);
      doc.setDrawColor(c.border[0], c.border[1], c.border[2]);
      doc.setLineWidth(0.75);
      doc.roundedRect(cardX, currentY, cardWidth, cardHeight, 4, 4, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
      doc.text(c.value, cardX + cardWidth / 2, currentY + 18, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(lightMuted[0], lightMuted[1], lightMuted[2]);
      doc.text(c.label, cardX + cardWidth / 2, currentY + 34, { align: "center" });
      cardX += cardWidth + 6;
    });
    currentY += cardHeight + 25;
    const tableRows = tasks.map((t, idx) => {
      const cat = t.category_id ? categoryMap.get(t.category_id) || "None" : "None";
      const dueStr = new Date(t.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      return [
        (idx + 1).toString(),
        t.title,
        cat,
        t.priority,
        t.status.replace("_", " "),
        dueStr
      ];
    });
    autoTable(doc, {
      startY: currentY,
      margin: { left: 40, right: 40 },
      head: [["#", "Task Title", "Category", "Priority", "Status", "Due Date"]],
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
        fontSize: 9,
        fontStyle: "bold",
        halign: "left"
      },
      styles: {
        fontSize: 8.5,
        cellPadding: 6,
        lineColor: [226, 232, 240],
        lineWidth: 0.5,
        textColor: [30, 41, 59]
      },
      columnStyles: {
        0: { cellWidth: 25, halign: "center" },
        1: { cellWidth: 195 },
        2: { cellWidth: 90 },
        3: { cellWidth: 65, halign: "center" },
        4: { cellWidth: 75, halign: "center" },
        5: { cellWidth: 65, halign: "right" }
      },
      didDrawPage: (data) => {
        const pageCount = doc.internal.getNumberOfPages();
        const currentPage = data.pageNumber;
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `TaskFlow v1.0 | Project Review & Internship Report | Page ${currentPage} of ${pageCount}`,
          40,
          820
        );
        doc.text("Confidential - For Internal Assessment Only", 555, 820, { align: "right" });
      }
    });
    const fileSafeDate = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    doc.save(`TaskFlow_Report_${fileSafeDate}.pdf`);
  }
}
