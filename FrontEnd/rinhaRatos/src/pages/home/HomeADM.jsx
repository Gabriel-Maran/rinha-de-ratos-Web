import { useState } from "react";
import Header from "../../components/comuns/Header";
import RatoEsgoto from "../../assets/classeRatos/RatoEsgoto.png"
import trofeu from "../../assets/icones/IconeTrofeu.png"
import ModalEditarBatalha from "./ModalEditarBatalha";
import ModalCriarBatalha from "./ModalCriarBatalha"
import "../../css/home/ADM/homeADM.css";

export default function HomeADM() {
    const [opcaoAtivada, setOpcaoAtivada] = useState("Batalhas");
    const botoes = ["Batalhas", "Ranking"];

    const [listaBatalhas, setListaBatalhas] = useState([]);

    const [nomeBatalha, setNomeBatalha] = useState("");
    const [custoInscricao, setCustoInscricao] = useState(0);
    const [dataHora, setDataHora] = useState();
    const [premio, setPremio] = useState(0);
    const [jogador1, setJogador1] = useState(null);
    const [jogador2, setJogador2] = useState(null);
    const [iniciar, setIniciar] = useState(false);

    const [editarBatalha, setEditarBatalha] = useState(false);
    const [criarBatalha, setCriarBatalha] = useState(false)

    const fecharModal = () => {
        setEditarBatalha(false);
        setCriarBatalha(false);
    };

    const CadastrarBatalha = () => {
        const batalha = {
            id: Date.now(),
            nome: nomeBatalha,
            custo: custoInscricao,
            dataEHora: dataHora,
            premio: premio,
            jogador1: jogador1,
            jogador2: jogador2,
            iniciar: iniciar,
        };

        setListaBatalhas([...listaBatalhas, batalha]);

        console.log(listaBatalhas);

        setNomeBatalha("");
        setCustoInscricao(0);
        setDataHora("");
        setPremio(0);
        setJogador1(null);
        setJogador2(null);
        setIniciar(false);
    };


    const [listaJogadores, setListaJogadores] = useState([]);
    const [nome, setNome] = useState("");
    const [vitorias, setVitorias] = useState(0);
    const [posicoes, setPosicoes] = useState(1);

    const CadastrarJogador = () => {
        setPosicoes(posicoes + 1);
        const jogador = {
            id: Date.now(),
            posicao: posicoes,
            nome: nome,
            vitorias: vitorias,
        };

        setListaJogadores([...listaJogadores, jogador]);

        console.log(listaJogadores);

        setNome("");
        setVitorias(0);
    };

    let conteudoHomeAdm;

    switch (opcaoAtivada) {
        case "Ranking": conteudoHomeAdm = (
            <>
                <h1 className="subTitulo">Batalhas Vencidas</h1>
                <input
                    type="text"
                    value={nome}
                    placeholder="Nome do jogador"
                    onChange={(e) => setNome(e.target.value)}
                />
                <input
                    type="number"
                    value={vitorias}
                    placeholder="Vitórias"
                    onChange={(e) => setVitorias(Number(e.target.value))}
                />
                <button onClick={CadastrarJogador}>Adicionar</button>
                <div className="listaJogadores">
                    {listaJogadores.map((jogador) => (
                        <div className="jogador" key={jogador.id}>
                            <div className="posicaoJogador">
                                <p>{jogador.posicao}º</p>
                            </div>
                            <img src={RatoEsgoto} />
                            <div className="nomeEVitorias">
                                <p className="nomeJogador">{jogador.nome}</p>
                                <div className="vitorias">
                                    <p>{jogador.vitorias}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
            break;
        default:
            conteudoHomeAdm = conteudoHomeAdm = (
                <>
                    {criarBatalha && (
                        <ModalCriarBatalha
                        nomeBatalha = {nomeBatalha}
                        custoInscricao = {custoInscricao}
                        dataEHora = {dataHora}
                        premio = {premio}
                        setNomeBatalha = {setNomeBatalha}
                        setCustoInscricao = {setCustoInscricao}
                        setDataHora = {setDataHora}
                        setPremio = {setPremio}
                        onClose={fecharModal}
                        />
                    )}
                    {editarBatalha && (
                        <ModalEditarBatalha
                            onClose={fecharModal}
                            setNomeBatalha={setNomeBatalha}
                            setCustoInscricao={setCustoInscricao}
                            setDataHora={setDataHora}
                            setPremio={setPremio}
                        />
                    )}
                    <button onClick={() => setCriarBatalha(true)}>Adicionar</button>
                    <div className="addBatalha">
                        <input
                            type="text"
                            value={nomeBatalha}
                            placeholder="Nome da balalha"
                            onChange={(e) => setNomeBatalha(e.target.value)}
                        />
                        <input
                            type="number"
                            value={custoInscricao}
                            placeholder="Custo"
                            onChange={(e) => setCustoInscricao(Number(e.target.value))}
                        />
                        <input
                            type="datetime-local"
                            value={dataHora}
                            placeholder="Data e hora"
                            onChange={(e) => setDataHora(e.target.value)}
                        />
                        <input
                            type="number"
                            value={premio}
                            placeholder="Prêmio"
                            onChange={(e) => setPremio(Number(e.target.value))}
                        />
                    </div>
                    <div className="listaBatalhas">
                        {listaBatalhas.map((batalha) => (
                            <div className="batalha" key={batalha.id}>
                                <img src={trofeu} />
                                <div className="infoBatalha">
                                    <p>{batalha.nome}</p>
                                    <p>Inscrição: {batalha.custo} MouseCoin</p>
                                    <p>Data e Hora: {batalha.dataEHora}</p>
                                    <p>Prêmio: {batalha.premio} MouseCoin</p>
                                </div>
                                <button className="btnGerenciar" onClick={() => setEditarBatalha(true)}>
                                    Gerenciar
                                </button>
                            </div>
                        ))}
                    </div>
                    {criarBatalha}
                    {editarBatalha}
                </>
            );
    }
    return (
        <>
            <Header />
            <div className="corpo-container">
                <div className={"opcoes"}>
                    {botoes.map((botao) => (
                        <button
                            key={botao}
                            className={opcaoAtivada == botao ? "opcaoAtiva" : ""}
                            onClick={() => setOpcaoAtivada(botao)}
                        >
                            {botao}
                        </button>
                    ))}
                </div>
                <div className="conteudo-principal">{conteudoHomeAdm}</div>
            </div>
        </>
    )
}