import { useState, useRef, useCallback, useEffect } from "react";

// Components
import Icon from "../../components/Icon";

// Helpers
import { convertToHtml } from "../../lib/helpers";

// Icons
import undoIcon from "../../assets/icons/undo.svg";
import redoIcon from "../../assets/icons/redo.svg";
import boldIcon from "../../assets/icons/bold.svg";
import listIcon from "../../assets/icons/list.svg";
import codeIcon from "../../assets/icons/code.svg";
import trashIcon from "../../assets/icons/trash.svg";
import italicIcon from "../../assets/icons/italic.svg";
import squareIcon from "../../assets/icons/square.svg";
import underlineIcon from "../../assets/icons/underline.svg";

const initialContent = `Start typing your *bold text*, _italic text_, |underlined text|, or create lists:\n\n- First item\n- Second item\n- Third item\n\nUse ^ for special inputs \n\nTry the formatting buttons or keyboard shortcuts!`;

const TextEditor = () => {
  const textareaRef = useRef(null);
  const containerRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [content, setContent] = useState(initialContent);

  // Initialize history
  useEffect(() => {
    if (history.length === 0) {
      setHistory([content]);
      setHistoryIndex(0);
    }
  }, []);

  // Add to history for undo/redo
  const addToHistory = useCallback(
    (newContent) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newContent);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [history, historyIndex]
  );

  // Undo functionality
  const undo = useCallback(() => {
    if (historyIndex === 0) return;

    const prevIndex = historyIndex - 1;
    setHistoryIndex(prevIndex);
    setContent(history[prevIndex]);
  }, [history, historyIndex]);

  // Redo functionality
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setContent(history[nextIndex]);
    }
  }, [history, historyIndex]);

  // Handle content changes
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Add to history after a short delay to avoid too many history entries
    const timeoutId = setTimeout(() => addToHistory(newContent), 500);

    return () => clearTimeout(timeoutId);
  };

  // Get selected text and cursor position
  const getSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return { start: 0, end: 0, selectedText: "" };

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    return { start, end, selectedText };
  };

  // Apply formatting to selected text
  const applyFormatting = (startSymbol, endSymbol = null) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { start, end, selectedText } = getSelection();
    const endSymbolToUse = endSymbol || startSymbol;

    let newContent;
    let newCursorPos;

    if (selectedText) {
      // Wrap selected text
      const before = content.substring(0, start);
      const after = content.substring(end);
      newContent = before + startSymbol + selectedText + endSymbolToUse + after;
      newCursorPos = end + startSymbol.length + endSymbolToUse.length;
    } else {
      // Insert symbols and place cursor between them
      const before = content.substring(0, start);
      const after = content.substring(start);
      newContent = before + startSymbol + endSymbolToUse + after;
      newCursorPos = start + startSymbol.length;
    }

    setContent(newContent);
    addToHistory(newContent);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Insert special input
  const insertSymbol = (symbol) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { start } = getSelection();
    const after = content.substring(start);
    const before = content.substring(0, start);
    const newContent = before + symbol + after;

    setContent(newContent);
    addToHistory(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 1, start + 1);
    }, 0);
  };

  // Insert list item
  const insertListItem = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { start } = getSelection();
    const before = content.substring(0, start);
    const after = content.substring(start);

    // Check if we're at the beginning of a line
    const lineStart = before.lastIndexOf("\n") + 1;
    const currentLine = before.substring(lineStart);
    const isStartOfLine = currentLine.trim() === "";

    const listItem = isStartOfLine ? "- " : "\n- ";
    const newContent = before + listItem + after;

    setContent(newContent);
    addToHistory(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + listItem.length,
        start + listItem.length
      );
    }, 0);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (!e.ctrlKey && !e.metaKey) return;

    switch (e.key) {
      case "b":
        e.preventDefault();
        applyFormatting("*");
        break;
      case "i":
        e.preventDefault();
        applyFormatting("_");
        break;
      case "u":
        e.preventDefault();
        applyFormatting("|");
        break;
      case "z":
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        break;
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <Header
        undo={undo}
        redo={redo}
        history={history}
        insertSymbol={insertSymbol}
        historyIndex={historyIndex}
        insertListItem={insertListItem}
        applyFormatting={applyFormatting}
      />

      {/* Main Content */}
      <div ref={containerRef} className="grid grid-cols-2 h-full">
        {/* Editor Panel */}
        <div className="bg-white border-r border-gray-300 flex flex-col">
          <div className="sticky top-0 inset-x-0 bg-gray-50 border-b border-gray-300 px-4 py-1.5">
            <h2 className="text-sm font-medium text-gray-600">Editor</h2>
          </div>

          <textarea
            value={content}
            ref={textareaRef}
            spellCheck={false}
            onKeyDown={handleKeyDown}
            onChange={handleContentChange}
            placeholder="Start typing your markdown here..."
            className="flex-1 p-4 resize-none outline-none font-mono text-sm leading-relaxed"
          />
        </div>

        {/* Preview Panel */}
        <PreviewPanel content={content} />
      </div>
    </div>
  );
};

