import RatoEsgoto from "../assets/RatoEsgoto.png";
import Logo from "../assets/Logo_Coliseu_dos_Ratos.svg";
import "../css/Header.css";

export default function Header() {
  return (
    <>
      <div className="header">
        <img src={RatoEsgoto} />
        <img src={Logo} className="logo" />
      </div>
    </>
  );
}
