// Lottie
import Lottie from "lottie-react";

// Toast
import { toast } from "@/notification/toast";

// Api
import { sectionsApi } from "@/api/sections.api";

// Components
import Button from "../form/Button";
import ImageUploader from "../ImageUploader";
import ResponsiveModal from "../ResponsiveModal";

// Hooks
import useObjectState from "@/hooks/useObjectState";
import usePathSegments from "@/hooks/usePathSegments";

// Animations
import duckHeartAnimation from "@/assets/animated/duck-heart.json";

const ExtractSectionDataFromImageModal = ({ onExtract }) => (
  <ResponsiveModal
    name="extractSectionDataFromImage"
    title="AI yordamida ma'lumotlarni rasmdan chiqarish"
    description="Rasmni yuklash uchun rasmni qurilmangiz orqali tanlang yoki surib, quyidagi maydonga tashlang."
  >
    <Content onExtract={onExtract} />
  </ResponsiveModal>
);

const Content = ({ close, isLoading, setIsLoading, onExtract }) => {
  const { pathSegments } = usePathSegments();
  const { setField, file, progress } = useObjectState({
    file: null,
    progress: 0,
  });

  // Upload to backend
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || isLoading) return;

    setIsLoading(true);
    let success = false;
    setField("progress", 0);

    const onUploadProgress = (event) => {
      if (event.total) {
        const percent = Math.round((event.loaded * 100) / event.total);
        setField("progress", percent);
      }
    };

    sectionsApi
      .extractData(file, pathSegments[5], { onUploadProgress })
      .then(({ code, extractedData }) => {
        if (code !== "dataExtracted") throw new Error();
        success = true;
        onExtract?.(extractedData);
      })
      .catch(({ message }) => toast.error(message || "Nimadir xato ketdi"))
      .finally(() => {
        success && close();
        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={handleUpload} className="space-y-5">
      {progress !== 100 && (
        <ImageUploader
          required
          label="Rasm"
          progress={progress}
          isUploading={isLoading}
          onChange={(files) => setField("file", files[0])}
        />
      )}

      {progress === 100 && (
        <div className="flex items-center justify-center gap-3.5 w-full">
          <Lottie animationData={duckHeartAnimation} className="size-12" />
          <b className="font-semibold animate-pulse">
            Ma'lumotlar tayyorlanmoqda...
          </b>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-5 w-full">
        <Button
          type="button"
          className="w-32"
          variant="neutral"
          onClick={() => close()}
        >
          Bekor qilish
        </Button>

        <Button className="w-32" disabled={!file || isLoading}>
          Yuklash
        </Button>
      </div>
    </form>
  );
};

export default ExtractSectionDataFromImageModal;
