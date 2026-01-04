"use client";

import { useState } from "react";
import { type DomainGoal } from "@/lib/hooks/goals-and-streaks";
import { useSetGoal } from "@/lib/hooks/goals-and-streaks";
import { DomainGoalCard } from "./DomainGoalCard";
import { GoalModal } from "./GoalModal";

interface GoalsStreaksViewProps {
  domainGoals: DomainGoal[];
  onRemoveGoal?: (domainId: string) => void;
  onViewHistory?: (domainId: string) => void;
  onEditDomain?: (domainId: string) => void;
}

export function GoalsStreaksView({
  domainGoals,
  onRemoveGoal,
  onViewHistory,
  onEditDomain,
}: GoalsStreaksViewProps) {
  const [selectedDomain, setSelectedDomain] = useState<DomainGoal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const setGoalMutation = useSetGoal();

  const handleSetGoal = (domainId: string) => {
    const domain = domainGoals.find((d) => d.id === domainId);
    if (domain) {
      setSelectedDomain(domain);
      setIsModalOpen(true);
    }
  };

  const handleSaveGoal = async (target: number, motivationNote: string) => {
    if (!selectedDomain) return;

    try {
      await setGoalMutation.mutateAsync({
        domainId: selectedDomain.id,
        target,
        motivationNote,
      });
      setIsModalOpen(false);
      setSelectedDomain(null);
    } catch (error) {
      console.error("Failed to save goal:", error);
      // Error handling could be improved with toast notifications
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDomain(null);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-white mb-2">
          Goals & Streaks
        </h1>
        <p className="text-stone-600 dark:text-stone-400">
          Set weekly targets and track your consistency. Progress, not
          perfection.
        </p>
      </div>

      {/* Domain Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {domainGoals.map((domain) => (
          <DomainGoalCard
            key={domain.id}
            domain={domain}
            onSetGoal={() => handleSetGoal(domain.id)}
            onRemoveGoal={() => onRemoveGoal?.(domain.id)}
            onViewHistory={() => onViewHistory?.(domain.id)}
            onEditDomain={() => onEditDomain?.(domain.id)}
          />
        ))}
      </div>

      {/* Goal Modal */}
      {selectedDomain && (
        <GoalModal
          domain={selectedDomain}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveGoal}
          isEditing={selectedDomain.goal !== null}
        />
      )}
    </div>
  );
}

