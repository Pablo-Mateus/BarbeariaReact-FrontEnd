import React, { useState, useCallback } from "react";
import global from "../styles/Global.module.css";
import formStyles from "../styles/Register.module.css"; // Renomeado para 'formStyles' para clareza
import { NavLink, useNavigate } from "react-router-dom";
import Header from "../utilitarios/Header"; // Adicionado Header
import Footer from "../utilitarios/Footer"; // Adicionado Footer
import { CircularProgress, Snackbar, Alert } from "@mui/material"; // Importar do MUI para feedback

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Iniciar como false
  const [formErrors, setFormErrors] = useState({}); // Para validação de campos
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  // Função para validar email (reaproveitada do Register)
  const validateEmail = (value) => {
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}(?:\.[a-z]{2})?$/i;
    if (!value) return "Email é obrigatório.";
    if (!regex.test(value)) return "Email inválido.";
    return "";
  };

  // Função para validar senha (apenas se preenchida)
  const validateSenha = (value) => {
    if (!value) return "Senha é obrigatória.";
    return "";
  };

  // Handler para input de email
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setFormErrors((prev) => ({ ...prev, email: validateEmail(value) }));
  };

  // Handler para input de senha
  const handleSenhaChange = (e) => {
    const value = e.target.value;
    setSenha(value);
    setFormErrors((prev) => ({ ...prev, senha: validateSenha(value) }));
  };

  // Validação geral do formulário antes do submit
  const validateForm = () => {
    const errors = {
      email: validateEmail(email),
      senha: validateSenha(senha),
    };
    setFormErrors(errors);
    return Object.values(errors).every((error) => error === "");
  };

  async function forgotPass(event) {
    event.preventDefault(); // Previne o comportamento padrão do link

    if (!email || validateEmail(email)) {
      setSnackbar({
        open: true,
        message: "Por favor, insira um email válido para redefinir a senha.",
        severity: "warning",
      });
      setFormErrors((prev) => ({ ...prev, email: validateEmail(email) })); // Destaca o campo email
      return;
    }

    setIsLoading(true); // Ativa o spinner para a solicitação de redefinição
    setSnackbar({
      open: true,
      message: "Enviando e-mail de redefinição...",
      severity: "info",
    });

    try {
      const response = await fetch("http://localhost:5000/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();
      if (response.ok) {
        setSnackbar({
          open: true,
          message:
            data.message || "Link de redefinição enviado para o seu e-mail!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: data.message || "Erro ao solicitar redefinição de senha.",
          severity: "error",
        });
      }
    } catch (err) {
      console.error("Erro na requisição forgotPass:", err);
      setSnackbar({
        open: true,
        message: "Erro de conexão. Verifique sua internet.",
        severity: "error",
      });
    } finally {
      setIsLoading(false); // Desativa o spinner
    }
  }

  async function handleAuth(event) {
    event.preventDefault();

    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "Por favor, preencha todos os campos obrigatórios.",
        severity: "error",
      });
      return;
    }

    setIsLoading(true); // Ativa o estado de carregamento
    setSnackbar({ open: true, message: "Autenticando...", severity: "info" });

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await response.json();

      if (response.ok) {
        localStorage.setItem("token", dados.token);
        setSnackbar({
          open: true,
          message: dados.message || "Login realizado com sucesso!",
          severity: "success",
        });
        setTimeout(() => {
          navigate(dados.redirect, { replace: true });
        }, 1500); // Pequeno delay para o usuário ver a mensagem
      } else {
        setSnackbar({
          open: true,
          message: dados.message || "Erro ao fazer login.",
          severity: "error",
        });
      }
    } catch (err) {
      console.error("Erro na requisição handleAuth:", err);
      setSnackbar({
        open: true,
        message: "Erro de conexão ao fazer login. Tente novamente.",
        severity: "error",
      });
    } finally {
      setIsLoading(false); // Desativa o estado de carregamento
    }
  }

  const handleSnackbarClose = useCallback((event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <>
      <main className={formStyles.registerPageContainer}>
        {" "}
        {/* Reutiliza o container geral de formulário */}
        <h1 className={formStyles.title}>LOGIN</h1>
        <form className={formStyles.form} onSubmit={handleAuth}>
          {" "}
          {/* Reutiliza o estilo de formulário */}
          <div className={formStyles.formGroup}>
            <label htmlFor="email" className={formStyles.label}>
              Email
            </label>
            <input
              className={`${formStyles.input} ${
                formErrors.email ? formStyles.inputError : ""
              }`}
              type="email"
              id="email"
              name="email"
              placeholder="seu.email@example.com"
              value={email}
              onChange={handleEmailChange}
            />
            {formErrors.email && (
              <span className={formStyles.errorMessage}>
                {formErrors.email}
              </span>
            )}
          </div>
          <div className={formStyles.formGroup}>
            <label htmlFor="password" className={formStyles.label}>
              Senha
            </label>
            <input
              className={`${formStyles.input} ${
                formErrors.senha ? formStyles.inputError : ""
              }`}
              type="password"
              id="password"
              name="password"
              placeholder="Sua senha"
              value={senha}
              onChange={handleSenhaChange}
            />
            {formErrors.senha && (
              <span className={formStyles.errorMessage}>
                {formErrors.senha}
              </span>
            )}
          </div>
          <NavLink
            className={formStyles.forgotPasswordLink}
            onClick={forgotPass}
          >
            Esqueci minha senha
          </NavLink>
          <button
            type="submit"
            className={formStyles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Entrar"
            )}
          </button>
          <div className={formStyles.registerPrompt}>
            Não tem uma conta?{" "}
            <NavLink to="/register" className={formStyles.registerLink}>
              Crie uma agora!
            </NavLink>
          </div>
        </form>
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
    </>
  );
};

export default Login;
