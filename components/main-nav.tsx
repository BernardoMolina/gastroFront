"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Stethoscope, Users, Activity, LogOut, CalendarClock, UserCog, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { ProfileDialog } from "@/components/profile/profile-dialog";
import type { Cargo } from "@/lib/api/auth";

interface NavItem {
  href: string;
  label: string;
  icon: typeof Stethoscope;
  /** Cargos que podem ver este item. undefined = todos os logados. */
  cargos?: Cargo[];
}

const navItems: NavItem[] = [
  { href: "/", label: "Médicos", icon: Stethoscope, cargos: ["SECRETARIA"] },
  { href: "/pacientes", label: "Pacientes", icon: Users, cargos: ["SECRETARIA"] },
  { href: "/secretarias", label: "Secretárias", icon: UserCog, cargos: ["SECRETARIA"] },
  { href: "/consultas", label: "Consultas", icon: CalendarClock, cargos: ["MEDICO", "PACIENTE"] },
  { href: "/exames", label: "Exames", icon: FlaskConical, cargos: ["MEDICO", "PACIENTE"] },
];

const cargoLabels: Record<Cargo, string> = {
  MEDICO: "Médico",
  PACIENTE: "Paciente",
  SECRETARIA: "Secretária",
};

export function MainNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const visibleItems = navItems.filter((item) => {
    if (!item.cargos) return true;
    return user?.cargo ? item.cargos.includes(user.cargo) : false;
  });

  // Secretária não precisa do popup: já enxerga as listas completas.
  const podeAbrirPerfil = user?.cargo === "MEDICO" || user?.cargo === "PACIENTE";

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Activity className="h-6 w-6 text-primary" />
          <span>Clínica Gastro</span>
        </Link>

        <nav className="flex items-center gap-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="flex items-center gap-3">
            {podeAbrirPerfil ? (
              <button
                type="button"
                onClick={() => setProfileOpen(true)}
                className="hidden flex-col items-end rounded-md px-2 py-1 text-right transition-colors hover:bg-accent sm:flex"
                aria-label="Ver meu perfil"
              >
                <span className="text-sm font-medium leading-none">
                  {user.email}
                </span>
                {user.cargo && (
                  <span className="text-xs text-muted-foreground">
                    {cargoLabels[user.cargo]}
                  </span>
                )}
              </button>
            ) : (
              <div className="hidden flex-col items-end sm:flex">
                <span className="text-sm font-medium leading-none">
                  {user.email}
                </span>
                {user.cargo && (
                  <span className="text-xs text-muted-foreground">
                    {cargoLabels[user.cargo]}
                  </span>
                )}
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              aria-label="Sair"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {podeAbrirPerfil && (
        <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
      )}
    </header>
  );
}
