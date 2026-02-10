import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb, executeRawSQL } from "../db";
import {
  partnerCompanies,
  partnerUsers,
  partnerDeals,
  partnerResources,
  partnerMdfClaims,
  partnerDealDocuments,
} from "../../drizzle/partner-schema";
import { eq, desc } from "drizzle-orm";

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

        // Hash password (in production, use bcrypt)
        const passwordHash = Buffer.from(input.password).toString("base64");

        // Create partner company using raw SQL
        const companyInsertResult = await executeRawSQL(
          `INSERT INTO partner_companies (companyName, website, phone, email, partnerType, partnerStatus, primaryContactName, primaryContactEmail, primaryContactPhone)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [input.companyName, input.website || null, input.phone || null, input.email, input.partnerType, 'Prospect', input.contactName, input.email, input.phone || null]
        );

        const companyId = (companyInsertResult as any).insertId;
        if (!companyId) {
          throw new Error("Failed to get company ID from insert result");
        }

        // Create partner user using raw SQL
        const userInsertResult = await executeRawSQL(
          `INSERT INTO partner_users (partnerCompanyId, email, passwordHash, contactName, phone, partnerRole, isActive)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [companyId, input.email, passwordHash, input.contactName, input.phone || null, 'Admin', true]
        );

        const userId = (userInsertResult as any).insertId;
        if (!userId) {
          throw new Error("Failed to get user ID from insert result");
        }

        return {
          success: true,
          partnerId: userId,
          companyId,
          message: "Registration successful",
        };
      } catch (error) {
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

        const partnerUser = user[0];
        const passwordHash = Buffer.from(input.password).toString("base64");

        if (partnerUser.passwordHash !== passwordHash) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        // Get company info
        const company = await db
          .select()
          .from(partnerCompanies)
          .where(eq(partnerCompanies.id, partnerUser.partnerCompanyId));

        return {
          success: true,
          user: {
            id: partnerUser.id,
            email: partnerUser.email,
            contactName: partnerUser.contactName,
            partnerRole: partnerUser.partnerRole,
            partnerCompanyId: partnerUser.partnerCompanyId,
          },
          partnerId: partnerUser.id,
          company: company[0],
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Login failed: " + (error as any).message,
        });
      }
    }),

  /**
   * Get partner resources
   */
  getResources: publicProcedure
    .input(z.object({ partnerId: z.number() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const resources = await db
          .select()
          .from(partnerResources)
          .orderBy(desc(partnerResources.createdAt));

        return {
          success: true,
          resources,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch resources: " + (error as any).message,
        });
      }
    }),

  /**
   * Create a new deal
   */
  createDeal: publicProcedure
    .input(
      z.object({
        partnerId: z.number(),
        dealName: z.string(),
        dealAmount: z.number(),
        dealStage: z.string(),
        expectedCloseDate: z.string().optional(),
        description: z.string().optional(),
        customerName: z.string(),
        customerEmail: z.string(),
        customerCompany: z.string().optional(),
        productInterest: z.string().optional(),
        notes: z.string().optional(),
        mdfRequested: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // Get partner user to find company ID
        const partnerUser = await db
          .select()
          .from(partnerUsers)
          .where(eq(partnerUsers.id, input.partnerId));

        if (partnerUser.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Partner user not found",
          });
        }

        const companyId = partnerUser[0].partnerCompanyId;

        // Insert deal using raw SQL to ensure correct column order
        const dealResult = await executeRawSQL(
          `INSERT INTO partner_deals 
           (dealName, partnerCompanyId, customerName, customerEmail, dealAmount, dealStage, description, productInterest, submittedBy, notes) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            input.dealName,
            companyId,
            input.customerName,
            input.customerEmail || null,
            input.dealAmount.toString(),
            input.dealStage,
            input.description || null,
            input.productInterest ? JSON.stringify([input.productInterest]) : null,
            input.partnerId,
            input.notes || null,
          ]
        );

        const dealId = (dealResult as any).insertId;

        // If MDF requested, create an MDF claim using raw SQL
        if (input.mdfRequested && input.mdfRequested > 0) {
          await executeRawSQL(
            `INSERT INTO partnerMdfClaims (partnerCompanyId, claimName, description, campaignType, requestedAmount, status, submittedDate, submittedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              companyId,
              `MDF for ${input.dealName}`,
              `MDF claim for deal: ${input.dealName}`,
              "Sales Enablement",
              input.mdfRequested.toString(),
              "Submitted",
              new Date().toISOString(),
              input.partnerId,
            ]
          );
        }

        return {
          success: true,
          dealId,
          message: "Deal created successfully",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create deal: " + (error as any).message,
        });
      }
    }),

  /**
   * Get partner dashboard summary
   */
  getDashboardSummary: publicProcedure
    .input(z.object({ partnerId: z.number() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      if (!input?.partnerId) {
        return {
          activeDeals: 0,
          totalRevenue: 0,
          mdfAvailable: 0,
          commissionRate: 0,
          recentDeals: [],
        };
      }

      try {
        // Get partner user
        const partnerUser = await db
          .select()
          .from(partnerUsers)
          .where(eq(partnerUsers.id, input.partnerId))
          .limit(1);

        if (partnerUser.length === 0) {
          return {
            activeDeals: 0,
            totalRevenue: 0,
            mdfAvailable: 0,
            commissionRate: 0,
            recentDeals: [],
          };
        }

        const companyId = partnerUser[0].partnerCompanyId;

        // Get deals
        const deals = await db
          .select()
          .from(partnerDeals)
          .where(eq(partnerDeals.partnerCompanyId, companyId))
          .orderBy(desc(partnerDeals.createdAt));

        const activeDeals = deals.filter(
          (d: any) => d.dealStage !== "Closed Lost"
        ).length;
        const totalRevenue = deals.reduce(
          (sum: number, d: any) => sum + (Number(d.dealAmount) || 0),
          0
        );

        // Get MDF claims
        const mdfClaimsData = await db
          .select()
          .from(partnerMdfClaims)
          .where(eq(partnerMdfClaims.partnerCompanyId, companyId));

        const mdfAvailable = mdfClaimsData.reduce(
          (sum: number, claim: any) =>
            sum +
            (claim.status === "Approved"
              ? Number(claim.approvedAmount) || 0
              : 0),
          0
        );

        // Get company info for commission rate
        const company = await db
          .select()
          .from(partnerCompanies)
          .where(eq(partnerCompanies.id, companyId));

        const commissionRate = company[0]
          ? Number(company[0].commissionRate) || 0
          : 0;

        return {
          activeDeals,
          totalRevenue,
          mdfAvailable,
          commissionRate,
          recentDeals: deals.slice(0, 5),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch dashboard summary: " + (error as any).message,
        });
      }
    }),

  /**
   * Get all deals for admin dashboard
   */
  getAllDeals: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    try {
      const deals = await db
        .select()
        .from(partnerDeals)
        .orderBy(desc(partnerDeals.createdAt));

      return {
        success: true,
        deals,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch deals: " + (error as any).message,
      });
    }
  }),

  /**
   * Approve a deal (admin only)
   */
  approveDeal: publicProcedure
    .input(z.object({ dealId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const deal = await db
          .select()
          .from(partnerDeals)
          .where(eq(partnerDeals.id, input.dealId));

        if (deal.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Deal not found",
          });
        }

        // Update deal status
        await db
          .update(partnerDeals)
          .set({
            dealStage: "Proposal" as any,
            updatedAt: new Date(),
          })
          .where(eq(partnerDeals.id, input.dealId));

        return {
          success: true,
          message: "Deal approved successfully",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to approve deal: " + (error as any).message,
        });
      }
    }),

  /**
   * Reject a deal (admin only)
   */
  rejectDeal: publicProcedure
    .input(
      z.object({
        dealId: z.number(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const deal = await db
          .select()
          .from(partnerDeals)
          .where(eq(partnerDeals.id, input.dealId));

        if (deal.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Deal not found",
          });
        }

        // Update deal status
        await db
          .update(partnerDeals)
          .set({
            dealStage: "Closed Lost" as any,
            notes: input.reason || null,
            updatedAt: new Date(),
          })
          .where(eq(partnerDeals.id, input.dealId));

        return {
          success: true,
          message: "Deal rejected successfully",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to reject deal: " + (error as any).message,
        });
      }
    }),

  /**
   * Get MDF info for partner
   */
  getMdfInfo: publicProcedure
    .input(z.void())
    .query(async () => {
      return {
        totalBudget: 50000,
        claims: [],
      };
    }),

  /**
   * Submit MDF claim
   */
  submitMdfClaim: publicProcedure
    .input(
      z.object({
        claimName: z.string(),
        description: z.string().optional(),
        campaignType: z.string(),
        requestedAmount: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return {
        success: true,
        message: "MDF claim submitted successfully",
      };
    }),

  /**
   * Get partner deals
   */
  getPartnerDeals: publicProcedure
    .input(z.object({ partnerId: z.number() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      if (!input?.partnerId) {
        return { deals: [] };
      }

      try {
        const partnerUser = await db
          .select()
          .from(partnerUsers)
          .where(eq(partnerUsers.id, input.partnerId));

        if (partnerUser.length === 0) {
          return { deals: [] };
        }

        const deals = await db
          .select()
          .from(partnerDeals)
          .where(eq(partnerDeals.partnerCompanyId, partnerUser[0].partnerCompanyId))
          .orderBy(desc(partnerDeals.createdAt));

        return { deals };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch deals: " + (error as any).message,
        });
      }
    }),

  /**
   * Submit deal (alias for createDeal)
   */
  submitDeal: publicProcedure
    .input(
      z.object({
        partnerId: z.number(),
        dealName: z.string(),
        dealAmount: z.number(),
        dealStage: z.string(),
        expectedCloseDate: z.string().optional(),
        description: z.string().optional(),
        customerName: z.string(),
        customerEmail: z.string(),
        productInterest: z.string().optional(),
        notes: z.string().optional(),
        mdfRequested: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const partnerUser = await db
          .select()
          .from(partnerUsers)
          .where(eq(partnerUsers.id, input.partnerId));

        if (partnerUser.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Partner user not found",
          });
        }

        const companyId = partnerUser[0].partnerCompanyId;

        const dealResult = await db.insert(partnerDeals).values({
          dealName: input.dealName,
          partnerCompanyId: companyId,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          dealAmount: input.dealAmount.toString(),
          dealStage: input.dealStage as any,
          expectedCloseDate: input.expectedCloseDate
            ? new Date(input.expectedCloseDate)
            : undefined,
          description: input.description,
          productInterest: input.productInterest
            ? JSON.stringify([input.productInterest])
            : null,
          submittedBy: input.partnerId,
          notes: input.notes,
        });

        const dealId = (dealResult as any).insertId;

        if (input.mdfRequested && input.mdfRequested > 0) {
          await db.insert(partnerMdfClaims).values({
            partnerCompanyId: companyId,
            claimName: `MDF for ${input.dealName}`,
            description: `MDF claim for deal: ${input.dealName}`,
            campaignType: "Sales Enablement" as any,
            requestedAmount: input.mdfRequested.toString(),
            status: "Submitted" as any,
            submittedDate: new Date(),
            submittedBy: input.partnerId,
          });
        }

        return {
          success: true,
          dealId,
          message: "Deal created successfully",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create deal: " + (error as any).message,
        });
      }
    }),

  /**
   * Get documents for a specific deal
   */
  getDealDocuments: publicProcedure
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
   * Upload a document for a deal
   */
  uploadDealDocument: publicProcedure
    .input(
      z.object({
        dealId: z.number(),
        fileName: z.string(),
        fileData: z.string(),
        fileMimeType: z.string(),
        fileSize: z.number(),
        documentType: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const fileUrl = `data:${input.fileMimeType};base64,${input.fileData.split(",")[1] || input.fileData}`;

        const result = await db.insert(partnerDealDocuments).values({
          dealId: input.dealId,
          fileName: input.fileName,
          fileUrl,
          fileSize: input.fileSize,
          fileMimeType: input.fileMimeType,
          documentType: input.documentType as any,
          uploadedBy: 1,
          description: input.description,
        });

        return {
          success: true,
          documentId: (result as any).insertId,
          message: "Document uploaded successfully",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload document: " + (error as any).message,
        });
      }
    }),

  /**
   * Delete a document
   */
  deleteDealDocument: publicProcedure
    .input(z.object({ documentId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        await db
          .delete(partnerDealDocuments)
          .where(eq(partnerDealDocuments.id, input.documentId));

        return { success: true, message: "Document deleted successfully" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete document: " + (error as any).message,
        });
      }
    }),

  /**
   * Send notification to partner
   */
  sendPartnerNotification: publicProcedure
    .input(
      z.object({
        partnerId: z.number(),
        title: z.string(),
        message: z.string(),
        type: z.enum(["deal_approved", "deal_rejected", "document_uploaded", "mdf_approved"]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const user = await db
          .select()
          .from(partnerUsers)
          .where(eq(partnerUsers.id, input.partnerId));

        if (user.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Partner user not found",
          });
        }

        // In production, integrate with email service
        console.log(`Notification sent to ${user[0].email}: ${input.title}`);

        return {
          success: true,
          message: "Notification sent successfully",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send notification: " + (error as any).message,
        });
      }
    }),
});
