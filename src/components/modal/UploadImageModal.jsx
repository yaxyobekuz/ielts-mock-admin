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

// Toast
import { toast } from "@/notification/toast";

// Api
import { uploadApi } from "@/api/upload.api";

// Hooks
import useModal from "@/hooks/useModal";
import useMediaQuery from "@/hooks/useMediaQuery";

// Icons
import { FolderUp, Clipboard } from "lucide-react";

// React
import { useState, useRef, useEffect } from "react";

const UploadImageModal = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { closeModal, isOpen } = useModal("uploadImage");
  const handleUploadImage = (image) => closeModal({ image });

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
  const dropRef = useRef(null);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Handle file select
  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setFile(file);
    setImage(URL.createObjectURL(file));
  };

  // Input change
  const handleChange = (files) => {
    const file = files[0];
    handleFile(file);
  };

  // Upload to backend
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || isUploading) return;

    setProgress(0);
    setIsUploading(true);

    const onUploadProgress = (event) => {
      if (event.total) {
        const percent = Math.round((event.loaded * 100) / event.total);
        setProgress(percent);
      }
    };

    uploadApi
      .uploadImage(file, { onUploadProgress })
      .then(({ code, image }) => {
        if (code !== "imageUploaded") throw new Error();
        onUploadImage(image);
      })
      .catch(({ message }) => toast.error(message || "Rasmni yuklab bo'lmadi"))
      .finally(() => {
        close();
        setIsUploading(false);
      });
  };

  const handleClick = async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith("image/")) {
            const blob = await item.getType(type);
            const url = URL.createObjectURL(blob);

            setFile(blob);
            return setImage(url);
          }
        }
      }
    } catch {}
  };

  // Drag & drop
  useEffect(() => {
    const dropArea = dropRef?.current;
    if (!dropArea) return () => {};

    const handleDragOver = (e) => {
      e.preventDefault();
      dropArea.classList.add("border-blue-500");
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      dropArea.classList.remove("border-blue-500");
    };

    const handleDrop = (e) => {
      e.preventDefault();
      dropArea.classList.remove("border-blue-500");
      const f = e.dataTransfer.files[0];
      handleFile(f);
    };

    dropArea.addEventListener("drop", handleDrop);
    dropArea.addEventListener("dragover", handleDragOver);
    dropArea.addEventListener("dragleave", handleDragLeave);

    return () => {
      dropArea.removeEventListener("drop", handleDrop);
      dropArea.removeEventListener("dragover", handleDragOver);
      dropArea.removeEventListener("dragleave", handleDragLeave);
    };
  }, []);

  // Clipboard paste
  useEffect(() => {
    const handlePaste = (e) => {
      const f = e.clipboardData.files[0];
      handleFile(f);
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  return (
    <form onSubmit={handleUpload} className="space-y-5">
      {!isUploading && (
        <>
          {/* Drag & drop / input */}
          <label
            ref={dropRef}
            className="w-full flex items-center justify-center gap-3.5 cursor-pointer h-24 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500"
          >
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />
            <span>{image ? "Boshqa rasm" : "Rasm"} tanlang yoki tashlang</span>
            <FolderUp size={22} strokeWidth={1.5} />
          </label>

          {/* Clipboard button */}
          <Button
            type="button"
            variant="neutral"
            onClick={handleClick}
            className="w-full flex items-center justify-center gap-2"
          >
            Xotiradan olish
            <Clipboard size={18} />
          </Button>
        </>
      )}

      {/* Preview */}
      {image && (
        <div className="flex justify-center w-full">
          <img src={image} alt="Preview" className="max-h-40 bg-gray-200" />
        </div>
      )}

      {/* Progress */}
      {progress > 0 && (
        <div className="flex items-center gap-3.5">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              style={{ width: `${progress}%` }}
              className="bg-blue-500 h-1 rounded-full transition-all duration-200"
            />
          </div>
          <div className="shrink-0">{progress}%</div>
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

        <Button type="submit" className="w-32" disabled={!file || isUploading}>
          Yuklash
        </Button>
      </div>
    </form>
  );
};

export default UploadImageModal;
