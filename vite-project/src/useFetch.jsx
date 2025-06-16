import React from "react";

const useFetch = () => {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [resposta, setResposta] = React.useState(null);

  const request = React.useCallback(async (url, options) => {
    try {
      const response = await fetch(url, options);
      setResposta(response);
      const dados = await response.json();
      setData(dados);
    } catch (err) {
      setError(err);
    }
  }, []);
  return { data, error, request, resposta };
};

export default useFetch;
