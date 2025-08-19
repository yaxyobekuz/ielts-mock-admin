// Lodash
import { debounce } from "lodash";

// Icons
import { Trash } from "lucide-react";

// Tip Tap
import { NodeViewWrapper } from "@tiptap/react";

// React
import { useCallback, useEffect, useState } from "react";

const AnswerInput = ({
  editor,
  getPos,
  deleteNode,
  initialNumber = 1,
  allowActions = true,
}) => {
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

      if (!allowActions) return;
      window.dispatchEvent(
        new CustomEvent("addAnswerInput", { detail: index })
      );
    } catch (error) {
      console.warn("Error calculating input index:", error);
    }
  }, [editor, getPos]);

  useEffect(() => {
    calculateIndex();
    const debouncedCalc = debounce(calculateIndex, 50);
    editor.on("update", debouncedCalc);

    return () => {
      debouncedCalc?.cancel();
      editor.off("update", debouncedCalc);
    };
  }, [calculateIndex, editor]);

  const handleDeleteNode = () => {
    if (!allowActions) return;
    deleteNode();
    window.dispatchEvent(
      new CustomEvent("deleteAnswerInput", { detail: inputIndex })
    );
  };

  if (!allowActions) {
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
  }

  return (
    <NodeViewWrapper className="inline-block px-1 py-px">
      <div className="flex items-center gap-1.5 relative">
        <input
          type="text"
          placeholder={inputIndex}
          className="answer-input pr-5"
          id={`answer-input-${inputIndex}`}
        />
        <button
          title="Delete input"
          aria-label="Delete input"
          onClick={handleDeleteNode}
          className="flex items-center justify-center size-6 absolute right-0"
        >
          <Trash color="red" size={16} />
        </button>
      </div>
    </NodeViewWrapper>
  );
};

export default AnswerInput;
