import { createSlice } from "@reduxjs/toolkit";
const text = `*Phone call about second-hand furniture*

*Items:*
Dining table:          - ^ shape

                             - medium size

                             - ^ old

                             - price: £25.00

Dining chairs:       - set of ^ chairs

                             - seats covered in ^ material

                             - in ^ condition

                             - price: £20.00


Desk:                    - length: 1 metre 20

                             - 3 drawers. Top drawer has a ^.
                              
                             - price: £ ^
                             
^

^

^
`;

const flowchartText = `The rover is directed to a ~ which has organic material.`;

const textDraggable = `*People*
Mary Brown ~

John Stevens ~

Alison Jones ~

Tim Smith ~

Jenny James ~`;

const listeningTestParts = [
  {
    number: 1,
    totalQuestions: 10,
    description: "Listen and answer questions 1-10.",
    sections: [
      {
        content: { text },
        questionsCount: 10,
        questionType: "text",
        title: "Questions 1-10",
        description: `Complete the notes. Write ONE WORD AND/OR A NUMBER for each answer.`,
      },
    ],
  },
  {
    number: 2,
    totalQuestions: 10,
    description: "Listen and answer questions 11-20.",
    sections: [
      {
        content: { text },
        questionsCount: 10,
        questionType: "text",
        title: "Questions 11-20",
        description:
          "Complete the notes. Write ONE WORD AND/OR A NUMBER for each answer.",
      },
    ],
  },
  {
    number: 3,
    totalQuestions: 10,
    description: "Listen and answer questions 21-30.",
    sections: [
      {
        questionsCount: 5,
        questionType: "text-draggable",
        title: "Questions 21-30",
        content: {
          text: textDraggable,
          answerChoices: {
            title: "Staff Responsibilities",
            options: [
              { option: "Finance" },
              { option: "Food" },
              { option: "Health" },
              { option: "Kids' counseling" },
              { option: "Organisation" },
              { option: "Rooms" },
              { option: "Sport" },
              { option: "Trips" },
            ],
          },
        },
        description:
          "Who is responsible for each area? Choose the correct answer for each person and move it into the gap.",
      },
      {
        questionType: "flowchart",
        title: "Questions 21-30",
        questionsCount: 5,
        content: {
          flowchartItems: {
            title: "Flowchart",
            items: [
              { flowchartText },
              { flowchartText },
              { flowchartText },
              { flowchartText },
              { flowchartText },
            ],
          },
          answerChoices: {
            title: "Staff Responsibilities",
            options: [
              { option: "Finance" },
              { option: "Food" },
              { option: "Health" },
              { option: "Kids' counseling" },
              { option: "Organisation" },
              { option: "Rooms" },
              { option: "Sport" },
              { option: "Trips" },
            ],
          },
        },
        description:
          "Complete the flow-chart. Choose the correct answer and move it into the gap.",
      },
    ],
  },
  {
    number: 4,
    totalQuestions: 10,
    description: "Listen and answer questions 31-40.",
    sections: [
      {
        questionType: "radio-group",
        title: "Questions 31-40",
        questionsCount: 2,
        content: {
          questionGroups: [
            {
              questionText: "What is the main topic of the conversation?",
              choiceOptions: [
                { text: "Furniture sale" },
                { text: "Second-hand shop" },
                { text: "Online marketplace" },
                { text: "Charity event" },
              ],
            },
            {
              questionText: "What is the price of the dining table?",
              choiceOptions: [
                { text: "£15.00" },
                { text: "£20.00" },
                { text: "£25.00" },
                { text: "£30.00" },
              ],
            },
          ],
        },
        description: "Choose the correct letter, A, B, C or D.",
      },
    ],
  },
];

const initialState = {
  writing: {},
  speaking: {},
  listening: {
    id: "testId",
    parts: listeningTestParts,
  },
};

export const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    // Update entire state or specific sections
    updateState: (state, { payload }) => ({ ...state, ...payload }),

    // Update writing
    updateWriting: (state, { payload }) => {
      state.writing = { ...state.writing, ...payload };
    },

    // Update speaking
    updateSpeaking: (state, { payload }) => {
      state.speaking = { ...state.speaking, ...payload };
    },

    // Update listening
    updateListening: (state, { payload }) => {
      state.listening = { ...state.listening, ...payload };
    },

    // Update specific listening part
    updateModulePart: (state, { payload }) => {
      const { partIndex, partData, module } = payload;
      if (!state[module].parts[partIndex]) return;

      state[module].parts[partIndex] = {
        ...state[module].parts[partIndex],
        ...partData,
      };
    },

    // Add new listening part
    addModulePart: (state, { payload }) => {
      const { module } = payload;
      state[module].parts.push({ number: state[module].parts.length + 1 });
    },

    // Remove listening part
    removeModulePart: (state, { payload }) => {
      const { index: targetIndex, module } = payload;

      state[module].parts = state[module].parts.filter(
        (_, index) => index !== targetIndex
      );
    },

    // Update specific section in listening part
    updateModuleSection: (state, { payload }) => {
      const { partIndex, sectionIndex, sectionData, module } = payload;

      

      if (!state[module]?.parts[partIndex]?.sections[sectionIndex]) return;

      state[module].parts[partIndex].sections[sectionIndex] = {
        ...state[module].parts[partIndex].sections[sectionIndex],
        ...sectionData,
      };
    },

    // Update specific section in listening part
    addModuleSection: (state, { payload }) => {
      const { partIndex, module, sectionType } = payload;
      if (!state[module]?.parts[partIndex] || !sectionType) return;

      const newSection = {
        content: {},
        questionsCount: 1,
        title: "Section title",
        questionType: sectionType,
        description: "Section description",
      };

      switch (sectionType) {
        case "text":
          newSection.content = { text: "Section text ^" };
          break;
        case "text-draggable":
          newSection.content = {
            text: "Section text ~",
            answerChoices: {
              title: "Answers tite",
              options: [{ option: "Answer 1" }],
            },
          };
          break;
        case "flowchart":
          newSection.content = {
            flowchartItems: {
              title: "Flowchart title",
              items: [{ flowchartText: "Item 1 ~" }],
            },
            answerChoices: {
              title: "Answers title",
              options: [{ option: "Answer 1" }],
            },
          };
          break;
        case "radio-group":
          newSection.content = {
            questionGroups: [
              {
                questionText: "Question",
                choiceOptions: [
                  { text: "Answer 1" },
                  { text: "Answer 2" },
                  { text: "Answer 3" },
                  { text: "Answer 4" },
                ],
              },
            ],
          };
          break;
      }

      if (!state[module].parts[partIndex].sections) {
        state[module].parts[partIndex].sections = [];
      }

      state[module].parts[partIndex].totalQuestions++;
      state[module].parts[partIndex].sections.push(newSection);
    },

    // Reset state to initial values
    resetState: () => initialState,

    // Reset specific module
    resetModule: (state, { payload }) => {
      const { module } = payload;
      if (!state[module]) return;

      state[module] = initialState[module];
    },
  },
});

// Export action creators
export const {
  resetState,
  resetModule,
  updateState,
  updateWriting,
  addModulePart,
  updateSpeaking,
  updateListening,
  updateModulePart,
  addModuleSection,
  removeModulePart,
  updateModuleSection,
} = storeSlice.actions;

// Export reducer as default
export default storeSlice.reducer;
