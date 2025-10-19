// React
import { useEffect } from "react";

// Router
import { Link } from "react-router-dom";

// Api
import { testsApi } from "@/api/tests.api";

// Hooks
import useModal from "@/hooks/useModal";
import useArrayStore from "@/hooks/useArrayStore";
import usePermission from "@/hooks/usePermission";
import useObjectStore from "@/hooks/useObjectStore";

// Components
import Button from "@/components/form/Button";
import LineChart from "@/components/charts/LineChart";

// Icons
import { ArrowUpRight, Pencil, Plus } from "lucide-react";

// Images
import educationBg from "@/assets/backgrounds/education-red.jpg";

// Helpers
import { formatDate, formatTime, formatUzPhone } from "@/lib/helpers";

const Home = () => {
  const { getEntity } = useObjectStore("users");
  const user = getEntity("me") || {};

  return (
    <div className="container pt-8">
      <div className="space-y-6">
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

        {/* Tests status */}
        <div className="flex items-center gap-5 w-2/3">
          {/* Take */}
          <div className="space-y-1.5">
            <h3 className="ml-2">Olingan testlar</h3>
            <div className="btn w-full p-0 bg-gray-700 h-11 rounded-full text-white">
              24ta
            </div>
          </div>

          {/* Checked */}
          <div className="space-y-1.5">
            <h3>Tekshirilgan testlar</h3>
            <div className="btn w-full p-0 bg-green-100 h-11 rounded-full text-green-950">
              12ta
            </div>
          </div>

          {/* Not checked */}
          <div className="space-y-1.5">
            <h3>Tekshirilmagan testlar</h3>
            <div className="btn w-full p-0 bg-red-100 h-11 rounded-full text-red-950">
              12ta
            </div>
          </div>

          {/* Cancel */}
          <div className="space-y-1.5">
            <h3>Bekor qilingan testlar</h3>
            <div className="btn w-full p-0 bg-orange-100 h-11 rounded-full text-orange-950">
              4ta
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-5">
          {/* Profile */}
          <Profile user={user} />

          {/* Tests */}
          <Tests user={user} />

          {/* Stats */}
          <Stats user={user} />
        </div>
      </div>
    </div>
  );
};

const Profile = ({ user }) => {
  const avatar = user.avatar?.sizes?.medium?.url;
  const { openModal } = useModal("profile");

  return (
    <section
      style={{ backgroundImage: `url(${avatar || educationBg})` }}
      className="flex flex-col justify-between overflow-hidden w-full h-auto bg-gray-100 bg-cover bg-no-repeat aspect-square rounded-3xl"
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
      <div className="w-full p-5 mt-auto bg-gradient-to-b from-transparent to-black">
        <div className="flex items-center justify-between mb-3">
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
          className="btn p-0 rounded-full border border-white text-gray-200 hover:bg-white/20"
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

  useEffect(() => {
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

const Stats = () => (
  <section className="flex flex-col justify-between col-span-2 bg-gray-100 bg-cover bg-no-repeat rounded-3xl">
    {/* Top */}
    <div className="flex items-center justify-between p-5 pb-1.5">
      <h2 className="text-xl font-medium">Xaftalik statistika</h2>

      {/* Link */}
      <Link
        to="/statistics"
        title="Statistika"
        aria-label="Statistika"
        className="btn size-10 p-0 rounded-full bg-white backdrop-blur-sm"
      >
        <ArrowUpRight size={20} />
      </Link>
    </div>

    {/* Chart */}
    <LineChart className="size-full" />
  </section>
);

export default Home;
