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
import useObjectState from "@/hooks/useObjectState";

const CreateTestModal = () => (
  <ResponsiveModal
    name="createTest"
    title="Test qo'shish"
    description="Test qo'shish uchun sarlavhani kiriting, istasangiz izoh ham qo'shing."
  >
    <Content />
  </ResponsiveModal>
);

const Content = ({ close, isLoading, setIsLoading }) => {
  const { invalidateCache } = useArrayStore("tests");

  const { title, description, setField } = useObjectState({
    title: "",
    description: "",
  });

  const handleCreateTest = (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!title?.trim()?.length) {
      return toast.error("Sarlavha kiritilmadi");
    }

    setIsLoading(true);
    let success = false;

    testsApi
      .create({ title: title.trim(), description: description?.trim() || "" })
      .then(({ code, message }) => {
        if (code !== "testCreated") throw new Error();

        success = true;
        invalidateCache();
        toast.success(message);
        invalidateCache("latestTests", true);
      })
      .catch(({ message }) => toast.error(message || "Nimadir xato ketdi"))
      .finally(() => {
        success && close();
        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={handleCreateTest} className="space-y-5">
      <Input
        required
        size="lg"
        border={true}
        value={title}
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

        <Button disabled={isLoading} className="w-32">
          Qo'shish
        </Button>
      </div>
    </form>
  );
};

export default CreateTestModal;
