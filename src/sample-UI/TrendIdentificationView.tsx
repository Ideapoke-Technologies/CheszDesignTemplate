import { useState, useRef, ReactNode, FC } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Confidence = "High" | "Moderate" | "Low";
type Strength = "Strong" | "Weak";
type Stage = "Emerging" | "Accelerating" | "Mainstreaming" | "Mature" | "Plateauing" | "Fragmenting" | "Declining" | "Re-emerging" | "Cyclical";
type Momentum = "Accelerating" | "Steady" | "Decelerating";
type Align = "left" | "right";

interface Signal {
  id: string;
  title: string;
  category: string;
  description: string;
  timeRange: string;
  geography: string;
  confidence: Confidence;
  strength: Strength;
  directionalImplication: string;
}

interface Trend {
  id: string;
  name: string;
  short: string;
  type: string;
  stage: Stage;
  confidence: Confidence;
  momentum: Momentum;
  domain: string;
  definition: string;
  coreEvidence: string[];
  structuralDrivers: string[];
  constraints: string[];
  ecosystemImpact: string[];
  strategicImplications: string[];
  contradictions: string[];
  affectedActors: string[];
  priorityRank: number;
}

interface StagePaletteEntry {
  bg: string;
  border: string;
  text: string;
}

interface TooltipItem {
  label?: string;
  desc: string;
  swatch?: string;
  num?: number;
}

interface TooltipTableItem {
  label: string;
  desc: string;
  swatch?: string;
}

interface InfoTooltipProps {
  text?: string;
  intro?: string;
  items?: TooltipItem[];
  tableItems?: TooltipTableItem[];
  icon?: ReactNode;
  title?: string;
  align?: Align;
  trigger?: ReactNode;
  width?: number;
}

interface SignalSource {
  label: string;
  href: string;
}

interface PhaseEntry {
  stage: Stage;
  years: number[];
}

interface PhaseMapEntry {
  start: number;
  end: number;
  stage: Stage;
  label: string;
}

interface Milestone {
  year: number;
  label: string;
}

const SIGNALS: Signal[] = [
  {
    id: "SIG-01",
    title: "Edge Computing and Embedded AI Shape IIoT Platform Architectures",
    category: "Technological",
    description: "Sustained cross-industry shift toward edge computing and embedded AI within European IIoT platforms. EU R&D funding exceeding €150M since 2021, formal standards (AIOTI, ARTEMIS-IA) and patent portfolios emphasize edge-native orchestration.",
    timeRange: "2021–2026",
    geography: "Europe",
    confidence: "High",
    strength: "Strong",
    directionalImplication: "Consolidates edge AI as the default architecture for IIoT innovation in Europe; fosters regulatory-compliant, energy-optimized platforms."
  },
  {
    id: "SIG-02",
    title: "Regulatory Mandates Drive Open, Interoperable IIoT Ecosystems",
    category: "Regulatory/Ecosystem",
    description: "Binding European legislation (Interoperable Europe Act, Cybersecurity Act, NIS2, Data Act, AI Act) enforces open, secure, and interoperable IIoT platforms. OPC UA, MQTT, Gaia-X, IDSA mandates transform platform competition.",
    timeRange: "2023–2026",
    geography: "Europe",
    confidence: "High",
    strength: "Strong",
    directionalImplication: "Accelerates market shift toward open, interoperable, compliance-ready IIoT platforms; enforces cross-sector data portability."
  },
  {
    id: "SIG-03",
    title: "Enterprise IIoT Adoption Accelerates via Compliance and Digital Investment",
    category: "Enterprise Adoption/Business Model",
    description: "European manufacturers report accelerated IIoT adoption driven by EU Green Deal, CSRD compliance, sustainability goals, and government funding (Horizon Europe, TEFs). 13.5% SME adoption by 2024 with CAGR over 23% (2024–2033).",
    timeRange: "2022–2026",
    geography: "Europe",
    confidence: "High",
    strength: "Strong",
    directionalImplication: "Sustained double-digit growth, platform specialization, increased compliance requirements; higher entry hurdles for suppliers."
  },
  {
    id: "SIG-04",
    title: "Shift to Governance-First, Federated, Data-Sovereign IIoT Models",
    category: "Technological/Ecosystem",
    description: "IIoT platforms evolving from siloed architectures to distributed, federated, sovereignty-preserving models. Adoption of Gaia-X, IDSA, OPC UA evidenced in technical roadmaps and patent filings.",
    timeRange: "2016–2026",
    geography: "Europe",
    confidence: "High",
    strength: "Strong",
    directionalImplication: "Elevates data sovereignty as a competitive differentiator; forces global vendors to align with European technical and legal standards."
  },
  {
    id: "SIG-05",
    title: "Country-Level Variations and SME IIoT Adoption Challenges",
    category: "Enterprise Adoption",
    description: "Despite overall growth, notable disparities in IIoT adoption among SMEs in Eastern and Southern Europe due to infrastructure constraints, limited integrator capacity, and workforce skills shortages.",
    timeRange: "2024–2026",
    geography: "Europe (notably Central/Eastern and Southern EU)",
    confidence: "Moderate",
    strength: "Weak",
    directionalImplication: "Implies heterogeneous digital transformation pace; unclear temporal persistence or reversibility."
  }
];

const TRENDS: Trend[] = [
  {
    id: "TR-01",
    name: "Edge AI, Embedded Intelligence, and Federated IIoT Architectures",
    short: "Edge AI & Federated IIoT",
    type: "Technological",
    stage: "Mainstreaming",
    confidence: "High",
    momentum: "Accelerating",
    domain: "Industrial IoT Platforms",
    definition: "Structural migration of computation, analytics, and orchestrated automation to the industrial edge. Edge-native AI and distributed architectures are becoming foundational to European IIoT ecosystems, supplanting legacy monolithic cloud stacks.",
    coreEvidence: [
      "Edge AI market: $36.67B in 2025, $59.66B by 2032; federated learning for IIoT: 29.1% CAGR",
      "Siemens, ABB, Schneider, Honeywell deploying edge-native AI inference and software-defined control",
      "EU R&D funding exceeding €150M since 2021 in edge and cloud continuum pilots",
      "OPC-UA and Asset Administration Shell standardization embedding edge/federated strategies",
      "60%+ of manufacturers developing digital twin solutions by 2026"
    ],
    structuralDrivers: [
      "EU Horizon Europe and NGIoT funding mandates for edge-native platforms",
      "Privacy-by-design and latency requirements driving distributed computation",
      "5G private network buildout enabling industrial automation",
      "AI Act compliance pushing computation toward verifiable, auditable edge systems"
    ],
    constraints: [
      "Ongoing fragmentation in semantic interoperability; demonstrable at PoC but inconsistent at scale",
      "Technical complexity and cyber-resilience at the edge create new operational risks",
      "Durable dependence on global (non-EU) AI chip and sensor supply chains"
    ],
    ecosystemImpact: [
      "Dissolution of vertical proprietary data silos in favor of modular, composable architectures",
      "Significant expansion of predictive and resilience-enabling automation at the edge",
      "Platform power shifting toward orchestrators over device manufacturers"
    ],
    strategicImplications: [
      "Platform providers must architect for edge-native AI as a baseline, not premium feature",
      "Early movers in federated learning infrastructure gain durable competitive advantage",
      "Supply chain sovereignty in AI chips and edge hardware becomes strategic priority"
    ],
    contradictions: [
      "Technical fragmentation persists despite convergence narrative",
      "Supply chain dependence on non-EU providers limits sovereignty claims"
    ],
    affectedActors: ["IIoT platform vendors", "Industrial manufacturers", "System integrators", "Telecom operators", "SMEs"],
    priorityRank: 1
  },
  {
    id: "TR-02",
    name: "Open, Sovereign, and Interoperable Industrial Data Ecosystems",
    short: "Open Sovereign Data Ecosystems",
    type: "Regulatory",
    stage: "Accelerating",
    confidence: "High",
    momentum: "Accelerating",
    domain: "Industrial IoT Platforms",
    definition: "Structural ecosystem transformation catalyzed by regulatory mandates (EU Data Act, AI Act) and standards alliances (Gaia-X, IDSA, OPC-UA) driving migration from proprietary silos toward open, federated, compliance-driven architectures.",
    coreEvidence: [
      "EU Data Act (2025), AI Act (2024/1689), Interoperable Europe Act (2024) mandate open architectures",
      "Gaia-X and IDSA operationalizing data spaces and semantic interoperability frameworks",
      "IDSA & DSP adopted in >60% of surveyed industrial projects",
      "Major platform providers adopting sovereignty-aligned architectures in product roadmaps",
      "Manufacturing-X, Catena-X creating sector-specific data space deployments"
    ],
    structuralDrivers: [
      "EU Data Act mandates open, structured, shareable industrial data by 2026",
      "AI Act risk-based governance framework enforcing platform transparency",
      "Gaia-X, IDSA, Catena-X alliance ecosystem creating compliance standards",
      "Digital Decade and Industrial Strategy aligning investment with interoperability goals"
    ],
    constraints: [
      "Conceptual ambiguity between data residency vs true sovereignty",
      "Persistent dependence on US/Chinese incumbents for infrastructure limits policy goals",
      "Standards convergence is partial; fragmentation risk across sector/country"
    ],
    ecosystemImpact: [
      "Rebalancing competitive advantage from data hoarding toward analytics and compliance orchestration",
      "Growth of cross-organization, multi-tenant industrial data spaces",
      "Value chain dependencies shifting from device OEMs to orchestration and compliance layers"
    ],
    strategicImplications: [
      "Platform design must embed interoperability and sovereignty by default, not as add-on",
      "Compliance orchestration becomes a new category of platform differentiation",
      "Early adopters of Gaia-X and IDSA gain procurement advantage in EU-funded projects"
    ],
    contradictions: [
      "Regulatory ambition outpaces operational readiness, especially for SMEs",
      "Standards harmonization only expected by 2027, creating interim fragmentation risk"
    ],
    affectedActors: ["Platform vendors", "Manufacturers", "System integrators", "Standards bodies", "Regulators", "SMEs"],
    priorityRank: 2
  },
  {
    id: "TR-03",
    name: "AI-Driven Industrial Automation and Digital Twin Mainstreaming",
    short: "AI Automation & Digital Twins",
    type: "Enterprise Adoption",
    stage: "Mainstreaming",
    confidence: "High",
    momentum: "Accelerating",
    domain: "Industrial IoT Platforms",
    definition: "Predictive, adaptive, and autonomy-enabling AI capabilities and digital twins are now baseline requirements in advanced industrial verticals, deeply integrated as systemic intelligence layers in manufacturing and infrastructure operations.",
    coreEvidence: [
      ">85% of medium/large firms targeting AI-driven process automation by 2027",
      "Digital twin market CAGR 39.8% (2024–2032), integration into operational and strategic processes",
      "20–35%+ cost reduction demonstrated in automotive, pharma, energy deployments",
      "ISO/IEC 22989, AAS standards and EU DestinE pilots advancing adoption",
      "EU Green Deal and CSRD driving sustainability optimization use cases"
    ],
    structuralDrivers: [
      "Labor shortages and operational efficiency imperatives driving automation",
      "Industry 4.0 public investment and incentive frameworks",
      "Sustainability reporting mandates (CSRD) requiring real-time monitoring",
      "Competitive pressure from global automation leaders forcing European adoption"
    ],
    constraints: [
      "SME uptake <15%; most projects remain pilots and don't scale",
      "Skills shortages, technical integration complexity, and ROI uncertainty for smaller firms",
      "GDPR and AI Act explainability requirements adding compliance burden"
    ],
    ecosystemImpact: [
      "Creation of data-centric, feedback-driven operational models",
      "System-level convergence of design, operations, and service lifecycle",
      "Linkage of digital innovation to sustainability and regulatory reporting"
    ],
    strategicImplications: [
      "AI automation and digital twins are becoming table stakes in advanced manufacturing",
      "SME inclusion is the next frontier: those enabling SME adoption at scale win the long game",
      "Sustainability and efficiency use cases are the primary ROI driver for investment decisions"
    ],
    contradictions: [
      "Adoption is highly concentrated in large enterprises; SME fragmentation is structural",
      "Ethical and explainability requirements require further harmonization for long-term scalability"
    ],
    affectedActors: ["Large manufacturing enterprises", "IIoT platform vendors", "AI/cloud technology providers", "SMEs", "Policy makers"],
    priorityRank: 3
  },
  {
    id: "TR-04",
    name: "Governance-First and Compliance-Centric Platform Competition",
    short: "Governance-First Platforms",
    type: "Business Model",
    stage: "Accelerating",
    confidence: "High",
    momentum: "Accelerating",
    domain: "Industrial IoT Platforms",
    definition: "Compliance, governance, and trustworthy ecosystem management have shifted from niche differentiators to sector-wide competitive baselines, shaped by increasingly prescriptive EU regulatory environments requiring embedded transparency and auditability.",
    coreEvidence: [
      "EU Data Act, AI Act, Cyber Resilience Act redefining platform obligations for data access and portability",
      "Platform differentiators shifting from asset control to orchestration of compliant multi-stakeholder ecosystems",
      "DMA/DSA analogues reducing traditional gatekeeper advantages in IIoT context",
      "Voluntary cybersecurity certifications evolving into mandatory product-level requirements"
    ],
    structuralDrivers: [
      "Binding legal obligations creating non-negotiable compliance baseline",
      "Procurement rules increasingly requiring Gaia-X and Data Act alignment",
      "Enterprise buyers demanding auditability, transparency, and portability",
      "Cybersecurity incidents creating market demand for trust verification"
    ],
    constraints: [
      "Significant compliance costs disproportionately burden SMEs",
      "Fragmented enforcement across EU member states and platform types",
      "Risk of compliance rigidity stifling innovation and new entrants"
    ],
    ecosystemImpact: [
      "Compliance and secure data integration become market access preconditions",
      "Barriers to entry rise for non-compliant actors",
      "Large providers investing heavily in compliance orchestration and auditability infrastructure"
    ],
    strategicImplications: [
      "Compliance is no longer a competitive advantage; it's a market entry requirement",
      "Innovation must now happen within the constraints of governance-first architecture",
      "Compliance-as-a-service is an emerging high-value platform category for SME enablement"
    ],
    contradictions: [
      "Unresolved debate on whether compliance frameworks stifle innovation and value sharing",
      "Uneven enforcement creates competitive distortions across member states"
    ],
    affectedActors: ["IIoT platform vendors", "Regulatory authorities", "System integrators", "Large manufacturing firms", "SMEs"],
    priorityRank: 4
  },
  {
    id: "TR-05",
    name: "Regional and SME Adoption Fragmentation",
    short: "SME & Regional Fragmentation",
    type: "Ecosystem/Platform",
    stage: "Plateauing",
    confidence: "Moderate",
    momentum: "Steady",
    domain: "Industrial IoT Platforms",
    definition: "Structural asymmetry in IIoT adoption between advanced regions/large enterprises and SMEs/lagging regions constitutes a persistent constraint on ecosystem-wide convergence, creating digital divide risks in Europe's industrial transformation.",
    coreEvidence: [
      "Germany 24.6% IIoT share; marked north/central vs south/east divergence",
      "SMEs account for 99% of EU businesses but <15% scale advanced IIoT deployments",
      "Most SME projects remain pilots; structural cost, skills, and integration barriers persist",
      "Eurofound 2025 confirms SMEs not reaching moderate digital maturity despite policy support"
    ],
    structuralDrivers: [
      "Uneven digital infrastructure quality across EU geographies",
      "Persistent 6–7 million ICT/digital expert shortfall projected by 2030",
      "Legacy system integration costs prohibitive for undercapitalized SMEs",
      "Regulatory compliance burden disproportionate relative to SME capacity"
    ],
    constraints: [
      "EU programs (Horizon, DIHs) targeting gaps but evidence of effectiveness limited",
      "Local specialization may offer resilience but limits scaling and efficiency",
      "Regional disparities are structural, not cyclical, and slow to narrow"
    ],
    ecosystemImpact: [
      "Structural inefficiencies and 'fragmentation tax' for SMEs and lagging regions",
      "Risks to EU-wide digital/green transition if adoption gaps persist",
      "Innovation ecosystem distributed but scale-limited outside Tier-1 regions"
    ],
    strategicImplications: [
      "Pan-European ecosystem convergence will not occur without targeted SME inclusion strategies",
      "SME enablement platforms represent significant underserved market opportunity",
      "Regional disparities may widen unless coordinated policy intervention is sustained"
    ],
    contradictions: [
      "EU/EC initiatives target harmonization but evidence of closing fragmentation remains weak",
      "GDPR precedent shows regulatory complexity disproportionately impacts smaller actors"
    ],
    affectedActors: ["SMEs", "Member State governments", "System integrators", "Regional innovation agencies", "EU Commission"],
    priorityRank: 5
  }
];

