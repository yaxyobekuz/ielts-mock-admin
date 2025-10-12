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

// React
import { useState } from "react";

// Components
import Button from "../form/Button";

// Api
import { testsApi } from "@/api/tests.api";

// Toast
import { toast } from "@/notification/toast";

// Hooks
import useModule from "@/hooks/useModule";
import useMediaQuery from "@/hooks/useMediaQuery";

const DeleteAudioFromModuleModal = ({
  isOpen,
  testId,
  closeModal,
  audio = {},
  module = "listening",
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isDeleting, setIsDeleting] = useState(false);
  const handleCloseModal = () => !isDeleting && closeModal?.();
  const { getModuleData, updateModule } = useModule(module, testId);
  const { audios } = getModuleData() || {};

  const handleDeleteAudio = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    testsApi
      .deleteAudioFromModule(testId, module, audio.id)
      .then(({ code, audioId, module, message }) => {
        if (code !== "audioDeletedFromModule") throw new Error();

        closeModal?.();
        toast.success(message || "Audio muvaffaqiyatli o'chirildi");
        const filtered = audios.filter(({ _id: id }) => id !== audioId);
        updateModule({ audios: filtered }, testId, module);
      })
      .catch(({ message, code, audioId, module }) => {
        if (code === "audioNotFound") {
          toast.success("Audio muvaffaqiyatli o'chirildi");
          const filtered = audios.filter(({ _id: id }) => id !== audioId);
          return updateModule({ audios: filtered }, testId, module);
        }

        toast.error(message || "Audioni yuklashda xatolik yuz berdi");
      })
      .finally(() => setIsDeleting(false));
  };

  const content = {
    title: "Audioni o'chirish",
    description: (
      <>
        Haqiqatdan ham{" "}
        <b className="font-medium text-black">{audio?.index}-audio</b>ni
        o'chirmoqchimisiz?
      </>
    ),
    body: (
      <Body
        audio={audio}
        isDeleting={isDeleting}
        close={handleCloseModal}
        onClick={handleDeleteAudio}
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

const Body = ({ close, isDeleting, onClick, audio }) => {
  return (
    <div className="space-y-5">
      {audio && (
        <div className="flex justify-center w-full">
          <audio
            controls
            src={audio.url}
            className="w-full bg-gray-100 rounded-md"
          />
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

        <Button
          autoFocus
          type="submit"
          className="w-32"
          onClick={onClick}
          disabled={isDeleting}
        >
          O'chirish
        </Button>
      </div>
    </div>
  );
};

export default DeleteAudioFromModuleModal;
