"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryClient";
import { Domain } from "@/lib/types";

type CreateDomainInput = Omit<Domain, "id" | "createdAt">;

async function createDomain(domain: CreateDomainInput): Promise<Domain> {
  const response = await fetch("/api/domains", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(domain),
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
    onSuccess: () => {
      // Invalidate domains query to refetch the list
      queryClient.invalidateQueries({ queryKey: queryKeys.domains });
    },
  });
}
