import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "../../db";
import { partnerCompanies, partnerUsers, partnerDeals } from "../../../drizzle/partner-schema";
import { eq } from "drizzle-orm";

/**
 * Integration tests for deal submission workflow
 * Tests the complete flow from partner registration to deal submission
 */
describe("Deal Submission Workflow", () => {
  let db: any;
  let testPartnerId: number;
  let testUserId: number;

  beforeAll(async () => {
    db = await getDb();
    if (!db) {
      throw new Error("Database not available for tests");
    }
  });

  afterAll(async () => {
    // Cleanup test data
    if (db && testPartnerId) {
      try {
        // Delete deals first (foreign key constraint)
        await db.delete(partnerDeals).where(eq(partnerDeals.partnerCompanyId, testPartnerId));
        // Delete users
        await db.delete(partnerUsers).where(eq(partnerUsers.partnerCompanyId, testPartnerId));
        // Delete partner company
        await db.delete(partnerCompanies).where(eq(partnerCompanies.id, testPartnerId));
      } catch (error) {
        console.error("Cleanup error:", error);
      }
    }
  });

  it("should create a test partner company", async () => {
    const result = await db.insert(partnerCompanies).values({
      companyName: "Test Partner Corp",
      email: "test@partner.com",
      partnerType: "Reseller",
      partnerStatus: "Active",
      tier: "Gold",
      primaryContactName: "John Doe",
      primaryContactEmail: "john@partner.com",
      commissionRate: "10.00",
      mdfBudgetAnnual: "50000.00",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    testPartnerId = (result as any)[0];
    expect(testPartnerId).toBeGreaterThan(0);
  });

  it("should create a test partner user", async () => {
    const result = await db.insert(partnerUsers).values({
      partnerCompanyId: testPartnerId,
      contactName: "Jane Smith",
      email: "jane@partner.com",
      partnerRole: "Sales Rep",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    testUserId = (result as any)[0];
    expect(testUserId).toBeGreaterThan(0);
  });

  it("should submit a deal with correct field mapping", async () => {
    const dealData = {
      partnerCompanyId: testPartnerId,
      dealName: "Test Deal - TruContext Platform",
      customerName: "Acme Corporation",
      customerEmail: "contact@acme.com",
      customerPhone: "+1-555-0100",
      customerIndustry: "Cybersecurity",
      customerSize: "Enterprise",
      dealAmount: "250000.00", // Decimal as string
      dealStage: "Proposal",
      expectedCloseDate: new Date("2026-06-30"),
      productInterest: JSON.stringify(["TruContext", "Tru-InSight"]),
      description: "Enterprise security platform implementation",
      submittedBy: testUserId,
      notes: "Deal submitted via partner portal",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.insert(partnerDeals).values(dealData);
    const dealId = (result as any)[0];

    expect(dealId).toBeGreaterThan(0);

    // Verify the deal was created correctly
    const deals = await db
      .select()
      .from(partnerDeals)
      .where(eq(partnerDeals.id, dealId))
      .limit(1);

    expect(deals).toHaveLength(1);
    const deal = deals[0];

    expect(deal.dealName).toBe("Test Deal - TruContext Platform");
    expect(deal.customerName).toBe("Acme Corporation");
    expect(deal.customerEmail).toBe("contact@acme.com");
    expect(deal.customerIndustry).toBe("Cybersecurity");
    expect(deal.customerSize).toBe("Enterprise");
    expect(deal.dealAmount).toBe("250000.00");
    expect(deal.dealStage).toBe("Proposal");
    expect(deal.submittedBy).toBe(testUserId);
    expect(deal.partnerCompanyId).toBe(testPartnerId);
  });

  it("should handle decimal amounts correctly", async () => {
    const testAmounts = [
      { input: 1000.50, expected: "1000.50" },
      { input: 50000, expected: "50000.00" },
      { input: 999999.99, expected: "999999.99" },
    ];

    for (const { input, expected } of testAmounts) {
      const dealData = {
        partnerCompanyId: testPartnerId,
        dealName: `Test Deal - ${input}`,
        customerName: "Test Customer",
        dealAmount: input.toFixed(2), // Convert to string with 2 decimals
        dealStage: "Prospecting",
        submittedBy: testUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await db.insert(partnerDeals).values(dealData);
      const dealId = (result as any)[0];

      const deals = await db
        .select()
        .from(partnerDeals)
        .where(eq(partnerDeals.id, dealId))
        .limit(1);

      expect(deals[0].dealAmount).toBe(expected);
    }
  });

  it("should validate required fields", async () => {
    const invalidDealData = {
      partnerCompanyId: testPartnerId,
      // Missing dealName (required)
      customerName: "Test Customer",
      dealAmount: "50000.00",
      dealStage: "Prospecting",
      submittedBy: testUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await db.insert(partnerDeals).values(invalidDealData);
      expect.fail("Should have thrown an error for missing dealName");
    } catch (error: any) {
      expect(error.message).toContain("dealName");
    }
  });

  it("should handle deal stages correctly", async () => {
    const stages = [
      "Prospecting",
      "Qualification",
      "Needs Analysis",
      "Proposal",
      "Negotiation",
      "Closed Won",
      "Closed Lost",
    ];

    for (const stage of stages) {
      const dealData = {
        partnerCompanyId: testPartnerId,
        dealName: `Test Deal - ${stage}`,
        customerName: "Test Customer",
        dealAmount: "50000.00",
        dealStage: stage,
        submittedBy: testUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await db.insert(partnerDeals).values(dealData);
      const dealId = (result as any)[0];

      const deals = await db
        .select()
        .from(partnerDeals)
        .where(eq(partnerDeals.id, dealId))
        .limit(1);

      expect(deals[0].dealStage).toBe(stage);
    }
  });

  it("should retrieve all deals for a partner", async () => {
    // Create multiple deals
    const dealCount = 3;
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

    // Retrieve all deals for the partner
    const deals = await db
      .select()
      .from(partnerDeals)
      .where(eq(partnerDeals.partnerCompanyId, testPartnerId));

    expect(deals.length).toBeGreaterThanOrEqual(dealCount);
  });

  it("should track deal submission metadata", async () => {
    const dealData = {
      partnerCompanyId: testPartnerId,
      dealName: "Metadata Test Deal",
      customerName: "Test Customer",
      dealAmount: "100000.00",
      dealStage: "Prospecting",
      submittedBy: testUserId,
      notes: "Test notes for metadata tracking",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.insert(partnerDeals).values(dealData);
    const dealId = (result as any)[0];

    const deals = await db
      .select()
      .from(partnerDeals)
      .where(eq(partnerDeals.id, dealId))
      .limit(1);

    const deal = deals[0];
    expect(deal.submittedBy).toBe(testUserId);
    expect(deal.notes).toBe("Test notes for metadata tracking");
    expect(deal.createdAt).toBeInstanceOf(Date);
    expect(deal.updatedAt).toBeInstanceOf(Date);
  });
});
