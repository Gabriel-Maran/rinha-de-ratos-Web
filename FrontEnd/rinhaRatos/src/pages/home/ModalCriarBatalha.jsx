import "../../css/home/ADM/ModalCriarBatalha.css";
import "../../css/home/ADM/ModalEditarBatalha.css";
import "../auth/AuthForm.css";

export default function ModalCriarBatalhas({
  nomeBatalha,
  custoInscricao,
  dataHora,
  premio,
  jogador1,
  jogador2,
  iniciar,
  listaBatalhas,
  setNomeBatalha,
  setCustoInscricao,
  setDataHora,
  setPremio,
  setListaBatalhas,
  onClose,
}) {
  const CadastrarBatalha = () => {
    const batalha = {
      id: Date.now(),
      nome: nomeBatalha,
      custo: custoInscricao,
      dataEHora: dataHora,
      premio: premio,
      jogador1: jogador1,
      jogador2: jogador2,
      iniciar: iniciar,
    };

    console.log(dataHora);

    setListaBatalhas([...listaBatalhas, batalha]);
    onClose();

    console.log(listaBatalhas);

    setNomeBatalha("");
    setCustoInscricao(0);
    setDataHora("");
    setPremio(0);
  };

  return (
    <>
      <div className="bgModal">
        <div className="containerModal">
          <button className="sair" onClick={onClose}>
            ✖
          </button>
          <h1 className="tituloAba">Criação da Batalha</h1>
          <div className="criarBatalha">
            <div>
              <h3>Nome</h3>
              <input
                type="text"
                value={nomeBatalha}
                onChange={(e) => setNomeBatalha(e.target.value)}
              />
            </div>
            <div>
              <h3>Inscrição</h3>
              <input
                type="number"
                value={custoInscricao}
                onChange={(e) => setCustoInscricao(Number(e.target.value))}
              />
            </div>
            <div>
              <h3>Data e Hora de Início</h3>
              <input
                type="datetime-local"
                value={dataHora}
                onChange={(e) => setDataHora(e.target.value)}
              />
            </div>
            <div>
              <h3>Prêmio</h3>
              <input
                type="number"
                value={premio}
                onChange={(e) => setPremio(Number(e.target.value))}
              />
            </div>
          </div>
          <button className="btnCriarBatalha" onClick={CadastrarBatalha}>
            Criar
          </button>
        </div>
      </div>
    </>
  );
}
