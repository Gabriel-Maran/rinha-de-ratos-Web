import React from "react";
import ReactDom from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import App from "./App.jsx";
import Login from "./pages/auth/Login.jsx";
import Acesso from "./pages/auth/Acesso.jsx";
import Cadastro from "./pages/auth/Cadastro.jsx";
import EsqueceuSenha from "./pages/auth/EsqueceuSenha.jsx";
import HomeJogador from "./pages/home/jogador/HomeJogador.jsx";
import HomeADM from "./pages/home/adm/HomeADM.jsx";
import HomeConvidado from "./pages/home/HomeConvidado.jsx";
import Perfil from "./pages/perfil/Perfil.jsx";
import "./index.css";

// ---------------------------------------------------------
//  CONFIGURAÇÃO DE ROTAS (ROUTER)
// ---------------------------------------------------------

// Criação da árvore de navegação da aplicação.

// 1. Estrutura Principal: Define o caminho raiz "/" renderizando o componente <App />.
// 2. Rotas Filhas (Children): Todas as rotas aninhadas que serão exibidas
//    dentro do <Outlet /> localizado no componente App.
// 3. Index: A rota com 'index: true' é a página padrão carregada ao acessar a raiz.
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Acesso />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "esqueceusenha",
        element: <EsqueceuSenha />,
      },
      {
        path: "cadastro",
        element: <Cadastro />,
      },
      {
        path: "home",
        element: <HomeJogador />,
      },
      {
        path: "homeAdm",
        element: <HomeADM />,
      },
      {
        path: "perfil",
        element: <Perfil />,
      },
      {
        path: "homeConvidado",
        element: <HomeConvidado />,
      },
    ],
  },
]);

// ---------------------------------------------------------
//  RENDERIZAÇÃO DA APLICAÇÃO
// ---------------------------------------------------------

// Inicialização do React conectando-o ao elemento HTML 'root'.

// 1. AuthProvider: Envolve a aplicação inteira. Isso garante que o estado
//  de autenticação (usuário logado, tokens) seja acessível por qualquer rota.
// 2. RouterProvider: Disponibiliza a lógica de navegação configurada na const 'router'.
// 3. StrictMode: Ferramenta de desenvolvimento para destacar problemas potenciais na aplicação.
ReactDom.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);