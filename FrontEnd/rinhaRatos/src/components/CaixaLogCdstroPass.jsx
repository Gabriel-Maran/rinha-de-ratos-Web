export default function CaixaLogCdstroPass() {
  const txtLoginCdstroSenha = "Fazer login";
  return (
    <>
      <div className="caixaLogin">
        <h3>{txtLoginCdstroSenha}</h3>
        <div className="inputs">
            <input type="text" placeholder="E-mail" />
            <input type="password" placeholder="Senha" />
            <span>👁</span>
        </div>
        <p>Esqueci a senha...</p>
        <button>Logar</button>
        <p>Não possuo conta</p>
      </div>
    </>
  );
}
