import { useState, useEffect } from "react";
import { useMoedas } from "../../../../context/MoedasContext";
import { compraPacote, pegarPacotes } from "../../../../Api/Api";
import PacotePequeno from "../../../../assets/moedas/MontePequenoMouseCoin.png";
import PacoteMedio from "../../../../assets/moedas/MonteMedioMouseCoin.png";
import PacoteGrande from "../../../../assets/moedas/MonteGrandeMouseCoin.png";
import "./Loja.css";

export default function Loja() {
  const [pacotes, setPacotes] = useState([]);

  // Pedimos o valor E a função de alterar ao Contexto
  const { qtdeMoedas, setQtdeMoedas } = useMoedas();

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const resposta = await pegarPacotes();
        setPacotes(resposta.data);
      } catch (err) {
        console.error("Erro ao buscar pacotes:", err);
      }
    };
    fetchDados();
  }, []);

  const addValorNaConta = async (pacoteClicado) => {
    try {
      const idUsuario = localStorage.getItem("idUsuario");
      console.log("Enviando para o banco:", {
        idPacote: pacoteClicado.idPacote,
        idUsuario: idUsuario,
      });
      await compraPacote(pacoteClicado.idPacote, idUsuario);

      const novoSaldo = qtdeMoedas + pacoteClicado.mousecoinQuantidade;

      setQtdeMoedas(novoSaldo);

      localStorage.setItem("mousecoinSaldo", novoSaldo);
    } catch (err) {
      console.error("Erro ao comprar pacote:", err);
    }
  };

  const imagensPacotes = {
    15: PacotePequeno,
    30: PacoteMedio,
    60: PacoteGrande,
  };

  return (
    <>
      <h1 className="subTituloLoja">Compre aqui suas MouseCoin</h1>
      <div className="pacotesMoedas">
        {pacotes.map((pacote) => (
          <div
            key={pacote.idPacote}
            onClick={() => addValorNaConta(pacote)}
            className="pacote"
          >
            <p className="pacote-quantidade">{pacote.mousecoinQuantidade}</p>
            <div className="infoPacote">
              <img
                src={
                  imagensPacotes[pacote.mousecoinQuantidade] || PacotePequeno
                }
              />
              <div className="valor">R$ {pacote.precoBrl.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
