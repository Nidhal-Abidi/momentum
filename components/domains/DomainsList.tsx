import { useState } from "react";
import type { Domain, DomainTemplate, DomainFormData } from "@/lib/types";
import { DomainCard } from "./DomainCard";
import { AddDomainCard } from "./AddDomainCard";
import { EmptyState } from "./EmptyState";
import { DomainModal } from "./DomainModal";
import { DeleteDialog } from "./DeleteDialog";
import { Button } from "@/components/ui/button";

const MAX_DOMAINS = 10;

export interface DomainsListProps {
  domains: Domain[];
  templates?: DomainTemplate[];
  onCreate?: (data: DomainFormData) => void;
  onEdit?: (id: string, data: DomainFormData) => void;
  onDelete?: (id: string) => void;
  onSelect?: (id: string) => void;
  onUseTemplate?: (template: DomainTemplate) => void;
}

export function DomainsList({
  domains,
  templates = [],
  onCreate,
  onEdit,
  onDelete,
  onSelect,
  onUseTemplate,
}: DomainsListProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [domainToDelete, setDomainToDelete] = useState<Domain | null>(null);

  const isMaxDomainsReached = domains.length >= MAX_DOMAINS;

  const handleCreateNew = () => {
    setSelectedDomain(null);
    setModalOpen(true);
  };

  const handleEditDomain = (domain: Domain) => {
    setSelectedDomain(domain);
    setModalOpen(true);
    onSelect?.(domain.id);
  };

  const handleDeleteClick = (domain: Domain) => {
    setDomainToDelete(domain);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (domainToDelete) {
      onDelete?.(domainToDelete.id);
      setDomainToDelete(null);
    }
  };

  const handleSave = (data: DomainFormData) => {
    if (selectedDomain) {
      onEdit?.(selectedDomain.id, data);
    } else {
      onCreate?.(data);
    }
  };

  const handleUseTemplate = (template: DomainTemplate) => {
    onUseTemplate?.(template);
  };

  // Empty state
  if (domains.length === 0) {
    return (
      <>
        <EmptyState
          templates={templates}
          onUseTemplate={handleUseTemplate}
          onCreateCustom={handleCreateNew}
        />
        <DomainModal
          domain={selectedDomain}
          open={modalOpen}
          onOpenChange={setModalOpen}
          onSave={handleSave}
        />
      </>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
            Life Domains
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mt-1">
            Manage the areas of life you want to track
          </p>
        </div>
        <Button
          onClick={handleCreateNew}
          disabled={isMaxDomainsReached}
          className="hidden sm:flex"
        >
          Add Domain
        </Button>
      </div>

      {/* Max domains message */}
      {isMaxDomainsReached && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-900 dark:text-amber-100">
            You have reached the maximum of {MAX_DOMAINS} domains. Delete a
            domain to add a new one.
          </p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains.map((domain) => (
          <DomainCard
            key={domain.id}
            domain={domain}
            onSelect={() => handleEditDomain(domain)}
            onDelete={() => handleDeleteClick(domain)}
          />
        ))}

        {!isMaxDomainsReached && <AddDomainCard onClick={handleCreateNew} />}
      </div>

      {/* Mobile Add Button */}
      <Button
        onClick={handleCreateNew}
        disabled={isMaxDomainsReached}
        className="sm:hidden fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg"
        size="icon"
      >
        +
      </Button>

      {/* Modals */}
      <DomainModal
        domain={selectedDomain}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSave}
      />
      <DeleteDialog
        domain={domainToDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
