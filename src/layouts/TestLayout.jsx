// React
import { useEffect } from "react";

// Toast
import { toast } from "@/notification/toast";

// Icons
import { ArrowLeft, Plus } from "lucide-react";

// Api
import { testsApi } from "@/api/tests.api";
import { sectionsApi } from "@/api/sections.api";

// Data
import { partsApi } from "@/api/parts.api";
import questionsType from "@/data/questionsType";

// Hooks
import useModule from "@/hooks/useModule";
import useObjectState from "@/hooks/useObjectState";
import usePathSegments from "@/hooks/usePathSegments";

// Router
import { Link, Outlet, useParams } from "react-router-dom";

// Components
import Nav from "@/components/Nav";
import MainBgLoader from "@/components/loaders/MainBgLoader";

const TestLayout = () => {
  const { testId, partNumber } = useParams();
  const { pathSegments } = usePathSegments();
  const module = pathSegments[4];

  const { getModuleData, addPart, addSection, setModule } = useModule(
    module,
    testId
  );
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

  return (
    <>
      <ModulesNavbar testId={testId} />

      <main className="pb-[41px]">
        <Outlet />

        <AddSectionBlock
          module={module}
          testId={testId}
          partId={part?._id}
          addSection={addSection}
        />
      </main>

      <PartsNavbar
        parts={parts}
        testId={testId}
        module={module}
        addPart={addPart}
      />
    </>
  );
};

const ModulesNavbar = ({ testId }) => {
  const to = (m) => `tests/test/${testId}/preview/${m}/1`;

  return (
    <div className="flex items-center gap-3.5 sticky top-0 inset-x-0 z-10 container h-14 bg-white">
      <Link
        to={`/tests/test/${testId}`}
        className="btn shrink-0 size-11 bg-gray-100 p-0 rounded-full hover:bg-gray-200"
      >
        <ArrowLeft size={20} strokeWidth={1.5} />
      </Link>

      <Nav
        fullSizeBtn
        pagePathIndex={4}
        className="w-full"
        links={[
          { label: "Listening", link: to("listening") },
          { label: "Reading", link: to("reading") },
          { label: "Writing", link: to("writing") },
        ]}
      />
    </div>
  );
};

const PartsNavbar = ({ testId, module, parts, addPart }) => (
  <div className="fixed bottom-0 inset-x-0 container h-14 bg-white">
    <div className="flex items-center gap-3.5 size-full">
      <Nav
        fullSizeBtn
        pagePathIndex={5}
        className="w-full"
        links={parts?.map(({ number }) => ({
          label: `Part ${number}`,
          link: `tests/test/${testId}/preview/${module}/${number}`,
        }))}
      />

      {/* Add new */}
      <AddPartButton
        testId={testId}
        module={module}
        addPart={addPart}
        totalParts={parts?.length || 0}
      />
    </div>
  </div>
);

const AddPartButton = ({ totalParts, addPart, module, testId }) => {
  if (totalParts > 5) return;
  const { isLoading, setField } = useObjectState({ isLoading: false });

  const handleAddPart = () => {
    if (isLoading) return;
    setField("isLoading", true);

    partsApi
      .create({ testId, module })
      .then(({ code, part }) => {
        if (code !== "partCreated") throw new Error();
        addPart(part);
      })
      .catch(() => toast.error("Yangi sahifani qo'shib bo'lmadi"))
      .finally(() => setField("isLoading"));
  };

  return (
    <button
      disabled={isLoading}
      onClick={handleAddPart}
      className="btn relative shrink-0 size-11 bg-gray-100 p-0 rounded-full hover:bg-gray-200"
    >
      <Plus
        size={20}
        strokeWidth={1.5}
        className={`absolute transition-opacity duration-200 group-disabled:opacity-50`}
      />
      <span className={`${isLoading ? "spin-loader" : ""} inset-0 size-full`} />
    </button>
  );
};

const AddSectionBlock = ({ addSection, module, testId, partId }) => {
  if (module === "writing") return;

  const { activeQuestion, isLoading, setField } = useObjectState({
    isLoading: false,
    activeQuestion: questionsType[0],
  });

  const handleSelectOption = (e) => {
    const q = questionsType.find((q) => q.value === e.target.value);
    setField("activeQuestion", q);
  };

  const handleAddSection = () => {
    setField("isLoading", true);

    sectionsApi
      .create({
        partId,
        testId,
        module,
        type: activeQuestion.value,
        description: "Bo'lim tavsifi",
        title: `${activeQuestion.label} bo'lim sarlavhasi`,
      })
      .then(({ code, section }) => {
        if (code !== "sectionCreated") throw new Error();
        addSection(section);
      })
      .catch(() => toast.error("Yangi bo'limni qo'shib bo'lmadi"))
      .finally(() => setField("isLoading"));
  };

  return (
    <div className="container !max-w-max pb-8">
      <div className="flex items-start justify-between gap-5 relative overflow-hidden bg-gray-5 p-5 rounded-xl border">
        {isLoading ? (
          <div className="absolute inset-x-0 bottom-0 bar-loader-secondary w-full h-1" />
        ) : null}

        {/* Preview */}
        <img
          width={384}
          height={224}
          alt="Question preview"
          src={activeQuestion.image}
          className="w-96 h-56 text-blue-50 bg-white rounded-md border"
        />

        {/* Actions */}
        <div className="flex flex-col items-stretch gap-5">
          <select
            name="section-type"
            disabled={isLoading}
            onChange={handleSelectOption}
            className="h-9 px-5 rounded-md border disabled:opacity-50"
          >
            {questionsType.map(({ label, value }, index) => (
              <option key={index} value={value}>
                {label}
              </option>
            ))}
          </select>

          <button
            disabled={isLoading}
            onClick={handleAddSection}
            className="min-w-52 h-9 bg-blue-500 text-white rounded-md disabled:opacity-50"
          >
            Yangi bo'lim qo'shish{isLoading ? "..." : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestLayout;
