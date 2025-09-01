import { configureStore } from "@reduxjs/toolkit";

// Features
import modalSlice from "./features/modalSlice";
import storeSlice from "./features/storeSlice";
import moduleSlice from "./features/moduleSlice";

export default configureStore({
  reducer: {
    modal: modalSlice,
    store: storeSlice,
    module: moduleSlice,
  },
});
