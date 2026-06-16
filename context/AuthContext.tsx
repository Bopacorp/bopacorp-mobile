import React, { createContext, useContext, useEffect, useState } from "react";
import { getStorageItem, setStorageItem, removeStorageItem } from "../services/storage";
import { apiClient, setAccessToken, setOnLogout } from "../services/api";

export type Role = "Admin" | "Asesor" | null;

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

  // Expose setRole for backward compatibility (used for view switching and simple logouts)
  const setRole = async (r: Role) => {
    if (r === null) {
      setAccessToken(null);
      await removeStorageItem("refreshToken");
      setUser(null);
    }
    setRoleState(r);
  };

  // Hook interceptor failure to trigger automatic logout in React state
  useEffect(() => {
    setOnLogout(() => {
      setAccessToken(null);
      removeStorageItem("refreshToken");
      setUser(null);
      setRoleState(null);
    });
  }, []);

  useEffect(() => {
    // Silent Session Bootstrap on startup
    async function loadSession() {
      try {
        const refreshToken = await getStorageItem("refreshToken");
        if (!refreshToken) {
          setIsLoading(false);
          return;
        }

        // Call refresh directly using api client
        const response: any = await apiClient.post("/api/v1/auth/refresh", {
          refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response;
        setAccessToken(newAccessToken);
        await setStorageItem("refreshToken", newRefreshToken);

        // Fetch user info using token
        const userProfile: any = await apiClient.get("/api/v1/auth/me");
        const userRoles = userProfile.roles || [];
        
        let mappedRole: Role = null;
        if (userRoles.includes("admin") || userRoles.includes("supervisor")) {
          mappedRole = "Admin";
        } else if (userRoles.includes("advisor")) {
          mappedRole = "Asesor";
        }

        setUser(userProfile);
        setRoleState(mappedRole);
      } catch (error) {
        console.warn("Could not silently recover session:", error);
        // Clear stale credentials
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

      setAccessToken(tokens.accessToken);
      await setStorageItem("refreshToken", tokens.refreshToken);

      const userRoles = userProfile.roles || [];
      let mappedRole: Role = null;
      if (userRoles.includes("admin") || userRoles.includes("supervisor")) {
        mappedRole = "Admin";
      } else if (userRoles.includes("advisor")) {
        mappedRole = "Asesor";
      }

      setUser(userProfile);
      setRoleState(mappedRole);
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
      // Always clear local session even if backend logout fails (e.g. offline)
      setAccessToken(null);
      await removeStorageItem("refreshToken");
      setUser(null);
      setRoleState(null);
    }
  };

  return (
    <AuthContext.Provider value={{ role, setRole, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
