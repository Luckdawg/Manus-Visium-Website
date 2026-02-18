import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    console.log("[OAuth] Callback received with query params:", req.query);
    console.log("[OAuth] Full callback URL:", req.url);
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    const nextParam = getQueryParam(req, "next");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      // Decode state to extract redirect path
      // Try multiple methods to get the redirect path:
      // 1. Check if 'next' is directly in query params (OAuth portal might preserve it)
      // 2. Decode state parameter and extract 'next' from the encoded URL
      let redirectPath = "/";
      
      console.log("[OAuth] nextParam from query:", nextParam);
      
      // Method 1: Check direct query parameter first
      if (nextParam) {
        redirectPath = nextParam;
        console.log("[OAuth] Using redirect path from query parameter:", redirectPath);
      } else {
        // Method 2: Extract from state parameter
        try {
          console.log("[OAuth] Received state parameter:", state);
          const decodedState = Buffer.from(state, 'base64').toString('utf-8');
          console.log("[OAuth] Decoded state:", decodedState);
          const redirectUrl = new URL(decodedState);
          console.log("[OAuth] Parsed redirect URL:", redirectUrl.toString());
          redirectPath = redirectUrl.searchParams.get('next') || "/";
          console.log("[OAuth] Extracted redirect path from state:", redirectPath);
        } catch (error) {
          console.error("[OAuth] Failed to decode state for redirect path:", error);
          // Fall back to homepage if state decoding fails
        }
      }
      
      console.log("[OAuth] Final redirect to:", redirectPath);
      res.redirect(302, redirectPath);
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}
