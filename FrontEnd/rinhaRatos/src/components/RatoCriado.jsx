import imagensRato from "./ImagensRato";
import "../css/ModalCriacaoRato.css";

export default function RatoCriado({ novoRato, onClose }) {
  const forcaRato = localStorage.getItem("strBase");
  const agilidadeRato = localStorage.getItem("agiBase");
  const vidaRato = localStorage.getItem("hpsBase");
  const InteligenciaRato = localStorage.getItem("intBase")
  const defesaRato = localStorage.getItem("defBase")

  return (
    <>
      <div className="titulo">Criação concluída!</div>
      <div className="imagemENome">
        <img src={imagensRato[novoRato.classeEsc]} />
        <p>{novoRato.nome}</p>
      </div>
      <div className="infoGeral">
        <div className="conteinerTitusEstHabil">
          <div className="caixaEstatisticas">
            <p className="titusEstHabil">Estatísticas Gerais</p>
            <p className="estatisticas">
              Força: {forcaRato}
              <br />
              Agilidade: {agilidadeRato}
              <br />
              Vida: {vidaRato}
              <br />
              Inteligência: {InteligenciaRato}  
              <br />
              Defesa: {defesaRato}
            </p>
          </div>
          <div className="caixaHabilidadeEsc">
            <p className="titusEstHabil">{novoRato.habilidadeEsc}</p>
            <p className="descHabilEsc">{novoRato.descHabilidadeEsc}</p>
          </div>
        </div>
      </div>
      <button className="btnFinalizar" onClick={onClose}>
        Ok
      </button>
    </>
  );
}
