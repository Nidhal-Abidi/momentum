"use client";

import { DomainsList } from "@/components/domains";
import { useDomains } from "@/lib/hooks/domains/useDomains";
import { useCreateDomain } from "@/lib/hooks/domains/useCreateDomain";
import { useUpdateDomain } from "@/lib/hooks/domains/useUpdateDomain";
import { useDeleteDomain } from "@/lib/hooks/domains/useDeleteDomain";
import { DOMAIN_TEMPLATES } from "@/lib/constants/domainTemplates";
import type { DomainFormData, DomainTemplate } from "@/lib/types";

export default function DomainsPage() {
  const { data: domains, isLoading, error } = useDomains();
  const createDomain = useCreateDomain();
  const updateDomain = useUpdateDomain();
  const deleteDomain = useDeleteDomain();

  const handleCreate = (data: DomainFormData) => {
    createDomain.mutate(data);
  };

  const handleEdit = (id: string, data: DomainFormData) => {
    updateDomain.mutate({ id, data });
  };

  const handleDelete = (id: string) => {
    deleteDomain.mutate(id);
  };

  const handleUseTemplate = (template: DomainTemplate) => {
    createDomain.mutate(template);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600 dark:text-stone-400">
            Loading domains...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            Failed to load domains
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-4">
            {(error as Error).message || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DomainsList
        domains={domains || []}
        templates={DOMAIN_TEMPLATES}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onUseTemplate={handleUseTemplate}
      />
    </div>
  );
}
