import {
  NEW_ORDERS,
  OPEN_CLOSE,
  CLIENT_ONLINE,
  CLIENT_REGISTERED,
  UPDATE,
  CONFIG_SYSTEM,
} from "../Actions/types";

const openClose = localStorage.getItem("_openClosepicanha&cia");
const totalUsers = localStorage.getItem("_totalUserspicanha&cia");

const INITIAL_STATE = {
  open_close: openClose !== null ? openClose : false,
  newOrders: [],
  clientsOnline: 0,
  clientsRegistered: totalUsers !== null ? totalUsers : 0,
  update: {},
  configSystem: {},
};

export default function Notificate(state = INITIAL_STATE, action) {
  const { type, payload } = action;
  switch (type) {
    case OPEN_CLOSE:
      return { ...state, open_close: payload };
    case NEW_ORDERS:
      return { ...state, newOrders: payload };
    case CLIENT_ONLINE:
      return { ...state, clientsOnline: payload };
    case CLIENT_REGISTERED:
      return { ...state, clientsRegistered: payload };
    case UPDATE:
      return { ...state, update: payload };
    case CONFIG_SYSTEM:
      return { ...state, configSystem: payload };
    default:
      return state;
  }
}
