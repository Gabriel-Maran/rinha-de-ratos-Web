export default function ModalCriarBatalhas({
    nomeBatalha,
    inscricao,
    dataHora,
    premio,
    setNomeBatalha,
    setInscricao,
    setDataHora,
    setPremio,
    onClose
}) {
    return (
        <>
            <div className="bgModal">
                <div className="containerModal">
                    <button className="sair" onClick={onClose}>
                        ✖
                    </button>
                    <h1 className="tituloAba">Criação Batalha</h1>
                    <div className="editInfoBatalha">
                        <div>
                            <h3>Nome</h3>
                            <input type="text" value={nomeBatalha} onChange={(e) => setNomeBatalha(e.target.value)} />
                        </div>
                        <div>
                            <h3>Inscrição</h3>
                            <input type="number" value={inscricao} onChange={(e) => setInscricao(Number(e.target.value))} />
                        </div>
                        <div>
                            <h3>Data e Hora de Início</h3>
                            <input type="datetime-local" value={dataHora} onChange={(e) => setDataHora(e.target.value)} />
                        </div>
                        <div>
                            <h3>Prêmio</h3>
                            <input type="number" value={premio} onChange={(e) => setPremio(Number(e.target.value))} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}