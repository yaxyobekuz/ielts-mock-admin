import { useNavigate, useParams } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";

// Icons
import { Trash } from "lucide-react";

// Lodash
import debounce from "lodash/debounce";

// Hooks
import useModule from "../../hooks/useModule";

// Components
import EditorHeader from "../../components/EditorHeader";
import RichTextEditor from "../../components/RichTextEditor";

// Helpers
import { isNumber, countExactMatches } from "../../lib/helpers";

const TextDraggableEditor = () => {
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
  const isInvalidSectionType = !(section?.type === "text-draggable");
  const isInvalidData = !isNumber(partNumber) || !isNumber(sectionIndex);

  // If invalid data
  if (isInvalidData || isInvalidSectionType || isInvalidModule) {
    return <ErrorContent />;
  }

  // State
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState(section?.text);
  const [title, setTitle] = useState(section?.options?.title);
  const [originalContent, setOriginalContent] = useState(section?.text);
  const [description, setDescription] = useState(section?.description || "");
  const [answers, setAnswers] = useState(
    section?.options?.data?.map((a) => a?.option) || [""]
  );

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
    const target = `<div data-name="dropzone"></div>`;
    const totalInputs = countExactMatches(content, target);

    // Update section data from store
    const sectionData = {
      description,
      text: content,
      questionsCount: totalInputs,
      options: { title, data: answers.map((a) => ({ option: a })) },
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
      <EditorHeader
        isSaving={isSaving}
        description={description}
        setDescription={setDescription}
        handleNavigate={handleNavigate}
        originalContent={originalContent}
        hasContentChanged={hasContentChanged}
        handleSaveContent={handleSaveContent}
        title="Matnni tahrirlash (Suriluvchi javob)"
      />

      {/* Editor */}
      <div className="container">
        <div className="flex gap-3.5 w-full pb-5">
          <RichTextEditor
            allowDropzone
            initialContent={content}
            onChange={handleContentChange}
            className="shrink-0 w-2/3 h-full"
            onChangeStart={handleContentChangeStart}
          />
          <Answers
            title={title}
            onChange={setAnswers}
            onTitleChange={setTitle}
            initialAnwsers={answers}
          />
        </div>
      </div>
    </>
  );
};

const Answers = ({ onChange, initialAnwsers, onTitleChange, title }) => {
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
      <h2 className="mb-3 text-lg font-bold">Variantlar</h2>

      {/* Title */}
      <div className="mb-5">
        <label htmlFor="options-title" className="inline-block mb-1">
          Sarlavha
        </label>

        <input
          type="text"
          value={title}
          id="options-title"
          name="options-title"
          placeholder="Sarlavhani kiriting"
          className="w-full h-9 border rounded-md px-2"
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>

      {/* Options */}
      <div className="mb-3 space-y-2">
        {inputs.map((value, index) => (
          <div key={index}>
            <div className="flex items-center justify-between">
              <label htmlFor={`answer-${index}`} className="inline-block mb-1">
                Variant {index + 1}
              </label>

              {/* Delete btn */}
              <button
                onClick={() => handleDeleteInput(index)}
                className="flex items-center justify-center size-6"
              >
                <Trash color="red" size={16} />
              </button>
            </div>

            <input
              type="text"
              value={value}
              id={`answer-${index}`}
              placeholder={`Variant ${index + 1}`}
              className="w-full h-9 border rounded-md px-2"
              onChange={(e) => handleInputChange(e, index)}
            />
          </div>
        ))}
      </div>

      {/* Add new option */}
      <button
        onClick={handleAddInput}
        className="flex items-center justify-center w-full h-9 bg-blue-100 text-blue-500 rounded-md"
      >
        Variant qo'shish +
      </button>
    </div>
  );
};

const ErrorContent = () => <i>Hmmm... Nimadir noto'g'ri ketdi!</i>;

export default TextDraggableEditor;
