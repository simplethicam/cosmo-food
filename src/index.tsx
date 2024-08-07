import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary"; // Importa il nuovo componente
import "./i18n";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const container = document.getElementById("root");
// eslint-disable-next-line
// biome-ignore lint/style/noNonNullAssertion: <root> is not null
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <React.Suspense>
        <App />
      </React.Suspense>
    </ErrorBoundary>
  </React.StrictMode>,
);
