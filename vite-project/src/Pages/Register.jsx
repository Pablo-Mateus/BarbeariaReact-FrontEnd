import React from "react";
import global from "../styles/Global.module.css";
import register from "../styles/Register.module.css";

const Register = () => {
  const [email, setEmail] = React.useState("");
  const [telefone, setTelefone] = React.useState("");
  const [resposta, setResposta] = React.useState("");

  function validarEmail({ target }) {
    const valorDigitado = target.value;
    setEmail(valorDigitado);
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}(?:\.[a-z]{2})?$/i;
    if (!regex.test(valorDigitado)) {
      setResposta("Email inválido");
    } else {
      setResposta("");
    }
  }

  function aplicarMascara(value) {
    let digitos = value.replace(/\D/g, "");
    if (digitos.length < 11) {
      digitos = digitos.slice(0, 11);
    }

    if (digitos.length > 10) {
      return digitos.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (digitos.length > 5) {
      return digitos.replace(/^(\d{2})(\d{4})/, "($1) $2-");
    } else if (digitos.length > 2) {
      return digitos.replace(/^(\d{2})/, "($1) ");
    } else {
      return digitos;
    }
  }

  function handleTelefone({ target }) {
    const valor = target.value;
    const mascaraAplicada = aplicarMascara(valor);
    setTelefone(mascaraAplicada);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const response = await fetch("/auth/register",{
      
    })
  }

  return (
    <>
      <main>
        <h1>REGISTRE-SE</h1>
        <form id="formulario" onSubmit={handleSubmit}>
          <div>
            <label for="name">Nome de usuário</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Nome de usuário"
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={validarEmail}
            />
          </div>
          <div>
            <label htmlFor="tel">Telefone</label>
            <input
              type="text"
              id="telefone"
              value={telefone}
              name="tel"
              placeholder="(00) 00000-0000"
              maxLength="15"
              onChange={handleTelefone}
            />
            <span id="erro-telefone"></span>
          </div>
          <div>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Senha"
            />
          </div>
          <div>
            <label htmlFor="confirmpassword">Confirmar senha</label>
            <input
              type="password"
              id="confirmpassword"
              name="confirmpassword"
              placeholder="Confirmar senha"
            />
          </div>
          <button className="botao" type="submit">
            Registrar-se
          </button>
          <ul className="observacao">
            <span>OBS:</span>
            <li>A senha deve conter no mínimo 10 dígitos</li>
            <li>A senha deve conter no mínimo um caractere especial</li>
          </ul>
        </form>
        {<div>{resposta}</div>}
      </main>
    </>
  );
};

export default Register;
