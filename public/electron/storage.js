const Stoge = require("electron-store");
const storage = new Stoge();

const default_printers = {
  printerName: "",
  widthPage: "",
  silent: true,
  auto: false,
  preview: false,
  automaticOrderConfirmation: false,
};

const default_sound = {
  active: true,
  volume: 0.5,
  audio: "notification.mp3",
};
/**
 * GET: confirugação da impressora
 * @returns {object} Retorna um objeto com as configurações da impressora
 */
async function getDefaultPrinters() {
  const settingPrinters = await storage.get("setting-printers");

  if (settingPrinters) {
    return settingPrinters;
  } else {
    storage.set("setting-printers", default_printers);
    return default_printers;
  }
}

/**
 * SALVA: gava no storage as configurações da impressora
 * @param {object} setting Recebe um objeto com as configurações da impressora
 */
function saveSettingPrinters(setting) {
  try {
    storage.set("setting-printers", setting);
  } catch (error) {
    console.log(error.message);
  }
}

/**
 * GET: Recupera a Largura e Altura da janela gravada em storage
 * @returns {Array<number>} Retorna um array com duas posições [width, height]
 */
function getWinSetting() {
  const default_bounds = [800, 600];
  const size = storage.get("win-size");
  if (size) return size;
  else {
    storage.set("win-size", default_bounds);
    return default_bounds;
  }
}

/**
 * SALVA: grava a largura e altura da janela
 * @param {Array<number>} bounds Recebe as Largura e Altura da janela
 */
function saveBounds(bounds) {
  storage.set("win-size", bounds);
}

/**
 * GET: Configuração do som de alerta
 * @returns {Objeto} Retorna um objeto de configuração do audio :  { active | volume | audio}
 */
async function getSoundActive() {
  const soundAlert = await storage.get("sound-alert");
  if (soundAlert) return soundAlert;
  else {
    storage.set("sound-alert", default_sound);
    return default_sound;
  }
}

/**
 * SALVA: configuração em storage do audio
 * @param {object} values Recebe um objeto:  { active | volume | audio}
 */
function saveDefaultAudio(values) {
  storage.set("sound-alert", values);
}

/**
 * GET: Token gravado em storage
 * @returns {string} Retorna uma string com o token gravado em storage
 */
async function getToken() {
  const token = await storage.get("token-authenticate");
  if (token) return `Bearer ${token}`;
  else {
    return null;
  }
}

/**
 * SALVA: grava em storage o token recebido
 * @param {string} token Recebe o token
 */
async function saveToken(token) {
  storage.set("token-authenticate", token);
}

/**
 * Retorna o endereço do estabelecimento salvo em storage
 * @returns {object} Objeto com o endereço do estabelecimento
 */
async function getAddressStore() {
  const addrStore = await storage.get("address-store");
  if (addrStore) return addrStore;
  else {
    return null;
  }
}

/**
 * Salvar o endereço do estabelecimento em storage
 * @param {object} addrStore Recebe o objeto com o endereço do estabelecimento
 */
function saveAddressStore(addrStore) {
  console.log(">>> ", addrStore);
  storage.set("address-store", addrStore);
}

module.exports = {
  getWinSetting,
  saveBounds,
  getDefaultPrinters,
  saveSettingPrinters,
  getSoundActive,
  saveDefaultAudio,
  saveToken,
  getToken,
  getAddressStore,
  saveAddressStore,
};
