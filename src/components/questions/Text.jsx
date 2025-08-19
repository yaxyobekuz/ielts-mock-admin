import { memo } from "react";

// Tip tap
import StarterKit from "@tiptap/starter-kit";
import { useEditor, EditorContent } from "@tiptap/react";

// Nodes
import AnswerInputNode from "../../format/nodes/AnswerInputNode";

const Text = memo(({ text, initialNumber }) => {
  if (!text) return null;

  const editor = useEditor({
    content: text,
    editable: false,
    extensions: [StarterKit, AnswerInputNode(initialNumber, false)],
  });

  return <EditorContent editor={editor} className="text-editor" />;
});

Text.displayName = "Text";

export default Text;
