// Tipos de exame suportados
export type TipoExame = "COLANGIORESSONANCIA" | "MANOMETRIA" | "ENDOSCOPIA";

export const TIPO_EXAME_LABEL: Record<TipoExame, string> = {
  COLANGIORESSONANCIA: "Colangiorressonância",
  MANOMETRIA: "Manometria",
  ENDOSCOPIA: "Endoscopia",
};

// ---- DTOs de listagem detalhada (GET /{tipo}/detalhes_*) ----


export interface DetalheColangio {
  idcol?: number;
  idexame?: number;
  idpaciente?: number;
  idmedico?: number;
  nomepaciente: string;
  nomemedico: string;
  dataexame: string;
  diagnostico: string;
  tecnica: string;
  observacao: string;
}

export interface DetalheManometria {
  idman?: number;
  idexame?: number;
  idpaciente?: number;
  idmedico?: number;
  nomepaciente: string;
  nomemedico: string;
  dataexame: string;
  sumario: string;
  conclusao: string;
  resultados: string;
}

export interface DetalheEndoscopia {
  idend?: number;
  idexame?: number;
  idpaciente?: number;
  idmedico?: number;
  nomepaciente: string;
  nomemedico: string;
  dataexame: string;
  duodeno: string;
  esofago: string;
  conclusao: string;
  descricao: string;
}

// ---- Linha unificada exibida na tabela ----
export interface ExameUnificado {
  tipo: TipoExame;
  id?: number; // idcol / idman / idend
  idexame?: number;
  idpaciente?: number;
  idmedico?: number;
  nomepaciente: string;
  nomemedico: string;
  dataexame: string;
  // campos específicos para exibição e edição
  campos: Record<string, string>;
}

// ---- Payloads de envio ----
export interface ExameBasePayload {
  medico: { idmed: number };
  paciente: { idpac: number };
  dataa: string;
}

export interface SalvarExameResponse {
  idex: number;
  paciente: string;
  medico: string;
  dataa: string;
}

export interface ColangioPayload {
  idcol?: number;
  exame: { idex: number };
  diagnostico: string;
  tecnica: string;
  observacao: string;
}

export interface ManometriaPayload {
  idman?: number;
  exame: { idex: number };
  sumario: string;
  conclusao: string;
  resultados: string;
}

export interface EndoscopiaPayload {
  idend?: number;
  exame: { idex: number };
  duodeno: string;
  esofago: string;
  conclusao: string;
  descricao: string;
}
