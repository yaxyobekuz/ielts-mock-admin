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

// Components
import Dropdown from "@/components/Dropdown";

// Components
import Button from "@/components/form/Button";

// React
import { useCallback, useEffect } from "react";

// Hooks
import useStore from "@/hooks/useStore";
import useModal from "@/hooks/useModal";
import usePermission from "@/hooks/usePermission";

// Router
import { Link, useNavigate } from "react-router-dom";

// Helpers
import { formatDate, formatTime } from "@/lib/helpers";

const Tests = () => {
  const { checkPermission, user } = usePermission();
  const { getData, updateProperty } = useStore("tests");
  const { isLoading, hasError, data: tests } = getData();

  const loadTests = () => {
    updateProperty("isLoading", true);
    updateProperty("hasError", false);

    testsApi
      .get()
      .then(({ tests, code }) => {
        if (code !== "testsFetched") throw new Error();
        updateProperty("data", tests);
      })
      .catch(() => updateProperty("hasError", true))
      .finally(() => updateProperty("isLoading", false));
  };

  // Load user profile
  useEffect(() => {
    isLoading && loadTests();
  }, []);

  return (
    <div className="container py-8 space-y-6">
      {/* Title */}
      <h1>Testlar</h1>

      {/* Main */}
      <main>
        {/* Skeleton loader */}
        {isLoading && (
          <ul className="grid grid-cols-4 gap-5">
            {Array.from({ length: 8 }, (_, index) => (
              <TestItemSkeleton key={index} />
            ))}
          </ul>
        )}

        {/* Error content */}
        {!isLoading && hasError ? <div className="">Error</div> : null}

        {/* Tests */}
        {!isLoading && !hasError && tests?.length ? (
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
            {isCopied && (
              <span className="text-yellow-600">Nusxa ko'chirilgan </span>
            )}

            {/* Is template */}
            {isTemplate && (
              <span className="text-blue-600">Shablon sifatida saqlangan </span>
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
  <li className="w-full min-h-52 bg-gray-100 rounded-3xl p-5 space-y-5 animate-pulse" />
);

export default Tests;
