import { Plus } from "lucide-react";

interface AddDomainCardProps {
  onClick?: () => void;
  disabled?: boolean;
}

export function AddDomainCard({ onClick, disabled }: AddDomainCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full h-full min-h-[200px]
        border-2 border-dashed rounded-xl
        transition-all duration-200
        ${
          disabled
            ? "border-stone-200 dark:border-stone-800 cursor-not-allowed opacity-50"
            : "border-stone-300 dark:border-stone-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 cursor-pointer"
        }
      `}
    >
      <div className="flex flex-col items-center justify-center space-y-3 p-6">
        <div
          className={`
          w-12 h-12 rounded-full flex items-center justify-center
          ${
            disabled
              ? "bg-stone-200 dark:bg-stone-800"
              : "bg-stone-200 dark:bg-stone-800 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900"
          }
          transition-colors duration-200
        `}
        >
          <Plus className="w-6 h-6 text-stone-600 dark:text-stone-400" />
        </div>
        <span className="text-sm font-medium text-stone-600 dark:text-stone-400">
          {disabled ? "Maximum domains reached" : "Add Domain"}
        </span>
      </div>
    </button>
  );
}
