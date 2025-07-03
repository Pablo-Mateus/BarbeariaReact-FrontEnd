import React from "react";
import header from "../styles/Header.module.css";
import global from "../styles/Global.module.css";
import logo from "../assets/Captura de tela 2024-09-02 141005 1LOGO.svg";
import { NavLink } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import agendar from "../styles/Agendar.module.css";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
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
  border: `1px solid ${LIGHT_GREY_BG}`, // Borda sutil
}));
const Agendar = () => {
  const [value, setValue] = React.useState(dayjs());
  const [arrayHoras, setArrayHoras] = React.useState([]);

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
        console.log(data);
        setArrayHoras(data.horarios);
      } catch (err) {
        console.log(err);
      }
    };
    getTimes();
  }, [value]);

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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StyledCalendarContainer>
            <StaticDatePicker
              orientation={isMobile ? "portrait" : "landscape"}
              value={value}
              onChange={(target) => {
                setValue(target);
              }}
              openTo="day"
              sx={{
                backgroundColor: "white",
                overflow: "auto",

                ".MuiPickerStaticWrapper-content": {
                  padding: "16px",
                },
              }}
              slotProps={{
                toolbar: {
                  hidden: false,
                  sx: {
                    backgroundColor: PRIMARY_BLUE,
                    color: TEXT_LIGHT,
                    padding: "16px",
                    ".MuiTypography-root": {
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                    },
                    ".MuiPickersToolbar-content": {
                      justifyContent: "center",
                    },
                  },
                },

                calendarHeader: {
                  sx: {
                    backgroundColor: LIGHT_GREY_BG,
                    borderRadius: "8px",
                    padding: "8px 12px",
                    marginBottom: "10px",

                    ".MuiPickersCalendarHeader-label": {
                      color: TEXT_DARK,
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    },

                    ".MuiIconButton-root": {
                      color: PRIMARY_BLUE,
                      "&:hover": {
                        backgroundColor: "rgba(33, 47, 61, 0.1)",
                      },
                    },
                  },
                },

                day: {
                  sx: {
                    borderRadius: "50%",
                    fontWeight: "normal",
                    color: TEXT_DARK,
                    "&.MuiPickersDay-today": {
                      border: `2px solid ${PRIMARY_BLUE}`,
                      backgroundColor: "transparent",
                      color: PRIMARY_BLUE,
                      fontWeight: "bold",
                    },

                    "&.Mui-selected": {
                      backgroundColor: PRIMARY_BLUE,
                      color: TEXT_LIGHT,
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: PRIMARY_BLUE,
                        opacity: 0.9,
                      },
                    },

                    "&:hover": {
                      backgroundColor: ACCENT_GOLD,
                      color: TEXT_DARK,
                      opacity: 0.8,
                    },

                    "&.MuiPickersDay-day": {
                      // Seletor genérico para dias no calendário
                      "&:nth-of-type(7n)": {
                        // Domingo
                        color: "red", // Exemplo: dias de domingo em vermelho
                      },
                      "&:nth-of-type(7n-1)": {
                        // Sábado
                        color: "blue", // Exemplo: dias de sábado em azul
                      },
                    },
                  },
                },
              }}
            />
            <div className={`${agendar.horas}`}>
              {arrayHoras
                ? arrayHoras.map((item) => {
                    return (
                      <div>
                        <button className={`${agendar.horaBotao}`}>
                          {item}
                        </button>
                      </div>
                    );
                  })
                : "Nenhum horário disponível para o dia"}
            </div>
          </StyledCalendarContainer>
        </LocalizationProvider>
      </main>
    </>
  );
};

export default Agendar;
