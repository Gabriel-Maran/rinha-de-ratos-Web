import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
// Importa o necessário para login, foto e a função de sincronização
import { trocarSenha, trocarFoto, pegarUsuarioPorId } from "../../Api/Api"; 
import { useAuth } from "../../context/AuthContext";
import Trofeu from "../../assets/icones/IconeTrofeu.png";
import Header from "../../components/comuns/Header/Header";
import TelaHistorico from "./TelaHistorico";
import Icone_Olho_Aberto from "../../assets/icones/icone_olho_aberto.png";
import Icone_Olho_Fechado from "../../assets/icones/icone_olho_fechado.png";
import Input from "../../components/comuns/Input";
import ModalOpcFoto from "./ModalOpcFotosPerfil";
import "./Perfil.css";

export default function Perfil({ qtdeMoedas }) {
  const location = useLocation();
  const navigate = useNavigate();
  const listaBatalhas = location.state?.listaBatalhas || [];
  let loginADM = false;

  const [opcaoAtivada, setOpcaoAtivada] = useState("Histórico de Batalhas");
  const botoes = ["Histórico de Batalhas", "Perfil"];

  const { user, setUser } = useAuth();
  const [nome, setNome] = useState(user?.nome ?? null);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  
  // Inicializa o estado com o ID de foto atual do usuário
  const [fotoSelecionada, setFotoSelecionada] = useState(user.idFotoPerfil); 
  
  const funMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const [modalOpcFoto, setModalOpcFoto] = useState(false);

  const fecharModalOpcFoto = () => {
    setModalOpcFoto(false);
  };
  
  // HANDLER SIMPLIFICADO: Recebe APENAS o ID (número)
  const handleFotoSelecionada = (id) => {
    setFotoSelecionada(id);
  };

  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  
  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  const senhaTrocada = async (evento) => {
    const idUsuarioLogado = user.idUsuario || user.id; 

    evento.preventDefault();
    setErro(null);
    setMensagemSucesso(null);

    const dados = { email, senha, nome };
    const idFotoParaAPI = fotoSelecionada; // O ID de foto que será enviado

    try {
      // 1. CHAMA API DE SENHA/NOME
      await trocarSenha(dados, idUsuarioLogado); 
      
      // 2. CHAMA API DE FOTO (Condicionalmente, se o ID foi alterado)
      if (idFotoParaAPI !== user.idFotoPerfil) { 
        // Argumentos corretos: (idUsuario, idFoto)
        await trocarFoto(idUsuarioLogado, idFotoParaAPI); 
      }

      // 3. 🚨 SINCRONIZAÇÃO: Busca os dados mais recentes do backend
      const respostaUsuarioAtualizada = await pegarUsuarioPorId(idUsuarioLogado);
      
      // 4. ATUALIZA O CONTEXTO COM OS DADOS FINAIS E CONFIÁVEIS
      setUser(respostaUsuarioAtualizada.data); 
      
      console.log("Perfil alterado OK!");
      setMensagemSucesso("Perfil alterado com sucesso!");
      
    } catch (err) {
      setErro(err?.response?.data?.message || "Erro ao salvar alterações.");
    }
  };

  const fecharHistorico = () => {
    setMostrarHistorico(false);
  };
  let conteudoPerfil;

  switch (opcaoAtivada) {
    case "Perfil":
      conteudoPerfil = (
        <>
          {modalOpcFoto &&
            <ModalOpcFoto
              modalAtivado={modalOpcFoto}
              onClose={fecharModalOpcFoto}
              // Passando o handler que aceita apenas o ID
              onSelectFoto={handleFotoSelecionada} 
            />}
          <h1 className="subtituloPerfil">Redefina suas informações</h1>
          <div className="dados">
            <button
              className="btnOpcFotoPerfil"
              onClick={() => setModalOpcFoto(true)}
            />
            <p className="lblInfoPerfil">Nome:</p>
            <Input
              input={{
                type: "text",
                value: nome,
                onChange: (e) => setNome(e.target.value),
                placeholder: "",
              }}
            />
            <p className="lblInfoPerfil">E-mail:</p>
            <Input
              input={{
                type: "text",
                value: email,
                onChange: (e) => setEmail(e.target.value),
                placeholder: "",
              }}
            />
            <p className="lblInfoPerfil">Nova Senha:</p>
            <div className="input-senha">
              <Input
                input={{
                  type: mostrarSenha ? "text" : "password",
                  value: senha,
                  onChange: (e) => setSenha(e.target.value),
                  placeholder: "Coloque sua nova senha",
                }}
              />
              <span className="verSenhaRedefinida" onClick={funMostrarSenha}>
                {mostrarSenha ? (
                  <img src={Icone_Olho_Fechado} alt="icone de olho fechado" />
                ) : (
                  <img src={Icone_Olho_Aberto} alt="icone de olho aberto" />
                )}
              </span>
            </div>
            {erro && <p className="mensagem-erro">{erro}</p>}
            {mensagemSucesso && (
              <p className="mensagem-sucesso">{mensagemSucesso}</p>
            )}
          </div>
          <div className="acoesPerfil">
            <button className="btnSalvar" onClick={senhaTrocada}>
              Salvar
            </button>
            <button className="btnDeslogar" onClick={() => navigate("/login")}>
              Deslogar
            </button>
          </div>
        </>
      );
      break;
    default:
      conteudoPerfil = (
        <>
          {mostrarHistorico && (
            <TelaHistorico
              onClose={fecharHistorico}
              mostrarHistorico={mostrarHistorico}
            />
          )}
          <div className="opcoesBatalhaFeita">
            <p>Vencedor: Jão</p>
            <button onClick={() => setMostrarHistorico(true)}>Histórico</button>
          </div>
          <div className="historicoBatalhas">
            {listaBatalhas.map((batalha) => (
              <div className="batalhaFeita" key={batalha.id}>
                <img src={Trofeu} />
                <div className="infoBatalhaFeita">
                  <p>{batalha.nome}</p>
                  <p>Inscrição: {batalha.custo} MouseCoin</p>
                  <p>Data e Hora: {batalha.dataEHora}</p>
                  <p>Prêmio: {batalha.premio} MouseCoin</p>
                </div>
              </div>
            ))}
          </div>
        </>
      );
  }

  return (
    <>
      <Header
        home={loginADM == true ? "homeadm" : "home"}
        qtdeMoedas={qtdeMoedas}
      />
      <div className="perfil-container">
        <div className={"opcoesPerfil"}>
          {botoes.map((botao) => (
            <button
              key={botao}
              className={opcaoAtivada == botao ? "opcaoAtiva" : "btnOpcao"}
              onClick={() => setOpcaoAtivada(botao)}
            >
              {botao}
            </button>
          ))}
        </div>
        <div className="conteudo-perfil">{conteudoPerfil}</div>
      </div>
    </>
  );
}