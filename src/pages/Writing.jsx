// React
import { useMemo } from "react";

// Router
import { useParams } from "react-router-dom";

// Data
import questionsType from "@/data/questionsType";

// Hooks
import useModule from "@/hooks/useModule";
import usePermission from "@/hooks/usePermission";
import usePathSegments from "@/hooks/usePathSegments";

// Components
import { EditButton } from "./Reading";
import ModulePartHeader from "@/components/ModulePartHeader";

const questionsMap = {};
questionsType.forEach((q) => (questionsMap[q.value] = q.component));
const TextComponent = questionsMap["text"];

const Writing = () => {
  const { partNumber, testId } = useParams();
  const { pathSegments } = usePathSegments();
  const module = pathSegments[3];

  const { getModuleData } = useModule(module, testId);
  const { parts, duration } = getModuleData() || {};

  // Permissions
  const { checkPermission } = usePermission();
  const canEditTest = checkPermission("canEditTest");

  // Calculate current part and cumulative question count
  const { currentPart } = useMemo(() => {
    const partNum = parseInt(partNumber);
    const part = parts?.find((p) => p.number === partNum);

    return { currentPart: part };
  }, [parts, partNumber, module]);

  const { text } = currentPart || {};

  // Return error if part not found
  if (!currentPart) {
    return (
      <div className="container">
        <div className="py-8">
          <div className="w-full bg-red-50 py-3 px-4 mb-5 rounded-xl border border-red-300">
            <p className="text-red-700">Part not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container pt-5">
      <ModulePartHeader
        module={module}
        testId={testId}
        part={currentPart}
        duration={duration}
        partNumber={partNumber}
        canEditTest={canEditTest}
      />

      {/* Main */}
      <div className="w-full bg-gray-50 p-5 mb-5 rounded-xl border">
        {/* Edit button */}
        <EditButton
          disabled={!canEditTest}
          className="max-w-max ml-auto"
          to={`/tests/${testId}/edit/${module}/${partNumber}/part-text`}
        />

        <TextComponent text={text} allowImage initialNumber={0} />
      </div>
    </div>
  );
};

export default Writing;
