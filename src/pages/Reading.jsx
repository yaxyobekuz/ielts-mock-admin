// React
import { useMemo } from "react";

// Components
import Icon from "@/components/Icon";

// Icons
import { Trash } from "lucide-react";
import penIcon from "@/assets/icons/pen.svg";

// Data
import questionsType from "@/data/questionsType";

// Router
import { Link, useParams } from "react-router-dom";

// Hooks
import useModal from "@/hooks/useModal";
import useModule from "@/hooks/useModule";
import usePermission from "@/hooks/usePermission";
import usePathSegments from "@/hooks/usePathSegments";

// Components
import Button from "@/components/form/Button";
import ModulePartHeader from "@/components/ModulePartHeader";
import RichTextPreviewer from "@/components/RichTextPreviewer";

const questionsMap = {};
questionsType.forEach((q) => (questionsMap[q.value] = q.component));
const TextComponent = questionsMap["text"];

const Reading = () => {
  const { partNumber, testId } = useParams();
  const { pathSegments } = usePathSegments();
  const module = pathSegments[3];

  const { getModuleData } = useModule(module, testId);
  const { parts, duration } = getModuleData() || {};

  // Permissions
  const { checkPermission } = usePermission();
  const canEditTest = checkPermission("canEditTest");

  // Calculate current part and cumulative question count
  const { currentPart, cumulativeQuestions } = useMemo(() => {
    const partNum = parseInt(partNumber);
    const part = parts?.find((p) => p.number === partNum);
    const cumulative = parts
      ?.slice(0, partNum - 1)
      ?.reduce((acc, part) => acc + part.totalQuestions, 0);

    return {
      currentPart: part,
      cumulativeQuestions: cumulative,
    };
  }, [parts, partNumber, module]);

  const { sections, text } = currentPart || {};

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
      <div className="grid grid-cols-2 gap-3.5 pb-5">
        {/* Part text */}
        <div className="w-full bg-gray-50 p-5 rounded-xl border">
          {/* Edit button */}
          <EditButton
            disabled={!canEditTest}
            className="max-w-max ml-auto"
            to={`/tests/${testId}/edit/${module}/${partNumber}/part-text`}
          />

          <TextComponent text={text} initialNumber={0} />
        </div>

        {/* Sections content */}
        <div className="w-full">
          {sections?.map((section, index) => {
            const prevSectionsTotalQuestions = sections
              .slice(0, index)
              .reduce((acc, sec) => acc + sec.questionsCount, 0);

            return (
              <Section
                index={index}
                module={module}
                testId={testId}
                section={section}
                canEdit={canEditTest}
                partNumber={partNumber}
                key={`${section.questionType}-${index}`}
                initialQuestionNumber={
                  prevSectionsTotalQuestions + cumulativeQuestions + 1
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Section = ({
  index,
  testId,
  module,
  section,
  canEdit,
  partNumber,
  initialQuestionNumber,
}) => {
  const { description, type, _id } = section;
  const QuestionComponent = questionsMap[type];
  const { openModal } = useModal("deleteSection");

  return (
    <section
      id={`s-${index}`}
      className="mb-6 px-5 py-4 bg-gray-50 rounded-xl border last:mb-0"
    >
      {/* Top */}
      <div className="flex items-start justify-between gap-5">
        {/* Section details */}
        <div className="mb-4 space-y-2">
          <h2 className="font-bold">
            Questions {initialQuestionNumber} -{" "}
            {initialQuestionNumber + section.questionsCount - 1}{" "}
            <span className="font-normal text-gray-500">({section.type})</span>
          </h2>

          <RichTextPreviewer text={description} />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3.5">
          {/* Edit button */}
          <EditButton
            disabled={!canEdit}
            to={`/tests/${testId}/edit/${module}/${partNumber}/${type}/${index}`}
          />

          {/* Delete section */}
          <Button
            variant="danger"
            disabled={!canEdit}
            className="size-9 !p-0"
            title="Bo'limni o'chirish"
            aria-label="Bo'limni o'chirish"
            onClick={() =>
              canEdit &&
              openModal({ partNumber, testId, sectionId: _id, module })
            }
          >
            <Trash size={20} />
          </Button>
        </div>
      </div>

      {/* Main */}
      {QuestionComponent ? (
        <QuestionComponent {...section} initialNumber={initialQuestionNumber} />
      ) : (
        <div className="bg-gray-50 border rounded p-4 text-yellow-800">
          Unknown question type: {type}
        </div>
      )}
    </section>
  );
};

export const EditButton = ({ to, className = "", disabled }) => {
  const Tag = disabled ? "p" : Link;
  return (
    <Tag
      to={disabled ? undefined : to}
      className={`${className} ${
        disabled ? "opacity-50" : ""
      } flex items-center justify-center gap-3.5 h-9 px-5 bg-blue-500 rounded-md text-white`}
    >
      <span>Tahrirlash</span>
      <Icon size={20} src={penIcon} alt="Pen" className="size-5" />
    </Tag>
  );
};

export default Reading;
