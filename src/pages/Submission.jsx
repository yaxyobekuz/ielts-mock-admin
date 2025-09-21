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
} from "lucide-react";

// React
import { useEffect } from "react";

// Components
import Nav from "@/components/Nav";

// Toast
import { toast } from "@/notification/toast";

// Router
import { Link, useParams } from "react-router-dom";

// Hooks
import useModal from "@/hooks/useModal";
import useStore from "@/hooks/useStore";
import useObjectState from "@/hooks/useObjectState";

// Api
import { submissionsApi } from "@/api/submissions.api";

// Helpers
import { formatDate, formatTime, getIeltsScore } from "@/lib/helpers";

const Submission = () => {
  const { submissionId } = useParams();
  const { getProperty, updateProperty } = useStore("submission");
  const submission = getProperty(submissionId);

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
        updateProperty(submissionId, submission);
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
  return <Main {...submission} />;
};

const Main = ({
  user,
  test,
  link,
  answers,
  _id: id,
  startedAt,
  isChecked,
  finishedAt,
  correctAnswers,
}) => {
  const { module = "listening" } = useParams();
  const { openModal } = useModal("createResult");
  const { firstName = "Foydalanuvchi", lastName = "" } = user || {};

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
            <span className={isChecked ? "text-green-600" : "text-red-500"}>
              Tekshiril{isChecked ? "" : "ma"}gan
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
            to={`/tests/test/${test._id}`}
            className="btn gap-1.5 h-11 bg-gray-100 py-0 rounded-full hover:bg-gray-200"
          >
            <Book size={20} strokeWidth={1.5} />
            <span>Test</span>
          </Link>

          {/* Invite link */}
          <Link
            to={`/links/link/${link}`}
            className="btn gap-1.5 h-11 bg-gray-100 py-0 rounded-full hover:bg-gray-200"
          >
            <LinkIcon size={20} strokeWidth={1.5} />
            <span>Taklif havolasi</span>
          </Link>

          {/* Rating */}
          <button
            onClick={() => openModal({ submissionId: id })}
            className="btn gap-1.5 h-11 bg-gray-100 py-0 rounded-full hover:bg-gray-200"
          >
            <Star size={20} strokeWidth={1.5} />
            <span>Baholash</span>
          </button>
        </div>
      </div>

      {/* Answers */}
      {module === "writing" ? (
        <WritingContent answers={answers} />
      ) : (
        <TableContent
          module={module}
          answers={answers}
          correctAnswers={correctAnswers}
        />
      )}
    </div>
  );
};

const TableContent = ({ module, answers, correctAnswers }) => {
  const correctAnswersMap = Object.keys(correctAnswers[module] || {});

  // Count correct and wrong answers
  let trueAnswers = 0;
  let wrongAnswers = 0;

  const rows = correctAnswersMap.map((_, index) => {
    const correctAnswer = (correctAnswers[module][index + 1] || "")
      .trim()
      .toLowerCase();
    const userAnswer = (answers[module]?.[index + 1] || "Mavjud emas")
      .trim()
      .toLowerCase();

    const isCorrect = userAnswer === correctAnswer;
    isCorrect ? trueAnswers++ : wrongAnswers++;

    return {
      index,
      isCorrect,
      userAnswer,
      correctAnswer,
    };
  });

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
          {rows.map(({ index, userAnswer, correctAnswer, isCorrect }) => (
            <tr key={index + module}>
              <td className="min-w-20 py-1.5">{index + 1}</td>
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
              <p className="whitespace-pre">{words}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const LoadingContent = () => {
  return (
    <div className="container py-8 space-y-6">
      <h1>Foydalanuvchining javoblari</h1>

      {/* Action buttons */}
      <div className="flex items-center justify-between gap-5">
        <div className="btn w-72 h-11 bg-gray-100 py-0 rounded-full" />

        <div className="flex items-center gap-5">
          <div className="btn w-24 h-11 bg-gray-100 py-0 rounded-full" />
          <div className="btn w-40 h-11 bg-gray-100 py-0 rounded-full" />
        </div>
      </div>
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
