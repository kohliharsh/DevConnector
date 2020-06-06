import axios from "axios";
import { setAlert } from "./alert";
import { REGISTER_SUCCESS, REGISTER_FAILURE } from "./constants";
import { json } from "body-parser";

//Register user
export const register = ({ name, email, password, password2 }) => async (
  dispatch
) => {
  const body = JSON.stringify({ name, email, password, password2 });
  try {
    const res = await axios.post("/api/users/register", body);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, "danger")));
    }
    dispatch({
      type: REGISTER_FAILURE,
    });
  }
};
