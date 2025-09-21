// React
import { useEffect } from "react";

// Router
import { Link } from "react-router-dom";

// Hooks
import useStore from "@/hooks/useStore";

// Components
import ProfilePhoto from "@/components/ProfilePhoto";

// Submissions api
import { submissionsApi } from "@/api/submissions.api";

// Helpers
import { formatDate, formatTime } from "@/lib/helpers";

// Icons
import { Activity, Clock, SquareArrowOutUpRight } from "lucide-react";

const Submissions = () => {
  const { getData, updateProperty } = useStore("submissions");
  const { isLoading, hasError, data: submissions } = getData();

  const loadSubmissions = () => {
    updateProperty("isLoading", true);
    updateProperty("hasError", false);

    submissionsApi
      .get()
      .then(({ submissions, code }) => {
        if (code !== "submissionsFetched") throw new Error();
        updateProperty("data", submissions);
      })
      .catch(() => updateProperty("hasError", true))
      .finally(() => updateProperty("isLoading", false));
  };

  // Load user profile
  useEffect(() => {
    isLoading && loadSubmissions();
  }, []);

  return (
    <div className="container py-8 space-y-6">
      {/* Title */}
      <h1>Javoblar</h1>

      {/* Main */}
      <main className="grid grid-cols-4 gap-5">
        <Content
          hasError={hasError}
          isLoading={isLoading}
          submissions={submissions}
        />
      </main>
    </div>
  );
};

const Content = ({ isLoading, hasError, submissions = [] }) => {
  if (isLoading) {
    return Array.from({ length: 8 }, (_, index) => {
      return <SubmissionItemSkeleton key={index} />;
    });
  }

  if (hasError) {
    return <div className="">Error</div>;
  }

  return submissions.map((submission) => (
    <SubmissionItem key={submission?._id} {...submission} />
  ));
};

const SubmissionItem = ({
  user,
  test,
  link,
  _id: id,
  startedAt,
  isChecked,
  finishedAt,
}) => {
  const { firstName = "Foydalanuvchi", lastName = "" } = user || {};
  return (
    <div className="flex flex-col gap-3.5 justify-between relative w-full min-h-52 bg-gray-100 rounded-3xl p-5 transition-all duration-200 hover:bg-gray-50">
      {/* Profile */}
      <div className="flex items-center gap-3.5">
        <ProfilePhoto user={user} />

        <h3 className="text-xl font-medium line-clamp-1">
          {`${firstName} ${lastName}`}
        </h3>
      </div>

      {/* Mid */}
      <div className="space-y-1.5">
        {/* Status */}
        <div className="flex items-center gap-1.5">
          <Activity strokeWidth={1.5} size={18} />
          <p className="text-[15px]">
            <span>Holat: </span>
            <span className={isChecked ? "text-green-600" : "text-red-500"}>
              Tekshiril{isChecked ? "" : "ma"}gan
            </span>
          </p>
        </div>

        {/* Time */}
        <div className="flex items-center gap-1.5">
          <Clock strokeWidth={1.5} size={18} />
          <p className="text-[15px]">
            <span>{formatDate(startedAt)} </span>
            <span className="text-gray-500">
              {formatTime(startedAt)} - {formatTime(finishedAt)}
            </span>
          </p>
        </div>
      </div>

      {/* Links */}
      <div className="flex items-center gap-3.5">
        {/* Test */}
        <Link
          to={`/tests/test/${test}`}
          className="flex items-center justify-center gap-1.5 relative z-10 text-gray-500 hover:text-blue-500"
        >
          <SquareArrowOutUpRight
            size={18}
            strokeWidth={1.5}
            className="transition-colors duration-200"
          />
          <span className="transition-colors duration">Test</span>
        </Link>

        {/* Invite link */}
        <Link
          to={`/links/link/${link}`}
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

      {/* Link */}
      <Link
        to={`/submissions/${id}`}
        className="block absolute z-0 inset-0 size-full rounded-3xl"
      />
    </div>
  );
};

const SubmissionItemSkeleton = () => (
  <div className="w-full min-h-52 bg-gray-100 rounded-3xl p-5 space-y-5 animate-pulse" />
);

export default Submissions;
