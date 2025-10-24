// Icons
import {
  Mic,
  Pen,
  Book,
  Clock,
  Headphones,
  SquareArrowOutUpRight,
} from "lucide-react";

// Toast
import { toast } from "@/notification/toast";

// Results api
import { resultsApi } from "@/api/results.api";

// Hooks
import useArrayStore from "@/hooks/useArrayStore";

// Components
import PageInfo from "@/components/PageInfo";
import Pagination from "@/components/Pagination";
import ProfilePhoto from "@/components/ProfilePhoto";

// Router
import { Link, useSearchParams } from "react-router-dom";

// Helpers
import { appendDotZero, formatDate, formatTime } from "@/lib/helpers";

// React
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const Results = ({
  linkId = null,
  testId = null,
  isPage = true,
  bySearchQuery = true,
}) => {
  const [localPage, setLocalPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  // Determine if we should use query params or local state
  const currentPage = bySearchQuery
    ? parseInt(searchParams.get("page") || "1", 10)
    : localPage;

  // Generate dynamic collection key based on filters
  const collectionKey = useMemo(() => {
    if (linkId) return `results-link-${linkId}`;
    if (testId) return `results-test-${testId}`;
    return "results";
  }, [linkId, testId]);

  const {
    setPage,
    initialize,
    getMetadata,
    getPageData,
    hasCollection,
    setPageErrorState,
    setPageLoadingState,
  } = useArrayStore(collectionKey);

  // Initialize collection on mount
  useEffect(() => {
    if (!hasCollection()) initialize(true); // pagination = true
  }, [hasCollection, initialize]);

  const metadata = getMetadata();
  const pageData = getPageData(currentPage);

  const results = pageData?.data || [];
  const hasError = pageData?.error || null;
  const isLoading = pageData?.isLoading || false;
  const hasNextPage = pageData?.hasNextPage ?? false;
  const hasPrevPage = pageData?.hasPrevPage ?? false;

  const contentRef = useRef(null);

  // Load results for current page
  const loadResults = useCallback(
    (page) => {
      setPageLoadingState(page, true);

      // Determine which API method to use
      let apiCall;
      const q = { page, limit: 12 };
      if (linkId) apiCall = resultsApi.getByLinkId(linkId, q);
      else if (testId) apiCall = resultsApi.getByTestId(testId, q);
      else apiCall = resultsApi.get(q);

      apiCall
        .then(({ results, code, pagination }) => {
          if (code !== "resultsFetched") throw new Error();
          setPage(page, results, null, pagination);
        })
        .catch(({ message }) => {
          toast.error(message || "Nimadir xato ketdi");
          setPageErrorState(page, message || "Nimadir xato ketdi");
        });
    },
    [linkId, testId, setPageLoadingState, setPage, setPageErrorState]
  );

  // Navigate to page
  const goToPage = useCallback(
    (page) => {
      if (page < 1) return;
      if (bySearchQuery) setSearchParams({ page: page.toString() });
      else setLocalPage(page);
    },
    [bySearchQuery, setSearchParams]
  );

  // Load results when page changes
  useEffect(() => {
    const pageDataExists = getPageData(currentPage);
    if (!pageDataExists) loadResults(currentPage);
  }, [currentPage, loadResults, getPageData]);

  return (
    <div ref={contentRef} className="container py-8 space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        {isPage ? <h1>Natijalar</h1> : <h2 className="text-2xl">Natijalar</h2>}

        {/* Pagination Info */}
        {!isLoading && !hasError && results.length > 0 && metadata && (
          <div className="flex items-center gap-3 text-gray-500">
            <span>
              Hozirgi sahifa:{" "}
              <strong className="font-medium text-black">{currentPage}</strong>{" "}
              / {metadata.totalPages}
            </span>

            <span className="size-1 bg-gray-400 rounded-full" />

            <span>
              Jami natijalar:{" "}
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
              <ResultItemSkeleton key={index} />
            ))}
          </ul>
        ) : null}

        {/* Error content */}
        {!isLoading && hasError ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <p className="text-red-500 text-lg">{hasError}</p>
            <button
              onClick={() => loadResults(currentPage)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Qayta urinib ko'rish
            </button>
          </div>
        ) : null}

        {/* No results */}
        {!isLoading && !hasError && results.length === 0 ? (
          <PageInfo
            className="py-12"
            title="Natijalar mavjud emas"
            links={isPage ? { primary: { to: -1, body: "Ortga qaytish" } } : {}}
          />
        ) : null}

        {/* Results */}
        {!isLoading && !hasError && results.length > 0 ? (
          <div className="grid grid-cols-4 gap-5">
            {results.map((result) => (
              <ResultItem key={result?._id} {...result} />
            ))}
          </div>
        ) : null}
      </main>

      {/* Pagination Controls */}
      {!isLoading && !hasError && results.length > 0 && (
        <Pagination
          className="pt-4"
          maxPageButtons={5}
          showPageNumbers={true}
          onPageChange={goToPage}
          contentRef={contentRef}
          currentPage={currentPage}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          totalPages={metadata?.totalPages || 1}
        />
      )}
    </div>
  );
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
  <div className="w-full min-h-52 bg-gray-100 rounded-3xl p-5 space-y-5" />
);

export default Results;
