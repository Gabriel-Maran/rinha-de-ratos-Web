import CaixaLogCdstroPass from "../components/CaixaLogCdstroPass";
import Logo from "../assets/Logo_Coliseu_dos_Ratos.svg"
import '../css/Login.css';

export default function Login() {
  return (
    <>
      <div className="login-container">
        <img src={Logo} className="logo" />
        <div className="caixa">
          <CaixaLogCdstroPass />
        </div>
      </div>
    </>
  );
}
