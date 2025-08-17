import { useNavigate, useParams } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";

// Lodash
import debounce from "lodash/debounce";

// Hooks
import useModule from "../../hooks/useModule";

// Components
import RichTextEditor from "../../components/RichTextEditor";

// Helpers
import { isNumber, countExactMatches } from "../../lib/helpers";

const TextEditor = () => {
  // State & Hooks
  const modules = ["listening", "reading", "writing"];
  const { testId, partNumber, module, sectionIndex } = useParams();
  const { getModuleData, updateSection } = useModule(module, testId);
  const parts = getModuleData();

  // Data
  const part = parts?.find((p) => p.number === parseInt(partNumber));
  const section = part?.sections[sectionIndex];

  // Validators
  const isInvalidModule = !modules.includes(module);
  const isInvalidSectionType = !(section?.type === "text");
  const isInvalidData = !isNumber(partNumber) || !isNumber(sectionIndex);

  // If invalid data
  if (isInvalidData || isInvalidSectionType || isInvalidModule) {
    return <ErrorContent />;
  }

  // State
  const navigate = useNavigate();
  const [answers, setAnswers] = useState([]);
  const [content, setContent] = useState(section?.text);
  const [originalContent, setOriginalContent] = useState(section?.text);
  const [isSaving, setIsSaving] = useState(false);

  // Check if content has changed
  const hasContentChanged = content !== originalContent;

  // Content updated, no longer saving
  const handleContentChange = debounce((value) => {
    setContent(value);
    setIsSaving(false);
  }, 1000);

  // Track when user starts typing
  const handleContentChangeStart = () => {
    setIsSaving(true);
  };

  const handleNavigate = () => {
    const path = `/tests/test/${testId}/preview/${module}/${partNumber}#s-${sectionIndex}`;
    navigate(path);
  };

  const handleSaveContent = () => {
    // Count answer inputs
    const target = `<input type="text" data-name="answer-input">`;
    const totalInputs = countExactMatches(content, target);

    // Update section data from store
    const sectionData = { text: content, questionsCount: totalInputs, answers };
    updateSection(partNumber, sectionData, sectionIndex);

    // Update original content to match current content
    setOriginalContent(content);
    setIsSaving(false);

    // Navigate user to preview page
    handleNavigate();
  };

  return (
    <>
      {/* Header */}
      <header className="flex items-center h-[68px] border-b">
        <div className="flex items-center justify-between container">
          {/* Title */}
          <h1 className="text-xl font-semibold">Text editor</h1>

          <div className="flex gap-5 items-center">
            {/* Loader */}
            <div className="flex items-center">
              <Loader
                isSaving={isSaving}
                originalContent={originalContent}
                hasContentChanged={hasContentChanged}
              />
            </div>

            {/* Cancel btn */}
            <button
              onClick={handleNavigate}
              className="flex items-center justify-center w-24 h-9 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
            >
              Bekor qilish
            </button>

            {/* Save btn */}
            <button
              onClick={handleSaveContent}
              disabled={!hasContentChanged || isSaving}
              className="flex items-center justify-center w-24 h-9 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Saqlash
            </button>
          </div>
        </div>
      </header>

      {/* Editor */}
      <div className="container">
        <div className="flex gap-3.5 w-full pb-5">
          <RichTextEditor
            initialContent={content}
            onChange={handleContentChange}
            className="shrink-0 w-2/3 h-full"
            onChangeStart={handleContentChangeStart}
          />
          <Answers
            content={content}
            onChange={setAnswers}
            initialAnwsers={section?.answers || []}
          />
        </div>
      </div>
    </>
  );
};

const Answers = ({ content, onChange, initialAnwsers }) => {
  const [inputs, setInputs] = useState(initialAnwsers);

  const handleAddInput = useCallback(({ detail: index }) => {
    setInputs((prev) => {
      if (typeof index !== "number" || prev.length + 1 !== index) return prev;
      return [...prev, ""];
    });
  }, []);

  const handleDeleteInput = useCallback(({ detail: index }) => {
    if (typeof index !== "number") return;
    setInputs((prev) => prev.filter((_, i) => i !== index - 1));
  }, []);

  useEffect(() => {
    window.addEventListener("addAnswerInput", handleAddInput);
    window.addEventListener("deleteAnswerInput", handleDeleteInput);

    return () => {
      window.removeEventListener("addAnswerInput", handleAddInput);
      window.removeEventListener("deleteAnswerInput", handleDeleteInput);
    };
  }, [handleAddInput, handleDeleteInput]);

  const handleInputChange = (e, index) => {
    setInputs((prev) => {
      return prev.map((val, i) => {
        return i === index ? e.target.value : val;
      });
    });
  };

  useEffect(() => {
    onChange?.(inputs);
  }, [String(inputs)]);

  useEffect(() => {
    const target = `<input type="text" data-name="answer-input">`;
    const totalInputs = countExactMatches(content, target);

    if (totalInputs !== inputs?.length) {
      setInputs((prev) => prev?.slice(0, totalInputs || 0));
    }
  }, [content]);

  return (
    <div className="sticky top-0 overflow-y-auto w-full max-h-[calc(100vh-20px)] bg-gray-50 p-2.5 rounded-b-xl">
      <h2 className="mb-3 text-lg font-bold">Javoblar</h2>

      {/* Answers */}
      <div className="space-y-2">
        {inputs.map((value, index) => (
          <div key={index}>
            <label htmlFor={`answer-${index}`} className="inline-block mb-1">
              Javob {index + 1}
            </label>

            <textarea
              type="text"
              value={value}
              id={`answer-${index}`}
              style={{ height: "56px" }}
              placeholder={`Javob ${index + 1}`}
              onChange={(e) => handleInputChange(e, index)}
              className="w-full border rounded-md p-2 min-h-12 max-h-40"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const Loader = ({ isSaving, hasContentChanged, originalContent }) => {
  if (isSaving) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-sm text-gray-500">Saqlanmoqda...</span>
      </div>
    );
  }

  if (hasContentChanged) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <span className="text-sm text-green-500">Saqlashga tayyor</span>
      </div>
    );
  }

  if (originalContent) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full" />
        <span className="text-sm text-blue-500">O'zgarishlar yo'q</span>
      </div>
    );
  }
};

const ErrorContent = () => <i>Hmmm... Nimadir noto'g'ri ketdi!</i>;

export default TextEditor;
