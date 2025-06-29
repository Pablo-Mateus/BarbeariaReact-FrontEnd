import React from "react";
import global from "../styles/Global.module.css";
import register from "../styles/Register.module.css";
import { NavLink } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const form = {
    email,
    senha,
  };
  const [resposta, setResposta] = React.useState("");

  async function forgotPass() {
    setResposta("Aguarde..");
    try {
      const response = await fetch("http://localhost:5000/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();
      setResposta(data.message);
    } catch (err) {
      console.log(err);
    }
  }

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
      setResposta(dados.message);

      if (response.ok) {
        localStorage.setItem("token", dados.token);
      }

      if (localStorage.getItem("token")) {
        if (dados.decoded.id === "felipe@gmail.com") {
          window.location.href = "/logadoBarbeiro";
        } else {
          window.location.href = "/logado";
        }
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
            <label htmlFor="email" className={`${register.label}`}>
              Email
            </label>
            <input
              className={`${register.input}`}
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
            <label htmlFor="password" className={`${register.label}`}>
              Senha
            </label>
            <input
              className={`${register.input}`}
              type="password"
              id="password"
              name="password"
              value={senha}
              onChange={({ target }) => {
                setSenha(target.value);
              }}
            />
          </div>
          <NavLink onClick={forgotPass}>Esqueci minha senha</NavLink>
          <button type="submit" className={`${register.button}`}>
            Logar
          </button>
          <div className={`${register.resposta}`}>{resposta}</div>
        </form>
      </main>
    </>
  );
};

export default Login;
