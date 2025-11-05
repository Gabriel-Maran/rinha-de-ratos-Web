import RatoEsgoto from "../../assets/classeRatos/RatoEsgoto.png";
import Logo from "../../assets/Logo_Coliseu_dos_Ratos.svg";
import mouseCoinImg from "../../assets/moedas/imgCoin.svg";
import { useNavigate } from "react-router-dom";
import "../../css/comuns/Header.css";

export default function Header() {
  let nomePlayer; /* Parte que vai receber o nome do player da api */

  nomePlayer = "João";
  let mouseCoin = 30

  const navigate = useNavigate();

  return (
    <>
      <div className="header">
        <div className="infoHeader">
          <img onClick={() =>
            navigate("/perfil")} src={RatoEsgoto} />
          <div className="nomeEMoedas">
            <h1 onClick={() =>
              navigate("/perfil")}>{nomePlayer}</h1>
            <div className="quantidadeMoedas">
              <img
                className="mouseCoin"
                src={mouseCoinImg}
                alt="mouseCoin a moeda utilizada em nosso jogo"
              />
              <h3>{mouseCoin}</h3>
            </div>
          </div>
        </div>
        <img onClick={() =>
          navigate("/home")
        } className="logoColiseu" src={Logo} />
      </div >
    </>
  );
}
