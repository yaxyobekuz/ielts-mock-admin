// Components
import Dropzone from "../components/Dropzone";

// Tip Tap
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

const DropzoneNode = (
  initialNumber = 1,
  allowActions = true,
  coords,
  allowCoords
) => {
  return Node.create({
    inline: true,
    group: "inline",
    name: "dropzone",

    parseHTML() {
      return [{ tag: "span[data-name='dropzone']" }];
    },

    renderHTML({ HTMLAttributes }) {
      return [
        "span",
        mergeAttributes(HTMLAttributes, { "data-name": "dropzone" }),
      ];
    },

    addNodeView() {
      return ReactNodeViewRenderer((props) => (
        <Dropzone
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

export default DropzoneNode;
