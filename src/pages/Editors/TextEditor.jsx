// Icons
import { Trash } from "lucide-react";

// Helpers
import { isNumber } from "@/lib/helpers";

// Toast
import { toast } from "@/notification/toast";

// Api
import { sectionsApi } from "@/api/sections.api";

// React
import { useState, useCallback, useEffect } from "react";

// Components
import EditorHeader from "@/components/EditorHeader";
import RichTextEditor from "@/components/RichTextEditor";

// Router
import { useNavigate, useParams } from "react-router-dom";

// Hooks
import useObjectStore from "@/hooks/useObjectStore";
import useModule from "@/hooks/useModule";
import usePathSegments from "@/hooks/usePathSegments";
import useDebouncedState from "@/hooks/useDebouncedState";

const TextEditor = () => {
  // State & Hooks
  const { pathSegments } = usePathSegments();
  const modules = ["listening", "reading", "writing"];
  const { testId, partNumber, module, sectionIndex } = useParams();
  const { getModuleData, updateSection } = useModule(module, testId);
  const { parts } = getModuleData() || {};

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
  const { updateEntity, getEntity } = useObjectStore("coords");
  const [content, setContent] = useDebouncedState(section?.text, setIsSaving);
  const coordsKey = `${pathSegments[1]}-${pathSegments[3]}-${pathSegments[4]}-${pathSegments[5]}-${pathSegments[6]}`;
  const allCoords = getEntity(coordsKey) || section?.coords || {};
  const [description, setDescription] = useDebouncedState(
    section?.description || "",
    setIsSaving
  );
  const [answers, setAnswers] = useDebouncedState(
    section?.answers || [{ text: "" }],
    setIsSaving
  );

  // Original
  const [original, setOriginal] = useState({
    coords: allCoords,
    content: section?.text,
    description: section?.description || "",
    answers: JSON.stringify(section?.answers || [""]),
  });

  // Check if content has changed
  const hasContentChanged =
    content !== original.content ||
    description !== original.description ||
    JSON.stringify(answers) !== original.answers ||
    JSON.stringify(allCoords) !== JSON.stringify(original.coords);

  const handleNavigate = () => {
    const path = `/tests/${testId}/preview/${module}/${partNumber}#s-${sectionIndex}`;
    navigate(path);
  };

  const handleSaveContent = () => {
    if (isUpdating) return;
    setIsUpdating(true);

    let coords = {};
    Object.keys(allCoords || {}).forEach((key) => {
      const value = allCoords[key];
      if (value) coords[key] = value;
    });

    // Update section data from store
    const sectionData = {
      coords,
      description,
      text: content,
      answers: answers.filter(Boolean),
    };

    sectionsApi
      .update(section._id, sectionData)
      .then(({ code, section }) => {
        if (code !== "sectionUpdated") throw new Error();
        handleNavigate();
        setIsSaving(false);
        updateEntity(coordsKey, null);
        setOriginal({ content, description, answers });
        updateSection(partNumber, section, sectionIndex);
      })
      .catch(({ message }) => toast.error(message || "Nimadir xato ketdi"))
      .finally(() => setIsUpdating(false));
  };

  return (
    <div className="editor-page">
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
            coords={allCoords}
            onChange={setContent}
            initialContent={content}
            className="shrink-0 w-2/3 h-full editor-content-wrapper"
          />

          <Answers onChange={setAnswers} initialAnwsers={answers} />
        </div>
      </div>
    </div>
  );
};

const Answers = ({ onChange, initialAnwsers }) => {
  const [inputs, setInputs] = useState(initialAnwsers?.map(({ text }) => text));

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
    onChange?.(inputs?.map((text) => ({ text })));
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
