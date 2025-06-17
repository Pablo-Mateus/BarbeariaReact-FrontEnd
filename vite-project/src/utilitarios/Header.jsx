import React from "react";
import logo from "../assets/Captura de tela 2024-09-02 141005 1LOGO.svg";
import header from "../styles/Header.module.css";
import global from "../styles/Global.module.css";

const Header = () => {
  return (
    <header className={`${global.container}`}>
      <div className={`${header.headerMenu}`}>
        <div className={global.imagemLogo}>
          <img src={logo} alt="Logo Barbearia" />
        </div>
        <div className={`${header.menuBarber}`}>
          <ul>
            <li>
              <a href="/register">Inscreva-se</a>
            </li>
            <li>
              <a href="/login">Login</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
