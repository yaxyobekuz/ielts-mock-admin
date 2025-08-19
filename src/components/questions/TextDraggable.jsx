// Tip tap
import StarterKit from "@tiptap/starter-kit";
import { useEditor, EditorContent } from "@tiptap/react";

// Nodes
import DropzoneNode from "../../format/nodes/DropzoneNode";

const TextDraggable = ({ text, initialNumber, options }) => {
  const editor = useEditor({
    content: text,
    editable: false,
    extensions: [StarterKit, DropzoneNode(initialNumber, false)],
  });

  return (
    <div className="flex gap-5 w-full">
      <EditorContent editor={editor} className="text-editor" />

      <div className="min-w-max space-y-2 pr-5">
        <b className="inline-block">{options.title}</b>

        {/* Answer options */}
        <ul className="max-w-max rounded-md space-y-2">
          {options.data.map(({ option }, index) => {
            return (
              <li
                key={index}
                className="max-w-max bg-white cursor-move px-2 rounded border border-gray-400"
              >
                {option}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default TextDraggable;
