// Toast
import { toast } from "@/notification/toast";

// React
import { useCallback, useEffect } from "react";

// Teachers api
import { teachersApi } from "@/api/teachers.api";

// Hooks
import useModal from "@/hooks/useModal";
import useArrayStore from "@/hooks/useArrayStore";

// Components
import PageInfo from "@/components/PageInfo";
import Button from "@/components/form/Button";
import CopyButton from "@/components/CopyButton";
import Pagination from "@/components/Pagination";
import ProfilePhoto from "@/components/ProfilePhoto";

// Router
import { Link, useSearchParams } from "react-router-dom";

// Icons
import { Clock, IdCardIcon, Plus, Signature } from "lucide-react";

// Helpers
import { formatDate, formatTime, formatUzPhone } from "@/lib/helpers";

const Teachers = () => {
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
  } = useArrayStore("teachers");

  // Initialize collection on mount
  useEffect(() => {
    if (!hasCollection()) initialize(true); // pagination = true
  }, [hasCollection, initialize]);

  const metadata = getMetadata();
  const pageData = getPageData(currentPage);

  const teachers = pageData?.data || [];
  const hasError = pageData?.error || null;
  const isLoading = pageData?.isLoading || false;
  const hasNextPage = pageData?.hasNextPage ?? false;
  const hasPrevPage = pageData?.hasPrevPage ?? false;

  // Load teachers for current page
  const loadTeachers = useCallback(
    (page) => {
      setPageLoadingState(page, true);

      teachersApi
        .get({ page, limit: 11 })
        .then(({ teachers, code, pagination }) => {
          if (code !== "teachersFetched") throw new Error();
          setPage(page, teachers, null, pagination);
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

  // Load teachers when page changes
  useEffect(() => {
    const pageDataExists = getPageData(currentPage);
    if (!pageDataExists) loadTeachers(currentPage);
  }, [currentPage, loadTeachers, getPageData]);

  return (
    <div className="container py-8 space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h1>Ustozlar</h1>

        {/* Pagination Info */}
        {!isLoading && !hasError && teachers.length > 0 && metadata && (
          <div className="flex items-center gap-3 text-gray-500">
            <span>
              Hozirgi sahifa:{" "}
              <strong className="font-medium text-black">{currentPage}</strong>{" "}
              / {metadata.totalPages}
            </span>

            <span className="size-1 bg-gray-400 rounded-full" />

            <span>
              Jami ustozlar:{" "}
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
              <TeacherItemSkeleton key={index} />
            ))}
          </ul>
        ) : null}

        {/* Error content */}
        {!isLoading && hasError ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <p className="text-red-500 text-lg">{hasError}</p>
            <button
              onClick={() => loadTeachers(currentPage)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Qayta urinib ko'rish
            </button>
          </div>
        ) : null}

        {/* No teachers */}
        {!isLoading && !hasError && teachers.length === 0 ? (
          <PageInfo
            className="pt-12"
            title="Hech qanday ustoz topilmadi"
            links={{ primary: { to: "/teachers", body: "1-sahifaga qaytish" } }}
            description={`Ushbu ${currentPage}-sahifada hech qanday ustoz topilmadi.`}
          />
        ) : null}

        {/* Teachers */}
        {!isLoading && !hasError && teachers.length > 0 ? (
          <div className="grid grid-cols-4 gap-5">
            <AddNew />
            {teachers.map((teacher) => (
              <TeacherItem key={teacher?._id} {...teacher} />
            ))}
          </div>
        ) : null}
      </main>

      {/* Pagination Controls */}
      {!isLoading && !hasError && teachers.length > 0 && (
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

const AddNew = () => {
  const { openModal } = useModal("createTeacher");

  return (
    <Button
      variant="danger"
      onClick={() => openModal()}
      className="relative group gap-3.5 min-h-[200px] !rounded-3xl"
    >
      <span className="text-xl font-medium text-white">Ustoz qo'shish</span>
      <Plus
        size={32}
        color="white"
        className="transition-transform duration-200 group-hover:rotate-180 group-disabled:!rotate-0"
      />
    </Button>
  );
};

const TeacherItem = ({
  avatar,
  phone,
  _id: id,
  nickname,
  createdAt,
  lastName = "",
  firstName = "Foydalanuvchi",
}) => {
  return (
    <div className="flex flex-col gap-3.5 justify-between relative w-full min-h-52 bg-gray-100 rounded-3xl p-5 transition-all duration-200 hover:bg-gray-50">
      {/* Profile */}
      <div className="flex items-center gap-3.5">
        <ProfilePhoto user={{ _id: id, firstName, lastName, avatar }} />

        <div className="h-12">
          <h3 className="text-xl font-medium line-clamp-1">
            {`${firstName} ${lastName}`}
          </h3>

          <a
            href={`tel:+${phone}`}
            className="relative z-10 text-gray-500 text-sm transition-colors duration-200 hover:text-blue-500"
          >
            {formatUzPhone(phone)}
          </a>
        </div>
      </div>

      {/* Mid */}
      <div className="space-y-1.5">
        {/* Status */}
        <div className="flex items-center gap-1.5">
          <Signature strokeWidth={1.5} size={18} />
          <p className="text-[15px]">
            <span>Tahallus: </span>
            <span className="text-blue-500">{nickname || "Ustoz"}</span>
          </p>
        </div>

        {/* Time */}
        <div className="flex items-center gap-1.5">
          <Clock strokeWidth={1.5} size={18} />
          <p className="text-[15px]">
            <span>{formatDate(createdAt)} </span>
            <span className="text-gray-500">{formatTime(createdAt)}</span>
          </p>
        </div>
      </div>

      {/* Links */}
      <div className="flex items-center gap-3.5">
        {/* Teacher id */}
        <CopyButton
          text={id}
          notificationText="ID raqamdan nusxa olindi"
          className="flex items-center justify-center gap-1.5 relative z-10 max-w-full text-gray-500 hover:text-blue-500 disabled:text-gray-500 disabled:opacity-50"
        >
          <IdCardIcon
            size={18}
            strokeWidth={1.5}
            className="shrink-0 transition-colors duration-200"
          />
          <span className="truncate transition-colors duration">{id}</span>
        </CopyButton>
      </div>

      {/* Link */}
      <Link
        to={`/teachers/${id}`}
        className="block absolute z-0 inset-0 size-full rounded-3xl"
      />
    </div>
  );
};

const TeacherItemSkeleton = () => (
  <div className="w-full min-h-52 bg-gray-100 rounded-3xl p-5" />
);

export default Teachers;
