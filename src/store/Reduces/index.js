import { combineReducers } from "redux";

import Authenticate from "./Authenticate";
import Message from "./Message";
import Notificate from "./Notificate";

export default combineReducers({
  Authenticate,
  Notificate,
  Message,
});
