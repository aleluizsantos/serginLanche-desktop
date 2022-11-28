const eventEmitter = require("events");
const { PosPrinter } = require("electron-pos-printer");

const { getDefaultPrinters, getSoundActive } = require("../../storage");
const soundAlert = require("../sound_Alert");
const LayoutCoupom = require("./layoutCoupom");
const { confirmationOrder } = require("../../common/actionNewOrders");

eventEmitter.defaultMaxListeners = 35;
/**
 * Criar o cupom para impressão
 * @param {Array<object>} data Array de objeto contendo os pedidos
 * @param {Object} configPrint Objeto de configuração impressão
 * @return {Function} PosPrinter
 */
async function printCoupom(data, configPrint = {}) {
  const { active } = getSoundActive();
  const {
    printerName,
    widthPage,
    silent,
    preview,
    automaticOrderConfirmation,
  } = getDefaultPrinters();

  const activeSound =
    configPrint.sound === undefined ? active : configPrint.sound;

  const options = {
    preview: preview, // Preview in window or print
    width: widthPage, //  width of content body
    margin: "0 0 0 0", // margin of content body
    copies: 1, // Number of copies to print
    printerName: printerName, // printerName: string, check it at webContent.getPrinters()
    timeOutPerLine: 5000,
    silent: silent,
    ...configPrint,
  };

  data.map(async (order) => {
    const layoutCoupom = await LayoutCoupom(order);

    if (printerName && widthPage && layoutCoupom) {
      PosPrinter.print(layoutCoupom, options)
        .then(() => {
          activeSound && soundAlert();
          // CONFIRMAÇÃO DO PEDIDO AUTOMÁTICO
          if (automaticOrderConfirmation) {
            if (order.statusRequest_id === 1) {
              // confirmar apenas se não for visualizar
              if (!preview) confirmationOrder(order.id);
            }
          }
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  });
}

module.exports = printCoupom;