const CROSS_TREND_PATTERNS = [
  "Regulatory enforcement and standards mandates are synchronized with ecosystem/interoperability development; compliance becomes an architectural baseline.",
  "Edge AI, digital twins, and sustainability/Green Deal objectives converge; digitalization enables both regulatory and decarbonization goals simultaneously.",
  "Federated governance models are reinforced by Gaia-X, IDSA, OPC-UA, but practical interoperability and legal/technical sovereignty remain only partly harmonized.",
  "Enterprise/large-firm adoption drives technology diffusion, while SMEs and lagging regions struggle, creating persistent fragmentation.",
  "Cybersecurity, resilience, and compliance move from add-ons to systemic requirements at platform, device, and process levels.",
  "Ecosystem power is shifting toward orchestrators with capacity for compliance integration, multi-stakeholder data governance, and open multi-party platforms."
];

const EMERGING_OPPORTUNITIES = [
  { title: "Federated Industrial Data Spaces", desc: "Collaborative analytics, cross-border compliance, and supply chain transparency across value chains and sectors." },
  { title: "Edge AI & Digital Twin Orchestration", desc: "Scalable orchestration within open, regulated industrial platforms enabling predictive sustainability management." },
  { title: "Sovereign AI Infrastructure", desc: "Trusted industrial cloud/edge ecosystems building on Gaia-X principles for European digital sovereignty." },
  { title: "Compliance-as-a-Service", desc: "Modular interoperability enablement for SMEs and regional clusters who lack in-house compliance capacity." },
  { title: "Circular Economy Applications", desc: "Sector-specific use cases for resource optimization, digital product passport compliance, and emissions traceability." }
];

const stageColor = (stage: string): string => {
  const map: Record<string, string> = {
    "Emerging": "bg-purple-50 text-purple-700 border-purple-200",
    "Accelerating": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Mainstreaming": "bg-blue-50 text-blue-700 border-blue-200",
    "Mature": "bg-slate-100 text-slate-600 border-slate-300",
    "Plateauing": "bg-amber-50 text-amber-700 border-amber-200",
    "Fragmenting": "bg-red-50 text-red-700 border-red-200",
  };
  return map[stage] || "bg-slate-100 text-slate-600 border-slate-200";
};

const confidenceColor = (c: string): string => {
  if (c === "High") return "text-emerald-600";
  if (c === "Moderate") return "text-amber-600";
  return "text-red-500";
};

const STAGE_PALETTE: Record<string, StagePaletteEntry> = {
  "Emerging":      { bg:"#ddd6fe", border:"#8b5cf6", text:"#4c1d95" },
  "Accelerating":  { bg:"#a7f3d0", border:"#10b981", text:"#065f46" },
  "Mainstreaming": { bg:"#bfdbfe", border:"#3b82f6", text:"#1e3a8a" },
  "Mature":        { bg:"#cbd5e1", border:"#64748b", text:"#1e293b" },
  "Plateauing":    { bg:"#fde68a", border:"#f59e0b", text:"#78350f" },
  "Fragmenting":   { bg:"#fecaca", border:"#ef4444", text:"#7f1d1d" },
  "Declining":     { bg:"#fbcfe8", border:"#ec4899", text:"#831843" },
  "Re-emerging":   { bg:"#bae6fd", border:"#0ea5e9", text:"#0c4a6e" },
  "Cyclical":      { bg:"#e9d5ff", border:"#a855f7", text:"#581c87" },
};

const STAGES_IN_USE: string[] = ["Emerging","Accelerating","Mainstreaming","Plateauing"];

const CONFIDENCE_CRITERIA: string =
  "Confidence reflects evidence quality and corroboration.\n\nHigh: supported by multiple independent, high-quality sources (regulatory texts, market data, deployment evidence) pointing in a consistent direction.\n\nModerate: partially corroborated, with fewer or more heterogeneous sources, or unresolved gaps.\n\nLow: single-source or speculative.";

const CONFIDENCE_INTRO = "Confidence reflects evidence quality and corroboration:";
const CONFIDENCE_ITEMS: TooltipItem[] = [
  { label:"High",     swatch:"#10b981", desc:"Supported by multiple independent, high-quality sources (regulatory texts, market data, deployment evidence) pointing in a consistent direction." },
  { label:"Moderate", swatch:"#f59e0b", desc:"Partially corroborated, with fewer or more heterogeneous sources, or unresolved gaps." },
  { label:"Low",      swatch:"#ef4444", desc:"Single-source or speculative." },
];

const PRIORITY_INTRO = "Trends are ranked by composite strategic priority, based on:";
const PRIORITY_ITEMS: TooltipItem[] = [
  { num:1, desc:"Strength and confidence of the supporting evidence" },
  { num:2, desc:"Pace and direction of change" },
  { num:3, desc:"Breadth of ecosystem impact across actors and value chains" },
  { num:4, desc:"Urgency of strategic response required within the 2020–2030 window" },
];

const STAGE_INTRO = "Lifecycle stage by pace of adoption:";
const STAGE_DEFINITIONS: TooltipTableItem[] = [
  { label:"Emerging",      swatch: STAGE_PALETTE["Emerging"].border,      desc:"Early-stage shift; limited evidence, adoption not yet widespread." },
  { label:"Accelerating",  swatch: STAGE_PALETTE["Accelerating"].border,  desc:"Rapid growth in adoption and investment; not yet mainstream." },
  { label:"Mainstreaming", swatch: STAGE_PALETTE["Mainstreaming"].border, desc:"Becoming baseline among leading enterprises; shifting from differentiator to default." },
  { label:"Mature",        swatch: STAGE_PALETTE["Mature"].border,        desc:"Widespread adoption; growth has stabilised." },
  { label:"Plateauing",    swatch: STAGE_PALETTE["Plateauing"].border,    desc:"Broad adoption reached; trend approaching saturation." },
  { label:"Fragmenting",   swatch: STAGE_PALETTE["Fragmenting"].border,   desc:"Splitting into competing, sometimes incompatible approaches." },
  { label:"Declining",     swatch: STAGE_PALETTE["Declining"].border,     desc:"Losing relevance or displaced by newer approaches." },
  { label:"Re-emerging",   swatch: STAGE_PALETTE["Re-emerging"].border,   desc:"Previously declining trend regaining traction under new conditions." },
  { label:"Cyclical",      swatch: STAGE_PALETTE["Cyclical"].border,      desc:"Recurs in waves tied to investment or regulatory cycles." },
];

const TREND_TYPE_INTRO = "Each trend is classified by the primary force driving the shift:";
const TREND_TYPE_DEFINITIONS: TooltipItem[] = [
  { label:"Technological",       desc:"Shifts driven by new technical capabilities, architectures, or engineering approaches (e.g., edge AI, federated systems)." },
  { label:"Regulatory",          desc:"Shifts driven by binding legislation, standards mandates, or compliance requirements." },
  { label:"Enterprise Adoption", desc:"Shifts in how, and how quickly, organisations adopt, deploy, and scale a capability." },
  { label:"Business Model",      desc:"Shifts in how value is created, delivered, or captured across the ecosystem." },
  { label:"Ecosystem/Platform",  desc:"Shifts in how actors, platforms, and value chains are structured and interrelate." },
];

