import { combineReducers } from "redux";
import auth from "./reducers/auth";
import hotels from "./reducers/hotels";
import rooms from "./reducers/rooms";
import reservations from "./reducers/reservations";
export default combineReducers({
  auth,
  hotels,
  rooms,
  reservations,
});
