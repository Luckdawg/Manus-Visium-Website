import { mysqlTable, int, varchar, text, timestamp, decimal, mysqlEnum, boolean, json } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Enhanced Deal Management Schema
 * Supports multi-stage approvals, conflict detection, deal scoring, and pipeline management
 */

// Deal stages enum
export const dealStages = mysqlEnum("dealStage", [
  "Submitted",
  "Qualified",
  "In Review",
  "Approved",
  "Rejected",
  "Won",
  "Lost",
  "Expired",
]);

// Deal status for tracking
export const dealStatuses = mysqlEnum("dealStatus", [
  "Active",
  "On Hold",
  "Closed Won",
  "Closed Lost",
  "Expired",
]);

// Approval status
export const approvalStatuses = mysqlEnum("approvalStatus", [
  "Pending",
  "Approved",
  "Rejected",
  "Escalated",
]);

// Conflict types
export const conflictTypes = mysqlEnum("conflictType", [
  "Channel Conflict",
  "Territory Conflict",
  "Customer Overlap",
  "Pricing Conflict",
  "Partner Conflict",
  "Other",
]);

/**
 * Enhanced Deals Table
 * Extends existing partner_deals with additional fields for advanced management
 */
export const enhancedDeals = mysqlTable("enhanced_deals", {
  id: int("id").autoincrement().primaryKey(),
  
  // Link to existing partner deal
  partnerDealId: int("partner_deal_id").notNull(),
  
  // Deal identification
  dealNumber: varchar("deal_number", { length: 50 }).notNull().unique(),
  dealName: varchar("deal_name", { length: 255 }).notNull(),
  
  // Deal stage and status
  currentStage: dealStages.notNull().default("Submitted"),
  dealStatus: dealStatuses.notNull().default("Active"),
  
  // Deal details
  description: text("description"),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerIndustry: varchar("customer_industry", { length: 100 }),
  dealValue: decimal("deal_value", { precision: 15, scale: 2 }).notNull(),
  dealCurrency: varchar("deal_currency", { length: 3 }).default("USD"),
  
  // Deal scoring
  dealScore: int("deal_score").default(0), // 0-100
  qualificationScore: int("qualification_score").default(0), // 0-100
  riskScore: int("risk_score").default(0), // 0-100
  
  // Timeline
  expectedCloseDate: timestamp("expected_close_date"),
  actualCloseDate: timestamp("actual_close_date"),
  
  // Approval tracking
  requiresApproval: boolean("requires_approval").default(true),
  approvalLevel: varchar("approval_level", { length: 50 }).default("Standard"), // Standard, Executive, Board
  
  // Conflict management
  hasConflict: boolean("has_conflict").default(false),
  conflictType: conflictTypes,
  conflictDescription: text("conflict_description"),
  conflictResolutionNotes: text("conflict_resolution_notes"),
  
  // Channel protection
  channelPartnerExclusive: boolean("channel_partner_exclusive").default(false),
  exclusivityEndDate: timestamp("exclusivity_end_date"),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type EnhancedDeal = typeof enhancedDeals.$inferSelect;
export type NewEnhancedDeal = typeof enhancedDeals.$inferInsert;

/**
 * Deal Approval Workflow Table
 * Tracks multi-stage approvals with timestamps and comments
 */
export const dealApprovals = mysqlTable("deal_approvals", {
  id: int("id").autoincrement().primaryKey(),
  
  dealId: int("deal_id").notNull(),
  dealNumber: varchar("deal_number", { length: 50 }).notNull(),
  
  // Approval stage
  approvalStage: varchar("approval_stage", { length: 100 }).notNull(), // e.g., "Manager Review", "Compliance Check", "Executive Approval"
  approvalOrder: int("approval_order").notNull(), // Sequential order (1, 2, 3, etc.)
  
  // Approver information
  approverUserId: int("approver_user_id"),
  approverName: varchar("approver_name", { length: 255 }),
  approverRole: varchar("approver_role", { length: 100 }),
  
  // Approval status
  status: approvalStatuses.notNull().default("Pending"),
  approvedAt: timestamp("approved_at"),
  rejectedAt: timestamp("rejected_at"),
  
  // Comments and reasoning
  comments: text("comments"),
  rejectionReason: text("rejection_reason"),
  
  // Escalation
  isEscalated: boolean("is_escalated").default(false),
  escalatedTo: int("escalated_to"),
  escalationReason: text("escalation_reason"),
  
  // Timeline
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export type DealApproval = typeof dealApprovals.$inferSelect;
export type NewDealApproval = typeof dealApprovals.$inferInsert;

/**
 * Deal Conflict Detection Table
 * Tracks identified conflicts and resolution status
 */
export const dealConflicts = mysqlTable("deal_conflicts", {
  id: int("id").autoincrement().primaryKey(),
  
  dealId: int("deal_id").notNull(),
  dealNumber: varchar("deal_number", { length: 50 }).notNull(),
  
  // Conflict details
  conflictType: conflictTypes.notNull(),
  severity: mysqlEnum("severity", ["Low", "Medium", "High", "Critical"]).default("Medium"),
  
  // Conflicting entities
  conflictingPartnerIds: json("conflicting_partner_ids"), // JSON array of partner IDs
  conflictingDealIds: json("conflicting_deal_ids"), // JSON array of deal IDs
  
  // Description and resolution
  description: text("description").notNull(),
  resolutionStatus: mysqlEnum("resolution_status", [
    "Unresolved",
    "In Progress",
    "Resolved",
    "Escalated",
  ]).default("Unresolved"),
  
  resolutionNotes: text("resolution_notes"),
  resolutionDate: timestamp("resolution_date"),
  
  // Assigned to
  assignedToUserId: int("assigned_to_user_id"),
  assignedToName: varchar("assigned_to_name", { length: 255 }),
  
  // Timeline
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type DealConflict = typeof dealConflicts.$inferSelect;
export type NewDealConflict = typeof dealConflicts.$inferInsert;

/**
 * Deal Scoring Rules Table
 * Defines scoring criteria and weights for deal qualification
 */
export const dealScoringRules = mysqlTable("deal_scoring_rules", {
  id: int("id").autoincrement().primaryKey(),
  
  // Rule definition
  ruleName: varchar("rule_name", { length: 255 }).notNull(),
  ruleCategory: varchar("rule_category", { length: 100 }).notNull(), // e.g., "Customer", "Deal Size", "Timeline", "Partner Capability"
  
  // Scoring
  weight: int("weight").notNull(), // 1-100
  minScore: int("min_score").default(0),
  maxScore: int("max_score").default(100),
  
  // Rule logic
  criteria: json("criteria"), // JSON object defining the rule criteria
  description: text("description"),
  
  // Status
  isActive: boolean("is_active").default(true),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type DealScoringRule = typeof dealScoringRules.$inferSelect;
export type NewDealScoringRule = typeof dealScoringRules.$inferInsert;

/**
 * Deal Pipeline Progress Table
 * Tracks deal movement through stages with timestamps
 */
export const dealPipelineProgress = mysqlTable("deal_pipeline_progress", {
  id: int("id").autoincrement().primaryKey(),
  
  dealId: int("deal_id").notNull(),
  dealNumber: varchar("deal_number", { length: 50 }).notNull(),
  
  // Stage transition
  fromStage: dealStages,
  toStage: dealStages.notNull(),
  
  // Timeline
  movedAt: timestamp("moved_at").defaultNow().notNull(),
  daysInPreviousStage: int("days_in_previous_stage"),
  
  // Reason for transition
  transitionReason: varchar("transition_reason", { length: 255 }),
  notes: text("notes"),
  
  // User who made the transition
  movedByUserId: int("moved_by_user_id"),
  movedByName: varchar("moved_by_name", { length: 255 }),
});

export type DealPipelineProgress = typeof dealPipelineProgress.$inferSelect;
export type NewDealPipelineProgress = typeof dealPipelineProgress.$inferInsert;

/**
 * Deal Activity Log Table
 * Comprehensive audit trail of all deal-related activities
 */
export const dealActivityLog = mysqlTable("deal_activity_log", {
  id: int("id").autoincrement().primaryKey(),
  
  dealId: int("deal_id").notNull(),
  dealNumber: varchar("deal_number", { length: 50 }).notNull(),
  
  // Activity details
  activityType: varchar("activity_type", { length: 100 }).notNull(), // e.g., "Created", "Updated", "Approved", "Rejected", "Commented"
  activityDescription: text("activity_description").notNull(),
  
  // Changes made
  changedFields: json("changed_fields"), // JSON object of field changes {fieldName: {old: value, new: value}}
  
  // User information
  userId: int("user_id"),
  userName: varchar("user_name", { length: 255 }),
  userRole: varchar("user_role", { length: 100 }),
  
  // Metadata
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type DealActivityLog = typeof dealActivityLog.$inferSelect;
export type NewDealActivityLog = typeof dealActivityLog.$inferInsert;

/**
 * Deal Qualification Checklist Table
 * Tracks completion of qualification requirements
 */
export const dealQualificationChecklist = mysqlTable("deal_qualification_checklist", {
  id: int("id").autoincrement().primaryKey(),
  
  dealId: int("deal_id").notNull(),
  dealNumber: varchar("deal_number", { length: 50 }).notNull(),
  
  // Checklist items
  itemName: varchar("item_name", { length: 255 }).notNull(),
  itemDescription: text("item_description"),
  itemCategory: varchar("item_category", { length: 100 }), // e.g., "Customer Verification", "Technical Fit", "Financial Approval"
  
  // Status
  isRequired: boolean("is_required").default(true),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  
  // Verification
  verifiedBy: int("verified_by"),
  verifiedByName: varchar("verified_by_name", { length: 255 }),
  verificationNotes: text("verification_notes"),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type DealQualificationChecklist = typeof dealQualificationChecklist.$inferSelect;
export type NewDealQualificationChecklist = typeof dealQualificationChecklist.$inferInsert;

/**
 * Deal Pipeline Metrics Table
 * Aggregated metrics for pipeline reporting and analytics
 */
export const dealPipelineMetrics = mysqlTable("deal_pipeline_metrics", {
  id: int("id").autoincrement().primaryKey(),
  
  // Period
  reportDate: timestamp("report_date").defaultNow().notNull(),
  
  // Metrics by stage
  submittedCount: int("submitted_count").default(0),
  qualifiedCount: int("qualified_count").default(0),
  inReviewCount: int("in_review_count").default(0),
  approvedCount: int("approved_count").default(0),
  rejectedCount: int("rejected_count").default(0),
  wonCount: int("won_count").default(0),
  lostCount: int("lost_count").default(0),
  
  // Value metrics
  totalPipelineValue: decimal("total_pipeline_value", { precision: 15, scale: 2 }).default("0"),
  approvedValue: decimal("approved_value", { precision: 15, scale: 2 }).default("0"),
  wonValue: decimal("won_value", { precision: 15, scale: 2 }).default("0"),
  
  // Conversion metrics
  submissionToApprovalRate: decimal("submission_to_approval_rate", { precision: 5, scale: 2 }).default("0"), // percentage
  approvalToWinRate: decimal("approval_to_win_rate", { precision: 5, scale: 2 }).default("0"), // percentage
  
  // Conflict metrics
  conflictCount: int("conflict_count").default(0),
  resolvedConflictCount: int("resolved_conflict_count").default(0),
  
  // Timeline metrics
  avgDaysToApproval: int("avg_days_to_approval").default(0),
  avgDaysToClose: int("avg_days_to_close").default(0),
});

export type DealPipelineMetrics = typeof dealPipelineMetrics.$inferSelect;
export type NewDealPipelineMetrics = typeof dealPipelineMetrics.$inferInsert;

/**
 * Relations
 */
export const enhancedDealsRelations = relations(enhancedDeals, ({ many }) => ({
  approvals: many(dealApprovals),
  conflicts: many(dealConflicts),
  pipelineProgress: many(dealPipelineProgress),
  activityLog: many(dealActivityLog),
  qualificationChecklist: many(dealQualificationChecklist),
}));

export const dealApprovalsRelations = relations(dealApprovals, ({ one }) => ({
  deal: one(enhancedDeals, {
    fields: [dealApprovals.dealId],
    references: [enhancedDeals.id],
  }),
}));

export const dealConflictsRelations = relations(dealConflicts, ({ one }) => ({
  deal: one(enhancedDeals, {
    fields: [dealConflicts.dealId],
    references: [enhancedDeals.id],
  }),
}));

export const dealPipelineProgressRelations = relations(dealPipelineProgress, ({ one }) => ({
  deal: one(enhancedDeals, {
    fields: [dealPipelineProgress.dealId],
    references: [enhancedDeals.id],
  }),
}));

export const dealActivityLogRelations = relations(dealActivityLog, ({ one }) => ({
  deal: one(enhancedDeals, {
    fields: [dealActivityLog.dealId],
    references: [enhancedDeals.id],
  }),
}));

export const dealQualificationChecklistRelations = relations(dealQualificationChecklist, ({ one }) => ({
  deal: one(enhancedDeals, {
    fields: [dealQualificationChecklist.dealId],
    references: [enhancedDeals.id],
  }),
}));
