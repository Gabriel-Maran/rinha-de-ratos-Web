import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fazerCadastro = (dadosCadastro) => {
  return apiClient.post("/usuario/cadastro", dadosCadastro);
};

export const fazerLogin = (dadosLogin) => {
  return apiClient.post("/usuario/login", dadosLogin);
};

export const esqueceuSenha = (dadosNovaSenha) => {
  return apiClient.post("/usuario/changeUser/password", dadosNovaSenha);
};

export const trocarSenha = (dadosNovaSenha, idUsuario) => {
  return apiClient.put(`usuario/${idUsuario}/changeUser/basic`, dadosNovaSenha);
};

export const trocarFoto = (idUsuario, idFoto) => {
  return apiClient.post(`usuario/changeFoto/${idUsuario}/${idFoto}`);
};

export const ratosUsuario = (dadosRatos) => {
  return apiClient.post("/rato/cadastro", dadosRatos);
};

export const pegarUsuarioPorId = async (id) => {
  return await apiClient.get(`/usuario/${id}`);
};
0
export const pegarRatosDoUsuario = async (idUsuario) => {
  return await apiClient.get(`/rato/dousuario/${idUsuario}`);
};


export const pegarTodasClasses = async () => {
  return await apiClient.get("/classe/todos");
};

export const pegarDescricaoHabilidades = async () => {
  return await apiClient.get("habilidade/todos");
};

// pego todo os pacotes da loja
export const pegarPacotes = async () => {
  return await apiClient.get("lojapacotes/todos");
};

// faz a compra do pacote
export const compraPacote = async (idPacote, idUsuario) => {
  return await apiClient.post(`lojapacotes/comprar/${idPacote}/${idUsuario}`);
};

export const criarBatalha = async (dadosBatalha) => {
  return await apiClient.post("batalha/cadastro", dadosBatalha);
};

export const pegarBatalhasAbertas = async () => {
  return await apiClient.get("batalha/abertas");
};

export const vefificarPlayerInscrito = async (idBatalha, idUsuario) => {
  return await apiClient.get(
    `batalha/verificaplayer/${idBatalha}/${idUsuario}`);
};

export const ranking = async () => {
  return await apiClient.get("usuario/top10Vitorias");
};

export const entrarBatalha = (dadosBatalha) => {
  return apiClient.post("batalha/entrar", dadosBatalha);
};
export const pegarBatalhasIncrito = async (idUsuario) => {
  return await apiClient.get(`batalha/user/${idUsuario}`);
};
export const gerenciarBatalha = (novosDadosBatalha) => {
  return apiClient.put(`batalha/atualizar/${idBatalha}`, novosDadosBatalha)
};
export const removerJogador = (idBatalha, idUsuario) => {
  return apiClient.post(`batalha/retirar/${idBatalha}/${idUsuario}`);
};
