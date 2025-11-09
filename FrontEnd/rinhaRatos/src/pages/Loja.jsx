import PacotePequeno from "../assets/moedas/MontePequenoMouseCoin.png";
import PacoteMedio from "../assets/moedas/MonteMedioMouseCoin.png";
import PacoteGrande from "../assets/moedas/MonteGrandeMouseCoin.png";
import "../css/loja/loja.css";

export default function Loja({ qtdeMoedas, setQtdeMoedas }) {
  const addValorNaConta = (valor) => {
    setQtdeMoedas(qtdeMoedas + valor);
  };
  return (
    <>
      <h1 className="subTituloLoja">Compre aqui suas MouseCoin</h1>
      <div className="pacotesMoedas">
        <div onClick={() => addValorNaConta(15)} className="pacote">
          <p>15 Moedas</p>
          <div className="infoPacote">
            <img src={PacotePequeno} />
            <div className="valor">R$ 30,00</div>
          </div>
        </div>
        <div onClick={() => addValorNaConta(30)} className="pacote">
          <p>30 Moedas</p>
          <div className="infoPacote">
            <img src={PacoteMedio} />
            <div className="valor">R$ 60,00</div>
          </div>
        </div>
        <div onClick={() => addValorNaConta(60)} className="pacote">
          <p>60 Moedas</p>
          <div className="infoPacote">
            <img src={PacoteGrande} />
            <div className="valor">R$ 90,00</div>
          </div>
        </div>
      </div>
    </>
  );
}
