export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "App";

export const APP_LOGO =
  import.meta.env.VITE_APP_LOGO ||
  "/visium_analytics_logo.png";

// Generate login URL at runtime so redirect URI reflects the current origin.
// Optional redirectPath parameter specifies where to redirect after successful login
export const getLoginUrl = (redirectPath?: string) => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  // Encode both callback URI and intended redirect path in state
  const stateData = JSON.stringify({
    redirectUri,
    redirectPath: redirectPath || '/'
  });
  const state = btoa(stateData);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};