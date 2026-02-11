/**
 * CSV Export Utility
 * Handles conversion of data to CSV format with proper escaping and formatting
 */

/**
 * Escape CSV field values to handle commas, quotes, and newlines
 */
function escapeCSVField(field: unknown): string {
  if (field === null || field === undefined) {
    return "";
  }

  const stringValue = String(field);

  // If field contains comma, newline, or quote, wrap in quotes and escape quotes
  if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Convert array of objects to CSV string
 */
export function convertToCSV<T extends Record<string, unknown>>(
  data: T[],
  headers?: (keyof T)[]
): string {
  if (data.length === 0) {
    return "";
  }

  // Use provided headers or extract from first object
  const csvHeaders = headers || (Object.keys(data[0]) as (keyof T)[]);

  // Create header row
  const headerRow = csvHeaders.map((h) => escapeCSVField(h)).join(",");

  // Create data rows
  const dataRows = data.map((row) =>
    csvHeaders.map((header) => escapeCSVField(row[header])).join(",")
  );

  return [headerRow, ...dataRows].join("\n");
}

/**
 * Format currency values for CSV export
 */
export function formatCurrencyForCSV(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  const numValue = typeof value === "string" ? parseFloat(value) : Number(value);
  return `$${numValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Format percentage values for CSV export
 */
export function formatPercentageForCSV(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  const numValue = typeof value === "string" ? parseFloat(value) : Number(value);
  return `${numValue.toFixed(2)}%`;
}

/**
 * Format date values for CSV export
 */
export function formatDateForCSV(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(String(value));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/**
 * Create downloadable CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(url);
}

/**
 * Generate CSV with timestamp
 */
export function generateCSVFilename(baseName: string): string {
  const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  return `${baseName}-${timestamp}.csv`;
}

/**
 * Format KPI data for CSV export
 */
export function formatKPIsForCSV(kpis: Record<string, unknown>): string {
  const formattedData = [
    {
      Metric: "Monthly Recurring Revenue",
      Value: formatCurrencyForCSV(kpis.monthlyRecurringRevenue),
    },
    {
      Metric: "Annual Recurring Revenue",
      Value: formatCurrencyForCSV(kpis.annualRecurringRevenue),
    },
    {
      Metric: "Revenue Growth Rate",
      Value: formatPercentageForCSV(kpis.revenueGrowthRate),
    },
    {
      Metric: "Total Active Partners",
      Value: kpis.totalActivePartners,
    },
    {
      Metric: "Partner Growth Rate",
      Value: formatPercentageForCSV(kpis.partnerGrowthRate),
    },
    {
      Metric: "Avg Partner Health Score",
      Value: kpis.avgPartnerHealthScore,
    },
    {
      Metric: "Total Pipeline Value",
      Value: formatCurrencyForCSV(kpis.totalPipelineValue),
    },
    {
      Metric: "Avg Deal Size",
      Value: formatCurrencyForCSV(kpis.avgDealSize),
    },
    {
      Metric: "Deal Win Rate",
      Value: formatPercentageForCSV(kpis.dealWinRate),
    },
    {
      Metric: "Avg Sales Cycle (days)",
      Value: kpis.avgSalesCycle,
    },
    {
      Metric: "Total Certifications",
      Value: kpis.totalCertifications,
    },
    {
      Metric: "Total Commissions Payable",
      Value: formatCurrencyForCSV(kpis.totalCommissionsPayable),
    },
  ];

  return convertToCSV(formattedData);
}

/**
 * Format partner performance data for CSV export
 */
export function formatPartnerPerformanceForCSV(
  partners: Array<Record<string, unknown>>
): string {
  const formattedData = partners.map((partner) => ({
    "Partner ID": partner.partnerCompanyId,
    "Total Revenue": formatCurrencyForCSV(partner.totalRevenue),
    "Deals Won": partner.totalDealsWon,
    "Win Rate": formatPercentageForCSV(partner.winRate),
    "Avg Deal Value": formatCurrencyForCSV(partner.avgDealValue),
    "Total Commissions": formatCurrencyForCSV(partner.totalCommissions),
    "Pipeline Value": formatCurrencyForCSV(partner.activePipelineValue),
    "Courses Completed": partner.totalCoursesCompleted,
    "Certifications": partner.totalCertificationsEarned,
    "Health Score": partner.healthScore,
    "MDF Utilization": formatPercentageForCSV(partner.mdfUtilizationRate),
  }));

  return convertToCSV(formattedData);
}

/**
 * Format deal pipeline data for CSV export
 */
export function formatDealPipelineForCSV(
  pipeline: Array<Record<string, unknown>>
): string {
  const formattedData = pipeline.map((stage) => ({
    Stage: stage.stage,
    "Deal Count": stage.count,
    "Total Value": formatCurrencyForCSV(stage.value),
    "Avg Value": formatCurrencyForCSV(stage.avgValue),
    "Conversion Rate": formatPercentageForCSV(stage.conversionRate),
    "Avg Days in Stage": stage.avgDaysInStage,
  }));

  return convertToCSV(formattedData);
}

/**
 * Format financial data for CSV export
 */
export function formatFinancialForCSV(
  financials: Array<Record<string, unknown>>
): string {
  const formattedData = financials.map((record) => ({
    Date: formatDateForCSV(record.analyticsDate),
    "Total Revenue": formatCurrencyForCSV(record.totalRevenue),
    "Total Commissions": formatCurrencyForCSV(record.totalCommissions),
    "Commission Rate": formatPercentageForCSV(record.commissionRate),
    "Deals Won": record.dealsWon,
    "Deals Lost": record.dealsLost,
    "Avg Deal Value": formatCurrencyForCSV(record.avgDealValue),
    "Pipeline Value": formatCurrencyForCSV(record.pipelineValue),
    "MDF Allocated": formatCurrencyForCSV(record.mdfAllocated),
    "MDF Used": formatCurrencyForCSV(record.mdfUsed),
    "Active Partners": record.activePartners,
  }));

  return convertToCSV(formattedData);
}

/**
 * Format training analytics data for CSV export
 */
export function formatTrainingForCSV(
  training: Array<Record<string, unknown>>
): string {
  const formattedData = training.map((course) => ({
    "Course ID": course.courseId,
    "Total Enrollments": course.totalEnrollments,
    "Completed": course.completedEnrollments,
    "Completion Rate": formatPercentageForCSV(course.completionRate),
    "Avg Progress": formatPercentageForCSV(course.avgProgressPercentage),
    "Avg Completion Time (min)": course.avgCompletionTime,
    "Avg Assessment Score": course.avgAssessmentScore,
    "Pass Rate": formatPercentageForCSV(course.passRate),
    "Certifications Issued": course.certificationsIssued,
    "Partner Count": course.partnerCount,
  }));

  return convertToCSV(formattedData);
}

/**
 * Format commission analytics data for CSV export
 */
export function formatCommissionForCSV(commissions: Record<string, unknown>): string {
  const formattedData = [
    {
      Metric: "Total Commissions",
      Value: formatCurrencyForCSV(commissions.totalCommissions),
    },
    {
      Metric: "Commission Rate",
      Value: formatPercentageForCSV(commissions.commissionRate),
    },
    {
      Metric: "Deals Won",
      Value: commissions.dealsWon,
    },
    {
      Metric: "Avg Commission per Deal",
      Value: formatCurrencyForCSV(commissions.avgCommissionPerDeal),
    },
  ];

  return convertToCSV(formattedData);
}
