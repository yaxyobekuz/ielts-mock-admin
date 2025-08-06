import { useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

// Components
import Icon from "../components/Icon";

// Hooks
import useStore from "../hooks/useStore";

// Icons
import penIcon from "../assets/icons/pen.svg";

// Data
import questionsType from "../data/questionsType";

const questionsMap = {};
questionsType.forEach((q) => (questionsMap[q.value] = q.component));

const Listening = () => {
  const location = useLocation();
  const { partNumber } = useParams();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const { getState } = useStore(pathSegments[3]);
  const { parts } = getState();

  // Calculate current part and cumulative question count
  const { currentPart, cumulativeQuestions } = useMemo(() => {
    const partNum = parseInt(partNumber);
    const part = parts.find((p) => p.number === partNum);
    const cumulative = parts
      .slice(0, partNum - 1)
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
          <h1 className="mb-1 font-bold">Part {partNumber}</h1>
          <p>{description || "Description not found!"}</p>
        </div>

        {/* Sections content */}
        <div className="w-full">
          {sections?.map((section, index) => {
            const prevSectionsTotalQuestionsCount = sections
              .slice(0, index)
              .reduce((acc, sec) => acc + sec.questionsCount, 0);

            return (
              <Section
                index={index}
                section={section}
                partNumber={partNumber}
                pathSegments={pathSegments}
                key={`${section.questionType}-${index}`}
                initialQuestionNumber={
                  prevSectionsTotalQuestionsCount + cumulativeQuestions + 1
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
  section,
  partNumber,
  pathSegments,
  initialQuestionNumber,
}) => {
  const { title, description, questionType, content } = section;
  const QuestionComponent = questionsMap[questionType];

  return (
    <section className="mb-6 px-5 py-4 bg-gray-50 rounded-xl border">
      <div className="flex items-start justify-between gap-5">
        <div>
          <h2 className="font-bold mb-2">{title}</h2>
          <p className="mb-4">{description}</p>
        </div>

        {/* Edit button */}
        <Link
          to={`/edit/${pathSegments[3]}/${partNumber}/${questionType}/${index}`}
          className="flex items-center justify-center gap-3.5 h-9 px-5 bg-blue-500 rounded-md text-white"
        >
          <span>Tahrirlash</span>
          <Icon src={penIcon} alt="Pen" className="size-5" />
        </Link>
      </div>

      {QuestionComponent ? (
        <QuestionComponent {...content} initialNumber={initialQuestionNumber} />
      ) : (
        <div className="bg-gray-50 border rounded p-4 text-yellow-800">
          Unknown question type: {questionType}
        </div>
      )}
    </section>
  );
};

export default Listening;
