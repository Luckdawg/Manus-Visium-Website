import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { eq, and, gte } from "drizzle-orm";

/**
 * Training & Enablement Router
 * Handles LMS, courses, certifications, and training content
 */
export const trainingRouter = router({
  /**
   * Get all published courses
   */
  getCourses: publicProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const { trainingCourses } = await import("../../drizzle/training-schema");

      const courses = await db
        .select()
        .from(trainingCourses)
        .where(eq(trainingCourses.isPublished, true))
        .limit(input.limit)
        .offset(input.offset);

      return courses;
    }),

  /**
   * Get single course details
   */
  getCourseById: publicProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const { trainingCourses } = await import("../../drizzle/training-schema");

      const course = await db
        .select()
        .from(trainingCourses)
        .where(eq(trainingCourses.id, input.courseId))
        .limit(1);

      if (!course.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      return course[0];
    }),

  /**
   * Get all learning paths
   */
  getLearningPaths: publicProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const { learningPaths } = await import("../../drizzle/training-schema");

      const paths = await db
        .select()
        .from(learningPaths)
        .where(eq(learningPaths.isPublished, true))
        .limit(input.limit)
        .offset(input.offset);

      return paths;
    }),

  /**
   * Get learning path details with courses
   */
  getLearningPathById: publicProcedure
    .input(z.object({ pathId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const { learningPaths, trainingCourses } = await import("../../drizzle/training-schema");

      const path = await db
        .select()
        .from(learningPaths)
        .where(eq(learningPaths.id, input.pathId))
        .limit(1);

      if (!path.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Learning path not found",
        });
      }

      // Get courses in this path
      try {
        const courseIds = JSON.parse(path[0].courseIds);
        const courses = Array.isArray(courseIds) && courseIds.length
          ? await db
              .select()
              .from(trainingCourses)
              .where(eq(trainingCourses.isPublished, true))
          : [];

        return {
          ...path[0],
          courses: courses.filter(c => courseIds.includes(c.id)),
        };
      } catch {
        return {
          ...path[0],
          courses: [],
        };
      }
    }),

  /**
   * Enroll partner user in a course
   */
  enrollInCourse: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
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

      // Check if already enrolled
      const existing = await db
        .select()
        .from(partnerCourseEnrollments)
        .where(
          and(
            eq(partnerCourseEnrollments.courseId, input.courseId),
            eq(partnerCourseEnrollments.partnerUserId, ctx.user!.id)
          )
        )
        .limit(1);

      if (existing.length) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Already enrolled in this course",
        });
      }

      const result = await db.insert(partnerCourseEnrollments).values({
        courseId: input.courseId,
        partnerUserId: ctx.user!.id,
        partnerCompanyId: ctx.user!.id,
        enrollmentStatus: "Enrolled",
      });

      return {
        success: true,
        enrollmentId: (result as any).insertId,
      };
    }),

  /**
   * Get partner's course enrollments
   */
  getMyEnrollments: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return [];

      const { partnerCourseEnrollments, trainingCourses } = await import("../../drizzle/training-schema");

      const enrollments = await db
        .select({
          enrollment: partnerCourseEnrollments,
          course: trainingCourses,
        })
        .from(partnerCourseEnrollments)
        .innerJoin(trainingCourses, eq(partnerCourseEnrollments.courseId, trainingCourses.id))
        .where(eq(partnerCourseEnrollments.partnerUserId, ctx.user!.id))
        .limit(input.limit)
        .offset(input.offset);

      return enrollments;
    }),

  /**
   * Update course progress
   */
  updateCourseProgress: protectedProcedure
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

      // Verify ownership
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

      await db
        .update(partnerCourseEnrollments)
        .set({
          progressPercentage: input.progressPercentage,
          enrollmentStatus: input.progressPercentage === 100 ? "Completed" : "In Progress",
          lastAccessedAt: new Date(),
        })
        .where(eq(partnerCourseEnrollments.id, input.enrollmentId));

      return { success: true };
    }),

  /**
   * Submit course assessment
   */
  submitCourseAssessment: protectedProcedure
    .input(
      z.object({
        enrollmentId: z.number(),
        score: z.number().min(0).max(100),
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

      const { partnerCourseEnrollments, trainingCourses } = await import("../../drizzle/training-schema");

      // Get enrollment and course
      const enrollment = await db
        .select()
        .from(partnerCourseEnrollments)
        .where(eq(partnerCourseEnrollments.id, input.enrollmentId))
        .limit(1);

      if (!enrollment.length || enrollment[0].partnerUserId !== ctx.user!.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized",
        });
      }

      const course = await db
        .select()
        .from(trainingCourses)
        .where(eq(trainingCourses.id, enrollment[0].courseId))
        .limit(1);

      const passingScore = course[0]?.passingScore || 70;
      const passed = input.score >= passingScore;

      await db
        .update(partnerCourseEnrollments)
        .set({
          assessmentScore: input.score,
          assessmentPassed: passed,
          assessmentAttempts: (enrollment[0].assessmentAttempts || 0) + 1,
          assessmentCompletedAt: new Date(),
          enrollmentStatus: passed ? "Completed" : "In Progress",
        })
        .where(eq(partnerCourseEnrollments.id, input.enrollmentId));

      return {
        success: true,
        passed,
        score: input.score,
        passingScore,
      };
    }),

  /**
   * Get partner certifications
   */
  getMyCertifications: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const { partnerCertifications } = await import("../../drizzle/training-schema");

    const certs = await db
      .select()
      .from(partnerCertifications)
      .where(eq(partnerCertifications.partnerUserId, ctx.user!.id));

    return certs;
  }),

  /**
   * Get training content library
   */
  getContentLibrary: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return [];

      const { trainingContentLibrary } = await import("../../drizzle/training-schema");

      const items = await db
        .select()
        .from(trainingContentLibrary)
        .where(eq(trainingContentLibrary.isActive, true))
        .limit(input.limit)
        .offset(input.offset);

      return items;
    }),

  /**
   * Get upcoming training events
   */
  getUpcomingEvents: publicProcedure
    .input(
      z.object({
        limit: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const { trainingEvents } = await import("../../drizzle/training-schema");
      const now = new Date();

      const events = await db
        .select()
        .from(trainingEvents)
        .where(gte(trainingEvents.scheduledStartAt, now))
        .limit(input.limit);

      return events;
    }),

  /**
   * Register for training event
   */
  registerForEvent: protectedProcedure
    .input(z.object({ eventId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const { trainingEvents, trainingEventRegistrations } = await import("../../drizzle/training-schema");

      // Check event exists and has capacity
      const event = await db
        .select()
        .from(trainingEvents)
        .where(eq(trainingEvents.id, input.eventId))
        .limit(1);

      if (!event.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }

      if (event[0].maxAttendees && (event[0].registeredCount || 0) >= event[0].maxAttendees) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Event is at capacity",
        });
      }

      // Check if already registered
      const existing = await db
        .select()
        .from(trainingEventRegistrations)
        .where(
          and(
            eq(trainingEventRegistrations.eventId, input.eventId),
            eq(trainingEventRegistrations.partnerUserId, ctx.user!.id)
          )
        )
        .limit(1);

      if (existing.length) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Already registered for this event",
        });
      }

      const result = await db.insert(trainingEventRegistrations).values({
        eventId: input.eventId,
        partnerUserId: ctx.user!.id,
        partnerCompanyId: ctx.user!.id,
        registrationStatus: "Registered",
      });

      // Update registered count
      await db
        .update(trainingEvents)
        .set({ registeredCount: (event[0].registeredCount || 0) + 1 })
        .where(eq(trainingEvents.id, input.eventId));

      return {
        success: true,
        registrationId: (result as any).insertId,
      };
    }),

  /**
   * Get partner training progress dashboard
   */
  getTrainingProgress: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    const {
      partnerTrainingProgress,
      partnerCourseEnrollments,
      partnerCertifications,
      partnerLearningPathProgress,
    } = await import("../../drizzle/training-schema");

    const companyId = ctx.user!.id;

    // Get or create progress record
    let progress = await db
      .select()
      .from(partnerTrainingProgress)
      .where(eq(partnerTrainingProgress.partnerCompanyId, companyId))
      .limit(1);

    if (!progress.length) {
      await db.insert(partnerTrainingProgress).values({
        partnerCompanyId: companyId,
      });

      progress = await db
        .select()
        .from(partnerTrainingProgress)
        .where(eq(partnerTrainingProgress.partnerCompanyId, companyId))
        .limit(1);
    }

    // Get enrollments
    const enrollments = await db
      .select()
      .from(partnerCourseEnrollments)
      .where(eq(partnerCourseEnrollments.partnerUserId, ctx.user!.id));

    const completedCount = enrollments.filter(
      (e) => e.enrollmentStatus === "Completed"
    ).length;

    // Get certifications
    const certs = await db
      .select()
      .from(partnerCertifications)
      .where(eq(partnerCertifications.partnerUserId, ctx.user!.id));

    const activeCerts = certs.filter((c) => c.status === "Active").length;

    // Get learning paths
    const paths = await db
      .select()
      .from(partnerLearningPathProgress)
      .where(eq(partnerLearningPathProgress.partnerUserId, ctx.user!.id));

    const completedPaths = paths.filter((p) => p.pathStatus === "Completed").length;

    return {
      ...progress[0],
      totalCoursesEnrolled: enrollments.length,
      totalCoursesCompleted: completedCount,
      overallProgressPercentage: Math.round(
        (completedCount / Math.max(enrollments.length, 1)) * 100
      ),
      activeCertifications: activeCerts,
      completedLearningPaths: completedPaths,
    };
  }),
});
