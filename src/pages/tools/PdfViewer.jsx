// Toast
import { toast } from "@/notification/toast";

// Icons
import { Upload, AlertCircle } from "lucide-react";

// React
import { useState, useEffect, useRef } from "react";

// Hooks
import useObjectStore from "@/hooks/useObjectStore";
import useDebouncedState from "@/hooks/useDebouncedState";

const PdfViewer = () => {
  const { getEntity, updateEntity } = useObjectStore("pdfFile");
  const pdfFile = getEntity("file") || {};
  const fileUrl = pdfFile.fileUrl;

  const handleFileUpload = (file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      return toast.error("Faqat PDF fayl yuklang");
    }

    updateEntity("file", { fileUrl: URL.createObjectURL(file) });
  };

  const handleDeleteFile = () => {
    if (!fileUrl) return;

    URL.revokeObjectURL(fileUrl);
    updateEntity("file", { fileUrl: null });
  };

  return (
    <div className="container pt-8 space-y-5">
      {/* Title */}
      <h1>PDF ochuvchi</h1>

      {/* Content */}
      {fileUrl ? (
        <Viewer url={fileUrl} onDeleteFile={handleDeleteFile} />
      ) : (
        <Uploader onUpload={handleFileUpload} />
      )}
    </div>
  );
};

const Uploader = ({ onUpload }) => {
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file) => {
    if (!file) return false;

    if (file.type !== "application/pdf") {
      setError("Faqat PDF fayllar qabul qilinadi");
      return false;
    }

    if (file.size > 1000 * 1024 * 1024) {
      setError("Fayl hajmi 1GB dan oshmasligi kerak");
      return false;
    }

    setError("");
    return true;
  };

  const handleFile = (file) => {
    if (!validateFile(file || !onUpload)) return;

    onUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    handleFile(file);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;

    if (items) {
      for (let item of items) {
        if (item.kind !== "file") continue;

        const file = item.getAsFile();
        if (!file) continue;

        handleFile(file);
      }
    }
  };

  return (
    <div
      tabIndex={0}
      onDrop={handleDrop}
      onPaste={handlePaste}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative border-2 border-dashed rounded-3xl p-12 transition-all ${
        isDragging
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 bg-white hover:border-gray-400"
      }`}
    >
      {/* Input */}
      <input
        type="file"
        id="file-input"
        ref={fileInputRef}
        className="hidden"
        accept="application/pdf"
        onChange={handleFileSelect}
      />

      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          PDF faylni yuklash
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4">
          Faylni bu yerga sudrab olib keling <br /> yoki Ctrl+V bilan
          joylashtiring
        </p>

        {/* Uplod button */}
        <label
          htmlFor="file-input"
          className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
        >
          Faylni tanlash
        </label>

        {/* Alert info */}
        <p className="text-xs text-gray-500 mt-4">Maksimal hajm: 1GB</p>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

const Viewer = ({ url, onDeleteFile }) => {
  const { getEntity, updateEntity } = useObjectStore("pdfFile");
  const pdfFile = getEntity("file") || {};
  const initialNote = pdfFile.note;

  const [isLoading, setIsLoading] = useState(false);
  const [_, setNote] = useDebouncedState(
    initialNote || "",
    (loading, value) => {
      setIsLoading(loading);
      if (!loading) updateEntity("file", { ...pdfFile, note: value });
    }
  );

  useEffect(() => {
    const elViewerWrapper = document.querySelector(".viewer-wrapper");
    const rect = elViewerWrapper.getBoundingClientRect();
    elViewerWrapper.style.height = `calc(100vh - ${rect.top}px - 54px)`;
  }, [url]);

  return (
    <div className="viewer-wrapper flex gap-5">
      {/* Viewer */}
      <div className="size-full space-y-3">
        <div className="flex items-center justify-between">
          {/* Title */}
          <h2 className="text-xl font-medium">Ko'rinish</h2>

          {/* Delete file btn */}
          <button
            onClick={onDeleteFile}
            className="btn h-8 py-0 bg-red-100 rounded-full text-sm text-red-600 hover:bg-red-200"
          >
            Faylni o'chirish
          </button>
        </div>

        {/* Content */}
        <div className="flex justify-center size-full bg-gray-100 px-5 rounded-3xl">
          <iframe src={url} className="max-w-2xl w-full" />
        </div>
      </div>

      {/* Note */}
      <div className="max-w-xl size-full space-y-3">
        <div className="flex items-center justify-between">
          {/* Title */}
          <h2 className="text-xl font-medium">Eslatma</h2>

          {/* Loader */}
          <div className="flex items-center gap-1.5">
            {isLoading ? (
              <>
                <div className="rounded-full size-4 border-2 border-t-blue-500 animate-spin" />
                <p className="text-sm text-gray-500">Saqlanmoqda...</p>
              </>
            ) : (
              <>
                <div className="size-2 bg-green-500 rounded-full" />
                <p className="text-sm text-green-500">Saqlangan</p>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="size-full bg-gray-100 p-5 rounded-3xl">
          <div className="size-full rounded-xl overflow-hidden border border-gray-300">
            <textarea
              defaultValue={initialNote || ""}
              onChange={(e) => setNote(e.target.value)}
              className="size-full text-sm bg-white/70 rounded-xl scroll-y-primary resize-none border-0 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
