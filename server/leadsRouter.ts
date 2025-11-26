import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { whitepaperLeads } from "../drizzle/schema";

export const leadsRouter = router({
  submitWhitepaperLead: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        company: z.string().min(1, "Company is required"),
        resource: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        const [lead] = await db
          .insert(whitepaperLeads)
          .values({
            name: input.name,
            email: input.email,
            company: input.company,
            resource: input.resource,
          })
          .$returningId();

        return {
          success: true,
          leadId: lead.id,
        };
      } catch (error) {
        console.error("Error submitting whitepaper lead:", error);
        throw new Error("Failed to submit lead");
      }
    }),
});
