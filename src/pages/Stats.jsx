// Icons
import {
  Pen,
  Mic,
  Eye,
  Book,
  File,
  Clock,
  Trash,
  Target,
  Trophy,
  Grid2x2,
  FileText,
  LinkIcon,
  FileCheck,
  FileMinus,
  Headphones,
  ClipboardCheck,
  MousePointerClick,
} from "lucide-react";

// React
import { useEffect, useMemo } from "react";

// API
import { statsApi } from "@/api/stats.api";

// Toast
import { toast } from "@/notification/toast";

// Router
import { useParams } from "react-router-dom";

// Hooks
import useObjectStore from "@/hooks/useObjectStore";
import useObjectState from "@/hooks/useObjectState";

// Components
import Nav from "@/components/Nav";
import GrayCard from "@/components/GrayCard";
import LineChart from "@/components/charts/LineChart";

// Helpers
import { transformLineChartData } from "@/lib/chart.helpers";
import { appendDotZero, formatDate, roundToNearestHalf } from "@/lib/helpers";

const Stats = () => {
  const { dateRangePeriod } = useParams();
  const { getEntity, updateEntity } = useObjectStore("stats");

  // Date range (start & end)
  const dateRange = useMemo(() => {
    if (dateRangePeriod === "weekly") {
      return { startDate: getDateDaysAgo(7), endDate: getDefaultEndDate() };
    } else {
      return { startDate: getDateDaysAgo(30), endDate: getDefaultEndDate() };
    }
  }, [dateRangePeriod]);

  // States
  const stats = getEntity(dateRangePeriod);
  const isMonthly = dateRangePeriod === "monthly";
  const { setField, isLoading, hasError } = useObjectState({
    hasError: false,
    isLoading: !stats,
  });

  // Load detailed stats
  const loadStats = () => {
    setField("hasError", false);
    setField("isLoading", true);

    statsApi
      .getDetailed({
        endDate: dateRange.endDate,
        startDate: dateRange.startDate,
      })
      .then(({ code, data }) => {
        if (code !== "detailedStatsFetched") throw new Error();
        updateEntity(dateRangePeriod, data);
      })
      .catch(({ message }) => {
        setField("hasError", true);
        toast.error(message || "Nimadir xato ketdi");
      })
      .finally(() => setField("isLoading", false));
  };

  useEffect(() => {
    !stats && loadStats();
  }, [dateRangePeriod]);

  // Loading content
  if (isLoading) return <LoadingContent isMonthly={isMonthly} />;

  // Error content
  if (hasError) {
    return <div className="container py-8">Error</div>;
  }

  // Stats content
  return (
    <div className="container py-8 space-y-6">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1>Statistika</h1>

        {/* Date range */}
        <div className="flex items-center gap-1.5">
          <Clock strokeWidth={1.5} size={22} />
          <span>{formatDate(stats?.dateRange?.start, true)}</span>
          <span className="text-gray-500">dan</span>
          <span>{formatDate(stats?.dateRange?.end, true)}</span>
          <span className="text-gray-500">gacha</span>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex justify-end">
        <Nav
          pagePathIndex={1}
          links={[
            { label: "7 kunlik", link: `statistics/weekly` },
            { label: "30 kunlik", link: `statistics/monthly` },
          ]}
        />
      </div>

      <div className="space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-4 gap-5">
          {/* Tests */}
          <GrayCard
            color="blue"
            title="Testlar"
            icon={FileText}
            list={[
              {
                title: "Umumiy",
                icon: { src: Grid2x2, color: "blue" },
                value: (stats?.summary?.tests?.total || 0) + "ta",
              },
              {
                title: "Hozirda mavjud",
                icon: { src: File, color: "green" },
                value: (stats?.summary?.tests?.active || 0) + "ta",
              },
              {
                title: "O'chirilgan",
                icon: { src: Trash, color: "red" },
                value: (stats?.summary?.tests?.deleted || 0) + "ta",
              },
            ]}
          />

          {/* Submissions */}
          <GrayCard
            color="green"
            title="Javoblar"
            icon={ClipboardCheck}
            list={[
              {
                title: "Umumiy",
                icon: { src: Grid2x2, color: "blue" },
                value: (stats?.summary?.submissions?.total || 0) + "ta",
              },
              {
                title: "Baholangan",
                icon: { src: FileCheck, color: "green" },
                value: (stats?.summary?.submissions?.graded || 0) + "ta",
              },
              {
                title: "Baholanmagan",
                icon: { src: FileMinus, color: "red" },
                value: (stats?.summary?.submissions?.ungraded || 0) + "ta",
              },
            ]}
          />

          {/* Results */}
          <GrayCard
            icon={Target}
            color="purple"
            title="Natijalar"
            list={[
              {
                title: "Umumiy",
                icon: { src: Grid2x2, color: "blue" },
                value: (stats?.summary?.results?.total || 0) + "ta",
              },
              {
                title: "O'rtacha baho",
                icon: { src: Trophy, color: "orange" },
                value: appendDotZero(
                  roundToNearestHalf(stats?.summary?.results?.avgOverall) || 0
                ),
              },
              {
                title: "Listening o'rtacha baho",
                icon: { src: Headphones, color: "green" },
                value: appendDotZero(
                  roundToNearestHalf(stats?.summary?.results?.avgListening) || 0
                ),
              },
              {
                title: "Reading o'rtacha baho",
                icon: { src: Book, color: "green" },
                value: appendDotZero(
                  roundToNearestHalf(stats?.summary?.results?.avgReading) || 0
                ),
              },
              {
                title: "Writing o'rtacha baho",
                icon: { src: Pen, color: "green" },
                value: appendDotZero(
                  roundToNearestHalf(stats?.summary?.results?.avgWriting) || 0
                ),
              },
              {
                title: "Speaking o'rtacha baho",
                icon: { src: Mic, color: "green" },
                value: appendDotZero(
                  roundToNearestHalf(stats?.summary?.results?.avgSpeaking) || 0
                ),
              },
            ]}
          />

          {/* Links */}
          <GrayCard
            color="red"
            title="Havolalar"
            icon={LinkIcon}
            list={[
              {
                title: "Umumiy",
                icon: { src: Grid2x2, color: "blue" },
                value: (stats?.summary?.links?.total || 0) + "ta",
              },
              {
                title: "Foydalanishlar",
                icon: { src: MousePointerClick, color: "green" },
                value: (stats?.summary?.links?.usages || 0) + "ta",
              },
              {
                title: "Ta'shriflar",
                icon: { src: Eye, color: "green" },
                value: (stats?.summary?.links?.visits || 0) + "ta",
              },
            ]}
          />
        </div>

        {/* Charts */}
        <div
          className={`${isMonthly ? "grid-cols-1" : "grid-cols-2"} grid gap-5`}
        >
          {/* Tests Chart */}
          <GrayCard title="Testlar" className="pb-5">
            <LineChart
              className="h-72"
              data={[
                transformLineChartData(
                  stats?.charts?.tests?.created,
                  "Yaratilgan"
                ),
                transformLineChartData(stats?.charts?.tests?.active, "Mavjud"),
                transformLineChartData(
                  stats?.charts?.tests?.deleted,
                  "O'chirilgan"
                ),
              ]}
            />
          </GrayCard>

          <GrayCard title="Javoblar" className="pb-5">
            <LineChart
              className="h-72"
              data={[
                transformLineChartData(
                  stats?.charts?.submissions?.created,
                  "Yaratilgan"
                ),
                transformLineChartData(
                  stats?.charts?.submissions?.graded,
                  "Tekshirilgan"
                ),
                transformLineChartData(
                  stats?.charts?.submissions?.ungraded,
                  "Tekshirilmagan"
                ),
              ]}
            />
          </GrayCard>

          {/* Results */}
          <GrayCard title="Natijalar" className="pb-5">
            <LineChart
              className="h-72"
              data={[
                transformLineChartData(
                  stats?.charts?.results?.avgOverall,
                  "Umumiy",
                  {
                    y: roundToNearestHalf,
                    value: (v) => appendDotZero(roundToNearestHalf(v)),
                  }
                ),
                transformLineChartData(
                  stats?.charts?.results?.avgReading,
                  "Reading",
                  {
                    y: roundToNearestHalf,
                    value: (v) => appendDotZero(roundToNearestHalf(v)),
                  }
                ),
                transformLineChartData(
                  stats?.charts?.results?.avgWriting,
                  "Writing",
                  {
                    y: roundToNearestHalf,
                    value: (v) => appendDotZero(roundToNearestHalf(v)),
                  }
                ),
                transformLineChartData(
                  stats?.charts?.results?.avgListening,
                  "Listening",
                  {
                    y: roundToNearestHalf,
                    value: (v) => appendDotZero(roundToNearestHalf(v)),
                  }
                ),
                transformLineChartData(
                  stats?.charts?.results?.avgSpeaking,
                  "Speaking",
                  {
                    y: roundToNearestHalf,
                    value: (v) => appendDotZero(roundToNearestHalf(v)),
                  }
                ),
              ]}
            />
          </GrayCard>

          {/* Links */}
          <GrayCard title="Havolalar" className="pb-5">
            <LineChart
              className="h-72"
              data={[
                transformLineChartData(
                  stats?.charts?.links?.visits,
                  "Tashriflar"
                ),
                transformLineChartData(
                  stats?.charts?.links?.usages,
                  "Foydalanishlar"
                ),
              ]}
            />
          </GrayCard>
        </div>

        {/* Activity chart */}
        <GrayCard title="Faollik" className="pb-5">
          <LineChart
            enableArea
            className="h-72"
            data={[transformLineChartData(stats?.charts?.activity, "Ball")]}
          />
        </GrayCard>
      </div>
    </div>
  );
};

