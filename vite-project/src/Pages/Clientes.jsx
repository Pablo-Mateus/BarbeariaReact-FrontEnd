import React from "react";
import header from "../styles/Header.module.css";
import global from "../styles/Global.module.css";
import logo from "../assets/Captura de tela 2024-09-02 141005 1LOGO.svg";
import { NavLink } from "react-router-dom";
import agendamentos from "../styles/Agendamentos.module.css";
import Footer from "../utilitarios/Footer";
const urlAPI = import.meta.env.VITE_API_BASE_URL
const Clientes = () => {
  const token = localStorage.getItem("token");
  const [agendamentosList, setAgendamentosList] = React.useState([]);
  const [filterStatus, setFilterStatus] = React.useState("all"); // 'all', 'Pendente', 'Aceito', 'Cancelado'
  const [confirmStatus, setConfirmStatus] = React.useState("Aceitar")
  // Efeito para carregar os agendamentos ao montar o componente
  React.useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const request = await fetch(`${urlAPI}/showSchedule`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await request.json();

        if (request.ok && data.usuario) {
          setAgendamentosList(data.usuario);
        } else {
          console.error("Erro ao buscar agendamentos:", data.message);
          setAgendamentosList([]); // Garante que a lista seja limpa em caso de erro
        }
      } catch (error) {
        console.error("Erro na requisição de agendamentos:", error);
        setAgendamentosList([]);
      }
    };
    fetchSchedules();
  }, [token,confirmStatus]); // Dependência no token para recarregar se ele mudar

  // Função para cancelar um agendamento
  async function handleCancelarAgendamento(agendamentoId) {
    const confirmCancel = window.confirm(
      "Tem certeza que deseja cancelar este agendamento?"
    );
    if (!confirmCancel) return;

    try {
      const request = await fetch(`${urlAPI}/cancelSchedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ agendamentoId }), // Envia o ID do agendamento
      });
      const data = await request.json();

      if (request.ok) {
        alert(data.message);
        // Atualiza o estado da lista localmente para refletir o cancelamento
        setAgendamentosList((prevList) =>
          prevList.map((agendamento) =>
            agendamento._id === agendamentoId
              ? { ...agendamento, status: "Cancelado pelo usuário" }
              : agendamento
          )
        );
      } else {
        alert(`Erro ao cancelar agendamento: ${data.message}`);
      }
    } catch (error) {
      console.error("Erro ao enviar requisição de cancelamento:", error);
      alert("Erro de conexão ao tentar cancelar o agendamento.");
    }
  }

  //Função para aceitar agendamentos.
  async function handleConfirmarAgendamento(agendamentoId) {
  setConfirmStatus("Aguarde")
    try{
    const response = await fetch(`${urlAPI}/confirmSchedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,

      },
      body: JSON.stringify({ agendamentoId }),
    })
    const data = await response.json()
    if(response.ok) {
      alert(data.message)
      fetchSchedules();
    }
    }catch(err){
    console.log(err)
    }
  }

  // Função para filtrar os agendamentos com base no status
  const filteredAgendamentos = agendamentosList.filter((agendamento) => {
    if (filterStatus === "all") {
      return true;
    }
    // Inclui ambos os tipos de cancelado na categoria 'Cancelado'
    if (filterStatus === "Cancelado") {
      return agendamento.status.includes("Cancelado");
    }
    if (filterStatus === "Pendente") {
      return agendamento.status.includes("Aguardando aceite");
    }

    return agendamento.status === filterStatus;
  });

  return (
    <div className={agendamentos.pageWrapper}>
      <main className={agendamentos.mainContent}>
        <h1>Meus Agendamentos</h1>

        <div className={agendamentos.filterButtons}>
          <button
            className={`${agendamentos.filterButton} ${
              filterStatus === "all" ? agendamentos.activeFilter : ""
            }`}
            onClick={() => setFilterStatus("all")}
          >
            Todos
          </button>
          <button
            className={`${agendamentos.filterButton} ${
              filterStatus === "Pendente" ? agendamentos.activeFilter : ""
            }`}
            onClick={() => setFilterStatus("Pendente")}
          >
            Pendentes
          </button>
          <button
            className={`${agendamentos.filterButton} ${
              filterStatus === "Aceito" ? agendamentos.activeFilter : ""
            }`}
            onClick={() => setFilterStatus("Aceito")}
          >
            Aceitos
          </button>
          <button
            className={`${agendamentos.filterButton} ${
              filterStatus === "Cancelado" ? agendamentos.activeFilter : ""
            }`}
            onClick={() => setFilterStatus("Cancelado")}
          >
            Cancelados
          </button>
        </div>

        {filteredAgendamentos.length > 0 ? (
          <ul className={agendamentos.agendamentosList}>
            {filteredAgendamentos.map((agendamento) => (
              <li
                key={agendamento._id}
                className={`${agendamentos.agendamentoItem} ${
                  agendamento.status.includes("Cancelado")
                    ? agendamentos.cancelado
                    : agendamento.status === "Aceito"
                    ? agendamentos.aceito
                    : agendamentos.pendente
                }`}
              >
                <div className={agendamentos.agendamentoDetails}>
                  <h3>
                    Serviço:{" "}
                    <span>
                      {agendamento.servico.charAt(0).toUpperCase() +
                        agendamento.servico.slice(1)}
                    </span>
                  </h3>
                   <p>Nome:
                    <span>
                      {agendamento.nome.charAt(0).toUpperCase() +
                        agendamento.nome.slice(1)}
                    </span>
                  </p>
                  <p>
                    Data:{" "}
                    <span>
                      {new Date(agendamento.createdAt).toLocaleDateString(
                        "pt-BR"
                      )}
                    </span>
                  </p>
                  <p>
                    Início:{" "}
                    <span>
                      {agendamento.horarios ? agendamento.horarios[0] : "N/A"}
                    </span>
                  </p>
                  <p>
                    Término:{" "}
                    <span>
                      {agendamento.horarios
                        ? agendamento.horarios[agendamento.horarios.length - 1]
                        : "N/A"}
                    </span>
                  </p>
                  <p>
                    Status:{" "}
                    <span
                      className={`${agendamentos.statusText} ${
                        agendamento.status.includes("Cancelado")
                          ? agendamentos.statusCancelado
                          : agendamento.status === "Aceito"
                          ? agendamentos.statusAceito
                          : agendamentos.statusPendente
                      }`}
                    >
                      {agendamento.status}
                    </span>
                  </p>
                </div>
                {!agendamento.status.includes("Cancelado") &&
                 ( // Apenas permite cancelar se não for cancelado nem aceito
                    <>
                        <button
                      className={agendamentos.cancelButton}
                      onClick={() => handleCancelarAgendamento(agendamento._id)}
                    >
                      Cancelar Agendamento
                    </button>
                      {!agendamento.status.includes("Aceito") &&  <button className={agendamentos.buttonAccept}
                                                                          onClick={() => handleConfirmarAgendamento(agendamento._id)}>
                        {confirmStatus}
                      </button>}

                    </>
                  )}
              </li>
            ))}
          </ul>
        ) : (
          <p className={agendamentos.noAppointments}>
            Nenhum agendamento encontrado para o status atual.
          </p>
        )}
      </main>
    </div>
  );
};

export default Clientes;
