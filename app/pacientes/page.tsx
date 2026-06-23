import { PacientesManager } from "@/components/pacientes/pacientes-manager";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function PacientesPage() {
  return (
    <ProtectedRoute allowedCargos={["SECRETARIA"]}>
      <div className="container mx-auto px-4 py-8">
        <PacientesManager />
      </div>
    </ProtectedRoute>
  );
}
