// Components
import Input from "../form/Input";
import Button from "../form/Button";

// Toast
import { toast } from "@/notification/toast";

// Router
import { useNavigate } from "react-router-dom";

// Components
import ResponsiveModal from "../ResponsiveModal";

// Api
import { templatesApi } from "@/api/templates.api";

// Hooks
import useStore from "@/hooks/useStore";
import useObjectState from "@/hooks/useObjectState";

const UseTemplateModal = () => (
  <ResponsiveModal
    name="useTemplate"
    title="Shablondan foydalanish"
    description="Test shablonidan foydalanish uchun sarlavhani kiriting, istasangiz izoh ham qo'shing."
  >
    <Content />
  </ResponsiveModal>
);

const Content = ({ close, templateId, isLoading, setIsLoading }) => {
  const navigate = useNavigate();
  const { getData, updateProperty } = useStore("tests");
  const { isLoading: isTestsLoading, data: tests } = getData();

  const { title, description, setField } = useObjectState({
    title: "",
    description: "",
  });

  const handleUseTemplate = (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!title?.trim()?.length) {
      return toast.error("Sarlavha kiritilmadi");
    }

    setIsLoading(true);
    let success = false;

    templatesApi
      .use(templateId, {
        title: title.trim(),
        description: description?.trim() || "",
      })
      .then(({ test, code }) => {
        if (code !== "templateUsed") throw new Error();

        success = true;
        navigate(`/tests/${test._id}`);
        if (!isTestsLoading) updateProperty("data", [test, ...tests]);
      })
      .catch(({ message }) =>
        toast.error(message || "Nimadir xato ketdi")
      )
      .finally(() => {
        success && close();
        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={handleUseTemplate} className="space-y-5">
      <Input
        required
        size="lg"
        border={true}
        variant="gray"
        maxLength={32}
        label="Sarlavha"
        name="test-template-title"
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
        placeholder="Izoh (Ixtiyoriy)"
        name="test-template-description"
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

export default UseTemplateModal;
