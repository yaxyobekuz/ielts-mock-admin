import { useState } from "react";
import { Link, NavLink, Outlet, useParams } from "react-router-dom";

// Hooks
import useModule from "../hooks/useModule";

// Data
import questionsType from "../data/questionsType";

// Store (Redux)
import usePathSegments from "../hooks/usePathSegments";

const TestLayout = () => {
  const { testId, partNumber } = useParams();
  const { pathSegments } = usePathSegments();
  const module = pathSegments[4];

  const { getModuleData, addPart, addSection } = useModule(module, testId);
  const parts = getModuleData();

  return (
    <>
      <MainNavbar testId={testId} module={module} />

      <main className="pb-[41px]">
        <Outlet />

        <AddSectionBlock
          module={module}
          partNumber={partNumber}
          addSection={(type) => addSection(partNumber, type)}
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

const MainNavbar = ({ testId, module }) => (
  <div className="sticky top-0 inset-x-0 z-10 container">
    <nav className="w-full overflow-hidden rounded-b-xl border border-t-0">
      <ul className="flex w-full">
        {/* Listening */}
        <li className="grow h-10">
          <LinkItem
            isActive={module === "listening"}
            to={`/tests/test/${testId}/preview/${module}/1`}
          >
            Listening
          </LinkItem>
        </li>

        {/* Reading */}
        <li className="grow h-10">
          <LinkItem
            isActive={module === "leading"}
            to={`/tests/test/${testId}/preview/reading/1`}
          >
            Reading
          </LinkItem>
        </li>

        {/* Writing */}
        <li className="grow h-10">
          <LinkItem
            isActive={module === "lriting"}
            to={`/tests/test/${testId}/preview/writing/1`}
          >
            Writing
          </LinkItem>
        </li>
      </ul>
    </nav>
  </div>
);

const PartsNavbar = ({ testId, module, parts, addPart }) => (
  <div className="fixed bottom-0 inset-x-0 container">
    <nav className="flex w-full overflow-hidden rounded-t-xl border border-b-0">
      {/* Parts */}
      <ul className="flex w-full">
        {parts.map(({ number }, index) => (
          <li key={index} className="grow h-10">
            <NavLink
              to={`/tests/test/${testId}/preview/${module}/${number}`}
              className="flex items-center justify-center size-full bg-white transition-colors duration-200 border-r hover:bg-gray-50"
            >
              Part {number}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Add new */}
      {parts.length < 6 ? (
        <button
          onClick={addPart}
          className="flex items-center justify-center w-20 h-10 bg-white transition-colors duration-200 hover:bg-gray-50"
        >
          +
        </button>
      ) : null}
    </nav>
  </div>
);

const AddSectionBlock = ({ addSection }) => {
  const [activeQuestion, setActiveQuestion] = useState(questionsType[0]);

  const handleSelectOption = (e) => {
    const q = questionsType.find((q) => q.value === e.target.value);
    setActiveQuestion(q);
  };

  const handleAddSection = () => {
    addSection(activeQuestion.value);
  };

  return (
    <div className="container !max-w-max pb-8">
      <div className="flex items-start justify-between gap-5 bg-gray-5 p-5 rounded-xl border">
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
            onChange={handleSelectOption}
            className="h-9 px-5 rounded-md border"
          >
            {questionsType.map(({ label, value }, index) => (
              <option key={index} value={value}>
                {label}
              </option>
            ))}
          </select>

          <button
            onClick={handleAddSection}
            className="h-9 bg-blue-500 text-white px-5 rounded-md"
          >
            Yangi bo'lim qo'shish
          </button>
        </div>
      </div>
    </div>
  );
};

const LinkItem = ({ to, children, isActive }) => (
  <Link
    to={to}
    className={`${
      isActive ? "active" : ""
    } flex items-center justify-center size-full bg-white transition-colors duration-200 border-r hover:bg-gray-50`}
  >
    {children}
  </Link>
);

export default TestLayout;
