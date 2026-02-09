import { int, varchar, text, timestamp, decimal, mysqlTable, mysqlEnum, boolean, index, json } from "drizzle-orm/mysql-core";

/**
 * Partner Companies - Registered partner organizations
 */
export const partnerCompanies = mysqlTable("partner_companies", {
  id: int("id").autoincrement().primaryKey(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  website: varchar("website", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 320 }).notNull(),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  country: varchar("country", { length: 100 }),
  zipCode: varchar("zipCode", { length: 20 }),
  
  // Partner information
  partnerType: mysqlEnum("partnerType", [
    "Reseller",
    "Technology Partner",
    "System Integrator",
    "Managed Service Provider",
    "Consulting Partner",
    "Channel Partner",
    "OEM Partner",
    "Other"
  ]).notNull(),
  
  partnerStatus: mysqlEnum("partnerStatus", [
    "Prospect",
    "Active",
    "Inactive",
    "Suspended",
    "Terminated"
  ]).default("Prospect").notNull(),
  
  tier: mysqlEnum("tier", [
    "Gold",
    "Silver",
    "Bronze",
    "Standard"
  ]).default("Standard"),
  
  // Contact information
  primaryContactName: varchar("primaryContactName", { length: 255 }).notNull(),
  primaryContactEmail: varchar("primaryContactEmail", { length: 320 }).notNull(),
  primaryContactPhone: varchar("primaryContactPhone", { length: 50 }),
  
  // Commission & financial
  commissionRate: decimal("commissionRate", { precision: 5, scale: 2 }).default("10.00"), // percentage
  mdfBudgetAnnual: decimal("mdfBudgetAnnual", { precision: 15, scale: 2 }).default("0.00"), // Marketing Development Fund
  
  // Metadata
  description: text("description"),
  logoUrl: varchar("logoUrl", { length: 512 }),
  certifications: text("certifications"), // JSON array
  specializations: text("specializations"), // JSON array
  
  // Account management
  accountManagerId: int("accountManagerId"), // Visium user managing this partner
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  statusIdx: index("status_idx").on(table.partnerStatus),
  typeIdx: index("type_idx").on(table.partnerType),
  managerIdx: index("manager_idx").on(table.accountManagerId),
}));

export type PartnerCompany = typeof partnerCompanies.$inferSelect;
export type InsertPartnerCompany = typeof partnerCompanies.$inferInsert;

/**
 * Partner Users - Individual users from partner companies
 */
export const partnerUsers = mysqlTable("partner_users", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Reference to main users table
  partnerCompanyId: int("partnerCompanyId").notNull(),
  
  partnerRole: mysqlEnum("partnerRole", [
    "Admin",
    "Account Manager",
    "Sales Rep",
    "Technical",
    "Finance",
    "Support",
    "Other"
  ]).default("Sales Rep").notNull(),
  
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  partnerIdx: index("partner_idx").on(table.partnerCompanyId),
  userIdx: index("user_idx").on(table.userId),
}));

export type PartnerUser = typeof partnerUsers.$inferSelect;
export type InsertPartnerUser = typeof partnerUsers.$inferInsert;

/**
 * Partner Deals - Deals submitted by partners
 */
export const partnerDeals = mysqlTable("partner_deals", {
  id: int("id").autoincrement().primaryKey(),
  dealName: varchar("dealName", { length: 255 }).notNull(),
  partnerCompanyId: int("partnerCompanyId").notNull(),
  
  // Customer information
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }),
  customerPhone: varchar("customerPhone", { length: 50 }),
  customerIndustry: varchar("customerIndustry", { length: 100 }),
  customerSize: mysqlEnum("customerSize", [
    "Startup",
    "SMB",
    "Mid-Market",
    "Enterprise",
    "Government"
  ]),
  
  // Deal details
  dealAmount: decimal("dealAmount", { precision: 15, scale: 2 }).notNull(),
  dealStage: mysqlEnum("dealStage", [
    "Qualified Lead",
    "Proposal",
    "Negotiation",
    "Closed Won",
    "Closed Lost"
  ]).default("Qualified Lead").notNull(),
  
  expectedCloseDate: timestamp("expectedCloseDate"),
  closedDate: timestamp("closedDate"),
  
  // Product/service
  productInterest: text("productInterest"), // JSON array of products
  description: text("description"),
  
  // Commission tracking
  commissionPercentage: decimal("commissionPercentage", { precision: 5, scale: 2 }),
  commissionAmount: decimal("commissionAmount", { precision: 15, scale: 2 }),
  commissionPaid: boolean("commissionPaid").default(false),
  commissionPaidDate: timestamp("commissionPaidDate"),
  
  // Metadata
  submittedBy: int("submittedBy").notNull(), // partner user who submitted
  internalOwner: int("internalOwner"), // Visium sales rep assigned
  notes: text("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  partnerIdx: index("partner_idx").on(table.partnerCompanyId),
  stageIdx: index("stage_idx").on(table.dealStage),
  submittedIdx: index("submitted_idx").on(table.submittedBy),
}));

