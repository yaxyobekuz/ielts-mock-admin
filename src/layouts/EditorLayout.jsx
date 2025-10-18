// React
import { useEffect } from "react";

// Api
import { testsApi } from "@/api/tests.api";

// Router
import { Outlet, useParams } from "react-router-dom";

// Hooks
import useModule from "@/hooks/useModule";
import useObjectState from "@/hooks/useObjectState";
import usePathSegments from "@/hooks/usePathSegments";

// Components
import PageInfo from "@/components/PageInfo";
import MainBgLoader from "@/components/loaders/MainBgLoader";
import UploadImageModal from "@/components/modal/UploadImageModal";

// Animations
import sadDuckAnimation from "@/assets/animated/duck-sad-out.json";

const EditorLayout = () => {
  const { testId } = useParams();
  const { pathSegments } = usePathSegments();
  const module = pathSegments[3];

  const { getModuleData, setModule } = useModule(module, testId);
  const { parts } = getModuleData() || {};

  const { setField, isLoading, error } = useObjectState({
    error: null,
    isLoading: !parts,
  });

  const loadTest = () => {
    setField("error", null);
    setField("isLoading", true);

    testsApi
      .getById(testId)
      .then(({ code, test }) => {
        if (code !== "testFetched") throw new Error();

        setField("test", test);
        setModule(test.reading, test._id, "reading");
        setModule(test.writing, test._id, "writing");
        setModule(test.listening, test._id, "listening");
      })
      .catch(({ message }) => {
        setField("error", message || "Nimadir xato ketdi");
      })
      .finally(() => setField("isLoading"));
  };

  useEffect(() => {
    !parts && loadTest();
  }, [testId]);

  // Loading content
  if (isLoading) return <MainBgLoader />;

  // Error content
  if (error) {
    return (
      <PageInfo
        title={error}
        allowFullScreen
        animation={sadDuckAnimation}
        links={{
          primary: { to: "/tests", body: "Testlar sahifasiga qaytish" },
        }}
      />
    );
  }

  return (
    <>
      <Outlet />
      <UploadImageModal />
    </>
  );
};

export default EditorLayout;
