import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LanguageProvider } from "./lib/language-context";

createRoot(document.getElementById("root")!).render(
  <LanguageProvider><ErrorBoundary><App /></ErrorBoundary></LanguageProvider>,
);
