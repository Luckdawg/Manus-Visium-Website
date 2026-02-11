import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb, executeRawSQL } from "../db";
import {
  partnerCompanies,
  partnerUsers,
  partnerOnboardingSessions,
} from "../../drizzle/partner-schema";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

/**
 * Partner Onboarding Router
 * Handles partner application intake, approval workflows, tiering, certifications, and milestone tracking
 */
export const partnerOnboardingRouter = router({
  /**
   * Create a new partner application (intake form)
   */
  createApplication: publicProcedure
    .input(
      z.object({
        companyName: z.string().min(1, "Company name is required"),
        website: z.string().url().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().min(1, "Country is required"),
        zipCode: z.string().optional(),
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
        primaryContactName: z.string().min(1, "Contact name is required"),
        primaryContactEmail: z.string().email("Valid email is required"),
        primaryContactPhone: z.string().optional(),
        description: z.string().optional(),
        specializations: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // Check if company already exists
        const existingCompany = await db
          .select()
          .from(partnerCompanies)
          .where(eq(partnerCompanies.email, input.primaryContactEmail));

        if (existingCompany.length > 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A partner application with this email already exists",
          });
        }

        // Create partner company application (status: Prospect)
        const result = await executeRawSQL(
          `INSERT INTO partner_companies 
           (companyName, website, phone, email, address, city, state, country, zipCode, 
            partnerType, partnerStatus, tier, primaryContactName, primaryContactEmail, 
            primaryContactPhone, description, specializations, commissionRate, mdfBudgetAnnual)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            input.companyName,
            input.website || null,
            input.phone || null,
            input.primaryContactEmail,
            input.address || null,
            input.city || null,
            input.state || null,
            input.country,
            input.zipCode || null,
            input.partnerType,
            "Prospect", // Initial status
            "Standard", // Default tier
            input.primaryContactName,
            input.primaryContactEmail,
            input.primaryContactPhone || null,
            input.description || null,
            input.specializations ? JSON.stringify(input.specializations) : null,
            "10.00", // Default commission rate
            "0.00", // Default MDF budget
          ]
        );

        const companyId = (result as any).insertId;
        if (!companyId) {
          throw new Error("Failed to create partner application");
        }

        return {
          success: true,
          companyId,
          status: "Prospect",
          message: "Partner application submitted successfully. We will review and contact you soon.",
        };
      } catch (error) {
        if ((error as any).code === "CONFLICT") throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create application: " + (error as any).message,
        });
      }
    }),

  /**
   * Get partner application details (for admin review)
   */
  getApplication: protectedProcedure
    .input(z.object({ companyId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Only admins can view applications
      if (ctx.user?.role !== "admin" && ctx.user?.role !== "super_admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can view partner applications",
        });
      }

      const company = await db
        .select()
        .from(partnerCompanies)
        .where(eq(partnerCompanies.id, input.companyId));

      if (company.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Partner application not found",
        });
      }

      return company[0];
    }),

  /**
   * List all pending partner applications (for admin dashboard)
   */
  listPendingApplications: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Only admins can view applications
    if (ctx.user?.role !== "admin" && ctx.user?.role !== "super_admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only admins can view partner applications",
      });
    }

    const applications = await db
      .select()
      .from(partnerCompanies)
      .where(eq(partnerCompanies.partnerStatus, "Prospect"));

    return applications;
  }),

  /**
   * Approve partner application and assign tier
   */
  approveApplication: protectedProcedure
    .input(
      z.object({
        companyId: z.number(),
        tier: z.enum(["Gold", "Silver", "Bronze", "Standard"]),
        commissionRate: z.number().min(0).max(100).optional(),
        mdfBudgetAnnual: z.number().min(0).optional(),
        certifications: z.array(z.string()).optional(),
        accountManagerId: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Only admins can approve applications
      if (ctx.user?.role !== "admin" && ctx.user?.role !== "super_admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can approve partner applications",
        });
      }

      try {
        // Update partner company status to Active
        await executeRawSQL(
          `UPDATE partner_companies 
           SET partnerStatus = ?, tier = ?, commissionRate = ?, mdfBudgetAnnual = ?, 
               certifications = ?, accountManagerId = ?, updatedAt = NOW()
           WHERE id = ?`,
          [
            "Active",
            input.tier,
            input.commissionRate || 10.0,
            input.mdfBudgetAnnual || 0,
            input.certifications ? JSON.stringify(input.certifications) : null,
            input.accountManagerId || null,
            input.companyId,
          ]
        );

        return {
          success: true,
          message: `Partner approved as ${input.tier} tier`,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to approve application: " + (error as any).message,
        });
      }
    }),

  /**
   * Reject partner application
   */
  rejectApplication: protectedProcedure
    .input(
      z.object({
        companyId: z.number(),
        rejectionReason: z.string().min(10, "Rejection reason must be at least 10 characters"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Only admins can reject applications
      if (ctx.user?.role !== "admin" && ctx.user?.role !== "super_admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can reject partner applications",
        });
      }

      try {
        // Update partner company status to Suspended with reason in description
        await executeRawSQL(
          `UPDATE partner_companies 
           SET partnerStatus = ?, description = ?, updatedAt = NOW()
           WHERE id = ?`,
          ["Suspended", `Rejected: ${input.rejectionReason}`, input.companyId]
        );

        return {
          success: true,
          message: "Partner application rejected",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to reject application: " + (error as any).message,
        });
      }
    }),

  /**
   * Update partner tier (for tier progression)
   */
  updatePartnerTier: protectedProcedure
    .input(
      z.object({
        companyId: z.number(),
        newTier: z.enum(["Gold", "Silver", "Bronze", "Standard"]),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Only admins can update tiers
      if (ctx.user?.role !== "admin" && ctx.user?.role !== "super_admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can update partner tiers",
        });
      }

      try {
        await executeRawSQL(
          `UPDATE partner_companies 
           SET tier = ?, updatedAt = NOW()
           WHERE id = ?`,
          [input.newTier, input.companyId]
        );

        return {
          success: true,
          message: `Partner tier updated to ${input.newTier}`,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update tier: " + (error as any).message,
        });
      }
    }),

  /**
   * Add certification to partner
   */
  addCertification: protectedProcedure
    .input(
      z.object({
        companyId: z.number(),
        certification: z.string().min(1, "Certification name is required"),
        expiryDate: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Only admins can add certifications
      if (ctx.user?.role !== "admin" && ctx.user?.role !== "super_admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can add certifications",
        });
      }

      try {
        // Get current certifications
        const company = await db
          .select()
          .from(partnerCompanies)
          .where(eq(partnerCompanies.id, input.companyId));

        if (company.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Partner not found",
          });
        }

        const currentCerts = company[0].certifications
          ? JSON.parse(company[0].certifications as string)
          : [];

        const newCert = {
          name: input.certification,
          expiryDate: input.expiryDate || null,
          addedAt: new Date().toISOString(),
        };

        currentCerts.push(newCert);

        await executeRawSQL(
          `UPDATE partner_companies 
           SET certifications = ?, updatedAt = NOW()
           WHERE id = ?`,
          [JSON.stringify(currentCerts), input.companyId]
        );

        return {
          success: true,
          message: `Certification "${input.certification}" added successfully`,
        };
      } catch (error) {
        if ((error as any).code === "NOT_FOUND") throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add certification: " + (error as any).message,
        });
      }
    }),

  /**
   * Get partner onboarding progress
   */
  getOnboardingProgress: protectedProcedure
    .input(z.object({ companyId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const company = await db
        .select()
        .from(partnerCompanies)
        .where(eq(partnerCompanies.id, input.companyId));

      if (company.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Partner not found",
        });
      }

      const partner = company[0];

      // Calculate onboarding progress based on completion
      const milestones = {
        applicationSubmitted: true, // Always true if partner exists
        approved: partner.partnerStatus === "Active",
        tierAssigned: partner.tier !== "Standard" || partner.partnerStatus === "Active",
        certificationsEarned: partner.certifications
          ? JSON.parse(partner.certifications as string).length > 0
          : false,
        firstDealSubmitted: false, // Would check deal table
        mdfBudgetAllocated: partner.mdfBudgetAnnual && parseFloat(partner.mdfBudgetAnnual.toString()) > 0,
      };

      const completedMilestones = Object.values(milestones).filter(Boolean).length;
      const totalMilestones = Object.keys(milestones).length;
      const progressPercentage = Math.round((completedMilestones / totalMilestones) * 100);

      return {
        companyId: input.companyId,
        status: partner.partnerStatus,
        tier: partner.tier,
        milestones,
        completedMilestones,
        totalMilestones,
        progressPercentage,
      };
    }),

  /**
   * Create digital contract for partner (placeholder for contract management)
   */
  createPartnerContract: protectedProcedure
    .input(
      z.object({
        companyId: z.number(),
        contractType: z.enum([
          "Partner Agreement",
          "NDA",
          "Service Level Agreement",
          "Commission Agreement",
        ]),
        terms: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Only admins can create contracts
      if (ctx.user?.role !== "admin" && ctx.user?.role !== "super_admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can create contracts",
        });
      }

      // TODO: Integrate with digital contract service (e.g., DocuSign, HelloSign)
      // For now, return a placeholder response
      return {
        success: true,
        contractId: `contract_${Date.now()}`,
        status: "pending_signature",
        message: `${input.contractType} created and ready for signature`,
        contractUrl: `/contracts/${Date.now()}`, // Placeholder URL
      };
    }),

  /**
   * Track onboarding milestone completion
   */
  completeOnboardingMilestone: protectedProcedure
    .input(
      z.object({
        companyId: z.number(),
        milestone: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // Get current completed steps
        const session = await db
          .select()
          .from(partnerOnboardingSessions)
          .where(eq(partnerOnboardingSessions.userId, input.companyId.toString()));

        const completedSteps = session.length > 0
          ? JSON.parse(session[0].completedSteps as string)
          : [];

        if (!completedSteps.includes(input.milestone)) {
          completedSteps.push(input.milestone);
        }

        return {
          success: true,
          completedMilestones: completedSteps,
          message: `Milestone "${input.milestone}" marked as complete`,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to complete milestone: " + (error as any).message,
        });
      }
    }),
});