export type PartnerDeal = typeof partnerDeals.$inferSelect;
export type InsertPartnerDeal = typeof partnerDeals.$inferInsert;

/**
 * Partner Resources - Training materials, collateral, documentation
 */
export const partnerResources = mysqlTable("partner_resources", {
  id: int("id").autoincrement().primaryKey(),
  resourceName: varchar("resourceName", { length: 255 }).notNull(),
  
  resourceType: mysqlEnum("resourceType", [
    "Training Video",
    "Sales Collateral",
    "Technical Documentation",
    "Case Study",
    "Presentation",
    "Whitepaper",
    "Demo",
    "Tool",
    "Other"
  ]).notNull(),
  
  description: text("description"),
  fileUrl: varchar("fileUrl", { length: 512 }).notNull(),
  fileSize: int("fileSize"), // in bytes
  
  // Access control
  accessLevel: mysqlEnum("accessLevel", [
    "Public",
    "Partner",
    "Premium Partner",
    "Internal Only"
  ]).default("Partner").notNull(),
  
  partnerTierRequired: mysqlEnum("partnerTierRequired", [
    "Standard",
    "Bronze",
    "Silver",
    "Gold"
  ]).default("Standard"),
  
  // Metadata
  category: varchar("category", { length: 100 }),
  tags: text("tags"), // JSON array
  downloadCount: int("downloadCount").default(0),
  lastUpdated: timestamp("lastUpdated"),
  
  createdBy: int("createdBy").notNull(), // Visium user
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  typeIdx: index("type_idx").on(table.resourceType),
  accessIdx: index("access_idx").on(table.accessLevel),
  categoryIdx: index("category_idx").on(table.category),
}));

export type PartnerResource = typeof partnerResources.$inferSelect;
export type InsertPartnerResource = typeof partnerResources.$inferInsert;

/**
 * Partner Analytics - Track partner performance metrics
 */
export const partnerAnalytics = mysqlTable("partner_analytics", {
  id: int("id").autoincrement().primaryKey(),
  partnerCompanyId: int("partnerCompanyId").notNull(),
  
  // Period tracking
  period: varchar("period", { length: 20 }).notNull(), // YYYY-MM format
  
  // Deal metrics
  dealsSubmitted: int("dealsSubmitted").default(0),
  dealsWon: int("dealsWon").default(0),
  dealsLost: int("dealsLost").default(0),
  
  // Revenue metrics
  totalDealValue: decimal("totalDealValue", { precision: 15, scale: 2 }).default("0.00"),
  totalCommissionEarned: decimal("totalCommissionEarned", { precision: 15, scale: 2 }).default("0.00"),
  totalCommissionPaid: decimal("totalCommissionPaid", { precision: 15, scale: 2 }).default("0.00"),
  
  // Engagement metrics
  resourceDownloads: int("resourceDownloads").default(0),
  trainingCompletions: int("trainingCompletions").default(0),
  supportTickets: int("supportTickets").default(0),
  
  // Performance indicators
  conversionRate: decimal("conversionRate", { precision: 5, scale: 2 }).default("0.00"), // percentage
  averageDealSize: decimal("averageDealSize", { precision: 15, scale: 2 }).default("0.00"),
  salesVelocity: int("salesVelocity").default(0), // days to close
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  partnerIdx: index("partner_idx").on(table.partnerCompanyId),
  periodIdx: index("period_idx").on(table.period),
}));

export type PartnerAnalytics = typeof partnerAnalytics.$inferSelect;
export type InsertPartnerAnalytics = typeof partnerAnalytics.$inferInsert;

/**
 * Partner MDF Claims - Marketing Development Fund usage tracking
 */
