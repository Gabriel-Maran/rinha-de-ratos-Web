import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [tipoConta, setTipoConta] = useState(() => {
    return (localStorage.getItem("tipoConta")) || "JOGADOR";
  });

  const value = { tipoConta, setTipoConta };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}