// Components
import Button from "../form/Button";

// Api
import { usersApi } from "@/api/users.api";

// Toast
import { toast } from "@/notification/toast";

// Components
import ImageUploader from "../ImageUploader";
import ResponsiveModal from "../ResponsiveModal";

// Hooks
import useObjectStore from "@/hooks/useObjectStore";
import useObjectState from "@/hooks/useObjectState";

const UpdateAvatarModal = () => (
  <ResponsiveModal
    name="updateAvatar"
    title="Profil rasmini yangilash"
    description="Profil rasmingizni yangilash uchun rasmni qurilmangiz orqali tanlab yoki surib yuklang."
  >
    <Content />
  </ResponsiveModal>
);

const Content = ({ close, isLoading, setIsLoading }) => {
  const { updateEntity } = useObjectStore("users");
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

    usersApi
      .updateAvatar(file, { onUploadProgress })
      .then(({ code, user }) => {
        if (code !== "avatarUpdated") throw new Error();

        success = true;
        updateEntity("me", user);
      })
      .catch(({ message }) => toast.error(message || "Nimadir xato ketdi"))
      .finally(() => {
        success && close();
        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={handleUpload} className="space-y-5">
      <ImageUploader
        label="Rasm"
        progress={progress}
        isLoading={isLoading}
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

export default UpdateAvatarModal;
