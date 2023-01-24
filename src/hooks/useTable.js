import api from "../services/api";
import { authHeader } from "../services/authHeader";

/**
 * Busca todos as mesas cadastradas
 * @returns {Object} Lista de mesas cadastradas
 */
export const getListTable = async () => {
  const { Authorization } = authHeader();

  return await api
    .get("table", { headers: { Authorization: Authorization } })
    .then((resp) => resp.data);
};

/**
 *  Salva a nova mesa passada no banco de dados
 * @param {object} data Objeto com as propriedade { amountofplace, repeat }
 */
export const saveTable = async (data) => {
  const { Authorization } = authHeader();

  return await api
    .post("/table/create", data, { headers: { Authorization: Authorization } })
    .then((resp) => resp.data);
};

/**
 * Cria uma comada para a mesa
 * @param {object} data Objeto contendo { idTable, nameClient, tokenOperation}
 * @returns {object} Dados da comanda criada
 */
export const createCommads = async ({
  idTable,
  nameclient,
  tokenOperation,
}) => {
  const { Authorization } = authHeader();

  const data = {
    nameclient: nameclient,
  };

  return await api
    .post(`/table/${idTable}/commads/create`, data, {
      headers: { Authorization: Authorization, tokenOperation: tokenOperation },
    })
    .then((resp) => resp.data);
};

/**
 * LISTA TODOS OS PEDIDOS DA COMANDA
 * @param {object} data Objeto contendo { commadsId, statusRequest }
 * @returns {Array<object>} lista dos pedidos da comanda
 */
export const listItemCommads = async (
  commadsId,
  statusRequest = "1,2,3,4,5"
) => {
  const { Authorization } = authHeader();

  return await api
    .get("table/commads/items", {
      headers: {
        Authorization: Authorization,
        commads_id: commadsId,
        statusRequest: statusRequest,
      },
    })
    .then((resp) => resp.data);
};

/**
 * PAGAMENTO DA COMANDA DO CLIENTE
 * @param {object} data Objeto contendo { commadsId, tokenoperation }
 * @returns {object} object
 */
export const paymentCommads = async ({ commadsId, tokenoperation }) => {
  const { Authorization } = authHeader();

  return await api
    .put(
      `table/commads/payment/${commadsId}`,
      {},
      {
        headers: {
          Authorization: Authorization,
          tokenoperation: tokenoperation,
        },
      }
    )
    .then((resp) => resp.data);
};
