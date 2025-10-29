import "../css/SelcClassRato.css";

export default function SelcClassRato({ ativado, setAtivado, setEstilo, setEstilo2 }) {
  const handleClose = () => {
    setAtivado(false);
    setEstilo("corpo-container");
    setEstilo2("display");
  }
  if (ativado) {
    return (
      <>
        <div className="bgSelcClass">
          <div className="containerSelcClass">
            <div className="titulo">
              <h1>Escolha uma Classe</h1>
            </div>
            <button className="sair" onClick={handleClose}>
              ✖
            </button>
          </div>
          <div className="opcoesClasse">
            <button>Rato de Esgoto</button>
            <button>Rato de Hospital</button>
            <button>Rato de Laboratório</button>
            <button>Rato de Fazenda</button>
            <button>Rato de Cassino</button>
            <button>Rato de Biblioteca</button>
          </div>
        </div>
      </>
    );
  }
  return null;
}
