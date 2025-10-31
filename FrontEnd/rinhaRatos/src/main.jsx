import React from "react";
import ReactDom from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./css/index.css";
import App from "./App.jsx";
import Inicio from "./pages/Inicio.jsx";
import Login from "./pages/Auth/Login.jsx";
import Acesso from "./pages/Auth/Acesso.jsx";
import Cadastro from "./pages/auth/Cadastro.jsx";
import EsqueceuSenha from "./pages/Auth/EsqueceuSenha.jsx";

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
        element:<Cadastro/>
      },
      {
        path: "home",
        element: <Inicio />,
      },
    ],
  },
]);
ReactDom.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
