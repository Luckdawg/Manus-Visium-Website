import { mysqlTable, int, varchar, text, timestamp, decimal, mysqlEnum, boolean, index } from "drizzle-orm/mysql-core";

/**
 * Analytics Events - Track all significant actions
 */
export const analyticsEvents = mysqlTable("analytics_events", {
  id: int("id").autoincrement().primaryKey(),
  
  // Event metadata
  eventType: mysqlEnum("eventType", [
    "deal_created",
    "deal_updated",
    "deal_approved",
    "deal_rejected",
    "deal_won",
    "deal_lost",
    "conflict_detected",
    "conflict_resolved",
    "course_enrolled",
    "course_completed",
    "certification_earned",
    "partner_applied",
    "partner_approved",
    "partner_rejected",
    "mdf_claimed",
    "commission_calculated"
  ]).notNull(),
  
  // Entity references
  partnerCompanyId: int("partnerCompanyId"),
  dealId: int("dealId"),
  userId: int("userId"),
  courseId: int("courseId"),
  
  // Event data
  eventData: text("eventData"), // JSON payload
  metadata: text("metadata"), // Additional context
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  eventTypeIdx: index("event_type_idx").on(table.eventType),
  partnerIdx: index("partner_idx").on(table.partnerCompanyId),
  dealIdx: index("deal_idx").on(table.dealId),
  dateIdx: index("date_idx").on(table.createdAt),
}));

/**
 * Deal Pipeline Metrics - Aggregated deal stage data
 */
export const dealPipelineMetrics = mysqlTable("deal_pipeline_metrics", {
  id: int("id").autoincrement().primaryKey(),
  
  // Date and stage
  metricDate: timestamp("metricDate").notNull(),
  dealStage: mysqlEnum("dealStage", [
    "Submitted",
    "Qualified",
    "Approved",
    "Won",
    "Lost"
  ]).notNull(),
  
  // Metrics
  dealCount: int("dealCount").default(0).notNull(),
  totalValue: decimal("totalValue", { precision: 15, scale: 2 }).default("0").notNull(),
  avgValue: decimal("avgValue", { precision: 15, scale: 2 }).default("0").notNull(),
  
  // Conversion metrics
  conversionRate: decimal("conversionRate", { precision: 5, scale: 2 }).default("0").notNull(), // percentage
  avgDaysInStage: decimal("avgDaysInStage", { precision: 8, scale: 2 }).default("0").notNull(),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  dateIdx: index("metric_date_idx").on(table.metricDate),
  stageIdx: index("stage_idx").on(table.dealStage),
}));

/**
 * Partner Performance Metrics - Partner-level analytics
 */
export const partnerPerformanceMetrics = mysqlTable("partner_performance_metrics", {
  id: int("id").autoincrement().primaryKey(),
  
  // Partner reference
  partnerCompanyId: int("partnerCompanyId").notNull().unique(),
  
  // Deal metrics
  totalDealsRegistered: int("totalDealsRegistered").default(0).notNull(),
  totalDealsWon: int("totalDealsWon").default(0).notNull(),
  totalDealsLost: int("totalDealsLost").default(0).notNull(),
  winRate: decimal("winRate", { precision: 5, scale: 2 }).default("0").notNull(), // percentage
  
  // Revenue metrics
  totalRevenue: decimal("totalRevenue", { precision: 15, scale: 2 }).default("0").notNull(),
  avgDealValue: decimal("avgDealValue", { precision: 15, scale: 2 }).default("0").notNull(),
  totalCommissions: decimal("totalCommissions", { precision: 15, scale: 2 }).default("0").notNull(),
  
  // Pipeline metrics
  activePipelineValue: decimal("activePipelineValue", { precision: 15, scale: 2 }).default("0").notNull(),
  pipelineGrowthRate: decimal("pipelineGrowthRate", { precision: 5, scale: 2 }).default("0").notNull(), // percentage
  
  // Training metrics
  totalCoursesCompleted: int("totalCoursesCompleted").default(0).notNull(),
  totalCertificationsEarned: int("totalCertificationsEarned").default(0).notNull(),
  certificationRate: decimal("certificationRate", { precision: 5, scale: 2 }).default("0").notNull(), // percentage
  
  // MDF metrics
  mdfBudgetAllocated: decimal("mdfBudgetAllocated", { precision: 15, scale: 2 }).default("0").notNull(),
  mdfBudgetUsed: decimal("mdfBudgetUsed", { precision: 15, scale: 2 }).default("0").notNull(),
  mdfUtilizationRate: decimal("mdfUtilizationRate", { precision: 5, scale: 2 }).default("0").notNull(), // percentage
  
  // Health score (0-100)
  healthScore: int("healthScore").default(50).notNull(),
  
  // Activity metrics
  lastDealDate: timestamp("lastDealDate"),
  lastActivityDate: timestamp("lastActivityDate"),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  partnerIdx: index("partner_perf_idx").on(table.partnerCompanyId),
  healthIdx: index("health_idx").on(table.healthScore),
}));

