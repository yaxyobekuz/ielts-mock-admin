// Lodash
import { debounce } from "lodash";

// Icons
import { Trash } from "lucide-react";

// Tip Tap
import { NodeViewWrapper } from "@tiptap/react";

// React
import { useCallback, useEffect, useState } from "react";

const Dropzone = ({
  editor,
  getPos,
  deleteNode,
  initialNumber = 1,
  allowActions = true,
}) => {
  const [dropzoneIndex, setDropzoneIndex] = useState(initialNumber);

  const calculateIndex = useCallback(() => {
    try {
      let index = initialNumber;
      const currentPos = getPos();

      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === "dropzone" && pos < currentPos) {
          index++;
        }
      });

      setDropzoneIndex(index);

      if (!allowActions) return;

      window.dispatchEvent(new CustomEvent("addDropzone", { detail: index }));
    } catch (error) {
      console.warn("Error calculating input index:", error);
    }
  }, [editor, getPos]);

  useEffect(() => {
    calculateIndex();
    const debouncedCalc = debounce(calculateIndex, 50);
    editor.on("update", debouncedCalc);

    return () => {
      editor.off("update", debouncedCalc);
      debouncedCalc.cancel();
    };
  }, [calculateIndex, editor]);

  const handleDeleteNode = () => {
    if (!allowActions) return;

    deleteNode();
    window.dispatchEvent(
      new CustomEvent("deleteDropzone", { detail: dropzoneIndex })
    );
  };

  if (!allowActions) {
    return (
      <NodeViewWrapper className="inline-block px-1 py-px">
        <div
          children={dropzoneIndex}
          className="w-40 bg-white font-bold border border-gray-500 border-dashed text-center rounded"
        />
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="inline-block px-1 py-px">
      <div className="flex items-center gap-1.5 relative">
        <div
          children={dropzoneIndex}
          className="w-40 font-bold border border-gray-500 border-dashed text-center rounded"
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

export default Dropzone;
