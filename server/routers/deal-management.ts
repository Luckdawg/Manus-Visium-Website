import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { eq, and, gte, lte, inArray, desc } from "drizzle-orm";

/**
 * Deal Management Router
 * Handles multi-stage approvals, conflict detection, deal scoring, and pipeline management
 */
export const dealManagementRouter = router({
  /**
   * Create enhanced deal with initial stage
   */
  createDeal: protectedProcedure
    .input(
      z.object({
        dealName: z.string().min(3),
        customerName: z.string().min(2),
        dealValue: z.number().positive(),
        description: z.string().optional(),
        expectedCloseDate: z.date().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const { enhancedDeals, dealActivityLog } = await import("../../drizzle/deal-management-schema");

      // Generate deal number
      const dealNumber = `DEAL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Convert dealValue to decimal string
      const dealValueStr = input.dealValue.toString();

      const result = await db.insert(enhancedDeals).values({
        dealNumber,
        dealName: input.dealName,
        customerName: input.customerName,
        dealValue: dealValueStr as any,
        dealCurrency: "USD",
        description: input.description,
        expectedCloseDate: input.expectedCloseDate,
        currentStage: "Submitted" as any,
        dealStatus: "Active" as any,
        partnerDealId: 0, // Will be linked to existing deal
      });

      const dealId = (result as any).insertId;

      // Log activity
      await db.insert(dealActivityLog).values({
        dealId,
        dealNumber,
        activityType: "Created",
        activityDescription: `Deal created: ${input.dealName}`,
        userId: ctx.user!.id,
        userName: ctx.user!.name || "Unknown",
      });

      return {
        success: true,
        dealId,
        dealNumber,
      };
    }),

  /**
   * Get deal details
   */
  getDeal: publicProcedure
    .input(z.object({ dealId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const { enhancedDeals } = await import("../../drizzle/deal-management-schema");

      const deal = await db
        .select()
        .from(enhancedDeals)
        .where(eq(enhancedDeals.id, input.dealId))
        .limit(1);

      return deal[0] || null;
    }),

  /**
   * Get deals by stage
   */
  getDealsByStage: publicProcedure
    .input(
      z.object({
        stage: z.string(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const { enhancedDeals } = await import("../../drizzle/deal-management-schema");

      const deals = await db
        .select()
        .from(enhancedDeals)
        .where(eq(enhancedDeals.currentStage, input.stage as any))
        .limit(input.limit)
        .offset(input.offset);

      return deals;
    }),

  /**
   * Get pipeline overview with all stages
   */
  getPipelineOverview: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return {};

    const { enhancedDeals } = await import("../../drizzle/deal-management-schema");

    const stages = [
      "Submitted",
      "Qualified",
      "In Review",
      "Approved",
      "Rejected",
      "Won",
      "Lost",
    ];

    const overview: Record<string, { count: number; totalValue: number }> = {};

    for (const stage of stages) {
      const deals = await db
        .select()
        .from(enhancedDeals)
        .where(eq(enhancedDeals.currentStage, stage as any));

      overview[stage] = {
        count: deals.length,
        totalValue: deals.reduce((sum, d) => sum + Number(d.dealValue), 0),
      };
    }

    return overview;
  }),

  /**
   * Move deal to next stage
   */
  moveDealToStage: protectedProcedure
    .input(
      z.object({
        dealId: z.number(),
        toStage: z.string(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const { enhancedDeals, dealPipelineProgress, dealActivityLog } = await import("../../drizzle/deal-management-schema");

      // Get current deal
      const deal = await db
        .select()
        .from(enhancedDeals)
        .where(eq(enhancedDeals.id, input.dealId))
        .limit(1);

      if (!deal.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Deal not found",
        });
      }

      const fromStage = deal[0].currentStage;

      // Update deal stage
      await db
        .update(enhancedDeals)
        .set({ currentStage: input.toStage as any })
        .where(eq(enhancedDeals.id, input.dealId));

      // Record pipeline progress
      await db.insert(dealPipelineProgress).values({
        dealId: input.dealId,
        dealNumber: deal[0].dealNumber,
        fromStage: fromStage as any,
        toStage: input.toStage as any,
        transitionReason: input.reason,
        movedByUserId: ctx.user!.id,
        movedByName: ctx.user!.name || "Unknown",
      });

      // Log activity
      await db.insert(dealActivityLog).values({
        dealId: input.dealId,
        dealNumber: deal[0].dealNumber,
        activityType: "Stage Changed",
        activityDescription: `Deal moved from ${fromStage} to ${input.toStage}`,
        userId: ctx.user!.id,
        userName: ctx.user!.name || "Unknown",
      });

      return { success: true };
    }),

  /**
   * Submit deal for approval
   */
  submitForApproval: protectedProcedure
    .input(
      z.object({
        dealId: z.number(),
        approvalLevel: z.string().default("Standard"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const { enhancedDeals, dealApprovals, dealActivityLog } = await import("../../drizzle/deal-management-schema");

      // Get deal
      const deal = await db
        .select()
        .from(enhancedDeals)
        .where(eq(enhancedDeals.id, input.dealId))
        .limit(1);

      if (!deal.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Deal not found",
        });
      }

      // Update deal
      await db
        .update(enhancedDeals)
        .set({
          currentStage: "In Review" as any,
          approvalLevel: input.approvalLevel,
        })
        .where(eq(enhancedDeals.id, input.dealId));

      // Create approval workflow
      const approvalStages = [
        { stage: "Manager Review", order: 1 },
        { stage: "Compliance Check", order: 2 },
        ...(input.approvalLevel === "Executive"
          ? [{ stage: "Executive Approval", order: 3 }]
          : []),
      ];

      for (const approval of approvalStages) {
        await db.insert(dealApprovals).values({
          dealId: input.dealId,
          dealNumber: deal[0].dealNumber,
          approvalStage: approval.stage,
          approvalOrder: approval.order,
          status: "Pending",
        });
      }

      // Log activity
      await db.insert(dealActivityLog).values({
        dealId: input.dealId,
        dealNumber: deal[0].dealNumber,
        activityType: "Submitted for Approval",
        activityDescription: `Deal submitted for ${input.approvalLevel} approval`,
        userId: ctx.user!.id,
        userName: ctx.user!.name || "Unknown",
      });

      return { success: true };
    }),

  /**
   * Get deal approvals
   */
  getDealApprovals: publicProcedure
    .input(z.object({ dealId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const { dealApprovals } = await import("../../drizzle/deal-management-schema");

      const approvals = await db
        .select()
        .from(dealApprovals)
        .where(eq(dealApprovals.dealId, input.dealId));

      return approvals;
    }),

  /**
   * Approve deal at current stage
   */
  approveDeal: protectedProcedure
    .input(
      z.object({
        dealId: z.number(),
        approvalId: z.number(),
        comments: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const { dealApprovals, enhancedDeals, dealActivityLog } = await import("../../drizzle/deal-management-schema");

      // Get approval
      const approval = await db
        .select()
        .from(dealApprovals)
        .where(eq(dealApprovals.id, input.approvalId))
        .limit(1);

      if (!approval.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Approval not found",
        });
      }

      // Update approval
      await db
        .update(dealApprovals)
        .set({
          status: "Approved",
          approvedAt: new Date(),
          approverUserId: ctx.user!.id,
          approverName: ctx.user!.name || "Unknown",
          comments: input.comments,
        })
        .where(eq(dealApprovals.id, input.approvalId));

      // Check if all approvals are complete
      const allApprovals = await db
        .select()
        .from(dealApprovals)
        .where(eq(dealApprovals.dealId, input.dealId));

      const allApproved = allApprovals.every((a) => a.status === "Approved");

      if (allApproved) {
        // Move deal to approved stage
        await db
          .update(enhancedDeals)
          .set({ currentStage: "Approved" as any })
          .where(eq(enhancedDeals.id, input.dealId));
      }

      // Log activity
      const deal = await db
        .select()
        .from(enhancedDeals)
        .where(eq(enhancedDeals.id, input.dealId))
        .limit(1);

      if (deal.length) {
        await db.insert(dealActivityLog).values({
          dealId: input.dealId,
          dealNumber: deal[0].dealNumber,
          activityType: "Approved",
          activityDescription: `${approval[0].approvalStage} approved`,
          userId: ctx.user!.id,
          userName: ctx.user!.name || "Unknown",
        });
      }

      return { success: true, allApproved };
    }),

  /**
   * Reject deal
   */
  rejectDeal: protectedProcedure
    .input(
      z.object({
        dealId: z.number(),
        approvalId: z.number(),
        reason: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const { dealApprovals, enhancedDeals, dealActivityLog } = await import("../../drizzle/deal-management-schema");

      // Update approval
      await db
        .update(dealApprovals)
        .set({
          status: "Rejected",
          rejectedAt: new Date(),
          approverUserId: ctx.user!.id,
          approverName: ctx.user!.name || "Unknown",
          rejectionReason: input.reason,
        })
        .where(eq(dealApprovals.id, input.approvalId));

      // Move deal to rejected stage
      await db
        .update(enhancedDeals)
        .set({ currentStage: "Rejected" as any, dealStatus: "Closed Lost" as any })
        .where(eq(enhancedDeals.id, input.dealId));

      // Log activity
      const deal = await db
        .select()
        .from(enhancedDeals)
        .where(eq(enhancedDeals.id, input.dealId))
        .limit(1);

      if (deal.length) {
        await db.insert(dealActivityLog).values({
          dealId: input.dealId,
          dealNumber: deal[0].dealNumber,
          activityType: "Rejected",
          activityDescription: `Deal rejected: ${input.reason}`,
          userId: ctx.user!.id,
          userName: ctx.user!.name || "Unknown",
        });
      }

      return { success: true };
    }),

  /**
   * Check for conflicts
   */
  checkForConflicts: protectedProcedure
    .input(z.object({ dealId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const { enhancedDeals, dealConflicts } = await import("../../drizzle/deal-management-schema");

      // Get deal
      const deal = await db
        .select()
        .from(enhancedDeals)
        .where(eq(enhancedDeals.id, input.dealId))
        .limit(1);

      if (!deal.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Deal not found",
        });
      }

      // Check for existing conflicts (simplified logic)
      const existingConflicts = await db
        .select()
        .from(dealConflicts)
        .where(eq(dealConflicts.dealId, input.dealId));

      return {
        hasConflict: existingConflicts.length > 0,
        conflicts: existingConflicts,
      };
    }),

  /**
   * Create conflict record
   */
  createConflict: protectedProcedure
    .input(
      z.object({
        dealId: z.number(),
        conflictType: z.string(),
        description: z.string(),
        severity: z.string().default("Medium"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const { enhancedDeals, dealConflicts } = await import("../../drizzle/deal-management-schema");

      // Get deal
      const deal = await db
        .select()
        .from(enhancedDeals)
        .where(eq(enhancedDeals.id, input.dealId))
        .limit(1);

      if (!deal.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Deal not found",
        });
      }

      // Create conflict
      const result = await db.insert(dealConflicts).values({
        dealId: input.dealId,
        dealNumber: deal[0].dealNumber,
        conflictType: input.conflictType as any,
        severity: input.severity as any,
        description: input.description,
        resolutionStatus: "Unresolved",
        assignedToUserId: ctx.user!.id,
        assignedToName: ctx.user!.name || "Unknown",
      });

      // Update deal
      await db
        .update(enhancedDeals)
        .set({ hasConflict: true })
        .where(eq(enhancedDeals.id, input.dealId));

      return {
        success: true,
        conflictId: (result as any).insertId,
      };
    }),

  /**
   * Get deal activity log
   */
  getDealActivityLog: publicProcedure
    .input(
      z.object({
        dealId: z.number(),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const { dealActivityLog } = await import("../../drizzle/deal-management-schema");

      const activities = await db
        .select()
        .from(dealActivityLog)
        .where(eq(dealActivityLog.dealId, input.dealId))
        .orderBy(desc(dealActivityLog.createdAt))
        .limit(input.limit);

      return activities;
    }),

  /**
   * Calculate deal score
   */
  calculateDealScore: protectedProcedure
    .input(
      z.object({
        dealId: z.number(),
        dealValue: z.number(),
        customerIndustry: z.string().optional(),
        daysToClose: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Simplified scoring logic
      let score = 0;

      // Deal value scoring (0-40 points)
      if (input.dealValue >= 100000) score += 40;
      else if (input.dealValue >= 50000) score += 30;
      else if (input.dealValue >= 10000) score += 20;
      else score += 10;

      // Timeline scoring (0-30 points)
      if (input.daysToClose && input.daysToClose <= 30) score += 30;
      else if (input.daysToClose && input.daysToClose <= 60) score += 20;
      else if (input.daysToClose && input.daysToClose <= 90) score += 10;

      // Industry scoring (0-30 points)
      const highValueIndustries = ["Technology", "Finance", "Healthcare"];
      if (input.customerIndustry && highValueIndustries.includes(input.customerIndustry)) {
        score += 30;
      } else if (input.customerIndustry) {
        score += 15;
      }

      return {
        dealScore: Math.min(score, 100),
      };
    }),
});
