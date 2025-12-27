"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryClient";
import { Streak } from "@/lib/types";

async function fetchStreaks(): Promise<Streak[]> {
  const response = await fetch("/api/streaks");

  if (!response.ok) {
    throw new Error("Failed to fetch streaks");
  }

  return response.json();
}

export function useStreaks() {
  return useQuery({
    queryKey: queryKeys.streaks,
    queryFn: fetchStreaks,
    staleTime: 30 * 1000, // 30 seconds - streaks updated when completions change
  });
}
