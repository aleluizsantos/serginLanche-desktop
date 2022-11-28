import api from "../services/api";
import { authHeader } from "../services/authHeader";

// get: TODOS as configurações do sistema definido pelo usuário
export const getConfigSystem = async () => {
  return await api.get("config", { headers: authHeader() }).then((response) => {
    return response.data;
  });
};

// put: Atualizar alterarção na configuração do sistema
export const upgradeConfigSystem = async (json) => {
  return await api
    .put("/config", json, { headers: authHeader() })
    .then((response) => {
      return { ...response.data, status: response.status };
    });
};

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

export const sendPushNotification = async (dataUser) => {
  return await api
    .post("pushNotification/send", dataUser, {
      headers: authHeader(),
    })
    .then((response) => {
      return "Notificação enviada";
    });
};
