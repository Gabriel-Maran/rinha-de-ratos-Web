import { createContext, useState, useContext, useEffect, useCallback } from "react";
import { pegarUsuarioPorId } from "../Api/Api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 
  // Usamos useCallback para garantir que essa função não seja recriada a cada renderização
  const recarregarUsuario = useCallback(async () => {
    const storedId = sessionStorage.getItem("idUsuario");

    if (storedId) {
      try {
        const resposta = await pegarUsuarioPorId(storedId);
        setUser(resposta.data);
      } catch (err) {
        console.error("Falha ao carregar usuário:", err);
        sessionStorage.removeItem("idUsuario");
        setUser(null);
      }
    }
    setLoading(false);
  }, []);


  // Ele roda apenas uma vez quando o app abre, chamando nossa função
  useEffect(() => {
    recarregarUsuario();
  }, [recarregarUsuario]);

 
  // Adicionamos 'recarregarUsuario' aqui para você usar em outros lugares!
  const value = { user, setUser, loading, recarregarUsuario };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}