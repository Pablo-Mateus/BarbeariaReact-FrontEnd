import React from "react";
import global from "../styles/Global.module.css";
import register from "../styles/Register.module.css";

const Register = () => {
  const [email, setEmail] = React.useState("");
  const [telefone, setTelefone] = React.useState("");
  const [nome, setNome] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [confirmarsenha, setConfirmarSenha] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const form = {
    email,
    telefone,
    nome,
    senha,
    confirmarsenha,
  };

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
    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      setResposta[data.msg];
      if (response.ok) {
        localStorage.setItem("token", data.token);
      }

      if (localStorage.getItem("token")) {
        if (data.decoded.id === "felipe@gmail.com") {
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
        <h1>REGISTRE-SE</h1>
        <form id="formulario" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className={`${register.label}`}>
              Nome de usuário
            </label>
            <input
              className={`${register.input}`}
              type="text"
              id="name"
              name="name"
              placeholder="Nome de usuário"
              onChange={({ target }) => {
                setNome(target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="email" className={`${register.label}`}>
              Email
            </label>
            <input
              className={`${register.input}`}
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={validarEmail}
            />
          </div>
          <div>
            <label htmlFor="tel" className={`${register.label}`}>
              Telefone
            </label>
            <input
              className={`${register.input}`}
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
            <label htmlFor="password" className={`${register.label}`}>
              Senha
            </label>
            <input
              className={`${register.input}`}
              type="password"
              id="password"
              name="password"
              placeholder="Senha"
              onChange={({ target }) => setSenha(target.value)}
            />
          </div>
          <div>
            <label htmlFor="confirmpassword" className={`${register.label}`}>
              Confirmar senha
            </label>
            <input
              className={`${register.input}`}
              type="password"
              id="confirmpassword"
              name="confirmpassword"
              placeholder="Confirmar senha"
              onChange={({ target }) => setConfirmarSenha(target.value)}
            />
          </div>
          <button className={`${register.button}`} type="submit">
            Registrar-se
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

export default Register;
