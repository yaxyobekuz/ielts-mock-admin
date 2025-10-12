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
import { resultsApi } from "@/api/results.api";

// Hooks
import useModal from "@/hooks/useModal";
import useStore from "@/hooks/useStore";
import useMediaQuery from "@/hooks/useMediaQuery";
import useObjectState from "@/hooks/useObjectState";
import useLocalStorage from "@/hooks/useLocalStorage";

// Data
import assessmentCriteria from "@/data/assessmentCriteria";

const CreateResultModal = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { closeModal, isOpen, data } = useModal("createResult");

  const content = {
    title: "Javoblarni baholash",
    description: `Javoblarni baholash uchun barcha ballarni kiriting`,
    body: <Body close={closeModal} submissionId={data?.submissionId} />,
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

const Body = ({ close, submissionId }) => {
  // Local storage
  const { updateProperty, getProperty } = useLocalStorage("scores");
  const formDataFromStorage = getProperty(submissionId) || {};

  // Results
  const {
    getProperty: getResultsProperty,
    updateProperty: updateResultsProperty,
  } = useStore("results");
  const resultsData = getResultsProperty("data") || [];
  const isResultsLoading = getResultsProperty("isLoading");

  // Submission
  const { getProperty: getSubmission, updateProperty: updateSubmission } =
    useStore("submission");
  const submission = getSubmission(submissionId);

  const { setField, formData, isLoading } = useObjectState({
    isLoading: false,
    formData: formDataFromStorage,
  });

  const handleChange = (module, partIndex, key, value) => {
    const updatedFormData = { ...formData };

    if (!updatedFormData[module]) {
      updatedFormData[module] = [];
    }

    if (!updatedFormData[module][partIndex]) {
      updatedFormData[module][partIndex] = {};
    }

    updatedFormData[module][partIndex][key] = value;

    setField("formData", updatedFormData);
    updateProperty(submissionId, updatedFormData);
  };

  const handleCreateResult = (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!submissionId) {
      return toast.error("Javoblar ID raqami mavjud emas");
    }

    setField("isLoading", true);

    toast.promise(
      resultsApi
        .create({ ...formData, submissionId })
        .then(({ code, result }) => {
          if (code !== "resultCreated") throw new Error();

          close();
          updateProperty(submissionId, {});
          updateSubmission(submissionId, {
            ...submission,
            isScored: true,
            result: result._id,
          });

          if (isResultsLoading) return;
          updateResultsProperty("data", [result, ...resultsData]);
        })
        .finally(() => setField("isLoading", false)),
      {
        error: "Yuborilmadi!",
        success: "Yuborildi!",
        loading: "Yuborilmoqda...",
      }
    );
  };

  return (
    <form onSubmit={handleCreateResult} className="space-y-5">
      <div className="max-h-96 overflow-y-auto scroll-y-primary space-y-5 pr-1.5 scroll-smooth">
        {assessmentCriteria.map(({ name: module, criteria }, index) => (
          <div key={index} className="space-y-3.5">
            {/* Module */}
            <div className="w-full bg-white sticky top-0">
              <strong className="capitalize font-semibold">{module}</strong>
            </div>

            {/* Criteria */}
            {criteria.map((criterion, taskIndex) => (
              <div
                key={taskIndex}
                className="space-y-3.5 pb-3.5 border-b border-gray-300 last:border-b-0 last:pb-0"
              >
                {criterion.map(({ name, key }, index) => (
                  <div key={index} className="flex gap-3.5">
                    <label
                      children={name}
                      htmlFor={module + taskIndex + name}
                      className="flex items-center w-full h-10 bg-gray-50 px-3.5 border border-gray-300 rounded-lg text-sm cursor-pointer hover:bg-gray-100"
                    />

                    <Input
                      min={0}
                      max={9}
                      required
                      size="lg"
                      step={0.5}
                      border={true}
                      type="number"
                      variant="gray"
                      autoComplete="off"
                      placeholder="0 - 9"
                      className="w-24 shrink-0"
                      id={module + taskIndex + name}
                      name={module + taskIndex + name}
                      value={formData?.[module]?.[taskIndex]?.[key] || ""}
                      onChange={(value) =>
                        handleChange(module, taskIndex, key, value?.slice(0, 3))
                      }
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

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

        <Button disabled={isLoading} className="w-32">
          Yuborish
        </Button>
      </div>
    </form>
  );
};

export default CreateResultModal;
