import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGOUT,
} from "../Actions/types";

const token = localStorage.getItem("_accessAuthenticatedTokenpicanha&cia");
const user = JSON.parse(localStorage.getItem("_activeUserpicanha&cia"));

const INITIAL_STATE = user
  ? {
      signed: true,
      fail_login: false,
      user: user,
      token: token,
    }
  : {
      signed: false,
      fail_login: false,
      user: null,
      token: null,
    };
export default function Authenticate(state = INITIAL_STATE, action) {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        signed: true,
        fail_login: false,
        user: payload.user,
        token: payload.token,
      };
    case LOGIN_FAIL:
      return {
        signed: false,
        fail_login: true,
        user: null,
        token: null,
      };
    case REGISTER_SUCCESS:
      return { signed: false, user: null, token: null };
    case REGISTER_FAIL:
      return { signed: false, user: null, token: null };
    case LOGOUT:
      return { signed: false, user: null, token: null };
    default:
      return state;
  }
}