export const partnerMdfClaims = mysqlTable("partner_mdf_claims", {
  id: int("id").autoincrement().primaryKey(),
  partnerCompanyId: int("partnerCompanyId").notNull(),
  
  claimName: varchar("claimName", { length: 255 }).notNull(),
  description: text("description"),
  
  // Campaign details
  campaignType: mysqlEnum("campaignType", [
    "Digital Marketing",
    "Event Sponsorship",
    "Content Creation",
    "Sales Enablement",
    "Training",
    "Co-Marketing",
    "Other"
  ]).notNull(),
  
  // Financial
  requestedAmount: decimal("requestedAmount", { precision: 15, scale: 2 }).notNull(),
  approvedAmount: decimal("approvedAmount", { precision: 15, scale: 2 }),
  paidAmount: decimal("paidAmount", { precision: 15, scale: 2 }).default("0.00"),
  
  // Status tracking
  status: mysqlEnum("status", [
    "Draft",
    "Submitted",
    "Under Review",
    "Approved",
    "Rejected",
    "Paid",
    "Archived"
  ]).default("Draft").notNull(),
  
  // Dates
  submittedDate: timestamp("submittedDate"),
  approvedDate: timestamp("approvedDate"),
  paidDate: timestamp("paidDate"),
  
  // Supporting documentation
  attachmentUrl: varchar("attachmentUrl", { length: 512 }),
  approvalNotes: text("approvalNotes"),
  
  submittedBy: int("submittedBy").notNull(), // partner user
  approvedBy: int("approvedBy"), // Visium user
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  partnerIdx: index("partner_idx").on(table.partnerCompanyId),
  statusIdx: index("status_idx").on(table.status),
  submittedIdx: index("submitted_idx").on(table.submittedBy),
}));

export type PartnerMdfClaim = typeof partnerMdfClaims.$inferSelect;
export type InsertPartnerMdfClaim = typeof partnerMdfClaims.$inferInsert;


/**
 * Email Notifications - Track all email notifications sent to partners
 */
export const emailNotifications = mysqlTable("email_notifications", {
  id: int("id").autoincrement().primaryKey(),
  
  // Recipient information
  recipientEmail: varchar("recipientEmail", { length: 320 }).notNull(),
  recipientName: varchar("recipientName", { length: 255 }),
  partnerCompanyId: int("partnerCompanyId").notNull(),
  
  // Email details
  subject: varchar("subject", { length: 255 }).notNull(),
  templateType: mysqlEnum("templateType", [
    "deal_submitted",
    "deal_qualified",
    "deal_proposal",
    "deal_negotiation",
    "deal_won",
    "deal_lost",
    "mdf_submitted",
    "mdf_approved",
    "mdf_rejected",
    "mdf_paid",
    "custom"
  ]).notNull(),
  
  // Content
  htmlContent: text("htmlContent").notNull(),
  textContent: text("textContent"),
  
  // Related entity
  relatedEntityType: mysqlEnum("relatedEntityType", [
    "deal",
    "mdf_claim",
    "other"
  ]).notNull(),
  relatedEntityId: int("relatedEntityId"),
  
  // Delivery tracking
  status: mysqlEnum("status", [
    "pending",
    "sent",
    "failed",
    "bounced",
    "opened",
    "clicked"
  ]).default("pending").notNull(),
  
  sentAt: timestamp("sentAt"),
  failureReason: text("failureReason"),
  retryCount: int("retryCount").default(0),
  maxRetries: int("maxRetries").default(3),
  
  // Metadata
  metadata: text("metadata"), // JSON object for additional tracking data
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  emailIdx: index("email_idx").on(table.recipientEmail),
  partnerIdx: index("partner_idx").on(table.partnerCompanyId),
  statusIdx: index("status_idx").on(table.status),
  templateIdx: index("template_idx").on(table.templateType),
  entityIdx: index("entity_idx").on(table.relatedEntityId),
}));

export type EmailNotification = typeof emailNotifications.$inferSelect;
export type InsertEmailNotification = typeof emailNotifications.$inferInsert;

/**
 * Email Templates - Customizable email templates for notifications
 */
