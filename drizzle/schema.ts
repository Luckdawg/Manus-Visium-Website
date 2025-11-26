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
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
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

// TODO: Add your tables here