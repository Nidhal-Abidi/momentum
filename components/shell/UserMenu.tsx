"use client";

import { useState, useEffect } from "react";
import { Settings, HelpCircle, LogOut, Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/shadcn/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { User } from "@prisma/client";

interface UserMenuProps {
  user?: User;
  onSettings?: () => void;
  onHelp?: () => void;
  onLogout?: () => void;
}

type Theme = "light" | "dark" | "system";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function UserMenu({
  user,
  onSettings,
  onHelp,
  onLogout,
}: UserMenuProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "system";
    }
    return "system";
  });

  useEffect(() => {
    const applyTheme = (currentTheme: Theme) => {
      const root = document.documentElement;
      if (currentTheme === "system") {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        root.classList.toggle("dark", prefersDark);
      } else {
        root.classList.toggle("dark", currentTheme === "dark");
      }
    };

    applyTheme(theme);
    localStorage.setItem("theme", theme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (theme === "system") applyTheme("system");
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => {
      if (current === "light") return "dark";
      if (current === "dark") return "system";
      return "light";
    });
  };

  const isDarkMode =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const userName = user?.name ?? "User";
  const initials = getInitials(userName);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center gap-x-3 rounded-lg px-3 py-3",
            "text-sm font-semibold leading-6",
            "text-stone-900 hover:bg-stone-100",
            "dark:text-white dark:hover:bg-stone-800",
            "transition-colors focus:outline-none"
          )}
        >
          <Avatar className="size-9">
            {user?.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={userName}
                className="size-full"
              />
            ) : (
              <AvatarFallback className="bg-indigo-500 text-sm font-semibold text-white">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="truncate">{userName}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSettings}>
          <Settings className="mr-3 size-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onHelp}>
          <HelpCircle className="mr-3 size-4" />
          Help
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleTheme}>
          {isDarkMode ? (
            <>
              <Sun className="mr-3 size-4" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="mr-3 size-4" />
              Dark Mode
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} variant="destructive">
          <LogOut className="mr-3 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
