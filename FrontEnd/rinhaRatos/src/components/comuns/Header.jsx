import RatoEsgoto from "../assets/classeRatos/RatoEsgoto.png";
import Logo from "../assets/Logo_Coliseu_dos_Ratos.svg";
import mouseCoinImg from "../assets/moedas/imgCoin.svg";
import "../../css/comuns/Header.css";

export default function Header() {
  let nomePlayer; /* Parte que vai receber o nome do player da api */

  nomePlayer = "João";
  let mouseCoin = 30

  return (
    <>
      <div className="header">
        <div className="nomeFotoPlayer">
          <img src={RatoEsgoto} />
          <h1>{nomePlayer}</h1>
        </div>
        <img src={Logo} />
      </div>
      <div className="quantidadeMoedas">
        <img
          className="mouseCoin"
          src={mouseCoinImg}
          alt="mouseCoin a moeda utilizada em nosso jogo"
        />
        <h3>{mouseCoin}</h3>
      </div>
    </>
  );
}
