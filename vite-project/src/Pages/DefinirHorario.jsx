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
  const [horarios, setHorarios] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [convertidoInicio, setConvertidoInicio] = React.useState(null);
  const [convertidoFim, setConvertidoFim] = React.useState(null);
  const [convertidoIntervalo, setConvertidoIntervalo] = React.useState(null);

  React.useEffect(() => {
    try {
      const request = async () => {
        setTimeout(() => {
          setResposta("");
        }, 3000);
        const response = await fetch("http://localhost:5000/getTimes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dia: diaSemana }),
        });
        const data = await response.json();
        setHorarios(data.horarios);
        setConvertidoIntervalo(data.intervalo);

        if (response.ok === false) {
          setResposta(data.message);
          setConvertidoInicio(null);
          setConvertidoFim(null);
          setConvertidoIntervalo(null);
        }
      };
      request();
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }, [diaSemana]);

  React.useEffect(() => {
    if (horarios) {
      setConvertidoInicio(`${dayjs().format("YYYY-MM-DD ")}${horarios[0]}`);
      setConvertidoFim(
        `${dayjs().format("YYYY-MM-DD ")}${horarios[horarios.length - 1]}`
      );
      setConvertidoIntervalo(
        `${dayjs().format("YYYY-MM-DD ")}00:${convertidoIntervalo}`
      );
    }
  }, [horarios]);

  function handleSubmit(event) {
    event.preventDefault();

    setTimeout(() => {
      setResposta("");
    }, 3000);

    try {
      if (inicio && fim && intervalo) {
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
                  value={dayjs(convertidoInicio)}
                  label="Inicio"
                  onChange={(target) => {
                    setInicio(target);
                    setConvertidoInicio(target.$d);
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
          <div className={`${ChoseTime.container}`}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  value={dayjs(convertidoFim)}
                  label="Fim"
                  onChange={(target) => {
                    setFim(target);
                    setConvertidoFim(target.$d);
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
                  value={dayjs(convertidoIntervalo)}
                  label="Intervalo"
                  timeSteps={{ minutes: 1 }}
                  onChange={(target) => {
                    setIntervalo(target);
                    setConvertidoIntervalo(target.$d);
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
