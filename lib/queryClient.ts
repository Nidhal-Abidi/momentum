import { QueryClient } from "@tanstack/react-query";

// Query keys factory for consistent cache management
export const queryKeys = {
  domains: ["domains"] as const,
  completions: (startDate?: string, endDate?: string) => {
    const key: (string | undefined)[] = ["completions", startDate, endDate];
    return key;
  },
  goals: ["goals"] as const,
  streaks: ["streaks"] as const,
};

// Create QueryClient with custom configuration
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Default staleTime is 30 seconds
        // Individual queries can override this
        staleTime: 30000,
        // Retry failed requests once
        retry: 1,
        // Don't refetch on window focus to reduce unnecessary API calls
        refetchOnWindowFocus: false,
      },
      mutations: {
        // Don't retry mutations automatically
        retry: 0,
      },
    },
  });
}

// Browser query client (singleton)
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: reuse the same query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
