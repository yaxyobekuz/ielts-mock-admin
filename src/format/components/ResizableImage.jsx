// Resizable image
import "react-resizable/css/styles.css";
import { ResizableBox } from "react-resizable";

// TipTap
import { NodeViewWrapper } from "@tiptap/react";

const ResizableImage = ({ node, updateAttributes }) => {
  const { src, width, height } = node.attrs;

  const initialWidth = width || 200;
  const initialHeight = height || 150;

  return (
    <NodeViewWrapper className="resizable-image">
      <ResizableBox
        width={initialWidth}
        height={initialHeight}
        className="max-w-full"
        resizeHandles={["se", "e", "s"]}
        onResizeStop={(_, { size }) => {
          updateAttributes({ width: size.width, height: size.height });
        }}
      >
        <img alt="" src={src} style={{ width: "100%", height: "100%" }} />
      </ResizableBox>
    </NodeViewWrapper>
  );
};

export default ResizableImage;
