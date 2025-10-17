import { createSlice } from "@reduxjs/toolkit";

// Data structure example
/*
  {
    links: {
      pagination: true,
      pages: {
        1: {
          data: [...items],
          error: null,
          isLoading: false,
        },
        2: {
          data: [...items],
          error: null,
          isLoading: false,
        }
      }
    },

    images: {
      pagination: false,
      data: [...items],
      error: null,
      isLoading: false,
    }
  }
*/

// Initial state - stores different collections of items by category
const initialState = {};

export const arrayStoreSlice = createSlice({
  initialState,
  name: "arrayStore",
  reducers: {
    // Initialize collection
    initializeCollection: (state, action) => {
      const { collectionName, pagination = false } = action.payload;

      if (state[collectionName]) {
        console.warn(
          `[ArrayStore] Collection "${collectionName}" already exists`
        );
        return;
      }

      if (pagination) {
        state[collectionName] = {
          pagination: true,
          pages: {},
        };
      } else {
        state[collectionName] = {
          pagination: false,
          data: [],
          error: null,
          isLoading: false,
        };
      }
    },

    // Set loading state for paginated collection
    setPageLoading: (state, action) => {
      const { collectionName, page, isLoading } = action.payload;

      const collection = state[collectionName];

      if (!collection) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" does not exist`
        );
        return;
      }

      if (!collection.pagination) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" is not paginated`
        );
        return;
      }

      if (!collection.pages[page]) {
        collection.pages[page] = {
          data: [],
          error: null,
          isLoading: false,
        };
      }

      collection.pages[page].isLoading = isLoading;
    },

    // Set loading state for non-paginated collection
    setCollectionLoading: (state, action) => {
      const { collectionName, isLoading } = action.payload;

      const collection = state[collectionName];

      if (!collection) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" does not exist`
        );
        return;
      }

      if (collection.pagination) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" is paginated, use setPageLoading instead`
        );
        return;
      }

      collection.isLoading = isLoading;
    },

    // Set page data for paginated collection
    setPageData: (state, action) => {
      const { collectionName, page, data, error = null } = action.payload;

      const collection = state[collectionName];

      if (!collection) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" does not exist`
        );
        return;
      }

      if (!collection.pagination) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" is not paginated`
        );
        return;
      }

      collection.pages[page] = {
        data: Array.isArray(data) ? data : [],
        error,
        isLoading: false,
      };
    },

    // Set data for non-paginated collection
    setCollectionData: (state, action) => {
      const { collectionName, data, error = null } = action.payload;

      const collection = state[collectionName];

      if (!collection) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" does not exist`
        );
        return;
      }

      if (collection.pagination) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" is paginated, use setPageData instead`
        );
        return;
      }

      collection.data = Array.isArray(data) ? data : [];
      collection.error = error;
      collection.isLoading = false;
    },

    // Set error for page
    setPageError: (state, action) => {
      const { collectionName, page, error } = action.payload;

      const collection = state[collectionName];

      if (!collection) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" does not exist`
        );
        return;
      }

      if (!collection.pagination) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" is not paginated`
        );
        return;
      }

      if (!collection.pages[page]) {
        collection.pages[page] = {
          data: [],
          error: null,
          isLoading: false,
        };
      }

      collection.pages[page].error = error;
      collection.pages[page].isLoading = false;
    },

    // Set error for collection
    setCollectionError: (state, action) => {
      const { collectionName, error } = action.payload;

      const collection = state[collectionName];

      if (!collection) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" does not exist`
        );
        return;
      }

      if (collection.pagination) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" is paginated, use setPageError instead`
        );
        return;
      }

      collection.error = error;
      collection.isLoading = false;
    },

    // Add item to non-paginated collection
    addItemToCollection: (state, action) => {
      const { collectionName, item } = action.payload;

      const collection = state[collectionName];

      if (!collection) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" does not exist`
        );
        return;
      }

      if (collection.pagination) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" is paginated, cannot add items directly`
        );
        return;
      }

      collection.data.push(item);
    },

    // Add item to page in paginated collection
    addItemToPage: (state, action) => {
      const { collectionName, page, item } = action.payload;

      const collection = state[collectionName];

      if (!collection) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" does not exist`
        );
        return;
      }

      if (!collection.pagination) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" is not paginated`
        );
        return;
      }

      if (!collection.pages[page]) {
        collection.pages[page] = {
          data: [],
          error: null,
          isLoading: false,
        };
      }

      collection.pages[page].data.push(item);
    },

    // Update item in non-paginated collection by index
    updateItemInCollection: (state, action) => {
      const { collectionName, index, item } = action.payload;

      const collection = state[collectionName];

      if (!collection) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" does not exist`
        );
        return;
      }

      if (collection.pagination) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" is paginated`
        );
        return;
      }

      if (index < 0 || index >= collection.data.length) {
        console.error(
          `[ArrayStore] Index ${index} out of bounds in collection "${collectionName}"`
        );
        return;
      }

      collection.data[index] = item;
    },

    // Update item in page by index
    updateItemInPage: (state, action) => {
      const { collectionName, page, index, item } = action.payload;

      const collection = state[collectionName];

      if (!collection) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" does not exist`
        );
        return;
      }

      if (!collection.pagination) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" is not paginated`
        );
        return;
      }

      const pageData = collection.pages[page];

      if (!pageData) {
        console.error(
          `[ArrayStore] Page ${page} does not exist in collection "${collectionName}"`
        );
        return;
      }

      if (index < 0 || index >= pageData.data.length) {
        console.error(
          `[ArrayStore] Index ${index} out of bounds in page ${page} of collection "${collectionName}"`
        );
        return;
      }

      pageData.data[index] = item;
    },

    // Remove item from non-paginated collection by index
    removeItemFromCollection: (state, action) => {
      const { collectionName, index } = action.payload;

      const collection = state[collectionName];

      if (!collection) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" does not exist`
        );
        return;
      }

      if (collection.pagination) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" is paginated`
        );
        return;
      }

      if (index < 0 || index >= collection.data.length) {
        console.error(
          `[ArrayStore] Index ${index} out of bounds in collection "${collectionName}"`
        );
        return;
      }

      collection.data.splice(index, 1);
    },

    // Remove item from page by index
    removeItemFromPage: (state, action) => {
      const { collectionName, page, index } = action.payload;

      const collection = state[collectionName];

      if (!collection) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" does not exist`
        );
        return;
      }

      if (!collection.pagination) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" is not paginated`
        );
        return;
      }

      const pageData = collection.pages[page];

      if (!pageData) {
        console.error(
          `[ArrayStore] Page ${page} does not exist in collection "${collectionName}"`
        );
        return;
      }

      if (index < 0 || index >= pageData.data.length) {
        console.error(
          `[ArrayStore] Index ${index} out of bounds in page ${page} of collection "${collectionName}"`
        );
        return;
      }

      pageData.data.splice(index, 1);
    },

    // Clear page data
    clearPage: (state, action) => {
      const { collectionName, page } = action.payload;

      const collection = state[collectionName];

      if (!collection) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" does not exist`
        );
        return;
      }

      if (!collection.pagination) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" is not paginated`
        );
        return;
      }

      delete collection.pages[page];
    },

    // Clear all pages
    clearAllPages: (state, action) => {
      const { collectionName } = action.payload;

      const collection = state[collectionName];

      if (!collection) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" does not exist`
        );
        return;
      }

      if (!collection.pagination) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" is not paginated`
        );
        return;
      }

      collection.pages = {};
    },

    // Clear collection data
    clearCollectionData: (state, action) => {
      const { collectionName } = action.payload;

      const collection = state[collectionName];

      if (!collection) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" does not exist`
        );
        return;
      }

      if (collection.pagination) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" is paginated, use clearAllPages instead`
        );
        return;
      }

      collection.data = [];
      collection.error = null;
    },

    // Delete entire collection
    deleteCollection: (state, action) => {
      const { collectionName } = action.payload;

      if (!state[collectionName]) {
        console.error(
          `[ArrayStore] Collection "${collectionName}" does not exist`
        );
        return;
      }

      delete state[collectionName];
    },
  },
});

// Export actions
export const {
  clearPage,
  setPageData,
  setPageError,
  addItemToPage,
  clearAllPages,
  setPageLoading,
  updateItemInPage,
  deleteCollection,
  setCollectionData,
  setCollectionError,
  addItemToCollection,
  removeItemFromPage,
  clearCollectionData,
  setCollectionLoading,
  initializeCollection,
  updateItemInCollection,
  removeItemFromCollection,
} = arrayStoreSlice.actions;

// Export reducer
export default arrayStoreSlice.reducer;
