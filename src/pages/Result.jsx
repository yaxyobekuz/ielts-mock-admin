// Icons
import {
  Pen,
  Mic,
  File,
  Book,
  Clock,
  LinkIcon,
  Headphones,
  ArrowUpRight,
} from "lucide-react";

// Helpers
import {
  formatDate,
  formatTime,
  formatUzPhone,
  appendDotZero,
  extractNumbers,
} from "@/lib/helpers";

// React
import { useEffect } from "react";

// Toast
import { toast } from "@/notification/toast";

// Api
import { resultsApi } from "@/api/results.api";

// Router
import { Link, useParams } from "react-router-dom";

// Hooks
import useObjectStore from "@/hooks/useObjectStore";
import useObjectState from "@/hooks/useObjectState";

// Components
import ProfilePhoto from "@/components/ProfilePhoto";

// Data
import assessmentCriteria from "@/data/assessmentCriteria";

let uniquecriteriaNames = {};
assessmentCriteria.forEach(({ criteria }) => {
  criteria.forEach((arr) => {
    arr.forEach(({ name, key }) => {
      uniquecriteriaNames[key] = name;
    });
  });
});

const Result = () => {
  const { resultId } = useParams();
  const { addEntity, getEntity } = useObjectStore("results");
  const result = getEntity(resultId);

  const { setField, isLoading, hasError } = useObjectState({
    hasError: false,
    isLoading: !result,
  });

  const loadResult = () => {
    setField("hasError");
    setField("isLoading", true);

    resultsApi
      .getById(resultId)
      .then(({ code, result }) => {
        if (code !== "resultFetched") throw new Error();
        addEntity(resultId, result);
      })
      .catch(({ message }) => {
        setField("hasError", true);
        toast.error(message || "Nimadir xato ketdi");
      })
      .finally(() => setField("isLoading"));
  };

  useEffect(() => {
    isLoading && loadResult();
  }, []);

  // Content
  if (isLoading) return <LoadingContent />;
  if (hasError) return <ErrorContent />;
  return <Main {...result} />;
};

