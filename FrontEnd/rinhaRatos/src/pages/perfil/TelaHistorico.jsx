import "../../pages/perfil/TelaHistorico.css";

export default function TelaHistorico({onClose}) {
  return (
    <>
      <div className="conteinerHistorico">
        <div className="conteudoHistorico">
          <h1>Histórico</h1>
          <button onClick={onClose}>Fechar</button>
        </div>
      </div>
    </>
  );
}
