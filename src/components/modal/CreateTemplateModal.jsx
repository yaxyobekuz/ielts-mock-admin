// React
import { useState } from "react";

// Components
import Input from "../form/Input";
import Button from "../form/Button";

// Components
import ImageUploader from "../ImageUploader";

// Toast
import { toast } from "@/notification/toast";

// Api
import { templatesApi } from "@/api/templates.api";

// Hooks
import useModal from "@/hooks/useModal";
import useMediaQuery from "@/hooks/useMediaQuery";
import useObjectState from "@/hooks/useObjectState";

// Ui components
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

const CreateTemplateModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 480px)");
  const { closeModal, isOpen, data } = useModal("createTemplate");

  const testId = data?.testId;
  const handleCloseModal = () => !isLoading && closeModal?.();

  const content = {
    title: "Shablon yaratish",
    description: `Shablon yaratish uchun sarlavhani kiritib, kamida bitta rasm yuklang.`,
    body: (
      <Body
        testId={testId}
        isLoading={isLoading}
        close={handleCloseModal}
        setIsLoading={setIsLoading}
      />
    ),
  };

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={handleCloseModal}>
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
    <Drawer open={isOpen} onOpenChange={handleCloseModal}>
      <DrawerContent className="px-5 pb-5 space-y-5">
        {/* Header */}
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
          <DialogDescription>{content.description}</DialogDescription>
        </DialogHeader>

        {/* Body */}
        {content.body}
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({ close, isLoading, setIsLoading, testId }) => {
  const { progress, images, setField, title, description, step, banner } =
    useObjectState({
      step: 1,
      title: "",
      images: [],
      progress: 0,
      banner: null,
      description: "",
    });

  const handleCreate = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setField("progress", 0);

    const onUploadProgress = (event) => {
      if (event.total) {
        const percent = Math.round((event.loaded * 100) / event.total);
        setField("progress", percent);
      }
    };

    let success = false;
    const formData = new FormData();
    formData.append("testId", testId);
    formData.append("title", title?.trim());
    formData.append("description", description?.trim());

    if (banner) formData.append("banner", banner);
    for (const img of images) formData.append("images", img);

    templatesApi
      .create(formData, { onUploadProgress })
      .then(({ code, message }) => {
        if (code !== "templateCreated") throw new Error();
        success = true;
        toast.success(message || "Shablon yaratildi");
      })
      .catch(({ message }) => toast.error(message || "Nimadir xato ketdi"))
      .finally(() => {
        success && close();
        setIsLoading(false);
      });
  };

  const allowNextStep = images.length && title?.trim() && description?.trim();

  return (
    <form onSubmit={handleCreate} className="space-y-5">
      {/* Step 1 */}
      {step === 1 && (
        <>
          <Input
            required
            size="lg"
            border={true}
            value={title}
            variant="gray"
            maxLength={32}
            label="Sarlavha"
            name="template-name"
            placeholder="Sarlavhani kiritng"
            onChange={(value) => setField("title", value)}
          />

          <Input
            required
            size="lg"
            label="Izoh"
            border={true}
            variant="gray"
            type="textarea"
            maxLength={144}
            value={description}
            name="template-description"
            placeholder="Izohni kiritng"
            onChange={(value) => setField("description", value)}
          />

          <ImageUploader
            multiple
            required
            progress={progress}
            initialFiles={images}
            isUploading={isLoading}
            onChange={(images) => setField("images", images)}
          />

          {/* Action buttons */}
          <div className="flex justify-end gap-5 w-full">
            <Button
              type="button"
              className="w-32"
              variant="neutral"
              onClick={() => close()}
            >
              Bekor qilish
            </Button>

            <Button
              type="button"
              className="w-32"
              disabled={!allowNextStep}
              onClick={() => allowNextStep && setField("step", 2)}
            >
              Keyingisi
            </Button>
          </div>
        </>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <>
          <ImageUploader
            progress={progress}
            isUploading={isLoading}
            label="Banner (ixtiyoriy)"
            onChange={(banners) => setField("banner", banners[0])}
          />

          {/* Action buttons */}
          <div className="flex justify-end gap-5 w-full">
            <Button
              type="button"
              className="w-32"
              variant="neutral"
              onClick={() => setField("step", 1)}
            >
              Oldingi
            </Button>

            <Button type="submit" disabled={isLoading} className="w-32">
              Yaratish
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default CreateTemplateModal;
