import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  partnerCompanies,
  partnerUsers,
  partnerDeals,
  partnerMdfClaims,
  partnerDealDocuments,
  partnerPasswordResetTokens,
} from "../../drizzle/partner-schema";
import { eq, desc } from "drizzle-orm";
import { sendWelcomeEmail } from "../_core/sendgrid";

export const partnerRouter = router({
  /**
   * Partner registration
   */
  register: publicProcedure
    .input(
      z.object({
        companyName: z.string(),
        contactName: z.string(),
        partnerType: z.string(),
        email: z.string().email(),
        password: z.string().min(8),
        phone: z.string().optional(),
        website: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // Check if company already exists
        const existing = await db
          .select()
          .from(partnerCompanies)
          .where(eq(partnerCompanies.email, input.email))
          .limit(1);

        if (existing.length > 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Partner company already exists with this email",
          });
        }

        // Create partner company
        const companyResult = await db
          .insert(partnerCompanies)
          .values({
            companyName: input.companyName,
            partnerType: input.partnerType,
            email: input.email,
            password: input.password,
            primaryContactName: input.contactName,
            primaryContactEmail: input.email,
            primaryContactPhone: input.phone,
            website: input.website,
            partnerStatus: "Prospect",
            tier: "Standard",
            commissionRate: 0,
            mdfBudget: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

        // Send welcome email
        try {
          await sendWelcomeEmail({
            email: input.email,
            companyName: input.companyName,
            contactName: input.contactName,
          });
        } catch (emailError) {
          console.error("Failed to send welcome email:", emailError);
          // Don't throw - registration should succeed even if email fails
        }

        return {
          success: true,
          partnerId: companyResult.insertId,
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
   * Partner login
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const partner = await db
          .select()
          .from(partnerCompanies)
          .where(eq(partnerCompanies.email, input.email))
          .limit(1);

        if (partner.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Partner not found",
          });
        }

        const company = partner[0];
        if (company.password !== input.password) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid password",
          });
        }

        return {
          success: true,
          partnerId: company.id,
          companyName: company.companyName,
          email: company.email,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Login failed: " + (error as any).message,
        });
      }
    }),

  /**
   * Get all partners (admin)
   */
  getAllPartners: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    try {
      const partners = await db.select().from(partnerCompanies);
      return { success: true, partners };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch partners: " + (error as any).message,
      });
    }
  }),

  /**
   * Get partner by ID
   */
  getPartner: publicProcedure
    .input(z.object({ partnerId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const partner = await db
          .select()
          .from(partnerCompanies)
          .where(eq(partnerCompanies.id, input.partnerId))
          .limit(1);

        if (partner.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Partner not found",
          });
        }

        return { success: true, partner: partner[0] };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch partner: " + (error as any).message,
        });
      }
    }),

  /**
   * Get partner deals
   */
  getPartnerDeals: publicProcedure
    .input(z.object({ partnerId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const deals = await db
          .select()
          .from(partnerDeals)
          .where(eq(partnerDeals.partnerCompanyId, input.partnerId))
          .orderBy(desc(partnerDeals.createdAt));

        return { success: true, deals };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch deals: " + (error as any).message,
        });
      }
    }),

  /**
   * Get all deals (admin)
   */
  getAllDeals: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    try {
      const deals = await db
        .select()
        .from(partnerDeals)
        .orderBy(desc(partnerDeals.createdAt));

      return { success: true, deals };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch deals: " + (error as any).message,
      });
    }
  }),

  /**
   * Register deal
   */
  registerDeal: publicProcedure
    .input(
      z.object({
        partnerCompanyId: z.number(),
        dealName: z.string(),
        customerName: z.string(),
        customerEmail: z.string().email().optional(),
        customerPhone: z.string().optional(),
        customerIndustry: z.string().optional(),
        customerSize: z.string().optional(),
        dealAmount: z.string(),
        expectedCloseDate: z.date().optional(),
        description: z.string().optional(),
        submittedBy: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      try {
        const result = await db
          .insert(partnerDeals)
          .values({
            partnerCompanyId: input.partnerCompanyId,
            dealName: input.dealName,
            customerName: input.customerName,
            customerEmail: input.customerEmail,
            customerPhone: input.customerPhone,
            customerIndustry: input.customerIndustry,
            customerSize: input.customerSize as any,
            dealAmount: input.dealAmount,
            dealStage: "Prospecting",
            status: "Pending",
            createdAt: new Date(),
            updatedAt: new Date(),
            description: input.description,
          });

        return { success: true, dealId: (result as any).insertId };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to register deal: " + (error as any).message,
        });
      }
    }),

  /**
   * Upload deal document
   */
  uploadDealDocument: publicProcedure
    .input(
      z.object({
        dealId: z.number(),
        fileName: z.string(),
        fileUrl: z.string(),
        fileSize: z.number(),
        fileMimeType: z.string(),
        documentType: z.string(),
        uploadedBy: z.number(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const result = await db
          .insert(partnerDealDocuments)
          .values({
            dealId: input.dealId,
            fileName: input.fileName,
            fileUrl: input.fileUrl,
            fileSize: input.fileSize,
            fileMimeType: input.fileMimeType,
            documentType: input.documentType,
            uploadedBy: input.uploadedBy,
            description: input.description,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

        return { success: true, documentId: (result as any).insertId };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload document: " + (error as any).message,
        });
      }
    }),

  /**
   * Request password reset
   */
  requestPasswordReset: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const partner = await db
          .select()
          .from(partnerCompanies)
          .where(eq(partnerCompanies.email, input.email))
          .limit(1);

        if (partner.length === 0) {
          // Don't reveal if email exists
          return { success: true, message: "If email exists, reset link sent" };
        }

        const token = Math.random().toString(36).substring(2, 15);
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await db.insert(partnerPasswordResetTokens).values({
          partnerId: partner[0].id,
          token,
          expiresAt,
          createdAt: new Date(),
        });

        // Send reset email
        try {
          await sendWelcomeEmail({
            email: input.email,
            companyName: partner[0].companyName,
            contactName: partner[0].primaryContactName || "Partner",
            resetToken: token,
          });
        } catch (emailError) {
          console.error("Failed to send reset email:", emailError);
        }

        return { success: true, message: "Reset link sent to email" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to request password reset: " + (error as any).message,
        });
      }
    }),

  /**
   * Reset password
   */
  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string(),
        newPassword: z.string().min(8),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const resetToken = await db
          .select()
          .from(partnerPasswordResetTokens)
          .where(eq(partnerPasswordResetTokens.token, input.token))
          .limit(1);

        if (resetToken.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Invalid reset token",
          });
        }

        const token = resetToken[0];
        if (token.expiresAt < new Date()) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Reset token expired",
          });
        }

        // Update password
        await db
          .update(partnerCompanies)
          .set({ password: input.newPassword, updatedAt: new Date() })
          .where(eq(partnerCompanies.id, token.partnerId));

        // Delete used token
        await db
          .delete(partnerPasswordResetTokens)
          .where(eq(partnerPasswordResetTokens.id, token.id));

        return { success: true, message: "Password reset successfully" };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to reset password: " + (error as any).message,
        });
      }
    }),

  /**
   * Validate reset token
   */
  validateResetToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const resetToken = await db
          .select()
          .from(partnerPasswordResetTokens)
          .where(eq(partnerPasswordResetTokens.token, input.token))
          .limit(1);

        if (resetToken.length === 0) {
          return { valid: false, message: "Invalid token" };
        }

        const token = resetToken[0];
        if (token.expiresAt < new Date()) {
          return { valid: false, message: "Token expired" };
        }

        return { valid: true, message: "Token is valid" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to validate token: " + (error as any).message,
        });
      }
    }),

  /**
   * Update partner
   */
  updatePartner: publicProcedure
    .input(
      z.object({
        partnerId: z.number(),
        data: z.object({
          companyName: z.string().optional(),
          primaryContactEmail: z.string().email().optional(),
          primaryContactPhone: z.string().optional(),
          tier: z.enum(["Gold", "Silver", "Bronze", "Standard"]).optional(),
          commissionRate: z.number().optional(),
          mdfBudget: z.number().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        await db
          .update(partnerCompanies)
          .set({
            ...input.data,
            updatedAt: new Date(),
          })
          .where(eq(partnerCompanies.id, input.partnerId));

        return { success: true, message: "Partner updated successfully" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update partner: " + (error as any).message,
        });
      }
    }),

  /**
   * Delete partner
   */
  deletePartner: publicProcedure
    .input(z.object({ partnerId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // Delete related data first (cascade delete)
        // Delete deal documents
        await db
          .delete(partnerDealDocuments)
          .where(eq(partnerDealDocuments.dealId, input.partnerId));

        // Delete deals
        await db
          .delete(partnerDeals)
          .where(eq(partnerDeals.partnerCompanyId, input.partnerId));

        // Delete MDF claims
        await db
          .delete(partnerMdfClaims)
          .where(eq(partnerMdfClaims.partnerCompanyId, input.partnerId));

        // Delete users
        await db
          .delete(partnerUsers)
          .where(eq(partnerUsers.partnerCompanyId, input.partnerId));

        // Finally delete the company
        await db
          .delete(partnerCompanies)
          .where(eq(partnerCompanies.id, input.partnerId));

        return { success: true, message: "Partner deleted successfully" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete partner: " + (error as any).message,
        });
      }
    }),

  // Submit a deal for admin approval
  submitDeal: protectedProcedure
    .input(
      z.object({
        customerCompanyName: z.string(),
        dealName: z.string(),
        dealValue: z.number(),
        estimatedCloseDate: z.string(),
        salesStage: z.string().optional(),
        dealType: z.string().optional(),
        primaryContactEmail: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        // Get the partner company for the current user
        const userPartner = await db
          .select()
          .from(partnerUsers)
          .where(eq(partnerUsers.userId, ctx.user.id))
          .limit(1);

        if (!userPartner || userPartner.length === 0) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not associated with a partner company",
          });
        }

        const partnerId = userPartner[0].partnerCompanyId;

        // Create the deal in pending status
        await db.insert(partnerDeals).values({
          partnerCompanyId: partnerId,
          customerName: input.customerCompanyName,
          dealName: input.dealName,
          dealAmount: String(input.dealValue),
          estimatedCloseDate: new Date(input.estimatedCloseDate),
          dealStage: (input.salesStage || "Prospecting") as any,
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return {
          success: true,
          message: "Deal submitted successfully and is pending admin approval",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to submit deal: " + (error as any).message,
        });
      }
    }),
});
