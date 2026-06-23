import { apiFetch } from "@/lib/api/client";
import type {
  DetalheColangio,
  DetalheManometria,
  DetalheEndoscopia,
  ExameBasePayload,
  SalvarExameResponse,
  ColangioPayload,
  ManometriaPayload,
  EndoscopiaPayload,
} from "@/lib/types/exame";

// ---- Listagens detalhadas (com nomes de paciente/médico) ----
export async function getDetalhesColangio(): Promise<DetalheColangio[]> {
  return apiFetch<DetalheColangio[]>(
    `/colangioressonancia/detalhes_colangioressonancias`
  );
}

export async function getDetalhesManometria(): Promise<DetalheManometria[]> {
  return apiFetch<DetalheManometria[]>(`/manometria/detalhes_manometrias`);
}

export async function getDetalhesEndoscopia(): Promise<DetalheEndoscopia[]> {
  return apiFetch<DetalheEndoscopia[]>(`/endoscopia/detalhes_endoscopias`);
}

// ---- Etapa 1: cria o exame base ----
export async function criarExameBase(
  payload: ExameBasePayload
): Promise<SalvarExameResponse> {
  return apiFetch<SalvarExameResponse>(`/exame`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ---- Etapa 2: cria o exame específico ----
export async function criarColangio(payload: ColangioPayload): Promise<unknown> {
  return apiFetch<unknown>(`/colangioressonancia`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function criarManometria(
  payload: ManometriaPayload
): Promise<unknown> {
  return apiFetch<unknown>(`/manometria`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function criarEndoscopia(
  payload: EndoscopiaPayload
): Promise<unknown> {
  return apiFetch<unknown>(`/endoscopia`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ---- Atualização dos exames específicos ----
export async function atualizarColangio(
  payload: ColangioPayload
): Promise<unknown> {
  return apiFetch<unknown>(`/colangioressonancia`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function atualizarManometria(
  payload: ManometriaPayload
): Promise<unknown> {
  return apiFetch<unknown>(`/manometria`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function atualizarEndoscopia(
  payload: EndoscopiaPayload
): Promise<unknown> {
  return apiFetch<unknown>(`/endoscopia`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// ---- Exclusão dos exames específicos ----
export async function deletarColangio(id: number): Promise<void> {
  return apiFetch<void>(`/colangioressonancia/${id}`, {
    method: "DELETE",
    parseJson: false,
  });
}

export async function deletarManometria(id: number): Promise<void> {
  return apiFetch<void>(`/manometria/${id}`, {
    method: "DELETE",
    parseJson: false,
  });
}

export async function deletarEndoscopia(id: number): Promise<void> {
  return apiFetch<void>(`/endoscopia/${id}`, {
    method: "DELETE",
    parseJson: false,
  });
}
