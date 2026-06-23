import { ExamesManager } from "@/components/exames/exames-manager";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function ExamesPage() {
  return (
    <ProtectedRoute allowedCargos={["MEDICO", "PACIENTE"]}>
      <div className="container mx-auto px-4 py-8">
        <ExamesManager />
      </div>
    </ProtectedRoute>
  );
}
