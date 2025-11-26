import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { whitepaperLeads, emailCampaigns } from "../drizzle/schema";
import { notifyOwner } from "./_core/notification";

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

        // Send notification email to sales team
        const timestamp = new Date().toLocaleString('en-US', {
          timeZone: 'America/New_York',
          dateStyle: 'full',
          timeStyle: 'long'
        });

        const notificationSent = await notifyOwner({
          title: `New Whitepaper Lead: ${input.company}`,
          content: `A new lead has downloaded the TruContext Architecture Whitepaper.

**Lead Details:**
- **Name:** ${input.name}
- **Email:** ${input.email}
- **Company:** ${input.company}
- **Resource:** ${input.resource}
- **Timestamp:** ${timestamp}
- **Lead ID:** ${lead.id}

Please follow up with this prospect at info@visiumtechnologies.com or call +1 (703) 273-0383.

This lead has shown high intent by downloading technical documentation and should be prioritized for sales outreach.`
        });

        if (!notificationSent) {
          console.warn(`Failed to send notification for lead ${lead.id}`);
        }

        // Schedule drip campaign emails (Day 1, Day 3, Day 7)
        const now = new Date();
        const campaignSchedule = [
          { stage: "day1" as const, daysDelay: 1 },
          { stage: "day3" as const, daysDelay: 3 },
          { stage: "day7" as const, daysDelay: 7 },
        ];

        for (const { stage, daysDelay } of campaignSchedule) {
          const scheduledDate = new Date(now);
          scheduledDate.setDate(scheduledDate.getDate() + daysDelay);
          scheduledDate.setHours(10, 0, 0, 0); // Schedule for 10 AM EST

          await db.insert(emailCampaigns).values({
            leadId: lead.id,
            campaignStage: stage,
            scheduledFor: scheduledDate,
            status: "pending",
          });
        }

        console.log(`Scheduled 3 drip campaign emails for lead ${lead.id}`);

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
