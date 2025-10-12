// Ui components
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerFooter,
  DrawerContent,
} from "@/components/ui/drawer";

// Components
import Input from "../form/Input";
import Button from "../form/Button";

// Icons
import { FolderUp } from "lucide-react";

// Toast
import { toast } from "@/notification/toast";

// Router
import { useNavigate } from "react-router-dom";

// Api
import { templatesApi } from "@/api/templates.api";

// Hooks
import useModal from "@/hooks/useModal";
import useStore from "@/hooks/useStore";
import useMediaQuery from "@/hooks/useMediaQuery";
import useObjectState from "@/hooks/useObjectState";

const UseTemplateModal = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { closeModal, isOpen, data = {} } = useModal("useTemplate");

  const content = {
    title: "Shablondan nusxa ko'chirish",
    body: <Body close={closeModal} templateId={data.templateId} />,
    description: `Shablondan nusxa ko'chirish uchun sarlavhani kiriting, istasangiz rasm ham yuklang`,
  };

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[425px]">
          {/* Header */}
          <DialogHeader>
            <DialogTitle>{content.title}</DialogTitle>
            <DialogDescription>{content.description}</DialogDescription>
          </DialogHeader>

          {/* Body */}
          {content.body}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={closeModal}>
      <DrawerContent>
        {/* Header */}
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
          <DialogDescription>{content.description}</DialogDescription>
        </DialogHeader>

        {/* Body */}
        {content.body}

        {/* Footer */}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <button variant="outline">Bekor qilish</button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({ close, templateId }) => {
  const navigate = useNavigate();
  const { getData, updateProperty } = useStore("tests");
  const { isLoading: isTestsLoading, data: tests } = getData();
  const { setField, image, title } = useObjectState({ title: "", image: null });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || title.trim().length === 0) {
      return toast.error("Sarlavha kiritilmadi");
    }

    toast.promise(
      templatesApi
        .use(templateId, { title, image })
        .then(({ test, code }) => {
          if (code !== "templateUsed") throw new Error();
          if (!isTestsLoading) updateProperty("data", [test, ...tests]);
          navigate(`/tests/${test._id}`);
        })
        .finally(close),
      {
        error: "Shablondan nusxa ko'chirilmadi!",
        success: "Shablondan nusxa ko'chirildi!",
        loading: "Shablondan nusxa ko'chirilmoqda...",
      }
    );
  };

  const handleChange = (files) => {
    const file = files[0];
    if (!file) return;
    setField("image", URL.createObjectURL(file));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.currentTarget.click();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        size="lg"
        required
        border={true}
        variant="gray"
        maxLength={32}
        name="test-name"
        label="Sarlavha"
        placeholder="Sarlavhani kiriting"
        onChange={(value) => setField("title", value)}
      />

      {/* Image input */}
      <label
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="group w-full outline-none"
      >
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          name="image-file-input"
          onChange={handleChange}
        />
        <div className="flex items-center justify-center gap-3.5 cursor-pointer w-full h-24 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 group-focus:border-blue-500">
          <span>{image ? "Boshqa rasm" : "Rasm"} tanlash</span>
          <FolderUp size={22} strokeWidth={1.5} />
        </div>
      </label>

      {/* Preview */}
      {image && (
        <div className="flex justify-center w-full">
          <img src={image} alt="Preview" className="max-h-40 bg-gray-200" />
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-5 w-full">
        <Button
          type="button"
          onClick={()=> close()}
          className="w-32"
          variant="neutral"
        >
          Bekor qilish
        </Button>

        <Button type="submit" className="w-32">
          Ko'chirish
        </Button>
      </div>
    </form>
  );
};

export default UseTemplateModal;
