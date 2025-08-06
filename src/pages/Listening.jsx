import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";

import questionsType from "../data/questionsType";

// Hooks
import useStore from "../hooks/useStore";

const questionsMap = {};
questionsType.forEach((q) => (questionsMap[q.value] = q.component));

const Listening = () => {
  const location = useLocation();
  const { partNumber } = useParams();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const { getState, dispatch } = useStore(pathSegments[3]);
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
                section={section}
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
const Section = ({ section, initialQuestionNumber }) => {
  const { title, description, questionType, content } = section;

  const QuestionComponent = questionsMap[questionType];

  return (
    <section className="mb-6 px-5 py-4 bg-gray-50 rounded-xl border">
      <h2 className="font-bold mb-2">{title}</h2>
      <p className="mb-4">{description}</p>
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
