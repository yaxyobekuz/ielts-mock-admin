// React
import { useEffect, useState } from "react";

// Components
import RichTextEditor from "./RichTextEditor";

// Icons
import { Edit, NotebookPen } from "lucide-react";

const EditorHeader = ({
  isSaving,
  isUpdating,
  handleNavigate,
  originalContent,
  hasContentChanged,
  handleSaveContent,
  onDescriptionChange,
  initialDescription = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const allowDescription = initialDescription || onDescriptionChange;
  const [description, setDescription] = useState(initialDescription || "");

  const handleDescriptionChange = (value) => {
    if (allowDescription) {
      setDescription(value);
      onDescriptionChange(value);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);

    if (isOpen) {
      document.body.classList.remove("overflow-y-hidden");
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
      document.body.classList.add("overflow-y-hidden");
    }
  };

  useEffect(() => {
    return () => {
      document.body.classList.remove("overflow-y-hidden");
    };
  }, []);

  return (
    <>
      {/* Header */}
      <header className="flex items-center h-[68px] border-b relative z-50 bg-white">
        <div className="flex items-center justify-between gap-5 container">
          {/* Title */}
          <h1 className="text-xl font-semibold">
            Bo'lim {isOpen ? "tavsif" : "kontent"}ini tahrirlash
          </h1>

          <div className="flex gap-5 items-center max-w-max shrink-0">
            {/* Toggle btn */}
            {allowDescription && (
              <button
                onClick={handleToggle}
                className={`${
                  isOpen ? "text-blue-500" : ""
                } btn gap-1.5 h-9 py-0 px-3.5 rounded-md hover:bg-gray-100`}
              >
                <span className="text-sm">
                  Bo'lim {isOpen ? "kontent" : "tavsif"}ini tahrirlash
                </span>
                {isOpen ? <Edit size={14} /> : <NotebookPen size={14} />}
              </button>
            )}

            {/* Loader */}
            <Loader
              isSaving={isSaving}
              originalContent={originalContent}
              hasContentChanged={hasContentChanged}
            />

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
              disabled={!hasContentChanged || isSaving || isUpdating}
              className={`${
                isUpdating
                  ? "bg-gray-200 rounded-full w-9"
                  : "w-24 bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              } flex items-center justify-center h-9  text-white text-sm transition-all duration-500`}
            >
              {isUpdating ? (
                <div className="spin-loader size-9" />
              ) : (
                <span>Saqlash</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Description Editor */}
      {allowDescription && (
        <DescriptionEditor
          isOpen={isOpen}
          description={description}
          onChange={handleDescriptionChange}
        />
      )}
    </>
  );
};

const DescriptionEditor = ({ isOpen, description, onChange }) => {
  return (
    <div
      className={`${
        isOpen ? "translate-y-0" : "-translate-y-[150%]"
      } fixed inset-0 top-[68px] z-30 bg-white w-full h-[calc(100%-68px)] overflow-y-auto scroll-y-primary transition-transform duration-500`}
    >
      <div className="container">
        <RichTextEditor
          onChange={onChange}
          initialContent={description}
          className="bg-white pt-0 p-2.5 rounded-b-3xl"
        />
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
export default EditorHeader;
