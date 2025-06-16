import React from "react";
import useFetch from "./useFetch";

function App() {
  const { data, error, request, resposta } = useFetch();
  const [form, setForm] = React.useState({
    name: "",
    sobrenome: "",
    endereco: "",
    telefone: "",
  });

  function handleSubmit(event) {
    event.preventDefault();
    try {
      request("http://localhost:3000/dados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
    } catch (err) {
      console.log(err);
    }
  }

  function handleChange({ target }) {
    const { id, value } = target;
    setForm({ ...form, [id]: value });
  }

  return (
    <>
      <form action="" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="">
            Nome
            <input
              id="name"
              type="text"
              value={form.nome}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label htmlFor="">
            Sobrenome
            <input id="sobrenome" type="text" onChange={handleChange} />
          </label>
        </div>
        <div>
          <label htmlFor="">
            Endereço
            <input
              id="endereco"
              type="text"
              onChange={handleChange}
              value={form.endereco}
            />
          </label>
        </div>
        <div>
          <label htmlFor="">
            Telefone
            <input
              id="telefone"
              type="text"
              onChange={handleChange}
              value={form.telefone}
            />
          </label>
        </div>
        <button>Enviar</button>
      </form>
    </>
  );
}

export default App;
