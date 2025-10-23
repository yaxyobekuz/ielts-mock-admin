// Icons
import {
  Bold,
  List,
  Undo,
  Redo,
  Code,
  Rows,
  Quote,
  Italic,
  Columns,
  Brackets,
  TableIcon,
  ImagePlus,
  Underline,
  ListOrdered,
  BetweenVerticalEnd,
  BetweenHorizonalStart,
} from "lucide-react";

// Styles
import "@/styles/tiptap.css";

// Hooks
import useModal from "@/hooks/useModal";

// React
import { useEffect, useState } from "react";

// Tip tap
import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
} from "@tiptap/extension-table";
import StarterKit from "@tiptap/starter-kit";
import { useEditor, EditorContent } from "@tiptap/react";

// Nodes
import DropzoneNode from "../format/nodes/DropzoneNode";
import AnswerInputNode from "../format/nodes/AnswerInputNode";
import ResizableImageNode from "@/format/nodes/ResizableImageNode";

const RichTextEditor = ({
  coords,
  onChange,
  notSticky,
  className = "",
  allowInput = false,
  allowImage = false,
  allowCoords = true,
  allowDropzone = false,
  initialContent = "<p>Matn kiriting...</p>",
}) => {
  const editor = useEditor({
    content: initialContent,
    extensions: [
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      ...(allowImage ? [ResizableImageNode] : []),
      StarterKit.configure({ heading: false }),
      ...(allowInput ? [AnswerInputNode(1, true, coords, allowCoords)] : []),
      ...(allowDropzone ? [DropzoneNode(1, true, coords, allowCoords)] : []),
    ],
  });

  if (!editor) return <i>Hmmm... Nimadir xato ketdi!</i>;

  useEffect(() => {
    const handleUpdate = () => {
      onChange?.(editor.getHTML());
    };

    editor.on("update", handleUpdate);

    // Cleanup
    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor]);

  return (
    <div className={`${className}`}>
      <Toolbar
        editor={editor}
        notSticky={notSticky}
        allowInput={allowInput}
        allowImage={allowImage}
        allowDropzone={allowDropzone}
      />
      <EditorContent
        editor={editor}
        className={`${
          notSticky ? "rounded-b-xl" : "rounded-xl"
        } bg-gray-50 text-editor p-2.5`}
      />
    </div>
  );
};

const Toolbar = ({
  editor,
  notSticky,
  allowImage,
  allowInput,
  allowDropzone,
}) => {
  const [, forceUpdate] = useState({});
  const { openModal, data, updateModalData } = useModal("uploadImage");

  useEffect(() => {
    const image = data?.image;

    if (data?.editor && image) {
      let src = "";
      updateModalData({ image: null, editor: false });

      if (image.original.width <= image.sizes.large.width) {
        src = image.original.url;
      } else {
        src = image.sizes.large.url;
      }

      editor.chain().focus().setImage({ src }).run();
      src = "";
    }
  }, [data?.image]);

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
    <div
      className={`${
        notSticky
          ? "rounded-t-xl border-b"
          : "sticky top-0 z-10 mb-3 rounded-b-xl"
      } flex items-center gap-3.5 p-2.5 bg-gray-100`}
    >
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

      {/* Image */}
      {allowImage && (
        <ToolbarButton
          title="Insert Image"
          onClick={() => openModal({ editor: true })}
        >
          <ImagePlus size={16} />
        </ToolbarButton>
      )}

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Table */}
      <ToolbarButton
        title="Insert Table"
        onClick={() =>
          editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()
        }
      >
        <TableIcon size={16} />
      </ToolbarButton>

      {/* Add Row */}
      <ToolbarButton
        title="Add Row After"
        disabled={!editor.can().addRowAfter()}
        onClick={() => editor.chain().focus().addRowAfter().run()}
      >
        <Rows size={16} />
      </ToolbarButton>

      {/* Add Column */}
      <ToolbarButton
        title="Add Column After"
        disabled={!editor.can().addColumnAfter()}
        onClick={() => editor.chain().focus().addColumnAfter().run()}
      >
        <Columns size={16} />
      </ToolbarButton>

      {/* Merge or Split */}
      <ToolbarButton
        title="Merge or Split"
        disabled={!editor.can().mergeOrSplit()}
        onClick={() => editor.chain().focus().mergeOrSplit().run()}
      >
        <Brackets size={16} />
      </ToolbarButton>

      {/* Delete Row */}
      <ToolbarButton
        title="Delete Row"
        disabled={!editor.can().deleteRow()}
        onClick={() => editor.chain().focus().deleteRow().run()}
      >
        <BetweenHorizonalStart size={16} />
      </ToolbarButton>

      <ToolbarButton
        title="Delete Column"
        disabled={!editor.can().deleteColumn()}
        onClick={() => editor.chain().focus().deleteColumn().run()}
      >
        <BetweenVerticalEnd size={16} />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Undo */}
      <ToolbarButton
        title="Undo (Ctrl + Z)"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <Undo size={16} />
      </ToolbarButton>

      {/* Redo */}
      <ToolbarButton
        title="Redo  (Ctrl + Shift + Z)"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <Redo size={16} />
      </ToolbarButton>

      {/* Custom input element */}
      {allowInput && (
        <button
          title="Insert answer input"
          className="ml-auto px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          onClick={() =>
            editor.chain().focus().insertContent({ type: "answer-input" }).run()
          }
        >
          Insert Input
        </button>
      )}

      {/* Custom dropzone element */}
      {allowDropzone && (
        <button
          title="Insert Dropzone"
          className="ml-auto px-3 py-1 bg-violet-500 text-white rounded text-sm hover:bg-violet-600"
          onClick={() =>
            editor.chain().focus().insertContent({ type: "dropzone" }).run()
          }
        >
          Insert Dropzone
        </button>
      )}
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
