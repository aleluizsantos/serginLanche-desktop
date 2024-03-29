const eventEmitter = require("events");
const { PosPrinter } = require("electron-pos-printer");

const { getDefaultPrinters, getSoundActive } = require("../../storage");
const soundAlert = require("../sound_Alert");
const LayoutCoupom = require("./layoutCoupom");
const LayoutCoupomTable = require("./layoutCoupomTable");
const {
  confirmationOrder,
  couponWasPrinted,
} = require("../../common/actionNewOrders");

eventEmitter.defaultMaxListeners = 35;
/**
 * Criar o cupom para impressão
 * @param {Array<object>} data Array de objeto contendo os pedidos
 * @param {Object} configPrint Objeto de configuração impressão
 * @return {Function} PosPrinter
 */
async function printCoupom(data, configPrint = {}) {
  const { active } = await getSoundActive();
  const {
    printerName,
    widthPage,
    silent,
    preview,
    automaticOrderConfirmation,
  } = await getDefaultPrinters();

  const activeSound =
    configPrint?.sound === undefined ? active : configPrint?.sound;

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
    const layoutCoupom =
      order.deliveryType_id === 3
        ? await LayoutCoupomTable(order)
        : await LayoutCoupom(order);
    await print(order, layoutCoupom);
  });

  async function print(order, layoutCoupom) {
    if (printerName && widthPage && layoutCoupom) {
      PosPrinter.print(layoutCoupom, options)
        .then(() => {
          activeSound && soundAlert();
          if (!options.preview) couponWasPrinted(order.id);
          // CONFIRMAÇÃO DO PEDIDO AUTOMÁTICO
          if (automaticOrderConfirmation) {
            if (order.statusRequest_id === 1) {
              // Confirmar apenas se não for visualizar
              if (!preview) confirmationOrder(order);
            }
          }
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  }
}

module.exports = printCoupom;
