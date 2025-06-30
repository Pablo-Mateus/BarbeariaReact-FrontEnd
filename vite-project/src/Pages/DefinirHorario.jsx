import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import logo from "../assets/Captura de tela 2024-09-02 141005 1LOGO.svg";
import header from "../styles/Header.module.css";
import global from "../styles/Global.module.css";
import { NavLink } from "react-router-dom";
import ChoseTime from "../styles/ChoseTime.module.css";

const DefinirHorario = () => {
  const [diaSemana, setDiaSemana] = React.useState("Segunda");
  const [inicio, setInicio] = React.useState("");
  const [fim, setFim] = React.useState("");
  const [intervalo, setIntervalo] = React.useState("");
  const [resposta, setResposta] = React.useState("");

  function handleSubmit(event) {
    event.preventDefault();

    try {
      if (inicio && fim && intervalo) {
        console.log(inicio);
        const horario = {
          diaSemana,
          inicio: `${inicio.$H}:${inicio.$m.toString().padStart(2, "0")}`,
          fim: `${fim.$H}:${fim.$m.toString().padStart(2, "0")}`,
          intervalo: `${intervalo.$m}`,
        };

        const request = async () => {
          const response = await fetch("http://localhost:5000/DefinirHorario", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(horario),
          });
          const data = await response.json();
          setResposta(data.message);
        };
        request();
      } else {
        setResposta("Você precisa preencher todos os campos");
      }
    } catch (err) {
      console.log(err);
    }
  }

  function clearLocal() {
    localStorage.removeItem("token");
    window.location.reload();
  }

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
                <NavLink className={`${header.NavLink}`} to="/Agendamentos">
                  Clientes
                </NavLink>
              </li>
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
        <h1>Selecione os horários para a semana</h1>
        <form id="formulario">
          <div className={`${ChoseTime.container}`}>
            <label className={`${ChoseTime.label}`}>Selecione o dia:</label>
            <select
              name=""
              className={`${ChoseTime.dia}`}
              onChange={({ target }) => {
                setDiaSemana(target.value);
              }}
            >
              <option value="Segunda">Segunda</option>
              <option value="Terca">Terça</option>
              <option value="Quarta">Quarta</option>
              <option value="Quinta">Quinta</option>
              <option value="Sexta">Sexta</option>
              <option value="Sabado">Sábado</option>
              <option value="Domingo">Domingo</option>
            </select>
          </div>
          <div className={`${ChoseTime.container}`}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  label="Inicio"
                  onChange={(target) => {
                    setInicio(target);
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
          <div className={`${ChoseTime.container}`}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  label="Fim"
                  onChange={(target) => {
                    setFim(target);
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
          <div className={`${ChoseTime.container}`}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  views={["minutes"]}
                  label="Intervalo"
                  timeSteps={{ minutes: 1 }}
                  onChange={(target) => {
                    setIntervalo(target);
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
          <span className={`${ChoseTime.resposta}`}>{resposta}</span>
          <button
            type="submit"
            className={`${ChoseTime.button}`}
            onClick={handleSubmit}
          >
            Enviar
          </button>
        </form>
      </main>
    </>
  );
};

export default DefinirHorario;
