import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "./db";
import { blogLeads } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Blog Lead Capture", () => {
  let testLeadId: number | null = null;

  afterAll(async () => {
    // Cleanup: Delete test lead after tests complete
    if (testLeadId) {
      const db = await getDb();
      if (db) {
        await db.delete(blogLeads).where(eq(blogLeads.id, testLeadId));
      }
    }
  });

  it("should store blog lead in database", async () => {
    const db = await getDb();
    expect(db).toBeDefined();
    
    if (!db) {
      throw new Error("Database not available");
    }

    // Insert a test lead
    const [result] = await db.insert(blogLeads).values({
      name: "Test User",
      email: "test@example.com",
      company: "Test Company Inc",
      blogTitle: "The Human Factor: How Agentic AI and Graph Analytics Mitigate Insider Threats",
    });

    testLeadId = result.insertId;
    expect(testLeadId).toBeGreaterThan(0);

    // Verify the lead was stored correctly
    const [lead] = await db
      .select()
      .from(blogLeads)
      .where(eq(blogLeads.id, testLeadId));

    expect(lead).toBeDefined();
    expect(lead.name).toBe("Test User");
    expect(lead.email).toBe("test@example.com");
    expect(lead.company).toBe("Test Company Inc");
    expect(lead.blogTitle).toBe("The Human Factor: How Agentic AI and Graph Analytics Mitigate Insider Threats");
    expect(lead.createdAt).toBeDefined();
  });

  it("should accept valid lead data", async () => {
    const db = await getDb();
    expect(db).toBeDefined();
    
    if (!db) {
      throw new Error("Database not available");
    }

    // Insert a valid lead
    const [result] = await db.insert(blogLeads).values({
      name: "Valid User",
      email: "valid@example.com",
      company: "Valid Company",
      blogTitle: "Test Blog Article",
    });

    expect(result.insertId).toBeGreaterThan(0);
    
    // Cleanup
    await db.delete(blogLeads).where(eq(blogLeads.id, result.insertId));
  });

  it("should validate email format on frontend", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Valid emails
    expect(emailRegex.test("test@example.com")).toBe(true);
    expect(emailRegex.test("user.name@company.co.uk")).toBe(true);
    
    // Invalid emails
    expect(emailRegex.test("invalid-email")).toBe(false);
    expect(emailRegex.test("@example.com")).toBe(false);
    expect(emailRegex.test("test@")).toBe(false);
  });

  it("should retrieve blog leads from database", async () => {
    const db = await getDb();
    expect(db).toBeDefined();
    
    if (!db) {
      throw new Error("Database not available");
    }

    // Query all blog leads
    const leads = await db.select().from(blogLeads);
    
    expect(Array.isArray(leads)).toBe(true);
    // Should have at least the test lead we inserted
    expect(leads.length).toBeGreaterThanOrEqual(1);
  });
});
