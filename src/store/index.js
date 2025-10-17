import { configureStore } from "@reduxjs/toolkit";

// Features
import modalSlice from "./features/modalSlice";
import storeSlice from "./features/storeSlice";
import moduleSlice from "./features/moduleSlice";
import arrayStoreSlice from "./features/arrayStoreSlice";
import objectStoreSlice from "./features/objectStoreSlice";

export default configureStore({
  reducer: {
    modal: modalSlice,
    store: storeSlice,
    module: moduleSlice,
    arrayStore: arrayStoreSlice,
    objectStore: objectStoreSlice,
  },
});
