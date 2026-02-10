import { mysqlTable, int, varchar, text, timestamp, mysqlEnum, boolean, decimal, index } from "drizzle-orm/mysql-core";

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
  
  primaryContactName: varchar("primaryContactName", { length: 255 }).notNull(),
  primaryContactEmail: varchar("primaryContactEmail", { length: 320 }).notNull(),
  primaryContactPhone: varchar("primaryContactPhone", { length: 50 }),
  
  commissionRate: decimal("commissionRate", { precision: 5, scale: 2 }).default("10.00"),
  mdfBudgetAnnual: decimal("mdfBudgetAnnual", { precision: 15, scale: 2 }).default("0.00"),
  
  description: text("description"),
  logoUrl: varchar("logoUrl", { length: 512 }),
  certifications: text("certifications"),
  specializations: text("specializations"),
  
  accountManagerId: int("accountManagerId"),
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
 * Partner Users - Individual users from partner companies with email/password auth
 */
export const partnerUsers = mysqlTable("partner_users", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // Reference to main users table (optional for OAuth)
  partnerCompanyId: int("partnerCompanyId").notNull(),
  
  // Email/password authentication for self-registration
  email: varchar("email", { length: 320 }).unique(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  emailVerified: boolean("emailVerified").default(false),
  
  // User information
  contactName: varchar("contactName", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  
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
  emailIdx: index("email_idx").on(table.email),
}));

export type PartnerUser = typeof partnerUsers.$inferSelect;
export type InsertPartnerUser = typeof partnerUsers.$inferInsert;
