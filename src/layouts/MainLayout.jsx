// React
import { useEffect } from "react";

// Lottie
import Lottie from "lottie-react";

// Auth api
import { authApi } from "@/api/auth.api";

// Toast
import { toast } from "@/notification/toast";

// Hooks
import useObjectStore from "@/hooks/useObjectStore";
import useObjectState from "@/hooks/useObjectState";
import usePathSegments from "@/hooks/usePathSegments";

// Components
import Header from "@/components/Header";
import MainBgLoader from "@/components/loaders/MainBgLoader";

// Animated
import duckShrugging from "@/assets/animated/duck-shrugging.json";

// Modals
import ProfileModal from "@/components/modal/ProfileModal";
import EditLinkModal from "@/components/modal/EditLinkModal";
import EditTestModal from "@/components/modal/EditTestModal";
import DeleteLinkModal from "@/components/modal/DeleteLinkModal";
import DeleteTestModal from "@/components/modal/DeleteTestModal";
import CreateTestModal from "@/components/modal/CreateTestModal";
import CreateLinkModal from "@/components/modal/CreateLinkModal";
import UseTemplateModal from "@/components/modal/UseTemplateModal";
import UpdateAvatarModal from "@/components/modal/UpdateAvatarModal";
import CreateResultModal from "@/components/modal/CreateResultModal";
import CreateTeacherModal from "@/components/modal/CreateTeacherModal";
import DeleteTeacherModal from "@/components/modal/DeleteTeacherModal";
import CreateTemplateModal from "@/components/modal/CreateTemplateModal";

// Router
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const { pathSegments } = usePathSegments();
  const { updateEntity } = useObjectStore("users");
  const isAllowedPage = !["preview", "edit"].includes(pathSegments[2]);

  const { isLoading, hasError, setField } = useObjectState({
    hasError: false,
    isLoading: true,
  });

  const loadProfile = () => {
    setField("isLoading", true);

    authApi
      .profile()
      .then(({ user, code }) => {
        if (code !== "profileSuccess") throw new Error();

        if (!["supervisor", "teacher"].includes(user.role)) {
          navigate("/auth/login");
          localStorage.removeItem("auth");
          return toast.error("Kirish uchun huquqlaringiz yetarli emas");
        }

        updateEntity("me", user);
      })
      .catch(() => setField("hasError", true))
      .finally(() => setField("isLoading", false));
  };

  // Load user profile
  useEffect(() => {
    isLoading && loadProfile();
  }, []);

  // Eror & Loader content
  if (isLoading || hasError) {
    return (
      <MainBgLoader
        hasError={hasError}
        onButtonClick={() => window.location.reload()}
      />
    );
  }

  // Content
  return (
    <div className="flex flex-col min-h-screen">
      {isAllowedPage ? <Header /> : null}
      <Outlet />

      {/* Modals */}
      <ProfileModal />
      <EditLinkModal />
      <EditTestModal />
      <CreateTestModal />
      <DeleteTestModal />
      <DeleteLinkModal />
      <CreateLinkModal />
      <UseTemplateModal />
      <CreateResultModal />
      <UpdateAvatarModal />
      <DeleteTeacherModal />
      <CreateTeacherModal />
      <CreateTemplateModal />
    </div>
  );
};

export default MainLayout;
