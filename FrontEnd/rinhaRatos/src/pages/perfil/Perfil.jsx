import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  trocarSenha,
  trocarFoto,
  pegarUsuarioPorId,
  pegarBatalhasIncrito,
} from "../../Api/Api";
import { useAuth } from "../../context/AuthContext";
import Trofeu from "../../assets/icones/IconeTrofeu.png";
import Header from "../../components/comuns/Header/Header";
import TelaHistorico from "./TelaHistorico";
import Icone_Olho_Aberto from "../../assets/icones/icone_olho_aberto.png";
import Icone_Olho_Fechado from "../../assets/icones/icone_olho_fechado.png";
import Input from "../../components/comuns/Input";
import ModalOpcFoto, { getFotoUrlById } from "./ModalOpcFotosPerfil";
import "./Perfil.css";
import "../home/jogador/batalhas/ListaDeBatalhas.css";

export default function Perfil({ qtdeMoedas }) {
  const location = useLocation();
  const navigate = useNavigate();
  let loginADM = false;

  const [opcaoAtivada, setOpcaoAtivada] = useState("Histórico de Batalhas");
  const botoes = ["Histórico de Batalhas", "Perfil"];

  const { user, setUser } = useAuth();
  const idUsuarioLogado = user ? user.idUsuario || user.id : null;

  // ---------------------------------------------------------
  // ESTADOS GERAIS (PERFIL)
  // ---------------------------------------------------------
  const [nome, setNome] = useState(user?.nome ?? "");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Inicia com 1 (padrão), mas o useEffect vai corrigir isso logo em seguida
  const [fotoSelecionada, setFotoSelecionada] = useState(
    user?.idFotoPerfil || 1
  );
  const [modalOpcFoto, setModalOpcFoto] = useState(false);

  // ---------------------------------------------------------
  // ESTADOS DO HISTÓRICO
  // ---------------------------------------------------------
  const [historicoBatalhas, setHistoricoBatalhas] = useState([]);
  const [loadingHistorico, setLoadingHistorico] = useState(false);
  const [idBatalhaSelecionada, setIdBatalhaSelecionada] = useState(null);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  const fotoUrl = getFotoUrlById(fotoSelecionada);

  // ---------------------------------------------------------
  // CARREGAMENTO INICIAL E MONITORAMENTO DE ABAS
  // ---------------------------------------------------------
  useEffect(() => {
    if (!idUsuarioLogado) return;

    // Se estiver na aba Perfil, preenche os dados COM O USER ATUAL
    if (user && opcaoAtivada === "Perfil") {
      setEmail(user.email);
      setNome(user.nome);
      setFotoSelecionada(user.idFotoPerfil || 0);
    }

    // Se estiver na aba Histórico, busca as batalhas
    if (opcaoAtivada === "Histórico de Batalhas") {
      const buscarHistorico = async () => {
        setLoadingHistorico(true);
        try {
          const resposta = await pegarBatalhasIncrito(idUsuarioLogado);
          if (Array.isArray(resposta.data)) {
            setHistoricoBatalhas(resposta.data);
          } else {
            setHistoricoBatalhas([]);
          }
        } catch (err) {
          console.error("Erro ao buscar histórico:", err);
          setHistoricoBatalhas([]);
        } finally {
          setLoadingHistorico(false);
        }
      };
      buscarHistorico();
    }
  }, [user, opcaoAtivada, idUsuarioLogado]);

  // ---------------------------------------------------------
  // FUNÇÕES AUXILIARES
  // ---------------------------------------------------------
  const funMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const fecharModalOpcFoto = () => {
    setModalOpcFoto(false);
  };

  const handleFotoSelecionada = (id) => {
    setFotoSelecionada(id);
  };

  const abrirHistorico = (idBatalha) => {
    setIdBatalhaSelecionada(idBatalha);
    setMostrarHistorico(true);
  };

  const fecharHistorico = () => {
    setMostrarHistorico(false);
    setIdBatalhaSelecionada(null);
  };

  const formatarDataEHora = (data) => {
    if (!data) return "Data Indisponível";
    try {
      const [parteDaData, parteDaHora] = data.split("T");
      const [ano, mes, dia] = parteDaData.split("-");
      const horaMinuto = parteDaHora ? parteDaHora.substring(0, 5) : "";
      return `${dia}/${mes}, ${horaMinuto}`;
    } catch (erro) {
      return data;
    }
  };

  const getStatusVisual = (batalha) => {
    if (batalha.vencedor) {
      if (batalha.vencedor.idUsuario === idUsuarioLogado) return "Vitória 🏆";
      return "Derrota 💀";
    }
    if (batalha.status === "InscricoesAbertas") return "Aguardando";
    return "Em Andamento";
  };

  // ---------------------------------------------------------
  // AÇÃO: TROCAR DADOS DO PERFIL
  // ---------------------------------------------------------
  const senhaTrocada = async (evento) => {
    evento.preventDefault();
    setErro(null);
    setMensagemSucesso(null);

    const dados = { email, senha, nome };
    const idFotoParaAPI = fotoSelecionada;

    try {
      await trocarSenha(dados, idUsuarioLogado);
      if (idFotoParaAPI !== user.idFotoPerfil) {
        await trocarFoto(idUsuarioLogado, idFotoParaAPI);
      }

      const respostaUsuarioAtualizada = await pegarUsuarioPorId(
        idUsuarioLogado
      );

      setUser(respostaUsuarioAtualizada.data);

      setMensagemSucesso("Perfil alterado com sucesso!");
    } catch (err) {
      setErro(err?.response?.data?.message || "Erro ao salvar alterações.");
    }
  };

  // ---------------------------------------------------------
  // RENDERIZAÇÃO DO CONTEÚDO
  // ---------------------------------------------------------
  let conteudoPerfil;

  switch (opcaoAtivada) {
    case "Perfil":
      conteudoPerfil = (
        <>
          {modalOpcFoto && (
            <ModalOpcFoto
              modalAtivado={modalOpcFoto}
              onClose={fecharModalOpcFoto}
              onSelectFoto={handleFotoSelecionada}
            />
          )}
          <h1 className="subtituloPerfil">Redefina suas informações</h1>
          <div className="dados">
            <button
              className="btnOpcFotoPerfil"
              onClick={() => setModalOpcFoto(true)}
            >
              <img className="perfil" src={fotoUrl} alt="Foto de Perfil" />
            </button>

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
          {mostrarHistorico && idBatalhaSelecionada && (
            <TelaHistorico
              onClose={fecharHistorico}
              mostrarHistorico={mostrarHistorico}
              idBatalha={idBatalhaSelecionada}
            />
          )}

          <div className="listaBatalhas container-historico-batalhas">
            {loadingHistorico ? (
              <p className="msg-historico-vazio">Carregando histórico...</p>
            ) : historicoBatalhas.length > 0 ? (
              historicoBatalhas.map((batalha) => (
                <div className="batalha" key={batalha.idBatalha}>
                  <img src={Trofeu} alt="Troféu" />

                  <div className="infoBatalha">
                    <p>{batalha.nomeBatalha}</p>
                    <p>Inscrição: {batalha.custoInscricao} MouseCoin</p>
                    <p>Data: {formatarDataEHora(batalha.dataHorarioInicio)}</p>
                    <p>Prêmio: {batalha.premioTotal} MouseCoin</p>
                    <p className="status-batalha-texto">
                      {getStatusVisual(batalha)}
                    </p>
                  </div>

                  <div className="opcoesBatalha">
                    <button onClick={() => abrirHistorico(batalha.idBatalha)}>
                      Ver Histórico
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="msg-historico-vazio">
                Você ainda não participou de batalhas.
              </p>
            )}
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
