import { createSlice } from "@reduxjs/toolkit";

// Initial state - stores different collections of items by category
const initialState = {
  links: {},
};

export const objectStoreSlice = createSlice({
  initialState,
  name: "objectStore",
  reducers: {
    addEntityToObjectStore: (state, action) => {
      const { collectionName, entityId, entityData } = action.payload;

      const collection = state[collectionName];
      const entityAlreadyExists = collection?.[entityId];

      if (entityAlreadyExists) {
        return console.error(
          `[ObjectStore] Entity already exists in collection "${collectionName}" with ID: ${entityId}`
        );
      }

      collection[entityId] = entityData;
    },

    updateEntityFromObjectStore: (state, action) => {
      const { collectionName, entityId, entityData } = action.payload;

      const collection = state[collectionName];
      const entity = collection?.[entityId];

      if (!entity) {
        console.error(
          `[ObjectStore] Entity does not exist in collection "${collectionName}" with ID: ${entityId}`
        );
        return;
      }

      collection[entityId] = { ...entity, ...entityData };
    },

    deleteEntityFromObjectStore: (state, action) => {
      const { collectionName, entityId } = action.payload;

      const collection = state[collectionName];
      const entity = collection?.[entityId];

      if (!entity) {
        return console.error(
          `[ObjectStore] Entity does not exist in collection "${collectionName}" with ID: ${entityId}`
        );
      }

      delete collection[entityId];
    },
  },
});

// Export actions
export const {
  addEntityToObjectStore,
  updateEntityFromObjectStore,
  deleteEntityFromObjectStore,
} = objectStoreSlice.actions;

// Export reducer
export default objectStoreSlice.reducer;
