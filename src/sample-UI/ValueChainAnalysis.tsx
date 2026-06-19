import { useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

// Issue 13: Rename Intelligence → Power Dynamics
// MainTab updated to reflect rename (keeping key as "power_dynamics" for routing)
type MainTab = "overview" | "chainmap" | "companies" | "power_dynamics" | "opportunities";
type IntelSub = "concentration" | "shifts";
type ChainMapSub = "diagram" | "explorer";
type Conc = "high" | "moderate" | "low";
type Margin = "increasing" | "stable" | "decreasing";

// ─── Terminology tooltips ────────────────────────────────────────────────────
const TERMS: Record<string, string> = {
  concentration_high: "A small number of participants hold durable structural advantages (proprietary technology, environmental permits, geographic concentration, or long qualification timelines) that prevent new entrants from competing on equal terms in the short to medium term.",
  concentration_moderate: "Meaningful barriers exist, such as compliance requirements, capital investment, or operational complexity, but the number of qualified participants is not so restricted that any single player holds decisive structural control.",
  concentration_low: "Entry barriers are primarily compliance or outreach capacity rather than proprietary technology or heavy fixed assets. Multiple participants can operate without durable control by any single player. Low concentration does not mean the stage is unimportant.",
  margin_increasing: "Margin levels at this stage are growing. Participants are capturing more value per unit than in the prior period. Note: 'increasing' means margins are going UP, not that there is increasing pressure on margins.",
  margin_stable: "Margin levels are broadly unchanged. Structural barriers are holding without clear upward or downward movement.",
  margin_decreasing: "Margins are compressing. Participants are capturing less value per unit than in the prior period. Can co-exist with high concentration if input costs rise faster than output prices.",
  end_to_end_player: "A company that actively operates across three or more stages of the battery recycling chain — for example, running both a collection network and a hydrometallurgical refinery. These players hold the most structural control because they own the full material flow from waste battery to refined output.",
  operator_or_owner: "A company that owns and runs the physical facilities at this stage — shredding lines, smelters, refineries, collection centres. This is the most common role. At capital-intensive stages like Metallurgy and Refining, operators hold pricing power because capacity is scarce and hard to replicate.",
  platform_or_software_layer: "A company that provides the digital infrastructure for this stage rather than owning physical processing capacity. In battery recycling, this typically means an EPR compliance portal or marketplace connecting producers with recyclers — essential for regulatory compliance but not a physical transformer of material.",
  service_integrator: "A company that assembles a service using capacity owned by others — for example, a logistics and compliance integrator that arranges collection, dismantling, and documentation without owning each facility. Useful for clients but structurally dependent on the operators it bundles.",
  input_provider: "A company whose primary role is supplying material or components into this stage from elsewhere in the chain or from outside it. For example, an OEM providing end-of-life battery packs to the Collection stage, or a catalyst supplier entering the Metallurgy stage. They enable activity but do not operate the stage itself.",
  tier_leading: "Dominant or well-established presence with significant volume, capability, or market share in the specified geography. Multiple verifiable sources confirm active operation at scale.",
  tier_emerging: "Newer, growing, or recently entered participant with substantive but not yet dominant presence. Emerging does not mean small. A large company entering a new stage may be classified as emerging.",
  substitution_high: "Substitution requires new qualifications, process recalibration, capital investment, or regulatory approval. The downstream stage cannot function normally on alternative inputs without material delay or cost.",
  substitution_medium: "Alternative inputs or suppliers exist but switching introduces meaningful delay, re-sorting cost, or compliance burden.",
  substitution_low: "Alternative inputs or suppliers are available and switching can be accomplished without material delay or process impact.",
  chokepoint: "A position where limited players control access for the broader chain, and substitution is constrained by qualification, IP, geography, or capital requirements. A chokepoint is defined by structural control, not by revenue size or company reputation.",
  severity_High: "Disruption at this chokepoint would significantly constrain multiple downstream stages or prevent the chain from producing its primary output. Substitution is structurally impossible in the short term.",
  severity_Medium: "Disruption would cause meaningful but manageable impact. Downstream stages could continue with reduced efficiency, delayed timelines, or higher cost.",
  structural_dependency: "A stage-to-stage relationship where disruption in one stage materially affects the downstream stage's ability to function, and substitution of the specific input is difficult or impossible.",
  vertical_integration: "A named company moves to own or control stages it previously sourced from other participants. Must be evidenced by a verifiable acquisition, facility announcement, or confirmed investment, not just stated intent.",
  stage_compression: "A technology or process change is collapsing two previously distinct stages into one. The boundary that justified the separation is becoming less operationally meaningful for at least some participants.",
  disintermediation: "One or more participant types are being structurally bypassed or eliminated from the chain. Distinct from competitive displacement. Disintermediation means a participant TYPE is removed from the structure, not just losing market share.",
  regulatory_restructuring: "A policy change, regulatory enactment, or enforcement action altering who can participate in a stage, under what conditions, and at what compliance cost. Includes both enabling and constraining regulations.",
  end_market_power_shift: "A change in where buying power, specification-setting authority, or pricing control sits in relation to the chain. End-market power shifts often precede vertical integration by the newly empowered player.",
  impact_High: "The shift is changing who can participate in the chain, what the stage boundaries look like, or where structural power sits: in ways that affect all participants, not just the named entities.",
  impact_Medium: "The shift creates meaningful change in one or two stages but does not fundamentally restructure the chain.",
  direction_upstream: "The shift moves control, activity, or value toward earlier stages in the chain (e.g. a refiner integrating into metallurgical recovery = upstream).",
  direction_downstream: "The shift moves control, activity, or value toward later stages in the chain (e.g. a recycler entering the refined materials market = downstream).",
  direction_lateral: "The shift affects all stages simultaneously without directional movement along the chain. Lateral does not mean less significant: a regulatory change affecting every stage may be the highest-impact shift.",
  chokepoint_adjacency: "A position adjacent to a confirmed chokepoint where a player could offer alternatives, improve input quality into the chokepoint, or reduce dependence on the chokepoint's output, without needing to replicate the chokepoint itself.",
  transition_gap: "The handoff between two stages is inefficient, poorly served, or bottlenecked, creating friction and cost for participants on both sides. Often visible as a participant density drop between adjacent stages.",
  commoditisation_escape: "A stage under increasing margin pressure where differentiation on quality, traceability, certification, or service level could command a premium above the commodity baseline.",
  stage_gap: "A stage with fewer named participants than its structural features would predict, with no single structural reason (capital, IP, regulation) fully explaining the gap.",
  shift_created_opening: "A structural shift is reorganising the chain in a way that creates a gap before the new structure is locked in. Incumbents are adjusting; the new position is not yet claimed.",
  differentiation: "Offering something the stage currently lacks (a technical capability, quality grade, certification, or service level) that allows a player to command premium positioning above the existing commodity baseline.",
  integration: "Spanning two or more stages to capture transition value that currently dissipates between them. Most powerful when a structural dependency exists and the current handoff is poorly served.",
  early_positioning: "Establishing presence, certifications, supply relationships, or OEM qualifications before competition for that position intensifies. Opportunity is time-bounded by the pace of market formalisation.",
  geographic_advantage: "Offering domestically proximate supply or processing for a stage currently dominated by distant geographies. The advantage is proximity, not capability differentiation.",
  relationship_type: "The specific commercial or technical nature of the partnership, for example an offtake agreement, technology licensing deal, JV, EPR mandate, or supply agreement. Distinct from a generic 'partnership'.",
  known_transactions: "Publicly disclosed deal details including volume, value, duration, or date. Null where deal terms are not publicly disclosed.",
  what_they_exchange: "What each party provides and receives in the relationship, meaning the specific material, service, capital, or access being exchanged.",
  stage_impact: "How this specific structural shift affects activity, participants, and economics at this particular stage, not the general significance of the shift.",
  entity_type_corporation: "A private or publicly listed company with commercial operations.",
  entity_type_startup: "A recently formed company, typically early-stage, venture-backed or bootstrapped, without a long operational track record in the domain.",
  company_size_large: "Typically 1,000+ employees or publicly listed with substantial revenue and multi-geography operations.",
  company_size_sme: "Typically 100 to 999 employees or equivalent revenue scale; established but not yet a large enterprise.",
  company_size_startup: "Typically fewer than 100 employees or pre-revenue to early-revenue stage.",
  analytical_confidence_high: "Opportunity traces to multiple specific evidence sources (a participant count, a chokepoint or dependency, and a structural shift) and the key conditions are structural constraints that are clearly testable without requiring unconfirmed assumptions.",
  analytical_confidence_medium: "Opportunity traces to one or two specific evidence sources, or one or more key conditions depends on an assumption not fully evidenced in the chain data. The directional signal is real but not yet locked by converging evidence.",
  analytical_confidence_low: "Opportunity is plausible from the chain structure but key evidence is indirect, single-sourced, or highly conditional on outcomes such as regulatory decisions or market behaviours not yet confirmed in the data.",
  severity_Low: "Disruption at this position would have limited impact on the chain's ability to function. Substitutes are available and the constraint can be resolved without significant delay or cost.",
  impact_Low: "The shift affects one stage in a narrow way that does not restructure participant roles, stage boundaries, or the chain's economic logic.",
};

// ─── Lookups ──────────────────────────────────────────────────────────────────
const STAGE_NAME: Record<string, string> = {
  s_01: "Battery Collection & Aggregation", s_02: "Battery Dismantling & Discharging",
  s_03: "Pre-treatment & Mechanical Processing", s_04: "Metallurgical Recovery",
  s_05: "Material Refining & Purification",
};
const STAGE_SHORT: Record<string, string> = {
  s_01:"Collection", s_02:"Dismantling", s_03:"Pre-treatment", s_04:"Metallurgy", s_05:"Refining",
};
const ROLE_NAME: Record<string,string> = {
  end_to_end_player:"End-to-End Player", operator_or_owner:"Operator / Owner",
  platform_or_software_layer:"Platform / Software", service_integrator:"Service Integrator",
  input_provider:"Input Provider",
};
const ROLE_CLR: Record<string,{bg:string;text:string;border:string;dot:string}> = {
  end_to_end_player:        {bg:"bg-purple-50",text:"text-purple-700",border:"border-purple-200",dot:"bg-purple-400"},
  operator_or_owner:        {bg:"bg-blue-50",  text:"text-blue-700",  border:"border-blue-200",  dot:"bg-blue-400"},
  platform_or_software_layer:{bg:"bg-cyan-50", text:"text-cyan-700",  border:"border-cyan-200",  dot:"bg-cyan-400"},
  service_integrator:       {bg:"bg-amber-50", text:"text-amber-700", border:"border-amber-200", dot:"bg-amber-400"},
  input_provider:           {bg:"bg-green-50", text:"text-green-700", border:"border-green-200", dot:"bg-green-400"},
};
const MARGIN_ICON: Record<Margin,string> = {increasing:"▲",stable:"▬",decreasing:"▼"};
const SHIFT_CLR: Record<string,{bg:string;text:string;border:string;accent:string}> = {
  vertical_integration:     {bg:"bg-purple-50", text:"text-purple-700", border:"border-purple-200", accent:"#7C5FD4"},
  stage_compression:        {bg:"bg-cyan-50",   text:"text-cyan-700",   border:"border-cyan-200",   accent:"#0CB8C8"},
  disintermediation:        {bg:"bg-red-50",    text:"text-red-700",    border:"border-red-200",    accent:"#E84E3A"},
  regulatory_restructuring: {bg:"bg-amber-50",  text:"text-amber-700",  border:"border-amber-200",  accent:"#E8A835"},
  end_market_power_shift:   {bg:"bg-blue-50",   text:"text-blue-700",   border:"border-blue-200",   accent:"#2C7BE5"},
};
const SHIFT_LABEL: Record<string,string> = {
  vertical_integration:"Vertical Integration", stage_compression:"Stage Compression",
  disintermediation:"Disintermediation", regulatory_restructuring:"Regulatory Restructuring",
  end_market_power_shift:"End-Market Power Shift",
};
const OPP_TYPE_LABEL: Record<string,string> = {
  commoditisation_escape:"Commoditisation Escape", transition_gap:"Transition Gap",
  chokepoint_adjacency:"Chokepoint Adjacency", shift_created_opening:"Shift-Created Opening",
  stage_gap:"Stage Gap",
};
const ENTRY_LABEL: Record<string,string> = {
  differentiation:"Differentiation", integration:"Integration",
  early_positioning:"Early Positioning", geographic_advantage:"Geographic Advantage",
};
// ─── Data ─────────────────────────────────────────────────────────────────────
const STAGES = [
  {id:"s_01",name:"Battery Collection & Aggregation",short:"Collection",conc:"low" as Conc,margin:"increasing" as Margin,count:20,fn:"Gathering spent batteries from consumers, businesses, and collection points. Batteries are logged, sorted by chemistry and condition, and accumulated into traceable bulk consignments for EPR compliance.",inputs:"Spent batteries from households, enterprises, vehicle service centres, EV OEM take-back programmes, and informal collectors.",outputs:"Bulked, chemistry-classified lots with regulatory tracking documentation and hazardous waste manifests.",features:"Entry barriers driven by compliance and outreach capacity rather than technology or capital. EPR portal registration formalising what counts as compliant feedstock: the shift toward traceable supply is creating structural differentiation within this stage."},
  {id:"s_02",name:"Battery Dismantling & Discharging",short:"Dismantling",conc:"moderate" as Conc,margin:"stable" as Margin,count:15,fn:"Battery lots are safely discharged to eliminate residual charge. Operators remove enclosures and non-electrochemical components, extracting naked cells or modules and separating hazardous substances for secure handling.",inputs:"Bulked batteries including casings, busbars, BMS electronics, and active cells with residual charge.",outputs:"Discharged and dismantled cells, separated casings, busbars, safely contained hazardous subcomponents including electrolyte residues.",features:"Requires skilled labor, specialised safety protocols, and semi-automated tools to manage diverse battery form factors under regulatory scrutiny. Moderate switching costs from process complexity and environmental permit requirements mean authorised operators hold meaningful pricing protection."},
  {id:"s_03",name:"Pre-treatment & Mechanical Processing",short:"Pre-treatment",conc:"high" as Conc,margin:"stable" as Margin,count:10,fn:"Cells undergo mechanical shredding in inert-atmosphere environments. Physical separation via magnetic, density, and size-based sorting isolates black mass, metal foils, and plastics into distinct recoverable streams.",inputs:"Discharged and dismantled battery cells and modules with casings and electronics removed.",outputs:"Black mass rich in Li/Co/Ni/Mn; separated aluminium and copper foils; sorted plastics and electrolyte fractions.",features:"Capital-intensive, requiring industrial shredders, inert-atmosphere separators, dust filtration, and fire suppression. Separation quality directly determines downstream recovery yields; only two operators produce specification-grade Li-ion black mass at commercial scale in India."},
  {id:"s_04",name:"Metallurgical Recovery",short:"Metallurgy",conc:"high" as Conc,margin:"decreasing" as Margin,count:9,fn:"Black mass undergoes chemical leaching, solvent extraction, and selective precipitation (hydromet) or high-temperature smelting (pyromet). Critical metals extracted into technical-grade lithium carbonate, cobalt sulfate, nickel sulfate, and manganese compounds.",inputs:"Black mass containing cathode active materials (NMC, LFP, NCA) and anode graphite; separated Al and Cu foils from mechanical processing.",outputs:"Technical-grade lithium carbonate, cobalt sulfate, nickel sulfate, manganese compounds; process residues including slag and neutralised effluent.",features:"Highest technical and environmental barriers in the chain, spanning proprietary leaching IP, advanced effluent treatment, and complex multi-agency permits. Only Attero and Lohum operate proprietary Li-ion hydrometallurgical lines at commercial scale in India."},
  {id:"s_05",name:"Material Refining & Purification",short:"Refining",conc:"high" as Conc,margin:"decreasing" as Margin,count:9,fn:"Technical-grade metal salts processed through crystallisation, ion exchange, or solvent polishing to achieve battery-grade purity (≥99.5% for Li₂CO₃). Certified materials quality-assured against OEM specifications and documented for EPR traceability.",inputs:"Technical-grade Li₂CO₃, CoSO₄, NiSO₄, and MnSO₄ from metallurgical recovery.",outputs:"Battery-grade Li₂CO₃ (≥99.5%), CoSO₄ (≥21% Co), NiSO₄ (≥22% Ni) certified to OEM specifications with EPR traceability documentation.",features:"Stringent in-line process control and extensive QA infrastructure required. OEM qualification timelines of 12 to 24 months and strong IP in purification chemistry create durable barriers; recycled-content mandates from FY 2027-28 will guarantee structured demand for certified refiners."},
];

// Per-stage rationale for the Concentration & Margin Map:
// WHY each stage carries its concentration reading, and WHY its margins are moving that way.
const STAGE_RATIONALE: Record<string,{conc:string;margin:string}> = {
  s_01:{
    conc:"20 firms operate here; entry barriers are EPR compliance and collection reach, not proprietary technology or heavy capital, so no single player controls access.",
    margin:"Margins are rising as CPCB portal compliance creates a premium for traceable, chemistry-sorted feedstock over undifferentiated collection volumes.",
  },
  s_02:{
    conc:"Safety protocols, skilled labour, and environmental permits raise the bar, but qualified operators are numerous enough that none holds decisive structural control.",
    margin:"Process complexity and permit requirements give authorised operators steady pricing protection, holding margins flat with no clear upward or downward pressure.",
  },
  s_03:{
    conc:"Capital-intensive inert-atmosphere shredding and permitting mean only two operators produce specification-grade Li-ion black mass at scale, despite 10 firms present.",
    margin:"Scarce specification-grade capacity keeps pricing firm; high barriers prevent new supply from compressing margins for now.",
  },
  s_04:{
    conc:"Proprietary leaching IP, effluent treatment, and multi-agency permits form the chain's steepest barriers — only Attero and Lohum run Li-ion hydrometallurgy at commercial scale.",
    margin:"Margins are compressing as reagent and input costs and competition for black mass rise faster than output prices, even with concentration high.",
  },
  s_05:{
    conc:"12–24 month OEM qualification and purification-chemistry IP make certified suppliers hard to replace; only two domestic operators are qualified at battery grade.",
    margin:"Commodity-priced metal-salt output and pressure from established lead refiners squeeze per-unit value despite the small qualified field.",
  },
};

// Participants with enhanced function_in_stage (2-3 sentences)
const PARTICIPANTS: Record<string,{n:string;role:string;tier:string;fn:string;hq:string;sp:string[]|null}[]> = {
  s_01:[
    {n:"Attero Recycling",role:"end_to_end_player",tier:"leading",fn:"Operates a branded nationwide collection network for spent batteries including consumer, commercial, and automotive sources, supported by a digital tracking platform for CPCB EPR compliance. The collection infrastructure is integrated into its processing operations at Roorkee: collected batteries are directly inducted into its own dismantling and processing lines. Delivers chemistry-classified, portal-documented bulk lots with hazardous waste manifests to its authorised processing facility.",hq:"India",sp:["s_01","s_02","s_03","s_04","s_05"]},
    {n:"Lohum Cleantech",role:"end_to_end_player",tier:"leading",fn:"Operates dedicated battery collection partnerships with EV OEMs, fleet operators, and urban aggregators, sorting and staging spent batteries at intake facilities before transferring to its Greater Noida processing campus. Collection is tightly integrated with its second-life battery assessment activity: spent packs are evaluated for reuse potential before being routed to recycling. Receives diverse chemistries from OEM and fleet partners and delivers chemistry-segregated lots with EPR documentation.",hq:"India",sp:["s_01","s_02","s_03","s_04","s_05"]},
    {n:"Recykal",role:"platform_or_software_layer",tier:"emerging",fn:"Provides a cloud-based digital EPR compliance marketplace connecting 650+ registered producers with 100+ verified recyclers, enabling traceable battery collection and EPR credit generation without owning physical collection infrastructure. The Battery Waste Management module generates CPCB portal-compatible documentation at each collection touchpoint, automating compliance reporting. Receives producer EPR obligation data and delivers verified EPR certificates and compliance documentation.",hq:"India",sp:null},
    {n:"Karo Sambhav",role:"service_integrator",tier:"leading",fn:"Operates as a CPCB-registered Producer Responsibility Organisation, managing EPR compliance obligations for battery and electronics producers by coordinating collection, documentation, and recycler handoff. Integrates multiple field partners to fulfil producer EPR return targets. Delivers CPCB-portal-validated EPR certificates to its producer clients.",hq:"India",sp:null},
    {n:"Ecoreco",role:"operator_or_owner",tier:"leading",fn:"Operates a nationwide reverse logistics and aggregation network under its Book My Junk brand, collecting spent batteries from households, enterprises, and institutional generators across 20+ Indian states. Registered as an authorised e-waste and battery recycler under CPCB and generates EPR compliance documentation for producers. Delivers aggregated, partially classified battery lots with hazardous waste manifests to authorised dismantlers.",hq:"India",sp:null},
    {n:"BatteryWale",role:"operator_or_owner",tier:"emerging",fn:"Operates consumer-facing and B2B battery collection centres in Delhi-NCR, purchasing and aggregating end-of-life automotive, industrial, and consumer batteries from service centres and dealers. Focuses on lead-acid battery scrap with growing lithium-ion intake as EV penetration increases. Delivers sorted battery lots to authorised recyclers and secondary lead smelters.",hq:"India",sp:null},
    {n:"Hulladek Recycling",role:"operator_or_owner",tier:"emerging",fn:"Runs urban micro-collection events and fixed drop-off points in Kolkata and West Bengal targeting household battery and electronic waste, positioning as a last-mile operator in underserved urban markets. CPCB-registered and provides EPR compliance documentation. Delivers aggregated lots to larger authorised recyclers for downstream processing.",hq:"India",sp:null},
    {n:"Exigo Recycling",role:"operator_or_owner",tier:"emerging",fn:"Operates authorised e-waste and battery collection facilities in South and West India, serving corporate and institutional clients requiring bulk battery disposal with CPCB-compliant documentation. Provides end-to-end logistics including pickup, sorting, and documentation. Delivers chemistry-classified consignments to downstream authorised processors.",hq:"India",sp:null},
    {n:"Gem Enviro",role:"operator_or_owner",tier:"emerging",fn:"Provides authorised battery and e-waste collection services to EPR-obligated producers and corporate clients across North and Central India. Operates under CPCB registration and generates EPR-linked compliance documentation. Delivers sorted, documented battery consignments to downstream processing partners.",hq:"India",sp:null},
    {n:"Trishyiraya Recycling",role:"operator_or_owner",tier:"emerging",fn:"Operates a CPCB-authorised e-waste and battery recycling facility in South India serving corporate and government institutional clients for battery disposal compliance. Manages collection logistics and initial sorting at its registered facility. Delivers sorted battery fractions for onward downstream processing.",hq:"India",sp:null},
    {n:"E-Parisaraa",role:"operator_or_owner",tier:"leading",fn:"Operates one of India's oldest CPCB-authorised e-waste and battery collection facilities in Bengaluru, serving corporate, government, and consumer clients across South India. Facility holds authorisation across multiple waste categories including batteries. Delivers sorted battery lots with CPCB documentation to downstream processors.",hq:"India",sp:null},
    {n:"Saahas Zero Waste",role:"service_integrator",tier:"emerging",fn:"Provides integrated waste management and EPR compliance services to corporate clients in South India, including battery collection coordination as part of its broader workplace waste management offering. Coordinates field collection partners to fulfil clients' battery EPR obligations. Transfers compliant battery volumes to authorised recyclers.",hq:"India",sp:null},
    {n:"PEC Ltd",role:"service_integrator",tier:"emerging",fn:"Operates as a registered EPR entity managing battery and electronics waste collection compliance for producers, coordinating logistics between take-back programmes and authorised recyclers. Integrates multiple collection operators under a single EPR compliance umbrella. Delivers verified EPR collection and recycling certificates to producers.",hq:"India",sp:null},
    {n:"Cerebra Integrated",role:"operator_or_owner",tier:"emerging",fn:"Operates authorised e-waste and battery collection facilities under its Cerebra Recycling brand, providing collection services to corporate clients and EPR-obligated producers across multiple states. Manages collection logistics and documentation under CPCB registration. Delivers sorted battery lots to downstream processors.",hq:"India",sp:null},
    {n:"Zigma Global",role:"operator_or_owner",tier:"emerging",fn:"Provides CPCB-registered battery and e-waste collection and initial processing in Tamil Nadu and South India, serving industrial and commercial clients for battery disposal compliance. Manages collection logistics and first-level sorting. Delivers sorted battery lots with documentation to authorised downstream processors.",hq:"India",sp:null},
    {n:"Exide Industries",role:"operator_or_owner",tier:"leading",fn:"Operates a dealer-network-linked take-back programme for spent lead-acid batteries across its national dealer and distribution infrastructure, accepting customer returns under EPR obligations. Coordinates with authorised recyclers for downstream processing of collected batteries. Delivers aggregated spent lead-acid lots to recycling partners for lead recovery.",hq:"India",sp:null},
    {n:"Amara Raja Batteries",role:"operator_or_owner",tier:"leading",fn:"Operates a battery take-back programme through its national dealer network and through the Amara Raja Recycling subsidiary, recovering spent lead-acid batteries from the automotive and industrial market. Collection programme serves as feedstock security for its integrated lead recycling operation. Delivers collected volumes to Amara Raja Recycling for downstream processing.",hq:"India",sp:null},
    {n:"Ola Electric",role:"operator_or_owner",tier:"emerging",fn:"Operates an in-house battery take-back programme for end-of-life lithium-ion packs from its EV scooter customer base, coordinated through its 400+ service centre network under EPR obligations. Programme is developing routing to authorised battery recyclers as the fleet ages into significant disposal volumes. Delivers spent lithium-ion battery packs to authorised recycling partners.",hq:"India",sp:null},
    {n:"Ash Recyclers",role:"operator_or_owner",tier:"emerging",fn:"Provides battery and electronics waste collection in Delhi-NCR targeting small commercial generators, workshops, and individual consumers requiring compliant disposal without large-volume minimums. Focuses on the underserved small-generator segment. Consolidates small-volume battery waste for transfer to authorised downstream recyclers.",hq:"India",sp:null},
    {n:"Cleantech Infra",role:"operator_or_owner",tier:"emerging",fn:"Operates urban battery and e-waste micro-aggregation infrastructure in tier-1 Indian cities, providing last-mile collection infrastructure for consumers and small businesses. Focuses on convenience-driven collection in residential and commercial urban settings. Aggregates consumer battery waste for transfer to authorised recyclers.",hq:"India",sp:null},
  ],
  s_02:[
    {n:"Attero Recycling",role:"end_to_end_player",tier:"leading",fn:"Operates authorised battery dismantling and discharging lines at Roorkee, applying controlled discharge to below 2V per cell before mechanical disassembly of pack enclosures and extraction of cell modules, busbars, and BMS electronics. Holds CPCB and Uttarakhand SPCB authorisation for hazardous battery waste processing with integrated effluent management. Delivers discharged, disassembled cell fractions and staged hazardous subcomponents to its on-site pre-treatment lines.",hq:"India",sp:["s_01","s_02","s_03","s_04","s_05"]},
    {n:"Lohum Cleantech",role:"end_to_end_player",tier:"leading",fn:"Runs in-house battery discharging and pack-level dismantling at Greater Noida campus, using semi-automated tools to disassemble various EV and energy storage battery form factors and safely isolate hazardous electrolyte residues. Capability spans pouch, prismatic, and cylindrical cell formats. Delivers safely discharged cell modules and separated components to its adjacent pre-treatment operations.",hq:"India",sp:["s_01","s_02","s_03","s_04","s_05"]},
    {n:"Ecoreco",role:"operator_or_owner",tier:"leading",fn:"Operates battery dismantling and discharging at its Maharashtra processing facility under CPCB and Maharashtra SPCB authorisation, processing incoming battery lots through discharge and mechanical disassembly. Facility processes both lead-acid and lithium-ion chemistries with safe hazardous waste handling. Delivers dismantled cell fractions to downstream processing partners.",hq:"India",sp:null},
    {n:"E-Parisaraa",role:"operator_or_owner",tier:"leading",fn:"Conducts manual battery dismantling and discharging at its CPCB-authorised Bengaluru facility, operating under Karnataka SPCB environmental consent with documented procedures for both lithium-ion and lead-acid chemistries. One of South India's most experienced authorised battery processors since 2005. Delivers dismantled fractions to downstream processors.",hq:"India",sp:null},
    {n:"Gravita India",role:"operator_or_owner",tier:"leading",fn:"Operates dedicated lead-acid battery breaking and discharging lines at Jaipur and Mundra, processing high volumes through automated breaking equipment, acid draining, and polypropylene separation as input to its smelting operations. Processes over 100,000 MTPA of battery scrap equivalent across facilities. Delivers lead paste, polypropylene casings, and acid to mechanical processing and smelting.",hq:"India",sp:["s_02","s_03","s_04","s_05"]},
    {n:"Nile Ltd",role:"operator_or_owner",tier:"leading",fn:"Runs lead-acid battery breaking, draining, and fraction separation at its Chennai facility as primary input to its secondary lead smelting business. Operation includes sulphuric acid recovery and polypropylene separation. Delivers lead paste, separated polypropylene, and drained acid to downstream crushing and smelting operations.",hq:"India",sp:["s_02","s_03","s_04","s_05"]},
    {n:"Amara Raja Recycling",role:"operator_or_owner",tier:"leading",fn:"Operates dedicated lead-acid battery dismantling at Tirupati as the integrated input step for its secondary lead smelting, served by a well-established dealer return network. Facility processes batteries from Amara Raja's own dealer network and from third-party aggregators. Delivers lead paste and separated polypropylene to its downstream smelting operations.",hq:"India",sp:["s_02","s_03","s_04","s_05"]},
    {n:"Trishyiraya Recycling",role:"operator_or_owner",tier:"emerging",fn:"Performs battery discharging and dismantling at its South India facility under CPCB authorisation as part of an integrated e-waste and battery processing operation. Handles lithium-ion and lead-acid chemistries for corporate and government clients. Delivers dismantled cell fractions to downstream processors.",hq:"India",sp:null},
    {n:"Exigo Recycling",role:"operator_or_owner",tier:"emerging",fn:"Conducts manual battery discharging and disassembly at authorised facilities in South and West India, processing battery lots from institutional clients before transfer to downstream processors. Covers consumer and light commercial battery form factors. Delivers dismantled fractions to authorised recyclers.",hq:"India",sp:null},
    {n:"Gem Enviro",role:"operator_or_owner",tier:"emerging",fn:"Operates battery dismantling and initial fraction separation at its registered facility, bridging its collection and logistics function with downstream processors it does not own. Delivers separated battery fractions to downstream authorised processors.",hq:"India",sp:null},
    {n:"Cerebra Integrated",role:"operator_or_owner",tier:"emerging",fn:"Operates battery dismantling at its Cerebra Recycling facilities as part of an authorised e-waste and battery service across multiple states. Provides discharge and disassembly for corporate clients. Delivers dismantled fractions to downstream partners.",hq:"India",sp:null},
    {n:"Zigma Global",role:"operator_or_owner",tier:"emerging",fn:"Provides authorised battery dismantling and discharging at its Tamil Nadu facility for South Indian industrial clients. Processes lead-acid and lithium-ion batteries under CPCB registration. Delivers dismantled fractions to downstream processors.",hq:"India",sp:null},
    {n:"Hulladek Recycling",role:"operator_or_owner",tier:"emerging",fn:"Conducts small-scale battery disassembly and safe discharging at its Kolkata facility, handling consumer battery volumes from its urban collection events. Provides an authorised processing pathway for East India battery waste. Delivers small-volume dismantled fractions to downstream partners.",hq:"India",sp:null},
    {n:"PEC Ltd",role:"operator_or_owner",tier:"emerging",fn:"Operates battery disassembly within its EPR fulfilment processing infrastructure, providing initial separation for producer battery waste before transfer to specialised recyclers. Bridges EPR compliance collection with downstream processing. Delivers separated fractions to downstream recyclers.",hq:"India",sp:null},
    {n:"Stoltz Metals",role:"operator_or_owner",tier:"emerging",fn:"Conducts battery dismantling and fraction separation as part of precious and base metal recovery operations, focusing on batteries with significant non-ferrous metal content. Brings metallurgical recovery expertise adjacent to its dismantling function. Delivers high-value fractions to its own downstream recovery operations.",hq:"India",sp:null},
  ],
  s_03:[
    {n:"Attero Recycling",role:"end_to_end_player",tier:"leading",fn:"Operates industrial-scale lithium-ion battery shredding in nitrogen-purged chambers to prevent thermal events, followed by density and size-based sorting to separate black mass from metal foils and plastics. Separation quality is a competitive differentiator feeding its adjacent hydrometallurgical lines with consistently characterised black mass. Delivers black mass, Al and Cu foils, plastics, and electrolyte fractions to co-located hydrometallurgical operations.",hq:"India",sp:["s_01","s_02","s_03","s_04","s_05"]},
    {n:"Lohum Cleantech",role:"end_to_end_player",tier:"leading",fn:"Runs automated and semi-automated lithium-ion pre-treatment combining mechanical shredding with physical separation to produce black mass and separated metal foil streams for its downstream recovery lines. Co-location of pre-treatment and hydrometallurgical recovery enables closed-loop material transfer and process optimisation. Delivers characterised black mass, Al and Cu foils, and plastic fractions to its adjacent hydrometallurgical lines.",hq:"India",sp:["s_01","s_02","s_03","s_04","s_05"]},
    {n:"Gravita India",role:"operator_or_owner",tier:"leading",fn:"Operates high-volume lead-acid battery crushing, gravity separation, and fraction classification at Jaipur and Mundra, processing battery scrap into lead paste, polypropylene, and acid fractions as input for its smelting operations. One of India's largest secondary lead pre-treatment capacities. Delivers lead oxide paste, polypropylene, and treated acid to on-site smelting operations.",hq:"India",sp:["s_02","s_03","s_04","s_05"]},
    {n:"Nile Ltd",role:"operator_or_owner",tier:"leading",fn:"Runs lead-acid battery crushing, separation, and acid neutralisation at Chennai as pre-treatment input to its smelting business. Operation processes high annual lead-acid volumes from South Indian markets. Delivers lead paste, polypropylene, and neutralised acid to downstream smelting.",hq:"India",sp:["s_02","s_03","s_04","s_05"]},
    {n:"Amara Raja Recycling",role:"operator_or_owner",tier:"leading",fn:"Operates lead-acid battery crushing and lead paste extraction at Tirupati as the mechanical pre-treatment step feeding its secondary lead smelting, benefiting from a large captive feedstock stream from Amara Raja's dealer network. Delivers lead paste and separated polypropylene to on-site smelting and refining.",hq:"India",sp:["s_02","s_03","s_04","s_05"]},
    {n:"Rubamin Ltd",role:"operator_or_owner",tier:"emerging",fn:"Applies mechanical and chemical pre-treatment to spent catalysts and battery intermediates containing cobalt and nickel, isolating cobalt and nickel-bearing fractions for its hydrometallurgical recovery operations. Oriented toward high-value battery and catalyst waste rather than large-volume mass processing. Delivers enriched cobalt/nickel-bearing fractions to its downstream recovery operations.",hq:"India",sp:["s_03","s_04","s_05"]},
    {n:"Trishyiraya Recycling",role:"operator_or_owner",tier:"emerging",fn:"Performs mechanical shredding and physical separation as part of its integrated e-waste and battery pre-processing operation at its South India facility. Supports both lead-acid and lithium-ion processing at modest scale. Delivers mechanically separated streams to downstream partners.",hq:"India",sp:null},
    {n:"Exigo Recycling",role:"operator_or_owner",tier:"emerging",fn:"Applies shredding and density-based separation at authorised facilities, producing separated material streams for transfer to processors. Covers consumer and light commercial battery form factors at limited scale. Delivers separated material streams to authorised downstream processors.",hq:"India",sp:null},
    {n:"E-Parisaraa",role:"operator_or_owner",tier:"leading",fn:"Operates mechanical processing lines at its Bengaluru facility, separating incoming battery fractions into recoverable material streams. Has processed diverse battery chemistries since 2005 as one of South India's most experienced operators. Delivers separated battery material streams to downstream processing partners.",hq:"India",sp:null},
    {n:"Cerebra Integrated",role:"operator_or_owner",tier:"emerging",fn:"Performs mechanical shredding and fraction separation at its recycling facilities as part of its e-waste and battery processing service. Operates across multiple states under CPCB registration. Delivers mechanically separated material streams to downstream processors.",hq:"India",sp:null},
  ],
  s_04:[
    {n:"Attero Recycling",role:"end_to_end_player",tier:"leading",fn:"Operates proprietary hydrometallurgical leaching and selective solvent extraction at Roorkee, applying acid-leaching chemistry followed by selective precipitation to co-recover lithium, cobalt, nickel, and manganese from black mass in a single integrated circuit. Holds CPCB and Uttarakhand SPCB authorisation with integrated effluent treatment and closed-loop water management. Delivers technical-grade lithium carbonate, cobalt sulfate, nickel sulfate, and manganese compounds to its adjacent refining unit.",hq:"India",sp:["s_01","s_02","s_03","s_04","s_05"]},
    {n:"Lohum Cleantech",role:"end_to_end_player",tier:"leading",fn:"Operates advanced hydrometallurgical recovery at Greater Noida using proprietary leaching and precipitation chemistry optimised for NMC and LFP black mass, with demonstrated commercial-scale recovery yields consistent with international benchmarks. Holds patents on aspects of its leaching and selective extraction chemistry. Delivers technical-grade metal salt intermediates to its adjacent purification and crystallisation operations.",hq:"India",sp:["s_01","s_02","s_03","s_04","s_05"]},
    {n:"Gravita India",role:"operator_or_owner",tier:"leading",fn:"Operates secondary lead smelting and refining furnaces at Jaipur and Mundra, converting lead oxide paste from battery pre-treatment into refined secondary lead ingots and alloys through blast furnace smelting and refining. Processes over 100,000 MTPA of lead battery equivalent and is one of India's largest secondary lead producers. Delivers refined lead ingots and alloys to battery manufacturers and industrial buyers.",hq:"India",sp:["s_02","s_03","s_04","s_05"]},
    {n:"Nile Ltd",role:"operator_or_owner",tier:"leading",fn:"Runs blast furnace lead smelting and electrorefining at Chennai, converting lead paste from battery breaking into high-purity secondary lead for battery manufacturers and industrial users. Maintains a long-term offtake relationship with Exide Industries. Delivers refined lead ingots and alloys to battery manufacturers including Exide.",hq:"India",sp:["s_02","s_03","s_04","s_05"]},
    {n:"Hindustan Zinc",role:"operator_or_owner",tier:"leading",fn:"Operates India's largest zinc and lead smelting complex at Dariba and Chanderiya and has stated intent to leverage this existing hydrometallurgical and pyrometallurgical infrastructure for battery material recovery. Battery recycling capability is at development stage; its primary business is zinc and silver production from ore. Potential to deliver battery metal intermediates from its large-scale metallurgical infrastructure.",hq:"India",sp:null},
    {n:"Rubamin Ltd",role:"operator_or_owner",tier:"emerging",fn:"Recovers cobalt and nickel from spent catalysts and battery intermediates through hydrometallurgical processing at its Vadodara facility, producing technical-grade cobalt sulfate and nickel sulfate adapted from catalyst recovery. Process has been extended to battery intermediates as demand for recycled battery metals grows. Delivers technical-grade cobalt sulfate and nickel sulfate to battery material buyers and downstream purifiers.",hq:"India",sp:["s_03","s_04","s_05"]},
    {n:"Umicore",role:"operator_or_owner",tier:"leading",fn:"Applies its proprietary VAL'EAS pyrometallurgical and hydrometallurgical process at Hoboken, Belgium, co-processing lithium-ion battery black mass from global sources including India-linked supply chains to recover cobalt, nickel, and lithium at battery-grade specifications. Global benchmark for integrated battery recycling metallurgy with established OEM qualification. Delivers battery-grade cobalt sulfate, nickel sulfate, and lithium compounds to global OEM battery supply chains.",hq:"Belgium",sp:["s_04","s_05"]},
    {n:"Tata Chemicals",role:"operator_or_owner",tier:"emerging",fn:"Developing hydrometallurgical lithium recovery and battery material extraction at pilot stage as part of the Tata group's strategy to secure domestic battery-grade material supply for its Agratas EV battery manufacturing. Collaborating with CSIR-CSMCRI on lithium extraction from brines and recycled sources. Commercial-scale operations not yet confirmed.",hq:"India",sp:["s_04","s_05"]},
    {n:"Amara Raja Recycling",role:"operator_or_owner",tier:"leading",fn:"Operates secondary lead smelting at Tirupati, converting lead paste from battery breaking into refined secondary lead for the Amara Raja group's battery manufacturing and third-party producers. Integrated model creates a closed loop between Amara Raja's battery manufacturing and recycling. Delivers specification-certified recycled lead to Amara Raja Energy & Mobility and third-party buyers.",hq:"India",sp:["s_02","s_03","s_04","s_05"]},
  ],
  s_05:[
    {n:"Attero Recycling",role:"end_to_end_player",tier:"leading",fn:"Refines technical-grade metal salt intermediates to battery-grade specifications through crystallisation, ion exchange, and polishing steps at Roorkee, producing Li₂CO₃ (≥99.5%), CoSO₄ (≥21% Co), and NiSO₄ (≥22% Ni) against OEM purity requirements. Purification unit is integrated with its hydrometallurgical lines, enabling process control across both stages. Delivers battery-grade certified materials with EPR traceability documentation to domestic manufacturers and commodity buyers.",hq:"India",sp:["s_01","s_02","s_03","s_04","s_05"]},
    {n:"Lohum Cleantech",role:"end_to_end_player",tier:"leading",fn:"Produces battery-grade lithium, cobalt, and nickel compounds through crystallisation, solvent polishing, and ion exchange purification at Greater Noida, with output certified against global OEM specifications and validated through its Glencore offtake agreement. The Glencore partnership independently validates that its output meets global commodity trading specifications. Delivers battery-grade certified specialty chemicals to Glencore under the 10,000 MT offtake and to domestic customers.",hq:"India",sp:["s_01","s_02","s_03","s_04","s_05"]},
    {n:"Umicore",role:"operator_or_owner",tier:"leading",fn:"Produces battery-grade cobalt sulfate, nickel sulfate, and lithium compounds through integrated VAL'EAS and hydrometallurgical refining at Hoboken, delivering certified materials meeting the most stringent global OEM specifications. Established OEM qualification with major global automotive groups including those with Indian manufacturing. Delivers battery-grade certified specialty chemicals to global OEM supply chains.",hq:"Belgium",sp:["s_04","s_05"]},
    {n:"Tata Chemicals",role:"operator_or_owner",tier:"emerging",fn:"Developing lithium carbonate purification at pilot stage targeting battery-grade purity for the domestic EV supply chain, aiming to position as a domestic battery-grade lithium supplier for Agratas. Working with CSIR-CSMCRI on lithium extraction and purification technology. Commercial-scale certified output not yet confirmed.",hq:"India",sp:["s_04","s_05"]},
    {n:"Neogen Chemicals",role:"operator_or_owner",tier:"emerging",fn:"Produces specialty lithium compounds including Li₂CO₃ and LiOH through chemical synthesis and purification at Karjan (Gujarat) and Dahej SEZ, supplying battery and pharmaceutical applications from primary lithium feedstock. Expanding battery-grade lithium chemical capacity to serve growing domestic EV demand. Delivers battery-grade lithium carbonate and lithium hydroxide to battery manufacturers and electrolyte producers.",hq:"India",sp:null},
    {n:"Rubamin Ltd",role:"operator_or_owner",tier:"emerging",fn:"Produces refined cobalt sulfate and nickel sulfate through solvent extraction and crystallisation purification at Vadodara, supplying battery material and industrial chemical buyers. Purification capability extends from its hydrometallurgical recovery operations. Delivers refined CoSO₄ and NiSO₄ to battery material and industrial chemical buyers.",hq:"India",sp:["s_03","s_04","s_05"]},
    {n:"Gravita India",role:"operator_or_owner",tier:"leading",fn:"Produces battery-grade refined lead and lead alloys through electrorefining at Jaipur and Mundra, supplying lead-acid battery manufacturers including Exide Industries under long-term supply arrangements. Refining covers multiple lead alloy grades for automotive, industrial, and telecom battery applications. Delivers battery-grade refined lead ingots and alloys to battery manufacturers.",hq:"India",sp:["s_02","s_03","s_04","s_05"]},
    {n:"Nile Ltd",role:"operator_or_owner",tier:"leading",fn:"Produces refined secondary lead to battery manufacturer specifications through electrorefining at Chennai, with an established long-term supply relationship with Exide Industries. Delivers specification-certified recycled lead to battery manufacturers in South and Central India.",hq:"India",sp:["s_02","s_03","s_04","s_05"]},
    {n:"Glencore",role:"input_provider",tier:"leading",fn:"Acts as the global commodity offtake partner for Lohum Cleantech's recycled battery-grade specialty chemicals, integrating Indian recycled material into Glencore's global battery material supply chain under a 5-year, 10,000 MT agreement signed in 2023. Glencore's participation validates that Lohum's output meets global commodity trading specifications. Delivers battery-grade specialty chemicals from India into global battery manufacturing supply chains.",hq:"Switzerland",sp:null},
  ],
};

const CHOKEPOINTS = [
  {id:"cp_01",stage:"s_03",name:"Li-ion Black Mass Capacity",sev:"High",sev_rationale:"Only two operators supply the sole input to Metallurgy — disruption halts two downstream stages simultaneously with no short-term alternative capacity available.",desc:"Only Attero and Lohum produce specification-grade lithium-ion black mass at commercial scale in India despite 10 participants. Capital intensity of inert-atmosphere shredding and environmental permitting prevent rapid capacity addition. Separation quality at this stage directly determines recovery yields at Metallurgy.",entities:["Attero Recycling","Lohum Cleantech"],downstream:["Metallurgical Recovery","Material Refining & Purification"]},
  {id:"cp_02",stage:"s_04",name:"Hydrometallurgical Extraction",sev:"High",sev_rationale:"No domestic alternative process can convert Li-ion black mass to usable metal salts; commissioning new hydrometallurgical capacity takes 2–4 years, making substitution structurally impossible in the short term.",desc:"Only two qualified domestic operators run large-scale Li-ion hydrometallurgical lines in India. Environmental permitting and proprietary leaching IP create 2–4 year timelines for new capacity to reach operational status. All other stage participants are either lead-focused, exploratory, or operating outside India.",entities:["Attero Recycling","Lohum Cleantech"],downstream:["Material Refining & Purification"]},
  {id:"cp_03",stage:"s_05",name:"Battery-Grade OEM Certification",sev:"High",sev_rationale:"OEM qualification takes 12–24 months — certified suppliers cannot be replaced quickly, and FY 2027-28 mandates will require certified supply exactly when new capacity is hardest to bring online.",desc:"OEM qualification timelines of 12–24 months make rapid substitution of certified suppliers structurally impossible. Only Attero and Lohum are confirmed domestic operators refining recycled material to battery-grade Li-ion specifications at scale. Recycled-content mandates from FY 2027-28 will increase demand exactly when supply is most constrained.",entities:["Attero Recycling","Lohum Cleantech"],downstream:["Battery Manufacturing (External)"]},
  {id:"cp_04",stage:"s_01",name:"EPR-Traceable Feedstock",sev:"Medium",sev_rationale:"Informal collection continues outside the portal, providing a partial substitute — disruption delays compliance documentation but does not physically halt battery flows or downstream processing.",desc:"Access to EPR-compliant, portal-documented battery lots is concentrated through CPCB-registered operators and the Recykal platform. The CPCB EPR portal is a single-point dependency in the compliance chain: non-portal-registered collection does not generate EPR credits.",entities:["CPCB","Recykal"],downstream:["Battery Dismantling & Discharging","Pre-treatment & Mechanical Processing"]},
];

const DEPS = [
  {id:"dep_01",from:"s_01",to:"s_02",desc:"Chemistry-classified, portal-documented consignments required for authorised discharging; undocumented batteries create EPR non-compliance, handling risk, and processing inefficiency.",diff:"medium"},
  {id:"dep_02",from:"s_02",to:"s_03",desc:"Safely discharged and dismantled cells required for mechanical shredding; charged packs create thermal runaway risk that prevents commercial shredding operations.",diff:"high"},
  {id:"dep_03",from:"s_03",to:"s_04",desc:"Consistently characterised black mass (≥60% combined cathode metals, <2% contamination) required for calibrated hydrometallurgical leaching; inconsistent material reduces recovery yields by 3–8 percentage points.",diff:"high"},
  {id:"dep_04",from:"s_04",to:"s_05",desc:"Technical-grade metal salts with specific impurity profiles from selective extraction required for ion exchange purification; refining cannot bypass the metallurgical isolation step.",diff:"high"},
];

const SHIFTS = [
  {id:"shift_01",type:"regulatory_restructuring",dir:"lateral",impact:"High",impact_rationale:"Legally mandated recovery targets change who can participate across four stages for all operators — not just the named companies — and take effect on a fixed government timetable, making it impossible for any participant to opt out.",headline:"MoEFCC notified Battery Waste Management Second Amendment Rules 2024 in June 2024, setting mandatory 90% material recovery targets by 2026-27 and recycled-content requirements for battery manufacturers from FY 2027-28.",stages:["s_01","s_02","s_04","s_05"],entities:["MoEFCC","CPCB","Attero Recycling","Lohum Cleantech","Recykal"],stage_impacts:[
    {stage_id:"s_01",stage_name:"Battery Collection & Aggregation",desc:"Portal registration becomes a legal prerequisite for compliant collection, routing EPR certificate value toward registered operators and excluding informal aggregators from the formal compliance chain. Operators with existing CPCB registration and digital tracking are immediately advantaged."},
    {stage_id:"s_02",stage_name:"Battery Dismantling & Discharging",desc:"Escalating recovery targets incentivise more thorough cell-level disassembly and fraction separation. Only CPCB-consented dismantlers can generate compliant EPR certificates, further concentrating formal activity among permitted operators."},
    {stage_id:"s_04",stage_name:"Metallurgical Recovery",desc:"The 90% recovery target disqualifies informal and low-efficiency processors from the legal compliance chain. Operators with proven high-yield hydrometallurgical processes: specifically Attero and Lohum: can command a compliance premium for their recovery outputs."},
    {stage_id:"s_05",stage_name:"Material Refining & Purification",desc:"Recycled-content mandates from FY 2027-28 create a legally defined demand floor for certified battery-grade materials, enabling qualified refiners to price as necessary suppliers rather than optional alternatives to virgin material."},
  ]},
  {id:"shift_02",type:"vertical_integration",dir:"upstream",impact:"High",impact_rationale:"A Tier-1 conglomerate captive-integrating three stages simultaneously shifts structural power chain-wide — every independent merchant processor faces a reduced addressable market, not just the named competitors.",headline:"Reliance Industries announced at its August 2024 AGM that the Jamnagar Giga Complex includes in-house battery recycling targeting H2 2025, internalising pre-treatment through refining within a 30 GWh captive complex.",stages:["s_03","s_04","s_05"],entities:["Reliance Industries","Attero Recycling","Lohum Cleantech"],stage_impacts:[
    {stage_id:"s_03",stage_name:"Pre-treatment & Mechanical Processing",desc:"RIL's captive pre-treatment will divert a portion of future Li-ion battery waste away from the independent merchant pre-treatment market, further reducing the addressable merchant opportunity for standalone pre-treatment operators."},
    {stage_id:"s_04",stage_name:"Metallurgical Recovery",desc:"A large captive hydrometallurgical operation at Jamnagar adds domestic recovery capacity while simultaneously removing it from the merchant market. Independent recyclers may face both feedstock competition and reduced processing service demand from new OEM entrants contracting with RIL."},
    {stage_id:"s_05",stage_name:"Material Refining & Purification",desc:"A captive refining operation closes the loop for RIL's battery manufacturing, withdrawing a share of future battery-grade material demand from the independent merchant refining market: but also validating the economic case for battery-grade refining at scale in India."},
  ]},
  {id:"shift_03",type:"vertical_integration",dir:"upstream",impact:"Medium",impact_rationale:"This reorganises one industrial group's own chain at three stages; the merchant market narrows but is not closed to other participants, and the broader chain structure remains intact.",headline:"Amara Raja Energy & Mobility announced its Giga Corridor investment in Telangana in 2023, including dedicated Li-ion battery recycling infrastructure alongside cell manufacturing.",stages:["s_03","s_04","s_05"],entities:["Amara Raja Energy & Mobility","Amara Raja Recycling"],stage_impacts:[
    {stage_id:"s_03",stage_name:"Pre-treatment & Mechanical Processing",desc:"Amara Raja's Giga Corridor will include battery pre-treatment capacity, routing battery waste from its dealer take-back programme directly into its own processing lines rather than to independent processors."},
    {stage_id:"s_04",stage_name:"Metallurgical Recovery",desc:"Adds a second large captive hydrometallurgical operator in India, reinforcing the vertical integration trend and further segmenting the market between integrated players and merchant processors."},
    {stage_id:"s_05",stage_name:"Material Refining & Purification",desc:"Amara Raja's planned refining targets supply of recycled materials to its own cell manufacturing, reducing external procurement and partially closing the battery lifecycle loop within the group."},
  ]},
  {id:"shift_04",type:"end_market_power_shift",dir:"downstream",impact:"Medium",impact_rationale:"This repositions one operator's pricing power from waste-service to certified materials — a meaningful proof point but one that changes the economics for two stages without restructuring participant eligibility more broadly.",headline:"Lohum–Glencore 2023 offtake agreement for 10,000 MT specialty battery chemicals shifts Indian recycler margin profile from waste-service economics to certified materials manufacturer economics.",stages:["s_04","s_05"],entities:["Lohum Cleantech","Glencore"],stage_impacts:[
    {stage_id:"s_04",stage_name:"Metallurgical Recovery",desc:"Demonstrates that hydrometallurgical recovery output from India can meet global commodity trading specifications, creating a pull incentive for Metallurgy operators to invest in process quality improvements needed to achieve Glencore-equivalent specifications."},
    {stage_id:"s_05",stage_name:"Material Refining & Purification",desc:"Establishes a commercial proof point that Indian certified refining output can displace primary material in international supply chains, enabling certified refiners to price at commodity market rates rather than domestic waste-processing rates."},
  ]},
  {id:"shift_05",type:"disintermediation",dir:"lateral",impact:"Medium",impact_rationale:"Informal aggregators are bypassed at one stage only; downstream stage economics and the broader participant structure remain unchanged, limiting the chain-level effect to the Collection entry point.",headline:"Recykal's Battery EPR marketplace (650+ brands, 100+ recyclers, 2023) structurally bypasses informal aggregation intermediaries at collection by making digital traceability a prerequisite for EPR credit generation.",stages:["s_01"],entities:["Recykal","Karo Sambhav"],stage_impacts:[
    {stage_id:"s_01",stage_name:"Battery Collection & Aggregation",desc:"Informal aggregators who previously bridged consumers and formal recyclers are being bypassed as producers fulfil EPR obligations through direct-to-recycler digital platforms. Registered operators on compliant platforms gain structural advantage in securing producer EPR contracts."},
  ]},
  {id:"shift_06",type:"stage_compression",dir:"lateral",impact:"Medium",impact_rationale:"Compression applies to the two integrated operators at two stages; standalone pre-treatment and metallurgy operators are not structurally displaced, so the shift changes competitive intensity without closing the market.",headline:"Attero and Lohum have co-located mechanical pre-treatment and hydrometallurgical recovery within single facility footprints, compressing Pre-treatment and Metallurgy into a continuous integrated processing flow.",stages:["s_03","s_04"],entities:["Attero Recycling","Lohum Cleantech"],stage_impacts:[
    {stage_id:"s_03",stage_name:"Pre-treatment & Mechanical Processing",desc:"Stage compression reduces the addressable merchant market for standalone pre-treatment: integrated players supply their own black mass and have limited incentive to purchase from independent processors. New entrants face a narrowing commercial window unless they also control downstream hydrometallurgical capacity."},
    {stage_id:"s_04",stage_name:"Metallurgical Recovery",desc:"Integration enables continuous process optimisation across both stages, improving recovery yields and reducing handling losses that occur when material changes hands between separate operators: reinforcing integrated players' competitive position."},
  ]},
];

const OPPS = [
  {id:"opp_01",label:"Premium EPR-traceable feedstock aggregation",stage:"Battery Collection & Aggregation",ev:"medium",type:"commoditisation_escape",entry:"differentiation",evidence:"The Collection stage has 20 participants and low concentration, with rising margin pressure from feedstock competition. The shift toward CPCB portal compliance is formalising a premium for portal-documented, chemistry-sorted feedstock above undifferentiated collection volumes.",conds:["EPR producers pay premium for portal-certified feedstock rather than defaulting to informal sourcing","Operator can source compliantly at scale from both formal and informal channels without losing traceability"]},
  {id:"opp_02",label:"Regional collection-to-dismantling compliance corridor",stage:"Collection → Dismantling",ev:"high",type:"transition_gap",entry:"integration",evidence:"Participant density drops from 20 at Collection to 15 at Dismantling. Undocumented batteries create EPR non-compliance entering Dismantling, and tightening compliance documentation requirements widen the gap a qualified corridor could fill.",conds:["Regional battery return volumes sufficient to support dedicated compliant transfer nodes","Downstream dismantlers pay for pre-qualified, chemistry-classified inbound consignments"]},
  {id:"opp_03",label:"Spec-grade Li-ion black mass production hub",stage:"Pre-treatment & Mechanical Processing",ev:"medium",type:"chokepoint_adjacency",entry:"early_positioning",evidence:"Pre-treatment lists 10 participants but only 2 operate Li-ion at commercial scale. Li-ion black mass capacity is a high-severity chokepoint, and stage compression is reducing the viability of standalone pre-treatment for non-integrated players.",conds:["Industrial-scale shredding with inert-atmosphere separation and environmental permitting secured","Downstream processors open to third-party black mass rather than requiring captive integration"]},
  {id:"opp_04",label:"Merchant hydrometallurgical recovery capacity",stage:"Metallurgical Recovery",ev:"medium",type:"shift_created_opening",entry:"early_positioning",evidence:"Only 2 Li-ion qualified domestic operators exist at Metallurgical Recovery, a high-severity chokepoint. Mandatory 90% recovery demand arrives by 2026-27, while battery-manufacturer integration risks capturing feedstock before merchants can secure it.",conds:["Environmental permitting and effluent-control capability reached before 2026-27 recovery mandate enforcement","Black mass feedstock remains accessible to merchant processors despite manufacturer vertical integration"]},
  {id:"opp_05",label:"Battery-grade purification and OEM qualification",stage:"Metallurgical Recovery → Refining",ev:"high",type:"shift_created_opening",entry:"early_positioning",evidence:"Only 2 domestic qualified suppliers exist at Refining, a high-severity chokepoint with 12 to 24 month OEM qualification timelines. Legally mandated recycled-content demand begins FY 2027-28, and the Lohum-Glencore offtake proves Indian recycled material can meet global standards.",conds:["Achieve ≥99.5% Li₂CO₃ and equivalent OEM purity thresholds consistently across production batches","Upstream intermediates from Metallurgy available at consistent impurity profiles enabling repeatable purification"]},
  {id:"opp_06",label:"Lead recycling upgrade to battery-grade output",stage:"Material Refining & Purification",ev:"medium",type:"commoditisation_escape",entry:"differentiation",evidence:"Multiple lead operators at Refining (Gravita, Nile, Amara Raja Recycling) produce commodity secondary lead. Battery-grade certified lead commands a 30 to 60% premium, and recycled-content mandates extend to lead-acid chemistry from FY 2027-28.",conds:["Lead-acid OEMs formalise battery-grade recycled lead procurement rather than continuing commodity sourcing","Operator invests in purity upgrade, OEM certification, and EPR traceability documentation infrastructure"]},
  {id:"opp_07",label:"Independent EPR compliance infrastructure",stage:"Collection → Dismantling",ev:"low",type:"stage_gap",entry:"differentiation",evidence:"EPR-traceable feedstock is a medium-severity chokepoint, with compliance concentrated in the CPCB portal and Recykal. Only one platform participant operates at Collection, creating a structural dependency on a single compliance intermediary.",conds:["CPCB registration and integration with battery-waste EPR portal for legally valid credit generation","Sufficient producer and recycler participants to reach platform liquidity against Recykal's established network effects"]},
];

// Companies with enhanced partners (what_they_exchange, known_transactions) and key_customers
const COMPANIES = [
  {n:"Attero Recycling",size:"Large Enterprise",yr:2008,hq:"Roorkee, India",logo:"attero.in",
   summary:"India's largest end-to-end battery and e-waste recycler operating all 5 chain stages from collection through battery-grade material refining at its Roorkee integrated facility.",
   stages:["s_01","s_02","s_03","s_04","s_05"],
   dir:"Deepening end-to-end integration by expanding proprietary hydrometallurgical capacity at Roorkee and pursuing international licensing of its recycling technology; direction is consolidation of the full chain rather than retreat to any single stage.",
   partners:[
     {p:"MG Motor India",t:"EV battery take-back partnership",exchange:"MG Motor provides end-of-life EV battery packs from its customer network; Attero provides authorised collection, EPR compliance documentation, and recycling services.",txn:null},
     {p:"Hyundai Motor India",t:"EV battery recycling partnership",exchange:"Hyundai provides end-of-life battery packs from its dealer network; Attero provides compliant recycling and EPR certificate generation.",txn:null},
     {p:"Tata Motors",t:"EV battery recycling partnership",exchange:"Tata Motors provides battery packs from its growing EV fleet; Attero provides authorised recycling and EPR compliance.",txn:null},
   ],
   customers:null,
   reach:"Primary processing facility at Roorkee, Uttarakhand; nationwide collection network spanning Delhi-NCR, Mumbai, Bengaluru, Chennai, and Pune.",
   signals:null},
  {n:"Lohum Cleantech",size:"SME",yr:2018,hq:"Greater Noida, India",logo:"lohum.com",
   summary:"Integrated battery lifecycle company spanning collection through battery-grade refining in India, with validated global offtake via Glencore and adjacent second-life battery services.",
   stages:["s_01","s_02","s_03","s_04","s_05"],
   dir:"Scaling its integrated recycling and refining platform with Series B capital; expanding global offtake relationships, where the Glencore agreement repositions Lohum as a materials manufacturer rather than a waste processor.",
   partners:[
     {p:"Glencore",t:"Offtake agreement",exchange:"Lohum provides battery-grade specialty chemicals (CoSO₄, NiSO₄, Li₂CO₃) from recycled batteries; Glencore purchases and distributes into global battery material supply chains.",txn:"10,000 metric tonnes over five years; agreement announced 2023."},
     {p:"Mercedes-Benz Energy",t:"Second-life battery strategic partnership",exchange:"Mercedes-Benz Energy provides end-of-life EV battery packs; Lohum provides second-life battery assessment, refurbishment, and recycling services.",txn:null},
     {p:"MG Motor India",t:"Second-life battery solution partnership",exchange:"MG Motor provides end-of-life battery packs; Lohum provides second-life assessment and recycling under its Meteora platform.",txn:null},
   ],
   customers:[{c:"Glencore",what:"Battery-grade cobalt sulfate, nickel sulfate, and lithium carbonate recovered from recycled Li-ion batteries, certified to global commodity trading specifications.",txn:"10,000 MT over five years commencing 2023."}],
   reach:"Integrated processing and R&D campus at Greater Noida, Uttar Pradesh; collection network spanning national OEM and fleet partnerships.",
   signals:["Secured USD 54 million in Series B funding to scale recycling capacity and second-life battery services.","Signed 5-year, 10,000 MT specialty battery chemicals offtake with Glencore in 2023.","Launched Meteora, a proprietary AI-based asset valuation tool for used EV batteries."]},
  {n:"Ecoreco",size:"Large Enterprise",yr:2007,hq:"Mumbai, India",logo:"ecoreco.com",
   summary:"Publicly listed e-waste and battery recycler providing nationwide collection and dismantling at Collection through Dismantling under its Book My Junk brand with 20+ state coverage.",
   stages:["s_01","s_02"],
   dir:"Deepening EPR compliance services and expanding battery waste processing capacity to capture growing EV battery volumes through its multi-state authorised infrastructure.",
   partners:[{p:"Adani Total Energies",t:"E-waste and battery collection collaboration",exchange:"Adani Total Energies routes e-waste and battery waste from its operations; Ecoreco provides authorised collection and recycling with EPR documentation.",txn:null}],
   customers:[{c:"EPR-obligated producers and OEMs",what:"Authorised battery collection, recycling, and EPR compliance certificate generation services.",txn:null}],
   reach:"Central processing facility in Maharashtra; Book My Junk collection network covering 20+ Indian states.",
   signals:["Expanded Book My Junk mobile application to include dedicated battery waste collection categories.","Increased focus on formalising the informal collection sector through the Ecoreco Enviro Education initiative."]},
  {n:"Recykal",size:"Startup",yr:2015,hq:"Hyderabad, India",logo:"recykal.com",
   summary:"Digital EPR compliance platform operating as the software and marketplace layer at Collection, connecting 650+ producers with 100+ verified recyclers for battery waste compliance without owning physical processing capacity.",
   stages:["s_01"],
   dir:"Deepening its platform position in regulated waste streams by expanding Battery EPR module and traceability infrastructure rather than moving into physical recycling assets.",
   partners:[{p:"UNDP",t:"Circular economy programme partner",exchange:"UNDP provides programme support and institutional validation; Recykal provides digital compliance infrastructure for circular economy initiatives.",txn:null}],
   customers:[{c:"EPR-obligated battery and electronics producers (650+)",what:"Digital EPR compliance management, waste traceability documentation, and battery waste marketplace access.",txn:null}],
   reach:"Digital platform active nationally across India, connecting participants in 28 states; no physical processing infrastructure.",
   signals:["Raised USD 22 million in funding to enhance waste traceability technology and marketplace capabilities.","Launched dedicated Battery Waste Management EPR module in 2023 under India's Battery Waste Management Rules 2022."]},
  {n:"Gravita India",size:"Large Enterprise",yr:1992,hq:"Jaipur, India",logo:"gravitaindia.com",
   summary:"Publicly listed secondary lead producer spanning battery dismantling through battery-grade lead refining at Dismantling through Refining with announced intent to enter Li-ion recycling.",
   stages:["s_02","s_03","s_04","s_05"],
   dir:"Deepening integrated lead recycling model while investing in capability for lithium-ion chemistries as EV battery waste approaches commercial scale.",
   partners:[
     {p:"Exide Industries",t:"Recycled lead supply agreement",exchange:"Gravita supplies battery-grade refined secondary lead; Exide purchases as primary raw material for lead-acid battery manufacturing.",txn:null},
     {p:"Amara Raja Batteries",t:"Recycled lead supply",exchange:"Gravita supplies refined secondary lead; Amara Raja purchases as battery manufacturing raw material.",txn:null},
   ],
   customers:[{c:"Exide Industries and Amara Raja Batteries",what:"Battery-grade refined secondary lead and lead alloys for lead-acid battery manufacturing.",txn:null}],
   reach:"Primary facilities at Jaipur, Rajasthan and Mundra, Gujarat; multi-country operations across Africa and Southeast Asia.",
   signals:["Publicly announced intent to enter lithium-ion battery recycling to capture growing EV battery waste volumes.","Expanded international recycling operations in Africa and Southeast Asia using its integrated secondary lead model."]},
  {n:"Nile Ltd",size:"Large Enterprise",yr:1962,hq:"Hyderabad, India",logo:"nileltd.com",
   summary:"One of India's oldest secondary lead producers with integrated lead-acid battery dismantling, smelting, and refining at Dismantling through Refining, primarily serving South Indian battery manufacturers.",
   stages:["s_02","s_03","s_04","s_05"],
   dir:"Deepening integrated lead recycling model while evaluating operational upgrades for mixed-chemistry battery waste as non-lead volumes enter South Indian collection channels.",
   partners:[{p:"Exide Industries",t:"Long-term recycled lead offtake",exchange:"Nile supplies battery-grade refined secondary lead; Exide purchases as primary raw material for battery manufacturing at South India facilities.",txn:null}],
   customers:[{c:"Exide Industries",what:"Battery-grade refined secondary lead for lead-acid battery manufacturing.",txn:null},{c:"Industrial lead alloy buyers",what:"Lead alloys for industrial, telecom, and casting applications.",txn:null}],
   reach:"Primary facility in Chennai, Tamil Nadu; supply relationships across South and Central India.",
   signals:["Investing in process upgrades at Chennai facility for increasing mixed-chemistry battery waste including early-stage Li-ion volumes."]},
  {n:"Hindustan Zinc",size:"Large Enterprise",yr:1966,hq:"Udaipur, India",logo:"hzlindia.com",
   summary:"India's largest zinc and lead producer with stated intent to leverage existing hydrometallurgical and pyrometallurgical infrastructure for battery material recovery at Metallurgy.",
   stages:["s_04"],
   dir:"Developing battery recycling capability by applying its large-scale metallurgical infrastructure to battery material recovery as EV battery waste approaches commercial scale.",
   partners:[{p:"Vedanta Group",t:"Parent: capital and technology support",exchange:"Vedanta Group provides capital and strategic direction for battery materials initiatives; Hindustan Zinc provides metallurgical infrastructure and operating capability.",txn:null}],
   customers:null,
   reach:"Primary smelting and refining operations at Dariba and Chanderiya, Rajasthan.",
   signals:["Stated intent to leverage existing metallurgical infrastructure for battery material recovery as India's EV market scales.","Vedanta Group flagged battery materials and recycling as strategic adjacency in 2024 annual report."]},
  {n:"Amara Raja Recycling",size:"Large Enterprise",yr:2009,hq:"Tirupati, India",logo:"amararaja.com",
   summary:"Amara Raja Group's dedicated recycling subsidiary operating integrated lead-acid battery processing at Dismantling through Refining with pilot investment in Li-ion battery recycling capability.",
   stages:["s_02","s_03","s_04","s_05"],
   dir:"Investing in Li-ion recycling as the Amara Raja group deepens its EV battery manufacturing bet, creating the recycling loop for a future closed-loop battery lifecycle model.",
   partners:[{p:"Amara Raja Energy & Mobility",t:"Parent group: battery manufacturing and recycling integration",exchange:"Amara Raja E&M provides spent battery feedstock; Amara Raja Recycling processes and supplies refined recycled lead back for battery manufacturing.",txn:null}],
   customers:[{c:"Amara Raja Energy & Mobility",what:"Battery-grade refined secondary lead for lead-acid battery manufacturing.",txn:null},{c:"Third-party battery manufacturers",what:"Refined secondary lead to battery manufacturer specifications.",txn:null}],
   reach:"Primary recycling facility at Tirupati, Andhra Pradesh; collection across South and Central India through Amara Raja dealer network.",
   signals:["Amara Raja group Giga Corridor initiative in Telangana including dedicated Li-ion battery recycling infrastructure.","Investing in Li-ion pre-processing and hydrometallurgical pilot lines at Tirupati."]},
  {n:"Rubamin Ltd",size:"Large Enterprise",yr:1977,hq:"Vadodara, India",logo:"rubamin.com",
   summary:"Specialty metals refiner producing refined cobalt sulfate and nickel sulfate from spent catalysts and battery intermediates at Pre-treatment through Refining.",
   stages:["s_03","s_04","s_05"],
   dir:"Expanding cobalt and nickel recovery from battery intermediates as EV supply chain demand grows, leveraging established hydrometallurgical infrastructure from its catalyst recovery business.",
   partners:[{p:"Global cobalt and nickel commodity traders",t:"Commodity offtake",exchange:"Rubamin supplies refined cobalt sulfate and nickel sulfate; traders purchase for distribution to battery and industrial material markets.",txn:null}],
   customers:[{c:"Battery material and precursor manufacturers",what:"Refined cobalt sulfate and nickel sulfate for cathode active material and battery chemical production.",txn:null}],
   reach:"Primary processing facility at Vadodara, Gujarat.",
   signals:["Expanding CoSO₄ and NiSO₄ production capacity at Vadodara to serve growing battery precursor demand from domestic EV manufacturers."]},
  {n:"Umicore",size:"Large Enterprise",yr:1989,hq:"Brussels, Belgium",logo:"umicore.com",
   summary:"Global battery recycling and materials technology leader applying proprietary VAL'EAS process at Metallurgy through Refining, supplying battery-grade materials to global OEM supply chains including India-linked manufacturers.",
   stages:["s_04","s_05"],
   dir:"Scaling VAL'EAS battery recycling capacity in Europe and exploring Asia technology licensing as the global EV battery recycling market grows.",
   partners:[{p:"Global automotive OEMs",t:"Battery material supply and take-back mandates",exchange:"OEMs provide end-of-life battery packs and specify material requirements; Umicore provides battery-grade recycled materials meeting OEM qualification standards.",txn:null}],
   customers:[{c:"Global battery cell manufacturers and automotive OEMs",what:"Battery-grade cobalt sulfate, nickel sulfate, and lithium compounds meeting the most stringent OEM purity specifications.",txn:null}],
   reach:"Primary battery recycling operations at Hoboken, Belgium; global material supply to battery manufacturers including India-linked OEMs.",
   signals:["Scaling VAL'EAS battery recycling capacity in Europe to meet EV battery wave from 2026 onwards.","Actively exploring technology licensing and partnership arrangements in Asia including India."]},
  {n:"Tata Chemicals",size:"Large Enterprise",yr:1939,hq:"Mumbai, India",logo:"tatachemicals.com",
   summary:"Tata group chemical company developing battery-grade lithium carbonate production and hydrometallurgical battery material recovery at Metallurgy through Refining for Agratas EV battery manufacturing.",
   stages:["s_04","s_05"],
   dir:"Positioning as a domestic battery-grade lithium material supplier for the Tata group's Agratas EV battery manufacturing programme through hydrometallurgical capability development.",
   partners:[
     {p:"CSIR-CSMCRI",t:"Technology collaboration: lithium extraction",exchange:"CSIR-CSMCRI provides research expertise in lithium extraction; Tata Chemicals provides commercialisation resources.",txn:null},
     {p:"Agratas Energy Storage",t:"Intra-group battery manufacturing customer",exchange:"Agratas requires battery-grade lithium materials for planned cell manufacturing; Tata Chemicals aims to supply from domestic production.",txn:null},
   ],
   customers:[{c:"Agratas Energy Storage (Tata group)",what:"Battery-grade lithium carbonate and other battery materials for EV cell manufacturing.",txn:null}],
   reach:"R&D and pilot facilities at Mumbai and Mithapur, Gujarat; Dahej SEZ targeted for future scale-up.",
   signals:["Announced investment in Li₂CO₃ and battery chemical production to support Tata group EV ambitions.","Collaborating with CSIR-CSMCRI on lithium extraction from brine and recycled battery sources."]},
  {n:"Neogen Chemicals",size:"SME",yr:1989,hq:"Mumbai, India",logo:"neogenchem.com",
   summary:"Specialty lithium chemicals manufacturer at Refining, producing battery-grade Li₂CO₃ and LiOH through synthesis and purification from primary lithium feedstock.",
   stages:["s_05"],
   dir:"Expanding battery-grade lithium chemical production capacity at Dahej SEZ to serve growing domestic EV and energy storage battery demand.",
   partners:[{p:"BASF",t:"Technology collaboration: organolithium compounds",exchange:"BASF provides organolithium chemistry expertise; Neogen provides manufacturing infrastructure for specialty lithium compounds.",txn:null}],
   customers:[{c:"Battery electrolyte and cell manufacturers",what:"Battery-grade lithium carbonate and lithium hydroxide for electrolyte and cell manufacturing.",txn:null},{c:"Pharmaceutical manufacturers",what:"Pharmaceutical-grade lithium compounds for API production.",txn:null}],
   reach:"Manufacturing facilities at Karjan, Gujarat and Dahej Special Economic Zone.",
   signals:["Expanding Li₂CO₃ and LiOH production lines at Dahej SEZ for battery market demand.","Raising capital for capacity expansion in battery-grade specialty lithium chemicals."]},
  {n:"Glencore",size:"Large Enterprise",yr:1974,hq:"Baar, Switzerland",logo:"glencore.com",
   summary:"Global commodity trader and natural resources company acting as the offtake buyer and global distribution partner for Lohum Cleantech's recycled battery-grade specialty chemicals at Refining.",
   stages:["s_05"],
   dir:"Integrating recycled battery materials from emerging market recyclers into global battery chemical supply chains as part of its Energy Transition Materials strategy.",
   partners:[{p:"Lohum Cleantech",t:"Offtake agreement: recycled battery specialty chemicals",exchange:"Lohum provides battery-grade certified specialty chemicals from recycled batteries; Glencore purchases and distributes into global battery material supply chains.",txn:"10,000 metric tonnes over five years; announced 2023."}],
   customers:[{c:"Global battery cell manufacturers and cathode active material producers",what:"Battery-grade cobalt sulfate, nickel sulfate, and lithium compounds for battery cell and cathode material manufacturing.",txn:null}],
   reach:"Global commodity trading; India linkage exclusively through the Lohum Cleantech offtake agreement.",
   signals:["Signed strategic partnership with Lohum Cleantech in 2023 for multi-year offtake of specialty chemicals from recycled batteries.","Expanding battery recycling material trading as part of its Energy Transition Materials strategy."]},
  {n:"Karo Sambhav",size:"SME",yr:2017,hq:"Gurugram, India",logo:"karosambhav.com",
   summary:"CPCB-registered EPR Producer Responsibility Organisation managing battery and electronics waste collection compliance for 600+ registered producers nationally at Collection.",
   stages:["s_01"],
   dir:"Expanding battery EPR service scope under the 2022 Battery Waste Management Rules by onboarding new battery producers and deepening traceability infrastructure.",
   partners:[{p:"CPCB-registered producers (600+)",t:"EPR Producer Responsibility Organisation mandate",exchange:"Producers assign their EPR obligations; Karo Sambhav manages collection logistics, documentation, and certificate delivery to meet regulatory targets.",txn:null}],
   customers:[{c:"Electronics and battery producers under India's EPR framework",what:"End-to-end EPR compliance management including collection coordination, documentation, and CPCB-portal certificate generation.",txn:null}],
   reach:"EPR collection network covering 25+ states across India through partner aggregators and recyclers.",
   signals:["Registered as an authorised PRO under the Battery Waste Management Rules 2022 to serve battery-producing clients."]},
  {n:"E-Parisaraa",size:"SME",yr:2005,hq:"Bengaluru, India",logo:"ewasteindia.com",
   summary:"One of India's first CPCB-authorised e-waste recyclers, operating collection, dismantling, and mechanical pre-processing at Collection through Pre-treatment with a South India focus.",
   stages:["s_01","s_02","s_03"],
   dir:"Deepening battery processing authorisation under the 2022 Battery Waste Management Rules while expanding South India collection infrastructure.",
   partners:[{p:"CPCB",t:"Authorised recycler registration and compliance",exchange:"CPCB grants authorised recycler status enabling legal operation; E-Parisaraa provides compliant processing and regulatory reporting.",txn:null}],
   customers:[{c:"Corporate and institutional generators in South India",what:"Authorised battery and e-waste collection, disposal, and EPR compliance documentation services.",txn:null}],
   reach:"Primary processing facility in Bengaluru, Karnataka; collection across South India.",
   signals:["Expanded battery waste processing authorisation under 2022 Battery Waste Management Rules to cover additional chemistries."]},
  {n:"Exide Industries",size:"Large Enterprise",yr:1947,hq:"Kolkata, India",logo:"exideindustries.com",
   summary:"India's largest lead-acid battery manufacturer operating a dealer-network-linked battery take-back programme at Collection under EPR obligations.",
   stages:["s_01"],
   dir:"Expanding take-back programme to include Li-ion packs as EV penetration grows, while scaling Li-ion battery manufacturing through Exide Energy Solutions.",
   partners:[
     {p:"Leclanché SA",t:"JV for Li-ion battery manufacturing",exchange:"Leclanché provides Li-ion battery technology and IP; Exide provides manufacturing infrastructure and India market access through Exide Energy Solutions.",txn:null},
     {p:"Gravita India",t:"Recycled lead supply agreement",exchange:"Gravita supplies battery-grade refined secondary lead; Exide purchases as primary raw material for lead-acid battery manufacturing.",txn:null},
   ],
   customers:[{c:"Automotive OEMs and aftermarket",what:"Lead-acid automotive starting batteries and industrial batteries.",txn:null}],
   reach:"Nationwide dealer network across India; manufacturing plants in West Bengal, Tamil Nadu, Uttarakhand, and Haryana.",
   signals:["Scaling Li-ion battery manufacturing through Exide Energy Solutions for the EV market.","Expanding take-back programme to capture increasing Li-ion pack volumes."]},
  {n:"Amara Raja Batteries",size:"Large Enterprise",yr:1985,hq:"Tirupati, India",logo:"amararaja.com",
   summary:"Major Indian lead-acid battery manufacturer operating battery take-back and reverse logistics at Collection as part of a group-level closed-loop battery lifecycle strategy.",
   stages:["s_01"],
   dir:"Deepening closed-loop strategy by linking take-back to Amara Raja Recycling while the broader group invests in Li-ion battery manufacturing.",
   partners:[
     {p:"Amara Raja Recycling",t:"Group subsidiary: battery recycling",exchange:"Amara Raja Batteries routes collected spent batteries through its dealer network; Amara Raja Recycling processes and supplies refined secondary lead back for battery manufacturing.",txn:null},
     {p:"Amara Raja Energy & Mobility",t:"Group EV battery manufacturing",exchange:"Batteries provides established distribution and take-back infrastructure; Energy & Mobility provides future Li-ion manufacturing demand.",txn:null},
   ],
   customers:[{c:"Automotive OEMs and aftermarket dealers",what:"Lead-acid automotive and two-wheeler starting batteries.",txn:null}],
   reach:"Nationwide dealer network; manufacturing plants in Andhra Pradesh and Telangana.",
   signals:["Amara Raja group Giga Corridor in Telangana signals future Li-ion battery manufacturing and recycling loop.","Expanding dealer take-back to capture growing Li-ion EV battery volumes."]},
  {n:"Ola Electric",size:"Large Enterprise",yr:2017,hq:"Bengaluru, India",logo:"olaelectric.com",
   summary:"India's largest EV scooter manufacturer operating in-house battery take-back at Collection through its 400+ service centre network under EPR obligations.",
   stages:["s_01"],
   dir:"Building a vertically integrated EV ecosystem including battery collection and recycling linkages as part of its Futurefactory and cell manufacturing programmes.",
   partners:[{p:"Authorised battery recyclers",t:"EPR-linked battery recycling handoff",exchange:"Ola Electric routes collected spent battery packs; recyclers provide EPR certificate generation and compliant processing.",txn:null}],
   customers:null,
   reach:"400+ service centres nationally; Futurefactory manufacturing campus at Krishnapatnam, Andhra Pradesh.",
   signals:["Announced in-house battery cell manufacturing at Krishnapatnam, Andhra Pradesh, requiring a recycling loop for end-of-life cells.","IPO disclosures in 2024 noted battery lifecycle management as a compliance and sustainability priority."]},
];


// ─── Single data source (architected for future JSON loading) ─────────────────
// Today these are the hardcoded battery-recycling arrays above. To load a different
// VCA pipeline output later, replace this object's contents with parsed JSON of the
// same shape: every component reads from VCA_DATA, nothing reads the arrays directly.
const VCA_DATA = {
  meta: { domain: "Battery Recycling", geography: "India", stageCount: STAGES.length, companyCount: COMPANIES.length, chokepoints: CHOKEPOINTS.length, shifts: SHIFTS.length },
  stages: STAGES,
  chokepoints: CHOKEPOINTS,
  dependencies: DEPS,
  shifts: SHIFTS,
  opportunities: OPPS,
  companies: COMPANIES,
  participants: PARTICIPANTS,
};

// ════════════════════════════════════════════════════════════════════════════
//  SHARED PRIMITIVES  (platform standard: light theme, white cards, emerald accent)
// ════════════════════════════════════════════════════════════════════════════
const cap=(s:string)=>s?s.charAt(0).toUpperCase()+s.slice(1):s;

// Concentration / severity / impact / substitution → text+bg classes
const TONE: Record<string,{t:string;bg:string;bd:string;solid:string}> = {
  high:{t:"text-red-600",bg:"bg-red-50",bd:"border-red-200",solid:"bg-red-500"},
  High:{t:"text-red-600",bg:"bg-red-50",bd:"border-red-200",solid:"bg-red-500"},
  moderate:{t:"text-amber-600",bg:"bg-amber-50",bd:"border-amber-200",solid:"bg-amber-500"},
  Medium:{t:"text-amber-600",bg:"bg-amber-50",bd:"border-amber-200",solid:"bg-amber-500"},
  medium:{t:"text-amber-600",bg:"bg-amber-50",bd:"border-amber-200",solid:"bg-amber-500"},
  low:{t:"text-[#15b865]",bg:"bg-[#f0fdf4]",bd:"border-[#bbf7d0]",solid:"bg-[#1EDD7D]"},
  Low:{t:"text-[#15b865]",bg:"bg-[#f0fdf4]",bd:"border-[#bbf7d0]",solid:"bg-[#1EDD7D]"},
};

// ─── Tooltip system ───────────────────────────────────────────────────────────
// TipBox measures its own rendered size via useLayoutEffect, then positions
// itself directly adjacent to the trigger (below by default, flips above when
// there isn't room) and clamps both axes so it can never leave the viewport.
// The visibility:hidden initial state prevents a positional flash on first paint.
const TIP_W = 280;

// Trim long descriptions to keep tooltips compact and close to their trigger.
function clip(s:string, max=150){
  if(!s) return s;
  const t=s.trim();
  if(t.length<=max) return t;
  const cut=t.slice(0,max);
  const sp=cut.lastIndexOf(" ");
  return (sp>40?cut.slice(0,sp):cut).replace(/[.,;:\s]+$/,"")+"…";
}

function TipBox({anchor,title,subtitle,children}:{anchor:DOMRect;title?:string;subtitle?:string;children:React.ReactNode}){
  const boxRef=useRef<HTMLDivElement>(null);
  const [st,setSt]=useState<React.CSSProperties>({visibility:"hidden",top:0,left:0});
  useLayoutEffect(()=>{
    const el=boxRef.current; if(!el) return;
    const b=el.getBoundingClientRect();
    const W=window.innerWidth, H=window.innerHeight, M=8, G=8;
    // Horizontal: align to trigger left, clamp inside viewport.
    let left=anchor.left;
    if(left+b.width>W-M) left=W-M-b.width;
    if(left<M) left=M;
    // Vertical: prefer below; flip above when below doesn't fit.
    const fitsBelow=anchor.bottom+G+b.height<=H-M;
    const fitsAbove=anchor.top-G-b.height>=M;
    let top:number;
    if(fitsBelow)       top=anchor.bottom+G;
    else if(fitsAbove)  top=anchor.top-G-b.height;
    else { // roomier side wins; clamp to stay fully on-screen
      top=(H-anchor.bottom>=anchor.top)?anchor.bottom+G:H-M-b.height;
      if(top<M) top=M;
      if(top+b.height>H-M) top=Math.max(M,H-M-b.height);
    }
    setSt({top,left,visibility:"visible"});
  },[anchor]);
  return(
    <div ref={boxRef}
      style={{position:"fixed",width:TIP_W,maxWidth:"calc(100vw - 16px)",
              boxSizing:"border-box",wordBreak:"break-word",overflowWrap:"break-word",
              whiteSpace:"normal",...st}}
      className="z-[99999] bg-white border border-slate-200 rounded-xl shadow-xl p-3.5 pointer-events-none text-left">
      {title    && <div className="text-[12px] font-bold text-[#0f2644] leading-snug"                               style={{wordBreak:"break-word"}}>{title}</div>}
      {subtitle && <div className="text-[10px] font-semibold tracking-wide text-slate-400 mt-0.5"         style={{wordBreak:"break-word"}}>{subtitle}</div>}
      <div className={`text-[11px] text-slate-600 leading-relaxed ${title||subtitle?"mt-1.5":""}`}                  style={{wordBreak:"break-word"}}>{children}</div>
    </div>
  );
}

// InfoTooltip – wraps any inline element; shows TipBox on hover/focus.
function InfoTooltip({title,subtitle,text,children,className}:{title?:string;subtitle?:string;text:string;children:React.ReactNode;className?:string}){
  const ref=useRef<HTMLSpanElement>(null);
  const [anchor,setAnchor]=useState<DOMRect|null>(null);
  const show=()=>{ if(ref.current) setAnchor(ref.current.getBoundingClientRect()); };
  const hide=()=>setAnchor(null);
  if(!text) return <>{children}</>;
  return(
    <span ref={ref} className={`relative cursor-help ${className||"inline-flex items-center"}`}
      onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {anchor&&createPortal(<TipBox anchor={anchor} title={title} subtitle={subtitle}>{text}</TipBox>,document.body)}
    </span>
  );
}

// Company logo: tries a real favicon/logo, falls back to a coloured monogram on error.
const LOGO_TINT=["#0f2644","#2563eb","#7c3aed","#0891b2","#15803d","#b45309","#be123c","#0e7490"];
function CompanyLogo({name,domain,size=28}:{name:string;domain?:string;size?:number}){
  const [failed,setFailed]=useState(false);
  const initials=name.split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase();
  const tint=LOGO_TINT[name.charCodeAt(0)%LOGO_TINT.length];
  const px=`${size}px`;
  if(domain && !failed){
    return(
      <span className="inline-flex items-center justify-center rounded-lg bg-white border border-slate-200 overflow-hidden flex-shrink-0" style={{width:px,height:px}}>
        <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} alt={name} width={size-6} height={size-6}
          style={{objectFit:"contain"}} onError={()=>setFailed(true)}/>
      </span>
    );
  }
  return(
    <span className="inline-flex items-center justify-center rounded-lg flex-shrink-0 font-bold text-white" style={{width:px,height:px,background:tint,fontSize:size*0.36}}>{initials}</span>
  );
}

