import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Domain } from "@/lib/types";

interface DayCellProps {
  day: number;
  color: Domain["color"];
  isCompleted: boolean;
  isToday: boolean;
  isFuture: boolean;
  onClick: () => void;
}

export function DayCell({
  day,
  color,
  isCompleted,
  isToday,
  isFuture,
  onClick,
}: DayCellProps) {
  return (
    <button
      onClick={onClick}
      disabled={isFuture}
      title={isFuture ? "Future date" : `Day ${day}`}
      className={cn(
        "relative flex aspect-square w-full items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200",
        // Future date styling
        isFuture &&
          "cursor-not-allowed border border-stone-200 bg-stone-50 text-stone-300 dark:border-stone-800 dark:bg-stone-900/50 dark:text-stone-700",
        // Completed date styling - with color backgrounds
        !isFuture && isCompleted && "border-2 shadow-sm",
        !isFuture &&
          isCompleted &&
          color === "lime" &&
          "bg-lime-50 border-lime-300 dark:bg-lime-950/30 dark:border-lime-700",
        !isFuture &&
          isCompleted &&
          color === "blue" &&
          "bg-blue-50 border-blue-300 dark:bg-blue-950/30 dark:border-blue-700",
        !isFuture &&
          isCompleted &&
          color === "purple" &&
          "bg-purple-50 border-purple-300 dark:bg-purple-950/30 dark:border-purple-700",
        !isFuture &&
          isCompleted &&
          color === "emerald" &&
          "bg-emerald-50 border-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-700",
        !isFuture &&
          isCompleted &&
          color === "orange" &&
          "bg-orange-50 border-orange-300 dark:bg-orange-950/30 dark:border-orange-700",
        !isFuture &&
          isCompleted &&
          color === "red" &&
          "bg-red-50 border-red-300 dark:bg-red-950/30 dark:border-red-700",
        !isFuture &&
          isCompleted &&
          color === "pink" &&
          "bg-pink-50 border-pink-300 dark:bg-pink-950/30 dark:border-pink-700",
        !isFuture &&
          isCompleted &&
          color === "cyan" &&
          "bg-cyan-50 border-cyan-300 dark:bg-cyan-950/30 dark:border-cyan-700",
        !isFuture &&
          isCompleted &&
          color === "amber" &&
          "bg-amber-50 border-amber-300 dark:bg-amber-950/30 dark:border-amber-700",
        !isFuture &&
          isCompleted &&
          color === "indigo" &&
          "bg-indigo-50 border-indigo-300 dark:bg-indigo-950/30 dark:border-indigo-700",
        // Uncompleted date styling
        !isFuture &&
          !isCompleted &&
          "border border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:shadow-sm dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-stone-600",
        // Hover effects
        !isFuture && !isCompleted && "hover:scale-110 active:scale-95",
        !isFuture && isCompleted && "hover:scale-105",
        // Today ring
        isToday &&
          !isCompleted &&
          "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-stone-950"
      )}
    >
      {isCompleted ? (
        <div className="flex items-center justify-center">
          <Check
            className={cn(
              "size-5 stroke-3",
              color === "lime" && "text-lime-600 dark:text-lime-400",
              color === "blue" && "text-blue-600 dark:text-blue-400",
              color === "purple" && "text-purple-600 dark:text-purple-400",
              color === "emerald" && "text-emerald-600 dark:text-emerald-400",
              color === "orange" && "text-orange-600 dark:text-orange-400",
              color === "red" && "text-red-600 dark:text-red-400",
              color === "pink" && "text-pink-600 dark:text-pink-400",
              color === "cyan" && "text-cyan-600 dark:text-cyan-400",
              color === "amber" && "text-amber-600 dark:text-amber-400",
              color === "indigo" && "text-indigo-600 dark:text-indigo-400"
            )}
          />
        </div>
      ) : (
        <span
          className={
            isToday && !isCompleted
              ? "text-indigo-600 dark:text-indigo-400"
              : ""
          }
        >
          {day}
        </span>
      )}
    </button>
  );
}
