import Botao from "./Botao"
import "../css/Corpo.css"

export default function Corpo() {
    return (
        <>
            <div className="corpo-container">
                <Botao
                    acaoBtn={'Adicionar Rato'}
                />
            </div>
        </>
    )
}