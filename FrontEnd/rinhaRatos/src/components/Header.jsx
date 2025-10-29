import RatoEsgoto from "../assets/classeRatos/RatoEsgoto.png";
import Logo from "../assets/Logo_Coliseu_dos_Ratos.svg";
import "../css/Header.css";

export default function Header() {
  const nomePlayer = "João";

  return (
    <>
      <div className="header">
        <div className="nomeFotoPlayer">
          <img src={RatoEsgoto} />
          <h1>{nomePlayer}</h1>
        </div>
        <img src={Logo} />
      </div>
    </>
  );
}
