import { MoreVertical } from "lucide-react";
import type { Domain } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DomainCardProps {
  domain: Domain;
  onSelect?: () => void;
  onDelete?: () => void;
}

const colorClasses: Record<
  string,
  { bg: string; border: string; hover: string }
> = {
  lime: {
    bg: "bg-lime-50 dark:bg-lime-950/30",
    border: "border-lime-200 dark:border-lime-800",
    hover: "hover:border-lime-300 dark:hover:border-lime-700",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    hover: "hover:border-blue-300 dark:hover:border-blue-700",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-200 dark:border-purple-800",
    hover: "hover:border-purple-300 dark:hover:border-purple-700",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    hover: "hover:border-emerald-300 dark:hover:border-emerald-700",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-200 dark:border-orange-800",
    hover: "hover:border-orange-300 dark:hover:border-orange-700",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
    hover: "hover:border-red-300 dark:hover:border-red-700",
  },
  pink: {
    bg: "bg-pink-50 dark:bg-pink-950/30",
    border: "border-pink-200 dark:border-pink-800",
    hover: "hover:border-pink-300 dark:hover:border-pink-700",
  },
  cyan: {
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
    border: "border-cyan-200 dark:border-cyan-800",
    hover: "hover:border-cyan-300 dark:hover:border-cyan-700",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    hover: "hover:border-amber-300 dark:hover:border-amber-700",
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    border: "border-indigo-200 dark:border-indigo-800",
    hover: "hover:border-indigo-300 dark:hover:border-indigo-700",
  },
};

export function DomainCard({ domain, onSelect, onDelete }: DomainCardProps) {
  const colors = colorClasses[domain.color] || colorClasses.indigo;

  return (
    <div
      className={`
        relative group
        ${colors.bg} ${colors.border} ${colors.hover}
        border-2 rounded-xl p-6
        transition-all duration-200
        hover:shadow-lg hover:-translate-y-0.5
        cursor-pointer
      `}
      onClick={onSelect}
    >
      {/* Delete Menu */}
      <div className="absolute top-3 right-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
                p-1.5 rounded-lg
                hover:bg-stone-200 dark:hover:bg-stone-700
              "
              aria-label="Domain options"
            >
              <MoreVertical className="w-4 h-4 text-stone-600 dark:text-stone-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="text-red-600 dark:text-red-400"
            >
              Delete Domain
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="text-6xl">{domain.emoji}</div>
        <div>
          <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            {domain.name}
          </h3>
          <div className="flex items-center justify-center gap-4 mt-2 text-sm text-stone-600 dark:text-stone-400">
            <span>{domain.totalCompletions} days</span>
            <span className="w-1 h-1 rounded-full bg-stone-400" />
            <span>{domain.currentStreak} week streak</span>
          </div>
        </div>
      </div>
    </div>
  );
}
