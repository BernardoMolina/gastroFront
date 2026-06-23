"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  login as loginRequest,
  logout as logoutRequest,
  getSessionUser,
  type SessionUser,
  type LoginCredentials,
} from "@/lib/api/auth";

interface AuthContextValue {
  user: SessionUser | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<SessionUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setUser(getSessionUser());
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const loggedUser = await loginRequest(credentials);
    setUser(loggedUser);
    return loggedUser;
  }, []);

  const logout = useCallback(() => {
    logoutRequest();
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return ctx;
}
