// Icons
import {
  X,
  Dot,
  Star,
  Book,
  Check,
  Clock,
  Trophy,
  LinkIcon,
  Activity,
  FileCheck,
} from "lucide-react";

// Helpers
import {
  formatDate,
  formatTime,
  getIeltsScore,
  isEqualStringArray,
} from "@/lib/helpers";

// Components
import Nav from "@/components/Nav";

// React
import { useEffect, useMemo } from "react";

// Toast
import { toast } from "@/notification/toast";

// Router
import { Link, useParams } from "react-router-dom";

// Hooks
import useModal from "@/hooks/useModal";
import usePermission from "@/hooks/usePermission";
import useObjectStore from "@/hooks/useObjectStore";
import useObjectState from "@/hooks/useObjectState";

// Api
import { submissionsApi } from "@/api/submissions.api";

// Parent contents
const Submission = () => {
  const { submissionId } = useParams();
  const { addEntity, getEntity } = useObjectStore("submissions");
  const submission = getEntity(submissionId);

  // Permissions
  const { checkPermission } = usePermission();
  const canCreateResult = checkPermission("canCreateResult");

  const { setField, isLoading, hasError } = useObjectState({
    hasError: false,
    isLoading: !submission,
  });

  const loadSubmission = () => {
    setField("hasError");
    setField("isLoading", true);

    submissionsApi
      .getById(submissionId)
      .then(({ code, submission }) => {
        if (code !== "submissionFetched") throw new Error();
        addEntity(submissionId, submission);
      })
      .catch(({ message }) => {
        setField("hasError", true);
        toast.error(message || "Nimadir xato ketdi");
      })
      .finally(() => setField("isLoading"));
  };

  useEffect(() => {
    isLoading && loadSubmission();
  }, []);

  // Content
  if (isLoading) return <LoadingContent />;
  if (hasError) return <ErrorContent />;
  return <MainContent {...submission} canCreateResult={canCreateResult} />;
};

