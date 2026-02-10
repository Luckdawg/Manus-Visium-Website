import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "./db";
import { users, auditLogs } from "../drizzle/schema";
import { eq, and, ne } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { executeRawSQL } from "./db";

// Helper to check if user has admin privileges
async function requireAdmin(ctx: any) {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  const db = await getDb();
  if (!db) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Database not available",
    });
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, ctx.user.id))
    .limit(1);

  if (!user || !["super_admin", "admin"].includes(user.role)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }

  return { user, db };
}

// Helper to log audit actions
async function logAudit(
  db: any,
  userId: number,
  action: string,
  entityType?: string,
  entityId?: number,
  details?: any,
  ipAddress?: string
) {
  await db.insert(auditLogs).values({
    userId,
    action,
    entityType,
    entityId,
    details: details ? JSON.stringify(details) : null,
    ipAddress,
  });
}

export const adminRouter = router({
  // Get all users (admin only)
  listUsers: publicProcedure.query(async ({ ctx }) => {
    const { user, db } = await requireAdmin(ctx);

    const allUsers = await db.select().from(users);

    return allUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      loginMethod: u.loginMethod,
      twoFactorEnabled: u.twoFactorEnabled === 1,
      createdAt: u.createdAt,
      lastSignedIn: u.lastSignedIn,
    }));
  }),

  // Create new admin user
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(8),
        role: z.enum(["super_admin", "admin", "editor", "viewer"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { user, db } = await requireAdmin(ctx);

      // Only super_admin can create other super_admins
      if (input.role === "super_admin" && user.role !== "super_admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only super admins can create super admin accounts",
        });
      }

      // Check if email already exists
      const [existing] = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (existing) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email already in use",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(input.password, 10);

      // Create user
      const [newUser] = await db
        .insert(users)
        .values({
          name: input.name,
          email: input.email,
          password: hashedPassword,
          role: input.role,
          loginMethod: "local",
          openId: `local_${Date.now()}_${Math.random()}`, // Generate unique openId for local users
        })
        .$returningId();

      // Log audit
      await logAudit(
        db,
        user.id,
        "user_created",
        "user",
        newUser.id,
        { email: input.email, role: input.role }
      );

      return { success: true, userId: newUser.id };
    }),

  // Update user
  updateUser: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        role: z.enum(["super_admin", "admin", "editor", "viewer"]).optional(),
        password: z.string().min(8).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { user, db } = await requireAdmin(ctx);

      // Get target user
      const [targetUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, input.userId))
        .limit(1);

      if (!targetUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Only super_admin can modify super_admin accounts
      if (
        (targetUser.role === "super_admin" || input.role === "super_admin") &&
        user.role !== "super_admin"
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only super admins can modify super admin accounts",
        });
      }

      // Prevent users from downgrading their own role
      if (input.userId === user.id && input.role && input.role !== user.role) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot change your own role",
        });
      }

      // Build update object
      const updates: any = {};
      if (input.name) updates.name = input.name;
      if (input.email) updates.email = input.email;
      if (input.role) updates.role = input.role;
      if (input.password) {
        updates.password = await bcrypt.hash(input.password, 10);
      }

      // Update user
      await db.update(users).set(updates).where(eq(users.id, input.userId));

      // Log audit
      await logAudit(
        db,
        user.id,
        "user_updated",
        "user",
        input.userId,
        updates
      );

      return { success: true };
    }),

  // Delete user
  deleteUser: publicProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { user, db } = await requireAdmin(ctx);

      // Prevent self-deletion
      if (input.userId === user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot delete your own account",
        });
      }

      // Get target user
      const [targetUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, input.userId))
        .limit(1);

      if (!targetUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Only super_admin can delete super_admin accounts
      if (targetUser.role === "super_admin" && user.role !== "super_admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only super admins can delete super admin accounts",
        });
      }

      // Delete user
      await db.delete(users).where(eq(users.id, input.userId));

      // Log audit
      await logAudit(
        db,
        user.id,
        "user_deleted",
        "user",
        input.userId,
        { email: targetUser.email }
      );

      return { success: true };
    }),

  // Get current user info
  getCurrentUser: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      return null;
    }

    const db = await getDb();
    if (!db) {
      return null;
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      twoFactorEnabled: user.twoFactorEnabled === 1,
    };
  }),

  // Get audit logs
  getAuditLogs: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const { user, db } = await requireAdmin(ctx);

      const logs = await db
        .select()
        .from(auditLogs)
        .orderBy(auditLogs.createdAt)
        .limit(input.limit)
        .offset(input.offset);

      return logs;
    }),

  // Get pending partner deals for approval
  getPendingDeals: publicProcedure.query(async ({ ctx }) => {
    const { user, db } = await requireAdmin(ctx);

    try {
      const deals = await executeRawSQL(
        `SELECT pd.*, pc.companyName, pc.primaryContactName, pc.primaryContactEmail FROM partner_deals pd LEFT JOIN partner_companies pc ON pd.partnerCompanyId = pc.id ORDER BY pd.createdAt DESC`
      );

      return {
        deals: deals || [],
        totalCount: (deals || []).length,
        pendingCount: (deals || []).filter((d: any) => d.dealStatus !== "Approved").length,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch pending deals: " + (error as any).message,
      });
    }
  }),

  // Approve a partner deal
  approveDeal: publicProcedure
    .input(
      z.object({
        dealId: z.number(),
        commissionPercentage: z.number().min(0).max(100),
        approvalNotes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { user, db } = await requireAdmin(ctx);

      try {
        // Update deal status to Approved
        await executeRawSQL(
          `UPDATE partner_deals SET dealStatus = ?, commissionPercentage = ?, approvedBy = ?, approvedAt = NOW() WHERE id = ?`,
          ["Approved", input.commissionPercentage, user.id, input.dealId]
        );

        // Log the approval
        await logAudit(db, user.id, "DEAL_APPROVED", "partner_deals", input.dealId, {
          commissionPercentage: input.commissionPercentage,
          approvalNotes: input.approvalNotes,
        });

        return { success: true, message: "Deal approved successfully" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to approve deal: " + (error as any).message,
        });
      }
    }),
});
