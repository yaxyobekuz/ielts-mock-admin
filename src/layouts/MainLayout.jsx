import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

// Lottie
import Lottie from "lottie-react";

// Animated
import duckShrugging from "@/assets/animated/duck-shrugging.json";

const MainLayout = () => {
  const location = useLocation();
  const auth = localStorage.getItem("auth");

  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (auth) return <AuthenticatedContent />;
  else return <UnauthenticatedContent />;
};

const UnauthenticatedContent = () => (
  <div className="flex items-center justify-center w-full min-h-screen bg-gray-50">
    <div className="flex items-center gap-8 px-5">
      {/* Duck */}
      <Lottie animationData={duckShrugging} className="size-40" />

      <div className="space-y-3.5">
        {/* Title */}
        <h1 className="text-2xl font-semibold">Hisobingizga kirmagansiz</h1>

        {/* Description */}
        <p className="text-lg text-gray-500">
          Agar hisobingiz mavjud bo'lsa unga kiring.
          <br />
          Aksincha bo'lsa yangi hisob yarating.
        </p>

        {/* Auth links */}
        <div className="flex items-center gap-3.5">
          <Link
            title="Login"
            to="/auth/login"
            className="btn bg-violet-500 text-white hover:bg-violet-600"
          >
            Hisobga kirish
          </Link>

          <Link
            title="Register"
            to="/auth/register"
            className="btn bg-blue-500 text-white hover:bg-blue-600"
          >
            Hisob yaratish
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const AuthenticatedContent = () => (
  <div className="flex flex-col min-h-screen">
    <Outlet />
  </div>
);

export default MainLayout;
