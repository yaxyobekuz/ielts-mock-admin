import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  user: {
    data: {},
    hasError: false,
    isLoading: true,
  },
};

export const storeSlice = createSlice({
  initialState,
  name: "store",
  reducers: {
    updatePropertyFromStore: (state, action) => {
      const { name, property, value } = action.payload;
      if (!state[name]) return;
      state[name][property] = value;
    },

    updateDataFromStore: (state, action) => {
      const { name, data } = action.payload;
      if (!state[name]) return;
      state[name] = data;
    },
  },
});

// Export actions
export const { updatePropertyFromStore, updateDataFromStore } =
  storeSlice.actions;

// Export reducer
export default storeSlice.reducer;
