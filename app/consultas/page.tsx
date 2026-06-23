import { ConsultasManager } from "@/components/consultas/consultas-manager";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function ConsultasPage() {
  return (
    <ProtectedRoute allowedCargos={["MEDICO", "PACIENTE"]}>
      <div className="container mx-auto px-4 py-8">
        <ConsultasManager />
      </div>
    </ProtectedRoute>
  );
}
