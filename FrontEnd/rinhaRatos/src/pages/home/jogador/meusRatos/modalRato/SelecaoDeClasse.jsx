import "./ModalCriacaoRato.css";

export default function SelecaoDeClasse({ onSlctClasse, classes, loading, error }) {

  if (loading) {
    return <div className="titulo">Carregando classes...</div>;
  }

  if (error) {
    return <div className="titulo">{error}</div>;
  }

  return (
    <>
      <div className="titulo">Escolha uma Classe</div>
      <div className="opcoesClasse">
        {classes.map((classeObj) => (
          <button
            key={classeObj.idClasse}
            onClick={() => onSlctClasse(classeObj)}
          >
            {classeObj.nomeClasse}
          </button>
        ))}
      </div>
    </>
  );
}
