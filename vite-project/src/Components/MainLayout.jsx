import React from "react";
import Header from "../utilitarios/Header";
import Footer from "../utilitarios/Footer";
import global from "../styles/Global.module.css";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
const getToken = () => {
  const token = localStorage.getItem("token");
  return token;
};

const MainLayout = () => {
  const navigate = useNavigate();
  const token = getToken();

  if (token) {
    const checkAuth = async () => {
      const response = await fetch("http://localhost:5000/check-auth", {
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

        <Outlet />
      
      </div>
    </>
  );
};

export default MainLayout;
