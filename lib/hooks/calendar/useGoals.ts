"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryClient";
import { Goal } from "@/lib/types";

async function fetchGoals(): Promise<Goal[]> {
  const response = await fetch("/api/goals");

  if (!response.ok) {
    throw new Error("Failed to fetch goals");
  }

  return response.json();
}

export function useGoals() {
  return useQuery({
    queryKey: queryKeys.goals,
    queryFn: fetchGoals,
    staleTime: 5 * 60 * 1000, // 5 minutes - goals have moderate change frequency
  });
}
