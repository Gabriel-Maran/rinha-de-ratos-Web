import { useState, useEffect } from "react";
import RatoEsgoto from "../../../assets/classeRatos/RatoEsgoto.png";
import "./ModalEditarBatalha.css";
import { gerenciarBatalha } from "../../../Api/Api";
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
  const [premioEditado, setPremioEditado] = useState(0);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (batalhaSendoEditada) {
      setNomeBatalhaEditada(batalhaSendoEditada.nome || "");
      setInscricaoEditada(batalhaSendoEditada.custo || 0);
      setDataHoraEditada(batalhaSendoEditada.dataEHora || "");
      setPremioEditado(batalhaSendoEditada.premio || 0);
    }
  }, [batalhaSendoEditada]);

  const atualizarBatalha = async () => {
    const dadosAtt = {
      idAdm: idUsuarioLogado,
      nome: nomeBatalhaEditada,
      custo: inscricaoEditada,
      dataEHora: dataHoraEditada,
    }

    const dados = {
      idAdm: idUsuarioLogado
      
    }

    try {
      const resposta = await gerenciarBatalha(dadosAtt)
      setListaBatalhas(resposta.data);

      const respostaExclusaoUser = await removerJogador()
      onClose();
    } catch (err) {
      setErro(
        err?.response?.data?.message || "Erro ao conectar com o servidor."
      );
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
        </div>
      );
      break;
    default:
      txtTituloAba = "Participantes";
      abaModal = (
        <>
          <div className="quadroJogadoresBatalha">
            <div className="qJogadorBatalha">
              <div className="qFotoENomeJogador">
                <img className="fotoJogadorBatalha" src={RatoEsgoto} />
                <p className="nomeJogadorBatalha">João Pedro</p>
              </div>
              <button>X</button>
            </div>
            <div className="qJogadorBatalha">
              <div className="qFotoENomeJogador">
                <img className="fotoJogadorBatalha" src={RatoEsgoto} />
                <p className="nomeJogadorBatalha">João Pedro</p>
              </div>
              <button>X</button>
            </div>
          </div>
          <div className="botoesOpcBatalha">
            <button
              className="btnAtualizarInfo"
              onClick={atualizarBatalha}
            >
              Atualizar
            </button>
            <button className="btnExcluir">Excluir Batalha</button>
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
