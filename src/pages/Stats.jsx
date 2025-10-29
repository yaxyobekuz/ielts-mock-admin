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
  Activity,
  LinkIcon,
  FileCheck,
  FileMinus,
  Headphones,
  ClipboardCheck,
  MousePointerClick,
  Calendar,
} from "lucide-react";

// React
import { useLayoutEffect } from "react";

// Toast
import { toast } from "@/notification/toast";

// Router
import { useParams } from "react-router-dom";

// API
import { statsApi } from "@/api/stats.api";
import { userStatsApi } from "@/api/userStats.api";

// Hooks
import useObjectStore from "@/hooks/useObjectStore";
import useObjectState from "@/hooks/useObjectState";

// Components
import Nav from "@/components/Nav";
import GrayCard from "@/components/GrayCard";
import LineChart from "@/components/charts/LineChart";

// Helpers
import { transformLineChartData } from "@/lib/chart.helpers";
import {
  appendDotZero,
  formatDate,
  formatWeek,
  roundToNearestHalf,
} from "@/lib/helpers";

const Stats = () => (
  <div className="container py-8 space-y-6">
    {/* Top */}
    <div className="flex items-center justify-between">
      <h1>Statistika</h1>

      {/* Date */}
      <div className="flex items-center gap-1.5">
        <Calendar strokeWidth={1.5} size={22} />
        Bugun:{" "}
        <span className="text-gray-500">
          {formatWeek(new Date())}, {formatDate(new Date())}
        </span>
      </div>
    </div>

    <div className="space-y-5">
      {/* User Stats */}
      <UserStats />

      {/* Detailed Stats */}
      <DetailedStats />
    </div>
  </div>
);

// Helper Components
const DetailedStats = () => {
  const { dateRangePeriod } = useParams();
  const entityKey = "detailed-" + dateRangePeriod;
  const isMonthly = dateRangePeriod === "monthly";
  const { getEntity, updateEntity } = useObjectStore("stats");

  const stats = getEntity(entityKey);
  const { setField, isLoading, hasError } = useObjectState({
    hasError: false,
    isLoading: !stats,
  });

  // Date range (start & end)
  const dateRange = (() => ({
    endDate: getDefaultEndDate(),
    startDate: getDateDaysAgo(isMonthly ? 30 : 7),
  }))();

  // Load detailed stats
  const loadDetailedStats = () => {
    setField("hasError", false);
    setField("isLoading", true);

    statsApi
      .getDetailed({
        endDate: dateRange.endDate,
        startDate: dateRange.startDate,
      })
      .then(({ code, data }) => {
        if (code !== "detailedStatsFetched") throw new Error();
        updateEntity(entityKey, data);
      })
      .catch(({ message }) => {
        setField("hasError", true);
        toast.error(message || "Nimadir xato ketdi");
      })
      .finally(() => setField("isLoading", false));
  };

  useLayoutEffect(() => {
    !stats && loadDetailedStats();
  }, [dateRangePeriod]);

  // Loading content
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Top */}
        <div className="flex items-center justify-between gap-5 animate-pulse">
          <div className="w-64 h-6 bg-gray-100 p-0 rounded-full" />
          <div className="w-48 h-11 bg-gray-100 py-0 rounded-full" />
        </div>

        {/* Charts */}
        <div
          className={`${
            isMonthly ? "grid-cols-1" : "grid-cols-2"
          } grid gap-5 animate-pulse`}
        >
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="w-full h-[376px] bg-gray-100 rounded-3xl"
            />
          ))}
        </div>
      </div>
    );
  }

  // Error content
  if (hasError) {
    return (
      <p className="py-8 text-red-500">
        Statistikani yuklashda xatolik yuz berdi!
      </p>
    );
  }

  // Content
  return (
    <div className="space-y-6">
      {/* Top */}
      <div className="flex items-center justify-between">
        {/* Date */}
        <div className="flex items-center gap-1.5">
          <Clock strokeWidth={1.5} size={22} />
          <span>{formatDate(stats?.dateRange?.start, true)}</span>
          <span className="text-gray-500">dan</span>
          <span>{formatDate(stats?.dateRange?.end, true)}</span>
          <span className="text-gray-500">gacha</span>
        </div>

        {/* Period Selector */}
        <Nav
          pagePathIndex={1}
          links={[
            { label: "7 kunlik", link: `statistics/weekly` },
            { label: "30 kunlik", link: `statistics/monthly` },
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
              transformLineChartData(
                stats?.charts?.tests?.deleted,
                "O'chirilgan"
              ),
            ]}
          />
        </GrayCard>

        {/* Submissions */}
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
    </div>
  );
};

