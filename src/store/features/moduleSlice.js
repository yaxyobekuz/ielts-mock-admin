import { createSlice } from "@reduxjs/toolkit";

const text = `<b>Text Editor</b><p>Welcome to text editor! Here are some features:</p><ul><li><strong>Bold text</strong></li><li><em>Italic text</em></li><li><u>Underlined text</u></li><li>Lists and more!</li></ul>`;

const listeningParts = [
  // Text
  {
    number: 1,
    totalQuestions: 0,
    description: "Listen and answer questions.",
    sections: [
      {
        text,
        answers: [],
        type: "text",
        questionsCount: 0,
        title: "Questions",
        description: `Complete the notes. Write ONE WORD AND/OR A NUMBER for each answer.`,
      },
    ],
  },
  // Text draggable
  {
    number: 2,
    totalQuestions: 0,
    description: "Listen and answer questions.",
    sections: [
      {
        text,
        questionsCount: 0,
        type: "text-draggable",
        title: "Questions",
        options: {
          title: "Staff Responsibilities",
          data: [
            { option: "Finance" },
            { option: "Food" },
            { option: "Health" },
          ],
        },
        description: `Who is responsible for each area? Choose the correct answer for each person and move it into the gap.`,
      },
    ],
  },
  // Flowchart
  {
    number: 3,
    totalQuestions: 0,
    description: "Listen and answer questions.",
    sections: [
      {
        type: "flowchart",
        questionsCount: 0,
        title: "Questions",
        items: {
          title: "Flowchart",
          data: [{ text }, { text }, { text }],
        },
        options: {
          title: "Staff Responsibilities",
          data: [
            { option: "Finance" },
            { option: "Food" },
            { option: "Health" },
          ],
        },
        description: `Complete the flow-chart. Choose the correct answer and move it into the gap.`,
      },
    ],
  },
  // Radiogroup
  {
    number: 4,
    totalQuestions: 2,
    description: "Listen and answer questions.",
    sections: [
      {
        questionsCount: 2,
        title: "Questions",
        type: "radio-group",
        groups: [
          {
            correctAnswerIndex: 0,
            question: "What is the main topic of the conversation?",
            answers: [
              { text: "Furniture sale" },
              { text: "Second-hand shop" },
              { text: "Online marketplace" },
              { text: "Charity event" },
            ],
          },
          {
            correctAnswerIndex: 0,
            question: "What is the price of the dining table?",
            answers: [
              { text: "£15.00" },
              { text: "£20.00" },
              { text: "£25.00" },
              { text: "£30.00" },
            ],
          },
        ],
        description: "Choose the correct letter, A, B, C or D.",
      },
    ],
  },
];

const readingParts = [
  // Text
  {
    number: 1,
    totalQuestions: 0,
    text: "Just wedding it! 1",
    description: "Listen and answer questions.",
    sections: [
      {
        text,
        answers: [],
        type: "text",
        questionsCount: 0,
        title: "Questions",
        description: `Complete the notes. Write ONE WORD AND/OR A NUMBER for each answer.`,
      },
    ],
  },
  // Radiogroup
  {
    number: 2,
    totalQuestions: 2,
    text: "Just wedding it! 2",
    description: "Listen and answer questions.",
    sections: [
      {
        questionsCount: 2,
        title: "Questions",
        type: "radio-group",
        groups: [
          {
            correctAnswerIndex: 0,
            question: "What is the main topic of the conversation?",
            answers: [
              { text: "Furniture sale" },
              { text: "Second-hand shop" },
              { text: "Online marketplace" },
              { text: "Charity event" },
            ],
          },
          {
            correctAnswerIndex: 0,
            question: "What is the price of the dining table?",
            answers: [
              { text: "£15.00" },
              { text: "£20.00" },
              { text: "£25.00" },
              { text: "£30.00" },
            ],
          },
        ],
        description: "Choose the correct letter, A, B, C or D.",
      },
    ],
  },
  // Text
  {
    number: 3,
    totalQuestions: 0,
    text: "Just wedding it!",
    description: "Listen and answer questions.",
    sections: [
      {
        text,
        answers: [],
        type: "text",
        questionsCount: 0,
        title: "Questions",
        description: `Complete the notes. Write ONE WORD AND/OR A NUMBER for each answer.`,
      },
    ],
  },
  // Radiogroup
  {
    number: 4,
    totalQuestions: 2,
    text: "Just wedding it!",
    description: "Listen and answer questions.",
    sections: [
      {
        questionsCount: 2,
        title: "Questions",
        type: "radio-group",
        groups: [
          {
            correctAnswerIndex: 0,
            question: "What is the main topic of the conversation?",
            answers: [
              { text: "Furniture sale" },
              { text: "Second-hand shop" },
              { text: "Online marketplace" },
              { text: "Charity event" },
            ],
          },
          {
            correctAnswerIndex: 0,
            question: "What is the price of the dining table?",
            answers: [
              { text: "£15.00" },
              { text: "£20.00" },
              { text: "£25.00" },
              { text: "£30.00" },
            ],
          },
        ],
        description: "Choose the correct letter, A, B, C or D.",
      },
    ],
  },
];

const writingParts = [
  // Text
  {
    number: 1,
    totalQuestions: 0,
    text: "Just wedding it! 1",
    description: "Listen and answer questions.",
  },
  // Text
  {
    number: 2,
    totalQuestions: 0,
    text: "Just wedding it! 1",
    description: "Listen and answer questions.",
  },
];

const initialState = {
  writing: {
    testId: { partsCount: 4, parts: writingParts },
  },
  reading: {
    testId: { partsCount: 4, parts: readingParts },
  },
  listening: {
     testId: { partsCount: 4, parts: listeningParts },
  },
};

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
  updateModuleSection,
} = moduleSlice.actions;

// Export reducer as default
export default moduleSlice.reducer;
