import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App.jsx";
import { CountryProvider } from "./context/CountryContext";

createRoot(document.getElementById("root")).render(
  <CountryProvider>
    <App />
  </CountryProvider>,
);
