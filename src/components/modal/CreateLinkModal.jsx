// Api
import { linksApi } from "@/api/links.api";

// Toast
import { toast } from "@/notification/toast";

// Helpers
import { extractNumbers } from "@/lib/helpers";

// Components
import Input from "../form/Input";
import Button from "../form/Button";
import { Switch } from "../ui/switch";
import ResponsiveModal from "../ResponsiveModal";

// Hooks
import useStore from "@/hooks/useStore";
import useObjectState from "@/hooks/useObjectState";

const CreateLinkModal = () => (
  <ResponsiveModal
    name="createLink"
    title="Taklif havolasini yaratish"
    description="Yangi taklif havolasini yaratish uchun sarlavhani kiriting. Taklif havolasi o'quvchilarga testga kirishi uchun kerak bo'ladi."
  >
    <Content />
  </ResponsiveModal>
);

const Content = ({ close, testId, isLoading, setIsLoading }) => {
  const { getProperty, updateProperty } = useStore("testLinks");
  const links = getProperty(testId);
  const { setField, maxUses, title, requireComment } = useObjectState({
    title: "",
    maxUses: 10,
    requireComment: true,
  });

  const handleCreateLink = (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!testId) {
      return toast.error("Test ID raqami mavjud emas");
    }

    if (!title?.trim()?.length) {
      return toast.error("Sarlavha kiritilmadi");
    }

    if (!maxUses) {
      return toast.error("Maksimal foydalanishlar soni kiritilmadi");
    }

    let success = false;
    setIsLoading(true);

    linksApi
      .create({ title: title.trim(), maxUses, testId, requireComment })
      .then(({ code, link, message }) => {
        if (code !== "linkCreated") throw new Error();

        success = true;
        toast.success(message || "Havola yaratildi");
        updateProperty(testId, [link, ...(links || [])]);
      })
      .catch(({ message }) => toast.error(message || "Nimadir xato ketdi"))
      .finally(() => {
        success && close();
        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={handleCreateLink} className="space-y-5">
      <Input
        required
        size="lg"
        border={true}
        variant="gray"
        maxLength={32}
        label="Sarlavha"
        name="link-name"
        placeholder="Sarlavhani kiriting"
        onChange={(value) => setField("title", value)}
      />

      <Input
        required
        size="lg"
        max={200}
        border={true}
        type="number"
        variant="gray"
        name="max-uses"
        value={maxUses}
        placeholder="Raqamni kiriting"
        label="Maksimal foydalanishlar soni"
        onChange={(value) => setField("maxUses", extractNumbers(value))}
      />

      {/* Require Comment */}
      <div className="flex items-center justify-between">
        <label htmlFor="require-comment">Sharh qoldirishni so'rash</label>
        <Switch
          id="require-comment"
          checked={requireComment}
          onCheckedChange={(value) => setField("requireComment", value)}
        />
      </div>

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

        <Button type="submit" className="w-32">
          Yaratish
        </Button>
      </div>
    </form>
  );
};

export default CreateLinkModal;
