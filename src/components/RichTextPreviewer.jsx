// Tip tap
import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
} from "@tiptap/extension-table";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import { useEditor, EditorContent } from "@tiptap/react";

// Nodes
import DropzoneNode from "../format/nodes/DropzoneNode";
import AnswerInputNode from "../format/nodes/AnswerInputNode";

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: 200,
        renderHTML: (attributes) => ({
          style: `width: ${attributes.width}px;`,
        }),
      },
      height: {
        default: null,
        renderHTML: (attributes) => ({
          style: attributes.height ? `height: ${attributes.height}px;` : "",
        }),
      },
    };
  },
});

const RichTextPreviewer = ({
  text,
  coords,
  initialNumber,
  className = "",
  allowImage = true,
  allowInput = false,
  allowCoords = true,
  allowDropzone = false,
}) => {
  if (!text) return null;

  const editor = useEditor(
    {
      content: text,
      editable: false,
      extensions: [
        Table,
        TableRow,
        TableCell,
        TableHeader,
        ...(allowImage ? [CustomImage] : []),
        StarterKit.configure({ heading: false }),
        ...(allowInput
          ? [AnswerInputNode(initialNumber, false, coords, allowCoords)]
          : []),
        ...(allowDropzone
          ? [DropzoneNode(initialNumber, false, coords, allowCoords)]
          : []),
      ],
    },
    [text, initialNumber]
  );

  return (
    <EditorContent editor={editor} className={`${className} text-editor`} />
  );
};

export default RichTextPreviewer;
