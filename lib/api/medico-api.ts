import type { Medico, MedicoDTO, InfoTodosMedicosDTO, SalvarMedicoDTO } from "@/lib/types/medico";
import { apiFetch } from "@/lib/api/client";

export async function getMedicos(): Promise<MedicoDTO[]> {
  return apiFetch<MedicoDTO[]>(`/medico`);
}

export async function getMedicoById(id: number): Promise<MedicoDTO> {
  return apiFetch<MedicoDTO>(`/medico/${id}`);
}

export async function getDetalhesMedicos(): Promise<InfoTodosMedicosDTO[]> {
  return apiFetch<InfoTodosMedicosDTO[]>(`/medico/detalhes_medicos`);
}

export async function salvarMedico(medico: Partial<Medico>): Promise<SalvarMedicoDTO> {
  return apiFetch<SalvarMedicoDTO>(`/medico`, {
    method: "POST",
    body: JSON.stringify(medico),
  });
}

export async function atualizarMedico(medico: Partial<Medico>): Promise<SalvarMedicoDTO> {
  return apiFetch<SalvarMedicoDTO>(`/medico`, {
    method: "PUT",
    body: JSON.stringify(medico),
  });
}

export async function deletarMedico(id: number): Promise<void> {
  return apiFetch<void>(`/medico/${id}`, {
    method: "DELETE",
    parseJson: false,
  });
}
