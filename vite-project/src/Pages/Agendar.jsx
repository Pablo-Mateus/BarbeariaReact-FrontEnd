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
import agendar from "../styles/Agendar.module.css";

const Agendar = () => {
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
        <div className={agendar.calendario}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DataCalendar", "DateCalendar"]}>
              <DemoItem label="Dias disponíveis">
                <DateCalendar sx={{ backgroundColor: "#e1e2e2" }} />
              </DemoItem>
            </DemoContainer>
          </LocalizationProvider>
        </div>
      </main>
    </>
  );
};

export default Agendar;
