import ImagensRato from "../../../../components/ImagensRato";
import "./ListaDeRatos.css";

export default function ListaDeRatos({
  ratosUsuario,
  onSelectRato,
  ratoSelecionado,
  mostrarDetalhesRato,
}) {
  return (
    <>
      <div className="listaRatos">
        {ratosUsuario.map((rato) => (
          <div
            onClick={() => mostrarDetalhesRato(rato)}
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
