// Components
import Icon from "@/components/Icon";

// Router
import { Link } from "react-router-dom";

// Hooks
import useModal from "@/hooks/useModal";

// Icons
import penIcon from "@/assets/icons/pen.svg";

// Components
import Button from "@/components/form/Button";

// Icons
import { Settings, Trash } from "lucide-react";

const ModulePartHeader = ({
  part,
  module,
  testId,
  duration,
  partNumber,
  canEditTest,
}) => {
  const { openModal } = useModal("deletePart");

  // Delete part modal handler
  const handleOpenDeletePartModal = () => {
    if (!canEditTest) return;
    openModal({ testId, module, partNumber, partId: part._id });
  };

  // Edit part modal handler
  const handleOpenEditPartModal = () => {
    if (!canEditTest) return;
    openModal(
      { testId, module, partNumber, partId: part._id, ...part },
      "editPart"
    );
  };

  return (
    <div className="flex gap-5 mb-5">
      {/* Part header */}
      <div className="flex items-center justify-between w-full h-20 bg-gray-100 py-3 px-4 rounded-xl border border-gray-200">
        <div>
          <h1 className="mb-1 text-base font-bold">
            {part.title ? part.title : `Qism ${partNumber}`}
          </h1>
          <p>{part.description ? part.description : `Qism izohi`}</p>
        </div>

        <div className="flex items-center gap-3.5">
          <p className="text-gray-500">{duration} minutes</p>

          <Button
            disabled={!canEditTest}
            className="gap-3.5 rounded-md"
            onClick={handleOpenEditPartModal}
          >
            <span>Tahrirlash</span>
            <Icon size={20} src={penIcon} alt="Pen" className="size-5" />
          </Button>

          {module !== "writing" && (
            <Button
              variant="danger"
              className="size-9 !p-0"
              disabled={!canEditTest}
              onClick={handleOpenDeletePartModal}
              title={`Part ${partNumber}ni o'chirish`}
              aria-label={`Part ${partNumber}ni o'chirish`}
            >
              <Trash size={20} />
            </Button>
          )}
        </div>
      </div>

      {/* Edit module */}
      {canEditTest && (
        <Link
          to={`/tests/${testId}/edit/${module}`}
          className="group btn size-20 aspect-square bg-gray-100 rounded-xl border border-gray-200 hover:bg-gray-200 hover:text-blue-500"
        >
          <Settings
            size={24}
            strokeWidth={1.5}
            className="transition-all duration-200 group-hover:rotate-[360deg]"
          />
        </Link>
      )}
    </div>
  );
};

export default ModulePartHeader;
