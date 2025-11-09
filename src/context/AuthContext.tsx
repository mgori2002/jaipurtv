import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { compareSync } from "bcryptjs";
import adminUsersData from "@/config/admin-users.json";

type AdminUserRecord = {
  email: string;
  passwordHash: string;
  name?: string;
};

export type AuthUser = {
  email: string;
  name?: string;
  signedInAt: string;
};

export type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  authHeader: string | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const SESSION_STORAGE_KEY = "jaipurtv.admin.session";
const SESSION_HEADER_KEY = "jaipurtv.admin.authHeader";
const adminUsers: AdminUserRecord[] = adminUsersData;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authHeader, setAuthHeader] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    const storedHeader = localStorage.getItem(SESSION_HEADER_KEY);
    let parsedUser: AuthUser | null = null;

    if (stored) {
      try {
        parsedUser = JSON.parse(stored) as AuthUser;
      } catch (error) {
        console.warn("Failed to parse stored admin session", error);
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }

    if (parsedUser && storedHeader) {
      setUser(parsedUser);
      setAuthHeader(storedHeader);
    } else if (parsedUser && !storedHeader) {
      console.info("Discarding stale admin session without auth header");
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(SESSION_HEADER_KEY);
    } else if (!parsedUser && storedHeader) {
      localStorage.removeItem(SESSION_HEADER_KEY);
    }

    setLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    const record = adminUsers.find((candidate) => candidate.email.toLowerCase() === trimmedEmail);
    if (!record) {
      throw new Error("invalid-credentials");
    }

    const passwordMatches = compareSync(trimmedPassword, record.passwordHash);
    if (!passwordMatches) {
      throw new Error("invalid-credentials");
    }

    const authUser: AuthUser = {
      email: record.email,
      name: record.name,
      signedInAt: new Date().toISOString(),
    };

    setUser(authUser);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authUser));

    const basicHeader = typeof window !== "undefined" ? window.btoa(`${record.email}:${trimmedPassword}`) : null;
    if (basicHeader) {
      setAuthHeader(basicHeader);
      localStorage.setItem(SESSION_HEADER_KEY, basicHeader);
    }
  }, []);

  const signOutUser = useCallback(async () => {
    setUser(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setAuthHeader(null);
    localStorage.removeItem(SESSION_HEADER_KEY);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    signIn,
    signOutUser,
    authHeader,
  }), [user, loading, signIn, signOutUser, authHeader]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
