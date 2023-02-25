const io = require("socket.io-client");

const host = "http://18.229.41.134:3333";

const socket = io(host, {
  transports: ["websocket"],
  jsonp: false,
});

module.exports = socket;
