import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReactDom from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import "./css/index.css";
import App from "./App.jsx";

ReactDom.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);