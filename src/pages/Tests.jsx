// Icons
import {
  Plus,
  Edit,
  User,
  Trash,
  Grid2x2,
  Activity,
  Columns2,
  BookCheck,
  Grid2x2Plus,
  EllipsisVertical,
} from "lucide-react";

// Tests api
import { testsApi } from "@/api/tests.api";

// Toast
import { toast } from "@/notification/toast";

// React
import { useCallback, useEffect } from "react";

// Components
import Dropdown from "@/components/Dropdown";
import PageInfo from "@/components/PageInfo";
import Button from "@/components/form/Button";
import Pagination from "@/components/Pagination";

// Hooks
import useModal from "@/hooks/useModal";
import useArrayStore from "@/hooks/useArrayStore";
import usePermission from "@/hooks/usePermission";

// Helpers
import { formatDate, formatTime } from "@/lib/helpers";

// Router
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Tests = () => {
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
  } = useArrayStore("tests");

  // Initialize collection on mount
  useEffect(() => {
    if (!hasCollection()) initialize(true); // pagination = true
  }, [hasCollection, initialize]);

  const metadata = getMetadata();
  const pageData = getPageData(currentPage);

  const tests = pageData?.data || [];
  const hasError = pageData?.error || null;
  const isLoading = pageData?.isLoading || false;
  const hasNextPage = pageData?.hasNextPage ?? false;
  const hasPrevPage = pageData?.hasPrevPage ?? false;

  const { checkPermission, user } = usePermission();
  const isTeacher = user?.role === "teacher";

  // Load tests for current page
  const loadTests = useCallback(
    (page) => {
      setPageLoadingState(page, true);

      testsApi
        .get({ page, limit: isTeacher ? 11 : 12 })
        .then(({ tests, code, pagination }) => {
          if (code !== "testsFetched") throw new Error();
          setPage(page, tests, null, pagination);
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

  // Load tests when page changes
  useEffect(() => {
    const pageDataExists = getPageData(currentPage);
    if (!pageDataExists) loadTests(currentPage);
  }, [currentPage, loadTests, getPageData]);

  return (
    <div className="container py-8 space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h1>Testlar</h1>

        {/* Pagination Info */}
        {!isLoading && !hasError && tests.length > 0 && metadata && (
          <div className="flex items-center gap-3 text-gray-500">
            <span>
              Hozirgi sahifa:{" "}
              <strong className="font-medium text-black">
                {currentPage}
              </strong>{" "}
              / {metadata.totalPages}
            </span>

            <span className="size-1 bg-gray-400 rounded-full" />

            <span>
              Jami testlar:{" "}
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
              <TestItemSkeleton key={index} />
            ))}
          </ul>
        ) : null}

        {/* Error content */}
        {!isLoading && hasError ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <p className="text-red-500 text-lg">{hasError}</p>
            <button
              onClick={() => loadTests(currentPage)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Qayta urinib ko'rish
            </button>
          </div>
        ) : null}

        {/* No tests */}
        {!isLoading && !hasError && tests.length === 0 ? (
          <PageInfo
            className="pt-12"
            title="Hech qanday test topilmadi"
            links={{ primary: { to: "/tests", body: "1-sahifaga qaytish" } }}
            description={`Ushbu ${currentPage}-sahifada hech qanday test topilmadi.`}
          />
        ) : null}

        {/* Tests */}
        {!isLoading && !hasError && tests.length > 0 ? (
          <div className="grid grid-cols-4 gap-5">
            <AddNew user={user} checkPermission={checkPermission} />
            {tests.map((test) => (
              <TestItem
                {...test}
                key={test?._id}
                checkPermission={checkPermission}
              />
            ))}
          </div>
        ) : null}
      </main>

      {/* Pagination Controls */}
      {!isLoading && !hasError && tests.length > 0 && (
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

const AddNew = ({ user, checkPermission }) => {
  const { openModal } = useModal("createTest");
  const canCreateTest =
    checkPermission("canCreateTest") && user.role === "teacher";

  return (
    <Button
      variant="danger"
      disabled={!canCreateTest}
      onClick={() => openModal()}
      className="relative group gap-3.5 min-h-[200px] !rounded-3xl"
    >
      <span className="text-xl font-medium text-white">Test qo'shish</span>
      <Plus
        size={32}
        color="white"
        className="transition-transform duration-200 group-hover:rotate-180 group-disabled:!rotate-0"
      />
    </Button>
  );
};

const TestItem = ({
  title,
  _id: id,
  isCopied,
  template,
  createdAt,
  createdBy,
  isTemplate,
  isTemplated,
  description,
  totalParts = 0,
  checkPermission,
  totalSubmissions = 0,
}) => {
  const navigate = useNavigate();
  const { openModal } = useModal("createTemplate");

  // Permissions
  const canEditTest = checkPermission("canEditTest");
  const canDeleteTest = checkPermission("canDeleteTest");
  const canCreateTemplate = checkPermission("canCreateTemplate");

  const openCreateTemplateModal = useCallback(() => {
    if (!canCreateTemplate) return;
    openModal({ testId: id });
  }, [id]);

  const openEditTestModal = useCallback(() => {
    if (!canEditTest) return;
    openModal({ testId: id, description, title }, "editTest");
  }, [id, description, title]);

  const openDeleteTestModal = useCallback(() => {
    if (!canDeleteTest) return;
    openModal({ testId: id }, "deleteTest");
  }, [id]);

  return (
    <div className="flex flex-col justify-between relative w-full min-h-52 bg-gray-100 rounded-3xl p-5 transition-colors duration-200 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        {/* Title */}
        <h3 className="line-clamp-1 text-xl font-medium capitalize">{title}</h3>

        {/* Menu */}
        <Dropdown
          title="Sozlamalar"
          aria-label="Sozlamalar"
          menu={{
            items: [
              {
                disabled: !canEditTest,
                children: "Tahrirlash",
                action: openEditTestModal,
                icon: <Edit size={18} strokeWidth={1.5} />,
              },
              isTemplate
                ? {
                    children: "Shablonni ko'rish",
                    icon: <Grid2x2 size={18} strokeWidth={1.5} />,
                    action: () => navigate(`/templates/${template}`),
                  }
                : {
                    disabled: !canCreateTemplate,
                    children: `Shablon yaratish`,
                    action: openCreateTemplateModal,
                    icon: <Grid2x2Plus size={18} strokeWidth={1.5} />,
                  },
              {
                variant: "danger",
                children: "O'chirish",
                disabled: !canDeleteTest,
                action: openDeleteTestModal,
                icon: <Trash size={18} strokeWidth={1.5} />,
              },
            ],
          }}
          className="flex items-center justify-center relative shrink-0 z-10 size-10 bg-white rounded-full"
        >
          <EllipsisVertical size={20} />
        </Dropdown>
      </div>

      {/* Mid */}
      <div className="space-y-1.5">
        {/* Created by */}
        <div className="flex items-center gap-1.5">
          <User strokeWidth={1.5} size={18} className="shrink-0" />
          <p className="text-[15px] line-clamp-1">
            <span>Ustoz: </span>
            <span className="text-gray-500">
              {createdBy?.firstName} {createdBy?.lastName || ""}
            </span>
          </p>
        </div>

        {/* Status */}
        <div className="flex items-start gap-1.5">
          <Activity strokeWidth={1.5} size={18} className="shrink-0 mt-0.5" />
          <p className="text-[15px]">
            <span>Holati: </span>

            {/* Is copied */}
            {!isCopied && !isTemplate && !isTemplated && (
              <span className="text-gray-500">Odatiy</span>
            )}

            {/* Is copied */}
            {isCopied && (
              <span className="text-yellow-600">Nusxa ko'chirilgan</span>
            )}

            {/* Is template */}
            {isTemplate && (
              <span className="text-blue-600">Shablon sifatida saqlangan</span>
            )}

            {/* Is templated */}
            {isTemplated && (
              <span className="text-pink-600">Shablondan ko'chirilgan</span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Total test taken */}
          <div
            title="Umumiy yechilgan testlar"
            className="flex items-center gap-1.5"
          >
            <BookCheck strokeWidth={1.5} size={18} />
            <span>{totalSubmissions}ta</span>
          </div>

          {/* Parts count */}
          <div title="Sahifalar" className="flex items-center gap-1.5">
            <Columns2 strokeWidth={1.5} size={18} />
            <span>{totalParts}ta</span>
          </div>
        </div>

        <p className="text-[15px]">
          {formatDate(createdAt)}{" "}
          <span className="text-gray-500">{formatTime(createdAt)}</span>
        </p>
      </div>

      {/* Link */}
      <Link
        to={`/tests/${id}`}
        className="block absolute z-0 -top-5 inset-0 size-full rounded-3xl"
      />
    </div>
  );
};

const TestItemSkeleton = () => (
  <div className="w-full min-h-52 bg-gray-100 rounded-3xl p-5 space-y-5" />
);

export default Tests;
