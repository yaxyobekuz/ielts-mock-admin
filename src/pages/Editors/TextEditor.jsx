import { json, useNavigate, useParams } from "react-router-dom";
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

    handleNavigate(); // Navigate user to preview page
    setIsSaving(false); // Stop saving loader
    setOriginal({ content, description, answers }); // Update original values
    updateSection(partNumber, sectionData, sectionIndex); // Update section data from store
  };

  return (
    <>
      {/* Header */}
      <EditorHeader
        isSaving={isSaving}
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
