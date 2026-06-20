import React, { createContext, useContext, useEffect, useState } from "react";
import { apiClient, setAccessToken, setOnLogout } from "../services/api";
import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from "../services/storage";

export type Role = "Asesor" | "Admin" | null;

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  profile: {
    id: string;
    firstName: string;
    secondName?: string;
    lastName: string;
    secondLastName?: string;
    nationalId: string;
    phone?: string;
    avatarUrl?: string;
    address?: string;
  } | null;
}

interface AuthContextType {
  role: Role;
  setRole: (r: Role) => void;
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  role: null,
  setRole: () => {},
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setRole = async (r: Role) => {
    if (r === null) {
      setAccessToken(null);
      await removeStorageItem("refreshToken");
      setUser(null);
    }
    setRoleState(r);
  };

  useEffect(() => {
    setOnLogout(() => {
      setAccessToken(null);
      removeStorageItem("refreshToken");
      setUser(null);
      setRoleState(null);
    });
  }, []);

  useEffect(() => {
    async function loadSession() {
      try {
        const refreshToken = await getStorageItem("refreshToken");
        if (!refreshToken) {
          setIsLoading(false);
          return;
        }

        const response: any = await apiClient.post("/api/v1/auth/refresh", {
          refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response;
        setAccessToken(newAccessToken);

        const userProfile: any = await apiClient.get("/api/v1/auth/me");
        const userRoles = userProfile.roles || [];

        if (!userRoles.includes("advisor")) {
          throw new Error("Stale credentials are not for a sales advisor.");
        }

        await setStorageItem("refreshToken", newRefreshToken);
        setUser(userProfile);
        setRoleState("Asesor");
      } catch (error) {
        console.warn("Could not silently recover advisor session:", error);
        setAccessToken(null);
        await removeStorageItem("refreshToken");
        setUser(null);
        setRoleState(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response: any = await apiClient.post("/api/v1/auth/login", {
        email,
        password,
      });

      const { user: userProfile, tokens } = response;
      const userRoles = userProfile.roles || [];

      if (!userRoles.includes("advisor")) {
        throw new Error(
          "Acceso denegado: Esta aplicación móvil es de uso exclusivo para Asesores Comerciales.",
        );
      }

      setAccessToken(tokens.accessToken);
      await setStorageItem("refreshToken", tokens.refreshToken);

      setUser(userProfile);
      setRoleState("Asesor");
    } catch (error) {
      console.error("Login request failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = await getStorageItem("refreshToken");
      if (refreshToken) {
        await apiClient.post("/api/v1/auth/logout", {
          refreshToken,
        });
      }
    } catch (error) {
      console.warn("Logout API call failed on backend:", error);
    } finally {
      setAccessToken(null);
      await removeStorageItem("refreshToken");
      setUser(null);
      setRoleState(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ role, setRole, user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
