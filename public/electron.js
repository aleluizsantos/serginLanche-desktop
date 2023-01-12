const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const IPCkey = require("./electron/common/constants");
const path = require("path");

// remover a mensagem Passthrough is
// not supported, GL is disabled, ANGLE is
app.disableHardwareAcceleration();

const {
  getWinSetting,
  saveBounds,
  newUpdateApp,
} = require("./electron/storage");

const {
  actionNewOrders,
  confirmationOrder,
} = require("./electron/common/actionNewOrders");

const soundAlert = require("./electron/componets/sound_Alert");
const printCoupom = require("./electron/componets/printCoupom");

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

  if (!isDev) {
    autoUpdater.checkForUpdates();
  }

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
        printCoupom(data.coupom, { preview: true, sound: data.sound });
        break;
      case 1:
        printCoupom(data.coupom, { preview: false, sound: data.sound });
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

autoUpdater.on("checking-for-update", () => {
  console.log("Checking for updates...");
});

autoUpdater.on("update-available", (_event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: "info",
    buttons: ["Ok"],
    title: "Atualização do aplicativo",
    message: process.platform === "win32" ? releaseNotes : releaseName,
    detail: "Uma nova versão está pronta para ser baixada.",
  };

  dialog.showMessageBox(dialogOpts, () => newUpdateApp(true));
});

autoUpdater.on("download-progress", (process) => {
  console.log(`Progress ${Math.floor(process.percent)}`);
});

autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: "info",
    buttons: ["Reiniciar", "Mais tarde"],
    title: "Atualização do aplicativo",
    message: process.platform === "win32" ? releaseNotes : releaseName,
    detail:
      "Uma nova versão foi baixada. Reinicie o aplicativo para aplicar as atualizações.",
  };
  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    newUpdateApp(false);
    if (returnValue.response === 0) autoUpdater.quitAndInstall();
  });
});

autoUpdater.on("error", () => {
  newUpdateApp(false);
});
