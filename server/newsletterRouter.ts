import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "./db";
import { newsletterSubscribers } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { notifyOwner } from "./_core/notification";

export const newsletterRouter = router({
  // Get all newsletter subscribers for admin dashboard
  getAll: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    const subscribers = await db
      .select()
      .from(newsletterSubscribers)
      .orderBy(newsletterSubscribers.subscribedAt);

    return subscribers;
  }),

  // Subscribe to newsletter
  subscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        name: z.string().optional(),
        subscribedTo: z.enum(["investor_alerts", "general_news", "product_updates"]).default("investor_alerts"),
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

      // Check if email already exists
      const [existing] = await db
        .select()
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.email, input.email))
        .limit(1);

      if (existing) {
        if (existing.status === "unsubscribed") {
          // Resubscribe
          await db
            .update(newsletterSubscribers)
            .set({
              status: "active",
              subscribedTo: input.subscribedTo,
              subscribedAt: new Date(),
              unsubscribedAt: null,
            })
            .where(eq(newsletterSubscribers.id, existing.id));

          return {
            success: true,
            message: "Successfully resubscribed to newsletter",
          };
        } else {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Email already subscribed",
          });
        }
      }

      // Create new subscription
      await db.insert(newsletterSubscribers).values({
        email: input.email,
        name: input.name || null,
        subscribedTo: input.subscribedTo,
        status: "active",
        verified: 1, // Auto-verify for now
      });

      // Send notification to admin
      try {
        await notifyOwner({
          title: "New Newsletter Subscription",
          content: `${input.name || "Someone"} (${input.email}) subscribed to ${input.subscribedTo.replace("_", " ")}`,
        });
      } catch (error) {
        console.error("Failed to send notification:", error);
        // Don't fail the subscription if notification fails
      }

      return {
        success: true,
        message: "Successfully subscribed to newsletter",
      };
    }),

  // Unsubscribe from newsletter
  unsubscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
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

      const [subscriber] = await db
        .select()
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.email, input.email))
        .limit(1);

      if (!subscriber) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Email not found in subscription list",
        });
      }

      await db
        .update(newsletterSubscribers)
        .set({
          status: "unsubscribed",
          unsubscribedAt: new Date(),
        })
        .where(eq(newsletterSubscribers.id, subscriber.id));

      return {
        success: true,
        message: "Successfully unsubscribed from newsletter",
      };
    }),

  // Get subscription status
  getStatus: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const [subscriber] = await db
        .select()
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.email, input.email))
        .limit(1);

      if (!subscriber) {
        return {
          subscribed: false,
        };
      }

      return {
        subscribed: subscriber.status === "active",
        subscribedTo: subscriber.subscribedTo,
        subscribedAt: subscriber.subscribedAt,
      };
    }),
});
