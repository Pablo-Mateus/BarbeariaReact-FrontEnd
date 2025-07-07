import React from "react";
import header from "../styles/Header.module.css";
import global from "../styles/Global.module.css";
import logo from "../assets/Captura de tela 2024-09-02 141005 1LOGO.svg";
import { NavLink } from "react-router-dom";
import agendamentos from "../styles/Agendamentos.module.css";
const Agendamentos = () => {
  const token = localStorage.getItem("token");
  function clearLocal() {
    localStorage.removeItem("token");
    window.location.reload();
  }

  const [usuario, setUsuario] = React.useState({});
  const [nome, setNome] = React.useState("");
  const [servico, setServico] = React.useState("");
  const [inicio, setInicio] = React.useState("");
  React.useEffect(() => {
    const showSchedule = async () => {
      const request = await fetch("http://localhost:5000/showSchedule", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await request.json();
      const usuario = data.usuario || {};
      console.log(data);
      setUsuario(usuario);
      setNome(usuario.nome.charAt(0).toUpperCase() + usuario.nome.slice(1));
      setServico(
        usuario.servico.charAt(0).toUpperCase() + usuario.servico.slice(1)
      );
      setInicio(usuario.horarios[0]);
    };
    showSchedule();
  }, []);

  return (
    <>
      <header className={`${global.container}`}>
        <div className={`${header.headerMenu}`}>
          <div className={global.imagemLogo}>
            <NavLink to="/" end>
              <img src={logo} alt="Logo Barbearia" />
            </NavLink>
          </div>
          <div className={`${header.menuBarber}`}>
            <ul>
              <li>
                <NavLink className={`${header.NavLink}`} onClick={clearLocal}>
                  Sair
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <main>
        <h1>Meus agendamentos</h1>
        {usuario ? (
          <>
            <div>
              <h1>
                Nome:<span>{nome}</span>
              </h1>
              <h2>
                Serviço: <span>{servico}</span>
              </h2>
              <h3>Inicio: {inicio}</h3>
            </div>
          </>
        ) : null}
        <button className={`${agendamentos.botaoCancelar}`}>
          Selecione horário para cancelar agendamento
        </button>
      </main>
    </>
  );
};

export default Agendamentos;
