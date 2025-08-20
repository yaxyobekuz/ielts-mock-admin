import { useNavigate, useParams } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";

// Icons
import { Trash } from "lucide-react";

// Components
import EditorHeader from "../../components/EditorHeader";
import RichTextEditor from "../../components/RichTextEditor";

// Hooks
import useModule from "../../hooks/useModule";
import useDebouncedState from "../../hooks/useDebouncedState";

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

  // Check if data is invalid
  if (isInvalidData || isInvalidSectionType || isInvalidModule) {
    return <ErrorContent />;
  }

  // State
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useDebouncedState(section?.text, setIsSaving);
  const [title, setTitle] = useDebouncedState(
    section?.options?.title,
    setIsSaving
  );
  const [description, setDescription] = useDebouncedState(
    section?.description || "",
    setIsSaving
  );
  const [answers, setAnswers] = useDebouncedState(
    section?.options?.data?.map((a) => a?.option) || [""],
    setIsSaving
  );

  // Original
  const [original, setOriginal] = useState({
    content: section?.text,
    title: section?.options?.title,
    description: section?.description || "",
    answers: section?.options?.data?.map((a) => a?.option) || [""],
  });

  // Check if content has changed
  const hasContentChanged =
    title !== original.title ||
    content !== original.content ||
    description !== original.description ||
    String(answers) !== String(original.answers);

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

    handleNavigate(); // Navigate user to preview page
    setIsSaving(false); // Remove saving loader
    updateSection(partNumber, sectionData, sectionIndex);

    // Update original content to match current content
    setOriginal({ content, title, description, answers });
  };

  return (
    <>
      {/* Header */}
      <EditorHeader
        isSaving={isSaving}
        handleNavigate={handleNavigate}
        initialDescription={description}
        originalContent={original.content}
        onDescriptionChange={setDescription}
        hasContentChanged={hasContentChanged}
        handleSaveContent={handleSaveContent}
        title="Matnni tahrirlash (Suriluvchi javob)"
      />

      {/* Editor */}
      <div className="container">
        <div className="flex gap-3.5 w-full pb-5">
          <RichTextEditor
            allowDropzone
            onChange={setContent}
            initialContent={content}
            className="shrink-0 w-2/3 h-full"
          />
          <Answers
            initialTitle={title}
            onChange={setAnswers}
            onTitleChange={setTitle}
            initialAnwsers={answers}
          />
        </div>
      </div>
    </>
  );
};

const Answers = ({ onChange, initialAnwsers, onTitleChange, initialTitle }) => {
  const [title, setTitle] = useState(initialTitle);
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

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    onTitleChange?.(e.target.value);
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
          onChange={handleTitleChange}
          placeholder="Sarlavhani kiriting"
          className="w-full h-9 border rounded-md px-2"
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
