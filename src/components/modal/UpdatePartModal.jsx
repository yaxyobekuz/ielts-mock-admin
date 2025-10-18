// Components
import Input from "../form/Input";
import Button from "../form/Button";

// Api
import { partsApi } from "@/api/parts.api";

// Toast
import { toast } from "@/notification/toast";

// Components
import ResponsiveModal from "../ResponsiveModal";

// Hooks
import useModule from "@/hooks/useModule";
import useObjectState from "@/hooks/useObjectState";

const UpdatePartModal = () => (
  <ResponsiveModal name="editPart" title="Qism ma'lumotlarini yangilash">
    <Content />
  </ResponsiveModal>
);

const Content = ({
  close,
  partId,
  testId,
  module,
  isLoading,
  partNumber,
  setIsLoading,
  title: initialTitle,
  description: initialDescription,
}) => {
  const { updatePart } = useModule(module, testId);
  const { title, description, setField } = useObjectState({
    title: initialTitle || "",
    description: initialDescription || "",
  });

  const contentHasChanged =
    title?.trim() !== initialTitle?.trim() ||
    description?.trim() !== initialDescription?.trim();

  const handleUpdatePart = (e) => {
    e.preventDefault();
    if (isLoading || !contentHasChanged) return;

    setIsLoading(true);
    let success = false;

    partsApi
      .update(partId, {
        title: title?.trim() || "",
        description: description?.trim() || "",
      })
      .then(({ part, code, message }) => {
        if (code !== "partUpdated") throw new Error();
        success = true;
        toast.success(message);
        updatePart(partNumber, part);
      })
      .catch(({ message }) => toast.error(message || "Nimadir xato ketdi"))
      .finally(() => {
        success && close();
        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={handleUpdatePart} className="space-y-5">
      <Input
        size="lg"
        value={title}
        border={true}
        variant="gray"
        maxLength={32}
        label="Sarlavha"
        name="part-title"
        placeholder="Sarlavha (Ixtiyoriy)"
        onChange={(value) => setField("title", value)}
      />

      <Input
        size="lg"
        label="Izoh"
        border={true}
        variant="gray"
        type="textarea"
        maxLength={256}
        value={description}
        name="part-description"
        placeholder="Izoh (Ixtiyoriy)"
        onChange={(value) => setField("description", value)}
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

        <Button
          type="submit"
          className="w-32"
          disabled={isLoading || !contentHasChanged || !contentHasChanged}
        >
          Yangilash
        </Button>
      </div>
    </form>
  );
};

export default UpdatePartModal;
