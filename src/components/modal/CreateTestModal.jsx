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

// Api
import { testsApi } from "@/api/tests.api";

// Toast
import { toast } from "@/notification/toast";

// Router
import { useNavigate } from "react-router-dom";

// Hooks
import useModal from "@/hooks/useModal";
import useStore from "@/hooks/useStore";
import useMediaQuery from "@/hooks/useMediaQuery";
import useObjectState from "@/hooks/useObjectState";

const CreateTestModal = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { closeModal, isOpen } = useModal("createTest");

  const content = {
    title: "Test qo'shish",
    body: <Body close={closeModal} />,
    description: `Yangi test qo'shish uchun sarlavhani kiriting, istasangiz rasm ham yuklang`,
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

const Body = ({ close }) => {
  const navigate = useNavigate();
  const { getData, updateProperty } = useStore("tests");
  const { isLoading: isTestsLoading, data: tests } = getData();

  const { state, setField } = useObjectState({ image: null, title: "" });
  const { image, title } = state;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || title.trim().length === 0) {
      return toast.error("Sarlavha kiritilmadi");
    }

    toast.promise(
      testsApi
        .create({ title, image })
        .then(({ test, code }) => {
          if (code !== "testCreated") throw new Error();
          if (!isTestsLoading) updateProperty("data", [test, ...tests]);
          navigate(`/tests/${test._id}`);
        })
        .finally(close),
      {
        error: "Test qo'shilmadi!",
        success: "Test qo'shildi!",
        loading: "Test qo'shilmoqda...",
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
        border={true}
        size="lg"
        variant="gray"
        maxLength={32}
        name="test-name"
        placeholder="Sarlavha"
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
          onClick={close}
          className="w-32"
          variant="neutral"
        >
          Bekor qilish
        </Button>

        <Button type="submit" className="w-32">
          Qo'shish
        </Button>
      </div>
    </form>
  );
};

export default CreateTestModal;
