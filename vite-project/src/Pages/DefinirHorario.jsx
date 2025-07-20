import React, { useCallback } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import logo from "../assets/Captura de tela 2024-09-02 141005 1LOGO.svg";
import header from "../styles/Header.module.css";
import global from "../styles/Global.module.css";
import { NavLink } from "react-router-dom";
import ChoseTime from "../styles/ChoseTime.module.css";
import { Box, Typography, CircularProgress } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
const urlAPI = import.meta.env.VITE_API_BASE_URL;
// --- CONSTANTES (MOVIDAS PARA FORA DO COMPONENTE) ---
const PRIMARY_BLUE = "#212F3D";
const ACCENT_GOLD = "#FFD700";
const LIGHT_GREY_BG = "#f8f8f8";
const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#eeeeee";

const DIAS_DA_SEMANA_MAP = {
  Segunda: "Segunda",
  Terca: "Terca",
  Quarta: "Quarta",
  Quinta: "Quinta",
  Sexta: "Sexta",
  Sabado: "Sabado",
  Domingo: "Domingo",
};

// --- COMPONENTES ESTILIZADOS ---
const StyledMainContent = styled("main")(({ theme }) => ({
  margin: "40px auto",
  padding: "0 20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "30px",
  [theme.breakpoints.down("md")]: {
    margin: "20px auto",
    padding: "0 15px",
    gap: "20px",
  },
}));

const StyledForm = styled("form")(({ theme }) => ({
  background: "white",
  // --- AQUI A MUDANÇA NO PADDING ---
  padding: "30px", // Padrão para desktop
  borderRadius: "12px",
  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
  width: "100%",
  maxWidth: "800px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  [theme.breakpoints.down("sm")]: {
    padding: "10px", // <--- REDUZIDO PARA MOBILE
    width: "95%",
    gap: "15px",
  },
}));

