// React
import { useMemo } from "react";

// Components
import Icon from "../components/Icon";

// Hooks
import useModule from "../hooks/useModule";

// Icons
import { Settings } from "lucide-react";
import penIcon from "../assets/icons/pen.svg";

// Router
import { Link, useParams } from "react-router-dom";

// Data
import questionsType from "../data/questionsType";
import usePathSegments from "../hooks/usePathSegments";

const questionsMap = {};
questionsType.forEach((q) => (questionsMap[q.value] = q.component));
const TextComponent = questionsMap["text"];

const Writing = () => {
  const { partNumber, testId } = useParams();
  const { pathSegments } = usePathSegments();
  const module = pathSegments[3];

  const { getModuleData } = useModule(module, testId);
  const parts = getModuleData();

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
          <div className="w-full bg-red-50 py-3 px-4 mb-5 rounded-xl border border-gray-200 border-red-300">
            <p className="text-red-700">Part not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="pt-5">
        <div className="flex gap-5 mb-5">
          {/* Part header */}
          <div className="w-full h-20 bg-gray-100 py-3 px-4 rounded-xl border border-gray-200">
            <h1 className="mb-1 text-base font-bold">Part {partNumber}</h1>
            <p>
              You should spend about 20 minutes on this task. Write at least 150
              words
            </p>
          </div>

          {/* Edit module */}
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
        </div>

        {/* Main */}
        <div className="w-full bg-gray-50 p-5 mb-5 rounded-xl border">
          {/* Edit button */}
          <EditButton
            className="max-w-max ml-auto"
            to={`/tests/${testId}/edit/${module}/${partNumber}/part-text`}
          />

          <TextComponent text={text} allowImage initialNumber={0} />
        </div>
      </div>
    </div>
  );
};

const EditButton = ({ to, className = "" }) => (
  <Link
    to={to}
    className={`${className} flex items-center justify-center gap-3.5 h-9 px-5 bg-blue-500 rounded-md text-white`}
  >
    <span>Tahrirlash</span>
    <Icon size={20} src={penIcon} alt="Pen" className="size-5" />
  </Link>
);

export default Writing;
