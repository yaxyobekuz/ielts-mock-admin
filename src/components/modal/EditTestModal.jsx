// React
import { useMemo } from "react";

// Components
import Input from "../form/Input";
import Button from "../form/Button";

// Api
import { testsApi } from "@/api/tests.api";

// Toast
import { toast } from "@/notification/toast";

// Components
import ResponsiveModal from "../ResponsiveModal";

// Hooks
import useArrayStore from "@/hooks/useArrayStore";
import useObjectStore from "@/hooks/useObjectStore";
import useObjectState from "@/hooks/useObjectState";

const EditTestModal = () => (
  <ResponsiveModal
    name="editTest"
    title="Testni yangilash"
    description="Testni yangilash uchun sarlavhani kiriting, istasangiz izoh ham qo'shing."
  >
    <Content />
  </ResponsiveModal>
);

const Content = ({
  close,
  testId,
  isLoading,
  setIsLoading,
  title: initialTitle,
  description: initialDescription,
}) => {
  const { updateEntity } = useObjectStore("tests");
  const { updateItemById, updateItem } = useArrayStore("tests");

  const { title, description, setField } = useObjectState({
    title: initialTitle || "",
    description: initialDescription || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!title?.trim()?.length) {
      return toast.error("Sarlavha kiritilmadi");
    }

    setIsLoading(true);
    let success = false;

    testsApi
      .update(testId, {
        title: title?.trim(),
        description: description?.trim() || "",
      })
      .then(({ test, code, message }) => {
        if (code !== "testUpdated") throw new Error();
        success = true;
        toast.success(message);

        // Update stores
        const updates = { title: test.title, description: test.description };
        updateEntity(testId, updates);
        updateItemById(testId, updates);
        updateItem(testId, updates, "_id", "latestTests");
      })
      .catch(({ message }) => toast.error(message || "Nimadir xato ketdi"))
      .finally(() => {
        success && close();
        setIsLoading(false);
      });
  };

  const hasContentChanged = useMemo(() => {
    return (
      title?.trim() !== (initialTitle || "") ||
      description?.trim() !== (initialDescription || "")
    );
  }, [title, description, initialTitle, initialDescription]);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        required
        size="lg"
        value={title}
        border={true}
        variant="gray"
        maxLength={32}
        label="Sarlavha"
        name="test-title"
        placeholder="Sarlavhani kiriting"
        onChange={(value) => setField("title", value)}
      />

      <Input
        size="lg"
        label="Izoh"
        border={true}
        variant="gray"
        type="textarea"
        maxLength={144}
        value={description}
        name="test-description"
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

        <Button className="w-32" disabled={isLoading || !hasContentChanged}>
          Yangilash
        </Button>
      </div>
    </form>
  );
};

export default EditTestModal;
