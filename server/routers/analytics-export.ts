import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { eq, gte, lte, desc } from "drizzle-orm";
import {
  formatKPIsForCSV,
  formatPartnerPerformanceForCSV,
  formatDealPipelineForCSV,
  formatFinancialForCSV,
  formatTrainingForCSV,
  formatCommissionForCSV,
  generateCSVFilename,
} from "../_core/csv-export";

/**
 * Analytics Export Router - CSV export procedures for all analytics data
 */
export const analyticsExportRouter = router({
  /**
   * Export executive KPIs to CSV
   */
  exportKPIs: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    const { executiveKPIs } = await import("../../drizzle/analytics-schema");

    const kpis = await db
      .select()
      .from(executiveKPIs)
      .orderBy(desc(executiveKPIs.kpiDate))
      .limit(1);

    if (!kpis[0]) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No KPI data available",
      });
    }

    const csvContent = formatKPIsForCSV(kpis[0]);
    const filename = generateCSVFilename("executive-kpis");

    return {
      filename,
      content: csvContent,
      recordCount: 1,
    };
  }),

  /**
   * Export deal pipeline funnel to CSV
   */
  exportDealPipeline: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    const { dealPipelineMetrics } = await import("../../drizzle/analytics-schema");

    const metrics = await db
      .select()
      .from(dealPipelineMetrics)
      .orderBy(dealPipelineMetrics.dealStage);

    if (metrics.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No pipeline data available",
      });
    }

    const csvContent = formatDealPipelineForCSV(
      metrics.map((m) => ({
        stage: m.dealStage,
        count: m.dealCount,
        value: m.totalValue,
        avgValue: m.avgValue,
        conversionRate: m.conversionRate,
        avgDaysInStage: m.avgDaysInStage,
      }))
    );

    const filename = generateCSVFilename("deal-pipeline");

    return {
      filename,
      content: csvContent,
      recordCount: metrics.length,
    };
  }),

  /**
   * Export partner performance metrics to CSV
   */
  exportPartnerPerformance: publicProcedure
    .input(
      z.object({
        limit: z.number().default(100),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const { partnerPerformanceMetrics } = await import("../../drizzle/analytics-schema");

      const metrics = await db
        .select()
        .from(partnerPerformanceMetrics)
        .orderBy(desc(partnerPerformanceMetrics.totalRevenue))
        .limit(input.limit);

      if (metrics.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No partner performance data available",
        });
      }

      const csvContent = formatPartnerPerformanceForCSV(metrics);
      const filename = generateCSVFilename("partner-performance");

      return {
        filename,
        content: csvContent,
        recordCount: metrics.length,
      };
    }),

  /**
   * Export financial analytics to CSV
   */
  exportFinancial: publicProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const { financialAnalytics } = await import("../../drizzle/analytics-schema");

      let query = db.select().from(financialAnalytics);

      if (input.startDate) {
        query = query.where(gte(financialAnalytics.analyticsDate, input.startDate)) as any;
      }

      if (input.endDate) {
        query = query.where(lte(financialAnalytics.analyticsDate, input.endDate)) as any;
      }

      const analytics = await query.orderBy(desc(financialAnalytics.analyticsDate));

      if (analytics.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No financial data available",
        });
      }

      const csvContent = formatFinancialForCSV(analytics);
      const filename = generateCSVFilename("financial-analytics");

      return {
        filename,
        content: csvContent,
        recordCount: analytics.length,
      };
    }),

  /**
   * Export training analytics to CSV
   */
  exportTraining: publicProcedure
    .input(
      z.object({
        limit: z.number().default(50),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const { trainingAnalytics } = await import("../../drizzle/analytics-schema");

      const analytics = await db
        .select()
        .from(trainingAnalytics)
        .limit(input.limit);

      if (analytics.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No training data available",
        });
      }

      const csvContent = formatTrainingForCSV(analytics);
      const filename = generateCSVFilename("training-analytics");

      return {
        filename,
        content: csvContent,
        recordCount: analytics.length,
      };
    }),

  /**
   * Export commission analytics to CSV
   */
  exportCommissions: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    const { financialAnalytics } = await import("../../drizzle/analytics-schema");

    const analytics = await db
      .select()
      .from(financialAnalytics)
      .orderBy(desc(financialAnalytics.analyticsDate))
      .limit(1);

    if (!analytics[0]) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No commission data available",
      });
    }

    const csvContent = formatCommissionForCSV({
      totalCommissions: analytics[0].totalCommissions,
      commissionRate: analytics[0].commissionRate,
      dealsWon: analytics[0].dealsWon,
      avgCommissionPerDeal:
        analytics[0].dealsWon > 0
          ? parseFloat(analytics[0].totalCommissions.toString()) / analytics[0].dealsWon
          : 0,
    });

    const filename = generateCSVFilename("commission-analytics");

    return {
      filename,
      content: csvContent,
      recordCount: 1,
    };
  }),

  /**
   * Export all analytics data (comprehensive export)
   */
  exportAll: publicProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const { executiveKPIs, dealPipelineMetrics, partnerPerformanceMetrics, financialAnalytics } =
        await import("../../drizzle/analytics-schema");

      // Fetch all data
      const kpis = await db
        .select()
        .from(executiveKPIs)
        .orderBy(desc(executiveKPIs.kpiDate))
        .limit(1);

      const pipeline = await db.select().from(dealPipelineMetrics);

      const partners = await db.select().from(partnerPerformanceMetrics);

      let financialQuery = db.select().from(financialAnalytics);
      if (input.startDate) {
        financialQuery = financialQuery.where(
          gte(financialAnalytics.analyticsDate, input.startDate)
        ) as any;
      }
      if (input.endDate) {
        financialQuery = financialQuery.where(
          lte(financialAnalytics.analyticsDate, input.endDate)
        ) as any;
      }
      const financial = await financialQuery.orderBy(desc(financialAnalytics.analyticsDate));

      // Generate CSV sections
      const sections = [];

      if (kpis.length > 0) {
        sections.push("=== EXECUTIVE KPIs ===");
        sections.push(formatKPIsForCSV(kpis[0]));
        sections.push("");
      }

      if (pipeline.length > 0) {
        sections.push("=== DEAL PIPELINE ===");
        sections.push(
          formatDealPipelineForCSV(
            pipeline.map((m) => ({
              stage: m.dealStage,
              count: m.dealCount,
              value: m.totalValue,
              avgValue: m.avgValue,
              conversionRate: m.conversionRate,
              avgDaysInStage: m.avgDaysInStage,
            }))
          )
        );
        sections.push("");
      }

      if (partners.length > 0) {
        sections.push("=== PARTNER PERFORMANCE ===");
        sections.push(formatPartnerPerformanceForCSV(partners));
        sections.push("");
      }

      if (financial.length > 0) {
        sections.push("=== FINANCIAL ANALYTICS ===");
        sections.push(formatFinancialForCSV(financial));
      }

      const csvContent = sections.join("\n");
      const filename = generateCSVFilename("analytics-comprehensive");

      return {
        filename,
        content: csvContent,
        recordCount: kpis.length + pipeline.length + partners.length + financial.length,
      };
    }),
});
