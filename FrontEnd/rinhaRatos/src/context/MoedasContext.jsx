import { createContext, useState, useContext } from "react";

//  Criado o Contexto
const MoedasContext = createContext();

// Criado o "Provedor" (o componente que vai guardar o estado)
export function MoedasProvider({ children }) {
  
  // O useState que guarda as moedas vive aqui
  // Ele lê o valor inicial do localStorage para não o perder
  const [qtdeMoedas, setQtdeMoedas] = useState(() => {
    return parseInt(localStorage.getItem("mousecoinSaldo")) || 0;
  });

  // O valor que vamos partilhar (o estado e a função para o alterar)
  const value = { qtdeMoedas, setQtdeMoedas };

  return (
    <MoedasContext.Provider value={value}>
      {children}
    </MoedasContext.Provider>
  );
}

// Criamos um "Hook"  para ser fácil usar o contexto
export function useMoedas() {
  return useContext(MoedasContext);
}