const Header = ({
  undo,
  redo,
  history,
  insertSymbol,
  historyIndex,
  onSaveChanges,
  insertListItem,
  applyFormatting,
}) => {
  return (
    <div className="sticky top-0 inset-x-0 bg-white border-b border-gray-300 p-4">
      <h1 className="text-xl font-bold text-gray-800 mb-3">Text editor</h1>

      <div className="flex gap-5 justify-between">
        {/* Toolbar */}
        <div className="flex gap-2">
          {/* Bold */}
          <button
            title="Bold (Ctrl+B)"
            onClick={() => applyFormatting("*")}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition-colors"
          >
            <Icon src={boldIcon} size={20} className="size-5" alt="Bold icon" />
          </button>

          {/* Italic */}
          <button
            title="Italic (Ctrl+I)"
            onClick={() => applyFormatting("_")}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition-colors"
          >
            <Icon
              size={20}
              src={italicIcon}
              className="size-5"
              alt="Italic icon"
            />
          </button>

          {/* Underline */}
          <button
            title="Underline (Ctrl+U)"
            onClick={() => applyFormatting("|")}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition-colors"
          >
            <Icon
              size={20}
              className="size-5"
              src={underlineIcon}
              alt="Underline icon"
            />
          </button>

          {/* List */}
          <button
            title="List Item"
            onClick={insertListItem}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition-colors"
          >
            <Icon src={listIcon} size={20} className="size-5" alt="List icon" />
          </button>

          {/* Input */}
          <button
            title="Input Field"
            onClick={() => insertSymbol("^")}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition-colors"
          >
            <Icon
              src={codeIcon}
              size={20}
              className="size-5"
              alt="Input icon"
            />
          </button>

          {/* Dropzone */}
          <button
            title="Answer Dropzone"
            onClick={() => insertSymbol("~")}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition-colors"
          >
            <Icon
              size={20}
              src={squareIcon}
              alt="Square icon"
              className="size-5"
            />
          </button>

          <div className="w-px bg-gray-300 mx-2"></div>

          {/* Undo */}
          <button
            onClick={undo}
            title="Undo (Ctrl+Z)"
            disabled={historyIndex <= 0}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 disabled:opacity-50 rounded transition-colors"
          >
            <Icon src={undoIcon} size={20} className="size-5" alt="Undo icon" />
          </button>

          {/* Redo */}
          <button
            onClick={redo}
            title="Redo (Ctrl+Shift+Z)"
            disabled={historyIndex >= history.length - 1}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 disabled:opacity-50 rounded transition-colors"
          >
            <Icon src={redoIcon} size={20} className="size-5" alt="Redo icon" />
          </button>
        </div>

        {/* Actions button */}
        <div className="flex gap-5">
          <button
            title="Ctrl+S"
            onClick={onSaveChanges}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 rounded text-sm font-medium text-white"
          >
            O'zgarishlarni saqlash
          </button>
        </div>
      </div>
    </div>
  );
};

const PreviewPanel = ({ content }) => {
  return (
    <div className="w-full bg-white flex flex-col">
      <div className="bg-gray-50 border-b border-gray-300 px-4 py-1.5">
        <h2 className="text-sm font-medium text-gray-600">Preview</h2>
      </div>

      <pre
        className="p-4 overflow-auto max-w-none"
        dangerouslySetInnerHTML={{ __html: convertToHtml(content, 1, true) }}
      />
    </div>
  );
};

export default TextEditor;
