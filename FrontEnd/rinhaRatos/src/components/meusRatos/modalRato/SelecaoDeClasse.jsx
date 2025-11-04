import "../css/ModalCriacaoRato.css";

export default function SelecaoDeClasse({ onSlctClasse }) {
    const classes = [
        "Rato de Esgoto",
        "Rato de Hospital",
        "Rato de Laboratório",
        "Rato de Fazenda",
        "Rato de Cassino",
        "Rato de Biblioteca"
    ];
    return (
        <>
            <div className="titulo">
                Escolha uma Classe
            </div>
            <div className="opcoesClasse">
                {classes.map((classe, index) => (
                    <button
                        key={classe}
                        onClick={() => onSlctClasse(classe, index)}
                    >
                        {classe}
                    </button>
                ))}
            </div>
        </>
    )
}