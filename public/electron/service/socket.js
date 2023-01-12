const io = require("socket.io-client");

const host =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_HOST_URL_DEVELOPMENT
    : process.env.REACT_APP_HOST_URL;

const socket = io(host, {
  transports: ["websocket"],
  jsonp: false,
});

module.exports = socket;
