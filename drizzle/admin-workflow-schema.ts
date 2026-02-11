import { mysqlTable, int, varchar, text, timestamp, boolean, json, decimal } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Admin Workflow Management Schema
 * Manages approval workflows, conflict policies, and scoring configurations
 */

// Workflow status
export const workflowStatuses = ["Active", "Inactive", "Draft", "Archived"] as const;

// Workflow templates
export const workflowTemplates = ["Standard", "Executive", "Custom", "Risk-Based"] as const;

/**
 * Approval Workflows Table
 * Defines multi-stage approval processes
 */
export const approvalWorkflows = mysqlTable("approval_workflows", {
  id: int("id").autoincrement().primaryKey(),
  
  // Workflow identification
  workflowName: varchar("workflow_name", { length: 255 }).notNull(),
  workflowCode: varchar("workflow_code", { length: 50 }).notNull().unique(),
  description: text("description"),
  
  // Workflow configuration
  template: varchar("template", { length: 50 }).default("Standard"),
  status: varchar("status", { length: 20 }).default("Draft"),
  
  // Activation rules
  minDealValue: decimal("min_deal_value", { precision: 15, scale: 2 }),
  maxDealValue: decimal("max_deal_value", { precision: 15, scale: 2 }),
  riskLevel: varchar("risk_level", { length: 50 }), // Low, Medium, High, Critical
  
  // Workflow settings
  requiresAllApprovals: boolean("requires_all_approvals").default(true),
  allowEscalation: boolean("allow_escalation").default(true),
  escalationTimeoutDays: int("escalation_timeout_days").default(3),
  autoApproveIfNoResponse: boolean("auto_approve_if_no_response").default(false),
  
  // Metadata
  createdBy: int("created_by"),
  createdByName: varchar("created_by_name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  activatedAt: timestamp("activated_at"),
});

export type ApprovalWorkflow = typeof approvalWorkflows.$inferSelect;
export type NewApprovalWorkflow = typeof approvalWorkflows.$inferInsert;

/**
 * Workflow Stages Table
 * Defines individual stages within a workflow
 */
export const workflowStages = mysqlTable("workflow_stages", {
  id: int("id").autoincrement().primaryKey(),
  
  workflowId: int("workflow_id").notNull(),
  
  // Stage configuration
  stageName: varchar("stage_name", { length: 255 }).notNull(),
  stageOrder: int("stage_order").notNull(),
  stageDescription: text("stage_description"),
  
  // Approver configuration
  requiredApproverRole: varchar("required_approver_role", { length: 100 }).notNull(), // e.g., "Manager", "Director", "CFO"
  requiredApproverCount: int("required_approver_count").default(1),
  
  // Timing
  timeoutDays: int("timeout_days").default(5),
  
  // Conditions
  canSkip: boolean("can_skip").default(false),
  skipCondition: text("skip_condition"), // JSON condition logic
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type WorkflowStage = typeof workflowStages.$inferSelect;
export type NewWorkflowStage = typeof workflowStages.$inferInsert;

/**
 * Conflict Policies Table
 * Defines conflict detection and resolution rules
 */
export const conflictPolicies = mysqlTable("conflict_policies", {
  id: int("id").autoincrement().primaryKey(),
  
  // Policy identification
  policyName: varchar("policy_name", { length: 255 }).notNull(),
  policyCode: varchar("policy_code", { length: 50 }).notNull().unique(),
  description: text("description"),
  
  // Conflict type
  conflictType: varchar("conflict_type", { length: 100 }).notNull(), // Channel, Territory, Customer, Pricing
  
  // Detection rules
  detectionRules: json("detection_rules"), // JSON object defining detection criteria
  
  // Severity levels
  defaultSeverity: varchar("default_severity", { length: 50 }).default("Medium"), // Low, Medium, High, Critical
  
  // Resolution rules
  autoResolve: boolean("auto_resolve").default(false),
  resolutionStrategy: varchar("resolution_strategy", { length: 100 }), // e.g., "First-Come-First-Serve", "Highest-Value", "Partner-Tier-Based"
  resolutionTemplate: text("resolution_template"), // JSON template for resolution
  
  // Escalation
  requiresEscalation: boolean("requires_escalation").default(true),
  escalationTo: varchar("escalation_to", { length: 100 }), // Role to escalate to
  
  // Status
  isActive: boolean("is_active").default(true),
  
  // Metadata
  createdBy: int("created_by"),
  createdByName: varchar("created_by_name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ConflictPolicy = typeof conflictPolicies.$inferSelect;
export type NewConflictPolicy = typeof conflictPolicies.$inferInsert;

/**
 * Scoring Rules Configuration Table
 * Defines scoring criteria and weights
 */
export const scoringRulesConfig = mysqlTable("scoring_rules_config", {
  id: int("id").autoincrement().primaryKey(),
  
  // Rule identification
  ruleName: varchar("rule_name", { length: 255 }).notNull(),
  ruleCode: varchar("rule_code", { length: 50 }).notNull().unique(),
  description: text("description"),
  
  // Scoring category
  category: varchar("category", { length: 100 }).notNull(), // Deal Size, Timeline, Customer, Industry, Partner Capability
  
  // Scoring configuration
  weight: int("weight").notNull().default(1), // 1-100
  minScore: int("min_score").default(0),
  maxScore: int("max_score").default(100),
  
  // Scoring logic
  scoringLogic: json("scoring_logic"), // JSON object defining scoring calculation
  
  // Thresholds
  qualificationThreshold: int("qualification_threshold").default(50), // Score needed to qualify
  
  // Status
  isActive: boolean("is_active").default(true),
  
  // Metadata
  createdBy: int("created_by"),
  createdByName: varchar("created_by_name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ScoringRulesConfig = typeof scoringRulesConfig.$inferSelect;
export type NewScoringRulesConfig = typeof scoringRulesConfig.$inferInsert;

/**
 * Admin Audit Log Table
 * Tracks all admin configuration changes
 */
export const adminAuditLog = mysqlTable("admin_audit_log", {
  id: int("id").autoincrement().primaryKey(),
  
  // Action details
  actionType: varchar("action_type", { length: 100 }).notNull(), // Created, Updated, Deleted, Activated, Deactivated
  entityType: varchar("entity_type", { length: 100 }).notNull(), // Workflow, Policy, Rule
  entityId: int("entity_id"),
  entityName: varchar("entity_name", { length: 255 }),
  
  // Changes
  changeDetails: json("change_details"), // JSON object of changes made
  
  // User information
  userId: int("user_id").notNull(),
  userName: varchar("user_name", { length: 255 }).notNull(),
  userRole: varchar("user_role", { length: 100 }),
  
  // Metadata
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AdminAuditLog = typeof adminAuditLog.$inferSelect;
export type NewAdminAuditLog = typeof adminAuditLog.$inferInsert;

/**
 * Admin Settings Table
 * Global admin configuration
 */
export const adminSettings = mysqlTable("admin_settings", {
  id: int("id").autoincrement().primaryKey(),
  
  // Setting identification
  settingKey: varchar("setting_key", { length: 100 }).notNull().unique(),
  settingValue: text("setting_value"),
  settingType: varchar("setting_type", { length: 50 }), // String, Number, Boolean, JSON
  
  // Description
  description: text("description"),
  
  // Metadata
  updatedBy: int("updated_by"),
  updatedByName: varchar("updated_by_name", { length: 255 }),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type AdminSetting = typeof adminSettings.$inferSelect;
export type NewAdminSetting = typeof adminSettings.$inferInsert;

/**
 * Workflow Test Results Table
 * Tracks workflow testing and validation
 */
export const workflowTestResults = mysqlTable("workflow_test_results", {
  id: int("id").autoincrement().primaryKey(),
  
  workflowId: int("workflow_id").notNull(),
  
  // Test details
  testName: varchar("test_name", { length: 255 }).notNull(),
  testScenario: text("test_scenario"), // Description of test scenario
  
  // Test input
  testInput: json("test_input"), // JSON object with test parameters
  
  // Test results
  passed: boolean("passed").default(false),
  resultDetails: json("result_details"), // JSON object with test results
  errorMessage: text("error_message"),
  
  // Metadata
  testedBy: int("tested_by"),
  testedByName: varchar("tested_by_name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type WorkflowTestResult = typeof workflowTestResults.$inferSelect;
export type NewWorkflowTestResult = typeof workflowTestResults.$inferInsert;

/**
 * Relations
 */
export const approvalWorkflowsRelations = relations(approvalWorkflows, ({ many }) => ({
  stages: many(workflowStages),
  testResults: many(workflowTestResults),
}));

export const workflowStagesRelations = relations(workflowStages, ({ one }) => ({
  workflow: one(approvalWorkflows, {
    fields: [workflowStages.workflowId],
    references: [approvalWorkflows.id],
  }),
}));

export const workflowTestResultsRelations = relations(workflowTestResults, ({ one }) => ({
  workflow: one(approvalWorkflows, {
    fields: [workflowTestResults.workflowId],
    references: [approvalWorkflows.id],
  }),
}));
