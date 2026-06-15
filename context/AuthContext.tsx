// context/AuthContext.tsx — reemplaza todo
import React, { createContext, useContext, useState } from "react";

type Role = "Admin" | "Asesor" | null;

const AuthContext = createContext<{ role: Role; setRole: (r: Role) => void }>({
  role: null,
  setRole: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>(() => {
    // Al iniciar, lee el rol guardado
    if (typeof window !== "undefined") {
      return (localStorage.getItem("userRole") as Role) || null;
    }
    return null;
  });

  const setRole = (r: Role) => {
    if (typeof window !== "undefined") {
      if (r) {
        localStorage.setItem("userRole", r);
      } else {
        localStorage.removeItem("userRole");
      }
    }
    setRoleState(r);
  };

  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
