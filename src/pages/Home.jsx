import { Link } from "react-router-dom";

// Hooks
import useStore from "@/hooks/useStore";

// Components
import LineChart from "@/components/charts/LineChart";

// Icons
import { ArrowUpRight, Pencil, Plus } from "lucide-react";

// Images
import educationBg from "@/assets/backgrounds/education-red.jpg";

// Helpers
import { formatDate, formatTime, formatUzPhone } from "@/lib/helpers";

const Home = () => {
  const { getData } = useStore("user");
  const user = getData()?.data || {};

  return (
    <div className="container pt-8">
      <div className="space-y-6">
        {/* Title */}
        <h1 className="capitalize text-3xl font-medium text-gray-800">
          {user.firstName} xush kelibsiz!
        </h1>

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

const Profile = ({ user }) => (
  <section
    style={{ backgroundImage: `url(${educationBg})` }}
    className="flex flex-col justify-between overflow-hidden w-full h-auto bg-gray-100 bg-cover bg-no-repeat aspect-square rounded-3xl"
  >
    {/* Top */}
    <div className="flex items-center justify-end p-5">
      <Link
        to="/profile"
        title="Profil"
        aria-label="Profil"
        className="btn size-10 p-0 rounded-full bg-black/20 backdrop-blur-sm"
      >
        <Pencil color="white" size={18} />
      </Link>
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

const Tests = ({ user }) => (
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

    {/* Bottom */}
    <div className="flex flex-col gap-3.5 w-full p-5 pt-0 grow">
      <ul className="grow space-y-3 max-h-full overflow-y-auto">
        {Array.from({ length: 3 }, (_, index) => (
          <li
            key={index}
            className="flex items-center justify-between gap-2 pr-2"
          >
            <div className="flex items-center gap-2">
              {/* Index */}
              <div className="flex items-center justify-center size-11 bg-black/70 rounded-full text-white font-medium">
                0{index + 1}
              </div>

              {/* Details */}
              <div className="space-y-1">
                <h3 className="font-medium">Test nomi</h3>
                <span className="text-sm text-gray-500">
                  {formatDate(new Date())} {formatTime(new Date())}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="size-6 bg-green-400 rounded-full" />
          </li>
        ))}
      </ul>

      {/* Payment */}
      <Link
        to="/payment"
        title="Hisobni to'ldirish"
        className="btn h-9 bg-blue-500 p-0 rounded-full text-white hover:bg-blue-600"
      >
        <span>Test qo'shish</span>
        <Plus size={20} className="ml-2" />
      </Link>
    </div>
  </section>
);

const Stats = ({ user }) => (
  <section className="flex flex-col justify-between col-span-2 bg-gray-100 bg-cover bg-no-repeat rounded-3xl">
    {/* Top */}
    <div className="flex items-center justify-between p-5 pb-1.5">
      <h2 className="text-xl font-medium">Xaftalik statistika</h2>

      {/* Link */}
      <Link
        to="/tests"
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
