import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  partnerCompanies,
  partnerUsers,
  partnerDeals,
  partnerDealDocuments,
  partnerPasswordResetTokens,
} from "../../drizzle/partner-schema";
import { eq, desc, and } from "drizzle-orm";
import { sendWelcomeEmail } from "../_core/sendgrid";
import { TRPCError } from "@trpc/server";

/**
 * Partner Portal Router - Corrected Implementation
 * Handles partner registration, authentication, deal management, and file attachments
 */
export const partnerRouter = router({
  /**
   * Partner registration - Create company and initial user
   */
  register: publicProcedure
    .input(
      z.object({
        companyName: z.string().min(1),
        contactName: z.string().min(1),
        partnerType: z.enum([
          "Reseller",
          "Technology Partner",
          "System Integrator",
          "Managed Service Provider",
          "Consulting Partner",
          "Channel Partner",
          "OEM Partner",
          "Other",
        ]),
        email: z.string().email(),
        phone: z.string().optional(),
        website: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // Check if company already exists
        const existingCompany = await db
          .select()
          .from(partnerCompanies)
          .where(eq(partnerCompanies.email, input.email))
          .limit(1);

        if (existingCompany.length > 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Partner company already exists with this email",
          });
        }

        // Create partner company
        const companyResult = await db.insert(partnerCompanies).values({
          companyName: input.companyName,
          partnerType: input.partnerType,
          email: input.email,
          primaryContactName: input.contactName,
          primaryContactEmail: input.email,
          primaryContactPhone: input.phone,
          website: input.website,
          partnerStatus: "Prospect",
          tier: "Standard",
          commissionRate: "10.00",
          mdfBudgetAnnual: "0.00",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const companyId = (companyResult as any).insertId;

        // Send welcome email
        try {
          await sendWelcomeEmail(
            input.email,
            input.companyName,
            `${process.env.VITE_OAUTH_PORTAL_URL || 'https://app.visium.tech'}/partners/login`
          );
        } catch (emailError) {
          console.error("Failed to send welcome email:", emailError);
        }

        return {
          success: true,
          partnerId: companyId,
          companyId,
          message: "Partner registered successfully",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to register partner: " + (error as any).message,
        });
      }
    }),

  /**
   * Submit a deal for approval
   */
  submitDeal: protectedProcedure
    .input(
      z.object({
        customerCompanyName: z.string(),
        dealName: z.string(),
        dealValue: z.number().min(0),
        estimatedCloseDate: z.string(),
        customerEmail: z.string().email().optional(),
        customerPhone: z.string().optional(),
        customerIndustry: z.string().optional(),
        customerSize: z.string().optional(),
        dealStage: z.string().optional(),
        description: z.string().optional(),
        productInterest: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // Find partner company for this user
        let userPartner = await db
          .select()
          .from(partnerUsers)
          .where(eq(partnerUsers.userId, ctx.user.id))
          .limit(1);

        // If not found by userId, try by email
        if (!userPartner || userPartner.length === 0) {
          if (ctx.user.email) {
            userPartner = await db
              .select()
              .from(partnerUsers)
              .where(eq(partnerUsers.email, ctx.user.email))
              .limit(1);
          }
        }

        if (!userPartner || userPartner.length === 0) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not associated with a partner company",
          });
        }

        const partnerCompanyId = userPartner[0].partnerCompanyId;

        // Create deal
        const dealResult = await db.insert(partnerDeals).values({
          partnerCompanyId,
          dealName: input.dealName,
          customerName: input.customerCompanyName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          customerIndustry: input.customerIndustry,
          customerSize: (input.customerSize as any) || undefined,
          dealAmount: input.dealValue.toString(),
          dealStage: (input.dealStage as any) || "Prospecting",
          expectedCloseDate: new Date(input.estimatedCloseDate),
          submittedBy: ctx.user.id,
          description: input.description,
          productInterest: input.productInterest ? JSON.stringify(input.productInterest) : undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return {
          success: true,
          dealId: (dealResult as any).insertId,
          message: "Deal submitted successfully",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to submit deal: " + (error as any).message,
        });
      }
    }),

  /**
   * Upload a document for a deal
   */
  uploadDealDocument: protectedProcedure
    .input(
      z.object({
        dealId: z.number(),
        fileName: z.string(),
        fileUrl: z.string(),
        fileSize: z.number(),
        fileMimeType: z.string(),
        documentType: z.enum([
          "Proposal",
          "Contract",
          "Technical Specifications",
          "Implementation Plan",
          "Pricing Quote",
          "Customer Reference",
          "Compliance Document",
          "Other",
        ]),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // Verify deal exists
        const deal = await db
          .select()
          .from(partnerDeals)
          .where(eq(partnerDeals.id, input.dealId))
          .limit(1);

        if (!deal || deal.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Deal not found",
          });
        }

        // Verify user is associated with the partner company
        const userPartner = await db
          .select()
          .from(partnerUsers)
          .where(
            and(
              eq(partnerUsers.partnerCompanyId, deal[0].partnerCompanyId),
              eq(partnerUsers.userId, ctx.user.id)
            )
          )
          .limit(1);

        if (!userPartner || userPartner.length === 0) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to upload documents for this deal",
          });
        }

        // Upload document
        const docResult = await db.insert(partnerDealDocuments).values({
          dealId: input.dealId,
          fileName: input.fileName,
          fileUrl: input.fileUrl,
          fileSize: input.fileSize,
          fileMimeType: input.fileMimeType,
          documentType: input.documentType,
          uploadedBy: ctx.user.id,
          description: input.description,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return {
          success: true,
          documentId: (docResult as any).insertId,
          message: "Document uploaded successfully",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload document: " + (error as any).message,
        });
      }
    }),

  /**
   * Get all documents for a deal
   */
  getDealDocuments: protectedProcedure
    .input(z.object({ dealId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const documents = await db
          .select()
          .from(partnerDealDocuments)
          .where(eq(partnerDealDocuments.dealId, input.dealId))
          .orderBy(desc(partnerDealDocuments.createdAt));

        return documents;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch documents: " + (error as any).message,
        });
      }
    }),

  /**
   * Delete a document
   */
  deleteDealDocument: protectedProcedure
    .input(z.object({ documentId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // Verify document exists
        const doc = await db
          .select()
          .from(partnerDealDocuments)
          .where(eq(partnerDealDocuments.id, input.documentId))
          .limit(1);

        if (!doc || doc.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Document not found",
          });
        }

        // Verify user uploaded this document
        if (doc[0].uploadedBy !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to delete this document",
          });
        }

        // Delete document
        await db.delete(partnerDealDocuments).where(eq(partnerDealDocuments.id, input.documentId));

        return { success: true, message: "Document deleted successfully" };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete document: " + (error as any).message,
        });
      }
    }),

  /**
   * Get partner's deals
   */
  getPartnerDeals: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    try {
      // Find partner company for this user
      let userPartner = await db
        .select()
        .from(partnerUsers)
        .where(eq(partnerUsers.userId, ctx.user.id))
        .limit(1);

      if (!userPartner || userPartner.length === 0) {
        if (ctx.user.email) {
          userPartner = await db
            .select()
            .from(partnerUsers)
            .where(eq(partnerUsers.email, ctx.user.email))
            .limit(1);
        }
      }

      if (!userPartner || userPartner.length === 0) {
        return [];
      }

      const deals = await db
        .select()
        .from(partnerDeals)
        .where(eq(partnerDeals.partnerCompanyId, userPartner[0].partnerCompanyId))
        .orderBy(desc(partnerDeals.createdAt));

      return deals;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch deals: " + (error as any).message,
      });
    }
  }),
});
