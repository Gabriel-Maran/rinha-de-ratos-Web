import { useState, useEffect } from "react";
import { getFotoUrlById } from "../../perfil/ModalOpcFotosPerfil";
import "./ModalEditarBatalha.css";
import {
  gerenciarBatalha,
  removerJogador,
  deletarBatalha,
  pegarBatalhaPorId,
} from "../../../Api/Api";
import { useAuth } from "../../../context/AuthContext";

export default function ModalEditarBatalha({
  estadoModal,
  onClose,
  batalhaSendoEditada,
  setListaBatalhas,
}) {
  const { user, recarregarUsuario } = useAuth();

  const idUsuarioLogado = user ? user.idUsuario || user.id : null;

  const [nomeBatalhaEditada, setNomeBatalhaEditada] = useState("");
  const [inscricaoEditada, setInscricaoEditada] = useState(0);
  const [dataHoraEditada, setDataHoraEditada] = useState("");
  const [jogadoresBatalha, setJogadoresBatalha] = useState([]);

  const [erro, setErro] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState(null);

  const [btnNavModal, setBtnNavModal] = useState("1");
  const botoesNavModal = ["1", "2"];

  const limparMensagens = () => {
    setTimeout(() => {
      setMensagemSucesso(null);
      setErro(null);
    }, 2500);
  };

  // ---------------------------------------------------------
  // 1. CARREGAR DADOS
  // ---------------------------------------------------------
  useEffect(() => {
    const carregarDadosFrescos = async () => {
      const idBatalha =
        batalhaSendoEditada?.idBatalha || batalhaSendoEditada?.id;

      if (!idBatalha) {
        console.warn("--> ID INVÁLIDO OU NULO. ABORTANDO.");
        return;
      }

      try {
        setErro(null);
        const resposta = await pegarBatalhaPorId(idBatalha);
        const batalhaFresca = resposta.data;

        setNomeBatalhaEditada(
          batalhaFresca.nomeBatalha || batalhaFresca.nome || ""
        );
        setInscricaoEditada(batalhaFresca.custoInscricao ?? 0);

        let dataFormatada =
          batalhaFresca.dataHorarioInicio || batalhaFresca.dataEHora || "";
        if (dataFormatada.length > 16) {
          dataFormatada = dataFormatada.substring(0, 16);
        }
        setDataHoraEditada(dataFormatada);

        const listaParticipantes = [];
        if (
          batalhaFresca.jogador1 &&
          typeof batalhaFresca.jogador1 === "object"
        ) {
          listaParticipantes.push(batalhaFresca.jogador1);
        }
        if (
          batalhaFresca.jogador2 &&
          typeof batalhaFresca.jogador2 === "object"
        ) {
          listaParticipantes.push(batalhaFresca.jogador2);
        }

        setJogadoresBatalha(listaParticipantes);
      } catch (err) {
        console.error("--> ERRO FATAL NA API:", err);
        setErro("Falha ao carregar dados. Verifique o console.");
      }
    };
    carregarDadosFrescos();
  }, [batalhaSendoEditada]);

  // ---------------------------------------------------------
  // 2. REMOVER JOGADOR
  // ---------------------------------------------------------
  const handleRemoverJogador = async (idUsuarioAlvo) => {
    const idBatalhaSeguro =
      batalhaSendoEditada?.idBatalha || batalhaSendoEditada?.id;
    if (!idBatalhaSeguro) return;

    setErro(null);
    setMensagemSucesso(null);

    try {
      await removerJogador(idBatalhaSeguro, idUsuarioAlvo);

      //  Força a atualização do saldo no Header
      await recarregarUsuario();

      setJogadoresBatalha((listaAtual) =>
        listaAtual.filter(
          (jogador) => String(jogador.idUsuario) !== String(idUsuarioAlvo)
        )
      );

      // Atualiza o Pai também
      setListaBatalhas((listaAntiga) =>
        listaAntiga.map((batalha) => {
          if (
            batalha.idBatalha === idBatalhaSeguro ||
            batalha.id === idBatalhaSeguro
          ) {
            const copia = { ...batalha };
            if (copia.jogador1?.idUsuario === idUsuarioAlvo)
              copia.jogador1 = null;
            if (copia.jogador2?.idUsuario === idUsuarioAlvo)
              copia.jogador2 = null;
            return copia;
          }
          return batalha;
        })
      );

      setMensagemSucesso("Jogador removido!");
      limparMensagens();
    } catch (err) {
      console.error("Erro ao remover:", err);
      setErro(err?.response?.data?.message || "Erro ao remover jogador.");
    }
  };

  // ---------------------------------------------------------
  // 3. EXCLUIR BATALHA
  // ---------------------------------------------------------
  const excluirBatalha = async () => {
    const idBatalha = batalhaSendoEditada?.idBatalha || batalhaSendoEditada?.id;
    if (!idBatalha) return;

    try {
      await deletarBatalha(idBatalha);

      await recarregarUsuario();

      setListaBatalhas((antiga) =>
        antiga.filter((b) => b.idBatalha !== idBatalha)
      );
      setMensagemSucesso("Excluída!");
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      console.error(err);
      setErro("Erro ao excluir.");
    }
  };

  // ---------------------------------------------------------
  // 4. ATUALIZAR DADOS
  // ---------------------------------------------------------
  const atualizarBatalha = async () => {
    setErro(null);
    setMensagemSucesso(null);

    const idBatalha = batalhaSendoEditada?.idBatalha || batalhaSendoEditada?.id;
    if (!idBatalha) return;

    const dadosAtt = {
      idAdm: idUsuarioLogado,
      idBatalha: idBatalha,
      nomeBatalha: nomeBatalhaEditada,
      inscricaoMousecoin: inscricaoEditada,
      dataInicio: dataHoraEditada,
    };

    try {
      await gerenciarBatalha(dadosAtt);

      // Atualiza Pai
      setListaBatalhas((antiga) =>
        antiga.map((b) => {
          if (b.idBatalha === idBatalha || b.id === idBatalha) {
            return {
              ...b,
              nomeBatalha: nomeBatalhaEditada,
              custoInscricao: inscricaoEditada,
              dataHorarioInicio: dataHoraEditada,
            };
          }
          return b;
        })
      );

      setMensagemSucesso("Atualizado!");
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
      setErro("Erro ao atualizar.");
    }
  };

  // ---------------------------------------------------------
  // RENDERIZAÇÃO
  // ---------------------------------------------------------
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
            <h3>Data e Hora</h3>
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
              <p className="aviso-sem-jogadores">Nenhum jogador.</p>
            )}
            {jogadoresBatalha.map((jogador) => (
              <div className="qJogadorBatalha" key={jogador.idUsuario}>
                <div className="qFotoENomeJogador">
                  <img
                    className="fotoJogadorBatalha"
                    src={getFotoUrlById(jogador.idFotoPerfil || 0)}
                    alt={jogador.nome}
                  />
                  <div className="infoJogadorTexto">
                    <p className="nomeJogadorBatalha">{jogador.nome}</p>
                  </div>
                </div>
                <button
                  className="btnRemoverJogador"
                  onClick={() => handleRemoverJogador(jogador.idUsuario)}
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
              Atualizar
            </button>
            <button className="btnExcluir" onClick={excluirBatalha}>
              Excluir
            </button>
          </div>
        </>
      );
  }

  return (
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
  );
}
