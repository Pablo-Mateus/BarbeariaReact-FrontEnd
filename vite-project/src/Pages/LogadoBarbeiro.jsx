import React from "react";
import logo from "../assets/Captura de tela 2024-09-02 141005 1LOGO.svg";
import header from "../styles/Header.module.css";
import global from "../styles/Global.module.css";
import logado from "../styles/Logado.module.css";
import { NavLink } from "react-router-dom";
const LogadoBarbeiro = () => {
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
                <NavLink className={`${header.NavLink}`} to="/DefinirHorario">
                  Criar horários
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

      <main className={`${logado.bgServicos}`}>
        <section className={`${global.container} ${logado.servicos}`}>
          <div>
            <h1>Conheça os nossos serviços</h1>
          </div>
          <div className={`${logado.conteudoServicos}`}>
            <ul>
              <li>
                <h2>Corte</h2>
                <p>Corte de cabelo completo com tesoura, máquina e navalha.</p>
                <div className={`${logado.pagamento}`}>
                  <h3 className={`${logado.reservar}`}>
                    <button className={`${logado.botaoReserva}`}>
                      Reservar
                    </button>
                  </h3>
                  <div className={`${logado.valorHora}`}>
                    <h4 className={`${logado.valor}`}>R$35 </h4>
                    <h5>40min</h5>
                  </div>
                </div>
              </li>
              <li>
                <h2>Corte + barba</h2>
                <p>Corte de cabelo completo com tesoura, máquina e navalha.</p>
                <div className={`${logado.pagamento}`}>
                  <h3 className={`${logado.reservar}`}>
                    <button className={`${logado.botaoReserva}`}>
                      Reservar
                    </button>
                  </h3>
                  <div className={`${logado.valorHora}`}>
                    <h4 className={`${logado.valor}`}>R$35 </h4>
                    <h5>40min</h5>
                  </div>
                </div>
              </li>
              <li>
                <h2>barba + sobrancelha</h2>
                <p>Corte de cabelo completo com tesoura, máquina e navalha.</p>
                <div className={`${logado.pagamento}`}>
                  <h3 className={`${logado.reservar}`}>
                    <button className={`${logado.botaoReserva}`}>
                      Reservar
                    </button>
                  </h3>
                  <div className={`${logado.valorHora}`}>
                    <h4 className={`${logado.valor}`}>R$35 </h4>
                    <h5>40min</h5>
                  </div>
                </div>
              </li>
              <li>
                <h2>Pezinho</h2>
                <p>Corte de cabelo completo com tesoura, máquina e navalha.</p>
                <div className={`${logado.pagamento}`}>
                  <h3 className={`${logado.reservar}`}>
                    <button className={`${logado.botaoReserva}`}>
                      Reservar
                    </button>
                  </h3>
                  <div className={`${logado.valorHora}`}>
                    <h4 className={`${logado.valor}`}>R$35 </h4>
                    <h5>40min</h5>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
};

export default LogadoBarbeiro;
