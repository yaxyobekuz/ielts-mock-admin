// Icons
import {
  Mic,
  Pen,
  Book,
  Clock,
  Headphones,
  SquareArrowOutUpRight,
} from "lucide-react";

// React
import { useEffect } from "react";

// Router
import { Link } from "react-router-dom";

// Hooks
import useStore from "@/hooks/useStore";

// Results api
import { resultsApi } from "@/api/results.api";

// Components
import ProfilePhoto from "@/components/ProfilePhoto";

// Helpers
import { appendDotZero, formatDate, formatTime } from "@/lib/helpers";

const Results = () => {
  const { getData, updateProperty } = useStore("results");
  const { isLoading, hasError, data: results } = getData();

  const loadResults = () => {
    updateProperty("isLoading", true);
    updateProperty("hasError", false);

    resultsApi
      .get()
      .then(({ results, code }) => {
        if (code !== "resultsFetched") throw new Error();
        updateProperty("data", results);
      })
      .catch(() => updateProperty("hasError", true))
      .finally(() => updateProperty("isLoading", false));
  };

  // Load results
  useEffect(() => {
    isLoading && loadResults();
  }, []);

  return (
    <div className="container py-8 space-y-6">
      {/* Title */}
      <h1>Natijalar</h1>

      {/* Main */}
      <main className="grid grid-cols-4 gap-5">
        <Content hasError={hasError} isLoading={isLoading} results={results} />
      </main>
    </div>
  );
};

const Content = ({ isLoading, hasError, results = [] }) => {
  if (isLoading) {
    return Array.from({ length: 8 }, (_, index) => {
      return <ResultItemSkeleton key={index} />;
    });
  }

  if (hasError) {
    return <div className="">Error</div>;
  }

  return results.map((result) => <ResultItem key={result?._id} {...result} />);
};

const ResultItem = ({
  test,
  link,
  overall,
  _id: id,
  student,
  reading,
  writing,
  speaking,
  createdAt,
  listening,
  submission,
}) => {
  const { firstName = "Foydalanuvchi", lastName = "" } = student || {};
  return (
    <div className="flex flex-col gap-3.5 justify-between relative overflow-hidden w-full min-h-52 bg-gray-100 rounded-3xl p-5 transition-all duration-200 hover:bg-gray-50">
      {/* Profile */}
      <div className="flex items-center gap-3.5">
        <ProfilePhoto user={student} />

        <h3 className="text-xl font-medium truncate">
          {`${firstName} ${lastName}`}
        </h3>
      </div>

      {/* Mid */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-3.5">
          {/* Listening */}
          <div className="flex items-center gap-1.5">
            <Headphones strokeWidth={1.5} size={18} />
            <p className="text-gray-500">{appendDotZero(listening)}</p>
          </div>

          {/* Reading */}
          <div className="flex items-center gap-1.5">
            <Book strokeWidth={1.5} size={18} />
            <p className="text-gray-500">{appendDotZero(reading)}</p>
          </div>

          {/* Writing */}
          <div className="flex items-center gap-1.5">
            <Pen strokeWidth={1.5} size={18} />
            <p className="text-gray-500">{appendDotZero(writing)}</p>
          </div>

          {/* Speaking */}
          <div className="flex items-center gap-1.5">
            <Mic strokeWidth={1.5} size={18} />
            <p className="text-gray-500">{appendDotZero(speaking)}</p>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-center gap-1.5">
          <Clock strokeWidth={1.5} size={18} />
          <p className="text-[15px]">
            <span>{formatDate(createdAt)} </span>
            <span className="text-gray-500">{formatTime(createdAt)} </span>
          </p>
        </div>
      </div>

      {/* Links */}
      <div className="flex items-center gap-3.5">
        {/* Test */}
        <Link
          to={`/tests/${test}`}
          className="flex items-center justify-center gap-1.5 relative z-10 text-gray-500 hover:text-blue-500"
        >
          <SquareArrowOutUpRight
            size={18}
            strokeWidth={1.5}
            className="transition-colors duration-200"
          />
          <span className="transition-colors duration">Test</span>
        </Link>

        {/* Submission */}
        <Link
          to={`/submissions/${submission}`}
          className="flex items-center justify-center gap-1.5 relative z-10 text-gray-500 hover:text-blue-500"
        >
          <SquareArrowOutUpRight
            size={18}
            strokeWidth={1.5}
            className="transition-colors duration-200"
          />
          <span className="transition-colors duration">Javoblar</span>
        </Link>

        {/* Invite link */}
        <Link
          to={`/links/${link}`}
          className="flex items-center justify-center gap-1.5 relative z-10 text-gray-500 hover:text-blue-500"
        >
          <SquareArrowOutUpRight
            size={18}
            strokeWidth={1.5}
            className="transition-colors duration-200"
          />
          <span className="transition-colors duration">Taklif havolasi</span>
        </Link>
      </div>

      {/* Overall */}
      <div className="flex items-center justify-center absolute top-5 -right-9 w-36 h-9 bg-red-500 rotate-45 font-semibold text-white shadow-md">
        {appendDotZero(overall)}
      </div>

      {/* Link */}
      <Link
        to={`/results/${id}`}
        className="block absolute z-0 inset-0 size-full rounded-3xl"
      />
    </div>
  );
};

const ResultItemSkeleton = () => (
  <div className="w-full min-h-52 bg-gray-100 rounded-3xl p-5 space-y-5 animate-pulse" />
);

export default Results;