/**
 * Training Analytics - Course and certification metrics
 */
export const trainingAnalytics = mysqlTable("training_analytics", {
  id: int("id").autoincrement().primaryKey(),
  
  // Course reference
  courseId: int("courseId").notNull(),
  
  // Enrollment metrics
  totalEnrollments: int("totalEnrollments").default(0).notNull(),
  completedEnrollments: int("completedEnrollments").default(0).notNull(),
  completionRate: decimal("completionRate", { precision: 5, scale: 2 }).default("0").notNull(), // percentage
  
  // Engagement metrics
  avgProgressPercentage: decimal("avgProgressPercentage", { precision: 5, scale: 2 }).default("0").notNull(),
  avgCompletionTime: int("avgCompletionTime").default(0).notNull(), // minutes
  
  // Assessment metrics
  avgAssessmentScore: decimal("avgAssessmentScore", { precision: 5, scale: 2 }).default("0").notNull(),
  passRate: decimal("passRate", { precision: 5, scale: 2 }).default("0").notNull(), // percentage
  
  // Certification metrics
  certificationsIssued: int("certificationsIssued").default(0).notNull(),
  certificationsExpired: int("certificationsExpired").default(0).notNull(),
  
  // Partner breakdown
  partnerCount: int("partnerCount").default(0).notNull(),
  topPartnerEnrollments: int("topPartnerEnrollments").default(0).notNull(),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  courseIdx: index("course_analytics_idx").on(table.courseId),
}));

/**
 * Financial Analytics - Commission and revenue tracking
 */
export const financialAnalytics = mysqlTable("financial_analytics", {
  id: int("id").autoincrement().primaryKey(),
  
  // Period
  analyticsDate: timestamp("analyticsDate").notNull(),
  
  // Revenue metrics
  totalRevenue: decimal("totalRevenue", { precision: 15, scale: 2 }).default("0").notNull(),
  totalCommissions: decimal("totalCommissions", { precision: 15, scale: 2 }).default("0").notNull(),
  commissionRate: decimal("commissionRate", { precision: 5, scale: 2 }).default("0").notNull(), // percentage
  
  // Deal metrics
  dealsWon: int("dealsWon").default(0).notNull(),
  dealsLost: int("dealsLost").default(0).notNull(),
  avgDealValue: decimal("avgDealValue", { precision: 15, scale: 2 }).default("0").notNull(),
  
  // Pipeline metrics
  pipelineValue: decimal("pipelineValue", { precision: 15, scale: 2 }).default("0").notNull(),
  pipelineGrowth: decimal("pipelineGrowth", { precision: 5, scale: 2 }).default("0").notNull(), // percentage
  
  // MDF metrics
  mdfAllocated: decimal("mdfAllocated", { precision: 15, scale: 2 }).default("0").notNull(),
  mdfUsed: decimal("mdfUsed", { precision: 15, scale: 2 }).default("0").notNull(),
  mdfRemaining: decimal("mdfRemaining", { precision: 15, scale: 2 }).default("0").notNull(),
  
  // Partner metrics
  activePartners: int("activePartners").default(0).notNull(),
  newPartners: int("newPartners").default(0).notNull(),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  dateIdx: index("financial_date_idx").on(table.analyticsDate),
}));

/**
 * Executive KPIs - High-level business metrics
 */
