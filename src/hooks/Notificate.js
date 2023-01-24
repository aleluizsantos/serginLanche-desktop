import api from "../services/api";
import { authHeader } from "../services/authHeader";

// Checar a situação do estabelecimento (Aberto/Fechado)
export const getOpenClose = async () => {
  return await api.get("operation").then((response) => {
    return response.data;
  });
};
// Definir Aberto/Fechado, faz a verificação se estiver aberto altera para fechado
// e vice-versa.
export const setOpenClose = async () => {
  return await api
    .put("operation", {}, { headers: authHeader() })
    .then((response) => {
      return response.data;
    });
};

// Enviar notificação pvis push
export const sendPushNotification = async (dataUser) => {
  return await api
    .post("pushNotification/send", dataUser, {
      headers: authHeader(),
    })
    .then(() => {
      return "Notificação enviada";
    });
};

// Buscar o horário de abertura e fechamento do estabeleciento
export const getOpeningHours = async () => {
  return await api
    .get("hours-operation", { headers: authHeader() })
    .then((resp) => resp.data);
};

// Salvar as alterações do horario de abertura e fechamento
export const saveOpeningHours = async (data) => {
  return await api
    .put(`/hours-operation/update/1`, data, {
      headers: authHeader(),
    })
    .then((resp) => resp.data);
};

export const saveActiveOpenClose = async (action) => {
  return await api
    .post(
      "/operation/active-auto-open-close",
      { state: action },
      { headers: authHeader() }
    )
    .then((result) => result.data);
};
