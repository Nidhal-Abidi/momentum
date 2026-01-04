import { useState } from "react";
import { Target, AlertCircle } from "lucide-react";
import { getColorClasses } from "@/lib/colorUtils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DomainIcon } from "./DomainIcon";
import { type DomainGoal } from "@/lib/hooks/goals-and-streaks";

interface GoalModalProps {
  domain: DomainGoal;
  isOpen: boolean;
  onClose: () => void;
  onSave: (target: number, motivationNote: string) => void;
  isEditing: boolean;
}

export function GoalModal({
  domain,
  isOpen,
  onClose,
  onSave,
  isEditing,
}: GoalModalProps) {
  const [target, setTarget] = useState(domain.goal?.target ?? 5);
  const [motivationNote, setMotivationNote] = useState(
    domain.goal?.motivationNote ?? ""
  );
  const [showWarning, setShowWarning] = useState(false);
  const colors = getColorClasses(domain.color);

  const handleSave = () => {
    if (isEditing) {
      // Show warning if editing mid-week
      if (!showWarning) {
        setShowWarning(true);
        return;
      }
    }
    onSave(target, motivationNote);
    setShowWarning(false);
  };

  const handleTargetChange = (value: number) => {
    setTarget(Math.max(1, Math.min(7, value)));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {/* Header with Domain Color */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${colors.bg} rounded-t-lg`} />

        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <DomainIcon emoji={domain.emoji} color={domain.color} />
            <div>
              <DialogTitle className="text-xl">
                {isEditing ? "Edit Goal" : "Set Weekly Goal"}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {domain.name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Mid-Week Warning */}
          {showWarning && (
            <div className="flex gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <AlertCircle className="size-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">
                  Changing your goal will reset this week's progress
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Your completion count will restart from 0. Continue?
                </p>
              </div>
            </div>
          )}

          {/* Target Selection */}
          <div className="space-y-3">
            <Label htmlFor="target" className="text-sm font-medium">
              How many days this week?
            </Label>

            {/* Visual Slider */}
            <div className="space-y-2">
              <input
                id="target"
                type="range"
                min="1"
                max="7"
                value={target}
                onChange={(e) => handleTargetChange(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-stone-200 dark:bg-stone-700"
                style={{
                  background: `linear-gradient(to right, ${
                    domain.color === "indigo" ? "#6366f1" :
                    domain.color === "emerald" ? "#10b981" :
                    domain.color === "violet" ? "#8b5cf6" :
                    domain.color === "sky" ? "#0ea5e9" :
                    domain.color === "amber" ? "#f59e0b" :
                    domain.color === "rose" ? "#f43f5e" :
                    "#6366f1"
                  } 0%, ${
                    domain.color === "indigo" ? "#6366f1" :
                    domain.color === "emerald" ? "#10b981" :
                    domain.color === "violet" ? "#8b5cf6" :
                    domain.color === "sky" ? "#0ea5e9" :
                    domain.color === "amber" ? "#f59e0b" :
                    domain.color === "rose" ? "#f43f5e" :
                    "#6366f1"
                  } ${(target / 7) * 100}%, #e5e5e5 ${(target / 7) * 100}%, #e5e5e5 100%)`
                }}
              />

              {/* Day Indicators */}
              <div className="flex justify-between px-0.5">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleTargetChange(day)}
                    className={`
                      flex items-center justify-center size-8 rounded-full text-sm font-semibold transition-all
                      ${
                        day <= target
                          ? `${colors.bg} text-white scale-110`
                          : "bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-600 hover:bg-stone-200 dark:hover:bg-stone-700"
                      }
                    `}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Number Input Fallback */}
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min="1"
                max="7"
                value={target}
                onChange={(e) => handleTargetChange(Number(e.target.value))}
                className="w-20 text-center text-lg font-bold"
              />
              <span className="text-sm text-stone-600 dark:text-stone-400">
                days per week
              </span>
            </div>

            {/* Encouraging Message */}
            {target >= 6 && (
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-2">
                <Target className="size-4" />
                <span>That's a great target! 💪</span>
              </p>
            )}
          </div>

          {/* Motivation Note */}
          <div className="space-y-2">
            <Label htmlFor="motivation" className="text-sm font-medium">
              Why this goal? <span className="text-stone-400">(optional)</span>
            </Label>
            <Input
              id="motivation"
              type="text"
              placeholder="E.g., To build a consistent habit..."
              value={motivationNote}
              onChange={(e) => setMotivationNote(e.target.value)}
              className="resize-none"
            />
            <p className="text-xs text-stone-500 dark:text-stone-500">
              A motivation note can help you stay committed
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className={`${colors.bg} ${colors.hover} text-white`}
          >
            {showWarning ? "Yes, Continue" : "Save Goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

