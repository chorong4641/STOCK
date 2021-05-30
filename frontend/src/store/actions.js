// action types
const GET_STOCK_MARKET = "GET_STOCK_MARKET";

// action creators
export const getStockMarket = () => ({ type: GET_STOCK_MARKET, payload: {} });

// reducers
export const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_STOCK_MARKET:
      console.log("payload", payload);
      // state.market.data = payload.data;
      return state;
    default:
      return state;
  }
};
