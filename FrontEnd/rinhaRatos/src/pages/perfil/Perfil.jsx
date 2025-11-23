import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  trocarSenha,
  trocarFoto,
  pegarUsuarioPorId,
  buscarHistoricoSemBto,
  pegarBatalhasCriadas,
  baixarPdf,
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
  // CARREGAMENTO INICIAL
  // ---------------------------------------------------------
  useEffect(() => {
    if (idUsuarioLogado === null) {
      navigate("/login");
    }
  }, [idUsuarioLogado, navigate]);

  useEffect(() => {
    if (!idUsuarioLogado) return;

    if (user && opcaoAtivada === "Perfil") {
      setEmail(user.email);
      setNome(user.nome);
      setFotoSelecionada(user.idFotoPerfil || 0);
    }

    if (opcaoAtivada === "Histórico de Batalhas") {
      // FIX: Adicionado .toUpperCase() e ? para evitar erro se tipoConta vier minúsculo ou nulo
      if (user.tipoConta?.toUpperCase() === "JOGADOR") {
        const buscarHistorico = async () => {
          setLoadingHistorico(true);
          try {
            console.log("Buscando histórico para ID:", idUsuarioLogado);
            const resposta = await buscarHistoricoSemBto(idUsuarioLogado);
            console.log("Resposta Histórico:", resposta.data);

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
      } else {
        // Lógica para ADM
        const buscarHistorico = async () => {
          setLoadingHistorico(true);
          try {
            const resposta = await pegarBatalhasCriadas(idUsuarioLogado);
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
    }
  }, [user, opcaoAtivada, idUsuarioLogado]);

  // ---------------------------------------------------------
  //  BAIXAR O HISTORICO EM PDF
  // ---------------------------------------------------------
  
  // BLOB(Binary Large Object)  sem usar o blob o axios tenta abrir o arquivo e ler um json,
  // já com o blob você diz para ele apenas guardar os dados  brutos em uma caixa,
  // com isso o javScript   pega os binários exatos e salva na memória.

  // 1. Cria uma URL temporária para o arquivo binário createObjectURL(Blob).
  // 2. Cria um link HTML invisível(createElement).
  // 3. Define o nome do arquivo que será baixado(setAttribute).
  // 4. Adiciona no corpo do site, clica e remove(appendChild).

  const baixarHistorico = async () => {
    setMensagemSucesso(null);
    setErro(null);
    try {
      const resposta = await baixarPdf(idUsuarioLogado);

      const url = window.URL.createObjectURL(new Blob([resposta.data]));
      const link = document.createElement("a");
      link.href = url;

      link.setAttribute(
        "download",
        `Historico_Batalhas_${idUsuarioLogado}.pdf`
      );

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMensagemSucesso("Relatório baixado com sucesso!");
    } catch (err) {
      console.error(err);
      setErro("Erro ao baixar o PDF. Tente novamente.");
    }
  };

  // ---------------------------------------------------------
  //  TROCAR DADOS
  // ---------------------------------------------------------
  const senhaTrocada = async (evento) => {
    evento.preventDefault();
    setErro(null);
    setMensagemSucesso(null);

    const dados = { email, nome, senha };

    try {
      await trocarSenha(dados, idUsuarioLogado);

      if (fotoSelecionada !== user.idFotoPerfil) {
        await trocarFoto(idUsuarioLogado, fotoSelecionada);
      }

      const respostaUsuarioAtualizada = await pegarUsuarioPorId(
        idUsuarioLogado
      );
      setUser(respostaUsuarioAtualizada.data);

      setSenha("");
      setMensagemSucesso("Perfil alterado com sucesso!");
    } catch (err) {
      console.error(err);
      setErro(err?.response?.data?.message || "Erro ao salvar alterações.");
    }
  };

  const deslogar = () => {
    setUser(null);
    sessionStorage.removeItem("idUsuario");
    navigate("/login");
  };

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
  // RENDERIZAÇÃO
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
              fotoAtual={fotoSelecionada}
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
                  placeholder: "Nova senha",
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
            <div className="acoesPerfil">
              <button className="btnSalvar" onClick={senhaTrocada}>
                Salvar
              </button>
              <button className="btnDeslogar" onClick={deslogar}>
                Deslogar
              </button>
            </div>
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
              usuarioLogado={user}
            />
          )}
          <h1 className="subTituloBatalhas">Batalhas Concluídas</h1>
          <div className="listaBatalhasPerfil">
            {loadingHistorico ? (
              <p className="msg-historico-vazio">Carregando batalhas...</p>
            ) : historicoBatalhas.length > 0 ? (
              // Map direto sem filter, assumindo que a API já filtra ou queremos ver tudo
              historicoBatalhas.map((batalha) => (
                <div className="batalha" key={batalha.idBatalha}>
                  <img src={Trofeu} alt="Troféu" />
                  <div className="infoBatalha">
                    <p>{batalha.nomeBatalha}</p>
                    <p>Inscrição: {batalha.custoInscricao} MouseCoin</p>
                    <p>
                      Data: {formatarDataEHora(batalha.dataHorarioInicio)}
                    </p>
                    <p>Prêmio: {batalha.premioTotal} MouseCoin</p>
                    <p className="status-batalha-texto">
                      {getStatusVisual(batalha)}
                    </p>
                  </div>
                  <div className="opcoesBatalhaPerfil">
                    <button
                      className="btnVerHistorico"
                      onClick={() => abrirHistorico(batalha.idBatalha)}
                    >
                      Ver Histórico
                    </button>
                    <button
                      className="btnBaixarRelatorio"
                      onClick={baixarHistorico}
                    >
                      Baixar Relatório
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