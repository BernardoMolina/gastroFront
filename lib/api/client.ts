const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/clinica-gastro";

const TOKEN_KEY = "clinica_token";

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function clearToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

type ApiFetchOptions = RequestInit & { parseJson?: boolean };

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { parseJson = true, headers, ...rest } = options;

  const token = getToken();

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (token) {
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error(
      "Nao autorizado. Faca login ou verifique suas credenciais."
    );
  }

  if (!response.ok) {
    // o backend pode retornar a mensagem de erro como texto puro ou JSON
    let message = `Erro na requisicao (${response.status})`;
    try {
      const text = await response.text();
      if (text) {
        try {
          const json = JSON.parse(text);
          message = json.message || json.error || text;
        } catch {
          message = text;
        }
      }
    } catch {
      // mantem mensagem padrao
    }
    throw new Error(message);
  }

  if (!parseJson) {
    return undefined as T;
  }

  return response.json();
}
