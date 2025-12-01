import "./SelecaoDeClasse.css";

export default function SelecaoDeClasse({
  onSlctClasse,
  classes,
  loading,
  error,
}) {
  
  // ---------------------------------------------------------
  // RENDERIZAÇÃO CONDICIONAL
  // ---------------------------------------------------------

  // Padrão de Retorno Antecipado:
  // Antes de tentar desenhar a tela principal, verificamos se existem condições impeditivas.
  
  // 1. Loading: Se os dados ainda estão vindo da API, retornamos um feedback visual simples
  //    e encerramos a função aqui. O código abaixo do 'return' não é executado.

  // 2. Tratamento de Erro: Se algo falhou na requisição, mostramos a mensagem de erro
  //    para que o usuário saiba o que houve, em vez de deixar a tela em branco.
  if (loading) {
    return <div className="titulo">Carregando classes...</div>;
  }

  if (error) {
    return <div className="titulo">{error}</div>;
  }

  // ---------------------------------------------------------
  // RENDERIZAÇÃO DA LISTA (MAIN CONTENT)
  // ---------------------------------------------------------

  // Se passou pelos 'ifs' acima, significa que temos dados prontos em 'classes'.
  
  // .map(): Itera sobre o array de classes e cria um botão para cada uma.
  // onClick: Quando o botão é clicado, executamos a função do Pai (onSlctClasse)
  // passando o OBJETO INTEIRO (classeObj). Isso é útil porque o Pai já recebe
  //          o ID, o nome e a descrição de uma vez só, sem precisar buscar de novo.
  return (
    <>
      <div className="titulo">Escolha uma Classe</div>
      <div className="opcoesClasse">
        {classes.map((classeObj) => (
          <button
            key={classeObj.idClasse}
            onClick={() => onSlctClasse(classeObj)}
          >
            {classeObj.nomeClasse}
          </button>
        ))}
      </div>
    </>
  );
}