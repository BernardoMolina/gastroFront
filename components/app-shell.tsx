"use client";

import { usePathname } from "next/navigation";
import { MainNav } from "@/components/main-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname === "/login";

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <MainNav />
      <main className="min-h-screen bg-background">{children}</main>
    </>
  );
}
