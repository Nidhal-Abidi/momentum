"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryClient";
import { Completion } from "@/lib/types";

type ToggleCompletionInput = {
  domainId: string;
  date: string; // YYYY-MM-DD
};

type CompletionResponse = {
  id: string;
  domainId: string;
  date: string;
};

/**
 * Toggle a completion: if it exists, delete it; if it doesn't exist, create it
 */
async function toggleCompletion({
  domainId,
  date,
}: ToggleCompletionInput): Promise<{
  action: "created" | "deleted";
  completion: CompletionResponse | null;
}> {
  // First, check if completion exists by trying to find it
  // We'll use the create endpoint and handle the "already exists" error
  // Or we can get all completions and check client-side

  // For better UX, let's try to create first
  const createResponse = await fetch("/api/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domainId, date }),
  });

  if (createResponse.ok) {
    const completion = await createResponse.json();
    return { action: "created", completion };
  }

  // If creation failed with 400, it likely already exists, so delete it
  if (createResponse.status === 400) {
    const errorData = await createResponse.json();
    if (errorData.error?.includes("already exists")) {
      // Find the completion to delete
      const completionsResponse = await fetch(
        `/api/completions?domainId=${domainId}&startDate=${date}&endDate=${date}`
      );

      if (!completionsResponse.ok) {
        throw new Error("Failed to fetch completions");
      }

      const completions: Completion[] = await completionsResponse.json();
      const existingCompletion = completions.find(
        (c) => c.domainId === domainId && c.date === date
      );

      if (existingCompletion) {
        const deleteResponse = await fetch(
          `/api/completions/${existingCompletion.id}`,
          { method: "DELETE" }
        );

        if (!deleteResponse.ok) {
          throw new Error("Failed to delete completion");
        }

        return { action: "deleted", completion: null };
      }
    }
  }

  // If we got here, something unexpected happened
  const error = await createResponse.json();
  throw new Error(error.error || "Failed to toggle completion");
}

export function useToggleCompletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleCompletion,
    // Optimistic update
    onMutate: async ({ domainId, date }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.completions() });

      // Snapshot the previous value
      const previousCompletions = queryClient.getQueryData<Completion[]>(
        queryKeys.completions()
      );

      // Optimistically update the cache
      if (previousCompletions) {
        const existingIndex = previousCompletions.findIndex(
          (c) => c.domainId === domainId && c.date === date
        );

        if (existingIndex >= 0) {
          // Remove it (delete action)
          const newCompletions = [...previousCompletions];
          newCompletions.splice(existingIndex, 1);
          queryClient.setQueryData(queryKeys.completions(), newCompletions);
        } else {
          // Add it (create action)
          const newCompletion: Completion = {
            id: `temp-${Date.now()}`, // Temporary ID
            domainId,
            date,
          };
          queryClient.setQueryData(queryKeys.completions(), [
            ...previousCompletions,
            newCompletion,
          ]);
        }
      }

      // Return context with snapshot for potential rollback
      return { previousCompletions };
    },
    // Rollback on error
    onError: (err, variables, context) => {
      if (context?.previousCompletions) {
        queryClient.setQueryData(
          queryKeys.completions(),
          context.previousCompletions
        );
      }
    },
    // Refetch on success
    onSettled: () => {
      // Invalidate and refetch completions
      queryClient.invalidateQueries({ queryKey: queryKeys.completions() });
      // Also invalidate streaks since they depend on completions
      queryClient.invalidateQueries({ queryKey: queryKeys.streaks });
    },
  });
}
