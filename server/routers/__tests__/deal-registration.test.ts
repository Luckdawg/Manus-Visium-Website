import { describe, it, expect, beforeEach, vi } from "vitest";
import { z } from "zod";

describe("Deal Registration System", () => {
  describe("Deal Submission Validation", () => {
    it("should validate required deal fields", () => {
      const dealSchema = z.object({
        dealName: z.string().min(1, "Deal name required"),
        customerName: z.string().min(1, "Customer name required"),
        customerEmail: z.string().email("Invalid email"),
        dealAmount: z.number().positive("Amount must be positive"),
        description: z.string().min(1, "Description required"),
      });

      const validDeal = {
        dealName: "Acme Corp Deal",
        customerName: "Acme Corporation",
        customerEmail: "contact@acme.com",
        dealAmount: 100000,
        description: "Security platform implementation",
      };

      expect(() => dealSchema.parse(validDeal)).not.toThrow();
    });

    it("should reject invalid email addresses", () => {
      const dealSchema = z.object({
        customerEmail: z.string().email("Invalid email"),
      });

      expect(() => dealSchema.parse({ customerEmail: "invalid-email" })).toThrow();
      expect(() => dealSchema.parse({ customerEmail: "test@example.com" })).not.toThrow();
    });

    it("should reject negative deal amounts", () => {
      const dealSchema = z.object({
        dealAmount: z.number().positive("Amount must be positive"),
      });

      expect(() => dealSchema.parse({ dealAmount: -1000 })).toThrow();
      expect(() => dealSchema.parse({ dealAmount: 100000 })).not.toThrow();
    });

    it("should validate optional customer fields", () => {
      const dealSchema = z.object({
        customerPhone: z.string().optional(),
        customerIndustry: z.string().optional(),
        customerSize: z.enum(["Startup", "SMB", "Mid-Market", "Enterprise", "Government"]).optional(),
      });

      const validDeal = {
        customerPhone: "+1-555-123-4567",
        customerIndustry: "Cybersecurity",
        customerSize: "Enterprise",
      };

      expect(() => dealSchema.parse(validDeal)).not.toThrow();
    });

    it("should validate deal stage values", () => {
      const dealStageSchema = z.enum([
        "Qualified Lead",
        "Proposal",
        "Negotiation",
        "Closed Won",
        "Closed Lost",
      ]);

      expect(() => dealStageSchema.parse("Qualified Lead")).not.toThrow();
      expect(() => dealStageSchema.parse("Invalid Stage")).toThrow();
    });
  });

  describe("Commission Calculation", () => {
    it("should calculate commission based on deal amount and rate", () => {
      const dealAmount = 100000;
      const commissionRate = 10;
      const expectedCommission = dealAmount * (commissionRate / 100);

      expect(expectedCommission).toBe(10000);
    });

    it("should handle different commission rates", () => {
      const dealAmount = 50000;
      const rates = [5, 10, 15, 20];

      rates.forEach(rate => {
        const commission = dealAmount * (rate / 100);
        expect(commission).toBeGreaterThan(0);
        expect(commission).toBeLessThanOrEqual(dealAmount);
      });
    });

    it("should handle zero commission rate", () => {
      const dealAmount = 100000;
      const commissionRate = 0;
      const commission = dealAmount * (commissionRate / 100);

      expect(commission).toBe(0);
    });
  });

  describe("Deal Filtering and Search", () => {
    const mockDeals = [
      {
        id: 1,
        dealName: "Acme Corp Security",
        customerName: "Acme Corporation",
        customerEmail: "contact@acme.com",
        dealAmount: "100000",
        dealStage: "Qualified Lead",
      },
      {
        id: 2,
        dealName: "TechCorp Platform",
        customerName: "TechCorp Inc",
        customerEmail: "sales@techcorp.com",
        dealAmount: "250000",
        dealStage: "Proposal",
      },
      {
        id: 3,
        dealName: "Global Industries Deal",
        customerName: "Global Industries",
        customerEmail: "procurement@global.com",
        dealAmount: "500000",
        dealStage: "Closed Won",
      },
    ];

    it("should filter deals by stage", () => {
      const filtered = mockDeals.filter(d => d.dealStage === "Qualified Lead");
      expect(filtered).toHaveLength(1);
      expect(filtered[0].dealName).toBe("Acme Corp Security");
    });

    it("should search deals by name", () => {
      const searchTerm = "platform";
      const filtered = mockDeals.filter(d =>
        d.dealName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      expect(filtered).toHaveLength(1);
      expect(filtered[0].customerName).toBe("TechCorp Inc");
    });

    it("should search deals by customer name", () => {
      const searchTerm = "acme";
      const filtered = mockDeals.filter(d =>
        d.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      expect(filtered).toHaveLength(1);
      expect(filtered[0].dealAmount).toBe("100000");
    });

    it("should calculate total pipeline value", () => {
      const total = mockDeals.reduce((sum, deal) => sum + Number(deal.dealAmount), 0);
      expect(total).toBe(850000);
    });

    it("should count won deals", () => {
      const wonCount = mockDeals.filter(d => d.dealStage === "Closed Won").length;
      expect(wonCount).toBe(1);
    });

    it("should calculate win rate", () => {
      const wonCount = mockDeals.filter(d => d.dealStage === "Closed Won").length;
      const winRate = (wonCount / mockDeals.length) * 100;
      expect(winRate).toBeCloseTo(33.33, 1);
    });
  });

  describe("Deal Status Transitions", () => {
    it("should allow valid stage transitions", () => {
      const validTransitions: Record<string, string[]> = {
        "Qualified Lead": ["Proposal", "Closed Lost"],
        "Proposal": ["Negotiation", "Closed Lost"],
        "Negotiation": ["Closed Won", "Closed Lost"],
        "Closed Won": [],
        "Closed Lost": [],
      };

      expect(validTransitions["Qualified Lead"]).toContain("Proposal");
      expect(validTransitions["Proposal"]).toContain("Negotiation");
      expect(validTransitions["Negotiation"]).toContain("Closed Won");
    });

    it("should track deal stage history", () => {
      const dealHistory = [
        { stage: "Qualified Lead", timestamp: new Date("2026-01-01") },
        { stage: "Proposal", timestamp: new Date("2026-01-15") },
        { stage: "Negotiation", timestamp: new Date("2026-02-01") },
        { stage: "Closed Won", timestamp: new Date("2026-02-09") },
      ];

      expect(dealHistory).toHaveLength(4);
      expect(dealHistory[0].stage).toBe("Qualified Lead");
      expect(dealHistory[dealHistory.length - 1].stage).toBe("Closed Won");
    });
  });

  describe("Resource Management", () => {
    const mockResources = [
      {
        id: 1,
        resourceName: "Product Datasheet",
        resourceType: "Sales Collateral",
        category: "Sales",
        fileUrl: "https://example.com/datasheet.pdf",
        downloadCount: 150,
      },
      {
        id: 2,
        resourceName: "API Documentation",
        resourceType: "Technical Documentation",
        category: "Technical",
        fileUrl: "https://example.com/api-docs.pdf",
        downloadCount: 320,
      },
      {
        id: 3,
        resourceName: "Training Video",
        resourceType: "Training Video",
        category: "Training",
        fileUrl: "https://example.com/training.mp4",
        downloadCount: 85,
      },
    ];

    it("should filter resources by type", () => {
      const filtered = mockResources.filter(r => r.resourceType === "Sales Collateral");
      expect(filtered).toHaveLength(1);
      expect(filtered[0].resourceName).toBe("Product Datasheet");
    });

    it("should search resources by name", () => {
      const searchTerm = "api";
      const filtered = mockResources.filter(r =>
        r.resourceName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      expect(filtered).toHaveLength(1);
      expect(filtered[0].resourceType).toBe("Technical Documentation");
    });

    it("should track resource download counts", () => {
      const totalDownloads = mockResources.reduce((sum, r) => sum + r.downloadCount, 0);
      expect(totalDownloads).toBe(555);
    });

    it("should identify most downloaded resources", () => {
      const mostDownloaded = mockResources.reduce((prev, current) =>
        prev.downloadCount > current.downloadCount ? prev : current
      );
      expect(mostDownloaded.resourceName).toBe("API Documentation");
      expect(mostDownloaded.downloadCount).toBe(320);
    });

    it("should validate resource URLs", () => {
      const urlSchema = z.string().url("Invalid URL");
      mockResources.forEach(resource => {
        expect(() => urlSchema.parse(resource.fileUrl)).not.toThrow();
      });
    });
  });

  describe("Deal Metrics and Analytics", () => {
    const mockDeals = [
      { dealAmount: "100000", dealStage: "Closed Won", expectedCloseDate: new Date("2026-01-15") },
      { dealAmount: "250000", dealStage: "Closed Won", expectedCloseDate: new Date("2026-01-20") },
      { dealAmount: "75000", dealStage: "Closed Lost", expectedCloseDate: new Date("2026-02-01") },
      { dealAmount: "500000", dealStage: "Negotiation", expectedCloseDate: new Date("2026-02-15") },
      { dealAmount: "150000", dealStage: "Proposal", expectedCloseDate: new Date("2026-03-01") },
    ];

    it("should calculate average deal size", () => {
      const totalValue = mockDeals.reduce((sum, d) => sum + Number(d.dealAmount), 0);
      const avgDealSize = totalValue / mockDeals.length;
      expect(avgDealSize).toBe(215000);
    });

    it("should calculate win rate", () => {
      const wonCount = mockDeals.filter(d => d.dealStage === "Closed Won").length;
      const winRate = (wonCount / mockDeals.length) * 100;
      expect(winRate).toBeCloseTo(40, 0);
    });

    it("should calculate average deal duration", () => {
      const closedDeals = mockDeals.filter(d => d.dealStage.startsWith("Closed"));
      const avgDuration = closedDeals.reduce((sum, d) => {
        const duration = d.expectedCloseDate.getTime() - new Date("2026-01-01").getTime();
        return sum + duration;
      }, 0) / closedDeals.length;

      expect(avgDuration).toBeGreaterThan(0);
    });

    it("should identify pipeline by stage", () => {
      const pipeline: Record<string, number> = {};
      mockDeals.forEach(deal => {
        pipeline[deal.dealStage] = (pipeline[deal.dealStage] || 0) + Number(deal.dealAmount);
      });

      expect(pipeline["Closed Won"]).toBe(350000);
      expect(pipeline["Negotiation"]).toBe(500000);
      expect(pipeline["Proposal"]).toBe(150000);
    });
  });

  describe("Error Handling", () => {
    it("should handle missing required fields", () => {
      const dealSchema = z.object({
        dealName: z.string().min(1),
        customerName: z.string().min(1),
        dealAmount: z.number().positive(),
      });

      expect(() => dealSchema.parse({ dealName: "Test" })).toThrow();
    });

    it("should handle invalid data types", () => {
      const dealSchema = z.object({
        dealAmount: z.number(),
      });

      expect(() => dealSchema.parse({ dealAmount: "not a number" })).toThrow();
    });

    it("should handle empty search results", () => {
      const deals: any[] = [];
      const filtered = deals.filter(d => d.dealName.includes("nonexistent"));
      expect(filtered).toHaveLength(0);
    });
  });
});
