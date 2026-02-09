import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import {
  partnerCompanies,
  partnerUsers,
  partnerDeals,
  partnerResources,
  partnerMdfClaims,
} from "../../drizzle/partner-schema";
import { eq, and, desc } from "drizzle-orm";
import { EmailNotificationService } from "../services/emailNotificationService";

/**
 * Partner Portal Router
 * Handles all partner-related operations including deals, resources, analytics, and MDF
 */
export const partnerRouter = router({
  /**
   * Get partner company profile
   */
  getPartnerProfile: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user || ctx.user.role !== "partner") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Not a partner user" });
    }

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Get partner user record
    const partnerUser = await db
      .select()
      .from(partnerUsers)
      .where(eq(partnerUsers.userId, ctx.user.id))
      .limit(1);

    if (partnerUser.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Partner profile not found",
      });
    }

    // Get partner company
    const company = await db
      .select()
      .from(partnerCompanies)
      .where(eq(partnerCompanies.id, partnerUser[0].partnerCompanyId))
      .limit(1);

    return {
      user: partnerUser[0],
      company: company[0] || null,
    };
  }),

  /**
   * Get partner deals with filtering
   */
  getPartnerDeals: protectedProcedure
    .input(
      z.object({
        stage: z
          .enum([
            "Qualified Lead",
            "Proposal",
            "Negotiation",
            "Closed Won",
            "Closed Lost",
          ])
          .optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.user || ctx.user.role !== "partner") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const partnerUser = await db
        .select()
        .from(partnerUsers)
        .where(eq(partnerUsers.userId, ctx.user.id))
        .limit(1);

      if (partnerUser.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const whereConditions = [eq(partnerDeals.partnerCompanyId, partnerUser[0].partnerCompanyId)];
      if (input.stage) {
        whereConditions.push(eq(partnerDeals.dealStage, input.stage));
      }

      const deals = await db
        .select()
        .from(partnerDeals)
        .where(and(...whereConditions))
        .orderBy(desc(partnerDeals.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return deals;
    }),

  /**
   * Submit a new partner deal
   */
  submitDeal: protectedProcedure
    .input(
      z.object({
        dealName: z.string().min(1),
        customerName: z.string().min(1),
        customerEmail: z.string().email(),
        dealAmount: z.number().positive(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user || ctx.user.role !== "partner") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const partnerUser = await db
        .select()
        .from(partnerUsers)
        .where(eq(partnerUsers.userId, ctx.user.id))
        .limit(1);

      if (partnerUser.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const partnerCompany = await db
        .select()
        .from(partnerCompanies)
        .where(eq(partnerCompanies.id, partnerUser[0].partnerCompanyId))
        .limit(1);

      if (partnerCompany.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Calculate commission
      const commissionRate = Number(partnerCompany[0].commissionRate) || 10;
      const commissionAmount = input.dealAmount * (commissionRate / 100);

      await db.insert(partnerDeals).values({
        dealName: input.dealName,
        partnerCompanyId: partnerUser[0].partnerCompanyId,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        dealAmount: input.dealAmount.toString(),
        dealStage: "Qualified Lead",
        description: input.description,
        commissionPercentage: commissionRate.toString(),
        commissionAmount: commissionAmount.toString(),
        submittedBy: ctx.user.id,
      });

      // Send email notification
      try {
        await EmailNotificationService.sendNotification(
          partnerUser[0].partnerCompanyId,
          "deal_submitted",
          {
            partnerName: partnerCompany[0].companyName,
            dealName: input.dealName,
            customerName: input.customerName,
            dealAmount: input.dealAmount.toFixed(2),
            dealStage: "Qualified Lead",
          },
          "deal"
        );
      } catch (error) {
        console.error("Failed to send deal notification:", error);
      }

      return { success: true, dealName: input.dealName };
    }),

  /**
   * Get partner resources
   */
  getPartnerResources: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.user || ctx.user.role !== "partner") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const resources = await db
        .select()
        .from(partnerResources)
        .orderBy(desc(partnerResources.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return resources;
    }),

  /**
   * Get dashboard summary
   */
  getDashboardSummary: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user || ctx.user.role !== "partner") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const partnerUser = await db
      .select()
      .from(partnerUsers)
      .where(eq(partnerUsers.userId, ctx.user.id))
      .limit(1);

    if (partnerUser.length === 0) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    const partnerCompanyId = partnerUser[0].partnerCompanyId;

    // Get company info
    const company = await db
      .select()
      .from(partnerCompanies)
      .where(eq(partnerCompanies.id, partnerCompanyId))
      .limit(1);

    // Get active deals
    const activeDeals = await db
      .select()
      .from(partnerDeals)
      .where(
        and(
          eq(partnerDeals.partnerCompanyId, partnerCompanyId),
          desc(partnerDeals.dealStage)
        )
      );

    return {
      company: company[0],
      activeDealCount: activeDeals.length,
      commissionRate: company[0]?.commissionRate || "10.00",
      mdfBudget: company[0]?.mdfBudgetAnnual || "0.00",
      tier: company[0]?.tier || "Standard",
      recentDeals: activeDeals.slice(0, 5),
    };
  }),

  /**
   * Get MDF information
   */
  getMdfInfo: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user || ctx.user.role !== "partner") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const partnerUser = await db
      .select()
      .from(partnerUsers)
      .where(eq(partnerUsers.userId, ctx.user.id))
      .limit(1);

    if (partnerUser.length === 0) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    const partnerCompanyId = partnerUser[0].partnerCompanyId;

    // Get company MDF budget
    const company = await db
      .select()
      .from(partnerCompanies)
      .where(eq(partnerCompanies.id, partnerCompanyId))
      .limit(1);

    // Get MDF claims
    const claims = await db
      .select()
      .from(partnerMdfClaims)
      .where(eq(partnerMdfClaims.partnerCompanyId, partnerCompanyId));

    // Calculate used amount
    const usedAmount = claims
      .filter((c) => c.status === "Paid")
      .reduce((sum, c) => sum + Number(c.paidAmount || 0), 0);

    return {
      totalBudget: company[0]?.mdfBudgetAnnual || "0.00",
      usedAmount: usedAmount.toString(),
      availableAmount: (Number(company[0]?.mdfBudgetAnnual || 0) - usedAmount).toString(),
      claims: claims,
    };
  }),

  /**
   * Submit MDF claim
   */
  submitMdfClaim: protectedProcedure
    .input(
      z.object({
        claimName: z.string().min(1),
        campaignType: z.enum([
          "Digital Marketing",
          "Event Sponsorship",
          "Content Creation",
          "Sales Enablement",
          "Training",
          "Co-Marketing",
          "Other",
        ]),
        requestedAmount: z.number().positive(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user || ctx.user.role !== "partner") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const partnerUser = await db
        .select()
        .from(partnerUsers)
        .where(eq(partnerUsers.userId, ctx.user.id))
        .limit(1);

      if (partnerUser.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const partnerCompany = await db
        .select()
        .from(partnerCompanies)
        .where(eq(partnerCompanies.id, partnerUser[0].partnerCompanyId))
        .limit(1);

      if (partnerCompany.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await db.insert(partnerMdfClaims).values({
        partnerCompanyId: partnerUser[0].partnerCompanyId,
        claimName: input.claimName,
        campaignType: input.campaignType,
        requestedAmount: input.requestedAmount.toString(),
        description: input.description,
        status: "Draft",
        submittedBy: ctx.user.id,
      });

      // Send email notification
      try {
        await EmailNotificationService.sendNotification(
          partnerUser[0].partnerCompanyId,
          "mdf_submitted",
          {
            partnerName: partnerCompany[0].companyName,
            claimName: input.claimName,
            campaignType: input.campaignType,
            requestedAmount: input.requestedAmount.toFixed(2),
          },
          "mdf_claim"
        );
      } catch (error) {
        console.error("Failed to send MDF notification:", error);
      }

      return { success: true, claimName: input.claimName };
    }),
});
