// Usuario completo (entidade)
export interface UsuarioSecretaria {
  idus?: number;
  nome_completo: string;
  email: string;
  cpf: string;
  telefone: string;
  senha?: string;
  permissao: string;
  status: string;
}

// Retornado por GET /usuario (UsuarioDTO do backend).
export interface UsuarioDTO {
  idus?: number;
  nome_completo: string;
  email: string;
  cpf: string;
  telefone: string;
  permissao: string;
  status: string;
}
