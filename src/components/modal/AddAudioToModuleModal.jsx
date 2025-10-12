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

// Hooks
import useModule from "@/hooks/useModule";
import useMediaQuery from "@/hooks/useMediaQuery";

// React
import { useState, useRef, useEffect } from "react";

const AddAudioToModuleModal = ({
  isOpen,
  testId,
  closeModal,
  module = "listening",
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isUploading, setIsUploading] = useState(false);
  const handleCloseModal = () => !isUploading && closeModal?.();
  const { getModuleData, updateModule } = useModule(module, testId);
  const { audios } = getModuleData() || {};

  const handleUploadAudio = ({ audio, module }) => {
    closeModal?.();
    updateModule({ audios: [...audios, audio] }, testId, module);
  };

  const content = {
    title: "Audio yuklash",
    description: `Iltimos, audio faylni qurilmangiz orqali tanlab yoki tashlab yuklang`,
    body: (
      <Body
        testId={testId}
        module={module}
        close={handleCloseModal}
        isUploading={isUploading}
        setIsUploading={setIsUploading}
        onUploadAudio={handleUploadAudio}
      />
    ),
  };

  if (isDesktop) {
    return (
      <Dialog open={!!isOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{content.title}</DialogTitle>
            <DialogDescription>{content.description}</DialogDescription>
          </DialogHeader>
          {content.body}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={!!isOpen} onOpenChange={handleCloseModal}>
      <DrawerContent>
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
          <DialogDescription>{content.description}</DialogDescription>
        </DialogHeader>
        {content.body}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <button variant="outline">Bekor qilish</button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({
  close,
  module,
  testId,
  isUploading,
  onUploadAudio,
  setIsUploading,
}) => {
  const dropRef = useRef(null);
  const [file, setFile] = useState(null);
  const [audio, setAudio] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("audio/") || isUploading) return;

    setFile(file);
    setAudio(URL.createObjectURL(file));
    if (audio) URL.revokeObjectURL(audio);
  };

  const handleChange = (files) => {
    const file = files[0];
    handleFile(file);
  };

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

    testsApi
      .addAudioToModule(testId, module, file, { onUploadProgress })
      .then(({ code, audio, module }) => {
        if (code !== "audioAddedToModule") throw new Error();
        onUploadAudio({ audio, module });
      })
      .catch(({ message }) => {
        toast.error(message || "Audioni yuklashda xatolik yuz berdi");
      })
      .finally(() => setIsUploading(false));
  };

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
        <label
          ref={dropRef}
          className="w-full flex items-center justify-center gap-3.5 cursor-pointer h-24 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500"
        >
          <Input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleChange}
          />
          <span>
            {audio ? "Boshqa audio tanlang" : "Audio tanlang yoki tashlang"}
          </span>
          <FolderUp size={22} strokeWidth={1.5} />
        </label>
      )}

      {audio && (
        <div className="flex justify-center w-full">
          <audio
            controls
            src={audio}
            className="w-full bg-gray-100 rounded-md"
          />
        </div>
      )}

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

export default AddAudioToModuleModal;
