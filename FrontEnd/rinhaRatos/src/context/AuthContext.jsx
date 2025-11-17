import { createContext, useState, useContext, useEffect } from "react";
import { pegarUsuarioPorId } from "../Api/Api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Serve para o  app não "piscar" enquanto o user carrega
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedId = sessionStorage.getItem("idUsuario");

      if (storedId) {
        try {
          const resposta = await pegarUsuarioPorId(storedId);
          setUser(resposta.data);
        } catch (err) {
          console.error("Falha ao carregar usuário:", err);
          sessionStorage.removeItem("idUsuario");
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // O 'value' partilha o objeto 'user', a função 'setUser', e o 'loading'
  const value = { user, setUser, loading };

  return (
    <AuthContext.Provider value={value}>
      {/* O 'children' só é renderizado depois de o loading terminar */}
      {!loading && children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
