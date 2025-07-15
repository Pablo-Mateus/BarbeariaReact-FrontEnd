import React, { useCallback, useState, useEffect } from "react";
import header from "../styles/Header.module.css";
import global from "../styles/Global.module.css";
import logo from "../assets/Captura de tela 2024-09-02 141005 1LOGO.svg";
import { NavLink, useParams, useNavigate } from "react-router-dom"; // Removido 'replace' se não estiver usando
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"; // Mantive DatePicker para flexibilidade
import agendar from "../styles/Agendar.module.css";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { CircularProgress, Snackbar, Alert } from "@mui/material"; // Para loading e feedback
import agendamentos from "../styles/Agendamentos.module.css";

// Cores base para o tema, importadas ou definidas aqui
const PRIMARY_BLUE = "#212F3D";
const ACCENT_GOLD = "#FFD700";
const LIGHT_GREY_BG = "#f8f8f8";
const TEXT_LIGHT = "#fff";

// Container estilizado para o calendário e seleção de horários
const StyledSchedulerContainer = styled("div")(({ theme }) => ({
  backgroundColor: "#ffffff",
  borderRadius: "16px", // Bordas mais arredondadas para o container geral
  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)", // Sombra elegante
  overflow: "hidden",
  maxWidth: 900, // Ajuste a largura máxima
  width: "100%",
  margin: "40px auto", // Centraliza e dá espaçamento
  display: "flex", // Para alinhar calendário e horários
  flexDirection: "column", // Padrão é coluna para mobile
  [theme.breakpoints.up("md")]: {
    flexDirection: "row", // No desktop, coloca lado a lado
  },
  border: `1px solid ${LIGHT_GREY_BG}`, // Borda sutil
}));

