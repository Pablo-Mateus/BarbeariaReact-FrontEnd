import React, { createContext, useState, useEffect, useContext } from "react";

// Opcional: Funções de serviço para a API de autenticação (para login/logout/checkAuth)
const urlAPI = import.meta.env.VITE_API_BASE_URL
const authService = {
  getToken: () => localStorage.getItem("token"),
  setToken: (token) => localStorage.setItem("token", token),
  removeToken: () => localStorage.removeItem("token"),
  getUserRole: () => localStorage.getItem("userRole"), // Assumindo que você salva a role
  setUserRole: (role) => localStorage.setItem("userRole", role),
  removeUserRole: () => localStorage.removeItem("userRole"),

  // Exemplo de checkAuthStatus (pode vir do seu authService.js)
  checkAuthStatus: async () => {
    const token = authService.getToken();
    if (!token) return { isAuthenticated: false, user: null };

    try {
      const response = await fetch(`${urlAPI}/check-auth`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && data.isAuthenticated) {
        // Supondo que data.user retorna {id, name, role}
        authService.setUserRole(data.user.role); // Atualiza role no localStorage
        return { isAuthenticated: true, user: data.user };
      } else {
        authService.removeToken();
        authService.removeUserRole();
        return { isAuthenticated: false, user: null };
      }
    } catch (error) {
      console.error("Erro no checkAuthStatus:", error);
      authService.removeToken();
      authService.removeUserRole();
      return { isAuthenticated: false, user: null };
    }
  },

  // Exemplo de função de login (simplificado)
  login: async (email, password) => {
    const response = await fetch(`${urlAPI}/auth/login`, {
      /* ... */
    });
    const data = await response.json();
    if (response.ok && data.token) {
      authService.setToken(data.token);
      authService.setUserRole(data.user.role); // Salva a role
      return { success: true, user: data.user, redirect: data.redirect };
    } else {
      return { success: false, message: data.message || "Login falhou" };
    }
  },
};

// Crie o contexto
const AuthContext = createContext(null);

// Crie o Provider
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Para o check inicial

  // Lógica para verificar o status de autenticação na montagem
  useEffect(() => {
    const checkStatus = async () => {
      const { isAuthenticated, user: fetchedUser } =
        await authService.checkAuthStatus();
      setIsLoggedIn(isAuthenticated);
      setUser(fetchedUser);
      setIsLoadingAuth(false);
    };
    checkStatus();
  }, []); // Executa apenas na montagem

  // Funções de login e logout que atualizam o contexto
  const login = React.useCallback(async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) {
      setIsLoggedIn(true);
      setUser(result.user);
    }
    return result; // Retorna o resultado para o componente de login/registro
  }, []);

  const logout = React.useCallback(() => {
    authService.removeToken();
    authService.removeUserRole();
    setIsLoggedIn(false);
    setUser(null);
  }, []);

  // O valor que será disponibilizado para os consumidores
  const authContextValue = React.useMemo(
    () => ({
      user,
      isLoggedIn,
      isLoadingAuth,
      login,
      logout,
      isAdmin: user && user.role === "admin", // Conveniência para saber se é admin
    }),
    [user, isLoggedIn, isLoadingAuth, login, logout]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para consumir o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
