import type { DomainTemplate } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  templates: DomainTemplate[];
  onUseTemplate?: (template: DomainTemplate) => void;
  onCreateCustom?: () => void;
}

const colorClasses: Record<string, string> = {
  lime: "bg-lime-50 dark:bg-lime-950/30 border-lime-200 dark:border-lime-800",
  blue: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
  purple:
    "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800",
  emerald:
    "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
  orange:
    "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800",
  red: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
  pink: "bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800",
  cyan: "bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800",
  amber:
    "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
  indigo:
    "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800",
};

export function EmptyState({
  templates,
  onUseTemplate,
  onCreateCustom,
}: EmptyStateProps) {
  return (
    <div className="max-w-4xl mx-auto text-center py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
          Get started with your first domain
        </h2>
        <p className="text-stone-600 dark:text-stone-400">
          Choose from templates below or create your own custom domain
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {templates.map((template) => (
          <button
            key={template.name}
            onClick={() => onUseTemplate?.(template)}
            className={`
              ${colorClasses[template.color]}
              border-2 rounded-xl p-6
              transition-all duration-200
              hover:shadow-lg hover:-translate-y-0.5
            `}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="text-5xl">{template.emoji}</div>
              <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                {template.name}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 justify-center">
        <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
        <span className="text-sm text-stone-500 dark:text-stone-500">or</span>
        <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
      </div>

      <Button
        onClick={onCreateCustom}
        variant="outline"
        size="lg"
        className="mt-6"
      >
        Create Custom Domain
      </Button>
    </div>
  );
}
