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
        // mysql2 returns { insertId, affectedRows, ... } as the first element of the array
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
        // mysql2 returns { insertId, affectedRows, ... } as the first element of the array
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
      // Check if partner session exists in context or cookies
      // For now, return null to indicate no partner session
      // In a real implementation, this would check session cookies
      return null;
    }),

  /**
   * Get partner dashboard summary
   */
  getDashboardSummary: publicProcedure
    .input(z.object({ partnerId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get partner user
      const partnerUser = await db
        .select()
        .from(partnerUsers)
        .where(eq(partnerUsers.id, input.partnerId))
        .limit(1);

      if (partnerUser.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Partner not found",
        });
      }

      const user = partnerUser[0];

      // Get partner company
      const company = await db
        .select()
        .from(partnerCompanies)
        .where(eq(partnerCompanies.id, user.partnerCompanyId))
        .limit(1);

      // Get deals count
      const deals = await db
        .select()
        .from(partnerDeals)
        .where(eq(partnerDeals.partnerCompanyId, user.partnerCompanyId));

      // Get MDF claims
      const mdfClaims = await db
        .select()
        .from(partnerMdfClaims)
        .where(eq(partnerMdfClaims.partnerCompanyId, user.partnerCompanyId));

      const totalMdf = mdfClaims.reduce((sum, claim) => sum + (claim.approvedAmount ? parseFloat(claim.approvedAmount.toString()) : 0), 0);

      return {
        partnerId: user.id,
        email: user.email,
        contactName: user.contactName,
        companyName: company[0]?.companyName || "Unknown",
        partnerType: company[0]?.partnerType || "Unknown",
        dealsCount: deals.length,
        mdfSpent: totalMdf,
        isActive: user.isActive,
      };
    }),

  /**
   * Get all partners (admin only)
   */
  getAllPartners: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Admin access required",
      });
    }

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const partners = await db.select().from(partnerCompanies);
    return partners || [];
  }),

  /**
   * Update partner status (admin only)
   */
  updatePartnerStatus: protectedProcedure
    .input(
      z.object({
        partnerId: z.number(),
        isActive: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(partnerUsers)
        .set({ isActive: input.isActive })
        .where(eq(partnerUsers.id, input.partnerId));

      return { success: true };
    }),

  /**
   * Get partner deals
   */
  getDeals: publicProcedure
    .input(z.object({ partnerId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get partner user
      const partnerUser = await db
        .select()
        .from(partnerUsers)
        .where(eq(partnerUsers.id, input.partnerId))
        .limit(1);

      if (partnerUser.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Partner not found",
        });
      }

      // Get deals for this partner's company
      const deals = await db
        .select()
        .from(partnerDeals)
        .where(eq(partnerDeals.partnerCompanyId, partnerUser[0].partnerCompanyId))
        .orderBy(desc(partnerDeals.createdAt));

      return deals;
    }),

  /**
   * Create a new deal
   */
  createDeal: publicProcedure
    .input(
      z.object({
        partnerId: z.number(),
        dealName: z.string(),
        customerName: z.string(),
        dealAmount: z.number(),
        dealStage: z.enum([
          "Qualified Lead",
          "Proposal",
          "Negotiation",
          "Closed Won",
          "Closed Lost",
        ]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get partner user
      const partnerUser = await db
        .select()
        .from(partnerUsers)
        .where(eq(partnerUsers.id, input.partnerId))
        .limit(1);

      if (partnerUser.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Partner not found",
        });
      }

      try {
        // Create deal
        const result = await db
          .insert(partnerDeals)
          .values({
            dealName: input.dealName,
            partnerCompanyId: partnerUser[0].partnerCompanyId,
            customerName: input.customerName,
            dealAmount: input.dealAmount as any,
            dealStage: input.dealStage || "Qualified Lead",
            submittedBy: partnerUser[0].id,
            notes: input.notes || null as any,
          });

        return {
          success: true,
          dealId: (result as any).insertId,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create deal: " + (error as any).message,
        });
      }
    }),
});
