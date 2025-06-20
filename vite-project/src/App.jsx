import React from "react";
import Header from "./utilitarios/Header";
import Footer from "./utilitarios/Footer";
import { Routes, Route } from "react-router-dom";
import Register from "./Pages/Register";
import HomePage from "./Pages/HomePage";
import Login from "./Pages/Login";
import global from "./styles/Global.module.css";
import PrivateRoute from "./Components/PrivateRoute.jsx";
import Logado from "./Pages/Logado";

function App() {
  return (
    <div className={global.pai}>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/logado" element={<Logado />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
