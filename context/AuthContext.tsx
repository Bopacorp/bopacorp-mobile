import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

type Role = "Admin" | "Asesor" | null;

const isWeb = Platform.OS === "web";

const getStorageItem = async (key: string): Promise<string | null> => {
  try {
    if (isWeb) {
      if (typeof window !== "undefined" && window.localStorage) {
        return localStorage.getItem(key);
      }
      return null;
    }
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error("Error reading from storage:", error);
    return null;
  }
};

const setStorageItem = async (key: string, value: string): Promise<void> => {
  try {
    if (isWeb) {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(key, value);
      }
      return;
    }
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error("Error writing to storage:", error);
  }
};

const removeStorageItem = async (key: string): Promise<void> => {
  try {
    if (isWeb) {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem(key);
      }
      return;
    }
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error("Error removing from storage:", error);
  }
};

const AuthContext = createContext<{
  role: Role;
  setRole: (r: Role) => void;
  isLoading: boolean;
}>({
  role: null,
  setRole: () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Al iniciar, lee el rol guardado
    async function loadRole() {
      const savedRole = await getStorageItem("userRole");
      if (savedRole === "Admin" || savedRole === "Asesor") {
        setRoleState(savedRole);
      }
      setIsLoading(false);
    }
    loadRole();
  }, []);

  const setRole = async (r: Role) => {
    if (r) {
      await setStorageItem("userRole", r);
    } else {
      await removeStorageItem("userRole");
    }
    setRoleState(r);
  };

  return (
    <AuthContext.Provider value={{ role, setRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
