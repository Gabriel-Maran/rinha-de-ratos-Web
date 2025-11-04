import { useState } from "react";
import Header from "../components/comuns/Header"
import "../css/Corpo.css";

export default function Perfil() {

    const [opcaoAtivada, setOpcaoAtivada] = useState("Meus ratos");
    const botoes = ["Meus ratos", "Batalhas", "Ranking", "Loja"];
    return (
        <>
            <Header />
            <div className="corpo-container">
                <div className={"opcoes"}>
                    {botoes.map((botao) => (
                        <button
                            key={botao}
                            className={opcaoAtivada == botao ? "opcaoAtiva" : ""}
                            onClick={() => setOpcaoAtivada(botao)}
                        >
                            {botao}
                        </button>
                    ))}
                </div>
            </div>
        </>
    )
}