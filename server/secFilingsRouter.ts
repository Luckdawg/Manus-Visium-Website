import { router, publicProcedure } from "./_core/trpc";
import { getDb } from "./db";
import { secFilings } from "../drizzle/schema";
import { z } from "zod";
import { desc, eq } from "drizzle-orm";

export const secFilingsRouter = router({
  // Get all SEC filings
  getAll: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const filings = await db.select().from(secFilings).orderBy(desc(secFilings.filingDate));
    return filings;
  }),

  // Get filings by type
  getByType: publicProcedure
    .input(z.object({ type: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const filings = await db
        .select()
        .from(secFilings)
        .where(eq(secFilings.filingType, input.type))
        .orderBy(desc(secFilings.filingDate));
      return filings;
    }),

  // Get recent filings (last N)
  getRecent: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const filings = await db
        .select()
        .from(secFilings)
        .orderBy(desc(secFilings.filingDate))
        .limit(input.limit);
      return filings;
    }),
});
