import React from "react";
import ReactDom from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MoedasProvider } from "./context/MoedasContext";
import App from "./App.jsx";
import Login from "./pages/auth/Login.jsx";
import Acesso from "./pages/Auth/Acesso.jsx";
import Cadastro from "./pages/auth/Cadastro.jsx";
import EsqueceuSenha from "./pages/Auth/EsqueceuSenha.jsx";
import HomeJogador from "./pages/home/jogador/HomeJogador.jsx";
import HomeADM from "./pages/home/adm/HomeADM.jsx";
import HomeConvidado from "./pages/home/HomeConvidado.jsx";
import Perfil from "./pages/perfil/Perfil.jsx";
import "./index.css";

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

ReactDom.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MoedasProvider>
      <RouterProvider router={router} />
    </MoedasProvider>
  </React.StrictMode>
);
