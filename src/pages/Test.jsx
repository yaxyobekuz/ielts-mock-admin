import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

// Api
import { testsApi } from "@/api/tests.api";

// Toast
import { toast } from "@/notification/toast";

// Hooks
import useObjectState from "@/hooks/useObjectState";

// Helpers
import { formatDate, formatTime } from "@/lib/helpers";

// Backgrounds
import readingBg from "@/assets/backgrounds/reading.webp";
import writingBg from "@/assets/backgrounds/writing.webp";
import speakingBg from "@/assets/backgrounds/speaking.webp";
import listeningBg from "@/assets/backgrounds/listening.webp";

// Icons
import { ArrowUpRight, Clock, Columns2, RefreshCcw } from "lucide-react";

const Test = () => {
  const { testId } = useParams();
  const { setField, test, isLoading, hasError } = useObjectState({
    test: {},
    isLoading: true,
    hasError: false,
  });

  const loadTest = () => {
    setField("hasError");
    setField("isLoading", true);

    testsApi
      .getById(testId)
      .then(({ code, test }) => {
        if (code !== "testFetched") throw new Error();
        setField("test", test);
      })
      .catch(({ message }) => {
        toast.error(message || "Nimadir xato ketdi");
      })
      .finally(() => setField("isLoading"));
  };

  useEffect(() => {
    isLoading && loadTest();
  }, []);

  return (
    <div className="container py-8 space-y-6">
      <Content {...test} isLoading={isLoading} hasError={hasError} />
    </div>
  );
};

const modules = [
  {
    title: "Listening",
    image: listeningBg,
    link(testId) {
      return `/tests/test/${testId}/preview/listening/1`;
    },
  },
  {
    title: "Reading",
    image: readingBg,
    link(testId) {
      return `/tests/test/${testId}/preview/reading/1`;
    },
  },
  {
    title: "Writing",
    image: writingBg,
    link(testId) {
      return `/tests/test/${testId}/preview/writing/1`;
    },
  },
  {
    title: "Speaking",
    image: speakingBg,
    link(testId) {
      return `/tests/test/${testId}/preview/speaking/1`;
    },
  },
];

const Content = ({
  title,
  image,
  hasError,
  createdAt,
  createdBy,
  isLoading,
  description,
}) => {
  if (isLoading) return <LoadingContent />;
  if (hasError) return <ErrorContent />;

  const { testId } = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        {/* Title */}
        <h1>{title}</h1>

        <div className="flex items-center gap-5">
          {/* Parts count */}
          <div title="Jami sahifalar" className="flex items-center gap-1.5">
            <Columns2 strokeWidth={1.5} size={22} />
            <span>{0}ta</span>
          </div>

          {/* Parts count */}
          <div title="Vaqt" className="flex items-center gap-1.5">
            <Clock strokeWidth={1.5} size={22} />
            <span>
              {formatDate(createdAt)} {formatTime(createdAt)}
            </span>
          </div>
        </div>
      </div>

      <ul className="grid grid-cols-4 gap-5">
        {modules.map(({ image, title, link }, index) => (
          <li
            key={index}
            style={{ backgroundImage: `url(${image})` }}
            className="flex flex-col relative overflow-hidden w-full h-auto aspect-square bg-cover bg-center bg-no-repeat bg-gray-100 rounded-3xl"
          >
            <div className="flex items-center justify-end p-5">
              {/* Link */}
              <div className="btn size-10 p-0 rounded-full bg-white backdrop-blur-sm">
                <ArrowUpRight size={20} />
              </div>
            </div>

            {/* Bottom */}
            <div className="w-full bg-gradient-to-b from-transparent to-black/80 mt-auto p-5 space-y-3">
              <h2 className="text-xl font-medium text-white">{title}</h2>

              <div className="flex items-center justify-between gap-4">
                {/* Parts count */}
                <div
                  title="Sahifalar"
                  className="flex items-center gap-1.5 text-gray-200"
                >
                  <Columns2 strokeWidth={1.5} size={18} />
                  <span>{0}ta</span>
                </div>

                {/* Last update */}
                <div
                  title="Oxirgi yangilanish"
                  className="flex items-center gap-1.5 text-gray-200"
                >
                  <RefreshCcw strokeWidth={1.5} size={18} />
                  <span>{formatDate(new Date())}</span>
                </div>
              </div>
            </div>

            {/* Link */}
            <Link
              to={link(testId)}
              className="block absolute z-0 -top-5 inset-0 size-full rounded-3xl"
            />
          </li>
        ))}
      </ul>
    </>
  );
};

const LoadingContent = () => {
  return (
    <>
      <h1>Test</h1>
      <ul className="grid grid-cols-4 gap-5 animate-pulse">
        {Array.from({ length: 4 }, (_, index) => (
          <li
            key={index}
            className="h-auto aspect-square bg-gray-100 rounded-3xl"
          />
        ))}
      </ul>
    </>
  );
};

const ErrorContent = () => {
  return <div className="">Error</div>;
};

export default Test;
