import Input from "./Input.jsx";
import Button from "./BtnLogin.jsx"
import "../css/CaixaLogCdstroPass.css";

export default function CaixaLogCdstroPass() {
  const txtLoginCdstroSenha = "Fazer login";

  return (
    <>
      <div className="caixaLogin">
        <h3>{txtLoginCdstroSenha}</h3>
        <div className="inputs">
          <Input
            input={{
              type: "text",
              placeholder: "E-mail",
            }}
          />
          <div className="input-senha">
            <Input
              input={{
                type: "password",
                placeholder: "Senha",
              }}
            />
            <span className="verSenha">👁</span>
          </div>
        </div>
        <p className="resetSenha">Esqueci a senha...</p>
        <Button
          button={{ className:"botao" }}
        />
        <p className="linkCadastro">Não possuo conta</p>
      </div>
    </>
  );
}
