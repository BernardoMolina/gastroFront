import { apiFetch, setToken, clearToken, getToken } from "./client";

export type Cargo = "MEDICO" | "PACIENTE" | "SECRETARIA";

export interface LoginCredentials {
  email: string;
  senha: string;
}

interface LoginResponse {
  token?: string;

  [key: string]: unknown;
}

interface JwtPayload {
  sub?: string;
  ROLE?: string;
  exp?: number;
  [key: string]: unknown;
}

/**
 * Decodifica o payload de um JWT (sem validar a assinatura).
 * Usado apenas no client para ler o cargo e o login do usuario.
 */
export function decodeToken(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Normaliza a claim ROLE (ex: "ROLE_MEDICO", "MEDICO", "medico") para um Cargo.
 */
export function parseCargo(role: string | undefined | null): Cargo | null {
  if (!role) return null;
  const upper = role.toUpperCase();
  if (upper.includes("MEDICO")) return "MEDICO";
  if (upper.includes("SECRETARIA")) return "SECRETARIA";
  if (upper.includes("PACIENTE")) return "PACIENTE";
  return null;
}

export interface SessionUser {
  email: string;
  cargo: Cargo | null;
}

export function getSessionUser(): SessionUser | null {
  const token = getToken();
  if (!token) return null;

  const payload = decodeToken(token);
  if (!payload) return null;

  // verifica expiracao
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    clearToken();
    return null;
  }

  return {
    email: payload.sub ?? "",
    cargo: parseCargo(payload.ROLE),
  };
}

/**
 * Faz login no backend (POST /login) e salva o token.
 */
export async function login(credentials: LoginCredentials): Promise<SessionUser> {
  const data = await apiFetch<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  const token = data.token as string;

  if (!token) {
    throw new Error("Token nao retornado pelo servidor.");
  }

  setToken(token);

  const user = getSessionUser();
  if (!user) {
    throw new Error("Token invalido recebido do servidor.");
  }
  return user;
}

export function logout() {
  clearToken();
}
