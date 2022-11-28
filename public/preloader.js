const { contextBridge, ipcRenderer } = require("electron");
const IPCkey = require("./electron/common/constants");
const {
  getDefaultPrinters,
  saveSettingPrinters,
  getSoundActive,
  saveDefaultAudio,
  getToken,
  saveToken,
  getAddressStore,
  saveAddressStore,
} = require("./electron/storage");

const socket = require("./electron/service/socket");
const checkAddressStore = require("./electron/service/hooks/checkAddressStorage");

window.addEventListener("DOMContentLoaded", () => {
  //operation
  //CreateOrder
  socket.on("CreateOrder", async (data) => {
    const { auto, automaticOrderConfirmation } = getDefaultPrinters();
    const myOrder = { coupom: data.CreateOrder };
    // Verificar se a impressão esta definida automática
    if (auto) {
      ipcRenderer.invoke(IPCkey.servicePrinterPrint, myOrder);
    } else {
      // Caso a impressão não esta defindia como automática
      // Verificar se a confirmação do pedido esta automática
      if (automaticOrderConfirmation) {
        const { coupom } = myOrder;
        coupom.map(
          (item) =>
            item.statusRequest_id === 1 &&
            ipcRenderer.send(IPCkey.confirmationMyOrder, item.id)
        );
      }
      // Verifica se esta ativado o som de alerta de recebimento do pedido
      ipcRenderer.invoke(IPCkey.emitAlertSound);
    }
  });

  // Checar se tem endereço do estabelecimento no STORAGE
  checkAddressStore();
});

let indexBridge = {
  servicePrinterList: async () =>
    await ipcRenderer.invoke(IPCkey.servicePrinterList),
  saveDefaultAudio: async (values) => saveDefaultAudio(values),
  getDefaultAudio: async () => getSoundActive(),
  getDefaultPrinters: async () => await getDefaultPrinters(),
  saveSettingPrinters: (setting) => saveSettingPrinters(setting),
  openSettingConfing: () => ipcRenderer.send(IPCkey.openWinSettingConfig),
  checkNewOrder: (data) =>
    ipcRenderer.invoke(IPCkey.serviceCheckNewOrder, data),
  servicePrintCoupom: (data) =>
    ipcRenderer.invoke(IPCkey.servicePrinterPrint, data),
  emitAlertSound: (sound) => ipcRenderer.invoke(IPCkey.emitAlertSound, sound),
  getToken: async () => getToken(),
  saveToken: (token) => saveToken(token),
  getAddressStore: async () => getAddressStore(),
  saveAddressStore: async (address) => saveAddressStore(address),
};

contextBridge.exposeInMainWorld("indexBridge", indexBridge);
