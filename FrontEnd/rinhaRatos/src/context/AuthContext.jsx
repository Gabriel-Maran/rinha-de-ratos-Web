import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { pegarUsuarioPorId } from "../Api/Api";

// Criação do Contexto (A "Caixa de Ferramentas" Global)
// Este objeto serve como um canal de comunicação que atravessa toda a árvore de componentes,
// permitindo que qualquer filho acesse os dados do usuário sem passar props manualmente.
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Controle de Carregamento (Loading State):
  // Importante para a UX. Começa true para impedir que o app renderize a tela de "Login"
  // antes de checar se já existe uma sessão salva (o que causaria um "piscar" indesejado).
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------------
  // LÓGICA DE RECARGA DE SESSÃO 
  // ---------------------------------------------------------

  // useCallback: Hook de Otimização.
  // Memoriza a função na memória para que ela não seja recriada a cada renderização do componente.
  // Isso é vital porque passamos essa função dentro do array de dependências do useEffect abaixo.
  // Se não usássemos useCallback, o useEffect rodaria em loop infinito.
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
    // Independente de achar usuário ou não, o carregamento inicial acabou.
    // Isso libera a renderização do app (children).
    setLoading(false);
  }, []);

  // ---------------------------------------------------------
  // CICLO DE VIDA
  // ---------------------------------------------------------

  // useEffect com Dependências [recarregarUsuario]:
  // Executa a função de recarga assim que o Provider nasce (ao abrir o site).
  useEffect(() => {
    recarregarUsuario();
  }, [recarregarUsuario]);

  // ---------------------------------------------------------
  // EXPOSIÇÃO DE DADOS (INTERFACE PÚBLICA)
  // ---------------------------------------------------------

  // Objeto Value: Tudo o que colocamos aqui fica acessível para qualquer componente
  // que chame useAuth(). Incluímos 'recarregarUsuario' para permitir que componentes
  // filhos forcem uma atualização de dados (ex: após comprar moedas).

  // Renderização Condicional de Segurança:
  // Só mostramos o aplicativo (children) depois que a verificação de sessão termina (!loading).
  // Isso evita que rotas protegidas expulsem o usuário antes de saber se ele está logado.

  const value = { user, setUser, loading, recarregarUsuario };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook Personalizado:
// Atalho para não precisarmos importar useContext e AuthContext em todo arquivo.
// Basta importar useAuth() e pronto.
export function useAuth() {
  return useContext(AuthContext);
}
