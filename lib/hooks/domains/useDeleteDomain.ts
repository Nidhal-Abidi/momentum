"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryClient";
import { Domain } from "@/lib/types";

async function deleteDomain(id: string): Promise<void> {
  const response = await fetch(`/api/domains/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete domain");
  }
}

export function useDeleteDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDomain,
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.domains });

      // Snapshot the previous value
      const previousDomains = queryClient.getQueryData<Domain[]>(
        queryKeys.domains
      );

      // Optimistically update to the new value
      if (previousDomains) {
        queryClient.setQueryData<Domain[]>(
          queryKeys.domains,
          previousDomains.filter((domain) => domain.id !== id)
        );
      }

      return { previousDomains };
    },
    onError: (err, id, context) => {
      // Roll back to the previous value on error
      if (context?.previousDomains) {
        queryClient.setQueryData(queryKeys.domains, context.previousDomains);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.domains });
      // Also invalidate related data
      queryClient.invalidateQueries({ queryKey: queryKeys.completions() });
      queryClient.invalidateQueries({ queryKey: queryKeys.goals });
      queryClient.invalidateQueries({ queryKey: queryKeys.streaks });
    },
  });
}
