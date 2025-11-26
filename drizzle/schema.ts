import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "super_admin", "editor", "viewer"]).default("user").notNull(),
  password: varchar("password", { length: 255 }), // For local admin accounts
  twoFactorSecret: varchar("twoFactorSecret", { length: 64 }), // TOTP secret
  twoFactorEnabled: int("twoFactorEnabled").default(0).notNull(), // 0 = disabled, 1 = enabled
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Whitepaper leads table for tracking downloads
export const whitepaperLeads = mysqlTable("whitepaper_leads", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  company: text("company").notNull(),
  resource: varchar("resource", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WhitepaperLead = typeof whitepaperLeads.$inferSelect;
export type NewWhitepaperLead = typeof whitepaperLeads.$inferInsert;

// Email drip campaign tracking table
export const emailCampaigns = mysqlTable("email_campaigns", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(), // References whitepaper_leads.id
  campaignStage: mysqlEnum("campaignStage", ["day1", "day3", "day7"]).notNull(),
  scheduledFor: timestamp("scheduledFor").notNull(),
  sentAt: timestamp("sentAt"),
  status: mysqlEnum("status", ["pending", "sent", "failed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailCampaign = typeof emailCampaigns.$inferSelect;
export type NewEmailCampaign = typeof emailCampaigns.$inferInsert;

// CMS Content Pages table
export const cmsPages = mysqlTable("cms_pages", {
  id: int("id").autoincrement().primaryKey(),
  pageKey: varchar("pageKey", { length: 100 }).notNull().unique(), // e.g., "about", "platform-overview"
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(), // JSON string with editable sections
  lastEditedBy: int("lastEditedBy"), // References users.id
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CmsPage = typeof cmsPages.$inferSelect;
export type NewCmsPage = typeof cmsPages.$inferInsert;

// CMS Media Library table
export const cmsMedia = mysqlTable("cms_media", {
  id: int("id").autoincrement().primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("originalName", { length: 255 }).notNull(),
  mimeType: varchar("mimeType", { length: 100 }).notNull(),
  size: int("size").notNull(), // bytes
  url: varchar("url", { length: 500 }).notNull(), // S3 URL
  s3Key: varchar("s3Key", { length: 500 }).notNull(),
  uploadedBy: int("uploadedBy").notNull(), // References users.id
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CmsMedia = typeof cmsMedia.$inferSelect;
export type NewCmsMedia = typeof cmsMedia.$inferInsert;

// Audit Log table for tracking admin actions
export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // References users.id
  action: varchar("action", { length: 100 }).notNull(), // e.g., "user_created", "content_updated"
  entityType: varchar("entityType", { length: 50 }), // e.g., "user", "page", "media"
  entityId: int("entityId"), // ID of affected entity
  details: text("details"), // JSON with additional context
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;

// TODO: Add your tables here