// Icons
import {
  Bold,
  List,
  Undo,
  Redo,
  Code,
  Trash,
  Quote,
  Italic,
  Underline,
  ListOrdered,
} from "lucide-react";

// Lodash
import { debounce } from "lodash";

// React
import { useCallback, useEffect, useState } from "react";

// Tip tap
import StarterKit from "@tiptap/starter-kit";
import { Node, mergeAttributes } from "@tiptap/core";
import { useEditor, EditorContent } from "@tiptap/react";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";

const AnswerInputComponent = ({ deleteNode, editor, getPos }) => {
  const [inputIndex, setInputIndex] = useState(1);

  const calculateIndex = useCallback(() => {
    try {
      let index = 1;
      const currentPos = getPos();

      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === "answer-input" && pos < currentPos) {
          index++;
        }
      });

      setInputIndex(index);
      window.dispatchEvent(
        new CustomEvent("addAnswerInput", { detail: index })
      );
    } catch (error) {
      console.warn("Error calculating input index:", error);
    }
  }, [editor, getPos]);

  useEffect(() => {
    const debouncedCalc = debounce(calculateIndex, 50);
    calculateIndex();
    editor.on("update", debouncedCalc);

    return () => {
      editor.off("update", debouncedCalc);
      debouncedCalc.cancel();
    };
  }, [calculateIndex, editor]);

  const handleDeleteNode = () => {
    deleteNode();
    window.dispatchEvent(
      new CustomEvent("deleteAnswerInput", { detail: inputIndex })
    );
  };

  return (
    <NodeViewWrapper className="inline-block px-1 py-px">
      <div className="flex items-center gap-1.5 relative">
        <input
          type="text"
          placeholder={inputIndex}
          className="answer-input pr-5"
          id={`answer-input-${inputIndex}`}
        />
        <button
          title="Delete input"
          aria-label="Delete input"
          onClick={handleDeleteNode}
          className="flex items-center justify-center size-6 absolute right-0"
        >
          <Trash color="red" size={16} />
        </button>
      </div>
    </NodeViewWrapper>
  );
};

const AnswerInputNode = Node.create({
  inline: true,
  group: "inline",
  name: "answer-input",

  parseHTML() {
    return [{ tag: "input[data-name='answer-input']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "input",
      mergeAttributes(HTMLAttributes, {
        type: "text",
        "data-name": "answer-input",
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AnswerInputComponent);
  },
});

const RichTextEditor = ({
  onChange,
  onChangeStart,
  className = "",
  initialContent = `<b>Text Editor</b><p>Welcome to text editor! Here are some features:</p><ul><li><strong>Bold text</strong></li><li><em>Italic text</em></li><li><u>Underlined text</u></li><li>Lists and more!</li></ul>`,
}) => {
  const editor = useEditor({
    content: initialContent,
    extensions: [StarterKit.configure({ heading: false }), AnswerInputNode],
  });

  if (!editor) return <i>Hmmm... Nimadir xato ketdi!</i>;

  // Create debounced onChange function
  const debouncedOnChange = useCallback(
    debounce((html) => {
      onChange?.(html);
    }, 1000),
    [onChange]
  );

  useEffect(() => {
    const handleUpdate = () => {
      // Call onChangeStart immediately when user starts typing
      onChangeStart?.();

      // Call debounced onChange after delay
      debouncedOnChange(editor.getHTML());
    };

    editor.on("update", handleUpdate);

    // Cleanup
    return () => {
      debouncedOnChange.cancel();
      editor.off("update", handleUpdate);
    };
  }, [editor]);

  return (
    <div className={`${className}`}>
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="bg-gray-50 text-editor rounded-xl p-2.5"
      />
    </div>
  );
};

const Toolbar = ({ editor }) => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Force component re-render
    const handleUpdate = () => forceUpdate({});

    // Listen to editor state changes
    editor.on("blur", handleUpdate);
    editor.on("focus", handleUpdate);
    editor.on("update", handleUpdate);
    editor.on("selectionUpdate", handleUpdate);

    // Clean
    return () => {
      editor.off("blur", handleUpdate);
      editor.off("focus", handleUpdate);
      editor.off("update", handleUpdate);
      editor.off("selectionUpdate", handleUpdate);
    };
  }, [editor]);

  return (
    <div className="flex items-center gap-3.5 sticky top-0 z-10 p-2.5 bg-gray-100 mb-3 rounded-b-xl">
      {/* Bold */}
      <ToolbarButton
        title="Bold (Ctrl + B)"
        isActive={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </ToolbarButton>

      {/* Italic */}
      <ToolbarButton
        title="Italic (Ctrl + I)"
        isActive={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </ToolbarButton>

      {/* Underline */}
      <ToolbarButton
        title="Underline (Ctrl + U)"
        isActive={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline size={16} />
      </ToolbarButton>

      {/* Code */}
      <ToolbarButton
        title="Code (Ctrl + E)"
        isActive={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code size={16} />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 mx-2"></div>

      {/* Ordered List */}
      <ToolbarButton
        title="Ordered List (Ctrl + Shift + 7)"
        isActive={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </ToolbarButton>

      {/* Bullet List */}
      <ToolbarButton
        title="Unordered List (Ctrl + Shift + 8)"
        isActive={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </ToolbarButton>

      {/* Quote */}
      <ToolbarButton
        title="Quote (Ctrl + Shift + B)"
        isActive={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={16} />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 mx-2"></div>

      <ToolbarButton
        title="Undo (Ctrl + Z)"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <Undo size={16} />
      </ToolbarButton>

      <ToolbarButton
        title="Redo  (Ctrl + Shift + Z)"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <Redo size={16} />
      </ToolbarButton>

      {/* Custom input element */}
      <button
        title="Insert answer input"
        className="ml-auto px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        onClick={() =>
          editor.chain().focus().insertContent({ type: "answer-input" }).run()
        }
      >
        Insert Input
      </button>
    </div>
  );
};

const ToolbarButton = ({ onClick, isActive, disabled, children, title }) => (
  <button
    title={title}
    onClick={onClick}
    disabled={disabled}
    children={children}
    className={`p-2 rounded transition-colors duration-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent ${
      isActive ? "bg-blue-100 text-blue-600" : "text-gray-600"
    }`}
  />
);

export default RichTextEditor;
