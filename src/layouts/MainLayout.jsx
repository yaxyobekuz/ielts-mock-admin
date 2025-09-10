import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

// Lottie
import Lottie from "lottie-react";

// Auth api
import { authApi } from "@/api/auth.api";

// Hooks
import useStore from "@/hooks/useStore";
import usePathSegments from "@/hooks/usePathSegments";

// Components
import Header from "@/components/Header";
import MainBgLoader from "@/components/loaders/MainBgLoader";

// Modals
import CreateTestModal from "@/components/modal/CreateTestModal";
import CreateLinkModal from "@/components/modal/CreateLinkModal";

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

const AuthenticatedContent = () => {
  const { pathSegments } = usePathSegments();
  const { getData, updateProperty } = useStore("user");
  const isAllowedPage = !["preview", "edit"].includes(pathSegments[3]);
  const { isLoading, hasError } = getData();

  const loadProfile = () => {
    updateProperty("isLoading", true);
    updateProperty("hasError", false);

    authApi
      .profile()
      .then(({ user, code }) => {
        if (code !== "profileSuccess") throw new Error();
        updateProperty("data", user);
      })
      .catch(() => updateProperty("hasError", true))
      .finally(() => updateProperty("isLoading", false));
  };

  // Load user profile
  useEffect(() => {
    isLoading && loadProfile();
  }, []);

  // Eror & Loader content
  if (isLoading || hasError) {
    return <MainBgLoader hasError={hasError} onButtonClick={loadProfile} />;
  }

  // Content
  return (
    <div className="flex flex-col min-h-screen">
      {isAllowedPage ? <Header /> : null}
      <Outlet />

      {/* Modals */}
      <CreateTestModal />
      <CreateLinkModal />
    </div>
  );
};

export default MainLayout;
