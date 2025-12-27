"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryClient";

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
    onSuccess: () => {
      // Invalidate domains query to refetch the list
      queryClient.invalidateQueries({ queryKey: queryKeys.domains });
      // Also invalidate related data
      queryClient.invalidateQueries({ queryKey: queryKeys.completions() });
      queryClient.invalidateQueries({ queryKey: queryKeys.goals });
      queryClient.invalidateQueries({ queryKey: queryKeys.streaks });
    },
  });
}
