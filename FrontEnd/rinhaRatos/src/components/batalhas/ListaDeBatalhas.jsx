import { useState } from "react";
import trofeu from "../../assets/icones/IconeTrofeu.png"
import ModalEscolherRatoBatalha from "./ModalEscolherRatoBatalha";
import "../../css/batalhas/ListaDeBatalhas.css";

export default function ListaDeBatalhas({ ratosUsuario, ratoParaBatalhar }) {
  const [listaBatalhas, setListaBatalhas] = useState([]);

  const [nomeBatalha, setNomeBatalha] = useState("");
  const [custoInscricao, setCustoInscricao] = useState(0);
  const [dataHora, setDataHora] = useState();
  const [premio, setPremio] = useState(0);
  const [inscrito, setInscrito] = useState(false);

  const CadastrarBatalha = () => {
    const batalha = {
      id: Date.now(),
      nome: nomeBatalha,
      custo: custoInscricao,
      dataEHora: dataHora,
      premio: premio,
      inscrito: inscrito,
    };

    setListaBatalhas([...listaBatalhas, batalha]);

    console.log(listaBatalhas);

    setNomeBatalha("");
    setCustoInscricao(0);
    setDataHora("");
    setPremio(0);
  };

  const [btnOpcBatalhas, setBtnOpcBatalhas] = useState("Todas");
  const botoesOpcBatalha = ["Todas", "Inscrições"];

  const [ativarModal, setAtivarModal] = useState(false);

  const fecharSelecaoRato = () => {
    setAtivarModal(!ativarModal);
    console.log(ratosUsuario);
  };

  let conteudoOpcaoBatalhas;

  switch (btnOpcBatalhas) {
    case "Todas":
      conteudoOpcaoBatalhas = (
        <>
          {ativarModal && (
            <ModalEscolherRatoBatalha
              onClose={fecharSelecaoRato}
              ratosUsuario={ratosUsuario}
              ratoParaBatalhar={ratoParaBatalhar}
            />
          )}
          <div className="addBatalha">
            <input
              type="text"
              value={nomeBatalha}
              placeholder="Nome da balalha"
              onChange={(e) => setNomeBatalha(e.target.value)}
            />
            <input
              type="number"
              value={custoInscricao}
              placeholder="Custo"
              onChange={(e) => setCustoInscricao(Number(e.target.value))}
            />
            <input
              type="datetime-local"
              value={dataHora}
              placeholder="Data e hora"
              onChange={(e) => setDataHora(e.target.value)}
            />
            <input
              type="number"
              value={premio}
              placeholder="Prêmio"
              onChange={(e) => setPremio(Number(e.target.value))}
            />
            <button onClick={CadastrarBatalha}>Adicionar</button>
          </div>
          <div className="listaBatalhas">
            {listaBatalhas.map((batalha) => (
              <div className="batalha" key={batalha.id}>
                <img src={trofeu} />
                <div className="infoBatalha">
                  <p>{batalha.nome}</p>
                  <p>Inscrição: {batalha.custo} MouseCoin</p>
                  <p>Data e Hora: {batalha.dataEHora}</p>
                  <p>Prêmio: {batalha.premio} MouseCoin</p>
                </div>
                <div className="opcoesBatalha">
                  <button onClick={() => setAtivarModal(true)}>
                    Participar
                  </button>
                </div>
              </div>
            ))}
          </div>
          {ativarModal}
        </>
      );
      break;
    case "Inscrições":
      conteudoOpcaoBatalhas = (
        <div className="listaBatalhas">
          {listaBatalhas.map((batalha) => (
            <div className="batalha" key={batalha.id}>
              <img src={trofeu} />
              <div className="infoBatalha">
                <p>{batalha.nome}</p>
                <p>Inscrição: {batalha.custo} MouseCoin</p>
                <p>Data e Hora: {batalha.dataEHora}</p>
                <p>Prêmio: {batalha.premio} MouseCoin</p>
              </div>
              <div className="opcoesBatalha">
                <button>Jogar</button>
              </div>
            </div>
          ))}
        </div>
      );
  }

  return (
    <>
      <header className="opcoesAbaBatalha">
        {botoesOpcBatalha.map((btnOpcBatalha) => (
          <button
            key={btnOpcBatalha}
            className={
              btnOpcBatalhas == btnOpcBatalha
                ? "btnOpcaoBatalhasAtivo"
                : "btnOpcaoBatalhas"
            }
            onClick={() => setBtnOpcBatalhas(btnOpcBatalha)}
          >
            {btnOpcBatalha}
          </button>
        ))}
      </header>
      {conteudoOpcaoBatalhas}
    </>
  );
}
