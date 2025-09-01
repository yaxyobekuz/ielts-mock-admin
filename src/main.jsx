import { createRoot } from "react-dom/client";

// CSS (styles)
import "animate.css";
import "./styles/loaders.css";
import "./styles/index.css";

// Components
import App from "./App.jsx";

// Store (Redux)
import store from "./store";
import { Provider } from "react-redux";

// Render the project
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
