import "../home/jogador/HomeJogador.css";

export default function ModalOpcFoto({ modalAtivado, onClose }) {
  const listafotosPerfil = []

  return (
    <>
      <div className={modalAtivado ? "bgModalAtivo" : "bgModal"}>
        <div className="containerModal">
          <button className="sair" onClick={onClose}>
            ✖
          </button>
        </div>
        {listafotosPerfil.map((foto) => (
          <div className="fotoPerfil" key={foto.id}>
            <img src={foto.url} />
          </div>
        ))  }
      </div>
    </>
  );
}
