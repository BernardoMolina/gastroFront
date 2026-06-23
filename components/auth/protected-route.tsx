"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import type { Cargo } from "@/lib/api/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Cargos com permissao de acesso. Se vazio, qualquer usuario logado acessa. */
  allowedCargos?: Cargo[];
}

export function ProtectedRoute({
  children,
  allowedCargos,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const isAllowed =
    user && (!allowedCargos || allowedCargos.length === 0
      ? true
      : user.cargo !== null && allowedCargos.includes(user.cargo));

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAllowed) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 px-4 text-center">
        <h2 className="text-xl font-semibold">Acesso negado</h2>
        <p className="text-muted-foreground">
          Você não tem permissão para acessar esta página.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
