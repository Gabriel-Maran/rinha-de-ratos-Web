import "./css/App.css";
import Inicio from "./pages/Inicio.jsx";
import Acesso from "./pages/Acesso.jsx";
import { Outlet } from "react-router-dom";
import Login from "./pages/Login.jsx";

function App() {
  return (
    <>
    <Outlet/>
    </>
  );
}

export default App;
