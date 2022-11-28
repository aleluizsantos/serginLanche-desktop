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
  switch (respDialog) {
    case 0:
      if (automaticOrderConfirmation)
        orders.map(async (item) => await confirmationOrder(item.id));
      return "dashboard";
    case 1:
      printCoupom(orders);
      break;
    case 2:
      if (automaticOrderConfirmation)
        orders.map(async (item) => await confirmationOrder(item.id));

      return "myOrders";
    default:
      if (automaticOrderConfirmation)
        orders.map(async (item) => await confirmationOrder(item.id));
      return "dashboard";
  }
}

/**
 * Confirma o pedido
 * @param {Number} orderId
 */
async function confirmationOrder(orderId) {
  const token = await getToken();
  try {
    return await api
      .put(
        `request/${orderId}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((resp) => resp.data);
  } catch (error) {
    console.log("Falha na confirmação automática do pedido." + error.message);
  }
}

module.exports = { actionNewOrders, confirmationOrder };
