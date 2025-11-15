import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { compraPacote, pegarPacotes } from "../../../../Api/Api";
import PacotePequeno from "../../../../assets/moedas/MontePequenoMouseCoin.png";
import PacoteMedio from "../../../../assets/moedas/MonteMedioMouseCoin.png";
import PacoteGrande from "../../../../assets/moedas/MonteGrandeMouseCoin.png";
import "./Loja.css";

export default function Loja() {
  const { user, setUser } = useAuth();
  const idUsuarioLogado = user.idUsuario || user.id;
  const [pacotes, setPacotes] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchDados = async () => {
      try {
        const resposta = await pegarPacotes();
        setPacotes(resposta.data);
      } catch (err) {
        console.error("Erro ao buscar pacotes:", err);
      }
    };
    fetchDados();
  }, [user]);

  const addValorNaConta = async (pacoteClicado) => {
    try {
      await compraPacote(pacoteClicado.idPacote, idUsuarioLogado);

     const novoSaldo = user.mousecoinSaldo + pacoteClicado.mousecoinQuantidade;

     // Atualiza o estado global com o novo objeto de usuário
      setUser((userAntigo) => ({
        ...userAntigo, // Copia todos os dados antigos
        mousecoinSaldo: novoSaldo, 

      }));
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
