import { useState } from "react";

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

// Hooks
import useModal from "@/hooks/useModal";
import useMediaQuery from "@/hooks/useMediaQuery";

const UploadImageModal = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { closeModal, isOpen } = useModal("uploadImage");
  const handleUploadImage = (url) => closeModal({ url });

  const content = {
    title: "Rasm yuklash",
    body: <Body close={closeModal} onUploadImage={handleUploadImage} />,
    description: "Iltimos, rasmni qurilmangiz orqali tanlab yoki surib yuklang",
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

const Body = ({ close, onUploadImage }) => {
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!image) return;
    onUploadImage(image);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Image input */}
      <label className="w-full">
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          name="image-file-input"
          onChange={handleChange}
        />
        <div className="flex items-center justify-center gap-3.5 cursor-pointer w-full h-24 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500">
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
          Yuklash
        </Button>
      </div>
    </form>
  );
};

export default UploadImageModal;
