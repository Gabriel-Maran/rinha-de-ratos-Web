import ImagensRato from "../../../../components/ImagensRato";
import "./ListaDeRatos.css";

export default function ListaDeRatos({
  ratosUsuario,
  ratoSelecionado,
  mostrarDetalhesRato,
}) {
  // ---------------------------------------------------------
  // RENDERIZAÇÃO DE LISTA E ESTILIZAÇÃO DINÂMICA
  // ---------------------------------------------------------

  // 1. key={rato.id}: Obrigatório para o React. Ajuda o algoritmo de reconciliação (Virtual DOM)
  //    a identificar quais itens mudaram, foram adicionados ou removidos, otimizando a performance.

  // 2. Estilização Condicional (ClassName):
  //    Verificamos se o rato atual do loop é o mesmo que está guardado no estado 'ratoSelecionado'.
  //    Se for (ratoSelecionado.id === rato.id), concatenamos a string " rato-ativo" na classe CSS.
  //    Isso permite destacar visualmente o item clicado (ex: borda colorida).

  // 3. Lógica de Fallback (||) para Imagens e Nomes:
  //    - Nome: Se 'rato.nome' não existir, usa 'rato.nomeCustomizado'.
  //    - Imagem: Tenta acessar a imagem pela chave da classe (ex: ImagensRato["Guerreiro"]).
  //      Se não encontrar, carrega o "Rato de Esgoto" como padrão.
  //      Evitando  que a interface quebre ou mostre imagem quebrada.

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
