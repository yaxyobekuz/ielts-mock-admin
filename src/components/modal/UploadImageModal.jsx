// Toast
import { toast } from "@/notification/toast";

// Api
import { uploadApi } from "@/api/upload.api";

// Components
import Button from "../form/Button";
import ImageUploader from "../ImageUploader";
import ResponsiveModal from "../ResponsiveModal";

// Hooks
import useObjectState from "@/hooks/useObjectState";

const UploadImageModal = () => (
  <ResponsiveModal
    name="uploadImage"
    title="Rasm yuklash"
    description="Rasmni yuklash uchun rasmni qurilmangiz orqali tanlang yoki surib, quyidagi maydonga tashlang."
  >
    <Content />
  </ResponsiveModal>
);

const Content = ({ close, isLoading, setIsLoading }) => {
  const { setField, file, progress } = useObjectState({
    file: null,
    progress: 0,
  });

  // Upload to backend
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || isLoading) return;

    let image = null;
    setIsLoading(true);
    setField("progress", 0);

    const onUploadProgress = (event) => {
      if (event.total) {
        const percent = Math.round((event.loaded * 100) / event.total);
        setField("progress", percent);
      }
    };

    uploadApi
      .uploadImage(file, { onUploadProgress })
      .then(({ code, image: imageData }) => {
        if (code !== "imageUploaded") throw new Error();
        image = imageData;
      })
      .catch(({ message }) => toast.error(message || "Nimadir xato ketdi"))
      .finally(() => {
        setIsLoading(false);
        image && close({ image });
      });
  };

  return (
    <form onSubmit={handleUpload} className="space-y-5">
      <ImageUploader
        label="Rasm"
        progress={progress}
        isUploading={isLoading}
        onChange={(files) => setField("file", files[0])}
      />

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

export default UploadImageModal;