const fullTrendType = (type: string): string => (type ? `${type} Trend` : "");

const MomentumIcon: FC<{ m: string }> = ({ m }) => {
  if (m === "Accelerating") return (
    <svg width="11" height="11" fill="none" stroke="#10b981" strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  );
  if (m === "Decelerating") return (
    <svg width="11" height="11" fill="none" stroke="#f59e0b" strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
      <polyline points="17 18 23 18 23 12"/>
    </svg>
  );
  return <svg width="11" height="11" fill="none" stroke="#94a3b8" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/></svg>;
};

const InfoTooltip: FC<InfoTooltipProps> = ({ text, intro, items, tableItems, icon, title, align = "left", trigger, width = 260 }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ left: number; top: number } | null>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const updateCoords = () => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    let left = align === "right" ? rect.right - width : rect.left;
    left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
    setCoords({ left, top: rect.bottom + 6 });
  };
  return (
    <span ref={anchorRef} className={`relative inline-flex items-center${trigger ? "" : " ml-1"}`} style={{verticalAlign:"middle"}}>
      {trigger ? (
        <span
          onMouseEnter={() => { updateCoords(); setVisible(true); }}
          onMouseLeave={() => setVisible(false)}
          onClick={e => { e.stopPropagation(); updateCoords(); setVisible(v => !v); }}
          className="cursor-help"
        >{trigger}</span>
      ) : (
        <button
          onMouseEnter={() => { updateCoords(); setVisible(true); }}
          onMouseLeave={() => setVisible(false)}
          onClick={e => { e.stopPropagation(); updateCoords(); setVisible(v => !v); }}
          className="flex items-center justify-center flex-shrink-0 bg-transparent border-none p-0 cursor-help"
          style={{lineHeight:1}}
          aria-label="More info"
        >{icon || <svg width="11" height="11" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}</button>
      )}
      {visible && coords && (
        <div style={{ position:"fixed", left:coords.left, top:coords.top, width, zIndex:9999 }}>
          <div className="bg-white text-black text-[11px] leading-relaxed rounded-lg shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-3">
            {title && (
              <div className="font-bold text-[12px] text-[#0f2644] mb-1.5">{title}</div>
            )}
            {intro && <div className="mb-2 text-black font-medium">{intro}</div>}
            {tableItems ? (
              <table style={{width:"100%", borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{background:"#f8fafc"}}>
                    <th style={{textAlign:"left", padding:"4px 6px", fontWeight:700, color:"#475569", borderBottom:"1px solid #e2e8f0", width:"38%"}}>Stage</th>
                    <th style={{textAlign:"left", padding:"4px 6px", fontWeight:700, color:"#475569", borderBottom:"1px solid #e2e8f0"}}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {tableItems.map((it, i) => (
                    <tr key={i} style={{borderBottom: i < tableItems.length-1 ? "1px solid #f1f5f9" : "none"}}>
                      <td style={{padding:"4px 6px", verticalAlign:"top", whiteSpace:"nowrap"}}>
                        <span style={{display:"inline-flex", alignItems:"center", gap:5}}>
                          {it.swatch && <span style={{display:"inline-block", width:7, height:7, borderRadius:"50%", background:it.swatch, flexShrink:0}} />}
                          <span style={{fontWeight:600, color:"#0f2644"}}>{it.label}</span>
                        </span>
                      </td>
                      <td style={{padding:"4px 6px", color:"#475569", verticalAlign:"top"}}>{it.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : items ? (
              <div className="divide-y divide-slate-100">
                {items.map((it, i) => (
                  <div key={i} className="py-1.5 first:pt-0 last:pb-0">
                    <p className="text-black m-0">
                      {it.swatch && <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{background:it.swatch, verticalAlign:"middle"}} />}
                      {it.num != null && <span className="font-bold">{it.num}.{" "}</span>}
                      {it.label && <span className="font-bold">{it.label}: </span>}
                      {it.desc}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-600">{text}</div>
            )}
          </div>
          </div>
        </div>
      )}
    </span>
  );
};

const TypeIcon: FC<{ type: string }> = ({ type }) => {
  const icons = {
    "Technological": <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
    "Regulatory": <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    "Enterprise Adoption": <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    "Business Model": <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    "Ecosystem/Platform": <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    "Talent/Workforce": <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
  };
  return icons[type] || null;
};

function TrendMaturityLandscape({ onGoTab, onOpenDrawer }: { onGoTab: (tab: string) => void; onOpenDrawer: (t: Trend) => void }) {
  const YEARS: number[] = [2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030];
  const trendPhases: Record<string, PhaseEntry[]> = {
    "TR-01": [{ stage:"Emerging",years:[2020,2021]},{ stage:"Accelerating",years:[2022,2023,2024]},{ stage:"Mainstreaming",years:[2025,2026,2027,2028,2029,2030]}],
    "TR-02": [{ stage:"Emerging",years:[2020,2021,2022]},{ stage:"Accelerating",years:[2023,2024,2025,2026]},{ stage:"Mainstreaming",years:[2027,2028,2029,2030]}],
    "TR-03": [{ stage:"Accelerating",years:[2020,2021,2022,2023]},{ stage:"Mainstreaming",years:[2024,2025,2026,2027,2028,2029,2030]}],
    "TR-04": [{ stage:"Emerging",years:[2020,2021,2022]},{ stage:"Accelerating",years:[2023,2024,2025,2026,2027]},{ stage:"Mainstreaming",years:[2028,2029,2030]}],
    "TR-05": [{ stage:"Plateauing",years:[2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030]}],
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-1">
            <span className="text-[15px] font-bold text-[#0f2644]">Trend Maturity Landscape: European IIoT (2020–2030)</span>
          </div>
          <div className="text-[13px] text-slate-400 mt-0.5">Bars show lifecycle stage transitions · <span className="text-orange-500 font-semibold">dashed line = 2026 current</span> · right column shows current stage</div>
        </div>
        <button onClick={() => onGoTab("evolution")} className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex-shrink-0">Full evolution view →</button>
      </div>

      <div className="flex items-center gap-3 flex-wrap mb-4">
        {Object.entries(STAGE_PALETTE).map(([stage, c]) => {
          const inUse = STAGES_IN_USE.includes(stage);
          return (
            <div key={stage} className="flex items-center gap-1.5" style={{opacity: inUse ? 1 : 0.35}}>
              <div className="w-2.5 h-2.5 rounded-sm border" style={{ backgroundColor:c.bg, borderColor:c.border }} />
              <span className="text-[11px] font-medium text-slate-500">{stage}</span>
            </div>
          );
        })}
      </div>

      <div className="flex mb-1.5">
        <div className="flex flex-1">
          {YEARS.map(y => (
            <div key={y} className="flex-1 text-center">
              <span className={`text-[11px] font-semibold ${y === 2026 ? "text-orange-500" : "text-slate-400"}`}>{y}</span>
              {y === 2026 && <div className="text-[9px] font-bold text-orange-500 leading-none">now</div>}
            </div>
          ))}
        </div>
        <div className="w-[108px] flex-shrink-0 pl-3">
          <span className="text-[10px] font-semibold text-slate-400 tracking-wide block">Current stage</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {TRENDS.map(t => {
          const phases = trendPhases[t.id] || [];
          return (
            <div key={t.id}>
              <div
                className="flex items-center gap-2 mb-1 group cursor-pointer w-fit"
                onClick={() => onOpenDrawer && onOpenDrawer(t)}
              >
                <div className="w-4 h-4 rounded bg-[#0f2644] text-white text-[9px] font-black flex items-center justify-center flex-shrink-0">{t.priorityRank}</div>
                <span className="text-[11px] font-semibold text-[#0f2644] leading-tight truncate group-hover:text-blue-700 transition-colors">{t.name}</span>
                <svg width="10" height="10" fill="none" stroke="#cbd5e1" strokeWidth="2.5" viewBox="0 0 24 24" className="flex-shrink-0 opacity-0 group-hover:opacity-100 group-hover:stroke-blue-400 transition-all"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
              <div className="flex items-center">
                <div className="flex-1 relative h-7">
                  {phases.map((ph, pi) => {
                    const startIdx = ph.years[0] - 2020;
                    const span = ph.years.length;
                    const leftPct = (startIdx / YEARS.length) * 100;
                    const widthPct = (span / YEARS.length) * 100;
                    const c = STAGE_PALETTE[ph.stage] || STAGE_PALETTE["Emerging"];
                    const isFirst = pi === 0;
                    const isLast = pi === phases.length - 1;
                    return (
                      <div key={pi}
                        className={`absolute top-0 h-full flex items-center justify-center overflow-hidden ${isFirst ? "rounded-l-md" : ""} ${isLast ? "rounded-r-md" : ""}`}
                        style={{
                          left: `${leftPct}%`, width: `${widthPct}%`,
                          backgroundColor: c.bg,
                          border: `1.5px solid ${c.border}`,
                          borderRight: isLast ? `1.5px solid ${c.border}` : "none",
                        }}
                        title={`${t.name}: ${ph.stage} (${ph.years[0]}–${ph.years[ph.years.length-1]})`}>
                        <span className="text-[11px] font-semibold px-1 truncate" style={{ color: c.text }}>{ph.stage}</span>
                      </div>
                    );
                  })}
                  <div className="absolute top-[-3px] bottom-[-3px] pointer-events-none" style={{ left:`${((2026-2020+0.5)/YEARS.length)*100}%`, width:0, borderLeft:"1.5px dashed #f97316", opacity:0.75 }} />
                </div>
                <div className="w-[108px] flex-shrink-0 pl-3">
                  <InfoTooltip
                    trigger={<span className={`text-[11px] font-bold px-1.5 py-0.5 rounded border cursor-help ${stageColor(t.stage)}`}>{t.stage}</span>}
                    title="Lifecycle Stages" tableItems={STAGE_DEFINITIONS} width={480} align="right"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OverviewTab({ onGoTab, onOpenDrawer }: { onGoTab: (tab: string) => void; onOpenDrawer: (t: Trend) => void }) {
  const highConf = TRENDS.filter(t => t.confidence === "High").length;
  const accelerating = TRENDS.filter(t => t.stage === "Accelerating").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Signals Extracted", value: SIGNALS.length, sub: "4 strong · 1 weak signal", tab: "signals", tooltip: "Signals are discrete, observable market or technology events detected across structured research, regulatory databases, and industry publications. Each signal is assessed for strength (Strong/Weak) and directional implication.", align: "left",
            cardIcon: <svg width="14" height="14" fill="none" stroke="#1EDD7D" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
          { label: "Trends Identified", value: TRENDS.length, sub: "Technological to Ecosystem", tab: "trends", tooltip: "Trends are sustained, directional shifts derived from clustering and synthesising multiple signals. Each trend is profiled by type (Technological, Regulatory, etc.), lifecycle stage, confidence level, and strategic implications.", align: "left",
            cardIcon: <svg width="14" height="14" fill="none" stroke="#1EDD7D" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> },
          { label: "High Confidence", value: highConf, sub: "Backed by multiple sources", tab: "trends", tooltip: "A trend is rated High Confidence when it is supported by convergent evidence across multiple independent sources, corroborated by quantitative data, expert consensus, and observable market behaviour, with no significant contradictory signals.", align: "right",
            cardIcon: <svg width="14" height="14" fill="none" stroke="#1EDD7D" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
          { label: "Accelerating", value: accelerating, sub: "Rapid adoption underway", tab: "evolution", tooltip: "Trends at the Accelerating stage show rapid adoption growth, increasing investment, and broadening market participation, but have not yet reached full mainstream penetration across the target industry or geography.", align: "right",
            cardIcon: <svg width="14" height="14" fill="none" stroke="#1EDD7D" strokeWidth="2" viewBox="0 0 24 24"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
        ].map(k => (
          <div key={k.label} onClick={() => onGoTab(k.tab)}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all group">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-6 h-6 rounded-md bg-[#f0fdf4] flex items-center justify-center flex-shrink-0">
                {k.cardIcon}
              </div>
              <div className="text-[12px] font-semibold text-slate-500 flex-1">{k.label}</div>
              <InfoTooltip text={k.tooltip} title={k.label} align={k.align} icon={<svg width="11" height="11" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0 cursor-help"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>} />
            </div>
            <div className="text-3xl font-black leading-none text-[#0f2644]">{k.value}</div>
            <div className="text-[11px] text-slate-400 mt-1.5">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-emerald-100">
          <svg width="16" height="16" fill="none" stroke="#0f2644" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z"/></svg>
          <div className="text-[15px] font-bold text-[#0f2644]">Executive Summary</div>
        </div>
        <div className="flex items-center gap-5 px-5 py-5">
          <div className="flex-shrink-0 w-[110px] h-[110px] rounded-full bg-[#BAFFE4] flex items-center justify-center">
            <svg width="62" height="62" viewBox="0 0 92 92" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M48.1562 35.4818C48.1562 30.1985 43.9516 25.875 38.8134 25.875H20.125V60.463H38.9284C48.1562 60.463 48.1562 70.0728 48.1562 70.0728M48.1562 70.0728V35.4818C48.1562 30.1956 52.3609 25.875 57.4991 25.875H76.1875V60.463H57.4991C48.1562 60.463 48.1562 70.0728 48.1562 70.0728ZM53.4121 73.3125C53.997 72.0669 54.9081 71.0138 56.0431 70.2714C57.178 69.529 58.4918 69.1269 59.8369 69.1101H73.3844M42.9004 73.3125C42.3262 72.0585 41.4176 70.9979 40.2803 70.2539C39.1429 69.51 37.8236 69.1133 36.4756 69.1101H22.9281" stroke="#10AE5F" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <g clipPath="url(#clip0_8826_242)">
                <path d="M34.5449 37.1055C35.3802 37.1055 36.1663 37.2634 36.9033 37.5793C37.6403 37.8951 38.2826 38.3303 38.83 38.8848C39.3775 39.4393 39.8092 40.0815 40.1251 40.8115C40.4409 41.5415 40.6024 42.3276 40.6094 43.1699C40.6094 43.6121 40.5813 44.0262 40.5251 44.4123C40.469 44.7983 40.3813 45.1668 40.2619 45.5178C40.1426 45.8687 39.9882 46.2162 39.7987 46.5601C39.6092 46.9041 39.3846 47.255 39.1248 47.613C38.9213 47.8937 38.7423 48.1464 38.5879 48.371C38.4335 48.5956 38.3071 48.8203 38.2089 49.0449C38.1106 49.2695 38.0369 49.5151 37.9878 49.7819C37.9386 50.0486 37.9141 50.3609 37.9141 50.7189V52.6035C37.9141 52.8843 37.8614 53.1475 37.7561 53.3932C37.6508 53.6388 37.507 53.8529 37.3245 54.0354C37.142 54.2179 36.9279 54.3618 36.6822 54.4671C36.4366 54.5724 36.1733 54.625 35.8926 54.625H33.1973C32.9165 54.625 32.6533 54.5724 32.4076 54.4671C32.162 54.3618 31.9479 54.2179 31.7654 54.0354C31.5829 53.8529 31.439 53.6388 31.3337 53.3932C31.2284 53.1475 31.1758 52.8843 31.1758 52.6035V50.7084C31.1758 50.3504 31.1512 50.0416 31.1021 49.7819C31.0529 49.5222 30.9792 49.28 30.881 49.0554C30.7827 48.8308 30.6564 48.6027 30.502 48.371C30.3475 48.1394 30.1685 47.8867 29.965 47.613C29.7053 47.255 29.4842 46.9076 29.3017 46.5706C29.1192 46.2337 28.9648 45.8863 28.8384 45.5283C28.7121 45.1703 28.6208 44.7983 28.5647 44.4123C28.5085 44.0262 28.4805 43.6121 28.4805 43.1699C28.4805 42.3347 28.6384 41.5485 28.9543 40.8115C29.2701 40.0745 29.7053 39.4323 30.2598 38.8848C30.8143 38.3373 31.4565 37.9056 32.1865 37.5898C32.9165 37.2739 33.7026 37.1125 34.5449 37.1055ZM36.5664 52.6035V51.9297H32.5234V52.6035C32.5234 52.786 32.5901 52.9439 32.7235 53.0773C32.8568 53.2107 33.0148 53.2773 33.1973 53.2773H35.8926C36.0751 53.2773 36.233 53.2107 36.3664 53.0773C36.4997 52.9439 36.5664 52.786 36.5664 52.6035ZM39.2617 43.1699C39.2617 42.5172 39.1389 41.9065 38.8932 41.338C38.6476 40.7694 38.3106 40.2675 37.8825 39.8324C37.4543 39.3972 36.956 39.0603 36.3874 38.8216C35.8189 38.583 35.2047 38.4601 34.5449 38.4531C33.8922 38.4531 33.2815 38.576 32.713 38.8216C32.1444 39.0673 31.6425 39.4042 31.2074 39.8324C30.7722 40.2605 30.4353 40.7589 30.1966 41.3274C29.958 41.896 29.8351 42.5101 29.8281 43.1699C29.8281 43.7946 29.8913 44.3316 30.0176 44.7808C30.144 45.23 30.3089 45.6301 30.5125 45.981C30.716 46.332 30.9301 46.6619 31.1547 46.9707C31.3793 47.2796 31.5934 47.6024 31.797 47.9394C32.0005 48.2763 32.169 48.6553 32.3023 49.0764C32.4357 49.4976 32.5094 49.9995 32.5234 50.582H36.5664C36.5734 49.9995 36.6436 49.5011 36.777 49.087C36.9103 48.6729 37.0788 48.2938 37.2823 47.9499C37.4859 47.606 37.7 47.2831 37.9246 46.9813C38.1492 46.6794 38.3633 46.3495 38.5668 45.9916C38.7704 45.6336 38.9353 45.23 39.0617 44.7808C39.188 44.3316 39.2547 43.7946 39.2617 43.1699ZM34.5449 35.7578C34.3624 35.7578 34.2045 35.6911 34.0711 35.5578C33.9378 35.4244 33.8711 35.2665 33.8711 35.084V33.7363C33.8711 33.5538 33.9378 33.3959 34.0711 33.2625C34.2045 33.1292 34.3624 33.0625 34.5449 33.0625C34.7274 33.0625 34.8853 33.1292 35.0187 33.2625C35.1521 33.3959 35.2188 33.5538 35.2188 33.7363V35.084C35.2188 35.2665 35.1521 35.4244 35.0187 35.5578C34.8853 35.6911 34.7274 35.7578 34.5449 35.7578ZM26.459 42.833H25.1113C24.9288 42.833 24.7709 42.7663 24.6375 42.633C24.5042 42.4996 24.4375 42.3417 24.4375 42.1592C24.4375 41.9767 24.5042 41.8188 24.6375 41.6854C24.7709 41.552 24.9288 41.4854 25.1113 41.4854H26.459C26.6415 41.4854 26.7994 41.552 26.9328 41.6854C27.0661 41.8188 27.1328 41.9767 27.1328 42.1592C27.1328 42.3417 27.0661 42.4996 26.9328 42.633C26.7994 42.7663 26.6415 42.833 26.459 42.833ZM27.017 45.581C27.1995 45.581 27.3574 45.6476 27.4908 45.781C27.6241 45.9144 27.6908 46.0758 27.6908 46.2653C27.6908 46.4057 27.6522 46.5285 27.575 46.6338C27.4978 46.7391 27.3925 46.8233 27.2592 46.8865C27.1819 46.9216 27.0767 46.9672 26.9433 47.0234C26.8099 47.0795 26.666 47.1392 26.5116 47.2024C26.3572 47.2655 26.2168 47.3182 26.0905 47.3603C25.9641 47.4024 25.8518 47.427 25.7536 47.434C25.5711 47.434 25.4131 47.3673 25.2798 47.2339C25.1464 47.1006 25.0797 46.9391 25.0797 46.7496C25.0797 46.6093 25.1183 46.4864 25.1956 46.3811C25.2728 46.2758 25.3781 46.1916 25.5114 46.1284C25.5886 46.1004 25.6939 46.0547 25.8273 45.9916C25.9606 45.9284 26.1045 45.8687 26.2589 45.8126C26.4134 45.7564 26.5537 45.7038 26.6801 45.6547C26.8064 45.6055 26.9187 45.581 27.017 45.581ZM28.6173 38.79C28.6173 38.9725 28.5507 39.1305 28.4173 39.2638C28.2839 39.3972 28.126 39.4639 27.9435 39.4639C27.8172 39.4639 27.7014 39.4323 27.5961 39.3691L26.4485 38.6637C26.3502 38.6005 26.273 38.5198 26.2168 38.4215C26.1607 38.3233 26.1291 38.211 26.1221 38.0846C26.1221 37.9021 26.1888 37.7442 26.3221 37.6108C26.4555 37.4775 26.6134 37.4108 26.7959 37.4108C26.9082 37.4108 27.024 37.4459 27.1433 37.5161L28.3015 38.211C28.3997 38.2671 28.477 38.3478 28.5331 38.4531C28.5893 38.5584 28.6173 38.6707 28.6173 38.79ZM29.4912 34.9155C29.4912 34.733 29.5579 34.5751 29.6913 34.4417C29.8246 34.3084 29.9825 34.2417 30.165 34.2417C30.2844 34.2417 30.3967 34.2733 30.502 34.3365C30.6072 34.3996 30.6915 34.4839 30.7546 34.5891L31.4074 35.7683C31.4636 35.8666 31.4916 35.9719 31.4916 36.0842C31.4916 36.2737 31.425 36.4352 31.2916 36.5685C31.1582 36.7019 31.0003 36.7686 30.8178 36.7686C30.6985 36.7686 30.5862 36.737 30.4809 36.6738C30.3756 36.6106 30.2914 36.5264 30.2282 36.4211L29.5754 35.2419C29.5193 35.1436 29.4912 35.0349 29.4912 34.9155ZM43.9785 41.4854C44.161 41.4854 44.3189 41.552 44.4523 41.6854C44.5857 41.8188 44.6523 41.9767 44.6523 42.1592C44.6523 42.3417 44.5857 42.4996 44.4523 42.633C44.3189 42.7663 44.161 42.833 43.9785 42.833H42.6309C42.4484 42.833 42.2904 42.7663 42.1571 42.633C42.0237 42.4996 41.957 42.3417 41.957 42.1592C41.957 41.9767 42.0237 41.8188 42.1571 41.6854C42.2904 41.552 42.4484 41.4854 42.6309 41.4854H43.9785ZM43.9996 46.7602C43.9996 46.9427 43.9329 47.1006 43.7995 47.2339C43.6662 47.3673 43.5082 47.434 43.3257 47.434C43.2485 47.434 43.1432 47.4129 43.0099 47.3708C42.8765 47.3287 42.7326 47.2726 42.5782 47.2024C42.4238 47.1322 42.2834 47.0725 42.1571 47.0234C42.0307 46.9742 41.9219 46.9251 41.8307 46.876C41.7043 46.8198 41.6026 46.7356 41.5254 46.6233C41.4482 46.511 41.406 46.3846 41.399 46.2443C41.399 46.0547 41.4657 45.8968 41.5991 45.7705C41.7324 45.6441 41.8939 45.5775 42.0834 45.5704C42.1676 45.5704 42.2764 45.595 42.4098 45.6441C42.5431 45.6933 42.6835 45.7494 42.8309 45.8126C42.9783 45.8758 43.1187 45.9389 43.252 46.0021C43.3854 46.0653 43.4942 46.1109 43.5784 46.139C43.7048 46.1951 43.8065 46.2758 43.8838 46.3811C43.961 46.4864 43.9996 46.6128 43.9996 46.7602ZM41.1463 39.4639C40.9638 39.4639 40.8059 39.3972 40.6725 39.2638C40.5392 39.1305 40.4725 38.9725 40.4725 38.79C40.4725 38.6707 40.5006 38.5584 40.5567 38.4531C40.6129 38.3478 40.6901 38.2671 40.7884 38.211L41.9465 37.5161C42.0658 37.4459 42.1816 37.4108 42.2939 37.4108C42.4764 37.4108 42.6344 37.4775 42.7677 37.6108C42.9011 37.7442 42.9678 37.9021 42.9678 38.0846C42.9678 38.2039 42.9397 38.3127 42.8835 38.411C42.8274 38.5093 42.7467 38.5935 42.6414 38.6637L41.4938 39.3691C41.3885 39.4323 41.2727 39.4639 41.1463 39.4639ZM37.5982 36.0842C37.5982 35.9719 37.6263 35.8666 37.6824 35.7683L38.3352 34.5891C38.3914 34.4839 38.4721 34.3996 38.5774 34.3365C38.6826 34.2733 38.7985 34.2417 38.9248 34.2417C39.1073 34.2417 39.2652 34.3084 39.3986 34.4417C39.532 34.5751 39.5986 34.733 39.5986 34.9155C39.5986 35.0349 39.5706 35.1436 39.5144 35.2419L38.8616 36.4211C38.8055 36.5264 38.7248 36.6106 38.6195 36.6738C38.5142 36.737 38.3984 36.7686 38.272 36.7686C38.0895 36.7686 37.9316 36.7019 37.7982 36.5685C37.6649 36.4352 37.5982 36.2737 37.5982 36.0842Z" fill="#10AE5F"/>
              </g>
              <defs>
                <clipPath id="clip0_8826_242"><rect width="21.5625" height="21.5625" fill="white" transform="translate(24.4375 33.0625)"/></clipPath>
              </defs>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] text-black leading-relaxed">
              Between 2020 and 2030, European Industrial IoT platform competition is defined by five enduring structural shifts. Edge AI and federated architectures are mainstreaming among leading enterprises. Open, sovereign data ecosystems are mandated by binding EU regulation. AI-driven automation and digital twins are now baseline requirements in advanced verticals. Compliance-centric governance has become a market access prerequisite. Persistent SME and regional fragmentation remains the primary constraint on ecosystem-wide convergence.
            </p>
          </div>
        </div>
      </div>

      <TrendMaturityLandscape onGoTab={onGoTab} onOpenDrawer={onOpenDrawer} />

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[15px] font-bold text-[#0f2644]">Trend Priority Ranking</span>
              <InfoTooltip title="Priority Ranking" intro={PRIORITY_INTRO} items={PRIORITY_ITEMS} width={300} />
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Ranked by evidence strength & confidence, ecosystem impact, and strategic urgency</div>
          </div>
          <button onClick={() => onGoTab("trends")} className="text-xs font-semibold text-blue-600 hover:text-blue-800">View all profiles →</button>
        </div>
        <div className="divide-y divide-slate-100">
          {[...TRENDS].sort((a, b) => a.priorityRank - b.priorityRank).map((t) => (
            <div key={t.id}
              onClick={() => onOpenDrawer(t)}
              className="px-5 py-3 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors group">
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black flex items-center justify-center flex-shrink-0">
                {t.priorityRank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-semibold text-[#0f2644] truncate group-hover:text-blue-700 transition-colors">{t.name}</div>
                <div className="text-xs text-slate-400 flex items-center gap-1" onClick={e => e.stopPropagation()}>
                  <InfoTooltip trigger={<span className="cursor-help">{fullTrendType(t.type)}</span>} title="Trend Classifications" intro={TREND_TYPE_INTRO} items={TREND_TYPE_DEFINITIONS} width={300} />
                  <span>· {t.domain}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                <InfoTooltip
                  trigger={<span className={`text-xs font-bold px-2 py-0.5 rounded-md border cursor-help ${stageColor(t.stage)}`}>{t.stage}</span>}
                  title="Lifecycle Stages" tableItems={STAGE_DEFINITIONS} width={480} align="right"
                />
                <InfoTooltip
                  trigger={<span className={`text-xs font-bold cursor-help ${confidenceColor(t.confidence)}`}>{t.confidence === "High" ? "High Confidence" : t.confidence === "Moderate" ? "Moderate Confidence" : t.confidence}</span>}
                  title="Confidence Levels" intro={CONFIDENCE_INTRO} items={CONFIDENCE_ITEMS} width={280} align="right"
                />
              </div>
              <svg width="14" height="14" fill="none" stroke="#cbd5e1" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0 group-hover:stroke-blue-400 transition-colors"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-1 mb-3"><span className="text-[15px] font-bold text-[#0f2644]">Cross-Trend Convergence Patterns</span><InfoTooltip title="Cross-Trend Convergence Patterns" text="Areas where trends overlap and reinforce each other, revealing implications that only become visible when trends are considered together." /></div>
        <div className="space-y-2">
          {CROSS_TREND_PATTERNS.map((p, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <p className="text-[13px] text-black leading-relaxed">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SignalsTab() {
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const [strongCollapsed, setStrongCollapsed] = useState<boolean>(false);
  const [weakCollapsed, setWeakCollapsed] = useState<boolean>(false);
  const strong: Signal[] = SIGNALS.filter(s => s.strength === "Strong");
  const weak: Signal[] = SIGNALS.filter(s => s.strength === "Weak");

  const signalSources: Record<string, SignalSource[]> = {
    "SIG-01": [{ label:"Link 1", href:"https://aioti.eu" }, { label:"Link 2", href:"https://ec.europa.eu" }],
    "SIG-02": [{ label:"Link 1", href:"https://eur-lex.europa.eu" }, { label:"Link 2", href:"https://gaia-x.eu" }],
    "SIG-03": [{ label:"Link 1", href:"https://iot-analytics.com" }, { label:"Link 2", href:"https://ec.europa.eu/horizon" }],
    "SIG-04": [{ label:"Link 1", href:"https://internationaldataspaces.org" }, { label:"Link 2", href:"https://gaia-x.eu" }],
    "SIG-05": [{ label:"Link 1", href:"https://mckinsey.com" }, { label:"Link 2", href:"https://ec.europa.eu/eurostat" }],
  };

  const SignalCard: FC<{ sig: Signal }> = ({ sig }) => {
    const isOpen = selectedSignal?.id === sig.id;
    return (
      <div className={`rounded-xl border transition-all ${isOpen ? "border-emerald-300 bg-emerald-50/40" : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"}`}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${sig.strength === "Strong" ? "bg-emerald-50" : "bg-slate-100"}`}>
              {sig.strength === "Strong"
                ? <svg width="12" height="12" fill="none" stroke="#10b981" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                : <svg width="12" height="12" fill="none" stroke="#94a3b8" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><line x1="12" y1="5" x2="19" y2="12"/><line x1="12" y1="19" x2="19" y2="12"/></svg>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="text-[14px] font-semibold text-black leading-tight">{sig.title}</div>
                <InfoTooltip
                  trigger={<span className={`text-xs font-bold px-1.5 py-0.5 rounded border flex-shrink-0 cursor-help whitespace-nowrap ${sig.confidence === "High" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{sig.confidence === "High" ? "High Confidence" : sig.confidence === "Moderate" ? "Moderate Confidence" : sig.confidence}</span>}
                  title="Confidence Levels" intro={CONFIDENCE_INTRO} items={CONFIDENCE_ITEMS} width={280} align="right"
                />
              </div>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0 text-slate-400"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  {sig.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0 text-slate-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {sig.timeRange}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0 text-slate-400"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  {sig.geography}
                </span>
              </div>
              <p className="text-[13px] text-black mt-2 leading-relaxed line-clamp-2">{sig.description}</p>
            </div>
          </div>

          {isOpen && (
            <div className="mt-3 pt-3 border-t border-emerald-200/70 ml-10">
              <div className="text-[13px] font-semibold text-[#0f2644] mb-1">Directional Implication</div>
              <p className="text-[13px] text-black leading-relaxed">{sig.directionalImplication}</p>
            </div>
          )}

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between ml-10">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-black whitespace-nowrap">Source(s):</span>
              {(signalSources[sig.id] || []).map((s, i, arr) => (
                <span key={s.label} className="flex items-center gap-1">
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline">{s.label}</a>
                  {i < arr.length - 1 && <span className="text-slate-300 text-xs">,</span>}
                </span>
              ))}
            </div>
            <button
              onClick={() => setSelectedSignal(isOpen ? null : sig)}
              className={`flex items-center gap-1 text-xs font-semibold flex-shrink-0 ml-3 transition-colors ${isOpen ? "text-emerald-600 hover:text-emerald-800" : "text-slate-400 hover:text-slate-700"}`}
            >
              {isOpen ? "Show less" : "View more"}
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                style={{ transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0f2644] to-[#1a4a7a] flex items-center justify-center flex-shrink-0">
          <svg width="13" height="13" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-[15px] font-bold text-[#0f2644]">Signal Landscape</span>
            <InfoTooltip title="Signal Landscape" text="Signals are discrete, observable market or technology events detected across structured research, regulatory databases, and industry publications. Each signal is assessed for strength (Strong or Weak) and its directional implication for the market." width={280} />
          </div>
          <div className="text-[15px] text-black">Market observations from regulatory, technology, and enterprise sources, classified by strength and confidence across European IIoT ecosystems.</div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-3 cursor-pointer" onClick={() => setStrongCollapsed(v => !v)}>
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[15px] font-bold text-[#0f2644]">Strong Signals ({strong.length})</span>
          <InfoTooltip title="Strong Signals" text="Corroborated by multiple independent data points with high directional confidence." />
          <svg width="18" height="18" fill="none" stroke="#0f2644" strokeWidth="2.5" viewBox="0 0 24 24" style={{marginLeft:"auto",transition:"transform 0.2s",transform: strongCollapsed ? "rotate(-90deg)" : "rotate(0deg)"}}><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        {!strongCollapsed && <div className="grid grid-cols-2 gap-3">{strong.map(s => <SignalCard key={s.id} sig={s} />)}</div>}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-3 cursor-pointer" onClick={() => setWeakCollapsed(v => !v)}>
          <div className="w-2 h-2 rounded-full bg-slate-300" />
          <span className="text-[15px] font-bold text-[#0f2644]">Weak Signals ({weak.length})</span>
          <InfoTooltip title="Weak Signals" text="Early-stage or single-source indicator with unresolved directional persistence." />
          <svg width="18" height="18" fill="none" stroke="#0f2644" strokeWidth="2.5" viewBox="0 0 24 24" style={{marginLeft:"auto",transition:"transform 0.2s",transform: weakCollapsed ? "rotate(-90deg)" : "rotate(0deg)"}}><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        {!weakCollapsed && <div className="grid grid-cols-2 gap-3">{weak.map(s => <SignalCard key={s.id} sig={s} />)}</div>}
      </div>
      <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
        <div className="flex items-center gap-1 mb-3"><span className="text-[15px] font-bold text-amber-800">Signal Gaps Identified</span><InfoTooltip title="Signal Gaps Identified" text="Topic areas where evidence is insufficient to form a directional view." /></div>
        <ul className="space-y-2">
          {[
            "Lack of peer-reviewed country-level benchmarking of SME IIoT adoption post-2024",
            "Limited case studies on sector-specific implementation models validated at Tier 1 level",
            "Insufficient direct evidence of RISC-V impact on industrial deployments post-2025",
            "Limited longitudinal data on business model evolution and ROI beyond pilots"
          ].map((gap, i) => (
            <li key={i} className="text-[13px] text-amber-700 flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
              <span>{gap}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TrendsTab({ onOpenDrawer }: { onOpenDrawer: (t: Trend) => void }) {
  const cardHighlights: Record<string, string[]> = {
    "TR-01": ["Edge AI $36.67B→$59.66B by 2032", "60%+ MFRs building digital twins", "€150M+ EU R&D funding"],
    "TR-02": ["EU Data Act (2025) mandates openness", "IDSA/DSP in >60% of projects", "Gaia-X data spaces live"],
    "TR-03": [">85% firms targeting AI automation", "Digital twin CAGR 39.8%", "20–35%+ cost reduction"],
    "TR-04": ["AI Act, CRA redefining obligations", "Compliance now required for market entry", "Gaia-X procurement rules"],
    "TR-05": ["Germany 24.6% IIoT share", "SMEs <15% scale IIoT", "6–7M ICT skills gap by 2030"],
  };

  const typeColorMap: Record<string, { bg: string; text: string; border: string }> = {
    "Technological":      { bg:"#f1f5f9", text:"#475569", border:"#e2e8f0" },
    "Regulatory":         { bg:"#f1f5f9", text:"#475569", border:"#e2e8f0" },
    "Enterprise Adoption":{ bg:"#f1f5f9", text:"#475569", border:"#e2e8f0" },
    "Business Model":     { bg:"#f1f5f9", text:"#475569", border:"#e2e8f0" },
    "Ecosystem/Platform": { bg:"#f1f5f9", text:"#475569", border:"#e2e8f0" },
  };

  const accentBar = (stage: string): string => stage === "Mainstreaming" ? "#3b82f6" : stage === "Accelerating" ? "#1EDD7D" : stage === "Plateauing" ? "#f59e0b" : "#a78bfa";

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0f2644] to-[#1a4a7a] flex items-center justify-center flex-shrink-0">
          <svg width="13" height="13" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
        </div>
        <div className="min-w-0">
          <div className="text-[15px] font-bold text-[#0f2644]">Trend Profiles</div>
          <div className="text-[15px] text-black">Five structural trends shaping European IIoT platform competition from 2020–2030, each profiled by stage, evidence, and strategic implications.</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
      {TRENDS.map((t, idx) => {
        const tc = typeColorMap[t.type] || { bg:"#f8fafc", text:"#475569", border:"#e2e8f0" };
        const highlights = cardHighlights[t.id] || [];
        return (
          <div key={t.id}
            onClick={() => onOpenDrawer(t)}
            className="group bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md"
            style={{ border:"1px solid #e2e8f0" }}>
            <div style={{ height:3, background: accentBar(t.stage) }} />
            <div style={{ padding:"12px 14px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ width:22, height:22, borderRadius:6, background:"#0f2644", color:"#fff", fontSize:10, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {String(idx+1).padStart(2,"0")}
                  </div>
                </div>
                <InfoTooltip
                  trigger={<span className={`font-bold px-1.5 py-0.5 rounded border cursor-help ${stageColor(t.stage)}`} style={{ fontSize:9 }}>{t.stage}</span>}
                  title="Lifecycle Stages" tableItems={STAGE_DEFINITIONS} width={480} align="right"
                />
              </div>
              <div style={{ fontSize:13, fontWeight:700, color:"#0f2644", lineHeight:1.35, marginBottom:6 }}>{t.short}</div>
              <div style={{ marginBottom:8 }}>
                <InfoTooltip
                  trigger={
                    <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:10, fontWeight:600, padding:"2px 6px", borderRadius:20, border:`1px solid ${tc.border}`, background:tc.bg, color:tc.text }}>
                      <TypeIcon type={t.type} />{fullTrendType(t.type)}
                    </span>
                  }
                  title="Trend Classifications" intro={TREND_TYPE_INTRO} items={TREND_TYPE_DEFINITIONS} width={300}
                />
              </div>
              <p style={{ fontSize:12, color:"#000000", lineHeight:1.5, marginBottom:8, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{t.definition}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:3, marginBottom:8 }}>
                {highlights.map((h,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:5 }}>
                    <div style={{ width:5, height:5, borderRadius:"50%", background:"#1EDD7D", flexShrink:0, marginTop:4 }}/>
                    <span style={{ fontSize:10, color:"#000000", lineHeight:1.4 }}>{h}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:8, borderTop:"1px solid #f1f5f9" }}>
                <InfoTooltip
                  trigger={<span style={{ fontSize:10, fontWeight:700, cursor:"help" }} className={confidenceColor(t.confidence)}>{t.confidence === "High" ? "High Confidence" : t.confidence === "Moderate" ? "Moderate Confidence" : t.confidence}</span>}
                  title="Confidence Levels" intro={CONFIDENCE_INTRO} items={CONFIDENCE_ITEMS} width={280}
                />
                <button
                  onClick={e => { e.stopPropagation(); onOpenDrawer(t); }}
                  style={{ fontSize:10, fontWeight:600, color:"#2563eb", background:"none", border:"none", padding:0, cursor:"pointer", display:"flex", alignItems:"center", gap:3 }}
                >
                  View Details
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}

function EvolutionTab({ onOpenDrawer }: { onOpenDrawer: (t: Trend) => void }) {
  const YEARS: number[] = [2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030];

  const phaseMap: Record<string, PhaseMapEntry[]> = {
    "TR-01": [{ start:2020,end:2021,stage:"Emerging",label:"R&D / EU pilots"},{ start:2022,end:2024,stage:"Accelerating",label:"Platform-wide roll-out"},{ start:2025,end:2030,stage:"Mainstreaming",label:"Federated standard"}],
    "TR-02": [{ start:2020,end:2022,stage:"Emerging",label:"Policy formation"},{ start:2023,end:2026,stage:"Accelerating",label:"Data Act / Gaia-X deploy"},{ start:2027,end:2030,stage:"Mainstreaming",label:"Harmonised standards"}],
    "TR-03": [{ start:2020,end:2023,stage:"Accelerating",label:"Large-firm mainstreaming"},{ start:2024,end:2030,stage:"Mainstreaming",label:"85%+ adoption baseline"}],
    "TR-04": [{ start:2020,end:2022,stage:"Emerging",label:"Early governance pilots"},{ start:2023,end:2027,stage:"Accelerating",label:"AI Act / CRA enforcement"},{ start:2028,end:2030,stage:"Mainstreaming",label:"Compliance as baseline"}],
    "TR-05": [{ start:2020,end:2030,stage:"Plateauing",label:"Persistent structural gap"}],
  };

  const milestones: Record<string, Milestone[]> = {
    "TR-01": [{year:2022,label:"Pilots scale"},{year:2025,label:"OPC-UA standard"}],
    "TR-02": [{year:2023,label:"Data Act"},{year:2027,label:"Harmonised"}],
    "TR-03": [{year:2024,label:"DT baseline"},{year:2027,label:"85%+ target"}],
    "TR-04": [{year:2024,label:"AI Act live"},{year:2025,label:"CRA binding"}],
    "TR-05": [{year:2026,label:"Gap widens"},{year:2028,label:"Review point"}],
  };

  const phaseStyle = STAGE_PALETTE;
  const totalYears = 10;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0f2644] to-[#1a4a7a] flex items-center justify-center flex-shrink-0">
          <svg width="13" height="13" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 3H3v7h18V3z"/><path d="M21 14H3v7h18v-7z"/><line x1="12" y1="10" x2="12" y2="14"/></svg>
        </div>
        <div className="min-w-0">
          <div className="text-[15px] font-bold text-[#0f2644]">Evolution Mapping</div>
          <div className="text-[15px] text-black">Longitudinal lifecycle view of all five trends from 2020–2030, with phase transitions, key milestones, and optimistic, conservative, and disruption future-state scenarios.</div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-[15px] font-bold text-[#0f2644]">Evolution Trajectory by Trend (2020–2030)</div>
            <div className="text-[13px] text-black mt-0.5">Swimlane roadmap: phases and milestones per trend</div>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-end" style={{maxWidth:560}}>
            {Object.entries(STAGE_PALETTE).map(([stage, c]) => {
              const inUse = STAGES_IN_USE.includes(stage);
              return (
                <div key={stage} className="flex items-center gap-1.5" style={{opacity: inUse ? 1 : 0.4}} title={inUse ? undefined : "Stage not observed for any trend in this analysis"}>
                  <div className="w-2.5 h-2.5 rounded-sm border" style={{ backgroundColor:c.bg, borderColor:c.border }} />
                  <span className="text-xs text-black font-medium">{stage}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-5">
          <div className="flex mb-3">
            {[2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030].map(y => (
              <div key={y} className="flex-1 text-center">
                <span className={`text-xs font-semibold ${y === 2026 ? "text-orange-500 font-black" : "text-slate-400"}`}>{y}</span>
                {y === 2026 && <div className="text-[9px] font-bold text-orange-500 leading-none">current</div>}
              </div>
            ))}
          </div>

          <div className="space-y-4 relative">
            {TRENDS.map(trend => {
              const phases = phaseMap[trend.id] || [];
              const marks = milestones[trend.id] || [];

              return (
                <div key={trend.id}>
                  <div
                    className="flex items-center gap-2 mb-1.5 group cursor-pointer w-fit"
                    onClick={() => onOpenDrawer && onOpenDrawer(trend)}
                  >
                    <div className="w-5 h-5 rounded bg-[#0f2644] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">
                      {trend.priorityRank}
                    </div>
                    <div className="text-[12px] font-semibold text-[#0f2644] leading-tight group-hover:text-blue-700 transition-colors">{trend.name}</div>
                    <svg width="11" height="11" fill="none" stroke="#cbd5e1" strokeWidth="2.5" viewBox="0 0 24 24" className="flex-shrink-0 opacity-0 group-hover:opacity-100 group-hover:stroke-blue-400 transition-all"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>

                  <div className="flex w-full relative h-9">
                      {phases.map((ph, pi) => {
                        const startIdx = ph.start - 2020;
                        const endIdx   = ph.end   - 2020;
                        const spanCols = endIdx - startIdx + 1;
                        const leftPct  = (startIdx / (totalYears + 1)) * 100;
                        const widthPct = (spanCols / (totalYears + 1)) * 100;
                        const style    = phaseStyle[ph.stage] || phaseStyle["Emerging"];
                        const isFirst  = pi === 0;
                        const isLast   = pi === phases.length - 1;
                        return (
                          <div key={pi}
                            className={`absolute top-0 h-full flex items-center justify-center
                              ${isFirst ? "rounded-l-lg" : ""} ${isLast ? "rounded-r-lg" : ""}`}
                            style={{
                              left: `${leftPct}%`,
                              width: `${widthPct}%`,
                              backgroundColor: style.bg,
                              border: `1.5px solid ${style.border}`,
                              borderRight: isLast ? undefined : "none",
                            }}
                            title={`${ph.stage}: ${ph.start}–${ph.end}`}
                          >
                            <span className="text-xs font-semibold px-1 truncate" style={{ color: style.text }}>
                              {ph.label}
                            </span>
                          </div>
                        );
                      })}

                      {marks.map((m, mi) => {
                        const xPct = ((m.year - 2020 + 0.5) / (totalYears + 1)) * 100;
                        return (
                          <div key={mi}
                            className="absolute top-0 h-full flex flex-col items-center justify-end pointer-events-none"
                            style={{ left: `${xPct}%`, transform: "translateX(-50%)" }}>
                            <div className="absolute top-0 w-2.5 h-2.5 rounded-full bg-[#0f2644] border-2 border-white shadow-sm" style={{ transform: "translateY(-50%)" }} />
                          </div>
                        );
                      })}

                      <div className="absolute top-[-2px] bottom-[-2px] pointer-events-none" style={{ left: `${((2026 - 2020 + 0.5) / (totalYears + 1)) * 100}%`, width:0, borderLeft:"1.5px dashed #f97316", opacity:0.7 }} />
                  </div>

                  <div className="relative h-5">
                    {marks.map((m, mi) => {
                      const xPct = ((m.year - 2020 + 0.5) / (totalYears + 1)) * 100;
                      return (
                        <div key={mi} className="absolute top-0 flex flex-col items-center"
                          style={{ left: `${xPct}%`, transform: "translateX(-50%)" }}>
                          <span className="text-[13px] font-semibold text-[#0f2644] whitespace-nowrap bg-white px-1 rounded border border-slate-200 shadow-sm">
                            {m.year} · {m.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {trend.priorityRank < TRENDS.length && (
                    <div className="h-px bg-slate-100 mt-3" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-[15px] font-bold text-[#0f2644] mb-4">Potential Future States</div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label:"Optimistic", color:"border-emerald-300 bg-emerald-50", icon:"↑", desc:"Operational convergence around open interoperable sovereign IIoT ecosystems. Harmonized standards mature by 2027. SME inclusion accelerates via compliance-as-a-service. EU digital sovereignty achieved across leading sectors." },
            { label:"Conservative", color:"border-blue-200 bg-blue-50", icon:"→", desc:"Large-enterprise-led adoption continues while fragmentation persists among SMEs and regions. Standards converge in flagship verticals (automotive, energy). Regional divide narrows slowly. Partial sovereignty achieved." },
            { label:"Disruption", color:"border-red-200 bg-red-50", icon:"⚡", desc:"Regulatory fragmentation, standards delays, or infrastructure bottlenecks slow ecosystem convergence. SME exclusion deepens. Non-EU platform providers capture market share. Sovereignty ambitions partially abandoned." }
          ].map(s => (
            <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-black">{s.icon}</span>
                <span className="text-[15px] font-bold text-[#0f2644]">{s.label}</span>
              </div>
              <p className="text-[13px] text-black leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SynthesisTab({ onOpenDrawer }: { onOpenDrawer: (t: Trend) => void }) {
  const trendLabelMap: Record<string, Trend | undefined> = {
    "Trend 01": TRENDS.find(t => t.id === "TR-01"),
    "Trend 02": TRENDS.find(t => t.id === "TR-02"),
    "Trend 03": TRENDS.find(t => t.id === "TR-03"),
    "Trend 04": TRENDS.find(t => t.id === "TR-04"),
    "Trend 05": TRENDS.find(t => t.id === "TR-05"),
  };

  const renderLinkedTrends = (linked: string): ReactNode => {
    if (linked.includes("–")) {
      return (
        <span className="flex items-center gap-1 flex-wrap">
          {["Trend 01","Trend 02","Trend 03","Trend 04","Trend 05"].map((label, i) => {
            const trend = trendLabelMap[label];
            return (
              <span key={label} className="flex items-center gap-1">
                {i > 0 && <span className="text-slate-300">·</span>}
                <button
                  onClick={() => trend && onOpenDrawer(trend)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer"
                >{label}</button>
              </span>
            );
          })}
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 flex-wrap">
        {linked.split(", ").map((label, i) => {
          const trend = trendLabelMap[label.trim()];
          return (
            <span key={label} className="flex items-center gap-1">
              {i > 0 && <span className="text-slate-300">,</span>}
              <button
                onClick={() => trend && onOpenDrawer(trend)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer"
              >{label.trim()}</button>
            </span>
          );
        })}
      </span>
    );
  };
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0f2644] to-[#1a4a7a] flex items-center justify-center flex-shrink-0">
          <svg width="13" height="13" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <div className="min-w-0">
          <div className="text-[15px] font-bold text-[#0f2644]">Strategic Insights</div>
          <div className="text-[15px] text-black">Consolidated takeaways, emerging opportunity areas, and structural risks synthesised across all five trends to guide platform strategy through 2030.</div>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <svg width="15" height="15" fill="none" stroke="#10b981" strokeWidth="2.5" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span className="text-[15px] font-bold text-[#0f2644]">Final Strategic Takeaways</span>
          <InfoTooltip title="Final Strategic Takeaways" text="These takeaways are ranked by strategic priority, based on synthesised cross-trend importance, evidence strength, and time-sensitivity. #1 represents the most structurally significant finding across all five trends." />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { rank:1, text:"European IIoT platform competition has fundamentally shifted toward architectures anchored by edge intelligence, data interoperability, and compliance orchestration, validated by regulatory alignment, market evidence, and large-scale platform evolution.", linked:"Trend 01, Trend 02" },
            { rank:2, text:"Policy and standards-driven open/sovereign data strategies are as much a market requirement as a regulatory one; providers must design for compliance, interoperability, and sovereignty by default.", linked:"Trend 02, Trend 04" },
            { rank:3, text:"AI-driven automation, digital twins, and predictive capabilities are converging as default layers in advanced manufacturing systems, but SME and regional inclusion remain urgent imperatives.", linked:"Trend 03, Trend 05" },
            { rank:4, text:"Compliance, governance, and trustworthy ecosystem management have become sector-wide baselines, not premium differentiators; genuine innovation is pivoting to service design and data-centric value within trusted platforms.", linked:"Trend 04" },
            { rank:5, text:"Persistent and potentially widening fragmentation (regional, SME, skills) poses structural risks to ecosystem resilience and pan-European industrial competitiveness; targeted policy and funding will determine the next convergence phase.", linked:"Trend 05" },
            { rank:6, text:"Strategic focus should be on scalable federation, harmonized standards, modular interoperability, SME enablement, and supporting the synchronization of digital and green transitions within compliant, sovereign, and resilient industrial ecosystems.", linked:"Trend 01 – Trend 05" },
          ].map(t => (
            <div key={t.rank} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all">
              <div className="w-6 h-6 rounded-full bg-[#0f2644] text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">{t.rank}</div>
              <div className="flex-1">
                <p className="text-[13px] text-black leading-relaxed">{t.text}</p>
                <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-black">Associated with</span>
                  {renderLinkedTrends(t.linked)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-1 mb-4"><span className="text-[15px] font-bold text-[#0f2644]">Emerging Opportunity Areas</span><InfoTooltip title="Emerging Opportunity Areas" text="Market and capability white spaces identified at the intersection of two or more trends, where first-mover advantage and structural demand are both present but not yet fully served." /></div>
        <div className="grid grid-cols-2 gap-3">
          {EMERGING_OPPORTUNITIES.map((o, i) => (
            <div key={i} className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50">
              <div className="text-[15px] font-semibold text-[#0f2644] mb-1">{o.title}</div>
              <p className="text-[13px] text-black leading-relaxed">{o.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-1 mb-4"><span className="text-[15px] font-bold text-[#0f2644]">Major Risks & Uncertainties</span><InfoTooltip title="Major Risks & Uncertainties" text="Structural risks and unresolved uncertainties that could slow, redirect, or fragment the trends identified, drawn from constraints, contradictions, and weak signals across the analysis." /></div>
        <div className="grid grid-cols-2 gap-2">
          {[
            "Structural digital skills shortages and upskilling lag, especially in SMEs and less advanced regions",
            "Fragmentation in standards and regulatory interpretation slowing full interoperability and market convergence",
            "SME onboarding and high integration/migration cost barriers; pilot-to-scale gaps persist despite policy focus",
            "Ongoing dependence on global (non-European) technology suppliers for critical AI, cloud, and edge infrastructure",
            "Cybersecurity complexity and compliance reporting burdens may stifle innovation if not managed adaptively",
            "Value and innovation bottleneck if compliance-centric models become too rigid for new entrants"
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-100">
              <svg width="20" height="20" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5" fill="#ef4444"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="17" r="1" fill="white"/></svg>
              <p className="text-[13px] text-black leading-relaxed">{r}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const SB_MAIN = [
  { label:"Trend Identification", icon:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> },
  { label:"Adjacent Markets", icon:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
  { label:"Competitive Intel", icon:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { label:"Business Feasibility", icon:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  { label:"Vendor Landscape", icon:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
];

const SB_SEC = [
  { label:"Settings", icon:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
  { label:"Documentation", icon:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
];

const NAV_TABS = [
  { id:"overview", label:"Overview", icon:<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { id:"signals", label:"Signal Landscape", icon:<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { id:"trends", label:"Trend Profiles", icon:<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> },
  { id:"evolution", label:"Evolution Mapping", icon:<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 3H3v7h18V3z"/><path d="M21 14H3v7h18v-7z"/><line x1="12" y1="10" x2="12" y2="14"/></svg> },
  { id:"synthesis", label:"Strategic Insights", icon:<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
];

function TrendDrawer({ trend, onClose }: { trend: Trend; onClose: (t: Trend | null) => void }) {
  const [activeSection, setActiveSection] = useState<string>("evidence");
  const curIdx = TRENDS.findIndex(x => x.id === trend.id);

  const accentBar = (stage: string): string => stage === "Mainstreaming" ? "#3b82f6" : stage === "Accelerating" ? "#1EDD7D" : stage === "Plateauing" ? "#f59e0b" : "#a78bfa";

  const affectedActors: string[] = trend.affectedActors || [];
  const coreEvidence: string[] = trend.coreEvidence || [];
  const contradictions: string[] = trend.contradictions || [];
  const structuralDrivers: string[] = trend.structuralDrivers || [];
  const constraints: string[] = trend.constraints || [];
  const ecosystemImpact: string[] = trend.ecosystemImpact || [];
  const strategicImplications: string[] = trend.strategicImplications || [];

  const navItems: { id: string; label: string }[] = [
    { id:"evidence",     label:"Evidence" },
    { id:"drivers",      label:"Drivers" },
    { id:"impact",       label:"Impact" },
    { id:"implications", label:"Implications" },
  ];

  return (
    <div style={{ position:"absolute", inset:0, zIndex:200, display:"flex" }} onClick={() => onClose(null)}>
      <div style={{ position:"absolute", inset:0, background:"rgba(15,38,68,0.35)", backdropFilter:"blur(2px)" }} />

      <div
        onClick={e => e.stopPropagation()}
        style={{
          position:"absolute", top:0, right:0, bottom:0,
          width:700, background:"#fff",
          borderLeft:"1px solid #e2e8f0",
          boxShadow:"-12px 0 40px rgba(0,0,0,0.15)",
          display:"flex", flexDirection:"column", zIndex:201,
        }}>

        <div style={{ height:3, background:accentBar(trend.stage), flexShrink:0 }} />

        <div style={{ padding:"16px 20px 14px", borderBottom:"1px solid #f1f5f9", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:10, marginBottom:10 }}>
            <div style={{ display:"flex", gap:10, alignItems:"flex-start", minWidth:0 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:"#0f2644", color:"#fff", fontSize:13, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {trend.priorityRank}
              </div>
              <div style={{ minWidth:0 }}>
                <div style={{ marginBottom:3 }}>
                  <InfoTooltip
                    trigger={<span style={{ fontSize:11, color:"#000000", fontWeight:700, cursor:"help" }}>{fullTrendType(trend.type)}</span>}
                    title="Trend Classifications" intro={TREND_TYPE_INTRO} items={TREND_TYPE_DEFINITIONS} width={300}
                  />
                </div>
                <div style={{ fontSize:15, fontWeight:800, color:"#0f2644", lineHeight:1.3 }}>{trend.name}</div>
              </div>
            </div>
            <button onClick={() => onClose(null)}
              style={{ width:28, height:28, border:"1px solid #e2e8f0", borderRadius:6, background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="13" height="13" fill="none" stroke="#64748b" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center", marginBottom:10 }}>
            <InfoTooltip
              trigger={<span className={`text-xs font-bold px-2 py-0.5 rounded-lg border cursor-help ${stageColor(trend.stage)}`}>{trend.stage}</span>}
              title="Lifecycle Stages" tableItems={STAGE_DEFINITIONS} width={480}
            />
            <span title={CONFIDENCE_CRITERIA} className={`text-xs font-bold cursor-help ${confidenceColor(trend.confidence)}`}>{trend.confidence} Confidence</span>
          </div>

          <p style={{ fontSize:13, color:"#000000", lineHeight:1.6, marginBottom:10 }}>{trend.definition}</p>
        </div>

        <div style={{ display:"flex", borderBottom:"1px solid #f1f5f9", background:"#fff", flexShrink:0, paddingLeft:8 }}>
          {navItems.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              style={{
                padding:"9px 12px", fontSize:12,
                fontWeight: activeSection===s.id ? 700 : 500,
                color: activeSection===s.id ? "#0f2644" : "#000000",
                background:"none", border:"none",
                borderBottom: activeSection===s.id ? "2px solid #1EDD7D" : "2px solid transparent",
                cursor:"pointer", whiteSpace:"nowrap",
              }}>
              {s.label}
            </button>
          ))}
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"14px 18px", display:"flex", flexDirection:"column", gap:7 }}>

          {activeSection === "evidence" && (<>
            <div style={{ fontSize:15, fontWeight:700, color:"#000000" }}>Evidence Base</div>
            {coreEvidence.map((e,i) => (
              <div key={i} style={{ display:"flex", gap:9, padding:"9px 11px", borderRadius:9, background:"#f8fafc", border:"1px solid #f1f5f9" }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:"#1EDD7D", flexShrink:0, marginTop:5 }}/>
                <p style={{ fontSize:13, color:"#000000", lineHeight:1.6, margin:0 }}>{e}</p>
              </div>
            ))}
            {contradictions.length > 0 && (<>
              <div style={{ fontSize:15, fontWeight:700, color:"#000000", marginTop:8, display:"flex", alignItems:"center", gap:4 }}>Contradictions<InfoTooltip title="Contradictions" text="Points where the evidence or narrative for this trend contains internal tensions — signals that partially conflict with or limit the dominant trajectory." /></div>
              {contradictions.map((c,i) => (
                <div key={i} style={{ display:"flex", gap:9, padding:"9px 11px", borderRadius:9, background:"#fef2f2", border:"1px solid #fecaca" }}>
                  <svg width="9" height="9" fill="none" stroke="#ef4444" strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink:0, marginTop:4 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  <p style={{ fontSize:13, color:"#000000", lineHeight:1.6, margin:0 }}>{c}</p>
                </div>
              ))}
            </>)}
            <div style={{ marginTop:12, paddingTop:10, borderTop:"1px solid #f1f5f9", display:"flex", flexWrap:"wrap", alignItems:"center", gap:5 }}>
              <span style={{ fontSize:12, fontWeight:600, color:"#000000", whiteSpace:"nowrap" }}>Source(s):</span>
              {[
                { label:"Link 1", href:"https://iot-analytics.com" },
                { label:"Link 2", href:"https://ec.europa.eu/horizon" },
                { label:"Link 3", href:"https://gartner.com" },
              ].map((s,i,arr) => (
                <span key={s.label} style={{ display:"flex", alignItems:"center", gap:3 }}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:"#2563eb", fontWeight:500, textDecoration:"none" }}
                    onMouseOver={e => e.target.style.textDecoration="underline"}
                    onMouseOut={e => e.target.style.textDecoration="none"}>{s.label}</a>
                  {i < arr.length-1 && <span style={{ color:"#cbd5e1", fontSize:11 }}>,</span>}
                </span>
              ))}
            </div>
          </>)}

          {activeSection === "drivers" && (<>
            <div style={{ fontSize:15, fontWeight:700, color:"#000000" }}>Structural Drivers</div>
            {structuralDrivers.map((d,i) => (
              <div key={i} style={{ display:"flex", gap:9, padding:"9px 11px", borderRadius:9, background:"#eff6ff", border:"1px solid #bfdbfe" }}>
                <svg width="10" height="10" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink:0, marginTop:4 }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <p style={{ fontSize:13, color:"#1e40af", lineHeight:1.6, margin:0 }}>{d}</p>
              </div>
            ))}
            <div style={{ fontSize:15, fontWeight:700, color:"#000000", marginTop:8 }}>Constraints</div>
            {constraints.map((c,i) => (
              <div key={i} style={{ display:"flex", gap:9, padding:"9px 11px", borderRadius:9, background:"#fffbeb", border:"1px solid #fde68a" }}>
                <svg width="10" height="10" fill="none" stroke="#d97706" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink:0, marginTop:4 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <p style={{ fontSize:13, color:"#92400e", lineHeight:1.6, margin:0 }}>{c}</p>
              </div>
            ))}
          </>)}

          {activeSection === "impact" && (<>
            <div style={{ fontSize:15, fontWeight:700, color:"#000000" }}>Ecosystem Impacts</div>
            {ecosystemImpact.map((e,i) => (
              <div key={i} style={{ display:"flex", gap:9, padding:"9px 11px", borderRadius:9, background:"#f0fdf4", border:"1px solid #bbf7d0" }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:"#1EDD7D", flexShrink:0, marginTop:5 }}/>
                <p style={{ fontSize:13, color:"#0f2644", lineHeight:1.6, margin:0 }}>{e}</p>
              </div>
            ))}
            <div style={{ fontSize:15, fontWeight:700, color:"#000000", marginTop:8 }}>Affected Actors</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
              {affectedActors.map((a,i) => (
                <span key={i} style={{ fontSize:12, padding:"3px 9px", borderRadius:5, border:"1px solid #e2e8f0", background:"#fff", color:"#000000" }}>{a}</span>
              ))}
            </div>
          </>)}

          {activeSection === "implications" && (<>
            <div style={{ fontSize:15, fontWeight:700, color:"#000000" }}>Strategic Implications</div>
            {strategicImplications.map((s,i) => (
              <div key={i} style={{ display:"flex", gap:9, padding:"9px 11px", borderRadius:9, background:"rgba(15,38,68,0.04)", border:"1px solid rgba(15,38,68,0.08)" }}>
                <div style={{ width:18, height:18, borderRadius:"50%", background:"#0f2644", color:"#fff", fontSize:10, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{i+1}</div>
                <p style={{ fontSize:13, color:"#0f2644", lineHeight:1.6, margin:0 }}>{s}</p>
              </div>
            ))}
          </>)}
        </div>

        <div style={{ flexShrink:0, borderTop:"1px solid #f1f5f9", padding:"10px 18px", background:"#f8fafc", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <button
            onClick={() => { if (curIdx > 0) onClose(TRENDS[curIdx-1]); }}
            disabled={curIdx === 0}
            style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:600, color:"#000000", background:"none", border:"none", cursor: curIdx===0 ? "not-allowed":"pointer", opacity: curIdx===0 ? 0.35:1 }}>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>Prev
          </button>
          <span style={{ fontSize:10, color:"#94a3b8", fontWeight:500 }}>{trend.priorityRank} / {TRENDS.length}</span>
          <button
            onClick={() => { if (curIdx < TRENDS.length-1) onClose(TRENDS[curIdx+1]); }}
            disabled={curIdx === TRENDS.length-1}
            style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:600, color:"#000000", background:"none", border:"none", cursor: curIdx===TRENDS.length-1 ? "not-allowed":"pointer", opacity: curIdx===TRENDS.length-1 ? 0.35:1 }}>
            Next<svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TrendIdentificationView() {
  const [tab, setTab] = useState<string>("overview");
  const [sideNav, setSideNav] = useState<number>(0);
  const [drawerTrend, setDrawerTrend] = useState<Trend | null>(null);

  return (
    <div className="flex flex-col h-screen bg-[#f8f9fb] overflow-hidden font-sans" style={{ position:"relative" }}>
      <header className="h-14 flex-shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-5 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0f2644] to-[#1a4a7a] flex items-center justify-center">
              <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 6s4-2 8 0 8 2 8 0"/><path d="M1 12s4-2 8 0 8 2 8 0"/><path d="M1 18s4-2 8 0 8 2 8 0"/></svg>
            </div>
            <div>
              <div className="text-base font-black text-[#0f2644] leading-none">CHESZ</div>
              <div className="text-xs font-medium text-slate-400 leading-none mt-0.5">Market Intelligence Platform</div>
            </div>
          </div>
          <span className="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-[#f0fdf4] border border-[#bbf7d0] text-[#15b865]">Trend Identification</span>
        </div>
        <div className="flex items-center gap-2">
          {["Tour","Help"].map(l => (
            <button key={l} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors">{l}</button>
          ))}
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0f2644] to-[#1a4a7a] flex items-center justify-center text-xs font-extrabold text-white">NT</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[210px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col z-10 overflow-y-auto">
          <nav className="flex-1 p-2.5 flex flex-col gap-0.5">
            {SB_MAIN.map((item, i) => (
              <button key={i} onClick={() => setSideNav(i)}
                className={`flex items-center gap-2.5 py-2 rounded-lg text-xs w-full text-left transition-all border-l-[3px] ${sideNav === i ? "bg-[#f0fdf4] text-[#0f2644] font-semibold border-[#1EDD7D] pl-[9px] pr-3" : "text-slate-400 font-medium border-transparent px-3 hover:bg-slate-50 hover:text-slate-700"}`}>
                <span className={sideNav === i ? "opacity-100" : "opacity-70"}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
            <div className="h-px my-2 mx-2.5 bg-slate-200" />
            {SB_SEC.map((item, i) => (
              <button key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 w-full text-left border-l-[3px] border-transparent hover:bg-slate-50 hover:text-slate-700 transition-all">
                <span className="opacity-70">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-slate-200 flex-shrink-0">
            <div className="rounded-xl p-3 border-[1.5px] border-slate-200 bg-[#f4f6f9]">
              <div className="flex items-center gap-1.5 mb-2">
                <svg width="13" height="13" fill="none" stroke="#10b981" strokeWidth="2.5" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <span className="text-base font-bold text-[#0f2644]">Credits</span>
              </div>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-400">Used</span>
                <span className="text-xs font-semibold text-black">20954/30000</span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden bg-slate-200 mb-1.5">
                <div className="h-full w-[69.8%] rounded-full bg-emerald-400" />
              </div>
              <div className="text-xs text-center font-medium text-slate-400">9046 remaining</div>
            </div>
          </div>
        </aside>

        <div className="flex flex-col flex-1 overflow-hidden min-w-0">
          <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between gap-4 shadow-sm">
            <div className="min-w-0">
              <div className="text-[15px] font-bold text-[#0f2644] truncate">Trend identification for European Industrial IoT Platforms</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {[
                { label:"Share", icon:<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> },
                { label:"Download", icon:<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> },
              ].map(btn => (
                <button key={btn.label} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-colors">{btn.icon}{btn.label}</button>
              ))}
            </div>
          </div>

          <nav className="flex-shrink-0 bg-white border-b border-slate-200 px-6 flex shadow-sm">
            {NAV_TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-5 py-3 flex items-center gap-1.5 text-[13px] font-medium transition-all whitespace-nowrap border-b-[3px] ${tab === t.id ? "text-[#0f2644] border-[#1EDD7D] font-semibold" : "text-black border-transparent hover:text-slate-700"}`}>
                {t.icon}{t.label}
                {t.badge && (
                  <span className={`text-[13px] font-black px-1.5 py-0.5 rounded-full ml-0.5 ${tab === t.id ? "bg-[#1EDD7D] text-[#0f2644]" : "bg-slate-100 text-black"}`}>{t.badge}</span>
                )}
              </button>
            ))}
          </nav>

          <main className="flex-1 overflow-y-auto px-6 py-6">
            {tab === "overview"   && <OverviewTab onGoTab={setTab} onOpenDrawer={setDrawerTrend} />}
            {tab === "signals"    && <SignalsTab />}
            {tab === "trends"     && <TrendsTab onOpenDrawer={setDrawerTrend} />}
            {tab === "evolution"  && <EvolutionTab onOpenDrawer={setDrawerTrend} />}
            {tab === "synthesis"  && <SynthesisTab onOpenDrawer={(t) => { setDrawerTrend(t); }} />}
          </main>
        </div>
      </div>

      {drawerTrend && (
        <TrendDrawer
          trend={drawerTrend}
          onClose={(next) => (next && next.id) ? setDrawerTrend(next) : setDrawerTrend(null)}
        />
      )}
    </div>
  );
}
