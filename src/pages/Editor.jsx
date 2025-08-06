import { useState, useRef, useCallback, useEffect } from "react";
import { convertToHtml } from "../lib/helpers";

const Editor = () => {
  const [content, setContent] = useState(
    "# Welcome to Markdown Editor\n\nStart typing your *bold text*, _italic text_, |underlined text|, or create lists:\n\n- First item\n- Second item\n- Third item\n\nUse ^ for special inputs: ^ \n\nTry the formatting buttons or keyboard shortcuts!"
  );
  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

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
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setContent(history[prevIndex]);
    }
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
    const timeoutId = setTimeout(() => {
      addToHistory(newContent);
    }, 500);

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
  const insertInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { start } = getSelection();
    const before = content.substring(0, start);
    const after = content.substring(start);
    const newContent = before + "^" + after;

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
    if (e.ctrlKey || e.metaKey) {
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
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
          break;
        default:
          break;
      }
    }
  };

  // Handle mouse events for resizing
  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const newLeftWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Limit the width between 20% and 80%
      const clampedWidth = Math.max(20, Math.min(80, newLeftWidth));
      setLeftWidth(clampedWidth);
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 p-4">
        <h1 className="text-xl font-bold text-gray-800 mb-3">
          Question Editor
        </h1>

        {/* Toolbar */}
        <div className="flex gap-2">
          <button
            onClick={() => applyFormatting("*")}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium transition-colors"
            title="Bold (Ctrl+B)"
          >
            Bold
          </button>

          <button
            title="Italic (Ctrl+I)"
            onClick={() => applyFormatting("_")}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium transition-colors"
          >
            Italic
          </button>

          <button
            onClick={() => applyFormatting("|")}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium transition-colors"
            title="Underline (Ctrl+U)"
          >
            Underline
          </button>

          <button
            onClick={insertListItem}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium transition-colors"
            title="List Item"
          >
            List
          </button>

          <button
            onClick={insertInput}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium transition-colors"
            title="Input Field"
          >
            Input
          </button>

          <div className="w-px bg-gray-300 mx-2"></div>

          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 rounded text-sm font-medium transition-colors"
            title="Undo (Ctrl+Z)"
          >
            Undo
          </button>

          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 rounded text-sm font-medium transition-colors"
            title="Redo (Ctrl+Shift+Z)"
          >
            Redo
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div ref={containerRef} className="flex-1 flex relative">
        {/* Editor Panel */}
        <div
          className="bg-white border-r border-gray-300 flex flex-col"
          style={{ width: `${leftWidth}%` }}
        >
          <div className="bg-gray-50 border-b border-gray-300 px-4 py-2">
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

        {/* Resizable Divider */}
        <div
          onMouseDown={handleMouseDown}
          className="w-1 bg-gray-300 hover:bg-gray-400 cursor-col-resize relative group"
        >
          <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 group-hover:bg-blue-500 transition-colors" />
        </div>

        {/* Preview Panel */}
        <div
          className="bg-white flex flex-col"
          style={{ width: `${100 - leftWidth}%` }}
        >
          <div className="bg-gray-50 border-b border-gray-300 px-4 py-2">
            <h2 className="text-sm font-medium text-gray-600">Preview</h2>
          </div>

          <pre
            dangerouslySetInnerHTML={{ __html: convertToHtml(content) }}
            className="flex-1 font-[inherit] p-4 overflow-auto prose prose-sm max-w-none"
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
