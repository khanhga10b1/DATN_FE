import service, { setAuthToken } from "../service/service";
import {
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
  LOGIN,
  ADMIN_LOGIN,
  ADMIN_LOGIN_SUCCESS,
  ADMIN_LOGIN_FAILED,
  ADMIN_LOADED, LOGOUT_ADMIN,
} from "./types";

export const loginUser = (email, password) => async (dispatch) => {
  const data = {
    email: email,
    password: password,
    isAdmin: false
  };
  dispatch({ type: LOGIN });
  try {
    const res = await service.post("auth/login", data);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        token: res.data.token,
      },
    });
    dispatch(loadUser());
  } catch (error) {
    dispatch({
      type: LOGIN_FAILED,
      payload: error.response.data.errors[0].default_message,
    });
  }
};

export const loadUser = () => async (dispatch) => {
  setAuthToken(localStorage.getItem("token"));
  try {
    const res = await service.get("/accounts/me");
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (e) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

export const logout = () => async (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
};

export const logoutAdmin = () => async (dispatch) => {
  dispatch({
    type: LOGOUT_ADMIN,
  });
}

export const loginAdmin = (email, password) => async (dispatch) => {
  const data = {
    email: email,
    password: password,
    isAdmin: true
  };
  dispatch({ type: ADMIN_LOGIN });
  try {
    const res = await service.post("auth/loginAdmin", data);
    dispatch({
      type: ADMIN_LOGIN_SUCCESS,
      payload: {
        token: res.data.token,
      },
    });
    dispatch(loadAdmin());
  } catch (error) {
    dispatch({
      type: ADMIN_LOGIN_FAILED,
      payload: error.response.data.errors[0].default_message,
    });
  }
};

export const loadAdmin = () => async (dispatch) => {
  setAuthToken(localStorage.getItem("admin_token"));
  try {
    const res = await service.get("/admins/me");
    dispatch({
      type: ADMIN_LOADED,
      payload: res.data,
    });
  } catch (e) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};
