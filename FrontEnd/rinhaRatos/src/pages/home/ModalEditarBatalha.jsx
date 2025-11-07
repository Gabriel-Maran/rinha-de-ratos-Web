import { useState } from "react"
import RatoEsgoto from "../../assets/classeRatos/RatoEsgoto.png"
import "../../css/home/ADM/ModalEditarBatalha.css"

export default function ModalEditarBatalha({ onClose }) {
    const [nomeBatalhaAtual, setNomeBatalhaAtual] = useState()
    const [inscricaoAtual, setInscricaoAtual] = useState()
    const [dataHoraAtual, setDataHoraAtual] = useState()
    const [premioAtual, setPremioAtual] = useState()

    const [btnNavModal, setBtnNavModal] = useState("1")
    const botoesNavModal = ["1", "2"]

    let abaModal;
    let txtTituloAba;

    switch (btnNavModal) {
        case "1":
            txtTituloAba = "Informações Gerais"
            abaModal = (
                <div className="editInfoBatalha">
                    <div>
                        <h3>Nome</h3>
                        <input type="text" value={nomeBatalhaAtual} onChange={(e) => setNomeBatalhaAtual(e.target.value)} />
                    </div>
                    <div>
                        <h3>Inscrição</h3>
                        <input type="number" value={inscricaoAtual} onChange={(e) => setInscricaoAtual(Number(e.target.value))} />
                    </div>
                    <div>
                        <h3>Data e Hora de Início</h3>
                        <input type="datetime-local" value={dataHoraAtual} onChange={(e) => setDataHoraAtual(e.target.value)} />
                    </div>
                    <div>
                        <h3>Prêmio</h3>
                        <input type="number" value={premioAtual} onChange={(e) => setPremioAtual(Number(e.target.value))} />
                    </div>
                </div>
            )
            break;
        default:
            txtTituloAba = "Participantes"
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
                    </div >
                    <div className="botoesOpcBatalha">
                        <button className="btnAtualizarInfo">Atualizar</button>
                        <button className="btnExcluir">Excluir Batalha</button>
                    </div>
                </>
            )
    }

    return (
        <>
            <div className="bgModal">
                <div className="containerModal">
                    <div className="abasModal">
                        {botoesNavModal.map((textoBtn) => (
                            <button
                                onClick={() => setBtnNavModal(textoBtn)}
                                className={textoBtn == btnNavModal ? "btnNavModalAtivado" : "btnNavModal"}
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
    )
}