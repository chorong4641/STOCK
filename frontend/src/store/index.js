import { useReducer, createContext, useEffect } from "react";
import { reducer } from "./actions";

// 초기 상태값
const initialState = {
  user: null,
};

// localStorage에서 값 가져옴
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("state");
    if (!serializedState) {
      return initialState;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
};

// localStorage에 저장
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (e) {
    // Ignore write errors;
  }
};

const peristedState = loadState();

const store = createContext(
  peristedState
  // Others reducers...
);

const { Provider } = store;

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, peristedState);

  // state가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    saveState(state);
  }, [state]);

  return <Provider value={[state, dispatch]}>{children}</Provider>;
};

export { store, StoreProvider };
