import React from "react";
import Header from "./utilitarios/Header";
import Footer from "./utilitarios/Footer";
import { Routes, Route } from "react-router-dom";
import Register from "./Pages/Register";
import HomePage from "./Pages/HomePage";
import Login from "./Pages/Login";
import global from "./styles/Global.module.css";
import PrivateRoute from "./Components/PrivateRoute.jsx";
import PrivateRouteAdm from "./Components/PrivateRouteAdm.jsx";
import Logado from "./Pages/Logado";
import NotFound from "./Pages/NotFound.jsx";
import MainLayout from "./Components/MainLayout.jsx";
import LogadoBarbeiro from "./Pages/LogadoBarbeiro.jsx";
import ForgotPass from "./Pages/ForgotPass.jsx";
import DefinirHorario from "./Pages/DefinirHorario.jsx";
import Agendar from "./Pages/Agendar.jsx";
function App() {
  return (
    <div className={global.pai}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/logado" element={<Logado />} />
          <Route path="/agendar" element={<Agendar />} />
        </Route>
        <Route element={<PrivateRouteAdm />}>
          <Route path="/logadoBarbeiro" element={<LogadoBarbeiro />} />
          <Route path="/DefinirHorario" element={<DefinirHorario />} />
        </Route>
        <Route path="*" element={<NotFound />}></Route>
        <Route path="/forgotpass" element={<ForgotPass />}></Route>
      </Routes>
    </div>
  );
}

export default App;
