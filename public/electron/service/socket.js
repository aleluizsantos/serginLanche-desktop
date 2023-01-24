const io = require("socket.io-client");

const host = "http://localhost:3333";

const socket = io(host, {
  transports: ["websocket"],
  jsonp: false,
});

module.exports = socket;
