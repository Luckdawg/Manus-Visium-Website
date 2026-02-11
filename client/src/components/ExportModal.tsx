import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Download, AlertCircle } from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => Promise<void>;
  title?: string;
  description?: string;
  exportTypes?: ExportType[];
  isLoading?: boolean;
  error?: string | null;
}

export interface ExportOptions {
  type: "kpis" | "pipeline" | "partners" | "financial" | "training" | "commissions" | "all";
  format: "csv" | "excel";
  includeTimestamp: boolean;
}

export type ExportType = "kpis" | "pipeline" | "partners" | "financial" | "training" | "commissions" | "all";

const EXPORT_TYPE_LABELS: Record<ExportType, string> = {
  kpis: "Executive KPIs",
  pipeline: "Deal Pipeline",
  partners: "Partner Performance",
  financial: "Financial Analytics",
  training: "Training Analytics",
  commissions: "Commission Analytics",
  all: "All Analytics Data",
};

/**
 * Export Modal Component
 * Allows users to select export options and download analytics data
 */
export default function ExportModal({
  isOpen,
  onClose,
  onExport,
  title = "Export Analytics",
  description = "Choose what data to export and in what format",
  exportTypes = ["kpis", "pipeline", "partners", "financial", "training", "commissions", "all"],
  isLoading = false,
  error = null,
}: ExportModalProps) {
  const [selectedType, setSelectedType] = useState<ExportType>(exportTypes[0] as ExportType);
  const [format, setFormat] = useState<"csv" | "excel">("csv");
  const [includeTimestamp, setIncludeTimestamp] = useState(true);

  const handleExport = async () => {
    try {
      await onExport({
        type: selectedType,
        format,
        includeTimestamp,
      });
      onClose();
    } catch (err) {
      // Error is handled by parent component
      console.error("Export failed:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {description && <p className="text-sm text-gray-600">{description}</p>}

          {/* Export Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Select Data to Export</Label>
            <RadioGroup value={selectedType} onValueChange={(value) => setSelectedType(value as ExportType)}>
              <div className="space-y-2">
                {exportTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <RadioGroupItem value={type} id={`export-${type}`} />
                    <Label htmlFor={`export-${type}`} className="font-normal cursor-pointer">
                      {EXPORT_TYPE_LABELS[type]}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">File Format</Label>
            <RadioGroup value={format} onValueChange={(value) => setFormat(value as "csv" | "excel")}>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="csv" id="format-csv" />
                  <Label htmlFor="format-csv" className="font-normal cursor-pointer">
                    CSV (Comma-Separated Values)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excel" id="format-excel" />
                  <Label htmlFor="format-excel" className="font-normal cursor-pointer">
                    Excel (.xlsx)
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Include Timestamp */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-timestamp"
              checked={includeTimestamp}
              onCheckedChange={(checked) => setIncludeTimestamp(checked as boolean)}
            />
            <Label htmlFor="include-timestamp" className="font-normal cursor-pointer">
              Include timestamp in filename
            </Label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isLoading} className="gap-2">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
