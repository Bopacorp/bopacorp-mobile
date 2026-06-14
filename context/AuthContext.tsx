import React, { createContext, useContext, useState } from "react";

type Role = "Asesor" | "Admin" | "CMS";

const AuthContext = createContext({
  role: "Asesor" as Role,
  setRole: (role: Role) => {},
});

// ESTO ES LO QUE SEGURAMENTE FALTA:
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<Role>("Asesor");
  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
