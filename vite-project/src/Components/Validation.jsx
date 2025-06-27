import React from "react";

const validar = () => {
  // Faz a validação do token para saber se quem está logado é usuário ou barbeiro e faz o redirecionamento caso tente acessar via URL.
  const token = localStorage.getItem("token");
  const request = async () => {
    const response = await fetch("http://localhost:5000/check-auth", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (data.user === "felipe@gmail.com") {
      return (window.location.href = "/logadoBarbeiro");
    } else if (data.user !== "felipe@gmail.com") {
      return (window.location.href = "/logado");
    }
  };
  request();
  return request;
};

export default validar;
