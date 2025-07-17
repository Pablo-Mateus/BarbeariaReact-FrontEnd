import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Footer from "../utilitarios/Footer";
import Header from "../utilitarios/Header";
const urlAPI = import.meta.env.VITE_API_BASE_URL
const getToken = () => {
  const token = localStorage.getItem("token");
  return token;
};

const PrivateRoute = () => {
  const [isAuthenticated, setisAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate();
  const publicNavLinks = [{ to: "/Clientes", text: "Clientes" }, { to: "/DefinirHorario", text: "Horários" }];

  React.useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();

      if (!token) {
        setisAuthenticated(false);
        setIsLoading(false);
        console.log("PrivateRoute: Nenhum token encontrado. Não autenticado.");
        return;
      }

      try {
        const response = await fetch(`${urlAPI}/check-auth`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          setisAuthenticated(data.isAuthenticated);
          if (data.user !== "felipe@gmail.com") {
            return navigate("/logado", { replace: true });
          }
        } else {
          setisAuthenticated(false);
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("PrivateRoute: Erro na requisição de autenticação:", err); // Use console.error
        setisAuthenticated(false);
        localStorage.removeItem("token"); // Limpa o token em caso de erro de rede
      } finally {
        setIsLoading(false); // <--- AQUI A MUDANÇA PARA FALSE ACONTECE
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Carregando autenticação...</div>; // Exibe algo enquanto espera
  }

  // Se não estiver mais carregando, decide o que renderizar
  return isAuthenticated ? (
    <>
      <Header
        headerType="Public"
        logoRedirectPath="/"
        navLinks={publicNavLinks}
        onLogout={true}
      />
      <Outlet />
      <Footer />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
