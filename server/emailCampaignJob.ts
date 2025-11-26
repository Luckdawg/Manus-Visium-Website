import { eq, and, lte } from "drizzle-orm";
import { getDb } from "./db";
import { emailCampaigns, whitepaperLeads } from "../drizzle/schema";
import { notifyOwner } from "./_core/notification";
import { getNotificationContent } from "./emailTemplates";

/**
 * Process pending email campaigns that are due to be sent
 * This function should be called periodically (e.g., every hour via cron)
 */
export async function processEmailCampaigns() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available for email campaign processing");
    return;
  }

  try {
    const now = new Date();
    
    // Find all pending campaigns that are scheduled for now or earlier
    const pendingCampaigns = await db
      .select({
        campaign: emailCampaigns,
        lead: whitepaperLeads,
      })
      .from(emailCampaigns)
      .innerJoin(whitepaperLeads, eq(emailCampaigns.leadId, whitepaperLeads.id))
      .where(
        and(
          eq(emailCampaigns.status, "pending"),
          lte(emailCampaigns.scheduledFor, now)
        )
      );

    console.log(`Found ${pendingCampaigns.length} pending email campaigns to process`);

    for (const { campaign, lead } of pendingCampaigns) {
      try {
        // Generate notification with email template
        const notification = getNotificationContent(
          campaign.campaignStage,
          lead.name,
          lead.email,
          lead.company,
          lead.id
        );

        // Send notification to owner with email template
        const sent = await notifyOwner(notification);

        if (sent) {
          // Mark campaign as sent
          await db
            .update(emailCampaigns)
            .set({
              status: "sent",
              sentAt: new Date(),
            })
            .where(eq(emailCampaigns.id, campaign.id));

          console.log(
            `✓ Sent ${campaign.campaignStage} email template for lead ${lead.id} (${lead.company})`
          );
        } else {
          // Mark as failed if notification service is unavailable
          await db
            .update(emailCampaigns)
            .set({
              status: "failed",
            })
            .where(eq(emailCampaigns.id, campaign.id));

          console.warn(
            `✗ Failed to send ${campaign.campaignStage} email template for lead ${lead.id}`
          );
        }
      } catch (error) {
        console.error(`Error processing campaign ${campaign.id}:`, error);
        
        // Mark as failed
        await db
          .update(emailCampaigns)
          .set({
            status: "failed",
          })
          .where(eq(emailCampaigns.id, campaign.id));
      }
    }

    return {
      processed: pendingCampaigns.length,
      timestamp: now.toISOString(),
    };
  } catch (error) {
    console.error("Error in processEmailCampaigns:", error);
    throw error;
  }
}

/**
 * Start the email campaign processor
 * Runs every hour to check for due campaigns
 */
export function startEmailCampaignScheduler() {
  // Run immediately on startup
  processEmailCampaigns().catch(console.error);

  // Then run every hour
  const intervalMs = 60 * 60 * 1000; // 1 hour
  setInterval(() => {
    processEmailCampaigns().catch(console.error);
  }, intervalMs);

  console.log("Email campaign scheduler started (runs every hour)");
}
