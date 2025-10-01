import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  test: {},
  coords: {},
  result: {},
  teacher: {},
  template: {},
  submission: {},
  link: { hasError: false, isLoading: true },
  user: { data: {}, hasError: false, isLoading: true },
  tests: { data: [], hasError: false, isLoading: true },
  results: { data: [], hasError: false, isLoading: true },
  teachers: { data: [], hasError: false, isLoading: true },
  templates: { data: [], hasError: false, isLoading: true },
  submissions: { data: [], hasError: false, isLoading: true },
  latestTests: { data: [], hasError: false, isLoading: true },
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
