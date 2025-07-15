import React from "react";
import logo from "../assets/Captura de tela 2024-09-02 141005 1LOGO.svg";
import header from "../styles/Header.module.css";
import global from "../styles/Global.module.css";
import { NavLink } from "react-router-dom";

const Header = ({ headerType, logoRedirectPath = "/", navLinks, onLogout }) => {
  function handleLogout() {
    localStorage.removeItem("token");
    window.location.reload();
  }

  return (
    <>
      <header className={`${global.container} ${header.headerMenu}`}>
        <div className={global.imagemLogo}>
          <NavLink to={logoRedirectPath} end>
            <img src={logo} alt="Logo Barbearia" />
          </NavLink>
        </div>
        <div className={`${header.menuBarber}`}>
          <ul>
            {navLinks.map((link, index) => (
              <li key={index}>
                <NavLink className={`${header.NavLink}`} to={link.to}>
                  {link.text}
                </NavLink>
              </li>
            ))}
            {onLogout && ( // Renderiza o botão Sair apenas se a prop onLogout for fornecida
              <li>
                <NavLink className={`${header.NavLink}`} onClick={handleLogout}>
                  Sair
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </header>
    </>
  );
};

export default Header;
