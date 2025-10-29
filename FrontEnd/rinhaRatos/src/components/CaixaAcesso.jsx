import Input from "./Input.jsx";
import Button from "./Botao.jsx"
import "../css/CaixaAcesso.css";

export default function CaixaAcesso({ tela, setTela, titulo, setTitulo }) {

  const irLogin = () => {
    setTela(1)
    setTitulo("Login")
  }

  const irReset = () => {
    setTela(2)
    setTitulo("Redefinição de senha")
  }

  const irCadastro = () => {
    setTela(3)
    setTitulo("Cadastro")
  }

  if (tela == 0) {
    return (
      <>
        <div className="caixaLogin">
          <h3>{titulo}</h3>
          <Button
            acaoBtn={"Jogador/ADM"}
            button={{
              className: "acesso",
              onClick: irLogin
            }}
          />
          <Button
            acaoBtn={"Convidado"}
            button={{ className: "acesso" }}
          />
        </div >
      </>
    );
  } else if (tela == 1) {
    return (
      <>
        <div className="caixaLogin">
          <h3>{titulo}</h3>
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
          <Button
            acaoBtn={"Esqueci a senha..."}
            button={{
              className: "resetSenha",
              onClick: irReset
            }}
          />
          <Button
            acaoBtn={"Logar"}
            button={{ className: "botao" }}
          />
          <Button
            acaoBtn={"Não possuo conta"}
            button={{
              className: "linkCadastro",
              onClick: irCadastro
            }}
          />
        </div >
      </>
    );
  } else if (tela == 2) {
    return (
      <>
        <div className="caixaLogin">
          <h3>{titulo}</h3>
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
                  type: "text",
                  placeholder: "Nova senha",
                }}
              />
            </div>
          </div>
          <Button
            acaoBtn={"Redefinir"}
            button={{ className: "botao" }}
          />
          <Button
            acaoBtn={"Lembrei kkkkk"}
            button={{
              className: "btnVoltar",
              onClick: irLogin
            }}
          />
        </div>
      </>
    )
  } else {
    return (
      <>
        <div className="caixaLogin">
          <h3>{titulo}</h3>
          <div className="inputs">
            <Input
              input={{
                type: "text",
                placeholder: "Nome de usuário",
              }}
            />
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
          <Button
            acaoBtn={"Cadastrar"}
            button={{ className: "botao" }}
          />
          <Button
            acaoBtn={"Já tenho conta"}
            button={{
              className: "btnVoltar",
              onClick: irLogin
            }}
          />
        </div>
      </>
    )
  }
}