"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { AppShell } from "@/components/shell";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const navigationItems = [
    {
      label: "Calendar",
      href: "/calendar",
      isActive: pathname === "/calendar" || pathname === "/",
    },
    {
      label: "Domains",
      href: "/domains",
      isActive: pathname === "/domains",
    },
    {
      label: "Goals & Streaks",
      href: "/goals-and-streaks",
      isActive: pathname === "/goals-and-streaks",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      isActive: pathname === "/dashboard",
    },
  ];

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const handleSettings = () => {
    // TODO: Implement settings page
    console.log("Settings clicked");
  };

  const handleHelp = () => {
    // TODO: Implement help page
    console.log("Help clicked");
  };

  return (
    <AppShell
      navigationItems={navigationItems}
      user={{
        name: session?.user?.name || "User",
        avatarUrl: (session?.user as any)?.avatarUrl,
      }}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      onSettings={handleSettings}
      onHelp={handleHelp}
    >
      {children}
    </AppShell>
  );
}

