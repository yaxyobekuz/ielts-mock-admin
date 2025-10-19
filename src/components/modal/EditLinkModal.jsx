// UI components
import { Switch } from "../ui/switch";

// Api
import { linksApi } from "@/api/links.api";

// Toast
import { toast } from "@/notification/toast";

// Helpers
import { extractNumbers } from "@/lib/helpers";

// Components
import Input from "../form/Input";
import Button from "../form/Button";
import ResponsiveModal from "../ResponsiveModal";

// Hooks
import useArrayStore from "@/hooks/useArrayStore";
import useObjectState from "@/hooks/useObjectState";
import useObjectStore from "@/hooks/useObjectStore";

const EditLinkModal = () => (
  <ResponsiveModal
    name="editLink"
    title="Taklif havolasini yangilash"
    description="Taklif havolasini yangilash uchun sarlavhani kiriting. Taklif havolasi o'quvchilarga testga kirishi uchun kerak bo'ladi."
  >
    <Content />
  </ResponsiveModal>
);

const Content = ({
  close,
  testId,
  linkId,
  isLoading,
  setIsLoading,
  ...rest
}) => {
  const { updateEntity } = useObjectStore("links");
  const { updateItemById } = useArrayStore("links");
  const { updateItemInEntityArray } = useObjectStore("testLinks");
  const { setField, maxUses, title, requireComment } = useObjectState(rest);

  const handleUpdateLink = (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!linkId) {
      return toast.error("Havola ID raqami mavjud emas");
    }

    if (!title?.trim()?.length) {
      return toast.error("Sarlavha kiritilmadi");
    }

    if (!maxUses) {
      return toast.error("Maksimal foydalanishlar soni kiritilmadi");
    }

    let success = false;
    setIsLoading(true);

    const updateData = {
      maxUses,
      requireComment,
      title: title.trim(),
    };

    linksApi
      .update(linkId, { ...updateData, testId })
      .then(({ code, link, message }) => {
        if (code !== "linkUpdated") throw new Error();

        success = true;
        toast.success(message);
        updateEntity(linkId, updateData);
        updateItemById(linkId, updateData);
        updateItemInEntityArray(link.testId, linkId, link);
      })
      .catch(({ message }) => toast.error(message || "Nimadir xato ketdi"))
      .finally(() => {
        success && close();
        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={handleUpdateLink} className="space-y-5">
      <Input
        required
        size="lg"
        border={true}
        value={title}
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

        <Button disabled={isLoading} className="w-32">
          Yangilash
        </Button>
      </div>
    </form>
  );
};

export default EditLinkModal;