const DefinirHorario = () => {
  const token = localStorage.getItem("token");
  const [diaSemana, setDiaSemana] = React.useState("Segunda");
  const [inicio, setInicio] = React.useState(null);
  const [fim, setFim] = React.useState(null);
  const [intervalo, setIntervalo] = React.useState(null);
  const [resposta, setResposta] = React.useState("");
  const [fetchError, setFetchError] = React.useState(null);

  // --- HOOKS MUI ---
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // --- FUNÇÃO PARA CARREGAR HORÁRIOS DO BACKEND (useCallback) ---
  const fetchTimes = React.useCallback(async () => {
    setFetchError(null);
    setInicio(null);
    setFim(null);
    setIntervalo(null);
    try {
      const diaTraduzido = DIAS_DA_SEMANA_MAP[diaSemana];

      if (!diaTraduzido) {
        console.warn(`Dia da semana não reconhecido: ${diaSemana}`);
        setFetchError("Dia da semana inválido para busca de horários.");
        return;
      }

      const response = await fetch(`${urlAPI}/getTimes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dia: diaTraduzido }),
      });

      const data = await response.json();

      if (data.inicio && data.fim) {
        const fetchedInicio = dayjs(`2000-01-01T${data.inicio}`);
        const fetchedFim = dayjs(`2000-01-01T${data.fim}`);

        setInicio(fetchedInicio);
        setFim(fetchedFim);

        const fetchedInterval = data.intervalo;
        if (fetchedInterval) {
          const minutosIntervalo = parseInt(fetchedInterval, 10);
          if (!isNaN(minutosIntervalo)) {
            setIntervalo(
              dayjs().startOf("day").add(minutosIntervalo, "minute")
            );
          } else {
            setIntervalo(null);
          }
        } else {
          setIntervalo(null);
        }
      } else {
        setResposta(data.message || "Erro ao carregar horários do servidor.");
        setFetchError(data.message || `Erro no servidor: ${response.status}`);
        setInicio(null);
        setFim(null);
        setIntervalo(null);
        setTimeout(() => {
          setResposta("");
        }, 3000);
      }
    } catch (err) {
      console.error("Erro na requisição getTimes:", err);
      setResposta("Erro de conexão.");
      setFetchError("Erro de conexão ao buscar horários.");
      setInicio(null);
      setFim(null);
      setIntervalo(null);
    }
  }, [diaSemana]);

  // --- useEffect para disparar o fetch na montagem e quando o dia da semana muda ---
  React.useEffect(() => {
    fetchTimes();
  }, [fetchTimes]);

  // --- Função para lidar com o envio do formulário ---
  function handleSubmit(event) {
    event.preventDefault();

    setResposta("Enviando...");
    setTimeout(() => {
      setResposta("");
    }, 3000);

    try {
      if (inicio && fim && intervalo) {
        const horario = {
          diaSemana: diaSemana,
          inicio: `${inicio.hour()}:${String(inicio.minute()).padStart(
            2,
            "0"
          )}`,
          fim: `${fim.hour()}:${String(fim.minute()).padStart(2, "0")}`,
          intervalo: `${intervalo.minute()}`,
        };
        console.log("Horário a ser enviado:", horario);

        const request = async () => {
          const response = await fetch(`${urlAPI}/DefinirHorario`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(horario),
          });
          const data = await response.json();
          setResposta(data.message);
          if (response.ok) {
            fetchTimes(); // Recarrega os horários após salvar com sucesso
          }
        };
        request();
      } else {
        setResposta("Você precisa preencher todos os campos.");
      }
    } catch (err) {
      console.error("Erro no handleSubmit:", err);
      setResposta("Ocorreu um erro ao enviar os horários.");
    }
  }

  return (
    <>
      <StyledMainContent>
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: "2.5rem",
            color: PRIMARY_BLUE,
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Selecione os horários para a semana
        </Typography>
        <StyledForm id="formulario" onSubmit={handleSubmit}>
          {/* Seleção do Dia da Semana */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label htmlFor="dia-semana-select" className={ChoseTime.label}>
              Selecione o dia:
            </label>
            <select
              id="dia-semana-select"
              name="diaSemana"
              className={ChoseTime.dia}
              value={diaSemana}
              onChange={({ target }) => setDiaSemana(target.value)}
              sx={{
                padding: "8px 12px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            >
              {Object.keys(DIAS_DA_SEMANA_MAP).map((key) => (
                <option value={key} key={key}>
                  {DIAS_DA_SEMANA_MAP[key]}
                </option>
              ))}
            </select>
          </Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              sx={{
                display: "grid",
                // --- AJUSTE AQUI: flex-basis menor para mobile, para dar mais espaço ao padding ---
                gridTemplateColumns: {
                  xs: "minmax(0, 1fr)",
                  sm: "repeat(auto-fit, minmax(200px, 1fr))",
                }, // minmax(0, 1fr)
                gap: "20px",
                width: "100%",
              }}
            >
              <TimePicker
                value={inicio}
                label="Inicio"
                onChange={(newValue) => setInicio(newValue)}
                ampm={false}
                sx={{ width: "100%", minWidth: 0 }}
              />
              <TimePicker
                value={fim}
                label="Fim"
                onChange={(newValue) => setFim(newValue)}
                ampm={false}
                sx={{ width: "100%", minWidth: 0 }}
              />
              <TimePicker
                views={["minutes"]}
                value={intervalo}
                label="Intervalo (minutos)"
                timeSteps={{ minutes: 1 }}
                onChange={(newValue) => setIntervalo(newValue)}
                ampm={false}
                sx={{ width: "100%", minWidth: 0 }}
              />
            </Box>
          </LocalizationProvider>

          <span className={ChoseTime.resposta}>{resposta}</span>
          <button type="submit" className={ChoseTime.button}>
            Enviar
          </button>
        </StyledForm>
      </StyledMainContent>
    </>
  );
};

export default DefinirHorario;
