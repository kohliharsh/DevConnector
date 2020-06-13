import axios from "axios";
import { setAlert } from "./alert";
import {
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
} from "./constants";

//Register user
export const register = ({ name, email, password, password2 }) => async (
  dispatch
) => {
  const body = { name, email, password, password2 };
  try {
    const res = await axios.post("/api/users/register", body);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
  } catch (er) {
    const error = er.response.data.error;
    if (error) {
      Object.keys(error).forEach((err) =>
        dispatch(setAlert(error[err], "danger"))
      );
    }
    dispatch({
      type: REGISTER_FAILURE,
    });
  }
};

//Login user
export const login = ({ email, password }) => async (dispatch) => {
  const body = { email, password };
  try {
    const res = await axios.post("/api/users/login", body);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
  } catch (er) {
    const error = er.response.data.error;
    if (error) {
      Object.keys(error).forEach((err) =>
        dispatch(setAlert(error[err], "danger"))
      );
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

//LOGOUT
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};
