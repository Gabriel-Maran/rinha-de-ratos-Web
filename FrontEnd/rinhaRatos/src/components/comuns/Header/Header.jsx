import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Logo from "../../../assets/Logo_Coliseu_dos_Ratos.svg";
import MouseCoin from "../../../assets/moedas/MouseCoin.png";
import { getFotoUrlById } from "../../../pages/perfil/ModalOpcFotosPerfil";
import "./Header.css";

export default function Header() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // 2. LÓGICA: Converte o ID (número) na URL da Imagem (string)
  const fotoPerfilUrl = user ? getFotoUrlById(user.idFotoPerfil) : getFotoUrlById(0);

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
            <h1 onClick={() => navigate("/perfil")}>{user.nome}</h1>
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
          style={{ cursor: 'pointer' }}
        />
      </div>
    </>
  );
}