export const emailTemplates = mysqlTable("email_templates", {
  id: int("id").autoincrement().primaryKey(),
  
  templateType: mysqlEnum("templateType", [
    "deal_submitted",
    "deal_qualified",
    "deal_proposal",
    "deal_negotiation",
    "deal_won",
    "deal_lost",
    "mdf_submitted",
    "mdf_approved",
    "mdf_rejected",
    "mdf_paid",
    "custom"
  ]).notNull().unique(),
  
  // Template content
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  subject: varchar("subject", { length: 255 }).notNull(),
  htmlTemplate: text("htmlTemplate").notNull(),
  textTemplate: text("textTemplate"),
  
  // Variables that can be used in template
  variables: text("variables"), // JSON array of available variables
  
  // Status
  isActive: boolean("isActive").default(true),
  isDefault: boolean("isDefault").default(false),
  
  // Metadata
  createdBy: int("createdBy").notNull(), // Visium admin user
  updatedBy: int("updatedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  typeIdx: index("type_idx").on(table.templateType),
  activeIdx: index("active_idx").on(table.isActive),
}));

export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type InsertEmailTemplate = typeof emailTemplates.$inferInsert;

/**
 * Partner Notification Preferences - Allow partners to customize notification settings
 */
export const partnerNotificationPreferences = mysqlTable("partner_notification_preferences", {
  id: int("id").autoincrement().primaryKey(),
  partnerCompanyId: int("partnerCompanyId").notNull().unique(),
  
  // Deal notifications
  notifyOnDealSubmitted: boolean("notifyOnDealSubmitted").default(true),
  notifyOnDealQualified: boolean("notifyOnDealQualified").default(true),
  notifyOnDealProposal: boolean("notifyOnDealProposal").default(true),
  notifyOnDealNegotiation: boolean("notifyOnDealNegotiation").default(true),
  notifyOnDealWon: boolean("notifyOnDealWon").default(true),
  notifyOnDealLost: boolean("notifyOnDealLost").default(true),
  
  // MDF notifications
  notifyOnMdfSubmitted: boolean("notifyOnMdfSubmitted").default(true),
  notifyOnMdfApproved: boolean("notifyOnMdfApproved").default(true),
  notifyOnMdfRejected: boolean("notifyOnMdfRejected").default(true),
  notifyOnMdfPaid: boolean("notifyOnMdfPaid").default(true),
  
  // Email preferences
  emailFrequency: mysqlEnum("emailFrequency", [
    "immediate",
    "daily_digest",
    "weekly_digest",
    "never"
  ]).default("immediate").notNull(),
  
  // Recipient emails (comma-separated or JSON array)
  notificationEmails: text("notificationEmails").notNull(), // JSON array of email addresses
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  partnerIdx: index("partner_idx").on(table.partnerCompanyId),
}));

export type PartnerNotificationPreferences = typeof partnerNotificationPreferences.$inferSelect;
export type InsertPartnerNotificationPreferences = typeof partnerNotificationPreferences.$inferInsert;


/**
 * Partner Onboarding Sessions - Track wizard progress for new partners
 */
export const partnerOnboardingSessions = mysqlTable("partner_onboarding_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  
  // Onboarding progress
  currentStep: int("currentStep").default(1).notNull(),
  completedSteps: text("completedSteps").default(JSON.stringify([])).notNull(),
  
  // Step 1: Company Information
  companyName: varchar("companyName", { length: 255 }),
  website: varchar("website", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  country: varchar("country", { length: 100 }),
  zipCode: varchar("zipCode", { length: 20 }),
  
  // Step 2: Partner Type
  partnerType: mysqlEnum("partnerType", [
    "Reseller",
    "Technology Partner",
    "System Integrator",
    "Managed Service Provider",
    "Consulting Partner",
    "Channel Partner",
    "OEM Partner",
    "Other"
  ]),
  
  // Step 3: Commission Tier
  tier: mysqlEnum("tier", [
    "Gold",
    "Silver",
    "Bronze",
    "Standard"
  ]),
  
  // Step 4: MDF Budget
  mdfBudgetAnnual: decimal("mdfBudgetAnnual", { precision: 12, scale: 2 }),
  
  // Step 5: Contact Information
  primaryContactName: varchar("primaryContactName", { length: 255 }),
  primaryContactEmail: varchar("primaryContactEmail", { length: 320 }),
  primaryContactPhone: varchar("primaryContactPhone", { length: 50 }),
  
  // Status
  status: mysqlEnum("status", ["In Progress", "Completed", "Abandoned"]).default("In Progress").notNull(),
  completedAt: timestamp("completedAt"),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});
