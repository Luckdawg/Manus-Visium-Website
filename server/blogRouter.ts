import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { blogLeads } from "../drizzle/schema";
import { notifyOwner } from "./_core/notification";

export const blogRouter = router({
  submitBlogLead: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        company: z.string().min(1, "Company is required"),
        blogTitle: z.string().min(1, "Blog title is required"),
      })
    )
    .mutation(async ({ input }) => {
      // Insert lead into database
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const [lead] = await db.insert(blogLeads).values({
        name: input.name,
        email: input.email,
        company: input.company,
        blogTitle: input.blogTitle,
      });

      // Send email notification to info@visiumtechnologies.com
      const notificationSent = await notifyOwner({
        title: `New Blog Download Lead: ${input.name}`,
        content: `
📥 New Blog Download Lead Captured

Lead Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Name: ${input.name}
📧 Email: ${input.email}
🏢 Company: ${input.company}
📄 Blog Article: ${input.blogTitle}
🕐 Timestamp: ${new Date().toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Action Items:
• Send follow-up email to ${input.email}
• Add contact to CRM system
• Consider for nurture campaign

This lead was captured from the blog page download form.
        `.trim(),
      });

      if (!notificationSent) {
        console.error("Failed to send blog lead notification");
      }

      return {
        success: true,
        leadId: lead.insertId,
        message: "Lead captured successfully",
      };
    }),
});
