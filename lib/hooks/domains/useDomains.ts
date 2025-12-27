"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryClient";
import { Domain } from "@/lib/types";

async function fetchDomains(): Promise<Domain[]> {
  const response = await fetch("/api/domains");

  if (!response.ok) {
    throw new Error("Failed to fetch domains");
  }

  return response.json();
}

export function useDomains() {
  return useQuery({
    queryKey: queryKeys.domains,
    queryFn: fetchDomains,
    staleTime: 10 * 60 * 1000, // 10 minutes - domains change infrequently
  });
}
