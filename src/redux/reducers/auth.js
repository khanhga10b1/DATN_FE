import {
  REGISTER_FAILED,
  REGISTER_SUCCESS,
  LOGIN_FAILED,
  LOGIN_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
  LOGIN,
  ADMIN_LOGIN,
  ADMIN_LOGIN_FAILED,
  ADMIN_LOGIN_SUCCESS,
  ADMIN_LOADED,
} from "../../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  adminToken: localStorage.getItem("admin_token"),
  isAuthenticated: localStorage.getItem("token") != null,
  isAdminAuthenticated: localStorage.getItem("admin_token") != null,
  loading: false,
  user: null,
  msg: "",
  admin: null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload.account,
      };
    case ADMIN_LOADED:
      return {
        ...state,
        isAdminAuthenticated: true,
        loading: false,
        admin: payload.account,
      };
    case LOGIN:
      return {
        ...state,
        loading: true,
      };
    case ADMIN_LOGIN:
      return {
        ...state,
        loading: true,
      };
    case ADMIN_LOGIN_SUCCESS:
      localStorage.setItem("admin_token", payload.token);

      return {
        ...state,
        ...payload,
        msg: "",
        isAdminAuthenticated: true,
        loading: false,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);

      return {
        ...state,
        ...payload,
        msg: "",
        isAuthenticated: true,
        loading: false,
      };

    case REGISTER_FAILED:
    case LOGIN_FAILED:
    case ADMIN_LOGIN_FAILED:
    case AUTH_ERROR:
      return {
        ...state,
        loading: false,
        msg: action.payload,
      };
    case LOGOUT:
      localStorage.removeItem("token");
      localStorage.removeItem("admin_token");

      return {
        ...state,
        token: null,
        adminToken: null,
        user: null,
        admin: null,
        isAuthenticated: false,
        isAdminAuthenticated: false,
        loading: false,
        msg: "",
      };

    default:
      return state;
  }
};
