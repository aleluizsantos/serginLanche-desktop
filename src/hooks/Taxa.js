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

export const getListPayments = async ({ active, renew }) => {
  const { Authorization } = authHeader();
  // Checar se a lista de tipo de pagamentos está armazenado no localstorage, caso
  // não esteja raliza um busca na api.
  let typePayments = null;

  if (!renew)
    typePayments = JSON.parse(localStorage.getItem("_system_type_payments"));

  const url = active ? "/payment" : "/payment/all";

  if (!typePayments) {
    await api
      .get(url, {
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

export const updateActivePayment = async (typePayment) => {
  const { Authorization } = authHeader();

  const data = {
    active: !typePayment.active,
  };

  return api.put(`payment/active/${typePayment.id}`, data, {
    headers: { Authorization: Authorization },
  });
};

export const updateTypePayment = async (typePayment) => {
  const { Authorization } = authHeader();

  const data = {
    active: typePayment.active,
    key_pix: typePayment.key_pix,
  };

  return api.put(`payment/${typePayment.id}`, data, {
    headers: { Authorization: Authorization },
  });
};
