import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_MESSAGE,
  CLEAR_MESSAGE,
  OPEN_CLOSE,
  CLIENT_REGISTERED,
} from "./types";

import { login, logout } from "../../hooks";

export const signIn = (email, password) => (dispatch) => {
  return login(email, password).then(
    (data) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: data,
      });

      // dispatch(configSystem());

      dispatch({
        type: OPEN_CLOSE,
        payload: data.openClose,
      });

      dispatch({
        type: CLIENT_REGISTERED,
        payload: data.totalUsers,
      });

      dispatch({
        type: CLEAR_MESSAGE,
      });

      return Promise.resolve();
    },
    (error) => {
      const message = "Acesso negado, não tem permissão";

      dispatch({
        type: LOGIN_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const signOut = () => (dispatch) => {
  logout();
  dispatch({
    type: LOGOUT,
  });
};

export const reload = () => (dispatch) => {};
