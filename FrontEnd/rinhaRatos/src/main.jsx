import React from "react";
import ReactDom from 'react-dom/client';
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom';
import "./css/index.css";
import App from "./App.jsx";
import Inicio from "./pages/Inicio.jsx";
import Login from "./pages/Login.jsx";
import Acesso from "./pages/Acesso.jsx";


const router =  createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { 
        index: true,
        element: <Acesso/> 
      },
      {
        path:"login",
        element:<Inicio/>
      },
      {
         path: "home",
        element: <Inicio /> 
      },     
    ],
  },
]);
ReactDom.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router}/>
  </React.StrictMode>
);