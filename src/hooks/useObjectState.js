import { useState } from "react";

// Custom hook
const useObjectState = (initialState = {}) => {
  const [state, setState] = useState(initialState);

  // Update single key
  const setField = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  // Update multiple keys
  const setFields = (updates = {}) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  // Reset all state
  const resetState = () => {
    setState(initialState);
  };

  return { state, setField, setFields, resetState, ...state };
};

export default useObjectState;
