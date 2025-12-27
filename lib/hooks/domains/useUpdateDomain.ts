"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryClient";
import { Domain } from "@/lib/types";

type UpdateDomainInput = {
  id: string;
  updates: Partial<Omit<Domain, "id" | "createdAt">>;
};

async function updateDomain({
  id,
  updates,
}: UpdateDomainInput): Promise<Domain> {
  const response = await fetch(`/api/domains/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
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
    onSuccess: () => {
      // Invalidate domains query to refetch the list
      queryClient.invalidateQueries({ queryKey: queryKeys.domains });
    },
  });
}
