// Router
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Pages
import Home from "./pages/Home";
import Reading from "./pages/Reading";
import Writing from "./pages/Writing";
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
      <Route path="/" element={<MainLayout />}>
        {/* Homepage */}
        <Route index element={<Home />} />

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
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