const Main = ({
  test,
  link,
  overall,
  student,
  reading,
  writing,
  speaking,
  createdAt,
  listening,
  submission,
  writingCriteria,
  speakingCriteria,
}) => {
  const { firstName = "Foydalanuvchi", lastName = "" } = student || {};

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        {/* Title */}
        <h1>
          {(firstName + lastName).trim()}
          <span className="text-gray-500">ning natijasi</span>
        </h1>

        {/* Date & time */}
        <div title="Vaqt" className="flex items-center gap-1.5">
          <Clock strokeWidth={1.5} size={22} />
          <span>{formatDate(createdAt)} </span>
          <span className="text-gray-500">{formatTime(createdAt)}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-5 w-full">
        {/* Test */}
        <Link
          to={`/tests/${test}`}
          className="btn gap-1.5 h-11 bg-gray-100 py-0 rounded-full hover:bg-gray-200"
        >
          <Book size={20} strokeWidth={1.5} />
          <span>Test</span>
        </Link>

        {/* Result link */}
        <Link
          to={`/submissions/${submission._id}`}
          className="btn gap-1.5 h-11 bg-gray-100 py-0 rounded-full hover:bg-gray-200"
        >
          <File size={20} strokeWidth={1.5} />
          <span>Javoblar</span>
        </Link>

        {/* Invite link */}
        <Link
          to={`/links/${link}`}
          className="btn gap-1.5 h-11 bg-gray-100 py-0 rounded-full hover:bg-gray-200"
        >
          <LinkIcon size={20} strokeWidth={1.5} />
          <span>Taklif havolasi</span>
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {/* Profile */}
        <Profile student={student || {}} />

        {/* Score */}
        <section className="relative overflow-hidden w-full h-auto bg-gray-100 bg-cover bg-no-repeat aspect-square rounded-3xl p-5">
          {/* Title */}
          <h2 className="mb-5 text-xl font-medium">Ballar</h2>

          <div className="space-y-3.5">
            {/* Listening */}
            <div className="flex items-center gap-1.5">
              <Headphones strokeWidth={1.5} className="shrink-0" size={20} />
              <div className="flex items-center justify-between w-full">
                <span>Listening </span>
                <span className="text-gray-600">
                  {appendDotZero(listening)}
                </span>
              </div>
            </div>

            {/* Reading */}
            <div className="flex items-center gap-1.5">
              <Book strokeWidth={1.5} className="shrink-0" size={20} />
              <div className="flex items-center justify-between w-full">
                <span>Reading </span>
                <span className="text-gray-600">{appendDotZero(reading)}</span>
              </div>
            </div>

            {/* Writing */}
            <div className="flex items-center gap-1.5">
              <Pen strokeWidth={1.5} className="shrink-0" size={20} />
              <div className="flex items-center justify-between w-full">
                <span>Writing </span>
                <span className="text-gray-600">{appendDotZero(writing)}</span>
              </div>
            </div>

            {/* Speaking */}
            <div className="flex items-center gap-1.5">
              <Mic strokeWidth={1.5} className="shrink-0" size={20} />
              <div className="flex items-center justify-between w-full">
                <span>Speaking </span>
                <span className="text-gray-600">{appendDotZero(speaking)}</span>
              </div>
            </div>
          </div>

          {/* Overall */}
          <div className="flex items-center justify-center absolute inset-x-0 bottom-8 w-full h-12 bg-red-500 font-semibold text-white shadow-md text-xl">
            Umumiy {appendDotZero(overall)}
          </div>
        </section>

        {/* Speaking criteria */}
        <section className="relative overflow-hidden w-full h-auto bg-gray-100 bg-cover bg-no-repeat aspect-square rounded-3xl p-5">
          {/* Title */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-medium">Speaking</h2>
            <p className="text-lg">{appendDotZero(speaking)}</p>
          </div>

          <div className="space-y-1.5">
            {Object.keys(speakingCriteria || {}).map((key) => {
              return (
                <div
                  key={key}
                  className="flex items-center justify-between w-full"
                >
                  <span>{uniquecriteriaNames[key]}</span>
                  <span className="text-gray-600">
                    {appendDotZero(speakingCriteria[key])}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Writing criteria */}
        <section className="relative overflow-hidden w-full h-auto bg-gray-100 bg-cover bg-no-repeat aspect-square rounded-3xl p-5">
          {/* Title */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-medium">Writing</h2>
            <p className="text-lg">{appendDotZero(writing)}</p>
          </div>

          <div className="space-y-5 max-h-[calc(100%-48px)] pr-1.5 overflow-y-auto scroll-y-primary">
            {Object.keys(writingCriteria || {}).map((task) => {
              const taskCriteria = writingCriteria[task];
              return (
                <div key={task} className="space-y-1.5">
                  <h3 className="font-semibold">Task {extractNumbers(task)}</h3>

                  {Object.keys(taskCriteria || {}).map((key) => {
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between w-full"
                      >
                        <span>{uniquecriteriaNames[key]}</span>
                        <span className="text-gray-600">
                          {appendDotZero(taskCriteria[key])}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

const Profile = ({ student }) => (
  <section className="flex flex-col justify-between relative overflow-hidden w-full h-auto bg-gray-100 bg-cover bg-no-repeat aspect-square rounded-3xl">
    {/* Top */}
    <div className="flex items-center justify-end p-5 z-10">
      <Link
        to={`/students/${student._id}`}
        title="Foydalanuvchi profili"
        aria-label="Foydalanuvchi profili"
        className="btn size-10 p-0 rounded-full bg-white backdrop-blur-sm"
      >
        <ArrowUpRight size={20} />
      </Link>
    </div>

    {/* Bottom */}
    <div className="z-10 w-full p-5 mt-auto bg-gradient-to-b from-transparent to-black">
      {/* Full name */}
      <h2 className="mb-3 truncate capitalize text-xl font-medium text-white">
        {student.firstName || "Foydalanuvchi"} {student.lastName}
      </h2>

      <div className="flex items-center justify-between">
        {/* Role */}
        <span className="capitalize shrink-0 text-gray-200">
          {student.role || "Noma'lum"}
        </span>

        {/* Phone */}
        <a href={`tel:+${student.phone}`} className="shrink-0 text-gray-200">
          {formatUzPhone(student.phone || 998000000000)}
        </a>
      </div>
    </div>

    {/* Photo */}
    <ProfilePhoto
      user={student}
      photoSize="medium"
      className="absolute inset-0 z-0 size-full text-9xl"
    />
  </section>
);

const LoadingContent = () => {
  return (
    <div className="container py-8 space-y-6">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1>Foydalanuvchining javoblari</h1>

        <div className="btn w-52 h-6 bg-gray-100 py-0 rounded-full animate-pulse" />
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-5">
        <div className="btn w-24 h-11 bg-gray-100 py-0 rounded-full" />
        <div className="btn w-32 h-11 bg-gray-100 py-0 rounded-full" />
        <div className="btn w-40 h-11 bg-gray-100 py-0 rounded-full" />
      </div>

      {/* Grid */}
      <ul className="grid grid-cols-4 gap-5 animate-pulse">
        {Array.from({ length: 4 }, (_, index) => (
          <li
            key={index}
            className="h-auto aspect-square bg-gray-100 rounded-3xl"
          />
        ))}
      </ul>
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

export default Result;
