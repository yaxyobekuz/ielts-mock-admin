import { configureStore } from "@reduxjs/toolkit";

// Features
import modalSlice from "./features/modalSlice";
import moduleSlice from "./features/moduleSlice";

export default configureStore({
  reducer: {
    modal: modalSlice,
    module: moduleSlice,
  },
});
