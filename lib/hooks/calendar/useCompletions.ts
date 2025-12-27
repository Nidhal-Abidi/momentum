"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryClient";
import { Completion } from "@/lib/types";

type UseCompletionsOptions = {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  domainId?: string;
};

async function fetchCompletions(
  options: UseCompletionsOptions = {}
): Promise<Completion[]> {
  const params = new URLSearchParams();

  if (options.startDate) {
    params.append("startDate", options.startDate);
  }
  if (options.endDate) {
    params.append("endDate", options.endDate);
  }
  if (options.domainId) {
    params.append("domainId", options.domainId);
  }

  const url = `/api/completions${params.toString() ? `?${params}` : ""}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch completions");
  }

  return response.json();
}

export function useCompletions(options: UseCompletionsOptions = {}) {
  return useQuery({
    queryKey: queryKeys.completions(options.startDate, options.endDate),
    queryFn: () => fetchCompletions(options),
    staleTime: 30 * 1000, // 30 seconds - completions updated frequently by user
  });
}
