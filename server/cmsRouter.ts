import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "./db";
import { users, cmsPages, cmsMedia, auditLogs } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { storagePut } from "./storage";

// Helper to check if user can edit content
async function requireEditor(ctx: any) {
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

  if (!user || !["super_admin", "admin", "editor"].includes(user.role)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Editor access required",
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
  details?: any
) {
  await db.insert(auditLogs).values({
    userId,
    action,
    entityType,
    entityId,
    details: details ? JSON.stringify(details) : null,
  });
}

export const cmsRouter = router({
  // List all pages
  listPages: publicProcedure.query(async ({ ctx }) => {
    await requireEditor(ctx);

    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    const pages = await db.select().from(cmsPages);
    return pages;
  }),

  // Get page by key
  getPage: publicProcedure
    .input(z.object({ pageKey: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const [page] = await db
        .select()
        .from(cmsPages)
        .where(eq(cmsPages.pageKey, input.pageKey))
        .limit(1);

      if (!page) {
        return null;
      }

      return {
        ...page,
        content: JSON.parse(page.content),
      };
    }),

  // Create or update page
  savePage: publicProcedure
    .input(
      z.object({
        pageKey: z.string(),
        title: z.string(),
        content: z.record(z.string(), z.any()), // JSON object with editable sections
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { user, db } = await requireEditor(ctx);

      // Check if page exists
      const [existing] = await db
        .select()
        .from(cmsPages)
        .where(eq(cmsPages.pageKey, input.pageKey))
        .limit(1);

      const contentJson = JSON.stringify(input.content);

      if (existing) {
        // Update existing page
        await db
          .update(cmsPages)
          .set({
            title: input.title,
            content: contentJson,
            lastEditedBy: user.id,
          })
          .where(eq(cmsPages.pageKey, input.pageKey));

        await logAudit(
          db,
          user.id,
          "page_updated",
          "page",
          existing.id,
          { pageKey: input.pageKey }
        );

        return { success: true, pageId: existing.id, action: "updated" };
      } else {
        // Create new page
        const [newPage] = await db
          .insert(cmsPages)
          .values({
            pageKey: input.pageKey,
            title: input.title,
            content: contentJson,
            lastEditedBy: user.id,
          })
          .$returningId();

        await logAudit(
          db,
          user.id,
          "page_created",
          "page",
          newPage.id,
          { pageKey: input.pageKey }
        );

        return { success: true, pageId: newPage.id, action: "created" };
      }
    }),

  // Delete page
  deletePage: publicProcedure
    .input(z.object({ pageKey: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { user, db } = await requireEditor(ctx);

      // Only super_admin can delete pages
      if (user.role !== "super_admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only super admins can delete pages",
        });
      }

      const [page] = await db
        .select()
        .from(cmsPages)
        .where(eq(cmsPages.pageKey, input.pageKey))
        .limit(1);

      if (!page) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Page not found",
        });
      }

      await db.delete(cmsPages).where(eq(cmsPages.pageKey, input.pageKey));

      await logAudit(
        db,
        user.id,
        "page_deleted",
        "page",
        page.id,
        { pageKey: input.pageKey }
      );

      return { success: true };
    }),

  // Upload media
  uploadMedia: publicProcedure
    .input(
      z.object({
        filename: z.string(),
        mimeType: z.string(),
        data: z.string(), // base64 encoded
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { user, db } = await requireEditor(ctx);

      // Decode base64 data
      const buffer = Buffer.from(input.data, "base64");
      const size = buffer.length;

      // Generate unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(7);
      const ext = input.filename.split(".").pop();
      const uniqueFilename = `cms/${timestamp}-${randomStr}.${ext}`;

      // Upload to S3
      const result = await storagePut(uniqueFilename, buffer, input.mimeType);

      if (!result) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload file to storage",
        });
      }

      // Save to database
      const [media] = await db
        .insert(cmsMedia)
        .values({
          filename: uniqueFilename,
          originalName: input.filename,
          mimeType: input.mimeType,
          size,
          url: result.url,
          s3Key: result.key,
          uploadedBy: user.id,
        })
        .$returningId();

      await logAudit(
        db,
        user.id,
        "media_uploaded",
        "media",
        media.id,
        { filename: input.filename, size }
      );

      return {
        success: true,
        mediaId: media.id,
        url: result.url,
      };
    }),

  // List media
  listMedia: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      await requireEditor(ctx);

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const media = await db
        .select()
        .from(cmsMedia)
        .orderBy(cmsMedia.createdAt)
        .limit(input.limit)
        .offset(input.offset);

      return media;
    }),

  // Delete media
  deleteMedia: publicProcedure
    .input(z.object({ mediaId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { user, db } = await requireEditor(ctx);

      const [media] = await db
        .select()
        .from(cmsMedia)
        .where(eq(cmsMedia.id, input.mediaId))
        .limit(1);

      if (!media) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Media not found",
        });
      }

      // Delete from database
      await db.delete(cmsMedia).where(eq(cmsMedia.id, input.mediaId));

      // Note: We don't delete from S3 to avoid breaking existing content
      // that might reference this media

      await logAudit(
        db,
        user.id,
        "media_deleted",
        "media",
        input.mediaId,
        { filename: media.filename }
      );

      return { success: true };
    }),
});
