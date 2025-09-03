import { useEffect } from "react";

// Hooks
import useStore from "@/hooks/useStore";
import useModal from "@/hooks/useModal";

// Tests api
import { testsApi } from "@/api/tests.api";

// Helpers
import { formatDate, getRandomNumber } from "@/lib/helpers";

// Icons
import { BookCheck, Columns2, Pin, PinOff, Plus } from "lucide-react";

// Components
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
      <h1 className="">Testlar</h1>

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

      {tests.map((test, index) => (
        <TestItem key={test?._id} {...test} />
      ))}
    </>
  );
};

const AddNew = () => {
  const { openModal } = useModal("createTest");

  return (
    <button
      onClick={() => openModal()}
      className="group flex items-center justify-center gap-3.5 relative w-full min-h-[200px] bg-[#e31837] rounded-3xl p-5 transition-colors duration-200 hover:bg-red-600"
    >
      <span className="text-xl font-medium text-white">Test qo'shish</span>
      <Plus
        size={32}
        color="white"
        className="transition-transform duration-200 group-hover:rotate-180"
      />
    </button>
  );
};

const TestItem = ({
  pin,
  title,
  createdAt,
  taken = 0,
  totalParts = 0,
  totalTaken = 0,
}) => {
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
    <div className="w-full bg-gray-100 rounded-3xl p-5 space-y-5">
      <div className="flex items-center justify-between">
        {/* Title */}
        <h3 className="text-xl font-medium capitalize">{title}</h3>

        {/* Pin toogle */}
        <button
          title={pin ? "Unpin" : "Pin"}
          aria-label={pin ? "Unpin" : "Pin"}
          className="flex items-center justify-center size-10 bg-white rounded-full"
        >
          {pin ? (
            <PinOff size={18} className="rotate-45" color="red" />
          ) : (
            <Pin size={18} className="rotate-45" />
          )}
        </button>
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
    </div>
  );
};

const TestItemSkeleton = () => (
  <div className="w-full h-auto min-h-[200px] bg-gray-100 rounded-3xl p-5 space-y-5 animate-pulse" />
);

export default Tests;
