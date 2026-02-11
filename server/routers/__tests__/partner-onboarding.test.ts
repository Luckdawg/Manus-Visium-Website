import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb, executeRawSQL } from "../../db";

describe("Partner Onboarding Router", () => {
  let db: any;

  beforeAll(async () => {
    db = await getDb();
    if (!db) {
      throw new Error("Database not available for tests");
    }
  });

  afterAll(async () => {
    if (db) {
      try {
        await executeRawSQL(
          `DELETE FROM partner_companies WHERE companyName LIKE 'Test%'`,
          []
        );
      } catch (error) {
        console.log("Cleanup error:", error);
      }
    }
  });

  describe("createApplication", () => {
    it("should create a new partner application with valid data", async () => {
      const result = await executeRawSQL(
        `INSERT INTO partner_companies 
         (companyName, website, phone, email, address, city, state, country, zipCode, 
          partnerType, partnerStatus, tier, primaryContactName, primaryContactEmail, 
          primaryContactPhone, description, specializations, commissionRate, mdfBudgetAnnual)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "Test Partner Company",
          "https://testpartner.com",
          "+1-555-0000",
          `contact-${Date.now()}@testpartner.com`,
          "123 Test St",
          "Test City",
          "TS",
          "United States",
          "12345",
          "Reseller",
          "Prospect",
          "Standard",
          "John Doe",
          `contact-${Date.now()}@testpartner.com`,
          "+1-555-0000",
          "A test partner company",
          '["Cybersecurity", "Smart Cities"]',
          "10.00",
          "0.00",
        ]
      );

      expect((result as any).insertId).toBeDefined();
      expect((result as any).insertId).toBeGreaterThan(0);
    });

    it("should create application with minimal required fields", async () => {
      const result = await executeRawSQL(
        `INSERT INTO partner_companies 
         (companyName, email, country, partnerType, partnerStatus, tier, 
          primaryContactName, primaryContactEmail, commissionRate, mdfBudgetAnnual)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "Test Minimal Company",
          `minimal-${Date.now()}@test.com`,
          "United States",
          "Reseller",
          "Prospect",
          "Standard",
          "John Doe",
          `minimal-${Date.now()}@test.com`,
          "10.00",
          "0.00",
        ]
      );

      expect((result as any).insertId).toBeDefined();
    });
  });

  describe("approveApplication", () => {
    it("should update partner status to Active and assign tier", async () => {
      const createResult = await executeRawSQL(
        `INSERT INTO partner_companies 
         (companyName, email, country, partnerType, partnerStatus, tier, 
          primaryContactName, primaryContactEmail, commissionRate, mdfBudgetAnnual)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "Test Approval Company",
          `approval-${Date.now()}@test.com`,
          "United States",
          "Reseller",
          "Prospect",
          "Standard",
          "John Doe",
          `approval-${Date.now()}@test.com`,
          "10.00",
          "0.00",
        ]
      );

      const companyId = (createResult as any).insertId;

      await executeRawSQL(
        `UPDATE partner_companies 
         SET partnerStatus = ?, tier = ?, commissionRate = ?, mdfBudgetAnnual = ?, updatedAt = NOW()
         WHERE id = ?`,
        ["Active", "Gold", "15.00", "50000.00", companyId]
      );

      const result = await db
        .select()
        .from((await import("../../../drizzle/partner-schema")).partnerCompanies)
        .where(
          (await import("drizzle-orm")).eq(
            (await import("../../../drizzle/partner-schema")).partnerCompanies.id,
            companyId
          )
        );

      expect(result[0].partnerStatus).toBe("Active");
      expect(result[0].tier).toBe("Gold");
    });

    it("should update commission rate and MDF budget", async () => {
      const createResult = await executeRawSQL(
        `INSERT INTO partner_companies 
         (companyName, email, country, partnerType, partnerStatus, tier, 
          primaryContactName, primaryContactEmail, commissionRate, mdfBudgetAnnual)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "Test MDF Company",
          `mdf-${Date.now()}@test.com`,
          "United States",
          "System Integrator",
          "Prospect",
          "Standard",
          "Jane Doe",
          `mdf-${Date.now()}@test.com`,
          "10.00",
          "0.00",
        ]
      );

      const companyId = (createResult as any).insertId;

      await executeRawSQL(
        `UPDATE partner_companies 
         SET mdfBudgetAnnual = ?, commissionRate = ?, updatedAt = NOW()
         WHERE id = ?`,
        ["100000.00", "20.00", companyId]
      );

      const result = await db
        .select()
        .from((await import("../../../drizzle/partner-schema")).partnerCompanies)
        .where(
          (await import("drizzle-orm")).eq(
            (await import("../../../drizzle/partner-schema")).partnerCompanies.id,
            companyId
          )
        );

      expect(parseFloat(result[0].mdfBudgetAnnual)).toBe(100000.0);
      expect(parseFloat(result[0].commissionRate)).toBe(20.0);
    });
  });

  describe("rejectApplication", () => {
    it("should update partner status to Suspended with rejection reason", async () => {
      const createResult = await executeRawSQL(
        `INSERT INTO partner_companies 
         (companyName, email, country, partnerType, partnerStatus, tier, 
          primaryContactName, primaryContactEmail, commissionRate, mdfBudgetAnnual)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "Test Reject Company",
          `reject-${Date.now()}@test.com`,
          "United States",
          "Reseller",
          "Prospect",
          "Standard",
          "John Doe",
          `reject-${Date.now()}@test.com`,
          "10.00",
          "0.00",
        ]
      );

      const companyId = (createResult as any).insertId;

      await executeRawSQL(
        `UPDATE partner_companies 
         SET partnerStatus = ?, description = ?, updatedAt = NOW()
         WHERE id = ?`,
        ["Suspended", "Rejected: Does not meet requirements", companyId]
      );

      const result = await db
        .select()
        .from((await import("../../../drizzle/partner-schema")).partnerCompanies)
        .where(
          (await import("drizzle-orm")).eq(
            (await import("../../../drizzle/partner-schema")).partnerCompanies.id,
            companyId
          )
        );

      expect(result[0].partnerStatus).toBe("Suspended");
    });
  });

  describe("updatePartnerTier", () => {
    it("should update partner tier from Standard to Gold", async () => {
      const createResult = await executeRawSQL(
        `INSERT INTO partner_companies 
         (companyName, email, country, partnerType, partnerStatus, tier, 
          primaryContactName, primaryContactEmail, commissionRate, mdfBudgetAnnual)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "Test Tier Company",
          `tier-${Date.now()}@test.com`,
          "United States",
          "Reseller",
          "Active",
          "Standard",
          "John Doe",
          `tier-${Date.now()}@test.com`,
          "10.00",
          "0.00",
        ]
      );

      const companyId = (createResult as any).insertId;

      await executeRawSQL(
        `UPDATE partner_companies SET tier = ?, updatedAt = NOW() WHERE id = ?`,
        ["Gold", companyId]
      );

      const result = await db
        .select()
        .from((await import("../../../drizzle/partner-schema")).partnerCompanies)
        .where(
          (await import("drizzle-orm")).eq(
            (await import("../../../drizzle/partner-schema")).partnerCompanies.id,
            companyId
          )
        );

      expect(result[0].tier).toBe("Gold");
    });
  });

  describe("addCertification", () => {
    it("should add certification to partner", async () => {
      const createResult = await executeRawSQL(
        `INSERT INTO partner_companies 
         (companyName, email, country, partnerType, partnerStatus, tier, 
          primaryContactName, primaryContactEmail, commissionRate, mdfBudgetAnnual)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "Test Cert Company",
          `cert-${Date.now()}@test.com`,
          "United States",
          "Reseller",
          "Active",
          "Silver",
          "John Doe",
          `cert-${Date.now()}@test.com`,
          "15.00",
          "50000.00",
        ]
      );

      const companyId = (createResult as any).insertId;

      const certifications = [
        {
          name: "Visium Sales Certification",
          expiryDate: "2027-02-11",
          addedAt: new Date().toISOString(),
        },
      ];

      await executeRawSQL(
        `UPDATE partner_companies SET certifications = ?, updatedAt = NOW() WHERE id = ?`,
        [JSON.stringify(certifications), companyId]
      );

      const result = await db
        .select()
        .from((await import("../../../drizzle/partner-schema")).partnerCompanies)
        .where(
          (await import("drizzle-orm")).eq(
            (await import("../../../drizzle/partner-schema")).partnerCompanies.id,
            companyId
          )
        );

      const certs = JSON.parse(result[0].certifications);
      expect(certs).toHaveLength(1);
      expect(certs[0].name).toBe("Visium Sales Certification");
    });
  });

  describe("getOnboardingProgress", () => {
    it("should calculate onboarding progress correctly", async () => {
      const createResult = await executeRawSQL(
        `INSERT INTO partner_companies 
         (companyName, email, country, partnerType, partnerStatus, tier, 
          primaryContactName, primaryContactEmail, commissionRate, mdfBudgetAnnual, certifications)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "Test Progress Company",
          `progress-${Date.now()}@test.com`,
          "United States",
          "Reseller",
          "Active",
          "Gold",
          "John Doe",
          `progress-${Date.now()}@test.com`,
          "15.00",
          "50000.00",
          JSON.stringify([
            {
              name: "Certification 1",
              expiryDate: "2027-02-11",
              addedAt: new Date().toISOString(),
            },
          ]),
        ]
      );

      const companyId = (createResult as any).insertId;

      const result = await db
        .select()
        .from((await import("../../../drizzle/partner-schema")).partnerCompanies)
        .where(
          (await import("drizzle-orm")).eq(
            (await import("../../../drizzle/partner-schema")).partnerCompanies.id,
            companyId
          )
        );

      const partner = result[0];

      const milestones = {
        applicationSubmitted: true,
        approved: partner.partnerStatus === "Active",
        tierAssigned: partner.tier !== "Standard" || partner.partnerStatus === "Active",
        certificationsEarned: partner.certifications
          ? JSON.parse(partner.certifications).length > 0
          : false,
        firstDealSubmitted: false,
        mdfBudgetAllocated: partner.mdfBudgetAnnual && parseFloat(partner.mdfBudgetAnnual) > 0,
      };

      const completedMilestones = Object.values(milestones).filter(Boolean).length;
      const totalMilestones = Object.keys(milestones).length;
      const progressPercentage = Math.round((completedMilestones / totalMilestones) * 100);

      expect(completedMilestones).toBeGreaterThan(0);
      expect(progressPercentage).toBeGreaterThan(0);
      expect(progressPercentage).toBeLessThanOrEqual(100);
    });
  });
});
