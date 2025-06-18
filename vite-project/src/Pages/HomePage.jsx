import React from "react";
import Header from "../utilitarios/Header";
import Footer from "../utilitarios/Footer";
import styles from "../styles/App.module.css";
import global from "../styles/Global.module.css";
import { Helmet } from "react-helmet";
import { Routes, Route } from "react-router-dom";
import Register from "./Register";

const HomePage = () => {
  return (
    <>
      <div className={global.pai}>
        <Helmet>
          <title>Home Barbearia</title>
          <meta name="Página inicial barbearia" />
        </Helmet>
        <main className={`${styles.bgServicos}`}>
          <section className={`${global.container} ${styles.servicos}`}>
            <div>
              <h1>Conheça os nossos serviços</h1>
            </div>
            <div className={`${styles.conteudoServicos}`}>
              <ul>
                <li>
                  <h2>Corte</h2>
                  <p>
                    Corte de cabelo completo com tesoura, máquina e navalha.
                  </p>
                  <div className="pagamento">
                    <h3 className="avulso">
                      Avulso <span>R$35</span>
                    </h3>
                    <h3 className="avulso">
                      Mensal <span>R$35</span>
                    </h3>
                  </div>
                </li>
                <li>
                  <h2>Corte + barba</h2>
                  <p>
                    Corte de cabelo completo com tesoura, máquina e navalha.
                  </p>
                  <div className="pagamento">
                    <h3 className="avulso">
                      Avulso <span>R$35</span>
                    </h3>
                    <h3 className="avulso">
                      Mensal <span>R$35</span>
                    </h3>
                  </div>
                </li>
                <li>
                  <h2>barba + sobrancelha</h2>
                  <p>
                    Corte de cabelo completo com tesoura, máquina e navalha.
                  </p>
                  <div className="pagamento">
                    <h3 className="avulso">
                      Avulso <span>R$35</span>
                    </h3>
                    <h3 className="avulso">
                      Mensal <span>R$35</span>
                    </h3>
                  </div>
                </li>
                <li>
                  <h2>Pezinho</h2>
                  <p>
                    Corte de cabelo completo com tesoura, máquina e navalha.
                  </p>
                  <div className="pagamento">
                    <h3 className="avulso">
                      Avulso <span>R$35</span>
                    </h3>
                    <h3 className="avulso">
                      Mensal <span>R$35</span>
                    </h3>
                  </div>
                </li>
              </ul>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default HomePage;
