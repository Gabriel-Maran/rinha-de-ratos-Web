import Logo from "../../assets/Logo_Coliseu_dos_Ratos.svg";
import "../../css/comuns/HeaderConvidado.css";

export default function Header() {
  return (
    <>
      <div className="headerConvidado">
        <img className="logoColiseuConvidado" src={Logo} />
      </div>
    </>
  );
}
