import { memo, useCallback, useEffect, useState } from "react";

// Tip tap
import StarterKit from "@tiptap/starter-kit";
import { Node, mergeAttributes } from "@tiptap/core";
import { useEditor, EditorContent } from "@tiptap/react";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";

const AnswerInputComponent = ({ editor, getPos, initialNumber = 1 }) => {
  const [inputIndex, setInputIndex] = useState(initialNumber);

  const calculateIndex = useCallback(() => {
    try {
      let index = initialNumber;
      const currentPos = getPos();

      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === "answer-input" && pos < currentPos) {
          index++;
        }
      });

      setInputIndex(index);
    } catch (error) {
      console.warn("Error calculating input index:", error);
    }
  }, [editor, getPos, initialNumber]);

  useEffect(() => {
    editor && calculateIndex();
  }, [editor, calculateIndex]);

  return (
    <NodeViewWrapper className="inline-block px-1 py-px">
      <input
        type="text"
        placeholder={inputIndex}
        className="answer-input pr-5"
        id={`answer-input-${inputIndex}`}
      />
    </NodeViewWrapper>
  );
};

const AnswerInputNode = (initialNumber) =>
  Node.create({
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
        <AnswerInputComponent {...props} initialNumber={initialNumber} />
      ));
    },
  });

const Text = memo(({ text, initialNumber }) => {
  if (!text) return null;

  const editor = useEditor({
    content: text,
    editable: false,
    extensions: [StarterKit, AnswerInputNode(initialNumber)],
  });

  return <EditorContent editor={editor} className="text-editor" />;
});

Text.displayName = "Text";

export default Text;
