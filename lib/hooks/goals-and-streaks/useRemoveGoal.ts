"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryClient";

interface RemoveGoalParams {
  goalId: string;
}

async function removeGoal({ goalId }: RemoveGoalParams) {
  const response = await fetch(`/api/goals/${goalId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to remove goal");
  }

  return response.json();
}

export function useRemoveGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeGoal,
    onSuccess: () => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: queryKeys.domains });
      queryClient.invalidateQueries({ queryKey: queryKeys.goals });
      queryClient.invalidateQueries({ queryKey: queryKeys.streaks });
    },
  });
}

