import { useNavigate, useParams } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";

// Icons
import { Trash } from "lucide-react";

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
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState(section?.text);
  const [answers, setAnswers] = useState(section?.answers || [""]);
  const [originalContent, setOriginalContent] = useState(section?.text);
  const [description, setDescription] = useState(section?.description || "");

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
    const sectionData = {
      answers,
      description,
      text: content,
      questionsCount: totalInputs,
    };

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
        <div className="flex items-center justify-between gap-5 container">
          <div className="w-2/3 pt-[5px]">
            {/* Title */}
            <div className="flex items-center justify-between gap-5">
              <h1 className="mb-0.5 text-xl font-semibold">Text editor</h1>

              {/* Loader */}
              <Loader
                isSaving={isSaving}
                originalContent={originalContent}
                hasContentChanged={hasContentChanged}
              />
            </div>
            {/* Description input */}
            <input
              type="text"
              value={description}
              name="description-input"
              placeholder="Bo'lim tavsifi"
              onChange={(e) => setDescription(e.target.value)}
              className="max-w-full min-w-40 w-full h-8 bg-gray-100 rounded-t-xl px-2 outline-none"
            />
          </div>

          <div className="flex gap-5 items-center max-w-max shrink-0">
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
            allowInput
            initialContent={content}
            onChange={handleContentChange}
            className="shrink-0 w-2/3 h-full"
            onChangeStart={handleContentChangeStart}
          />
          <Answers onChange={setAnswers} initialAnwsers={answers} />
        </div>
      </div>
    </>
  );
};

const Answers = ({ onChange, initialAnwsers }) => {
  const [inputs, setInputs] = useState(initialAnwsers);

  const handleAddInput = useCallback(() => {
    setInputs((prev) => (prev.length < 50 ? [...prev, ""] : prev));
  }, []);

  const handleDeleteInput = useCallback((index) => {
    setInputs((prev) => prev.filter((_, i) => i !== index));
  }, []);

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

  return (
    <div className="sticky top-0 overflow-y-auto w-full max-h-[calc(100vh-20px)] bg-gray-50 p-2.5 rounded-b-xl">
      <h2 className="mb-3 text-lg font-bold">Javoblar</h2>

      {/* Answers */}
      <div className="space-y-2">
        {inputs.map((value, index) => (
          <div key={index}>
            <div className="flex items-center justify-between">
              <label htmlFor={`answer-${index}`} className="inline-block mb-1">
                Javob {index + 1}
              </label>

              {/* Delete btn */}
              <button
                onClick={() => handleDeleteInput(index)}
                className="flex items-center justify-center size-6"
              >
                <Trash color="red" size={16} />
              </button>
            </div>

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

        {/* Add new field */}
        <button
          onClick={handleAddInput}
          className="flex items-center justify-center w-full h-9 bg-blue-100 text-blue-500 rounded-md"
        >
          Javob qo'shish +
        </button>
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
