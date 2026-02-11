import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { stockRouter } from "./stockRouter";
import { leadsRouter } from "./leadsRouter";
import { adminRouter } from "./adminRouter";
import { twoFactorRouter } from "./twoFactorRouter";
import { cmsRouter } from "./cmsRouter";
import { authRouter } from "./authRouter";
import { newsletterRouter } from "./newsletterRouter";
import { secFilingsRouter } from "./secFilingsRouter";
import { campaignsRouter } from "./campaignsRouter";
import { blogRouter } from "./blogRouter";
import { partnerRouter } from "./routers/partner";
import { partnerOnboardingRouter } from "./routers/partner-onboarding";
import { trainingRouter } from "./routers/training";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    ...authRouter._def.procedures,
  }),

  // Stock data API for Investor Relations page
  stock: stockRouter,

  // Leads capture API for whitepaper downloads
  leads: leadsRouter,

  // Admin CMS API for user management and content editing
  admin: adminRouter,

  // Two-factor authentication API
  twoFactor: twoFactorRouter,

  // CMS content and media management API
  cms: cmsRouter,

  // Newsletter subscription API
  newsletter: newsletterRouter,

  // SEC filings API for investor relations
  secFilings: secFilingsRouter,

  // Email campaigns API for admin dashboard
  campaigns: campaignsRouter,

  // Blog lead capture API for blog PDF downloads
  blog: blogRouter,

  // Partner Portal API
  partner: partnerRouter,

  // Partner Onboarding & Recruitment API
  partnerOnboarding: partnerOnboardingRouter,

  // Training & Enablement API (LMS, courses, certifications)
  training: trainingRouter,

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
