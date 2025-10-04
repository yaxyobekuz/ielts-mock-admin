import { createSlice } from "@reduxjs/toolkit";

const initialState = { writing: {}, reading: {}, listening: {} };

export const moduleSlice = createSlice({
  initialState,
  name: "module",
  reducers: {
    // Set complete module data
    setModuleData: (state, action) => {
      const { type, data, id } = action.payload;

      if (!state[type]);
      else state[type][id] = data;
    },

    // Update module
    updateModuleData: (state, action) => {
      const { type, data, id } = action.payload;

      if (!state[type]);
      else state[type][id] = { ...state[type][id], ...data };
    },

    // Add new part
    addModulePart: (state, action) => {
      const part = action.payload;
      const { module, testId } = part;

      if (state[module] && state[module][testId]) {
        state[module][testId].parts.push(part);
        state[module][testId].partsCount = part.number;
      } else {
        console.error(`Test ${testId}: ${module} module is not defined`);
      }
    },

    // Add new section
    addModuleSection: (state, action) => {
      const section = action.payload;
      const { testId, partId, module } = section;

      if (state[module] && state[module][testId]) {
        const parts = state[module][testId].parts;
        const part = parts.find((p) => p._id === partId);

        if (!part) return console.error(`Part ${partId} is not defined`);
        part.sections.push(section);
      } else {
        console.error(`Test ${testId}: ${module} module is not defined`);
      }
    },

    // Update section
    updateModuleSection: (state, action) => {
      const { type, id, partNumber, sectionIndex, data } = action.payload;

      if (state[type] && state[type][id]) {
        const parts = state[type][id].parts;
        const part = parts.find((p) => p.number === partNumber);

        if (!part) return console.error(`Part ${partNumber} is not defined`);

        const section = part?.sections[sectionIndex];

        if (!section) {
          return console.error(`Section ${sectionIndex} is not defined`);
        }

        Object.assign(section, { ...section, ...data });

        part.totalQuestions = part.sections.reduce(
          (total, section) => total + (section.questionsCount || 0),
          0
        );
      } else {
        console.error(`Test ${id}: ${type} module is not defined`);
      }
    },

    // Update section
    updateModulePart: (state, action) => {
      const { type, id, partNumber, data } = action.payload;

      if (state[type] && state[type][id]) {
        const parts = state[type][id].parts;
        const part = parts.find((p) => p.number === partNumber);

        if (!part) return console.error(`Part ${partNumber} is not defined`);

        Object.assign(part, { ...part, ...data });
      } else {
        console.error(`Test ${id}: ${type} module is not defined`);
      }
    },

    // Remove item from module array by index
    removeModulePart: (state, action) => {
      const { type, id, number } = action.payload;

      if (state[type] && state[type][id]) {
        const parts = state[type][id].parts;
        const filteredParts = parts.filter((p) => p.number !== number);
        const newParts = filteredParts.map((p, i) => ({ ...p, number: i + 1 }));
        state[type][id] = newParts;
      } else {
        console.error(`Test ${id}: ${type} module is not defined`);
      }
    },
  },
});

// Export action creators
export const {
  addModulePart,
  setModuleData,
  addModuleSection,
  updateModulePart,
  removeModulePart,
  updateModuleData,
  updateModuleSection,
} = moduleSlice.actions;

// Export reducer as default
export default moduleSlice.reducer;
