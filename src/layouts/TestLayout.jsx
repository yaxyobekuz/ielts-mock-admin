import { useState } from "react";
import { NavLink, Outlet, useLocation, useParams } from "react-router-dom";

// Hooks
import useStore from "../hooks/useStore";

// Data
import questionsType from "../data/questionsType";

// Store (Redux)
import { addModulePart, addModuleSection } from "../store/features/storeSlice";

const TestLayout = () => {
  return (
    <>
      <MainNavbar />
      <main className="pb-[41px]">
        <Outlet />
        <AddSectionBlock />
      </main>

      <PartsNavbar />
    </>
  );
};

const MainNavbar = () => {
  const { testId } = useParams();
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  return (
    <div className="sticky top-0 inset-x-0 container">
      <nav className="w-full overflow-hidden rounded-b-xl border border-t-0">
        <ul className="flex w-full">
          {/* Listening */}
          <li className="grow h-10">
            <NavItem to={`/tests/test/${testId}/${pathSegments[4]}/1`}>
              Listening
            </NavItem>
          </li>

          {/* Reading */}
          <li className="grow h-10">
            <NavItem to={`/tests/test/${testId}/reading/1`}>Reading</NavItem>
          </li>

          {/* Writing */}
          <li className="grow h-10">
            <NavItem to={`/tests/test/${testId}/writing/1`}>Writing</NavItem>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const PartsNavbar = () => {
  const { testId } = useParams();
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const { getState, dispatch } = useStore(pathSegments[4]);
  const module = getState();

  const handleAddModulePart = () => {
    dispatch(addModulePart({ module: pathSegments[4].toLowerCase() }));
  };

  return (
    <div className="fixed bottom-0 inset-x-0 container">
      <nav className="flex w-full overflow-hidden rounded-t-xl border border-b-0">
        {/* Parts */}
        <ul className="flex w-full">
          {module.parts.map(({ number }, index) => (
            <li key={index} className="grow h-10">
              <NavLink
                to={`/tests/test/${testId}/preview/${pathSegments[4]}/${number}`}
                className="flex items-center justify-center size-full bg-white transition-colors duration-200 border-r hover:bg-gray-50"
              >
                Part {number}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Add new */}
        {module.parts.length < 6 ? (
          <button
            onClick={handleAddModulePart}
            className="flex items-center justify-center w-20 h-10 bg-white transition-colors duration-200 hover:bg-gray-50"
          >
            +
          </button>
        ) : null}
      </nav>
    </div>
  );
};

const AddSectionBlock = () => {
  const { dispatch } = useStore();
  const { partNumber } = useParams();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const [activeQuestion, setActiveQuestion] = useState(questionsType[0]);

  const handleSelectOption = (e) => {
    const q = questionsType.find((q) => q.value === e.target.value);
    setActiveQuestion(q);
  };

  const handleAddSection = () => {
    dispatch(
      addModuleSection({
        partIndex: partNumber - 1,
        module: pathSegments[4],
        sectionType: activeQuestion.value,
      })
    );
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
            {questionsType.map(({ label, value }) => (
              <option value={value}>{label}</option>
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

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className="flex items-center justify-center size-full bg-white transition-colors duration-200 border-r hover:bg-gray-50"
  >
    {children}
  </NavLink>
);

export default TestLayout;
