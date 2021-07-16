import { useReducer, createContext } from "react";
import { reducer } from "./actions";

// 초기 상태값
const initialState = {
  market: {},
  user: { data: localStorage.getItem("user") },
};

const store = createContext(initialState);
const { Provider } = store;

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Provider value={[state, dispatch]}>{children}</Provider>;
};

export { store, StoreProvider };
