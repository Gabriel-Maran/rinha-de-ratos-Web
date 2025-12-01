import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Logo from "../../../assets/Logo_Coliseu_dos_Ratos.svg";
import MouseCoin from "../../../assets/moedas/MouseCoin.png";
import { getFotoUrlById } from "../../../pages/perfil/ModalOpcFotosPerfil";
import "./Header.css";

export default function Header() {
  // ---------------------------------------------------------
  // HOOKS E CONTEXTO
  // ---------------------------------------------------------

  // useAuth: Acessa o objeto 'user' global. É daqui que vem o saldo atualizado e a foto.
  // useNavigate: Hook do React Router que nos permite mudar de página via função JavaScript
  // (útil para lógica condicional, como "se for admin, vá para X").
  const { user} = useAuth();
  const navigate = useNavigate();

  // ---------------------------------------------------------
  // TRATAMENTO DE DADOS VISUAIS 
  // ---------------------------------------------------------

  // Verifica se o objeto 'user' existe.
  // - Se existir, busca a URL da foto baseada no ID salvo no banco.
  // - Se for nulo (carregando ou deslogado), carrega a foto padrão (ID 0).
  // Isso impede que a imagem quebre enquanto os dados carregam.
  const fotoPerfilUrl = user
    ? getFotoUrlById(user.idFotoPerfil)
    : getFotoUrlById(0);

  // ---------------------------------------------------------
  // LÓGICA DE NAVEGAÇÃO INTELIGENTE
  // ---------------------------------------------------------

  // Função chamada ao clicar na Logo.
  // Redireciona o usuário para a "Home" correta dependendo do seu nível de acesso.
  // 1. Sem usuário -> Login.
  // 2. Tipo ADM -> HomeADM.
  // 3. Padrão (Jogador) -> Home.
  const decidirOndeIr = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    switch (user.tipoConta) {
      case "ADM":
        navigate("/homeadm");
        break;
      default:
        navigate("/home");
        break;
    }
  };

  // ---------------------------------------------------------
  // RENDERIZAÇÃO
  // ---------------------------------------------------------

  // Renderização Condicional:
  // 1. Nome: Mostra "Carregando..." se o user for null.
  // 2. Moedas: O bloco {user?.tipoConta === "JOGADOR" && (...)} garante que
  //    apenas JOGADORES vejam o saldo. ADMs não precisam ver moedas no header.
  // 3. Atualização Reativa: Como usamos {user.mousecoinSaldo} direto do Contexto,
  //    qualquer chamada de 'recarregarUsuario()' feita em outros arquivos atualiza este número automaticamente.
  return (
    <>
      <div className="header">
        <div className="infoHeader">
          <img
            className="fotoJogador"
            onClick={() => navigate("/perfil")}
            src={fotoPerfilUrl}
            alt="Foto de perfil do jogador"
          />
          {user ? (
            <h1
              className={user?.tipoConta === "JOGADOR" ? "nomeUsuario" : ""}
              onClick={() => navigate("/perfil")}
            >
              {user.nome}
            </h1>
          ) : (
            <p>Carregando...</p>
          )}
          {user?.tipoConta === "JOGADOR" && (
            <div className="quantidadeMoedas">
              <img
                className="mouseCoin"
                src={MouseCoin}
                alt="mouseCoin a moeda utilizada em nosso jogo"
              />
              {user ? <h3>{user.mousecoinSaldo}</h3> : <p>carregando...</p>}
            </div>
          )}
        </div>
        <img
          onClick={decidirOndeIr}
          className="logoColiseu"
          src={Logo}
          alt="Logo Coliseu"
          style={{ cursor: "pointer" }}
        />
      </div>
    </>
  );
}
