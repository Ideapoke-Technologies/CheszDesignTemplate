import type { ComponentType } from "react";

import Regulationfinal from "./sample-UI/Regulattion_View";
import TechActivityLandscape from "./sample-UI/Tech-Activity-lanscape-view";
import TrendIdentificationView from "./sample-UI/TrendIdentificationView";
import ValueChainAnalysis from "./sample-UI/ValueChainAnalysis";
import Feedback from "./sample-UI/Feedback";
import TrendIdentificationViewLatest from "./sample-UI/TrendIdentificationView_23rd_June";

export type SampleRoute = {
  path: string;
  title: string;
  description: string;
  Component: ComponentType;
};

export const sampleRoutes: SampleRoute[] = [
  {
    path: "/Trend-Identification-Latest.html",
    title: "Trend Identification",
    description: "Updated : 23rd June - Version 05",
    Component: TrendIdentificationViewLatest,
  },
  {
    path: "/Regulation-view-final.html",
    title: "Regulation View",
    description: "Regulatory landscape and compliance insights view.",
    Component: Regulationfinal,
  },
  {
    path: "/Tech-Activity-landscape-view.html",
    title: "Tech Activity Landscape",
    description: "Technology activity mapping and competitive landscape.",
    Component: TechActivityLandscape,
  },
  {
    path: "/Trend-Identification-View.html",
    title: "Trend Identification",
    description: "Emerging trends and market signal identification.",
    Component: TrendIdentificationView,
  },
  {
    path: "/Value-Chain-Analysis.html",
    title: "Value Chain Analysis",
    description: "End-to-end value chain breakdown and analysis.",
    Component: ValueChainAnalysis,
  },
  {
    path: "/Feedback.html",
    title: "Feedback",
    description: "Customer feedback and opportunity scoring interface.",
    Component: Feedback,
  },
];
