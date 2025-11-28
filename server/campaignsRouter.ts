import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { emailCampaigns, whitepaperLeads } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const campaignsRouter = router({
  // Get all email campaigns with lead details
  getAll: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    const campaigns = await db
      .select({
        id: emailCampaigns.id,
        leadId: emailCampaigns.leadId,
        leadEmail: whitepaperLeads.email,
        leadName: whitepaperLeads.name,
        leadCompany: whitepaperLeads.company,
        campaignType: emailCampaigns.campaignStage,
        status: emailCampaigns.status,
        scheduledDate: emailCampaigns.scheduledFor,
        sentAt: emailCampaigns.sentAt,
        createdAt: emailCampaigns.createdAt,
      })
      .from(emailCampaigns)
      .leftJoin(whitepaperLeads, eq(emailCampaigns.leadId, whitepaperLeads.id))
      .orderBy(emailCampaigns.createdAt);

    return campaigns;
  }),
});
