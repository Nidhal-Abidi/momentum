"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryClient";

interface SetGoalParams {
  domainId: string;
  target: number;
  motivationNote: string;
}

async function setGoal({ domainId, target, motivationNote }: SetGoalParams) {
  const response = await fetch("/api/goals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      domainId,
      targetDays: target,
      totalDays: 7,
      motivationNote,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to set goal");
  }

  return response.json();
}

export function useSetGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setGoal,
    onSuccess: () => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: queryKeys.domains });
      queryClient.invalidateQueries({ queryKey: queryKeys.goals });
      queryClient.invalidateQueries({ queryKey: queryKeys.streaks });
    },
  });
}

