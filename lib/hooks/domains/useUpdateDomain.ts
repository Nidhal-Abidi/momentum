"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryKeys } from "@/lib/queryClient";
import { Domain, DomainFormData } from "@/lib/types";

interface UpdateDomainParams {
  id: string;
  data: DomainFormData;
}

async function updateDomain({ id, data }: UpdateDomainParams): Promise<Domain> {
  const response = await fetch(`/api/domains/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, icon: data.emoji }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update domain");
  }

  return response.json();
}

export function useUpdateDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDomain,
    onMutate: async ({ id, data }) => {
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
          previousDomains.map((domain) =>
            domain.id === id
              ? {
                  ...domain,
                  name: data.name,
                  emoji: data.emoji,
                  color: data.color,
                }
              : domain
          )
        );
      }

      return { previousDomains };
    },
    onSuccess: (domain) => {
      toast.success(`${domain.emoji} ${domain.name} updated successfully!`);
    },
    onError: (err, variables, context) => {
      // Roll back to the previous value on error
      if (context?.previousDomains) {
        queryClient.setQueryData(queryKeys.domains, context.previousDomains);
      }
      toast.error(
        err instanceof Error ? err.message : "Failed to update domain"
      );
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.domains });
    },
  });
}
