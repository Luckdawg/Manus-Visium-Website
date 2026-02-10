import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload, Download, Trash2, Eye, Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface Document {
  id: number;
  dealId: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileMimeType: string;
  documentType: string;
  uploadedBy: number;
  description?: string | null;
  createdAt: Date;
}

interface DealDocumentsProps {
  dealId: number;
  dealName: string;
}

const DOCUMENT_TYPES = [
  "Proposal",
  "Contract",
  "Technical Specifications",
  "Implementation Plan",
  "Pricing Quote",
  "Customer Reference",
  "Compliance Document",
  "Other",
];

export default function DealDocuments({ dealId, dealName }: DealDocumentsProps) {
  const [selectedType, setSelectedType] = useState<string>("Proposal");
  const [description, setDescription] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Query to get documents for this deal
  const { data: documents, isLoading, refetch } = trpc.partner.getDealDocuments.useQuery(
    { dealId },
    { enabled: !!dealId }
  );

  // Mutation to upload document
  const uploadMutation = trpc.partner.uploadDealDocument.useMutation({
    onSuccess: () => {
      setSelectedFile(null);
      setDescription("");
      setSelectedType("Proposal");
      refetch();
    },
  });

  // Mutation to delete document
  const deleteMutation = trpc.partner.deleteDealDocument.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        await uploadMutation.mutateAsync({
          dealId,
          fileName: selectedFile.name,
          fileData: base64,
          fileMimeType: selectedFile.type,
          fileSize: selectedFile.size,
          documentType: selectedType,
          description,
        });
      };
      reader.readAsDataURL(selectedFile);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>Add supporting documents for {dealName}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type
              </label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File
              </label>
              <Input
                type="file"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes about this document..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              disabled={isUploading}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedFile(null);
                setDescription("");
              }}
              disabled={isUploading}
            >
              Clear
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload Document"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>
            {documents?.length || 0} document{documents?.length !== 1 ? "s" : ""} uploaded
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading documents...</div>
          ) : documents && documents.length > 0 ? (
            <div className="space-y-3">
              {documents.map((doc: Document) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="h-6 w-6 text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{doc.fileName}</p>
                      <div className="flex gap-2 text-xs text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {doc.documentType}
                        </span>
                        <span>{formatFileSize(doc.fileSize)}</span>
                        <span>
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {doc.description && (
                        <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(doc.fileUrl, "_blank")}
                      className="gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = doc.fileUrl;
                        link.download = doc.fileName;
                        link.click();
                      }}
                      className="gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate({ documentId: doc.id })}
                      className="gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No documents uploaded yet</p>
              <p className="text-sm text-gray-500">
                Upload proposals, contracts, and other supporting documents to strengthen your deal
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
