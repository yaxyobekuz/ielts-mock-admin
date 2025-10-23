// Components
import AnswerInput from "../components/AnswerInput";

// Tip Tap
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

const AnswerInputNode = (
  initialNumber = 1,
  allowActions = true,
  coords,
  allowCoords
) => {
  return Node.create({
    inline: true,
    group: "inline",
    name: "answer-input",

    parseHTML() {
      return [{ tag: "input[data-name='answer-input']" }];
    },

    renderHTML({ HTMLAttributes }) {
      return [
        "input",
        mergeAttributes(HTMLAttributes, {
          type: "text",
          "data-name": "answer-input",
        }),
      ];
    },

    addNodeView() {
      return ReactNodeViewRenderer((props) => (
        <AnswerInput
          {...props}
          initialCoords={coords}
          allowCoords={allowCoords}
          allowActions={allowActions}
          initialNumber={initialNumber}
        />
      ));
    },
  });
};

export default AnswerInputNode;
