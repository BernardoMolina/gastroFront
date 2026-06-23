export interface Usuario {
  idus: number;
  nome_completo: string;
  email: string;
  cpf: string;
  telefone: string;
  senha: string;
  permissao: string;
  status: string;
}

export interface Paciente {
  idpac: number;
  funcao: string;
  sangue: string;
  plano_de_saude: string;
  med_uso_cont: string;
  condicao_cronica: string;
  doenca_anterior: string;
  doenca_infec: string;
  cirurgia: string;
  data_de_nasc: string;
  alergia: string;
  historico_familiar: string;
  sexo: string;
  imunizacao: string;
  usuario: Usuario;
}

// Retornado por GET /paciente/detalhes_pacientes
export interface InfoTodosPacientesDTO {
  idpac?: string;
  iduser?: string;
  nome_completo: string;
  email: string;
  cpf: string;
  telefone: string;
  status: string;
  funcao: string;
  sangue: string;
  plano_de_saude: string;
  med_uso_cont: string;
  condicao_cronica: string;
  doenca_anterior: string;
  doenca_infec: string;
  cirurgia: string;
  data_de_nasc: string;
  alergia: string;
  historico_familiar: string;
  sexo: string;
  imunizacao: string;
}

export interface SalvarPacienteDTO {
  iduser: string;
  funcao: string;
  sangue: string;
  plano_de_saude: string;
  med_uso_cont: string;
  condicao_cronica: string;
  doenca_anterior: string;
  doenca_infec: string;
  cirurgia: string;
  data_de_nasc: string;
  alergia: string;
  historico_familiar: string;
  sexo: string;
  imunizacao: string;
}
