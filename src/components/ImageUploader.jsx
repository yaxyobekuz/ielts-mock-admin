// Components
import Input from "./form/Input";
import Button from "./form/Button";

// Hooks
import useObjectState from "@/hooks/useObjectState";

// React
import { useRef, useEffect, useCallback } from "react";

// Data
import allowedImageTypes from "@/data/allowedImageTypes";

// Icons
import { FolderUp, Clipboard, Trash, X } from "lucide-react";

const ImageUploader = ({
  label,
  progress,
  isUploading,
  multiple = false,
  required = false,
  initialFiles = [],
  onChange = () => {},
}) => {
  const dropRef = useRef(null);
  const { images, setField } = useObjectState({
    files: initialFiles,
    images: initialFiles.map((file) => URL.createObjectURL(file)),
  });

  // Handle files
  const handleFiles = useCallback(
    (fileList) => {
      if (!fileList || fileList.length === 0) return;

      const validFiles = Array.from(fileList).filter(
        (file) => file && allowedImageTypes.includes(file.type)
      );
      if (validFiles.length === 0) return;
      if (!multiple) validFiles.splice(1);

      const imageUrls = validFiles.map((file) => URL.createObjectURL(file));

      onChange(validFiles);
      setField("files", validFiles);
      setField("images", imageUrls);
    },
    [onChange, setField]
  );

  // Handle clear files
  const handleClear = useCallback(() => {
    if (isUploading) return;

    onChange([]);
    setField("files", []);
    setField("images", []);
  }, [onChange, setField]);

  // Paste
  const handlePaste = useCallback(async () => {
    try {
      const items = await navigator.clipboard.read();
      const pastedFiles = [];

      for (const item of items) {
        for (const type of item.types) {
          if (allowedImageTypes.includes(type)) {
            pastedFiles.push(await item.getType(type));
          }
        }
      }

      if (pastedFiles.length) handleFiles(pastedFiles);
    } catch {}
  }, [handleFiles]);

  // Drag & drop
  useEffect(() => {
    const dropArea = dropRef.current;
    if (!dropArea) return;

    const addHover = () => {
      dropArea.classList.add("bg-blue-50", "!border-blue-500");
    };

    const removeHover = () => {
      dropArea.classList.remove("bg-blue-50", "!border-blue-500");
    };

    const onDrop = (e) => {
      e.preventDefault();

      removeHover();
      handleFiles(e.dataTransfer.files);
    };

    dropArea.addEventListener("dragover", (e) => e.preventDefault());
    dropArea.addEventListener("dragenter", addHover);
    dropArea.addEventListener("dragleave", removeHover);
    dropArea.addEventListener("drop", onDrop);

    return () => {
      dropArea.removeEventListener("dragover", (e) => e.preventDefault());
      dropArea.removeEventListener("dragenter", addHover);
      dropArea.removeEventListener("dragleave", removeHover);
      dropArea.removeEventListener("drop", onDrop);
    };
  }, [handleFiles]);

  // Global paste listener
  useEffect(() => {
    const onPaste = (e) => handleFiles(e.clipboardData.files);
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [handleFiles]);

  return (
    <div className="max-w-full">
      {/* Label */}
      <p className="text-sm ml-1 mb-2 font-medium text-gray-700">
        {label || "Rasm"}
        {multiple && !label ? "lar" : ""}{" "}
        {required && <span className="text-blue-500">*</span>}
      </p>

      {/* Upload */}
      {!isUploading && (
        <div className="space-y-1.5">
          {/* Drop zone */}
          <label
            ref={dropRef}
            className="flex items-center justify-center gap-3.5 cursor-pointer w-full py-6 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500"
          >
            <Input
              type="file"
              className="hidden"
              multiple={multiple}
              name={multiple ? "images" : "image"}
              accept={allowedImageTypes.join(", ")}
              onChange={(files) => handleFiles(files)}
            />
            <span>
              {images[0] ? "Boshqa rasm" : "Rasm"}
              {multiple ? "lar" : ""} tanlang yoki tashlang
            </span>
            <FolderUp size={22} strokeWidth={1.5} />
          </label>

          <div className="flex gap-1.5">
            {/* Clipboard */}
            <Button
              size="none"
              type="button"
              variant="neutral"
              onClick={handlePaste}
              className="gap-2.5 w-full h-8 px-1.5 rounded-md text-sm"
            >
              Xotiradan olish
              <Clipboard size={16} strokeWidth={1.5} />
            </Button>

            {/* Clear */}
            {images.length !== 0 && (
              <Button
                size="none"
                type="button"
                variant="danger"
                onClick={handleClear}
                disabled={isUploading}
                className="gap-2.5 w-full h-8 px-1.5 rounded-md text-sm"
              >
                Tozalash
                <Trash size={16} strokeWidth={1.5} />
              </Button>
            )}
          </div>
        </div>
      )}

      {isUploading && !images.length ? (
        <div className="flex items-center justify-center gap-3.5 w-full py-6 border border-gray-300 rounded-md text-sm">
          Hech qanday rasm tanlanmadi
          <X size={22} strokeWidth={1.5} />
        </div>
      ) : null}

      {/* Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-1.5 mt-5">
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="Preview"
              className="w-full h-auto aspect-square bg-gray-200 object-cover rounded-md"
            />
          ))}
        </div>
      )}

      {/* Progress */}
      {progress > 0 && (
        <div className="flex items-center gap-3.5 mt-5">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              style={{ width: `${progress}%` }}
              className="bg-blue-500 h-1 rounded-full transition-all duration-200"
            />
          </div>
          <div className="shrink-0 leading-none">{progress}%</div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
