import type { ConsultaDTO, ConsultaPayload } from "@/lib/types/consulta";
import { apiFetch } from "@/lib/api/client";

export async function getConsultas(): Promise<ConsultaDTO[]> {
  return apiFetch<ConsultaDTO[]>(`/consulta`);
}

export async function salvarConsulta(
  consulta: ConsultaPayload
): Promise<unknown> {
  return apiFetch<unknown>(`/consulta`, {
    method: "POST",
    body: JSON.stringify(consulta),
  });
}

export async function atualizarConsulta(
  consulta: ConsultaPayload
): Promise<unknown> {
  return apiFetch<unknown>(`/consulta`, {
    method: "PUT",
    body: JSON.stringify(consulta),
  });
}

export async function deletarConsulta(id: number): Promise<void> {
  return apiFetch<void>(`/consulta/${id}`, {
    method: "DELETE",
    parseJson: false,
  });
}
