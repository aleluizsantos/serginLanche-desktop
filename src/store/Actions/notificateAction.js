import { OPEN_CLOSE, SET_MESSAGE, NEW_ORDERS } from "./types";

import { checkNewOrder } from "../../hooks/MyOrders";
import { getOpenClose, setOpenClose } from "../../hooks";

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

export const getMyOrders = () => async (dispatch) => {
  const newOrder = await checkNewOrder();
  dispatch({
    type: NEW_ORDERS,
    payload: newOrder,
  });
  return newOrder;
};
