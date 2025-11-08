import ImagensRato from "../ImagensRato.jsx";
import "../../css/Corpo.css";

export default function ListaDeRatos({
  ratosUsuario,
  onSelectRato,
  ratoSelecionado,
}) {
  return (
    <>
      <div className="listaRatos">
        {ratosUsuario.map((rato) => (
          <div
            className={
              "displayRato" +
              (ratoSelecionado && ratoSelecionado.id === rato.id
                ? " rato-ativo"
                : "")
            }
            key={rato.id}
          >
            <p>{rato.nome || rato.nomeCustomizado}</p>{" "}
            <img
              className="imagem-rato-lista"
              src={
                ImagensRato[
                  rato.classe?.nomeClasse || rato.classeEsc?.nomeClasse
                ] || ImagensRato["Rato de Esgoto"]
              }
              alt={rato.nome || "Rato"}
            />
          </div>
        ))}
      </div>
    </>
  );
}
