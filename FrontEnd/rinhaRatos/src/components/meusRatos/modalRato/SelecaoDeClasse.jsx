// SelecaoDeClasse.jsx ATUALIZADO
import { useState, useEffect } from "react"; // 1. Importar hooks
import "../../../css/meusRatos/modalRato/ModalCriacaoRato.css";
import { pegarTodasClasses } from "../../../Api/Api.js"; // 2. Importar sua API

export default function SelecaoDeClasse({ onSlctClasse }) {


    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 4. useEffect para buscar os dados QUANDO o componente montar
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                setLoading(true);
                const resposta = await pegarTodasClasses();
                setClasses(resposta.data);
            } catch (err) {
                console.error("Erro ao buscar classes:", err);
                setError("Falha ao carregar as classes.");
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, []); 


    if (loading) {
        return <div className="titulo">Carregando classes...</div>;
    }

    if (error) {
        return <div className="titulo">{error}</div>;
    }

    return (
        <>
            <div className="titulo">
                Escolha uma Classe
            </div>
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
    )
} 