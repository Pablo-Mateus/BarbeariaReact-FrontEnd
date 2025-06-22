import React from "react";
import global from "../styles/Global.module.css";
import register from "../styles/Register.module.css";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [data, setData] = React.useState(null);
  const form = {
    email,
    senha,
  };
  const [resposta, setResposta] = React.useState("");

  async function handleAuth(event) {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const dados = await response.json();
      setData(dados);
      console.log(dados);
      setResposta(dados.message);
      if (response.ok) {
        window.location.href = dados.redirect;
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <main>
        <h1>Login</h1>
        <form id="formulario" onSubmit={handleAuth}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={({ target }) => {
                setEmail(target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={senha}
              onChange={({ target }) => {
                setSenha(target.value);
              }}
            />
          </div>
          <a href="" className="forgotPass">
            Esqueci minha senha
          </a>
          <button type="submit">Logar</button>
          <div className="resposta">{resposta}</div>
        </form>
      </main>
    </>
  );
};

export default Login;
