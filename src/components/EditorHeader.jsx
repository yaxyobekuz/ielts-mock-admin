import { useState } from "react";

const EditorHeader = ({
  isSaving,
  isUpdating,
  handleNavigate,
  originalContent,
  hasContentChanged,
  handleSaveContent,
  onDescriptionChange,
  title = "Text editor",
  initialDescription = "",
}) => {
  const allowDescription = initialDescription || onDescriptionChange;
  const [description, setDescription] = useState(initialDescription || "");

  const handleDescriptionChange = (e) => {
    if (!allowDescription) return;
    setDescription(e.target.value);
    onDescriptionChange(e.target.value);
  };

  return (
    <header className="flex items-center h-[68px] border-b">
      <div className="flex items-center justify-between gap-5 container">
        <div
          className={`${
            allowDescription ? " max-w-[66.666667%] space-y-0.5" : ""
          } w-full`}
        >
          {/* Title */}
          <h1 className="text-xl font-semibold">{title}</h1>

          {/* Description input */}
          {allowDescription ? (
            <input
              type="text"
              value={description}
              name="description-input"
              placeholder="Bo'lim tavsifi"
              onChange={handleDescriptionChange}
              className="max-w-full min-w-40 w-full h-7 bg-gray-100 rounded-md px-2 outline-none"
            />
          ) : null}
        </div>

        <div className="flex gap-5 items-center max-w-max shrink-0">
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