export const executiveKPIs = mysqlTable("executive_kpis", {
  id: int("id").autoincrement().primaryKey(),
  
  // Period
  kpiDate: timestamp("kpiDate").notNull(),
  
  // Revenue KPIs
  monthlyRecurringRevenue: decimal("monthlyRecurringRevenue", { precision: 15, scale: 2 }).default("0").notNull(),
  annualRecurringRevenue: decimal("annualRecurringRevenue", { precision: 15, scale: 2 }).default("0").notNull(),
  revenueGrowthRate: decimal("revenueGrowthRate", { precision: 5, scale: 2 }).default("0").notNull(), // percentage
  
  // Partner KPIs
  totalActivePartners: int("totalActivePartners").default(0).notNull(),
  partnerGrowthRate: decimal("partnerGrowthRate", { precision: 5, scale: 2 }).default("0").notNull(), // percentage
  avgPartnerHealthScore: decimal("avgPartnerHealthScore", { precision: 5, scale: 2 }).default("0").notNull(),
  
  // Deal KPIs
  totalPipelineValue: decimal("totalPipelineValue", { precision: 15, scale: 2 }).default("0").notNull(),
  avgDealSize: decimal("avgDealSize", { precision: 15, scale: 2 }).default("0").notNull(),
  dealWinRate: decimal("dealWinRate", { precision: 5, scale: 2 }).default("0").notNull(), // percentage
  avgSalesCycle: int("avgSalesCycle").default(0).notNull(), // days
  
  // Training KPIs
  totalCertifications: int("totalCertifications").default(0).notNull(),
  certificationGrowthRate: decimal("certificationGrowthRate", { precision: 5, scale: 2 }).default("0").notNull(), // percentage
  
  // Commission KPIs
  totalCommissionsPayable: decimal("totalCommissionsPayable", { precision: 15, scale: 2 }).default("0").notNull(),
  totalCommissionsPaid: decimal("totalCommissionsPaid", { precision: 15, scale: 2 }).default("0").notNull(),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  dateIdx: index("kpi_date_idx").on(table.kpiDate),
}));

/**
 * Partner Leaderboard - Ranked partner performance
 */
export const partnerLeaderboard = mysqlTable("partner_leaderboard", {
  id: int("id").autoincrement().primaryKey(),
  
  // Partner reference
  partnerCompanyId: int("partnerCompanyId").notNull(),
  
  // Ranking
  revenueRank: int("revenueRank").notNull(),
  dealsRank: int("dealsRank").notNull(),
  healthRank: int("healthRank").notNull(),
  
  // Period metrics
  periodRevenue: decimal("periodRevenue", { precision: 15, scale: 2 }).default("0").notNull(),
  periodDeals: int("periodDeals").default(0).notNull(),
  periodHealthScore: int("periodHealthScore").default(50).notNull(),
  
  // Comparison to previous period
  revenueChange: decimal("revenueChange", { precision: 5, scale: 2 }).default("0").notNull(), // percentage
  dealsChange: decimal("dealsChange", { precision: 5, scale: 2 }).default("0").notNull(), // percentage
  healthChange: decimal("healthChange", { precision: 5, scale: 2 }).default("0").notNull(), // percentage
  
  // Period
  periodStart: timestamp("periodStart").notNull(),
  periodEnd: timestamp("periodEnd").notNull(),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  partnerIdx: index("leaderboard_partner_idx").on(table.partnerCompanyId),
  revenueRankIdx: index("revenue_rank_idx").on(table.revenueRank),
  dealsRankIdx: index("deals_rank_idx").on(table.dealsRank),
}));

// Type exports
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = typeof analyticsEvents.$inferInsert;

export type DealPipelineMetric = typeof dealPipelineMetrics.$inferSelect;
export type InsertDealPipelineMetric = typeof dealPipelineMetrics.$inferInsert;

export type PartnerPerformanceMetric = typeof partnerPerformanceMetrics.$inferSelect;
export type InsertPartnerPerformanceMetric = typeof partnerPerformanceMetrics.$inferInsert;

export type TrainingAnalytic = typeof trainingAnalytics.$inferSelect;
export type InsertTrainingAnalytic = typeof trainingAnalytics.$inferInsert;

export type FinancialAnalytic = typeof financialAnalytics.$inferSelect;
export type InsertFinancialAnalytic = typeof financialAnalytics.$inferInsert;

export type ExecutiveKPI = typeof executiveKPIs.$inferSelect;
export type InsertExecutiveKPI = typeof executiveKPIs.$inferInsert;

export type PartnerLeaderboardEntry = typeof partnerLeaderboard.$inferSelect;
export type InsertPartnerLeaderboardEntry = typeof partnerLeaderboard.$inferInsert;
