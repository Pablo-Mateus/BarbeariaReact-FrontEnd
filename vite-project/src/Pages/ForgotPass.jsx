import React from "react";
import global from "../styles/Global.module.css";
import register from "../styles/Register.module.css";
import { replace, useNavigate } from "react-router-dom";
const ForgotPass = () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (!token) {
    window.location.href = "/login";
  }
  const [senha, setSenha] = React.useState("");
  const [confirmarsenha, setConfirmarSenha] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [resposta, setResposta] = React.useState("");
  const form = {
    senha,
    confirmarsenha,
    token,
  };
  const navigate = useNavigate();
  async function request(event) {
    event.preventDefault();

    const response = await fetch("http://localhost:5000/changePass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    console.log(data);

    if (response.ok) {
      navigate("/login", { replace: true });
    }

    setResposta(data.msg);
  }

  return (
    <>
      <main>
        <h1>Esqueci minha senha</h1>
        <form id="formulario" onSubmit={request}>
          <div>
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Senha"
              onChange={({ target }) => setSenha(target.value)}
            />
          </div>
          <div>
            <label htmlFor="confirmpassword">Confirmar senha</label>
            <input
              type="password"
              id="confirmpassword"
              name="confirmpassword"
              placeholder="Confirmar senha"
              onChange={({ target }) => setConfirmarSenha(target.value)}
            />
          </div>
          <button className="botao" type="submit">
            Redefinir senha
          </button>

          <ul className="observacao">
            <span>OBS:</span>
            <li>A senha deve conter no mínimo 10 dígitos</li>
            <li>A senha deve conter no mínimo um caractere especial</li>
          </ul>
          <span className="resposta">{resposta}</span>
        </form>
      </main>
    </>
  );
};

export default ForgotPass;
