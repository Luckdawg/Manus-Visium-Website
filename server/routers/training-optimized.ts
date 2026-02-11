import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { eq } from "drizzle-orm";
import { cacheManager, cacheKeys, cacheTTL, invalidateCache } from "../_core/cache";

/**
 * Optimized Training Router with Caching
 * Implements cache-aside pattern for frequently accessed training data
 */
export const trainingOptimizedRouter = router({
  /**
   * Get courses with caching (5-minute TTL)
   */
  getCoursesOptimized: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const cacheKey = cacheKeys.courses(input.limit, input.offset);

      return cacheManager.getOrCompute(cacheKey, async () => {
        const db = await getDb();
        if (!db) return [];

        const { trainingCourses } = await import("../../drizzle/training-schema");

        const courses = await db
          .select()
          .from(trainingCourses)
          .limit(input.limit)
          .offset(input.offset);

        // Filter by category in-memory if needed
        if (input.category) {
          return courses.filter((c) => c.category === input.category);
        }

        return courses;
      }, cacheTTL.MEDIUM);
    }),

  /**
   * Get learning paths with caching (15-minute TTL)
   */
  getLearningPathsOptimized: publicProcedure.query(async () => {
    const cacheKey = cacheKeys.learningPaths();

    return cacheManager.getOrCompute(
      cacheKey,
      async () => {
        const db = await getDb();
        if (!db) return [];

        const { learningPaths } = await import("../../drizzle/training-schema");

        const paths = await db.select().from(learningPaths);
        return paths;
      },
      cacheTTL.LONG
    );
  }),

  /**
   * Get user courses with caching (1-minute TTL - shorter for user-specific data)
   */
  getUserCoursesOptimized: protectedProcedure.query(async ({ ctx }) => {
    const cacheKey = cacheKeys.userCourses(ctx.user!.id);

    return cacheManager.getOrCompute(
      cacheKey,
      async () => {
        const db = await getDb();
        if (!db) return [];

        const { partnerCourseEnrollments } = await import("../../drizzle/training-schema");

        const enrollments = await db
          .select()
          .from(partnerCourseEnrollments)
          .where(eq(partnerCourseEnrollments.partnerUserId, ctx.user!.id));

        return enrollments;
      },
      cacheTTL.SHORT
    );
  }),

  /**
   * Get certifications with caching (15-minute TTL)
   */
  getCertificationsOptimized: publicProcedure.query(async () => {
    const cacheKey = cacheKeys.certifications();

    return cacheManager.getOrCompute(
      cacheKey,
      async () => {
        const db = await getDb();
        if (!db) return [];

        const { partnerCertifications } = await import("../../drizzle/training-schema");

        const certs = await db.select().from(partnerCertifications);
        return certs;
      },
      cacheTTL.LONG
    );
  }),

  /**
   * Enroll in course (invalidates user course cache)
   */
  enrollCourseOptimized: protectedProcedure
    .input(z.object({ courseId: z.number(), partnerCompanyId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const { partnerCourseEnrollments } = await import("../../drizzle/training-schema");

      const result = await db.insert(partnerCourseEnrollments).values({
        partnerCompanyId: input.partnerCompanyId,
        partnerUserId: ctx.user!.id,
        courseId: input.courseId,
        enrollmentStatus: "Enrolled",
        progressPercentage: 0,
      });

      // Invalidate user course cache
      invalidateCache.userTraining(ctx.user!.id);

      return {
        success: true,
        enrollmentId: (result as any).insertId,
      };
    }),

  /**
   * Update progress (invalidates user course cache)
   */
  updateProgressOptimized: protectedProcedure
    .input(
      z.object({
        enrollmentId: z.number(),
        progressPercentage: z.number().min(0).max(100),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const { partnerCourseEnrollments } = await import("../../drizzle/training-schema");

      // Verify enrollment belongs to user
      const enrollment = await db
        .select()
        .from(partnerCourseEnrollments)
        .where(eq(partnerCourseEnrollments.id, input.enrollmentId))
        .limit(1);

      if (!enrollment.length || enrollment[0].partnerUserId !== ctx.user!.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to update this enrollment",
        });
      }

      // Determine status based on progress
      const newStatus =
        input.progressPercentage === 100
          ? "Completed"
          : input.progressPercentage > 0
            ? "In Progress"
            : "Enrolled";

      await db
        .update(partnerCourseEnrollments)
        .set({
          progressPercentage: input.progressPercentage,
          enrollmentStatus: newStatus,
        })
        .where(eq(partnerCourseEnrollments.id, input.enrollmentId));

      // Invalidate user course cache
      invalidateCache.userTraining(ctx.user!.id);

      return { success: true };
    }),

  /**
   * Get user certifications with caching (1-minute TTL)
   */
  getUserCertificationsOptimized: protectedProcedure.query(async ({ ctx }) => {
    const cacheKey = cacheKeys.userCertifications(ctx.user!.id);

    return cacheManager.getOrCompute(
      cacheKey,
      async () => {
        const db = await getDb();
        if (!db) return [];

        const { partnerCertifications, partnerCourseEnrollments } = await import(
          "../../drizzle/training-schema"
        );

        // Get all certifications
        const certs = await db.select().from(partnerCertifications);

        // Get user's completed courses
        const enrollments = await db
          .select()
          .from(partnerCourseEnrollments)
          .where(eq(partnerCourseEnrollments.partnerUserId, ctx.user!.id));

        const completedCount = enrollments.filter(
          (e) => e.enrollmentStatus === "Completed"
        ).length;

        // Filter eligible certifications (simplified - just check if user has completed courses)
        return certs.filter((cert) => completedCount > 0);
      },
      cacheTTL.SHORT
    );
  }),

  /**
   * Get cache statistics
   */
  getCacheStats: publicProcedure.query(async () => {
    const stats = cacheManager.getStats();
    return {
      ...stats,
      message: `Cache contains ${stats.size} entries`,
    };
  }),

  /**
   * Clear cache
   */
  clearCache: publicProcedure.mutation(async () => {
    invalidateCache.all();
    return { success: true, message: "Cache cleared" };
  }),
});
