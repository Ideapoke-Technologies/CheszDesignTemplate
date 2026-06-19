import { BrowserRouter, Routes, Route } from "react-router-dom";

import Regulationfinal from "./sample-UI/Regulattion_View";
import TechActivityLandscape from "./sample-UI/Tech-Activity-lanscape-view";
import TrendIdentificationView from "./sample-UI/TrendIdentificationView";
import ValueChainAnalysis from "./sample-UI/ValueChainAnalysis";
import Feedback from "./sample-UI/Feedback";

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <Routes>
        <Route
          path="/Regulation-view-final.html"
          element={<Regulationfinal />}
        />

        <Route
          path="/Tech-Activity-landscape-view.html"
          element={<TechActivityLandscape />}
        />

        <Route
          path="/Trend-Identification-View.html"
          element={<TrendIdentificationView />}
        />

        <Route
          path="/Value-Chain-Analysis.html"
          element={<ValueChainAnalysis />}
        />
        <Route path="/Feedback.html" element={<Feedback />} />
      </Routes>
    </BrowserRouter>
  );
}
