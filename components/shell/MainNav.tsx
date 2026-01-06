"use client";

import { Calendar, FolderKanban, Target, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface MainNavProps {
  items: NavItem[];
  onNavigate?: (href: string) => void;
  collapsed?: boolean;
}

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  Calendar: Calendar,
  Domains: FolderKanban,
  "Goals & Streaks": Target,
  Analytics: BarChart3,
};

export function MainNav({
  items,
  onNavigate,
  collapsed = false,
}: MainNavProps) {
  return (
    <ul role="list" className="flex flex-1 flex-col gap-y-1">
      {items.map((item) => {
        const Icon = icons[item.label];
        return (
          <li key={item.href}>
            <button
              onClick={() => onNavigate?.(item.href)}
              className={cn(
                "group flex w-full items-center rounded-lg py-2.5 text-sm font-semibold leading-6 transition-colors",
                collapsed ? "justify-center px-3" : "gap-x-3 px-3",
                item.isActive
                  ? "bg-indigo-500 text-white"
                  : "text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
              )}
              title={collapsed ? item.label : undefined}
            >
              {Icon && (
                <Icon
                  className={cn(
                    "size-5 shrink-0",
                    item.isActive
                      ? "text-white"
                      : "text-stone-400 dark:text-stone-500"
                  )}
                />
              )}
              {!collapsed && item.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
