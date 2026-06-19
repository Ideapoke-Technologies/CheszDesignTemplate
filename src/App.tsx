import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Home";
import { sampleRoutes } from "./sampleRoutes";

function getRouterBasename(): string {
  const [repoSegment] = window.location.pathname.split("/").filter(Boolean);
  if (window.location.hostname.endsWith("github.io") && repoSegment) {
    return `/${repoSegment}`;
  }
  return "";
}

export default function App() {
  return (
    <BrowserRouter basename={getRouterBasename()}>
      <Routes>
        <Route path="/" element={<Home />} />

        {sampleRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
