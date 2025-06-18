import React from "react";
import global from "../styles/Global.module.css";
import register from "../styles/Register.module.css";

const Login = () => {
  return (
    <>
     
        <main>
          <h1>Login</h1>
          <form id="formulario">
            <div>
              <label for="email">Email</label>
              <input type="email" id="email" name="email" />
            </div>
            <div>
              <label for="password">Senha</label>
              <input type="password" id="password" name="password" />
            </div>
            <a href="" class="forgotPass">
              Esqueci minha senha
            </a>
            <button class="botao" type="submit">
              Logar
            </button>
            <div class="resposta"></div>
          </form>
        </main>
     
    </>
  );
};

export default Login;
