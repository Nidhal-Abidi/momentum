"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Sheet, SheetContent } from "@/components/shadcn/sheet";
import { MainNav } from "./MainNav";
import { UserMenu } from "./UserMenu";
import type { NavItem } from "./MainNav";
import { User } from "@prisma/client";
import { cn } from "@/lib/utils";

export interface AppShellProps {
  children: React.ReactNode;
  navigationItems: NavItem[];
  user?: User;
  onNavigate?: (href: string) => void;
  onLogout?: () => void;
  onSettings?: () => void;
  onHelp?: () => void;
}

export function AppShell({
  children,
  navigationItems,
  user,
  onNavigate,
  onLogout,
  onSettings,
  onHelp,
}: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNavigate = (href: string) => {
    onNavigate?.(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <aside
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col lg:transition-all",
          isCollapsed ? "lg:w-20" : "lg:w-72"
        )}
      >
        <div
          className={cn(
            "flex grow flex-col gap-y-5 overflow-y-auto border-r border-stone-200 bg-white pb-4 dark:border-stone-800 dark:bg-stone-950",
            isCollapsed ? "px-3" : "px-6"
          )}
        >
          <div
            className={cn(
              "flex h-16 shrink-0 items-center",
              isCollapsed ? "justify-center" : "justify-between gap-3"
            )}
          >
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                "flex items-center gap-3 rounded-lg transition-colors",
                "hover:bg-stone-100 dark:hover:bg-stone-800",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                isCollapsed ? "p-2" : "px-2 py-1"
              )}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500">
                <span className="text-xl font-bold text-white">M</span>
              </div>
              {!isCollapsed && (
                <span className="text-2xl font-bold text-stone-900 dark:text-white">
                  Momentum
                </span>
              )}
            </button>
          </div>

          <nav className="flex flex-1 flex-col">
            <MainNav
              items={navigationItems}
              onNavigate={handleNavigate}
              collapsed={isCollapsed}
            />
          </nav>

          <UserMenu
            user={user}
            onSettings={onSettings}
            onHelp={onHelp}
            onLogout={onLogout}
            collapsed={isCollapsed}
          />
        </div>
      </aside>

      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm lg:hidden dark:bg-stone-950">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-stone-700 dark:text-stone-300"
        >
          <Menu className="size-6" />
          <span className="sr-only">Open sidebar</span>
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500">
            <span className="text-lg font-bold text-white">M</span>
          </div>
          <span className="text-xl font-bold text-stone-900 dark:text-white">
            Momentum
          </span>
        </div>
      </div>

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex h-full flex-col">
            <div className="flex h-16 shrink-0 items-center gap-3 px-6">
              <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500">
                <span className="text-xl font-bold text-white">M</span>
              </div>
              <span className="text-2xl font-bold text-stone-900 dark:text-white">
                Momentum
              </span>
            </div>

            <nav className="flex flex-1 flex-col px-6 py-4">
              <MainNav items={navigationItems} onNavigate={handleNavigate} />
            </nav>

            <div className="border-t border-stone-200 px-6 py-4 dark:border-stone-800">
              <UserMenu
                user={user}
                onSettings={onSettings}
                onHelp={onHelp}
                onLogout={onLogout}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <main
        className={cn("transition-all", isCollapsed ? "lg:pl-20" : "lg:pl-72")}
      >
        <div className="px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
