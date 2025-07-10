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
  const [fim, setFim] = React.useState("");
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
      setFim(usuario.horarios[usuario.horarios.length - 1]);
    };
    showSchedule();
  }, []);

  async function handleCancelarAgendamento(agendamento) {
    const request = await fetch("http://localhost:5000/cancelSchedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ agendamento }),
    });
    const data = await request.json();
  }

  return (
    <>
      <header className={`${global.container}`}>
        <div className={`${header.headerMenu}`}>
          <div className={global.imagemLogo}>
            <NavLink to="/logado" end>
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
      <main className={agendamentos.mainContent}>
        {usuario.length > 0 ? (
          <div className={agendamentos.agendamentosContainer}>
            {usuario.map((agendamento, index) => (
              <div key={index} className={agendamentos.agendamentoCard}>
                <h1>
                  Nome:
                  <span>
                    {agendamento.nome.charAt(0).toUpperCase() +
                      agendamento.nome.slice(1)}
                  </span>
                </h1>
                <h2>
                  Serviço:{" "}
                  <span>
                    {agendamento.servico.charAt(0).toUpperCase() +
                      agendamento.servico.slice(1)}
                  </span>
                </h2>
                <h2>
                  Inicio:{" "}
                  <span>
                    {agendamento.horarios ? agendamento.horarios[0] : "N/A"}
                  </span>
                </h2>
                <h2>
                  Término:{" "}
                  <span>
                    {agendamento.horarios
                      ? agendamento.horarios[agendamento.horarios.length - 1]
                      : "N/A"}
                  </span>
                </h2>
                {
                  <button
                    className={agendamentos.botaoCancelarPequeno}
                    onClick={() => handleCancelarAgendamento(agendamento._id)}
                  >
                    Cancelar
                  </button>
                }
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhum agendamento encontrado.</p>
        )}
      </main>
    </>
  );
};

export default Agendamentos;
