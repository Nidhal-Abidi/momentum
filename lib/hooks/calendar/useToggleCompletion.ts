"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
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
      // Cancel any outgoing refetches for all completion queries
      await queryClient.cancelQueries({
        queryKey: ["completions"],
        exact: false,
      });

      // Get all completion queries and snapshot their values
      const queryCache = queryClient.getQueryCache();
      const completionQueries = queryCache.findAll({
        queryKey: ["completions"],
        exact: false,
      });

      const previousData = new Map();

      // Snapshot all completion queries
      completionQueries.forEach((query) => {
        previousData.set(query.queryKey, query.state.data);
      });

      // Optimistically update all completion queries
      completionQueries.forEach((query) => {
        const completions = query.state.data as Completion[] | undefined;

        if (completions && Array.isArray(completions)) {
          const existingIndex = completions.findIndex(
            (c) => c.domainId === domainId && c.date === date
          );

          if (existingIndex >= 0) {
            // Remove it (delete action)
            const newCompletions = [...completions];
            newCompletions.splice(existingIndex, 1);
            queryClient.setQueryData(query.queryKey, newCompletions);
          } else {
            // Add it (create action) - only if the date is within the query's date range
            // Check if the date falls within the query's date range (if specified)
            const queryKey = query.queryKey as [string, string?, string?];
            const startDate = queryKey[1];
            const endDate = queryKey[2];

            // If no date range is specified, or if the date is within range, add it
            const shouldAdd =
              !startDate || !endDate || (date >= startDate && date <= endDate);

            if (shouldAdd) {
              const newCompletion: Completion = {
                id: `temp-${Date.now()}`, // Temporary ID
                domainId,
                date,
              };
              queryClient.setQueryData(query.queryKey, [
                ...completions,
                newCompletion,
              ]);
            }
          }
        }
      });

      // Return context with snapshot for potential rollback
      return { previousData };
    },
    onSuccess: (result) => {
      if (result.action === "created") {
        toast.success("Day marked as complete! 🎉");
      } else {
        toast.success("Completion removed");
      }
    },
    // Rollback on error
    onError: (err, variables, context) => {
      if (context?.previousData) {
        // Restore all previous query data
        context.previousData.forEach((data, queryKey) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(
        err instanceof Error ? err.message : "Failed to update completion"
      );
    },
    // Refetch on success
    onSettled: () => {
      // Invalidate and refetch all completion queries
      queryClient.invalidateQueries({
        queryKey: ["completions"],
        exact: false,
      });
      // Also invalidate streaks since they depend on completions
      queryClient.invalidateQueries({ queryKey: queryKeys.streaks });
    },
  });
}
