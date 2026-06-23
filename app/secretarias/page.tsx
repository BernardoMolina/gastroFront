import { SecretariasManager } from "@/components/secretarias/secretarias-manager";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function SecretariasPage() {
  return (
    <ProtectedRoute allowedCargos={["SECRETARIA"]}>
      <div className="container mx-auto px-4 py-8">
        <SecretariasManager />
      </div>
    </ProtectedRoute>
  );
}
