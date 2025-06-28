import React from "react";
import ReactDom from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import Footer from "./utilitarios/Footer";

ReactDom.createRoot(document.getElementById("root")).render(
  <>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </>
);
