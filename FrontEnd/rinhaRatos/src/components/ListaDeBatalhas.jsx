import { useState } from "react";
import trofeu from "../assets/icones/iconeTrofeu.png";
import "../css/Corpo.css";

export default function ListaDeBatalhas() {
  const [listaBatalhas, setListaBatalhas] = useState([]);

  const [nomeBatalha, setNomeBatalha] = useState("");
  const [custoInscricao, setCustoInscricao] = useState(0);
  const [dataHora, setDataHora] = useState();
  const [premio, setPremio] = useState(0);

  const CadastrarBatalha = () => {
    const batalha = {
      id: Date.now(),
      nome: nomeBatalha,
      custo: custoInscricao,
      dataEHora: dataHora,
      premio: premio,
    };

    setListaBatalhas([...listaBatalhas, batalha]);

    console.log(listaBatalhas);

    setNomeBatalha("");
    setCustoInscricao(0);
    setDataHora("");
    setPremio(0);
  };

  return (
    <>
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
              <button>Participar</button>
              <button>Assistir</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
