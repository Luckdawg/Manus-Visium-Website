import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb, executeRawSQL } from "../db";
import {
  partnerCompanies,
  partnerUsers,
  partnerDeals,
  partnerResources,
  partnerMdfClaims,
} from "../../drizzle/partner-schema";
import { users } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";

/**
 * Partner Portal Router
 * Handles all partner-related operations including authentication, deals, resources, analytics, and MDF
 */
export const partnerRouter = router({
  /**
   * Partner self-registration
   */
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        companyName: z.string().min(1),
        contactName: z.string().min(1),
        phone: z.string().optional(),
        website: z.string().optional(),
        partnerType: z.enum([
          "Reseller",
          "Technology Partner",
          "System Integrator",
          "Managed Service Provider",
          "Consulting Partner",
          "Channel Partner",
          "OEM Partner",
          "Other",
        ]),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if email already exists
      const existingUser = await db
        .select()
        .from(partnerUsers)
        .where(eq(partnerUsers.email, input.email))
        .limit(1);

      if (existingUser.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email already registered",
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(input.password, 10);

      try {
        // Create partner company using raw SQL
        const companySql = `INSERT INTO partner_companies (companyName, partnerType, website, email, primaryContactName, primaryContactEmail, primaryContactPhone, partnerStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const companyParams = [input.companyName, input.partnerType, input.website || null, input.email, input.contactName, input.email, input.phone || null, "Active"];
        const companyResult = await executeRawSQL(companySql, companyParams);
        const companyId = (companyResult as any)?.insertId || (companyResult as any)[0]?.insertId;
        if (!companyId) {
          console.error("Company insert result:", companyResult);
          throw new Error("Failed to get company ID");
        }
        
        // Ensure passwordHash is not null
        if (!passwordHash) {
          throw new Error("Password hash is empty");
        }

        // Create partner user using raw SQL to avoid Drizzle timestamp issues
        const insertSql = `
          INSERT INTO partner_users 
          (partnerCompanyId, email, passwordHash, emailVerified, contactName, phone, partnerRole, isActive)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const insertParams = [
          companyId,
          input.email,
          passwordHash,
          false,
          input.contactName,
          input.phone || null,
          "Admin",
          true
        ];

        const insertResult = await executeRawSQL(insertSql, insertParams);
        const partnerId = (insertResult as any)?.insertId || (insertResult as any)[0]?.insertId;

        if (!partnerId) {
          console.error("Partner user insert result:", insertResult);
          throw new Error("Failed to create partner user");
        }

        return {
          success: true,
          message: "Registration successful. Please log in.",
          partnerId: partnerId || 0,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Registration failed: " + (error as any).message,
        });
      }
    }),

  /**
   * Partner login with email and password
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Find partner user by email
      const partnerUser = await db
        .select()
        .from(partnerUsers)
        .where(eq(partnerUsers.email, input.email))
        .limit(1);

      if (partnerUser.length === 0) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const user = partnerUser[0];

      // Verify password
      if (!user.passwordHash) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }
      const passwordMatch = await bcrypt.compare(
        input.password,
        user.passwordHash
      );

      if (!passwordMatch) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      if (!user.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Account is inactive",
        });
      }

      return {
        success: true,
        message: "Login successful",
        partnerId: user.id,
        email: user.email,
      };
    }),

  /**
   * Get current partner session
   */
  getMe: publicProcedure
    .query(async ({ ctx }) => {
      return null;
    }),

  /**
   * Create a new deal
   */
  createDeal: publicProcedure
    .input(
      z.object({
        partnerId: z.number(),
        dealName: z.string(),
        dealValue: z.number(),
        dealCurrency: z.string(),
        dealStage: z.string(),
        expectedCloseDate: z.string(),
        dealDescription: z.string().optional(),
        customerName: z.string(),
        customerEmail: z.string(),
        customerCompany: z.string(),
        productCategory: z.string(),
        partnerNotes: z.string().optional(),
        mdfRequested: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const insertSql = `
          INSERT INTO partner_deals 
          (partnerCompanyId, dealName, dealValue, dealCurrency, dealStage, expectedCloseDate, dealDescription, customerName, customerEmail, customerCompany, productCategory, submittedBy, dealStatus)
          SELECT partnerCompanyId, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending Review'
          FROM partner_users
          WHERE id = ?
        `;
        const insertParams = [
          input.dealName,
          input.dealValue,
          input.dealCurrency,
          input.dealStage,
          input.expectedCloseDate,
          input.dealDescription || null,
          input.customerName,
          input.customerEmail,
          input.customerCompany,
          input.productCategory,
          input.partnerNotes || null,
          input.partnerId,
        ];

        const result = await executeRawSQL(insertSql, insertParams);
        const dealId = (result as any)?.insertId || (result as any)[0]?.insertId;

        if (!dealId) {
          throw new Error("Failed to create deal");
        }

        return {
          success: true,
          dealId,
          message: "Deal created successfully",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create deal: " + (error as any).message,
        });
      }
    }),

  /**
   * Get partner dashboard summary
   */
  getDashboardSummary: publicProcedure
    .input(z.object({ partnerId: z.number() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      if (!input?.partnerId) {
        return {
          activeDeals: 0,
          totalRevenue: 0,
          mdfAvailable: 0,
          commissionRate: 0,
          recentDeals: [],
        };
      }

      try {
        // Get partner user
        const partnerUser = await db
          .select()
          .from(partnerUsers)
          .where(eq(partnerUsers.id, input.partnerId))
          .limit(1);

        if (partnerUser.length === 0) {
          return {
            activeDeals: 0,
            totalRevenue: 0,
            mdfAvailable: 0,
            commissionRate: 0,
            recentDeals: [],
          };
        }

        const companyId = partnerUser[0].partnerCompanyId;

        // Get deals
        const deals = await db
          .select()
          .from(partnerDeals)
          .where(eq(partnerDeals.partnerCompanyId, companyId))
          .orderBy(desc(partnerDeals.createdAt));

        const activeDeals = deals.filter((d: any) => d.dealStatus !== "Closed Lost").length;
        const totalRevenue = deals.reduce((sum: number, d: any) => sum + (d.dealValue || 0), 0);

        // Get MDF claims
        const mdfClaims = await db
          .select()
          .from(partnerMdfClaims)
          .where(eq(partnerMdfClaims.partnerCompanyId, companyId));

        const mdfUsed = mdfClaims.reduce((sum: number, m: any) => sum + (m.amountClaimed || 0), 0);
        const mdfAvailable = 50000 - mdfUsed; // Default MDF budget

        return {
          activeDeals,
          totalRevenue,
          mdfAvailable: Math.max(0, mdfAvailable),
          commissionRate: 15, // Default commission rate
          recentDeals: deals.slice(0, 5),
        };
      } catch (error) {
        console.error("Error getting dashboard summary:", error);
        return {
          activeDeals: 0,
          totalRevenue: 0,
          mdfAvailable: 0,
          commissionRate: 0,
          recentDeals: [],
        };
      }
    }),

  /**
   * Get deals for a partner
   */
  getDeals: publicProcedure
    .input(z.object({ partnerId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const partnerUser = await db
          .select()
          .from(partnerUsers)
          .where(eq(partnerUsers.id, input.partnerId))
          .limit(1);

        if (partnerUser.length === 0) {
          return [];
        }

        const deals = await db
          .select()
          .from(partnerDeals)
          .where(eq(partnerDeals.partnerCompanyId, partnerUser[0].partnerCompanyId))
          .orderBy(desc(partnerDeals.createdAt));

        return deals;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get deals: " + (error as any).message,
        });
      }
    }),

  /**
   * Get all partner companies (for admin)
   */
  getAllPartners: publicProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const partners = await db.select().from(partnerCompanies);
        return partners;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get partners: " + (error as any).message,
        });
      }
    }),

  /**
   * Update partner status (for admin)
   */
  updatePartnerStatus: publicProcedure
    .input(
      z.object({
        partnerId: z.number(),
        status: z.enum(["Active", "Inactive", "Suspended"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        await db
          .update(partnerCompanies)
          .set({ partnerStatus: input.status })
          .where(eq(partnerCompanies.id, input.partnerId));

        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update partner: " + (error as any).message,
        });
      }
    }),

  /**
   * Get all deals (for admin)
   */
  getAllDeals: publicProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const deals = await db
          .select()
          .from(partnerDeals)
          .orderBy(desc(partnerDeals.createdAt));
        return deals;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get deals: " + (error as any).message,
        });
      }
    }),

  /**
   * Update deal status (for admin)
   */
  updateDealStatus: publicProcedure
    .input(
      z.object({
        dealId: z.number(),
        status: z.enum(["Pending Review", "Approved", "Rejected", "Closed Won", "Closed Lost"]),
        commissionAmount: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // Update deal status using raw SQL since dealStatus field may not exist
        const updateSql = `UPDATE partner_deals SET dealStage = ? WHERE id = ?`;
        await executeRawSQL(updateSql, [input.status, input.dealId])

        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update deal: " + (error as any).message,
        });
      }
    }),
});
