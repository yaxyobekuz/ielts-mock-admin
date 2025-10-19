// Toast
import { toast } from "@/notification/toast";

// React
import { useCallback, useEffect } from "react";

// Hooks
import useArrayStore from "@/hooks/useArrayStore";

// Components
import PageInfo from "@/components/PageInfo";
import Pagination from "@/components/Pagination";
import ProfilePhoto from "@/components/ProfilePhoto";

// Submissions api
import { submissionsApi } from "@/api/submissions.api";

// Helpers
import { formatDate, formatTime } from "@/lib/helpers";

// Router
import { Link, useSearchParams } from "react-router-dom";

// Icons
import { Activity, Clock, SquareArrowOutUpRight } from "lucide-react";

const Submissions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const {
    setPage,
    initialize,
    getMetadata,
    getPageData,
    hasCollection,
    setPageErrorState,
    setPageLoadingState,
  } = useArrayStore("submissions");

  // Initialize collection on mount
  useEffect(() => {
    if (!hasCollection()) initialize(true); // pagination = true
  }, [hasCollection, initialize]);

  const metadata = getMetadata();
  const pageData = getPageData(currentPage);

  const submissions = pageData?.data || [];
  const hasError = pageData?.error || null;
  const isLoading = pageData?.isLoading || false;
  const hasNextPage = pageData?.hasNextPage ?? false;
  const hasPrevPage = pageData?.hasPrevPage ?? false;

  // Load submissions for current page
  const loadSubmissions = useCallback(
    (page) => {
      setPageLoadingState(page, true);

      submissionsApi
        .get({ page, limit: 12 })
        .then(({ submissions, code, pagination }) => {
          if (code !== "submissionsFetched") throw new Error();
          setPage(page, submissions, null, pagination);
        })
        .catch(({ message }) => {
          toast.error(message || "Nimadir xato ketdi");
          setPageErrorState(page, message || "Nimadir xato ketdi");
        });
    },
    [setPageLoadingState, setPage, setPageErrorState]
  );

  // Navigate to page
  const goToPage = useCallback(
    (page) => {
      if (page < 1) return;
      setSearchParams({ page: page.toString() });
    },
    [setSearchParams]
  );

  // Load submissions when page changes
  useEffect(() => {
    const pageDataExists = getPageData(currentPage);
    if (!pageDataExists) loadSubmissions(currentPage);
  }, [currentPage, loadSubmissions, getPageData]);

  return (
    <div className="container py-8 space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h1>Javoblar</h1>

        {/* Pagination Info */}
        {!isLoading && !hasError && submissions.length > 0 && metadata && (
          <div className="flex items-center gap-3 text-gray-500">
            <span>
              Hozirgi sahifa:{" "}
              <strong className="font-medium text-black">{currentPage}</strong>{" "}
              / {metadata.totalPages}
            </span>

            <span className="size-1 bg-gray-400 rounded-full" />

            <span>
              Jami javoblar:{" "}
              <strong className="font-medium text-black">
                {metadata.total}
              </strong>{" "}
              ta
            </span>
          </div>
        )}
      </div>

      {/* Main */}
      <main>
        {/* Skeleton loader */}
        {isLoading && !hasError ? (
          <ul className="grid grid-cols-4 gap-5 animate-pulse">
            {Array.from({ length: 12 }, (_, index) => (
              <SubmissionItemSkeleton key={index} />
            ))}
          </ul>
        ) : null}

        {/* Error content */}
        {!isLoading && hasError ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <p className="text-red-500 text-lg">{hasError}</p>
            <button
              onClick={() => loadSubmissions(currentPage)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Qayta urinib ko'rish
            </button>
          </div>
        ) : null}

        {/* No submissions */}
        {!isLoading && !hasError && submissions.length === 0 ? (
          <PageInfo
            className="pt-12"
            title="Hech qanday javob topilmadi"
            links={{
              primary: { to: "/submissions", body: "1-sahifaga qaytish" },
            }}
            description={`Ushbu ${currentPage}-sahifada hech qanday javob topilmadi.`}
          />
        ) : null}

        {/* Submissions */}
        {!isLoading && !hasError && submissions.length > 0 ? (
          <div className="grid grid-cols-4 gap-5">
            {submissions.map((submission) => (
              <SubmissionItem key={submission?._id} {...submission} />
            ))}
          </div>
        ) : null}
      </main>

      {/* Pagination Controls */}
      {!isLoading && !hasError && submissions.length > 0 && (
        <Pagination
          className="pt-4"
          maxPageButtons={5}
          showPageNumbers={true}
          onPageChange={goToPage}
          currentPage={currentPage}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          totalPages={metadata?.totalPages || 1}
        />
      )}
    </div>
  );
};

const SubmissionItem = ({
  test,
  link,
  _id: id,
  student,
  startedAt,
  isScored,
  finishedAt,
}) => {
  const { firstName = "Foydalanuvchi", lastName = "" } = student || {};
  return (
    <div className="flex flex-col gap-3.5 justify-between relative w-full min-h-52 bg-gray-100 rounded-3xl p-5 transition-all duration-200 hover:bg-gray-50">
      {/* Profile */}
      <div className="flex items-center gap-3.5">
        <ProfilePhoto user={student} />

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
            <span className={isScored ? "text-green-600" : "text-red-500"}>
              Baholan{isScored ? "" : "ma"}gan
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

      {/* Link */}
      <Link
        to={`/submissions/${id}`}
        className="block absolute z-0 inset-0 size-full rounded-3xl"
      />
    </div>
  );
};

const SubmissionItemSkeleton = () => (
  <div className="w-full min-h-52 bg-gray-100 rounded-3xl p-5 space-y-5" />
);

export default Submissions;
