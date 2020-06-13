import axios from "axios";
import setAlert from "./alert";

import { GET_PROFILE, PROFILE_ERROR } from "./constants";

//Get current user profile

export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/profile/me");
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (error) {
    const err = error.response.data.errors;
    dispatch({
      type: PROFILE_ERROR,
      payload: { err },
    });
  }
};
