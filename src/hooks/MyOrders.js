import api from "../services/api";
import { authHeader } from "../services/authHeader";
import { isAuthenticated } from "./Auth";

export const typeStatusMyOrders = {
  EM_ANASILE: 1,
  EM_PREPARACAO: 2,
  ROTA_ENTREGA: 3,
  RETIRAR_LOJA: 4,
  AGENDADO: 5,
  FINALIZADO: 6,
  ACTIVE: "1,2,3,4,5",
  ALL: "1,2,3,4,5,6",
};

/**
 * RETORNA UMA LISTA DE PEDIDOS, CONFORME O STATUS PASSADO.
 * @param {String} statusReq Recebe uma string contendo os id dos status dos
 * pedidos. Ex: 1: Em analise | 2: Em Preparação | 3: Rota de entrega | 4: Retira na Loja |
 * 5: Agendado  | 6: Finalizado
 */
export const getOrders = async (statusReq) => {
  const { Authorization } = authHeader();
  return await api
    .get("request", {
      headers: {
        Authorization: Authorization,
        statusRequest: statusReq,
      },
    })
    .then((response) => {
      return response.data;
    });
};

/**
 * Checa se existe pedidos recebidos do tipo 'EM ANALISE'
 * @returns {object} Contendo todos os pedidos em análise e o
 */
export const checkNewOrder = async () => {
  try {
    if (isAuthenticated()) {
      const newOrders = await getOrders(typeStatusMyOrders.EM_ANASILE);
      return newOrders;
    }
    return [];
  } catch (error) {
    return;
  }
};

/**
 * RETORNAR UMA LISTA DE ITENS DE UM PEDIDO
 * @param {Number} idMyOrder Recebe um id do pedido
 */
export const getItemsMyOrders = async (idMyOrder) => {
  const { Authorization } = authHeader();
  return await api
    .get(`request/items/${idMyOrder}`, {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};
/**
 * ALTERA O STATUS DO PEDIDO
 * @param {Object} item Recebe o item de Order para alterar o status do pedido
 * @param {Number} setStatus set o STATUS, caso seja passado
 * @returns Object {success: boolean, nextState: number, descriptionNextActionRequest: String}
 */
export const upDateStateMyOrders = async (item, setStatus = null) => {
  const { Authorization } = authHeader();
  let nextStage = item.statusRequest_id + 1;
  // Verificar se o tipo de delivery é ATENDIMENTO MESA
  if (item.deliveryType_id === 3) {
    nextStage = 7;
  } else {
    nextStage = setStatus === null ? nextStage : setStatus;
  }

  const data = {
    ...item,
    nextStage: nextStage,
  };
  return await api
    .put(`/request`, data, {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};

/**
 * REMOVER O PEDIDO INTEIRO
 * @param {Number} idMyOrder Recebe o id do pedido para ser excluido
 */
export const deletePedido = async (idMyOrder) => {
  const { Authorization } = authHeader();
  return await api
    .delete(`request/${idMyOrder}`, {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};

/**
 * EXCLUSÃO DE ITEM DO PEDIDO
 * @param {number} idMyOrder Recebe o id do pedido
 * @param {number} idItem Recebe o id do item do pedido
 */
export const deleteItemPedido = async (idMyOrder, idItem) => {
  const { Authorization } = authHeader();

  return await api
    .delete(`request/delete/item/${idMyOrder}/${idItem}`, {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};
/**
 * Retorna um object contendo o pedidos e outro objeto com os item do pedido
 * Object return { order, items }
 * @param {Object} item
 * @returns { order, items }
 */
export const addItemOrder = async (item) => {
  const { Authorization } = authHeader();
  return await api
    .post("request/item", item, {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};

/**
 * Atualiza o item do pedido
 * @param {Object} itemChange
 * @returns JSON
 */
export const changeItemMyOrder = async (itemChange) => {
  const { Authorization } = authHeader();
  return await api
    .put("request/itemChanger", itemChange, {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};

/**
 * CRIA UM PEDIDO NOVO
 * @param {object} order Objeto contendo dados para criação do novo pedido
 * @returns {object} Objeto contendo dados do pedido criado
 */
export const createOrder = async (order) => {
  const { Authorization } = authHeader();

  const itemsOrder = order.items.map((item) => {
    return {
      amount: item.amount,
      product_id: item.product.id,
      price: item.price,
      note: item.note,
      additionItem: item.additionItem,
    };
  });

  const data = {
    commads_id: order.commads_id,
    table_id: order.table_id,
    name_client: order.name_client,
    deliveryType_id: order.deliveryType_id,
    statusRequest_id: order.statusRequest_id,
    payment_id: order.payment_id,
    coupon: order.coupon,
    note: order.note,
    address: order.address,
    number: order.number,
    neighborhood: order.neighborhood,
    city: order.city,
    uf: order.uf,
    PointReferences: order.PointReferences,
    cash: order.cash,
    timeDelivery: order.timeDelivery,
    items: itemsOrder,
  };

  return await api
    .post("/request/create", data, {
      headers: { Authorization: Authorization },
    })
    .then((resp) => resp);
};

/**
 * Registra o pagamento do cliente, dando baixa na comanda e nos pedidos realizados
 * @param {number} id_commads Identificação da comanda ID
 * @param {uui} tokenOperation Token de operação
 * @param {number} typePayment Identificação do tipo de pagamento
 * @param {number} cash Valor em dinheiro para troco
 * @returns {Object} Objeto { table_busy: "", message: ""}
 */
export const makePayment = async (
  id_commads,
  tokenOperation,
  typePayment,
  cash
) => {
  const { Authorization } = authHeader();

  const data = {
    type_payment: typePayment,
    tokenoperation: tokenOperation,
    cash: cash,
  };

  return await api
    .put(`/table/commads/payment/${id_commads}`, data, {
      headers: {
        Authorization: Authorization,
      },
    })
    .then((resp) => resp.data);
};
