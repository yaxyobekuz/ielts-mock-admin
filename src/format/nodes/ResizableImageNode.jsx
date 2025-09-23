// TipTap
import { Plugin } from "@tiptap/pm/state";
import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";

// Components
import ResizableImage from "../components/ResizableImage";

const ResizableImageNode = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: { default: 200 },
      height: { default: null },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImage);
  },

  addProseMirrorPlugins: () => [
    new Plugin({
      props: {
        handlePaste: (view, event) => {
          const clipboard = event.clipboardData;
          if (!clipboard) return false;

          // Block image files
          if (clipboard.files && clipboard.files.length) {
            for (const file of Array.from(clipboard.files)) {
              if (file.type && file.type.startsWith("image/")) return true;
            }
          }

          // Block html that contains <img>
          const html = clipboard.getData?.("text/html") || "";
          if (html.includes("<img")) return true;

          return false;
        },

        handleDrop: (view, event) => {
          const dt = event.dataTransfer;
          if (!dt) return false;

          // block image files
          if (dt.files && dt.files.length) {
            for (const file of Array.from(dt.files)) {
              if (file.type && file.type.startsWith("image/")) {
                event.preventDefault();
                return true;
              }
            }
          }

          // Block html that contains <img>
          const html = dt.getData?.("text/html") || "";
          if (html.includes("<img")) {
            event.preventDefault();
            return true;
          }

          return false;
        },
      },
    }),
  ],
});

export default ResizableImageNode;
