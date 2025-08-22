import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Helpers
import { isNumber } from "../../lib/helpers";

// Components
import EditorHeader from "../../components/EditorHeader";
import RichTextEditor from "../../components/RichTextEditor";

// Hooks
import useModule from "../../hooks/useModule";
import useDebouncedState from "../../hooks/useDebouncedState";

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
  const [content, setContent] = useDebouncedState(part?.text, setIsSaving);

  // Check if content has changed
  const hasContentChanged = content !== original.content;

  const handleNavigate = () => {
    const path = `/tests/test/${testId}/preview/${module}/${partNumber}`;
    navigate(path);
  };

  const handleSaveContent = () => {
    const partData = { text: content };

    handleNavigate(); // Navigate user to preview page
    setIsSaving(false); // Stop saving loader
    setOriginal({ content }); // Update original values
    updatePart(partNumber, partData); // Update part data from store
  };

  return (
    <>
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
    </>
  );
};

const ErrorContent = () => <i>Hmmm... Nimadir noto'g'ri ketdi!</i>;

export default PartTextEditor;
