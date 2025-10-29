// Router
import { Link } from "react-router-dom";

// Toast
import { toast } from "@/notification/toast";

// React
import { useLayoutEffect, useMemo } from "react";

// Api
import { testsApi } from "@/api/tests.api";
import { statsApi } from "@/api/stats.api";
import { userStatsApi } from "@/api/userStats.api";

// Hooks
import useModal from "@/hooks/useModal";
import useArrayStore from "@/hooks/useArrayStore";
import usePermission from "@/hooks/usePermission";
import useObjectStore from "@/hooks/useObjectStore";
import useObjectState from "@/hooks/useObjectState";

// Components
import GrayCard from "@/components/GrayCard";
import Button from "@/components/form/Button";
import LineChart from "@/components/charts/LineChart";

// Icons
import { ArrowUpRight, Pencil, Plus } from "lucide-react";

// Helpers
import {
  formatDate,
  formatTime,
  formatWeek,
  formatUzPhone,
} from "@/lib/helpers";
import { transformLineChartData } from "@/lib/chart.helpers";

// Images
import educationBg from "@/assets/backgrounds/education-red.jpg";

const Home = () => {
  const { getEntity } = useObjectStore("users");
  const user = getEntity("me") || {};

  return (
    <div className="container py-8 space-y-6">
      {/* Top */}
      <div className="flex items-center gap-3.5">
        {/* Title */}
        <h1>{user.firstName} xush kelibsiz!</h1>

        {/* User role */}
        <div
          title="Rolingiz"
          className="bg-green-50 text-green-500 px-1.5 rounded-md border border-green-200 text-sm"
        >
          {user.role}
        </div>
      </div>

      {/* User stats */}
      <UserStats />

      {/* Middle */}
      <div className="grid grid-cols-4 gap-5">
        {/* Profile */}
        <Profile user={user} />

        {/* Tests */}
        <Tests user={user} />

        {/* Stats */}
        <SubmissionsStats />
      </div>
    </div>
  );
};

// Helper omponents
const Profile = ({ user }) => {
  const avatar = user.avatar?.sizes?.medium?.url;
  const { openModal } = useModal("profile");

  return (
    <section
      style={{ backgroundImage: `url(${avatar || educationBg})` }}
      className="flex flex-col justify-between overflow-hidden w-full h-auto bg-gray-100 bg-cover bg-no-repeat bg-center aspect-square rounded-3xl"
    >
      {/* Top */}
      <div className="flex items-center justify-end p-5">
        <button
          title="Profilni tahrirlash"
          aria-label="Profilni tahrirlash"
          onClick={() => openModal({ openEditor: true })}
          className="btn size-10 p-0 rounded-full bg-black/20 backdrop-blur-sm"
        >
          <Pencil color="white" size={18} />
        </button>
      </div>

      {/* Bottom */}
      <div className="w-full space-y-3 p-5 mt-auto bg-gradient-to-b from-transparent to-black">
        <div className="flex items-center justify-between">
          {/* Full name */}
          <h2 className="line-clamp-1 capitalize text-xl font-medium text-white">
            {user.firstName} {user.lastName}
          </h2>

          {/* Phone */}
          <span className="shrink-0 text-gray-200">
            {formatUzPhone(user.phone)}
          </span>
        </div>

        {/* Balance */}
        <Link
          to="/payment"
          title="Hisobni to'ldirish"
          className="hidden btn p-0 rounded-full border border-white text-gray-200 hover:bg-white/20"
        >
          <span>{user.balance?.toLocaleString()} so'm</span>
          <Plus size={20} className="ml-2" />
        </Link>
      </div>
    </section>
  );
};

