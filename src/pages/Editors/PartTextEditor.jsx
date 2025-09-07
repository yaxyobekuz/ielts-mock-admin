// React
import { useState } from "react";

// Helpers
import { isNumber } from "@/lib/helpers";

// Api
import { partsApi } from "@/api/parts.api";

// Toast
import { toast } from "@/notification/toast";

// Components
import EditorHeader from "@/components/EditorHeader";
import RichTextEditor from "@/components/RichTextEditor";

// Router
import { useNavigate, useParams } from "react-router-dom";

// Hooks
import useModule from "@/hooks/useModule";
import useDebouncedState from "@/hooks/useDebouncedState";
import UploadImageModal from "@/components/modal/UploadImageModal";

const PartTextEditor = () => {
  // State & Hooks
  const modules = ["reading", "writing"];
  const { testId, partNumber, module } = useParams();
  const { getModuleData, updatePart } = useModule(module, testId);
  const parts = getModuleData();

  // Validators
  const isInvalidModule = !modules.includes(module);
  const isInvalidPartNumber = !isNumber(partNumber);

  // Data
  const part = parts?.find((p) => p.number === parseInt(partNumber));

  // If invalid data return Error content
  if (isInvalidPartNumber || isInvalidModule) return <ErrorContent />;

  // Original
  const [original, setOriginal] = useState({ content: part?.text });

  // State
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [content, setContent] = useDebouncedState(part?.text, setIsSaving);

  // Check if content has changed
  const hasContentChanged = content !== original.content;

  const handleNavigate = () => {
    const path = `/tests/test/${testId}/preview/${module}/${partNumber}`;
    navigate(path);
  };

  const handleSaveContent = () => {
    if (isUpdating) return;
    setIsUpdating(true);
    const partData = { text: content };

    partsApi
      .update(part._id, partData)
      .then(({ code, part }) => {
        if (code !== "partUpdated") throw new Error();
        handleNavigate();
        setIsSaving(false);
        setOriginal({ content });
        updatePart(partNumber, part);
      })
      .catch(({ message }) => toast.error(message || "Nimadir xato ketdi"))
      .finally(() => setIsUpdating(false));
  };

  return (
    <div className="editor-page">
      {/* Header */}
      <EditorHeader
        isSaving={isSaving}
        handleNavigate={handleNavigate}
        title="Bo'lak matnini tahrirlash"
        originalContent={original.content}
        hasContentChanged={hasContentChanged}
        handleSaveContent={handleSaveContent}
      />

      {/* Editor */}
      <div className="container pb-24">
        <RichTextEditor
          allowImage
          onChange={setContent}
          initialContent={content}
        />
      </div>

      <UploadImageModal />
    </div>
  );
};

const ErrorContent = () => <i>Hmmm... Nimadir noto'g'ri ketdi!</i>;

export default PartTextEditor;
