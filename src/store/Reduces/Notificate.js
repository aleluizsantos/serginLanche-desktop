import {
  NEW_ORDERS,
  OPEN_CLOSE,
  CLIENT_ONLINE,
  CLIENT_REGISTERED,
  UPDATE,
  UPDATESYSTEM,
} from "../Actions/types";

const openClose = localStorage.getItem("_openClosepicanha&cia");
const totalUsers = localStorage.getItem("_totalUserspicanha&cia");

const INITIAL_STATE = {
  open_close: openClose !== null ? openClose : false,
  newOrders: [],
  clientsOnline: 0,
  clientsRegistered: totalUsers !== null ? totalUsers : 0,
  update: {},
  updateSystem: false,
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
    case UPDATESYSTEM:
      return { ...state, updateSystem: payload };
    default:
      return state;
  }
}
