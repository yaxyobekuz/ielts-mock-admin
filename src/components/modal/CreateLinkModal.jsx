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

// Api
import { linksApi } from "@/api/links.api";

// Toast
import { toast } from "@/notification/toast";

// Helpers
import { extractNumbers } from "@/lib/helpers";

// Hooks
import useModal from "@/hooks/useModal";
import useStore from "@/hooks/useStore";
import useMediaQuery from "@/hooks/useMediaQuery";
import useObjectState from "@/hooks/useObjectState";

const CreateLinkModal = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { closeModal, isOpen, data } = useModal("createLink");

  const content = {
    title: "Taklif havolasini yaratish",
    body: <Body close={closeModal} testId={data?.testId} />,
    description: `Yangi taklif havolasini yaratish uchun sarlavhani kiriting. Taklif havolasi o'quvchilarga testga kirishi uchun kerak bo'ladi`,
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

const Body = ({ close, testId }) => {
  const { getProperty, updateProperty } = useStore("link");
  const links = getProperty(testId);
  const { setField, maxUses, title } = useObjectState({
    title: "",
    maxUses: 10,
  });

  const handleCreateLink = (e) => {
    e.preventDefault();

    if (!testId) {
      return toast.error("Test ID raqami mavjud emas");
    }

    if (!title || title.trim().length === 0) {
      return toast.error("Sarlavha kiritilmadi");
    }

    if (!maxUses) {
      return toast.error("Maksimal foydalanishlar soni kiritilmadi");
    }

    toast.promise(
      linksApi
        .create({ title, maxUses, testId })
        .then(({ code, link }) => {
          if (code !== "linkCreated") throw new Error();
          updateProperty(testId, [link, ...(links || [])]);
        })
        .finally(close),
      {
        error: "Havola qo'shilmadi!",
        success: "Havola qo'shildi!",
        loading: "Havola qo'shilmoqda...",
      }
    );
  };

  return (
    <form onSubmit={handleCreateLink} className="space-y-5">
      <Input
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
        size="lg"
        border={true}
        type="number"
        variant="gray"
        name="max-uses"
        value={maxUses}
        placeholder="Raqamni kiriting"
        label="Maksimal foydalanishlar soni"
        onChange={(value) => setField("maxUses", extractNumbers(value))}
      />

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
          Yaratish
        </Button>
      </div>
    </form>
  );
};

export default CreateLinkModal;
