import { useState, useEffect } from "react";
import RatoEsgoto from "../../../assets/classeRatos/RatoEsgoto.png";
import "./ModalEditarBatalha.css";
import {
  gerenciarBatalha,
  removerJogador,
  deletarBatalha, 
} from "../../../Api/Api";
import { useAuth } from "../../../context/AuthContext";

export default function ModalEditarBatalha({
  estadoModal,
  onClose,
  batalhaSendoEditada,
  setListaBatalhas,
}) {
  const { user } = useAuth();
  const idUsuarioLogado = user ? user.idUsuario || user.id : null;

  const [nomeBatalhaEditada, setNomeBatalhaEditada] = useState("");
  const [inscricaoEditada, setInscricaoEditada] = useState(0);
  const [dataHoraEditada, setDataHoraEditada] = useState("");

  const [jogadoresBatalha, setJogadoresBatalha] = useState([]);

  // ESTADOS PARA AS MENSAGENS
  const [erro, setErro] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState(null);

  // Função auxiliar para limpar mensagens automaticamente
  const limparMensagens = () => {
    setTimeout(() => {
      setMensagemSucesso(null);
      setErro(null);
    }, 500);
  };

  // ---------------------------------------------------------
  // CARREGAR DADOS AO ABRIR O MODAL
  // ---------------------------------------------------------
  useEffect(() => {
    if (batalhaSendoEditada) {
      setNomeBatalhaEditada(
        batalhaSendoEditada.nome || batalhaSendoEditada.nomeBatalha || ""
      );
      setInscricaoEditada(
        batalhaSendoEditada.custo || batalhaSendoEditada.custoInscricao || 0
      );
      setDataHoraEditada(
        batalhaSendoEditada.dataEHora ||
          batalhaSendoEditada.dataHorarioInicio || ""
      );

      setErro(null);
      setMensagemSucesso(null);

      const listaParticipantes = [];
      if (batalhaSendoEditada.jogador1)
        listaParticipantes.push(batalhaSendoEditada.jogador1);
      if (batalhaSendoEditada.jogador2)
        listaParticipantes.push(batalhaSendoEditada.jogador2);

      setJogadoresBatalha(listaParticipantes);
    }
  }, [batalhaSendoEditada]);

  // ---------------------------------------------------------
  // REMOVER JOGADOR
  // ---------------------------------------------------------
  const handleRemoverJogador = async (idUsuarioAlvo) => {
    const idBatalhaSeguro =
      batalhaSendoEditada?.idBatalha || batalhaSendoEditada?.id;

    if (!idBatalhaSeguro) return;

    setErro(null);
    setMensagemSucesso(null);

    try {
      await removerJogador(idBatalhaSeguro, idUsuarioAlvo);

      setJogadoresBatalha((listaAtual) =>
        listaAtual.filter((jogador) => jogador.idUsuario !== idUsuarioAlvo)
      );

      setMensagemSucesso("Jogador removido com sucesso!");
      limparMensagens();
    } catch (err) {
      console.error("Erro ao remover:", err);
      setErro(err?.response?.data?.message || "Erro ao remover jogador.");
    }
  };

  // ---------------------------------------------------------
  // EXCLUIR BATALHA
  // ---------------------------------------------------------
  const excluirBatalha = async () => {
    const idBatalha = batalhaSendoEditada?.idBatalha || batalhaSendoEditada?.id;

    if (!idBatalha) return;

    try {
      await deletarBatalha(idBatalha);

      setListaBatalhas((listaAntiga) =>
        listaAntiga.filter((batalha) => batalha.idBatalha !== idBatalha)
      );

      setMensagemSucesso("Batalha excluída com sucesso!");

      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      console.error("Erro ao remover:", err);
      setErro(err?.response?.data?.message || "Erro ao deletar batalha.");
    }
  };

  // ---------------------------------------------------------
  // ATUALIZAR DADOS
  // ---------------------------------------------------------
  const atualizarBatalha = async () => {
    setErro(null);
    setMensagemSucesso(null);

    const idRealDaBatalha =
      batalhaSendoEditada?.idBatalha || batalhaSendoEditada?.id;

    if (!idRealDaBatalha) {
      setErro("Erro interno: ID da batalha inválido.");
      return;
    }

    const dadosAtt = {
      idAdm: idUsuarioLogado,
      idBatalha: idRealDaBatalha,
      nomeBatalha: nomeBatalhaEditada,
      inscricaoMousecoin: inscricaoEditada,
      dataInicio: dataHoraEditada,
    };

    try {
      await gerenciarBatalha(dadosAtt);

      // Atualiza a lista na tela do ADM manualmente para evitar erros
      setListaBatalhas((listaAntiga) =>
        listaAntiga.map((batalha) => {
          if (
            batalha.idBatalha === idRealDaBatalha ||
            batalha.id === idRealDaBatalha
          ) {
            return {
              ...batalha,
              nomeBatalha: nomeBatalhaEditada,
              custoInscricao: inscricaoEditada,
              dataHorarioInicio: dataHoraEditada,
            };
          }
          return batalha;
        })
      );

      setMensagemSucesso("Dados atualizados com sucesso!");

      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      console.error(err);
      setErro(err?.response?.data?.message || "Erro ao atualizar a batalha.");
    }
  };

  const [btnNavModal, setBtnNavModal] = useState("1");
  const botoesNavModal = ["1", "2"];

  let abaModal;
  let txtTituloAba;

  switch (btnNavModal) {
    case "1":
      txtTituloAba = "Informações Gerais";
      abaModal = (
        <div className="editInfoBatalha">
          <div>
            <h3>Nome</h3>
            <input
              type="text"
              value={nomeBatalhaEditada}
              onChange={(e) => setNomeBatalhaEditada(e.target.value)}
            />
          </div>
          <div>
            <h3>Inscrição</h3>
            <input
              type="number"
              value={inscricaoEditada}
              onChange={(e) => setInscricaoEditada(Number(e.target.value))}
            />
          </div>
          <div>
            <h3>Data e Hora de Início</h3>
            <input
              type="datetime-local"
              value={dataHoraEditada}
              onChange={(e) => setDataHoraEditada(e.target.value)}
            />
          </div>

          {erro && <p className="msg-erro-modal">{erro}</p>}
          {mensagemSucesso && (
            <p className="msg-sucesso-modal">{mensagemSucesso}</p>
          )}
        </div>
      );
      break;
    default:
      txtTituloAba = "Participantes";
      abaModal = (
        <>
          <div className="quadroJogadoresBatalha">
            {jogadoresBatalha.length === 0 && (
              <p className="aviso-sem-jogadores">Nenhum jogador inscrito.</p>
            )}

            {jogadoresBatalha.map((jogador) => (
              <div className="qJogadorBatalha" key={jogador.idUsuario}>
                <div className="qFotoENomeJogador">
                  <img
                    className="fotoJogadorBatalha"
                    src={RatoEsgoto}
                    alt="Foto perfil"
                  />
                  <div className="infoJogadorTexto">
                    <p className="nomeJogadorBatalha">{jogador.nome}</p>
                  </div>
                </div>
                <button
                  className="btnRemoverJogador"
                  onClick={() => handleRemoverJogador(jogador.idUsuario)}
                  title="Remover jogador"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          {erro && <p className="msg-erro-modal">{erro}</p>}
          {mensagemSucesso && (
            <p className="msg-sucesso-modal">{mensagemSucesso}</p>
          )}

          <div className="botoesOpcBatalha">
            <button className="btnAtualizarInfo" onClick={atualizarBatalha}>
              Atualizar Dados
            </button>
            <button className="btnExcluir" onClick={excluirBatalha}>
              Excluir Batalha
            </button>
          </div>
        </>
      );
  }

  return (
    <>
      <div className={estadoModal}>
        <div className="containerModal">
          <div className="abasModal">
            {botoesNavModal.map((textoBtn) => (
              <button
                onClick={() => setBtnNavModal(textoBtn)}
                className={
                  textoBtn == btnNavModal ? "btnNavModalAtivado" : "btnNavModal"
                }
                key={textoBtn}
              >
                {textoBtn}
              </button>
            ))}
            <button className="sair" onClick={onClose}>
              ✖
            </button>
          </div>
          <h1 className="tituloAba">{txtTituloAba}</h1>
          {abaModal}
        </div>
      </div>
    </>
  );
}
