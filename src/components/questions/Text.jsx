// Tip tap
import StarterKit from "@tiptap/starter-kit";
import { useEditor, EditorContent } from "@tiptap/react";

// Nodes
import AnswerInputNode from "../../format/nodes/AnswerInputNode";

const Text = ({ text, initialNumber }) => {
  if (!text) return null;

  const editor = useEditor(
    {
      content: text,
      editable: false,
      extensions: [StarterKit, AnswerInputNode(initialNumber, false)],
    },
    [text, initialNumber]
  );

  return <EditorContent editor={editor} className="text-editor" />;
};

export default Text;
