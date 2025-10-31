// Icons
import { Move, Trash } from "lucide-react";

// Tip Tap
import { NodeViewWrapper } from "@tiptap/react";

// Hooks
import useObjectStore from "@/hooks/useObjectStore";
import usePathSegments from "@/hooks/usePathSegments";

// React
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const AnswerInput = ({
  editor,
  getPos,
  deleteNode,
  initialNumber = 1,
  initialCoords = {},
  allowActions = true,
}) => {
  const elementRef = useRef(null);
  const { pathSegments } = usePathSegments();
  const [isMoved, setIsMoved] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [inputIndex, setInputIndex] = useState(initialNumber);
  const { updateEntity, getEntity, hasEntity, addEntity } =
    useObjectStore("coords");

  const coordsKey = `${pathSegments[1]}-${pathSegments[3]}-${pathSegments[4]}-${pathSegments[5]}-${pathSegments[6]}`;

  const hasCoords = hasEntity(coordsKey);
  const cachedCoords = getEntity(coordsKey);

  const allCoords = useMemo(() => {
    if (!Object.keys(cachedCoords || {}).length) {
      return initialCoords;
    } else {
      return cachedCoords;
    }
  }, [coordsKey, cachedCoords, initialCoords]);

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

      if (allCoords && allCoords[index - initialNumber + 1]) {
        setIsMoved(true);
        setCoords(allCoords[index - initialNumber + 1]);
      } else {
        setCoords({});
        setIsMoved(false);
      }
    } catch (error) {
      console.warn("Error calculating input index:", error);
    }
  }, [coordsKey, hasCoords, allowActions ? allCoords : null]);

  useEffect(() => {
    if (!hasCoords && allowActions) {
      addEntity(coordsKey, initialCoords);
    }
  }, [hasCoords, coordsKey, coords, allowActions]);

  useEffect(() => {
    calculateIndex();
    editor.on("update", calculateIndex);

    return () => {
      editor.off("update", calculateIndex);
    };
  }, [calculateIndex, editor]);

  const handleDeleteNode = () => {
    if (!allowActions) return;
    deleteNode();
    updateEntity(coordsKey, { ...allCoords, [inputIndex]: undefined });
  };

  const handleMouseDown = () => {
    if (!allowActions) return;

    setIsMoved(true);
    setIsMoving(true);
  };

  const handleDeletePosition = () => {
    if (!allowActions) return;

    setIsMoved(false);
    setIsMoving(false);
    setCoords({ x: 0, y: 0 });
    updateEntity(coordsKey, { ...allCoords, [inputIndex]: undefined });
  };

  useEffect(() => {
    if (!isMoving) return;
    let coords = { x: 0, y: 0 };

    const handleMouseMove = (e) => {
      const container = document.querySelector(
        ".editor-content-wrapper .tiptap"
      );
      const rect = container?.getBoundingClientRect();
      if (!rect) return;
      const y = e.clientY - rect.top - 12;
      const x = e.clientX - rect.left - 86;

      coords = { x, y };
      setCoords({ x, y });
    };

    const handleMouseUp = () => {
      setIsMoving(false);
      updateEntity(coordsKey, { ...allCoords, [inputIndex]: coords });
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMoving]);

  if (!allowActions) {
    return (
      <NodeViewWrapper
        style={isMoved ? { top: coords.y, left: coords.x } : {}}
        className={`${
          isMoved ? "absolute moved-item-container z-10 w-32" : ""
        } inline-block px-1 py-px`}
      >
        <input
          type="text"
          placeholder={inputIndex}
          id={`answer-input-${inputIndex}`}
          className={`${
            isMoved ? "w-full min-w-0" : "w-40 s"
          } answer-input pr-5`}
        />
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper
      ref={elementRef}
      style={isMoved ? { top: coords.y, left: coords.x } : {}}
      className={`${
        isMoved ? "absolute moved-item-container z-10 !max-w-32 !w-32 !min-w-0" : ""
      } inline-block px-1 py-px select-none`}
    >
      <div className="flex items-center gap-1.5 relative w-full">
        <input
          type="text"
          placeholder={inputIndex}
          id={`answer-input-${inputIndex}`}
          className={`${isMoved ? "w-32 min-w-0" : "s"} answer-input pr-5`}
        />

        <div className="flex items-center gap-px absolute right-0">
          {/* Move */}
          <button
            title="Move input"
            aria-label="Move input"
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDeletePosition}
            className={`${
              isMoving ? "cursor-grabbing" : "cursor-grab"
            } btn p-0 size-6 rounded-sm`}
          >
            <Move size={16} color={isMoved ? "#3b82f6 " : "#374151"} />
          </button>

          {/* Delete input */}
          <button
            title="Delete input"
            aria-label="Delete input"
            onClick={handleDeleteNode}
            className="btn p-0 size-6 rounded-sm"
          >
            <Trash color="red" size={16} />
          </button>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default AnswerInput;