const MainContent = ({
  test,
  link,
  result,
  student,
  answers,
  _id: id,
  startedAt,
  isScored,
  finishedAt,
  correctAnswers,
  canCreateResult,
}) => {
  const { module = "listening" } = useParams();
  const { openModal } = useModal("createResult");
  const { firstName = "Foydalanuvchi", lastName = "" } = student || {};
  const { setFields, listening, reading } = useObjectState({
    reading: "",
    listening: "",
  });

  const formattedAnswers = useMemo(() => {
    return { listening: {}, reading: {}, writing: {}, ...answers };
  }, [id]);

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        {/* Title */}
        <h1>
          {(firstName + lastName).trim()}
          <span className="text-gray-500">ning javoblari</span>
        </h1>

        <div className="flex items-center gap-5">
          {/* Total parts */}
          <div title="Jami sahifalar" className="flex items-center gap-1.5">
            <Activity strokeWidth={1.5} size={22} />
            <span className={isScored ? "text-green-600" : "text-red-500"}>
              Baholan{isScored ? "" : "ma"}gan
            </span>
          </div>

          {/* Parts count */}
          <div title="Vaqt" className="flex items-center gap-1.5">
            <Clock strokeWidth={1.5} size={22} />
            <span>{formatDate(startedAt)} </span>
            <span className="text-gray-500">
              {formatTime(startedAt)} - {formatTime(finishedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between gap-5 w-full">
        {/* Left */}
        <Nav
          pagePathIndex={2}
          links={[
            {
              label: "Listening",
              link: `submissions/${id}/listening`,
            },
            {
              label: "Reading",
              link: `submissions/${id}/reading`,
            },
            {
              label: "Writing",
              link: `submissions/${id}/writing`,
            },
          ]}
        />

        {/* Right */}
        <div className="flex items-center gap-5">
          {/* Test */}
          <Link
            to={`/tests/${test._id}`}
            className="btn gap-1.5 h-11 bg-gray-100 py-0 rounded-full hover:bg-gray-200"
          >
            <Book size={20} strokeWidth={1.5} />
            <span>Test</span>
          </Link>

          {/* Result link */}
          {result && (
            <Link
              to={`/results/${result}`}
              className="btn gap-1.5 h-11 bg-gray-100 py-0 rounded-full hover:bg-gray-200"
            >
              <FileCheck size={20} strokeWidth={1.5} />
              <span>Natija</span>
            </Link>
          )}

          {/* Evaluate */}
          {!isScored && !result && (
            <button
              disabled={!canCreateResult}
              onClick={() =>
                openModal({ submissionId: id, listening, reading })
              }
              className="btn gap-1.5 h-11 bg-gray-100 py-0 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100"
            >
              <Star size={20} strokeWidth={1.5} />
              <span>Baholash</span>
            </button>
          )}

          {/* Invite link */}
          <Link
            to={`/links/${link}`}
            className="btn gap-1.5 h-11 bg-gray-100 py-0 rounded-full hover:bg-gray-200"
          >
            <LinkIcon size={20} strokeWidth={1.5} />
            <span>Taklif havolasi</span>
          </Link>
        </div>
      </div>

      {/* Answers */}
      {module === "writing" ? (
        <WritingContent answers={formattedAnswers} />
      ) : (
        <TableContent
          module={module}
          onCalcScore={setFields}
          answers={formattedAnswers}
          correctAnswers={correctAnswers}
        />
      )}
    </div>
  );
};

// Table content
const sortArray = (arr) => {
  return arr.sort((a, b) => {
    const getFirstNum = (str) => Number(str.split("-")[0]);
    return getFirstNum(a) - getFirstNum(b);
  });
};

const processAnswersData = (module, answers, correctAnswers) => {
  const correctAnswersMap = sortArray(
    Object.keys(correctAnswers[module] || {})
  );

  let trueAnswers = 0;
  let wrongAnswers = 0;

  const rows = correctAnswersMap.map((key) => {
    const correctAnswer = (() => {
      if (!correctAnswers[module]) return "-";

      if (typeof correctAnswers[module][key] === "object") {
        return correctAnswers[module][key].join(" | ").trim().toLowerCase();
      }

      return (correctAnswers[module][key] || "").trim().toLowerCase();
    })();

    const userAnswer = (() => {
      if (!answers[module]) return "-";

      if (typeof answers[module][key] === "object") {
        return answers[module][key].join(" | ").trim().toLowerCase();
      }

      return (answers[module]?.[key] || "-").trim().toLowerCase();
    })();

    const isCorrect = (() => {
      if (userAnswer === "-" && correctAnswer === "-") return false;

      if (typeof correctAnswers[module][key] === "object") {
        return isEqualStringArray(
          answers[module][key],
          correctAnswers[module][key]
        );
      }

      return userAnswer === correctAnswer;
    })();

    if (typeof correctAnswers[module][key] === "object") {
      const totalAnswers = correctAnswers[module][key]?.length || 1;
      isCorrect
        ? (trueAnswers = totalAnswers + trueAnswers)
        : (wrongAnswers = totalAnswers + wrongAnswers);
    } else {
      isCorrect ? trueAnswers++ : wrongAnswers++;
    }

    return {
      key,
      isCorrect,
      userAnswer,
      correctAnswer,
    };
  });

  return { rows, trueAnswers, wrongAnswers };
};

const TableContent = ({ module, answers, correctAnswers, onCalcScore }) => {
  const { rows, trueAnswers, wrongAnswers } = processAnswersData(
    module,
    answers,
    correctAnswers
  );

  useEffect(() => {
    const score = {};
    ["listening", "reading"].forEach((mod) => {
      const { trueAnswers } = processAnswersData(mod, answers, correctAnswers);
      score[mod] = getIeltsScore(trueAnswers, mod);
    });

    onCalcScore(score);
  }, []);

  return (
    <>
      {/* Info */}
      <div className="flex items-center justify-center gap-5">
        {/* Score */}
        <div className="flex items-center gap-1.5">
          <Trophy size={20} strokeWidth={1.5} />
          <span>{getIeltsScore(trueAnswers, module)} ball</span>
        </div>

        {/* True */}
        <div className="flex items-center gap-1.5">
          <Dot strokeWidth={8} className="text-green-600" />
          <span>{trueAnswers} ta</span>
        </div>

        {/* False */}
        <div className="flex items-center gap-1.5">
          <Dot strokeWidth={8} className="text-red-500" />
          <span>{wrongAnswers} ta</span>
        </div>
      </div>

      {/* Table */}
      <table className="bg-gray-50 rounded-3xl relative">
        <thead>
          <tr>
            <th className="min-w-20 py-2.5">T/R</th>
            <th className="w-full py-2.5">Foydalanuvchi javobi</th>
            <th className="w-full py-2.5">To'g'ri javob</th>
            <th className="min-w-20 py-2.5">Holat</th>
          </tr>
        </thead>

        <tbody>
          {rows.map(({ key, userAnswer, correctAnswer, isCorrect }) => (
            <tr key={key + module}>
              <td className="min-w-20 py-1.5">{key}</td>
              <td className="w-full py-1.5">{userAnswer}</td>
              <td className="w-full py-1.5">{correctAnswer}</td>
              <td className="flex items-center justify-center min-w-20">
                {isCorrect ? (
                  <Check className="text-green-600" />
                ) : (
                  <X className="text-red-500" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

// Writing content
const WritingContent = ({ answers }) => {
  const answersMap = Object.keys(answers?.writing || {});

  return (
    <ul className="space-y-5">
      {answersMap.map((_, index) => {
        const words = answers.writing[index + 1]?.trim() || "";
        const wordsCount = words.split(" ").length;

        return (
          <li className="bg-gray-100 rounded-3xl p-2">
            {/* Top */}
            <div className="flex items-center justify-between py-1.5 px-2">
              <h3 className="font-semibold">Part {index + 1}</h3>
              <p>{wordsCount} ta so'z</p>
            </div>

            {/* Body */}
            <div className="bg-gray-50 px-2 py-3.5 rounded-2xl">
              <p className="whitespace-break-spaces">{words}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

// Loading & error content
const LoadingContent = () => {
  const { module = "listening" } = useParams();

  return (
    <div className="container py-8 space-y-6">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1>Foydalanuvchining javoblari</h1>

        <div className="flex items-center gap-5 animate-pulse">
          <div className="btn w-36 h-6 bg-gray-100 py-0 rounded-full" />
          <div className="btn w-72 h-6 bg-gray-100 py-0 rounded-full" />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between gap-5 animate-pulse">
        <div className="btn w-72 h-11 bg-gray-100 py-0 rounded-full" />

        <div className="flex items-center gap-5">
          <div className="btn w-24 h-11 bg-gray-100 py-0 rounded-full" />
          <div className="btn w-40 h-11 bg-gray-100 py-0 rounded-full" />
        </div>
      </div>

      {/* Answers */}
      {module === "writing" ? (
        <div className="space-y-6 animate-pulse">
          {/* Parts */}
          <div className="btn w-full h-96 bg-gray-100 py-0 rounded-3xl" />
          <div className="btn w-full h-96 bg-gray-100 py-0 rounded-3xl" />
        </div>
      ) : (
        <div className="space-y-6 animate-pulse">
          {/* Info */}
          <div className="flex items-center justify-center gap-5">
            <div className="btn w-20 h-6 bg-gray-100 py-0 rounded-3xl" />
            <div className="btn w-20 h-6 bg-gray-100 py-0 rounded-3xl" />
            <div className="btn w-20 h-6 bg-gray-100 py-0 rounded-3xl" />
          </div>

          {/* Table */}
          <div className="btn w-full h-[768px] bg-gray-100 py-0 rounded-3xl" />
        </div>
      )}
    </div>
  );
};

const ErrorContent = () => {
  return (
    <div className="container py-8 space-y-6">
      <div>Error</div>
    </div>
  );
};

export default Submission;
