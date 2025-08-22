// Tip tap
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import { useEditor, EditorContent } from "@tiptap/react";

// Nodes
import DropzoneNode from "../format/nodes/DropzoneNode";
import AnswerInputNode from "../format/nodes/AnswerInputNode";

const RichTextPreviewer = ({
  text,
  initialNumber,
  className = "",
  allowInput = false,
  allowImage = false,
  allowDropzone = false,
}) => {
  if (!text) return null;

  const editor = useEditor(
    {
      content: text,
      editable: false,
      extensions: [
        ...(allowImage ? [Image] : []),
        StarterKit.configure({ heading: false }),
        ...(allowInput ? [AnswerInputNode(initialNumber, false)] : []),
        ...(allowDropzone ? [DropzoneNode(initialNumber, false)] : []),
      ],
    },
    [text, initialNumber]
  );

  return (
    <EditorContent editor={editor} className={`${className} text-editor`} />
  );
};

export default RichTextPreviewer;
