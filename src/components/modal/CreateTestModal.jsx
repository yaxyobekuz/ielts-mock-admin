// Components
import Input from "../form/Input";
import Button from "../form/Button";

// Api
import { testsApi } from "@/api/tests.api";

// Toast
import { toast } from "@/notification/toast";

// Router
import { useNavigate } from "react-router-dom";

// Components
import ResponsiveModal from "../ResponsiveModal";

// Hooks
import useStore from "@/hooks/useStore";
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
  const navigate = useNavigate();
  const { getData, updateProperty } = useStore("tests");
  const { isLoading: isTestsLoading, data: tests } = getData();

  const { title, description, setField } = useObjectState({
    title: "",
    description: "",
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
      .create({ title: title.trim(), description: description?.trim() || "" })
      .then(({ test, code }) => {
        if (code !== "testCreated") throw new Error();

        success = true;
        navigate(`/tests/${test._id}`);
        if (!isTestsLoading) updateProperty("data", [test, ...tests]);
      })
      .catch(({ message }) =>
        toast.error(message || "Noma'lum xatolik yuz berdi")
      )
      .finally(() => {
        success && close();
        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        required
        size="lg"
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

        <Button disabled={isLoading} type="submit" className="w-32">
          Qo'shish
        </Button>
      </div>
    </form>
  );
};

export default CreateTestModal;
