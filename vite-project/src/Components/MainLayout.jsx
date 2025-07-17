import React from "react";
import Header from "../utilitarios/Header";
import Footer from "../utilitarios/Footer";
import global from "../styles/Global.module.css";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
const urlAPI = import.meta.env.VITE_API_BASE_URL
const getToken = () => {
  const token = localStorage.getItem("token");
  return token;
};

const MainLayout = () => {
  const navigate = useNavigate();
  const token = getToken();

  const publicNavLinks = [
    { to: "/Login", text: "Login" },
    { to: "/Register", text: "Register" },
  ];

  if (token) {
    const checkAuth = async () => {
      const response = await fetch(`${urlAPI}/check-auth`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.user === "felipe@gmail.com") {
        return navigate("/logadoBarbeiro", { replace: true });
      } else {
        return navigate("/logado", { replace: true });
      }
    };

    checkAuth();
  }

  return (
    <>
      <div className={`${global.pai}`}>
        <Header
          headerType="Public"
          logoRedirectPath="/"
          navLinks={publicNavLinks}
          onLogout={null}
        />
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
