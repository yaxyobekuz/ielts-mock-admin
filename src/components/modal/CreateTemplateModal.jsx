// Toast
import { toast } from "@/notification/toast";

// Components
import Input from "../form/Input";
import Select from "../form/Select";
import Button from "../form/Button";
import ImageUploader from "../ImageUploader";
import ResponsiveModal from "../ResponsiveModal";

// Api
import { templatesApi } from "@/api/templates.api";

// Hooks
import useArrayStore from "@/hooks/useArrayStore";
import useObjectState from "@/hooks/useObjectState";
import useObjectStore from "@/hooks/useObjectStore";

const CreateTemplateModal = () => (
  <ResponsiveModal
    name="createTemplate"
    title="Shablon yaratish"
    className="space-y-5 sm:space-y-0"
    description="Shablon yaratish uchun sarlavhani kiritib, kamida bitta rasm yuklang."
  >
    <Content />
  </ResponsiveModal>
);

const Content = ({ close, isLoading, setIsLoading, testId }) => {
  const { updateEntity } = useObjectStore("tests");
  const { updateItemById } = useArrayStore("tests");
  const { progress, images, setField, title, description, step, banner, type } =
    useObjectState({
      step: 1,
      title: "",
      images: [],
      progress: 0,
      banner: null,
      description: "",
      type: "cambridge",
    });

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const onUploadProgress = (event) => {
      if (event.total) {
        const percent = Math.round((event.loaded * 100) / event.total);
        setField("progress", percent);
      }
    };

    setIsLoading(true);
    let success = false;
    setField("progress", 0);
    const formData = new FormData();

    formData.append("type", type);
    formData.append("testId", testId);
    formData.append("title", title?.trim());
    formData.append("description", description?.trim());

    if (banner) formData.append("banner", banner);
    for (const img of images) formData.append("images", img);

    templatesApi
      .create(formData, { onUploadProgress })
      .then(({ code, message, template }) => {
        if (code !== "templateCreated") throw new Error();

        success = true;
        toast.success(message);

        // Update stores
        const updates = { isTemplate: true, template: template._id };
        updateEntity(testId, updates);
        updateItemById(testId, updates);
      })
      .catch(({ message }) => toast.error(message || "Nimadir xato ketdi"))
      .finally(() => {
        success && close();
        setIsLoading(false);
      });
  };

  const allowNextStep = images.length && title?.trim() && description?.trim();

  return (
    <form onSubmit={handleCreateTemplate} className="space-y-5">
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

          <Select
            required
            size="lg"
            value={type}
            label="Turi"
            border={true}
            variant="gray"
            name="template-type"
            onChange={(value) => setField("type", value)}
            options={[
              {
                label: "Cambridge",
                value: "cambridge",
              },
              {
                label: "Prediction",
                value: "prediction",
              },
              {
                label: "Custom",
                value: "custom",
              },
            ]}
          />

          <Input
            required
            size="lg"
            label="Izoh"
            border={true}
            variant="gray"
            type="textarea"
            maxLength={244}
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
            initialFiles={banner ? [banner] : []}
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

            <Button disabled={isLoading} className="w-32">
              Yaratish
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default CreateTemplateModal;
