import { storagePut } from "../storage";
import { getDb } from "../db";
import { partnerDealDocuments } from "../../drizzle/partner-schema";
import { eq, and } from "drizzle-orm";

export interface DealDocumentUploadParams {
  dealId: number;
  fileName: string;
  fileBuffer: Buffer;
  fileMimeType: string;
  documentType: "Proposal" | "Contract" | "Technical Specifications" | "Implementation Plan" | "Pricing Quote" | "Customer Reference" | "Compliance Document" | "Other";
  uploadedBy: number;
  description?: string;
}

export interface DealDocumentResponse {
  id: number;
  dealId: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileMimeType: string;
  documentType: string;
  uploadedBy: number;
  description?: string;
  createdAt: Date;
}

/**
 * Upload a document for a deal
 */
export async function uploadDealDocument(params: DealDocumentUploadParams): Promise<DealDocumentResponse> {
  const { dealId, fileName, fileBuffer, fileMimeType, documentType, uploadedBy, description } = params;

  // Generate unique file key to prevent enumeration
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const fileKey = `deals/${dealId}/documents/${timestamp}-${random}-${fileName}`;

  // Upload to S3
  const { url: fileUrl } = await storagePut(fileKey, fileBuffer, fileMimeType);

  // Save document metadata to database
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  const result = await db.insert(partnerDealDocuments).values({
    dealId,
    fileName,
    fileUrl,
    fileSize: fileBuffer.length,
    fileMimeType,
    documentType,
    uploadedBy,
    description: description || null,
  });

  const documentId = (result[0] as any).insertId as number;

  return {
    id: documentId,
    dealId,
    fileName,
    fileUrl,
    fileSize: fileBuffer.length,
    fileMimeType,
    documentType,
    uploadedBy,
    description,
    createdAt: new Date(),
  };
}

/**
 * Get all documents for a deal
 */
export async function getDealDocuments(dealId: number): Promise<DealDocumentResponse[]> {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  const documents = await db
    .select()
    .from(partnerDealDocuments)
    .where(eq(partnerDealDocuments.dealId, dealId));

  return documents.map((doc: any) => ({
    id: doc.id,
    dealId: doc.dealId,
    fileName: doc.fileName,
    fileUrl: doc.fileUrl,
    fileSize: doc.fileSize,
    fileMimeType: doc.fileMimeType,
    documentType: doc.documentType,
    uploadedBy: doc.uploadedBy,
    description: doc.description || undefined,
    createdAt: doc.createdAt,
  }));
}

/**
 * Delete a document
 */
export async function deleteDealDocument(documentId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  const result = await db
    .delete(partnerDealDocuments)
    .where(eq(partnerDealDocuments.id, documentId));

  return (result as any).rowsAffected > 0;
}

/**
 * Get document by ID
 */
export async function getDealDocument(documentId: number): Promise<DealDocumentResponse | null> {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  const documents = await db
    .select()
    .from(partnerDealDocuments)
    .where(eq(partnerDealDocuments.id, documentId));

  if (documents.length === 0) return null;

  const doc: any = documents[0];
  return {
    id: doc.id,
    dealId: doc.dealId,
    fileName: doc.fileName,
    fileUrl: doc.fileUrl,
    fileSize: doc.fileSize,
    fileMimeType: doc.fileMimeType,
    documentType: doc.documentType,
    uploadedBy: doc.uploadedBy,
    description: doc.description || undefined,
    createdAt: doc.createdAt,
  };
}

/**
 * Get documents by type for a deal
 */
export async function getDealDocumentsByType(
  dealId: number,
  documentType: string
): Promise<DealDocumentResponse[]> {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  const documents = await db
    .select()
    .from(partnerDealDocuments)
    .where(
      and(
        eq(partnerDealDocuments.dealId, dealId),
        eq(partnerDealDocuments.documentType, documentType as any)
      )
    );

  return documents.map((doc: any) => ({
    id: doc.id,
    dealId: doc.dealId,
    fileName: doc.fileName,
    fileUrl: doc.fileUrl,
    fileSize: doc.fileSize,
    fileMimeType: doc.fileMimeType,
    documentType: doc.documentType,
    uploadedBy: doc.uploadedBy,
    description: doc.description || undefined,
    createdAt: doc.createdAt,
  }));
}
