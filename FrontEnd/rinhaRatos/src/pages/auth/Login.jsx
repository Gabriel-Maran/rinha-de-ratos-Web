import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fazerLogin } from "../../Api/Api";
import { useAuth } from "../../context/AuthContext";
import { pegarUsuarioPorId } from "../../Api/Api";
import Logo from "../../assets/Logo_Coliseu_dos_Ratos.svg";
import Icone_Olho_Aberto from "../../assets/icones/icone_olho_aberto.png";
import Icone_Olho_Fechado from "../../assets/icones/icone_olho_fechado.png";
import "./LogoEFundo.css";
import "./CaixaAcesso.css";

export default function Login() {
  // ---------------------------------------------------------
  //  HOOKS E CONTEXTO
  // ---------------------------------------------------------
  
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Acesso ao contexto global de autenticação.

  // ---------------------------------------------------------
  //  NAVEGAÇÃO SECUNDÁRIA
  // ---------------------------------------------------------

  // Funções de redirecionamento para telas de apoio (Cadastro e Recuperação).

  // 1. Redireciona para a tela de criação de nova conta.
  const irCadastro = () => {
    navigate("/cadastro");
  };

  // 2. Redireciona para o fluxo de redefinição de senha.
  const irEsqueceuSenha = () => {
    navigate("/esqueceuSenha");
  };

  // ---------------------------------------------------------
  //  ESTADOS DO FORMULÁRIO E VARIÁVEIS
  // ---------------------------------------------------------

  // Definição dos estados para controlar os inputs e feedback visual.
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const nome = "";
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // ---------------------------------------------------------
  //  FUNÇÕES AUXILIARES E VISUAIS
  // ---------------------------------------------------------

  // Alternador de visibilidade para o campo de senha.

  // 1. Inverte o valor de 'mostrarSenha' para alternar o type do input
  //    entre 'text' (visível) e 'password' (oculto).
  const funMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  // ---------------------------------------------------------
  //  LOGIN E AUTENTICAÇÃO (SUBMIT)
  // ---------------------------------------------------------

  // Função assíncrona que gerencia o processo de login completo.

  // 1. preventDefault(): Evita o recarregamento da página.
  // 2. Payload: Monta o objeto com as credenciais (email, senha) e nome.
  // 3. API Login: Realiza a primeira chamada para autenticar.
  // 4. Persistência: Salva o ID do usuário na sessionStorage.
  // 5. API Dados: Busca os dados completos do usuário usando o ID retornado.
  // 6. Contexto: Atualiza o estado global 'setUser' com os dados do usuário.
  // 7. Roteamento Condicional: Verifica se é 'ADM' ou usuário comum para
  //  definir o destino (/homeADM ou /home).
  // 8. Tratamento de Erro: Captura falhas e exibe feedback ao usuário.
  const irLogin = async (evento) => {
    evento.preventDefault();
    setErro(null);

    const dados = { email, senha, nome };

    try {
      const resposta = await fazerLogin(dados);
      console.log("Login OK!", resposta.data);

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

  // ---------------------------------------------------------
  //  RENDERIZAÇÃO
  // ---------------------------------------------------------
  return (
    <div className="acesso-container">
      <div className="logoELogin">
        <img src={Logo} alt="logo coliseu dos ratos" className="logo" />
        <div className="caixaLogin">
          <div className="tituloEErro">
            <h3>Fazer login</h3>
            {erro && <p className="mensagem-erro">{erro}</p>}
          </div>
          <div className="inputs">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
            />
            <div className="input-senha">
              <input
                type={mostrarSenha ? "text" : "password"}
                className="input-padrao"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha"
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
          <button className="resetSenha" onClick={irEsqueceuSenha}>
            Esqueci a senha...
          </button>

          <button className="botao" onClick={irLogin}>
            Logar
          </button>

          <button className="linkCadastro" onClick={irCadastro}>
            Não possuo conta
          </button>
        </div>
      </div>
    </div>
  );
}