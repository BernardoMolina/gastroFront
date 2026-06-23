// Máscaras e validações compartilhadas pelos formulários

/** Aplica máscara de CPF: 000.000.000-00 */
export function maskCPF(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

/** Aplica máscara de telefone: (00) 0000-0000 ou (00) 00000-0000 */
export function maskTelefone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

/** Valida CPF usando o algoritmo dos dígitos verificadores */
export function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  // rejeita sequências iguais (000.000.000-00, etc.)
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(digits[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(digits[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(digits[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(digits[10])) return false;

  return true;
}

/** Valida formato de e-mail */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ---- Validadores de campo (retornam mensagem de erro ou undefined) ----

export function validateNome(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "Informe o nome completo.";
  if (v.length < 3) return "O nome deve ter ao menos 3 caracteres.";
  if (v.length > 80) return "O nome deve ter no máximo 80 caracteres.";
  return undefined;
}

export function validateEmail(value: string): string | undefined {
  if (!value.trim()) return "Informe o e-mail.";
  if (!isValidEmail(value)) return "E-mail inválido. Ex: nome@email.com";
  return undefined;
}

export function validateCPF(value: string): string | undefined {
  if (!value.trim()) return "Informe o CPF.";
  if (value.replace(/\D/g, "").length !== 11)
    return "O CPF deve conter 11 dígitos.";
  if (!isValidCPF(value)) return "CPF inválido. Verifique os números.";
  return undefined;
}

export function validateTelefone(value: string): string | undefined {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "Informe o telefone.";
  if (digits.length < 10) return "Telefone incompleto. Ex: (11) 99999-9999";
  return undefined;
}

/** Senha: obrigatória apenas no cadastro (required = true) */
export function validateSenha(
  value: string,
  required: boolean
): string | undefined {
  if (!value) {
    return required ? "Informe uma senha." : undefined;
  }
  if (value.length < 6) return "A senha deve ter ao menos 6 caracteres.";
  return undefined;
}

export function validateObrigatorio(
  value: string,
  label: string
): string | undefined {
  if (!value || !value.trim()) return `Informe ${label}.`;
  return undefined;
}

/**
 * Confirmação de senha. Só valida quando há senha preenchida
 * (ou quando é obrigatória no cadastro).
 */
export function validateConfirmarSenha(
  senha: string,
  confirmar: string,
  required: boolean
): string | undefined {
  if (!senha && !required) return undefined;
  if (!confirmar) return "Confirme a senha.";
  if (senha !== confirmar) return "As senhas não coincidem.";
  return undefined;
}
/**
 * Normaliza qualquer formato de data/hora para ISO-8601 LocalDateTime
 * (YYYY-MM-DDTHH:mm:ss), que é o esperado pelo backend Spring.
 * Cobre:
 *  - datetime-local do input HTML:  "2026-06-18T15:10"      -> "2026-06-18T15:10:00"
 *  - formato cru vindo do backend:  "2026-06-18 15:10:00.0" -> "2026-06-18T15:10:00"
 */
export function toIsoLocalDateTime(value: string): string {
  if (!value) return "";
  // Troca o separador de espaço por "T" e remove fração de segundos.
  let v = value.trim().replace(" ", "T").split(".")[0];
  // Garante os segundos quando o input só traz "YYYY-MM-DDTHH:mm".
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v)) v = `${v}:00`;
  return v;
}