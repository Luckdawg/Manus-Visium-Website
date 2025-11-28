import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "../routers";
import { getDb } from "../db";

describe("Leads and Newsletter API Tests", () => {
  beforeAll(async () => {
    // Ensure database is available
    const db = await getDb();
    expect(db).toBeDefined();
  });

  describe("Leads Router", () => {
    it("should fetch all whitepaper leads", async () => {
      const caller = appRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: null,
      });

      const leads = await caller.leads.getAll();
      expect(Array.isArray(leads)).toBe(true);
      // Each lead should have required fields
      if (leads.length > 0) {
        const lead = leads[0];
        expect(lead).toHaveProperty("id");
        expect(lead).toHaveProperty("name");
        expect(lead).toHaveProperty("email");
        expect(lead).toHaveProperty("company");
        expect(lead).toHaveProperty("createdAt");
      }
    });
  });

  describe("Newsletter Router", () => {
    it("should fetch all newsletter subscribers", async () => {
      const caller = appRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: null,
      });

      const subscribers = await caller.newsletter.getAll();
      expect(Array.isArray(subscribers)).toBe(true);
      // Each subscriber should have required fields
      if (subscribers.length > 0) {
        const sub = subscribers[0];
        expect(sub).toHaveProperty("id");
        expect(sub).toHaveProperty("email");
        expect(sub).toHaveProperty("status");
        expect(sub).toHaveProperty("subscribedAt");
      }
    });
  });

  describe("Campaigns Router", () => {
    it("should fetch all email campaigns", async () => {
      const caller = appRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: null,
      });

      const campaigns = await caller.campaigns.getAll();
      expect(Array.isArray(campaigns)).toBe(true);
      // Each campaign should have required fields
      if (campaigns.length > 0) {
        const campaign = campaigns[0];
        expect(campaign).toHaveProperty("id");
        expect(campaign).toHaveProperty("leadEmail");
        expect(campaign).toHaveProperty("campaignType");
        expect(campaign).toHaveProperty("status");
        expect(campaign).toHaveProperty("scheduledDate");
      }
    });
  });
});
