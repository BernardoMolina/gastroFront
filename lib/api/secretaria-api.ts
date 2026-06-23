import type { UsuarioDTO, UsuarioSecretaria } from "@/lib/types/secretaria";
import { apiFetch } from "@/lib/api/client";

// Lista todos os usuarios e filtra apenas os que sao SECRETARIA.
export async function getSecretarias(): Promise<UsuarioDTO[]> {
  const usuarios = await apiFetch<UsuarioDTO[]>(`/usuario`);
  return usuarios.filter(
    (u) => u.permissao?.toUpperCase() === "SECRETARIA"
  );
}

export async function salvarSecretaria(
  usuario: Partial<UsuarioSecretaria>
): Promise<UsuarioSecretaria> {
  return apiFetch<UsuarioSecretaria>(`/usuario`, {
    method: "POST",
    body: JSON.stringify(usuario),
  });
}

export async function atualizarSecretaria(
  usuario: Partial<UsuarioSecretaria>
): Promise<UsuarioSecretaria> {
  return apiFetch<UsuarioSecretaria>(`/usuario`, {
    method: "PUT",
    body: JSON.stringify(usuario),
  });
}

export async function deletarSecretaria(id: number): Promise<void> {
  return apiFetch<void>(`/usuario/${id}`, {
    method: "DELETE",
    parseJson: false,
  });
}