const Tests = ({ user }) => {
  const {
    setCollection,
    getCollectionData,
    getCollectionError,
    isCollectionLoading,
    setCollectionErrorState,
    setCollectionLoadingState,
  } = useArrayStore("latestTests");
  const tests = getCollectionData();
  const error = getCollectionError();
  const isLoading = isCollectionLoading();

  const isTeacher = user.role === "teacher";
  const { openModal } = useModal("createTest");
  const { checkPermission } = usePermission("teacher", user);
  const canCreateTest = checkPermission("canCreateTest") && isTeacher;

  const loadTests = () => {
    setCollectionErrorState(null);
    setCollectionLoadingState(true);

    testsApi
      .getLatest()
      .then(({ code, tests }) => {
        if (code !== "latestTestsFetched") throw new Error();
        setCollection(tests);
      })
      .catch(({ message }) =>
        setCollectionErrorState(message || "Nimadir xato ketdi")
      );
  };

  useLayoutEffect(() => {
    isLoading && loadTests();
  }, []);

  return (
    <section className="flex flex-col justify-between overflow-hidden w-full h-auto bg-gray-100 bg-cover bg-no-repeat aspect-square rounded-3xl">
      {/* Top */}
      <div className="flex items-center justify-between p-5 pb-3.5">
        <h2 className="text-xl font-medium">Oxirgi testlar</h2>

        {/* Link */}
        <Link
          to="/tests"
          title="Barcha testlar"
          aria-label="Barcha testlar"
          className="btn size-10 p-0 rounded-full bg-white backdrop-blur-sm"
        >
          <ArrowUpRight size={20} />
        </Link>
      </div>

      {/* Main */}
      <div className="flex flex-col gap-3.5 w-full h-[calc(100%-74px)] p-5 pt-0 grow">
        {!error && (
          <ul className="space-y-3 max-h-[calc(100%-50px)] overflow-auto scroll-y-primary scroll-smooth">
            {/* Skeleton Loader */}
            {isLoading &&
              Array.from({ length: 5 }, (_, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between gap-2 pr-1 relative animate-pulse"
                >
                  <div className="flex items-center gap-2 w-full">
                    {/* Index */}
                    <div className="shrink-0 size-11 bg-gray-200 rounded-full" />

                    {/* Details */}
                    <div className="w-full space-y-1.5">
                      <div className="w-1/2 h-4 bg-gray-200 rounded-md" />
                      <div className="w-4/5 h-3.5 bg-gray-200 rounded-md" />
                    </div>
                  </div>
                </li>
              ))}

            {/* Tests */}
            {!isLoading &&
              tests.map(({ title, updatedAt, _id: id }, index) => (
                <li
                  key={id}
                  className="flex items-center justify-between gap-2 pr-1 relative"
                >
                  <div className="flex items-center gap-2">
                    {/* Index */}
                    <div className="flex items-center justify-center shrink-0 size-11 bg-black/70 rounded-full text-white font-medium">
                      0{index + 1}
                    </div>

                    {/* Details */}
                    <div className="space-y-1">
                      <h3 className="capitalize line-clamp-1 font-medium">
                        {title}
                      </h3>
                      <span className="line-clamp-1 text-sm text-gray-500">
                        {formatDate(updatedAt)} {formatTime(updatedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Link */}
                  <Link
                    to={`/tests/${id}`}
                    className="block absolute z-0 inset-0 size-full -outline-offset-1 rounded-full"
                  />
                </li>
              ))}
          </ul>
        )}

        {/* Error */}
        {!isLoading && error ? <p className="text-gray-500">{error}</p> : null}

        {/* Create new */}
        <Button
          disabled={!canCreateTest}
          onClick={() => openModal()}
          className="h-9 !p-0 mt-auto !rounded-full"
        >
          <span>Test qo'shish</span>
          <Plus size={20} className="ml-2" />
        </Button>
      </div>
    </section>
  );
};

const SubmissionsStats = () => {
  const { getEntity, updateEntity } = useObjectStore("stats");
  const stats = getEntity("dashboard");
  const createdSubmissions = stats?.summary?.submissionsCreated || 0;
  const { setField, isLoading, hasError } = useObjectState({
    hasError: false,
    isLoading: !stats,
  });

  // Load dashboard stats
  const loadDashboardStats = () => {
    setField("hasError", false);
    setField("isLoading", true);

    statsApi
      .getDashboard({ period: "daily", days: 7 })
      .then(({ code, data }) => {
        if (code !== "dashboardStatsFetched") throw new Error();
        updateEntity("dashboard", data, "stats");
      })
      .catch(({ message }) => {
        setField("hasError", true);
        toast.error(message || "Nimadir xato ketdi");
      })
      .finally(() => setField("isLoading", false));
  };

  useLayoutEffect(() => {
    !stats && loadDashboardStats();
  }, []);

  const { chartData, colorIndex } = useMemo(() => {
    const chartData = [
      transformLineChartData(
        stats?.charts?.submissionsCreated,
        "Javoblar soni",
        { x: formatWeek, value: (y) => y + "ta" }
      ),
    ];

    const colorIndex = (() => {
      if (createdSubmissions < 11) return 3; // red 👎
      else if (createdSubmissions < 21) return 1; // green 👍
      else if (createdSubmissions < 41) return 2; // blue 🙂
      else return 4; // violet 🤩
    })();

    return { chartData, colorIndex };
  }, [isLoading, hasError]);

  return (
    <GrayCard
      className="col-span-2 pb-5"
      title="So'nggi 7 kunda olingan javoblar"
      icon={
        <div className="btn h-10 py-0 rounded-full bg-white text-green-950">
          {createdSubmissions} ta
        </div>
      }
    >
      {isLoading ? (
        <div className="flex flex-col items-center size-full px-5 animate-pulse">
          <div className="size-full bg-white/50 rounded-lg mb-5" />
          <div className="shrink-0 w-32 h-5 bg-white/50 rounded-full" />
        </div>
      ) : (
        <LineChart
          enableArea
          data={chartData}
          className="size-full"
          colorIndex={colorIndex}
        />
      )}
    </GrayCard>
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
      <div className="flex items-center gap-5 flex-wrap animate-pulse">
        <div className="space-y-1.5">
          <div className="w-28 h-5 bg-gray-100 rounded-full" />
          <div className="w-44 h-11 bg-gray-100 rounded-full" />
        </div>
        <div className="space-y-1.5">
          <div className="w-28 h-5 bg-gray-100 rounded-full" />
          <div className="w-44 h-11 bg-gray-100 rounded-full" />
        </div>
        <div className="space-y-1.5">
          <div className="w-28 h-5 bg-gray-100 rounded-full" />
          <div className="w-44 h-11 bg-gray-100 rounded-full" />
        </div>
        <div className="space-y-1.5">
          <div className="w-28 h-5 bg-gray-100 rounded-full" />
          <div className="w-44 h-11 bg-gray-100 rounded-full" />
        </div>
      </div>
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
    <div className="flex items-center gap-5 flex-wrap">
      {/* Active Tests */}
      <div className="space-y-1.5">
        <h3 className="ml-1.5 text-sm">Mavjud testlar</h3>
        <div className="btn w-44 p-0 bg-gray-700 h-11 rounded-full text-white">
          {stats.tests.active || 0}ta
        </div>
      </div>

      {/* Active Submissions */}
      <div className="space-y-1.5">
        <h3 className="ml-1.5 text-sm">Olingan javoblar</h3>
        <div className="btn w-44 p-0 bg-blue-100 h-11 rounded-full text-blue-950">
          {stats.submissions.active || 0}ta
        </div>
      </div>

      {/* Active results */}
      <div className="space-y-1.5">
        <h3 className="ml-1.5 text-sm">Mavjud natijalar</h3>
        <div className="btn w-44 p-0 bg-green-100 h-11 rounded-full text-green-950">
          {stats.results.active || 0}ta
        </div>
      </div>

      {/* Active links */}
      <div className="space-y-1.5">
        <h3 className="ml-1.5 text-sm">Aktiv havolalar</h3>
        <div className="btn w-44 p-0 bg-pink-100 h-11 rounded-full text-pink-950">
          {stats.links.active || 0}ta
        </div>
      </div>
    </div>
  );
};

export default Home;
