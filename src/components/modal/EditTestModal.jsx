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
import useStore from "@/hooks/useStore";
import useObjectState from "@/hooks/useObjectState";

const EditTestModal = () => (
  <ResponsiveModal
    name="editTest"
    title="Testni tahrirlash"
    description="Testni tahrirlash uchun sarlavhani kiriting, istasangiz izoh ham qo'shing."
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
  const { getData, updateProperty } = useStore("tests");
  const { isLoading: isTestsLoading, data: tests } = getData();

  const { getData: getSingleTests, updateProperty: updateSingleTest } =
    useStore("test");
  const singleTests = getSingleTests();

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
        toast.success(message || "Test tahrirlandi");

        // Update test from store
        if (!isTestsLoading) {
          const index = tests.findIndex(({ _id: id }) => id === testId);
          if (index === -1) return;

          const newTests = [...tests];
          newTests[index] = {
            ...newTests[index],
            title: test.title,
            description: test.description,
          };
          updateProperty("data", newTests);
        }

        // Update single test from store
        if (singleTests[testId]) {
          updateSingleTest(testId, {
            ...singleTests[testId],
            title: test.title,
            description: test.description,
          });
        }
      })
      .catch(({ message }) =>
        toast.error(message || "Noma'lum xatolik yuz berdi")
      )
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
        placeholder="Sarlavhani kiriitng"
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

        <Button
          type="submit"
          className="w-32"
          disabled={isLoading || !hasContentChanged}
        >
          Tahrirlash
        </Button>
      </div>
    </form>
  );
};

export default EditTestModal;
