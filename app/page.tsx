"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { MedicosManager } from "@/components/medicos/medicos-manager";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Médico e paciente não acessam a lista de médicos: vão para consultas.
  useEffect(() => {
    if (loading) return;
    if (user && user.cargo !== "SECRETARIA") {
      router.replace("/consultas");
    }
  }, [user, loading, router]);

  if (loading || (user && user.cargo !== "SECRETARIA")) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ProtectedRoute allowedCargos={["SECRETARIA"]}>
      <div className="container mx-auto px-4 py-8">
        <MedicosManager />
      </div>
    </ProtectedRoute>
  );
}
