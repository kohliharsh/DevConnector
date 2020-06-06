import { REGISTER_SUCCESS, REGISTER_FAILURE } from "../actions/constants";

const initialStage = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
};

export default function (state = initialStage, action) {
  const { type, payload } = action;
  switch (type) {
    case REGISTER_SUCCESS:
      localStorage.getItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    case REGISTER_FAILURE:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
  }
}
