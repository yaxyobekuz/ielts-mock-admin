// Components
import Input from "../form/Input";
import Button from "../form/Button";

// Toast
import { toast } from "@/notification/toast";

// Api
import { resultsApi } from "@/api/results.api";

// Components
import ResponsiveModal from "../ResponsiveModal";

// Hooks
import useStore from "@/hooks/useStore";
import useObjectState from "@/hooks/useObjectState";
import useLocalStorage from "@/hooks/useLocalStorage";

// Data
import assessmentCriteria from "@/data/assessmentCriteria";

const CreateResultModal = () => (
  <ResponsiveModal
    name="createResult"
    title="Javoblarni baholash"
    description="Javoblarni baholash uchun barcha ballarni kiriting. Har bir mezon uchun ballarni 0 dan 9 gacha bo'lgan oraliqda belgilang."
  >
    <Content />
  </ResponsiveModal>
);

const Content = ({
  close,
  isLoading,
  submissionId,
  setIsLoading,
  reading: initialReading,
  listening: initialListening,
}) => {
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

  const { setField, formData, listening, reading } = useObjectState({
    formData: formDataFromStorage,
    reading: initialReading ?? "",
    listening: initialListening ?? "",
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

    setIsLoading(true);
    let success = false;

    resultsApi
      .create({ ...formData, submissionId, listening, reading })
      .then(({ code, result }) => {
        if (code !== "resultCreated") throw new Error();

        success = true;
        updateProperty(submissionId, {});
        updateSubmission(submissionId, {
          ...submission,
          isScored: true,
          result: result._id,
        });

        toast.success("Javoblar baholandi");

        if (isResultsLoading) return;
        updateResultsProperty("data", [result, ...resultsData]);
      })
      .catch(({ message }) => toast.error(message || "Nimadir xato ketdi"))
      .finally(() => {
        success && close();
        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={handleCreateResult} className="space-y-5">
      <div className="max-h-[512px] overflow-y-auto scroll-y-primary space-y-5 pr-1.5 scroll-smooth">
        {/* Listening */}
        <div className="space-y-3.5">
          <div className="w-full bg-white">
            <strong className="capitalize font-semibold">Listening</strong>
          </div>

          <div className="flex gap-3.5">
            <label
              htmlFor="listening"
              children="Umumiy baho"
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
              name="listening"
              value={listening}
              autoComplete="off"
              placeholder="0 - 9"
              className="w-24 shrink-0"
              onChange={(value) => setField("listening", value)}
            />
          </div>
        </div>

        {/* Reading */}
        <div className="space-y-3.5">
          <div className="w-full bg-white">
            <strong className="capitalize font-semibold">Reading</strong>
          </div>

          <div className="flex gap-3.5">
            <label
              htmlFor="reading"
              children="Umumiy baho"
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
              name="reading"
              value={reading}
              autoComplete="off"
              placeholder="0 - 9"
              className="w-24 shrink-0"
              onChange={(value) => setField("reading", value)}
            />
          </div>
        </div>

        {/* Writing & Speaking */}
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
          className="w-32"
          variant="neutral"
          onClick={() => close()}
        >
          Bekor qilish
        </Button>

        <Button disabled={isLoading} className="w-32">
          Baholash
        </Button>
      </div>
    </form>
  );
};

export default CreateResultModal;
