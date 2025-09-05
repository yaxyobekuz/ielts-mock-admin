// Icons
import { Trash } from "lucide-react";

// Toast
import { toast } from "@/notification/toast";

// Helpers
import { isNumber } from "../../lib/helpers";

// Api
import { sectionsApi } from "@/api/sections.api";

// React
import { useState, useCallback, useEffect } from "react";

// Router
import { useNavigate, useParams } from "react-router-dom";

// Components
import EditorHeader from "../../components/EditorHeader";
import RichTextEditor from "../../components/RichTextEditor";

// Hooks
import useModule from "../../hooks/useModule";
import useDebouncedState from "../../hooks/useDebouncedState";

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
  const [isUpdating, setIsUpdating] = useState(false);
  const [content, setContent] = useDebouncedState(section?.text, setIsSaving);
  const [description, setDescription] = useDebouncedState(
    section?.description || "",
    setIsSaving
  );
  const [answers, setAnswers] = useDebouncedState(
    section?.answers || [""],
    setIsSaving
  );

  // Original
  const [original, setOriginal] = useState({
    content: section?.text,
    description: section?.description || "",
    answers: JSON.stringify(section?.answers || [""]),
  });

  // Check if content has changed
  const hasContentChanged =
    content !== original.content ||
    description !== original.description ||
    JSON.stringify(answers) !== original.answers;

  const handleNavigate = () => {
    const path = `/tests/test/${testId}/preview/${module}/${partNumber}#s-${sectionIndex}`;
    navigate(path);
  };

  const handleSaveContent = () => {
    if (isUpdating) return;
    setIsUpdating(true);

    // Update section data from store
    const sectionData = { answers, description, text: content };

    sectionsApi
      .update(section._id, sectionData)
      .then(({ code, section }) => {
        if (code !== "sectionUpdated") throw new Error();
        handleNavigate();
        setIsSaving(false);
        setOriginal({ content, description, answers });
        updateSection(partNumber, section, sectionIndex);
      })
      .catch(({ message }) => toast.error(message || "Nimadir xato ketdi"))
      .finally(() => setIsUpdating(false));
  };

  return (
    <>
      {/* Header */}
      <EditorHeader
        isSaving={isSaving}
        isUpdating={isUpdating}
        title="Matnni tahrirlash"
        handleNavigate={handleNavigate}
        initialDescription={description}
        originalContent={original.content}
        onDescriptionChange={setDescription}
        hasContentChanged={hasContentChanged}
        handleSaveContent={handleSaveContent}
      />

      {/* Editor */}
      <div className="container">
        <div className="flex gap-3.5 w-full pb-5">
          <RichTextEditor
            allowInput
            onChange={setContent}
            initialContent={content}
            className="shrink-0 w-2/3 h-full"
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
  }, [JSON.stringify(inputs)]);

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

const ErrorContent = () => <i>Hmmm... Nimadir noto'g'ri ketdi!</i>;

export default TextEditor;
