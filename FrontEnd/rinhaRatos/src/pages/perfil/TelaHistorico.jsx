import { useState } from "react";
import RE from "../../assets/classeRatos/RatoEsgoto.png";
import RL from "../../assets/classeRatos/RatoLaboratorio.png";
import "../../pages/perfil/TelaHistorico.css";

export default function TelaHistorico({ onClose, mostrarHistorico }) {
  const [vencedor, setVencedor] = useState(true);
  const [linhasHistorico, setLinhasHistorico] = useState([]);

  const [imgRato, setImgRato] = useState("");
  const [mensagem, setMensagem] = useState("");

  const addHistorico = () => {
    const mensagemHistorico = {
      img: imgRato,
      msg: mensagem,
    };

    setLinhasHistorico([...linhasHistorico, mensagemHistorico]);
    setImgRato("");
    setMensagem("");
  };

  return (
    <>
      <div className={mostrarHistorico === false ? "bgEscuroOff" : "bgEscuroOn"}>
        <div className="modalResultado">
          <button className="fecharMdResultado" onClick={onClose}>
            ✖
          </button>
          <h1 className="tituloResultado">Resultado da Batalha:</h1>
          <div className={vencedor === true ? "Vitoria" : "Derrota"}>
            <h2>{vencedor === true ? "Você venceu!!!" : "Você perdeu..."}</h2>
             <input
              placeholder="Img"
              value={imgRato}
              onChange={(e) => setImgRato(e.target.value)}
            />
            <input
              placeholder="Mensagem"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
            />
            <button onClick={addHistorico}>Add Histórico</button>
          </div>
          <div className="historicoBatalha">
            <h3>Histórico</h3>
            <div className="bgConteinerHist">
              <div className="conteinerHistorico">
                {linhasHistorico.map((linha, index) => {
                  const esquerda = index % 2 === 0;
                  const imgRato = linha.img === "re" ? RE : RL;
                  return (
                    <>
                      <div
                        className={esquerda ? "regHistEsq" : "regHistDir"}
                        key={index}
                      >
                        {esquerda && (
                          <img
                            className="imgEsquerda"
                            src={imgRato}
                            alt="img-rato"
                          />
                        )}
                        <p>{linha.msg}</p>
                        {!esquerda && (
                          <img
                            className="imgDireita"
                            src={imgRato}
                            alt="img-rato"
                          />
                        )}
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
