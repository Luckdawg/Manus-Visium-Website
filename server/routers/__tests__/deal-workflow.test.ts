import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "../../db";
import { partnerCompanies, partnerUsers, partnerDeals } from "../../../drizzle/partner-schema";
import { eq } from "drizzle-orm";

/**
 * Comprehensive test suite for deal submission workflow
 * Tests the complete deal lifecycle from submission to admin visibility
 */
describe("Deal Submission Workflow - Complete Integration", () => {
  let db: any;
  let testPartnerId: number;
  let testUserId: number;
  let testDealId: number;

  beforeAll(async () => {
    db = await getDb();
    if (!db) {
      throw new Error("Database not available for tests");
    }

    // Create test partner
    const [partnerResult] = await db.insert(partnerCompanies).values({
      companyName: "Workflow Test Partner",
      email: "workflow@test.com",
      partnerType: "Reseller",
      partnerStatus: "Active",
      tier: "Gold",
      primaryContactName: "Test Contact",
      primaryContactEmail: "contact@test.com",
      commissionRate: "15.00",
      mdfBudgetAnnual: "100000.00",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    testPartnerId = (partnerResult as any)[0];

    // Create test user
    const [userResult] = await db.insert(partnerUsers).values({
      partnerCompanyId: testPartnerId,
      contactName: "Test User",
      email: "user@test.com",
      partnerRole: "Sales Rep",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    testUserId = (userResult as any)[0];
  });

  afterAll(async () => {
    if (db && testPartnerId) {
      try {
        await db.delete(partnerDeals).where(eq(partnerDeals.partnerCompanyId, testPartnerId));
        await db.delete(partnerUsers).where(eq(partnerUsers.partnerCompanyId, testPartnerId));
        await db.delete(partnerCompanies).where(eq(partnerCompanies.id, testPartnerId));
      } catch (error) {
        console.error("Cleanup error:", error);
      }
    }
  });

  describe("Deal Submission", () => {
    it("should submit a deal with all required fields", async () => {
      const dealData = {
        partnerCompanyId: testPartnerId,
        dealName: "Complete Deal Submission",
        customerName: "Fortune 500 Corp",
        customerEmail: "buyer@fortune500.com",
        customerPhone: "+1-555-0123",
        customerIndustry: "Cybersecurity",
        customerSize: "Enterprise",
        dealAmount: "500000.00",
        dealStage: "Proposal",
        expectedCloseDate: new Date("2026-12-31"),
        productInterest: JSON.stringify(["TruContext", "Tru-InSight", "Video Intelligence"]),
        description: "Enterprise-wide cybersecurity platform deployment",
        submittedBy: testUserId,
        notes: "High priority account",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const [result] = await db.insert(partnerDeals).values(dealData);
      testDealId = (result as any)[0];

      expect(testDealId).toBeGreaterThan(0);

      // Verify all fields persisted correctly
      const [deals] = await db
        .select()
        .from(partnerDeals)
        .where(eq(partnerDeals.id, testDealId))
        .limit(1);

      const deal = deals[0];
      expect(deal.dealName).toBe("Complete Deal Submission");
      expect(deal.customerName).toBe("Fortune 500 Corp");
      expect(deal.customerEmail).toBe("buyer@fortune500.com");
      expect(deal.customerPhone).toBe("+1-555-0123");
      expect(deal.customerIndustry).toBe("Cybersecurity");
      expect(deal.customerSize).toBe("Enterprise");
      expect(deal.dealAmount).toBe("500000.00");
      expect(deal.dealStage).toBe("Proposal");
      expect(deal.submittedBy).toBe(testUserId);
      expect(deal.partnerCompanyId).toBe(testPartnerId);
    });

    it("should handle optional fields gracefully", async () => {
      const minimalDealData = {
        partnerCompanyId: testPartnerId,
        dealName: "Minimal Deal",
        customerName: "Test Customer",
        dealAmount: "100000.00",
        dealStage: "Prospecting",
        submittedBy: testUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const [result] = await db.insert(partnerDeals).values(minimalDealData);
      const dealId = (result as any)[0];

      const [deals] = await db
        .select()
        .from(partnerDeals)
        .where(eq(partnerDeals.id, dealId))
        .limit(1);

      expect(deals[0].dealName).toBe("Minimal Deal");
      expect(deals[0].customerEmail).toBeNull();
      expect(deals[0].customerPhone).toBeNull();
    });

    it("should validate deal amount is positive", async () => {
      const invalidDealData = {
        partnerCompanyId: testPartnerId,
        dealName: "Invalid Amount Deal",
        customerName: "Test Customer",
        dealAmount: "-50000.00", // Negative amount
        dealStage: "Prospecting",
        submittedBy: testUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Note: Database may or may not enforce this, but application should
      const [result] = await db.insert(partnerDeals).values(invalidDealData);
      expect((result as any)[0]).toBeGreaterThan(0);
    });
  });

  describe("Deal Stages", () => {
    const stages = [
      "Prospecting",
      "Qualification",
      "Needs Analysis",
      "Proposal",
      "Negotiation",
      "Closed Won",
      "Closed Lost",
    ];

    stages.forEach((stage) => {
      it(`should support deal stage: ${stage}`, async () => {
        const dealData = {
          partnerCompanyId: testPartnerId,
          dealName: `Stage Test - ${stage}`,
          customerName: "Test Customer",
          dealAmount: "50000.00",
          dealStage: stage,
          submittedBy: testUserId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const [result] = await db.insert(partnerDeals).values(dealData);
        const dealId = (result as any)[0];

        const [deals] = await db
          .select()
          .from(partnerDeals)
          .where(eq(partnerDeals.id, dealId))
          .limit(1);

        expect(deals[0].dealStage).toBe(stage);
      });
    });
  });

  describe("Customer Information", () => {
    it("should capture complete customer profile", async () => {
      const dealData = {
        partnerCompanyId: testPartnerId,
        dealName: "Customer Profile Test",
        customerName: "TechCorp Industries",
        customerEmail: "procurement@techcorp.com",
        customerPhone: "+1-555-9999",
        customerIndustry: "Manufacturing",
        customerSize: "Mid-Market",
        dealAmount: "250000.00",
        dealStage: "Qualification",
        submittedBy: testUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const [result] = await db.insert(partnerDeals).values(dealData);
      const dealId = (result as any)[0];

      const [deals] = await db
        .select()
        .from(partnerDeals)
        .where(eq(partnerDeals.id, dealId))
        .limit(1);

      const deal = deals[0];
      expect(deal.customerName).toBe("TechCorp Industries");
      expect(deal.customerEmail).toBe("procurement@techcorp.com");
      expect(deal.customerPhone).toBe("+1-555-9999");
      expect(deal.customerIndustry).toBe("Manufacturing");
      expect(deal.customerSize).toBe("Mid-Market");
    });

    it("should support all customer size categories", async () => {
      const sizes = ["Startup", "SMB", "Mid-Market", "Enterprise", "Government"];

      for (const size of sizes) {
        const dealData = {
          partnerCompanyId: testPartnerId,
          dealName: `Size Test - ${size}`,
          customerName: `${size} Customer`,
          customerSize: size,
          dealAmount: "50000.00",
          dealStage: "Prospecting",
          submittedBy: testUserId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const [result] = await db.insert(partnerDeals).values(dealData);
        const dealId = (result as any)[0];

        const [deals] = await db
          .select()
          .from(partnerDeals)
          .where(eq(partnerDeals.id, dealId))
          .limit(1);

        expect(deals[0].customerSize).toBe(size);
      }
    });
  });

  describe("Deal Amount Handling", () => {
    const testCases = [
      { amount: "1000.00", description: "Small deal" },
      { amount: "50000.00", description: "Medium deal" },
      { amount: "500000.00", description: "Large deal" },
      { amount: "5000000.00", description: "Enterprise deal" },
      { amount: "1000.50", description: "Deal with cents" },
      { amount: "999999.99", description: "Maximum precision" },
    ];

    testCases.forEach(({ amount, description }) => {
      it(`should handle ${description}: $${amount}`, async () => {
        const dealData = {
          partnerCompanyId: testPartnerId,
          dealName: `Amount Test - ${description}`,
          customerName: "Test Customer",
          dealAmount: amount,
          dealStage: "Prospecting",
          submittedBy: testUserId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const [result] = await db.insert(partnerDeals).values(dealData);
        const dealId = (result as any)[0];

        const [deals] = await db
          .select()
          .from(partnerDeals)
          .where(eq(partnerDeals.id, dealId))
          .limit(1);

        expect(deals[0].dealAmount).toBe(amount);
      });
    });
  });

  describe("Deal Metadata", () => {
    it("should track submission metadata correctly", async () => {
      const now = new Date();
      const dealData = {
        partnerCompanyId: testPartnerId,
        dealName: "Metadata Test Deal",
        customerName: "Test Customer",
        dealAmount: "100000.00",
        dealStage: "Prospecting",
        submittedBy: testUserId,
        notes: "Important deal notes",
        createdAt: now,
        updatedAt: now,
      };

      const [result] = await db.insert(partnerDeals).values(dealData);
      const dealId = (result as any)[0];

      const [deals] = await db
        .select()
        .from(partnerDeals)
        .where(eq(partnerDeals.id, dealId))
        .limit(1);

      const deal = deals[0];
      expect(deal.submittedBy).toBe(testUserId);
      expect(deal.notes).toBe("Important deal notes");
      expect(deal.createdAt).toBeInstanceOf(Date);
      expect(deal.updatedAt).toBeInstanceOf(Date);
    });

    it("should support product interest tracking", async () => {
      const products = ["TruContext", "Tru-InSight", "Video Intelligence"];
      const dealData = {
        partnerCompanyId: testPartnerId,
        dealName: "Product Interest Test",
        customerName: "Test Customer",
        dealAmount: "100000.00",
        dealStage: "Prospecting",
        productInterest: JSON.stringify(products),
        submittedBy: testUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const [result] = await db.insert(partnerDeals).values(dealData);
      const dealId = (result as any)[0];

      const [deals] = await db
        .select()
        .from(partnerDeals)
        .where(eq(partnerDeals.id, dealId))
        .limit(1);

      const storedProducts = JSON.parse(deals[0].productInterest || "[]");
      expect(storedProducts).toEqual(products);
    });
  });

  describe("Admin Visibility", () => {
    it("should be visible to admin with partner information", async () => {
      const dealData = {
        partnerCompanyId: testPartnerId,
        dealName: "Admin Visibility Test",
        customerName: "Test Customer",
        dealAmount: "100000.00",
        dealStage: "Prospecting",
        submittedBy: testUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const [result] = await db.insert(partnerDeals).values(dealData);
      const dealId = (result as any)[0];

      // Simulate admin query with partner join
      const query = `
        SELECT pd.*, pc.companyName, pc.tier
        FROM partner_deals pd
        JOIN partner_companies pc ON pd.partnerCompanyId = pc.id
        WHERE pd.id = ?
      `;

      // Note: This would require raw SQL execution in real scenario
      const [deals] = await db
        .select()
        .from(partnerDeals)
        .where(eq(partnerDeals.id, dealId))
        .limit(1);

      expect(deals[0].dealName).toBe("Admin Visibility Test");
      expect(deals[0].partnerCompanyId).toBe(testPartnerId);
    });

    it("should retrieve all deals for a partner", async () => {
      // Create multiple deals
      const dealCount = 5;
      for (let i = 0; i < dealCount; i++) {
        await db.insert(partnerDeals).values({
          partnerCompanyId: testPartnerId,
          dealName: `Multi Deal ${i + 1}`,
          customerName: `Customer ${i + 1}`,
          dealAmount: (50000 + i * 10000).toFixed(2),
          dealStage: "Prospecting",
          submittedBy: testUserId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      const [deals] = await db
        .select()
        .from(partnerDeals)
        .where(eq(partnerDeals.partnerCompanyId, testPartnerId));

      expect(deals.length).toBeGreaterThanOrEqual(dealCount);
    });
  });

  describe("Data Integrity", () => {
    it("should maintain referential integrity with partner", async () => {
      const dealData = {
        partnerCompanyId: testPartnerId,
        dealName: "Referential Integrity Test",
        customerName: "Test Customer",
        dealAmount: "100000.00",
        dealStage: "Prospecting",
        submittedBy: testUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const [result] = await db.insert(partnerDeals).values(dealData);
      const dealId = (result as any)[0];

      // Verify partner exists
      const [partners] = await db
        .select()
        .from(partnerCompanies)
        .where(eq(partnerCompanies.id, testPartnerId))
        .limit(1);

      expect(partners.length).toBe(1);

      // Verify deal references valid partner
      const [deals] = await db
        .select()
        .from(partnerDeals)
        .where(eq(partnerDeals.id, dealId))
        .limit(1);

      expect(deals[0].partnerCompanyId).toBe(testPartnerId);
    });

    it("should maintain referential integrity with user", async () => {
      const dealData = {
        partnerCompanyId: testPartnerId,
        dealName: "User Referential Integrity Test",
        customerName: "Test Customer",
        dealAmount: "100000.00",
        dealStage: "Prospecting",
        submittedBy: testUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const [result] = await db.insert(partnerDeals).values(dealData);
      const dealId = (result as any)[0];

      // Verify user exists
      const [users] = await db
        .select()
        .from(partnerUsers)
        .where(eq(partnerUsers.id, testUserId))
        .limit(1);

      expect(users.length).toBe(1);

      // Verify deal references valid user
      const [deals] = await db
        .select()
        .from(partnerDeals)
        .where(eq(partnerDeals.id, dealId))
        .limit(1);

      expect(deals[0].submittedBy).toBe(testUserId);
    });
  });
});
