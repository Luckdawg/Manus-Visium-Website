import { z } from "zod";
import { publicProcedure, protectedProcedure, router, adminProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { eq, and, desc } from "drizzle-orm";

/**
 * Admin Workflow Management Router
 * Handles approval workflows, conflict policies, and scoring configurations
 */
export const adminWorkflowsRouter = router({
  /**
   * Create approval workflow
   */
  createWorkflow: protectedProcedure
    .input(
      z.object({
        workflowName: z.string().min(3),
        workflowCode: z.string().min(2),
        description: z.string().optional(),
        template: z.string().default("Standard"),
        minDealValue: z.number().optional(),
        maxDealValue: z.number().optional(),
        riskLevel: z.string().optional(),
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

      const { approvalWorkflows } = await import("../../drizzle/admin-workflow-schema");

      const result = await db.insert(approvalWorkflows).values({
        workflowName: input.workflowName,
        workflowCode: input.workflowCode,
        description: input.description,
        template: input.template,
        minDealValue: input.minDealValue?.toString() as any,
        maxDealValue: input.maxDealValue?.toString() as any,
        riskLevel: input.riskLevel,
        status: "Draft",
        createdBy: ctx.user!.id,
        createdByName: ctx.user!.name || "Unknown",
      });

      return {
        success: true,
        workflowId: (result as any).insertId,
      };
    }),

  /**
   * Get all workflows
   */
  getWorkflows: publicProcedure
    .input(
      z.object({
        status: z.string().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const { approvalWorkflows } = await import("../../drizzle/admin-workflow-schema");

      let query = db.select().from(approvalWorkflows);

      if (input.status) {
        query = query.where(eq(approvalWorkflows.status, input.status)) as any;
      }

      const workflows = await query.limit(input.limit).offset(input.offset);
      return workflows;
    }),

  /**
   * Get workflow details with stages
   */
  getWorkflowDetails: publicProcedure
    .input(z.object({ workflowId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const { approvalWorkflows, workflowStages } = await import("../../drizzle/admin-workflow-schema");

      const workflow = await db
        .select()
        .from(approvalWorkflows)
        .where(eq(approvalWorkflows.id, input.workflowId))
        .limit(1);

      if (!workflow.length) return null;

      const stages = await db
        .select()
        .from(workflowStages)
        .where(eq(workflowStages.workflowId, input.workflowId));

      return {
        ...workflow[0],
        stages,
      };
    }),

  /**
   * Update workflow
   */
  updateWorkflow: protectedProcedure
    .input(
      z.object({
        workflowId: z.number(),
        workflowName: z.string().optional(),
        description: z.string().optional(),
        status: z.string().optional(),
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

      const { approvalWorkflows, adminAuditLog } = await import("../../drizzle/admin-workflow-schema");

      // Get current workflow
      const workflow = await db
        .select()
        .from(approvalWorkflows)
        .where(eq(approvalWorkflows.id, input.workflowId))
        .limit(1);

      if (!workflow.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
      }

      // Update workflow
      const updateData: any = {};
      if (input.workflowName) updateData.workflowName = input.workflowName;
      if (input.description) updateData.description = input.description;
      if (input.status) {
        updateData.status = input.status;
        if (input.status === "Active") {
          updateData.activatedAt = new Date();
        }
      }

      await db
        .update(approvalWorkflows)
        .set(updateData)
        .where(eq(approvalWorkflows.id, input.workflowId));

      // Log audit
      await db.insert(adminAuditLog).values({
        actionType: "Updated",
        entityType: "Workflow",
        entityId: input.workflowId,
        entityName: workflow[0].workflowName,
        changeDetails: updateData as any,
        userId: ctx.user!.id,
        userName: ctx.user!.name || "Unknown",
      });

      return { success: true };
    }),

  /**
   * Add workflow stage
   */
  addWorkflowStage: protectedProcedure
    .input(
      z.object({
        workflowId: z.number(),
        stageName: z.string(),
        stageOrder: z.number(),
        requiredApproverRole: z.string(),
        requiredApproverCount: z.number().default(1),
        timeoutDays: z.number().default(5),
        canSkip: z.boolean().default(false),
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

      const { workflowStages } = await import("../../drizzle/admin-workflow-schema");

      const result = await db.insert(workflowStages).values({
        workflowId: input.workflowId,
        stageName: input.stageName,
        stageOrder: input.stageOrder,
        requiredApproverRole: input.requiredApproverRole,
        requiredApproverCount: input.requiredApproverCount,
        timeoutDays: input.timeoutDays,
        canSkip: input.canSkip,
      });

      return {
        success: true,
        stageId: (result as any).insertId,
      };
    }),

  /**
   * Create conflict policy
   */
  createConflictPolicy: protectedProcedure
    .input(
      z.object({
        policyName: z.string().min(3),
        policyCode: z.string().min(2),
        conflictType: z.string(),
        description: z.string().optional(),
        defaultSeverity: z.string().default("Medium"),
        autoResolve: z.boolean().default(false),
        resolutionStrategy: z.string().optional(),
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

      const { conflictPolicies } = await import("../../drizzle/admin-workflow-schema");

      const result = await db.insert(conflictPolicies).values({
        policyName: input.policyName,
        policyCode: input.policyCode,
        conflictType: input.conflictType,
        description: input.description,
        defaultSeverity: input.defaultSeverity,
        autoResolve: input.autoResolve,
        resolutionStrategy: input.resolutionStrategy,
        createdBy: ctx.user!.id,
        createdByName: ctx.user!.name || "Unknown",
      });

      return {
        success: true,
        policyId: (result as any).insertId,
      };
    }),

  /**
   * Get all conflict policies
   */
  getConflictPolicies: publicProcedure
    .input(
      z.object({
        conflictType: z.string().optional(),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const { conflictPolicies } = await import("../../drizzle/admin-workflow-schema");

      let query = db.select().from(conflictPolicies);

      if (input.conflictType) {
        query = query.where(eq(conflictPolicies.conflictType, input.conflictType)) as any;
      }

      const policies = await query.limit(input.limit);
      return policies;
    }),

  /**
   * Create scoring rule
   */
  createScoringRule: protectedProcedure
    .input(
      z.object({
        ruleName: z.string().min(3),
        ruleCode: z.string().min(2),
        category: z.string(),
        weight: z.number().min(1).max(100),
        description: z.string().optional(),
        qualificationThreshold: z.number().default(50),
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

      const { scoringRulesConfig } = await import("../../drizzle/admin-workflow-schema");

      const result = await db.insert(scoringRulesConfig).values({
        ruleName: input.ruleName,
        ruleCode: input.ruleCode,
        category: input.category,
        weight: input.weight,
        description: input.description,
        qualificationThreshold: input.qualificationThreshold,
        createdBy: ctx.user!.id,
        createdByName: ctx.user!.name || "Unknown",
      });

      return {
        success: true,
        ruleId: (result as any).insertId,
      };
    }),

  /**
   * Get all scoring rules
   */
  getScoringRules: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const { scoringRulesConfig } = await import("../../drizzle/admin-workflow-schema");

      let query = db.select().from(scoringRulesConfig);

      if (input.category) {
        query = query.where(eq(scoringRulesConfig.category, input.category)) as any;
      }

      const rules = await query.limit(input.limit);
      return rules;
    }),

  /**
   * Get admin audit log
   */
  getAuditLog: publicProcedure
    .input(
      z.object({
        entityType: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const { adminAuditLog } = await import("../../drizzle/admin-workflow-schema");

      let query = db.select().from(adminAuditLog);

      if (input.entityType) {
        query = query.where(eq(adminAuditLog.entityType, input.entityType)) as any;
      }

      const logs = await query
        .orderBy(desc(adminAuditLog.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return logs;
    }),

  /**
   * Get admin dashboard metrics
   */
  getDashboardMetrics: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return {};

    const { approvalWorkflows, conflictPolicies, scoringRulesConfig } = await import("../../drizzle/admin-workflow-schema");

    const workflows = await db.select().from(approvalWorkflows);
    const policies = await db.select().from(conflictPolicies);
    const rules = await db.select().from(scoringRulesConfig);

    return {
      totalWorkflows: workflows.length,
      activeWorkflows: workflows.filter((w) => w.status === "Active").length,
      totalConflictPolicies: policies.length,
      activePolicies: policies.filter((p) => p.isActive).length,
      totalScoringRules: rules.length,
      activeScoringRules: rules.filter((r) => r.isActive).length,
    };
  }),
});
