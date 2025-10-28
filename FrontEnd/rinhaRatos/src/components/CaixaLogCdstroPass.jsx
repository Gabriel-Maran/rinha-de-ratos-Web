import Logo from "../assets/Logo_Coliseu_dos_Ratos.svg";
import Input from "./Input.jsx";
import "../css/CaixaLogCdstroPass.css";

export default function CaixaLogCdstroPass() {
  const txtLoginCdstroSenha = "Fazer login";

  return (
    <>
      <div className="container">
        <img src={Logo} />
        <div className="caixaLogin">
          <h3>{txtLoginCdstroSenha}</h3>
          <div className="inputs">
            <Input
              input={{
                type: "text",
                placeholder: "E-mail",
              }}
            />
            <Input
              input={{
                type: "password",
                placeholder: "Senha",
              }}
            />
            <span>👁</span>
          </div>
          <p>Esqueci a senha...</p>
          <button>Logar</button>
          <p>Não possuo conta</p>
        </div>
      </div>
    </>
  );
}
