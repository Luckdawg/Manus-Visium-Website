import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import {
  partnerCompanies,
  partnerUsers,
  partnerDeals,
  partnerResources,
  partnerMdfClaims,
} from "../../drizzle/partner-schema";
import { eq, and, desc } from "drizzle-orm";
import { EmailNotificationService } from "../services/emailNotificationService";
import bcrypt from "bcryptjs";
import { generateToken } from "../_core/auth";

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
          code: "CONFLICT",
          message: "Email already registered",
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(input.password, 10);

      // Create partner company
      const companyResult = await db.insert(partnerCompanies).values({
        companyName: input.companyName,
        email: input.email,
        website: input.website,
        phone: input.phone,
        partnerType: input.partnerType,
        primaryContactName: input.contactName,
        primaryContactEmail: input.email,
        primaryContactPhone: input.phone,
        partnerStatus: "Prospect",
      });

      const companyId = (companyResult as any)[0]?.id || (companyResult as any).insertId;

      // Create partner user
      const userResult = await db.insert(partnerUsers).values({
        partnerCompanyId: companyId,
        email: input.email,
        passwordHash: passwordHash,
        contactName: input.contactName,
        phone: input.phone,
        partnerRole: "Admin",
        isActive: true,
      });

      const userId = (userResult as any)[0]?.id || (userResult as any).insertId;

      // Send welcome email
      try {
        await EmailNotificationService.sendNotification(
          companyId,
          "deal_submitted",
          {
            partnerName: input.companyName,
            dealName: "Welcome to Partner Portal",
            customerName: input.contactName,
            dealAmount: "0.00",
            dealStage: "Qualified Lead",
          },
          "other"
        );
      } catch (error) {
        console.error("Failed to send welcome email:", error);
      }

      return {
        success: true,
        userId,
        companyId,
        message: "Registration successful. Please log in.",
      };
    }),

  /**
   * Partner email/password login
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
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

      // Check if user is active
      if (!user.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Account is inactive",
        });
      }

      // Verify password
      if (!user.passwordHash || !user.email) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const passwordMatch = await bcrypt.compare(input.password, user.passwordHash);

      if (!passwordMatch) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      // Get partner company
      const company = await db
        .select()
        .from(partnerCompanies)
        .where(eq(partnerCompanies.id, user.partnerCompanyId))
        .limit(1);

      // Generate JWT token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: "partner",
        partnerId: user.id,
        companyId: user.partnerCompanyId,
      });

      // Set session cookie
      ctx.res.cookie("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          contactName: user.contactName,
          partnerRole: user.partnerRole,
          companyId: user.partnerCompanyId,
          company: company[0] || null,
        },
        token,
      };
    }),

  /**
   * Get partner company profile
   */
  getPartnerProfile: protectedProcedure.query(async ({ ctx }) => {
    // Support both OAuth and email/password authenticated partners
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Try to find partner user
    let partnerUser;

    if (ctx.user.email) {
      // Email/password authenticated
      partnerUser = await db
        .select()
        .from(partnerUsers)
        .where(eq(partnerUsers.email, ctx.user.email))
        .limit(1);
    } else if (ctx.user.id) {
      // OAuth authenticated
      partnerUser = await db
        .select()
        .from(partnerUsers)
        .where(eq(partnerUsers.userId, ctx.user.id))
        .limit(1);
    }

    if (!partnerUser || partnerUser.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Partner profile not found",
      });
    }

    // Get partner company
    const company = await db
      .select()
      .from(partnerCompanies)
      .where(eq(partnerCompanies.id, partnerUser[0].partnerCompanyId))
      .limit(1);

    return {
      user: partnerUser[0],
      company: company[0] || null,
    };
  }),

  /**
   * Get partner deals with filtering
   */
  getPartnerDeals: protectedProcedure
    .input(
      z.object({
        stage: z
          .enum([
            "Qualified Lead",
            "Proposal",
            "Negotiation",
            "Closed Won",
            "Closed Lost",
          ])
          .optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let partnerUser;

      if (ctx.user.email) {
        partnerUser = await db
          .select()
          .from(partnerUsers)
          .where(eq(partnerUsers.email, ctx.user.email))
          .limit(1);
      } else if (ctx.user.id) {
        partnerUser = await db
          .select()
          .from(partnerUsers)
          .where(eq(partnerUsers.userId, ctx.user.id))
          .limit(1);
      }

      if (!partnerUser || partnerUser.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const whereConditions = [eq(partnerDeals.partnerCompanyId, partnerUser[0].partnerCompanyId)];
      if (input.stage) {
        whereConditions.push(eq(partnerDeals.dealStage, input.stage));
      }

      const deals = await db
        .select()
        .from(partnerDeals)
        .where(and(...whereConditions))
        .orderBy(desc(partnerDeals.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return deals;
    }),

  /**
   * Submit a new partner deal
   */
  submitDeal: protectedProcedure
    .input(
      z.object({
        dealName: z.string().min(1),
        customerName: z.string().min(1),
        customerEmail: z.string().email(),
        customerPhone: z.string().optional(),
        customerIndustry: z.string().optional(),
        customerSize: z.enum(["Startup", "SMB", "Mid-Market", "Enterprise", "Government"]).optional(),
        dealAmount: z.number().positive(),
        dealStage: z.enum(["Qualified Lead", "Proposal", "Negotiation", "Closed Won", "Closed Lost"]).optional(),
        expectedCloseDate: z.date().optional(),
        productInterest: z.string().optional(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let partnerUser;

      if (ctx.user.email) {
        partnerUser = await db
          .select()
          .from(partnerUsers)
          .where(eq(partnerUsers.email, ctx.user.email))
          .limit(1);
      } else if (ctx.user.id) {
        partnerUser = await db
          .select()
          .from(partnerUsers)
          .where(eq(partnerUsers.userId, ctx.user.id))
          .limit(1);
      }

      if (!partnerUser || partnerUser.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const partnerCompany = await db
        .select()
        .from(partnerCompanies)
        .where(eq(partnerCompanies.id, partnerUser[0].partnerCompanyId))
        .limit(1);

      if (partnerCompany.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Calculate commission
      const commissionRate = Number(partnerCompany[0].commissionRate) || 10;
      const commissionAmount = input.dealAmount * (commissionRate / 100);

      await db.insert(partnerDeals).values({
        dealName: input.dealName,
        partnerCompanyId: partnerUser[0].partnerCompanyId,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        customerIndustry: input.customerIndustry,
        customerSize: input.customerSize,
        dealAmount: input.dealAmount.toString(),
        dealStage: input.dealStage || "Qualified Lead",
        expectedCloseDate: input.expectedCloseDate,
        productInterest: input.productInterest,
        description: input.description,
        commissionPercentage: commissionRate.toString(),
        commissionAmount: commissionAmount.toString(),
        submittedBy: partnerUser[0].id,
      });

      // Send email notification
      try {
        await EmailNotificationService.sendNotification(
          partnerUser[0].partnerCompanyId,
          "deal_submitted",
          {
            partnerName: partnerCompany[0].companyName,
            dealName: input.dealName,
            customerName: input.customerName,
            dealAmount: input.dealAmount.toFixed(2),
            dealStage: "Qualified Lead",
          },
          "deal"
        );
      } catch (error) {
        console.error("Failed to send deal notification:", error);
      }

      return { success: true, dealName: input.dealName };
    }),

  /**
   * Get partner resources
   */
  getPartnerResources: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const resources = await db
        .select()
        .from(partnerResources)
        .orderBy(desc(partnerResources.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return resources;
    }),

  /**
   * Get dashboard summary
   */
  getDashboardSummary: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    let partnerUser;

    if (ctx.user.email) {
      partnerUser = await db
        .select()
        .from(partnerUsers)
        .where(eq(partnerUsers.email, ctx.user.email))
        .limit(1);
    } else if (ctx.user.id) {
      partnerUser = await db
        .select()
        .from(partnerUsers)
        .where(eq(partnerUsers.userId, ctx.user.id))
        .limit(1);
    }

    if (!partnerUser || partnerUser.length === 0) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    const partnerCompanyId = partnerUser[0].partnerCompanyId;

    // Get company info
    const company = await db
      .select()
      .from(partnerCompanies)
      .where(eq(partnerCompanies.id, partnerCompanyId))
      .limit(1);

    // Get active deals
    const activeDeals = await db
      .select()
      .from(partnerDeals)
      .where(eq(partnerDeals.partnerCompanyId, partnerCompanyId));

    return {
      company: company[0],
      activeDealCount: activeDeals.length,
      commissionRate: company[0]?.commissionRate || "10.00",
      mdfBudget: company[0]?.mdfBudgetAnnual || "0.00",
      tier: company[0]?.tier || "Standard",
      recentDeals: activeDeals.slice(0, 5),
    };
  }),

  /**
   * Get MDF information
   */
  getMdfInfo: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    let partnerUser;

    if (ctx.user.email) {
      partnerUser = await db
        .select()
        .from(partnerUsers)
        .where(eq(partnerUsers.email, ctx.user.email))
        .limit(1);
    } else if (ctx.user.id) {
      partnerUser = await db
        .select()
        .from(partnerUsers)
        .where(eq(partnerUsers.userId, ctx.user.id))
        .limit(1);
    }

    if (!partnerUser || partnerUser.length === 0) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    const partnerCompanyId = partnerUser[0].partnerCompanyId;

    // Get company MDF budget
    const company = await db
      .select()
      .from(partnerCompanies)
      .where(eq(partnerCompanies.id, partnerCompanyId))
      .limit(1);

    // Get MDF claims
    const claims = await db
      .select()
      .from(partnerMdfClaims)
      .where(eq(partnerMdfClaims.partnerCompanyId, partnerCompanyId));

    // Calculate used amount
    const usedAmount = claims
      .filter((c) => c.status === "Paid")
      .reduce((sum, c) => sum + Number(c.paidAmount || 0), 0);

    return {
      totalBudget: company[0]?.mdfBudgetAnnual || "0.00",
      usedAmount: usedAmount.toString(),
      availableAmount: (Number(company[0]?.mdfBudgetAnnual || 0) - usedAmount).toString(),
      claims: claims,
    };
  }),

  /**
   * Submit MDF claim
   */
  submitMdfClaim: protectedProcedure
    .input(
      z.object({
        claimName: z.string().min(1),
        campaignType: z.enum([
          "Digital Marketing",
          "Event Sponsorship",
          "Content Creation",
          "Sales Enablement",
          "Training",
          "Co-Marketing",
          "Other",
        ]),
        requestedAmount: z.number().positive(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let partnerUser;

      if (ctx.user.email) {
        partnerUser = await db
          .select()
          .from(partnerUsers)
          .where(eq(partnerUsers.email, ctx.user.email))
          .limit(1);
      } else if (ctx.user.id) {
        partnerUser = await db
          .select()
          .from(partnerUsers)
          .where(eq(partnerUsers.userId, ctx.user.id))
          .limit(1);
      }

      if (!partnerUser || partnerUser.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const partnerCompany = await db
        .select()
        .from(partnerCompanies)
        .where(eq(partnerCompanies.id, partnerUser[0].partnerCompanyId))
        .limit(1);

      if (partnerCompany.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await db.insert(partnerMdfClaims).values({
        partnerCompanyId: partnerUser[0].partnerCompanyId,
        claimName: input.claimName,
        campaignType: input.campaignType,
        requestedAmount: input.requestedAmount.toString(),
        description: input.description,
        status: "Draft",
        submittedBy: partnerUser[0].id,
      });

      // Send email notification
      try {
        await EmailNotificationService.sendNotification(
          partnerUser[0].partnerCompanyId,
          "mdf_submitted",
          {
            partnerName: partnerCompany[0].companyName,
            claimName: input.claimName,
            campaignType: input.campaignType,
            requestedAmount: input.requestedAmount.toFixed(2),
          },
          "mdf_claim"
        );
      } catch (error) {
        console.error("Failed to send MDF notification:", error);
      }

      return { success: true, claimName: input.claimName };
    }),
});
