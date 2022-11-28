const { app } = require("electron");
const sound = require("sound-play");
const path = require("path");

const { getSoundActive } = require("../../storage");

const isDev = !app.isPackaged;

const pathSound = isDev
  ? path.join(app.getAppPath(), "public/electron", "assets/")
  : path.join(process.resourcesPath, "public/electron/assets/");

const soundAlert = (filename = null) => {
  const { active, volume, audio } = getSoundActive();
  const filePath = path.join(pathSound, filename ? filename : audio);
  try {
    return active ? sound.play(filePath, volume) : null;
  } catch (error) {
    console.error(error);
  }
};

module.exports = soundAlert;
