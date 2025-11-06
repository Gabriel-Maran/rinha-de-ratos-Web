export default function ModalEditarBatalha({onClose}) {
    return (
        <>
            <div className="bgModal">
                <div className="containerModal">
                    <button className="sair" onClick={onClose}>
                        ✖
                    </button>
                </div>
            </div>
        </>
    )
}