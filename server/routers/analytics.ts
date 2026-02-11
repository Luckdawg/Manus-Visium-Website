import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { eq, gte, lte, desc } from "drizzle-orm";
import { cacheManager, cacheKeys, cacheTTL, invalidateCache } from "../_core/cache";

/**
 * Analytics Router - Executive dashboards, metrics, and reporting
 */
export const analyticsRouter = router({
  /**
   * Get executive dashboard KPIs
   */
  getExecutiveKPIs: publicProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ input }) => {
      const cacheKey = "analytics:executive_kpis";

      return cacheManager.getOrCompute(
        cacheKey,
        async () => {
          const db = await getDb();
          if (!db) return null;

          const { executiveKPIs } = await import("../../drizzle/analytics-schema");

          const kpis = await db
            .select()
            .from(executiveKPIs)
            .orderBy(desc(executiveKPIs.kpiDate))
            .limit(1);

          return kpis[0] || null;
        },
        cacheTTL.MEDIUM
      );
    }),

  /**
   * Get deal pipeline funnel data
   */
  getDealPipelineFunnel: publicProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        partnerId: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      const cacheKey = `analytics:pipeline_funnel:${input.partnerId || "all"}`;

      return cacheManager.getOrCompute(
        cacheKey,
        async () => {
          const db = await getDb();
          if (!db) return [];

          const { dealPipelineMetrics } = await import("../../drizzle/analytics-schema");

          const metrics = await db
            .select()
            .from(dealPipelineMetrics)
            .orderBy(dealPipelineMetrics.dealStage);

          // Transform to funnel format
          return metrics.map((m) => ({
            stage: m.dealStage,
            count: m.dealCount,
            value: m.totalValue,
            avgValue: m.avgValue,
            conversionRate: m.conversionRate,
            avgDaysInStage: m.avgDaysInStage,
          }));
        },
        cacheTTL.MEDIUM
      );
    }),

  /**
   * Get partner performance metrics
   */
  getPartnerPerformance: publicProcedure
    .input(
      z.object({
        partnerId: z.number().optional(),
        limit: z.number().default(10),
        sortBy: z.enum(["revenue", "deals", "health"]).default("revenue"),
      })
    )
    .query(async ({ input }) => {
      const cacheKey = `analytics:partner_performance:${input.sortBy}`;

      return cacheManager.getOrCompute(
        cacheKey,
        async () => {
          const db = await getDb();
          if (!db) return [];

          const { partnerPerformanceMetrics } = await import("../../drizzle/analytics-schema");

          let query = db.select().from(partnerPerformanceMetrics);

          if (input.partnerId) {
            query = query.where(eq(partnerPerformanceMetrics.partnerCompanyId, input.partnerId)) as any;
          }

          // Sort by selected metric
          let sortQuery = query;
          if (input.sortBy === "revenue") {
            sortQuery = query.orderBy(desc(partnerPerformanceMetrics.totalRevenue)) as any;
          } else if (input.sortBy === "deals") {
            sortQuery = query.orderBy(desc(partnerPerformanceMetrics.totalDealsWon)) as any;
          } else {
            sortQuery = query.orderBy(desc(partnerPerformanceMetrics.healthScore)) as any;
          }

          const metrics = await sortQuery.limit(input.limit);
          return metrics;
        },
        cacheTTL.MEDIUM
      );
    }),

  /**
   * Get partner leaderboard
   */
  getPartnerLeaderboard: publicProcedure
    .input(
      z.object({
        metric: z.enum(["revenue", "deals", "health"]).default("revenue"),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      const cacheKey = `analytics:leaderboard:${input.metric}`;

      return cacheManager.getOrCompute(
        cacheKey,
        async () => {
          const db = await getDb();
          if (!db) return [];

          const { partnerLeaderboard } = await import("../../drizzle/analytics-schema");

          let query = db.select().from(partnerLeaderboard);

          // Sort by selected metric
          if (input.metric === "revenue") {
            query = query.orderBy(partnerLeaderboard.revenueRank) as any;
          } else if (input.metric === "deals") {
            query = query.orderBy(partnerLeaderboard.dealsRank) as any;
          } else {
            query = query.orderBy(partnerLeaderboard.healthRank) as any;
          }

          const leaderboard = await query.limit(input.limit);
          return leaderboard;
        },
        cacheTTL.LONG
      );
    }),

  /**
   * Get training analytics
   */
  getTrainingAnalytics: publicProcedure
    .input(
      z.object({
        courseId: z.number().optional(),
        limit: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      const cacheKey = `analytics:training:${input.courseId || "all"}`;

      return cacheManager.getOrCompute(
        cacheKey,
        async () => {
          const db = await getDb();
          if (!db) return [];

          const { trainingAnalytics } = await import("../../drizzle/analytics-schema");

          let query = db.select().from(trainingAnalytics);

          if (input.courseId) {
            query = query.where(eq(trainingAnalytics.courseId, input.courseId)) as any;
          }

          const analytics = await query.limit(input.limit);
          return analytics;
        },
        cacheTTL.MEDIUM
      );
    }),

  /**
   * Get financial analytics
   */
  getFinancialAnalytics: publicProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ input }) => {
      const cacheKey = "analytics:financial";

      return cacheManager.getOrCompute(
        cacheKey,
        async () => {
          const db = await getDb();
          if (!db) return [];

          const { financialAnalytics } = await import("../../drizzle/analytics-schema");

          let query = db.select().from(financialAnalytics);

          if (input.startDate) {
            query = query.where(gte(financialAnalytics.analyticsDate, input.startDate)) as any;
          }

          if (input.endDate) {
            query = query.where(lte(financialAnalytics.analyticsDate, input.endDate)) as any;
          }

          const analytics = await query.orderBy(desc(financialAnalytics.analyticsDate));
          return analytics;
        },
        cacheTTL.MEDIUM
      );
    }),

  /**
   * Get deal pipeline trends
   */
  getDealPipelineTrends: publicProcedure
    .input(
      z.object({
        days: z.number().default(30),
      })
    )
    .query(async ({ input }) => {
      const cacheKey = `analytics:pipeline_trends:${input.days}`;

      return cacheManager.getOrCompute(
        cacheKey,
        async () => {
          const db = await getDb();
          if (!db) return [];

          const { dealPipelineMetrics } = await import("../../drizzle/analytics-schema");

          const startDate = new Date();
          startDate.setDate(startDate.getDate() - input.days);

          const metrics = await db
            .select()
            .from(dealPipelineMetrics)
            .where(gte(dealPipelineMetrics.metricDate, startDate))
            .orderBy(dealPipelineMetrics.metricDate);

          return metrics;
        },
        cacheTTL.MEDIUM
      );
    }),

  /**
   * Get partner health scores
   */
  getPartnerHealthScores: publicProcedure
    .input(
      z.object({
        limit: z.number().default(50),
      })
    )
    .query(async ({ input }) => {
      const cacheKey = "analytics:health_scores";

      return cacheManager.getOrCompute(
        cacheKey,
        async () => {
          const db = await getDb();
          if (!db) return [];

          const { partnerPerformanceMetrics } = await import("../../drizzle/analytics-schema");

          const metrics = await db
            .select()
            .from(partnerPerformanceMetrics)
            .orderBy(desc(partnerPerformanceMetrics.healthScore))
            .limit(input.limit);

          return metrics.map((m) => ({
            partnerId: m.partnerCompanyId,
            healthScore: m.healthScore,
            revenue: m.totalRevenue,
            deals: m.totalDealsWon,
            certifications: m.totalCertificationsEarned,
          }));
        },
        cacheTTL.MEDIUM
      );
    }),

  /**
   * Get revenue forecast
   */
  getRevenueForecast: publicProcedure
    .input(
      z.object({
        months: z.number().default(6),
      })
    )
    .query(async ({ input }) => {
      const cacheKey = `analytics:revenue_forecast:${input.months}`;

      return cacheManager.getOrCompute(
        cacheKey,
        async () => {
          const db = await getDb();
          if (!db) return [];

          const { financialAnalytics } = await import("../../drizzle/analytics-schema");

          // Get historical data for trend analysis
          const startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 12);

          const historical = await db
            .select()
            .from(financialAnalytics)
            .where(gte(financialAnalytics.analyticsDate, startDate))
            .orderBy(financialAnalytics.analyticsDate);

          // Simple linear trend forecast
          if (historical.length < 2) {
            return [];
          }

          const forecast = [];
          const lastRevenue = parseFloat(historical[historical.length - 1].totalRevenue.toString());
          const avgGrowth =
            (parseFloat(historical[historical.length - 1].totalRevenue.toString()) -
              parseFloat(historical[0].totalRevenue.toString())) /
            historical.length;

          for (let i = 1; i <= input.months; i++) {
            const forecastDate = new Date();
            forecastDate.setMonth(forecastDate.getMonth() + i);

            forecast.push({
              date: forecastDate,
              projectedRevenue: lastRevenue + avgGrowth * i,
              confidence: Math.max(50, 95 - i * 5), // Confidence decreases over time
            });
          }

          return forecast;
        },
        cacheTTL.LONG
      );
    }),

  /**
   * Get deal velocity metrics
   */
  getDealVelocity: publicProcedure
    .input(
      z.object({
        days: z.number().default(90),
      })
    )
    .query(async ({ input }) => {
      const cacheKey = `analytics:deal_velocity:${input.days}`;

      return cacheManager.getOrCompute(
        cacheKey,
        async () => {
          const db = await getDb();
          if (!db) return null;

          const { dealPipelineMetrics } = await import("../../drizzle/analytics-schema");

          const startDate = new Date();
          startDate.setDate(startDate.getDate() - input.days);

          const metrics = await db
            .select()
            .from(dealPipelineMetrics)
            .where(gte(dealPipelineMetrics.metricDate, startDate))
            .orderBy(dealPipelineMetrics.dealStage);

          // Calculate velocity metrics
          const stages = ["Submitted", "Qualified", "Approved", "Won"];
          const velocityData = stages.map((stage) => {
            const stageMetrics = metrics.filter((m) => m.dealStage === stage);
            const avgDays =
              stageMetrics.length > 0
                ? stageMetrics.reduce((sum, m) => sum + parseFloat(m.avgDaysInStage.toString()), 0) /
                  stageMetrics.length
                : 0;

            return {
              stage,
              avgDaysInStage: avgDays,
              dealCount: stageMetrics[0]?.dealCount || 0,
            };
          });

          return velocityData;
        },
        cacheTTL.MEDIUM
      );
    }),

  /**
   * Get commission analytics
   */
  getCommissionAnalytics: publicProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ input }) => {
      const cacheKey = "analytics:commissions";

      return cacheManager.getOrCompute(
        cacheKey,
        async () => {
          const db = await getDb();
          if (!db) return null;

          const { financialAnalytics } = await import("../../drizzle/analytics-schema");

          let query = db.select().from(financialAnalytics);

          if (input.startDate) {
            query = query.where(gte(financialAnalytics.analyticsDate, input.startDate)) as any;
          }

          if (input.endDate) {
            query = query.where(lte(financialAnalytics.analyticsDate, input.endDate)) as any;
          }

          const analytics = await query.orderBy(desc(financialAnalytics.analyticsDate)).limit(1);

          if (!analytics[0]) {
            return null;
          }

          return {
            totalCommissions: analytics[0].totalCommissions,
            commissionRate: analytics[0].commissionRate,
            dealsWon: analytics[0].dealsWon,
            avgCommissionPerDeal:
              analytics[0].dealsWon > 0
                ? parseFloat(analytics[0].totalCommissions.toString()) / analytics[0].dealsWon
                : 0,
          };
        },
        cacheTTL.MEDIUM
      );
    }),

  /**
   * Clear analytics cache (admin)
   */
  clearAnalyticsCache: publicProcedure.mutation(async () => {
    cacheManager.deletePattern("^analytics:");
    return { success: true, message: "Analytics cache cleared" };
  }),
});
