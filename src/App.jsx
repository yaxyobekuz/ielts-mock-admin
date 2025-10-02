// Router
import {
  Route,
  Outlet,
  Navigate,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

// Toaster
import { Toaster } from "react-hot-toast";

// Others Pages
import Test from "./pages/Test";
import Home from "./pages/Home";
import Tests from "./pages/Tests";
import Login from "./pages/Login";
import Tools from "./pages/Tools";
import Result from "./pages/Result";
import Reading from "./pages/Reading";
import Writing from "./pages/Writing";
import Results from "./pages/Results";
import Teacher from "./pages/Teacher";
import Register from "./pages/Register";
import Teachers from "./pages/Teachers";
import Template from "./pages/Template";
import Listening from "./pages/Listening";
import Templates from "./pages/Templates";
import Submission from "./pages/Submission";
import Submissions from "./pages/Submissions";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import TestLayout from "./layouts/TestLayout";
import EditorLayout from "./layouts/EditorLayout";

// Editor pages
import TextEditor from "./pages/Editors/TextEditor";
import PartTextEditor from "./pages/Editors/PartTextEditor";
import FlowchartEditor from "./pages/Editors/FlowchartEditor";
import RadioGroupEditor from "./pages/Editors/RadioGroupEditor";
import TextDraggableEditor from "./pages/Editors/TextDraggableEditor";
import CheckboxGroupEditor from "./pages/Editors/CheckboxGroupEditor";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Main */}
        <Route path="/" element={<MainLayout />}>
          {/* Homepage */}
          <Route index element={<Home />} />

          {/* Tests */}
          <Route path="tests" element={<Outlet />}>
            <Route index element={<Tests />} />
            <Route path=":testId" element={<Outlet />}>
              <Route index element={<Test />} />

              {/* Preview test */}
              <Route path="preview" element={<TestLayout />}>
                <Route path="reading/:partNumber" element={<Reading />} />
                <Route path="writing/:partNumber" element={<Writing />} />
                <Route path="listening/:partNumber" element={<Listening />} />
              </Route>

              {/* Editors */}
              <Route path="edit/:module/:partNumber" element={<EditorLayout />}>
                <Route path="part-text" element={<PartTextEditor />} />
                <Route path="text/:sectionIndex" element={<TextEditor />} />
                <Route
                  element={<FlowchartEditor />}
                  path="flowchart/:sectionIndex"
                />
                <Route
                  element={<TextDraggableEditor />}
                  path="text-draggable/:sectionIndex"
                />
                <Route
                  element={<RadioGroupEditor />}
                  path="radio-group/:sectionIndex"
                />
                <Route
                  element={<CheckboxGroupEditor />}
                  path="checkbox-group/:sectionIndex"
                />
              </Route>
            </Route>
          </Route>

          {/* Submissions (Test answers) */}
          <Route path="submissions" element={<Outlet />}>
            <Route index element={<Submissions />} />
            <Route path=":submissionId/:module?" element={<Submission />} />
          </Route>

          {/* Test results */}
          <Route path="results" element={<Outlet />}>
            <Route index element={<Results />} />
            <Route path=":resultId" element={<Result />} />
          </Route>

          {/* Teachers */}
          <Route path="teachers" element={<Outlet />}>
            <Route index element={<Teachers />} />
            <Route path=":teacherId" element={<Teacher />} />
          </Route>

          {/* Templates */}
          <Route path="templates" element={<Outlet />}>
            <Route index element={<Templates />} />
            <Route path=":templateId" element={<Template />} />
          </Route>

          {/* Tools */}
          <Route path="tools" element={<Outlet />}>
            <Route index element={<Tools />} />
            {/* <Route path=":ToolsId" element={<Template />} /> */}
          </Route>
        </Route>

        {/* Auth */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route index element={<Navigate to="login" />} />
        </Route>
      </>
    ),
    { future: { v7_relativeSplatPath: true } }
  );

  return (
    <>
      <RouterProvider future={{ v7_startTransition: true }} router={router} />

      {/* Toaster */}
      <Toaster />
    </>
  );
};

export default App;
