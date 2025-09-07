// React
import { useEffect } from "react";

// Api
import { testsApi } from "@/api/tests.api";

// Toast
import { toast } from "@/notification/toast";

// Router
import { Outlet, useParams } from "react-router-dom";

// Hooks
import useModule from "@/hooks/useModule";
import useObjectState from "@/hooks/useObjectState";
import usePathSegments from "@/hooks/usePathSegments";

// Components
import MainBgLoader from "@/components/loaders/MainBgLoader";

const EditorLayout = () => {
  const { testId, partNumber } = useParams();
  const { pathSegments } = usePathSegments();
  const module = pathSegments[4];

  const { getModuleData, setModule } = useModule(module, testId);
  const parts = getModuleData();
  const part = parts?.find((p) => p.number === Number(partNumber));

  const { setField, isLoading, hasError } = useObjectState({
    hasError: false,
    isLoading: !parts,
  });

  const loadTest = () => {
    setField("hasError");
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
        setField("hasError", true);
        toast.error(message || "Nimadir xato ketdi");
      })
      .finally(() => setField("isLoading"));
  };

  useEffect(() => {
    !parts && loadTest();
  }, [testId]);

  if (isLoading) {
    return <MainBgLoader hasError={hasError} onButtonClick={loadTest} />;
  }

  return <Outlet />;
};

export default EditorLayout;
