import React from "react";
import logo from "../assets/Captura de tela 2024-09-02 141005 1LOGO.svg";
import header from "../styles/Header.module.css";
const urlAPI = import.meta.env.VITE_API_BASE_URL
import global from "../styles/Global.module.css";
import appStyles from "../styles/App.module.css"; // Importa os estilos da HomePage para reutilização
import { NavLink, useNavigate } from "react-router-dom";
import Footer from "../utilitarios/Footer"; // Adicionado Footer para consistência

// Dados dos serviços (copiado do HomePage para manter a consistência)
const SERVICES_DATA = [
  {
    id: "corte",
    title: "Corte de Cabelo",
    description:
      "Corte de cabelo completo com tesoura, máquina e navalha, finalizado com produtos de qualidade.",
    price: 35.0,
    time: 45, // Duração em minutos
  },
  {
    id: "corte-barba",
    title: "Corte + Barba",
    description:
      "Corte de cabelo e design de barba, com toalha quente e finalização premium.",
    price: 60.0,
    time: 75, // Duração em minutos
  },
  {
    id: "barba-sobrancelha",
    title: "Barba + Sobrancelha",
    description:
      "Modelagem e hidratação da barba, alinhamento e limpeza das sobrancelhas.",
    price: 40.0,
    time: 40, // Duração em minutos
  },
  {
    id: "pezinho",
    title: "Ajuste de Pezinho",
    description: "Manutenção do corte com acabamento na nuca e costeletas.",
    price: 20.0,
    time: 20, // Duração em minutos
  },
  // Adicione mais serviços aqui se tiver
  {
    id: "completo",
    title: "Experiência Completa",
    description:
      "Corte de cabelo, design de barba, sobrancelha e lavagem relaxante.",
    price: 85.0,
    time: 90, // Duração em minutos
  },
];

const Logado = () => {
  const navigate = useNavigate();

  // Função para sair (limpa token e redireciona)
  function clearLocal() {
    localStorage.removeItem("token");
    navigate("/", { replace: true }); // Redireciona para a página inicial de login
    window.location.reload(); // Para garantir que o estado do app seja resetado
  }

  // Função para lidar com o clique no botão "Agendar" de cada serviço
  const handleAgendarClick = (serviceTitle, serviceTime) => {};

  return (
    <>
      {/* <form action="">
        <h1>Criar serviços</h1>
        <label htmlFor="servico">Serviço:</label>
        <input type="text" placeholder="Ex: corte de cabelo" id="servico" />
        <label htmlFor="descricao">Descrição do serviço:</label>
        <input type="text" id="descricao" />
        <label htmlFor="preco">Preço:</label>
        <input type="number" id="preco" placeholder="R$00,00" />
         <label htmlFor="duracao">Duração:</label>
        <input type="number" id="duracao" placeholder="Em minutos ex: 45" />
      </form> */}
      <main className={`${appStyles.heroSection} ${appStyles.bgServicos}`}>
        <section className={`${global.container} ${appStyles.servicosContent}`}>
          <div className={appStyles.introText}>
            <h1>Bem-vindo!</h1>{" "}
            <p>Escolha um serviço e agende seu horário com facilidade.</p>
          </div>

          <div className={appStyles.servicesGrid}>
            {SERVICES_DATA.map((service) => (
              <div key={service.id} className={appStyles.serviceCard}>
                <h2>{service.title}</h2>
                <p>{service.description}</p>
                <div className={appStyles.priceDuration}>
                  <h3>
                    Preço:{" "}
                    <span>R${service.price.toFixed(2).replace(".", ",")}</span>
                  </h3>
                  <h3>
                    Duração: <span>{service.time} min</span>
                  </h3>
                </div>
                <button
                  className={appStyles.agendarButton}
                  onClick={() =>
                    handleAgendarClick(service.title, service.time)
                  }
                >
                  Alterar valor ou duração
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default Logado;
