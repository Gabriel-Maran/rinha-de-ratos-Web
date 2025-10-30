import React from 'react'
import "../css/SelcClassRato.css";

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
                <h1>Escolha uma Classe</h1>
            </div>
            <div className="opcoesClasse">
                {classes.map(classe => (
                    <button
                        key={classe}
                        onClick={() => onSlctClasse(classe)}
                    >
                        {classe}
                    </button>
                ))}
            </div>
        </>
    )
}