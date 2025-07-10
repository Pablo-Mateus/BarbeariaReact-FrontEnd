import React, { useState, useCallback } from "react";
import global from "../styles/Global.module.css";
import register from "../styles/Register.module.css";
import { useNavigate } from "react-router-dom";
import Header from "../utilitarios/Header";
import Footer from "../utilitarios/Footer";
import { CircularProgress, Snackbar, Alert } from "@mui/material"; // Importar do MUI para feedback

const Register = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState(""); // Renomeado para camelCase
  const [isLoading, setIsLoading] = useState(false); // Iniciar como false
  const [formErrors, setFormErrors] = useState({}); // Objeto para erros de validação de campo
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Função de validação de email
  const validateEmail = (value) => {
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}(?:\.[a-z]{2})?$/i;
    if (!value) return "Email é obrigatório.";
    if (!regex.test(value)) return "Email inválido.";
    return "";
  };

  // Função de máscara e validação de telefone
  const applyPhoneMask = (value) => {
    let digits = value.replace(/\D/g, ""); // Remove não-dígitos
    digits = digits.slice(0, 11); // Limita a 11 dígitos

    if (digits.length > 10) {
      return digits.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (digits.length > 6) {
      return digits.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3"); // Permite preenchimento parcial
    } else if (digits.length > 2) {
      return digits.replace(/^(\d{2})/, "($1) ");
    }
    return digits;
  };

  const validatePhone = (value) => {
    const digits = value.replace(/\D/g, "");
    if (!value) return "Telefone é obrigatório.";
    if (digits.length < 10) return "Número de telefone incompleto (mín. 10 dígitos).";
    return "";
  };

  // Função de validação de senha
  const validatePassword = (value) => {
    if (!value) return "Senha é obrigatória.";
    if (value.length < 10) return "A senha deve conter no mínimo 10 caracteres.";
    if (!/[!@#$%&*]/.test(value)) return "A senha deve conter pelo menos um caractere especial (!@#$%&*).";
    return "";
  };

  // Função de validação de confirmação de senha
  const validateConfirmPassword = (value) => {
    if (!value) return "Confirmação de senha é obrigatória.";
    if (value !== senha) return "As senhas não coincidem.";
    return "";
  };

  // Handler para input de email
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setFormErrors((prev) => ({ ...prev, email: validateEmail(value) }));
  };

  // Handler para input de telefone
  const handleTelefoneChange = (e) => {
    const value = e.target.value;
    const maskedValue = applyPhoneMask(value);
    setTelefone(maskedValue);
    setFormErrors((prev) => ({ ...prev, telefone: validatePhone(maskedValue) }));
  };

  // Handler para input de senha
  const handleSenhaChange = (e) => {
    const value = e.target.value;
    setSenha(value);
    setFormErrors((prev) => ({ ...prev, senha: validatePassword(value) }));
    // Revalida a confirmação de senha se a senha mudar
    setFormErrors((prev) => ({ ...prev, confirmarSenha: validateConfirmPassword(confirmarSenha) }));
  };

  // Handler para input de confirmação de senha
  const handleConfirmarSenhaChange = (e) => {
    const value = e.target.value;
    setConfirmarSenha(value);
    setFormErrors((prev) => ({ ...prev, confirmarSenha: validateConfirmPassword(value) }));
  };

  // Validação geral do formulário antes do submit
  const validateForm = () => {
    const errors = {
      nome: !nome ? "Nome é obrigatório." : "",
      email: validateEmail(email),
      telefone: validatePhone(telefone),
      senha: validatePassword(senha),
      confirmarSenha: validateConfirmPassword(confirmarSenha),
    };

    setFormErrors(errors);

    // Retorna true se não houver nenhum erro
    return Object.values(errors).every((error) => error === "");
  };

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "Por favor, corrija os erros no formulário.",
        severity: "error",
      });
      return;
    }

    setIsLoading(true); // Ativa o estado de carregamento
    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, telefone, senha, confirmarsenha: confirmarSenha }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setSnackbar({
          open: true,
          message: data.message || "Registro realizado com sucesso!",
          severity: "success",
        });
        setTimeout(() => {
          navigate(data.redirect, { replace: true });
        }, 1500); // Pequeno delay para o usuário ver a mensagem
      } else {
        setSnackbar({
          open: true,
          message: data.msg || "Erro ao registrar.",
          severity: "error",
        });
      }
    } catch (err) {
      console.error("Erro na requisição de registro:", err);
      setSnackbar({
        open: true,
        message: "Erro de conexão ao registrar. Tente novamente.",
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
      <Header />
      <main className={register.registerPageContainer}> {/* Novo container para a página */}
        <h1 className={register.title}>CRIE SUA CONTA</h1>
        <form className={register.form} onSubmit={handleSubmit}>
          <div className={register.formGroup}>
            <label htmlFor="name" className={register.label}>
              Nome de usuário
            </label>
            <input
              className={`${register.input} ${formErrors.nome ? register.inputError : ""}`}
              type="text"
              id="name"
              name="name"
              placeholder="Seu nome completo"
              value={nome}
              onChange={({ target }) => {
                setNome(target.value);
                setFormErrors((prev) => ({ ...prev, nome: !target.value ? "Nome é obrigatório." : "" }));
              }}
            />
            {formErrors.nome && <span className={register.errorMessage}>{formErrors.nome}</span>}
          </div>

          <div className={register.formGroup}>
            <label htmlFor="email" className={register.label}>
              Email
            </label>
            <input
              className={`${register.input} ${formErrors.email ? register.inputError : ""}`}
              type="email"
              id="email"
              name="email"
              placeholder="seu.email@example.com"
              value={email}
              onChange={handleEmailChange}
            />
            {formErrors.email && <span className={register.errorMessage}>{formErrors.email}</span>}
          </div>

          <div className={register.formGroup}>
            <label htmlFor="telefone" className={register.label}>
              Telefone
            </label>
            <input
              className={`${register.input} ${formErrors.telefone ? register.inputError : ""}`}
              type="tel" 
              id="telefone"
              name="telefone"
              placeholder="(XX) XXXXX-XXXX"
              maxLength="15"
              value={telefone}
              onChange={handleTelefoneChange}
            />
            {formErrors.telefone && <span className={register.errorMessage}>{formErrors.telefone}</span>}
          </div>

          <div className={register.formGroup}>
            <label htmlFor="senha" className={register.label}>
              Senha
            </label>
            <input
              className={`${register.input} ${formErrors.senha ? register.inputError : ""}`}
              type="password"
              id="senha"
              name="senha"
              placeholder="Sua senha segura"
              value={senha}
              onChange={handleSenhaChange}
            />
            {formErrors.senha && <span className={register.errorMessage}>{formErrors.senha}</span>}
          </div>

          <div className={register.formGroup}>
            <label htmlFor="confirmarSenha" className={register.label}>
              Confirmar Senha
            </label>
            <input
              className={`${register.input} ${formErrors.confirmarSenha ? register.inputError : ""}`}
              type="password"
              id="confirmarSenha"
              name="confirmarSenha"
              placeholder="Confirme sua senha"
              value={confirmarSenha}
              onChange={handleConfirmarSenhaChange}
            />
            {formErrors.confirmarSenha && <span className={register.errorMessage}>{formErrors.confirmarSenha}</span>}
          </div>

          <ul className={register.passwordRequirements}>
            <li>A senha deve conter no mínimo 10 dígitos.</li>
            <li>A senha deve conter pelo menos um caractere especial (!@#$%&*).</li>
          </ul>

          <button className={register.submitButton} type="submit" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Registrar-se"}
          </button>
        </form>
      </main>
      <Footer />

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

export default Register;