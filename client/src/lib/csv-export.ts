/**
 * Client-side CSV Export Utility
 * Handles downloading CSV files from the server
 */

/**
 * Download CSV file from server response
 */
export async function downloadCSVFile(filename: string, content: string): Promise<void> {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
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
 * Handle CSV export with error handling
 */
export async function handleCSVExport(
  exportFn: () => Promise<{ filename: string; content: string; recordCount: number }>,
  onSuccess?: (recordCount: number) => void,
  onError?: (error: Error) => void
): Promise<void> {
  try {
    const { filename, content, recordCount } = await exportFn();
    await downloadCSVFile(filename, content);

    if (onSuccess) {
      onSuccess(recordCount);
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Failed to export CSV");
    if (onError) {
      onError(err);
    } else {
      console.error("CSV export failed:", err);
    }
  }
}

/**
 * Format bytes for display
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Get MIME type for file format
 */
export function getMimeType(format: "csv" | "excel"): string {
  switch (format) {
    case "csv":
      return "text/csv";
    case "excel":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    default:
      return "text/csv";
  }
}
