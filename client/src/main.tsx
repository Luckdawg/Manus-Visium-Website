import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";

// Suppress console errors for blocked external requests (analytics, tracking, etc.)
const originalError = console.error;
const originalWarn = console.warn;

const isBlockedExternalError = (args: any[]): boolean => {
  const message = String(args[0] || '');
  const blockedPatterns = [
    'ERR_BLOCKED_BY_CLIENT',
    'CORS policy',
    'manus-analytics',
    'Amplitude',
    'amplitude.com',
    'youtube.com',
    'Failed to fetch',
    'net::ERR_FAILED',
    'Access to fetch',
    'Failed to load resource',
  ];
  return blockedPatterns.some(pattern => message.includes(pattern));
};

console.error = function(...args: any[]) {
  if (!isBlockedExternalError(args)) {
    originalError.apply(console, args);
  }
};

console.warn = function(...args: any[]) {
  if (!isBlockedExternalError(args)) {
    originalWarn.apply(console, args);
  }
};

// Suppress unhandled promise rejections from blocked requests
window.addEventListener('unhandledrejection', (event) => {
  const reason = String(event.reason || '');
  if (isBlockedExternalError([reason])) {
    event.preventDefault();
  }
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        }).catch((error) => {
          // Only throw if it's not a blocked external request
          if (!isBlockedExternalError([error.message])) {
            throw error;
          }
          // Return a dummy response for blocked requests to prevent console spam
          return new Response(JSON.stringify({}), { status: 200 });
        });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
