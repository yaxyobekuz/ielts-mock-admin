import { useEffect } from "react";

// Hooks
import useStore from "@/hooks/useStore";

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
        <TestItem key={test?._id} {...test} index={index} />
      ))}
    </>
  );
};

const AddNew = () => {
  return (
    <button className="group flex items-center justify-center gap-3.5 relative w-full min-h-[200px] bg-[#e31837] rounded-3xl p-5 transition-colors duration-200 hover:bg-red-600">
      <span className="text-xl font-medium text-white">Test qo'shish</span>
      <Plus
        size={32}
        color="white"
        className="transition-transform duration-200 group-hover:rotate-180"
      />
    </button>
  );
};

const TestItem = ({ index }) => {
  const testTaken = getRandomNumber(0, 30);

  const data = [
    {
      id: "Umumiy",
      data: [
        { x: "Du", y: getRandomNumber(0, 20) },
        { x: "Se", y: getRandomNumber(0, 20) },
        { x: "Pay", y: getRandomNumber(0, 20) },
        { x: "Ju", y: getRandomNumber(0, 20) },
        { x: "Sha", y: getRandomNumber(0, 20) },
        { x: "Yak", y: getRandomNumber(0, 20) },
      ],
    },
  ];

  return (
    <div className="w-full bg-gray-100 rounded-3xl p-5 space-y-5">
      <div className="flex items-center justify-between">
        {/* Title */}
        <h3 className="text-xl font-medium">Test sarlavhasi</h3>

        {/* Pin toogle */}
        <button
          title={index > 1 ? "Pin" : "Unpin"}
          aria-label={index > 1 ? "Pin" : "Unpin"}
          className="flex items-center justify-center size-10 bg-white rounded-full"
        >
          {index > 1 ? (
            <Pin size={18} className="rotate-45" />
          ) : (
            <PinOff size={18} className="rotate-45" color="red" />
          )}
        </button>
      </div>

      <div className="flex items-end gap-2 ">
        {/* Details */}
        <div className="shrink-0">
          <b
            className={`${
              testTaken >= 20 ? "text-green-500" : ""
            } font-semibold text-lg`}
          >
            {testTaken}ta
          </b>
          <p className="text-gray-500">Xaftalik yechishlar soni</p>
        </div>

        {/* Stats */}
        <TestTakenCountChart
          data={data}
          className="w-full h-14"
          gradientId={`gradient-${index}`}
          color={testTaken >= 20 ? "#22c55e" : "#3b82f6"}
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
            <span>{testTaken + getRandomNumber(0, 70)}ta</span>
          </div>

          {/* Parts count */}
          <div title="Sahifalar" className="flex items-center gap-1.5">
            <Columns2 strokeWidth={1.5} size={18} />
            <span>4ta</span>
          </div>
        </div>

        <p className="text-gray-500 text-[15px]">{formatDate(new Date())}</p>
      </div>
    </div>
  );
};

const TestItemSkeleton = () => (
  <div className="w-full h-auto min-h-[200px] bg-gray-100 rounded-3xl p-5 space-y-5 animate-pulse" />
);

export default Tests;