const Agendar = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const token = localStorage.getItem("token");

  // Dados do serviço da URL
  const servicoParam = params.get("servico");
  const tempoServicoParam = params.get("tempo"); // Duração do serviço em minutos

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [availableTimes, setAvailableTimes] = useState([]); // Horários disponíveis
  const [selectedTime, setSelectedTime] = useState(null); // Horário selecionado pelo usuário
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  }); // Feedback ao usuário

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const diasSemana = {
    Sun: "Domingo",
    Tue: "Terca",
    Wed: "Quarta",
    Thu: "Quinta",
    Fri: "Sexta",
    Sat: "Sabado",
    Mon: "Segunda",
  };

  // Redireciona se os parâmetros de serviço não estiverem presentes
  useEffect(() => {
    if (!servicoParam || !tempoServicoParam) {
      alert("Por favor, selecione um serviço e sua duração antes de agendar.");
      navigate("/logado", { replace: true }); // Ou para a página de seleção de serviço
    }
  }, [servicoParam, tempoServicoParam, navigate]);

  // Efeito para buscar horários disponíveis quando a data selecionada muda
  useEffect(() => {
    const fetchTimes = async () => {
      setLoading(true);
      setAvailableTimes([]); // Limpa horários anteriores
      setSelectedTime(null); // Limpa seleção de horário

      const diaFormatado = diasSemana[selectedDate.format("ddd")];

      if (!diaFormatado) {
        setSnackbar({
          open: true,
          message: "Dia da semana inválido.",
          severity: "error",
        });
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/getTimes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dia: diaFormatado }),
        });

        const data = await response.json();

        if (response.ok) {
          const fetchedTimes = data.disponiveis || [];
          setAvailableTimes(fetchedTimes);
          if (fetchedTimes.length > 0) {
            setSelectedTime(fetchedTimes[0]); // Seleciona o primeiro horário disponível por padrão
          }
        } else {
          setSnackbar({
            open: true,
            message: data.message || "Erro ao carregar horários disponíveis.",
            severity: "warning", // Warning se não há horários, erro se falha na API
          });
        }
      } catch (err) {
        console.error("Erro na requisição getTimes:", err);
        setSnackbar({
          open: true,
          message: "Erro de conexão ao buscar horários. Tente novamente.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTimes();
    console.log(selectedDate);
  }, [selectedDate]); // Re-executa quando a data selecionada muda

  // Função para lidar com o envio do agendamento
  async function handleSubmit() {
    if (!selectedDate || !selectedTime || !servicoParam || !tempoServicoParam) {
      setSnackbar({
        open: true,
        message: "Por favor, selecione a data, horário, serviço e duração.",
        severity: "warning",
      });
      return;
    }

    setLoading(true);
    const agendamentoData = {
      tempo: selectedTime, // Horário de início selecionado
      servico: servicoParam,
      hora: Number(tempoServicoParam), // Duração do serviço (certifique-se de que é um número)
      diaSemana: diasSemana[selectedDate.format("ddd")],
      date: selectedDate.$d,
    };
    console.log(agendamentoData);
    try {
      const response = await fetch("http://localhost:5000/createSchedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(agendamentoData),
      });
      const data = await response.json();

      if (response.ok) {
        // setSnackbar({
        //   open: true,
        //   message: data.message,
        //   severity: "success",
        // });
        return <NavLink to="/agendamentos">Ir para seus agendamentos!</NavLink>;
      } else {
        setSnackbar({
          open: true,
          message: data.message || "Erro ao criar agendamento.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao enviar agendamento:", error);
      setSnackbar({
        open: true,
        message: "Erro de conexão ao agendar. Tente novamente.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  // Função para limpar o token e recarregar a página (sair)
  const clearLocal = useCallback(() => {
    localStorage.removeItem("token");
    window.location.reload();
  }, []);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <div className={agendamentos.pageWrapper}>
        <main className={agendar.mainContent}>
          <h1 className={agendar.title}>Agende seu Horário</h1>
          <p className={agendar.subtitle}>
            Serviço: <strong>{servicoParam || "N/A"}</strong> | Duração:{" "}
            <strong>
              {tempoServicoParam ? `${tempoServicoParam} minutos` : "N/A"}
            </strong>
          </p>

          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            localeText={{
              okButtonLabel: "Confirmar",
              cancelButtonLabel: "Cancelar",
            }}
          >
            <StyledSchedulerContainer>
              {/* Calendar Section */}
              <div className={agendar.calendarSection}>
                <DatePicker
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  orientation={isMobile ? "portrait" : "landscape"}
                  sx={{
                    width: "100%", // Ocupa a largura total da seção
                    "& .MuiPickersLayout-root": {
                      flexDirection: isMobile ? "column" : "row",
                      alignItems: "stretch",
                    },
                    "& .MuiPickersLayout-contentWrapper": {
                      padding: isMobile ? "10px" : "16px", // Ajusta padding interno
                      minWidth: isMobile ? "100%" : "300px", // Garante largura mínima
                    },
                    "& .MuiPickersCalendarHeader-root": {
                      // Estilos para o cabeçalho do calendário (Mês, Ano)
                      backgroundColor: PRIMARY_BLUE, // Cor de fundo do cabeçalho
                      color: TEXT_LIGHT, // Cor do texto do cabeçalho
                      borderRadius: "8px 8px 0 0",
                      padding: "10px 16px",
                    },
                    "& .MuiButtonBase-root": {
                      // Botões de navegação do calendário e seleção de dia
                      color: PRIMARY_BLUE, // Cor dos ícones de navegação
                    },
                    "& .MuiPickersDay-root.Mui-selected": {
                      // Dia selecionado
                      backgroundColor: `${PRIMARY_BLUE} !important`,
                      color: TEXT_LIGHT,
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: `${PRIMARY_BLUE} !important`,
                        opacity: 0.9,
                      },
                    },
                    "& .MuiPickersDay-today": {
                      // Dia de hoje
                      borderColor: `${ACCENT_GOLD} !important`,
                      borderWidth: "2px",
                    },
                    // Estilos para as ações (OK, Cancelar, etc.)
                    "& .MuiDialogActions-root": {
                      padding: "16px",
                      justifyContent: "space-around",
                      "& .MuiButton-root": {
                        backgroundColor: PRIMARY_BLUE,
                        color: TEXT_LIGHT,
                        "&:hover": {
                          backgroundColor: ACCENT_GOLD,
                        },
                      },
                    },
                  }}
                />
              </div>

              {/* Time Slots Section */}
              <div className={agendar.timeSlotsSection}>
                <h2 className={agendar.timeSlotsTitle}>
                  Horários Disponíveis para {selectedDate.format("DD/MM")}
                </h2>
                {loading ? (
                  <div className={agendar.loadingContainer}>
                    <CircularProgress size={40} sx={{ color: PRIMARY_BLUE }} />
                    <p>Carregando horários...</p>
                  </div>
                ) : availableTimes.length > 0 ? (
                  <div className={agendar.timeButtonsContainer}>
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        className={`${agendar.timeButton} ${
                          selectedTime === time ? agendar.selectedTime : ""
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className={agendar.noTimesMessage}>
                    Nenhum horário disponível para o dia selecionado.
                    <br />
                    Por favor, escolha outra data.
                  </p>
                )}

                {availableTimes.length > 0 && (
                  <button
                    className={`${agendar.submitButton}`}
                    onClick={handleSubmit}
                    disabled={loading || !selectedTime}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Agendar Agora"
                    )}
                  </button>
                )}
              </div>
            </StyledSchedulerContainer>
          </LocalizationProvider>
        </main>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default Agendar;
