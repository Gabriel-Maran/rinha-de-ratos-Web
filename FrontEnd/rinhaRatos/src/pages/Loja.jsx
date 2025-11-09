import PacotePequeno from "../assets/moedas/MontePequenoMouseCoin.png";
import PacoteMedio from "../assets/moedas/MonteMedioMouseCoin.png";
import PacoteGrande from "../assets/moedas/MonteGrandeMouseCoin.png";
import "../css/loja/loja.css";

export default function Loja({ qtdeMoedas, setQtdeMoedas }) {
  const addValorNaConta = (valor) => {
    setQtdeMoedas(qtdeMoedas + valor);
  };

  const [pacotes, setPacotes] = useState([]);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const resposta = await pegarMoedas();
        setPacotes(resposta.data);
      } catch (err) {
        console.error("Erro ao buscar pacotes:", err);
      }
    };

    fetchDados();
  }, []);

  return (
    <>
      <h1 className="subTituloLoja">Compre aqui suas MouseCoin</h1>
      <div className="pacotesMoedas">
        {pacotes.map((pacote) => (
          <div
            key={pacote.idPacote}
            onClick={() => addValorNaConta(pacote.mousecoinQuantidade)}
            className="pacote"
          >
            <div className="infoPacote">
              <img
                src={PacotePequeno}
              />
              <div className="valor">R$ {pacote.precoBrl.toFixed(2)}</div>
            </div>
          </div>
        ))}

        <div
          onClick={() => addValorNaConta(pacote.mousecoinQuantidade)}
          className="pacote"
        >
          <p>{pacote.mousecoinQuantidade}</p>
          <div className="infoPacote">
            <img src={PacoteMedio} />
            <div className="valor">{pacote.precoBrl}</div>
          </div>
        </div>
        <div
          onClick={() => addValorNaConta(pacote.mousecoinQuantidade)}
          className="pacote"
        >
          <p>{pacote.mousecoinQuantidade}</p>
          <div className="infoPacote">
            <img src={PacoteGrande} />
            <div className="valor">{pacote.precoBrl}</div>
          </div>
        </div>
      </div>
    </>
  );
}
