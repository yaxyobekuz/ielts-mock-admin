// Router
import {
  Route,
  Navigate,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
} from "react-router-dom";

// Toaster
import { Toaster } from "react-hot-toast";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

// Pages
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
import Test from "./pages/Test";

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
            <Route path="test/:testId" element={<Test />} />
          </Route>

          {/* Preview test */}
          <Route element={<TestLayout />} path="tests/test/:testId/preview/">
            <Route path="reading/:partNumber" element={<Reading />} />
            <Route path="writing/:partNumber" element={<Writing />} />
            <Route path="listening/:partNumber" element={<Listening />} />
          </Route>

          {/* Text editor */}
          <Route
            element={<TextEditor />}
            path="tests/test/:testId/edit/:module/:partNumber/text/:sectionIndex"
          />

          {/* Part text editor */}
          <Route
            element={<PartTextEditor />}
            path="tests/test/:testId/edit/:module/:partNumber/part-text"
          />

          {/* Flowchart editor */}
          <Route
            element={<FlowchartEditor />}
            path="tests/test/:testId/edit/:module/:partNumber/flowchart/:sectionIndex"
          />

          {/* Text draggable editor */}
          <Route
            element={<TextDraggableEditor />}
            path="tests/test/:testId/edit/:module/:partNumber/text-draggable/:sectionIndex"
          />

          {/* Radio Group editor */}
          <Route
            element={<RadioGroupEditor />}
            path="tests/test/:testId/edit/:module/:partNumber/radio-group/:sectionIndex"
          />
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
