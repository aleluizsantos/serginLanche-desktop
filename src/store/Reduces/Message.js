/* eslint-disable import/no-anonymous-default-export */
import { SET_MESSAGE, CLEAR_MESSAGE } from "../Actions/types";

const INITIAL_STATE = {};

export default function (state = INITIAL_STATE, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_MESSAGE:
      return { message: payload };
    case CLEAR_MESSAGE:
      return { message: "" };
    default:
      return state;
  }
}
