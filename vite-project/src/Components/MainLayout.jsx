import React from "react";
import Header from "../utilitarios/Header";
import Footer from "../utilitarios/Footer";
import global from "../styles/Global.module.css";
import { Outlet } from "react-router-dom";
const MainLayout = () => {
  return (
    <>
      <div className={`${global.pai}`}>
        <Header />
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
