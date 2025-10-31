// Icons
import { Move, Trash } from "lucide-react";

// Tip Tap
import { NodeViewWrapper } from "@tiptap/react";

// Hooks
import useObjectStore from "@/hooks/useObjectStore";
import usePathSegments from "@/hooks/usePathSegments";

// React
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const Dropzone = ({
  editor,
  getPos,
  deleteNode,
  initialNumber = 1,
  allowCoords = true,
  initialCoords = {},
  allowActions = true,
}) => {
  const elementRef = useRef(null);
  const { pathSegments } = usePathSegments();
  const [isMoved, setIsMoved] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [dropzoneIndex, setDropzoneIndex] = useState(initialNumber);
  const { updateEntity, getEntity, addEntity, hasEntity } =
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
        if (node.type.name === "dropzone" && pos < currentPos) {
          index++;
        }
      });

      setDropzoneIndex(index);

      if (!allowCoords) return;

      if (allCoords && allCoords[index - initialNumber + 1]) {
        setIsMoved(true);
        setCoords(allCoords[index - initialNumber + 1]);
      } else {
        setCoords({});
        setIsMoved(false);
      }
    } catch (error) {
      console.warn("Error calculating dropzone index:", error);
    }
  }, [coordsKey, hasCoords, allowActions && allowCoords ? allCoords : null]);

  useEffect(() => {
    if (!hasCoords && allowActions && allowCoords) {
      addEntity(coordsKey, null);
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
    updateEntity(coordsKey, { ...allCoords, [dropzoneIndex]: undefined });
  };

  const handleMouseDown = () => {
    if (!allowActions || !allowCoords) return;

    setIsMoved(true);
    setIsMoving(true);
  };

  const handleDeletePosition = () => {
    if (!allowActions) return;

    setIsMoved(false);
    setIsMoving(false);
    setCoords({ x: 0, y: 0 });
    updateEntity(coordsKey, { ...allCoords, [dropzoneIndex]: undefined });
  };

  useEffect(() => {
    if (!isMoving || !allowCoords) return;
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
      updateEntity(coordsKey, { ...allCoords, [dropzoneIndex]: coords });
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
          isMoved ? "absolute z-10 w-32" : ""
        } inline-block px-1 py-px`}
      >
        <div
          children={dropzoneIndex}
          className={`${
            isMoved ? "w-full" : "w-40"
          } bg-white font-bold border border-gray-500 border-dashed text-center rounded`}
        />
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper
      ref={elementRef}
      style={isMoved ? { top: coords.y, left: coords.x } : {}}
      className={`${
        isMoved ? "absolute z-10 max-w-32 !min-w-0" : ""
      } inline-block px-1 py-px select-none`}
    >
      <div className="flex items-center gap-1.5 relative">
        <div
          children={dropzoneIndex}
          className="w-40 bg-white font-bold border border-gray-500 border-dashed text-center rounded"
        />

        <div className="flex items-center gap-px absolute right-0">
          {/* Move */}
          <button
            title="Move dropzone"
            aria-label="Move dropzone"
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDeletePosition}
            className={`${
              isMoving ? "cursor-grabbing" : "cursor-grab"
            } btn p-0 size-6 rounded-sm`}
          >
            <Move size={16} color={isMoved ? "#3b82f6 " : "#374151"} />
          </button>

          {/* Delete dropzone */}
          <button
            title="Delete dropzone"
            aria-label="Delete dropzone"
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

export default Dropzone;
