/* eslint-disable no-useless-escape */
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const IPCkey = require("./electron/common/constants");
const path = require("path");

// remover a mensagem Passthrough is not supported, GL is disabled, ANGLE is
app.disableHardwareAcceleration();

const { getWinSetting, saveBounds } = require("./electron/storage");
const printCoupom = require("./electron/componets/printCoupom");
const {
  actionNewOrders,
  confirmationOrder,
} = require("./electron/common/actionNewOrders");
const soundAlert = require("./electron/componets/sound_Alert");
const iconApp = path.join(__dirname, "electron", "assets", "logo256x256.png");

const isDev = !app.isPackaged;

let mainWindow;
let childWindow;

function createWindow() {
  const [width, height] = getWinSetting();
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    icon: iconApp,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preloader.js"),
    },
  });
  // Salvar a dimensão da janela que o usuário deixou
  mainWindow.on("resize", () => saveBounds(mainWindow.getSize()));

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // isDev && mainWindow.webContents.openDevTools();
}

function createChildWindow() {
  childWindow = new BrowserWindow({
    width: 950,
    height: 900,
    icon: iconApp,
    modal: true,
    show: false,
    autoHideMenuBar: true,
    parent: mainWindow,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preloader.js"),
    },
  });
  childWindow.loadURL(
    `file://${path.join(__dirname, "./electron/pages/config/setting.html")}`
  );

  // isDev && childWindow.webContents.openDevTools();

  childWindow.once("ready-to-show", () => childWindow.show());
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.on(IPCkey.openWinSettingConfig, (event, arg) => {
  createChildWindow();
});

ipcMain.handle(IPCkey.servicePrinterList, async () => {
  const webContents = childWindow.webContents;
  const printers = await webContents.getPrintersAsync();
  return printers;
});

ipcMain.handle(IPCkey.servicePrinterPrint, async (event, data) => {
  const window = BrowserWindow.getFocusedWindow();
  const dialogMessage = data.dialogMessage || false;

  if (dialogMessage) {
    const result = dialog.showMessageBoxSync(window, {
      title: "O que deseja fazer?",
      message: "Impressão de cupom & visualização.",
      detail: "Você pode imprimir seu cupom ou simplesmente visualizar",
      buttons: ["Visualizar", "Imprimir"],
      type: "question",
    });
    switch (result) {
      case 0:
        const configPrint = { preview: true, sound: data.sound };
        printCoupom(data.coupom, configPrint);
        break;
      case 1:
        printCoupom(data.coupom);
        break;
      default:
        break;
    }
  } else {
    printCoupom(data.coupom);
  }
});

ipcMain.handle(IPCkey.serviceCheckNewOrder, async (event, data) => {
  return await actionNewOrders(data);
});

ipcMain.on(IPCkey.confirmationMyOrder, (event, data) => {
  confirmationOrder(data);
});

ipcMain.handle(IPCkey.emitAlertSound, async (event, data) => {
  return soundAlert(data);
});
