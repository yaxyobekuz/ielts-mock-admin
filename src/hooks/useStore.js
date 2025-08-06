import { useSelector, useDispatch } from "react-redux";

// Custom hook for accessing store and dispatch
const useStore = (selector) => {
  const dispatch = useDispatch();

  // Get entire state
  const getState = () => useSelector((state) => state.store[selector]);

  return { getState, dispatch };
};

export default useStore;
