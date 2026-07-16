import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

// Don't retry client (4xx) errors — only transient/server ones.
function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    if (status && status >= 400 && status < 500) return false; // 4xx are terminal
  }
  return failureCount < 2;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      refetchOnWindowFocus: false,
      staleTime: 10_000,
    },
    mutations: {
      retry: false,
    },
  },
});

// Centralized query keys so invalidation stays consistent.
export const qk = {
  fullReport: (id: string) => ["fullReport", id] as const,
};
