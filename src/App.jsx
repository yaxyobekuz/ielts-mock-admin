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

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

// Pages
import Test from "./pages/Test";
import Home from "./pages/Home";
import Tests from "./pages/Tests";
import Login from "./pages/Login";
import Reading from "./pages/Reading";
import Writing from "./pages/Writing";
import Register from "./pages/Register";
import Listening from "./pages/Listening";
import TestLayout from "./layouts/TestLayout";

// Editor pages
import TextEditor from "./pages/Editors/TextEditor";
import PartTextEditor from "./pages/Editors/PartTextEditor";
import FlowchartEditor from "./pages/Editors/FlowchartEditor";
import RadioGroupEditor from "./pages/Editors/RadioGroupEditor";
import TextDraggableEditor from "./pages/Editors/TextDraggableEditor";

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
            <Route path="test/:testId" element={<Outlet />}>
              <Route index element={<Test />} />

              {/* Preview test */}
              <Route path="preview" element={<TestLayout />}>
                <Route path="reading/:partNumber" element={<Reading />} />
                <Route path="writing/:partNumber" element={<Writing />} />
                <Route path="listening/:partNumber" element={<Listening />} />
              </Route>

              {/* Editors */}
              <Route path="edit/:module/:partNumber" element={<Outlet />}>
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
              </Route>
            </Route>
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
