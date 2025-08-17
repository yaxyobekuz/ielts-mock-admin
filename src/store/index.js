import { configureStore } from "@reduxjs/toolkit";

// Features
import moduleSlice from "./features/moduleSlice";

export default configureStore({
  reducer: {
    module: moduleSlice,
  },
});
