"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryClient";
import { Domain, DomainFormData } from "@/lib/types";

async function createDomain(data: DomainFormData): Promise<Domain> {
  const response = await fetch("/api/domains", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, icon: data.emoji }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create domain");
  }

  return response.json();
}

export function useCreateDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDomain,
    onMutate: async (newDomain) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.domains });

      // Snapshot the previous value
      const previousDomains = queryClient.getQueryData<Domain[]>(
        queryKeys.domains
      );

      // Optimistically update to the new value
      if (previousDomains) {
        const optimisticDomain: Domain = {
          id: `temp-${Date.now()}`,
          name: newDomain.name,
          emoji: newDomain.emoji,
          color: newDomain.color,
          createdAt: new Date().toISOString(),
          totalCompletions: 0,
          currentStreak: 0,
        };
        queryClient.setQueryData<Domain[]>(queryKeys.domains, [
          ...previousDomains,
          optimisticDomain,
        ]);
      }

      return { previousDomains };
    },
    onError: (err, newDomain, context) => {
      // Roll back to the previous value on error
      if (context?.previousDomains) {
        queryClient.setQueryData(queryKeys.domains, context.previousDomains);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.domains });
    },
  });
}
