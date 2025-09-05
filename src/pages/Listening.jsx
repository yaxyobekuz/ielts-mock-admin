// React
import { useMemo } from "react";

// Components
import Icon from "../components/Icon";

// Hooks
import useModule from "../hooks/useModule";

// Icons
import penIcon from "../assets/icons/pen.svg";

// Router
import { Link, useParams } from "react-router-dom";

// Data
import questionsType from "../data/questionsType";
import usePathSegments from "../hooks/usePathSegments";

const questionsMap = {};
questionsType.forEach((q) => (questionsMap[q.value] = q.component));

const Listening = () => {
  const { partNumber, testId } = useParams();
  const { pathSegments, location } = usePathSegments();
  const module = pathSegments[4];

  const { getModuleData } = useModule(module, testId);
  const parts = getModuleData();

  // Calculate current part and cumulative question count
  const { currentPart, cumulativeQuestions } = useMemo(() => {
    const partNum = parseInt(partNumber);
    const part = parts?.find((p) => p.number === partNum);
    const cumulative = parts
      ?.slice(0, partNum - 1)
      .reduce((acc, part) => acc + part.totalQuestions, 0);

    return {
      currentPart: part,
      cumulativeQuestions: cumulative,
    };
  }, [location.pathname, parts, partNumber]);

  const { description, sections } = currentPart || {};

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
    <div className="container">
      <div className="pt-8">
        {/* Part header */}
        <div className="w-full bg-gray-50 py-3 px-4 mb-5 rounded-xl border border-gray-300">
          <h1 className="mb-1 text-base font-bold">Part {partNumber}</h1>
          <p>{description || "Description not found!"}</p>
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

// Individual section component
const Section = ({
  index,
  testId,
  module,
  section,
  partNumber,
  initialQuestionNumber,
}) => {
  const { title, description, type } = section;
  const QuestionComponent = questionsMap[type];

  return (
    <section
      id={`s-${index}`}
      className="mb-6 px-5 py-4 bg-gray-50 rounded-xl border"
    >
      {/* Top */}
      <div className="flex items-start justify-between gap-5">
        {/* Section details */}
        <div className="mb-4 space-y-2">
          <h2 className="font-bold">{title}</h2>
          <p>{description}</p>
        </div>

        {/* Edit button */}
        <Link
          to={`/tests/test/${testId}/edit/${module}/${partNumber}/${type}/${index}`}
          className="flex items-center justify-center gap-3.5 h-9 px-5 bg-blue-500 rounded-md text-white"
        >
          <span>Tahrirlash</span>
          <Icon size={20} src={penIcon} alt="Pen" className="size-5" />
        </Link>
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

export default Listening;
