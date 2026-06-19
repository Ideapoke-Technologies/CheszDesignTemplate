import { useState } from "react";

// ═══════════════════════════════════════════════════════
// TYPES (as JS constants/comments for JSX)
// ═══════════════════════════════════════════════════════

const SIGNALS = [
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

const TRENDS = [
  {
    id: "TR-01",
    name: "Edge AI, Embedded Intelligence, and Federated IIoT Architectures",
    short: "Edge AI & Federated IIoT",
    type: "Technological",
    stage: "Accelerating",
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
      "Standards convergence is partial — fragmentation risk across sector/country"
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
      "SME inclusion is the next frontier — those enabling SME adoption at scale win the long game",
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
      "Compliance is no longer a competitive advantage — it's a market entry requirement",
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
      "Regional disparities are structural, not cyclical — slow to narrow"
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
  "Regulatory enforcement and standards mandates are synchronized with ecosystem/interoperability development — compliance becomes an architectural baseline.",
  "Edge AI, digital twins, and sustainability/Green Deal objectives converge — digitalization enables both regulatory and decarbonization goals simultaneously.",
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

// ── Helpers ──
const stageColor = (stage) => {
  const map = {
    "Emerging": "bg-purple-50 text-purple-700 border-purple-200",
    "Accelerating": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Mainstreaming": "bg-blue-50 text-blue-700 border-blue-200",
    "Mature": "bg-slate-100 text-slate-600 border-slate-300",
    "Plateauing": "bg-amber-50 text-amber-700 border-amber-200",
    "Fragmenting": "bg-red-50 text-red-700 border-red-200",
  };
  return map[stage] || "bg-slate-100 text-slate-600 border-slate-200";
};

const confidenceColor = (c) => {
  if (c === "High") return "text-emerald-600";
  if (c === "Moderate") return "text-amber-600";
  return "text-red-500";
};

const MomentumIcon = ({ m }) => {
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

const TypeIcon = ({ type }) => {
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

// ── Overview Tab ──
function OverviewTab({ onGoTab }) {
  const highConf = TRENDS.filter(t => t.confidence === "High").length;
  const accelerating = TRENDS.filter(t => t.momentum === "Accelerating").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Trends Identified", value: TRENDS.length, sub: "across 5 types", tab: "trends", icon: <svg width="13" height="13" fill="none" stroke="#1EDD7D" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> },
          { label: "Signals Extracted", value: SIGNALS.length, sub: `${SIGNALS.filter(s=>s.strength==="Strong").length} strong signals`, tab: "signals", icon: <svg width="13" height="13" fill="none" stroke="#1EDD7D" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
          { label: "High Confidence", value: highConf, sub: "multi-layer validated", tab: "trends", icon: <svg width="13" height="13" fill="none" stroke="#1EDD7D" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
          { label: "Accelerating", value: accelerating, sub: "momentum trends", tab: "evolution", icon: <svg width="13" height="13" fill="none" stroke="#1EDD7D" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 3H3v7h18V3z"/><path d="M21 14H3v7h18v-7z"/></svg> },
        ].map(k => (
          <div key={k.label} onClick={() => onGoTab(k.tab)}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all group">
            <div className="text-3xl font-black leading-none text-black">{k.value}</div>
            <div className="text-[13px] font-semibold text-[#0f2644] mt-1">{k.label}</div>
            <div className="flex items-center justify-between mt-0.5">
              <div className="text-xs text-slate-400">{k.sub}</div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">{k.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0f2644] to-[#1a4a7a] flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <div>
            <div className="text-[15px] font-bold text-[#0f2644] mb-1">Executive Summary</div>
            <p className="text-[15px] text-black leading-relaxed">
              Between 2020 and 2030, European Industrial IoT platform competition is defined by five enduring structural shifts. Edge AI and federated architectures are mainstreaming among leading enterprises. Open, sovereign data ecosystems are mandated by binding EU regulation. AI-driven automation and digital twins are now baseline requirements in advanced verticals. Compliance-centric governance has become a market access prerequisite. Persistent SME and regional fragmentation remains the primary constraint on ecosystem-wide convergence.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="text-[15px] font-bold text-[#0f2644]">Trend Prioritization Matrix</div>
          <button onClick={() => onGoTab("trends")} className="text-xs font-semibold text-blue-600 hover:text-blue-800">View all profiles →</button>
        </div>
        <div className="divide-y divide-slate-100">
          {[...TRENDS].sort((a, b) => a.priorityRank - b.priorityRank).map((t) => (
            <div key={t.id} className="px-5 py-3 flex items-center gap-4 hover:bg-slate-50 transition-colors">
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black flex items-center justify-center flex-shrink-0">
                {t.priorityRank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-semibold text-[#0f2644] truncate">{t.name}</div>
                <div className="text-xs text-slate-400">{t.type} · {t.domain}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${stageColor(t.stage)}`}>{t.stage}</span>
                <span className={`text-xs font-bold ${confidenceColor(t.confidence)}`}>{t.confidence === "High" ? "High Confidence" : t.confidence === "Moderate" ? "Moderate Confidence" : t.confidence}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-[15px] font-bold text-[#0f2644] mb-3">Cross-Trend Convergence Patterns</div>
        <div className="space-y-2">
          {CROSS_TREND_PATTERNS.map((p, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <p className="text-[15px] text-black leading-relaxed">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Signals Tab ──
function SignalsTab() {
  const [selectedSignal, setSelectedSignal] = useState(null);
  const strong = SIGNALS.filter(s => s.strength === "Strong");
  const weak = SIGNALS.filter(s => s.strength === "Weak");

  const signalSources = {
    "SIG-01": [{ label:"AIOTI Edge AI Report 2024", href:"https://aioti.eu" }, { label:"EU R&D Funding Database", href:"https://ec.europa.eu" }],
    "SIG-02": [{ label:"EU Interoperable Europe Act", href:"https://eur-lex.europa.eu" }, { label:"Gaia-X Technical Specs", href:"https://gaia-x.eu" }],
    "SIG-03": [{ label:"IoT Analytics IIoT Adoption Study", href:"https://iot-analytics.com" }, { label:"Horizon Europe SME Report", href:"https://ec.europa.eu/horizon" }],
    "SIG-04": [{ label:"IDSA Architecture v4", href:"https://internationaldataspaces.org" }, { label:"Gaia-X Ecosystem Report", href:"https://gaia-x.eu" }],
    "SIG-05": [{ label:"McKinsey SME Fragmentation Index", href:"https://mckinsey.com" }, { label:"Eurostat Digital Economy Report", href:"https://ec.europa.eu/eurostat" }],
  };

  const SignalCard = ({ sig }) => (
    <div onClick={() => setSelectedSignal(sig === selectedSignal ? null : sig)}
      className={`rounded-xl border p-4 cursor-pointer transition-all ${selectedSignal?.id === sig.id ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"}`}>
      <div className="flex items-start gap-3">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${sig.strength === "Strong" ? "bg-emerald-50" : "bg-slate-100"}`}>
          {sig.strength === "Strong"
            ? <svg width="12" height="12" fill="none" stroke="#10b981" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            : <svg width="12" height="12" fill="none" stroke="#94a3b8" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><line x1="12" y1="5" x2="19" y2="12"/><line x1="12" y1="19" x2="19" y2="12"/></svg>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="text-[15px] font-semibold text-[#0f2644] leading-tight">{sig.title}</div>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded border flex-shrink-0 ${sig.confidence === "High" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{sig.confidence}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs text-slate-400">{sig.category}</span>
            <span className="text-slate-200">·</span>
            <span className="text-xs text-slate-400">{sig.timeRange}</span>
            <span className="text-slate-200">·</span>
            <span className="text-xs text-slate-400">{sig.geography}</span>
          </div>
          <p className="text-[13px] text-black mt-2 leading-relaxed line-clamp-2">{sig.description}</p>
          {selectedSignal?.id === sig.id && (
            <div className="mt-3 pt-3 border-t border-slate-200">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Directional Implication</div>
              <p className="text-xs text-slate-600 leading-relaxed">{sig.directionalImplication}</p>
            </div>
          )}
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 flex-wrap" onClick={e => e.stopPropagation()}>
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Source(s):</span>
            {(signalSources[sig.id] || []).map((s, i, arr) => (
              <span key={s.label} className="flex items-center gap-1">
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline">{s.label}</a>
                {i < arr.length - 1 && <span className="text-slate-300 text-xs">,</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0f2644] to-[#1a4a7a] flex items-center justify-center flex-shrink-0">
          <svg width="13" height="13" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <div className="min-w-0">
          <div className="text-[15px] font-bold text-[#0f2644]">Signal Landscape</div>
          <div className="text-[15px] text-black">Market observations from regulatory, technology, and enterprise sources, classified by strength and confidence across European IIoT ecosystems.</div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[15px] font-bold text-[#0f2644]">Strong Signals ({strong.length})</span>
        </div>
        <div className="space-y-3">{strong.map(s => <SignalCard key={s.id} sig={s} />)}</div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-slate-300" />
          <span className="text-[15px] font-bold text-[#0f2644]">Weak Signals ({weak.length})</span>
        </div>
        <div className="space-y-3">{weak.map(s => <SignalCard key={s.id} sig={s} />)}</div>
      </div>
      <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
        <div className="text-[15px] font-bold text-amber-800 mb-3">Signal Gaps Identified</div>
        <ul className="space-y-2">
          {[
            "Lack of peer-reviewed country-level benchmarking of SME IIoT adoption post-2024",
            "Limited case studies on sector-specific implementation models validated at Tier 1 level",
            "Insufficient direct evidence of RISC-V impact on industrial deployments post-2025",
            "Limited longitudinal data on business model evolution and ROI beyond pilots"
          ].map((gap, i) => (
            <li key={i} className="text-sm text-amber-700 flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
              <span>{gap}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── Trends Tab ──
function TrendsTab({ onOpenDrawer }) {

  const cardHighlights = {
    "TR-01": ["Edge AI $36.67B→$59.66B by 2032", "60%+ MFRs building digital twins", "€150M+ EU R&D funding"],
    "TR-02": ["EU Data Act (2025) mandates openness", "IDSA/DSP in >60% of projects", "Gaia-X data spaces live"],
    "TR-03": [">85% firms targeting AI automation", "Digital twin CAGR 39.8%", "20–35%+ cost reduction"],
    "TR-04": ["AI Act, CRA redefining obligations", "Compliance = market entry", "Gaia-X procurement rules"],
    "TR-05": ["Germany 24.6% IIoT share", "SMEs <15% scale IIoT", "6–7M ICT skills gap by 2030"],
  };

  const typeColorMap = {
    "Technological":      { bg:"#eff6ff", text:"#1d4ed8", border:"#bfdbfe" },
    "Regulatory":         { bg:"#f0fdf4", text:"#15803d", border:"#bbf7d0" },
    "Enterprise Adoption":{ bg:"#faf5ff", text:"#7c3aed", border:"#e9d5ff" },
    "Business Model":     { bg:"#fff7ed", text:"#c2410c", border:"#fed7aa" },
    "Ecosystem/Platform": { bg:"#f0f9ff", text:"#0369a1", border:"#bae6fd" },
  };

  const accentBar = (stage) => stage === "Mainstreaming" ? "#3b82f6" : stage === "Accelerating" ? "#1EDD7D" : stage === "Plateauing" ? "#f59e0b" : "#a78bfa";

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0f2644] to-[#1a4a7a] flex items-center justify-center flex-shrink-0">
          <svg width="13" height="13" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
        </div>
        <div className="min-w-0">
          <div className="text-[15px] font-bold text-[#0f2644]">Trend Profiles</div>
          <div className="text-[15px] text-black">Five structural trends shaping European IIoT platform competition from 2020–2030, each profiled by stage, momentum, evidence, and strategic implications.</div>
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
                  <span style={{ fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.08em" }}>{t.id}</span>
                </div>
                <span className={`font-bold px-1.5 py-0.5 rounded border ${stageColor(t.stage)}`} style={{ fontSize:9 }}>{t.stage}</span>
              </div>
              <div style={{ fontSize:13, fontWeight:700, color:"#0f2644", lineHeight:1.35, marginBottom:6 }}>{t.short}</div>
              <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:10, fontWeight:600, padding:"2px 6px", borderRadius:20, border:`1px solid ${tc.border}`, background:tc.bg, color:tc.text, marginBottom:8 }}>
                <TypeIcon type={t.type} />{t.type}
              </span>
              <p style={{ fontSize:12, color:"#64748b", lineHeight:1.5, marginBottom:8, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{t.definition}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:3, marginBottom:8 }}>
                {highlights.map((h,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:5 }}>
                    <div style={{ width:5, height:5, borderRadius:"50%", background:"#1EDD7D", flexShrink:0, marginTop:4 }}/>
                    <span style={{ fontSize:10, color:"#475569", lineHeight:1.4 }}>{h}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:8, borderTop:"1px solid #f1f5f9" }}>
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <MomentumIcon m={t.momentum}/>
                  <span style={{ fontSize:10, color:"#94a3b8" }}>{t.momentum}</span>
                </div>
                <span style={{ fontSize:10, fontWeight:700 }} className={confidenceColor(t.confidence)}>{t.confidence}</span>
              </div>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}

// ── Evolution Tab ──
function EvolutionTab() {
  const YEARS = [2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030];

  const trendPhases = {
    "TR-01": [{ stage:"Emerging",years:[2020,2021]},{ stage:"Accelerating",years:[2022,2023,2024]},{ stage:"Mainstreaming",years:[2025,2026,2027,2028,2029,2030]}],
    "TR-02": [{ stage:"Emerging",years:[2020,2021,2022]},{ stage:"Accelerating",years:[2023,2024,2025,2026]},{ stage:"Mainstreaming",years:[2027,2028,2029,2030]}],
    "TR-03": [{ stage:"Accelerating",years:[2020,2021,2022,2023]},{ stage:"Mainstreaming",years:[2024,2025,2026,2027,2028,2029,2030]}],
    "TR-04": [{ stage:"Emerging",years:[2020,2021,2022]},{ stage:"Accelerating",years:[2023,2024,2025,2026,2027]},{ stage:"Mainstreaming",years:[2028,2029,2030]}],
    "TR-05": [{ stage:"Plateauing",years:[2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030]}],
  };

  const phaseColor = {
    "Emerging":      { bg:"#B3F5D0", label:"#0D5C3A" },
    "Accelerating":  { bg:"#55DFA0", label:"#0D5C3A" },
    "Mainstreaming": { bg:"#1A9B5F", label:"#ffffff" },
    "Mature":        { bg:"#0F7A4E", label:"#ffffff" },
    "Plateauing":    { bg:"#8EEDB8", label:"#0D5C3A" },
    "Fragmenting":   { bg:"#3DD688", label:"#0D5C3A" },
  };

  const getPhaseForYear = (trendId, year) => {
    const phases = trendPhases[trendId] || [];
    for (const p of phases) { if (p.years.includes(year)) return p.stage; }
    return null;
  };

  const phaseMap = {
    "TR-01": [{ start:2020,end:2021,stage:"Emerging",label:"R&D / EU pilots"},{ start:2022,end:2024,stage:"Accelerating",label:"Platform-wide roll-out"},{ start:2025,end:2030,stage:"Mainstreaming",label:"Federated standard"}],
    "TR-02": [{ start:2020,end:2022,stage:"Emerging",label:"Policy formation"},{ start:2023,end:2026,stage:"Accelerating",label:"Data Act / Gaia-X deploy"},{ start:2027,end:2030,stage:"Mainstreaming",label:"Harmonised standards"}],
    "TR-03": [{ start:2020,end:2023,stage:"Accelerating",label:"Large-firm mainstreaming"},{ start:2024,end:2030,stage:"Mainstreaming",label:"85%+ adoption baseline"}],
    "TR-04": [{ start:2020,end:2022,stage:"Emerging",label:"Early governance pilots"},{ start:2023,end:2027,stage:"Accelerating",label:"AI Act / CRA enforcement"},{ start:2028,end:2030,stage:"Mainstreaming",label:"Compliance as baseline"}],
    "TR-05": [{ start:2020,end:2030,stage:"Plateauing",label:"Persistent structural gap"}],
  };

  const milestones = {
    "TR-01": [{year:2022,label:"Pilots scale"},{year:2025,label:"OPC-UA standard"}],
    "TR-02": [{year:2023,label:"Data Act"},{year:2027,label:"Harmonised"}],
    "TR-03": [{year:2024,label:"DT baseline"},{year:2027,label:"85%+ target"}],
    "TR-04": [{year:2024,label:"AI Act live"},{year:2025,label:"CRA binding"}],
    "TR-05": [{year:2026,label:"Gap widens"},{year:2028,label:"Review point"}],
  };

  const phaseStyle = {
    "Emerging":      { bg:"#B3F5D0", border:"#2EC97A", text:"#0D5C3A" },
    "Accelerating":  { bg:"#55DFA0", border:"#0F7A4E", text:"#0D5C3A" },
    "Mainstreaming": { bg:"#1A9B5F", border:"#0D5C3A", text:"#ffffff" },
    "Plateauing":    { bg:"#8EEDB8", border:"#22B26B", text:"#0D5C3A" },
  };

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
      {/* Gantt Chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[15px] font-bold text-[#0f2644]">Trend Maturity Landscape — European IIoT (2020–2030)</div>
            <div className="text-[13px] text-black mt-0.5">Each bar shows the lifecycle stage of a trend per year</div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {Object.entries(phaseColor).slice(0,5).map(([stage,c]) => (
              <div key={stage} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor:c.bg }} />
                <span className="text-xs font-medium text-black">{stage}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex mb-2 pl-[180px]">
          {YEARS.map(y => (
            <div key={y} className="flex-1 text-center">
              <span className={`text-xs font-semibold ${y === 2026 ? "text-orange-500 font-black" : "text-slate-400"}`}>{y}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 relative">
          {TRENDS.map(t => (
            <div key={t.id} className="flex items-center gap-0">
              <div className="w-[180px] flex-shrink-0 flex items-center gap-2 pr-3">
                <div className="w-5 h-5 rounded bg-[#0f2644] text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                  {t.priorityRank}
                </div>
                <span className="text-[13px] font-semibold text-[#0f2644] leading-tight truncate">{t.short}</span>
              </div>
              <div className="flex flex-1 gap-0.5">
                {YEARS.map((y, yi) => {
                  const phase = getPhaseForYear(t.id, y);
                  const nextPhase = YEARS[yi + 1] ? getPhaseForYear(t.id, YEARS[yi + 1]) : null;
                  const roundL = yi === 0 || getPhaseForYear(t.id, YEARS[yi - 1]) !== phase ? "rounded-l-md" : "";
                  const roundR = yi === YEARS.length - 1 || nextPhase !== phase ? "rounded-r-md" : "";
                  return (
                    <div key={y} className={`flex-1 h-9 flex items-center justify-center ${roundL} ${roundR}`}
                      style={{ backgroundColor: phase ? phaseColor[phase]?.bg : "#f1f5f9" }}
                      title={phase ? `${t.short} — ${phase} (${y})` : `${t.short} — No data (${y})`}>
                      {phase && roundL && roundR && (
                        <span className="text-xs font-bold opacity-80" style={{ color: phaseColor[phase]?.label }}>
                          {phase.slice(0,3)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="w-[110px] flex-shrink-0 pl-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${stageColor(t.stage)}`}>{t.stage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Swimlane Roadmap */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-[15px] font-bold text-[#0f2644]">Evolution Trajectory by Trend (2020–2030)</div>
            <div className="text-[13px] text-black mt-0.5">Swimlane roadmap — phases, milestones, and momentum per trend</div>
          </div>
          <div className="flex items-center gap-3">
            {[
              { label:"Emerging",bg:"#ede9fe",border:"#a78bfa" },
              { label:"Accelerating",bg:"#d1fae5",border:"#34d399" },
              { label:"Mainstreaming",bg:"#dbeafe",border:"#60a5fa" },
              { label:"Plateauing",bg:"#fef9c3",border:"#facc15" },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm border" style={{ backgroundColor:l.bg, borderColor:l.border }} />
                <span className="text-xs text-slate-400 font-medium">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5">
          <div className="flex mb-3 ml-[176px]">
            {[2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030].map(y => (
              <div key={y} className="flex-1 text-center">
                <span className="text-xs font-semibold text-slate-400">{y}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4 relative">
            {TRENDS.map(trend => {
              const phases = phaseMap[trend.id] || [];
              const marks = milestones[trend.id] || [];

              return (
                <div key={trend.id}>
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="w-[176px] flex-shrink-0 flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-[#0f2644] text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                        {trend.priorityRank}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-[#0f2644] leading-tight truncate">{trend.short}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MomentumIcon m={trend.momentum} />
                          <span className="text-xs text-slate-400">{trend.momentum}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1" />
                  </div>

                  <div className="flex items-center gap-0 ml-[176px] relative">
                    <div className="flex w-full relative h-9">
                      {phases.map((ph, pi) => {
                        const startIdx = ph.start - 2020;
                        const endIdx   = ph.end   - 2020;
                        const spanCols = endIdx - startIdx + 1;
                        const leftPct  = (startIdx / totalYears) * 100;
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
                        const xPct = ((m.year - 2020) / totalYears) * 100;
                        return (
                          <div key={mi}
                            className="absolute top-0 h-full flex flex-col items-center justify-end pointer-events-none"
                            style={{ left: `${xPct}%`, transform: "translateX(-50%)" }}>
                            <div className="absolute top-0 w-2.5 h-2.5 rounded-full bg-[#0f2644] border-2 border-white shadow-sm" style={{ transform: "translateY(-50%)" }} />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="ml-[176px] relative h-5">
                    {marks.map((m, mi) => {
                      const xPct = ((m.year - 2020) / totalYears) * 100;
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
                    <div className="ml-[176px] h-px bg-slate-100 mt-3" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Future States */}
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
              <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Synthesis Tab ──
function SynthesisTab({ onOpenDrawer }) {
  // Map "Trend 01" etc. to actual TRENDS objects
  const trendLabelMap = {
    "Trend 01": TRENDS.find(t => t.id === "TR-01"),
    "Trend 02": TRENDS.find(t => t.id === "TR-02"),
    "Trend 03": TRENDS.find(t => t.id === "TR-03"),
    "Trend 04": TRENDS.find(t => t.id === "TR-04"),
    "Trend 05": TRENDS.find(t => t.id === "TR-05"),
  };

  const renderLinkedTrends = (linked) => {
    // Handle ranges like "Trend 01 – Trend 05"
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
    // Handle comma-separated like "Trend 01, Trend 02"
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
          <div className="text-[15px] font-bold text-[#0f2644]">Strategic Synthesis</div>
          <div className="text-[15px] text-black">Consolidated takeaways, emerging opportunity areas, and structural risks synthesised across all five trends to guide platform strategy through 2030.</div>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <svg width="15" height="15" fill="none" stroke="#10b981" strokeWidth="2.5" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span className="text-[15px] font-bold text-[#0f2644]">Final Strategic Takeaways</span>
        </div>
        <div className="space-y-3">
          {[
            { rank:1, text:"European IIoT platform competition has fundamentally shifted toward architectures anchored by edge intelligence, data interoperability, and compliance orchestration — validated by regulatory alignment, market evidence, and large-scale platform evolution.", linked:"Trend 01, Trend 02" },
            { rank:2, text:"Policy and standards-driven open/sovereign data strategies are as much a market requirement as a regulatory one; providers must design for compliance, interoperability, and sovereignty by default.", linked:"Trend 02, Trend 04" },
            { rank:3, text:"AI-driven automation, digital twins, and predictive capabilities are converging as default layers in advanced manufacturing systems, but SME and regional inclusion remain urgent imperatives.", linked:"Trend 03, Trend 05" },
            { rank:4, text:"Compliance, governance, and trustworthy ecosystem management have become sector-wide baselines, not premium differentiators; genuine innovation is pivoting to service design and data-centric value within trusted platforms.", linked:"Trend 04" },
            { rank:5, text:"Persistent and potentially widening fragmentation — regional, SME, skills — poses structural risks to ecosystem resilience and pan-European industrial competitiveness; targeted policy and funding will determine the next convergence phase.", linked:"Trend 05" },
            { rank:6, text:"Strategic focus should be on scalable federation, harmonized standards, modular interoperability, SME enablement, and supporting the synchronization of digital and green transitions within compliant, sovereign, and resilient industrial ecosystems.", linked:"Trend 01 – Trend 05" },
          ].map(t => (
            <div key={t.rank} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all">
              <div className="w-6 h-6 rounded-full bg-[#0f2644] text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">{t.rank}</div>
              <div className="flex-1">
                <p className="text-sm text-slate-600 leading-relaxed">{t.text}</p>
                <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-slate-400">Linked to:</span>
                  {renderLinkedTrends(t.linked)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-[15px] font-bold text-[#0f2644] mb-4">Emerging Opportunity Areas</div>
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
        <div className="text-[15px] font-bold text-[#0f2644] mb-4">Major Risks & Uncertainties</div>
        <div className="space-y-2">
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
              <p className="text-sm text-red-700 leading-relaxed">{r}</p>
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
  { id:"signals", label:"Signal Landscape", icon:<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, badge:5 },
  { id:"trends", label:"Trend Profiles", icon:<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>, badge:5 },
  { id:"evolution", label:"Evolution Mapping", icon:<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 3H3v7h18V3z"/><path d="M21 14H3v7h18v-7z"/><line x1="12" y1="10" x2="12" y2="14"/></svg> },
  { id:"synthesis", label:"Strategic Synthesis", icon:<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
];

// ── Trend Drawer (overlay, rendered at root level) ──
function TrendDrawer({ trend, onClose }) {
  const [activeSection, setActiveSection] = useState("evidence");
  const curIdx = TRENDS.findIndex(x => x.id === trend.id);

  const accentBar = (stage) => stage === "Mainstreaming" ? "#3b82f6" : stage === "Accelerating" ? "#1EDD7D" : stage === "Plateauing" ? "#f59e0b" : "#a78bfa";

  // Safe accessors — guard against undefined arrays
  const affectedActors = trend.affectedActors || [];
  const coreEvidence = trend.coreEvidence || [];
  const contradictions = trend.contradictions || [];
  const structuralDrivers = trend.structuralDrivers || [];
  const constraints = trend.constraints || [];
  const ecosystemImpact = trend.ecosystemImpact || [];
  const strategicImplications = trend.strategicImplications || [];

  const navItems = [
    { id:"evidence",     label:"Evidence" },
    { id:"drivers",      label:"Drivers" },
    { id:"impact",       label:"Impact" },
    { id:"implications", label:"Implications" },
  ];

  return (
    <div style={{ position:"absolute", inset:0, zIndex:200, display:"flex" }} onClick={() => onClose(null)}>
      {/* Backdrop */}
      <div style={{ position:"absolute", inset:0, background:"rgba(15,38,68,0.35)", backdropFilter:"blur(2px)" }} />

      {/* Drawer panel — slides in from right */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position:"absolute", top:0, right:0, bottom:0,
          width:700, background:"#fff",
          borderLeft:"1px solid #e2e8f0",
          boxShadow:"-12px 0 40px rgba(0,0,0,0.15)",
          display:"flex", flexDirection:"column", zIndex:201,
        }}>

        {/* Stage accent bar */}
        <div style={{ height:3, background:accentBar(trend.stage), flexShrink:0 }} />

        {/* Header */}
        <div style={{ padding:"16px 20px 14px", borderBottom:"1px solid #f1f5f9", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:10, marginBottom:10 }}>
            <div style={{ display:"flex", gap:10, alignItems:"flex-start", minWidth:0 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:"#0f2644", color:"#fff", fontSize:13, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {trend.priorityRank}
              </div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:10, color:"#94a3b8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:3 }}>{trend.id} · {trend.type}</div>
                <div style={{ fontSize:15, fontWeight:800, color:"#0f2644", lineHeight:1.3 }}>{trend.name}</div>
              </div>
            </div>
            <button onClick={() => onClose(null)}
              style={{ width:28, height:28, border:"1px solid #e2e8f0", borderRadius:6, background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="13" height="13" fill="none" stroke="#64748b" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Badges */}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center", marginBottom:10 }}>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${stageColor(trend.stage)}`}>{trend.stage}</span>
            <span className={`text-xs font-bold ${confidenceColor(trend.confidence)}`}>{trend.confidence} Confidence</span>
          </div>

          {/* Definition */}
          <p style={{ fontSize:13, color:"#64748b", lineHeight:1.6, marginBottom:10 }}>{trend.definition}</p>


        </div>

        {/* Sub-nav */}
        <div style={{ display:"flex", borderBottom:"1px solid #f1f5f9", background:"#fff", flexShrink:0, paddingLeft:8 }}>
          {navItems.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              style={{
                padding:"9px 12px", fontSize:12,
                fontWeight: activeSection===s.id ? 700 : 500,
                color: activeSection===s.id ? "#0f2644" : "#94a3b8",
                background:"none", border:"none",
                borderBottom: activeSection===s.id ? "2px solid #1EDD7D" : "2px solid transparent",
                cursor:"pointer", whiteSpace:"nowrap",
              }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Scrollable body */}
        <div style={{ flex:1, overflowY:"auto", padding:"14px 18px", display:"flex", flexDirection:"column", gap:7 }}>

          {activeSection === "evidence" && (<>
            <div style={{ fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.08em" }}>Evidence Base</div>
            {coreEvidence.map((e,i) => (
              <div key={i} style={{ display:"flex", gap:9, padding:"9px 11px", borderRadius:9, background:"#f8fafc", border:"1px solid #f1f5f9" }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:"#1EDD7D", flexShrink:0, marginTop:5 }}/>
                <p style={{ fontSize:13, color:"#475569", lineHeight:1.6, margin:0 }}>{e}</p>
              </div>
            ))}
            {contradictions.length > 0 && (<>
              <div style={{ fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.08em", marginTop:8 }}>Contradictions</div>
              {contradictions.map((c,i) => (
                <div key={i} style={{ display:"flex", gap:9, padding:"9px 11px", borderRadius:9, background:"#fef2f2", border:"1px solid #fecaca" }}>
                  <svg width="9" height="9" fill="none" stroke="#ef4444" strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink:0, marginTop:4 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  <p style={{ fontSize:13, color:"#b91c1c", lineHeight:1.6, margin:0 }}>{c}</p>
                </div>
              ))}
            </>)}
            <div style={{ marginTop:12, paddingTop:10, borderTop:"1px solid #f1f5f9", display:"flex", flexWrap:"wrap", alignItems:"center", gap:5 }}>
              <span style={{ fontSize:12, fontWeight:600, color:"#94a3b8", whiteSpace:"nowrap" }}>Source(s):</span>
              {[
                { label:"IoT Analytics IIoT Platform Report 2024", href:"https://iot-analytics.com" },
                { label:"EU Horizon Europe Research Findings", href:"https://ec.europa.eu/horizon" },
                { label:"Gartner IIoT Market Evidence Tracker", href:"https://gartner.com" },
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
            <div style={{ fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.08em" }}>Structural Drivers</div>
            {structuralDrivers.map((d,i) => (
              <div key={i} style={{ display:"flex", gap:9, padding:"9px 11px", borderRadius:9, background:"#eff6ff", border:"1px solid #bfdbfe" }}>
                <svg width="10" height="10" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink:0, marginTop:4 }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <p style={{ fontSize:13, color:"#1e40af", lineHeight:1.6, margin:0 }}>{d}</p>
              </div>
            ))}
            <div style={{ fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.08em", marginTop:8 }}>Constraints</div>
            {constraints.map((c,i) => (
              <div key={i} style={{ display:"flex", gap:9, padding:"9px 11px", borderRadius:9, background:"#fffbeb", border:"1px solid #fde68a" }}>
                <svg width="10" height="10" fill="none" stroke="#d97706" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink:0, marginTop:4 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <p style={{ fontSize:13, color:"#92400e", lineHeight:1.6, margin:0 }}>{c}</p>
              </div>
            ))}
            <div style={{ marginTop:12, paddingTop:10, borderTop:"1px solid #f1f5f9", display:"flex", flexWrap:"wrap", alignItems:"center", gap:5 }}>
              <span style={{ fontSize:12, fontWeight:600, color:"#94a3b8", whiteSpace:"nowrap" }}>Source(s):</span>
              {[
                { label:"McKinsey Industry 4.0 Drivers Analysis", href:"https://mckinsey.com" },
                { label:"EU AI Act & Data Act Legislative Text", href:"https://eur-lex.europa.eu" },
                { label:"IDSA Reference Architecture v4", href:"https://internationaldataspaces.org" },
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

          {activeSection === "impact" && (<>
            <div style={{ fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.08em" }}>Ecosystem Impacts</div>
            {ecosystemImpact.map((e,i) => (
              <div key={i} style={{ display:"flex", gap:9, padding:"9px 11px", borderRadius:9, background:"#f0fdf4", border:"1px solid #bbf7d0" }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:"#1EDD7D", flexShrink:0, marginTop:5 }}/>
                <p style={{ fontSize:13, color:"#0f2644", lineHeight:1.6, margin:0 }}>{e}</p>
              </div>
            ))}
            <div style={{ fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.08em", marginTop:8 }}>Affected Actors</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
              {affectedActors.map((a,i) => (
                <span key={i} style={{ fontSize:12, padding:"3px 9px", borderRadius:5, border:"1px solid #e2e8f0", background:"#fff", color:"#475569" }}>{a}</span>
              ))}
            </div>
            <div style={{ marginTop:12, paddingTop:10, borderTop:"1px solid #f1f5f9", display:"flex", flexWrap:"wrap", alignItems:"center", gap:5 }}>
              <span style={{ fontSize:12, fontWeight:600, color:"#94a3b8", whiteSpace:"nowrap" }}>Source(s):</span>
              {[
                { label:"Forrester IIoT Ecosystem Impact Report", href:"https://forrester.com" },
                { label:"Gaia-X Ecosystem Assessment 2024", href:"https://gaia-x.eu" },
                { label:"IDC European Industrial IoT Forecast", href:"https://idc.com" },
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

          {activeSection === "implications" && (<>
            <div style={{ fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.08em" }}>Strategic Implications</div>
            {strategicImplications.map((s,i) => (
              <div key={i} style={{ display:"flex", gap:9, padding:"9px 11px", borderRadius:9, background:"rgba(15,38,68,0.04)", border:"1px solid rgba(15,38,68,0.08)" }}>
                <div style={{ width:18, height:18, borderRadius:"50%", background:"#0f2644", color:"#fff", fontSize:10, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{i+1}</div>
                <p style={{ fontSize:13, color:"#0f2644", lineHeight:1.6, margin:0 }}>{s}</p>
              </div>
            ))}
            <div style={{ marginTop:12, paddingTop:10, borderTop:"1px solid #f1f5f9", display:"flex", flexWrap:"wrap", alignItems:"center", gap:5 }}>
              <span style={{ fontSize:12, fontWeight:600, color:"#94a3b8", whiteSpace:"nowrap" }}>Source(s):</span>
              {[
                { label:"BCG European Platform Strategy Outlook", href:"https://bcg.com" },
                { label:"Deloitte IIoT Strategic Implications 2024", href:"https://deloitte.com" },
                { label:"WEF Future of Industrial Platforms", href:"https://weforum.org" },
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
        </div>

        {/* Footer nav */}
        <div style={{ flexShrink:0, borderTop:"1px solid #f1f5f9", padding:"10px 18px", background:"#f8fafc", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <button
            onClick={() => { if (curIdx > 0) onClose(TRENDS[curIdx-1]); }}
            disabled={curIdx === 0}
            style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:600, color:"#64748b", background:"none", border:"none", cursor: curIdx===0 ? "not-allowed":"pointer", opacity: curIdx===0 ? 0.35:1 }}>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>Prev
          </button>
          <span style={{ fontSize:10, color:"#94a3b8", fontWeight:500 }}>{trend.priorityRank} / {TRENDS.length}</span>
          <button
            onClick={() => { if (curIdx < TRENDS.length-1) onClose(TRENDS[curIdx+1]); }}
            disabled={curIdx === TRENDS.length-1}
            style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:600, color:"#64748b", background:"none", border:"none", cursor: curIdx===TRENDS.length-1 ? "not-allowed":"pointer", opacity: curIdx===TRENDS.length-1 ? 0.35:1 }}>
            Next<svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Root App ──
export default function TrendIdentificationView() {
  const [tab, setTab] = useState("overview");
  const [sideNav, setSideNav] = useState(0);
  const [drawerTrend, setDrawerTrend] = useState(null);

  return (
    <div className="flex flex-col h-screen bg-[#f8f9fb] overflow-hidden font-sans" style={{ position:"relative" }}>
      {/* HEADER */}
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
        {/* SIDEBAR */}
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

        {/* MAIN */}
        <div className="flex flex-col flex-1 overflow-hidden min-w-0">
          {/* Title bar */}
          <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between gap-4 shadow-sm">
            <div className="min-w-0">
              <div className="text-[15px] font-bold text-[#0f2644] truncate">Trend Identification & Evolution Mapping — Industrial IoT Platforms</div>
              <div className="text-[13px] text-black mt-0.5">European IIoT ecosystems, AI-enabled automation, and enterprise interoperability · 2020–2030</div>
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

          {/* Nav tabs */}
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

          {/* Content */}
          <main className="flex-1 overflow-y-auto px-6 py-6">
            {tab === "overview"   && <OverviewTab onGoTab={setTab} />}
            {tab === "signals"    && <SignalsTab />}
            {tab === "trends"     && <TrendsTab onOpenDrawer={setDrawerTrend} />}
            {tab === "evolution"  && <EvolutionTab />}
            {tab === "synthesis"  && <SynthesisTab onOpenDrawer={(t) => { setDrawerTrend(t); }} />}
          </main>
        </div>
      </div>

      {/* Global drawer overlay — renders above everything */}
      {drawerTrend && (
        <TrendDrawer
          trend={drawerTrend}
          onClose={(next) => (next && next.id) ? setDrawerTrend(next) : setDrawerTrend(null)}
        />
      )}
    </div>
  );
}
