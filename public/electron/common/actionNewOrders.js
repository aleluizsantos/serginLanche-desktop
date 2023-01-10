const { dialog } = require("electron");
const printCoupom = require("../componets/printCoupom");
const { getDefaultPrinters, getToken } = require("../storage");
const api = require("../service/api");

const optionsMessage = {
  type: "question",
  buttons: ["Não, obrigado", "Sim, por favor", "Ir para caixa de pedido"],
  defaultId: 2,
  title: "Novo pedido",
  message: "Existe pedido em sua caixa de entrada?",
  detail: "Deseja imprimir os pedidos?",
};

/**
 * Ao abrir o sistema e caso exista pedido, exibir caixa dialogo
 * para o usuário escolher o que dejesa fazer
 * ABRIR SISTEMA | IMPRIMIR | IR PAR CAIXA DE PEDIDO
 * @param {Array<object>} orders
 * @returns {Promise<string>} Retorna o redirecionamento da page
 */
async function actionNewOrders(orders) {
  const { automaticOrderConfirmation } = getDefaultPrinters();
  const respDialog = dialog.showMessageBoxSync(null, optionsMessage);

  if (automaticOrderConfirmation)
    orders.map(async (item) => await confirmationOrder(item));

  switch (respDialog) {
    case 0:
      return "dashboard";
    case 1:
      printCoupom(orders);
      break;
    case 2:
      return "myOrders";
    default:
      return "dashboard";
  }
}

/**
 * Confirma o pedido
 * @param {Number} orderId
 */
async function confirmationOrder(item, setStatus = null) {
  const token = await getToken();
  const nextStage = item.statusRequest_id + 1;
  const data = {
    ...item,
    nextStage: setStatus === null ? nextStage : setStatus,
  };

  try {
    return await api
      .put(`/request`, data, {
        headers: { Authorization: token },
      })
      .then((response) => response.data);
  } catch (error) {
    console.log("Falha na confirmação automática do pedido." + error.message);
  }
}

/**
 * Definir que o cupom foi impresso
 * @param {Number} id Informe o ID do pedido para definir como foi impresso
 */
async function couponWasPrinted(id) {
  const token = await getToken();
  try {
    return api.put(
      `/request/${id}`,
      {},
      {
        headers: { Authorization: token },
      }
    );
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = { actionNewOrders, confirmationOrder, couponWasPrinted };
