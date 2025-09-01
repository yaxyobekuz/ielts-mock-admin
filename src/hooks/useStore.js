import {
  updateDataFromStore,
  updatePropertyFromStore,
} from "../store/features/storeSlice";
import { useSelector, useDispatch } from "react-redux";

// Custom hook for accessing store and dispatch
const useStore = (name = "test") => {
  const dispatch = useDispatch();

  // Get entire state
  const getData = () => {
    return useSelector((state) => state.store[name]);
  };

  // Get property
  const getProperty = (property) => {
    return useSelector((state) => state.store[name][property]);
  };

  // Update property
  const updateProperty = (property, value) => {
    dispatch(updatePropertyFromStore({ name, value, property }));
  };

  // Update data
  const updateData = (data) => {
    dispatch(updateDataFromStore({ name, data }));
  };

  return {
    getData,
    dispatch,
    updateData,
    getProperty,
    updateProperty,
  };
};

export default useStore;
