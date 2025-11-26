import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "./db";
import { users, auditLogs } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { authenticator } from "otplib";
import QRCode from "qrcode";

// Helper to require authentication
async function requireAuth(ctx: any) {
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

  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not found",
    });
  }

  return { user, db };
}

// Helper to log audit actions
async function logAudit(
  db: any,
  userId: number,
  action: string,
  details?: any
) {
  await db.insert(auditLogs).values({
    userId,
    action,
    details: details ? JSON.stringify(details) : null,
  });
}

export const twoFactorRouter = router({
  // Generate 2FA secret and QR code
  setup: publicProcedure.mutation(async ({ ctx }) => {
    const { user, db } = await requireAuth(ctx);

    // Generate secret
    const secret = authenticator.generateSecret();

    // Generate OTP auth URL
    const otpauthUrl = authenticator.keyuri(
      user.email || user.name || "User",
      "Visium Technologies CMS",
      secret
    );

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

    // Store secret temporarily (not enabled yet)
    await db
      .update(users)
      .set({ twoFactorSecret: secret })
      .where(eq(users.id, user.id));

    return {
      secret,
      qrCode: qrCodeDataUrl,
      otpauthUrl,
    };
  }),

  // Verify and enable 2FA
  enable: publicProcedure
    .input(
      z.object({
        token: z.string().length(6),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { user, db } = await requireAuth(ctx);

      if (!user.twoFactorSecret) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "2FA setup not initiated. Call setup first.",
        });
      }

      // Verify token
      const isValid = authenticator.verify({
        token: input.token,
        secret: user.twoFactorSecret,
      });

      if (!isValid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid verification code",
        });
      }

      // Enable 2FA
      await db
        .update(users)
        .set({ twoFactorEnabled: 1 })
        .where(eq(users.id, user.id));

      // Log audit
      await logAudit(db, user.id, "2fa_enabled");

      return { success: true };
    }),

  // Disable 2FA
  disable: publicProcedure
    .input(
      z.object({
        token: z.string().length(6),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { user, db } = await requireAuth(ctx);

      if (user.twoFactorEnabled !== 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "2FA is not enabled",
        });
      }

      if (!user.twoFactorSecret) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "2FA secret not found",
        });
      }

      // Verify token before disabling
      const isValid = authenticator.verify({
        token: input.token,
        secret: user.twoFactorSecret,
      });

      if (!isValid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid verification code",
        });
      }

      // Disable 2FA and clear secret
      await db
        .update(users)
        .set({
          twoFactorEnabled: 0,
          twoFactorSecret: null,
        })
        .where(eq(users.id, user.id));

      // Log audit
      await logAudit(db, user.id, "2fa_disabled");

      return { success: true };
    }),

  // Verify 2FA token (for login flow)
  verify: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        token: z.string().length(6),
      })
    )
    .mutation(async ({ input }) => {
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
        .where(eq(users.id, input.userId))
        .limit(1);

      if (!user || !user.twoFactorSecret || user.twoFactorEnabled !== 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "2FA not enabled for this user",
        });
      }

      // Verify token
      const isValid = authenticator.verify({
        token: input.token,
        secret: user.twoFactorSecret,
      });

      if (!isValid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid verification code",
        });
      }

      // Log audit
      await logAudit(db, user.id, "2fa_verified");

      return { success: true };
    }),

  // Check 2FA status
  status: publicProcedure.query(async ({ ctx }) => {
    const { user } = await requireAuth(ctx);

    return {
      enabled: user.twoFactorEnabled === 1,
      hasSecret: !!user.twoFactorSecret,
    };
  }),
});
