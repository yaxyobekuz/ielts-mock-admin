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

// Router
import { Link } from "react-router-dom";

// Hooks
import useStore from "@/hooks/useStore";
import useModal from "@/hooks/useModal";

// Tests api
import { testsApi } from "@/api/tests.api";

// Components
import Dropdown from "@/components/Dropdown";

// Components
import Button from "@/components/form/Button";

// React
import { useCallback, useEffect } from "react";

// Helpers
import { formatDate, formatTime } from "@/lib/helpers";

const Tests = () => {
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
      <main className="grid grid-cols-4 gap-5">
        <Main isLoading={isLoading} hasError={hasError} tests={tests} />
      </main>
    </div>
  );
};

const Main = ({ isLoading, hasError, tests = [] }) => {
  if (isLoading) {
    return Array.from({ length: 8 }, (_, index) => {
      return <TestItemSkeleton key={index} />;
    });
  }

  if (hasError) {
    return <div className="">Error</div>;
  }

  return (
    <>
      <AddNew />

      {tests.map((test) => (
        <TestItem key={test?._id} {...test} />
      ))}
    </>
  );
};

const AddNew = () => {
  const { getData } = useStore("user");
  const { openModal } = useModal("createTest");

  const user = getData()?.data || {};
  const isTeacher = user.role === "teacher";

  return (
    <Button
      variant="danger"
      disabled={!isTeacher}
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
  createdAt,
  createdBy,
  isTemplate,
  isTemplated,
  description,
  totalParts = 0,
  totalSubmissions = 0,
}) => {
  const { openModal } = useModal("createTemplate");

  const openCreateTemplateModal = useCallback(() => {
    openModal({ testId: id });
  }, [id, openModal]);

  const openEditTestModal = useCallback(() => {
    openModal({ testId: id, description, title }, "editTest");
  }, [id, openModal, description, title]);

  return (
    <div className="flex flex-col justify-between relative w-full min-h-52 bg-gray-100 rounded-3xl p-5 space-y-5 transition-colors duration-200 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        {/* Title */}
        <h3 className="line-clamp-1 text-xl font-medium capitalize">{title}</h3>

        {/* Pin toogle */}
        <Dropdown
          title="Sozlamalar"
          aria-label="Sozlamalar"
          menu={{
            items: [
              {
                children: "Tahrirlash",
                action: openEditTestModal,
                icon: <Edit size={18} strokeWidth={1.5} />,
              },
              isTemplate
                ? {
                    children: <Link>Shablonni ko'rish</Link>,
                    icon: <Grid2x2 size={18} strokeWidth={1.5} />,
                  }
                : {
                    children: `Shablon yaratish`,
                    action: openCreateTemplateModal,
                    icon: <Grid2x2Plus size={18} strokeWidth={1.5} />,
                  },
              {
                variant: "danger",
                children: "O'chirish",
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
            {!isTemplated && (
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
  <div className="w-full min-h-52 bg-gray-100 rounded-3xl p-5 space-y-5 animate-pulse" />
);

export default Tests;
