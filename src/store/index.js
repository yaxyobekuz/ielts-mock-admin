import { configureStore } from "@reduxjs/toolkit";

// Features
import storeSlice from "./features/storeSlice";

export default configureStore({
  reducer: {
    store: storeSlice,
  },
});
