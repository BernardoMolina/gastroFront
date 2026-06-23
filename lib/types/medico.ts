export interface Medico {
  idmed: number;
  registro: string;
  usuario: Usuario;
}

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

export interface MedicoDTO {
  idmed: string;
  iduser: string;
  registro: string;
  nome_completo: string;
  email: string;
  cpf: string;
  telefone: string;
  senha: string;
  permissao: string;
  status: string;
}

export interface SalvarMedicoDTO {
  iduser: string;
  registro: string;
}

export interface InfoTodosMedicosDTO {
  nome_completo: string;
  email: string;
  cpf: string;
  telefone: string;
  status: string;
  registro: string;
}

export interface MedicoFormData {
  registro: string;
  usuario: {
    nome_completo: string;
    email: string;
    cpf: string;
    telefone: string;
    senha: string;
    permissao: string;
    status: string;
  };
}
