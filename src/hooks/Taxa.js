import api from "../services/api";
import { authHeader } from "../services/authHeader";

export const getTaxa = async () => {
  const { Authorization } = authHeader();

  return await api
    .get("/taxa", {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};

export const updateTaxa = async (formTaxa) => {
  const { Authorization } = authHeader();

  return await api
    .put(`/taxa/${formTaxa.id}`, formTaxa, {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};

export const getListPayments = async () => {
  const { Authorization } = authHeader();
  // Checar se a lista de tipo de pagamentos está armazenado no localstorage, caso
  // não esteja raliza um busca na api.
  let typePayments = JSON.parse(localStorage.getItem("_system_type_payments"));

  if (!typePayments) {
    await api
      .get("payment", {
        headers: { Authorization: Authorization },
      })
      .then((resp) => {
        localStorage.setItem(
          "_system_type_payments",
          JSON.stringify(resp.data)
        );
        typePayments = resp.data;
      });
  }
  return typePayments;
};
