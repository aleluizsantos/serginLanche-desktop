import axios from "axios";

export const getCep = async (cep) => {
  const parseCep = cep.replace(/[^0-9]/g, "");

  // Checar se o cep possui os 8 digitos
  if (parseCep.length < 8) return { erro: true };

  return axios
    .get(`https://viacep.com.br/ws/${parseCep}/json/`)
    .then((response) => {
      const {
        cep,
        logradouro,
        bairro,
        localidade,
        uf,
        erro = false,
      } = response.data;
      return { cep, logradouro, bairro, localidade, uf, erro };
    })
    .catch((error) => {
      console.log(error);
    });
};
