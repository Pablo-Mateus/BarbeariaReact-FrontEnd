import React from "react";
import logo from "../assets/Captura de tela 2024-09-02 141005 1LOGO.svg";
import header from "../styles/Header.module.css";
import global from "../styles/Global.module.css";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
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
              <NavLink className={`${header.NavLink}`} to="/Register">
                Inscreva-se
              </NavLink>
            </li>
            <li>
              <li>
                <NavLink className={`${header.NavLink}`} to="/login">
                  Login
                </NavLink>
              </li>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
