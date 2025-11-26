import { pgTable, text, timestamp, serial } from "drizzle-orm/pg-core";

export const whitepaperLeads = pgTable("whitepaper_leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  resource: text("resource").notNull(), // e.g., "Architecture Whitepaper"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type WhitepaperLead = typeof whitepaperLeads.$inferSelect;
export type NewWhitepaperLead = typeof whitepaperLeads.$inferInsert;
