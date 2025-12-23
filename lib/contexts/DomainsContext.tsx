"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Domain } from "@/lib/types";

interface DomainsContextType {
  domains: Domain[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addDomain: (domain: Omit<Domain, "id" | "createdAt">) => Promise<Domain>;
  updateDomain: (id: string, updates: Partial<Domain>) => Promise<Domain>;
  deleteDomain: (id: string) => Promise<void>;
}

const DomainsContext = createContext<DomainsContextType | undefined>(undefined);

export function DomainsProvider({ children }: { children: ReactNode }) {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDomains = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/domains");
      
      if (!response.ok) {
        throw new Error("Failed to fetch domains");
      }

      const data = await response.json();
      setDomains(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const addDomain = async (
    domain: Omit<Domain, "id" | "createdAt">
  ): Promise<Domain> => {
    const response = await fetch("/api/domains", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(domain),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create domain");
    }

    const newDomain = await response.json();
    setDomains((prev) => [...prev, newDomain]);
    return newDomain;
  };

  const updateDomain = async (
    id: string,
    updates: Partial<Domain>
  ): Promise<Domain> => {
    const response = await fetch(`/api/domains/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update domain");
    }

    const updatedDomain = await response.json();
    setDomains((prev) =>
      prev.map((d) => (d.id === id ? updatedDomain : d))
    );
    return updatedDomain;
  };

  const deleteDomain = async (id: string): Promise<void> => {
    const response = await fetch(`/api/domains/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete domain");
    }

    setDomains((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <DomainsContext.Provider
      value={{
        domains,
        isLoading,
        error,
        refetch: fetchDomains,
        addDomain,
        updateDomain,
        deleteDomain,
      }}
    >
      {children}
    </DomainsContext.Provider>
  );
}

export function useDomains() {
  const context = useContext(DomainsContext);
  if (context === undefined) {
    throw new Error("useDomains must be used within a DomainsProvider");
  }
  return context;
}

