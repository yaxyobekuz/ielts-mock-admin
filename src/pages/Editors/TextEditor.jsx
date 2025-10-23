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
import useModule from "@/hooks/useModule";
import useObjectStore from "@/hooks/useObjectStore";
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
  
  // Initialize textAnswers with backward compatibility
  const initialTextAnswers = section?.textAnswers || 
    section?.answers?.map(({ text }) => [text]) || 
    [[""]];
  
  const [textAnswers, setTextAnswers] = useDebouncedState(
    initialTextAnswers,
    setIsSaving
  );

  // Original
  const [original, setOriginal] = useState({
    coords: allCoords,
    content: section?.text,
    description: section?.description || "",
    textAnswers: JSON.stringify(initialTextAnswers),
  });

  // Check if content has changed
  const hasContentChanged =
    content !== original.content ||
    description !== original.description ||
    JSON.stringify(textAnswers) !== original.textAnswers ||
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
      textAnswers: textAnswers.filter(variants => variants.some(v => v)),
    };

    sectionsApi
      .update(section._id, sectionData)
      .then(({ code, section }) => {
        if (code !== "sectionUpdated") throw new Error();
        handleNavigate();
        setIsSaving(false);
        updateEntity(coordsKey, null);
        setOriginal({ content, description, textAnswers: JSON.stringify(textAnswers) });
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

          <Answers onChange={setTextAnswers} initialTextAnswers={textAnswers} />
        </div>
      </div>
    </div>
  );
};

const Answers = ({ onChange, initialTextAnswers }) => {
  const [answers, setAnswers] = useState(initialTextAnswers || [[""]]);

  const handleAddAnswer = useCallback(() => {
    setAnswers((prev) => (prev.length < 50 ? [...prev, [""]] : prev));
  }, []);

  const handleDeleteAnswer = useCallback((answerIndex) => {
    setAnswers((prev) => prev.filter((_, i) => i !== answerIndex));
  }, []);

  const handleAddVariant = useCallback((answerIndex) => {
    setAnswers((prev) =>
      prev.map((variants, i) =>
        i === answerIndex && variants.length < 10
          ? [...variants, ""]
          : variants
      )
    );
  }, []);

  const handleDeleteVariant = useCallback((answerIndex, variantIndex) => {
    setAnswers((prev) =>
      prev.map((variants, i) =>
        i === answerIndex
          ? variants.filter((_, j) => j !== variantIndex)
          : variants
      )
    );
  }, []);

  const handleVariantChange = (e, answerIndex, variantIndex) => {
    setAnswers((prev) =>
      prev.map((variants, i) =>
        i === answerIndex
          ? variants.map((v, j) => (j === variantIndex ? e.target.value : v))
          : variants
      )
    );
  };

  useEffect(() => {
    onChange?.(answers);
  }, [JSON.stringify(answers)]);

  return (
    <div className="sticky top-0 overflow-y-auto w-full max-h-[calc(100vh-20px)] bg-gray-50 p-2.5 rounded-b-xl">
      <h2 className="mb-3 text-lg font-bold">Javoblar</h2>

      {/* Answers */}
      <div className="space-y-4">
        {answers.map((variants, answerIndex) => (
          <div key={answerIndex} className="p-3 bg-white rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold">Javob {answerIndex + 1}</label>
              <button
                onClick={() => handleDeleteAnswer(answerIndex)}
                className="flex items-center justify-center size-6"
              >
                <Trash color="red" size={16} />
              </button>
            </div>

            {/* Variants */}
            <div className="space-y-2">
              {variants.map((variant, variantIndex) => (
                <div key={variantIndex} className="flex gap-2 items-start">
                  <textarea
                    type="text"
                    value={variant}
                    style={{ height: "56px" }}
                    placeholder={`Variant ${variantIndex + 1}`}
                    onChange={(e) =>
                      handleVariantChange(e, answerIndex, variantIndex)
                    }
                    className="flex-1 border rounded-md p-2 min-h-12 max-h-40"
                  />
                  {variants.length > 1 && (
                    <button
                      onClick={() => handleDeleteVariant(answerIndex, variantIndex)}
                      className="flex items-center justify-center size-9 mt-1"
                    >
                      <Trash color="gray" size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add variant button */}
            <button
              onClick={() => handleAddVariant(answerIndex)}
              className="mt-2 w-full h-8 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
            >
              Variant qo'shish +
            </button>
          </div>
        ))}

        {/* Add new answer */}
        <button
          onClick={handleAddAnswer}
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
