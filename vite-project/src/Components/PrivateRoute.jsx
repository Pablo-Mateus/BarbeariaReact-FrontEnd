import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/check-auth", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const dados = await response.json();
          setData(dados);
          console.log(dados);
          setIsAuthenticated(dados.isAuthenticated);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.log("Erro ao verificar autenticação", err);
      }
    };

    checkAuth();
  }, []);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
