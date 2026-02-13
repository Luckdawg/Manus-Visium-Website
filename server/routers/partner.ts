import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
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
        // Check if email already exists
        const existingUser = await db
          .select()
          .from(partnerUsers)
          .where(eq(partnerUsers.email, input.email));

        if (existingUser.length > 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email already registered",
          });
        }

        // Hash password (simple example - use bcrypt in production)
        const passwordHash = Buffer.from(input.password).toString("base64");

        // Create partner company
        const companyResult = await db
          .insert(partnerCompanies)
          .values({
            companyName: input.companyName,
            partnerType: input.partnerType as any,
            website: input.website,
            phone: input.phone,
            email: input.email,
            primaryContactName: input.contactName,
            primaryContactEmail: input.email,
            primaryContactPhone: input.phone,
            partnerStatus: "Prospect",
            tier: "Standard",
          });

        const companyId = (companyResult as any).insertId;

        // Create partner user
        await db
          .insert(partnerUsers)
          .values({
            partnerCompanyId: companyId,
            email: input.email,
            passwordHash,
            contactName: input.contactName,
            phone: input.phone,
            partnerRole: "Admin",
            emailVerified: false,
          });

        // Send welcome email
        try {
          const loginUrl = `${process.env.VITE_FRONTEND_URL || 'http://localhost:3000'}/partners/login`;
          await sendWelcomeEmail(input.email, input.companyName, loginUrl);
        } catch (emailError) {
          console.error("Failed to send welcome email:", emailError);
        }

        return {
          success: true,
          message: "Registration successful. Please check your email for verification.",
          companyId,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Registration failed: " + (error as any).message,
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
        const user = await db
          .select()
          .from(partnerUsers)
          .where(eq(partnerUsers.email, input.email));

        if (user.length === 0) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        const passwordHash = Buffer.from(input.password).toString("base64");
        if (user[0].passwordHash !== passwordHash) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        return {
          success: true,
          userId: user[0].id,
          companyId: user[0].partnerCompanyId,
          email: user[0].email,
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
   * Get all partner companies
   */
  getAllPartners: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    try {
      const partners = await db.select().from(partnerCompanies);
      return { partners };
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
          .where(eq(partnerCompanies.id, input.partnerId));

        if (partner.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Partner not found",
          });
        }

        return { partner: partner[0] };
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

        return { deals };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch partner deals: " + (error as any).message,
        });
      }
    }),

  /**
   * Get all deals
   */
  getAllDeals: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    try {
      const deals = await db.select().from(partnerDeals).orderBy(desc(partnerDeals.createdAt));
      return { deals };
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
            dealAmount: input.dealAmount as any,
            expectedCloseDate: input.expectedCloseDate,
            description: input.description,
            dealStage: "Prospecting",
            submittedBy: input.submittedBy,
          });

        return {
          success: true,
          message: "Deal registered successfully",
          dealId: (result as any).insertId,
        };
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
            documentType: input.documentType as any,
            uploadedBy: input.uploadedBy,
            description: input.description,
          });

        return {
          success: true,
          message: "Document uploaded successfully",
          documentId: (result as any).insertId,
        };
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
        const user = await db
          .select()
          .from(partnerUsers)
          .where(eq(partnerUsers.email, input.email));

        if (user.length === 0) {
          return { success: true, message: "If email exists, reset link sent" };
        }

        const token = Buffer.from(Math.random().toString()).toString("base64").slice(0, 32);
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await db
          .insert(partnerPasswordResetTokens)
          .values({
            userId: user[0].id,
            email: input.email,
            token,
            expiresAt,
            isUsed: false,
          });

        try {
          await sendWelcomeEmail(input.email, "Password Reset", `Reset link: ${token}`);
        } catch (emailError) {
          console.error("Failed to send reset email:", emailError);
        }

        return { success: true, message: "If email exists, reset link sent" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to request password reset: " + (error as any).message,
        });
      }
    }),

  /**
   * Reset password with token
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
          .where(eq(partnerPasswordResetTokens.token, input.token));

        if (resetToken.length === 0) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid or expired reset token",
          });
        }

        const token = resetToken[0];
        if (token.isUsed || new Date() > token.expiresAt) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Reset token has expired",
          });
        }

        const passwordHash = Buffer.from(input.newPassword).toString("base64");
        await db
          .update(partnerUsers)
          .set({ passwordHash })
          .where(eq(partnerUsers.email, token.email));

        await db
          .update(partnerPasswordResetTokens)
          .set({ isUsed: true })
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
   * Validate password reset token
   */
  validateResetToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const token = await db
          .select()
          .from(partnerPasswordResetTokens)
          .where(eq(partnerPasswordResetTokens.token, input.token));

        if (token.length === 0) {
          return { valid: false, message: "Token not found" };
        }

        if (new Date() > token[0].expiresAt) {
          return { valid: false, message: "This reset link has expired" };
        }

        if (token[0].isUsed) {
          return { valid: false, message: "This reset link has already been used" };
        }

        return {
          valid: true,
          email: token[0].email,
          message: "Token is valid",
        };
      } catch (error) {
        return { valid: false, message: "Error validating token" };
      }
    }),

  /**
   * Update partner company information
   */
  updatePartner: publicProcedure
    .input(
      z.object({
        partnerId: z.number(),
        data: z.object({
          companyName: z.string().optional(),
          primaryContactEmail: z.string().email().optional(),
          primaryContactPhone: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const updateData: any = {};
        if (input.data.companyName) updateData.companyName = input.data.companyName;
        if (input.data.primaryContactEmail) updateData.primaryContactEmail = input.data.primaryContactEmail;
        if (input.data.primaryContactPhone) updateData.primaryContactPhone = input.data.primaryContactPhone;

        await db
          .update(partnerCompanies)
          .set(updateData)
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
   * Delete partner company
   */
  deletePartner: publicProcedure
    .input(z.object({ partnerId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // Get all deals for this partner to delete their documents
        const dealsToDelete = await db
          .select({ id: partnerDeals.id })
          .from(partnerDeals)
          .where(eq(partnerDeals.partnerCompanyId, input.partnerId));

        // Delete documents for each deal
        for (const deal of dealsToDelete) {
          await db
            .delete(partnerDealDocuments)
            .where(eq(partnerDealDocuments.dealId, deal.id));
        }

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
});
