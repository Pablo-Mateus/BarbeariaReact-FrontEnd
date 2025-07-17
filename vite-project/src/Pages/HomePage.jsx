import React, { useEffect } from "react";
import Header from "../utilitarios/Header"; // Verifique o caminho real do seu Header
import Footer from "../utilitarios/Footer"; // Verifique o caminho real do seu Footer
import styles from "../styles/App.module.css";
import global from "../styles/Global.module.css";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
const urlAPI = import.meta.env.VITE_API_BASE_URL
// Dados dos serviços (modelo para que você possa adicionar/editar facilmente)
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

const HomePage = () => {
  const navigate = useNavigate(); // Inicializar useNavigate

  // Redirecionamento condicional usando useEffect para o React Router
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/logado", { replace: true }); // Redireciona e substitui a entrada no histórico
    }
  }, [navigate]); // navigate é uma dependência estável do useCallback

  const handleAgendarClick = (serviceTitle, serviceTime) => {
    // Redireciona para a página de agendamento com os parâmetros do serviço
    navigate(
      `/agendar?servico=${encodeURIComponent(
        serviceTitle
      )}&tempo=${serviceTime}`
    );
  };

  return (
    <>
      <Helmet>
        <title>Home | Barbearia Premium</title>
        <meta
          name="description"
          content="Conheça os serviços de corte de cabelo, barba e sobrancelha da Barbearia Premium. Agende seu horário online!"
        />
      </Helmet>

      <div className={global.pai}>
        <main className={`${styles.heroSection} ${styles.bgServicos}`}>
          <section className={`${global.container} ${styles.servicosContent}`}>
            <div className={styles.introText}>
              <h1>Seu Estilo, Nossa Arte.</h1>
              <p>
                Descubra uma experiência única de cuidado masculino com nossos
                serviços especializados.
              </p>
            </div>

            <div className={styles.servicesGrid}>
              {SERVICES_DATA.map((service) => (
                <div key={service.id} className={styles.serviceCard}>
                  <h2>{service.title}</h2>
                  <p>{service.description}</p>
                  <div className={styles.priceDuration}>
                    <h3>
                      Preço:{" "}
                      <span>
                        R${service.price.toFixed(2).replace(".", ",")}
                      </span>
                    </h3>
                    <h3>
                      Duração: <span>{service.time} min</span>
                    </h3>
                  </div>
                  <button
                    className={styles.agendarButton}
                    onClick={() =>
                      handleAgendarClick(service.title, service.time)
                    }
                  >
                    Agendar
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>  
    </>
  );
};

export default HomePage;
