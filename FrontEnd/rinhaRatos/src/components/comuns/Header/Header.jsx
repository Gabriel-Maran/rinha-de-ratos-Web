import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import RatoEsgoto from "../../../assets/classeRatos/RatoEsgoto.png";
import Logo from "../../../assets/Logo_Coliseu_dos_Ratos.svg";
import MouseCoin from "../../../assets/moedas/MouseCoin.png";
import "./Header.css";

export default function Header({ home }) {

  
  const { user, setUser } = useAuth();

  console.log("O objeto USER no Header é:", user);

  const navigate = useNavigate();

  return (
    <>
      <div className="header">
        <div className="infoHeader">
          <img
            className="fotoJogador"
            onClick={() => navigate("/perfil")}
            src={user.idFotoPerfil}
          />
          {user ? (
            <h1 onClick={() => navigate("/perfil")}>{user.nome}</h1>
          ) : (
            <p>Carregando...</p>
          )}
          {home == "home" && (
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
          onClick={() => navigate(`/${home}`)}
          className="logoColiseu"
          src={Logo}
        />
      </div>
    </>
  );
}
