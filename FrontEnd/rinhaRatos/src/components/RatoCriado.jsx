import imagensRato from "./ImagensRato";
import "../css/ModalCriacaoRato.css";
export default function RatoCriado({
  indexClasse,
  nomeRato,
  habilidades,
  habilEscolhida,
  descHabilidade,
  onClose,
}) {
  return (
    <>
      <div className="titulo">Criação concluída!</div>
      <div className="imagemENome">
        <img src={imagensRato[indexClasse]} />
        <p>{nomeRato}</p>
      </div>
      <div className="infoGeral">
        <div className="conteinerTitusEstHabil">
          <div className="caixaEstatisticas">
            <p className="titusEstHabil">Estatísticas Gerais</p>
            <p className="estatisticas">
              Força: {}
              <br />
              Agilidade: {}
              <br />
              Vida: {}
              <br />
              Inteligência: {}
              <br />
              Defesa: {}
            </p>
          </div>
          <div className="caixaHabilidadeEsc">
            <p className="titusEstHabil">{habilidades[habilEscolhida]}</p>
            <p className="descHabilEsc">{descHabilidade[habilEscolhida]}</p>
          </div>
        </div>
      </div>
      <button className="btnFinalizar" onClick={onClose}>
        Ok
      </button>
    </>
  );
}
