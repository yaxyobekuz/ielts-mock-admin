// Icons
import { Trash } from "lucide-react";

// Helpers
import { isNumber } from "../../lib/helpers";

// Toast
import { toast } from "@/notification/toast";

// Api
import { sectionsApi } from "@/api/sections.api";

// React
import { useState, useCallback, useEffect } from "react";

// Components
import EditorHeader from "@/components/EditorHeader";
import RichTextEditor from "@/components/RichTextEditor";

// Hooks
import useStore from "@/hooks/useStore";
import useModule from "@/hooks/useModule";
import usePathSegments from "@/hooks/usePathSegments";
import useDebouncedState from "@/hooks/useDebouncedState";

// Router
import { useNavigate, useParams } from "react-router-dom";

const TextDraggableEditor = () => {
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
  const isInvalidSectionType = !(section?.type === "text-draggable");
  const isInvalidData = !isNumber(partNumber) || !isNumber(sectionIndex);

  // Check if data is invalid
  if (isInvalidData || isInvalidSectionType || isInvalidModule) {
    return <ErrorContent />;
  }

  // State
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateProperty, getProperty } = useStore("coords");
  const [content, setContent] = useDebouncedState(section?.text, setIsSaving);
  const coordsKey = `${pathSegments[1]}-${pathSegments[3]}-${pathSegments[4]}-${pathSegments[5]}-${pathSegments[6]}`;
  const allCoords = getProperty(coordsKey) || section?.coords || {};
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
    coords: allCoords,
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
    JSON.stringify(answers) !== JSON.stringify(original.answers) ||
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

    const sectionData = {
      coords,
      description,
      text: content,
      options: { title, data: answers.map((a) => ({ option: a })) },
    };

    sectionsApi
      .update(section._id, sectionData)
      .then(({ code, section }) => {
        if (code !== "sectionUpdated") throw new Error();

        handleNavigate();
        setIsSaving(false);
        updateProperty(coordsKey, null);
        updateSection(partNumber, section, sectionIndex);
        setOriginal({ content, title, description, answers });
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
            allowImage
            allowDropzone
            coords={allCoords}
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
    </div>
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
