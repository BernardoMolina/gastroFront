// Retornado por GET /consulta (ConsultaDTO do backend)
export interface ConsultaDTO {
  idcon: number;
  idmedico: number;
  idpaciente: number;
  observacao: string;
  nomepaciente: string;
  nomemedico: string;
  dataa: string;
  sintoma: string;
  prescricao: string;
}

// Estrutura da entidade Consulta para salvar/atualizar (POST/PUT /consulta)
export interface ConsultaPayload {
  idcon?: number;
  medico: { idmed: number };
  paciente: { idpac: number };
  dataa: string;
  observacao: string;
  prescricao: string;
  sintoma: string;
}
