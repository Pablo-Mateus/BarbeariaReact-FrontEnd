import React from "react";
import header from "../styles/Header.module.css";
import global from "../styles/Global.module.css";
import logo from "../assets/Captura de tela 2024-09-02 141005 1LOGO.svg";
import { NavLink, useParams } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import agendar from "../styles/Agendar.module.css";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box } from "@mui/material";

const PRIMARY_BLUE = "#212F3D"; // Azul escuro da sua barra
const ACCENT_GOLD = "#FFD700"; // Um dourado/mostarda para destaque (sugestão)
const LIGHT_GREY_BG = "#f8f8f8"; // Fundo mais claro para o corpo
const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#eeeeee";
const StyledCalendarContainer = styled("div")(({ theme }) => ({
  backgroundColor: "#ffffff", // Fundo branco para o calendário
  // Bordas mais arredondadas
  // boxShadow: theme.shadows[5], // Uma sombra mais proeminente
  overflow: "hidden", // Para garantir que o arredondamento funciona
  maxWidth: 800, // Ajuste a largura conforme necessário
  width: "100%",
  margin: "20px auto", // Centraliza na página
  border: `1px solid ${LIGHT_GREY_BG}`, // Borda sutil,
}));
const Agendar = () => {
  const params = new URLSearchParams(window.location.search);
  const dados = {
    servico: params.get("servico"),
    tempo: params.get("tempo"),
  };

  const [value, setValue] = React.useState(dayjs());
  const [arrayHoras, setArrayHoras] = React.useState([]);
  const [selectedButton, setSelectedButton] = React.useState(null);
  function clearLocal() {
    localStorage.removeItem("token");
    window.location.reload();
  }

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const diasSemana = {
    Mon: "Segunda",
    Tue: "Terca",
    Wed: "Quarta",
    Thu: "Quinta",
    Fri: "Sexta",
    Sat: "sabado",
    Sun: "domingo",
  };

  React.useEffect(() => {
    const dia = value.toString().split(",")[0];
    const getTimes = async () => {
      try {
        const response = await fetch("http://localhost:5000/getTimes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dia: diasSemana[dia] }),
        });

        const data = await response.json();

        setArrayHoras(data.horarios);
      } catch (err) {
        console.log(err);
      }
    };
    getTimes();
  }, [value]);

  function handleClick(item) {
    setSelectedButton(item);
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
                <NavLink className={`${header.NavLink}`} to="/meusagendamentos">
                  Meus agendamentos
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
        <h1>Selecione o dia para seu agendamento.</h1>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          localeText={{
            okButtonLabel: "Confirmar", // Garante o texto do botão OK
            cancelButtonLabel: "Cancelar", // Garante o texto do botão Cancelar
          }}
        >
          <StyledCalendarContainer>
            <DatePicker
              value={value}
              onChange={(target) => {
                setValue(target);
              }}
              orientation={isMobile ? "portrait" : "landscape"}
              sx={{
                backgroundColor: "white",
                borderRadius: "16px", // Bordas do container do dialog
                width: "100%", // Para ele ocupar o espaço do pai

                ".MuiPickersLayout-contentWrapper": {
                  minWidth: isMobile ? "100%" : "280px",
                  padding: "16px",
                },

                ".MuiPickersLayout-root": {
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: "stretch",
                },
              }}
            />
            {
              <div className={`${agendar.horas}`}>
                {arrayHoras
                  ? arrayHoras.map((item) => {
                      return (
                        <div>
                          <button
                            key={item}
                            style={
                              selectedButton === item
                                ? { background: "blue" }
                                : { background: "#1976d2" }
                            }
                            className={`${agendar.horaBotao}`}
                            onClick={() => handleClick(item)}
                          >
                            {item}
                          </button>
                        </div>
                      );
                    })
                  : "Nenhum horário disponível para o dia"}
              </div>
            }
          </StyledCalendarContainer>
        </LocalizationProvider>
      </main>
    </>
  );
};

export default Agendar;
