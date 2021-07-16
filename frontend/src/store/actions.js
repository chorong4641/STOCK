// action types
const GET_STOCK_MARKET = "GET_STOCK_MARKET";
const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";

// action creators
export const getStockMarket = () => ({ type: GET_STOCK_MARKET, payload: {} });
export const login = (params) => ({ type: LOGIN, payload: params });
export const logout = () => ({ type: LOGOUT, payload: {} });

// reducers
export const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_STOCK_MARKET:
      console.log("payload", payload);
      // state.market.data = payload.data;
      return state;
    case LOGIN:
      console.log("payload", payload);
      localStorage.setItem("user", payload);
      state = { ...state, user: { data: payload } };
      return state;
    case LOGOUT:
      console.log("LOGOUT");
      localStorage.removeItem("user");
      state = { ...state, user: { data: null } };
      return state;
    default:
      return state;
  }
};
