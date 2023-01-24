import {
  OPEN_CLOSE,
  SET_MESSAGE,
  NEW_ORDERS,
  UPDATESYSTEM,
  AUTO_OPEN_CLOSE,
} from "./types";

import { checkNewOrder } from "../../hooks/MyOrders";
import { getOpenClose, setOpenClose, saveActiveOpenClose } from "../../hooks";

export const statusOpenClose = () => (dispatch) => {
  return getOpenClose().then(
    (data) => {
      dispatch({
        type: OPEN_CLOSE,
        payload: data.open_close,
      });
    },
    (error) => {
      dispatch({
        type: SET_MESSAGE,
        payload: "Opss!! Erro na comunição.",
      });
    }
  );
};

export const upgradeOpenClose = () => (dispatch) => {
  return setOpenClose().then(
    (data) => {
      dispatch({
        type: OPEN_CLOSE,
        payload: data.open_close,
      });
      dispatch({
        type: SET_MESSAGE,
        payload: data.open_close
          ? "Loja aberta, Boas vendas."
          : "Loja Fechada,  Bom descanço!",
      });
    },
    (error) => {
      const message =
        error.response.data.error || error.message || error.toString();

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });
    }
  );
};

export const activeAutoOpenClose = () => async (dispatch) => {
  const autoOpenClose = localStorage.getItem("_auto-open-close");
  let payload = !Boolean(Number(autoOpenClose));
  localStorage.setItem("_auto-open-close", Number(payload));

  saveActiveOpenClose(payload).then((result) => {
    dispatch({
      type: SET_MESSAGE,
      payload: result.message,
    });
  });

  dispatch({
    type: AUTO_OPEN_CLOSE,
    payload: payload,
  });
};

export const getMyOrders = () => async (dispatch) => {
  const newOrder = await checkNewOrder();
  dispatch({
    type: NEW_ORDERS,
    payload: newOrder,
  });
  return newOrder;
};

export const checkUpdateSystem = () => async (dispatch) => {
  const update = await window.indexBridge.hasUpdateApp();
  dispatch({
    type: UPDATESYSTEM,
    payload: update,
  });
};
