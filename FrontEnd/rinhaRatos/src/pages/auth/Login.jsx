import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fazerLogin } from "../../Api/Api";
import { useAuth } from "../../context/AuthContext";
import { pegarUsuarioPorId } from "../../Api/Api";
import Input from "../../components/comuns/Input";
import Botao from "../../components/comuns/Botao";
import Logo from "../../assets/Logo_Coliseu_dos_Ratos.svg";
import Icone_Olho_Aberto from "../../assets/icones/icone_olho_aberto.png";
import Icone_Olho_Fechado from "../../assets/icones/icone_olho_fechado.png";
import "./LogoEFundo.css";
import "./CaixaAcesso.css";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const irCadastro = () => {
    navigate("/cadastro");
  };

  const irEsqueceuSenha = () => {
    navigate("/esqueceuSenha");
  };

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const nome = ""; 
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const funMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const irLogin = async (evento) => {
    evento.preventDefault();
    setErro(null);

    const dados = { email, senha, nome };

    try {
      const resposta = await fazerLogin(dados);
      console.log("Login OK!", resposta.data);

      // Assumindo que a resposta do login tem 'id'
      const idUsuarioAPI = resposta.data.id; 
      const tipoContaDaAPI = resposta.data.tipo_conta;
  
      sessionStorage.setItem("idUsuario", idUsuarioAPI);

      const respostaUsuario = await pegarUsuarioPorId(idUsuarioAPI);
      setUser(respostaUsuario.data);

      tipoContaDaAPI === "ADM" ? navigate("/homeADM") : navigate("/home");
    } catch (err) {
      setErro(err?.response?.data?.message || "Email ou senha inválidos.");
    }
  };
  return (
    <div className="acesso-container">
      <img src={Logo} alt="logo coliseu dos ratos" className="logo" />
      <div className="caixaLogin">
        <div className="tituloEErro">
          <h3>Fazer login</h3>
          {erro && <p className="mensagem-erro">{erro}</p>}
        </div>
        <div className="inputs">
          <Input
            input={{
              type: "text",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              placeholder: "E-mail",
            }}
          />
          <div className="input-senha">
            <Input
              input={{
                type: mostrarSenha ? "text" : "password",
                value: senha,
                onChange: (e) => setSenha(e.target.value),
                placeholder: "Senha",
              }}
            />
            <span className="verSenha" onClick={funMostrarSenha}>
              {mostrarSenha ? (
                <img src={Icone_Olho_Fechado} alt="icone de olho fechado" />
              ) : (
                <img src={Icone_Olho_Aberto} alt="icone de olho aberto" />
              )}
            </span>
          </div>
        </div>

        <Botao
          acaoBtn={"Esqueci a senha..."}
          button={{
            className: "resetSenha",
            onClick: irEsqueceuSenha,
          }}
        />

        <Botao
          acaoBtn={"Logar"}
          button={{
            className: "botao",
            onClick: irLogin,
          }}
        />

        <Botao
          acaoBtn={"Não possuo conta"}
          button={{
            className: "linkCadastro",
            onClick: irCadastro,
          }}
        />
      </div>
    </div>
  );
}