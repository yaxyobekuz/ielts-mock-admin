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
import Listening from "./pages/Listening";
import TestLayout from "./layouts/TestLayout";
import TextEditor from "./pages/Editors/TextEditor";
import TextDraggableEditor from "./pages/Editors/TextDraggableEditor";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        {/* Homepage */}
        <Route index element={<Home />} />

        {/* Preview test */}
        <Route element={<TestLayout />} path="tests/test/:testId/">
          <Route path="preview/listening/:partNumber" element={<Listening />} />
        </Route>

        {/* Text editor */}
        <Route
          element={<TextEditor />}
          path="tests/test/:testId/edit/:module/:partNumber/text/:sectionIndex"
        />

        {/* Text draggable editor */}
        <Route
          element={<TextDraggableEditor />}
          path="tests/test/:testId/edit/:module/:partNumber/text-draggable/:sectionIndex"
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
