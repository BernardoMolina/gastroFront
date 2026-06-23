import type {
  Paciente,
  InfoTodosPacientesDTO,
  SalvarPacienteDTO,
} from "@/lib/types/paciente";
import { apiFetch } from "@/lib/api/client";

export async function getPacienteById(id: number): Promise<Paciente> {
  return apiFetch<Paciente>(`/paciente/${id}`);
}

export async function getDetalhesPacientes(): Promise<InfoTodosPacientesDTO[]> {
  return apiFetch<InfoTodosPacientesDTO[]>(`/paciente/detalhes_pacientes`);
}

export async function salvarPaciente(
  paciente: Partial<Paciente>
): Promise<SalvarPacienteDTO> {
  return apiFetch<SalvarPacienteDTO>(`/paciente`, {
    method: "POST",
    body: JSON.stringify(paciente),
  });
}

export async function atualizarPaciente(
  paciente: Partial<Paciente>
): Promise<SalvarPacienteDTO> {
  return apiFetch<SalvarPacienteDTO>(`/paciente`, {
    method: "PUT",
    body: JSON.stringify(paciente),
  });
}

export async function deletarPaciente(id: number): Promise<void> {
  return apiFetch<void>(`/paciente/${id}`, {
    method: "DELETE",
    parseJson: false,
  });
}