const UserStats = () => {
  const { getEntity, updateEntity } = useObjectStore("stats");
  const stats = getEntity("user");
  const { setField, isLoading, hasError } = useObjectState({
    hasError: false,
    isLoading: !stats,
  });

  // Load user stats
  const loadUserStats = () => {
    setField("hasError", false);
    setField("isLoading", true);

    userStatsApi
      .get()
      .then(({ code, userStats }) => {
        if (code !== "userStatsFetched") throw new Error();
        updateEntity("user", userStats);
      })
      .catch(({ message }) => {
        setField("hasError", true);
        toast.error(message || "Nimadir xato ketdi");
      })
      .finally(() => setField("isLoading", false));
  };

  useLayoutEffect(() => {
    !stats && loadUserStats();
  }, []);

  // Loading content
  if (isLoading) {
    return (
      <ul className="grid grid-cols-4 gap-5 animate-pulse">
        {Array.from({ length: 4 }, (_, index) => (
          <li
            key={index}
            className="h-auto aspect-square bg-gray-100 rounded-3xl"
          />
        ))}
      </ul>
    );
  }

  // Error content
  if (hasError) {
    return (
      <p className="text-red-500">Statistikani yuklashda xatolik yuz berdi</p>
    );
  }

  // Content
  return (
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
            value: (stats.tests.created || 0) + "ta",
          },
          {
            title: "Hozirda mavjud",
            icon: { src: File, color: "green" },
            value: (stats.tests.active || 0) + "ta",
          },
          {
            title: "O'chirilgan",
            icon: { src: Trash, color: "red" },
            value: (stats.tests.deleted || 0) + "ta",
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
            value: (stats.submissions.created || 0) + "ta",
          },
          {
            title: "Baholangan",
            icon: { src: FileCheck, color: "green" },
            value: (stats.submissions.graded || 0) + "ta",
          },
          {
            title: "Baholanmagan",
            icon: { src: FileMinus, color: "red" },
            value: (stats.submissions.ungraded || 0) + "ta",
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
            value: (stats.results.created || 0) + "ta",
          },
          {
            title: "O'rtacha baho",
            icon: { src: Trophy, color: "orange" },
            value: appendDotZero(
              roundToNearestHalf(stats.results.avgScore.overall) || 0
            ),
          },
          {
            title: "Listening o'rtacha baho",
            icon: { src: Headphones, color: "green" },
            value: appendDotZero(
              roundToNearestHalf(stats.results.avgScore.listening) || 0
            ),
          },
          {
            title: "Reading o'rtacha baho",
            icon: { src: Book, color: "green" },
            value: appendDotZero(
              roundToNearestHalf(stats.results.avgScore.reading) || 0
            ),
          },
          {
            title: "Writing o'rtacha baho",
            icon: { src: Pen, color: "green" },
            value: appendDotZero(
              roundToNearestHalf(stats.results.avgScore.writing) || 0
            ),
          },
          {
            title: "Speaking o'rtacha baho",
            icon: { src: Mic, color: "green" },
            value: appendDotZero(
              roundToNearestHalf(stats.results.avgScore.Speaking) || 0
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
            value: (stats.links.created || 0) + "ta",
          },
          {
            title: "Aktiv",
            icon: { src: Activity, color: "green" },
            value: (stats.links.active || 0) + "ta",
          },
          {
            title: "Foydalanishlar",
            icon: { src: MousePointerClick, color: "orange" },
            value: (stats.links.totalUsages || 0) + "ta",
          },
          {
            title: "Ta'shriflar",
            icon: { src: Eye, color: "purple" },
            value: (stats.links.totalVisits || 0) + "ta",
          },
        ]}
      />
    </div>
  );
};

// Helper functions
const getDefaultEndDate = () => {
  return new Date().toISOString().split("T")[0];
};

const getDateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0];
};

export default Stats;
