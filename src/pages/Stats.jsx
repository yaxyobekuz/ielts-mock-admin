// Icons
import {
  UsersIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClipboardListIcon,
} from "lucide-react";

// Hooks
import useStore from "@/hooks/useStore";

// React
import { useEffect, useMemo } from "react";

// Stats api
import { statsApi } from "@/api/stats.api";

// Helpers
import { formatDate } from "@/lib/helpers";

// Components
import LineChart from "@/components/charts/LineChart";

const Stats = () => {
  const { getProperty, updateProperty } = useStore("stats");
  const stats = getProperty("week");

  const loadStats = async () => {
    updateProperty("isLoading", true);
    updateProperty("hasError", false);

    statsApi
      .get("month")
      .then(({ submissionsSeries, summary, teacherStats, code }) => {
        if (code !== "statsFetched") throw new Error();
        updateProperty("week", { submissionsSeries, summary, teacherStats });
      })
      .catch((err) => {
        updateProperty("hasError", true);
      })
      .finally(() => updateProperty("isLoading", false));
  };

  // Load user profile
  useEffect(() => {
    !stats && loadStats();
  }, []);

  return (
    <div className="container py-8 space-y-6">
      {/* Title */}
      <h1>Statistika</h1>

      {/* Main content */}
      {stats && <Main {...stats} />}
    </div>
  );
};

const Card = ({ title, value, icon: Icon, color }) => (
  <div className="flex flex-col justify-between p-5 aspect-square bg-gray-100 rounded-3xl transition">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className={`p-2 rounded-xl bg-white shadow-sm text-${color}-500`}>
        <Icon size={22} />
      </div>
    </div>
    <h2 className="text-3xl font-semibold mt-2">{value}</h2>
  </div>
);

const TeacherTable = ({ data }) => (
  <div className="col-span-2 bg-gray-100 rounded-3xl p-5">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-medium">O'qituvchilar faolligi</h2>
      <UsersIcon size={22} />
    </div>

    <div className="overflow-auto max-h-72">
      <table className="w-full border-collapse text-sm">
        <thead className="">
          <tr className="!bg-gray-50 text-left">
            <th className="w-full p-2 rounded-l-lg">O'qituvchi</th>
            <th className="w-full p-2">Yaratilgan</th>
            <th className="w-full p-2">O'chirilgan</th>
            <th className="w-full p-2">Yechishlar</th>
            <th className="w-full p-2">Tekshirilgan</th>
            <th className="w-full p-2 rounded-r-lg">O'rtacha ball</th>
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((t) => (
              <tr
                key={t.teacherId}
                className="hover:bg-gray-50 border-b border-gray-200"
              >
                <td className="w-full p-2 font-medium">{t.name}</td>
                <td className="w-full p-2">{t.testsCreated}</td>
                <td className="w-full p-2">{t.testsDeleted}</td>
                <td className="w-full p-2">{t.submissionsCount}</td>
                <td className="w-full p-2">{t.reviewedCount}</td>
                <td className="w-full p-2">{t.avgScore}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                Ma’lumot topilmadi
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const Main = ({ submissionsSeries = [], summary = {}, teacherStats = [] }) => {
  const chartData = useMemo(() => {
    return [
      {
        id: "Test yechishlar",
        data: submissionsSeries.map(({ x, y }) => ({
          x: formatDate(x, true),
          y,
        })),
      },
    ];
  }, [submissionsSeries]);

  return (
    <div className="grid grid-cols-4 gap-5">
      {/* Stat Cards */}
      <Card
        title="Yaratilgan testlar"
        value={summary.testsCreatedCount || 0}
        icon={ClipboardListIcon}
        color="blue"
      />
      <Card
        title="Yechilgan testlar"
        value={summary.submissionsCount || 0}
        icon={CheckCircleIcon}
        color="green"
      />
      <Card
        title="Tekshirilganlar"
        value={summary.resultsCount || summary.reviewedCount || 0}
        icon={ChartBarIcon}
        color="purple"
      />
      <Card
        title="O'rtacha ball"
        value={summary.avgScore?.toFixed(2) || "0.00"}
        icon={ChartBarIcon}
        color="orange"
      />

      {/* Chart */}
      <section className="flex flex-col justify-between col-span-2 bg-gray-100 rounded-3xl pb-2">
        {/* Top */}
        <div className="flex items-center justify-between p-5 pb-1.5">
          <h2 className="text-xl font-medium">Vaqt bo'yicha test yechishlar</h2>
          <div className="p-2 rounded-full bg-white shadow-sm">
            <ChartBarIcon size={20} />
          </div>
        </div>

        {/* Chart */}
        <div className="w-full h-64 p-2">
          <LineChart data={chartData} className="size-full" />
        </div>
      </section>

      {/* Teacher table (faqat supervisor uchun) */}
      <TeacherTable data={teacherStats} />
    </div>
  );
};

export default Stats;