// Helper Components
const LoadingContent = ({ isMonthly }) => (
  <div className="container py-8 space-y-6">
    {/* Top */}
    <div className="flex items-center justify-between">
      <h1>Yuklanmoqda...</h1>
      <div className="flex items-center gap-3.5 animate-pulse">
        <div className="w-32 h-6 bg-gray-100 p-0 rounded-full" />
        <div className="w-32 h-6 bg-gray-100 p-0 rounded-full" />
      </div>
    </div>

    {/* Action buttons */}
    <div className="flex items-center justify-end gap-5 animate-pulse">
      <div className="w-48 h-11 bg-gray-100 py-0 rounded-full" />
    </div>

    <div className="space-y-5 animate-pulse">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-5">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-auto aspect-square bg-gray-100 rounded-3xl"
          />
        ))}
      </div>

      {/* Charts */}
      <div
        className={`${isMonthly ? "grid-cols-1" : "grid-cols-2"} grid gap-5`}
      >
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="w-full h-[376px] bg-gray-100 rounded-3xl"
          />
        ))}
      </div>

      {/* Activity chart */}
      <div className="w-full h-[376px] bg-gray-100 rounded-3xl" />
    </div>
  </div>
);

const getDefaultEndDate = () => {
  return new Date().toISOString().split("T")[0];
};

const getDateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0];
};

export default Stats;
