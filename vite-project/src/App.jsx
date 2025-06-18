import React from "react";
import Header from "./utilitarios/Header";
import Footer from "./utilitarios/Footer";
import { Routes, Route } from "react-router-dom";
import Register from "./Pages/Register";
import HomePage from "./Pages/HomePage";
import Login from "./Pages/Login";
import global from "./styles/Global.module.css";

function App() {
  return (
    <div className={global.pai}>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
