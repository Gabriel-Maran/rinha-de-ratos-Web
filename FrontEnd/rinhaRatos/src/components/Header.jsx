import RatoEsgoto from "../assets/classeRatos/RatoEsgoto.png";
import Logo from "../assets/Logo_Coliseu_dos_Ratos.svg";
import mouseCoin from "../assets/moedas/imgCoin.svg";
import "../css/Header.css";

export default function Header() {
  let nomePlayer; /* Parte que vai receber o nome do player da api */

  nomePlayer = "João";

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
          src={mouseCoin}
          alt="mouseCoin a moeda utilizada em nosso jogo"
        />
        <h3>15</h3>
      </div>
    </>
  );
}