// Key Takeaways: exact platform standard: emerald box, bulb + arrows.
function KeyTakeaways({points}:{points:string[]}){
  return(
    <div className="mt-3 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3">
      <div className="flex items-center gap-1.5 mb-2">
        <svg width="13" height="13" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.22-1.2 4.16-3 5.2V17a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1v-2.8C7.2 13.16 6 11.22 6 9a6 6 0 0 1 6-6z"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        <span className="text-[10px] font-bold text-[#16a34a] tracking-[0.06em]">Key Takeaways</span>
      </div>
      {points.map((pt,i)=>(
        <div key={i} className="flex items-start gap-2 mt-1.5 first:mt-0">
          <svg width="12" height="12" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          <p className="text-[13px] text-[#14532d] leading-relaxed" dangerouslySetInnerHTML={{__html:pt}}/>
        </div>
      ))}
    </div>
  );
}

// Section card wrapper (white, rounded-2xl, header + optional deep-dive button)
function Card({title,sub,action,children,id}:{title:React.ReactNode;sub?:string;action?:React.ReactNode;children:React.ReactNode;id?:string}){
  return(
    <div id={id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden scroll-mt-6">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 gap-3">
        <div className="min-w-0">
          <div className="text-[15px] font-semibold text-[#0f2644]">{title}</div>
          {sub&&<div className="text-[13px] text-slate-400 mt-0.5">{sub}</div>}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// Per-tab banner metadata (icon path, one-line description, accent colour)
const SIDEBAR_ITEMS: { label: string; tab: MainTab; icon: React.ReactNode }[] = [
  { label: "Overview",        tab: "overview",        icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { label: "Value Chain Map", tab: "chainmap",        icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg> },
  { label: "Company Explorer",tab: "companies",       icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/></svg> },
  { label: "Power Dynamics",  tab: "power_dynamics",  icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.22-1.2 4.16-3 5.2V17a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1v-2.8C7.2 13.16 6 11.22 6 9a6 6 0 0 1 6-6z"/></svg> },
  { label: "Opportunities",   tab: "opportunities",   icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
];

const TAB_META:Record<MainTab,{title:string;desc:string;accent:string;paths:string[]}>={
  overview:{title:"Overview",desc:"The value chain at a glance: how it is structured, where control concentrates, and what is reshaping it.",accent:"#15b865",paths:["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"]},
  chainmap:{title:"Value Chain Map",desc:"Every participant positioned by stage, role, and tier, with the economics and roster for each stage.",accent:"#2563EB",paths:["M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"]},
  companies:{title:"Company Explorer",desc:"Profiles of the named organisations active in the chain, with partners, customers, footprint, and forward signals.",accent:"#7c3aed",paths:["M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"]},
  power_dynamics:{title:"Power Dynamics",desc:"Where structural control sits across the chain, the chokepoints that define it, and the forces actively reshaping it.",accent:"#ea580c",paths:["M9 21h6M12 3a6 6 0 0 1 6 6c0 2.22-1.2 4.16-3 5.2V17a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1v-2.8C7.2 13.16 6 11.22 6 9a6 6 0 0 1 6-6z"]},
  opportunities:{title:"Opportunities",desc:"Strategic opportunities where a new entrant could capture value, each traced to evidence and rated by confidence.",accent:"#059669",paths:["M13 2L3 14h9l-1 8 10-12h-9z"]},
};
function TabPageHeader({id}:{id:MainTab}){
  const m=TAB_META[id];
  return(
    <div className="flex items-start gap-3 mb-6 bg-white border border-slate-200 rounded-xl px-4 py-3.5">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{background:`${m.accent}15`,color:m.accent}}>
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">{m.paths.map((p,i)=><path key={i} d={p}/>)}</svg>
      </div>
      <div>
        <h2 className="text-[14px] font-bold text-[#0f2644] mb-0.5">{m.title}</h2>
        <p className="text-[13px] text-slate-500 leading-relaxed">{m.desc}</p>
      </div>
    </div>
  );
}

// Small badge with optional classification tooltip
function Tag({children,tone,title,termKey,solid}:{children:React.ReactNode;tone?:string;title?:string;termKey?:string;solid?:boolean}){
  const tc=tone?TONE[tone]:null;
  const cls=tc? (solid?`${tc.solid} text-white border-transparent`:`${tc.bg} ${tc.t} ${tc.bd}`) : "bg-slate-100 text-slate-600 border-slate-200";
  const el=<span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border tracking-wide ${cls}`}>{children}</span>;
  if(title&&termKey) return <InfoTooltip title={title} text={TERMS[termKey]||""}>{el}</InfoTooltip>;
  return el;
}

// role dot color
const roleDot=(role:string)=>{ const d=ROLE_CLR[role]?.dot||""; return d.includes("purple")?"#7c3aed":d.includes("blue")?"#2563eb":d.includes("cyan")?"#0891b2":d.includes("amber")?"#d97706":"#15b865"; };

// ════════════════════════════════════════════════════════════════════════════
//  SIGNATURE VISUAL: VALUE-CHAIN FLOW RIBBON  (light theme)
//  Band thickness ∝ participants · fill ∝ concentration · margin glyph above · chokepoint dot below
// ════════════════════════════════════════════════════════════════════════════
//  VALUE CHAIN AT A GLANCE  (tile-based, enriched concentration map style)
// ════════════════════════════════════════════════════════════════════════════
function FlowRibbon({onStage}:{onStage:(id:string)=>void}){
  const stages=VCA_DATA.stages;

  const STAGE_DESC:Record<string,string>={
    s_01:"Spent batteries gathered from consumers, businesses, and take-back programmes. Sorted by chemistry and documented for EPR compliance before entering processing.",
    s_02:"Batteries safely discharged and physically dismantled. Cells separated from casings, electronics, and hazardous materials for the next stage.",
    s_03:"Discharged cells shredded and physically separated into black mass (cathode/anode material), metal foils, and plastics by size and density.",
    s_04:"Black mass processed through hydrometallurgy or pyrometallurgy to extract lithium, cobalt, nickel, and manganese as technical-grade compounds.",
    s_05:"Technical-grade metal salts refined to battery-grade purity, certified against OEM specifications, and documented for re-entry into new battery manufacturing.",
  };
  const CONC_DESC:Record<Conc,string>={
    low:"Many players can participate; no single operator controls access. Entry barriers are mainly compliance and outreach, not technology or capital.",
    moderate:"Meaningful barriers exist but the market is not locked. A capable new entrant can compete, though switching costs and compliance requirements slow entry.",
    high:"A small number of operators hold structural advantages through proprietary technology, permits, or qualification timelines that prevent rapid new entry. These stages define where strategic power sits.",
  };
  const MARGIN_DESC:Record<Margin,string>={
    increasing:"Participants are capturing more value per unit than before. Demand is outpacing supply or a premium is being paid for certified output.",
    stable:"Margin levels are broadly unchanged. Structural barriers are holding pricing steady without clear upward or downward pressure.",
    decreasing:"Participants are capturing less value per unit. Often signals input cost pressure, commoditisation, or competitive intensity squeezing the stage.",
  };
  const MWORD:Record<Margin,string>={increasing:"Rising",stable:"Stable",decreasing:"Compressing"};
  // Light pastel backgrounds — dark text throughout
  const concBg=(c:Conc)=>c==="high"?"#fee2e2":c==="moderate"?"#fef9ee":"#f0fdf4";
  const concBorder=(c:Conc)=>c==="high"?"#fca5a5":c==="moderate"?"#fde68a":"#86efac";
  const concText=(_c:Conc)=>"#111827";
  const concSubText=(_c:Conc)=>"#374151";
  const concBadgeBg=(c:Conc)=>c==="high"?"#fca5a5":c==="moderate"?"#fde68a":"#86efac";
  const concBadgeText=(c:Conc)=>c==="high"?"#991b1b":c==="moderate"?"#92400e":"#166534";
  const marginColor=(m:Margin)=>m==="increasing"?"#dc2626":m==="decreasing"?"#16a34a":"#d97706";
  const marginPillBg=(m:Margin)=>m==="increasing"?"#fee2e2":m==="decreasing"?"#dcfce7":"#fef3c7";
  // Medium label instead of Moderate for display
  const concLabel=(c:Conc)=>c==="moderate"?"Medium":cap(c);

  return(
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      {/* Header — title only, legend moved to bottom */}
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="text-[15px] font-semibold text-[#0f2644]">Value Chain at a Glance</div>
        <div className="text-[13px] text-slate-400 mt-0.5">Click any stage to explore its participants and economics.</div>
      </div>

      <div className="p-5">
        {/* Flow caption */}
        <p className="text-[11px] text-slate-400 italic mb-3">
          Value flows left to right — raw waste batteries enter at Collection and exit as certified battery-grade materials at Refining.
        </p>

        {/* Stage tiles with arrows */}
        <div className="flex items-stretch gap-2 mb-5">
          {stages.map((s,i)=>(
            <div key={s.id} className="flex items-stretch gap-2 flex-1 min-w-0">
              {/* Single-colour tile — no split, description fully visible */}
              <button
                onClick={()=>onStage(s.id)}
                className="flex-1 min-w-0 rounded-xl transition-all hover:shadow-lg hover:brightness-[0.97] focus:outline-none text-left border-2 flex flex-col h-full"
                style={{background:concBg(s.conc), borderColor:concBorder(s.conc)}}>
                <div className="px-3.5 pt-3.5 pb-3 flex flex-col flex-1">
                  {/* Stage name + firm count */}
                  <div className="flex items-start justify-between gap-1 mb-2">
                    <span className="text-[13.5px] font-black leading-tight" style={{color:concText(s.conc)}}>{s.short}</span>
                    <span className="text-[10px] flex-shrink-0 mt-0.5" style={{color:concSubText(s.conc)}}>{s.count} firms</span>
                  </div>
                  {/* Concentration + Margin together above description */}
                  <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                    <InfoTooltip title={`${concLabel(s.conc)} concentration`} text={CONC_DESC[s.conc]}>
                      <span className="inline-flex items-center text-[9.5px] font-bold px-2 py-0.5 rounded-full cursor-help" style={{background:concBadgeBg(s.conc),color:concBadgeText(s.conc)}}>
                        {concLabel(s.conc)}
                      </span>
                    </InfoTooltip>
                    <InfoTooltip title={`${MWORD[s.margin]} margins`} text={MARGIN_DESC[s.margin]}>
                      <div className="inline-flex items-center gap-1 cursor-help px-2 py-1 rounded-lg" style={{background:marginPillBg(s.margin)}}>
                        <span className="text-[12px]" style={{color:marginColor(s.margin)}}>{MARGIN_ICON[s.margin]}</span>
                        <span className="text-[10px] font-bold" style={{color:marginColor(s.margin)}}>{MWORD[s.margin]}</span>
                      </div>
                    </InfoTooltip>
                  </div>
                  {/* Stage description — grows to fill height */}
                  <p className="text-[11px] leading-relaxed flex-1" style={{color:concSubText(s.conc)}}>
                    {STAGE_DESC[s.id]}
                  </p>
                </div>
              </button>
              {/* Arrow between stages */}
              {i<stages.length-1&&(
                <div className="flex-shrink-0 flex items-center self-center">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legends at bottom — each with a clear sub-heading */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 pt-4 border-t border-slate-100">
          {/* Concentration */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 tracking-wider mb-1.5">Concentration</div>
            <div className="flex items-center gap-4">
              {([["low","#1EDD7D","Low"],["moderate","#f59e0b","Medium"],["high","#ef4444","High"]] as [Conc,string,string][]).map(([c,col,lbl])=>(
                <InfoTooltip key={c} title={`${lbl} concentration`} text={CONC_DESC[c]}>
                  <span className="flex items-center gap-1.5 cursor-help">
                    <span className="w-3 h-3 rounded-sm" style={{background:col}}/>
                    <span className="text-[11px] font-semibold text-slate-600">{lbl}</span>
                  </span>
                </InfoTooltip>
              ))}
            </div>
          </div>
          {/* Margin Direction */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 tracking-wider mb-1.5">Margin Direction</div>
            <div className="flex items-center gap-4">
              {([["increasing","#ef4444","▲ Rising"],["stable","#f59e0b","▬ Stable"],["decreasing","#15b865","▼ Compressing"]] as [Margin,string,string][]).map(([m,col,lbl])=>(
                <InfoTooltip key={m} title={`${MWORD[m]} margins`} text={MARGIN_DESC[m]}>
                  <span className="flex items-center gap-1 cursor-help">
                    <span className="text-[11px] font-semibold" style={{color:col}}>{lbl}</span>
                  </span>
                </InfoTooltip>
              ))}
            </div>
          </div>
        </div>

        <KeyTakeaways points={[
          "<strong>The chain narrows downstream</strong>: participant count falls from 20 at Collection to 9 at Metallurgy, while concentration rises from Low to High.",
          "<strong>High-concentration stages with compressing margins are the control points</strong>: Pre-treatment, Metallurgy, and Refining are held by very few qualified operators.",
        ]}/>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  OVERVIEW TAB
// ════════════════════════════════════════════════════════════════════════════
function OverviewTab({onNav,onStage}:{onNav:(t:MainTab,o?:{intelSub?:IntelSub;anchor?:string})=>void;onStage:(id:string)=>void}){
  const d=VCA_DATA;
  const [expanded,setExpanded]=useState(false);
  const highChoke=d.chokepoints.filter(c=>c.sev==="High").length;
  const e2e=d.companies.filter(c=>c.stages.length>=3).length;
  const kpis=[
    {v:String(d.meta.stageCount),l:"Chain Stages",s:"Collection → Refining",go:()=>onNav("chainmap")},
    {v:String(d.meta.companyCount),l:"Profiled Companies",s:`${e2e} operate end-to-end`,go:()=>onNav("companies")},
    {v:String(highChoke),l:"High-Severity Chokepoints",s:"Structural control points",tip:TERMS.chokepoint,go:()=>onNav("power_dynamics",{intelSub:"concentration",anchor:"intel-chokepoints"})},
    {v:String(d.shifts.length),l:"Structural Shifts",s:"Forces reshaping the chain",tip:"Events where companies, regulations, or technologies are actively changing who can participate in the chain, at what cost, and with what structural position. Each shift is classified by type, direction, and chain impact.",go:()=>onNav("power_dynamics",{intelSub:"shifts",anchor:"intel-shifts"})},
    {v:String(d.opportunities.length),l:"Strategic Opportunities",s:"Mapped to chain positions",go:()=>onNav("opportunities")},
  ];
  return(
    <div className="space-y-6">
      {/* About this research — client-facing: what they get from this research */}
      <div className="bg-gradient-to-br from-[#f0fdf4] to-[#f0f9ff] border border-[#bbf7d0] rounded-2xl p-5">
        <div className="text-[12px] font-bold text-sky-700 mb-2">About this research</div>
        <p className="text-[14px] leading-relaxed text-slate-700 mb-2">This analysis gives you a clear picture of <strong>who controls the India battery recycling chain, where that control concentrates, and what is shifting</strong>. It answers three questions a strategy or investment team needs: who are the real players at each stage, where are the structural bottlenecks that no new entrant can easily bypass, and where do genuine openings exist?</p>
        {expanded&&(
          <>
            <p className="text-[14px] leading-relaxed text-slate-700 mb-2">The research mapped five sequential stages from waste battery collection through to battery-grade material output. For each stage we identified every named participant, classified their role and relative position, and assessed how concentrated control is and which way margins are moving. We then identified the specific chokepoints — positions held by one or two operators that the rest of the chain depends on — and the structural shifts (regulatory, integration, and market forces) that are actively changing who can compete.</p>
            <p className="text-[14px] leading-relaxed text-slate-700 mb-3">The output is a set of <strong>strategic opportunities</strong> grounded in chain evidence, each rated by confidence. You can explore by stage, by company, or by opportunity type. Start with the <button onClick={()=>onStage(VCA_DATA.stages[0].id)} className="text-sky-600 font-medium hover:underline">Value Chain Map</button> for the full structural picture, or jump to <button onClick={()=>onNav("opportunities")} className="text-sky-600 font-medium hover:underline">Opportunities</button> for the actionable findings.</p>
          </>
        )}
        <button onClick={()=>setExpanded(r=>!r)} className="flex items-center gap-1.5 text-[12px] font-semibold text-sky-600 hover:text-sky-700 transition-colors mt-1">
          {expanded?"Read less":"Read more"}
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{transform:expanded?"rotate(180deg)":"none"}}><path d="M6 9l6 6 6-6"/></svg>
        </button>
      </div>

      {/* KPI stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {kpis.map((k,i)=>(
          <div key={i} onClick={k.go} className="bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-slate-300 hover:shadow-sm transition-all group">
            <div className="flex items-center gap-1 mb-2">
              <div className="text-[11px] font-bold text-slate-400 flex-1 leading-tight">{k.l}</div>
              {k.tip&&<InfoTooltip title={k.l} text={k.tip}><span className="text-[11px] text-slate-400 cursor-help">ⓘ</span></InfoTooltip>}
            </div>
            <div className="text-[33px] font-black text-[#0f2644] leading-none mb-1 group-hover:text-[#15b865] transition-colors">{k.v}</div>
            <div className="text-[11px] text-slate-400">{k.s}</div>
          </div>
        ))}
      </div>

      {/* Flow ribbon */}
      <FlowRibbon onStage={onStage}/>

      {/* Shifts + chokepoints */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Issue 7: tooltip on Structural Shifts title */}
        <Card
          title={<InfoTooltip title="Structural Shifts" text="Forces that are actively changing who can participate in the chain, where value sits, and what the stage boundaries look like. Includes regulatory changes, vertical integration moves, and market power shifts."><span className="flex items-center gap-1.5 cursor-help">Active Structural Shifts <svg width="13" height="13" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></span></InfoTooltip>}
          sub="Forces reshaping the chain right now"
          action={<button onClick={()=>onNav("power_dynamics" as MainTab,{intelSub:"shifts" as IntelSub,anchor:"intel-shifts"})} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-[#0f2644] border border-slate-200 rounded-lg px-3 py-1.5 hover:border-slate-300 transition-colors">View all<svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>}>
          <div className="space-y-2">
            {d.shifts.slice(0,4).map(sh=>(
              <button key={sh.id} onClick={()=>onNav("power_dynamics" as MainTab,{intelSub:"shifts" as IntelSub,anchor:"intel-shifts"})}
                className="w-full text-left rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-colors overflow-hidden">
                <div className="flex items-stretch">
                  {/* Coloured left accent using border-l */}
                  <div className="w-1 flex-shrink-0" style={{background:SHIFT_CLR[sh.type].accent}}/>
                  <div className="flex-1 px-3 py-3 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <InfoTooltip title={SHIFT_LABEL[sh.type]} text={TERMS[sh.type]||""}>
                        <span className="text-[10.5px] font-bold cursor-help" style={{color:SHIFT_CLR[sh.type].accent}}>{SHIFT_LABEL[sh.type]}</span>
                      </InfoTooltip>
                      <Tag tone={sh.impact} title={`${sh.impact} impact`} termKey={`impact_${sh.impact}`}>{sh.impact}</Tag>
                    </div>
                    <p className="text-[12px] text-slate-600 leading-snug">{sh.headline}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <KeyTakeaways points={[
            "<strong>Vertical integration dominates</strong>: three of six shifts pull pre-treatment through refining in-house, shrinking the merchant market.",
            "<strong>Regulation sets the demand floor</strong>: 2024 rules mandate 90% recovery by 2026-27, favouring already-certified operators.",
          ]}/>
        </Card>

        {/* Issue 7: tooltip on Chokepoints title */}
        <Card
          title={<InfoTooltip title="Chokepoints" text="Positions in the chain where a small number of players control access to something the downstream chain depends on. Qualification timelines, proprietary IP, permits, and capital requirements prevent rapid new entry. A disruption here affects multiple downstream stages."><span className="flex items-center gap-1.5 cursor-help">Chokepoints <svg width="13" height="13" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></span></InfoTooltip>}
          sub="Where a few players control flow the whole chain depends on"
          action={<button onClick={()=>onNav("power_dynamics" as MainTab,{intelSub:"concentration" as IntelSub,anchor:"intel-chokepoints"})} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-[#0f2644] border border-slate-200 rounded-lg px-3 py-1.5 hover:border-slate-300 transition-colors">View all<svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>}>
          <div className="space-y-2.5">
            {d.chokepoints.map(cp=>(
              <button key={cp.id} onClick={()=>onNav("power_dynamics" as MainTab,{intelSub:"concentration" as IntelSub,anchor:"intel-chokepoints"})} className={`w-full text-left rounded-xl p-3 border bg-white ${TONE[cp.sev].bd}`}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-[12.5px] font-bold text-[#0f2644]">{cp.name}</span>
                  <Tag tone={cp.sev} title={`${cp.sev} severity`} termKey={`severity_${cp.sev}`} solid>{cp.sev}</Tag>
                </div>
                <div className="text-[11px] font-semibold text-slate-400 mb-1">{STAGE_NAME[cp.stage]}</div>
                <p className="text-[11.5px] text-slate-600 leading-snug line-clamp-2">{cp.desc}</p>
              </button>
            ))}
          </div>
          <KeyTakeaways points={[
            "<strong>All three high-severity chokepoints sit downstream</strong>: at pre-treatment, metallurgy, and refining, held by just two qualified operators.",
            "<strong>Certification is the moat</strong>: OEM qualification takes 12 to 24 months, making certified suppliers structurally hard to replace.",
          ]}/>
        </Card>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  VALUE CHAIN MAP TAB  (Stage Diagram + Stage Explorer)
// ════════════════════════════════════════════════════════════════════════════
const SIZE_KEY:Record<string,string>={"Large Enterprise":"company_size_large","SME":"company_size_sme","Startup":"company_size_startup"};
// Name → logo domain lookup (from COMPANIES), so the diagram can show real logos.
const LOGO_BY_NAME:Record<string,string|undefined>=Object.fromEntries(COMPANIES.map(c=>[c.n,(c as {logo?:string}).logo]));

function ValueChainMapTab({onProfile,seedStage}:{onProfile:(n:string)=>void;seedStage:string|null}){
  const d=VCA_DATA;
  const [sub,setSub]=useState<ChainMapSub>(seedStage?"explorer":"diagram");
  const [stageF,setStageF]=useState(seedStage||d.stages[0].id);
  const [roleF,setRoleF]=useState("all");
  const choke=new Set(d.chokepoints.map(c=>c.stage));
  const stageObj=d.stages.find(s=>s.id===stageF)!;
  const parts=d.participants[stageF]||[];
  const roles=Array.from(new Set(parts.map(p=>p.role)));
  const filtered=roleF==="all"?parts:parts.filter(p=>p.role===roleF);
  // Auto-fit: scroll only when stages are many; otherwise distribute evenly.
  const nStages=d.stages.length;
  const needsScroll=nStages>5;

  // Legend filter: only show role entries that have ≥2 distinct companies across
  // all stages — single-participant roles (Platform/Software, Input Provider) are
  // omitted because they add noise and can mislead on a topic like battery recycling.
  const shownRoles=(()=>{
    const cnt:Record<string,Set<string>>={};
    Object.values(d.participants).flat().forEach(p=>{ if(!cnt[p.role]) cnt[p.role]=new Set(); cnt[p.role].add(p.n); });
    return Object.keys(ROLE_NAME).filter(r=>(cnt[r]?.size||0)>1);
  })();

  return(
    <div className="space-y-5">
      {/* Sub-tab switch — accent colour on active, like TAL */}
      <div className="inline-flex bg-slate-100 rounded-xl p-1">
        {([["diagram","Stage Diagram","#2563EB"],["explorer","Stage Explorer","#7c3aed"]] as [ChainMapSub,string,string][]).map(([s,lbl,col])=>(
          <button key={s} onClick={()=>setSub(s)}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold transition-all"
            style={sub===s?{background:"white",color:col,boxShadow:"0 1px 3px rgba(0,0,0,.1)"}:{color:"#64748b"}}>
            {lbl}
          </button>
        ))}
      </div>

      {sub==="diagram"&&(
        <Card title="Value Chain Map" sub="Every participant positioned by stage, role, and tier. Click any company to open its profile.">
          <div className={needsScroll?"overflow-x-auto -mx-1 px-1 pb-1":""}>
            <div className={`flex gap-2 items-stretch ${needsScroll?"min-w-[1040px]":""}`}>
              {d.stages.map((s,si)=>{
                const sp=d.participants[s.id]||[]; const lead=sp.filter(p=>p.tier==="leading"); const emerg=sp.filter(p=>p.tier!=="leading");
                const isChoke=choke.has(s.id);
                return(
                  <div key={s.id} className="flex items-stretch gap-2 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                      {/* stage header with description */}
                      <div className="rounded-xl px-3 py-3 mb-3 bg-[#eff6ff] border border-[#bfdbfe] relative overflow-hidden">
                        {isChoke&&<div className="absolute top-0 right-0" style={{width:0,height:0,borderLeft:"20px solid transparent",borderTop:"20px solid #ef4444"}}/>}
                        <div className="text-[12.5px] font-bold text-[#0f2644] leading-tight mb-1 pr-3">{s.short}</div>
                        {/* Issue 7: short description inside header */}
                        <InfoTooltip title={s.name} text={s.fn}>
                          <p className="text-[9.5px] text-slate-500 leading-tight mb-2 cursor-help line-clamp-2">{s.fn.split(".")[0]}.</p>
                        </InfoTooltip>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <InfoTooltip title={cap(s.conc)+" concentration"} text={TERMS[`concentration_${s.conc}`]}>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white cursor-help ${TONE[s.conc].solid}`}>{cap(s.conc)}</span>
                          </InfoTooltip>
                          <InfoTooltip title={`Margin ${cap(s.margin)}`} text={TERMS[`margin_${s.margin}`]}>
                            <span className="text-[10px] cursor-help" style={{color:s.margin==="increasing"?"#ef4444":s.margin==="decreasing"?"#15b865":"#f59e0b"}}>{MARGIN_ICON[s.margin]}</span>
                          </InfoTooltip>
                          <span className="text-[10px] text-slate-500 ml-auto">{s.count} firms</span>
                        </div>
                      </div>
                      {/* participant pills with logos — role and description on separate lines */}
                      <div className="space-y-1.5">
                        {lead.map(p=>(
                          <InfoTooltip key={p.n} title={p.n} subtitle={ROLE_NAME[p.role]} text={clip(p.fn.split(".")[0])}>
                            <button onClick={()=>onProfile(p.n)} className="w-full text-left rounded-lg bg-white border border-slate-200 hover:border-[#1EDD7D] hover:shadow-sm transition-all px-2 py-2">
                              <div className="flex items-center gap-1.5 mb-1">
                                <CompanyLogo name={p.n} domain={LOGO_BY_NAME[p.n]} size={18}/>
                                <span className="truncate text-[11px] font-bold text-[#0f2644] flex-1">{p.n}</span>
                              </div>
                              <div className="flex items-center gap-1 pl-0.5">
                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background:roleDot(p.role)}}/>
                                <span className="text-[9.5px] font-semibold text-slate-500 truncate">{ROLE_NAME[p.role]}</span>
                              </div>
                            </button>
                          </InfoTooltip>
                        ))}
                        {emerg.map(p=>(
                          <InfoTooltip key={p.n} title={p.n} subtitle={ROLE_NAME[p.role]} text={clip(p.fn.split(".")[0])}>
                            <button onClick={()=>onProfile(p.n)} className="w-full text-left rounded-lg bg-slate-50 border border-slate-200 hover:border-[#1EDD7D] hover:shadow-sm transition-all px-2 py-2 opacity-85">
                              <div className="flex items-center gap-1.5 mb-1">
                                <CompanyLogo name={p.n} domain={LOGO_BY_NAME[p.n]} size={18}/>
                                <span className="truncate text-[11px] font-medium text-slate-600 flex-1">{p.n}</span>
                              </div>
                              <div className="flex items-center gap-1 pl-0.5">
                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-60" style={{background:roleDot(p.role)}}/>
                                <span className="text-[9.5px] font-medium text-slate-400 truncate">{ROLE_NAME[p.role]}</span>
                              </div>
                            </button>
                          </InfoTooltip>
                        ))}
                      </div>
                    </div>
                    {/* arrow between stages */}
                    {si<nStages-1&&(
                      <div className="flex items-start self-stretch flex-shrink-0 pt-[52px]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-slate-600"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* role legend — single-participant roles omitted to keep legend meaningful */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 pt-4 border-t border-slate-100">
            {shownRoles.map(r=>(
              <InfoTooltip key={r} title={ROLE_NAME[r]} text={TERMS[r]}>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 cursor-help"><span className="w-2 h-2 rounded-full" style={{background:roleDot(r)}}/>{ROLE_NAME[r]}</span>
              </InfoTooltip>
            ))}
          </div>
          <KeyTakeaways points={[
            "<strong>The chain narrows sharply downstream</strong>: broad participation at Collection and Dismantling collapses to two integrated operators by Refining.",
            "<strong>End-to-end control is rare</strong>: only Attero and Lohum span all five stages; most players cluster in the low-barrier upstream stages.",
          ]}/>
        </Card>
      )}

      {sub==="explorer"&&(
        <div className="space-y-5">
          {/* stage selector — accent colour on active */}
          <div className="flex gap-2 flex-wrap">
            {d.stages.map(s=>(
              <button key={s.id} onClick={()=>{setStageF(s.id);setRoleF("all");}}
                className="px-4 py-2 rounded-full text-[12px] font-semibold transition-all"
                style={stageF===s.id?{background:"#0f2644",color:"white"}:{background:"white",color:"#64748b",boxShadow:"inset 0 0 0 1px #e2e8f0"}}>
                {s.short}
              </button>
            ))}
          </div>
          {/* stage economics */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between flex-wrap gap-3">
              <div>
                
                <h3 className="text-[17px] font-semibold text-[#0f2644]">{stageObj.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <InfoTooltip title={cap(stageObj.conc)+" concentration"} text={TERMS[`concentration_${stageObj.conc}`]}>
                  <span className={`px-3 py-1.5 rounded-lg text-center cursor-help ${TONE[stageObj.conc].bg} ${TONE[stageObj.conc].bd} border`}>
                    <span className={`block text-[13px] font-bold ${TONE[stageObj.conc].t}`}>{cap(stageObj.conc)}</span>
                    <span className="block text-[9px] text-slate-400 tracking-wide">Concentration</span>
                  </span>
                </InfoTooltip>
                <InfoTooltip title={`Margin ${cap(stageObj.margin)}`} text={TERMS[`margin_${stageObj.margin}`]}>
                  <span className="px-3 py-1.5 rounded-lg text-center cursor-help bg-slate-50 border border-slate-200">
                    <span className="block text-[13px] font-bold text-[#0f2644]">{MARGIN_ICON[stageObj.margin]} {cap(stageObj.margin)}</span>
                    <span className="block text-[9px] text-slate-400 tracking-wide">Margin</span>
                  </span>
                </InfoTooltip>
                <span className="px-3 py-1.5 rounded-lg text-center bg-slate-50 border border-slate-200">
                  <span className="block text-[13px] font-bold text-[#0f2644]">{stageObj.count}</span>
                  <span className="block text-[9px] text-slate-400 tracking-wide">Participants</span>
                </span>
              </div>
            </div>
            {/* Issue 9: Function/Inputs/Outputs as a visual flow — INPUT → FUNCTION → OUTPUT */}
            <div className="p-5">
              <div className="flex items-stretch gap-2 mb-4">
                {/* Inputs */}
                <div className="flex-1 rounded-xl bg-slate-50 border border-slate-200 p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-6 h-6 rounded-md bg-slate-200 flex items-center justify-center flex-shrink-0">
                      <svg width="12" height="12" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M2 12l10-10 10 10"/></svg>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider">Inputs Received</span>
                  </div>
                  <p className="text-[12px] text-slate-600 leading-relaxed">{stageObj.inputs}</p>
                </div>
                {/* Arrow */}
                <div className="flex items-center flex-shrink-0 self-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                {/* Function (core transformation) */}
                <div className="flex-[1.4] rounded-xl bg-[#f0f9ff] border border-blue-200 p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg width="12" height="12" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 tracking-wider">What Happens Here</span>
                  </div>
                  <p className="text-[12px] text-slate-700 leading-relaxed font-medium">{stageObj.fn}</p>
                </div>
                {/* Arrow */}
                <div className="flex items-center flex-shrink-0 self-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                {/* Outputs */}
                <div className="flex-1 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-6 h-6 rounded-md bg-[#bbf7d0] flex items-center justify-center flex-shrink-0">
                      <svg width="12" height="12" fill="none" stroke="#15b865" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22V2M22 12l-10 10L2 12"/></svg>
                    </div>
                    <span className="text-[10px] font-bold text-[#15b865] tracking-wider">Outputs Delivered</span>
                  </div>
                  <p className="text-[12px] text-slate-600 leading-relaxed">{stageObj.outputs}</p>
                </div>
              </div>
              {/* Structural features full width */}
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <svg width="12" height="12" fill="none" stroke="#d97706" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 tracking-wider">Structural Features</span>
                </div>
                <p className="text-[12.5px] text-slate-700 leading-relaxed">{stageObj.features}</p>
              </div>
            </div>
          </div>
          {/* role filter + roster */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-[11px] font-bold text-slate-400 tracking-wide">Filter role:</span>
            <button onClick={()=>setRoleF("all")} className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${roleF==="all"?"bg-[#0f2644] text-white":"bg-white text-slate-500 border border-slate-200"}`}>All</button>
            {roles.map(r=>(
              <InfoTooltip key={r} title={ROLE_NAME[r]} text={TERMS[r]}>
                <button onClick={()=>setRoleF(roleF===r?"all":r)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold cursor-help ${roleF===r?"bg-[#0f2644] text-white":"bg-white text-slate-500 border border-slate-200"}`}>{ROLE_NAME[r]}</button>
              </InfoTooltip>
            ))}
          </div>
          {/* Issue 14: redesigned Stage Explorer participant roster */}
          {/* Tier legend */}
          <div className="flex items-center gap-4 px-1">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider">Participants</span>
            <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0f2644] text-white">Leading</span>
            <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-500">Emerging</span>
            <span className="ml-auto text-[11px] font-mono text-slate-400">{filtered.length} shown</span>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {filtered.map(p=>{
              const isLead=p.tier==="leading";
              const dot=roleDot(p.role);
              return(
              <button key={p.n} onClick={()=>onProfile(p.n)}
                className="text-left rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-[#1EDD7D] group">
                <div className="flex items-start gap-3 p-4">
                  <CompanyLogo name={p.n} domain={LOGO_BY_NAME[p.n]} size={36}/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className={`text-[13px] font-bold leading-tight ${isLead?"text-[#0f2644]":"text-slate-600"}`}>{p.n}</span>
                      <span className={`flex-shrink-0 inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${isLead?"bg-[#0f2644] text-white":"bg-slate-200 text-slate-500"}`}>{isLead?"Leading":"Emerging"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <InfoTooltip title={ROLE_NAME[p.role]} text={TERMS[p.role]}>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full cursor-help" style={{background:`${dot}18`,color:dot}}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{background:dot}}/>
                          {ROLE_NAME[p.role]}
                        </span>
                      </InfoTooltip>
                    </div>
                    <p className="text-[11.5px] text-slate-500 leading-relaxed line-clamp-2">{p.fn.split(".")[0]}.</p>
                  </div>
                </div>
                <div className="px-4 pb-3 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">{p.hq||""}</span>
                  <span className="text-[10px] font-bold text-[#15b865] opacity-0 group-hover:opacity-100 transition-opacity">Open profile →</span>
                </div>
              </button>
            );})}
          </div>
          {filtered.length===0&&<div className="text-center py-10 text-[13px] text-slate-400">No participants match this role filter.</div>}
          <KeyTakeaways points={[
            `<strong>${stageObj.short} carries ${cap(stageObj.conc).toLowerCase()} concentration</strong>: with ${stageObj.margin} margins shaping who can compete at this stage.`,
            `<strong>${stageObj.count} participants identified here</strong>: ${parts.filter(p=>p.tier==="leading").length} classed as leading; use the role filter to separate them from emerging entrants.`,
          ]}/>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  COMPANY EXPLORER TAB + PROFILE DRAWER
// ════════════════════════════════════════════════════════════════════════════
function roleAt(co:typeof COMPANIES[0],sid:string){ const h=(VCA_DATA.participants[sid]||[]).find(p=>p.n===co.n); return h?h.role:(co.stages.length>=3?"end_to_end_player":"operator_or_owner"); }
function fnAt(co:typeof COMPANIES[0],sid:string){ const h=(VCA_DATA.participants[sid]||[]).find(p=>p.n===co.n); return h?h.fn:""; }

function ProfileDrawer({co,onClose}:{co:(typeof COMPANIES[0]&{logo?:string})|null;onClose:()=>void}){
  const [pt,setPt]=useState<"profile"|"activity"|"network">("profile");
  if(!co) return null;
  const e2e=co.stages.length>=3;
  const hasNetwork=(co.partners&&co.partners.length>0)||(co.customers&&co.customers.length>0);
  const tabs:[typeof pt,string][]=[["profile","Profile"],["activity","Chain Activity"],...(hasNetwork?[["network","Network"] as [typeof pt,string]]:[])];
  return(
    <div className="fixed inset-0 z-[500] flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose}/>
      <div className="w-[640px] max-w-full bg-white flex flex-col h-full shadow-2xl">
        {/* header */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <CompanyLogo name={co.n} domain={co.logo} size={44}/>
              <div className="min-w-0">
                <h2 className="text-[20px] font-black text-[#0f2644] leading-tight truncate">{co.n}</h2>
                <div className="flex items-center gap-1.5 text-[12px] text-slate-400 mt-0.5">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span className="truncate">{co.hq}</span><span>·</span><span>Est. {co.yr}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 flex-shrink-0"><svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
          </div>
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <InfoTooltip title={co.size} text={TERMS[SIZE_KEY[co.size]]||""}><span className="text-[11px] font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-600 tracking-wide cursor-help">{co.size}</span></InfoTooltip>
            {e2e&&<InfoTooltip title="End-to-End Player" text={TERMS.end_to_end_player}><span className="text-[11px] font-bold px-2.5 py-1 rounded bg-[#f0fdf4] text-[#15b865] border border-[#bbf7d0] tracking-wide cursor-help">End-to-End · {co.stages.length} stages</span></InfoTooltip>}
          </div>
          {/* sub-tabs */}
          <div className="flex gap-0 -mb-3">
            {tabs.map(([id,label])=>(
              <button key={id} onClick={()=>setPt(id)} className={`px-4 py-2 text-[13px] font-medium border-b-2 transition-colors ${pt===id?"border-[#1EDD7D] text-[#0f2644]":"border-transparent text-slate-400 hover:text-slate-600"}`}>{label}</button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {pt==="profile"&&(
            <div className="space-y-6">
              <p className="text-[14px] text-[#0f2644] italic leading-relaxed border-l-2 border-slate-200 pl-4">{co.summary}</p>
              {co.dir&&(<div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4"><p className="text-[10px] font-bold text-[#15b865] tracking-wider mb-1.5">Strategic Direction</p><p className="text-[12.5px] text-emerald-900 leading-relaxed">{co.dir}</p></div>)}
              {co.reach&&(<div><p className="text-[10px] font-bold text-slate-400 tracking-wider mb-2">Geographic Reach</p><p className="text-[12.5px] text-slate-600 leading-relaxed">{co.reach}</p></div>)}
              <div>
                <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-2">Forward Signals</p>
                {co.signals?(<div className="space-y-2">{co.signals.map((sig,i)=>(<div key={i} className="flex gap-2.5 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-3 py-2.5"><span className="text-[12px] text-[#15b865] flex-shrink-0 mt-0.5">◆</span><span className="text-[12.5px] text-emerald-900 leading-relaxed">{sig}</span></div>))}</div>):(<p className="text-[12px] text-slate-400">No verifiable forward signals within the 24-month window.</p>)}
              </div>
            </div>
          )}

          {pt==="activity"&&(
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-2">Chain Presence</p>
                <div className="flex gap-1 mb-3">
                  {VCA_DATA.stages.map(s=>{ const on=co.stages.includes(s.id); return(
                    <InfoTooltip key={s.id} title={s.name} text={on?"Active at this stage.":"Not active at this stage."}><div className="flex-1 h-1.5 rounded-full" style={{background:on?"#1EDD7D":"#e2e8f0"}}/></InfoTooltip>
                  );})}
                </div>
                <div className="space-y-2">
                  {co.stages.map(sid=>{
                    const role=roleAt(co,sid); const fn=fnAt(co,sid);
                    // Issue 12: never show end_to_end_player tag in chain activity — use the specific stage role or a functional label
                    const displayRole=role==="end_to_end_player"?"operator_or_owner":role;
                    return(
                    <div key={sid} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div className="flex items-center justify-between gap-2 mb-1"><span className="text-[12px] font-bold text-[#0f2644]">{STAGE_NAME[sid]}</span><Tag title={ROLE_NAME[displayRole]} termKey={displayRole}>{ROLE_NAME[displayRole]}</Tag></div>
                      {fn&&<p className="text-[12px] text-slate-500 leading-relaxed">{fn}</p>}
                    </div>
                  );})}
                </div>
              </div>
            </div>
          )}

          {pt==="network"&&(
            <div className="space-y-6">
              {co.partners&&co.partners.length>0&&(
                <div>
                  <InfoTooltip title="Relationship Type" text={TERMS.relationship_type}><p className="text-[10px] font-bold text-slate-400 tracking-wider mb-2 cursor-help inline-block">Key Partners</p></InfoTooltip>
                  <div className="space-y-2">
                    {co.partners.map((p,i)=>(
                      <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="flex items-center justify-between gap-2 mb-1 flex-wrap"><span className="text-[12.5px] font-bold text-[#0f2644]">{p.p}</span><span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-500">{p.t}</span></div>
                        <InfoTooltip title="What They Exchange" text={TERMS.what_they_exchange}><p className="text-[12px] text-slate-500 leading-relaxed cursor-help">{p.exchange}</p></InfoTooltip>
                        {p.txn&&<InfoTooltip title="Known Transactions" text={TERMS.known_transactions}><div className="mt-2 inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded bg-[#0f2644] text-[#1EDD7D] cursor-help">◆ {p.txn}</div></InfoTooltip>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {co.customers&&co.customers.length>0&&(
                <div>
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-2">Key Customers</p>
                  <div className="space-y-2">{co.customers.map((c,i)=>(<div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100"><span className="text-[12.5px] font-bold text-[#0f2644] block mb-1">{c.c}</span><p className="text-[12px] text-slate-500 leading-relaxed">{c.what}</p>{c.txn&&<div className="mt-2 inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded bg-[#0f2644] text-[#1EDD7D]">◆ {c.txn}</div>}</div>))}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CompanyExplorerTab({onProfile}:{onProfile:(n:string)=>void}){
  const d=VCA_DATA;
  const [sizeF,setSizeF]=useState("all"); const [stageF,setStageF]=useState("all");
  const sizes=Array.from(new Set(d.companies.map(c=>c.size)));
  let list=d.companies.slice();
  if(sizeF!=="all") list=list.filter(c=>c.size===sizeF);
  if(stageF!=="all") list=list.filter(c=>c.stages.includes(stageF));
  return(
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-[11px] font-bold text-slate-400 tracking-wide">Size:</span>
        <button onClick={()=>setSizeF("all")} className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${sizeF==="all"?"bg-[#0f2644] text-white":"bg-white text-slate-500 border border-slate-200"}`}>All</button>
        {sizes.map(s=>(<InfoTooltip key={s} title={s} text={TERMS[SIZE_KEY[s]]||""}><button onClick={()=>setSizeF(sizeF===s?"all":s)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold cursor-help ${sizeF===s?"bg-[#0f2644] text-white":"bg-white text-slate-500 border border-slate-200"}`}>{s}</button></InfoTooltip>))}
        <span className="text-[11px] font-bold text-slate-400 tracking-wide ml-3">Stage:</span>
        <button onClick={()=>setStageF("all")} className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${stageF==="all"?"bg-[#0f2644] text-white":"bg-white text-slate-500 border border-slate-200"}`}>All</button>
        {d.stages.map(s=>(<button key={s.id} onClick={()=>setStageF(stageF===s.id?"all":s.id)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${stageF===s.id?"bg-[#0f2644] text-white":"bg-white text-slate-500 border border-slate-200"}`}>{s.short}</button>))}
        <span className="ml-auto text-[11px] font-mono text-slate-400">{list.length} of {d.companies.length}</span>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map(co=>{ const e2e=co.stages.length>=3; return(
          <button key={co.n} onClick={()=>onProfile(co.n)} className="text-left bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-[#1EDD7D] hover:shadow-sm transition-all">
            <div className="px-5 pt-4 pb-3">
              <div className="flex items-start gap-3 mb-2.5">
                <CompanyLogo name={co.n} domain={(co as {logo?:string}).logo} size={38}/>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15px] font-bold text-[#0f2644] leading-tight truncate">{co.n}</h3>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span className="truncate">{co.hq}</span>
                  </div>
                </div>
                {e2e&&<span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#f0fdf4] text-[#15b865] border border-[#bbf7d0] flex-shrink-0">End-to-End</span>}
              </div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{co.size}</span>
                <span className="text-[10px] text-slate-400">Est. {co.yr}</span>
              </div>
              <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-3">{co.summary}</p>
            </div>
            <div className="px-5 py-3 border-t border-slate-100">
              <div className="flex gap-1 mb-2">{d.stages.map(s=>(<div key={s.id} className="flex-1 h-1.5 rounded-full" style={{background:co.stages.includes(s.id)?"#1EDD7D":"#e2e8f0"}}/>))}</div>
              <div className="flex items-center justify-between"><span className="text-[10px] text-slate-400">{co.stages.length} of {d.stages.length} stages</span><span className="text-[10.5px] font-bold text-[#15b865]">Open profile →</span></div>
            </div>
          </button>
        );})}
      </div>
      <KeyTakeaways points={[
        "<strong>Two companies span the entire chain</strong>: of 18 profiled, only Attero and Lohum operate across all five stages; every other player concentrates in one or two.",
        "<strong>Lead recyclers dominate the downstream count</strong>: established lead operators hold metallurgy and refining, while Li-ion-capable downstream operators remain scarce.",
      ]}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  INTELLIGENCE TAB
// ════════════════════════════════════════════════════════════════════════════
function PowerDynamicsTab({sub,setSub}:{sub:IntelSub;setSub:(s:IntelSub)=>void}){
  const d=VCA_DATA;
  const [open,setOpen]=useState<string|null>(null);
  return(
    <div className="space-y-5">
      <div className="inline-flex bg-slate-100 rounded-xl p-1">
        {([
          ["concentration","Concentration & Chokepoints","#ea580c","Concentration measures how tightly a stage is controlled by a small number of players. Chokepoints are positions where a few operators control something the downstream chain depends on."],
          ["shifts","Structural Shifts","#7c3aed","Regulatory changes, vertical integration moves, new platforms, or market restructuring that are actively reshaping who can participate and on what terms."],
        ] as [IntelSub,string,string,string][]).map(([k,l,col,tip])=>(
          <InfoTooltip key={k} title={l} text={tip}>
            <button onClick={()=>setSub(k)}
              className="px-4 py-2 rounded-lg text-[13px] font-semibold transition-all cursor-help"
              style={sub===k?{background:"white",color:col,boxShadow:"0 1px 3px rgba(0,0,0,.1)"}:{color:"#64748b"}}>
              {l}
            </button>
          </InfoTooltip>
        ))}
      </div>

      {sub==="concentration"&&(
        <div className="space-y-5">
          <Card title="Concentration & Margin Map" sub="How tightly each stage is controlled, and which way margins are moving">
            {/* Header row: auto-fits any number of stages */}
            <div className="grid gap-px mb-1" style={{gridTemplateColumns:`repeat(${d.stages.length},minmax(0,1fr))`}}>
              {d.stages.map(s=>(<div key={s.id} className="text-center"><div className="text-[11px] font-bold text-[#0f2644] px-1 py-1 leading-tight">{s.short}</div></div>))}
            </div>
            {/* Concentration row: equal height tiles */}
            <div className="grid gap-px rounded-xl overflow-hidden border border-slate-200" style={{gridTemplateColumns:`repeat(${d.stages.length},minmax(0,1fr))`}}>
              {d.stages.map(s=>(
                <InfoTooltip key={s.id} className="block w-full" title={cap(s.conc)+" concentration"} text={TERMS[`concentration_${s.conc}`]}>
                  <div className={`w-full flex flex-col items-center justify-center cursor-help py-5 px-1`} style={{background:s.conc==="high"?"#fca5a5":s.conc==="moderate"?"#fde68a":"#86efac"}}>
                    <span className="text-[16px] font-black leading-none" style={{color:s.conc==="high"?"#991b1b":s.conc==="moderate"?"#92400e":"#166534"}}>{cap(s.conc)}</span>
                    <span className="text-[10px] mt-1 text-center leading-tight" style={{color:s.conc==="high"?"#991b1b":s.conc==="moderate"?"#92400e":"#166534"}}>{s.count} firms</span>
                  </div>
                </InfoTooltip>
              ))}
            </div>
            {/* Margin row */}
            <div className="grid gap-px mt-1" style={{gridTemplateColumns:`repeat(${d.stages.length},minmax(0,1fr))`}}>
              {d.stages.map(s=>(
                <InfoTooltip key={s.id} className="block w-full" title={`Margin: ${cap(s.margin)}`} text={TERMS[`margin_${s.margin}`]}>
                  <div className="w-full flex items-center justify-center gap-1 py-2 cursor-help">
                    <span className="text-[13px]" style={{color:s.margin==="increasing"?"#ef4444":s.margin==="decreasing"?"#15b865":"#f59e0b"}}>{MARGIN_ICON[s.margin]}</span>
                    <span className="text-[11px] font-semibold text-slate-600">{cap(s.margin)}</span>
                  </div>
                </InfoTooltip>
              ))}
            </div>
            {/* Margin direction legend — maps colour to direction explicitly */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider">Margin Direction:</span>
              <span className="text-[10.5px] font-semibold" style={{color:"#ef4444"}}>▲ Rising</span>
              <span className="text-[10.5px] font-semibold" style={{color:"#f59e0b"}}>▬ Stable</span>
              <span className="text-[10.5px] font-semibold" style={{color:"#15b865"}}>▼ Compressing</span>
            </div>

            <p className="text-[12px] text-slate-500 mt-3 leading-relaxed">Concentration reflects structural advantage, not headcount. The final three stages run high-concentration despite 9 to 10 participants because capital, IP, and permitting gate real capability.</p>

            {/* Per-stage rationale: structural reason behind each concentration + margin reading */}
            <div className="mt-4 rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                <p className="text-[12px] font-bold text-[#0f2644]">Why each stage sits where it does</p>
                <p className="text-[11px] text-slate-400 mt-0.5">The structural reason behind each concentration and margin reading.</p>
              </div>
              <div className="divide-y divide-slate-100">
                {d.stages.map(s=>{ const r=STAGE_RATIONALE[s.id]; if(!r) return null; return(
                  <div key={s.id} className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[12.5px] font-bold text-[#0f2644]">{s.short}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
                        style={{background:s.conc==="high"?"#ef4444":s.conc==="moderate"?"#f59e0b":"#1EDD7D"}}>
                        {cap(s.conc)} concentration
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{background:s.margin==="increasing"?"#fee2e2":s.margin==="decreasing"?"#dcfce7":"#fef3c7",
                                color:s.margin==="increasing"?"#dc2626":s.margin==="decreasing"?"#16a34a":"#d97706"}}>
                        {MARGIN_ICON[s.margin]}&nbsp;Margin {s.margin==="increasing"?"rising":s.margin==="decreasing"?"compressing":"stable"}
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex gap-2">
                        <span className="text-[9px] font-bold text-slate-400 tracking-wide mt-0.5 flex-shrink-0 w-[80px]">Concentration</span>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed flex-1">{r.conc}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[9px] font-bold text-slate-400 tracking-wide mt-0.5 flex-shrink-0 w-[80px]">Margin</span>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed flex-1">{r.margin}</p>
                      </div>
                    </div>
                  </div>
                );})}
              </div>
            </div>

            <KeyTakeaways points={[
              "<strong>Concentration is structural, not headcount</strong>: the final three stages stay high-concentration despite 9 to 10 participants each.",
              "<strong>High concentration meets compressing margins</strong>: at Metallurgy and Refining, the qualified few hold pricing power new entrants cannot reach.",
            ]}/>
          </Card>

          <Card id="intel-chokepoints" title="Chokepoints" sub="Single points of control the downstream chain depends on"
            action={<InfoTooltip title="Chokepoint" text={TERMS.chokepoint}><span className="inline-flex items-center gap-1 text-[12px] font-semibold text-slate-500 cursor-help">Chokepoints <svg width="12" height="12" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></span></InfoTooltip>}>
            <div className="grid md:grid-cols-2 gap-3">
              {d.chokepoints.map(cp=>(
                <div key={cp.id} className={`rounded-xl p-4 border bg-white ${TONE[cp.sev].bd}`}>
                  <div className="flex items-start justify-between gap-2 mb-1"><h4 className="text-[14px] font-bold text-[#0f2644]">{cp.name}</h4><Tag tone={cp.sev} title={`${cp.sev} severity`} termKey={`severity_${cp.sev}`} solid>{cp.sev}</Tag></div>
                  <div className="text-[11px] font-semibold text-slate-400 mb-2">{STAGE_NAME[cp.stage]}</div>
                  {(cp as {sev_rationale?:string}).sev_rationale&&(
                    <p className="text-[11.5px] text-slate-500 italic leading-relaxed mb-2">{(cp as {sev_rationale?:string}).sev_rationale}</p>
                  )}
                  <p className="text-[12px] text-slate-600 leading-relaxed mb-2.5">{cp.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-2">{cp.entities.map(e=><span key={e} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#14532d] border border-[#86efac]">{e}</span>)}</div>
                  <div className="flex flex-wrap items-center gap-1.5"><span className="text-[9.5px] text-slate-400 tracking-wide">Affects:</span>{cp.downstream.map(ds=><span key={ds} className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-500">{ds}</span>)}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card id="intel-deps" title="Structural Dependencies"
            action={<InfoTooltip title="Structural Dependency" text={TERMS.structural_dependency}><span className="inline-flex items-center gap-1 text-[12px] font-semibold text-slate-500 cursor-help">Structural Dependencies <svg width="12" height="12" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></span></InfoTooltip>}>
            <div className="space-y-2">
              {d.dependencies.map(dep=>(
                <div key={dep.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  {/* Stage pair row */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-md bg-[#0f2644] text-white whitespace-nowrap">{STAGE_SHORT[dep.from]}</span>
                    <svg width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M0 5h14M10 1l4 4-4 4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-md bg-[#0f2644] text-white whitespace-nowrap">{STAGE_SHORT[dep.to]}</span>
                    <div className="ml-auto">
                      <InfoTooltip title={"Substitution difficulty: "+cap(dep.diff)} text={TERMS[`substitution_${dep.diff}`]}>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border cursor-help ${TONE[dep.diff].bg} ${TONE[dep.diff].t} ${TONE[dep.diff].bd}`}>{cap(dep.diff)} substitution</span>
                      </InfoTooltip>
                    </div>
                  </div>
                  {/* Description on its own line, no overflow */}
                  <p className="text-[12.5px] text-slate-600 leading-relaxed">{dep.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {sub==="shifts"&&(
        <div id="intel-shifts" className="space-y-3 scroll-mt-6">
          {d.shifts.map(sh=>{ const isOpen=open===sh.id; const sc=SHIFT_CLR[sh.type]; return(
            <div key={sh.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <button onClick={()=>setOpen(isOpen?null:sh.id)} className="w-full text-left flex items-stretch">
                {/* Structural left accent bar — no floating, always aligned */}
                <div className="w-1 flex-shrink-0 rounded-l-2xl" style={{background:sc.accent}}/>
                <div className="flex-1 px-5 py-4 min-w-0">
                  {/* Row 1: type badge + impact + direction */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <InfoTooltip title={SHIFT_LABEL[sh.type]} text={TERMS[sh.type]||""}>
                      <span className="inline-flex text-[10.5px] font-bold px-2.5 py-1 rounded-full cursor-help whitespace-nowrap" style={{background:`${sc.accent}18`,color:sc.accent}}>{SHIFT_LABEL[sh.type]}</span>
                    </InfoTooltip>
                    <Tag tone={sh.impact} title={`${sh.impact} impact on the chain`} termKey={`impact_${sh.impact}`}>{sh.impact} impact</Tag>
                    <InfoTooltip title={cap(sh.dir)+" direction"} text={TERMS[`direction_${sh.dir}`]}>
                      <span className="inline-flex text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-500 cursor-help whitespace-nowrap">{cap(sh.dir)}</span>
                    </InfoTooltip>
                  </div>
                  {/* Row 2: headline — always on its own line, full width */}
                  <p className="text-[13px] font-medium text-[#0f2644] leading-snug">{sh.headline}</p>
                  {(sh as {impact_rationale?:string}).impact_rationale&&(
                    <p className="text-[11.5px] text-slate-500 leading-relaxed mt-1.5 italic">{(sh as {impact_rationale?:string}).impact_rationale}</p>
                  )}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {sh.stages.map(sid=><span key={sid} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{STAGE_NAME[sid]}</span>)}
                  </div>
                </div>
                <div className="flex items-center pr-4 flex-shrink-0">
                  <span className="text-[13px] text-slate-400 transition-transform" style={{transform:isOpen?"rotate(180deg)":"none"}}>▾</span>
                </div>
              </button>
              {isOpen&&(
                <div className="px-6 pb-4 pt-1 ml-1 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-500 mb-2.5 mt-3">Impact by stage</p>
                  <div className="space-y-2 mb-4">{sh.stage_impacts.map(si=>(<div key={si.stage_id} className="bg-slate-50 rounded-xl p-3 border border-slate-100"><div className="flex items-center gap-2 mb-1"><span className="text-[11.5px] font-bold text-[#0f2644]">{si.stage_name}</span></div><p className="text-[12px] text-slate-500 leading-relaxed">{si.desc}</p></div>))}</div>
                  <p className="text-[11px] font-bold text-slate-500 mb-2">Named companies</p>
                  <div className="flex flex-wrap gap-1.5">{sh.entities.map(e=><span key={e} className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-[#f0fdf4] text-[#15b865] border border-[#bbf7d0]">{e}</span>)}</div>
                </div>
              )}
            </div>
          );})}
          <KeyTakeaways points={[
            "<strong>Vertical integration is the dominant force</strong>: three of six shifts (Reliance, Amara Raja, the Attero/Lohum stage compression) pull pre-treatment through refining in-house.",
            "<strong>Regulation sets the demand floor</strong>: the 2024 Battery Waste rules mandate 90% recovery by 2026-27 and recycled content from FY 2027-28, favouring certified operators.",
          ]}/>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  OPPORTUNITIES TAB
// ════════════════════════════════════════════════════════════════════════════
const EV_META:Record<string,{label:string;sub:string;tone:string}>={
  high:{label:"High Evidence",sub:"Direct, converging chain signal",tone:"low"},
  medium:{label:"Medium Evidence",sub:"Conditional on key assumptions",tone:"medium"},
  low:{label:"Lower Evidence",sub:"Indirect or single-sourced",tone:"high"},
};
function OpportunitiesTab(){
  const d=VCA_DATA;
  const [evF,setEvF]=useState("all"); const [typeF,setTypeF]=useState("all"); const [open,setOpen]=useState<string|null>(null);
  const types=Array.from(new Set(d.opportunities.map(o=>o.type)));
  let list=d.opportunities.slice();
  if(evF!=="all") list=list.filter(o=>o.ev===evF);
  if(typeF!=="all") list=list.filter(o=>o.type===typeF);
  const counts={high:d.opportunities.filter(o=>o.ev==="high").length,medium:d.opportunities.filter(o=>o.ev==="medium").length,low:d.opportunities.filter(o=>o.ev==="low").length};
  return(
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-[#f0fdf4] to-[#f0f9ff] border border-[#bbf7d0] rounded-2xl p-4">
        <p className="text-[13px] text-slate-600 leading-relaxed"><strong className="text-[#0f2644]">Directional signals, not investment advice.</strong> Each opening below is a position where a new entrant could capture value, traced back to specific evidence from the participant, concentration, and shift analyses, and rated by analytical confidence.</p>
      </div>

      {/* evidence filter cards */}
      <div className="grid grid-cols-3 gap-3">
        {(["high","medium","low"] as const).map(ev=>{ const m=EV_META[ev]; const on=evF===ev; const tc=TONE[m.tone]; return(
          <InfoTooltip key={ev} title={m.label} text={TERMS[`analytical_confidence_${ev}`]||""}>
            <button onClick={()=>setEvF(on?"all":ev)} className={`w-full text-left rounded-2xl p-4 border transition-all cursor-help ${on?`${tc.bg} ${tc.bd} shadow-sm`:"bg-white border-slate-200 hover:border-slate-300"}`}>
              <div className="flex items-center justify-between mb-1.5"><span className={`text-[28px] font-black leading-none ${on?tc.t:"text-[#0f2644]"}`}>{counts[ev]}</span>{on&&<span className={`text-[9px] font-bold px-2 py-0.5 rounded-full text-white ${tc.solid}`}>Filtered</span>}</div>
              <div className={`text-[12px] font-bold mb-0.5 ${on?tc.t:"text-[#0f2644]"}`}>{m.label}</div>
              <div className="text-[11px] text-slate-400">{m.sub}</div>
            </button>
          </InfoTooltip>
        );})}
      </div>

      {/* type filter */}
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-[11px] font-bold text-slate-400 tracking-wide">Type:</span>
        <button onClick={()=>setTypeF("all")} className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${typeF==="all"?"bg-[#0f2644] text-white":"bg-white text-slate-500 border border-slate-200"}`}>All</button>
        {types.map(t=>(<InfoTooltip key={t} title={OPP_TYPE_LABEL[t]} text={TERMS[t]||""}><button onClick={()=>setTypeF(typeF===t?"all":t)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold cursor-help ${typeF===t?"bg-[#0f2644] text-white":"bg-white text-slate-500 border border-slate-200"}`}>{OPP_TYPE_LABEL[t]}</button></InfoTooltip>))}
        <span className="ml-auto text-[11px] font-mono text-slate-400">{list.length} openings</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {list.map(op=>{ const m=EV_META[op.ev]; const tc=TONE[m.tone]; const isOpen=open===op.id; return(
          <div key={op.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden" style={{borderTopWidth:3,borderTopColor:tc.solid.includes("red")?"#ef4444":tc.solid.includes("amber")?"#f59e0b":"#1EDD7D"}}>
            <div className="px-5 pt-4 pb-3">
              <div className="flex items-start justify-between gap-3 mb-2.5"><h3 className="text-[15px] font-bold text-[#0f2644] leading-snug">{op.label}</h3><InfoTooltip title={m.label} text={TERMS[`analytical_confidence_${op.ev}`]||""}><span className={`flex-shrink-0 text-[9.5px] font-bold px-2.5 py-1 rounded-full cursor-help ${tc.bg} ${tc.t}`}>{m.label}</span></InfoTooltip></div>
              <div className="flex gap-1.5 mb-3 flex-wrap items-center">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-500">{op.stage}</span>
                <InfoTooltip title={OPP_TYPE_LABEL[op.type]} text={TERMS[op.type]||""}><span className="cursor-help"><Tag>{OPP_TYPE_LABEL[op.type]}</Tag></span></InfoTooltip>
                <InfoTooltip title={ENTRY_LABEL[op.entry]||op.entry} text={TERMS[op.entry]||""}><span className="cursor-help"><Tag tone="low">{ENTRY_LABEL[op.entry]||op.entry}</Tag></span></InfoTooltip>
              </div>
              <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-3 mb-3"><div className="text-[10px] font-bold text-[#2563eb] tracking-wide mb-1.5">Chain Evidence</div><p className="text-[12px] text-[#1e3a5f] leading-relaxed">{op.evidence}</p></div>
              <button onClick={()=>setOpen(isOpen?null:op.id)} className="w-full text-[11px] font-bold text-slate-500 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors tracking-wide">{isOpen?"Hide viability conditions ▲":"Show viability conditions ▾"}</button>
            </div>
            {isOpen&&(<div className="px-5 pb-4 pt-3 bg-slate-50 border-t border-slate-100"><p className="text-[10px] font-bold text-slate-400 tracking-wider mb-2.5">Necessary Conditions for Viability</p><div className="space-y-2">{op.conds.map((c,i)=>(<div key={i} className="flex gap-3 bg-white rounded-xl px-3 py-2.5 border border-slate-100"><span className="text-[14px] font-black text-[#15b865] leading-none">{i+1}</span><p className="text-[12px] text-slate-600 leading-relaxed">{c}</p></div>))}</div></div>)}
          </div>
        );})}
      </div>
      {list.length===0&&<div className="text-center py-16 text-[13px] text-slate-400">No openings match the selected filters.</div>}
      <KeyTakeaways points={[
        "<strong>The strongest opportunities sit at the certified-supply chokepoints</strong>: both high-evidence opportunities target Refining and OEM qualification, where only two domestic suppliers exist and FY 2027-28 mandates guarantee demand.",
        "<strong>Integration beats standalone entry downstream</strong>: with stage compression collapsing Pre-treatment into Metallurgy, the viable entries pair black-mass capacity with downstream recovery.",
      ]}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  APP SHELL
// ════════════════════════════════════════════════════════════════════════════
export default function ValueChainAnalysis(){
  const [tab,setTab]=useState<MainTab>("overview");
  const [intelSub,setIntelSub]=useState<IntelSub>("concentration");
  const [profileName,setProfileName]=useState<string|null>(null);
  const [seedStage,setSeedStage]=useState<string|null>(null);
  const profileCo=profileName?VCA_DATA.companies.find(c=>c.n===profileName)||null:null;

  const navTo=(t:MainTab,o?:{intelSub?:IntelSub;anchor?:string})=>{
    setTab(t); if(o?.intelSub) setIntelSub(o.intelSub);
    if(o?.anchor){ let n=0; const tryScroll=()=>{ const el=document.getElementById(o.anchor!); if(el){el.scrollIntoView({behavior:"smooth",block:"start"});} else if(n++<12){setTimeout(tryScroll,60);} }; setTimeout(tryScroll,80); }
  };
  const goStage=(id:string)=>{ setSeedStage(id); setTab("chainmap"); };

  return(
    <div className="flex flex-col min-h-screen bg-[#f4f6f9] font-sans overflow-hidden" style={{fontFamily:"system-ui,-apple-system,Segoe UI,Roboto,sans-serif"}}>

      {/* ── GLOBAL HEADER ── */}
      <header className="bg-white border-b border-slate-200 px-8 h-14 flex items-center justify-between sticky top-0 z-[200] shadow-[0_1px_4px_rgba(0,0,0,.06)] flex-shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0f2644] to-[#1a4a7a] flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
            </div>
            <div>
              <div className="text-[15px] font-black text-[#0f2644] leading-none">CHESZ</div>
              <div className="text-[10px] font-medium text-slate-400 leading-none mt-0.5">Market Intelligence Platform</div>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[.07em] px-2 py-0.5 rounded-md bg-[#edfdf5] border border-[#a7f3d0] text-[#15b865]">Value Chain Analysis</span>
        </div>
        <div className="flex items-center gap-2">
          {["Tour","Help"].map(l=>(
            <button key={l} className="px-3 py-1.5 rounded-lg text-[13px] font-medium text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors">{l}</button>
          ))}
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0f2644] to-[#1a4a7a] flex items-center justify-center text-[11px] font-extrabold text-white">NT</div>
        </div>
      </header>

      {/* ── Body: sidebar + main column ── */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-56px)]">

        {/* ── LEFT SIDEBAR ── */}
        <aside className="w-[210px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col z-[80] overflow-y-auto h-[calc(100vh-56px)]">
          <nav className="flex-1 p-2.5 flex flex-col gap-0.5">
            {SIDEBAR_ITEMS.map((item, i) => {
              const isActive = tab === item.tab;
              return (
                <button key={i} onClick={() => setTab(item.tab)}
                  className={`flex items-center gap-2.5 py-2 rounded-lg text-[13px] w-full text-left transition-all border-l-[3px] ${
                    isActive
                      ? "bg-[#edfdf5] text-[#15b865] font-semibold border-[#1EDD7D] pl-[9px] pr-3"
                      : "text-slate-400 font-medium border-transparent px-3 hover:bg-slate-50 hover:text-slate-700"
                  }`}>
                  <span className={isActive ? "opacity-100" : "opacity-70"}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="h-px my-2 mx-2.5 bg-slate-200"/>
            {[
              { label: "Settings", icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg> },
              { label: "Export",   icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> },
            ].map((item, i) => (
              <button key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-slate-400 w-full text-left border-l-[3px] border-transparent hover:bg-slate-50 hover:text-slate-700 transition-all">
                <span className="opacity-70">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          {/* Credits footer */}
          <div className="p-3 border-t border-slate-200 flex-shrink-0">
            <div className="rounded-[10px] p-3 border-[1.5px] border-slate-200 bg-[#f4f6f9]">
              <div className="flex items-center gap-1.5 mb-2">
                <svg width="13" height="13" fill="none" stroke="#1EDD7D" strokeWidth="2.5" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <span className="text-[13px] font-bold text-[#0f2644]">Credits</span>
              </div>
              <div className="flex justify-between mb-1.5">
                <span className="text-[11px] font-medium text-slate-400">Used</span>
                <span className="text-[9px] font-semibold text-slate-500">20954/30000</span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden bg-slate-200 mb-1.5">
                <div className="h-full w-[69.8%] rounded-full bg-[#1EDD7D]"/>
              </div>
              <div className="text-[11px] text-center font-medium text-slate-400">9046 remaining</div>
            </div>
          </div>
        </aside>

        {/* ── MAIN COLUMN ── */}
        <div className="flex flex-col flex-1 overflow-hidden min-w-0 h-[calc(100vh-56px)]">

          {/* Project title bar */}
          <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between gap-4 shadow-[0_1px_3px_rgba(0,0,0,.05)]">
            <div className="min-w-0">
              <div className="text-[15px] font-bold text-[#0f2644] truncate">Value Chain Analysis — {VCA_DATA.meta.domain} · {VCA_DATA.meta.geography}</div>
              <div className="text-[12px] text-slate-400 mt-0.5">{VCA_DATA.meta.stageCount} stages · {VCA_DATA.meta.companyCount} companies · {VCA_DATA.meta.chokepoints ?? 4} chokepoints · {VCA_DATA.meta.shifts ?? 6} structural shifts</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[12px] font-semibold text-[#2563eb] hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Share
              </button>
              <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[12px] font-semibold text-[#2563eb] hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download
              </button>
            </div>
          </div>

          {/* NAV TABS */}
          <nav className="flex-shrink-0 bg-white border-b border-slate-200 px-6 flex overflow-x-auto shadow-[0_1px_4px_rgba(0,0,0,.04)]">
            {SIDEBAR_ITEMS.map(item => (
              <button key={item.tab} onClick={() => setTab(item.tab)}
                className={`px-5 py-3 flex items-center gap-1.5 text-[13px] font-medium transition-all whitespace-nowrap border-b-[3px] flex-shrink-0 ${
                  tab === item.tab
                    ? "text-[#1EDD7D] border-[#1EDD7D] font-bold"
                    : "text-slate-500 border-transparent hover:text-slate-700"
                }`}>
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* SCROLLABLE CONTENT */}
          <main className="flex-1 overflow-y-auto px-6 py-5">
            <div className="max-w-[1180px] mx-auto">
              {tab==="overview"&&<OverviewTab onNav={navTo} onStage={goStage}/>}
              {tab==="chainmap"&&<><TabPageHeader id="chainmap"/><ValueChainMapTab onProfile={setProfileName} seedStage={seedStage}/></>}
              {tab==="companies"&&<><TabPageHeader id="companies"/><CompanyExplorerTab onProfile={setProfileName}/></>}
              {tab==="power_dynamics"&&<><TabPageHeader id="power_dynamics"/><PowerDynamicsTab sub={intelSub} setSub={setIntelSub}/></>}
              {tab==="opportunities"&&<><TabPageHeader id="opportunities"/><OpportunitiesTab/></>}
            </div>
          </main>

        </div>
      </div>

      <ProfileDrawer co={profileCo} onClose={()=>setProfileName(null)}/>
    </div>
  );
}
