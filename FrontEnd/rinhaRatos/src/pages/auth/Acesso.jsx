import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo_Coliseu_dos_Ratos.svg";
import "./LogoEFundo.css";
import "./Acesso.css";

export default function Acesso() {
  // ---------------------------------------------------------
  // HOOKS E NAVEGAÇÃO
  // ---------------------------------------------------------

  // useNavigate(): Hook do React Router DOM que permite navegar entre rotas
  // programaticamente (via código), sem recarregar a página inteira.
  const navigate = useNavigate();

  // ---------------------------------------------------------
  // FUNÇÕES DE REDIRECIONAMENTO
  // ---------------------------------------------------------

  // Redirecionamento para Login:
  // Chamada quando o usuário clica em "Jogador/ADM".
  // Leva para a rota "/login" onde o usuário poderá se autenticar.
  const irLogin = () => {
    navigate("/login");
  };

  // Redirecionamento para Convidado:
  // Chamada quando o usuário clica em "Convidado".
  // Leva para a rota "/homeConvidado", permitindo acesso limitado ou visualização sem login.
  const irHomeConvidado = () => {
    navigate("/homeConvidado");
  };

  // ---------------------------------------------------------
  // RENDERIZAÇÃO
  // ---------------------------------------------------------
  
  // Estrutura visual da Landing Page inicial (Tela de Escolha).
  // Exibe a logo principal e os dois botões de decisão de fluxo.
  return (
    <div className="acesso-container">
      <div className="logoEAcesso">
        <img src={Logo} alt="logo coliseu dos ratos" className="logo" />
        <div className="caixa">
          <h3>Você é...</h3>

          <button className="acesso" onClick={irLogin}>
            Jogador/ADM
          </button>

          <button className="acesso" onClick={irHomeConvidado}>
            Convidado
          </button>
        </div>
      </div>
    </div>
  );
}