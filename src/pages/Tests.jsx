// Icons
import {
  Plus,
  Copy,
  Columns2,
  BookCheck,
  Grid2x2Plus,
  EllipsisVertical,
} from "lucide-react";

// React
import { useEffect } from "react";

// Router
import { Link } from "react-router-dom";

// Hooks
import useStore from "@/hooks/useStore";
import useModal from "@/hooks/useModal";

// Tests api
import { testsApi } from "@/api/tests.api";

// Components
import Button from "@/components/form/Button";

// Helpers
import { formatDate, getRandomNumber } from "@/lib/helpers";

// Components
import Dropdown from "@/components/Dropdown";
import TestTakenCountChart from "@/components/charts/TestTakenCountChart";

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
  createdAt,
  taken = 0,
  isTemplate,
  totalParts = 0,
  totalTaken = 0,
}) => {
  const { getProperty } = useStore("user");
  const { openModal } = useModal("createTemplate");
  const isTeacher = getProperty("data")?.role === "teacher";
  const data = [
    {
      id: "Umumiy",
      data: [
        { x: "Du", y: getRandomNumber(0, 3) },
        { x: "Se", y: getRandomNumber(0, 3) },
        { x: "Pay", y: getRandomNumber(0, 3) },
        { x: "Ju", y: getRandomNumber(0, 3) },
        { x: "Sha", y: getRandomNumber(0, 3) },
        { x: "Yak", y: getRandomNumber(0, 3) },
      ],
    },
  ];

  return (
    <div className="flex flex-col justify-between relative w-full min-h-52 bg-gray-100 rounded-3xl p-5 space-y-5 transition-colors duration-200 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        {/* Title */}
        <h3 className="text-xl font-medium capitalize">{title}</h3>

        {/* Pin toogle */}
        <Dropdown
          title="Sozlamalar"
          aria-label="Sozlamalar"
          menu={{
            items: [
              {
                disabled: true,
                children: "Nusxa olish",
                icon: <Copy size={18} strokeWidth={1.5} />,
              },
              {
                disabled: !isTeacher || isTemplate,
                action: () => openModal({ testId: id }),
                icon: <Grid2x2Plus size={18} strokeWidth={1.5} />,
                children: `Shablon yarat${isTemplate ? "ilingan" : "ish"}`,
              },
            ],
          }}
          className="flex items-center justify-center relative z-10 size-10 bg-white rounded-full"
        >
          <EllipsisVertical size={20} />
        </Dropdown>
      </div>

      <div className="flex items-end gap-2 ">
        {/* Details */}
        <div className="shrink-0">
          <b className="font-semibold text-lg">{taken}ta</b>
          <p className="text-gray-500">Xaftalik yechishlar soni</p>
        </div>

        {/* Stats */}
        <TestTakenCountChart
          data={data}
          className="w-full h-14"
          color={taken >= 20 ? "#22c55e" : "#3b82f6"}
          gradientId={taken >= 20 ? "gradientA" : "gradientB"}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Total test taken */}
          <div
            title="Umumiy yechilgan testlar"
            className="flex items-center gap-1.5"
          >
            <BookCheck strokeWidth={1.5} size={18} />
            <span>{totalTaken}ta</span>
          </div>

          {/* Parts count */}
          <div title="Sahifalar" className="flex items-center gap-1.5">
            <Columns2 strokeWidth={1.5} size={18} />
            <span>{totalParts}ta</span>
          </div>
        </div>

        <p className="text-gray-500 text-[15px]">{formatDate(createdAt)}</p>
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
