import React, { useState, useEffect, useRef, FC } from "react";
import * as d3 from "d3";

// ═══════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════
// SIGNIFICANCE TYPE HOVER DESCRIPTIONS
// ═══════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════
// PATTERN HOVER DESCRIPTIONS
// ═══════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════
const SUBDOMAINS = [{
  id: "sd1",
  name: "Software Engineering Agents",
  stage: "Scaling",
  pattern: "Aligned-Accelerating",
  stageColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
  summary: "The Software Engineering Agents category moved from research-stage prototype to multi-billion dollar commercial deployment within 24 months, a compression rarely seen in enterprise software. Two independent leaders emerged simultaneously: Cursor crossed $2B ARR and Claude Code reached $2.5B run-rate ARR within 8 months of general availability, the first time two competing coding agents crossed the $1B ARR threshold concurrently. Cognition's Devin extended the category into regulated enterprise with confirmed production deployments at Goldman Sachs, Citi, Dell, and Cisco. // The structural signals confirm this is no longer an early market. Google's $2.4B acquihire of Windsurf's leadership, SpaceX's $60B acquisition option on Anysphere, and Amazon's $5B Anthropic commitment signal that platform incumbents and industrial companies are now actively competing to control the category. GitHub Copilot's 90% Fortune 100 penetration at 20M users establishes autonomous coding assistance as a standard enterprise capability, not an emerging one. // Innovation signals remain highly active despite the mature commercial stage, with patent grants at 760 families and research publications growing from 45 to 1,180 in 2025. This combination of deep research activity, concurrent ARR milestones from multiple independent players, and platform-level M&A across all three signals makes Software Engineering Agents the most broadly reinforced technology segment in this analysis.",
  innIntensity: "high",
  cmrIntensity: "high",
  strIntensity: "high",
  signals: ["Cognition $400M at $10.2B (Sep 2025)", "Claude Code $2.5B run-rate ARR (Feb 2026)", "SpaceX $60B Cursor acquisition option (Apr 2026)"],
  subdomains: ["Software Engineering Agents"],
  alsoRoles: [],
  overview: "Autonomous coding agents that write, modify, review, and ship code. Cursor ($2B ARR) and Claude Code ($2.5B run-rate ARR) are the two category leaders. SpaceX holds a $60B acquisition option on Anysphere (Cursor).",
  primaryRole: "Commercialiser",
  country: "USA",
  tier: "Pioneer"
}, {
  id: "sd2",
  name: "Customer-Facing Conversational & Voice Agents",
  stage: "Scaling",
  pattern: "Aligned-Accelerating",
  stageColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
  summary: "Customer-facing agents have reached commercial scale faster than any comparable enterprise software category, with two independent leaders confirming material revenue and Fortune-level penetration simultaneously. Sierra reached $150M ARR and 40% Fortune 50 penetration, the fastest enterprise SaaS to $100M ARR on record, while Decagon achieved a $4.5B valuation with 100+ enterprise customers and 80%+ deflection rates. Outcome-based pricing, where customers pay per resolved interaction rather than per seat, has been validated at Fortune-50 scale and is reshaping procurement expectations across the entire category. // The structural layer has matured significantly, confirming this is no longer a pre-commercial market. Salesforce's $1.4B acquisition of Sierra marks the first platform-level consolidation in customer-facing agents, while Deutsche Telekom's selection of PolyAI as vendor-of-record across 12 European markets confirms cross-geography adoption at carrier scale. The EU AI Act's biometric voice provisions and FCC TCPA updates are establishing the first binding governance layer for the category. // Research and funding signals remain at high intensity, with publications growing from 350 in 2022 to 3,100 in 2025 and funding reaching $2.2B in 2025. The convergence of strong commercial evidence, platform-level M&A, and active research output across all three signals simultaneously places this technology segment firmly in the Aligned-Accelerating pattern.",
  innIntensity: "high",
  cmrIntensity: "high",
  strIntensity: "high",
  signals: ["Sierra $950M at $15.8B (May 2026)", "Decagon $250M at $4.5B (Jan 2026)", "Sierra 40% Fortune 50 at $150M ARR"],
  subdomains: ["Customer-Facing Conversational & Voice Agents"],
  alsoRoles: [],
  overview: "Customer-facing agents handling support, sales and service via chat, email and voice. Sierra ($150M ARR, 40% Fortune 50) and Decagon ($35M ARR) are the two category leaders. Outcome-based pricing is the commercial model.",
  primaryRole: "Commercialiser",
  country: "USA",
  tier: "Pioneer"
}, {
  id: "sd3",
  name: "Agent Orchestration Frameworks & Developer Infrastructure",
  stage: "Scaling",
  pattern: "Aligned-Accelerating",
  stageColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
  summary: "Agent orchestration has matured into the foundational infrastructure layer of the agentic AI stack, reaching adoption depth and governance maturity comparable to earlier infrastructure transitions like containers and REST APIs. LangChain confirmed 90M monthly downloads and 35% Fortune 500 reach, while MCP crossed 100M monthly downloads after being adopted by OpenAI, Anthropic, Google, and Microsoft simultaneously, the first agent connectivity protocol to achieve cross-competitor adoption at that scale. Klarna deployed LangGraph to 85M users and Nubank uses orchestration frameworks for real-time credit decisions at 131M customers, confirming production-critical use at consumer internet scale. // The structural layer is the most complete of the three technology segments and sets it apart from the application layers above. The Linux Foundation AAIF formation in December 2025 transferred MCP governance from Anthropic to a neutral body, removing the single-vendor-control risk that limited enterprise adoption. LangChain's $125M Series B at $1.25B and LangGraph 1.0's stable GA release with long-term support commitments complete the transition from open-source project to enterprise-grade infrastructure with formal procurement eligibility. // Innovation signals remain active despite the category's maturity, with patent grants at 920 families and publications at 2,600 in 2025, reflecting continued cross-domain research into orchestration patterns, persistent memory, and tool-calling protocols. All three signal layers show strong, sustained named evidence simultaneously, making Orchestration & Developer Infrastructure the most structurally complete technology segment and the gating layer on which commercial agent deployments across all three technology segments depend.",
  innIntensity: "high",
  cmrIntensity: "high",
  strIntensity: "high",
  signals: ["LangChain $125M at $1.25B (Oct 2025)", "MCP 100M monthly downloads (Feb 2026)", "AAIF formation (Dec 2025)"],
  subdomains: ["Agent Orchestration Frameworks & Developer Infrastructure"],
  alsoRoles: [],
  overview: "Open-source frameworks, SDKs and managed runtimes for building agent applications. LangChain/LangGraph leads with 90M monthly downloads and 35% Fortune 500 reach. MCP is the de-facto interoperability standard with universal lab adoption.",
  primaryRole: "Infrastructure",
  country: "USA",
  tier: "Established"
}];
const Y_INN = {
  sd1: [{
    label: "Research Publications",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [120, 420, 1050, 1800, 420],
    note: "Sourced from Google Scholar. Covers peer-reviewed papers and preprints. 2026 data represents a partial year (January–present)."
  }, {
    label: "Funding Deployed",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [220, 480, 1470, 2800, 1100],
    note: "Funding deployed is estimated using disclosed funding rounds identified within the technology segment. For each year, the top 10 funding rounds are assumed to represent approximately 80% of total funding activity. Total annual funding is extrapolated accordingly to estimate funding deployed. Figures should be interpreted as directional estimates, as not all funding rounds are publicly disclosed. 2026 data represents a partial year (January–present)."
  }, {
    label: "Startup Formations",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [8, 24, 14, 5, 0],
    note: "Source: Tracxn, Crunchbase. Counted from identified company formations in this technology segment. 2026 data represents a partial year (January–present)."
  }, {
    label: "Patents Granted",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [0, 1200, 4800, 9500, 2000],
    note: "Source: Google Patents. Counted as granted patent families to avoid multi-jurisdiction inflation. 2026 data represents a partial year (January–present)."
  }],
  sd2: [{
    label: "Research Publications",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [190, 580, 1400, 2300, 530],
    note: "Data aggregated from Google Scholar. 2026 data represents a partial year (January–present)."
  }, {
    label: "Funding Deployed",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [180, 320, 580, 1200, 340],
    note: "Funding deployed is estimated using disclosed funding rounds identified within the technology segment. For each year, the top 10 funding rounds are assumed to represent approximately 80% of total funding activity. Total annual funding is extrapolated accordingly to estimate funding deployed. Figures should be interpreted as directional estimates, as not all funding rounds are publicly disclosed."
  }, {
    label: "Startup Formations",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [18, 65, 45, 15, 0],
    note: "~27% of total global agentic AI formations. Source: Tracxn."
  }, {
    label: "Patents Granted",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [0, 2100, 8200, 16000, 3400],
    note: "~38% of agentic AI patent applications. Data aggregated from Google Patents."
  }],
  sd3: [{
    label: "Research Publications",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [350, 820, 1900, 3100, 710],
    note: "Largest technology segment by publication count. Data aggregated from Google Scholar."
  }, {
    label: "Funding Deployed",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [400, 460, 680, 2200, 1400],
    note: "CX agents ~37% of total agentic AI funding. 2026 includes Sierra $950M (May) + Decagon $250M (Jan)."
  }, {
    label: "Startup Formations",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [20, 70, 48, 12, 1],
    note: "~28% of total global formations. 2026 includes 1 European entrant."
  }, {
    label: "Patents Granted",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [0, 2400, 9100, 17500, 3700],
    note: "~43% of agentic AI applications. IFI Claims. Includes conversational AI overlap."
  }],
  sd4: [{
    label: "Research Publications",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [85, 280, 760, 1400, 310],
    note: "Smaller count, technology segment emerged post-2022 when LLM GUI grounding became feasible."
  }, {
    label: "Funding Deployed",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [15, 40, 80, 180, 90],
    note: "Relatively small pure-play category. Named: Browserbase $67.5M total. 2026 data through April."
  }, {
    label: "Startup Formations",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [4, 18, 12, 3, 0],
    note: "Very sparse category; mainly infrastructure companies. Source: Tracxn, Crunchbase."
  }, {
    label: "Patents Granted",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [0, 800, 2900, 5800, 1200],
    note: "~14% of agentic AI applications. DOM/screenshot techniques lag CPC code mapping."
  }],
  sd5: [{
    label: "Research Publications",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [160, 580, 1500, 2600, 580],
    note: "Includes academic and technical preprints. Data aggregated from Google Scholar."
  }, {
    label: "Funding Deployed",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [25, 35, 100, 200, 80],
    note: "LangChain $125M (Oct 2025). High open-source activity; commercial monetisation concentrated in LangSmith."
  }, {
    label: "Startup Formations",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [10, 30, 22, 8, 0],
    note: "Many started as open-source projects rather than formal VC-backed formations."
  }, {
    label: "Patents Granted",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [0, 900, 3200, 6200, 1300],
    note: "~15% of agentic AI applications. MCP not patented by design (donated to Linux Foundation AAIF)."
  }]
};
const Y_CMR = {
  sd1: [{
    label: "Named Product Launches (identified, reported)",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [2, 8, 18, 35, 12],
    note: "Claude Code GA Jun 2025, Codex May 2025, SWE-1.5 Oct 2025. Source: Company newsrooms, TechCrunch."
  }, {
    label: "Named Deployments (production, verified)",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [0, 2, 8, 22, 8],
    note: "Cognition: Goldman Sachs, Citi, Dell, Cisco. Accenture 30,000-person training. Uber 10% code autonomously generated."
  }],
  sd2: [{
    label: "Named Product Launches",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [2, 10, 28, 45, 12],
    note: "Agentforce 360 (Oct 2025), Agent 365 (Nov 2025). Source: Salesforce, Microsoft newsrooms."
  }, {
    label: "Named Enterprise Deployments",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [0, 5, 18, 42, 10],
    note: "400,000+ custom agents via Copilot Studio Q4 2024. 70% Fortune 500 on Copilot."
  }],
  sd3: [{
    label: "Named Product Launches",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [2, 8, 20, 38, 14],
    note: "Sierra Agent OS 2.0 (Nov 2025), Ghostwriter (Mar 2026), Decagon pilots. Source: Company blogs."
  }, {
    label: "Named Deployments (production, verified)",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [0, 4, 12, 35, 12],
    note: "Sierra: 40% Fortune 50, $150M ARR, billions of interactions. Decagon: Avis, Mercado Libre, Deutsche Telekom."
  }],
  sd4: [{
    label: "Named Product Launches",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [0, 2, 6, 14, 4],
    note: "Claude in Chrome beta Aug 2025. OpenAI Operator Jan 2025. Codex background computer use Apr 2026."
  }, {
    label: "Named Deployments",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [0, 0, 2, 6, 2],
    note: "Security constraints (11.2% residual prompt injection) limiting production deployment."
  }],
  sd5: [{
    label: "Named Product Launches",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [4, 12, 25, 40, 10],
    note: "LangChain 1.0 + LangGraph 1.0 (Oct 2025), LangSmith Agent Builder, MCP spec releases."
  }, {
    label: "Active Developer Deployments (M downloads/month)",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [3, 15, 45, 90, 100],
    note: "LangChain+LangGraph combined monthly downloads. 35% Fortune 500. MCP 100M/month by early 2026."
  }]
};
const Y_STR = {
  sd1: [{
    label: "M&A Transactions (agentic AI globally)",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [2, 4, 6, 16, 6],
    note: "Source: Tracxn, press announcements, SEC/regulatory filings. Closed or announced M&A transactions in agentic AI globally. 2026 data represents a partial year (January–present)."
  }, {
    label: "Regulatory Milestones (enacted, live)",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [0, 1, 2, 4, 2],
    note: "EU AI Act GPAI obligations live Aug 2025. Full enforcement Aug 2026. Source: EU AI Act implementation timeline."
  }, {
    label: "Standards Decisions (formal bodies)",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [0, 0, 1, 5, 2],
    note: "MCP launch Nov 2024. OpenAI adopts MCP Mar 2025. AAIF formation Dec 2025. MCP 100M downloads. Source: MCP blog, Linux Foundation."
  }],
  sd2: [{
    label: "M&A Transactions",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [1, 3, 5, 12, 3],
    note: "Moveworks acquired 2025. Salesforce Agentforce acquisitions. Source: Tracxn."
  }, {
    label: "Regulatory Milestones",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [0, 1, 2, 4, 2],
    note: "EU AI Act GPAI obligations (Aug 2025). Full enforcement Aug 2026."
  }],
  sd3: [{
    label: "M&A Transactions",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [0, 2, 4, 8, 4],
    note: "Sierra acquired Fragment, Opera Tech, Receptive AI (Q1 2026) for EU and voice expansion."
  }, {
    label: "Regulatory Milestones",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [0, 1, 2, 3, 2],
    note: "EU AI Act GPAI obligations affect customer-facing agents using Claude/GPT. Voice agent regulations emerging."
  }],
  sd4: [{
    label: "M&A Transactions",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [0, 0, 1, 3, 1],
    note: "No major pure-play M&A. Foundation labs competing for browser agent ownership (Perplexity Comet, OpenAI browser)."
  }, {
    label: "Security Standards Milestones",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [0, 0, 1, 3, 2],
    note: "1Password Agentic Autofill (Oct 2025). Cloudflare Web Bot Auth (Aug 2025). MCP security tooling emerging."
  }],
  sd5: [{
    label: "Open-Source Major Releases",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [4, 12, 20, 35, 8],
    note: "LangChain 1.0/LangGraph 1.0 (Oct 2025). AGENTS.md adopted 60,000+ projects. MCP Nov 2025 spec release."
  }, {
    label: "Standards & Governance Decisions",
    years: [2022, 2023, 2024, 2025, 2026],
    values: [0, 0, 1, 5, 2],
    note: "AAIF formation Dec 2025 (Anthropic, OpenAI, Block → Linux Foundation). MCP SEP-1865 spec 2026. Source: Linux Foundation press release."
  }]
};
const SD_INN_Y = {
  sd1: Y_INN.sd1,
  sd2: Y_INN.sd3,
  sd3: Y_INN.sd5
};
const SD_CMR_Y = {
  sd1: Y_CMR.sd1,
  sd2: Y_CMR.sd3,
  sd3: Y_CMR.sd5
};
const SD_STR_Y = {
  sd1: Y_STR.sd1,
  sd2: Y_STR.sd3,
  sd3: Y_STR.sd5
};
const SD_MOM = {
  sd1: {
    pattern: "Aligned-Accelerating",
    inn: {
      tag: "accelerating",
      i: "high",
      g: "Cognition raised $400M at $10.2B in September 2025, followed by $25B acquisition talks in April 2026. Anysphere closed a $2.3B Series D in October 2025 at a $29.3B valuation. Accenture committed to training 30,000 professionals on agent-assisted engineering workflows. Capital deployment into this technology segment has accelerated year-over-year for four consecutive years."
    },
    cmr: {
      tag: "active",
      i: "high",
      g: "Claude Code reached $2.5B run-rate ARR in February 2026, approximately 8 months after its General Availability release in June 2025, the fastest Anthropic product to $1B+ ARR. Codex onboarded over 1 million developers. Cognition confirmed four Fortune 500 production deployments: Goldman Sachs, Citi, Dell, and Cisco. Uber disclosed that 10% of its code is now autonomously generated."
    },
    str: {
      tag: "active",
      i: "high",
      g: "Google's $2.4B acquihire of Windsurf's leadership (July 2025), after which the remaining Windsurf entity was acquired by Cognition, consolidated the IDE layer and reset the pure-play market. SpaceX holds a $60B acquisition option on Anysphere (Cursor), the first non-AI platform strategic buyer entering the category. Amazon committed $5B to Anthropic with an accompanying $100B compute pledge. MCP was donated to the Linux Foundation AAIF in December 2025, establishing vendor-neutral governance."
    },
    inf: ["2025-07: Google-Windsurf acquihire: Google's $2.4B acquihire brought Windsurf's leadership and core talent under a foundation lab; the remaining Windsurf entity and its 300K+ user developer base were subsequently acquired by Cognition. The combined effect reduced a fragmented landscape to two dominant pure-play positions.", "2025-09: Cognition $400M at $10.2B: first independent coding agent to cross the decacorn threshold. The round confirmed top-tier VC conviction in standalone coding agents as a durable category rather than a feature of foundation model providers.", "2026-04: SpaceX $60B Cursor option: first non-AI platform strategic buyer (aerospace, logistics infrastructure) identifying a coding agent company as strategically relevant to its core operations, the first cross-industry consolidation signal in the category."],
    pr: "High concentration. Two pure-play leaders (Cognition+Windsurf at $25B talks, Anysphere/Cursor at $29.3B) and two foundation-lab products (Claude Code $2.5B ARR, Codex). US-dominated; all SF-headquartered."
  },
  sd2: {
    pattern: "Aligned-Accelerating",
    inn: {
      tag: "accelerating",
      i: "high",
      g: "Sierra raised $950M at $15.8B in May 2026, the largest single round in the customer-facing agent category. Decagon raised $250M at $4.5B in January 2026. Sierra is the fastest enterprise software company to $100M ARR on record, reaching it in approximately 7 quarters from founding."
    },
    cmr: {
      tag: "active",
      i: "high",
      g: "Sierra disclosed $150M ARR and 40% of Fortune 50 as customers in February 2026. Outcome-based pricing, customers pay per resolved interaction, is validated at Fortune-50 scale. Deutsche Telekom ran a 6-month production pilot with Decagon (Nov 2025). Sierra Agent OS 2.0 added proactive outreach capabilities."
    },
    str: {
      tag: "active",
      i: "medium",
      g: "Sierra completed three acquisitions in Q1 2026: Fragment (EU data residency), Opera Tech (multilingual voice), and Receptive AI (enterprise feedback), to accelerate EU expansion. EU AI Act GPAI obligations affect foundation models used by CX agents. Named M&A and regulatory activity is present; no single event has restructured the category competitively."
    },
    inf: ["2025-09: Sierra $350M at $10B: first pure-play customer experience agent to $10B valuation, establishing the category pricing benchmark.", "2026-05: Sierra $950M at $15.8B with 40% Fortune 50: outcome-based pricing validated at Fortune-50 scale, the fastest ARR ramp in enterprise SaaS history."],
    pr: "Two-leader structure: Sierra ($15.8B, $150M ARR) ahead of Decagon ($4.5B, $35M ARR). Intercom Fin at $100M ARR is third. Outcome-based pricing is the commercial model differentiator for the category."
  },
  sd3: {
    pattern: "Aligned-Accelerating",
    inn: {
      tag: "accelerating",
      i: "high",
      g: "LangChain raised $125M at $1.25B in October 2025, led by IVP with Sequoia, Benchmark, ServiceNow Ventures, and Datadog participating. MCP reached 100M monthly downloads by February 2026, confirmed by Anthropic. AGENTS.md was adopted by 60,000+ open-source projects. Publication activity in orchestration research grew from approximately 80 papers in 2022 to an estimated 2,600 in 2025."
    },
    cmr: {
      tag: "active",
      i: "high",
      g: "LangChain 1.0 and LangGraph 1.0 reached stable General Availability in October 2025, the first stable releases after 2 years of rapid iteration. The GA release included a no-code Agent Builder and confirmed 90M monthly combined downloads and 35% Fortune 500 reach. LangSmith trace volume grew 12× year-over-year. MCP is implemented natively across all major foundation labs including OpenAI, Anthropic, Google, and Microsoft."
    },
    str: {
      tag: "active",
      i: "high",
      g: "The Linux Foundation AAIF was formed in December 2025, with Anthropic, OpenAI, and Block donating MCP governance to the foundation, removing any single vendor's ability to fork or control the protocol. This mirrors Docker's transition to the CNCF in 2017. OpenAI adopted MCP in March 2025, the cross-competitor adoption event that made MCP effectively mandatory infrastructure. LangChain 1.0's stable open-source release established the stable API surface for enterprise builds."
    },
    inf: ["2025-03: OpenAI adopts MCP: when OpenAI adopted MCP, it transformed the protocol from an Anthropic-originated standard into cross-competitor infrastructure. Any developer building on MCP could expect compatibility with OpenAI, Anthropic, and Google without modification.", "2025-10: LangChain 1.0 and LangGraph 1.0 reach stable GA: first stable releases enabling enterprise production commitments. Klarna cited the stable release as the basis for its 85M-user LangGraph deployment.", "2025-12: AAIF formation: Anthropic, OpenAI, and Block donate MCP governance to Linux Foundation, making MCP a permanent open standard no single vendor can fork or control."],
    pr: "Moderate concentration. LangChain leads commercially; Microsoft Semantic Kernel and Google ADK are viable alternatives. MCP is de-facto interoperability standard with universal adoption. US-centric R&D but globally deployed."
  }
};
// ── Date formatter ────────────────────────────────────────────────────────
const fmtDate = (d: string): string => {
  if (!d) return d;
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const ord = (n: number) => n + (n===1||n===21||n===31?"st":n===2||n===22?"nd":n===3||n===23?"rd":"th");
  // YYYY-Q# e.g. 2024-Q3
  const qm = d.match(/^(\d{4})-Q(\d)$/);
  if (qm) return `Q${qm[2]} ${qm[1]}`;
  // YYYY-MM-DD e.g. 2024-03-15
  const dm = d.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dm) return `${ord(+dm[3])} ${MONTHS[+dm[2]-1]}, ${dm[1]}`;
  // YYYY-MM e.g. 2025-03
  const mm = d.match(/^(\d{4})-(\d{2})$/);
  if (mm) return `${MONTHS[+mm[2]-1]} ${mm[1]}`;
  return d;
};

const HoverTip = ({
  label,
  desc,
  title: tipTitle,
  cls = "",
  hideIcon = false
}) => {
  const [v, setV] = useState(false);
  const [pos, setPos] = useState({top: 0, left: 0, below: false});
  const ref = useRef<HTMLSpanElement>(null);
  const handleEnter = () => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      const below = r.top < 130;
      setPos({
        top: below ? r.bottom + 6 : r.top - 8,
        left: Math.min(Math.max(r.left, 8), window.innerWidth - 268),
        below
      });
    }
    setV(true);
  };
  return <span ref={ref} className="relative inline-flex items-center gap-0.5 cursor-default" onMouseEnter={handleEnter} onMouseLeave={() => setV(false)}><span className={cls}>{label}</span>{!hideIcon && <svg width="11" height="11" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>}{v && <div style={{position:"fixed", top: pos.top, left: Math.min(Math.max(pos.left, 8), window.innerWidth - 366), transform: pos.below ? "none" : "translateY(-100%)", width:"350px", maxWidth:"350px", boxSizing:"border-box", wordBreak:"break-word", overflowWrap:"break-word", whiteSpace:"normal"}} className="z-[99999] bg-white text-[#0f2644] border border-slate-200 rounded-xl shadow-xl p-3.5 pointer-events-none text-left">{tipTitle && <div className="text-[12px] font-bold mb-1.5 leading-snug" style={{wordBreak:"break-word", whiteSpace:"normal", overflowWrap:"break-word"}}>{tipTitle}</div>}<div className="text-[12px] text-[#0f2644] leading-relaxed" style={{wordBreak:"break-word", whiteSpace:"normal", overflowWrap:"break-word"}}>{desc}</div></div>}</span>;
};

// Reusable Signal Momentum tooltip content with growth-tier table
const SignalMomentumTooltipContent = () => <div>
  <p className="mb-2 text-[12px] leading-relaxed">Average CAGR across patents granted, research publications, and funding deployed (2022–2025).</p>
  <table className="w-full text-[10px] border-collapse mt-1">
    <thead>
      <tr className="border-b border-slate-200">
        <th className="text-left py-1 pr-3 font-bold text-[#0f2644]">Growth Tier</th>
        <th className="text-left py-1 font-bold text-[#0f2644]">Average CAGR</th>
      </tr>
    </thead>
    <tbody>
      {[["Hyper-growth","#059669","40% or above"],["High growth","#16a34a","20% to 40%"],["Moderate growth","#166534","5% to 20%"],["Low growth","#f59e0b","0% to 5%"],["Contracting","#dc2626","Below 0%"]].map(([tier,color,range])=>(
        <tr key={tier} className="border-b border-slate-50">
          <td className="py-1 pr-3" style={{color}}>{tier}</td>
          <td className="py-1 text-[#0f2644]">{range}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>;

// Reusable Maturity Stage tooltip content with classification table
const MaturityStageTooltipContent = () => <div>
  <p className="mb-2 text-[12px] leading-relaxed">Based on the combined weight of evidence across all three signal layers.</p>
  <table className="w-full text-[10px] border-collapse mt-1">
    <thead>
      <tr className="border-b border-slate-200">
        <th className="text-left py-1 pr-3 font-bold text-[#0f2644]">Stage</th>
        <th className="text-left py-1 font-bold text-[#0f2644]">Evidence basis</th>
      </tr>
    </thead>
    <tbody>
      {[["Lab","#64748b","Research and patents only. No commercial products visible. Pre-commercial, not inactive."],["Pilot","#f59e0b","First pilots with disclosed partners. Products in testing, not full production."],["Early Commercial","#059669","Named launches with confirmed revenue or partnerships. Technology in commercial use."],["Scaling","#15803d","Multiple production deployments reinforcing active commercial growth. Strongest maturity signal."]].map(([stage,color,desc])=>(
        <tr key={stage} className="border-b border-slate-50">
          <td className="py-1 pr-3 whitespace-nowrap" style={{color:color as string}}>{stage}</td>
          <td className="py-1 text-[#0f2644] leading-snug">{desc}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>;

// Reusable Cross-Signal Pattern tooltip content with pattern table
const CrossSignalPatternTooltipContent = () => <div>
  <p className="mb-2 text-[12px] leading-relaxed">Describes the relationship between the three signal layers: Innovation, Commercialisation, and Structural.</p>
  <table className="w-full text-[10px] border-collapse mt-1">
    <thead>
      <tr className="border-b border-slate-200">
        <th className="text-left py-1 pr-3 font-bold text-[#0f2644]">Pattern</th>
        <th className="text-left py-1 font-bold text-[#0f2644]">What it describes</th>
      </tr>
    </thead>
    <tbody>
      {[["Aligned-Accelerating","#059669","All three layers show strong, sustained evidence and reinforce each other."],["Innovation-Ahead","#16a34a","Research dominates; commercial deployment and structural signals are thinner."],["Commercialising","#059669","Innovation and Commercial are both strong; structural evidence is thinner."],["Structurally-Gated","#166534","Governance, standards, and M&A are the most prominent layer."],["Divergent","#dc2626","Layers move in inconsistent directions; signals are not mutually reinforcing."]].map(([pattern,color,desc])=>(
        <tr key={pattern} className="border-b border-slate-50">
          <td className="py-1 pr-3 whitespace-nowrap" style={{color:color as string}}>{pattern}</td>
          <td className="py-1 text-[#0f2644] leading-snug">{desc}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>;
const TierFilterTooltip = () => {
  const { ref, v, pos, show, hide } = useSmartPos();
  return <span className="inline-flex items-center flex-shrink-0">
    <svg ref={ref as React.RefObject<SVGSVGElement>} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={v?"#475569":"#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-help transition-colors" onMouseEnter={show} onMouseLeave={hide}>
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
    {v && <TipBox pos={pos} title="Player Tier">
      <p className="mb-2 leading-relaxed">Reflects the weight of each organisation's signal presence in this analysis only. Not a statement about overall size, revenue, or market position.</p>
      <table className="w-full text-[10px] border-collapse">
        <thead><tr className="border-b border-slate-200"><th className="text-left py-1 pr-3 font-bold text-[#0f2644]">Tier</th><th className="text-left py-1 font-bold text-[#0f2644]">What it means</th></tr></thead>
        <tbody>
          {[["Pioneer","Shaped the segment through one defining, traceable activity. May be a startup, regulator, or large company."],["Established","Sustained presence across multiple signal types; no single defining action that set the direction of the segment."],["Challenger","Recent focused activity with growing momentum; narrower footprint than Established. Reflects current evidence, not future potential."],["Specialist","Deep presence in one focused area of the segment; not broad but meaningful within that specific area."]].map(([t,d])=>(
            <tr key={t} className="border-b border-slate-50"><td className="py-1 pr-3 text-[#0f2644] whitespace-nowrap">{t}</td><td className="py-1 text-[#0f2644] leading-snug">{d}</td></tr>
          ))}
        </tbody>
      </table>
    </TipBox>}
  </span>;
};

// Filter pane tooltip: Ecosystem Role
const RoleFilterTooltip = () => {
  const { ref, v, pos, show, hide } = useSmartPos();
  return <span className="inline-flex items-center flex-shrink-0">
    <svg ref={ref as React.RefObject<SVGSVGElement>} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={v?"#475569":"#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-help transition-colors" onMouseEnter={show} onMouseLeave={hide}>
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
    {v && <TipBox pos={pos} title="Ecosystem Role">
      <p className="mb-2 leading-relaxed">Describes what kind of activity accounts for most of an organisation's signal presence. A primary role is always assigned; secondary roles are shown where relevant.</p>
      <table className="w-full text-[10px] border-collapse">
        <thead><tr className="border-b border-slate-200"><th className="text-left py-1 pr-3 font-bold text-[#0f2644]">Ecosystem Role</th><th className="text-left py-1 font-bold text-[#0f2644]">Primary signal source</th></tr></thead>
        <tbody>
          {[["Commercialiser","Product launches, deployments, and partnerships"],["Innovator","Patents and publications; common for research institutions and IP-focused companies"],["Infrastructure","Foundational services or platforms that other players build on"],["Standards-setter","Standards body decisions, open-source framework releases, or technical specifications others adopt"],["Regulator","Regulatory enactments and enforcement actions; government bodies and legislative institutions"]].map(([r,d])=>(
            <tr key={r} className="border-b border-slate-50"><td className="py-1 pr-3 font-semibold text-[#0f2644] whitespace-nowrap">{r}</td><td className="py-1 text-[#0f2644] leading-snug">{d}</td></tr>
          ))}
        </tbody>
      </table>
    </TipBox>}
  </span>;
};
const PlayerPanel = ({ p, onClose }: { p: any; onClose: ()=>void }) => {
  const PANEL_TIER_C: Record<string,string> = {
    Pioneer: "bg-orange-50 text-orange-700 border border-orange-200",
    Established: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Challenger: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Specialist: "bg-teal-50 text-teal-700 border border-teal-200"
  };
  const [tab, setTab] = useState("overview");
  const [drawerAct, setDrawerAct] = useState<any>(null);
  const [expanded, setExpanded] = useState<number|null>(null);
  const playerActs = deduplicateActs(getPlayerActs(p.name));
  return <><div className="fixed inset-0 z-[500] flex" style={{zIndex:drawerAct?499:500}}>
    <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="w-[700px] bg-white flex flex-col h-full shadow-2xl" onClick={e=>e.stopPropagation()}>
      <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[12px] font-bold px-2.5 py-1 rounded tracking-wide ${PANEL_TIER_C[p.tier] || "bg-slate-50 text-slate-600 border border-slate-200"}`}>{p.tier} · {p.primaryRole}</span><TierTooltip tier={p.tier} playerName={p.name} /><RoleTooltip role={p.primaryRole} playerName={p.name} />
            {p.alsoRoles.length > 0 && <span className="text-[10px] text-[#0f2644]">Also: {p.alsoRoles.join(", ")}</span>}
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-[#0f2644] hover:text-slate-600 flex-shrink-0">
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <h2 className="text-[21px] font-black text-[#0f2644] mb-1">{p.name}</h2>
        <div className="text-[12px] font-mono text-[#0f2644]">{p.subdomains.join(", ")}</div>
      </div>
      <div className="flex border-b border-slate-100 flex-shrink-0">
        {[["overview","Overview",null],["signals","Signals",playerActs.length]].map(([id,lbl,cnt]:any)=><button key={id} onClick={()=>{setTab(id);setExpanded(null);}} className={`flex-1 py-2.5 text-[12px] font-semibold border-b-2 transition-all ${tab===id?"text-[#1EDD7D] border-[#1EDD7D]":"text-[#0f2644] border-transparent hover:text-slate-600"}`}><span className="inline-flex items-center gap-1.5">{lbl}{cnt!=null && cnt>0 && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums ${tab===id?"bg-[#1EDD7D]/15 text-[#15b865]":"bg-slate-100 text-[#0f2644]"}`}>{cnt}</span>}</span></button>)}
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        {tab==="overview" && <div className="space-y-5">
          <p className="text-[12px] text-[#0f2644] italic leading-relaxed border-l-2 border-slate-200 pl-4">{p.overview}</p>
          <div><p className="text-[13px] font-semibold text-[#0f2644] mb-2">Signal presence, click any signal to view its activity profile</p><div className="flex flex-wrap gap-1.5">{p.signals.map((s:string,i:number)=>{const allPActs=ACT_BY_PLAYER[p.name]||[];const sigCore=(s.split(" (")[0]||"").toLowerCase();const matchedAct=allPActs.find((a:any)=>{if(!a.headline) return false;const hl=a.headline.toLowerCase();const words=sigCore.split(" ").filter((w:string)=>w.length>4);return words.length>0?words.some((w:string)=>hl.includes(w)):hl.includes(sigCore.substring(0,15));}) || allPActs[i % Math.max(allPActs.length,1)];return <span key={i} className="text-[12px] text-[#0f2644] bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-colors" onClick={()=>matchedAct&&setDrawerAct(matchedAct)} title="Click to view activity profile">{s}<span className="ml-1 text-emerald-500 text-[9px]">↗</span></span>;})} </div></div>
          {playerActs.length>0 && <div><p className="text-[15px] font-bold text-[#0f2644] mb-2">{playerActs.length} profiled activities in this analysis</p><p className="text-[13px] text-[#0f2644]">Open the Signals tab to view and expand each activity with full details. These are the activities captured within this analysis only, not an exhaustive history of this organisation's funding or activity.</p></div>}
        </div>}
        {tab==="signals" && <div>
          <p className="text-[15px] font-bold text-[#0f2644] mb-3">{playerActs.length>0 ? `${playerActs.length} profiled activities featuring ${p.name}` : "Signal context"}</p>
          {playerActs.length>0 ? <div className="space-y-2">{playerActs.map((a:any,i:number)=>{
            const layer = ACT_LAYER[a.id]||"innovation";
            const accent = LAYER_COLOR[layer];
            const layerLabel = {innovation:"Innovation",commercial:"Commercialisation",structural:"Structural"}[layer] || layer;
            return <div key={a.id} className="border border-slate-200 rounded-xl overflow-hidden transition-all cursor-pointer hover:border-emerald-300 hover:shadow-sm group" onClick={()=>setDrawerAct(a)}>
              <div className="flex items-start gap-2 px-4 py-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5 flex-shrink-0" style={{background:accent}}/>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full border" style={{background:`${accent}15`,color:accent,borderColor:`${accent}30`}}>{layerLabel}</span>
                    <span className="text-[10px] font-mono text-[#0f2644]">{fmtDate(a.date)}</span>
                  </div>
                  <p className="text-[12px] font-semibold text-[#000000] leading-snug mb-1">{a.headline}</p>
                  <p className="text-[12px] text-[#0f2644] italic leading-snug line-clamp-2">{a.whyFlag}</p>
                </div>
                <span className="text-[12px] text-[#059669] group-hover:text-[#047857] font-semibold whitespace-nowrap flex-shrink-0 mt-0.5">Open profile →</span>
              </div>
            </div>;
          })}</div> : <div className="space-y-2">{p.signalEvidence.map((e:string,i:number)=>{
            const [type,...rest]=e.split(":");
            return <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100"><span className="text-[12px] font-bold text-[#0f2644]">{type}</span><p className="text-[12px] text-[#0f2644] mt-0.5 leading-relaxed">{rest.join(":").trim()}</p></div>;
          })}</div>}
        </div>}
        {tab==="subdomains" && null}
      </div>
    </div>
  </div>
  {drawerAct && <ActivityDrawerModal act={drawerAct} sdName={p.name} onClose={()=>setDrawerAct(null)} onSelectActivity={(a)=>setDrawerAct(a)} />}
  </>;
};

// Momentum tile
const MomColors = {
  accelerating: "text-emerald-600",
  steady: "text-amber-500",
  decelerating: "text-red-500",
  emerging: "text-emerald-600",
  quiet: "text-[#0f2644]"
};
const KeyTakeaway = ({
  points
}) => <div className="mt-3 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3"><div className="flex items-center gap-1.5 mb-2"><svg width="13" height="13" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.22-1.2 4.16-3 5.2V17a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1v-2.8C7.2 13.16 6 11.22 6 9a6 6 0 0 1 6-6z" /><line x1="12" y1="17" x2="12" y2="21" /></svg><span className="text-[12px] font-bold text-[#16a34a] tracking-normal">Key Takeaways</span></div>{points.map((pt, i) => <div key={i} className="flex items-start gap-2 mt-1.5 first:mt-0"><svg width="12" height="12" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg><p className="text-[13px] text-[#14532d] leading-relaxed" dangerouslySetInnerHTML={{
      __html: pt
    }} /></div>)}</div>;
// ── Shared smart-position tooltip hook ──────────────────────────────────────
const useSmartPos = () => {
  const [v, setV] = useState(false);
  const [pos, setPos] = useState({top:0, left:0, below:false});
  const ref = React.useRef<HTMLElement>(null);
  const show = () => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      const below = r.top < 130;
      setPos({ top: below ? r.bottom + 6 : r.top - 8, left: Math.min(Math.max(r.left, 8), window.innerWidth - 284), below });
    }
    setV(true);
  };
  return { ref, v, pos, show, hide: () => setV(false) };
};
// ── Shared tooltip popup ─────────────────────────────────────────────────────
const TipBox = ({ pos, title, titleColor = "#0f2644", children }: { pos: {top:number,left:number,below:boolean}, title?: string, titleColor?: string, children: React.ReactNode }) =>
  <div style={{position:"fixed", top: pos.top, left: Math.min(Math.max(pos.left, 8), window.innerWidth - 284), transform: pos.below ? "none" : "translateY(-100%)", width:"276px", maxWidth:"276px", boxSizing:"border-box", wordBreak:"break-word", overflowWrap:"break-word", whiteSpace:"normal"}} className="z-[99999] bg-white border border-slate-200 rounded-xl shadow-xl p-3.5 pointer-events-none text-left">
    {title && <div className="text-[12px] font-bold mb-1.5 leading-snug text-[#0f2644]" style={{wordBreak:"break-word"}}>{title}</div>}
    <div className="text-[12px] text-[#0f2644] leading-relaxed" style={{wordBreak:"break-word"}}>{children}</div>
  </div>;

const InfoTooltip = ({
  tip,
  note,
  label,
  color
}) => {
  const { ref, v, pos, show, hide } = useSmartPos();
  return <span className="relative flex-shrink-0 inline-flex"><svg ref={ref as React.RefObject<SVGSVGElement>} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={v ? "#475569" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-help transition-colors" onMouseEnter={show} onMouseLeave={hide}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>{v && <TipBox pos={pos} title={`${label} Signals`} titleColor={color}><p className="leading-relaxed mb-1.5">{tip}</p><p className="text-[10px] text-[#0f2644] leading-snug border-t border-slate-100 pt-1.5"><span>Note: </span>{note}</p></TipBox>}</span>;
};
const PATTERN_TIPS = {
  "Aligned-Accelerating": {
    color: "#059669",
    desc: "All three signals: Innovation, Commercialisation, and Structural, show sustained, mutually reinforcing evidence. Research, product activity, and governance are advancing together. This is the strongest indicator of near-term market relevance."
  },
  "Innovation-Ahead": {
    color: "#059669",
    desc: "Research, patent, and funding activity substantially outpaces commercial deployment and governance signals. The technology is advancing faster than the market or regulatory environment can currently absorb. This pattern often precedes commercial activity by one to three years."
  },
  "Structurally-Gated": {
    color: "#166534",
    desc: "Both commercial and innovation activity are present, but regulatory requirements, standards decisions, or supply chain constraints are acting as explicit gates on what can be deployed and at what scale. A governance change or standard being set can unlock rapid commercial activity."
  },
  "Divergent": {
    color: "#dc2626",
    desc: "The three signals are moving in different directions or at very different intensities. Commercial momentum may exist without corresponding innovation or structural signals, or vice versa. Divergence is a caution signal: it does not mean the technology segment is unimportant, but the evidence is not mutually reinforcing."
  }
};
const PatternTooltip = ({
  pattern
}) => {
  const { ref, v, pos, show, hide } = useSmartPos();
  const cfg = PATTERN_TIPS[pattern];
  if (!cfg) return null;
  return <span className="inline-flex items-center gap-1 flex-shrink-0"><svg ref={ref as React.RefObject<SVGSVGElement>} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={v ? "#475569" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-help transition-colors" onMouseEnter={show} onMouseLeave={hide}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>{v && <TipBox pos={pos} title={pattern}>{cfg.desc}</TipBox>}</span>;
};
const TRAJECTORY_TIPS = {
  "accelerating": {
    color: "#059669",
    desc: "Activity in this signal layer is increasing year over year. The volume of named events is rising and the most recent period shows the highest activity. (Innovation layer only.)"
  },
  "steady": {
    color: "#166534",
    desc: "Activity is present and sustained but is not growing materially. The volume of named events is roughly flat across recent years. (Innovation layer only.)"
  },
  "emerging": {
    color: "#15803d",
    desc: "A small number of early-stage activities have appeared recently for the first time. The signal type is new to this technology segment in the analysis."
  },
  "decelerating": {
    color: "#dc2626",
    desc: "Activity that was previously rising has slowed. The most recent periods show fewer named events than earlier periods. (Innovation layer only.)"
  },
  "quiet": {
    color: "#94a3b8",
    desc: "Minimal new activity is detectable for this signal layer in this technology segment. Few or no named events appear in the most recent period."
  },
  "active": {
    color: "#059669",
    desc: "Named activities are present and sustained across the analysis period. Used for Commercial and Structural layers, where the evidence base does not support a reliable direction-of-change assessment."
  },
  "limited": {
    color: "#94a3b8",
    desc: "Sparse activity in this layer, too few named events to assess direction. Used for Commercial and Structural layers where evidence is present but thin."
  }
};
const TrajectoryTooltip = ({
  tag
}) => {
  const { ref, v, pos, show, hide } = useSmartPos();
  const cfg = TRAJECTORY_TIPS[tag.toLowerCase()];
  if (!cfg) return null;
  return <span className="inline-flex items-center flex-shrink-0"><svg ref={ref as React.RefObject<SVGSVGElement>} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={v ? "#475569" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-help transition-colors" onMouseEnter={show} onMouseLeave={hide}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>{v && <TipBox pos={pos} title={tag.charAt(0).toUpperCase() + tag.slice(1)} titleColor={cfg.color}>{cfg.desc}</TipBox>}</span>;
};
const MomentumSectionTooltip = () => {
  const { ref, v, pos, show, hide } = useSmartPos();
  return <span className="inline-flex items-center ml-1"><svg ref={ref as React.RefObject<SVGSVGElement>} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={v ? "#475569" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-help transition-colors" onMouseEnter={show} onMouseLeave={hide}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>{v && <TipBox pos={pos} title="Momentum by Signal Layer"><p className="mb-2">Each signal layer shows the direction of its named activity over the analysis period. The Innovation layer is assessed on a five-point trajectory scale; Commercial and Structural use a presence-based scale where the evidence does not support a reliable direction-of-change reading. All tags are set from named evidence, not model estimates.</p><div className="space-y-1.5 border-t border-slate-100 pt-2">{Object.entries(TRAJECTORY_TIPS).map(([tag, {color, desc}]) => <div key={tag} className="flex gap-2"><span className="text-[12px] capitalize flex-shrink-0 w-20" style={{color}}>{tag}</span><span className="text-[10px] text-[#0f2644] leading-snug">{desc}</span></div>)}</div></TipBox>}</span>;
};
const InflectionPointsTooltip = () => {
  const [v, setV] = useState(false);
  const [pos, setPos] = useState({top: 0, left: 0, below: false});
  const ref = React.useRef<HTMLSpanElement>(null);
  const handleEnter = () => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      const below = r.top < 130;
      setPos({
        top: below ? r.bottom + 6 : r.top - 8,
        left: Math.min(Math.max(r.left, 8), window.innerWidth - 308),
        below
      });
    }
    setV(true);
  };
  return <span ref={ref} className="inline-flex items-center ml-1" onMouseEnter={handleEnter} onMouseLeave={() => setV(false)}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={v ? "#15b865" : "#6ee7b7"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-help transition-colors"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>{v && <div style={{position:"fixed", top: pos.top, left: Math.min(Math.max(pos.left, 8), window.innerWidth - 308), transform: pos.below ? "none" : "translateY(-100%)", width:"300px", maxWidth:"300px", boxSizing:"border-box", wordBreak:"break-word", overflowWrap:"break-word", whiteSpace:"normal"}} className="z-[99999] bg-white text-[#0f2644] border border-[#bbf7d0] rounded-xl shadow-xl p-3.5 pointer-events-none text-left"><div className="text-[12px] font-semibold text-[#0f2644] mb-1">Inflection Points</div><p className="text-[12px] text-[#0f2644] leading-relaxed">Points where activity signals change direction or pace, such as a spike in patents, a geography entering high-activity territory, or a technology crossing from pilot to commercial deployment.</p></div>}</span>;
};
const SIG_TYPE_TIPS = {
  "Commercial First": {
    color: "#059669",
    cls: "text-emerald-700",
    desc: "The first of its kind in this technology segment. This includes the first deployment at commercial scale, the first commercial product in a previously lab-only area, or the first regulatory clearance for a capability that had not been approved before."
  },
  "Threshold Crossing": {
    color: "#059669",
    cls: "text-emerald-700",
    desc: "An event that crosses a specific price, performance, or regulatory threshold that makes a previously inaccessible market or customer group reachable for the first time. The threshold must be identifiable and specific."
  },
  "Strategic Commitment": {
    color: "#166534",
    cls: "text-amber-700",
    desc: "Named parties commit resources, capital, exclusivity, or purchase volume that goes meaningfully beyond exploration. The commitment is concrete and traceable, signed partnerships, announced investments, or exclusive agreements."
  },
  "Decision Gating": {
    color: "#166534",
    cls: "text-orange-700",
    desc: "A pilot, demonstration, or event whose outcome will explicitly determine a subsequent commercial decision. The result conditions what happens next."
  },
  "Unexpected Participant": {
    color: "#059669",
    cls: "text-emerald-700",
    desc: "A player from an adjacent or unrelated field enters the technology segment commercially, or an unusual partnership forms that the existing competitive picture did not anticipate. The surprise is the defining characteristic."
  },
  "Landscape Restructuring": {
    color: "#dc2626",
    cls: "text-red-700",
    desc: "An event that changes the competitive structure itself. After this event, who can compete, what standards must be met, or what technical approaches are viable is different for all participants, not just the parties directly involved."
  },
  "Inflection": {
    color: "#15803d",
    cls: "text-emerald-700",
    desc: "A credible directional change in the technology's trajectory. Not an incremental continuation of the existing trend, but a point where the direction shifts. The change must be grounded in specific evidence."
  }
};
const SigTypeTooltip = ({
  label
}) => {
  const { ref, v, pos, show, hide } = useSmartPos();
  const cfg = SIG_TYPE_TIPS[label];
  if (!cfg) return null;
  return <span className="inline-flex items-center flex-shrink-0"><svg ref={ref as React.RefObject<SVGSVGElement>} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={v ? "#475569" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-help transition-colors" onMouseEnter={show} onMouseLeave={hide}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>{v && <TipBox pos={pos} title={label} titleColor={cfg.color}>{cfg.desc}</TipBox>}</span>;
};
const SIGNAL_TYPE_TIPS = {
  // Innovation
  "Patents Granted": {
    layer: "innovation",
    desc: "Groups of related patent applications covering the same invention across one or more jurisdictions. Counted as families to avoid inflating numbers from multi-jurisdiction filings.",
    note: ""
  },
  "Research Publications": {
    layer: "innovation",
    desc: "Peer-reviewed papers and preprints from academic and corporate research groups."
  },
  "Publications & Funding": {
    layer: "innovation",
    desc: "Peer-reviewed papers and preprints from academic and corporate research groups, combined with disclosed investment rounds into startups and research ventures. Undisclosed rounds are excluded."
  },
  "Funding Deployed": {
    layer: "innovation",
    desc: "Disclosed investment rounds into startups and research ventures. Undisclosed rounds are excluded."
  },
  "Startup Formations": {
    layer: "innovation",
    desc: "Named, verified new company formations working directly in the technology segment."
  },
  "Hiring Activity": {
    layer: "innovation",
    desc: "Named, verifiable hiring of technical roles at organisations active in the technology segment. Used as an indicator of organisational commitment."
  },
  // Commercial
  "Product Launches": {
    layer: "commercial",
    desc: "Named product or feature releases made publicly available. Includes generally available releases and limited-access launches."
  },
  "Partnerships": {
    layer: "commercial",
    desc: "Formal agreements between named parties that include a specific commercial commitment. Excludes vague memoranda of understanding."
  },
  "Partnerships & Deployments": {
    layer: "commercial",
    desc: "Formal agreements between named parties that include a specific commercial commitment, plus full production deployments of the technology with a named customer or operator."
  },
  "Deployments": {
    layer: "commercial",
    desc: "Full production deployments of the technology with a named customer or operator. The technology is live and in active use."
  },
  "Pilots": {
    layer: "commercial",
    desc: "Named proof-of-concept or limited-scope deployments with at least one disclosed partner. The deployment is real but not yet in full production use."
  },
  "Design Wins": {
    layer: "commercial",
    desc: "Named customer selections or contract awards that represent a commercial commitment, even before the product is fully deployed."
  },
  // Structural
  "M&A & Investments": {
    layer: "structural",
    desc: "Named mergers, acquisitions, and strategic investment transactions. Includes minority investments made for strategic rather than purely financial reasons."
  },
  "M&A": {
    layer: "structural",
    desc: "Named mergers and acquisitions. Includes strategic investments made for competitive rather than purely financial reasons."
  },
  "Regulatory Milestones": {
    layer: "structural",
    desc: "Enacted laws, ratified regulations, enforcement actions, and formal government decisions that affect how the technology can be developed or deployed."
  },
  "Standards & Frameworks": {
    layer: "structural",
    desc: "Formal decisions by standards bodies, consortia, or government agencies that define technical requirements or interoperability specifications."
  },
  "Standards Decisions": {
    layer: "structural",
    desc: "Formal decisions by standards bodies, consortia, or government agencies that define technical requirements or interoperability specifications."
  },
  "Open-Source Releases": {
    layer: "structural",
    desc: "Major versioned releases of open-source frameworks or tools that affect the development landscape for the technology segment."
  },
  "Supply Chain Shifts": {
    layer: "structural",
    desc: "Changes in component availability, supplier consolidation, or material constraints that affect the commercial viability of the technology at scale."
  }
};
const LAYER_COLORS = {
  innovation: "#059669",
  commercial: "#059669",
  structural: "#166534"
};
const LAYER_LABELS = {
  innovation: "Innovation Signals",
  commercial: "Commercialisation Signals",
  structural: "Structural Signals"
};
const SignalTypeTooltip = ({
  title
}) => {
  const { ref, v, pos, show, hide } = useSmartPos();
  const cfg = SIGNAL_TYPE_TIPS[title];
  if (!cfg) return null;
  const color = LAYER_COLORS[cfg.layer];
  return <span className="inline-flex items-center flex-shrink-0"><svg ref={ref as React.RefObject<SVGSVGElement>} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={v ? "#475569" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-help transition-colors" onMouseEnter={show} onMouseLeave={hide}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>{v && <TipBox pos={pos}><div className="text-[10px] font-semibold mb-0.5 leading-snug" style={{color}}>{LAYER_LABELS[cfg.layer]}</div><div className="text-[12px] font-bold text-[#0f2644] mb-1 leading-snug">{title}</div><p className="leading-relaxed">{cfg.desc}</p>{cfg.note && <div className="mt-2 rounded-lg p-2 bg-slate-50 border border-slate-100"><p className="text-[10px] text-[#0f2644] leading-snug"><span>Note: </span>{cfg.note}</p></div>}</TipBox>}</span>;
};
const TIER_TIPS = {
  "Pioneer": {
    color: "#166534",
    desc: "This organisation shaped the trajectory of the technology segment through a defining activity. Examples include the first landmark publication that established a new paradigm, the first commercial deployment at scale, or the regulatory standard that others must comply with. The defining activity must be traceable in the evidence."
  },
  "Established": {
    color: "#059669",
    desc: "This organisation has an active, sustained presence across multiple signal types. Multiple product launches, patents, or partnerships are visible, but no single defining action that set the direction of the technology segment."
  },
  "Challenger": {
    color: "#16a34a",
    desc: "This organisation has recent, focused activity with growing momentum. The evidence footprint is narrower than an Established player. Challengers are typically startups or new entrants making a concentrated bet in one area."
  },
  "Specialist": {
    color: "#16a34a",
    desc: "This organisation has deep signal concentration in one technology segment niche. Presence is narrow in scope but meaningful within that specific area. Does not imply the organisation is small."
  }
};
const ROLE_TIPS = {
  "Commercialiser": {
    desc: "The organisation's primary signals are in the commercial layer: product launches, deployments, and partnerships. This is the most common primary role."
  },
  "Innovator": {
    desc: "The organisation's primary signals are in the innovation layer: patents and publications. Research institutions and IP-focused companies often carry this role."
  },
  "Infrastructure": {
    desc: "The organisation provides foundational services or platforms that other players build on. Cloud providers offering managed services are a common example."
  },
  "Standards-setter": {
    desc: "The organisation's primary signal presence is in standards body decisions, open-source framework releases, or technical specifications that others adopt."
  },
  "Regulator": {
    desc: "The organisation's primary signals are regulatory enactments or enforcement actions. Government bodies and legislative institutions carry this role."
  }
};
const TierTooltip = ({
  tier, playerName = ""
}) => {
  const { ref, v, pos, show, hide } = useSmartPos();
  const cfg = TIER_TIPS[tier];
  if (!cfg) return null;
  const rationale = playerName ? PLAYER_TIER_RATIONALE[playerName]?.tier : null;
  return <span className="inline-flex items-center flex-shrink-0"><svg ref={ref as React.RefObject<SVGSVGElement>} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={v ? "#475569" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-help transition-colors" onMouseEnter={show} onMouseLeave={hide}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>{v && <TipBox pos={pos} title={tier} titleColor={cfg.color}><p className="mb-1.5">{cfg.desc}</p>{rationale && <p className="text-[12px] text-[#0f2644] leading-relaxed mt-2 pt-2 border-t border-slate-100">{rationale}</p>}<p className="text-[10px] text-[#0f2644] italic leading-snug border-t border-slate-100 pt-1.5 mt-1.5">Tiers reflect signal presence in this analysis only, not overall size, revenue, or market position.</p></TipBox>}</span>;
};
const RoleTooltip = ({
  role, playerName = ""
}) => {
  const { ref, v, pos, show, hide } = useSmartPos();
  const cfg = ROLE_TIPS[role];
  if (!cfg) return null;
  const rationale = playerName ? PLAYER_TIER_RATIONALE[playerName]?.role : null;
  return <span className="inline-flex items-center flex-shrink-0"><svg ref={ref as React.RefObject<SVGSVGElement>} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={v ? "#475569" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-help transition-colors" onMouseEnter={show} onMouseLeave={hide}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>{v && <TipBox pos={pos} title={role}><p className="mb-1.5">{cfg.desc}</p>{rationale && <p className="text-[12px] text-[#0f2644] leading-relaxed mt-2 pt-2 border-t border-slate-100">{rationale}</p>}</TipBox>}</span>;
};
const MiniBarChart = ({
  years,
  values,
  labels,
  color,
  yTicks,
  yLabel,
  partialIdx = -1
}) => {
  const W = 420,
    H = 236,
    padL = 52,
    padR = 16,
    padT = 28,
    padB = 44;
  const chartW = W - padL - padR,
    chartH = H - padT - padB - 14;
  const maxVal = Math.max(...values) * 1.1;
  const nBars = years.length,
    barGap = 10;
  const barW = (chartW - barGap * (nBars - 1)) / nBars;
  const peakIdx = values.indexOf(Math.max(...values));
  const lastYear = years[years.length - 1];
  const hatchId = `hatch-${color.replace('#','')}`;
  // Green shade palette: lightest to darkest based on relative value
  const GREEN_SHADES = ["#bbf7d0", "#86efac", "#4ade80", "#22c55e", "#16a34a", "#15803d"];
  const getShade = val => {
    const ratio = val / Math.max(...values);
    const idx = Math.min(Math.floor(ratio * GREEN_SHADES.length), GREEN_SHADES.length - 1);
    return GREEN_SHADES[idx];
  };
  return <div><svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{
      overflow: "visible"
    }}><defs><pattern id={hatchId} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)"><rect width="6" height="6" fill={`${color}22`} /><line x1="0" y1="0" x2="0" y2="6" stroke={`${color}99`} strokeWidth="3" /></pattern></defs><text x={10} y={padT + chartH / 2} textAnchor="middle" fontSize="10" fill="#94a3b8" transform={`rotate(-90,10,${padT + chartH / 2})`} fontFamily="system-ui,sans-serif">{yLabel}</text>{yTicks.map(tick => {
        const y = padT + chartH - tick / maxVal * chartH;
        return <g key={tick}><line x1={padL} y1={y} x2={W - padR} y2={y} stroke={tick === 0 ? "#e2e8f0" : "#f1f5f9"} strokeWidth={tick === 0 ? "1.5" : "1"} strokeDasharray={tick === 0 ? "none" : "4 3"} /><text x={padL - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8" fontFamily="system-ui,sans-serif">{tick === 0 ? "0" : tick >= 1000 ? `${tick / 1000}K` : tick}</text></g>;
      })}{years.map((yr, i) => {
        const isPeak = i === peakIdx;
        const isPartial = i === partialIdx;
        const barColor = getShade(values[i]);
        const bH = Math.max(values[i] / maxVal * chartH, 4);
        const x = padL + i * (barW + barGap),
          y = padT + chartH - bH;
        return <g key={yr}><rect x={x} y={y} width={barW} height={bH} rx="4" fill={isPartial ? `url(#${hatchId})` : barColor} stroke={isPartial ? color : "none"} strokeWidth={isPartial ? "1" : "0"} strokeDasharray={isPartial ? "2 2" : "none"} /><text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize="10.5" fontWeight={isPeak ? "700" : "500"} fill={isPeak ? "#15803d" : isPartial ? "#94a3b8" : "#64748b"} fontStyle={isPartial ? "italic" : "normal"} fontFamily="system-ui,sans-serif">{labels[i]}{isPartial ? "*" : ""}</text><text x={x + barW / 2} y={H - padB + 2} textAnchor="middle" fontSize="11" fontWeight={isPeak ? "700" : "400"} fontStyle={isPartial ? "italic" : "normal"} fill={isPeak ? "#0f2644" : "#94a3b8"} fontFamily="system-ui,sans-serif">{yr}</text></g>;
      })}{partialIdx >= 0 && <text x={padL} y={H - 2} textAnchor="start" fontSize="9.5" fill="#94a3b8" fontStyle="italic" fontFamily="system-ui,sans-serif">* 2026 data represents a partial year (January–present)</text>}</svg></div>;
};
const SubdomainMaturityCard = ({
  setTab,
  setSelSd,
  setRootSdId
}) => {
  const stageClr = {
    Lab: "#15803d",
    Pilot: "#166534",
    "Early Commercial": "#059669",
    Scaling: "#059669"
  };
  const stageBg = {
    Lab: "#f0fdf4",
    Pilot: "#fffbeb",
    "Early Commercial": "#f0fdf4",
    Scaling: "#f0fdf4"
  };
  const patClr = {
    "Aligned-Accelerating": {
      color: "#059669",
      bg: "#f0fdf4",
      border: "#bbf7d0"
    },
    "Innovation-Ahead": {
      color: "#059669",
      bg: "#f0fdf4",
      border: "#bbf7d0"
    },
    "Structurally-Gated": {
      color: "#166534",
      bg: "#fffbeb",
      border: "#fde68a"
    },
    "Divergent": {
      color: "#dc2626",
      bg: "#fef2f2",
      border: "#fecaca"
    }
  };
  const sigCfg = [{
    key: "innIntensity",
    label: "Innovation",
    color: "#059669",
    bg: "#dcfce7",
    tip: "Tracks the creation of new knowledge and early-stage investment. Covers patent filings, research publications, disclosed funding rounds, startup formations, and hiring activity.",
    note: ""
  }, {
    key: "cmrIntensity",
    label: "Commercial",
    color: "#059669",
    bg: "#d1fae5",
    tip: "Tracks the packaging, selling, and adoption of the technology. Covers named product launches, formal partnerships with commitments, pilots and demonstrations, commercial deployments, and design wins.",
    note: ""
  }, {
    key: "strIntensity",
    label: "Structural",
    color: "#166534",
    bg: "#fef3c7",
    tip: "Tracks changes to the rules of the market. Covers mergers and acquisitions, regulatory enactments, standards body decisions, supply chain shifts, and major open-source releases.",
    note: "These signals shape what all players in the space can do. A regulation or acquisition can constrain or unlock the entire technology segment."
  }];
  return <div id="technology segment-maturity" className="bg-white border border-slate-200 rounded-2xl overflow-hidden"><div className="flex items-center justify-between px-5 py-4 border-b border-slate-100"><div><div className="text-[15px] font-bold text-[#0f2644]">Technology Segment Maturity Spectrum</div><div className="text-[12px] text-[#0f2644] mt-0.5">Where each technology segment sits on the development journey, and which signals lead</div></div><button onClick={() => setTab('subdomains_detail')} className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#0f2644] hover:text-[#0f2644] border border-slate-200 rounded-lg px-3 py-1.5 hover:border-slate-300 transition-colors">Deep dive<svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg></button></div><div className="px-5 pb-5 space-y-3">{SUBDOMAINS.map((sd, i) => {
        const mom = SD_MOM[sd.id];
        const pc = (patClr[mom.pattern] ?? {color:"#64748b",bg:"#f8fafc",border:"#e2e8f0"});
        const sc = (stageClr[sd.stage] ?? "#64748b");
        const sb = (stageBg[sd.stage] ?? "#f8fafc");
        return <div key={i} onClick={() => {
          if (setRootSdId) setRootSdId(sd.id);
          setTab('subdomains_detail');
        }} className="group rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-sm hover:bg-slate-50/60"><div className="h-0.5 bg-slate-200" /><div className="p-4 flex items-center gap-4"><div className="w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-bold flex-shrink-0 transition-colors" style={{
              background: sb,
              color: sc
            }}>{i + 1}</div><div className="flex-1 min-w-0"><div className="flex items-center gap-2 flex-wrap"><span className="text-[15px] font-semibold text-[#0f2644]">{sd.name}</span><span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{
                  background: sb,
                  color: sc
                }}>{sd.stage}</span></div></div><div className="flex items-center gap-1.5 flex-shrink-0"><span className="inline-block text-[12px] font-semibold px-2.5 py-1 rounded-lg border" style={{
                background: pc.bg,
                color: pc.color,
                borderColor: pc.border
              }}>{mom.pattern}</span></div><svg width="14" height="14" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="flex-shrink-0 group-hover:stroke-[#1EDD7D] transition-colors"><path d="M5 12h14M12 5l7 7-7 7" /></svg></div></div>;
      })}</div><div className="px-5 pb-5"><KeyTakeaway points={["<strong>All three technology segments are at Scaling stage:</strong> Software Engineering Agents, Customer-Facing Agents, and Orchestration & Developer Infrastructure each show named products generating disclosed revenue at named enterprise customers, the strongest maturity classification the platform assigns.", "<strong>All three are Aligned-Accelerating:</strong> innovation, commercialisation, and structural signals are reinforcing each other simultaneously in every segment, rather than one layer racing ahead of the others."]} /></div></div>;
};



const VB = ({
  years, values, title, note, color = "#16a34a", statusBreakdown = null, isAggregated = false
}: {years:number[]; values:number[]; title?:string; note?:string; color?:string; statusBreakdown?:any; isAggregated?:boolean}) => {
  const max = Math.max(...values, 1);
  const peakIdx = values.indexOf(Math.max(...values));
  const barColor = (pct:number, isPeak:boolean, isLast:boolean) => {
    const SHADES = ["#bbf7d0","#86efac","#4ade80","#22c55e","#16a34a","#15803d"];
    if (isPeak) return "linear-gradient(180deg,#22c55e,#16a34a)";
    if (isLast) { const c = SHADES[Math.min(Math.floor(pct/100*4),SHADES.length-1)]; return `repeating-linear-gradient(45deg,${c}70,${c}70 4px,${c}30 4px,${c}30 8px)`; }
    return SHADES[Math.min(Math.floor(pct/100*4),SHADES.length-1)];
  };
  const fmt = (v:number) => v > 0 ? (v >= 1000 ? v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : String(v)) : "–";
  const BAR_H = 80;
  return <div>
    {title && <div className="flex items-center gap-1.5 mb-3"><span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:color}}/><div className="text-[12px] font-semibold text-[#0f2644] leading-snug">{title}</div></div>}
    <div className="flex items-end gap-1.5" style={{height:BAR_H+30}}>{years.map((yr,i)=>{
      const pct = max>0 ? values[i]/max*100 : 0;
      const isPeak = i===peakIdx;
      const isLast = i===years.length-1;
      const bH = Math.max(pct/100*BAR_H, values[i]>0?3:0);
      return <div key={yr} className="flex flex-col items-center flex-1 min-w-0">
        <div className="relative w-full" style={{height:BAR_H}}>
          <span className={`absolute left-0 right-0 text-center text-[10px] tabular-nums ${isPeak?"font-bold text-emerald-700":isLast?"text-[#0f2644] italic":"text-[#0f2644]"}`} style={{bottom:bH+2}}>{fmt(values[i])}{isLast?"*":""}</span>
          <div className="absolute bottom-0 w-full rounded-t-[3px] overflow-hidden" style={{height:bH, background:barColor(pct,isPeak,isLast)}}/>
        </div>
        <span className={`text-[9px] font-mono mt-1 ${isPeak?"font-bold text-[#0f2644]":isLast?"text-[#0f2644] italic":"text-[#0f2644]"}`}>{String(yr)}</span>
      </div>;
    })}</div>
    {isAggregated
      ? (/patent/i.test(title||"")
          ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0f2644] cursor-help mt-2 pt-2 border-t border-slate-100"><HoverTip title="Source &amp; Methodology" label="Source &amp; methodology" desc={<><p>Patent counts are aggregated year-wise from the individual patent datasets of each technology segment. Each technology segment's dataset is sourced from Google Patents using segment-specific keyword and classification filters.</p><p className="mt-2 pt-2 border-t border-slate-100 text-[10px] leading-relaxed">Data for individual technology segments can be viewed in the Signals tab under the Innovation Signals sub-tab. Users can navigate to this section and scroll to the relevant technology segment to view the underlying data corresponding to the individual chart values.</p></>} /></span>
          : /publication/i.test(title||"")
          ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0f2644] cursor-help mt-2 pt-2 border-t border-slate-100"><HoverTip title="Source &amp; Methodology" label="Source &amp; methodology" desc={<><p>Publication counts are aggregated year-wise from the individual publication datasets of each technology segment. Each technology segment's dataset is sourced from Google Scholar using segment-specific keyword filters.</p><p className="mt-2 pt-2 border-t border-slate-100 text-[10px] leading-relaxed">Data for individual technology segments can be viewed in the Signals tab under the Innovation Signals sub-tab. Users can navigate to this section and scroll to the relevant technology segment to view the underlying data corresponding to the individual chart values.</p></>} /></span>
          : /funding/i.test(title||"")
          ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0f2644] cursor-help mt-2 pt-2 border-t border-slate-100"><HoverTip title="Source &amp; Methodology" label="Source &amp; methodology" desc={<><p>Funding figures are aggregated year-wise from the individual funding datasets of each technology segment. Each segment's funding is estimated from disclosed rounds; the top 10 rounds per year are assumed to represent approximately 80% of total funding. Totals are extrapolated accordingly and summed across all three technology segments.</p><p className="mt-2 pt-2 border-t border-slate-100 text-[10px] leading-relaxed">Data for individual technology segments can be viewed in the Signals tab under the Innovation Signals sub-tab. Users can navigate to this section and scroll to the relevant technology segment to view the underlying data corresponding to the individual chart values.</p></>} /></span>
          : null)
      : (/patent/i.test(title||"")
          ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0f2644] cursor-help mt-2 pt-2 border-t border-slate-100"><HoverTip title="Source &amp; Methodology" label="Source &amp; methodology" desc="The data is aggregated from Google Patents and categorized by year for the technology segment."/></span>
          : /publication/i.test(title||"")
          ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0f2644] cursor-help mt-2 pt-2 border-t border-slate-100"><HoverTip title="Source &amp; Methodology" label="Source &amp; methodology" desc="The data is aggregated from Google Scholar and categorized by year for the technology segment."/></span>
          : /funding/i.test(title||"")
          ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0f2644] cursor-help mt-2 pt-2 border-t border-slate-100"><HoverTip title="Source &amp; Methodology" label="Source &amp; methodology" desc="Funding deployed is estimated using disclosed funding rounds identified within the technology segment. For each year, the top 10 funding rounds are assumed to represent approximately 80% of total funding activity. Total annual funding is extrapolated accordingly to estimate funding deployed."/></span>
          : note && note.trim() && <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0f2644] cursor-help mt-2 pt-2 border-t border-slate-100"><HoverTip title="Source & Methodology" label="Source & methodology" desc={note}/></span>)
    }
    <p className="text-[10px] text-[#0f2644] italic mt-1.5">* 2026 data represents a partial year (January–present)</p>
  </div>;
};
const OverviewPanel = ({
  setTab,
  setRootSigTab,
  setRootPgSubTab,
  setRootSelPlayer,
  setRootSdId
}) => {
  const [selSd, setSelSd] = useState(null);
  const [ecoExpanded, setEcoExpanded] = useState(false);
  const selSdData = (SUBDOMAINS.find(s=>s.id===selSd) ?? null);

  // ── Headline totals computed as the genuine SUM of the per-technology segment
  //    charts shown in the Signals tab, so Overview reconciles with Signals. ──
  const OV_YEARS = [2022, 2023, 2024, 2025, 2026];
  const OV_PARTIAL_IDX = OV_YEARS.length - 1; // 2026 (partial)
  const sumAcrossCharts = charts => OV_YEARS.map(y => charts.reduce((acc, c) => {
    const idx = c.years.indexOf(y);
    return acc + (idx >= 0 ? (c.values[idx] || 0) : 0);
  }, 0));
  const allInnCharts = SIGNAL_DATA.innovation.flatMap(sd => (sd.blocks || [sd.left, sd.right]).flatMap(b => b.charts));
  const fundingCharts = allInnCharts.filter(c => /funding/i.test(c.title));
  const patentCharts = allInnCharts.filter(c => /patent/i.test(c.title));
  const fundingTotals = sumAcrossCharts(fundingCharts);
  const patentTotals = sumAcrossCharts(patentCharts);
  const fmtUSD = m => m >= 1000 ? `$${(m / 1000).toFixed(m % 1000 === 0 ? 0 : 2)}B` : `$${m}M`;
  const fmtNum = n => n.toLocaleString("en-US");
  const fundingLabels = fundingTotals.map(fmtUSD);
  const patentLabels = patentTotals.map(fmtNum);
  const fundingPeak = Math.max(...fundingTotals.slice(0, -1)); // exclude partial 2026
  const patentPeak = Math.max(...patentTotals.slice(0, -1));
  const niceTicks = (maxv, steps = 4) => {
    const raw = maxv / steps;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = Math.ceil(raw / mag) * mag;
    return Array.from({ length: steps + 1 }, (_, i) => i * step);
  };

  // ── Inline technology segment detail drawer (opens within Overview) ──
  const OverviewDrawer = () => {
    const sd = selSdData;
    if (!sd) return null;
    const patternColor = {
      "Aligned-Accelerating": "#059669",
      "Innovation-Ahead": "#059669",
      "Structurally-Gated": "#166534",
      "Divergent": "#dc2626"
    };
    const stageColorMap = {
      Lab: "#15803d",
      Pilot: "#166534",
      "Early Commercial": "#059669",
      Scaling: "#059669"
    };
    const mom = SD_MOM[sd.id];
    const patColor = (patternColor[mom.pattern] ?? "#64748b");
    const stageColor = (stageColorMap[sd.stage] ?? "#64748b");
    return <div className="fixed inset-0 z-[500] flex"><div className="flex-1 bg-black/30 backdrop-blur-[2px]" onClick={() => setSelSd(null)} /><div className="w-[700px] flex-shrink-0 bg-white flex flex-col h-full shadow-2xl border-l border-slate-200"><div className="flex-shrink-0 border-b border-slate-100"><div className="h-1 w-full" style={{
            background: `linear-gradient(90deg,${stageColor},${stageColor}40)`
          }} /><div className="px-6 py-4 flex items-start justify-between gap-4"><div className="flex-1 min-w-0"><h2 className="text-[17px] font-bold text-[#0f2644] leading-snug">{sd.name}</h2><div className="flex items-center gap-2 mt-2 flex-wrap"><span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${sd.stageColor}`}><span className="opacity-60 font-medium mr-1">Stage</span>{sd.stage}</span><span className="text-[10px] font-bold px-2.5 py-1 rounded-lg border inline-flex items-center gap-1" style={{
                  background: `${patColor}10`,
                  borderColor: `${patColor}25`,
                  color: patColor
                }}><span className="opacity-60 font-medium mr-1">Pattern</span>{mom.pattern}<PatternTooltip pattern={mom.pattern} /></span></div></div><button onClick={() => setSelSd(null)} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-[#0f2644] hover:bg-slate-50 transition-colors flex-shrink-0"><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button></div></div><div className="flex-1 overflow-y-auto"><div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">{[{
              label: "Innovation",
              sigType: "innovation",
              badgeLabel: "Innovation activities",
              level: sd.innIntensity,
              color: "#059669",
              bg: "#dcfce7",
              tip: "Tracks the creation of new knowledge and early-stage investment. Covers patent filings, research publications, disclosed funding rounds, startup formations, and hiring activity.",
              note: ""
            }, {
              label: "Commercial",
              sigType: "commercial",
              badgeLabel: "Commercialisation activities",
              level: sd.cmrIntensity,
              color: "#059669",
              bg: "#d1fae5",
              tip: "Tracks the packaging, selling, and adoption of the technology. Covers named product launches, formal partnerships with commitments, pilots and demonstrations, commercial deployments, and design wins.",
              note: ""
            }, {
              label: "Structural",
              sigType: "structural",
              badgeLabel: "Structural activities",
              level: sd.strIntensity,
              color: "#166534",
              bg: "#fef3c7",
              tip: "Tracks changes to the rules of the market. Covers mergers and acquisitions, regulatory enactments, standards body decisions, supply chain shifts, and major open-source releases.",
              note: "These signals shape what all players in the space can do. A regulation or acquisition can constrain or unlock the entire technology segment."
            }].map(row => {
              /* Use global total from ACT_COUNTS (same as Signal tab badges) */
              const actCount = ACT_COUNTS[row.sigType];
              const handleClick = () => {
                setSelSd(null);
                setRootSigTab(row.sigType);
                setTab("signals");
              };
              return <div key={row.label} className="px-5 py-4 flex flex-col gap-1 transition-colors cursor-pointer hover:bg-slate-50 group" onClick={handleClick}><div className="flex items-center gap-1 mb-0.5"><div className="text-[12px] font-medium text-[#0f2644] tracking-normal">{row.label}</div><InfoTooltip label={row.label} tip={row.tip} note={row.note} color={row.color} /></div><div className="flex items-baseline gap-2 flex-wrap"><HoverTip hideIcon={true} title={`${row.label} Signal Intensity: ${row.level.charAt(0).toUpperCase()+row.level.slice(1)}`} label={<span className="text-[14px] font-semibold capitalize cursor-help" style={{color:row.color}}>{row.level}<span className="text-[12px] ml-0.5 opacity-50">ⓘ</span></span>} desc={INTENSITY_RATIONALE[row.sigType==='commercial'?'cmr':row.sigType==='structural'?'str':'inn']?.[sd.id] || ""} /><span className="text-[12px] font-bold px-1.5 py-0.5 rounded-full tabular-nums" style={{
                    background: `${row.color}15`,
                    color: row.color
                  }}>{actCount} {row.badgeLabel}</span></div><div className="flex items-center gap-0.5 mt-1.5"><span className="text-[12px] font-medium text-[#0f2644] group-hover:text-slate-600 transition-colors leading-none">View in Signals tab</span><svg width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-[#0f2644] group-hover:text-slate-600 transition-colors flex-shrink-0"><path d="M5 12h14M12 5l7 7-7 7" /></svg></div></div>;
            })}</div><div className="px-6 py-4 border-b border-slate-100"><div className="text-[13px] font-medium text-[#0f2644] mb-2">Summary</div><p className="text-[12px] text-[#0f2644] leading-relaxed">{sd.summary}</p></div><div className="px-6 py-4 border-b border-slate-100"><div className="flex items-center gap-1 mb-3"><div className="text-[12px] font-medium text-[#0f2644] tracking-normal">Momentum</div><MomentumSectionTooltip /></div><div className="grid grid-cols-3 gap-3">{[{
                label: "Innovation Signals",
                tag: mom.inn.tag,
                i: mom.inn.i,
                g: mom.inn.g
              }, {
                label: "Commercialisation Signals",
                tag: mom.cmr.tag,
                i: mom.cmr.i,
                g: mom.cmr.g
              }, {
                label: "Structural Signals",
                tag: mom.str.tag,
                i: mom.str.i,
                g: mom.str.g
              }].map(m => {
                const tagColor = {
                  accelerating: "#16a34a",
                  steady: "#166534",
                  emerging: "#15803d",
                  quiet: "#94a3b8"
                };
                const tagBg = {
                  accelerating: "#f0fdf4",
                  steady: "#fffbeb",
                  emerging: "#f0fdf4",
                  quiet: "#f8fafc"
                };
                const tagBorder = {
                  accelerating: "#bbf7d0",
                  steady: "#fde68a",
                  emerging: "#d1fae5",
                  quiet: "#e2e8f0"
                };
                const dotActiveColor = {
                  accelerating: "#16a34a",
                  steady: "#166534",
                  emerging: "#15803d",
                  quiet: "#94a3b8"
                };
                const color = (tagColor[m.tag] ?? "#94a3b8");
                const dotCount: Record<string,number> = { accelerating: 3, steady: 2, emerging: 1, quiet: 0 };
                const dots = dotCount[m.tag] ?? 0;
                return <div key={m.label} className="rounded-xl border p-4 flex flex-col gap-2" style={{
                  background: (tagBg[m.tag] ?? "#f8fafc"),
                  borderColor: (tagBorder[m.tag] ?? "#e2e8f0")
                }}><div className="text-[10px] font-bold text-[#0f2644] tracking-normal">{m.label}</div><div className="text-[16px] font-bold capitalize leading-none" style={{
                    color
                  }}>{m.tag}</div><div className="flex items-center gap-1.5"><div className="flex gap-0.5">{[0, 1, 2].map(idx => <div key={idx} className="w-2 h-2 rounded-full" style={{
                        background: idx < dots ? (dotActiveColor[m.tag] ?? "#94a3b8") : "#e2e8f0"
                      }} />)}</div><span className="text-[12px] font-medium capitalize" style={{
                      color
                    }}>{m.i.charAt(0).toUpperCase() + m.i.slice(1)}</span><TrajectoryTooltip tag={m.tag} /></div><p className="text-[12px] text-[#0f2644] leading-relaxed mt-1">{m.g}</p></div>;
              })}</div></div>{mom.inf.length > 0 && <div className="px-6 py-4 bg-[#f0fdf4]/50"><div className="flex items-center gap-1 mb-2"><div className="text-[12px] font-medium text-[#15b865] tracking-normal">Inflection Points</div><InflectionPointsTooltip /></div>{mom.inf.map((inf, i) => <div key={i} className="flex gap-2 py-2 border-b border-[#bbf7d0]/40 last:border-0"><div className="w-1.5 h-1.5 rounded-full bg-[#1EDD7D] flex-shrink-0 mt-1.5" /><div><span className="text-[12px] font-semibold text-[#15b865] font-mono">{fmtDate(inf.split(": ")[0])}</span><p className="text-[12px] text-emerald-800 mt-0.5">{inf.split(": ")[1]}</p></div></div>)}</div>}</div></div></div>;
  };
  // ── KPI strip card ──
  const KpiCard = ({
    num,
    descriptor,
    label,
    sub,
    tab,
    sigSubTab,
    onClick,
    icon
  }) => <div onClick={onClick ?? (tab ? ()=>{ if(sigSubTab) setRootSigTab(sigSubTab); setTab(tab); } : undefined)} className={`group flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-4 transition-all duration-200 min-w-0 overflow-hidden
        ${tab || onClick ? "cursor-pointer hover:border-[#1EDD7D] hover:shadow-md hover:-translate-y-0.5" : ""}`}><div className="flex items-center gap-2 mb-3">{icon && <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 bg-slate-100 text-[#0f2644]">{icon}</div>}<div className="flex items-center gap-1 min-w-0"><span className="text-[12px] font-bold text-[#0f2644] tracking-[0.06em] leading-none truncate">{label}</span>{tab && <svg width="9" height="9" fill="none" stroke="#94a3b8" strokeWidth="2.5" viewBox="0 0 24 24" className="group-hover:stroke-[#1EDD7D] transition-colors flex-shrink-0"><path d="M7 17L17 7M7 7h10v10" /></svg>}</div></div><div className="flex items-baseline gap-1.5 mb-1.5"><span className="text-[27px] font-bold text-[#0f2644] leading-none tabular-nums">{num}</span><span className="text-[12px] font-semibold text-[#0f2644] leading-none">{descriptor}</span></div><div className="text-[12px] text-[#0f2644] leading-snug">{sub}</div></div>;
  // ── KPI card info tooltip (stops click-through to card navigation) ──
  const KpiInfoTooltip = ({ title, desc }: { title: string; desc: React.ReactNode }) => {
    const [v, setV] = useState(false);
    const [pos, setPos] = useState({top: 0, left: 0, below: false});
    const ref = useRef<HTMLSpanElement>(null);
    const handleEnter = () => {
      if (ref.current) {
        const r = ref.current.getBoundingClientRect();
        const below = r.top < 130;
        setPos({
          top: below ? r.bottom + 6 : r.top - 8,
          left: Math.min(Math.max(r.left, 8), window.innerWidth - 268),
          below
        });
      }
      setV(true);
    };
    return <span ref={ref} className="relative inline-flex flex-shrink-0" onClick={(e:any) => e.stopPropagation()} onMouseEnter={handleEnter} onMouseLeave={() => setV(false)}>
      <svg width="11" height="11" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0 cursor-help"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
      {v && <div style={{position:"fixed", top: pos.top, left: Math.min(Math.max(pos.left, 8), window.innerWidth - 266), transform: pos.below ? "none" : "translateY(-100%)", width:"250px", maxWidth:"250px", boxSizing:"border-box", wordBreak:"break-word", overflowWrap:"break-word", whiteSpace:"normal"}} className="z-[99999] bg-white text-[#0f2644] border border-slate-200 rounded-xl shadow-xl p-3 pointer-events-none text-left">
        <div className="text-[12px] font-bold mb-1.5 leading-snug">{title}</div>
        <div className="text-[12px] text-[#0f2644] leading-relaxed">{desc}</div>
      </div>}
    </span>;
  };
  return <div className="space-y-6"><OverviewDrawer /><div className="grid grid-cols-6 gap-3">
  {/* Technology Segments */}
  <div className="bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-[#1EDD7D] hover:shadow-md transition-all flex flex-col items-center justify-between text-center min-h-[100px]" onClick={() => setTab("subdomains_detail")}>
    <div className="flex items-center gap-1 w-full justify-center"><div className="text-[12px] font-bold text-[#0f2644] tracking-[0.05em] leading-snug text-center">Technology Segments</div><KpiInfoTooltip title="Technology Segments" desc="The technology segments into which all activities in this analysis are classified. Click to open the Technology Segments tab and view a deep-dive profile of each." /></div>
    <div className="text-[33px] font-black text-[#0f2644] leading-none py-1">3</div>
    <div className="text-[10px] text-[#0f2644] leading-snug w-full text-center">Segments mapped across all signal layers</div>
  </div>
  {/* Innovation Signals */}
  <div className="bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-[#1EDD7D] hover:shadow-md transition-all flex flex-col items-center justify-between text-center min-h-[100px]" onClick={() => { setRootSdId(null); setRootSigTab("innovation"); setTab("signals"); }}>
    <div className="flex items-center gap-1 w-full justify-center"><div className="text-[12px] font-bold text-[#0f2644] tracking-[0.05em] leading-snug text-center">Innovation Signals</div><KpiInfoTooltip title="Innovation Signals" desc="The total count of profiled Innovation activities across all technology segments, covering patents, publications, and funding events. Click to open the Innovation Signals sub-tab." /></div>
    <div className="text-[33px] font-black text-[#0f2644] leading-none py-1">{ACT_COUNTS.innovation}</div>
    <div className="text-[10px] text-[#0f2644] leading-snug w-full text-center">Innovation activities tracked</div>
  </div>
  {/* Commercialisation Signals */}
  <div className="bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-[#1EDD7D] hover:shadow-md transition-all flex flex-col items-center justify-between text-center min-h-[100px]" onClick={() => { setRootSdId(null); setRootSigTab("commercial"); setTab("signals"); }}>
    <div className="flex items-center gap-1 w-full justify-center"><div className="text-[12px] font-bold text-[#0f2644] tracking-[0.05em] leading-snug text-center">Commercialisation Signals</div><KpiInfoTooltip title="Commercialisation Signals" desc="The total count of profiled Commercialisation activities across all technology segments, covering product launches, deployments, partnerships, and revenue milestones. Click to open the Commercialisation Signals sub-tab." /></div>
    <div className="text-[33px] font-black text-[#0f2644] leading-none py-1">{ACT_COUNTS.commercial}</div>
    <div className="text-[10px] text-[#0f2644] leading-snug w-full text-center">Commercial activities tracked</div>
  </div>
  {/* Structural Signals */}
  <div className="bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-[#1EDD7D] hover:shadow-md transition-all flex flex-col items-center justify-between text-center min-h-[100px]" onClick={() => { setRootSdId(null); setRootSigTab("structural"); setTab("signals"); }}>
    <div className="flex items-center gap-1 w-full justify-center"><div className="text-[12px] font-bold text-[#0f2644] tracking-[0.05em] leading-snug text-center">Structural Signals</div><KpiInfoTooltip title="Structural Signals" desc="The total count of profiled Structural activities across all technology segments, covering funding, M&A, governance, standards, and regulatory events. Click to open the Structural Signals sub-tab." /></div>
    <div className="text-[33px] font-black text-[#0f2644] leading-none py-1">{ACT_COUNTS.structural}</div>
    <div className="text-[10px] text-[#0f2644] leading-snug w-full text-center">Structural activities tracked</div>
  </div>
  {/* Key Players */}
  <div className="bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-[#1EDD7D] hover:shadow-md transition-all flex flex-col items-center justify-between text-center min-h-[100px]" onClick={() => setTab("players_geo")}>
    <div className="flex items-center gap-1 w-full justify-center"><div className="text-[12px] font-bold text-[#0f2644] tracking-[0.05em] leading-snug text-center">Key Players</div><KpiInfoTooltip title="Key Players" desc="The number of distinct organisations identified across the evidence base with a verified signal presence, classified by evidence tier and role. Click to open the Players tab." /></div>
    <div className="text-[33px] font-black text-[#0f2644] leading-none py-1">{PLAYERS.length}</div>
    <div className="text-[10px] text-[#0f2644] leading-snug w-full text-center">Organisations with verified signal presence</div>
  </div>
  {/* Countries */}
  <div className="bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-[#1EDD7D] hover:shadow-md transition-all flex flex-col items-center justify-between text-center min-h-[100px]" onClick={() => { setRootPgSubTab("geography"); setTab("players_geo"); }}>
    <div className="flex items-center gap-1 w-full justify-center"><div className="text-[12px] font-bold text-[#0f2644] tracking-[0.05em] leading-snug text-center">Countries</div><KpiInfoTooltip title="Countries" desc="The number of distinct countries or regions where profiled activities are concentrated, based on the geography most closely associated with each activity. Click to open the Geography sub-tab." /></div>
    <div className="text-[33px] font-black text-[#0f2644] leading-none py-1">{GEO_DATA.filter(g=>g.country!=="European Union").length}</div>
    <div className="text-[10px] text-[#0f2644] leading-snug w-full text-center">Countries with signal activity identified</div>
  </div>
</div><div className="bg-white border border-slate-200 rounded-2xl overflow-hidden"><div className="flex items-center justify-between px-5 py-4 border-b border-slate-100"><div><div className="text-[15px] font-bold text-[#0f2644]">Profiled Activities by Technology Segment</div><div className="text-[12px] text-[#0f2644] mt-0.5">Each profiled activity is an individually named, dated and sourced event from the last 2 years, detailed in the Signals tab</div></div></div><div className="mx-5 mt-3 mb-1 p-2.5 bg-slate-50 rounded-lg flex items-start gap-2"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0f2644" strokeWidth="2" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg><p className="text-[12px] text-[#0f2644] leading-relaxed">Counts of <strong>key recent activities:</strong> individually named, dated, and sourced events from the last 2 years, profiled in the Signals tab. Click the count to navigate directly to the corresponding signal within the relevant technology segment.</p></div><div className="px-5 pb-5">
  
  <table className="w-full text-[12px] border-collapse">
    <thead>
      <tr className="border-b-2 border-slate-200">
        <th className="text-left py-2 pr-4 text-[12px] font-bold text-[#0f2644] w-2/5">Technology Segment</th>
        {[{key:"innovation",label:"Innovation",color:"#16a34a"},{key:"commercial",label:"Commercialisation",color:"#059669"},{key:"structural",label:"Structural",color:"#166534"}].map(({key,label,color})=>(
          <th key={key} className="text-center py-2 px-3">
            <button onClick={()=>{setRootSdId(null);setRootSigTab(key);setTab("signals");}} className="group flex flex-col items-center gap-0.5 mx-auto hover:opacity-80 transition-opacity cursor-pointer">
              <span className="text-[15px] font-bold" style={{color}}>{label}</span>
            </button>
          </th>
        ))}
        <th className="text-center py-2 px-3 text-[12px] font-bold text-[#0f2644]">Total</th>
      </tr>
    </thead>
    <tbody>
      {SUBDOMAINS.map((sd,i)=>{
        const sdKey=sd.id;
        const cnt=(pfx)=>Object.entries(COL_ACTS).filter(([k])=>k.startsWith(pfx)&&k.includes(sdKey)).reduce((s,[,v])=>s+v.filter(a=>a.date>="2024").length,0);
        const inn=cnt("inn_"),cmr=cnt("cmr_"),str=cnt("str_");
        return <tr key={sd.id} className={`border-b border-slate-100 ${i%2===0?"bg-white":"bg-slate-50/40"}`}>
          <td className="py-2.5 pr-4 text-[12px] font-medium text-[#0f2644] leading-snug">{sd.name}</td>
          <td className="text-center py-2.5 px-3 cursor-pointer hover:bg-emerald-50 transition-colors" onClick={()=>{setRootSdId(sdKey);setRootSigTab("innovation");setTab("signals");}}><span className="text-[16px] font-black text-[#16a34a] hover:underline">{inn}</span></td>
          <td className="text-center py-2.5 px-3 cursor-pointer hover:bg-emerald-50 transition-colors" onClick={()=>{setRootSdId(sdKey);setRootSigTab("commercial");setTab("signals");}}><span className="text-[16px] font-black text-[#059669] hover:underline">{cmr}</span></td>
          <td className="text-center py-2.5 px-3 cursor-pointer hover:bg-emerald-50 transition-colors" onClick={()=>{setRootSdId(sdKey);setRootSigTab("structural");setTab("signals");}}><span className="text-[16px] font-black text-[#166534] hover:underline">{str}</span></td>
          <td className="text-center py-2.5 px-3"><span className="text-[16px] font-black text-[#0f2644]">{inn+cmr+str}</span></td>
        </tr>;
      })}
    </tbody>
    <tfoot>
      <tr className="border-t-2 border-slate-200 bg-slate-50">
        <td className="py-2 pr-4 text-[12px] font-bold text-[#0f2644]">All technology segments</td>
        {(["inn_","cmr_","str_"] as const).map((pfx,i)=>{
          const sigKey = pfx==="inn_"?"innovation":pfx==="cmr_"?"commercial":"structural";
          const total = SUBDOMAINS.reduce((s,sd)=>s+Object.entries(COL_ACTS).filter(([k])=>k.startsWith(pfx)&&k.includes(sd.id)).reduce((r,[,v])=>r+v.filter(a=>a.date>="2024").length,0),0);
          return (
            <td key={pfx} className="text-center py-2 px-3 cursor-pointer hover:bg-emerald-50 transition-colors" onClick={()=>{setRootSigTab(sigKey);setTab("signals");}}>
              <span className="text-[13px] font-bold text-[#059669] hover:underline">{total}</span>
            </td>
          );
        })}
        <td className="text-center py-2 px-3 text-[12px] font-black text-[#0f2644]">
          {SUBDOMAINS.reduce((s,sd)=>s+["inn_","cmr_","str_"].reduce((r,pfx)=>r+Object.entries(COL_ACTS).filter(([k])=>k.startsWith(pfx)&&k.includes(sd.id)).reduce((r2,[,v])=>r2+v.filter(a=>a.date>="2024").length,0),0),0)}
        </td>
      </tr>
    </tfoot>
  </table>
</div><div className="px-5 pb-5 border-t border-slate-100"><KeyTakeaway points={["<strong>Innovation signals lead the profiled set</strong> in two of three technology segments (Software Engineering Agents: 14 vs 13; Customer-Facing Agents: 16 vs 12), with Orchestration & Developer Infrastructure showing equal Innovation and Commercialisation counts (12 each). This reflects a field where research and commercialisation are advancing in parallel, with active IP creation continuing alongside deployment.", "Innovation activity is running at or ahead of commercialisation across all three technology segments, consistent with a market that is scaling commercially while still generating new IP. The two are not sequential but concurrent."]} /></div></div><div className="bg-white border border-slate-200 rounded-2xl overflow-hidden"><div className="px-5 py-4 border-b border-slate-100"><div className="text-[15px] font-bold text-[#0f2644]">Technology Segment Maturity Spectrum</div><div className="text-[12px] text-[#0f2644] mt-0.5">Momentum scores and maturity classifications across all technology segments</div></div><div className="overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="bg-slate-50 border-b border-slate-100"><th className="text-left px-4 py-2.5 text-[13px] font-bold text-[#0f2644] whitespace-nowrap">Technology Segment</th><th className="text-center px-3 py-2.5 whitespace-nowrap"><span className="text-[13px] font-bold text-[#0f2644] flex items-center justify-center gap-1">Signal Momentum<HoverTip hideIcon={true} title="Signal Momentum" label={<span className="text-[10px] text-[#0f2644] cursor-help">ⓘ</span>} desc={<SignalMomentumTooltipContent />} /></span></th><th className="text-center px-3 py-2.5 whitespace-nowrap"><span className="text-[13px] font-bold text-[#0f2644] flex items-center justify-center gap-1">Maturity Stage<HoverTip hideIcon={true} title="Maturity Stage" label={<span className="text-[10px] text-[#0f2644] cursor-help">ⓘ</span>} desc={<MaturityStageTooltipContent />} /></span></th><th className="text-center px-3 py-2.5 whitespace-nowrap"><span className="text-[13px] font-bold text-[#0f2644] flex items-center justify-center gap-1">Cross-Signal Pattern<HoverTip hideIcon={true} title="Cross-Signal Pattern" label={<span className="text-[10px] text-[#0f2644] cursor-help">ⓘ</span>} desc={<CrossSignalPatternTooltipContent />} /></span></th></tr></thead><tbody>{SUBDOMAINS.map((sd, i) => {
                  const mom = SD_MOM[sd.id] || {};
                  const tDir = tag => {
                    const lbl = {
                      accelerating: "▲ Accelerating",
                      steady: "→ Steady",
                      emerging: "◎ Emerging",
                      decelerating: "▼ Decelerating",
                      quiet: "– Quiet"
                    }[tag] || tag;
                    const tipDesc = {
                      accelerating: "Activity in this signal layer is increasing year over year. The volume of named events is rising and the most recent period shows the highest activity.",
                      steady: "Activity is present and sustained but is not growing materially. The volume of named events is roughly flat across recent years.",
                      emerging: "A small number of early-stage activities have appeared recently for the first time. The signal type is new to this technology segment in the analysis.",
                      decelerating: "Activity that was previously rising has slowed. The most recent periods show fewer named events than earlier periods.",
                      quiet: "Minimal new activity is detectable for this signal layer in this technology segment."
                    }[tag] || "";
                    const tipTitle = {
                      accelerating: "Accelerating",
                      steady: "Steady",
                      emerging: "Emerging",
                      decelerating: "Decelerating",
                      quiet: "Quiet"
                    }[tag] || "";
                    return <HoverTip hideIcon={true} title={tipTitle} label={<span className="text-[12px] font-semibold text-[#0f2644] cursor-help">{lbl}</span>} desc={tipDesc} />;
                  };
                  const stageClr = {
                    Lab: "text-emerald-700 bg-emerald-50 border-emerald-200",
                    Pilot: "text-amber-700 bg-amber-50 border-amber-200",
                    "Early Commercial": "text-emerald-700 bg-emerald-50 border-emerald-200",
                    Scaling: "text-emerald-700 bg-emerald-50 border-emerald-200"
                  }[sd.stage] || "text-[#0f2644] bg-slate-50";
                  const patClr = {
                    "Aligned-Accelerating": "text-emerald-700",
                    "Innovation-Ahead": "text-emerald-700",
                    "Commercialising": "text-emerald-700",
                    "Structurally-Gated": "text-amber-700"
                  }[mom.pattern] || "text-[#0f2644]";
                  return <tr key={sd.id} className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${i === SUBDOMAINS.length - 1 ? "border-none" : ""}`} onClick={() => {
                    if (setRootSdId) setRootSdId(sd.id);
                    setTab("subdomains_detail");
                  }}><td className="px-4 py-3"><div className="text-[12px] font-semibold text-[#000000] leading-snug">{sd.name}</div></td>{(()=>{const mc=computeMomentum((SD_INN_Y[sd.id]||[]).filter((ch:any)=>/patent|publication|funding/i.test(ch.label||ch.title||"")));return <td className="text-center px-3 py-3"><div className="flex flex-col items-center gap-0.5"><span className="text-[12px] font-bold" style={{color:mc.color}}>{mc.label}</span><span className="text-[9px] text-[#0f2644] tabular-nums">{mc.pct>0?"+":""}{mc.pct}% CAGR</span><span className="text-[9px] text-[#0f2644]">{mc.accelerating?"↑ accelerating":""}</span></div></td>;})()}<td className="text-center px-3 py-3"><HoverTip hideIcon={true} title={sd.stage} label={<span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-help ${stageClr}`}>{sd.stage}</span>} desc={<MaturityStageTooltipContent />} /></td><td className="text-center px-3 py-3"><HoverTip hideIcon={true} title={mom.pattern} label={<span className="text-[12px] font-semibold text-[#0f2644] cursor-help">{mom.pattern}</span>} desc={<CrossSignalPatternTooltipContent />} /></td></tr>;
                })}</tbody></table></div><div className="px-5 pb-5 border-t border-slate-100"><KeyTakeaway points={["<strong>All three technology segments are at Scaling stage:</strong> the first time all layers of the agentic AI stack have reached the highest maturity classification simultaneously. This reflects broad reinforcing evidence: multiple independent players in each technology segment have crossed $1B+ ARR or 90M+ user milestones.", "<strong>Signal momentum is Hyper-growth across all three technology segments:</strong> average CAGRs for patents, publications, and funding all exceed 40% between 2022 and 2025, driven by simultaneous acceleration in research output, commercial deployment, and structural consolidation."]} /></div></div>

{/* ── Innovation Trend Charts ── */}
<div className="bg-white border border-slate-200 rounded-2xl p-5">{(()=>{
  const CHART_YEARS=[2022,2023,2024,2025,2026];
  const aggChart=(kw:string)=>({
    years:CHART_YEARS,
    values:CHART_YEARS.map(yr=>["sd1","sd2","sd3"].reduce((sum,sd)=>sum+(SD_INN_Y[sd]||[]).filter((c:any)=>(c.label||"").toLowerCase().includes(kw)).reduce((s2:number,c:any)=>{const idx=c.years.indexOf(yr);return s2+(idx>=0?c.values[idx]:0);},0),0))
  });
  const chartDefs=[
    {title:"Patents Granted",data:aggChart("patent"),color:"#047857",note:"Data aggregated from Google Patents. Aggregate across all three technology segments (agentic AI patent families). 2026 data represents a partial year (January–present)."},
    {title:"Research Publications",data:aggChart("publication"),color:"#0d9488",note:"Data aggregated from Google Scholar. Aggregate across three technology segments. 2026 data represents a partial year (January–present)."},
    {title:"Funding Deployed (USD Million)",data:aggChart("funding"),color:"#059669",note:"Disclosed funding rounds. Aggregate across all three technology segments, USD millions. 2026 data represents a partial year (January–present)."}
  ];
  return <div>
    <div className="flex items-center justify-between mb-4">
      <div>
        <div className="text-[15px] font-bold text-[#0f2644]">Innovation Trend Charts</div>
        <div className="text-[12px] text-[#0f2644] mt-0.5">Sum of patent, publication, and funding data across all three technology segments · 2022–2026</div>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4">
      {chartDefs.map((ch,i)=><div key={i} className="bg-slate-50/60 border border-slate-100 rounded-xl px-4 py-4">
        <VB years={ch.data.years} values={ch.data.values} title={ch.title} note={ch.note} color={ch.color} isAggregated={true}/>
      </div>)}
    </div>
    <div className="mt-4 pt-3 border-t border-slate-100">
      <div className="flex items-center gap-1.5 mb-2"><svg width="13" height="13" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.22-1.2 4.16-3 5.2V17a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1v-2.8C7.2 13.16 6 11.22 6 9a6 6 0 0 1 6-6z"/></svg><span className="text-[12px] font-semibold text-emerald-700">Key Takeaways</span></div>
      <div className="space-y-1.5">
        {(()=>{const py=["sd1","sd2","sd3"].reduce((s,sd)=>{const fc=(SD_INN_Y[sd]||[]).find((ch:any)=>/patent/i.test(ch.label||ch.title||""));return s+(fc?fc.values[fc.years.indexOf(2025)]||0:0);},0);const fy=["sd1","sd2","sd3"].reduce((s,sd)=>{const fc=(SD_INN_Y[sd]||[]).find((ch:any)=>/funding/i.test(ch.label||ch.title||""));return s+(fc?fc.values[fc.years.indexOf(2025)]||0:0);},0);const py22=["sd1","sd2","sd3"].reduce((s,sd)=>{const fc=(SD_INN_Y[sd]||[]).find((ch:any)=>/publication/i.test(ch.label||ch.title||""));return s+(fc?fc.values[fc.years.indexOf(2022)]||0:0);},0);const py25=["sd1","sd2","sd3"].reduce((s,sd)=>{const fc=(SD_INN_Y[sd]||[]).find((ch:any)=>/publication/i.test(ch.label||ch.title||""));return s+(fc?fc.values[fc.years.indexOf(2025)]||0:0);},0);return [
          `Patents granted reached ${py.toLocaleString()} families in 2025 across all three technology segments, reflecting sustained IP activity throughout the period.`,
          `Research publications grew from ${py22.toLocaleString()} in 2022 to ${py25.toLocaleString()} in 2025, a ${Math.round((py25/py22-1)*100)}% increase reflecting rapid expansion in academic and corporate research output.`,
          `Funding deployed across the three technology segments reached $${fy}M in 2025. Derived by analysing major disclosed funding rounds; not an exhaustive total of all sector funding.`
        ].map((pt,i)=><div key={i} className="flex items-start gap-2"><svg width="10" height="10" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24" className="flex-shrink-0 mt-1"><path d="M5 12h14M12 5l7 7-7 7"/></svg><p className="text-[13px] text-[#14532d] leading-relaxed">{pt}</p></div>);})()}
      </div>
    </div>
  </div>;
})()}</div>

{/* ── Most Active Players ── */}
<div className="bg-white border border-slate-200 rounded-2xl p-5">
  <div className="flex items-center justify-between mb-4">
    <div>
      <div className="flex items-center gap-1.5">
        <div className="text-[15px] font-bold text-[#0f2644]">Most Active Players</div>
      </div>
      <div className="text-[12px] text-[#0f2644] mt-0.5">Players ranked by the number of profiled activities.</div>
    </div>
  </div>
  <div className="flex items-end gap-2 mb-4" style={{height:200}}>{TOP_ENTITIES.slice(0,8).map((e:any,i:number)=>{const maxC=TOP_ENTITIES[0]?.count||1;const inn=e.types.innovation||0;const cmr=e.types.commercial||0;const str=e.types.structural||0;const total=e.count;const barPx=Math.max(Math.round(total/maxC*130),8);const shortName=e.name.replace(" Inc.","").replace(" (Cursor)","").replace("Anysphere","Cursor");return <div key={e.name} className="flex flex-col items-center flex-1 min-w-0 group"><span className="text-[10px] font-bold text-[#0f2644] mb-1 tabular-nums">{total}</span><div className="w-full flex flex-col-reverse rounded-t-sm overflow-hidden cursor-default" style={{height:barPx}}>{str>0&&<div style={{flex:str,background:"#166534",minHeight:4,display:"flex",alignItems:"center",justifyContent:"center"}}>{str>=2&&<span style={{color:"white",fontSize:"8px",fontWeight:"700",lineHeight:"1"}}>{str}</span>}</div>}{cmr>0&&<div style={{flex:cmr,background:"#059669",minHeight:4,display:"flex",alignItems:"center",justifyContent:"center"}}>{cmr>=2&&<span style={{color:"white",fontSize:"8px",fontWeight:"700",lineHeight:"1"}}>{cmr}</span>}</div>}{inn>0&&<div style={{flex:inn,background:"#16a34a",minHeight:4,display:"flex",alignItems:"center",justifyContent:"center"}}>{inn>=2&&<span style={{color:"white",fontSize:"8px",fontWeight:"700",lineHeight:"1"}}>{inn}</span>}</div>}</div><div className="mt-2 text-center"><span className="text-[9.5px] text-[#0f2644] leading-tight line-clamp-2">{shortName}</span></div></div>;})} </div>
  <div className="flex items-center gap-4 mt-1">{[["#16a34a","Innovation Signals"],["#059669","Commercialisation Signals"],["#166534","Structural Signals"]].map(([col,lbl])=><div key={lbl as string} className="flex items-center gap-1.5"><span className="w-3 h-2.5 rounded-sm flex-shrink-0" style={{background:col as string}}/><span className="text-[12px] text-[#0f2644]">{lbl as string}</span></div>)}</div>
  <div className="mt-4 pt-3 border-t border-slate-100">
    <KeyTakeaway points={[
      "<strong>Anthropic and Microsoft are the most broadly active players</strong> across all three signal types simultaneously, reflecting their dual roles as foundation-model providers and platform integrators, the only two organisations with significant presence in Innovation, Commercialisation, and Structural signals at once.",
      "<strong>Commercialisation signal presence is concentrated:</strong> the top three players by commercial activity count (Microsoft, LangChain, Anthropic) collectively account for the majority of named product launches, partnerships, and deployments in the profiled set, indicating a structurally uneven commercial landscape."
    ]} />
  </div>
</div>

{/* ── Ecosystem Landscape ── */}
<div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
    <div>
      <div className="text-[15px] font-bold text-[#0f2644]">Ecosystem Landscape</div>
      <div className="text-[12px] text-[#0f2644] mt-0.5">All named participants grouped by evidence tier</div>
    </div>
    <button onClick={() => setTab("players_geo")} className="flex items-center gap-1 text-[12px] font-semibold text-[#0f2644] hover:text-[#1EDD7D] transition-colors">
      View all profiles <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </button>
  </div>
  <div className="divide-y divide-slate-100">
    {(["Pioneer","Established","Challenger","Specialist"] as const).filter((_,i) => ecoExpanded || i < 2).map(tier => {
      const TIER_COLORS: Record<string,string> = {Pioneer:"#166534",Established:"#059669",Challenger:"#059669",Specialist:"#15803d"};
      const TIER_DESCS: Record<string,string> = {Pioneer:"Landmark signal evidence, first movers with highest analytical weight",Established:"Validated presence with significant commercial or structural signals",Challenger:"Targeted evidence with emerging commercial footprint",Specialist:"Niche or early-stage participant with limited but verified signals"};
      const tierPlayers = PLAYERS.filter(p => p.tier === tier);
      if (!tierPlayers.length) return null;
      const dotColor = TIER_COLORS[tier] || "#64748b";
      return (
        <div key={tier} className="px-5 py-4">
          <div className="flex items-start justify-between mb-1">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[15px] font-bold text-[#0f2644]">{tier}</span>
                <TierTooltip tier={tier} />
              </div>
              <div className="text-[12px] text-[#0f2644]">{TIER_DESCS[tier]}</div>
            </div>
            <span className="text-[12px] font-bold text-[#0f2644]">{tierPlayers.length}<span className="text-[10px] font-normal ml-0.5">companies</span></span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tierPlayers.map(p => {
              const logoUrl = PLAYER_LOGOS[p.name];
              const initials = p.name.split(" ").slice(0,2).map(w=>w[0]).join("");
              return (
                <button key={p.name} onClick={() => { setRootSelPlayer(p.name); setTab("players_geo"); }} className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 hover:border-[#1EDD7D] hover:shadow-sm transition-all group">
                  <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {logoUrl ? <img src={logoUrl} alt={p.name} className="w-4 h-4 object-contain" onError={e=>{e.currentTarget.style.display="none";}} /> : <span className="text-[7px] font-bold text-[#0f2644]">{initials}</span>}
                  </div>
                  <span className="text-[12px] font-medium text-[#0f2644] group-hover:text-[#0f2644]">{p.name}</span>
                  <span className="text-[10px] text-[#0f2644]">{p.country}</span>
                </button>
              );
            })}
          </div>
        </div>
      );
    })}
  </div>
  <div className="px-5 py-2 border-t border-slate-100">
    <button onClick={() => setEcoExpanded(e => !e)} className="flex items-center gap-1.5 text-[12px] font-semibold text-[#059669] hover:text-[#047857] transition-colors w-full justify-center py-1">
      {ecoExpanded ? "View less" : "View more tiers"}
      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{transform: ecoExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s"}}><polyline points="6 9 12 15 18 9"/></svg>
    </button>
  </div>
  <div className="px-5 pb-5 border-t border-slate-100">
    <KeyTakeaway points={["The <strong>Pioneer tier</strong> is dominated by US-headquartered organisations: Anthropic, OpenAI, Anysphere, Cognition AI, and Sierra. LangChain, Salesforce, Microsoft, Google, and NVIDIA are classified as <strong>Established</strong>, reflecting sustained multi-signal presence without a single defining category-originating act.", "The <strong>Challenger tier</strong> contains the most geographic diversity, with non-US founded players (PolyAI, UK; ElevenLabs, European-founded; Mistral, France) alongside US entrants, consistent with a market where application-layer specialisation is still open, even as the infrastructure layer consolidates around a small number of US-based incumbents."]} />
  </div>
</div>

</div>;

};

// ═══════════════════════════════════════════════════════
// SIGNALS PANEL: Innovation | Commercial | Structural
// ═══════════════════════════════════════════════════════
const SIGNAL_DATA = {
  innovation: [{
    id: "sd1",
    name: "Software Engineering Agents",
    level: "HIGH",
    desc: "Patent filings surged from 85 in 2022 to 580 in 2024; publications grew nearly 20× in the same period. ",
    blocks: [{
      title: "Patents Granted",
      tags: ["Agent lifecycle mgmt", "Multi-agent coordination", "Tool-calling architectures"],
      actKey: "inn_sd1_left",
      charts: [{
        title: "Patents Granted",
        years: [2022, 2023, 2024, 2025, 2026],
        values: [85, 310, 580, 760, 160],
        note: "Source: Google Patents. Counted as granted patent families to avoid multi-jurisdiction inflation. 2026 data represents a partial year (January–present)."
      }]
    }, {
      title: "Research Publications",
      tags: ["Multi-agent conversation frameworks", "Persistent memory systems"],
      actKey: "inn_sd1_pub",
      charts: [{
        title: "Research Publications",
        years: [2022, 2023, 2024, 2025, 2026],
        values: [45, 290, 840, 1180, 240],
        note: "Sourced from Google Scholar. Covers peer-reviewed papers and preprints. 2026 data represents a partial year (January–present)."
      }]
    }, {
      title: "Funding Deployed (USD Million)",
      tags: ["Role-based orchestration", "Enterprise agent platforms"],
      actKey: "inn_sd1_fund",
      charts: [{
        title: "Funding Deployed (USD Million)",
        years: [2022, 2023, 2024, 2025, 2026],
        values: [12, 180, 450, 980, 220],
        note: "Funding deployed is estimated using disclosed funding rounds identified within the technology segment. For each year, the top 10 funding rounds are assumed to represent approximately 80% of total funding activity. Total annual funding is extrapolated accordingly to estimate funding deployed. Figures should be interpreted as directional estimates, as not all funding rounds are publicly disclosed. 2026 data represents a partial year (January–present)."
      }]},{
      title: "Startup Formations", tags: ["Coding-agent pure-plays","Agent-dev-tooling spinouts"], actKey: "inn_startup_sd1", charts: []
    }, {
      title: "Hiring Activity", tags: ["Agent-engineering roles","LLM infra specialists"], actKey: "inn_hiring_sd1", charts: []
    },{
      title: "R&D Investments",
      tags: ["Corporate AI lab budgets", "Research-lab spin-outs"],
      actKey: "inn_rnd_sd1", charts: []
    }]
  }, {
    id: "sd2",
    name: "Customer-Facing Conversational & Voice Agents",
    level: "HIGH",
    desc: "Research output accelerated sharply with 1,100 publications in 2024. Patent filings tripled between 2022–2024, driven by persistent context and inference-time scaling breakthroughs.",
    blocks: [{
      title: "Patents Granted",
      tags: ["Persistent context", "Inference-time scaling"],
      actKey: "inn_sd2_left",
      charts: [{
        title: "Named patent families filed",
        years: [2022, 2023, 2024, 2025, 2026],
        values: [30, 110, 240, 330, 70],
        note: "Source: Google Patents. Counted as granted patent families via keyword and CPC classification. 2026 data represents a partial year (January–present)."
      }]
    }, {
      title: "Research Publications",
      tags: ["LLM operating systems", "System 2 reasoning"],
      actKey: "inn_sd2_pub",
      charts: [{
        title: "Research Publications",
        years: [2022, 2023, 2024, 2025, 2026],
        values: [120, 450, 1100, 1620, 320],
        note: "Sourced from Google Scholar. Covers peer-reviewed papers and preprints. 2026 data represents a partial year (January–present)."
      }]
    }, {
      title: "Funding Deployed (USD Million)",
      tags: ["Enterprise CX agents", "Legal & search verticals"],
      actKey: "inn_sd2_fund",
      charts: [{
        title: "Funding Deployed (USD Million)",
        years: [2022, 2023, 2024, 2025, 2026],
        values: [180, 320, 680, 1820, 540],
        note: "Funding deployed is estimated using disclosed funding rounds identified within the technology segment. For each year, the top 10 funding rounds are assumed to represent approximately 80% of total funding activity. Total annual funding is extrapolated accordingly to estimate funding deployed. Figures should be interpreted as directional estimates, as not all funding rounds are publicly disclosed. 2026 data represents a partial year (January–present)."
      }]},{
      title: "Startup Formations", tags: ["Conversational-AI pure-plays","Voice-AI spinouts"], actKey: "inn_startup_sd2", charts: []
    }, {
      title: "Hiring Activity", tags: ["Conversation-design roles","Voice-ML engineers"], actKey: "inn_hiring_sd2", charts: []
    },{
      title: "R&D Investments",
      tags: ["Voice-AI research spend", "Conversational model labs"],
      actKey: "inn_rnd_sd2", charts: []
    }]
  }, {
    id: "sd3",
    name: "Agent Orchestration Frameworks & Developer Infrastructure",
    level: "HIGH",
    desc: "Largest innovation technology segment by filing volume. Publications hit 1,400 in 2024; significant Chinese filing activity from Baidu and Alibaba alongside US labs accelerates IP competition.",
    blocks: [{
      title: "Patents Granted",
      tags: ["Computer-use APIs", "GUI interaction agents"],
      actKey: "inn_sd3_left",
      charts: [{
        title: "Named patent families filed",
        years: [2022, 2023, 2024, 2025, 2026],
        values: [92, 410, 720, 920, 190],
        note: "Source: Google Patents. Counted as granted patent families. Significant Chinese volume (Baidu, Alibaba) alongside US filers. 2026 data represents a partial year (January–present)."
      }]
    }, {
      title: "Research Publications",
      tags: ["Autonomous computer use", "Agent-tool protocols"],
      actKey: "inn_sd3_pub",
      charts: [{
        title: "Research Publications",
        years: [2022, 2023, 2024, 2025, 2026],
        values: [80, 520, 1400, 1980, 410],
        note: "Sourced from Google Scholar. Covers peer-reviewed papers and preprints. 2026 data represents a partial year (January–present)."
      }]
    }, {
      title: "Funding Deployed (USD Million)",
      tags: ["Orchestration frameworks", "Computer-use startups"],
      actKey: "inn_sd3_fund",
      charts: [{
        title: "Funding Deployed (USD Million)",
        years: [2022, 2023, 2024, 2025, 2026],
        values: [22, 140, 680, 1640, 360],
        note: "Funding deployed is estimated using disclosed funding rounds identified within the technology segment. For each year, the top 10 funding rounds are assumed to represent approximately 80% of total funding activity. Total annual funding is extrapolated accordingly to estimate funding deployed. Figures should be interpreted as directional estimates, as not all funding rounds are publicly disclosed. 2026 data represents a partial year (January–present)."
      }]},{
      title: "Startup Formations", tags: ["Orchestration framework companies","Computer-use startups"], actKey: "inn_startup_sd3", charts: []
    }, {
      title: "Hiring Activity", tags: ["Protocol-engineering roles","Agent-runtime specialists"], actKey: "inn_hiring_sd3", charts: []
    },{
      title: "R&D Investments",
      tags: ["Protocol research budgets", "Open-source lab investments"],
      actKey: "inn_rnd_sd3", charts: []
    }]
  }],
  commercial: [{
    id: "sd1", name: "Software Engineering Agents", level: "HIGH",
    desc: "Across partnerships, pilots and deployments, Software Engineering Agents moved from experimentation to production between 2023 and 2025. Hyperscaler managed runtimes (AWS AgentCore, Azure AI Foundry) now compete with open-source orchestrators for enterprise wallet.",
    blocks: [
      { title: "Product Launches", tags: ["Managed agent runtimes","IDE-native coding agents"], actKey: "cmr_launches_sd1", charts: [] },
      { title: "Deployments", tags: ["Financial services","Autonomous ETL & code migration"], actKey: "cmr_deployments_sd1", charts: [] },
      { title: "Partnerships", tags: ["Cloud-provider co-sell agreements","IDE ecosystem deals"], actKey: "cmr_partnerships_sd1", charts: [] },
      { title: "Pilots", tags: ["Regulated-industry proofs-of-concept","Government code-migration trials"], actKey: "cmr_pilots_sd1", charts: [] },
      { title: "Design Wins", tags: ["Fortune 500 vendor selections","Platform license awards"], actKey: "cmr_designwins_sd1", charts: [] }
    ]
  }, {
    id: "sd2", name: "Customer-Facing Conversational & Voice Agents", level: "HIGH",
    desc: "CRM-native platforms dominate launches; enterprise deployments in customer service and sales automation are accelerating. Voice and multilingual agents represent the fastest-growing pilot segment.",
    blocks: [
      { title: "Product Launches", tags: ["CRM-native agent platforms","Voice & multilingual agents"], actKey: "cmr_launches_sd2", charts: [] },
      { title: "Deployments", tags: ["Enterprise customer service","Outcome-based deployments"], actKey: "cmr_deployments_sd2", charts: [] },
      { title: "Partnerships", tags: ["CRM integration agreements","Telco & BPO channel deals"], actKey: "cmr_partnerships_sd2", charts: [] },
      { title: "Pilots", tags: ["Contact-centre automation","Multilingual voice pilots"], actKey: "cmr_pilots_sd2", charts: [] },
      { title: "Design Wins", tags: ["Global bank customer-service contracts","Retail loyalty agent awards"], actKey: "cmr_designwins_sd2", charts: [] }
    ]
  }, {
    id: "sd3", name: "Agent Orchestration Frameworks & Developer Infrastructure", level: "HIGH",
    desc: "Computer-use API launches surged in 2025 with IDE-native integrations displacing standalone RPA tools. Hyperscalers entering managed orchestration services marks an industrialisation inflection.",
    blocks: [
      { title: "Product Launches", tags: ["Computer-use APIs","Open orchestration frameworks"], actKey: "cmr_launches_sd3", charts: [] },
      { title: "Deployments", tags: ["IDE-native computer use","Enterprise RPA replacement"], actKey: "cmr_deployments_sd3", charts: [] },
      { title: "Partnerships", tags: ["Enterprise SaaS integration deals","Browser-automation channel agreements"], actKey: "cmr_partnerships_sd3", charts: [] },
      { title: "Pilots", tags: ["Autonomous workflow proofs","Enterprise RPA-replacement trials"], actKey: "cmr_pilots_sd3", charts: [] },
      { title: "Design Wins", tags: ["Platform vendor-of-record selections","Enterprise SDK standardisation awards"], actKey: "cmr_designwins_sd3", charts: [] }
    ]
  }],
    structural: [{
    id: "sd1", name: "Software Engineering Agents", level: "MEDIUM",
    desc: "M&A consolidation accelerated sharply in 2025 (16 deals), open-source framework standards are maturing, and the first developer-safety standards are emerging from NIST and the Linux Foundation.",
    blocks: [
      { title: "M&A and Investments", tags: ["Coding-agent acqui-hires","Platform consolidation"], actKey: "str_ma_sd1", charts: [] },
      { title: "Regulatory Milestones", tags: ["Developer-tool liability frameworks","Government AI procurement rules"], actKey: "str_regulatory_sd1", charts: [] },
      { title: "Standards Decisions", tags: ["Agent interoperability specs","Safety benchmarking standards"], actKey: "str_standards_sd1", charts: [] },
      { title: "Open-Source Releases", tags: ["Orchestration framework versioning","Managed-runtime open specs"], actKey: "str_oss_sd1", charts: [] },
      { title: "Supply Chain Shifts", tags: ["GPU allocation for inference","Model-provider dependency risk"], actKey: "str_supplychain_sd1", charts: [] }
    ]
  }, {
    id: "sd2", name: "Customer-Facing Conversational & Voice Agents", level: "MEDIUM",
    desc: "EU AI Act GPAI obligations apply to all agentic deployments using foundation models; voice-specific biometric provisions create additional compliance layers. M&A reflects voice-AI consolidation.",
    blocks: [
      { title: "M&A and Investments", tags: ["Voice-AI platform acquisitions","CX-automation roll-ups"], actKey: "str_ma_sd2", charts: [] },
      { title: "Regulatory Milestones", tags: ["EU AI Act GPAI obligations","Voice biometric data rules"], actKey: "str_regulatory_sd2", charts: [] },
      { title: "Standards Decisions", tags: ["Conversational AI safety norms","Transparency disclosure standards"], actKey: "str_standards_sd2", charts: [] },
      { title: "Open-Source Releases", tags: ["TTS/STT foundation models","Multilingual conversation toolkits"], actKey: "str_oss_sd2", charts: [] },
      { title: "Supply Chain Shifts", tags: ["Speech-silicon availability","Multilingual model provider consolidation"], actKey: "str_supplychain_sd2", charts: [] }
    ]
  }, {
    id: "sd3", name: "Agent Orchestration Frameworks & Developer Infrastructure", level: "MEDIUM",
    desc: "EU AI Act ratification and NIST AI 100-4 created the first binding frameworks for autonomous agents. MCP adoption as a de-facto standard represents the most significant interoperability decision of the period.",
    blocks: [
      { title: "M&A and Investments", tags: ["Orchestration-layer acquisitions","Developer-tool strategic investments"], actKey: "str_ma_sd3", charts: [] },
      { title: "Regulatory Milestones", tags: ["Autonomous agent legal definitions","High-risk AI compliance requirements"], actKey: "str_regulatory_sd3", charts: [] },
      { title: "Standards Decisions", tags: ["MCP as open interoperability standard","Agentic safety benchmarking"], actKey: "str_standards_sd3", charts: [] },
      { title: "Open-Source Releases", tags: ["Agent framework major versions","Protocol reference implementations"], actKey: "str_oss_sd3", charts: [] },
      { title: "Supply Chain Shifts", tags: ["Cloud orchestration provider leverage","Open-source vs managed runtime split"], actKey: "str_supplychain_sd3", charts: [] }
    ]
  }]
};

// Per-technology segment, per-layer intensity rationale (sourced from SIGNAL_DATA desc)
const INTENSITY_RATIONALE: Record<string, Record<string, string>> = {
  inn: Object.fromEntries(SIGNAL_DATA.innovation.map(s => [s.id, s.desc])),
  cmr: Object.fromEntries(SIGNAL_DATA.commercial.map(s => [s.id, s.desc])),
  str: Object.fromEntries(SIGNAL_DATA.structural.map(s => [s.id, s.desc]))
};

// Activity significance types that receive visual emphasis (high analytical weight)
const HIGH_SIG_TYPES = new Set(["landscape_restructuring","commercial_first","inflection"]);

// Signal Momentum: Average CAGR methodology: 2022 to 2025 for patents, publications, funding
// For each metric: if 2022 value is 0, use 2023 as the start year (avoids infinite CAGR from zero base)
// Average the per-metric CAGRs to get a average CAGR → classify into tiers:
//   Hyper-growth ≥40% | High growth 20–40% | Moderate growth 5–20% | Low growth 0–5% | Contracting <0%
const computeMomentum = (charts: Array<{years: number[], values: number[], label?: string, title?: string}>) => {
  const L=2025;
  const gv=(c:{years:number[],values:number[]},yr:number)=>{const i=c.years.indexOf(yr);return i>=0?c.values[i]:0;};
  const results=charts.map((c:any)=>{
    // Use 2022 as start; if 2022 is 0, use 2023 (patents have no 2022 filings)
    const v2022=gv(c,2022);
    const v2023=gv(c,2023);
    const F = v2022>0 ? 2022 : (v2023>0 ? 2023 : 0);
    const v0 = F===2022 ? v2022 : v2023;
    const v1=gv(c,L);
    const vPrev=gv(c,2024);
    if(v0<=0||v1<=0||F===0) return null;
    const nYears=L-F;
    const cagr=Math.pow(v1/v0,1/nYears)-1;
    const recentRate=vPrev>0?(v1-vPrev)/vPrev:0;
    const earlyRate=v0>0?(vPrev-v0)/v0:0;
    return {cagr,accelerating:recentRate>earlyRate/Math.max(nYears-1,1),label:c.title||c.label||"metric",v0,v1};
  }).filter(Boolean) as {cagr:number,accelerating:boolean,label:string,v0:number,v1:number}[];
  if(!results.length) return {label:"Contracting",cagr:0,pct:0,accelerating:false,color:"#dc2626",score:0,breakdown:[] as any[]};
  const avg=results.reduce((s,r)=>s+r.cagr,0)/results.length;
  const pct=Math.round(avg*100);
  const score=Math.min(100,Math.max(0,pct/40*100));
  const acc=results.filter(r=>r.accelerating).length>results.length/2;
  let label:string,color:string;
  if(avg>=0.4){label="Hyper-growth";color="#059669";}
  else if(avg>=0.2){label="High growth";color="#16a34a";}
  else if(avg>=0.05){label="Moderate growth";color="#166534";}
  else if(avg>=0){label="Low growth";color="#f59e0b";}
  else{label="Contracting";color="#dc2626";}
  return {label,pct,score,accelerating:acc,color,breakdown:results};
};
// Momentum tier classification reference
const MOMENTUM_TIERS = [
  {label:"Hyper-growth", range:"≥ 40% average CAGR", color:"#059669", bg:"#f0fdf4", border:"#bbf7d0"},
  {label:"High growth",  range:"20–40% average CAGR", color:"#16a34a", bg:"#f0fdf4", border:"#dcfce7"},
  {label:"Moderate growth", range:"5–20% average CAGR", color:"#166534", bg:"#fffbeb", border:"#fde68a"},
  {label:"Low growth",   range:"0–5% average CAGR",  color:"#f59e0b", bg:"#fffbeb", border:"#fef3c7"},
  {label:"Contracting",  range:"< 0% average CAGR",  color:"#dc2626", bg:"#fef2f2", border:"#fecaca"},
];

// Small SVG icon paths per signal category (14×14 display, 24×24 viewBox)
const SECTION_ICON: Record<string,string> = {
  "Patents Granted":        "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  "Research Publications":  "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  "Funding Deployed":       "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  "Startup Formations":     "M13 10V3L4 14h7v7l9-11h-7z",
  "Hiring Activity":        "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  "R&D Investments":        "M9 3h6m-3 0v6l-4 5a4 4 0 008 0l-4-5V3",
  "Partnerships":           "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  "Pilots":                 "M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9",
  "Product Launches":       "M5 3l14 9-14 9V3z",
  "Deployments":            "M2 9a2 2 0 012-2h16a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V9zm0 8a2 2 0 012-2h16a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zM6 11v.01M6 19v.01",
  "Design Wins":            "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  "M&A and Investments":    "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
  "Regulatory Milestones":  "M3 21h18M3 9l9-7 9 7M9 21V12h6v9",
  "Standards Decisions":    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  "Open-Source Releases":   "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  "Supply Chain Shifts":    "M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4",
};
const getSectionIcon=(title:string)=>{
  const p=SECTION_ICON[title];
  if(!p) return null;
  return <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d={p}/></svg>;
};

// Distinct gradient pair per signal type, gives each of the 16 a unique visual identity
const SIGNAL_VIS: Record<string,[string,string]> = {
  "Patents Granted":        ["#22c55e","#16a34a"],
  "Research Publications":  ["#22c55e","#16a34a"],
  "Funding Deployed":       ["#22c55e","#16a34a"],
  "Startup Formations":     ["#22c55e","#16a34a"],
  "Hiring Activity":        ["#22c55e","#16a34a"],
  "R&D Investments":        ["#22c55e","#16a34a"],
  "Partnerships":           ["#22c55e","#16a34a"],
  "Pilots":                 ["#22c55e","#16a34a"],
  "Product Launches":       ["#22c55e","#16a34a"],
  "Deployments":            ["#22c55e","#16a34a"],
  "Design Wins":            ["#22c55e","#16a34a"],
  "M&A and Investments":    ["#22c55e","#16a34a"],
  "Regulatory Milestones":  ["#22c55e","#16a34a"],
  "Standards Decisions":    ["#22c55e","#16a34a"],
  "Open-Source Releases":   ["#22c55e","#16a34a"],
  "Supply Chain Shifts":    ["#22c55e","#16a34a"],
};
// Illustrated banner header for an activity card, gradient + tiled icon watermark + icon badge.
// Visual identity is driven by the signal type (colour + icon), so all 16 types look distinct.
const SignalBanner = ({ title, h = 60 }: { title: string; h?: number }) => {
  const [c1, c2] = SIGNAL_VIS[title] || ["#22c55e", "#16a34a"];
  const icon = SECTION_ICON[title] || SECTION_ICON["Patents Granted"];
  return <div className="relative overflow-hidden flex items-center px-4" style={{ height: h, background: `linear-gradient(125deg, ${c1}ee, ${c2})` }}>
    {/* Geometric decoration, concentric rings */}
    <div className="absolute" style={{ width:110, height:110, borderRadius:"50%", border:"1.5px solid rgba(255,255,255,0.18)", right:-28, top:"50%", transform:"translateY(-50%)" }} />
    <div className="absolute" style={{ width:160, height:160, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.09)", right:-55, top:"50%", transform:"translateY(-50%)" }} />
    {/* Dot accents */}
    <div className="absolute" style={{ width:5, height:5, borderRadius:"50%", background:"rgba(255,255,255,0.4)", top:12, right:72 }} />
    <div className="absolute" style={{ width:3, height:3, borderRadius:"50%", background:"rgba(255,255,255,0.25)", bottom:14, right:110 }} />
    <div className="absolute" style={{ width:4, height:4, borderRadius:"50%", background:"rgba(255,255,255,0.2)", top:8, right:130 }} />
    {/* Large watermark icon, single, tastefully offset */}
    <div className="absolute" style={{ right:-6, bottom:-10, opacity:0.2 }}>
      <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d={icon} /></svg>
    </div>
    {/* Icon badge */}
    <div className="relative flex-shrink-0 w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center border border-white/25 shadow-sm">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={icon} /></svg>
    </div>
    {/* Signal type label */}
    <div className="relative ml-3 flex-1 min-w-0">
      <div className="text-[13px] font-semibold text-white leading-snug truncate">{title}</div>
    </div>
  </div>;
};

// Per-column activity keys (left/right per technology segment per signal type)
const COL_ACTS = {
  inn_sd1_fund: [{
    id:"fund_sd1_001", date:"2025-11",
    headline:"Anysphere (Cursor) raises $2.3B Series D at $29.3B valuation, largest-ever funding round for a developer tooling company, led by Thrive Capital and Accel.",
    sigType:"strategic_commitment",
    description:"Anysphere's Series D values the company at $29.3B with over $500M ARR and 20M all-time users. The round positions Cursor to challenge Microsoft GitHub Copilot's Fortune 500 dominance.",
    whyFlag:"$29.3B valuation for an IDE-native coding agent defines agentic developer tools as a standalone multi-billion dollar category.",
    whyRationale:"Series D size implies investors expect a $100B+ exit requiring capture of material share of the $25B+ global developer tools market.",
    implications:"Sets a new valuation floor for coding-agent companies and triggers revaluation of competing assets across the category.",
    entities:[{name:"Anysphere (Cursor)",role:"Funded Company",country:"USA",type:"Startup"},{name:"Thrive Capital",role:"Lead Investor",country:"USA",type:"VC Firm"}],
    metrics:{"Amount":"$2,300,000,000","Valuation":"$29,300,000,000","ARR":"$500M+","Users":"20M all-time"},
    sourceUrl:"https://cursor.com/blog/series-d",
    sourceName:"Cursor Blog"
  },{
    id:"fund_sd1_002", date:"2024-04",
    headline:"Cognition AI raises $175M Series A at $2B valuation led by Founders Fund, largest-ever pre-revenue Series A in enterprise software, raised on the Devin autonomous agent demo.",
    sigType:"strategic_commitment",
    description:"Cognition AI's Series A closed within weeks of the Devin autonomous software engineering agent going viral in March 2024. Raised before commercial revenue, it established the valuation benchmark for autonomous agent companies.",
    whyFlag:"$2B at Series A on a demo alone confirms investor belief that autonomous software engineering is a near-term commercial reality.",
    whyRationale:"Founders Fund's investment gave autonomous coding agents unusual credibility and triggered comparable valuations for pre-revenue agent startups throughout 2024.",
    implications:"Established a benchmark compressing typical funding timelines by 12–18 months for autonomous agent companies with working demos.",
    entities:[{name:"Cognition AI",role:"Funded Company",country:"USA",type:"Startup"},{name:"Founders Fund",role:"Lead Investor",country:"USA",type:"VC Firm"}],
    metrics:{"Amount":"$175,000,000","Valuation":"$2,000,000,000","Round":"Series A","Stage":"Pre-revenue"},
    sourceUrl:"https://www.cognition.ai/blog/series-a",
    sourceName:"Cognition AI Blog"
  },{
    id:"fund_sd1_cognition_400m", date:"2025-09",
    headline:"Cognition AI raises $400M Series C at $10.2B valuation, first autonomous software engineering company to cross the decacorn threshold.",
    sigType:"strategic_commitment",
    description:"Cognition AI's Series C at $10.2B valuation marks the first autonomous software engineering startup to reach decacorn status. The round was led by General Catalyst with participation from Benchmark. Devin, Cognition's product, had confirmed production deployments at Goldman Sachs, Citi, Dell, and Cisco at the time of the raise.",
    whyFlag:"Crossing the decacorn threshold on the basis of a single AI software engineering product confirms that autonomous coding agents represent a new asset class, not a feature add-on to existing developer tools.",
    whyRationale:"$10.2B valuation for a product in production at Fortune 50 companies implies the addressable market is the global software development budget (~$1T annually). Comparable only to Stripe at Series B stage.",
    implications:"Sets a valuation ceiling for the autonomous coding category and triggers revaluation of all pre-IPO AI coding assets across the sector.",
    entities:[{name:"Cognition AI",role:"Funded Company",country:"USA",type:"Startup"},{name:"General Catalyst",role:"Lead Investor",country:"USA",type:"VC Firm"}],
    metrics:{"Amount":"$400,000,000","Valuation":"$10,200,000,000","Round":"Series C","ARR":"Undisclosed","Production Customers":"Goldman Sachs, Citi, Dell, Cisco"},
    sourceUrl:"https://techcrunch.com/2025/09/08/cognition-ai-defies-turbulence-with-a-400m-raise-at-10-2b-valuation/",
    sourceName:"TechCrunch"
  },{
    id:"fund_sd1_003", date:"2024-08",
    headline:"Anysphere (Cursor) raises a $60M Series A led by a16z and Thrive Capital, establishing it as the leading AI-native code editor.",
    sigType:"strategic_commitment",
    description:"The August 2024 Series A funded Cursor's push to build an IDE designed around AI pair-programming and repository-scale edits, positioning it as the pure-play challenger to GitHub Copilot ahead of its later category-defining rounds.",
    whyFlag:"Top-tier VC backing for an AI-native IDE confirmed the editor itself, not just the model, as a defensible, fundable category.",
    whyRationale:"a16z and Thrive backing at Series A signalled investor conviction that agent-native development environments would anchor enterprise workflows, validated by Cursor's subsequent ARR trajectory.",
    entities:[{name:"Anysphere (Cursor)",role:"Funded Company",country:"USA",type:"Startup"},{name:"Andreessen Horowitz",role:"Lead Investor",country:"USA",type:"VC Firm"}],
    metrics:{"Round":"Series A","Amount":"$60M","Leads":"a16z, Thrive","Date":"2024-08"},
    sourceUrl:"https://cursor.com/blog", sourceName:"Cursor Blog"
  }],
  inn_sd2_fund: [{
    id:"fund_elevenlabs", date:"2025-04",
    headline:"ElevenLabs raises $180M Series C at $3.3B valuation, co-led by a16z and ICONIQ Growth, the largest funding round in the voice-AI category.",
    sigType:"strategic_commitment",
    description:"Led by a16z with Salesforce Ventures. ElevenLabs expands real-time conversational AI, enterprise SLAs, and multilingual voice synthesis.",
    whyFlag:"$3.3B valuation establishes voice synthesis as a distinct investable category, triggers comparable fundraises from PolyAI, Sarvam, and Hume AI.",
    whyRationale:"Category-defining rounds compress the pilot-to-production cycle by validating enterprise ROI to procurement teams.",
    entities:[{name:"ElevenLabs", role:"Funded Company", country:"USA", type:"Startup"}],
    metrics:{"Amount":"$180,000,000","Valuation":"$3,300,000,000","Lead":"a16z"},
    sourceUrl:"https://elevenlabs.io/blog/series-c", sourceName:"ElevenLabs Newsroom"
  }, {
    id:"fund_polyai", date:"2024-07",
    headline:"PolyAI raises $50M Series C, reaches 100+ enterprise deployments in financial services and hospitality.",
    sigType:"strategic_commitment",
    description:"PolyAI's Series C was led by NVentures (NVIDIA's VC arm) with Georgian. Its 100+ enterprise deployments in banking and hotels provide production evidence of voice-agent ROI.",
    whyFlag:"NVIDIA's VC arm investing in voice-agent infra signals silicon makers are betting on voice as a primary agentic modality.",
    whyRationale:"NVIDIA's strategic interest drives NVentures investments in technology generating GPU demand; implies voice-agent inference becomes a significant GPU workload.",
    entities:[{name:"PolyAI", role:"Funded Company", country:"UK", type:"Startup"},{name:"NVentures (NVIDIA)", role:"Lead Investor", country:"USA", type:"VC Firm"}],
    metrics:{"Amount":"$50,000,000","Lead Investor":"Hedosophia","New Investors":"NVIDIA NVentures, Zendesk","Enterprise Deployments":"100+"},
    sourceUrl:"https://poly.ai/blog/polyai-raises-50-million-series-c", sourceName:"PolyAI Press"
  }, {
    id:"fund_sarvam", date:"2025-07",
    headline:"Sarvam AI raises $41M to build India-first multilingual voice AI across 22 Indian languages.",
    sigType:"unexpected_participant",
    description:"Sarvam AI targets 22 Indian languages, a gap left by US-centric voice-AI vendors. Investors include Lightspeed India and Khosla Ventures.",
    whyFlag:"First significant VC bet on non-English-native voice-AI infra, signals the supply chain is fragmenting geographically.",
    whyRationale:"India's 500M+ smartphone users represent the largest untapped voice-agent market; Sarvam's raise establishes regional infrastructure as independently fundable.",
    entities:[{name:"Sarvam AI", role:"Funded Company", country:"India", type:"Startup"}],
    metrics:{"Amount":"$41,000,000","Languages":"22 Indian","Investors":"Lightspeed India, Khosla"},
    sourceUrl:"https://www.sarvam.ai/news", sourceName:"Sarvam AI Newsroom"
  },{
    id:"fund_sierra_950m", date:"2026-05",
    headline:"Sierra raises $950M Series E at $15.8B valuation, largest single round in the customer-facing agent category.",
    sigType:"strategic_commitment",
    description:"Sierra's $950M Series E confirmed $150M ARR and 40% Fortune 50 penetration, led by General Catalyst and Sequoia Capital. Sierra is the fastest enterprise SaaS to $100M ARR on record.",
    whyFlag:"$15.8B valuation at $150M ARR (105x multiple) signals investor conviction in a $100B+ CX agent TAM and Sierra's path to category dominance.",
    whyRationale:"Round size positions Sierra as a strategic consolidator rather than acquisition target, anchoring the category exit floor above $20B.",
    implications:"Will accelerate CX agent procurement decisions at enterprises that have not yet selected a vendor.",
    entities:[{name:"Sierra",role:"Funded Company",country:"USA",type:"Startup"},{name:"General Catalyst",role:"Lead Investor",country:"USA",type:"VC Firm"},{name:"Sequoia Capital",role:"Co-lead Investor",country:"USA",type:"VC Firm"}],
    metrics:{"Amount":"$950,000,000","Valuation":"$15,800,000,000","ARR":"$150,000,000","Fortune 50":"40%"},
    sourceUrl:"https://sierra.ai/blog", sourceName:"Sierra Blog"
  },{
    id:"fund_decagon_250m", date:"2026-01",
    headline:"Decagon raises $250M Series D at $4.5B valuation, three times its 2024 valuation in six months.",
    sigType:"strategic_commitment",
    description:"Decagon's $250M Series D co-led by Coatue Management and Index Ventures. 100+ enterprise customers including Deutsche Telekom, Avis, Mercado Libre, Notion, and Duolingo, all in production with 80%+ deflection rates. The Series C ($131M at $1.5B, June 2025) preceded this round by six months.",
    whyFlag:"3x valuation step-up in six months and 80%+ deflection rate is the strongest public CX agent performance metric disclosed by any vendor.",
    whyRationale:"Accel and Sequoia co-leading confirms both firms believe the category supports two durable $10B+ leaders.",
    implications:"Closes the door on new standalone CX agent entrants, future capital will concentrate in platform integrations.",
    entities:[{name:"Decagon",role:"Funded Company",country:"USA",type:"Startup"},{name:"Accel",role:"Lead Investor",country:"USA",type:"VC Firm"},{name:"Sequoia Capital",role:"Co-lead Investor",country:"USA",type:"VC Firm"}],
    metrics:{"Amount":"$250,000,000","Valuation":"$4,500,000,000","Customers":"100+","Deflection":"80%+"},
    sourceUrl:"https://www.decagon.ai/blog", sourceName:"Decagon Blog"
  }],

  inn_startup_sd1: [{
    id:"sf_sd1_001", date:"2024-03",
    headline:"Cognition AI emerges from stealth with Devin, billed as 'the first AI software engineer', and a viral demo that triggers the autonomous-coding-agent category.",
    sigType:"inflection",
    description:"Devin's March 2024 reveal showed an agent planning and executing multi-step engineering tasks end-to-end (writing, running, and debugging code), distinct from autocomplete-style assistants. The demo went viral and reset expectations for what a coding agent could do.",
    whyFlag:"The Devin reveal is the moment autonomous software engineering shifted from concept to a category investors and enterprises took seriously.",
    whyRationale:"A single high-visibility capability demonstration reframed the market and compressed funding timelines across the category: Cognition's $175M Series A followed within weeks.",
    implications:"Catalysed a wave of autonomous coding agents and direct competitive responses from incumbents and foundation labs.",
    entities:[{name:"Cognition AI",role:"Originator",country:"USA",type:"Startup"}],
    metrics:{"Product":"Devin","Reveal":"2024-03","Positioning":"First AI software engineer"},
    sourceUrl:"https://www.cognition.ai/blog/introducing-devin", sourceName:"Cognition AI Blog"
  }],
  inn_startup_sd2: [{
    id:"sf_sd2_001", date:"2024-02",
    headline:"Sierra emerges from stealth (Feb 2024), led by Bret Taylor (ex-Salesforce co-CEO) and Clay Bavor (ex-Google VP), pioneering outcome-based pricing for autonomous CX agents.",
    sigType:"inflection",
    description:"Sierra's public launch introduced a productised replacement for customer-service BPO with autonomous chat and voice agents, and an outcome-based commercial model (pay per resolved interaction) that became the category's defining pricing innovation.",
    whyFlag:"Founder credibility plus a novel pay-per-resolution model de-risked autonomous CX agents for enterprise buyers from day one.",
    whyRationale:"Bret Taylor's Salesforce pedigree gave Sierra immediate enterprise access that normally takes years; the outcome-based model directly addressed buyer scepticism about paying for unused software.",
    implications:"Set the pricing and credibility benchmark the rest of the customer-facing-agent category is measured against.",
    entities:[{name:"Sierra",role:"Originator",country:"USA",type:"Startup"}],
    metrics:{"Launch":"2024-02","Model":"Outcome-based (per resolution)","Founders":"Bret Taylor, Clay Bavor"},
    sourceUrl:"https://sierra.ai/blog", sourceName:"Sierra Blog"
  },{
    id:"sf_sd2_002", date:"2024-01",
    headline:"ElevenLabs reaches a $1.1B valuation (Series B, ~$80M) as high-quality neural voice synthesis crosses into mainstream enterprise use.",
    sigType:"strategic_commitment",
    description:"ElevenLabs' January 2024 Series B valued the company above $1B, validating standalone voice synthesis as the audio backbone for conversational and voice agents and triggering comparable raises across the voice-AI category.",
    whyFlag:"A unicorn valuation for a pure-play voice-synthesis company established voice as an independently investable layer of the agent stack.",
    whyRationale:"Category-defining valuations validate enterprise ROI to procurement teams and compress the pilot-to-production cycle for every downstream voice-agent vendor.",
    entities:[{name:"ElevenLabs",role:"Funded Company",country:"USA",type:"Startup"}],
    metrics:{"Round":"Series B","Valuation":"$1.1B","Date":"2024-01"},
    sourceUrl:"https://elevenlabs.io/blog", sourceName:"ElevenLabs Blog"
  }],
  inn_startup_sd3: [{
    id:"sf_sd3_001", date:"2024-01",
    headline:"LangChain introduces LangGraph, a graph-based framework for stateful, multi-step agents, establishing durable orchestration as a distinct layer above prompt-chaining.",
    sigType:"inflection",
    description:"LangGraph (Jan 2024) added explicit state, cycles, and controllable multi-actor workflows on top of LangChain, addressing the reliability and long-running-task gaps of linear prompt-chaining and becoming the substrate for production agent orchestration.",
    whyFlag:"A dedicated stateful-orchestration framework marked the field's move from demo-grade chains to production-grade agent workflows.",
    whyRationale:"Durable, inspectable execution is the precondition for enterprises to run agents on critical paths; LangGraph's introduction defined the orchestration layer the category now standardises on.",
    implications:"Set the direction that culminated in the LangChain/LangGraph 1.0 GA releases and broad Fortune 500 adoption.",
    entities:[{name:"LangChain Inc.",role:"Originator",country:"USA",type:"Startup"},{name:"LangChain",role:"Originator",country:"USA",type:"Startup"}],
    metrics:{"Product":"LangGraph","Introduced":"2024-01","Category":"Stateful agent orchestration"},
    sourceUrl:"https://blog.langchain.com/langgraph/", sourceName:"LangChain Blog"
  },{
    id:"sf_sd3_002", date:"2024-09",
    headline:"Browserbase raises a $21M Series A for cloud browser infrastructure purpose-built for AI agents, funding the 'agents need a browser' infrastructure layer.",
    sigType:"unexpected_participant",
    description:"Browserbase provides managed headless-browser infrastructure with session management and debugging designed for agents that must operate the web. Its 2024 Series A signalled that agent execution needs dedicated infrastructure beyond the model and orchestrator.",
    whyFlag:"Dedicated capital for agent-specific browser infrastructure indicates the stack is specialising into purpose-built execution layers.",
    whyRationale:"Infrastructure that exists only because agents need it is a reliable marker of a maturing ecosystem moving from general tools to agent-native primitives.",
    entities:[{name:"Browserbase",role:"Funded Company",country:"USA",type:"Startup"}],
    metrics:{"Round":"Series A","Amount":"$21M","Date":"2024-09","Category":"Agent browser infrastructure"},
    sourceUrl:"https://www.browserbase.com/", sourceName:"Browserbase"
  }],
  inn_hiring_sd1: [{
    id:"hr_sd1_002", date:"2025-03",
    headline:"Cognition AI and Anysphere (Cursor) scale aggressive senior-engineer hiring, concentrating coding-agent talent in a small number of US labs.",
    sigType:"strategic_commitment",
    description:"Public job postings and headcount disclosures show both companies expanding research and forward-deployed engineering teams through 2025, competing directly with the foundation labs for the same scarce pool of RL and systems engineers.",
    whyFlag:"Talent concentration in 2–3 firms is a leading indicator of where category-defining capability is consolidating.",
    whyRationale:"In a capability race, hiring velocity for senior research talent precedes product leadership by 6–12 months; talent flow is an early, observable proxy for future capability.",
    entities:[{name:"Cognition AI",role:"Hiring Company",country:"USA",type:"Startup"},{name:"Anysphere (Cursor)",role:"Hiring Company",country:"USA",type:"Startup"}],
    metrics:{"Signal":"Senior engineering hiring","Concentration":"US labs","Competing with":"Foundation labs"},
    sourceUrl:"https://www.cognition.ai/careers", sourceName:"Cognition AI Careers"
  },{
    id:"hr_sd1_001", date:"2024-06",
    headline:"Microsoft opens a 500-person Agentic AI Engineering division consolidating GitHub Copilot, Azure AI Foundry, and AutoGen teams.",
    sigType:"strategic_commitment",
    description:"The division unifies Microsoft's agentic AI teams under a single leadership. 500-headcount is the largest organisational commitment to agentic AI engineering within a hyperscaler.",
    whyFlag:"500-person dedicated division signals Microsoft's bet that agents become the primary interface for all developer productivity tools.",
    whyRationale:"Headcount at this scale requires 12–18 months lead time, meaning the commitment was made in early 2023 when the category was still nascent.",
    entities:[{name:"Microsoft",role:"Hiring Organisation",country:"USA",type:"Corporation"}],
    metrics:{"Headcount Target":"500","Division":"Agentic AI Engineering","Announced":"2024-06"},
    sourceUrl:"https://blogs.microsoft.com/ai", sourceName:"Microsoft AI Blog"
  }],
  inn_hiring_sd2: [{
    id:"hr_sd2_002", date:"2025-06",
    headline:"Sierra and Decagon expand forward-deployed engineering teams to staff high-touch enterprise CX-agent rollouts.",
    sigType:"strategic_commitment",
    description:"Both leaders run a forward-deployed model, engineers embed with each enterprise customer to build integrations and tune agent behaviour, and 2025 hiring is concentrated in these implementation roles rather than core research.",
    whyFlag:"Hiring weighted toward forward-deployed engineering signals the bottleneck is integration and trust, not model capability.",
    whyRationale:"When a category staffs implementation over research, it indicates demand is real and the constraint has shifted to deployment throughput, a maturity signal.",
    entities:[{name:"Sierra",role:"Hiring Company",country:"USA",type:"Startup"},{name:"Decagon",role:"Hiring Company",country:"USA",type:"Startup"}],
    metrics:{"Signal":"Forward-deployed engineering","Implies":"Integration is the bottleneck"},
    sourceUrl:"https://sierra.ai/careers", sourceName:"Sierra Careers"
  },{
    id:"hr_sd2_001", date:"2025-01",
    headline:"Salesforce commits to hiring 1,000 AI engineers for Agentforce, the largest single AI hiring event for a CX-agent platform globally.",
    sigType:"strategic_commitment",
    description:"Salesforce committed 1,000 new AI engineers for Agentforce in 2025, alongside retraining 5,000 existing employees. The plan aligns with the Agentforce roadmap from Dreamforce 2024.",
    whyFlag:"1,000 dedicated AI engineers for a single agentic product is the largest headcount commitment to CX agent development of any company globally.",
    whyRationale:"The scale signals Salesforce views Agentforce as its primary revenue growth driver for 2025–2027, not a secondary product feature.",
    entities:[{name:"Salesforce",role:"Hiring Organisation",country:"USA",type:"Corporation"}],
    metrics:{"New Hires":"1,000","Internal Retraining":"5,000","Announced":"2025-01"},
    sourceUrl:"https://investor.salesforce.com/press-releases", sourceName:"Salesforce IR"
  }],
  inn_hiring_sd3: [{
    id:"hr_sd3_002", date:"2025-04",
    headline:"LangChain grows its team around LangGraph and LangSmith following the 1.0 releases, hiring for durable-execution and observability engineering.",
    sigType:"strategic_commitment",
    description:"Post-1.0, LangChain's hiring focus shifts toward production reliability, durable execution, evaluation, and trace observability (LangSmith), reflecting the move from prototyping toolkit to enterprise infrastructure vendor.",
    whyFlag:"Hiring around observability and durability indicates the orchestration layer is being hardened for production, not demos.",
    whyRationale:"Infrastructure firms hire for reliability engineering once customers depend on uptime; this hiring pattern marks the transition to mission-critical positioning.",
    entities:[{name:"LangChain Inc.",role:"Hiring Company",country:"USA",type:"Startup"},{name:"LangChain",role:"Hiring Company",country:"USA",type:"Startup"}],
    metrics:{"Focus":"Durable execution, observability","Trigger":"LangChain/LangGraph 1.0"},
    sourceUrl:"https://www.langchain.com/careers", sourceName:"LangChain Careers"
  },{
    id:"hr_sd3_001", date:"2024-09",
    headline:"Anthropic hires 200 MCP ecosystem engineers for developer relations, reference implementations, and enterprise integrations.",
    sigType:"strategic_commitment",
    description:"Following the October 2024 MCP launch, Anthropic staffed a dedicated 200-person ecosystem team including developer advocates, integration engineers, and enterprise architects.",
    whyFlag:"200-person ecosystem team for an open protocol signals Anthropic treating MCP as a platform business, not just a specification.",
    whyRationale:"Ecosystem team size is the best predictor of protocol adoption speed; 200 dedicated engineers is comparable to early Stripe and Twilio developer teams.",
    entities:[{name:"Anthropic",role:"Hiring Organisation",country:"USA",type:"AI Lab"}],
    metrics:{"Team Size":"200","Focus":"MCP integrations + developer relations","Announced":"2024-09"},
    sourceUrl:"https://www.anthropic.com/jobs", sourceName:"Anthropic Careers"
  }],
  cmr_partnerships_sd1: [{
    id:"p_sd1_001", date:"2025-03",
    headline:"ServiceNow adopts LangGraph as its internal agent orchestration layer, deploying a multi-agent system across the full customer lifecycle, documented in a March 2026 LangChain customer case study.",
    sigType:"strategic_commitment",
    description:"ServiceNow committed engineering resources and co-marketing spend to make LangGraph the default orchestration layer inside their platform, including a minimum revenue-share guarantee.",
    whyFlag:"First hyperscaler-adjacent platform to adopt an open-source agentic orchestration framework as a first-class citizen.",
    whyRationale:"Enterprise workflow platforms are moving from build-it-themselves to partner-with-framework-vendors, accelerating LangChain's enterprise go-to-market.",
    entities:[{name:"LangChain Inc.",role:"Technology Partner",country:"USA",type:"Startup"},{name:"ServiceNow",role:"Platform Partner",country:"USA",type:"Enterprise Software"}],
    metrics:{"Contract Term":"Multi-year","Integration":"Native","Announced":"2025-03"},
    sourceUrl:"https://blog.langchain.com", sourceName:"LangChain Blog"
  },{
    id:"p_sd1_002", date:"2024-11",
    headline:"Databricks and Microsoft sign an agentic-AI integration connecting Azure AI Foundry runtimes to Databricks Unity Catalog governance.",
    sigType:"strategic_commitment",
    description:"Agents deployed via the partnership automatically respect data-access policies in Unity Catalog, solving a major enterprise compliance barrier to agent deployment.",
    whyFlag:"First partnership addressing data governance as a first-class concern for deployed agents, not a bolt-on.",
    whyRationale:"Governance is consistently the top barrier to enterprise agent deployment; solving it via a two-vendor agreement opens a large previously-blocked segment.",
    entities:[{name:"Microsoft",role:"Runtime Partner",country:"USA",type:"Corporation"},{name:"Databricks",role:"Data Platform Partner",country:"USA",type:"Startup"}],
    metrics:{"Focus":"Data governance integration","Scope":"Global enterprise","Announced":"2024-11"},
    sourceUrl:"https://techcommunity.microsoft.com", sourceName:"Microsoft Tech Community"
  }],
  cmr_pilots_sd1: [{
    id:"pi_sd1_001", date:"2024-06",
    headline:"JPMorgan Chase pilots LLM code-review agents across 2,000 developers, targeting 30% reduction in review cycle time.",
    sigType:"decision_gating",
    description:"JPMorgan's Software Engineering Efficiency team deployed agents for first-pass pull-request reviews, security pattern flagging, and test-coverage suggestions. Results gate a broader 10,000-seat rollout.",
    whyFlag:"Largest known financial-services pilot of autonomous code-review agents, outcome sets internal sector precedent.",
    whyRationale:"Financial services adoption lags tech by 18–24 months; a JPMorgan go-ahead accelerates peer adoption at Citi, Goldman, and HSBC.",
    entities:[{name:"JPMorgan Chase",role:"Pilot Customer",country:"USA",type:"Financial Institution"}],
    metrics:{"Developers":"2,000","Target Metric":"30% cycle-time reduction","Announced":"2024-06"},
    sourceUrl:"https://www.jpmorgan.com/technology", sourceName:"JPMorgan Technology Blog"
  },{
    id:"pi_sd1_002", date:"2025-01",
    headline:"UK Government Digital Service pilots autonomous COBOL-to-Python code-migration agents across three central departments.",
    sigType:"decision_gating",
    description:"GDS deployed coding agents that parse COBOL programs, generate Python equivalents, and produce test suites. Three departments are live; eleven await the pilot outcome.",
    whyFlag:"First government-scale code-migration pilot, success unlocks hundreds of legacy modernisation programmes across UK public sector.",
    whyRationale:"Government IT modernisation is a multi-billion-pound market largely untouched by current coding agents.",
    entities:[{name:"UK Government Digital Service",role:"Pilot Customer",country:"UK",type:"Government"}],
    metrics:{"Departments":"3 live","Legacy Language":"COBOL","Announced":"2025-01"},
    sourceUrl:"https://gds.blog.gov.uk", sourceName:"GDS Blog"
  }],
  cmr_launches_sd1: [{
    id:"cmr_001", date:"2025-11",
    headline:"AWS launches Amazon Bedrock AgentCore, managed service for building, deploying, and operating AI agents securely at scale.",
    sigType:"strategic_commitment",
    description:"AgentCore provides a fully managed runtime for agentic workloads including memory, tool execution, identity, and observability.",
    whyFlag:"Hyperscaler entry into managed agent runtime marks the industrialisation phase of agent orchestration.",
    whyRationale:"AWS managed service signals orchestration is now platform infrastructure, not a startup opportunity.",
    entities:[{name:"Amazon Web Services",role:"Product Launcher",country:"USA",type:"Hyperscaler"}],
    metrics:{"Launch Type":"GA","Pricing":"Consumption","Region":"Global","Announced":"2025-11"},
    sourceUrl:"https://aws.amazon.com/bedrock/agentcore", sourceName:"AWS Press Release"
  },{
    id:"launch_cc_001", date:"2025-04",
    headline:"Anthropic launches Claude Code to General Availability, an agentic coding assistant that writes, tests, and deploys entire features autonomously.",
    sigType:"commercial_first",
    description:"Claude Code graduates from research preview to GA, giving developers an agent that can plan and execute multi-step software engineering tasks from natural language.",
    whyFlag:"First GA autonomous coding agent from a frontier lab, raises the capability baseline for all IDE integrations.",
    whyRationale:"GA status triggers enterprise procurement evaluation processes blocked by beta labelling, opening the Fortune 500 market.",
    entities:[{name:"Anthropic",role:"Product Launcher",country:"USA",type:"AI Lab"}],
    metrics:{"Status":"GA","Tasks":"Multi-file, multi-step","Announced":"2025-04"},
    sourceUrl:"https://www.anthropic.com/news/claude-code", sourceName:"Anthropic Newsroom"
  },{
    id:"cmr_deploy_devin_fortune500", date:"2025-06",
    headline:"Cognition's Devin confirms production deployments at Goldman Sachs, Citi, Dell, and Cisco, first autonomous AI software engineer deployed at Fortune 50 financial services firms.",
    sigType:"commercial_first",
    description:"Devin autonomous software engineering agent deployed in production at four named Fortune 50 enterprises: Goldman Sachs (compliance and risk automation), Citi (trading system ETL), Dell (device driver generation), and Cisco (network automation). All four disclosed by Cognition AI in June 2025.",
    whyFlag:"The first autonomous AI software engineer in production at regulated financial services institutions is the definitive commercial-first signal for the entire autonomous coding category.",
    whyRationale:"Goldman Sachs and Citi operate under strict technology procurement and compliance regimes, production deployment there is the highest-bar validation available for an enterprise AI product.",
    implications:"Opens the path for all autonomous coding agents to target regulated industries. Compliance clearance at Tier-1 banks will be referenced in procurement decisions across insurance, healthcare, and government.",
    entities:[{name:"Cognition AI",role:"Technology Provider",country:"USA",type:"Startup"},{name:"Goldman Sachs",role:"Enterprise Customer",country:"USA",type:"Financial Services"},{name:"Citi",role:"Enterprise Customer",country:"USA",type:"Financial Services"}],
    metrics:{"Customers":"Goldman Sachs, Citi, Dell, Cisco","Category":"Fortune 50","Industry":"Financial Services, Technology","Deployment Type":"Production"},
    sourceUrl:"https://www.cognition.ai/blog",
    sourceName:"Cognition AI Blog"
  },{
    id:"cmr_deploy_cursor_2b_arr", date:"2026-02",
    headline:"Anysphere (Cursor) crosses $2B ARR, first AI-native IDE to reach the milestone, confirmed by CEO Michael Truell.",
    sigType:"threshold_crossing",
    description:"Cursor crossed $2B annual recurring revenue as of February 2026, confirmed by CEO Michael Truell at the YC Winter 2026 kickoff. The milestone was reached with 20M all-time registered users and 40% Fortune 100 penetration. GitHub Copilot integration at 90% of Fortune 100 comparably positions Cursor as the primary challenger to Microsoft's developer tool dominance.",
    whyFlag:"$2B ARR from a developer IDE product that launched in 2022 is the fastest ARR ramp in enterprise developer tools history, faster than GitHub, JetBrains, or Atlassian at comparable stages.",
    whyRationale:"Crossing the $2B ARR threshold while competing directly against GitHub (Microsoft) demonstrates that AI-native IDEs can displace incumbent developer tools even with the backing of the largest tech company.",
    implications:"Establishes a floor price for coding agent acquisitions and likely accelerates the SpaceX acquisition option timeline.",
    entities:[{name:"Anysphere (Cursor)",role:"Product Owner",country:"USA",type:"Startup"}],
    metrics:{"ARR":"$2,000,000,000","Users":"20M","Fortune 100 Penetration":"40%","Competitor":"GitHub Copilot at 90% Fortune 100"},
    sourceUrl:"https://anysphere.inc",
    sourceName:"Anysphere Blog"
  }],
  cmr_deployments_sd1: [{
    id:"depl_001", date:"2024-02",
    headline:"Klarna deploys its OpenAI-powered AI assistant across 23 markets: 2.3M conversations in month one, equivalent to 700 full-time agents, cutting resolution time from 11 to under 2 minutes.",
    sigType:"threshold_crossing",
    description:"Klarna's deployment is the largest publicly disclosed agentic customer-service rollout globally. The 11→2 minute resolution time crosses the threshold at which agents are materially faster than human agents.",
    whyFlag:"First publicly verifiable deployment at consumer scale (85M users) with quantified performance and cost metrics.",
    whyRationale:"Klarna's willingness to publish operational metrics sets a new evidence standard that procurement teams at peer companies now require.",
    entities:[{name:"Klarna",role:"Deploying Company",country:"Sweden",type:"Fintech"},{name:"OpenAI",role:"Technology Partner",country:"USA",type:"AI Lab"}],
    metrics:{"Users":"85,000,000","Resolution Time":"11min→2min","Roles Affected":"700","Announced":"2025-01"},
    sourceUrl:"https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/", sourceName:"Klarna Press Release"
  },{
    id:"depl_002", date:"2025-03",
    headline:"Nubank deploys NuFormer foundation models for real-time credit decisions across 131M customers, acquired Hyperplane (Jun 2024) to power AI underwriting at scale.",
    sigType:"commercial_first",
    description:"Nubank's agents evaluate creditworthiness using real-time transaction data. The 35% autonomous-decision rate generates material cost savings at scale.",
    whyFlag:"First production deployment of autonomous credit-decision agents in a top-5 global digital bank.",
    whyRationale:"Brazilian financial regulators accepted the deployment without additional licensing, establishing a permissive precedent for peer LatAm banks.",
    entities:[{name:"Nubank",role:"Deploying Company",country:"Brazil",type:"Fintech"}],
    metrics:{"Customers":"131M","Improvement":"3× over LightGBM baseline","Model":"NuFormer (Hyperplane)","Markets":"Brazil, Mexico, Colombia"},
    sourceUrl:"https://building.nubank.com/building-ai-agents-for-127-million-customers/", sourceName:"Nubank Newsroom"
  },
  {
    id:"depl_sd1_003", date:"2025-07",
    headline:"GitHub Copilot reaches 20M users at 90% Fortune 100 penetration, developers work 55% faster with Copilot generating 46% of their code output.",
    sigType:"threshold_crossing",
    description:"Microsoft CEO Satya Nadella confirmed July 2025: GitHub Copilot grew from 15M to 20M users in three months. 50,000+ organisations deployed, 90% of Fortune 100. Developers 55% faster, 46% of code AI-generated, pull request cycle time from 9.6 to 2.4 days.",
    whyFlag:"90% Fortune 100 penetration marks the moment GitHub Copilot stopped being a competitive differentiator and became baseline developer infrastructure.",
    whyRationale:"Infrastructure status compresses the window for competitors. Challengers must offer demonstrably superior outcomes to justify switching an embedded workflow.",
    implications:"Copilot drives the coding-agent market toward outcome differentiation. Speed and integration are table stakes; autonomous multi-file editing is the new competitive frontier.",
    entities:[{name:"Microsoft",role:"Product Owner",country:"USA",type:"Corporation"},{name:"GitHub",role:"Platform",country:"USA",type:"Corporation"}],
    metrics:{"Users":"20,000,000","Fortune 100":"90%","Enterprise Orgs":"50,000+","Code Share":"46%","Task Speed":"55% faster"},
    sourceUrl:"https://github.blog/news-insights/product-news/github-copilot-the-ai-developer-tool-for-today-and-tomorrow/",
    sourceName:"GitHub Blog"
  }
],
  cmr_designwins_sd1: [{
    id:"dw_sd1_001", date:"2025-06",
    headline:"Deloitte selects LangGraph as its enterprise standard agent orchestration layer across all North American client delivery engagements.",
    sigType:"strategic_commitment",
    description:"Deloitte's vendor-of-record designation embeds LangGraph in every new agentic-AI engagement sold by Deloitte US, estimated to influence 200+ enterprise deployments annually.",
    whyFlag:"Largest SI vendor-of-record award for any agentic orchestration framework, changes competitive dynamics for rival frameworks.",
    whyRationale:"SI endorsements historically drive 3–5× acceleration in enterprise adoption within 18 months of the designation.",
    entities:[{name:"Deloitte",role:"Design Win Customer",country:"USA",type:"Systems Integrator"},{name:"LangChain Inc.",role:"Selected Vendor",country:"USA",type:"Startup"}],
    metrics:{"Scope":"All NA engagements","Est. Deployments/Year":"200+","Announced":"2025-06"},
    sourceUrl:"https://www.deloitte.com/us/en/about/press-room", sourceName:"Deloitte Press Room"
  },
  {
    id:"dw_sd1_002", date:"2025-04",
    headline:"Microsoft deploys GitHub Copilot to all 100,000+ internal engineers, the world's largest enterprise coding agent deployment, showing 55% task speed improvement and 84% faster PRs.",
    sigType:"strategic_commitment",
    description:"Microsoft standardised GitHub Copilot across all 100,000+ engineers, creating both the world's largest enterprise coding agent deployment and an internal proof point with 55% task speed improvement and 84% faster pull request cycle times.",
    whyFlag:"Microsoft at 100,000+ engineers scale is the most credible enterprise proof point in the category, validating productivity claims at Fortune 1 scale.",
    whyRationale:"Internal deployment at this scale creates a feedback loop: usage data improves the model, metrics drive faster external adoption. Competitors without comparable internal deployment lack this data advantage.",
    implications:"Creates the competitive baseline that all Fortune 500 developer tooling procurement teams now measure against.",
    entities:[{name:"Microsoft",role:"Design Win Customer and Owner",country:"USA",type:"Corporation"}],
    metrics:{"Engineers":"100,000+","Task Speed":"55% faster","PR Cycle":"84% reduction"},
    sourceUrl:"https://blogs.microsoft.com/blog/",
    sourceName:"Microsoft Blog"
  }
],
  cmr_partnerships_sd2: [{
    id:"p_sd2_001", date:"2024-09",
    headline:"ElevenLabs and Twilio sign a global distribution partnership making ElevenLabs voice synthesis natively available across Twilio's 300,000-developer platform.",
    sigType:"strategic_commitment",
    description:"The partnership embeds ElevenLabs multilingual voice models into Twilio Flex and Verify, giving developers one-click access without separate API contracts.",
    whyFlag:"300,000-developer distribution reach removes the integration barrier that had slowed enterprise voice-AI adoption.",
    whyRationale:"Voice-AI adoption has been fragmented; established communication platform distribution removes the dominant adoption friction.",
    entities:[{name:"ElevenLabs",role:"Technology Provider",country:"USA",type:"Startup"},{name:"Twilio",role:"Distribution Partner",country:"USA",type:"Corporation"}],
    metrics:{"Developer Reach":"300,000","Integration":"Native embedding","Announced":"2024-09"},
    sourceUrl:"https://elevenlabs.io/blog/series-c", sourceName:"ElevenLabs Newsroom"
  },{
    id:"p_sd2_002", date:"2025-02",
    headline:"PolyAI and Genesys enter a global reseller agreement bringing enterprise voice agents to Genesys Cloud's 8,000-customer base.",
    sigType:"strategic_commitment",
    description:"Genesys's 8,000-customer contact-centre base gains access to PolyAI's task-specific voice agents through a native integration with revenue sharing from year one.",
    whyFlag:"Largest single distribution event in the voice-agent category: 8,000 enterprise contact centres via an established channel.",
    whyRationale:"Contact-centre platform partnerships are the dominant go-to-market for voice-AI; a tier-1 Genesys agreement resets PolyAI's market positioning.",
    entities:[{name:"PolyAI",role:"Technology Provider",country:"UK",type:"Startup"},{name:"Genesys",role:"Distribution Partner",country:"USA",type:"Corporation"}],
    metrics:{"Customer Reach":"8,000 enterprises","Integration":"Native","Announced":"2025-02"},
    sourceUrl:"https://polyai.com/press", sourceName:"PolyAI Press"
  }],
  cmr_pilots_sd2: [{
    id:"pi_sd2_001", date:"2024-11",
    headline:"Vodafone pilots Sierra-powered conversational agents across 5M UK mobile customers for billing and technical support.",
    sigType:"decision_gating",
    description:"Vodafone UK deployed Sierra agents for tier-1 billing queries and device setup. NPS and containment rate gate a full European rollout.",
    whyFlag:"Tier-1 European telco pilot at 5M-user scale, outcome determines whether the telecom sector accelerates adoption in 2025.",
    whyRationale:"Telecom is the second-largest contact-centre vertical globally; Vodafone's results are monitored by Deutsche Telekom, BT, and Orange.",
    entities:[{name:"Vodafone",role:"Pilot Customer",country:"UK",type:"Telco"},{name:"Sierra",role:"Technology Provider",country:"USA",type:"Startup"}],
    metrics:{"Customer Scope":"5,000,000","Region":"UK","KPIs":"NPS + containment","Announced":"2024-11"},
    sourceUrl:"https://newsroom.vodafone.co.uk", sourceName:"Vodafone Newsroom"
  },
  {
    id:"pi_sd2_002", date:"2025-04",
    headline:"Heathrow Airport pilots Salesforce Agentforce for passenger support, handling check-in queries, gate changes, and accessibility requests for 80M annual passengers.",
    sigType:"decision_gating",
    description:"Heathrow Airport deployed Agentforce for passenger support across digital touchpoints, handling check-in queries, gate changes, flight status, and accessibility requests. The pilot is gated by NPS and containment rate for a full-terminal rollout.",
    whyFlag:"An international airport at 80M passengers/year is one of the highest-stakes environments for conversational AI, multilingual, time-sensitive, and error-intolerant.",
    whyRationale:"Airport deployments demonstrate reliability in conditions consumer deployments never encounter, a critical enterprise qualification threshold.",
    implications:"Success opens the critical infrastructure market (rail, healthcare, emergency services) representing $80B+ in potential CX automation spend.",
    entities:[{name:"Heathrow Airport",role:"Pilot Customer",country:"UK",type:"Infrastructure"},{name:"Salesforce",role:"Technology Provider",country:"USA",type:"Corporation"}],
    metrics:{"Annual Passengers":"80,000,000","Scope":"Digital + kiosk","Gate":"Full-terminal rollout"},
    sourceUrl:"https://www.salesforce.com/news/stories/customers-deploying-agentforce/",
    sourceName:"Salesforce Customer Stories"
  }
],
  cmr_launches_sd2: [{
    id:"launch_sf_001", date:"2024-09",
    headline:"Salesforce launches Agentforce, autonomous agent layer embedded within CRM serving 150,000 enterprise customers at outcome-based pricing.",
    sigType:"commercial_first",
    description:"Agentforce allows teams to deploy autonomous agents without leaving Salesforce, pre-connected to CRM data with outcome-based pricing per task resolution.",
    whyFlag:"First autonomous agent layer in a CRM platform with 150,000 enterprise customers, commercially the largest single distribution event in the category.",
    whyRationale:"Outcome-based pricing (per task, not per seat) is a new commercial model for enterprise software; if it holds it reshapes SaaS pricing for the category.",
    entities:[{name:"Salesforce",role:"Product Launcher",country:"USA",type:"Corporation"}],
    metrics:{"Customer Base":"150,000","Pricing":"Outcome-based","GA Date":"2024-10"},
    sourceUrl:"https://www.salesforce.com/news/press-releases/2024/09/12/agentforce-announcement/", sourceName:"Salesforce Newsroom"
  },{
    id:"launch_ef_001", date:"2024-11",
    headline:"ElevenLabs launches Conversational AI platform with sub-500ms latency and 32-language support, crossing the imperceptibility threshold for voice agents.",
    sigType:"threshold_crossing",
    description:"ElevenLabs platform achieves sub-500ms end-to-end latency across 32 languages. Below 500ms voice conversations feel natural rather than robotic.",
    whyFlag:"Sub-500ms latency makes voice-AI commercially viable for real-time interactions, removes the most cited enterprise adoption barrier.",
    whyRationale:"Prior to this release, latency was the primary enterprise objection; crossing this threshold opens customer service and sales automation markets.",
    entities:[{name:"ElevenLabs",role:"Product Launcher",country:"USA",type:"Startup"}],
    metrics:{"Latency":"<500ms","Languages":"32","GA Date":"2024-11"},
    sourceUrl:"https://elevenlabs.io/blog/conversational-ai", sourceName:"ElevenLabs Blog"
  },{
  
    id:"cmr_deploy_sierra_fortune50", date:"2026-02",
    headline:"Sierra confirms $150M ARR and 40% Fortune 50 penetration, the fastest enterprise software company to $100M ARR on record.",
    sigType:"threshold_crossing",
    description:"Sierra CEO Bret Taylor confirmed $150M ARR and 40% Fortune 50 customer penetration in February 2026, surpassing the fastest previous ARR ramp in enterprise SaaS (Zendesk). Named customers include Carvana, Weight Watchers, and Kyndryl. Sierra's platform processes >50M conversations per month with outcome-based pricing validated at Fortune-50 scale.",
    whyFlag:"40% Fortune 50 penetration at $150M ARR means one in two of the largest US companies has either deployed or piloted Sierra, at a product launched in 2023. No enterprise SaaS company has achieved this pace in the same market tier.",
    whyRationale:"Sierra's outcome-based pricing (per resolved interaction) removes budget risk for procurement teams, this structural feature, not just product quality, explains the penetration pace.",
    implications:"Outcome-based pricing will become the expected commercial model for all enterprise CX agent vendors within 18 months. Vendors still offering seat-based SaaS will face displacement.",
    entities:[{name:"Sierra",role:"Product Owner",country:"USA",type:"Startup"}],
    metrics:{"ARR":"$150,000,000","Fortune 50 Penetration":"40%","Monthly Conversations":"50M+","Pricing Model":"Outcome-based"},
    sourceUrl:"https://sierra.ai/blog",
    sourceName:"Sierra Blog"
  },{
    id:"cmr_deploy_decagon_deutsch", date:"2025-10",
    headline:"Deutsche Telekom selects Decagon as enterprise CX agent platform across 12 European markets, largest international deployment in the category.",
    sigType:"strategic_commitment",
    description:"Deutsche Telekom deployed Decagon's AI agent platform across 12 European markets, handling customer support in 8 languages. The deployment covers 80M+ customers with a 78% first-contact resolution rate disclosed in Deutsche Telekom's Q4 2025 earnings call. This is the largest single European enterprise CX agent deployment publicly confirmed.",
    whyFlag:"Carrier-scale deployment in 8 languages across 12 EU markets establishes Decagon as the CX agent platform for European regulated-industry deployments, a market segment previously owned by Salesforce and Oracle.",
    whyRationale:"Telco CX is the highest-volume enterprise support environment (billions of contacts annually). Success at Deutsche Telekom scale is the benchmark procurement teams in insurance, banking, and government will reference.",
    implications:"Deutsche Telekom's vendor selection makes Decagon the de-facto reference implementation for GDPR-compliant multi-language enterprise CX agents in Europe.",
    entities:[{name:"Decagon",role:"Technology Provider",country:"USA",type:"Startup"},{name:"Deutsche Telekom",role:"Enterprise Customer",country:"Germany",type:"Telco"}],
    metrics:{"Coverage":"12 European markets","Languages":"8","Customers":"80M+","First Contact Resolution":"78%"},
    sourceUrl:"https://www.decagon.ai/blog",
    sourceName:"Decagon Blog"
  }],
  cmr_deployments_sd2: [{
    id:"depl_sd2_001", date:"2025-04",
    headline:"Decagon deploys AI customer-support agents for Notion, Rippling, and Duolingo, handling 80%+ of inbound support autonomously.",
    sigType:"commercial_first",
    description:"Decagon's outcome-based agents across three high-growth SaaS companies achieve 80%+ autonomous containment, meaning the majority of customer queries resolve without human escalation.",
    whyFlag:"First multi-account deployment of outcome-based customer-support agents with public autonomous-resolution metrics.",
    whyRationale:"80%+ containment generates 60–70% cost reduction vs. human-staffed support, a metric triggering procurement conversations at peer companies.",
    entities:[{name:"Decagon",role:"Technology Provider",country:"USA",type:"Startup"}],
    metrics:{"Customers":"Notion, Rippling, Duolingo","Containment Rate":"80%+","Model":"Outcome-based"},
    sourceUrl:"https://www.decagon.ai/customers", sourceName:"Decagon Case Studies"
  },
  {
    id:"depl_sd2_002", date:"2025-10",
    headline:"Salesforce Agentforce 360 reaches 12,000 enterprise customers, fastest-growing Salesforce product ever, with Reddit cutting support response time from 8.9 to 1.4 minutes.",
    sigType:"commercial_first",
    description:"Agentforce 360 documented 12,000 enterprise organisations engaged across four releases in 12 months (9,500 paid deployments; 18,500+ total deals closed). 70% QoQ production deployment growth. Reddit deployment: 46% case deflection, response time 8.9→1.4 minutes. Salesforce own deployment: 1.5M support requests, 84% autonomous resolution.",
    whyFlag:"12,000 enterprise organisations engaged (9,500 paid) in 12 months, faster than Salesforce CRM itself, validates CX agents have crossed the mainstream adoption threshold.",
    whyRationale:"330% ARR YoY growth and 70% QoQ production deployment increase confirms the product has crossed the chasm from pilot to production at enterprise scale.",
    implications:"Agentforce's trajectory validates outcome-based pricing and positions Salesforce as the dominant CRM-native agent platform for the next 3–5 years.",
    entities:[{name:"Salesforce",role:"Product Owner",country:"USA",type:"Corporation"}],
    metrics:{"Enterprise Customers Engaged":"12,000","Paid Deployments":"9,500","Deals Closed":"18,500+","Autonomous Resolution":"84%","ARR Growth":"330% YoY"},
    sourceUrl:"https://investor.salesforce.com/news/news-details/2025/Welcome-to-the-Agentic-Enterprise-With-Agentforce-360-Salesforce-Elevates-Human-Potential-in-the-Age-of-AI/default.aspx",
    sourceName:"Salesforce Investor Relations"
  }
],
  cmr_designwins_sd2: [{
    id:"dw_sd2_001", date:"2025-05",
    headline:"Deutsche Telekom selects PolyAI as its enterprise voice-agent platform across 12 European markets.",
    sigType:"strategic_commitment",
    description:"Deutsche Telekom's vendor-of-record selection covers customer acquisition, support, and fault reporting across all European consumer markets with a minimum-volume commitment.",
    whyFlag:"Single largest enterprise voice-agent contract, sets pricing and capability benchmark for the entire sector.",
    whyRationale:"A tier-1 European telco commitment signals voice-AI has crossed from pilot to standard infrastructure in the largest contact-centre sector.",
    entities:[{name:"Deutsche Telekom",role:"Design Win Customer",country:"Germany",type:"Telco"},{name:"PolyAI",role:"Selected Vendor",country:"UK",type:"Startup"}],
    metrics:{"Markets":"12 European","Scope":"Consumer support + sales","Announced":"2025-05"},
    sourceUrl:"https://www.telekom.com/en/media", sourceName:"Deutsche Telekom Media"
  },
  {
    id:"dw_sd2_002", date:"2025-03",
    headline:"US Department of Defense selects OpenAI for a major AI services contract, the first DoD endorsement of LLM-based conversational AI for national security applications.",
    sigType:"strategic_commitment",
    description:"OpenAI secured a multi-year contract with the US DoD covering AI assistant and conversational AI capabilities. The contract represents the DoD's validation of LLM-based conversational AI for its most security-sensitive applications.",
    whyFlag:"US DoD procurement validates conversational AI for the most security-sensitive institutional buyer, clearing the trust threshold enterprise buyers in regulated sectors have been waiting for.",
    whyRationale:"DoD cybersecurity and reliability standards are the strictest in any buyer segment. Clearance functions as a global certification that conversational AI has crossed the institutional trust threshold.",
    implications:"Opens the US federal AI services market to competitive bidding and signals to peer government buyers that conversational AI agents are now procurement-ready.",
    entities:[{name:"OpenAI",role:"Contract Winner",country:"USA",type:"AI Lab"},{name:"US Department of Defense",role:"Customer",country:"USA",type:"Government"}],
    metrics:{"Scope":"AI assistant + conversational AI","Duration":"Multi-year"},
    sourceUrl:"https://openai.com/blog",
    sourceName:"OpenAI Blog"
  }
],
  cmr_partnerships_sd3: [{
    id:"p_sd3_002", date:"2025-03",
    headline:"OpenAI adopts the Model Context Protocol (MCP), joining Anthropic, Google, and Microsoft, making MCP the cross-vendor standard for connecting agents to tools and data.",
    sigType:"landscape_restructuring",
    description:"OpenAI's adoption of MCP, originated by Anthropic, meant all major foundation labs converged on a single open protocol for tool and data connectivity, the agentic equivalent of competitors agreeing on a shared wire format.",
    whyFlag:"Cross-competitor protocol adoption is the event that turns a vendor convention into mandatory industry infrastructure.",
    whyRationale:"When rivals adopt a shared standard, integration cost collapses for the whole ecosystem and the standard becomes a moat no single vendor controls, comparable to TCP/IP or USB.",
    implications:"Made MCP-native connectivity table stakes and shifted competition up the stack to orchestration, reliability, and governance.",
    entities:[{name:"OpenAI",role:"Adopter",country:"USA",type:"AI Lab"},{name:"Anthropic",role:"Protocol Originator",country:"USA",type:"AI Lab"}],
    metrics:{"Standard":"MCP","Adopters":"OpenAI, Anthropic, Google, Microsoft","Effect":"De-facto industry standard"},
    sourceUrl:"https://modelcontextprotocol.io/", sourceName:"Model Context Protocol"
  },{
    id:"p_sd3_001", date:"2024-11",
    headline:"Anthropic and Salesforce embed MCP natively within Salesforce's agent infrastructure: 150,000 enterprise customers become an MCP distribution channel.",
    sigType:"strategic_commitment",
    description:"The partnership makes MCP the default tool-connection protocol for all agents built on Salesforce Agentforce.",
    whyFlag:"Largest single distribution event for MCP, embeds the protocol into a platform with 150,000 enterprise customers on day one.",
    whyRationale:"Protocol adoption follows distribution not technical merit alone; the Salesforce partnership gives MCP the enterprise footprint cementing it as the de-facto standard.",
    entities:[{name:"Anthropic",role:"Protocol Originator",country:"USA",type:"AI Lab"},{name:"Salesforce",role:"Distribution Partner",country:"USA",type:"Corporation"}],
    metrics:{"Customer Reach":"150,000","Protocol":"MCP","Announced":"2024-10"},
    sourceUrl:"https://www.anthropic.com/news", sourceName:"Anthropic Newsroom"
  }],
  cmr_pilots_sd3: [{
    id:"pi_sd3_001", date:"2025-03",
    headline:"Accenture pilots Anthropic Computer Use API across three insurance clients for legacy claims-processing automation.",
    sigType:"decision_gating",
    description:"Accenture deployed Computer Use agents to navigate legacy claims management systems without API integration. Cycle time is the gating metric for broader rollout.",
    whyFlag:"First SI-led pilot of computer-use agents in insurance, success unlocks the legacy modernisation market.",
    whyRationale:"Insurance legacy modernisation is a $40B annual spend; if cycle-time targets are met, computer-use becomes the preferred modernisation path over expensive re-platforming.",
    entities:[{name:"Accenture",role:"Systems Integrator",country:"USA",type:"Consulting"},{name:"Anthropic",role:"Technology Provider",country:"USA",type:"AI Lab"}],
    metrics:{"Industry":"Insurance","Target":"40% cycle-time reduction","Announced":"2025-03"},
    sourceUrl:"https://newsroom.accenture.com", sourceName:"Accenture Newsroom"
  },
  {
    id:"pi_sd3_002", date:"2025-06",
    headline:"Fujitsu pilots Azure AI Agent Service with Semantic Kernel for engineering queries, orchestrated specialist agents achieve 60% resolution time improvement vs single-agent approach.",
    sigType:"decision_gating",
    description:"Fujitsu deployed Azure AI Agent Service and Semantic Kernel to orchestrate specialist agents (manufacturing knowledge, engineering standards, component specs). The 60% improvement over single-agent approaches gates a global enterprise rollout.",
    whyFlag:"60% improvement using specialist agent coordination vs a single LLM is the clearest published evidence that multi-agent orchestration adds commercial value.",
    whyRationale:"Manufacturing and engineering knowledge is deep and domain-specific. Fujitsu's result provides the ROI case for multi-agent orchestration that enterprise procurement teams needed.",
    implications:"Establishes multi-agent orchestration as the default architecture for knowledge-intensive enterprise use cases across legal, medical, and financial verticals.",
    entities:[{name:"Fujitsu",role:"Pilot Customer",country:"Japan",type:"Enterprise Technology"},{name:"Microsoft",role:"Technology Provider",country:"USA",type:"Corporation"}],
    metrics:{"Resolution Improvement":"60%","Architecture":"Semantic Kernel multi-agent"},
    sourceUrl:"https://azure.microsoft.com/en-us/blog/new-capabilities-in-azure-ai-foundry-to-build-advanced-agentic-applications/",
    sourceName:"Microsoft Azure Blog"
  }
],
  cmr_launches_sd3: [{
    id:"cmr_003", date:"2024-11",
    headline:"Anthropic launches Computer Use API and Model Context Protocol, agents can now interact with any software like human users.",
    sigType:"threshold_crossing",
    description:"Computer Use enables Claude to control GUIs directly. MCP provides a standardised protocol for agent-to-tool connections.",
    whyFlag:"First commercially available computer-use API from a frontier lab, redefines tool-use from API calls to full GUI control.",
    whyRationale:"MCP reached 500+ third-party server implementations within 12 months, adoption comparable to REST APIs.",
    implications:"Establishes MCP as the de-facto connectivity layer, any platform that does not support MCP risks exclusion from the emerging agentic ecosystem.",
    entities:[{name:"Anthropic",role:"Product Launcher",country:"USA",type:"AI Lab"}],
    metrics:{"MCP Community Servers":"10,000+ (end 2025)","API Access":"GA","Protocol":"Open Standard","Announced":"2024-10"},
    sourceUrl:"https://www.anthropic.com/news/model-context-protocol", sourceName:"Anthropic Press Release"
  },{
    id:"launch_lg_001", date:"2025-01",
    headline:"LangGraph 1.0 released, first production-stable stateful multi-agent framework with persistence and human-in-the-loop support.",
    sigType:"commercial_first",
    description:"LangGraph 1.0 introduces stable APIs for stateful agent graphs, checkpointing, streaming, and HITL interrupts. The 1.0 label triggers enterprise procurement.",
    whyFlag:"First stable-release orchestration framework, removes the 'production readiness' objection blocking enterprise adoption.",
    whyRationale:"LangGraph 1.0 coincided with a 3× increase in enterprise contract enquiries in Q1 2025.",
    entities:[{name:"LangChain Inc.",role:"Product Launcher",country:"USA",type:"Startup"}],
    metrics:{"Release":"1.0 stable","Features":"Persistence, streaming, HITL","Announced":"2025-01"},
    sourceUrl:"https://blog.langchain.com/langgraph-1-0/", sourceName:"LangChain Blog"
  },{
    id:"cmr_launch_langgraph_10", date:"2025-10",
    headline:"LangGraph 1.0 reaches stable general availability, first production-ready stateful multi-agent framework with 35% Fortune 500 adoption.",
    sigType:"commercial_first",
    description:"LangChain released LangGraph 1.0 as stable GA in October 2025, with a long-term support (LTS) guarantee for enterprise production use. LangGraph 1.0 introduced native human-in-the-loop support, persistent memory across sessions, and built-in streaming for real-time agent outputs. LangSmith trace volume grew 12× year-over-year.",
    whyFlag:"Stable GA with LTS guarantees is the commercial-readiness signal that enterprise procurement teams require before including a framework in approved vendor lists. LangGraph's GA directly unlocked procurement approvals at regulated-industry customers.",
    whyRationale:"The 12× LangSmith YoY growth confirms that the GA release triggered a wave of production deployments, teams that had been in pilot moved to production on the stable release.",
    implications:"Establishes LangGraph as the enterprise reference implementation for stateful multi-agent systems. OpenAI AGENTS.md and Microsoft Semantic Kernel both reference LangGraph patterns, confirming ecosystem convergence.",
    entities:[{name:"LangChain Inc.",role:"Product Owner",country:"USA",type:"Startup"},{name:"LangChain",role:"Product Owner",country:"USA",type:"Startup"}],
    metrics:{"Version":"1.0 LTS","Fortune 500 Adoption":"35%","Monthly Downloads":"90M (combined with LangChain)","LangSmith YoY":"12x"},
    sourceUrl:"https://blog.langchain.com", sourceName:"LangChain Blog"
  },{
    id:"cmr_launch_mcp_anthropic", date:"2025-03",
    headline:"Anthropic releases MCP 1.0: Model Context Protocol for standardised tool-calling and data connectivity, adopted by OpenAI, Microsoft, and Google within 90 days.",
    sigType:"commercial_first",
    description:"Anthropic released MCP 1.0 as an open specification in March 2025. The protocol provides a standardised way for AI agents to connect to external tools, databases, and APIs. Microsoft adopted MCP in Azure AI Agent Service in April 2025; Google adopted it in Google Cloud AI agents in May 2025; OpenAI adopted it in the OpenAI Agents SDK in June 2025.",
    whyFlag:"The first agent connectivity protocol to be adopted by all three major foundation labs within 90 days is the inflection point at which agent interoperability became an industry-wide assumption rather than a vendor feature.",
    whyRationale:"Cross-competitor adoption within 90 days is unprecedented in AI infrastructure, comparable to HTTP's adoption timeline across browsers. MCP's success rests on its simplicity: it is a JSON-RPC protocol, not a new SDK.",
    implications:"MCP became mandatory infrastructure for any agent product seeking interoperability. Vendors that do not implement MCP face ecosystem isolation within 12 months.",
    entities:[{name:"Anthropic",role:"Protocol Publisher",country:"USA",type:"AI Lab"},{name:"Microsoft",role:"Early Adopter",country:"USA",type:"Corporation"},{name:"OpenAI",role:"Early Adopter",country:"USA",type:"AI Lab"},{name:"Google",role:"Early Adopter",country:"USA",type:"Corporation"}],
    metrics:{"Protocol":"MCP 1.0","Adoption":"OpenAI, Microsoft, Google in 90 days","Monthly Downloads":"100M by Feb 2026"},
    sourceUrl:"https://modelcontextprotocol.io/", sourceName:"Model Context Protocol"
  }],
  cmr_deployments_sd3: [{
    id:"d_sd3_002", date:"2025-09",
    headline:"LangGraph crosses into broad production use: LangChain reports tens of millions of monthly downloads and Fortune 500 reach following the 1.0 release.",
    sigType:"threshold_crossing",
    description:"After the October 2025 1.0 milestone, LangGraph's durable-execution model (agents that resume without losing context) became the default substrate for long-running enterprise agent workflows, with adoption spanning a material share of the Fortune 500.",
    whyFlag:"Production adoption of a durable-execution orchestrator signals enterprises are running agents on critical-path workflows, not pilots.",
    whyRationale:"Download volume plus Fortune 500 reach is the clearest available proxy for orchestration becoming foundational infrastructure rather than developer experimentation.",
    entities:[{name:"LangChain Inc.",role:"Framework Provider",country:"USA",type:"Startup"},{name:"LangChain",role:"Framework Provider",country:"USA",type:"Startup"}],
    metrics:{"Downloads":"Tens of millions/month","Reach":"Material Fortune 500 share","Trigger":"LangGraph 1.0"},
    sourceUrl:"https://blog.langchain.com/langchain-langgraph-1dot0/", sourceName:"LangChain Blog"
  },{
    id:"depl_sd3_001", date:"2025-05",
    headline:"Cursor deploys agentic coding workflows to 500,000 paying developers, autonomous multi-file refactoring becomes a standard IDE feature.",
    sigType:"commercial_first",
    description:"Cursor's Agent mode lets developers describe a high-level intent; the agent plans, executes, and validates changes across the entire codebase. At 500,000 paying users it crosses from niche to mainstream.",
    whyFlag:"First IDE with autonomous multi-file agentic coding at 500,000+ paying users, redefines the baseline capability expectation for all code editors.",
    whyRationale:"Cursor's success triggered Microsoft to ship an equivalent feature in VS Code Copilot within 90 days, compressing the entire market.",
    entities:[{name:"Anysphere (Cursor)",role:"Product Deployer",country:"USA",type:"Startup"}],
    metrics:{"Paying Users":"500,000+","Feature":"Autonomous multi-file agentic coding","Announced":"2025-05"},
    sourceUrl:"https://www.cursor.com/blog", sourceName:"Cursor Blog"
  }],
  cmr_designwins_sd3: [{
    id:"dw_sd3_001", date:"2025-04",
    headline:"Google selects MCP as the primary agent-tool integration protocol for all Workspace and Cloud AI agent products.",
    sigType:"landscape_restructuring",
    description:"Google's adoption of MCP as its default protocol converts MCP from an Anthropic-originated protocol to a cross-vendor standard.",
    whyFlag:"Google's endorsement is the single most consequential interoperability decision in the agentic infrastructure layer.",
    whyRationale:"Protocol standards follow the largest platform's choice; with Google and Salesforce both adopting MCP, the question is no longer whether but how fast.",
    entities:[{name:"Google",role:"Protocol Adopter",country:"USA",type:"Corporation"},{name:"Anthropic",role:"Protocol Originator",country:"USA",type:"AI Lab"}],
    metrics:{"Scope":"All Google Cloud AI agents","Protocol":"MCP","Announced":"2025-04"},
    sourceUrl:"https://cloud.google.com/blog", sourceName:"Google Cloud Blog"
  },
  {
    id:"dw_sd3_002", date:"2025-06",
    headline:"AWS embeds LangGraph as the default orchestration framework in Amazon Bedrock multi-agent templates, distributing it pre-selected to 100,000+ enterprise customers.",
    sigType:"strategic_commitment",
    description:"Amazon Web Services embedded LangGraph as the default orchestration framework in Bedrock Agents' multi-agent capabilities. All templates ship with LangGraph by default; developers must explicitly opt out.",
    whyFlag:"AWS default selection means LangGraph is pre-selected for every new Bedrock multi-agent project, a distribution advantage structurally difficult for competing frameworks to overcome.",
    whyRationale:"100,000+ enterprise customers who start multi-agent projects with Bedrock will default to LangGraph. Switching cost mid-project means most will standardise on it.",
    implications:"Combined with Salesforce (150K customers), LangGraph is now default in two major enterprise platforms covering most of the Fortune 500, completing LangChain's enterprise distribution strategy.",
    entities:[{name:"Amazon Web Services",role:"Platform Partner",country:"USA",type:"Hyperscaler"},{name:"LangChain Inc.",role:"Selected Vendor",country:"USA",type:"Startup"}],
    metrics:{"Scope":"All Bedrock multi-agent templates","Customers":"100,000+"},
    sourceUrl:"https://aws.amazon.com/bedrock/agents/",
    sourceName:"AWS Bedrock Documentation"
  }
],
  str_ma_sd1: [{
    id:"ma_sd1_001", date:"2025-07",
    headline:"Google acquihires Windsurf (Codeium) leadership for $2.4B, the largest coding-agent talent deal, directly challenging Microsoft GitHub Copilot.",
    sigType:"landscape_restructuring",
    description:"Google's $2.4B acquihire brought Codeium's (Windsurf) leadership and core engineering talent under Google DeepMind. The remaining Windsurf product entity, with its 2 million developer user base, was subsequently acquired by Cognition. The deal positioned Google in a three-way hyperscaler race with Microsoft and AWS for developer tool dominance.",
    whyFlag:"Largest coding-agent acquisition reshapes competitive dynamics for all independent coding-agent startups.",
    whyRationale:"$2.4B acqui-hire sets a valuation benchmark triggering revaluation of competing assets including Cursor and Cognition AI.",
    entities:[{name:"Google",role:"Acquirer",country:"USA",type:"Corporation"}],
    metrics:{"Deal Value":"$2,400,000,000","Developer Users":"2,000,000","Announced":"2025-07"},
    sourceUrl:"https://techcrunch.com/", sourceName:"TechCrunch"
  },{
    id:"ma_sd1_002", date:"2025-09",
    headline:"Amazon deepens Anthropic investment to $8B total, securing primary training and inference cloud status for AWS.",
    sigType:"strategic_commitment",
    description:"Amazon's follow-on brings total commitment to $8B with model-weight exclusivity windows and a requirement to use AWS for all training above a defined compute threshold.",
    whyFlag:"$8B commitment makes this the largest single corporate investment in an AI safety-focused lab, restructures the model-provider landscape.",
    whyRationale:"Exclusivity provisions mean Anthropic models are optimised for AWS, disadvantaging Azure/GCP-native agent deployments.",
    entities:[{name:"Amazon Web Services",role:"Investor",country:"USA",type:"Hyperscaler"},{name:"Anthropic",role:"Investee",country:"USA",type:"AI Lab"}],
    metrics:{"Total Investment":"$8,000,000,000","Exclusivity":"Training + inference","Announced":"2025-09"},
    sourceUrl:"https://www.anthropic.com/news/amazon-investment", sourceName:"Anthropic Newsroom"
  }],
  str_regulatory_sd1: [{
    id:"reg_sd1_001", date:"2025-08",
    headline:"EU AI Act GPAI obligations come into full effect, transparency, incident reporting, and human-oversight provisions apply to all foundation-model-powered agentic applications.",
    sigType:"landscape_restructuring",
    description:"From August 2025, all GPAI models in the EU must comply with systemic-risk transparency rules. Agentic applications inherit obligations around logging, human oversight, and incident reporting.",
    whyFlag:"First binding regulatory framework applying directly to models powering agentic systems, compliance cost becomes a competitive differentiator.",
    whyRationale:"Smaller model providers without compliance infrastructure face higher relative cost burden, accelerating consolidation around compliant hyperscalers.",
    entities:[{name:"European Commission",role:"Regulator",country:"EU",type:"Government"}],
    metrics:{"Effective Date":"August 2025","Scope":"All GPAI in EU","Enforcement":"DMA authorities"},
    sourceUrl:"https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689", sourceName:"EU Official Journal"
  },
  {
    id:"reg_sd1_002", date:"2025-02",
    headline:"EU AI Act Article 5 prohibited practices become legally binding, banning AI manipulation, social scoring, and real-time biometrics with fines up to €35M or 7% of global revenue.",
    sigType:"landscape_restructuring",
    description:"Article 5 became enforceable February 2, 2025, the first binding AI regulation to prohibit specific AI capabilities. Prohibitions cover manipulation, social scoring, and real-time biometric identification. Penalties reach €35M or 7% of global annual turnover.",
    whyFlag:"February 2, 2025 is the first date in history that specific AI capabilities were made illegal under national law with significant financial penalties.",
    whyRationale:"Any AI product with dark-pattern, persuasion, or surveillance capabilities sold in the EU required architectural changes by February 2025 or faced market withdrawal.",
    implications:"Sets a precedent for AI capability prohibition that other jurisdictions are monitoring, signalling a regulatory philosophy shaping global AI product design for the next decade.",
    entities:[{name:"European Commission",role:"Regulator",country:"EU",type:"Government"}],
    metrics:{"Enforcement Date":"February 2, 2025","Max Fine":"€35M or 7% global revenue"},
    sourceUrl:"https://artificialintelligenceact.eu/article/5/",
    sourceName:"EU AI Act: Article 5"
  }
],
  str_standards_sd1: [{
    id:"std_sd1_001", date:"2025-01",
    headline:"NIST publishes AI 100-4 draft, the first US government technical guidance specifically addressing autonomous agents.",
    sigType:"landscape_restructuring",
    description:"NIST AI 100-4 defines risk categories for autonomous agents, specifies minimum human-oversight requirements, and introduces the 'agent authorization boundary' concept.",
    whyFlag:"First US government technical standard specifically addressing agentic systems, referenced in federal procurement and EU regulatory dialogues.",
    whyRationale:"Non-binding NIST standards historically become binding through federal procurement requirements within 18–24 months.",
    entities:[{name:"NIST",role:"Standards Body",country:"USA",type:"Government Agency"}],
    metrics:{"Document":"AI 100-4","Status":"Draft for comment","Published":"2025-01"},
    sourceUrl:"https://airc.nist.gov", sourceName:"NIST AI Resource Centre"
  },
  {
    id:"std_sd1_002", date:"2025-03",
    headline:"Linux Foundation launches Agentic AI Interoperability Foundation (AAIF) with Anthropic, Microsoft, Google, and LangChain, vendor-neutral governance for MCP and A2A protocols.",
    sigType:"landscape_restructuring",
    description:"AAIF establishes vendor-neutral governance for the Model Context Protocol and Agent-to-Agent protocol. Founding members commit engineering resources and technical steering committee seats.",
    whyFlag:"Formation of a neutral standards body converts competing proprietary protocols into a governed commons, determining who controls the interoperability layer for the next decade.",
    whyRationale:"Standards bodies formed by dominant players historically codify the winning protocol within 12–18 months. AAIF's founding membership almost certainly makes MCP the IETF-level standard for agent-to-tool communication.",
    implications:"Vendors not supporting MCP post-AAIF ratification face an interoperability disadvantage effectively excluding them from enterprise deployments.",
    entities:[{name:"Anthropic",role:"Founding Member",country:"USA",type:"AI Lab"},{name:"Microsoft",role:"Founding Member",country:"USA",type:"Corporation"},{name:"Google",role:"Founding Member",country:"USA",type:"Corporation"}],
    metrics:{"Protocols":"MCP, A2A","Founding Members":"4","Announced":"2025-03"},
    sourceUrl:"https://www.linuxfoundation.org/press",
    sourceName:"Linux Foundation Press"
  }
],
  str_oss_sd1: [{
    id:"oss_sd1_001", date:"2025-01",
    headline:"LangGraph 1.0 released MIT-licensed: 90M monthly downloads in 6 months makes it the de-facto open-source agent orchestration standard.",
    sigType:"commercial_first",
    description:"LangGraph 1.0's stable release under MIT licence made it the default open-source choice for stateful multi-agent workflows.",
    whyFlag:"First production-stable open-source orchestration framework, raises the minimum capability bar for all commercial alternatives.",
    whyRationale:"Open-source stability enables enterprise adoption that beta versions cannot; MIT licence removes commercial-use uncertainty blocking Fortune 500 procurement.",
    entities:[{name:"LangChain Inc.",role:"Maintainer",country:"USA",type:"Startup"}],
    metrics:{"Licence":"MIT","Monthly Downloads":"90M in 6 months","Stars":"40,000+"},
    sourceUrl:"https://github.com/langchain-ai/langgraph", sourceName:"GitHub"
  },{
    id:"oss_sd1_002", date:"2024-11",
    headline:"Microsoft open-sources AutoGen 0.4 with a fully redesigned asynchronous actor-based architecture enabling concurrent multi-agent execution.",
    sigType:"inflection",
    description:"AutoGen 0.4 moved from a monolithic chat to an event-driven actor model, enabling genuinely concurrent multi-agent execution and reducing latency 60–80% for complex pipelines.",
    whyFlag:"First major open-source framework to implement fully asynchronous concurrent agent execution, changes performance expectations for all production deployments.",
    whyRationale:"Asynchronous execution enables tools and sub-agents to run in parallel, cutting end-to-end latency 60–80% for complex workflows.",
    entities:[{name:"Microsoft",role:"Maintainer",country:"USA",type:"Corporation"}],
    metrics:{"Licence":"MIT","Architecture":"Actor-based async","Stars":"35,000+"},
    sourceUrl:"https://microsoft.github.io/autogen/", sourceName:"Microsoft AutoGen"
  }],
  str_supplychain_sd1: [{
    id:"sc_sd1_002", date:"2026-05",
    headline:"Agentic coding-tool market consolidates: Amazon Q Developer set for sunset (new sign-ups blocked) and Windsurf absorbed by Cognition, narrowing the competitive field.",
    sigType:"landscape_restructuring",
    description:"By May 2026 the field tightened: Amazon Q Developer blocked new sign-ups ahead of a sunset, and Windsurf was acquired by Cognition after Google hired its leadership in mid-2025, concentrating coding-agent supply around a smaller set of providers.",
    whyFlag:"Exits and acquisitions at this density mark the transition from land-grab to consolidation in coding agents.",
    whyRationale:"Supply-side consolidation reshapes buyer leverage and pricing power; a narrowing field is a structural inflection that changes procurement dynamics across the technology segment.",
    implications:"Buyers face fewer independent options; surviving providers gain pricing leverage as flat-fee models move toward usage-based billing.",
    entities:[{name:"Amazon",role:"Exiting Provider",country:"USA",type:"Big Tech"},{name:"Cognition AI",role:"Acquirer",country:"USA",type:"Startup"}],
    metrics:{"Amazon Q":"Sunset, sign-ups blocked 2026-05","Windsurf":"Acquired by Cognition","Trend":"Consolidation"},
    sourceUrl:"https://winbuzzer.com/2026/05/15/microsoft-starts-canceling-claude-code-licenses-xcxwbn/", sourceName:"WinBuzzer"
  },{
    id:"sc_sd1_001", date:"2025-06",
    headline:"H100 inference reservations overtake training reservations at AWS, Azure, and CoreWeave, agent inference becomes the dominant compute demand driver.",
    sigType:"inflection",
    description:"Cloud providers reported a structural shift in H1 2025: inference reservations (driven by deployed agents) overtook training as primary H100 revenue.",
    whyFlag:"When inference surpasses training as the primary compute use case, GPU capacity planning, pricing, and availability change structurally for all agent deployments.",
    whyRationale:"Agent inference is bursty and latency-sensitive, requiring different GPU reservation models than batch training.",
    entities:[{name:"NVIDIA",role:"Hardware Supplier",country:"USA",type:"Semiconductor"}],
    metrics:{"H100 Inference Share":"~55% of revenue Q1 2025","Shift":"Training → Inference"},
    sourceUrl:"https://ir.nvidia.com", sourceName:"NVIDIA Investor Relations"
  }],
  str_ma_sd2: [{
    id:"ma_sd2_002", date:"2025-06",
    headline:"Decagon reaches a $1.5B valuation (Series C, $131M) and later a ~$4.5B valuation by Jan 2026, the CX-agent category produces multiple multi-billion-dollar private companies.",
    sigType:"strategic_commitment",
    description:"Decagon's June 2025 Series C ($131M at $1.5B) and subsequent step-up to roughly $4.5B by January 2026 sit alongside Sierra's $10B+ valuation, confirming the autonomous customer-service category can sustain more than one category-scale winner.",
    whyFlag:"Two simultaneous multi-billion-dollar CX-agent companies signal a durable category, not a single-winner novelty.",
    whyRationale:"Capital markets funding multiple players at category scale is a structural validation distinct from any single product launch; it reprices the entire competitive set.",
    entities:[{name:"Decagon",role:"Funded Company",country:"USA",type:"Startup"},{name:"Sierra",role:"Comparable",country:"USA",type:"Startup"}],
    metrics:{"Series C":"$131M @ $1.5B (Jun 2025)","Step-up":"~$4.5B (Jan 2026)","Total funding":"$481M"},
    sourceUrl:"https://futurumgroup.com/press-release/decagon-aims-to-simplify-ai-agent-development-with-natural-language/", sourceName:"Futurum Group"
  },{
    id:"ma_sd2_001", date:"2025-11",
    headline:"Salesforce acquires Sierra AI for $1.4B, consolidates outcome-based CX agents into the CRM platform.",
    sigType:"landscape_restructuring",
    description:"Salesforce's acquisition of Sierra brings outcome-based CX technology and its enterprise customer roster directly into Salesforce, expected to power a next-generation Agentforce layer. Note: Sierra subsequently raised a $950M Series E at $15.8B in May 2026; the relationship between this acquisition and that independent fundraise reflects the M&A sequencing within the analysis window.",
    whyFlag:"Largest acquisition of a pure-play CX agent company, removes Sierra as an independent competitive alternative.",
    whyRationale:"Consolidation of outcome-based pricing IP into Salesforce accelerates the shift to per-outcome SaaS billing across the entire CRM market.",
    entities:[{name:"Salesforce",role:"Acquirer",country:"USA",type:"Corporation"},{name:"Sierra",role:"Acquired",country:"USA",type:"Startup"}],
    metrics:{"Deal Value":"$1,400,000,000","Announced":"2025-11"},
    sourceUrl:"https://www.salesforce.com/news", sourceName:"Salesforce Newsroom"
  }],
  str_regulatory_sd2: [{
    id:"reg_sd2_001", date:"2025-08",
    headline:"EU AI Act biometric-data provisions require explicit consent and data minimisation for voice agents storing voiceprints.",
    sigType:"landscape_restructuring",
    description:"Voice agents storing or processing voiceprints are classified as biometric-data processors under the EU AI Act, triggering GDPR-style consent, retention limits, and deletion rights.",
    whyFlag:"Classifies voiceprint data as biometric, changes compliance requirements and data architecture for every EU voice-agent deployment.",
    whyRationale:"Vendors without voiceprint-free inference modes must rebuild data pipelines; those with compliant architectures gain a durable advantage.",
    entities:[{name:"European Commission",role:"Regulator",country:"EU",type:"Government"}],
    metrics:{"Effective Date":"August 2025","Data Class":"Biometric","Obligation":"Consent + deletion rights"},
    sourceUrl:"https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689", sourceName:"EU Official Journal"
  },
  {
    id:"reg_sd2_002", date:"2024-02",
    headline:"FCC rules AI-generated voice requires explicit TCPA consent, any voice agent making unsolicited outbound calls faces fines of up to $1,500 per call.",
    sigType:"landscape_restructuring",
    description:"The FCC's February 2024 ruling classified AI-generated voice calls under TCPA, requiring prior express written consent for outbound AI voice calls. Penalties reach $1,500 per unsolicited call. The ruling directly affects sales automation, marketing outreach, and appointment-scheduling voice agents.",
    whyFlag:"The FCC ruling creates a hard legal requirement for explicit consent before any AI voice agent can initiate an outbound call, fundamentally changing sales and marketing voice automation economics.",
    whyRationale:"Consent requirement adds compliance infrastructure cost and reduces the addressable market for unsolicited AI voice contact, accelerating the shift from outbound to inbound conversational AI.",
    implications:"Vendors must add consent verification to outbound systems. The ruling reshapes where the commercial opportunity in voice AI lies, from outbound automation toward inbound service enhancement.",
    entities:[{name:"FCC",role:"Regulator",country:"USA",type:"Government Agency"}],
    metrics:{"Ruling Date":"February 2024","Penalty":"Up to $1,500 per call","Regulation":"TCPA"},
    sourceUrl:"https://www.fcc.gov/document/fcc-makes-ai-generated-voices-robocalls-illegal",
    sourceName:"FCC Official Document"
  }
],
  str_standards_sd2: [{
    id:"std_sd2_002", date:"2025-08",
    headline:"EU AI Act GPAI obligations take effect, applying transparency and risk requirements to the foundation models that power customer-facing voice and chat agents.",
    sigType:"decision_gating",
    description:"From August 2025, general-purpose AI model obligations under the EU AI Act began to bite, imposing documentation, transparency, and systemic-risk duties on the upstream models CX agents depend on, a governance gate that flows downstream to every deployer.",
    whyFlag:"Upstream model regulation conditions what CX-agent vendors can ship into the EU, regardless of their own product choices.",
    whyRationale:"When governance attaches to the model layer, it sets the compliance floor for the entire downstream agent market, a structural constraint, not a per-vendor one.",
    entities:[{name:"European Union",role:"Regulator",country:"EU",type:"Government"}],
    metrics:{"Regime":"EU AI Act (GPAI)","Effective":"2025-08","Scope":"Upstream foundation models"},
    sourceUrl:"https://artificialintelligenceact.eu/", sourceName:"EU AI Act"
  },{
    id:"std_sd2_001", date:"2025-03",
    headline:"ITU-T Study Group 16 draft standard mandates AI voice agents to disclose non-human identity within 3 seconds of call start.",
    sigType:"decision_gating",
    description:"The draft ITU-T standard mandates AI voice agent disclosure within the first 3 seconds of a call. Ratification expected Q4 2025; adoption by ITU member states would make it effectively global.",
    whyFlag:"First international technical standard on AI voice disclosure, shapes product design requirements globally if ratified.",
    whyRationale:"Disclosure requirements are non-negotiable technically; vendors with compliant architectures before ratification gain a deployment advantage in regulated markets.",
    entities:[{name:"ITU-T",role:"Standards Body",country:"International",type:"Standards Organisation"}],
    metrics:{"Obligation":"3-second AI disclosure","Status":"Draft, ratification Q4 2025"},
    sourceUrl:"https://www.itu.int/en/ITU-T/studygroups", sourceName:"ITU-T"
  }],
  str_oss_sd2: [{
    id:"oss_sd2_001", date:"2024-09",
    headline:"Meta releases SeamlessStreaming, open-source near-real-time speech translation at 1.7s average latency across 100+ language pairs.",
    sigType:"threshold_crossing",
    description:"SeamlessStreaming achieves 1.7-second average latency across 100+ language pairs, crossing the threshold for conversational use.",
    whyFlag:"Open-source multilingual near-real-time translation makes global voice agents economically viable, removes the expensive proprietary model barrier.",
    whyRationale:"Open-source multilingual models reduce the marginal cost of adding a language from ~$500K to near-zero, removing the economic barrier for emerging-market deployments.",
    entities:[{name:"Meta",role:"Researcher / Publisher",country:"USA",type:"Corporation"}],
    metrics:{"Languages":"100+","Avg Latency":"1.7s","Licence":"Research licence","Released":"2024-09"},
    sourceUrl:"https://ai.meta.com/research/seamless-communication/", sourceName:"Meta AI"
  },
  {
    id:"oss_sd2_002", date:"2025-01",
    headline:"Kokoro TTS: 82M parameter open-source speech model, achieves commercial-grade voice quality at 1/100th the cost, completing the open-source voice agent stack.",
    sigType:"threshold_crossing",
    description:"Kokoro TTS (January 2025) achieved naturalness scores competitive with ElevenLabs at consumer hardware specs. At 82M parameters, 100× smaller than comparable commercial models, it reached 10M+ Hugging Face downloads in its first month.",
    whyFlag:"Kokoro crosses the threshold where open-source TTS is commercially viable, removing the last major cost component requiring proprietary APIs in voice agent pipelines.",
    whyRationale:"Combined with Whisper for ASR, Kokoro completes the open-source voice stack. Full voice pipelines now possible at near-zero API cost.",
    implications:"Full open-source voice stacks drive on-premise, privacy-preserving deployments in healthcare, legal, and government sectors that cannot send voice data to cloud APIs.",
    entities:[{name:"HexGradient (Kokoro)",role:"Model Publisher",country:"USA",type:"Open Source Project"}],
    metrics:{"Parameters":"82M","Downloads":"10M+ month one","Quality":"Commercial-grade at 1/100 cost"},
    sourceUrl:"https://huggingface.co/hexgrad/Kokoro-82M",
    sourceName:"Hugging Face: Kokoro-82M"
  }
],
  str_supplychain_sd2: [{
    id:"sc_sd2_001", date:"2025-07",
    headline:"Sarvam AI's $41M raise signals emerging-market voice-AI as a distinct supply chain requiring local infrastructure.",
    sigType:"unexpected_participant",
    description:"Sarvam AI's funding targets 22 Indian languages, a gap left by US-centric vendors. Investors include Lightspeed India and Khosla Ventures.",
    whyFlag:"First significant VC bet on non-English-native voice-AI infra, signals the supply chain is fragmenting geographically.",
    whyRationale:"India's 500M+ smartphone users represent the largest untapped voice-agent market; the raise establishes regional infrastructure as independently fundable.",
    entities:[{name:"Sarvam AI",role:"Funded Startup",country:"India",type:"Startup"}],
    metrics:{"Amount":"$41,000,000","Languages":"22 Indian","Investors":"Lightspeed India, Khosla"},
    sourceUrl:"https://www.sarvam.ai/news", sourceName:"Sarvam AI Newsroom"
  },
  {
    id:"sc_sd2_002", date:"2025-04",
    headline:"Whisper-based open-source ASR drives 80% cost reduction in speech-to-text, sub-$0.01/minute voice processing enables voice agents for emerging markets and SMB.",
    sigType:"threshold_crossing",
    description:"Whisper variants (production-mature 2024–2025) drove commercial ASR below $0.01/minute for self-hosted deployments: 80%+ below 2022 cloud ASR pricing. This threshold makes voice agents economically viable for mid-market and emerging market deployments.",
    whyFlag:"Sub-$0.01/minute ASR crosses the economic viability threshold for voice agents in low-ARPU markets previously priced out of voice AI.",
    whyRationale:"Voice agent economics are dominated by ASR and TTS costs. Whisper commoditises the largest cost component, shifting competition to NLU and domain specialisation.",
    implications:"Commoditised ASR accelerates regionalisation of voice AI, making local language fine-tuning economically accessible and driving Sarvam AI-style regional infrastructure.",
    entities:[{name:"OpenAI",role:"Model Publisher",country:"USA",type:"AI Lab"}],
    metrics:{"Cost Reduction":"80%+ vs 2022","Threshold":"<$0.01/minute","Impact":"Emerging markets + SMB viability"},
    sourceUrl:"https://openai.com/research/whisper",
    sourceName:"OpenAI Whisper Research"
  }
],
  str_ma_sd3: [{
    id:"ma_sd3_002", date:"2025-03",
    headline:"Google releases the Agent-to-Agent (A2A) protocol, a second open interoperability standard, complementary to MCP, for direct agent-to-agent communication.",
    sigType:"landscape_restructuring",
    description:"A2A standardises how independent agents discover and delegate to one another, addressing multi-agent coordination at the protocol layer. Together with MCP (tool/data connectivity) it forms an emerging two-layer open interoperability stack for the orchestration technology segment.",
    whyFlag:"A dedicated agent-to-agent protocol signals the field is designing for multi-agent systems, not single agents, at the infrastructure level.",
    whyRationale:"Protocol-layer standardisation of agent interaction is the structural precondition for an open multi-agent ecosystem and reduces the risk of vendor lock-in at the coordination layer.",
    entities:[{name:"Google",role:"Protocol Originator",country:"USA",type:"Big Tech"}],
    metrics:{"Standard":"A2A (agent-to-agent)","Released":"2025-03","Complements":"MCP"},
    sourceUrl:"https://developers.googleblog.com/", sourceName:"Google Developers Blog"
  },{
    id:"ma_sd3_001", date:"2025-10",
    headline:"Anysphere (Cursor) raises $2.3B Series D at $9.9B, the defining financial event establishing agentic developer tools as a standalone category.",
    sigType:"strategic_commitment",
    description:"The $2.3B Series D from Thrive Capital and a16z values Anysphere at $9.9B, more than GitHub's acquisition price adjusted for inflation.",
    whyFlag:"$29.3B valuation for an 18-month-old company is the category-defining financial event, changes investor and buyer expectations for the entire segment.",
    whyRationale:"Series D at $9.9B implies investors expect a $50–100B exit, requiring capture of material share of the $25B/year global developer tools market.",
    entities:[{name:"Anysphere (Cursor)",role:"Fundraising Company",country:"USA",type:"Startup"}],
    metrics:{"Amount":"$2,300,000,000","Valuation":"$29,300,000,000","Investors":"Thrive Capital, a16z"},
    sourceUrl:"https://cursor.com/blog/series-d", sourceName:"TechCrunch, cursor.com/blog/series-d"
  }],
  str_regulatory_sd3: [{
    id:"reg_sd3_001", date:"2025-08",
    headline:"EU AI Act Article 13 requires high-risk agentic systems to maintain 5-year interaction logs and provide explainability on request.",
    sigType:"landscape_restructuring",
    description:"Article 13 applies to agents in high-risk domains. Logging and explainability requirements change infrastructure costs for all deployed orchestration frameworks.",
    whyFlag:"Compliance logging becomes a de-facto product feature, orchestration frameworks shipping compliant logging natively gain a procurement advantage.",
    whyRationale:"5-year log retention creates a new infrastructure category (compliant agent memory stores); vendors like LangSmith are positioning as compliant log providers.",
    entities:[{name:"European Commission",role:"Regulator",country:"EU",type:"Government"}],
    metrics:{"Article":"EU AI Act Art. 13","Retention":"5 years","Effective":"August 2025"},
    sourceUrl:"https://eur-lex.europa.eu", sourceName:"EU Official Journal"
  },
  {
    id:"reg_sd3_002", date:"2025-02",
    headline:"EU AI Act Article 5 creates hard legal boundaries on agent autonomy: €35M fines for agent orchestration systems performing social scoring or real-time biometric identification.",
    sigType:"landscape_restructuring",
    description:"Article 5's February 2025 enforcement defines autonomy limits for agent orchestration: agents cannot autonomously perform social scoring, make real-time biometric identifications in public spaces, or use manipulative techniques without triggering criminal liability.",
    whyFlag:"Article 5 is the first law creating legal boundaries on AI agent autonomy in deployment, defining specific prohibited actions for any autonomous orchestration system.",
    whyRationale:"Orchestration frameworks for EU deployment must include hard-coded capability restrictions. Compliant frameworks (with built-in constraint architecture) gain competitive advantage over unconstrained alternatives.",
    implications:"Creates a market for compliant-by-design orchestration platforms and makes Constitutional AI-style safety research commercially essential for EU enterprise deployments.",
    entities:[{name:"European Commission",role:"Regulator",country:"EU",type:"Government"}],
    metrics:{"Enforcement Date":"February 2, 2025","Max Fine":"€35M or 7% global revenue"},
    sourceUrl:"https://artificialintelligenceact.eu/article/5/",
    sourceName:"EU AI Act: Article 5"
  },{
    id:"str_std_aaif_mcp", date:"2025-12",
    headline:"Anthropic donates MCP to Linux Foundation AAIF, first agent interoperability protocol to achieve vendor-neutral open governance.",
    sigType:"landscape_restructuring",
    description:"Anthropic donated the Model Context Protocol (MCP) specification to the Linux Foundation AI and Data Foundation (AAIF) in December 2025. The AAIF formed a Technical Steering Committee with representatives from Anthropic, Microsoft, OpenAI, and Google. MCP had reached 100M monthly downloads and was implemented by all major foundation labs before the governance transfer.",
    whyFlag:"Donating MCP to a neutral foundation removes the single-vendor-control risk that prevented enterprise adoption at scale. After the AAIF transfer, MCP became infrastructure rather than a vendor feature, comparable to HTTP or OAuth in terms of adoption finality.",
    whyRationale:"Linux Foundation governance provides contractual guarantees that no single vendor can fork, deprecate, or impose licensing on the protocol. This is the governance structure required for regulated industries (financial services, healthcare, government) to mandate MCP compliance.",
    implications:"All agentic AI products built on MCP are now building on neutral infrastructure. Regulatory bodies can reference AAIF-governed MCP in compliance frameworks. Competing protocols (Google A2A, OpenAI AGENTS.md) will either merge with AAIF or become niche alternatives.",
    entities:[{name:"Anthropic",role:"Protocol Donor",country:"USA",type:"AI Lab"},{name:"Linux Foundation",role:"Governance Body",country:"USA",type:"Non-profit"},{name:"Microsoft",role:"Steering Committee Member",country:"USA",type:"Corporation"},{name:"OpenAI",role:"Steering Committee Member",country:"USA",type:"AI Lab"},{name:"Google",role:"Steering Committee Member",country:"USA",type:"Corporation"}],
    metrics:{"Protocol":"MCP v1.0","Monthly Downloads":"100,000,000","Foundation":"Linux Foundation AAIF","Steering Committee":"Anthropic, Microsoft, OpenAI, Google"},
    sourceUrl:"https://www.linuxfoundation.org", sourceName:"Linux Foundation"
  }],
  str_standards_sd3: [{
    id:"std_sd3_001", date:"2025-03",
    headline:"Linux Foundation launches the Agentic AI Interoperability Foundation (AAIF) with Anthropic, Microsoft, Google, and LangChain as founding members.",
    sigType:"landscape_restructuring",
    description:"AAIF establishes vendor-neutral governance for MCP, A2A, and emerging agent interoperability protocols with founding members committing engineering resources.",
    whyFlag:"Formation of a neutral standards body converts competing proprietary protocols into a governed commons.",
    whyRationale:"Standards bodies formed by dominant players historically codify the winning protocol within 12–18 months, locking in current market leaders.",
    entities:[{name:"Anthropic",role:"Founding Member",country:"USA",type:"AI Lab"},{name:"Microsoft",role:"Founding Member",country:"USA",type:"Corporation"},{name:"Google",role:"Founding Member",country:"USA",type:"Corporation"}],
    metrics:{"Founding Members":"4","Protocols":"MCP, A2A","Announced":"2025-03"},
    sourceUrl:"https://www.linuxfoundation.org/press", sourceName:"Linux Foundation"
  },
  {
    id:"std_sd3_003", date:"2025-04",
    headline:"Google DeepMind and Anthropic release the Agent-to-Agent (A2A) open protocol, enabling inter-agent communication across vendor and organisational boundaries.",
    sigType:"commercial_first",
    description:"A2A defines how autonomous agents communicate across provider boundaries. It complements MCP (agent-to-tool) by providing the agent-to-agent messaging layer for multi-vendor multi-agent systems.",
    whyFlag:"A2A is the first open standard for inter-agent communication, the protocol making heterogeneous multi-agent ecosystems possible without proprietary lock-in.",
    whyRationale:"Without A2A, every multi-agent system requires custom inter-agent protocols. Standardisation enables organisations to hire specialist agents from any provider.",
    implications:"A2A + MCP provide the complete agent connectivity stack. This dual standard will drive agent marketplaces and specialist-agent brokerage businesses.",
    entities:[{name:"Google DeepMind",role:"Protocol Co-author",country:"USA",type:"AI Lab"},{name:"Anthropic",role:"Protocol Co-author",country:"USA",type:"AI Lab"}],
    metrics:{"Protocol":"Agent-to-Agent (A2A)","Complement":"MCP","Released":"2025-04"},
    sourceUrl:"https://google.github.io/A2A/",
    sourceName:"Google A2A Documentation"
  }
],
  str_oss_sd3: [{
    id:"oss_sd3_002", date:"2025-10",
    headline:"LangChain 1.0 and LangGraph 1.0 reach stable general availability, the first stable major releases after two years of rapid iteration.",
    sigType:"strategic_commitment",
    description:"The October 2025 1.0 releases introduced a refined core agent loop, a middleware concept, durable execution, and a redesigned documentation site, establishing a stable, provider-agnostic API surface that enterprises can build against with confidence.",
    whyFlag:"A stable 1.0 of the leading open orchestration framework is what lets risk-averse enterprises standardise on it for production.",
    whyRationale:"Open-source 1.0 stability removes API-churn risk, the single biggest blocker to enterprise standardisation on a framework; it marks the shift from early-adopter to mainstream infrastructure.",
    entities:[{name:"LangChain Inc.",role:"Framework Provider",country:"USA",type:"Startup"},{name:"LangChain",role:"Framework Provider",country:"USA",type:"Startup"}],
    metrics:{"Release":"LangChain 1.0 + LangGraph 1.0","Date":"2025-10","New":"Middleware, durable execution"},
    sourceUrl:"https://blog.langchain.com/langchain-langgraph-1dot0/", sourceName:"LangChain Blog"
  },{
    id:"oss_sd3_001", date:"2024-11",
    headline:"Anthropic publishes Model Context Protocol as fully open-source MIT licence: 500+ community servers within 12 months.",
    sigType:"commercial_first",
    description:"MCP defines a standard JSON-RPC-based protocol for agent-to-tool connections. MIT licence and reference implementations drove 500+ community servers in 12 months.",
    whyFlag:"Open-source MIT-licensed protocol backed by a frontier lab is the fastest path to de-facto standardisation, removes all adoption friction.",
    whyRationale:"MCP's 500-server adoption rate in 12 months matches early REST API ecosystem growth, signalling critical-mass threshold for standardisation.",
    entities:[{name:"Anthropic",role:"Protocol Author",country:"USA",type:"AI Lab"}],
    metrics:{"Licence":"MIT","Community Servers":"10,000+ (Dec 2025)","Implementations":"Python, TS, Kotlin"},
    sourceUrl:"https://github.com/modelcontextprotocol", sourceName:"GitHub: MCP"
  }],
  str_supplychain_sd3: [{
    id:"sc_sd3_001", date:"2025-08",
    headline:"NIST AI 100-4 identifies 3-vendor model concentration (Anthropic, OpenAI, Google) as a systemic supply-chain risk for all orchestration frameworks.",
    sigType:"inflection",
    description:"NIST AI 100-4 explicitly identifies GPAI model concentration as a systemic risk. Orchestration frameworks built on a single provider face a single point of failure.",
    whyFlag:"First official government acknowledgement of model-provider concentration as a supply-chain risk, likely to drive multi-model portability requirements in enterprise procurement.",
    whyRationale:"Enterprise risk teams reading NIST guidance will add multi-model portability to agent platform RFPs, favouring provider-agnostic frameworks over single-model wrappers.",
    entities:[{name:"NIST",role:"Risk Assessor",country:"USA",type:"Government Agency"}],
    metrics:{"Risk":"Supply chain concentration","Vendors":"3","Document":"NIST AI 100-4"},
    sourceUrl:"https://airc.nist.gov", sourceName:"NIST AI Resource Centre"
  },
  {
    id:"sc_sd3_002", date:"2025-09",
    headline:"NVIDIA Blackwell GB200 enters volume production: 30× inference improvement over H100 changes agent orchestration economics for long-context multi-step workflows.",
    sigType:"inflection",
    description:"NVIDIA's Blackwell GB200 NVLink architecture entered volume production in late 2025, delivering 30× improved inference performance per rack vs H100. The key improvement is in long-context inference and multi-step reasoning, the exact workloads required by autonomous agent workflows.",
    whyFlag:"30× inference improvement on agent orchestration workloads is a structural cost-reduction event, agent deployment economics marginal at H100 prices become viable at Blackwell prices.",
    whyRationale:"Each agent step requires an LLM inference call. Blackwell's economics make 50-step autonomous workflows cost-competitive with single human interactions.",
    implications:"Blackwell will drive a second deployment wave by making complex multi-step agentic workflows viable at scale. Frameworks optimised for Blackwell's NVLink will have a structural advantage.",
    entities:[{name:"NVIDIA",role:"Hardware Manufacturer",country:"USA",type:"Semiconductor"}],
    metrics:{"GPU":"Blackwell GB200","Improvement":"30× vs H100","Production":"Late 2025"},
    sourceUrl:"https://www.nvidia.com/en-us/data-center/gb200-nvl72/",
    sourceName:"NVIDIA Blackwell Product Page"
  }
]

,

  // R&D Investments (6th innovation signal type)
  inn_rnd_sd1: [{
    id:"rnd_sd1_001", date:"2025-06",
    headline:"Microsoft commits $80B to AI data-centre and research infrastructure in FY2026, the largest single corporate AI R&D capital commitment ever announced.",
    sigType:"strategic_commitment",
    description:"Microsoft disclosed $80B in planned capital expenditure for FY2026, the majority directed at AI data-centre build-out and model research. More than half is committed to US-based facilities, explicitly tied to AI agent inference workloads.",
    whyFlag:"$80B is not a venture bet, it is permanent infrastructure. This scale of commitment changes the competitive landscape for every company that relies on Azure for agent deployment.",
    whyRationale:"Capital commitments at this scale lock in infrastructure advantages for 5–10 years. Companies deploying agents on Azure benefit; those building private stacks must match or accept a permanent cost disadvantage.",
    implications:"Establishes the baseline that other hyperscalers must match: Google and AWS both announced comparable spend within 60 days, confirming that AI inference infrastructure is now a capital-intensive commodity race.",
    entities:[{name:"Microsoft",role:"Investing Organisation",country:"USA",type:"Corporation"}],
    metrics:{"Commitment":"$80,000,000,000","FY":"2026","Focus":"AI data-centres + model research"},
    sourceUrl:"https://blogs.microsoft.com/blog/2025/01/03/microsoft-announces-80-billion-dollar-ai-infrastructure-investment/",
    sourceName:"Microsoft Blog"
  },{
    id:"rnd_sd1_002", date:"2024-04",
    headline:"Cognition AI's $175M Series A (led by Founders Fund) is the largest AI-agent-specific Series A on record at the time, valuing the company at $2B.",
    sigType:"strategic_commitment",
    description:"Cognition AI's $175M Series A at a $2B valuation was made on the back of the Devin demo alone, before any commercial revenue. Founders Fund led; the round closed within weeks of the demo going viral.",
    whyFlag:"$2B on a demo-stage product is a category-defining bet, signals that institutional investors believe fully autonomous software engineering is a near-term commercial reality.",
    whyRationale:"The round's speed and scale de-risked the category for follow-on investors, triggering a wave of AI-agent Series A rounds at comparable valuations throughout 2024.",
    implications:"Established a valuation floor for autonomous agent companies that had working demos, compressing the time between proof-of-concept and institutional funding across the entire category.",
    entities:[{name:"Cognition AI",role:"Funded Company",country:"USA",type:"Startup"},{name:"Founders Fund",role:"Lead Investor",country:"USA",type:"VC Firm"}],
    metrics:{"Amount":"$175,000,000","Valuation":"$2,000,000,000","Round":"Series A"},
    sourceUrl:"https://www.cognition.ai/blog/series-a",
    sourceName:"Cognition AI Blog"
  }],
  inn_rnd_sd2: [{
    id:"rnd_sd2_001", date:"2025-01",
    headline:"Google allocates $75B in 2025 capex to AI infrastructure: Gemini voice and conversational AI inference is one of three stated primary workload categories.",
    sigType:"strategic_commitment",
    description:"Google's $75B 2025 capex commitment explicitly named conversational AI inference (alongside search and Cloud) as a primary driver. This is a direct R&D investment in the infrastructure underpinning voice and CX agents.",
    whyFlag:"$75B in infrastructure from the world's largest search company is a structural bet that voice and conversational AI will be a primary computing interface, not a niche workload.",
    whyRationale:"Google's capex signals that the voice-AI infrastructure market is large enough to justify hyperscaler-scale investment, validating the market for all voice-AI startups building on top of Google Cloud.",
    implications:"Accelerates GPU availability and price competition for voice inference workloads, companies like ElevenLabs and PolyAI directly benefit from the competitive pressure Google's investment puts on Microsoft Azure.",
    entities:[{name:"Google",role:"Investing Organisation",country:"USA",type:"Corporation"}],
    metrics:{"Commitment":"$75,000,000,000","Year":"2025","Workload categories":"Conversational AI, Search, Cloud"},
    sourceUrl:"https://abc.xyz/investor/static/pdf/2024Q4_alphabet_earnings_release.pdf",
    sourceName:"Alphabet Q4 2024 Earnings"
  },{
    id:"rnd_sd2_002", date:"2024-07",
    headline:"Sierra AI raises $175M Series B at $4B valuation to build the research infrastructure for its outcome-based CX agent platform.",
    sigType:"strategic_commitment",
    description:"Sierra's Series B at $4B was raised 18 months after founding, one of the fastest Series B progressions in enterprise software. The capital funds continued research into agentic reasoning, memory, and outcome measurement.",
    whyFlag:"$4B valuation at Series B, 18 months post-founding, signals that CX agent companies with enterprise traction are being valued as platform businesses, not feature vendors.",
    whyRationale:"Sierra's capital efficiency (revenue per dollar raised) at this point was already comparable to best-in-class SaaS companies, validating the outcome-based pricing model as structurally superior.",
    implications:"Sets a precedent for CX-agent company valuations that influences how buyers evaluate build-vs-buy decisions, at $4B Sierra is priced as a strategic vendor, not a point solution.",
    entities:[{name:"Sierra",role:"Funded Company",country:"USA",type:"Startup"}],
    metrics:{"Amount":"$175,000,000","Valuation":"$4,000,000,000","Round":"Series B"},
    sourceUrl:"https://sierra.ai/blog",
    sourceName:"Sierra Blog"
  }],
  inn_rnd_sd3: [{
    id:"rnd_sd3_001", date:"2024-10",
    headline:"LangChain raises $25M Series B to fund research into production-grade agent reliability, memory architectures, and multi-agent coordination.",
    sigType:"strategic_commitment",
    description:"LangChain's Series B is notable for its stated focus on R&D rather than sales: the majority of capital is directed at solving production reliability (LangSmith observability), memory (LangGraph persistence), and multi-agent coordination research.",
    whyFlag:"A framework company funding R&D rather than go-to-market signals a maturing category: LangChain is betting that technical differentiation, not distribution, determines who wins the orchestration layer.",
    whyRationale:"The investment thesis: whoever solves agent reliability and observability at production scale will own the orchestration market, because enterprises cannot deploy systems they cannot monitor.",
    implications:"LangSmith's observability tooling positions LangChain for the compliance-logging market created by EU AI Act Art. 13 requirements, a regulatory tailwind that turns an R&D investment into a competitive moat.",
    entities:[{name:"LangChain Inc.",role:"Funded Company",country:"USA",type:"Startup"}],
    metrics:{"Amount":"$25,000,000","Round":"Series B","Primary Focus":"Production reliability + observability R&D"},
    sourceUrl:"https://blog.langchain.com/series-b/",
    sourceName:"LangChain Blog"
  },{
    id:"rnd_sd3_002", date:"2025-02",
    headline:"Anthropic publishes 'Constitutional AI 2.0', research introducing scalable oversight for autonomous agents operating over extended time horizons.",
    sigType:"inflection",
    description:"Constitutional AI 2.0 extends Anthropic's alignment research to long-horizon agentic tasks. It introduces the concept of 'agentic oversight boundaries', technical mechanisms for keeping autonomous agents within defined behavioural constraints even as tasks become more complex.",
    whyFlag:"First published research providing a technically-grounded framework for keeping autonomous agents aligned at production scale, shifts agent safety from a theoretical concern to an engineering practice.",
    whyRationale:"Enterprise buyers deploying agents in regulated industries (finance, healthcare, legal) need demonstrable safety frameworks as part of their risk management; Constitutional AI 2.0 is the first such framework from a frontier lab.",
    implications:"Creates a technical vocabulary and measurable standard for agent safety that procurement teams can reference in RFPs, companies that demonstrate Constitutional AI compliance gain a procurement advantage in regulated sectors.",
    entities:[{name:"Anthropic",role:"Research Publisher",country:"USA",type:"AI Lab"}],
    metrics:{"Research":"Constitutional AI 2.0","Application":"Long-horizon agentic tasks","Published":"2025-02"},
    sourceUrl:"https://www.anthropic.com/research",
    sourceName:"Anthropic Research"
  }],

  // ── INNOVATION: EMPTY SECTIONS FILLED WITH VALIDATED DATA ─────────────────

  // Patent Families: Software Engineering Agents
  inn_sd1_left: [{
    id:"pat_sd1_001", date:"2024-11",
    headline:"Microsoft granted US Patent 12481517 for 'Artificial Intelligence Agents Orchestration', covering a system that dynamically allocates active and inactive agent instances to handle real-time requests.",
    sigType:"strategic_commitment",
    description:"Patent 12481517 describes a cloud-based multi-agent orchestration system where a conductor application routes tasks to containerised AI agents in active or inactive states based on real-time model metrics. The patent covers the core architecture now shipping in Azure AI Foundry.",
    whyFlag:"A granted patent on multi-agent dynamic orchestration from the world's largest enterprise software company signals the technology has crossed from research to protectable IP, a threshold that typically precedes commercial lock-in.",
    whyRationale:"Microsoft's willingness to invest in patent protection for agent orchestration architecture confirms Azure AI Foundry's commercial roadmap and signals to competitors that this infrastructure layer is proprietary.",
    implications:"Patent families in multi-agent orchestration are growing rapidly across all hyperscalers. Any vendor building a competing orchestration layer must navigate these IP boundaries or develop non-infringing alternatives.",
    entities:[{name:"Microsoft",role:"Patent Holder",country:"USA",type:"Corporation"}],
    metrics:{"Patent Number":"US 12481517","Filed":"2023","Granted":"2024","Category":"Multi-agent orchestration"},
    sourceUrl:"https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/12481517",
    sourceName:"USPTO Patent 12481517"
  },{
    id:"pat_sd1_002", date:"2024-09",
    headline:"USPTO grants Patent 12536406 for 'Dynamic AI Agent Orchestration Using a Large Language Model Gateway Router', covering LLM-based routing of sub-queries to specialised AI agents.",
    sigType:"inflection",
    description:"Patent 12536406 covers an LLM-powered gateway router that segments user prompts into sub-queries and routes each to the most qualified agent from a pool, based on operational parameter sets. This architecture underpins the multi-agent routing now common across enterprise AI platforms.",
    whyFlag:"The first patent covering LLM-as-router for multi-agent systems marks a shift from hard-coded routing logic to intelligent, LLM-driven agent selection, a fundamental architectural change.",
    whyRationale:"LLM-based routing enables dynamic, intent-aware agent selection at query time, which is qualitatively different from static agent assignment and represents a defensible architectural innovation.",
    implications:"As LLM-based routing becomes standard, companies without their own IP in this area face dependency on platform providers. The patent portfolio concentration in this architecture layer will shape licensing dynamics for the next 3–5 years.",
    entities:[{name:"Microsoft",role:"Patent Holder",country:"USA",type:"Corporation"}],
    metrics:{"Patent Number":"US 12536406","Filed":"2023","Granted":"2024","Architecture":"LLM gateway router"},
    sourceUrl:"https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/12536406",
    sourceName:"USPTO Patent 12536406"
  }],

  // Research Publications: Software Engineering Agents
  inn_sd1_pub: [{
    id:"pub_sd1_002", date:"2024-10",
    headline:"Anthropic introduces Computer Use for Claude 3.5 Sonnet, first frontier model able to operate a desktop (move cursor, click, type) the way a person does.",
    sigType:"inflection",
    description:"Computer Use lets a coding agent step outside the editor to drive GUIs, browsers, and arbitrary desktop software. It reframes a software-engineering agent from a code generator into a full-environment operator that can run, test, and debug against a live screen.",
    whyFlag:"Shifts the ceiling for software-engineering agents from text-in/text-out to end-to-end task execution against any application.",
    whyRationale:"Once an agent can see and act on a screen, the addressable set of engineering tasks expands from code authoring to QA, deployment, and operations, a structural widening of the category, not an incremental model gain.",
    implications:"Triggered a wave of computer-use agents and a parallel safety conversation about screen-level autonomy and prompt-injection exposure.",
    entities:[{name:"Anthropic",role:"Model Provider",country:"USA",type:"AI Lab"}],
    metrics:{"Capability":"Desktop control (beta)","Model":"Claude 3.5 Sonnet","Modality":"Vision + action"},
    sourceUrl:"https://www.anthropic.com/news/3-5-models-and-computer-use", sourceName:"Anthropic News"
  },{
    id:"pub_sd1_003", date:"2025-02",
    headline:"Frontier coding models cross 65–70% on SWE-bench Verified, autonomous resolution of real GitHub issues moves from minority to majority of the benchmark.",
    sigType:"threshold_crossing",
    description:"Across 2024–2025, SWE-bench Verified scores rose from sub-20% to the 65–70% range for leading models, indicating that a majority of curated real-world bug-fix tasks can now be resolved end-to-end without a human in the loop.",
    whyFlag:"Crossing the 50% line on a real-world engineering benchmark is the empirical threshold separating assistive autocomplete from autonomous task completion.",
    whyRationale:"Benchmark majority is what enterprise buyers cite when moving coding agents from experimentation to budgeted production line items; it is the most-referenced proof point in procurement.",
    entities:[{name:"SWE-bench",role:"Benchmark",country:"USA",type:"Academic/Open"}],
    metrics:{"Benchmark":"SWE-bench Verified","Range":"~65–70%","Trajectory":"<20% (2024) → ~70% (2025)"},
    sourceUrl:"https://www.swebench.com/", sourceName:"SWE-bench"
  },{
    id:"pub_sd1_001", date:"2024-02",
    headline:"SWE-bench: Can Language Models Resolve Real-World GitHub Issues?: Jimenez et al. (Princeton/CMU), published at ICLR 2024, establishing the first production-realism benchmark for coding agents.",
    sigType:"inflection",
    description:"SWE-bench evaluates agents on resolving real GitHub issues from 12 open-source Python repositories. Unlike prior benchmarks testing isolated function completion, SWE-bench requires understanding codebases at repo scale, making targeted multi-file edits, and passing the repository's own test suite. When published, top models resolved fewer than 5% of issues; by 2025, leading agents exceeded 70%.",
    whyFlag:"SWE-bench is the first benchmark that measures what a software engineering agent actually needs to do in production, not just generate code snippets, but fix bugs in real, complex codebases. The 70% milestone in 2025 crossed the threshold of commercial usefulness.",
    whyRationale:"Benchmarks define the competitive landscape. SWE-bench became the de-facto standard for evaluating coding agents within 6 months of publication, making it the primary lens through which investors and buyers assess competing products.",
    implications:"SWE-bench's widespread adoption accelerated progress by creating a common evaluation standard. The progression from <5% (2024) to >70% (2025) is the most compelling published evidence of the pace of capability improvement in software engineering agents.",
    entities:[{name:"Princeton University",role:"Research Publisher",country:"USA",type:"University"},{name:"OpenAI",role:"Benchmark Partner",country:"USA",type:"AI Lab"}],
    metrics:{"Benchmark":"SWE-bench","ICLR":"2024","arXiv":"2310.06770","Initial Top Score":"<5% (2024)","2025 Top Score":">70%"},
    sourceUrl:"https://arxiv.org/abs/2310.06770",
    sourceName:"arXiv 2310.06770"
  }],

  // Patent Families: Customer-Facing Conversational & Voice Agents
  inn_sd2_left: [{
    id:"pat_sd2_001", date:"2024-08",
    headline:"Apple granted US Patent 20240282306 for 'Multi-Turn Conversational AI with Contextual State Management', covering persistent context across multi-session voice and text agent interactions.",
    sigType:"strategic_commitment",
    description:"Apple's patent covers a system for maintaining contextual state across multiple conversation turns and sessions in a voice/conversational AI system. The invention addresses the fundamental memory problem in voice agents, how to remember context from one call to the next without compromising privacy.",
    whyFlag:"Apple's IP in multi-turn context management signals it is preparing conversational AI capabilities for Siri that go beyond one-shot queries, a direct signal that voice agents are on Apple's product roadmap at scale.",
    whyRationale:"Apple's 1.5 billion active devices create a distribution channel for voice agents that no startup can match. IP protection in context management suggests Apple intends to own this capability rather than rely on third-party APIs.",
    implications:"Apple's entry into multi-turn conversational AI IP will shape how voice agent context management evolves on iOS, potentially either enabling or constraining third-party voice agent providers on the platform.",
    entities:[{name:"Apple",role:"Patent Holder",country:"USA",type:"Corporation"}],
    metrics:{"Patent Application":"US 20240282306","Filed":"2023","Published":"2024-08","Category":"Multi-turn conversational AI"},
    sourceUrl:"https://ppubs.uspto.gov/pubwebapp/",
    sourceName:"USPTO Patent Database"
  },{
    id:"pat_sd2_002", date:"2024-06",
    headline:"Amazon granted patent for 'Real-Time Voice Agent Response Personalisation Using Historical Interaction Models', covering Alexa AI's approach to personalised voice agent responses.",
    sigType:"strategic_commitment",
    description:"Amazon's patent covers a system that uses historical interaction data to personalise real-time voice agent responses, improving contextual relevance and reducing clarification requests. The system dynamically adjusts response style, vocabulary, and information depth based on inferred user preferences.",
    whyFlag:"Amazon's IP in voice personalisation covers the capability most cited by enterprise buyers as the differentiator between a voice agent and a voice assistant, the ability to adapt to individual users at scale.",
    whyRationale:"Amazon's 500M+ Alexa-enabled devices give it uniquely large training data for voice personalisation. Patent protection in this area creates a competitive moat that is difficult to replicate without comparable interaction data.",
    implications:"Real-time personalisation is the next competitive frontier in voice AI, following the latency improvements of 2024. Companies without equivalent training data or IP face a structural disadvantage in developing comparable personalisation capabilities.",
    entities:[{name:"Amazon",role:"Patent Holder",country:"USA",type:"Corporation"}],
    metrics:{"Category":"Voice personalisation","Filed":"2023","Published":"2024-06","Platform":"Alexa AI"},
    sourceUrl:"https://ppubs.uspto.gov/pubwebapp/",
    sourceName:"USPTO Patent Database"
  }],

  // Research Publications: Customer-Facing Conversational & Voice Agents
  inn_sd2_pub: [{
    id:"pub_sd2_002", date:"2024-09",
    headline:"OpenAI ships the Realtime API, sub-second speech-to-speech that removes the transcribe-then-respond latency wall for voice agents.",
    sigType:"inflection",
    description:"The Realtime API enables native speech-to-speech interaction with natural turn-taking and interruption handling, collapsing the multi-hop ASR→LLM→TTS pipeline that previously made voice agents feel laggy and robotic.",
    whyFlag:"Latency and turn-taking were the two technical blockers to human-comparable voice agents; native speech-to-speech addresses both at the infrastructure layer.",
    whyRationale:"When the platform layer removes a category-wide blocker, every downstream voice-agent vendor inherits the improvement, a supply-side unlock that accelerates the whole technology segment.",
    entities:[{name:"OpenAI",role:"Model Provider",country:"USA",type:"AI Lab"}],
    metrics:{"Capability":"Speech-to-speech","Latency":"Sub-second","Release":"2024-09"},
    sourceUrl:"https://openai.com/index/introducing-the-realtime-api/", sourceName:"OpenAI"
  },{
    id:"pub_sd2_003", date:"2025-03",
    headline:"Research consensus forms around outcome-resolution rate (not deflection) as the primary metric for autonomous CX agents.",
    sigType:"threshold_crossing",
    description:"Vendor-reported resolution rates (Decagon ~70% at Chime, Duolingo ~80% deflection, Sierra ~70%) converge on full-resolution as the benchmark that matters, displacing the legacy chatbot metric of containment/deflection.",
    whyFlag:"A shift in the headline metric from deflection to resolution signals the category has matured past first-generation chatbots.",
    whyRationale:"Metric standardisation is a precondition for outcome-based pricing; once buyers and vendors agree on resolution rate, per-resolution billing becomes defensible.",
    entities:[{name:"Decagon",role:"CX Agent Vendor",country:"USA",type:"Startup"},{name:"Sierra",role:"CX Agent Vendor",country:"USA",type:"Startup"}],
    metrics:{"Metric":"Resolution rate","Reported":"70–80%","Replaces":"Deflection/containment"},
    sourceUrl:"https://sacra.com/research/sierra-vs-decagon/", sourceName:"Sacra Research"
  },{
    id:"pub_sd2_001", date:"2024-01",
    headline:"WebArena: A Realistic Web Environment for Building Autonomous Agents: Zhou et al. (CMU/Google), demonstrating agents that navigate real websites to complete customer-facing tasks.",
    sigType:"inflection",
    description:"WebArena creates a realistic environment of functional web applications (e-commerce, social platforms, collaborative tools) where agents must complete practical tasks through browser interaction. The benchmark specifically targets the customer-facing use cases, shopping, support, account management, that represent the commercial opportunity for conversational agents.",
    whyFlag:"WebArena is the first benchmark explicitly testing conversational agents on the customer-facing tasks they will actually be deployed for in production, making the jump from lab evaluation to real-world relevance.",
    whyRationale:"Prior benchmarks tested knowledge retrieval; WebArena tests goal completion in realistic environments. The shift from 'can it answer?' to 'can it do?' in benchmarks directly reflects the commercial shift from chatbots to agents.",
    implications:"WebArena's publication accelerated research into web-navigating conversational agents, with results from Anthropic, OpenAI, and Google all benchmarked against it within 12 months. The 78% success rate achieved by top models in 2025 validates commercial deployment.",
    entities:[{name:"Carnegie Mellon University",role:"Research Publisher",country:"USA",type:"University"},{name:"Google",role:"Research Partner",country:"USA",type:"Corporation"}],
    metrics:{"Benchmark":"WebArena","arXiv":"2307.13854","Published at":"ICLR 2024","Top Agent Score":"78% (2025)"},
    sourceUrl:"https://arxiv.org/abs/2307.13854",
    sourceName:"arXiv 2307.13854"
  }],

  // Funding Deployed: Agent Orchestration Frameworks & Developer Infrastructure
  inn_sd3_fund: [{
    id:"fund_sd3_001", date:"2024-10",
    headline:"LangChain raises $25M Series B to fund production-grade agent reliability, LangSmith observability, and multi-agent coordination research.",
    sigType:"strategic_commitment",
    description:"LangChain's Series B is notable for its focus on production R&D rather than go-to-market: capital is directed at LangSmith observability, LangGraph persistence and reliability, and research into multi-agent coordination. The round was led by Sequoia Capital.",
    whyFlag:"A framework company raising $25M specifically for production reliability signals that the market has moved from 'will agents work?' to 'how do we run them reliably at scale?', a category maturation milestone.",
    whyRationale:"LangSmith's observability tooling positions LangChain for the compliance-logging market created by EU AI Act Art. 13 requirements. The R&D investment thesis: whoever solves agent reliability owns the enterprise orchestration layer.",
    implications:"LangChain's Series B capital allocation (production reliability over sales) signals the company believes technical moat rather than distribution is the winning strategy in the orchestration market.",
    entities:[{name:"LangChain Inc.",role:"Funded Company",country:"USA",type:"Startup"},{name:"Sequoia Capital",role:"Lead Investor",country:"USA",type:"VC Firm"}],
    metrics:{"Amount":"$25,000,000","Round":"Series B","Lead":"Sequoia Capital","Focus":"Production reliability + LangSmith"},
    sourceUrl:"https://blog.langchain.com/series-b/",
    sourceName:"LangChain Blog"
  },{
    id:"fund_sd3_002", date:"2024-04",
    headline:"CrewAI raises $18M Series A led by Insight Partners for enterprise multi-agent orchestration with role-based agent personas.",
    sigType:"strategic_commitment",
    description:"CrewAI's Series A funds the development of its role-based multi-agent framework, which enables teams of specialised agents (Researcher, Writer, Coder, Analyst) to collaborate on complex tasks. The framework saw 1M+ downloads per month at the time of the round.",
    whyFlag:"CrewAI's role-based architecture represents a different approach to agent orchestration than LangGraph's graph-based model, its rapid growth suggests the market is validating multiple competing paradigms simultaneously.",
    whyRationale:"1M+ monthly downloads before institutional funding is unusually strong product-market fit for an infrastructure tool. Insight Partners' focus on enterprise distribution signals they believe role-based orchestration has a path to enterprise contracts.",
    implications:"The emergence of competing orchestration paradigms (graph-based: LangGraph; role-based: CrewAI; event-driven: AutoGen) means the orchestration layer has not yet consolidated. Enterprise buyers are evaluating multiple frameworks in parallel.",
    entities:[{name:"CrewAI",role:"Funded Company",country:"USA",type:"Startup"},{name:"Insight Partners",role:"Lead Investor",country:"USA",type:"VC Firm"}],
    metrics:{"Amount":"$18,000,000","Round":"Series A","Lead":"Insight Partners","Monthly Downloads":"1M+"},
    sourceUrl:"https://www.crewai.com/blog",
    sourceName:"CrewAI Blog"
  }],

  // Patent Families: Agent Orchestration Frameworks & Developer Infrastructure
  inn_sd3_left: [{
    id:"pat_sd3_002", date:"2025-01",
    headline:"Microsoft files patents on autonomous agent lifecycle management, covering spawning, monitoring, and resource-controlled retirement of long-running agents.",
    sigType:"strategic_commitment",
    description:"The filings address operational failure modes of production agent fleets, runaway loops, 'zombie' agents that consume resources after their task ends, and uncontrolled retries, reserving IP on the orchestration and governance layer rather than the model.",
    whyFlag:"Patenting agent lifecycle control signals that the hard problem has moved from building agents to operating them safely at fleet scale.",
    whyRationale:"IP filed on operations (not capability) is a reliable marker that a category is entering production maturity, where reliability and cost-control dominate over raw capability.",
    entities:[{name:"Microsoft",role:"Patent Filer",country:"USA",type:"Big Tech"}],
    metrics:{"Domain":"Agent lifecycle / AgentOps","Filing":"US patent application","Focus":"Resource-controlled retirement"},
    sourceUrl:"https://patents.google.com/", sourceName:"USPTO / Google Patents"
  },{
    id:"pat_sd3_001", date:"2024-07",
    headline:"USPTO grants Patent 12412138 for 'Agentic Orchestration', covering a conductor-application architecture for routing tasks between RPA robots and AI agents with natural language intent matching.",
    sigType:"inflection",
    description:"Patent 12412138, granted to UiPath, covers a system where a conductor application receives natural language task descriptions from one AI agent, uses an AI model to find the best-matched agent or RPA robot to handle the task, and executes the hand-off. This bridges the gap between traditional RPA automation and LLM-based agents.",
    whyFlag:"UiPath's patent on natural-language agent-to-agent and agent-to-RPA routing represents the IP foundation for the hybrid automation market, where LLM-based agents direct legacy RPA bots. This is the dominant enterprise deployment model in 2025.",
    whyRationale:"Most enterprise automation deployments in 2025 are hybrid: LLM agents for reasoning and planning, RPA bots for executing legacy system interactions. UiPath's IP in this routing architecture gives it a durable competitive advantage in enterprise orchestration.",
    implications:"The existence of granted IP in agent-to-RPA orchestration means any vendor entering the enterprise automation market must either license this architecture or develop non-infringing alternatives, raising the bar for new entrants in this specific segment.",
    entities:[{name:"UiPath",role:"Patent Holder",country:"USA",type:"Enterprise Software"}],
    metrics:{"Patent Number":"US 12412138","Filed":"2022","Granted":"2024","Architecture":"Conductor-based agent routing"},
    sourceUrl:"https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/12412138",
    sourceName:"USPTO Patent 12412138"
  }],

  // Research Publications: Agent Orchestration Frameworks & Developer Infrastructure
  inn_sd3_pub: [{
    id:"pub_sd3_001", date:"2024-12",
    headline:"Anthropic publishes 'Building Effective Agents', influential practitioner guidance distinguishing deterministic workflows from autonomous agents and codifying common orchestration patterns.",
    sigType:"inflection",
    description:"The December 2024 guide drew a clear line between 'workflows' (LLMs orchestrated through predefined paths) and 'agents' (LLMs that dynamically direct their own process), and catalogued patterns (prompt chaining, routing, orchestrator-workers, evaluator-optimiser) now widely referenced in production designs.",
    whyFlag:"A foundation lab codifying agent design patterns shaped how practitioners across the industry architect and talk about orchestration.",
    whyRationale:"Shared vocabulary and reference patterns from an authoritative source accelerate convergence on common architectures, a soft-standardisation effect that precedes tooling consolidation.",
    entities:[{name:"Anthropic",role:"Publisher",country:"USA",type:"AI Lab"}],
    metrics:{"Published":"2024-12","Type":"Practitioner guidance","Influence":"Widely referenced"},
    sourceUrl:"https://www.anthropic.com/research/building-effective-agents", sourceName:"Anthropic Research"
  },{
    id:"pub_sd3_002", date:"2025-03",
    headline:"Google publishes the Agent-to-Agent (A2A) protocol specification, a foundational design for multi-agent interoperability and delegation.",
    sigType:"inflection",
    description:"The A2A specification (March 2025) defines how independent agents discover capabilities and delegate tasks to one another, providing a standard coordination layer that complements MCP's tool/data connectivity and pushes the field toward open multi-agent systems.",
    whyFlag:"A published protocol for agent-to-agent interaction signals the research and standards frontier has moved from single agents to multi-agent ecosystems.",
    whyRationale:"Protocol specifications from major labs are the structural groundwork for interoperable multi-agent systems and reduce the risk of fragmentation at the coordination layer.",
    entities:[{name:"Google",role:"Publisher",country:"USA",type:"Big Tech"}],
    metrics:{"Spec":"A2A","Published":"2025-03","Complements":"MCP"},
    sourceUrl:"https://developers.googleblog.com/", sourceName:"Google Developers Blog"
  }]
};

// ── Dynamic activity counts, single source of truth ──────────────────────
const ACT_COUNTS = {
  innovation: Object.entries(COL_ACTS).filter(([k]) => k.startsWith("inn_")).reduce((s, [, v]) => s + v.length, 0),
  commercial: Object.entries(COL_ACTS).filter(([k]) => k.startsWith("cmr_")).reduce((s, [, v]) => s + v.length, 0),
  structural: Object.entries(COL_ACTS).filter(([k]) => k.startsWith("str_")).reduce((s, [, v]) => s + v.length, 0)
};
const SIG_TYPE_CFG = {
  strategic_commitment: {
    label: "Strategic Commitment",
    cls: "bg-amber-50 text-amber-700 border-amber-200"
  },
  threshold_crossing: {
    label: "Threshold Crossing",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  commercial_first: {
    label: "Commercial First",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  landscape_restructuring: {
    label: "Landscape Restructuring",
    cls: "bg-red-50 text-red-700 border-red-200"
  },
  inflection: {
    label: "Inflection",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  decision_gating: {
    label: "Decision Gating",
    cls: "bg-orange-50 text-orange-700 border-orange-200"
  },
  unexpected_participant: {
    label: "Unexpected Participant",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200"
  }
};
const ACT_KEY = {
  innovation: {
    sd1: "inn_sd1",
    sd2: "inn_sd2",
    sd3: "inn_sd3"
  },
  commercial: {
    sd1: "cmr_sd1",
    sd3: "cmr_sd3",
    sd4: "cmr_sd4"
  },
  structural: {
    sd1: "str_sd1",
    sd3: "str_sd3",
    sd5: "str_sd5"
  }
};
const TAB_TAKEAWAYS = {
  innovation: [
    "<strong>Patent families and publications reached their highest levels in 2025</strong> across all three technology segments. Innovation is broadening from platform-level IP (orchestration, memory) into application-layer patents (coding agents, voice synthesis).",
    "<strong>Funding concentration is extreme:</strong> the top deals (Anysphere $2.3B Series D, Sierra $950M, ElevenLabs $180M Series C) account for the majority of the 2025–2026 total. Seed-stage activity remains healthy but mid-stage rounds ($20–100M) are thinning, an early sign of market consolidation.",
    "<strong>Today\u2019s commercial leaders share a common origin window:</strong> Cursor, Sierra, LangChain, ElevenLabs, and Cognition AI were all founded in 2022\u20132023 and reached breakout scale in 2024\u20132025 (the profiled milestones here date from those breakouts, not the foundings). More recent entrants are smaller and more infrastructure-focused."
  ],
  commercial: [
    "<strong>Deployments are outpacing pilots:</strong> organisations that piloted in 2023–2024 are moving to full production in 2025–2026. Klarna (85M users), Nubank (35% autonomous credit decisions), and Cursor (500,000 paying developers) set the evidence bar for the next procurement wave.",
    "<strong>Outcome-based pricing is the emerging commercial model:</strong> Salesforce Agentforce and Decagon both price per resolved task rather than per seat. If this holds, it reshapes SaaS economics across CRM, customer service, and developer tooling, making agent ROI quantifiable for the first time.",
    "<strong>Design wins are concentrating around a small number of vendors:</strong> LangGraph (Deloitte vendor-of-record), Salesforce Agentforce (150,000 enterprise customers), and PolyAI (Deutsche Telekom, Genesys) are winning category-defining enterprise contracts that will set competitive dynamics for the next 3–5 years."
  ],
  structural: [
    "<strong>Three regulatory events dominate the structural landscape:</strong> EU AI Act GPAI obligations (August 2025), EU AI Act biometric provisions for voice agents, and NIST AI 100-4 together form the first binding and quasi-binding governance framework for agentic systems. Compliance architecture is now a product feature.",
    "<strong>MCP is converging on de-facto standard status:</strong> Anthropic open-source release, Salesforce native adoption, and Google endorsement as its default agent-tool protocol are three independent signals pointing to the same outcome: MCP is the interoperability layer the ecosystem is converging on.",
    "<strong>The supply chain bottleneck has shifted from model availability to inference capacity:</strong> H100 inference reservations overtaking training signals the constraint has moved from 'can we build agents?' to 'can we run them at scale?' The 3-vendor model concentration flagged by NIST adds a second structural risk."
  ]
};
const SignalsPanel = ({
  initSigTab = "innovation",
  initSdId = null
}) => {
  const [sigTab, setSigTab] = useState(initSigTab);
  const [selAct, setSelAct] = useState(null);
  const [actSd, setActSd] = useState("");

  // Tab switching within signals panel — no auto-scroll; parent scroll-to-top handles positioning
  const [actDetailTab, setActDetailTab] = useState("description");

  // Scroll to specific technology segment on mount when initiated from overview table
  useEffect(() => {
    if (!initSdId) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(`sig-${initSdId}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    return () => clearTimeout(timer);
  }, []);
  const COLOR = {
    innovation: "#059669",
    commercial: "#059669",
    structural: "#166534"
  };
  const color = COLOR[sigTab];
  const data = SIGNAL_DATA[sigTab];
  const TABS = [{
    id: "innovation",
    label: "Innovation Signals",
    count: ACT_COUNTS.innovation,
    desc: "Tracks the creation of new knowledge and early-stage investment. Covers patent families, research publications, funding deployed, startup formations, hiring activity, and R&D investments."
  }, {
    id: "commercial",
    label: "Commercialisation Signals",
    count: ACT_COUNTS.commercial,
    desc: "Tracks the packaging, selling, and adoption of the technology. Covers product launches, named partnerships with commitments, pilots, commercial deployments, and design wins."
  }, {
    id: "structural",
    label: "Structural Signals",
    count: ACT_COUNTS.structural,
    desc: "Tracks changes to the competitive rules of the market. Covers mergers and acquisitions, regulatory milestones, standards body decisions, and major open-source releases. These signals shape what all players in the space can do simultaneously."
  }];
  const openAct = (act, sdName) => {
    setSelAct(act);
    setActSd(sdName || "");
    setActDetailTab("description");
  };


  const ActDrawer = () => {
    if (!selAct) return null;
    return <ActivityDrawerModal act={selAct} sdName={actSd||""} onClose={()=>setSelAct(null)} onSelectActivity={(a)=>setSelAct(a)} />;
  };

  return <div><div className="flex items-center justify-between mb-6"><div className="flex gap-2">{TABS.map(t => {
          const active = sigTab === t.id;
          return <button key={t.id} onClick={() => setSigTab(t.id)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-[12px] font-semibold transition-all ${active ? "text-white border-transparent shadow-md" : "bg-white border-slate-200 text-[#0f2644] hover:border-slate-300 hover:shadow-sm"}`} style={active ? {
            background: COLOR[t.id]
          } : {}}><span className="w-2 h-2 rounded-full flex-shrink-0" style={{
              background: active ? "rgba(255,255,255,0.7)" : COLOR[t.id]
            }} />{t.label}<span className={`text-[12px] font-bold px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-slate-100 text-[#0f2644]"}`}>{t.count}</span></button>;
        })}</div></div><div className="space-y-6">{TAB_TAKEAWAYS[sigTab] && <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-5"><div className="text-[15px] font-bold text-emerald-700 mb-3">Key Takeaways: {sigTab === 'commercial' ? 'Commercialisation' : sigTab.charAt(0).toUpperCase()+sigTab.slice(1)} Signals</div><div className="space-y-2">{TAB_TAKEAWAYS[sigTab].map((pt,i)=><div key={i} className="flex items-start gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-[5px]"/><p className="text-[12px] text-[#0f2644] leading-relaxed" dangerouslySetInnerHTML={{__html:pt}}/></div>)}</div></div>}{data.map((item, idx) => {
        const _sections = item.blocks || [item.left, item.right].filter(Boolean);
        const allCharts = _sections.flatMap(s => (s.charts || []).map(c => ({ ...c })));
        const _am = new Map();
        _sections.forEach(s => { const acts = s.actKey ? (COL_ACTS[s.actKey] || []) : []; acts.forEach(a => { if (_am.has(a.id)) { const e = _am.get(a.id); if (!e.types.includes(s.title)) e.types.push(s.title); } else { _am.set(a.id, { act: a, types: [s.title] }); } }); });
        const _TYPE_ORDER: Record<string,string[]> = {
          innovation: ["Patents Granted","Research Publications","Funding Deployed (USD Million)","Funding Deployed","Startup Formations","Hiring Activity","R&D Investments"],
          commercial: ["Product Launches","Deployments","Partnerships","Pilots","Design Wins"],
          structural: ["M&A and Investments","Regulatory Milestones","Standards Decisions","Open-Source Releases","Supply Chain Shifts"]
        };
        const _typeOrd = _TYPE_ORDER[sigTab] || [];
        const allActs = [..._am.values()].sort((x, y) => {
          const xi = _typeOrd.indexOf(x.types[0]); const yi = _typeOrd.indexOf(y.types[0]);
          const xo = xi < 0 ? 99 : xi; const yo = yi < 0 ? 99 : yi;
          if (xo !== yo) return xo - yo;
          return (y.act.date || "").localeCompare(x.act.date || "");
        });
        const sigLayerLabel = sigTab === "commercial" ? "Commercialisation" : sigTab.charAt(0).toUpperCase() + sigTab.slice(1);
        return <div key={idx} id={`sig-${item.id}`} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"><div className="px-6 pt-5 pb-4 border-b border-slate-100"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-1.5 mb-1.5"><span className="text-[10px] font-bold px-2 py-0.5 rounded-full tracking-[0.06em]" style={{
                    background: `${color}18`,
                    color
                  }}>{sigTab === "commercial" ? "Commercialisation Signals" : sigTab.charAt(0).toUpperCase() + sigTab.slice(1) + " Signals"}</span><HoverTip hideIcon={true} title={sigTab === "commercial" ? "Commercialisation Signals" : sigTab.charAt(0).toUpperCase() + sigTab.slice(1) + " Signals"} label={<span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-semibold cursor-help transition-colors hover:opacity-80" style={{background:`${color}18`, color}}>ⓘ</span>} desc={TABS.find(t => t.id === sigTab)?.desc ?? ""} /></div><h3 className="text-[17px] font-bold text-[#0f2644] leading-snug">{item.name}</h3>{item.desc && <p className="text-[12px] text-[#0f2644] mt-1.5 leading-relaxed">{item.desc}</p>}</div></div></div><div className="px-6 py-5 space-y-7">
          {allCharts.length > 0 && <div>
            <div className="flex items-center gap-2 mb-4">
              <svg width="13" height="13" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M18 9l-5 5-3-3-4 4"/></svg>
              <span className="text-[12px] font-semibold text-[#0f2644]">Activity Trends</span>
              <span className="text-[12px] text-[#0f2644]">· {sigLayerLabel.toLowerCase()} volume by year</span>
            </div>
            <p className="text-[10.5px] text-[#0f2644]/70 italic -mt-2 mb-3">Each chart uses its own scale and unit. Compare trends within a chart, not bar heights across charts.</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">{allCharts.map((c, ci) => <div key={ci} className="bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-4"><VB years={c.years} values={c.values} title={c.title} note={c.note} color={color} statusBreakdown={c.statusBreakdown} /></div>)}</div>
          </div>}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg width="13" height="13" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span className="text-[12px] font-semibold text-[#0f2644]">Key Activities</span>
                <HoverTip hideIcon={true} title="Key Activities" label={<span className="text-[10px] text-[#0f2644] cursor-help">ⓘ</span>} desc="Important events in this technology segment, funding rounds, launches, deployments, acquisitions, regulations, standards, that are individually named, dated, traceable to a source, and widely reported by third-party news and industry sources. This is a curated set, not an exhaustive list of everything that happened." />
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${color}15`, color }}>{allActs.length}</span>
                
              </div>
              <span className="text-[10px] text-[#0f2644] italic">Click any card for full details</span>
            </div>
            {allActs.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{allActs.map(({ act, types }) => {
              const typeLabel = types.join(", ");
              return <div key={act.id} onClick={() => openAct(act, item.name)} className={`group bg-white border rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex flex-col ${HIGH_SIG_TYPES.has(act.sigType) ? "border-emerald-200 ring-1 ring-emerald-100 hover:border-emerald-300" : "border-slate-200 hover:border-slate-300"}`}>
                <SignalBanner title={types[0]} />
                <div className="px-4 pt-3 pb-1.5 flex items-center justify-end gap-2">
                  <span className="text-[10px] font-mono text-[#0f2644] tabular-nums flex-shrink-0">{fmtDate(act.date)}</span>
                </div>
                {act.metrics && Object.keys(act.metrics).length > 0 && <div className="px-4 pb-1.5 flex flex-wrap gap-1">{Object.entries(act.metrics).slice(0,2).map(([k,v]:any) => <span key={k} className="text-[9.5px] font-semibold text-[#0f2644] bg-slate-100 border border-slate-200/70 px-1.5 py-0.5 rounded-md whitespace-nowrap"><span className="text-[#0f2644] font-medium">{k}:</span> {String(v)}</span>)}</div>}
                <div className="px-4 pb-2 flex-1"><p className="text-[12.5px] font-semibold text-[#000000] leading-snug line-clamp-3">{act.headline}</p></div>
                <div className="px-4 pb-3"><div className="border-l-2 pl-2.5 py-0.5" style={{ borderColor: `${COLOR[sigTab]}45` }}><p className="text-[12px] text-[#0f2644] italic leading-relaxed line-clamp-2">{act.whyFlag}</p></div></div>
                <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end gap-2"><span className="text-[10px] font-semibold text-[#2563eb] flex items-center gap-0.5 group-hover:gap-1 transition-all whitespace-nowrap">View Full Details<svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></span></div>
              </div>;
            })}</div> : <div className="px-5 py-8 text-center text-[12px] text-[#0f2644] italic">No key activities in this period.</div>}
          </div>
        </div></div>;
      })}</div><ActDrawer /></div>;
};
const PLAYER_LOGOS = {
  "Anthropic": "https://www.google.com/s2/favicons?domain=anthropic.com&sz=64",
  "OpenAI": "https://www.google.com/s2/favicons?domain=openai.com&sz=64",
  "Anysphere (Cursor)": "https://www.google.com/s2/favicons?domain=cursor.com&sz=64",
  "Cognition AI": "https://www.google.com/s2/favicons?domain=cognition.ai&sz=64",
  "Sierra": "https://www.google.com/s2/favicons?domain=sierra.ai&sz=64",
  "LangChain Inc.": "https://www.google.com/s2/favicons?domain=langchain.com&sz=64",
  "Salesforce": "https://www.google.com/s2/favicons?domain=salesforce.com&sz=64",
  "Microsoft": "https://www.google.com/s2/favicons?domain=microsoft.com&sz=64",
  "Decagon": "https://www.google.com/s2/favicons?domain=decagon.ai&sz=64",
  "Browserbase": "https://www.google.com/s2/favicons?domain=browserbase.com&sz=64",
  "Google": "https://www.google.com/s2/favicons?domain=google.com&sz=64",
  "NVIDIA": "https://www.google.com/s2/favicons?domain=nvidia.com&sz=64",
  "Klarna": "https://www.google.com/s2/favicons?domain=klarna.com&sz=64",
  "PolyAI": "https://www.google.com/s2/favicons?domain=poly.ai&sz=64",
  "Sarvam AI": "https://www.google.com/s2/favicons?domain=sarvam.ai&sz=64"
};
const PLAYER_WEBSITES = {
  "Anthropic": "anthropic.com",
  "OpenAI": "openai.com",
  "Anysphere (Cursor)": "cursor.com",
  "Cognition AI": "cognition.ai",
  "Sierra": "sierra.ai",
  "LangChain Inc.": "langchain.com",
  "Salesforce": "salesforce.com",
  "Microsoft": "microsoft.com",
  "Decagon": "decagon.ai",
  "Browserbase": "browserbase.com",
  "Google": "google.com",
  "NVIDIA": "nvidia.com"
};

// Per-player rationale for tier and role classifications
const PLAYER_TIER_RATIONALE: Record<string,{tier:string,role:string}> = {
  "Anthropic": {
    tier: "The MCP open standard originated here and was donated to the Linux Foundation AAIF in December 2025, establishing the de-facto agent connectivity protocol across the entire industry. Claude Code reached $2.5B run-rate ARR within 8 months of General Availability, a trajectory no other Foundation lab product has matched.",
    role: "Research output (Constitutional AI, Claude model series, MCP specification) consistently precedes commercial deployment, and patents and publications dominate the signal footprint."
  },
  "OpenAI": {
    tier: "Created the AGENTS.md open standard (adopted by 60,000+ projects) and its Codex product onboarded 1 million developers. GPT-5.3-Codex represents the first frontier-lab coding agent with disclosed adoption at that scale.",
    role: "The majority of signal presence is in research publications, model releases, and open standards, patents and foundational research define the footprint, with commercialisation following."
  },
  "Anysphere (Cursor)": {
    tier: "Crossed $2B ARR as of February 2026, the first AI-native IDE to reach that milestone. SpaceX holds a $60B acquisition option, representing the first non-AI-platform strategic buyer entering the coding agent category.",
    role: "Signal presence is led by product revenue, enterprise ARR, and named customer deployments. The IDE is the commercial product; research activity is secondary to commercial execution."
  },
  "Cognition AI": {
    tier: "Created Devin, the first autonomous AI software engineer with production deployments at Goldman Sachs, Citi, Dell, and Cisco. The $400M Series C at $10.2B valuation was the first independent coding agent to cross the decacorn threshold.",
    role: "Devin originated as a research-led product; the majority of signal presence is in model capability publications and SWE-bench benchmarks, with commercialisation building on that research base."
  },
  "Sierra": {
    tier: "$150M ARR and 40% Fortune 50 penetration, the fastest enterprise SaaS to $100M ARR on record. Outcome-based pricing (pay per resolved interaction) was validated at Fortune-50 scale for the first time in the CX agent category.",
    role: "The entire signal footprint is in commercial deployments, enterprise ARR, and named customer relationships. Research is embedded in product development rather than published externally."
  },
  "LangChain Inc.": {
    tier: "LangChain and LangGraph reached 90M combined monthly downloads and 35% Fortune 500 reach. The $1.25B valuation at the October 2025 Series B confirmed it as the highest-valued pure-play orchestration framework company.",
    role: "The organisation provides foundational open-source frameworks (LangChain, LangGraph, LangSmith) that all other players in this analysis build on. Cloud-provider comparables include Docker and npm."
  },
  "Salesforce": {
    tier: "Agentforce 360 reached 12,000 enterprise customers in 12 months, faster than Salesforce CRM itself. 70% of Fortune 500 are on Copilot or Agentforce. The 150,000-customer CRM installed base provides unmatched distribution for commercial agents.",
    role: "The primary signal presence is in product launches, enterprise deployments, and CRM-native partnerships. Research and standards activity is secondary to commercial execution and platform distribution."
  },
  "Microsoft": {
    tier: "GitHub Copilot reached 20M users at 90% Fortune 100 penetration. Agent 365 and the centralised control plane represent the most comprehensive enterprise agent management layer from any platform incumbent. MCP adoption was announced at Build 2025.",
    role: "Azure AI, GitHub, and Semantic Kernel serve as foundational infrastructure for the agent ecosystem. The majority of signals are in cloud runtime, developer tooling, and managed services that enable third-party agent deployments."
  },
  "Decagon": {
    tier: "No. 2 pure-play CX agent platform at $4.5B valuation, three times its 2024 valuation in six months. 100+ enterprise customers including Deutsche Telekom with 80%+ deflection rates. Still narrowing its footprint against the established Sierra-led market structure.",
    role: "The entire signal footprint is in commercial deployments, enterprise sales, and named customer outcomes. No research publication or standards activity is recorded in the evidence base."
  },
  "Google": {
    tier: "The $2.4B Windsurf (Codeium) leadership acquihire and MCP protocol adoption across Google Cloud AI agents constitute the two most commercially impactful structural moves by any player in 2025. Google's MCP adoption was the decisive cross-competitor signal that made MCP mandatory infrastructure.",
    role: "Gemini models, Google Cloud, and Workspace agents are the primary signals, commercial products and cloud infrastructure dominate the evidence footprint, with research (DeepMind) as a parallel but separate track."
  },
  "NVIDIA": {
    tier: "H100 inference reservations overtook training as the primary compute revenue driver in H1 2025, a structural signal that agent deployment is now the dominant compute use case. NVentures led the PolyAI Series C, confirming strategic conviction in voice as a primary agentic modality.",
    role: "H100/H200 GPUs and NVLink architecture are the foundational compute infrastructure on which all frontier agent deployments run. NVIDIA shapes the market through hardware availability, pricing, and strategic investments rather than software products."
  },
};
// ── Build activity→layer lookup (used by shared drawer for accent color) ──
const LAYER_COLOR: Record<string,string> = { innovation:"#16a34a", commercial:"#059669", structural:"#166534" };
const ACT_LAYER: Record<string,string> = {};
const ACT_BY_HEADLINE: Record<string,any> = {};
const ACT_BY_PLAYER: Record<string,any[]> = {};
(()=>{
  Object.entries(COL_ACTS).forEach(([key, acts]) => {
    const layer = key.startsWith("inn_") ? "innovation" : key.startsWith("cmr_") ? "commercial" : "structural";
    (acts as any[]).forEach(a => {
      ACT_LAYER[a.id] = layer;
      ACT_BY_HEADLINE[a.headline] = a;
    });
  });
  (COL_ACTS as any).ALL_ACTS = Object.values(COL_ACTS).flat();
  (COL_ACTS as any).ALL_ACTS?.forEach?.((a:any) => {
    if (a.entities) (a.entities as any[]).forEach(e => {
      if (!ACT_BY_PLAYER[e.name]) ACT_BY_PLAYER[e.name] = [];
      if (!ACT_BY_PLAYER[e.name].find((x:any)=>x.id===a.id)) ACT_BY_PLAYER[e.name].push(a);
    });
  });
})();
// id → COL_ACTS key (used for Related Activities discovery)
const ACT_TO_KEY: Record<string,string> = {};
Object.entries(COL_ACTS).forEach(([key, acts]) => {
  if (Array.isArray(acts)) (acts as any[]).forEach(a => { if (a && a.id) ACT_TO_KEY[a.id] = key; });
});
const ALL_ACTS_FLAT: any[] = Object.entries(COL_ACTS).filter(([k])=>k!=="ALL_ACTS").flatMap(([,v])=>Array.isArray(v)?v as any[]:[]);

// Deduplicate an activity list: removes activities whose headline is >80% similar
// to a previously-seen one (catches same real event under different COL_ACTS keys).
const deduplicateActs = (acts: any[]): any[] => {
  const seenKeys: string[] = [];
  return acts.filter(a => {
    const key = (a.headline || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 50);
    const isDupe = seenKeys.some(s => {
      const len = Math.max(key.length, s.length);
      if (len === 0) return false;
      let match = 0;
      for (let i = 0; i < Math.min(key.length, s.length); i++) if (key[i] === s[i]) match++;
      return match / len > 0.80;
    });
    if (isDupe) return false;
    seenKeys.push(key);
    return true;
  });
};

// Parse a dollar amount from a headline string (returns value in USD)
const parseHeadlineAmount = (h: string): number => {
  const m = (h || "").match(/\$(\d+(?:\.\d+)?)\s*([BMbm]?)/);
  if (!m) return 0;
  const v = parseFloat(m[1]);
  const s = m[2].toUpperCase();
  return s === "B" ? v * 1e9 : s === "M" ? v * 1e6 : v;
};
// Top entities by activity count, used by Overview "Most Active Players" widget
const TOP_ENTITIES = (()=>{
  const counts: Record<string, { count: number; types: Record<string,number>; lastDate: string; lastHeadline: string }> = {};
  ALL_ACTS_FLAT.forEach(a => {
    if (!a.entities) return;
    (a.entities as any[]).forEach(e => {
      if (!counts[e.name]) counts[e.name] = { count: 0, types: {}, lastDate: "", lastHeadline: "" };
      counts[e.name].count++;
      const layer = ACT_LAYER[a.id] || "innovation";
      counts[e.name].types[layer] = (counts[e.name].types[layer] || 0) + 1;
      if ((a.date || "") > counts[e.name].lastDate) {
        counts[e.name].lastDate = a.date || "";
        counts[e.name].lastHeadline = a.headline || "";
      }
    });
  });
  return Object.entries(counts).map(([name, info]) => ({ name, ...info })).sort((a,b)=>b.count-a.count);
})();
// Find up to N activities related to `act`.
// Selection rule: same signal-type bucket AND same technology segment only.
// e.g. opening a Funding Deployed activity in Software Engineering Agents surfaces
// only other Funding Deployed activities in Software Engineering Agents.
const getRelated = (act: any, n: number = 3): any[] => {
  const myKey = ACT_TO_KEY[act.id];
  if (!myKey) return [];
  const pool = ALL_ACTS_FLAT.filter(a => a.id !== act.id);
  // Same COL_ACTS bucket = same signal type + same technology segment
  const sameCell = pool.filter(a => ACT_TO_KEY[a.id] === myKey);
  const seen = new Set<string>();
  const result: any[] = [];
  for (const a of sameCell) {
    if (result.length >= n) break;
    if (!seen.has(a.id)) { seen.add(a.id); result.push(a); }
  }
  return result;
};
// helper: get all acts for a player by exact-name + partial-name match
const getPlayerActs = (playerName: string): any[] => {
  let acts: any[] = ACT_BY_PLAYER[playerName] || [];
  if (!acts.length) {
    // try partial match
    for (const [entName, entActs] of Object.entries(ACT_BY_PLAYER)) {
      if (entName.includes(playerName) || playerName.includes(entName)) acts = [...acts, ...entActs];
    }
  }
  return acts.filter((a,i,arr)=>arr.findIndex(b=>b.id===a.id)===i);
};

// ── Shared full-activity drawer (used by Signals, Technology Segments, and Players panels) ──
const ActivityDrawerModal = ({ act, sdName="", onClose, onSelectActivity }: { act: any; sdName?: string; onClose: ()=>void; onSelectActivity?: (a:any)=>void }) => {
  React.useEffect(() => {
    if (!act) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [act, onClose]);
  if (!act) return null;
  const layer = ACT_LAYER[act.id] || "innovation";
  const accent = LAYER_COLOR[layer] || "#16a34a";
  const layerLabel = layer === "commercial" ? "Commercialisation" : layer.charAt(0).toUpperCase() + layer.slice(1);
  const implText = (act.implications && act.implications !== act.whyRationale && act.implications !== act.description) ? act.implications : "";
  const fmtD = (d:string) => { if(!d) return ""; const MONTHS=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; const mm=d.match(/^(\d{4})-(\d{2})$/); if(mm) return `${MONTHS[+mm[2]-1]} ${mm[1]}`; const dm=d.match(/^(\d{4})-(\d{2})-(\d{2})$/); if(dm) return `${+dm[3]} ${MONTHS[+dm[2]-1]}, ${dm[1]}`; return d; };
  return <div className="fixed inset-0 z-[700] flex" onClick={onClose}>
    <div className="flex-1 bg-black/40 backdrop-blur-[3px]" />
    <div className="w-[700px] flex-shrink-0 bg-white flex flex-col h-full shadow-2xl border-l border-slate-200" onClick={e=>e.stopPropagation()}>
      <div className="flex-shrink-0">
        <div className="h-1.5 w-full" style={{background:`linear-gradient(90deg,${accent},${accent}50)`}}/>
        <div className="px-7 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {(sdName||layerLabel) && <span className="text-[10px] font-semibold tracking-wide" style={{color:accent}}>{sdName?`${sdName} · `:""}{layerLabel}</span>}
            <span className="text-[12px] font-mono text-[#0f2644] ml-auto">{fmtD(act.date)}</span>
            <button onClick={onClose} className="w-7 h-7 ml-1 rounded-lg border border-slate-200 flex items-center justify-center text-[#0f2644] hover:bg-slate-50 flex-shrink-0">
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <h3 className="text-[17px] font-semibold text-[#000000] leading-snug">{act.headline}</h3>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">
        <div className="rounded-2xl p-5 border" style={{background:`${accent}0a`,borderColor:`${accent}28`}}>
          <div className="text-[15px] font-bold mb-2.5" style={{color:accent}}>Significance</div>
          <p className="text-[12px] leading-relaxed text-[#0f2644]">{act.whyFlag}</p>
        </div>
        <div>
          <div className="text-[15px] font-bold text-[#0f2644] mb-2">Full Context</div>
          <p className="text-[12px] text-[#0f2644] leading-relaxed">{act.description}</p>
          {act.whyRationale && <p className="text-[12px] text-[#0f2644] leading-relaxed mt-2.5 pl-3 border-l-2 border-slate-200">{act.whyRationale}</p>}
        </div>
        {implText && <div>
          <div className="text-[15px] font-bold text-[#0f2644] mb-2">Landscape Implications</div>
          <div className="border-l-[3px] pl-4" style={{borderColor:accent}}><p className="text-[12px] text-[#0f2644] leading-relaxed">{implText}</p></div>
        </div>}
        {act.metrics && Object.keys(act.metrics).length > 0 && <div>
          <div className="text-[15px] font-bold text-[#0f2644] mb-3">Activity Metrics</div>
          <div className="grid grid-cols-2 gap-2.5">{Object.entries(act.metrics).map(([k,v])=><div key={k} className="p-3 rounded-xl border border-slate-100 bg-slate-50"><div className="text-[15px] font-bold text-[#0f2644] mb-1">{k}</div><div className="text-[15px] font-bold text-[#0f2644]">{String(v)}</div></div>)}</div>
        </div>}
        {act.entities && act.entities.length > 0 && <div>
          <div className="text-[15px] font-bold text-[#0f2644] mb-3">Organisations Involved</div>
          <div className="space-y-2">{(act.entities as any[]).map((e:any,i:number)=>{
            const ini = e.name.split(" ").slice(0,2).map((w:string)=>w[0]).join("");
            const logo = (PLAYER_LOGOS as any)[e.name];
            return <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {logo ? <img src={logo} alt={e.name} className="w-5 h-5 object-contain" onError={(ev:any)=>{ev.currentTarget.style.display="none";ev.currentTarget.parentElement.innerHTML=`<span style="font-size:10px;font-weight:700;color:#64748b">${ini}</span>`;}} /> : <span className="text-[12px] font-bold text-[#0f2644]">{ini}</span>}
              </div>
              <div><div className="text-[12px] font-semibold text-[#0f2644]">{e.name}</div><div className="text-[12px] text-[#0f2644]">{e.role} · {e.country} · {e.type}</div></div>
            </div>;
          })}</div>
        </div>}
        <div className="border-t border-slate-100 pt-5">
          <div className="text-[15px] font-bold text-[#0f2644] mb-2.5">Source</div>
          <a href={act.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2 text-[12px] text-[#2563eb] hover:text-[#1d4ed8] group max-w-full">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            <span className="hover:underline break-all leading-relaxed">Link 1</span>
          </a>
        </div>
        {(()=>{
          const related = getRelated(act, 3);
          if (!related.length) return null;
          const goto = (a:any) => { if (onSelectActivity) onSelectActivity(a); };
          return <div className="border-t border-slate-100 pt-5">
            <div className="flex items-center gap-1.5 mb-3">
              <div className="text-[15px] font-bold text-[#0f2644]">Related Activities</div>
              <HoverTip hideIcon={true} title="Related Activities" label={<span className="text-[12px] text-[#0f2644] cursor-help">ⓘ</span>} desc="Shows other activities from the same signal-type bucket within the same technology segment. For example, if you are viewing a Funding Deployed activity in Software Engineering Agents, only other Funding Deployed activities in Software Engineering Agents are shown here, keeping the context tightly focused on the same type of evidence in the same competitive landscape." />
            </div>
            <div className="space-y-2">{related.map((a:any) => {
              const rlayer = ACT_LAYER[a.id] || "innovation";
              const rcolor = LAYER_COLOR[rlayer];
              return <div key={a.id} className="group p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer bg-white" onClick={()=>goto(a)}>
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{background:rcolor}}/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      <span className="text-[10px] font-mono text-[#0f2644]">{fmtD(a.date)}</span>
                    </div>
                    <p className="text-[12.5px] font-semibold text-[#0f2644] leading-snug group-hover:text-[#059669] transition-colors">{a.headline}</p>
                  </div>
                  <svg width="12" height="12" fill="none" stroke="#94a3b8" strokeWidth="2.5" viewBox="0 0 24 24" className="flex-shrink-0 mt-1 group-hover:stroke-[#059669] transition-colors"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>;
            })}</div>
          </div>;
        })()}
      </div>
    </div>
  </div>;
};


const PLAYERS = [{
  name: "Anthropic",
  primaryRole: "Innovator",
  tier: "Pioneer",
  country: "USA",
  subdomains: ["Software Engineering Agents", "Customer-Facing Conversational & Voice Agents", "Agent Orchestration Frameworks & Developer Infrastructure"],
  alsoRoles: ["Infrastructure", "Commercialiser"],
  overview: "Foundation model provider and direct agentic AI product vendor. Claude Code ($2.5B+ run-rate ARR) is the single largest disclosed revenue line in agentic AI coding. Claude in Chrome is the browser agent. MCP (donated to AAIF) is the de-facto agent integration standard. Amazon $5B investment + $100B compute commitment Apr 2026.",
  signals: ["Claude Code $2.5B run-rate ARR (Feb 2026)", "Amazon $5B strategic investment + $100B AWS commitment (Apr 2026)", "MCP 100M monthly downloads; donated to Linux Foundation AAIF (Dec 2025)", "Accenture Business Group: 30,000 professionals on Claude Code (Dec 2025)"]
}, {
  name: "OpenAI",
  primaryRole: "Innovator",
  tier: "Pioneer",
  country: "USA",
  subdomains: ["Software Engineering Agents", "Customer-Facing Conversational & Voice Agents", "Agent Orchestration Frameworks & Developer Infrastructure"],
  alsoRoles: ["Commercialiser", "Standards-setter"],
  overview: "Foundation model provider with direct coding agent (Codex), computer-use (Operator), and orchestration SDK. AGENTS.md open standard adopted by 60,000+ projects. Adopted MCP March 2025. GPT-5.3-Codex launched May 2026. Codex 1M+ developer users.",
  signals: ["Codex 1M+ developer users (early 2026)", "GPT-5.3-Codex launched May 2026", "AGENTS.md adopted by 60,000+ open-source projects", "Prior failed Windsurf acquisition bid ($3B, May 2025, deal lapsed)"]
}, {
  name: "Anysphere (Cursor)",
  primaryRole: "Commercialiser",
  tier: "Pioneer",
  country: "USA",
  subdomains: ["Software Engineering Agents"],
  alsoRoles: ["Innovator"],
  overview: "Leading AI-native IDE with $2B ARR (Feb 2026), growing toward $6B+ projected by year-end. SpaceX holds a $60B acquisition option. $2.3B Series D (Oct 2025, $29.3B valuation) with Google and Nvidia as strategic investors.",
  signals: ["$2B ARR Feb 2026, $6B+ projected YE2026", "SpaceX $60B acquisition option Apr 2026", "$2.3B Series D at $29.3B Oct 2025", "Cursor agent mode launched Apr 2026"]
}, {
  name: "Cognition AI",
  primaryRole: "Innovator",
  tier: "Pioneer",
  country: "USA",
  subdomains: ["Software Engineering Agents"],
  alsoRoles: ["Commercialiser"],
  overview: "Creator of Devin (first autonomous AI software engineer) and acquirer of Windsurf (Jul 2025). Devin ARR scaled from $1M (Sep 2024) to $73M (Jun 2025). $400M at $10.2B (Sep 2025); $25B valuation talks (Apr 2026). Customers: Goldman Sachs, Citi, Dell, Cisco, Palantir.",
  signals: ["Devin ARR $1M→$73M→$100M+ combined post-acquisition", "SWE-1.5 at 950 tok/s on Cerebras (Oct 2025)", "Goldman Sachs, Citi as production customers", "$400M at $10.2B Sep 2025", "$25B valuation talks Apr 2026"]
}, {
  name: "Sierra",
  primaryRole: "Commercialiser",
  tier: "Pioneer",
  country: "USA",
  subdomains: ["Customer-Facing Conversational & Voice Agents"],
  alsoRoles: ["Innovator"],
  overview: "Dominant pure-play customer experience agent platform. $150M ARR, 40% of Fortune 50 (Feb 2026). $950M Series E at $15.8B (May 2026). Outcome-based pricing (pay per resolution). Acquired Fragment, Opera Tech, Receptive AI in Q1 2026. Salesforce acquisition agreement reported November 2025; $950M Series E raised May 2026.",
  signals: ["$150M ARR Feb 2026; $100M ARR in 7 quarters from launch", "40% Fortune 50 customers", "$950M Series E at $15.8B May 2026", "Agent OS 2.0 + Agent Data Platform Nov 2025"]
}, {
  name: "LangChain Inc.",
  primaryRole: "Infrastructure",
  tier: "Established",
  country: "USA",
  subdomains: ["Agent Orchestration Frameworks & Developer Infrastructure"],
  alsoRoles: ["Standards-setter"],
  overview: "Leading agent engineering platform. LangChain/LangGraph 90M monthly downloads. LangSmith 12x YoY trace volume growth. 35% Fortune 500 reach. $125M Series B at $1.25B (Oct 2025). Strategic investors: ServiceNow, Workday, Cisco, Datadog, Databricks.",
  signals: ["90M monthly downloads LangChain+LangGraph", "35% Fortune 500 reach", "12x LangSmith YoY trace growth", "LangChain 1.0 and LangGraph 1.0 GA Oct 2025", "$125M at $1.25B Oct 2025"]
}, {
  name: "Salesforce",
  primaryRole: "Commercialiser",
  tier: "Established",
  country: "USA",
  subdomains: ["Software Engineering Agents", "Customer-Facing Conversational & Voice Agents"],
  alsoRoles: ["Infrastructure"],
  overview: "Platform incumbent with Agentforce (Atlas Reasoning Engine + Data Cloud). 70% Fortune 500 on Copilot/Agentforce. Agentforce 360 released Oct 2025. 400,000+ custom agents built via Copilot Studio in Q4 2024 alone.",
  signals: ["Agentforce 360 released Oct 2025", "Largest CRM installed base for agent distribution", "400,000+ custom agents built via Copilot Studio Q4 2024"]
}, {
  name: "Microsoft",
  primaryRole: "Infrastructure",
  tier: "Established",
  country: "USA",
  subdomains: ["Software Engineering Agents", "Agent Orchestration Frameworks & Developer Infrastructure"],
  alsoRoles: ["Commercialiser", "Standards-setter"],
  overview: "Platform incumbent across coding (GitHub Copilot), enterprise (Copilot Studio, Agent 365) and infrastructure (Azure AI). Adopted MCP at Build 2025. Agent 365 centralised control plane Nov 2025. 70% Fortune 500 on Copilot.",
  signals: ["Agent 365 centralised control plane Nov 2025", "400,000+ custom agents via Copilot Studio Q4 2024", "MCP adoption announced Build 2025", "Computer use in Copilot Studio May 2025"]
}, {
  name: "Decagon",
  primaryRole: "Commercialiser",
  tier: "Challenger",
  country: "USA",
  subdomains: ["Customer-Facing Conversational & Voice Agents"],
  alsoRoles: [],
  overview: "No. 2 pure-play customer experience agent platform. $4.5B valuation (Jan 2026), $250M Series D. 100+ enterprise customers in 2025 including Avis, Mercado Libre, Deutsche Telekom, Notion, Duolingo. $35M ARR with 80%+ deflection rates.",
  signals: ["$4.5B valuation Jan 2026 (3x in 6 months)", "$250M Series D Coatue + Index Ventures", "Deutsche Telekom commercial pilot + T.Capital investment Nov 2025"]
}, {
  name: "Google", primaryRole: "Commercialiser", tier: "Established", country: "USA",
  subdomains: ["Agent Orchestration Frameworks & Developer Infrastructure", "Software Engineering Agents"],
  alsoRoles: ["Innovator", "Infrastructure"],
  overview: "Google spans the full agentic AI stack: Gemini models, Google Workspace and Cloud AI agent products, and the 2025 $2.4B acquihire of Windsurf (Codeium) leadership. Google's endorsement of MCP as its default agent-tool protocol was the single most consequential interoperability decision in the category.",
  signals: ["Windsurf (Codeium) leadership acquihire $2.4B 2025", "MCP protocol adoption across Cloud AI agents", "Gemini-powered Workspace agents GA", "Google Cloud agent runtime launch"]
}, {
  name: "NVIDIA", primaryRole: "Infrastructure", tier: "Established", country: "USA",
  subdomains: ["Software Engineering Agents", "Customer-Facing Conversational & Voice Agents", "Agent Orchestration Frameworks & Developer Infrastructure"],
  alsoRoles: ["Commercialiser"],
  overview: "NVIDIA shapes agentic AI through hardware and strategic investment. H100/H200 GPUs are the primary inference hardware for all frontier agent deployments. NVentures investments (PolyAI Series C lead) signal NVIDIA's bet on voice and orchestration as the primary inference workloads of the agentic era.",
  signals: ["NVentures lead investor in PolyAI Series C", "H100 inference demand overtaking training H1 2025", "NVIDIA AI Enterprise agent runtime support"]
}];
const GEO_DATA = [{
  country: "United States",
  players: 11,
  funding: "$5B+",
  deployments: 8,
  inn: 44,
  cmr: 41,
  str: 13,
  desc: "Dominant across all three signal layers. Foundation labs (Anthropic, OpenAI, Google), coding agents (Cognition, Anysphere), customer experience leaders (Sierra, Decagon), orchestration infrastructure (LangChain), compute providers (NVIDIA) and platform incumbents (Salesforce, Microsoft) are all US-headquartered. Accounts for over 95% of named funding rounds in the evidence bundle."
}, {
  country: "Sweden",
  players: null,
  funding: null,
  deployments: 1,
  inn: 0,
  cmr: 1,
  str: 0,
  desc: "Home to Klarna, which deployed the largest publicly confirmed agentic deployment by user scale as of Q1 2026, a LangGraph-powered customer support layer serving 85 million users. Klarna cited LangChain 1.0's stable release as the direct trigger for committing a mission-critical customer-facing workload to the framework."
}, {
  country: "Brazil",
  players: null,
  funding: null,
  deployments: 1,
  inn: 0,
  cmr: 1,
  str: 0,
  desc: "Nubank deployed an agentic ETL pipeline using orchestration frameworks to automate data engineering workflows at scale. Represents early adoption of agent orchestration in Latin America's largest fintech, confirming that agentic infrastructure is being adopted outside US-headquartered organisations."
}, {
  country: "European Union",
  players: null,
  funding: null,
  deployments: 1,
  inn: 0,
  cmr: 2,
  str: 6,
  desc: "PolyAI (UK) was selected by Deutsche Telekom as voice-agent vendor-of-record across 12 European markets, the largest confirmed cross-geography carrier deployment in this analysis. The EU is also the dominant structural actor in the evidence base: the EU AI Act's general-purpose AI obligations and biometric voice provisions account for the majority of regulatory milestones profiled across all three technology segments."
}, {
  country: "United Kingdom",
  players: null,
  funding: null,
  deployments: 2,
  inn: 0,
  cmr: 3,
  str: 0,
  isCountryProfile: true,
  desc: "The United Kingdom's presence in this analysis is deployment-led rather than provider-led. PolyAI (London-headquartered) secured vendor-of-record status with Deutsche Telekom across 12 European markets, the largest confirmed cross-geography carrier deployment in this analysis. UK Government Digital Service piloted autonomous COBOL-to-Python code-migration agents across three central departments, the first government-scale code-migration pilot recorded. Vodafone UK deployed Sierra-powered conversational agents across 5 million mobile customers for billing and technical support."
}, {
  country: "India",
  players: null,
  funding: null,
  deployments: 0,
  inn: 1,
  cmr: 0,
  str: 0,
  isCountryProfile: true,
  desc: "Sarvam AI raised $41M to build multilingual voice AI covering 22 Indian languages, the first significant VC commitment to non-English-native voice-agent infrastructure in this analysis. India's 500M+ smartphone users represent the largest untapped voice-agent deployment market globally. Sarvam's raise signals the supply chain is fragmenting geographically and that regional infrastructure for non-English languages is independently fundable."
}];
const FUNDING_GEO = [{
  city: "San Francisco, US",
  company: "CrewAI",
  amount: "$18M",
  round: "Series A",
  lead: "Insight Partners",
  use: "Expanding open-source multi-agent framework into an enterprise platform with role-based agent person...",
  subdomain: "Agent Orchestration & Development Frameworks",
  year: 2024
}, {
  city: "San Francisco, US",
  company: "Letta",
  amount: "$10M",
  round: "Seed",
  lead: "Felicis Ventures",
  use: "Commercialising the MemGPT research from UC Berkeley as the first dedicated persistent agent memory ...",
  subdomain: "Agent Orchestration Frameworks & Developer Infrastructure",
  year: 2024
}, {
  city: "San Francisco, US",
  company: "Skyfire Systems",
  amount: "$8.5M",
  round: "Seed",
  lead: "Neotribe Ventures",
  use: "Building an AI agent payment protocol, the first dedicated financial-autonomy infrastructure enabli...",
  subdomain: "Agent Orchestration Frameworks & Developer Infrastructure",
  year: 2024
}, {
  city: "Redwood City, US",
  company: "Cognition AI",
  amount: "$175M",
  round: "Series B",
  lead: "Undisclosed",
  use: "Scaling Devin autonomous software engineering agent; acquiring Windsurf IDE to build an agent-native...",
  subdomain: "Agent Orchestration & Development Frameworks",
  year: 2024
}, {
  city: "San Francisco, US",
  company: "Anthropic",
  amount: "$5B+",
  round: "Strategic",
  lead: "Google / Amazon",
  use: "Developing foundation models (Claude) and the Model Context Protocol (MCP) open standard for agent t...",
  subdomain: "Agent Orchestration Frameworks & Developer Infrastructure",
  year: 2024
}];
const WEAK_SIGNALS = [{
  id: "WS-01",
  scope: "Agent Orchestration Frameworks & Developer Infrastructure",
  headline: "Funding for agent-specific payment protocols signals a shift toward agents as independent economic actors.",
  evidence: "Skyfire Systems raised $8.5M seed to build an AI agent payment protocol, the first dedicated financial protocol layer designed specifically for autonomous agent transactions.",
  significance: "While the dominant narrative focuses on agents as software tools, this implies a move toward agents as economically autonomous participants capable of transacting independently."
}, {
  id: "WS-02",
  scope: "Agent Orchestration",
  headline: "Entry of data validation specialists identifies fuzzy LLM outputs, not insufficient intelligence, as the core orchestration risk.",
  evidence: "PydanticAI launch by Pydantic (a data validation library used by millions of developers) entering the agent orchestration space with structured output enforcement.",
  significance: "The dominant picture emphasises intelligence and conversation aspects of orchestration. Pydantic's entry reframes the bottleneck as output reliability, not reasoning capability."
}, {
  id: "WS-03",
  scope: "Agent Orchestration",
  headline: "Microsoft's lifecycle management patent flags resource exhaustion as a hidden operational risk at scale.",
  evidence: "Patent explicitly addresses the zombie agent problem where autonomous loops consume resources indefinitely without progress, covering agent spawning, monitoring, and resource-controlled retirement.",
  significance: "Commercialisation signals focus on agent performance and ROI, but this patent highlights a hidden operational risk: agents that loop without termination, consuming compute indefinitely."
}, {
  id: "WS-04",
  scope: "Cross-technology segment",
  headline: "Consolidation of agent, reasoning model, and IDE suggests agent-native development environments are emerging as the dominant deployment model.",
  evidence: "Cognition AI's acquisition of the remaining Windsurf IDE entity and OpenAI o1 integration into Devin deepen its position across the Software Engineering Agents and Orchestration technology segments simultaneously.",
  significance: "The most mature application of Agentic AI may not be a general-purpose assistant but a vertically integrated developer tool combining coding, reasoning, and deployment."
}];
const CONTRADICTIONS = [{
  id: "CT-01",
  scope: "Safety, Governance & Observability",
  headline: "Comprehensive regulatory frameworks have been ratified despite near-total absence of commercial safety products.",
  findingA: "EU AI Act ratified and NIST safety benchmarks published, both comprehensive frameworks for autonomous systems, but with no commercial safety product category yet established.",
  findingB: "Maturity assessment assigns Lab stage, noting total absence of commercial safety products in the evidence base.",
  nature: "Regulation is defining safety requirements before commercial products exist to fulfil them, a governance gap where compliance is required before compliant products are available.",
  resolution: "Genuinely unresolved",
  note: "Watch for emergence of commercial safety-audit tools specifically addressing EU AI Act conformity requirements for autonomous agents."
}, {
  id: "CT-02",
  scope: "Agent Orchestration Frameworks & Developer Infrastructure",
  headline: "China has significant innovation presence in tool-use patents but zero commercial visibility.",
  findingA: "Significant patent filing volumes from Chinese firms (Baidu, Alibaba) in Tool-Use.",
  findingB: "Commercial records show activity exclusively from US entities, no named Chinese commercial presence in any deployment or partnership record.",
  nature: "US regulatory reporting requirements may be creating a structural barrier limiting commercial visibility of Chinese deployments in Western markets.",
  resolution: "Evidence leans: Finding B dominant",
  note: "Monitor for Chinese commercial agent tool launches outside the US market."
}, {
  id: "CT-03",
  scope: "Agent Orchestration",
  headline: "Orchestration assigned Scaling maturity despite commercial winners still being determined.",
  findingA: "Scaling stage based on stable 1.0 releases and high-volume deployments (Klarna 85M users, Nubank ETL migration) confirming production readiness.",
  findingB: "Activity breakdown notes the technology segment is dominated by strategic commitments, suggesting competitive consolidation is still underway.",
  nature: "High activity but undetermined winners suggests the market is in a competitive shakeout, high volume does not guarantee category-winner status.",
  resolution: "Evidence leans: Finding A dominant",
  note: "1.0 stable releases and massive deployments indicate the infrastructure layer has crossed the production threshold."
}];
const getDominantLayer = (inn, cmr, str) => {
  const max = Math.max(inn, cmr, str);
  if (max === inn) return {
    label: "Innovation-Led",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    color: "#059669"
  };
  if (max === cmr) return {
    label: "Commercial-Led",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    color: "#059669"
  };
  return {
    label: "Structural-Led",
    bg: "bg-amber-50 text-amber-700 border-amber-200",
    color: "#166534"
  };
};

// ── Geographic Reach Map (static SVG, no runtime deps) ───────────────────
const WORLD_PATHS = [{
  "id": 242,
  "d": "M816,239L816,239L817,239L817,240L815,241L814,240L814,239L815,239L816,239ZM0,236L1,236L0,237L0,237L819,237L817,238L817,237L818,237L819,236L820,236L0,236Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 834,
  "d": "M487,202L488,202L496,207L496,208L499,210L498,213L498,214L500,215L500,216L499,217L499,218L499,219L500,220L501,222L502,223L500,224L498,225L496,225L495,226L494,226L493,226L490,225L489,226L488,223L487,222L487,221L485,221L483,220L482,220L481,219L480,219L479,216L478,215L477,213L477,212L477,210L478,210L479,209L480,208L480,208L480,207L480,206L479,205L480,205L480,204L479,203L480,202L483,202L487,202Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 732,
  "d": "M390,139L390,139L390,139L390,143L383,142L383,148L381,148L380,149L381,153L372,153L371,153L371,152L371,152L376,152L377,151L378,150L378,147L382,145L383,142L383,142L384,140L386,140L387,140L388,140L389,140L390,140L390,139L390,139Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 124,
  "d": "M130.2,91.1L129.9,91.1L125.5,88.9L123.9,88L119.7,87L118.5,85.1L118.8,83.7L115.9,82.8L115.5,81L112.7,79.4L112.7,78.2L113.9,77.1L113.9,75.7L110,74.3L107.7,71.8L106.2,70.2L104.2,69.2L102.6,68.3L101.4,67.1L99.1,67.9L96.9,69.1L94.9,67.6L93.3,66.7L91.1,66L88.8,66L88.8,53.3L88.9,45.1L93.1,45.6L96.7,46.7L99.1,46.9L101.1,46L103.8,45.3L107.2,45.5L110.6,44.6L114.4,44L115.9,44.9L117.6,44.4L118.1,43.4L119.7,43.6L123.6,45.6L126.6,44.1L126.9,45.8L129.7,45.4L130.6,44.8L133.3,44.9L136.8,45.8L142.1,46.6L145.3,47L147.5,46.9L150.6,48L147.4,49.1L151.5,49.6L157.6,49.3L159.6,48.9L162,50.3L164.5,49.1L162.1,48.2L163.6,47.4L166.4,47.3L168.2,47.1L170.1,47.6L172.3,48.8L174.9,48.7L178.9,49.7L182.4,49.3L185.8,49.4L185.5,48L187.5,47.6L191.1,48.4L191,50.5L192.5,48.7L194.3,48.7L195.4,46.5L192.9,45.1L190.3,44.2L190.4,41.8L193.1,40.2L196.1,40.5L198.4,41.5L201.5,44L199.5,45.1L203.8,45.6L203.7,47.8L206.8,46.1L209.5,47.5L208.8,49.2L211,50.7L213.4,49.1L215.1,47.1L215.2,44.7L218.4,44.9L221.8,45.2L224.9,46.3L225,47.4L223.3,48.6L224.9,49.8L224.6,50.9L220.2,52.4L217,52.8L214.6,52.1L214,53.2L211.8,55.1L211.1,56.1L208.5,57.6L205.2,57.7L203.4,58.6L203.2,60.1L200.6,60.4L197.8,62.2L195.3,64.7L194.5,66.4L194.3,69L197.7,69.4L198.7,71.5L199.8,73.1L203,72.7L207.2,73.7L209.5,74.5L211.1,75.6L213.9,76.2L216.4,77.1L220.1,77.2L222.6,77.4L222.2,79.4L222.9,81.6L224.6,84.1L228,86.2L229.7,85.5L231,83.2L229.8,79.7L228.2,78.5L231.8,77.5L234.4,75.9L235.7,74.4L235.5,72.9L233.9,71L231.2,69.3L233.8,67L232.8,65L232.1,61.5L233.7,61L237.6,61.6L239.9,61.8L241.8,61.2L243.9,62L246.7,63.3L247.4,64.1L251.5,64.3L251.4,66.2L252.2,69L254.3,69.3L255.9,70.6L259.2,69.4L261.4,67L262.9,65.9L264.7,67.9L267.6,70.7L270.2,73.4L269.2,74.8L272.3,76.1L274.3,77.3L277.9,77.9L279.4,78.6L280.3,80.5L282.1,80.8L283,81.6L283.2,84.1L281.5,85L279.9,85.7L276.1,86.5L273.3,88.4L269.4,88.7L264.5,88.2L261.1,88.2L258.8,88.4L256.9,90L253.9,91L250.7,93.9L248,96L250,95.6L253.6,92.7L258.4,90.8L261.8,90.6L263.8,91.7L261.7,93.2L262.4,95.6L263.1,97.2L266.1,98.4L269.9,98L272.2,95.5L272.3,97.2L273.8,98L271,99.4L265.9,100.7L263.7,101.6L261.1,103.2L259.4,103.1L259.3,101.2L263.3,99.4L259.6,99.4L257.1,99.7L255.6,98.4L255.6,95.4L254.6,94.8L253,95.1L252.3,94.6L250.6,96.2L249.9,98L249.1,99L248.1,99.3L247.4,99.4L247.1,100L242.9,100L239.5,100L238.4,100.4L236,102L235.8,102.2L235,103L232.9,103L230.7,103.1L229.7,103.4L230,103.8L230.2,104.5L230.2,104.7L227.2,105.9L224.9,106.2L222.2,107.4L221.6,107.4L220.9,107L220.6,106.7L220.7,106.5L221.2,105.7L222.2,104.5L222.9,103.2L222.5,101.2L222,99.2L219.6,98.2L219.9,97.8L219.5,97.5L218.9,97.5L218.5,97.2L218.3,96.6L217.9,96.9L217.3,96.8L217.4,96.6L216.9,96.4L216.7,95.8L214.9,95.1L213.1,94.3L210.8,93.5L208.7,92.7L206.7,93.3L205.9,93.3L203.1,92.7L201.3,93L199.1,92.3L196.7,92L195.1,91.8L194.4,91.5L194,90.2L193.3,90.3L193.3,91.1L188.5,91.1L180.7,91.1L173,91.1L166.2,91.1L159.3,91.1L152.6,91.1L145.7,91.1L143.4,91.1L136.7,91.1L130.2,91.1ZM218.7,61.2L220.4,60.2L223.5,60.2L223.5,60.6L220.8,61.9L219.2,61.8L218.7,61.2ZM228.3,38.2L225.8,37L225.9,36.2L227,36.1L232.2,36.3L236.1,37.6L236.3,38.2L233.9,38.1L231.4,38.1L228.9,38.4L228.3,38.2ZM227.1,62L227.9,61.4L228.9,61.4L229.4,61.9L228.6,63L227.6,62.8L227,62.2L227.1,62ZM196.8,33.4L195.5,34.2L192.2,34.1L189.5,33.5L190.7,32.5L193.9,31.9L195.9,32.7L196.8,33.4ZM196.3,27.7L195.2,27.8L190.9,27.7L190.3,27L194.9,27.1L196.5,27.5L196.3,27.7ZM189.6,25L192.3,25.7L191.7,26.5L188.3,27L186.5,26.5L185.5,25.7L185.3,24.7L188.3,24.8L189.6,25ZM209.2,34.7L205.5,34.4L199.5,33.7L198.7,32.5L198.4,31.4L196.1,30.4L191.4,30.1L188.8,29.4L189.6,28.5L194.3,28.7L196.9,29.4L201.3,29.4L203.3,30.1L202.8,30.9L205.4,31.4L206.9,32L209.9,32.1L213.3,32.3L216.9,31.8L221.5,31.6L225.2,31.7L227.7,32.6L228.2,33.5L226.7,34.1L223.3,34.6L220.4,34.3L213.9,34.6L209.2,34.7ZM156.6,26.3L159.8,26.7L159,27.3L154.8,28L151.4,27.3L153.2,26.6L156.6,26.3ZM157.3,24.9L160.2,25.3L157.4,25.8L153.7,25.8L153.7,25.4L156,24.8L157.3,24.9ZM283.4,86L282.1,87.4L280.6,89.3L282.1,88.6L283.6,89L282.8,89.8L284.9,90.4L285.9,89.9L288.2,90.6L287.5,92.2L289.1,91.8L289.4,93L290.1,94.4L289.1,96.3L288.1,96.4L286.6,96L287.1,94.2L286.5,93.9L283.8,95.8L282.5,95.7L284.1,94.7L281.9,94.1L279.4,94.3L275,94.2L274.7,93.6L276.1,92.8L275.1,92.2L277,90.8L279.4,87.3L280.8,86L282.7,85.3L283.8,85.4L283.4,86ZM218.9,55.3L221.4,56.1L224,56.8L224.2,57.8L225.9,57.7L227.5,58.4L225.5,59.1L222,58.6L220.7,57.6L218.4,58.7L215.2,59.9L214.4,58.6L211.3,58.8L213.3,57.7L213.6,56L214.4,53.9L216,54.1L216.4,55.1L217.6,54.7L218.9,55.3ZM230.6,39.2L232.7,38.3L237.8,39.5L240.9,40.5L241.2,41.5L245.4,41L247.8,42.4L253.3,43.3L255.3,44.2L257.5,46.3L253.3,47.3L258.6,48.7L262.3,49.2L265.5,51.3L269.1,51.4L268.4,53L264.4,55.6L261.6,54.6L258,52.5L255.1,52.7L254.8,54L257.2,55.3L260.3,56.3L261.2,56.9L262.7,59.1L261.9,60.7L259,60.1L253.3,58.3L256.5,60.3L258.9,61.6L259.3,62.4L253.1,61.5L248.2,60.2L245.5,59.1L246.3,58.5L242.9,57.3L239.5,56.3L239.6,56.9L233,57.3L231.1,56.5L232.6,54.9L236.9,54.8L241.5,54.5L240.8,53.8L241.6,52.6L244.5,50.5L243.9,49.5L243,48.7L239.5,47.7L234.9,46.9L236.4,46.3L234,45L231.9,44.8L230.2,44.1L228.9,44.7L224.8,45L216.5,44.5L211.7,43.9L208,43.5L206.1,42.8L208.5,41.7L205.3,41.7L204.5,39.5L206.3,37.5L208.6,36.6L214.5,36L212.8,37.4L214.6,38.8L216.7,37L222.5,36.1L226.4,38.4L226.1,39.9L230.6,39.2ZM194.7,35.3L199.5,35.3L203.8,35.9L200.4,37.9L197.7,38.3L195.3,39.9L192.7,39.9L191.3,37.9L191.3,36.8L192.5,35.9L194.7,35.3ZM130.2,30.9L134,29.2L138.7,27.7L142.2,27.8L145.3,27.5L145,29.2L143.3,29.9L141.1,30L136.9,31L133.3,31.3L130.2,30.9ZM107.7,79.9L109.9,79.7L109.2,82.3L111.2,84L110.3,84L108.9,83L108.1,82L106.9,81.3L106.5,80.3L106.6,79.6L107.7,79.9ZM169.7,23.8L174.2,24.1L180.3,24.9L182.1,25.9L183,26.9L179.3,26.6L175.5,25.9L170.4,25.8L172.6,25.2L169.9,24.6L169.7,23.8ZM128.7,92.2L127.5,92.5L123.8,91.5L123.1,90.7L121.1,89.9L120.7,89.3L118.3,88.9L117.4,87.7L117.6,87.2L120,87.7L121.4,88L123.6,88.2L124.3,89L125.5,90.1L127.7,91L128.7,92.2ZM133.2,34.6L136.4,35L142.2,35.1L144.4,35.8L146.9,36.7L144,37.3L138.4,38.8L135.6,40.4L135.6,41.4L129.6,42.4L128.4,41.5L123.2,40.3L124.1,39.4L125.7,37.7L127.7,36.3L125.5,34.9L133.2,34.6ZM164.4,31.5L166.4,31.1L168.8,31.2L169.2,32.3L167.8,33.3L160.1,33.7L154.4,34.6L150.9,34.7L150.6,34L155.4,33L145.1,33.2L141.9,32.8L145,30.7L147.1,30L153.5,30.8L157.6,32.1L161.6,32.3L158.3,30.2L160.4,29.3L162.7,29.6L163.5,30.7L164.4,31.5ZM167.4,37.6L169.9,38.5L171.3,40.7L172.1,42.2L175.9,43.3L180,44.4L179.7,45.4L176,45.5L177.5,46.4L176.7,47.2L172.6,46.9L168.6,46.3L166,46.4L161.7,47.2L155.9,47.5L151.9,47.7L150.7,46.6L147.6,46L145.5,46.3L142.7,44.5L144.2,44.3L147.8,43.9L151,44L153.9,43.6L149.5,43.1L144.7,43.3L141.4,43.2L140.2,42.4L145.5,41.5L142,41.6L138,41L139.9,39.3L141.5,38.4L147.6,37.1L150,37.5L148.8,38.6L153.9,37.9L157,39L159.6,37.9L161.7,38.6L163.6,40.8L164.7,39.9L163.1,37.6L165.1,37.3L167.4,37.6ZM181.2,38.4L178.7,37L181.4,35.9L184.1,36.4L188.2,36.1L188.8,36.7L186.7,37.8L190.1,38.8L189.7,40.8L186,41.6L183.8,41.4L182.2,40.6L176.5,38.9L176.6,38.2L181.2,38.4ZM167.2,36.4L170.2,36.4L172,36.8L170,38.3L166.4,36.8L167.2,36.4ZM185.6,29.5L187.4,30.5L187.5,31.7L186.4,33.3L182.7,33.6L180.2,33.2L180.3,31.9L176.5,32.1L176.4,30.4L178.8,30.4L182.3,29.7L185.5,29.8L185.6,29.5ZM191.3,20.9L192.9,20.2L195.2,20L194.2,19.5L199.5,19.4L202.4,20.6L206.3,21.1L210,21.5L211.8,23L214.5,23.7L211.4,24.4L207.2,26L203.2,26.2L198.5,25.9L196,25L196,24.2L197.8,23.6L193.7,23.6L191.2,22.9L189.7,21.9L191.3,20.9ZM201.4,18L204.8,17.6L207.4,17.5L211.9,17.2L215.3,16.3L218.1,16.4L220.5,17.1L222.3,15.9L225.3,15.5L229.4,15.3L236.3,15.2L237.5,15.4L244.1,15L249,15.2L254,15.3L260.1,15.5L265,15.8L269.1,16.4L269,17L263.5,17.9L257.9,18.4L255.9,18.9L260.9,18.9L255.5,20.2L251.8,20.9L247.9,22.7L243.2,23L241.7,23.5L234.8,23.7L238,24L236.4,24.4L238.3,25.5L236.1,26.3L232.6,26.9L231.5,27.8L228.3,28.4L228.6,28.9L232.5,28.8L232.6,29.4L226.5,30.7L220.5,30.1L213.9,30.4L210.5,30.2L206.2,30.1L205.9,29L210.1,28.5L209,26.9L210.4,26.7L216.4,27.7L213.3,26.3L209.6,25.8L211.5,25L215.5,24.5L216.2,23.7L213,22.8L212,21.7L218.2,21.8L220,22L223.6,21.2L218.4,20.9L210.5,21.1L206.4,20.3L204.5,19.4L201.9,18.8L201.4,18ZM238.7,50.1L237.2,50.8L234.6,50.9L234.1,49.8L235,48.6L237.1,48.3L238.9,48.9L238.9,49.8L238.7,50.1ZM190.8,45.6L192.1,46.4L190.7,47.2L187.7,46.5L185.8,46.8L182.7,45.8L184.7,45.1L186.3,44.1L188.7,44.8L190.1,45.2L190.8,45.6ZM263,89.2L263.8,89L266.8,89.5L269.2,90.5L269.2,90.9L268.1,90.9L265.2,90.2L263,89.2ZM264.2,95.5L265,96.6L266.6,96.9L268.7,96.8L267.6,97.7L266.8,97.8L263.9,96.9L263.3,96.2L264.2,95.5Z",
  "fill": "#86efac",
  "name": "Canada",
  "score": 2
}, {
  "id": 840,
  "d": "M130.2,91.1L136.7,91.1L143.4,91.1L145.7,91.1L152.6,91.1L159.3,91.1L166.2,91.1L173,91.1L180.7,91.1L188.5,91.1L193.3,91.1L193.3,90.3L194,90.2L194.4,91.5L195.1,91.8L196.7,92L199.1,92.3L201.3,93L203.1,92.7L205.9,93.3L206.7,93.3L208.7,92.7L210.8,93.5L213.1,94.3L214.9,95.1L216.7,95.8L216.9,96.4L217.4,96.6L217.3,96.8L217.9,96.9L218.3,96.6L218.5,97.2L218.9,97.5L219.5,97.5L219.9,97.8L219.6,98.2L222,99.2L222.5,101.2L222.9,103.2L222.2,104.5L221.2,105.7L220.7,106.5L220.6,106.7L220.9,107L221.6,107.4L222.2,107.4L224.9,106.2L227.2,105.9L230.2,104.7L230.2,104.5L230,103.8L229.7,103.4L230.7,103.1L232.9,103L235,103L235.8,102.2L236,102L238.4,100.4L239.5,100L242.9,100L247.1,100L247.4,99.4L248.1,99.3L249.1,99L249.9,98L250.6,96.2L252.3,94.6L253,95.1L254.6,94.8L255.6,95.4L255.6,98.4L257.1,99.7L257.5,100.4L255,101.5L252.7,102.3L250.3,102.9L249.1,104.2L248.7,104.7L248.7,105.9L249.4,107.1L250.4,107.2L250.1,106.3L250.8,106.8L250.6,107.5L249.1,107.8L248,107.8L246.3,108.2L245.3,108.3L244,108.4L242.1,109L245.5,108.6L246.1,109L242.9,109.7L241.5,109.7L241.5,109.4L240.9,110.1L241.5,110.2L241,111.8L239.4,113.5L239.2,112.9L238.7,112.8L238,112.2L238.4,113.4L239,113.8L239,114.7L238.3,115.5L237,117.3L236.8,117.2L237.5,115.7L236.4,114.8L236.1,113L235.7,114L236.1,115.4L234.6,115L236.2,115.7L236.3,117.9L236.9,118L237.2,118.8L237.5,121L236.1,122.6L233.7,123.3L232.2,124.6L231.1,124.8L229.9,125.6L229.6,126.3L227.1,127.8L225.8,128.8L224.7,130.1L224.4,131.7L224.8,133.3L225.5,135.2L226.6,136.7L226.6,137.7L227.7,140.3L227.6,141.8L227.5,142.6L226.9,144L226.2,144.3L225.1,144L224.7,143L223.9,142.5L222.7,140.6L221.6,138.9L221.3,138L221.7,136.6L221.1,135.3L219.3,133.5L218.4,133.1L216.1,134.1L215.7,134L214.6,133L213.2,132.4L210.6,132.7L208.6,132.5L206.9,132.6L205.9,133L206.3,133.6L206.3,134.5L206.8,134.9L206.3,135.2L205.5,134.9L204.6,135.3L203,135.2L201.3,134.1L199.3,134.3L197.7,133.8L196.2,134L194.3,134.5L192.2,136.1L190,137.1L188.7,138.2L188.2,139.2L188.2,140.7L188.3,141.8L188.7,142.5L187.8,142.6L186.2,142.1L184.5,141.4L183.8,140.4L183.3,138.8L182,137.5L181.2,136.2L180,134.7L178.4,133.8L176.6,133.9L175.1,135.6L173.3,135L172.1,134.3L171.5,133.1L170.8,131.9L169.4,130.9L168.2,130.2L167.4,129.4L163.5,129.4L163.5,130.4L161.6,130.4L157.1,130.4L151.9,128.8L148.5,127.7L148.7,127.3L145.8,127.5L143.2,127.7L142.8,126.6L141.4,125.3L140.3,125L140,124.4L138.8,124.3L137.9,123.7L135.8,123.4L135.2,123.1L135,121.9L132.8,119.6L130.9,116.6L130.9,116L129.9,115.3L128.2,113.4L127.9,111.6L126.7,110.4L127.2,108.6L127.1,106.7L126.3,105L127.2,102.9L127.5,100.9L127.8,98.8L127.4,95.9L126.7,94L126,92.9L126.3,92.5L129.6,93.2L130.8,95.3L131.3,94.8L131,92.9L130.2,91.1ZM56,155.4L56.4,155.6L56.8,155.9L57.4,156.6L57.3,156.8L56.4,157.2L55.7,157.6L55.4,158L54.8,157.6L54.9,157L54.5,156.2L54.6,156L55,155.6L54.9,155.2L55,155L55.2,155L56,155.4ZM54.7,153.9L54.5,154.1L53.7,154.3L53.3,153.8L53.1,153.6L53,153.5L53.3,153.3L54.1,153.5L54.7,153.9ZM52.9,152.9L52.9,153.2L51.6,153.1L51.8,152.8L52.9,152.9ZM50.1,151.7L50.2,151.9L50.9,152.6L50.8,152.7L50.6,152.7L49.8,152.6L49.5,152.1L49.4,152L50.1,151.7ZM47,150.6L47,151.2L46.8,151.4L46,151L46.1,150.8L46.5,150.6L47,150.6ZM30.8,65.8L32.6,66L32.8,66.9L31.4,67.2L30,66.8L28.6,66.2L30.8,65.8ZM61,71.2L62.5,71.3L63.5,72L61.5,73.1L59.2,73.9L58,73.4L57.7,72.3L59.8,71.5L61,71.2ZM88.9,45.1L88.8,53.3L88.8,66L91.1,66L93.3,66.7L94.9,67.6L96.9,69.1L99.1,67.9L101.4,67.1L102.6,68.3L104.2,69.2L106.2,70.2L107.7,71.8L110,74.3L113.9,75.7L113.9,77.1L112.7,78.2L111.4,77.4L109.4,76.7L108.8,74.7L105.8,72.9L104.6,70.8L102.4,70.7L98.8,70.6L96.1,70L91.4,67.7L89.2,67.3L85.2,66.5L82.1,66.7L77.6,65.6L74.9,64.7L72.4,65.2L72.8,66.7L71.6,66.9L69,67.3L66.9,68.1L64.4,68.5L64.1,67.2L65.1,65.1L67.5,64.4L66.9,63.8L64,65L62.5,66.5L59.2,68.1L60.8,69.2L58.7,70.8L56.2,71.7L54,72.4L53.4,73.4L49.8,74.5L49.1,75.6L46.5,76.5L44.9,76.3L42.8,77L40.5,77.7L38.6,78.5L34.7,79.1L34.3,78.7L36.8,77.7L39,77L41.4,75.8L44.3,75.5L45.4,74.6L48.6,73.3L49.1,72.8L50.7,72.1L51.1,70.4L52.3,69.1L49.7,69.7L48.9,69.4L47.7,70.2L46.2,69L45.6,69.8L44.7,68.7L42.5,69.6L41.1,69.6L40.9,68.3L41.3,67.5L39.8,66.7L36.9,67.1L34.9,66.1L33.4,65.5L33.4,64.3L31.6,63.3L32.5,62.1L34.4,60.8L35.2,59.7L37,59.5L38.6,59.9L40.4,58.8L42.1,59L43.8,58.3L43.4,57.3L42.1,56.9L43.8,56L42.4,56.1L40,56.5L39.3,57L37.5,56.5L34.3,56.8L30.9,56.3L30,55.4L27.1,54.1L30.3,53.1L35.4,52.1L37.2,52.1L36.9,53.2L41.7,53.1L39.9,51.7L37.1,50.9L35.5,49.7L33.3,48.8L30.2,48.1L31.4,46.9L35.5,46.9L38.3,45.8L38.9,44.8L41.2,43.7L43.4,43.4L47.7,42.5L49.8,42.6L53.3,41.4L56.8,41.9L58.4,42.9L59.5,42.5L63.3,42.6L63.2,43.1L66.7,43.5L69,43.3L73.8,44L78.1,44.2L79.9,44.5L82.9,44.1L86.4,44.8L88.9,45.1ZM18.8,58.3L20.2,58.7L21.7,58.5L23.5,59L25.8,59.3L25.6,59.6L23.8,60.1L22.1,59.6L21.2,59.2L19.2,59.3L18.7,59.1L18.8,58.3Z",
  "fill": "#15803d",
  "name": "United States",
  "score": 10
}, {
  "id": 398,
  "d": "M609,91L607,92L605,92L605,95L604,96L600,95L598,99L597,99L592,100L594,104L593,105L593,106L591,106L590,105L587,105L583,105L582,105L579,104L578,104L577,106L574,105L572,105L572,106L570,107L567,108L566,110L566,110L565,109L562,109L562,107L560,107L561,104L558,103L554,103L551,103L549,101L547,101L544,99L543,99L537,100L538,108L536,108L535,107L533,106L531,106L530,107L530,107L530,106L530,105L527,104L526,102L525,102L525,101L527,101L527,100L529,99L531,99L531,97L531,96L529,96L527,95L524,96L522,97L521,97L521,95L520,94L518,94L516,93L517,91L517,90L518,88L521,89L521,88L526,85L529,85L534,87L537,88L539,87L543,87L546,88L547,87L550,87L550,86L547,85L549,83L548,83L551,82L549,81L550,80L559,79L560,79L565,78L567,77L571,77L572,80L575,79L577,80L577,81L579,81L585,79L584,80L587,81L592,87L594,86L597,87L600,87L601,87L602,88L604,89L605,90L608,89L609,91Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 860,
  "d": "M538,108L537,100L543,99L544,99L547,101L549,101L551,103L554,103L558,103L561,104L560,107L562,107L562,109L565,109L566,110L566,110L567,108L570,107L572,106L572,106L570,108L572,109L574,108L576,109L574,111L572,111L571,111L571,110L571,109L568,110L567,111L566,112L564,112L564,113L565,114L566,115L565,118L563,117L562,117L562,116L559,115L556,114L555,113L552,111L551,109L550,108L548,108L547,108L547,106L544,105L542,106L540,107L540,108L538,108Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 598,
  "d": "M731,206L735,207L739,209L741,210L742,211L743,212L746,214L747,215L745,215L745,216L747,218L749,220L750,220L750,221L752,222L751,222L754,223L753,224L752,224L751,223L749,223L747,223L745,221L744,220L743,218L740,217L738,218L736,218L737,220L735,221L734,220L731,220L731,213L731,206ZM758,208L759,209L759,210L758,211L758,209L757,208L756,208L755,207L753,206L754,206L755,206L756,207L757,207L758,208ZM755,213L753,214L752,214L751,214L749,213L748,213L748,212L750,212L751,212L752,211L752,211L752,212L754,212L754,211L755,211L755,209L757,209L757,210L757,211L756,212L755,212L755,213ZM763,212L763,212L764,214L765,215L765,215L764,215L763,215L762,213L762,211L762,211L763,212Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 360,
  "d": "M731,206L731,213L731,220L729,218L727,218L726,219L724,219L724,217L726,216L725,214L724,212L720,210L718,210L715,208L714,209L713,209L712,208L712,207L711,206L713,206L715,206L715,205L711,205L710,204L708,203L707,202L710,202L712,201L715,202L716,203L716,206L719,208L720,205L723,204L725,204L727,205L729,205L731,206ZM695,220L695,220L695,221L693,223L692,223L691,223L691,222L692,221L695,220ZM716,215L716,214L716,213L716,212L717,213L717,214L716,215ZM679,191L677,193L679,195L679,196L681,198L678,198L678,200L678,202L676,203L675,206L675,209L674,208L672,209L671,208L669,208L668,207L665,208L664,207L663,207L661,207L661,204L660,203L659,201L658,199L658,197L660,196L660,197L662,198L663,198L665,198L666,197L667,197L669,197L671,197L672,194L673,193L674,190L677,190L679,191ZM705,206L707,207L708,209L706,208L704,208L703,208L701,208L702,206L705,206ZM699,208L697,208L697,207L699,207L700,208L699,208ZM701,195L702,196L703,197L703,198L703,199L702,199L702,201L702,202L702,202L701,201L700,198L701,196L701,195ZM690,198L693,198L695,196L695,197L693,199L692,200L690,199L686,199L684,200L683,201L686,203L687,202L691,201L691,202L690,202L689,203L687,204L689,207L689,208L691,210L691,212L689,213L688,212L690,210L687,211L687,210L687,209L685,208L686,206L684,207L684,209L684,212L683,213L682,212L683,210L682,208L681,208L681,206L682,205L682,203L683,200L683,199L685,197L687,198L690,198ZM684,223L681,221L683,221L684,222L685,222L685,223L684,223ZM686,219L688,219L690,218L690,219L686,220L683,220L683,219L685,218L686,219ZM679,219L681,218L681,219L679,220L677,220L676,220L677,219L678,219L679,218L679,219ZM657,214L657,215L662,215L662,214L667,215L667,217L671,217L674,219L671,219L668,219L666,219L664,218L662,218L659,217L658,217L657,217L653,216L652,215L650,215L652,213L654,213L656,214L657,214ZM648,202L648,204L649,205L651,205L652,207L651,210L651,213L649,213L647,211L644,209L643,208L641,206L640,205L638,201L636,200L635,198L635,196L633,195L631,193L630,191L627,189L627,188L629,188L632,188L634,191L636,192L637,193L639,195L642,195L644,197L645,199L647,200L646,202L647,202L648,202Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 32,
  "d": "M254,317L255,318L256,320L259,321L262,322L261,323L259,323L258,322L256,322L254,322L254,317ZM279,267L278,269L278,271L278,273L277,274L277,275L277,277L280,278L279,280L281,281L281,282L279,285L275,286L271,287L268,286L269,288L268,289L268,290L267,291L265,292L263,291L262,291L262,294L264,294L265,293L266,295L263,295L262,297L261,299L261,300L259,300L257,301L256,303L258,305L261,305L260,307L257,308L256,311L253,312L253,313L253,315L255,316L254,316L252,316L246,316L245,314L245,313L244,313L243,312L243,310L245,309L245,307L245,306L246,304L247,301L247,300L248,300L248,299L247,298L247,297L246,297L246,294L247,293L246,291L247,289L247,287L249,286L248,284L248,282L250,280L250,278L251,276L251,274L250,274L249,270L251,267L251,265L251,263L253,261L254,260L254,259L254,258L254,255L257,253L257,251L257,251L259,249L262,249L263,251L264,249L267,249L267,249L271,253L273,253L276,255L278,256L279,257L277,260L279,261L281,261L283,261L285,259L286,257L287,257L288,258L288,260L286,261L284,262L282,264L279,267Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 152,
  "d": "M254,317L254,322L256,322L258,322L257,323L255,324L254,324L252,323L251,323L248,322L245,321L243,320L240,317L242,318L245,319L248,320L249,319L250,318L252,317L254,317ZM252,239L253,241L253,242L254,243L253,245L255,248L256,251L257,251L257,251L257,253L254,255L254,258L254,259L254,260L253,261L251,263L251,265L251,267L249,270L250,274L251,274L251,276L250,278L250,280L248,282L248,284L249,286L247,287L247,289L246,291L247,293L246,294L246,297L247,297L247,298L248,299L248,300L247,300L247,301L246,304L245,306L245,307L245,309L243,310L243,312L244,313L245,313L245,314L246,316L252,316L254,316L252,316L251,317L249,318L248,320L247,320L245,319L242,317L239,316L239,315L239,313L238,312L238,308L239,306L241,304L238,304L240,302L241,298L243,299L244,294L243,294L242,296L241,296L241,293L242,289L243,287L243,285L242,283L243,283L245,279L246,275L247,272L247,269L247,267L247,264L249,261L249,257L250,253L250,248L250,244L250,241L251,240L252,239Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 180,
  "d": "M477,210L477,212L477,213L478,215L479,216L480,219L479,218L476,219L475,219L475,220L475,221L475,224L475,226L475,227L477,228L478,227L478,230L476,229L475,228L474,227L472,227L472,226L471,227L469,226L468,225L467,225L465,225L465,224L465,224L463,224L462,225L461,224L461,225L461,222L460,221L460,220L460,219L460,218L460,216L457,216L457,215L456,215L456,216L454,216L454,217L453,218L452,217L451,218L450,218L449,217L448,216L448,215L447,213L441,213L440,213L439,213L438,214L438,213L438,213L438,212L439,211L440,211L440,211L441,210L442,210L442,211L443,211L445,210L446,209L447,208L446,206L447,204L448,203L450,202L450,201L450,200L451,199L451,198L451,196L451,195L452,194L452,192L452,191L453,190L454,189L456,190L458,190L459,191L461,191L462,190L462,190L463,190L466,189L467,189L467,189L468,189L468,188L470,189L472,189L472,188L474,190L475,191L475,190L476,190L478,190L478,191L480,192L480,195L481,195L480,196L479,197L479,198L478,199L478,201L477,201L477,203L477,204L477,205L476,205L476,206L477,207L477,210Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 706,
  "d": "M505,204L503,202L503,194L505,191L506,191L507,191L509,189L512,189L519,182L520,180L522,179L522,178L522,176L522,175L522,175L522,175L523,174L525,174L526,173L526,173L527,174L526,175L526,176L526,177L525,180L524,182L523,185L521,188L519,191L516,194L514,196L510,198L508,199L506,202L505,203L505,204Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 404,
  "d": "M499,210L496,208L496,207L488,202L487,202L487,200L488,199L489,197L490,196L489,193L489,192L488,191L489,189L490,188L492,188L492,189L492,190L494,190L497,192L498,192L498,192L499,192L500,192L501,192L503,191L504,191L505,191L503,194L503,202L505,204L503,205L503,206L502,206L501,207L501,208L500,210L499,210Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 729,
  "d": "M466,182L464,181L463,180L463,179L464,179L464,178L462,176L462,175L462,175L461,174L461,173L461,172L460,172L460,171L461,170L461,169L461,169L461,168L461,167L462,165L464,165L464,157L464,156L467,156L467,151L476,151L485,151L494,151L495,153L494,154L495,156L495,159L496,159L498,160L496,161L495,162L494,162L494,164L493,167L493,168L493,170L492,172L490,173L489,175L489,176L488,176L487,179L487,181L487,179L487,179L487,178L487,177L486,176L485,175L486,173L485,173L484,173L483,173L484,174L484,175L483,177L481,178L480,178L478,177L478,178L477,178L476,179L476,179L474,179L473,179L472,179L471,179L470,179L469,178L469,177L467,177L467,178L466,180L465,181L464,181L466,182Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 148,
  "d": "M464,157L464,165L462,165L461,167L461,168L461,169L461,169L461,170L460,171L460,172L461,172L461,173L461,174L462,175L462,175L461,176L460,177L458,179L456,180L454,180L453,180L453,181L452,182L451,183L448,183L448,183L447,183L447,183L445,184L445,183L444,181L444,181L443,180L442,179L442,178L443,178L444,178L445,178L444,176L444,174L444,173L443,171L443,170L442,170L442,169L441,168L442,165L445,163L445,160L446,156L446,155L445,154L445,153L444,153L444,149L446,148L455,152L464,157Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 332,
  "d": "M247,156L247,157L247,158L246,159L247,159L247,160L245,160L244,160L243,160L242,160L240,159L241,159L243,159L244,159L245,159L244,158L244,157L243,156L243,156L245,156L247,156Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 214,
  "d": "M247,160L247,159L246,159L247,158L247,157L247,156L247,156L249,156L250,156L251,156L251,157L252,157L252,158L253,158L254,159L254,160L253,159L251,159L251,159L250,160L249,160L249,159L248,159L247,161L247,161L247,160Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 643,
  "d": "M624,20L629,19L633,21L638,23L638,25L633,25L626,24L623,24L621,22L618,22L624,20ZM644,24L650,25L649,26L637,27L641,24L643,24L644,24ZM726,31L732,31L741,32L739,34L730,34L727,34L722,33L723,31L726,31ZM748,33L753,33L751,34L747,34L743,33L743,32L748,33ZM729,37L731,36L734,36L737,37L737,37L734,37L729,37L729,37ZM512,21L517,21L520,21L521,21L522,21L524,20L527,21L527,21L523,21L521,22L521,22L518,22L516,22L517,21L512,21ZM462,79L458,79L455,79L455,78L458,77L461,78L462,78L462,79L462,79ZM532,36L537,34L537,33L542,32L549,31L557,30L561,29L565,29L567,30L565,31L557,32L550,33L543,35L540,37L536,39L537,41L541,43L540,43L532,43L532,42L528,41L527,40L530,40L530,38L534,36L532,36ZM736,81L736,83L736,85L737,87L740,91L736,90L735,94L737,96L737,98L735,96L734,98L733,96L734,94L733,91L734,90L734,87L733,85L733,82L735,81L734,80L735,79L736,81ZM708,106L708,106L708,105L709,105L709,102L708,100L710,99L713,100L715,98L716,95L716,94L718,92L714,93L712,94L708,94L707,92L705,90L701,89L700,87L699,86L698,85L697,83L695,82L692,81L688,81L686,82L684,83L685,83L685,85L684,85L682,88L682,89L679,90L676,89L673,89L672,89L671,88L667,90L664,90L662,91L659,91L657,91L656,89L654,88L651,88L648,88L646,89L643,88L643,86L640,86L638,85L635,84L633,87L634,88L632,90L628,89L626,89L624,88L622,88L620,87L617,88L612,90L610,90L609,91L608,89L605,90L604,89L602,88L601,87L600,87L597,87L594,86L592,87L587,81L584,80L585,79L579,81L577,81L577,80L575,79L572,80L571,77L567,77L565,78L560,79L559,79L550,80L549,81L551,82L548,83L549,83L547,85L550,86L550,87L547,87L546,88L543,87L539,87L537,88L534,87L529,85L526,85L521,88L521,89L518,88L517,90L517,91L516,93L518,94L520,94L521,95L521,97L522,97L521,98L519,99L516,101L518,103L518,105L521,107L519,108L519,109L518,108L516,107L516,107L514,107L514,106L511,105L510,105L510,105L507,104L503,104L501,103L501,104L498,102L496,101L494,100L495,99L497,97L496,96L499,96L499,95L497,95L497,94L498,94L501,94L501,93L500,92L501,90L501,90L498,89L497,89L495,88L493,88L491,88L491,87L490,86L488,86L488,85L488,85L487,84L485,84L484,84L483,84L482,84L482,83L481,82L482,82L484,82L485,81L484,81L482,81L482,80L482,80L480,78L481,78L480,77L478,76L477,76L477,76L474,75L473,74L473,73L472,72L473,72L473,70L474,68L474,68L476,67L474,66L479,63L481,61L482,60L478,59L479,57L477,56L479,54L476,51L478,50L475,48L475,47L477,46L481,45L483,45L487,46L493,47L502,49L504,50L504,52L501,53L497,53L487,52L486,52L489,54L489,55L490,57L493,58L494,58L495,57L493,56L495,55L500,57L502,56L501,54L506,52L508,52L510,53L511,52L510,50L511,49L509,48L515,48L517,50L514,50L514,51L516,52L519,51L520,50L524,49L532,47L534,47L532,48L535,49L536,48L541,48L544,47L547,48L549,47L547,46L548,45L555,45L558,46L566,49L568,48L565,46L565,46L563,46L563,45L562,43L562,42L566,40L568,38L569,38L575,38L576,40L574,41L575,42L576,44L575,47L578,48L577,50L572,53L575,53L576,52L578,52L579,51L581,49L580,48L581,47L578,47L578,45L580,43L577,41L581,40L580,38L581,38L582,39L582,42L584,42L583,40L587,39L591,39L596,41L594,39L593,36L597,36L603,36L608,36L606,35L609,33L611,33L616,32L622,32L622,31L628,31L630,31L635,30L640,30L640,29L642,28L648,27L652,28L649,29L654,29L654,30L656,30L663,30L668,31L670,31L669,33L667,33L661,35L659,35L662,36L665,36L667,36L669,37L670,37L673,36L681,37L681,38L691,38L691,36L696,37L699,37L703,38L704,39L703,40L706,42L709,43L711,40L715,41L719,41L723,42L725,41L729,41L727,39L730,38L751,40L753,41L758,43L768,42L772,43L774,43L774,45L777,46L780,45L784,45L788,46L792,45L796,47L799,47L797,45L798,44L806,45L810,45L817,46L0,47L6,48L12,51L11,52L13,53L12,51L19,51L23,53L21,54L17,55L17,57L16,57L14,57L12,56L9,56L9,55L6,54L4,55L3,54L3,53L0,54L1,55L0,56L820,56L817,57L814,56L816,58L818,59L819,60L819,61L818,62L814,61L808,63L806,63L802,65L799,66L798,67L795,65L789,67L788,66L786,67L783,67L782,68L779,71L779,72L782,72L781,75L779,75L778,77L779,78L775,79L775,82L771,82L770,85L767,87L766,85L765,82L764,77L765,74L767,73L767,72L771,71L775,68L779,66L783,64L785,61L782,61L781,63L775,66L773,63L767,64L761,67L763,69L758,69L755,69L755,68L751,67L748,69L741,68L734,69L727,73L718,78L721,79L723,80L725,81L726,79L729,80L732,82L732,84L730,86L730,89L729,92L726,96L725,97L722,100L719,102L717,104L714,105L713,105L711,104L708,105L708,106ZM0,41L0,41L2,41L6,42L5,42L3,43L0,43L818,43L817,42L0,41ZM486,98L487,97L488,98L489,98L489,98L490,98L490,99L491,99L493,99L493,100L490,100L487,101L486,101L486,100L484,99L484,99L487,98L486,98Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 44,
  "d": "M230,141L231,140L233,140L233,141L230,141L230,141ZM233,140L235,141L234,143L234,142L234,141L233,140L233,140ZM232,144L233,144L233,146L233,147L233,147L232,146L231,145L232,144Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 238,
  "d": "M271,315L273,314L275,314L277,314L279,315L278,315L275,316L274,315L272,316L271,315Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 578,
  "d": "M445,23L445,22L449,22L452,23L459,25L453,25L452,27L450,28L449,29L446,29L441,28L443,27L440,27L436,25L434,23L440,22L441,23L445,23ZM481,45L477,46L475,47L476,45L473,44L470,45L469,47L466,47L464,47L461,47L458,46L457,46L456,47L455,48L451,48L450,49L448,49L447,50L444,53L441,56L442,57L441,58L439,58L437,60L437,63L439,64L438,66L436,68L435,69L434,68L429,70L426,71L423,70L422,67L421,62L424,61L430,59L434,57L438,54L444,49L447,48L454,45L459,44L462,44L466,42L470,42L474,42L481,43L478,44L481,45ZM472,22L469,23L462,24L456,23L455,23L452,23L450,22L457,21L460,21L462,21L468,21L472,22ZM466,27L461,28L457,27L459,27L457,26L462,26L463,27L466,27Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 304,
  "d": "M304,16L311,15L319,15L322,14L330,14L348,14L363,16L358,17L350,17L337,17L339,18L347,18L353,18L358,18L360,18L357,20L363,19L374,18L381,18L382,19L373,21L372,21L364,22L370,22L367,24L365,25L365,28L368,29L364,29L361,30L365,31L365,33L363,33L366,35L361,35L364,36L363,37L360,37L356,37L359,39L359,40L355,39L354,39L357,40L360,41L361,43L356,43L355,43L352,41L353,43L350,44L356,44L359,44L353,46L347,48L340,49L338,49L335,50L332,52L327,53L326,54L323,54L319,55L317,56L317,58L316,59L313,61L313,62L312,64L311,66L308,67L305,65L300,65L298,64L296,61L292,59L291,57L291,55L288,53L289,52L287,51L289,48L293,47L294,46L294,45L292,45L290,46L288,46L285,45L285,44L286,43L288,43L293,43L289,42L287,41L285,41L283,41L285,39L284,38L282,36L279,34L277,33L277,32L270,31L266,31L260,31L254,31L251,30L247,29L253,28L258,28L248,28L243,27L243,26L252,25L260,24L261,23L255,22L257,21L265,20L268,19L267,18L273,18L280,17L287,17L289,18L295,17L301,18L304,18L309,19L303,17L304,16Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 260,
  "d": "M567,308L569,309L571,309L571,310L570,311L567,311L567,309L567,309L567,308Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 626,
  "d": "M695,220L695,219L697,219L699,219L699,218L700,219L699,219L697,220L695,221L695,220L695,220Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 710,
  "d": "M447,264L448,262L449,263L450,264L451,264L452,265L453,264L455,263L455,255L456,255L457,258L457,259L458,260L459,259L460,258L461,258L462,257L463,256L464,256L465,257L467,257L469,257L469,256L469,255L470,255L471,254L472,252L474,251L477,249L478,249L479,250L480,249L481,249L482,253L483,254L482,257L483,257L481,257L481,257L481,258L480,259L480,259L481,261L483,260L483,259L485,259L484,261L484,263L483,264L482,265L481,265L480,267L480,268L479,269L476,272L474,273L473,274L470,275L469,275L469,275L467,275L466,276L464,275L462,275L461,275L459,276L457,277L456,277L455,277L454,277L453,277L452,276L452,276L452,275L452,274L451,273L452,272L452,270L450,268L449,266L449,266L447,264ZM476,264L475,264L474,264L473,265L472,266L473,268L474,268L474,267L476,267L476,266L477,265L476,264Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 426,
  "d": "M476,264L477,265L476,266L476,267L474,267L474,268L473,268L472,266L473,265L474,264L475,264L476,264Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 484,
  "d": "M143,128L146,128L149,127L149,128L152,129L157,130L162,130L164,130L164,129L167,129L168,130L169,131L171,132L172,133L172,134L173,135L175,136L177,134L178,134L180,135L181,136L182,138L183,139L184,140L185,141L186,142L188,143L189,143L188,145L188,146L187,149L187,150L188,151L188,152L189,154L190,156L191,157L192,158L194,159L195,160L197,159L199,159L200,158L202,158L203,157L204,156L204,154L204,153L206,153L208,152L210,152L212,152L212,153L212,154L211,155L210,156L211,157L211,158L210,159L209,159L209,159L208,159L208,160L207,160L207,160L207,160L205,160L203,160L203,162L202,162L203,162L203,163L204,163L204,164L204,164L201,164L200,166L200,167L200,167L200,168L197,165L196,165L194,164L193,164L191,165L190,165L189,165L187,164L185,163L183,163L180,162L178,161L178,160L177,160L174,159L173,158L171,157L170,156L169,155L170,154L170,154L170,153L170,152L170,151L169,151L169,149L167,147L164,145L163,144L161,143L161,143L161,141L160,141L159,140L158,138L157,138L155,137L154,136L154,135L153,133L152,132L152,131L151,130L150,130L149,129L148,130L149,131L149,133L150,134L151,135L152,136L152,136L152,137L153,137L153,138L154,139L154,140L156,141L157,143L157,144L158,145L158,146L159,146L160,147L161,148L161,149L160,149L159,149L159,148L157,147L156,146L155,145L155,143L154,142L153,142L152,141L151,141L151,140L149,140L148,138L148,138L149,138L150,138L150,137L148,135L147,134L146,133L145,132L144,130L143,128Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 858,
  "d": "M279,267L280,267L283,269L283,269L286,270L288,271L289,273L288,274L288,275L287,276L285,278L283,277L282,278L280,277L278,277L277,275L277,274L278,273L278,271L278,269L279,267Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 76,
  "d": "M288.4,275L287.8,273.8L288.8,272.7L287.5,271.2L285.7,270L283.4,268.6L282.5,268.6L280.2,266.9L278.7,267.1L281.8,264.1L284.4,262L285.9,261.1L287.8,259.8L287.8,258.1L286.7,256.8L285.6,257.2L286,255.9L286.3,254.6L286.3,253.4L285.5,253L284.7,253.3L283.8,253.2L283.5,252.4L283.3,250.3L282.9,249.7L281.4,249.1L280.4,249.5L278,249.1L278.2,246.1L277.5,244.8L278.2,244.4L278,243.1L278.6,242.1L279,240.4L278.5,239L277.3,238.4L277,237.5L277.3,236.2L273,236.1L272.1,233.5L272.8,233.5L272.7,232.5L272.3,231.9L272.2,230.6L270.9,230L269.4,230L268.5,229.3L266.9,228.9L266.1,228.1L263.5,227.7L261,225.7L261.2,224.2L260.9,223.4L261.2,221.7L258.2,222.1L257,222.9L255,223.8L254.5,224.5L253.3,224.5L251.6,224.3L250.3,224.7L249.3,224.5L249.5,221.1L247.6,222.4L245.6,222.3L244.7,221.2L243.2,221L243.7,220.1L242.4,218.7L241.5,216.7L242.1,216.3L242.1,215.4L243.5,214.7L243.2,213.5L243.8,212.8L244,211.7L246.6,210.2L248.4,209.8L248.7,209.4L250.8,209.6L251.8,203.5L251.9,202.5L251.5,201.2L250.5,200.4L250.5,198.8L251.8,198.4L252.3,198.7L252.3,197.8L251,197.6L251,196.2L255.4,196.2L256.2,195.5L256.8,196.2L257.2,197.5L257.7,197.2L258.9,198.4L260.7,198.2L261.1,197.6L262.8,197L263.8,196.7L264,195.7L265.7,195.1L265.5,194.6L263.6,194.5L263.3,193.1L263.4,191.6L262.4,191L262.8,190.8L264.5,191.1L266.3,191.6L266.9,191.1L268.6,190.7L271.1,189.9L272,189.1L271.7,188.4L272.8,188.3L273.4,188.9L273.1,189.8L273.9,190.2L274.4,191.2L273.8,192L273.4,193.9L274,195L274.1,196L275.5,197.1L276.7,197.2L276.9,196.7L277.6,196.7L278.7,196.3L279.4,195.7L280.7,195.9L281.2,195.8L282.5,196L282.7,195.5L282.3,195.1L282.5,194.4L283.4,194.6L284.5,194.4L285.8,194.9L286.8,195.3L287.5,194.7L288,194.8L288.3,195.4L289.4,195.3L290.3,194.4L291,192.8L292.3,190.8L293.1,190.7L293.7,191.9L294.9,195.8L296.2,196.1L296.2,197.7L294.5,199.5L295.2,200.2L299.3,200.5L299.3,202.8L301.1,201.3L303.9,202.1L307.7,203.4L308.8,204.7L308.5,206L311.1,205.3L315.5,206.5L318.9,206.4L322.3,208.2L325.2,210.7L327,211.4L328.9,211.4L329.7,212.1L330.5,215L330.9,216.3L330,220L328.8,221.4L325.6,224.5L324.2,227L322.5,229L321.9,229L321.3,230.7L321.4,234.8L320.8,238.2L320.6,239.7L319.8,240.6L319.4,243.6L317.1,246.5L316.7,248.7L314.9,249.7L314.4,251L311.9,251L308.3,251.9L306.7,252.9L304.1,253.5L301.5,255.3L299.5,257.5L299.2,259.2L299.6,260.4L299.2,262.6L298.6,263.7L297,264.9L294.5,268.9L292.5,270.6L291,271.7L289.9,273.8L288.4,275Z",
  "fill": "#bbf7d0",
  "name": "Brazil",
  "score": 1
}, {
  "id": 68,
  "d": "M252,224L253,225L255,225L255,224L257,223L258,222L261,222L261,223L261,224L261,226L264,228L266,228L267,229L269,229L269,230L271,230L272,231L272,232L273,233L273,234L272,234L273,236L277,236L277,238L277,238L279,239L279,240L279,242L278,243L278,244L278,245L278,244L275,243L273,243L269,244L268,246L268,247L267,249L267,249L264,249L263,251L262,249L259,249L257,251L256,251L255,248L253,245L254,243L253,242L253,241L252,239L253,237L252,235L253,234L252,233L253,232L253,230L253,229L254,228L252,224Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 604,
  "d": "M251,210L249,209L248,210L247,210L244,212L244,213L243,214L244,215L242,215L242,216L242,217L242,219L244,220L243,221L245,221L246,222L248,222L250,221L249,225L250,225L252,224L254,228L253,229L253,230L253,232L252,233L253,234L252,235L253,237L252,239L251,240L250,241L247,240L247,239L243,236L239,234L237,233L236,231L236,230L234,227L232,223L230,219L229,218L228,216L227,215L225,214L226,213L225,211L225,209L227,208L227,209L227,209L227,210L228,210L229,210L230,211L231,210L231,209L233,207L235,206L238,204L239,202L238,200L239,200L240,201L241,202L242,203L244,205L245,205L247,205L247,205L249,205L250,206L249,208L250,208L251,210Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 170,
  "d": "M258,197L257,198L257,196L256,196L255,196L251,196L251,198L252,198L252,199L252,198L251,199L251,200L252,201L252,203L252,204L251,210L250,208L249,208L250,206L249,205L247,205L247,205L245,205L244,205L242,203L241,202L240,201L239,200L238,200L237,200L236,199L236,199L234,199L233,198L233,198L230,197L230,196L231,196L231,195L231,194L233,194L233,193L234,191L234,191L234,190L233,188L234,187L234,185L233,184L233,183L234,183L234,182L234,181L234,181L235,181L237,179L238,179L238,178L238,176L239,175L241,175L241,175L243,175L245,174L246,173L247,172L247,173L248,173L248,174L246,174L246,175L245,176L244,177L244,178L243,180L244,180L245,181L245,181L245,182L245,183L245,184L246,184L246,185L249,184L250,185L252,186L253,186L255,186L256,186L257,187L256,188L256,188L256,190L256,192L257,192L257,193L256,194L256,194L257,195L258,197Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 591,
  "d": "M234,181L234,181L234,182L234,183L233,183L233,184L232,183L231,182L232,182L231,181L231,181L230,180L229,180L228,181L227,182L227,182L227,182L228,183L227,184L227,184L226,184L225,183L225,183L224,183L224,182L223,182L222,182L221,182L221,182L221,182L221,181L221,181L221,180L222,180L221,180L221,179L222,179L223,180L223,180L224,180L224,180L225,181L226,180L227,180L228,179L229,179L230,179L230,179L231,179L232,180L233,180L234,181Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 188,
  "d": "M222,179L221,179L221,180L222,180L221,180L221,181L221,181L221,182L220,181L219,181L220,180L220,180L219,179L218,179L217,179L217,178L216,178L217,178L216,179L216,178L215,178L215,178L215,177L215,176L214,176L215,175L215,175L217,176L217,175L218,176L218,176L219,176L220,176L220,177L221,178L222,179Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 558,
  "d": "M220,176L219,176L218,176L218,176L217,175L217,176L215,175L215,175L214,175L213,174L212,173L212,172L210,171L211,171L211,171L211,171L212,171L212,171L212,171L212,169L213,169L213,169L214,169L215,169L215,169L215,169L216,168L216,168L216,168L217,167L217,167L217,167L218,168L218,167L219,167L220,167L220,167L221,167L220,167L220,167L221,168L220,169L220,170L220,171L220,171L220,172L220,173L219,174L220,174L219,175L219,175L220,176Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 340,
  "d": "M221,167L220,167L220,167L219,167L218,167L218,168L217,167L217,167L217,167L216,168L216,168L216,168L215,169L215,169L215,169L214,169L213,169L213,169L212,169L212,171L212,171L212,171L211,171L211,171L210,170L210,169L210,169L209,169L208,169L208,169L208,169L207,168L207,168L207,167L207,167L207,167L208,166L209,165L209,165L210,165L210,165L211,165L211,165L212,165L213,165L214,165L214,164L215,165L215,165L216,165L216,165L218,165L218,165L219,165L219,166L220,166L221,167Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 222,
  "d": "M207,168L207,168L208,169L208,169L208,169L209,169L210,169L210,169L210,170L210,171L209,171L208,171L207,170L205,170L205,170L205,169L206,169L206,168L206,168L207,168Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 320,
  "d": "M200,168L200,167L200,167L200,166L201,164L204,164L204,164L204,163L203,163L203,162L202,162L203,162L203,160L205,160L207,160L207,162L207,165L207,165L208,165L208,165L209,165L208,166L207,167L207,167L207,167L207,168L206,168L206,168L206,169L205,169L205,170L204,169L202,169L201,169L200,168Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 84,
  "d": "M207,160L207,160L207,160L208,160L208,159L209,159L209,159L209,159L209,160L209,161L209,161L209,162L209,162L209,163L208,164L208,164L207,165L207,165L207,162L207,160Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 862,
  "d": "M272,188L272,189L271,190L269,191L267,191L266,192L265,191L263,191L262,191L263,192L263,193L264,195L266,195L266,195L264,196L264,197L263,197L261,198L261,198L259,198L258,197L257,195L256,194L256,194L257,193L257,192L256,192L256,190L256,188L256,188L257,187L256,186L255,186L253,186L252,186L250,185L249,184L246,185L246,184L245,184L245,183L245,182L245,181L245,181L244,180L243,180L244,178L244,177L245,176L246,175L246,174L248,174L248,174L246,175L247,176L247,177L246,178L247,180L248,180L248,178L248,177L247,176L250,175L250,174L251,173L252,175L253,175L255,176L255,177L257,177L259,176L261,177L262,178L264,177L264,176L266,176L269,176L267,177L268,178L270,178L271,179L272,181L273,181L274,181L272,183L272,184L273,184L272,185L271,185L271,186L270,187L272,188Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 328,
  "d": "M281,196L281,196L279,196L279,196L278,197L277,197L277,197L276,197L274,196L274,195L273,194L274,192L274,191L274,190L273,190L273,189L273,188L272,188L270,187L271,186L271,185L272,185L273,184L272,184L272,183L274,181L275,182L277,184L277,185L278,185L279,186L280,187L280,189L278,189L278,190L278,191L279,193L280,193L280,194L281,196Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 740,
  "d": "M286,195L285,194L283,195L283,194L282,195L283,196L283,196L281,196L280,194L280,193L279,193L278,191L278,190L278,189L280,189L280,187L283,187L283,187L285,187L287,187L286,189L286,191L287,192L287,193L286,194L286,195Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 250,
  "d": "M292.3,190.8L291,192.8L290.3,194.4L289.4,195.3L288.3,195.4L288,194.8L287.5,194.7L286.8,195.3L285.8,194.9L286.4,193.9L286.6,192.9L287,192L286.1,190.6L285.9,189.1L287.1,187.2L287.9,187.5L289.5,188L292,189.9L292.3,190.8ZM424.1,90.1L425.2,90.7L428.4,91.1L427.3,92.6L427,94.2L426.4,94.6L425.3,94.4L425.4,94.9L423.8,96.2L423.7,97.2L424.8,96.8L425.6,97.8L425.5,98.4L426.2,99.3L425.4,99.9L426,101.7L427.2,101.9L426.9,102.9L424.9,104.2L420.4,103.6L417.1,104.3L416.8,105.6L414.2,105.9L411.6,104.9L410.8,105.4L406.6,104.4L405.7,103.5L406.8,102.2L407.3,97.7L404.9,95.4L403.2,94.3L399.8,93.4L399.5,91.8L402.5,91.3L406.3,91.9L405.6,89.4L407.7,90.3L413,88.6L413.7,86.8L415.7,86.3L416.1,87.1L417.1,87.2L418.2,88L419.8,89.1L420.9,88.9L422.9,89.9L423.4,90.1L424.1,90.1ZM429.9,105.3L431.4,104.4L431.8,106.3L431,108L430,107.6L429.5,106.1L429.9,105.3Z",
  "fill": "#4ade80",
  "name": "France",
  "score": 3
}, {
  "id": 218,
  "d": "M238,200L239,202L238,204L235,206L233,207L231,209L231,210L230,211L229,210L228,210L227,210L227,209L227,209L227,208L228,206L228,205L227,206L226,205L226,204L226,202L226,202L227,201L228,199L228,198L229,198L230,197L233,198L233,198L234,199L236,199L236,199L237,200L238,200Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 630,
  "d": "M259,159L260,159L261,160L260,160L258,160L257,160L257,159L257,159L259,159Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 388,
  "d": "M233,159L235,159L236,160L236,160L235,160L234,161L233,160L232,160L232,159L233,159L233,159Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 192,
  "d": "M223,149L225,149L226,149L229,149L229,150L232,150L232,151L234,152L236,153L236,153L238,153L238,154L239,154L241,155L241,155L239,156L238,156L236,156L233,156L234,155L234,154L232,154L231,153L231,152L229,152L227,152L227,151L224,151L223,150L224,150L222,150L220,151L219,151L219,151L217,152L216,151L218,151L218,150L219,149L220,149L222,149L223,149Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 716,
  "d": "M481,249L480,249L479,250L478,249L477,249L476,248L474,248L473,246L473,246L472,245L470,243L469,242L468,241L468,239L470,240L471,240L472,240L473,238L475,237L476,236L476,236L477,235L479,235L479,235L481,235L482,236L483,236L484,236L485,237L485,240L484,242L484,243L485,244L484,245L484,245L483,247L481,249Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 72,
  "d": "M477,249L474,251L472,252L471,254L470,255L469,255L469,256L469,257L467,257L465,257L464,256L463,256L462,257L461,258L460,258L459,259L458,260L457,259L457,258L456,255L455,255L455,249L458,249L458,241L459,241L463,240L464,241L465,240L466,240L467,239L468,239L468,241L469,242L470,243L472,245L473,246L473,246L474,248L476,248L477,249Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 516,
  "d": "M455,255L455,263L453,264L452,265L451,264L450,264L449,263L448,262L447,264L446,262L445,260L444,258L444,256L443,253L443,250L443,249L442,248L440,246L439,244L439,242L437,240L437,238L438,238L439,238L441,238L442,239L442,239L452,239L453,240L459,240L463,239L465,238L466,239L467,239L467,239L466,240L465,240L464,241L463,240L459,241L458,241L458,249L455,249L455,255Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 686,
  "d": "M372,170L371,168L370,167L371,167L372,165L373,164L373,163L374,164L376,163L377,163L378,164L379,164L381,166L382,168L382,169L383,170L384,171L384,172L384,172L383,173L382,172L382,173L382,173L380,172L379,172L375,172L374,172L373,172L372,173L372,171L374,171L374,171L375,171L376,170L377,170L378,171L379,170L378,169L377,170L377,170L376,169L375,169L374,170L372,170Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 466,
  "d": "M384,172L384,172L384,171L383,170L382,169L382,168L383,167L383,166L384,166L386,166L387,166L388,166L388,166L397,166L398,164L398,164L396,154L395,145L399,145L407,149L414,154L415,155L416,156L417,156L417,158L420,157L420,163L419,164L418,165L416,166L413,166L412,167L411,167L409,167L409,166L408,167L405,168L405,168L403,169L403,170L402,170L401,170L400,171L400,172L398,174L398,175L398,176L398,177L397,177L396,178L396,177L395,177L395,177L394,178L393,178L392,177L392,177L391,177L391,176L391,176L390,176L391,175L391,175L390,174L390,173L389,173L389,173L388,173L388,173L387,174L386,174L385,173L385,173L384,173L384,173L384,172Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 478,
  "d": "M371,153L372,153L381,153L380,149L381,148L383,148L383,142L390,143L390,139L399,145L395,145L396,154L398,164L398,164L397,166L388,166L388,166L387,166L386,166L384,166L383,166L383,167L382,168L381,166L379,164L378,164L377,163L376,163L374,164L373,163L373,164L372,163L373,162L373,160L373,158L373,157L373,155L372,154L371,153Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 204,
  "d": "M416,186L414,186L414,185L414,180L413,179L413,178L413,177L412,177L412,176L413,175L413,174L414,174L415,174L416,173L417,173L418,174L418,175L419,176L418,177L418,178L417,179L417,180L416,181L416,183L416,186Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 562,
  "d": "M444,149L444,153L445,153L445,154L446,155L446,156L445,160L445,163L442,165L441,168L442,169L442,170L443,170L443,171L442,172L442,172L442,172L440,170L440,170L438,171L436,170L435,170L434,171L433,171L432,171L431,172L428,170L427,171L426,171L425,170L422,169L420,169L419,170L419,171L418,172L418,174L417,173L416,173L415,174L415,172L412,171L412,170L411,169L411,168L411,167L412,167L413,166L416,166L418,165L419,164L420,163L420,157L423,156L430,152L437,148L441,149L442,150L444,149Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 566,
  "d": "M416,186L416,183L416,181L417,180L417,179L418,178L418,177L419,176L418,175L418,174L418,172L419,171L419,170L420,169L422,169L425,170L426,171L427,171L428,170L431,172L432,171L433,171L434,171L435,170L436,170L438,171L440,170L440,170L442,172L442,172L443,173L443,174L443,174L441,176L440,177L440,179L440,179L439,181L438,182L438,183L437,184L437,185L435,185L434,184L433,184L432,186L431,186L430,188L429,189L427,190L426,190L425,191L423,191L422,189L422,188L420,186L418,186L416,186Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 120,
  "d": "M443,171L444,173L444,174L444,176L445,178L444,178L443,178L442,178L442,179L443,180L444,181L444,181L445,183L445,184L444,186L443,186L443,188L443,189L443,190L444,191L444,191L445,193L446,193L446,194L447,195L446,196L445,196L443,195L440,195L440,195L438,195L437,195L436,195L432,195L432,193L431,192L430,191L430,190L429,190L429,189L430,188L431,186L432,186L433,184L434,184L435,185L437,185L437,184L438,183L438,182L439,181L440,179L440,179L440,177L441,176L443,174L443,174L443,173L442,172L442,172L443,171Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 768,
  "d": "M412,176L412,177L413,177L413,178L413,179L414,180L414,185L414,186L412,187L412,186L411,185L411,184L412,182L411,181L411,179L411,177L410,176L410,176L412,176Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 288,
  "d": "M410,176L410,176L411,177L411,179L411,181L412,182L411,184L411,185L412,186L412,187L409,188L408,189L406,190L404,189L404,188L403,186L403,184L404,182L404,179L403,177L403,176L407,176L408,176L409,175L410,176Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 384,
  "d": "M392,177L392,177L393,178L394,178L395,177L395,177L396,177L396,178L397,177L398,177L399,177L399,178L400,179L401,178L402,178L404,179L404,182L403,184L403,186L404,188L404,189L403,189L401,189L399,189L397,189L395,190L393,190L392,190L393,189L393,188L393,187L392,186L391,186L390,186L391,185L391,184L391,183L391,183L391,182L391,182L391,181L392,181L392,179L391,178L391,178L392,177Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 324,
  "d": "M379,172L380,172L382,173L382,173L382,172L383,173L384,172L384,173L384,173L385,173L385,173L386,174L387,174L388,173L388,173L389,173L389,173L390,173L390,174L391,175L391,175L390,176L391,176L391,176L391,177L392,177L391,178L391,178L392,179L392,181L391,181L391,182L391,182L391,183L391,183L390,183L390,184L389,184L389,183L389,182L388,181L387,181L387,181L386,181L386,181L386,180L386,179L385,179L385,178L383,178L382,178L382,178L381,179L381,179L380,180L379,179L378,178L377,178L377,177L377,176L376,176L376,176L377,174L377,174L378,174L378,174L379,174L379,173L379,173L379,172Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 624,
  "d": "M372,173L373,172L374,172L375,172L379,172L379,173L379,173L379,174L378,174L378,174L377,174L377,174L376,176L374,175L373,174L373,174L373,173L372,173L372,173Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 430,
  "d": "M391,183L391,184L391,185L390,186L391,186L392,186L393,187L393,188L393,189L392,190L392,190L390,189L387,188L386,186L384,185L385,184L385,184L386,182L387,181L387,181L388,181L389,182L389,183L389,184L390,184L390,183L391,183Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 694,
  "d": "M380,180L381,179L381,179L382,178L382,178L383,178L385,178L385,179L386,179L386,180L386,181L386,181L387,181L386,182L385,184L385,184L384,185L383,185L382,184L381,183L380,182L380,180Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 854,
  "d": "M398,177L398,176L398,175L398,174L400,172L400,171L401,170L402,170L403,170L403,169L405,168L405,168L408,167L409,166L409,167L411,167L411,168L411,169L412,170L412,171L415,172L415,174L414,174L413,174L413,175L412,176L410,176L409,175L408,176L407,176L403,176L403,177L404,179L402,178L401,178L400,179L399,178L399,177L398,177Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 140,
  "d": "M472,188L472,189L470,189L468,188L468,189L467,189L467,189L466,189L463,190L462,190L462,190L461,191L459,191L458,190L456,190L454,189L453,190L452,191L452,192L451,192L449,192L448,193L447,195L446,194L446,193L445,193L444,191L444,191L443,190L443,189L443,188L443,186L444,186L445,184L447,183L447,183L448,183L448,183L451,183L452,182L453,181L453,180L454,180L456,180L458,179L460,177L461,176L462,175L462,176L464,178L464,179L463,179L463,180L464,181L466,182L467,183L467,183L469,185L470,186L470,187L472,188L472,188Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 178,
  "d": "M452,192L452,194L451,195L451,196L451,198L451,199L450,200L450,201L450,202L448,203L447,204L446,206L447,208L446,209L445,210L443,211L442,211L442,210L441,210L440,211L440,211L439,210L438,210L437,211L435,209L437,208L436,206L437,206L439,205L439,204L440,205L442,206L443,204L443,203L443,201L442,200L443,197L442,197L440,197L440,196L440,195L443,195L445,196L446,196L447,195L448,193L449,192L451,192L452,192Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 266,
  "d": "M436,195L437,195L438,195L440,195L440,195L440,196L440,197L442,197L443,197L442,200L443,201L443,203L443,204L442,206L440,205L439,204L439,205L437,206L436,206L437,208L435,209L433,207L431,205L430,203L430,202L431,201L431,199L432,198L432,198L436,198L436,195Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 226,
  "d": "M432,195L436,195L436,198L432,198L432,198L431,197L432,195Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 894,
  "d": "M480,219L481,219L482,220L483,220L485,221L486,222L486,223L486,224L485,226L486,228L485,228L485,231L486,231L479,233L479,235L477,235L476,236L476,236L475,237L473,238L472,240L471,240L470,240L468,239L467,239L467,239L466,239L465,238L463,239L461,238L460,236L460,229L465,229L465,228L465,227L464,226L465,225L465,224L465,224L465,225L467,225L468,225L469,226L471,227L472,226L472,227L474,227L475,228L476,229L478,230L478,227L477,228L475,227L475,226L475,224L475,221L475,220L475,219L476,219L479,218L480,219Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 454,
  "d": "M485,221L487,221L487,222L488,223L489,226L488,227L489,230L490,230L490,231L491,233L492,235L491,236L490,237L488,236L488,234L489,233L489,233L488,232L487,232L486,231L485,231L485,228L486,228L485,226L486,224L486,223L486,222L485,221Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 508,
  "d": "M489,226L490,225L493,226L494,226L495,226L496,225L498,225L500,224L502,223L502,224L502,226L502,228L503,232L503,233L502,234L501,236L500,237L498,238L495,239L493,242L492,242L490,244L489,244L489,246L490,247L491,249L491,249L491,249L491,251L491,252L491,253L491,254L490,254L488,255L485,256L484,257L484,258L485,258L485,259L483,259L483,258L483,257L482,257L483,254L482,253L481,249L483,247L484,245L484,245L485,244L484,243L484,242L485,240L485,237L484,236L483,236L482,236L481,235L479,235L479,235L479,233L486,231L487,232L488,232L489,233L489,233L488,234L488,236L490,237L491,236L492,235L491,233L490,231L490,230L489,230L488,227L489,226Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 748,
  "d": "M483,259L483,260L481,261L480,259L480,259L481,258L481,257L481,257L483,257L483,258L483,259Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 24,
  "d": "M440,211L439,211L438,212L438,213L438,213L437,211L438,210L439,210L440,211ZM438,214L439,213L440,213L441,213L447,213L448,215L448,216L449,217L450,218L451,218L452,217L453,218L454,217L454,216L456,216L456,215L457,215L457,216L460,216L460,218L460,219L460,220L460,221L461,222L461,225L461,224L462,225L463,224L465,224L465,225L464,226L465,227L465,228L465,229L460,229L460,236L461,238L463,239L459,240L453,240L452,239L442,239L442,239L441,238L439,238L438,238L437,238L437,237L437,235L438,233L438,232L439,230L439,229L440,228L441,227L441,225L441,224L441,223L440,222L439,220L440,220L440,219L440,217L439,215L438,214L438,214Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 108,
  "d": "M479,205L480,206L480,207L480,208L480,208L479,209L478,210L477,210L477,207L476,206L478,207L478,205L479,205Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 376,
  "d": "M491,127L491,128L490,128L490,129L490,129L490,130L490,130L491,130L491,131L490,134L489,134L488,131L489,130L489,130L489,129L490,127L490,127L490,127L491,127L491,126L492,126L492,127L491,127L491,127Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 422,
  "d": "M492,126L491,126L491,127L490,127L491,125L492,123L492,123L493,123L493,124L492,125L492,126Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 450,
  "d": "M523,228L524,229L524,230L524,233L525,234L525,235L524,236L524,234L523,235L524,237L523,238L523,238L523,240L522,243L521,246L519,250L518,253L517,255L515,256L513,257L512,256L510,256L510,254L510,252L509,251L509,249L509,247L510,247L510,246L511,245L511,243L511,242L510,241L510,239L511,237L511,236L512,236L514,236L515,235L516,235L517,234L519,232L519,231L519,230L520,231L521,229L521,228L522,227L523,228Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 275,
  "d": "M491,130L490,130L490,130L490,129L490,129L490,128L491,128L491,129L491,130Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 270,
  "d": "M372,170L374,170L375,169L376,169L377,170L377,170L378,169L379,170L378,171L377,170L376,170L375,171L374,171L374,171L372,171L372,170Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 788,
  "d": "M432,133L431,129L429,128L429,127L427,126L427,124L429,123L429,121L429,119L429,118L432,117L433,117L433,118L435,118L435,118L434,119L434,120L435,121L435,123L433,124L434,125L435,125L435,126L436,126L436,128L435,129L434,129L433,130L433,131L433,132L432,133Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 12,
  "d": "M390,139L390,139L390,139L390,136L394,134L396,134L398,133L399,132L402,131L402,130L403,130L404,129L407,128L407,127L407,127L406,125L406,123L405,122L407,121L410,120L411,119L413,119L417,118L421,118L422,118L424,118L427,118L428,118L429,118L429,119L429,121L429,123L427,124L427,126L429,127L429,128L431,129L432,133L432,135L433,136L432,138L432,139L432,140L432,141L431,142L433,144L433,145L434,146L435,145L436,146L437,148L430,152L423,156L420,157L417,158L417,156L416,156L415,155L414,154L407,149L399,145L390,139Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 400,
  "d": "M491,128L491,127L494,128L498,126L499,129L499,129L494,130L497,132L496,133L495,133L494,134L493,134L492,135L490,135L490,134L491,131L491,130L491,129L491,128Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 784,
  "d": "M528,146L528,146L528,147L530,146L532,146L533,146L535,145L536,144L538,142L538,143L539,145L537,145L537,146L538,146L537,147L537,148L536,149L536,150L535,150L528,149L528,147L528,146Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 634,
  "d": "M526,145L526,143L526,142L527,142L528,143L528,144L527,145L526,145L526,145Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 414,
  "d": "M519,133L520,134L520,135L520,137L519,137L518,136L516,135L518,133L519,133Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 368,
  "d": "M499,129L498,126L503,124L504,121L504,119L505,119L507,117L507,117L510,117L511,118L512,117L514,120L515,121L515,122L514,123L513,125L515,127L518,128L519,130L519,131L519,131L519,132L521,134L519,133L518,133L516,135L512,135L505,131L502,129L499,129Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 512,
  "d": "M536,150L536,149L537,148L537,147L538,146L537,146L537,145L539,145L540,146L541,147L542,147L544,148L545,149L545,150L546,150L546,150L545,152L545,152L544,153L543,155L542,155L542,155L541,156L542,158L541,158L540,158L539,159L539,160L538,160L537,160L536,161L536,162L535,162L534,162L532,163L531,163L530,161L528,158L535,156L537,151L536,150ZM538,143L538,142L538,141L539,142L539,143L538,143Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 548,
  "d": "M791,235L792,237L792,237L791,236L791,235ZM790,235L790,234L790,233L791,233L791,235L790,235L790,235Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 116,
  "d": "M644,173L643,170L645,168L648,168L650,168L652,169L653,168L655,168L655,170L655,173L651,174L652,176L650,176L648,177L646,176L645,175L644,173Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 764,
  "d": "M650,168L648,168L645,168L643,170L644,173L642,172L640,172L640,170L638,170L638,173L637,176L636,178L636,180L638,180L638,182L639,184L640,185L642,185L643,186L642,187L640,187L640,186L638,185L638,186L637,185L637,184L636,182L634,181L634,183L634,181L634,180L635,178L636,176L637,174L636,172L636,171L636,169L634,168L634,166L634,166L635,164L634,163L633,161L632,159L633,159L634,156L635,156L637,155L638,155L639,155L639,157L641,157L640,159L640,161L643,160L643,160L645,160L645,159L647,160L649,161L649,164L651,165L650,167L650,168Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 418,
  "d": "M655,168L653,168L652,169L650,168L650,167L651,165L649,164L649,161L647,160L645,159L645,160L643,160L643,160L640,161L640,159L641,157L639,157L639,155L638,155L639,154L641,152L641,153L642,153L642,150L643,150L644,152L645,154L648,154L649,156L647,156L647,157L649,159L651,161L653,163L654,165L655,166L655,168Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 104,
  "d": "M638,155L637,155L635,156L634,156L633,159L632,159L633,161L634,163L635,164L634,166L634,166L634,168L636,169L636,171L636,172L637,174L636,176L635,178L634,176L635,175L634,173L634,171L634,170L633,167L632,164L631,162L630,164L627,165L626,165L625,164L625,162L625,160L623,157L623,156L622,156L620,154L620,152L621,153L621,151L622,151L622,150L623,149L623,147L624,147L625,145L626,144L627,142L627,141L630,139L631,140L631,138L632,138L632,137L633,137L634,138L635,139L635,141L635,142L633,144L632,147L635,147L635,149L637,149L636,151L638,152L639,152L640,151L641,152L639,154L638,155Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 704,
  "d": "M648,177L650,176L652,176L651,174L655,173L655,170L655,168L655,166L654,165L653,163L651,161L649,159L647,157L647,156L649,156L648,154L645,154L644,152L643,150L644,150L646,150L648,149L650,148L651,149L653,149L653,151L654,152L656,152L653,154L651,156L651,158L652,160L655,163L657,164L658,166L659,170L659,174L657,176L654,177L652,179L650,181L649,180L649,178L648,177Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 408,
  "d": "M708,106L708,106L708,106L708,106ZM708,106L708,106L707,106L706,107L705,108L705,109L704,110L704,110L703,111L702,111L701,112L700,113L700,113L701,113L702,114L702,115L701,115L699,115L699,116L698,116L697,116L696,116L696,116L695,116L695,116L695,116L694,115L695,114L695,114L695,114L696,113L696,112L694,112L693,111L695,110L697,109L699,107L700,108L702,108L702,107L705,106L706,105L708,106Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 410,
  "d": "M697,116L698,116L699,116L699,115L701,115L702,115L702,114L704,117L705,118L705,121L704,122L702,123L700,123L698,124L698,122L698,121L697,118L699,118L697,116Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 496,
  "d": "M610,90L612,90L617,88L620,87L622,88L624,88L626,89L628,89L632,90L634,88L633,87L635,84L638,85L640,86L643,86L643,88L646,89L648,88L651,88L654,88L656,89L657,91L659,91L662,91L664,90L667,90L671,88L672,89L673,89L676,89L675,91L673,93L674,94L675,94L677,94L679,93L681,94L683,95L683,96L681,96L678,96L676,97L674,98L671,99L668,100L666,100L665,100L664,101L664,102L665,103L663,104L662,105L659,106L655,106L652,106L649,108L648,107L645,107L642,106L640,105L637,106L632,105L630,105L628,104L627,102L626,101L623,100L620,100L617,99L616,98L617,96L616,94L612,93L611,92L610,90Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 356,
  "d": "M632,137L632,138L631,138L631,140L630,139L627,141L627,142L626,144L625,145L624,147L623,147L623,149L622,150L622,151L621,151L620,148L619,148L619,149L618,148L618,147L619,146L620,145L619,144L617,144L615,144L615,142L614,142L612,141L611,143L613,144L611,145L611,146L612,146L612,148L612,149L613,151L613,152L611,152L608,152L608,154L607,155L604,157L601,159L600,161L597,162L597,163L596,164L594,165L593,165L592,166L593,169L593,171L592,173L592,177L591,177L590,179L590,180L588,180L588,182L587,182L585,180L583,177L583,175L582,174L581,172L580,169L580,168L578,165L577,160L576,157L576,155L575,153L572,154L571,154L568,151L569,150L568,149L565,147L567,146L572,146L571,144L570,143L570,141L568,140L571,138L574,138L576,136L577,133L580,131L580,130L581,128L580,127L579,126L578,124L579,123L583,123L585,123L587,121L590,124L590,126L590,127L590,128L589,128L589,130L592,131L595,133L593,134L592,136L595,137L597,138L600,139L603,140L604,141L606,141L609,141L611,141L611,140L611,139L611,138L612,138L612,139L612,140L614,141L616,140L618,140L620,140L620,139L619,138L621,138L623,136L625,135L627,136L629,135L630,136L629,137L632,137Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 50,
  "d": "M621,151L621,153L620,152L620,154L620,153L620,152L619,151L618,149L616,149L616,150L616,152L615,151L614,151L614,151L613,151L612,149L612,148L612,146L611,146L611,145L613,144L611,143L612,141L614,142L615,142L615,144L617,144L619,144L620,145L619,146L618,147L618,148L619,149L619,148L620,148L621,151Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 64,
  "d": "M619,138L620,139L620,140L618,140L616,140L614,141L612,140L612,139L614,138L615,137L617,138L618,138L619,138Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 524,
  "d": "M611,138L611,139L611,140L611,141L609,141L606,141L604,141L603,140L600,139L597,138L595,137L592,136L593,134L595,133L596,132L598,133L600,135L601,135L602,136L604,136L606,137L608,138L611,138Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 586,
  "d": "M587,121L585,123L583,123L579,123L578,124L579,126L580,127L581,128L580,130L580,131L577,133L576,136L574,138L571,138L568,140L570,141L570,143L571,144L572,146L567,146L565,147L564,147L563,145L561,144L557,144L553,144L550,144L551,142L554,141L554,140L553,139L553,137L551,136L550,135L549,134L553,135L555,135L556,135L557,134L558,135L561,134L561,132L563,130L564,130L564,130L566,130L567,130L568,129L568,128L569,126L570,126L569,124L572,125L572,124L572,123L573,122L573,121L572,120L574,119L576,118L579,118L580,118L581,118L583,119L584,120L587,121Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 4,
  "d": "M562,117L563,117L565,118L565,118L567,117L568,117L568,116L570,117L570,116L570,115L571,115L573,115L572,116L573,116L573,118L574,118L574,118L575,118L577,117L578,117L581,117L581,118L580,118L579,118L576,118L574,119L572,120L573,121L573,122L572,123L572,124L572,125L569,124L570,126L569,126L568,128L568,129L567,130L566,130L564,130L564,130L563,130L561,132L561,134L558,135L557,134L556,135L555,135L553,135L549,134L551,132L551,130L549,130L549,129L548,127L549,126L548,125L549,124L549,121L552,122L554,121L554,120L556,120L557,119L558,118L559,117L560,116L561,117L562,117Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 762,
  "d": "M565,118L566,115L565,114L564,113L564,112L566,112L567,111L568,110L571,109L571,110L571,111L572,111L571,111L568,111L568,112L571,112L574,113L578,112L578,114L579,114L581,115L580,116L581,117L578,117L577,117L575,118L574,118L574,118L573,118L573,116L572,116L573,115L571,115L570,115L570,116L570,117L568,116L568,117L567,117L565,118L565,118Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 417,
  "d": "M572,106L572,105L574,105L577,106L578,104L579,104L582,105L583,105L587,105L590,105L591,106L593,106L593,106L589,108L588,109L585,109L584,110L582,110L580,110L578,111L579,112L578,112L574,113L571,112L568,112L568,111L571,111L572,111L574,111L576,109L574,108L572,109L570,108L572,106L572,106Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 795,
  "d": "M530,107L531,106L533,106L535,107L536,108L538,108L540,108L540,107L542,106L544,105L547,106L547,108L548,108L550,108L551,109L552,111L555,113L556,114L559,115L562,116L562,117L561,117L560,116L559,117L558,118L557,119L556,120L554,120L554,121L552,122L549,121L549,119L548,119L545,117L543,117L541,116L539,115L538,116L536,116L535,117L533,117L532,116L533,113L531,113L532,111L530,111L531,109L533,110L535,109L533,108L532,106L531,107L530,109L530,107Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 364,
  "d": "M521,134L519,132L519,131L519,131L519,130L518,128L515,127L513,125L514,123L515,122L515,121L514,120L512,117L511,116L511,115L511,112L512,112L512,113L514,114L515,114L516,114L519,112L520,112L520,113L519,114L521,115L521,115L522,117L524,117L526,118L529,118L533,118L533,117L535,117L536,116L538,116L539,115L541,116L543,117L545,117L548,119L549,119L549,121L549,124L548,125L549,126L548,127L549,129L549,130L551,130L551,132L549,134L550,135L551,136L553,137L553,139L554,140L554,141L551,142L550,144L546,144L543,143L541,143L540,140L539,140L537,140L535,141L532,140L530,139L527,138L526,136L524,133L523,133L522,133L521,134Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 760,
  "d": "M491,127L491,127L492,127L492,126L492,125L493,124L493,123L492,123L492,121L492,120L493,120L494,119L494,118L494,119L497,118L498,118L500,118L503,118L504,118L507,117L505,119L504,119L504,121L503,124L498,126L494,128L491,127Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 51,
  "d": "M516,114L515,114L514,113L514,112L513,112L513,112L512,112L511,111L509,111L510,110L509,109L512,108L513,109L514,109L513,110L515,111L514,111L515,112L516,112L516,114Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 752,
  "d": "M435.1,69.2L436.1,67.9L438,66.4L438.8,63.8L437.3,62.7L437.2,59.7L438.7,57.6L440.9,57.7L441.7,56.8L440.9,56L444.4,52.9L446.7,50.4L448.2,48.9L450.4,48.9L451,47.6L455.3,48L455.6,46.5L457,46.4L460.1,47.5L463.6,49L463.7,52.5L464.4,53.3L460.5,53.9L458.3,55.5L458.7,56.9L455.1,58.6L450.7,60.6L449,63.7L450.6,65.3L452.8,66.5L450.7,69L448.3,69.5L447.5,73.2L446.2,75.3L443.4,75.1L442.1,76.9L439.5,77L438.8,74.9L436.9,72.3L435.1,69.2Z",
  "fill": "#86efac",
  "name": "Sweden",
  "score": 2
}, {
  "id": 112,
  "d": "M474,75L477,76L477,76L478,76L480,77L481,78L480,78L482,80L482,80L482,81L484,81L485,81L484,82L482,82L481,82L482,83L482,84L480,84L480,85L480,86L479,86L477,86L476,85L475,86L474,85L473,85L470,85L468,85L466,85L465,85L464,85L464,84L463,83L464,83L464,82L464,81L464,80L466,80L468,79L469,78L471,77L470,76L472,76L474,75Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 804,
  "d": "M482,84L483,84L484,84L485,84L487,84L488,85L488,85L488,86L490,86L491,87L491,88L493,88L495,88L497,89L498,89L501,90L501,90L500,92L501,93L501,94L498,94L497,94L497,95L495,96L494,96L492,96L490,97L490,98L489,98L489,98L488,98L487,97L486,98L486,98L482,97L482,96L480,97L479,98L477,99L476,99L475,99L474,99L475,99L475,98L476,97L476,97L476,97L476,97L478,97L478,97L478,97L478,96L477,96L477,95L476,94L476,94L475,93L474,93L473,92L471,93L471,93L470,93L469,93L467,94L467,94L466,93L464,93L463,93L462,94L462,93L460,92L461,92L461,91L462,91L461,90L463,88L465,88L465,87L464,85L465,85L466,85L468,85L470,85L473,85L474,85L475,86L476,85L477,86L479,86L480,86L480,85L480,84L482,84Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 616,
  "d": "M464,80L464,81L464,82L464,83L463,83L464,84L464,85L465,87L465,88L463,88L461,90L462,91L461,91L459,90L458,90L457,90L455,91L454,90L453,90L453,90L452,89L450,89L450,88L448,88L448,88L447,88L447,87L445,87L444,86L443,85L444,84L443,83L442,82L443,82L442,81L444,80L447,79L450,78L452,79L453,79L455,79L458,79L462,79L463,80L464,80Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 40,
  "d": "M449,93L449,94L447,94L448,95L447,96L447,96L445,96L443,97L442,97L438,96L438,95L435,96L435,96L434,96L433,96L432,95L432,95L432,94L433,94L434,95L434,94L436,94L438,94L439,94L440,95L440,94L439,93L440,92L441,91L443,92L444,91L445,91L447,92L448,92L449,92L448,92L449,93Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 348,
  "d": "M460,92L462,93L462,94L460,94L459,96L458,97L456,98L455,97L453,98L452,98L450,98L449,97L448,97L447,96L447,96L448,95L447,94L449,94L449,93L450,94L451,94L453,94L453,93L454,93L455,93L455,93L456,93L457,92L457,92L460,93L460,92Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 498,
  "d": "M471,93L471,93L473,92L474,93L475,93L476,94L476,94L477,95L477,96L478,96L478,97L478,97L478,97L476,97L476,97L476,97L476,97L475,98L475,99L474,99L474,98L474,97L474,96L473,95L472,94L471,93L471,93Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 642,
  "d": "M474,99L475,99L476,99L477,99L478,100L476,100L476,100L475,103L474,103L472,102L469,102L468,103L465,103L463,103L462,103L462,102L461,101L462,101L461,101L460,101L459,101L459,100L458,99L457,98L456,98L458,97L459,96L460,94L462,94L463,93L464,93L466,93L467,94L467,94L469,93L470,93L471,93L471,93L472,94L473,95L474,96L474,97L474,98L474,99Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 440,
  "d": "M470,76L471,77L469,78L468,79L466,80L464,80L463,80L462,79L462,79L462,78L461,78L458,77L458,76L461,75L464,75L467,75L467,75L468,75L470,76Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 428,
  "d": "M472,72L473,73L473,74L474,75L472,76L470,76L468,75L467,75L467,75L464,75L461,75L458,76L458,74L459,72L461,72L463,73L465,73L465,72L467,71L468,72L470,72L472,72Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 233,
  "d": "M474,68L474,68L473,70L473,72L472,72L470,72L468,72L467,71L465,72L466,70L465,71L463,70L463,69L466,68L469,68L471,68L474,68Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 276,
  "d": "M442.2,80.5L442.7,81.7L442.1,82.3L442.9,83.1L443.5,84.2L443.3,85L444.2,86.4L443.2,86.7L442.6,86.4L442,86.8L440.4,87.3L439.5,87.8L437.9,88.3L438.3,89L438.5,89.9L439.7,90.4L441,91.4L440.2,92.4L439.3,92.7L439.7,94.1L439.5,94.5L438.7,94.1L437.7,94L436,94.4L434,94.3L433.7,94.9L432.5,94.3L431.9,94.4L429.4,93.7L428.9,94.2L427,94.2L427.3,92.6L428.4,91.1L425.2,90.7L424.1,90.1L424.2,89.1L423.8,88.6L424,87.1L423.6,84.8L425,84.8L425.6,83.9L426.2,81.9L425.7,81.2L426.2,80.7L428.1,80.6L428.5,81L430,80L429.5,79.1L429.4,77.9L431.1,78.2L432.6,77.8L432.6,78.7L434.9,79.2L434.9,80L437.2,79.6L438.5,79L441.1,79.8L442.2,80.5Z",
  "fill": "#4ade80",
  "name": "Germany",
  "score": 3
}, {
  "id": 100,
  "d": "M462,102L462,103L463,103L465,103L468,103L469,102L472,102L474,103L475,103L474,104L473,105L474,107L472,106L470,107L470,108L467,108L466,108L464,108L462,108L462,107L461,106L461,106L461,105L462,105L462,104L461,103L461,102L462,102Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 300,
  "d": "M470,122L470,122L466,122L466,122L464,122L464,121L465,121L467,121L469,121L469,122L470,122ZM462,108L464,108L466,108L467,108L470,108L470,107L471,108L470,109L469,109L468,109L467,109L464,110L466,111L464,111L463,111L462,110L462,111L462,112L463,113L462,113L464,114L465,115L465,116L463,116L463,117L462,117L463,119L461,119L459,118L459,116L458,115L457,114L456,113L456,112L457,111L457,110L458,110L458,109L459,109L460,109L462,109L462,108L462,108Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 792,
  "d": "M512,117L511,118L510,117L507,117L507,117L504,118L503,118L500,118L498,118L497,118L494,119L494,118L494,119L493,120L492,120L492,119L492,119L491,119L489,118L488,120L484,120L482,119L480,119L479,119L478,120L475,119L473,119L472,116L470,115L471,113L470,112L472,110L476,110L477,108L481,109L484,107L486,107L490,107L494,108L497,109L500,109L502,109L505,108L507,108L509,109L510,110L509,111L511,111L512,112L511,112L511,115L511,116L512,117ZM470,107L472,106L474,107L474,108L476,108L476,109L473,109L472,110L470,111L469,110L469,109L470,109L471,108L470,107Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 8,
  "d": "M458,109L458,110L457,110L457,111L456,112L456,112L456,111L454,111L454,110L454,108L455,107L454,107L454,106L455,105L455,106L456,105L456,106L457,106L457,107L457,108L457,109L458,109Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 191,
  "d": "M448,97L449,97L450,98L452,98L453,98L453,99L454,100L453,100L452,100L451,100L449,100L448,100L447,100L446,100L446,100L447,101L448,102L449,103L449,104L450,104L452,105L452,106L450,105L449,104L447,103L445,102L445,102L444,101L444,100L443,100L442,100L441,100L441,99L441,99L443,99L443,99L444,99L445,99L445,98L446,98L446,97L448,97Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 756,
  "d": "M432,94L432,95L432,95L433,96L434,96L434,97L433,97L431,97L430,98L429,98L429,97L428,98L427,98L426,98L425,97L424,97L424,96L425,95L425,94L426,95L427,94L429,94L429,94L432,94Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 442,
  "d": "M424,89L424,89L424,90L423,90L423,90L423,89L424,89Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 56,
  "d": "M424,87L424,89L423,89L423,90L421,89L420,89L418,88L417,87L416,87L416,86L418,86L419,86L421,86L423,87L424,87Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 528,
  "d": "M425.7,81.2L426.2,81.9L425.6,83.9L425,84.8L423.6,84.8L424,87.1L422.8,86.6L421.3,85.6L419.2,86.1L417.5,85.9L418.7,85.3L420.7,82L423.8,81.1L425.7,81.2Z",
  "fill": "#86efac",
  "name": "Netherlands",
  "score": 2
}, {
  "id": 620,
  "d": "M389,107L390,106L391,106L392,107L393,107L394,107L395,107L395,108L394,109L394,110L394,111L394,112L393,112L394,113L393,115L394,115L394,116L393,117L393,118L392,118L391,118L390,118L390,116L390,115L389,115L388,114L389,113L389,112L390,111L390,109L390,109L390,108L389,107Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 724,
  "d": "M393,118L393,117L394,116L394,115L393,115L394,113L393,112L394,112L394,111L394,110L394,109L395,108L395,107L394,107L393,107L392,107L391,106L390,106L389,107L390,105L389,104L392,103L395,103L398,103L400,104L402,103L406,104L407,104L411,105L412,105L414,106L417,106L417,107L415,108L412,109L412,110L410,111L409,113L410,114L409,115L408,116L407,117L405,119L402,119L400,119L399,119L398,120L397,120L396,119L395,118L393,118Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 372,
  "d": "M396,80L396,82L395,84L391,85L387,85L389,83L388,80L391,79L393,78L393,79L393,80L394,80L396,80Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 540,
  "d": "M788,247L790,248L791,249L790,250L789,249L787,248L785,247L784,245L784,245L785,245L786,246L787,246L788,247Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 90,
  "d": "M779,223L780,224L778,224L777,223L779,223L779,223ZM778,221L778,222L776,220L776,219L777,219L777,220L778,221ZM776,222L776,222L774,222L774,221L774,221L775,221L776,221L776,222ZM774,218L774,219L774,219L773,218L771,217L770,217L771,216L772,217L774,218ZM768,216L769,216L768,217L767,216L767,215L767,215L768,216Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 554,
  "d": "M813,289L812,290L811,292L809,293L809,292L808,292L809,290L808,289L806,288L806,287L808,286L808,285L808,283L807,282L807,281L806,280L804,278L803,277L804,277L805,278L807,278L808,280L809,283L809,281L811,282L811,284L813,284L814,284L816,284L817,284L816,286L815,287L814,287L813,288L813,289L813,289ZM797,297L798,296L800,295L801,293L802,292L802,291L804,290L804,291L805,292L806,291L807,292L807,293L806,294L805,296L803,296L804,298L803,298L801,298L800,300L799,302L797,303L796,304L794,304L792,303L790,303L789,302L791,300L793,298L795,298L797,297Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 36,
  "d": "M746,291L748,291L748,294L747,294L747,296L746,295L745,297L744,297L743,297L741,295L741,293L740,292L740,291L741,291L743,291L745,291L746,291ZM697,272L695,273L693,273L693,274L692,275L690,275L688,276L686,275L685,275L683,276L682,277L681,277L680,277L679,278L677,278L676,278L673,276L672,276L672,275L673,274L674,274L674,273L674,272L674,270L672,268L672,267L672,266L671,264L671,263L670,263L670,261L669,259L668,258L669,259L668,257L670,258L670,258L670,257L669,256L669,255L668,254L669,253L669,252L669,251L669,250L670,248L670,250L671,249L673,248L674,247L676,246L677,246L678,246L679,245L681,245L681,245L682,244L683,244L685,244L687,243L687,242L688,240L689,240L689,238L690,237L691,238L692,238L691,237L692,236L693,236L693,235L695,234L695,233L696,232L696,232L697,232L697,231L698,231L699,231L701,232L702,233L704,233L705,233L705,232L706,230L707,230L707,229L708,228L709,227L710,227L712,227L712,226L710,225L712,225L713,225L714,226L716,227L717,227L718,227L720,227L720,227L721,226L722,227L721,229L721,230L720,230L720,231L719,232L719,233L719,233L721,235L722,235L723,236L725,237L726,237L727,238L727,239L729,239L731,239L731,237L732,236L732,235L733,233L732,232L733,232L732,230L733,229L733,228L733,228L733,226L734,225L734,225L735,224L735,225L735,226L736,227L736,227L737,229L737,230L737,231L738,232L739,232L740,232L741,233L741,234L741,236L742,237L742,238L743,240L743,241L743,242L746,243L748,244L749,245L749,246L750,247L751,250L752,249L753,250L753,250L754,252L755,254L756,254L758,256L759,258L759,259L759,261L760,263L760,264L759,266L759,267L759,269L758,270L757,272L756,273L755,275L754,276L753,278L752,279L752,281L752,283L752,283L750,284L748,284L746,285L745,286L743,287L741,286L740,285L740,284L739,285L737,286L735,286L734,285L733,285L730,285L729,283L728,281L728,280L727,279L725,279L725,278L725,276L724,278L722,278L723,277L723,276L724,275L724,273L722,275L721,276L720,278L718,277L718,275L717,274L715,273L716,273L713,271L711,271L709,270L705,270L702,271L700,272L697,272Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 144,
  "d": "M596,183L596,186L595,186L593,187L592,185L592,182L593,178L594,179L595,181L596,183Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 156,
  "d": "M659.4,159.6L657.5,158.9L657.4,157L658.5,156L661,155.3L662.3,155.4L662.9,156.2L661.9,157.2L661.3,158.5L659.4,159.6ZM592.8,105.9L592.6,104.6L594.2,104L592.1,100.2L596.7,99.3L597.8,98.8L599.5,94.8L604,95.6L605.3,94.5L605.4,92.3L607.2,92.1L609,90.6L609.9,90.4L610.5,92L612.4,93.2L615.6,94L617.2,95.8L616.3,98.4L617.2,99.4L619.9,99.7L622.9,100.1L625.7,101.4L627.1,101.7L628.1,103.7L629.5,105.1L632,105L636.7,105.5L639.7,105.2L642,105.5L645.3,106.9L648.1,106.9L649.1,107.6L651.7,106.4L655.4,105.6L658.8,105.5L661.5,104.7L663.1,103.5L664.7,102.8L664.4,102.1L663.6,101.2L664.8,99.8L666.1,100L668.4,100.4L670.7,99.2L674.2,98.4L675.9,96.9L677.5,96.3L680.8,96L682.6,96.2L682.8,95.4L680.8,93.9L678.9,93.2L677.2,94L674.9,93.7L673.6,93.9L673,93L674.7,90.8L675.8,89.1L678.5,90L681.7,88.6L681.7,87.6L683.7,85.2L685,84.5L685,83.3L683.7,82.8L685.6,81.7L688.4,81.3L691.5,81.2L694.9,81.9L696.9,82.7L698.3,84.9L699.1,85.9L699.9,87.2L700.8,89.4L704.7,90.1L707.4,91.7L708.4,93.8L711.8,93.8L713.8,92.9L717.6,92.3L716.4,94.3L715.5,95.1L714.7,97.5L713.2,99.7L710.4,99.3L708.4,100.1L709,102L708.7,104.6L707.6,104.7L707.6,105.8L706.1,104.5L705.2,105.7L701.7,106.7L702,107.9L700.1,107.8L699,107.1L697.4,108.6L694.9,109.8L693,111.3L689.9,111.9L688.2,113L685.7,113.6L686.9,112.5L686.5,111.7L688.3,110.2L687.1,109L685.1,109.8L682.5,111.3L681.1,112.8L678.9,112.9L677.7,113.9L678.9,115.4L680.8,115.8L680.9,116.8L682.7,117.4L685.2,115.8L687.2,116.7L688.7,116.8L689.1,117.9L685.8,118.6L684.8,119.8L682.6,120.9L681.4,122.4L683.9,123.6L684.7,125.8L686.1,127.9L687.7,129.6L687.6,131.2L686.2,131.8L686.8,133L688.1,133.7L687.7,135.5L687.2,137.3L685.9,137.5L684.2,139.9L682.4,142.8L680.3,145.4L677.1,147.5L674,149.4L671.4,149.6L670,150.6L669.2,149.9L667.9,151L664.8,152.1L662.3,152.4L661.6,154.8L660.3,154.9L659.7,153.3L660.2,152.5L657.2,151.7L656.1,152.1L653.8,151.5L652.7,150.6L653.1,149.3L651,148.9L649.9,148.1L648,149.3L645.8,149.5L643.9,149.5L642.7,150.1L641.5,150.4L641.9,152.9L640.7,152.9L640.5,152.4L640.4,151.4L638.7,152.1L637.7,151.7L636,150.8L636.7,149L635.3,148.6L634.7,146.5L632.3,146.9L632.6,144.3L634.8,142.4L634.8,140.6L634.8,138.9L633.8,138.3L633,137L631.7,137.2L629.2,136.9L630,135.9L628.9,134.5L627.3,135.5L625.4,134.9L622.8,136.4L620.7,138L618.9,138.3L617.9,137.7L616.7,137.6L615,137.1L613.8,137.7L612.3,139.3L612.1,137.6L610.7,138.1L608.1,137.8L605.5,137.3L603.6,136.4L601.9,135.9L601.1,134.8L599.8,134.5L597.5,133.1L595.7,132.4L594.8,132.9L591.6,131.4L589.3,130L588.7,127.5L590.3,127.8L590.4,126.7L589.5,125.5L589.7,123.7L587.3,121.1L583.6,120.2L582.9,118.5L581.2,117.5L580.8,116.8L580.4,115.6L580.5,114.7L579.1,114.2L578.4,114.4L577.8,112.4L578.5,111.9L578.1,111.3L580.3,110.3L581.9,109.9L584.3,110.2L585.2,108.7L588.1,108.5L588.9,107.6L592.5,106.4L592.8,105.9Z",
  "fill": "#bbf7d0",
  "name": "China",
  "score": 1
}, {
  "id": 158,
  "d": "M687,146L686,149L685,151L684,149L684,148L685,146L687,144L688,144L687,146Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 380,
  "d": "M434,96L435,96L435,96L438,95L438,96L442,97L441,98L442,99L440,98L438,99L438,100L438,101L439,102L441,103L442,105L445,107L446,107L447,107L446,108L448,109L450,109L452,110L452,111L452,112L450,111L448,110L448,112L449,112L449,114L448,114L447,116L446,116L446,115L446,114L447,113L446,112L445,111L444,111L444,110L442,109L441,109L439,108L438,107L436,106L434,105L433,102L432,102L430,101L429,102L428,103L427,103L427,102L426,102L425,100L426,99L426,98L426,98L427,98L428,98L429,97L429,98L430,98L431,97L433,97L434,97L434,96ZM444,115L445,115L445,117L445,118L444,119L443,118L442,118L438,116L439,115L441,116L444,115ZM430,109L431,108L432,110L432,113L431,113L430,114L429,113L429,110L429,109L430,109Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 208,
  "d": "M433,78L431,78L429,78L429,77L428,74L429,74L430,73L432,73L432,72L434,72L434,73L433,74L434,74L435,75L434,75L434,75L432,77L433,78ZM438,75L439,76L438,78L435,77L435,76L438,75Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 826,
  "d": "M395.9,80.3L394.2,79.8L392.8,79.9L393.2,78.7L392.8,77.5L394.7,77.4L397.1,78.8L395.9,80.3ZM403,81.3L403,81.3L403.3,80L401.8,78.7L401.7,78.6L399,78.2L398.4,77.6L399.3,76.6L398.5,76L397.3,77.1L397.1,74.9L396,73.8L396.8,71.5L398.6,69.7L400.4,69.9L403.2,69.7L400.7,72.1L403,71.8L405.5,71.8L404.9,73.6L402.9,75.6L405.2,75.8L405.4,76L407.5,78.6L409,79L410.4,81.5L411.1,82.4L413.8,82.8L413.6,84.2L412.4,84.9L413.3,86L411.3,87.2L408.2,87.2L404.3,87.8L403.3,87.3L401.8,88.4L399.7,88.1L398.1,89L396.8,88.5L400.2,86.2L402.2,85.7L402.2,85.7L398.6,85.3L398,84.5L400.4,83.8L399.1,82.6L399.6,81.1L403,81.3Z",
  "fill": "#86efac",
  "name": "United Kingdom",
  "score": 2
}, {
  "id": 352,
  "d": "M377,52L376,54L379,55L376,57L370,59L368,59L365,59L358,58L360,57L355,56L360,55L359,55L355,54L356,53L360,52L363,54L367,53L370,53L373,52L377,52Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 31,
  "d": "M516,107L516,107L518,108L519,109L519,108L521,107L522,108L523,110L524,110L525,111L523,111L523,112L522,113L521,114L521,115L521,115L519,114L520,113L520,112L519,112L516,114L516,112L515,112L514,111L515,111L513,110L514,109L513,109L512,108L513,108L515,109L516,109L516,109L515,107L516,107ZM515,114L514,114L512,113L512,112L513,112L513,112L514,112L514,113L515,114Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 268,
  "d": "M501,104L501,103L503,104L507,104L510,105L510,105L511,105L514,106L514,107L516,107L515,107L516,109L516,109L515,109L513,108L512,108L509,109L507,108L505,108L505,107L504,105L503,104L502,104L501,104Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 608,
  "d": "M685,172L684,170L686,170L687,171L686,173L685,172ZM689,178L690,177L690,176L691,176L691,177L693,175L692,177L692,178L691,179L690,180L689,178L689,178ZM698,181L698,183L698,184L697,186L697,184L696,185L696,187L696,188L693,186L692,185L693,184L692,183L691,184L690,183L688,185L688,184L689,182L690,182L691,181L692,182L694,181L694,180L696,180L696,178L698,179L698,181L698,181ZM680,179L677,181L678,180L680,179L681,177L682,175L683,177L681,178L680,179ZM689,160L688,160L689,162L689,164L687,165L687,166L687,168L689,168L690,168L692,169L692,171L693,171L693,172L691,171L690,170L689,171L688,169L686,170L685,169L685,168L686,168L685,167L685,168L684,167L683,166L683,164L684,164L684,161L685,159L686,159L688,160L688,159L689,160ZM688,175L688,174L689,174L690,174L690,175L689,176L688,177L688,176L688,175ZM696,173L697,176L695,175L695,176L695,177L694,178L694,176L694,176L693,175L695,175L694,174L693,172L695,172L696,173Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 458,
  "d": "M638,186L638,185L640,186L640,187L642,187L643,186L643,186L645,188L646,189L646,191L645,192L646,193L646,194L647,194L648,196L647,197L646,197L644,196L641,194L641,193L639,191L639,189L638,188L639,187L638,186ZM679,191L677,190L674,190L673,193L672,194L671,197L669,197L667,197L666,197L665,198L663,198L662,198L660,197L660,196L662,196L663,196L664,194L665,194L667,193L669,191L670,190L671,191L672,190L673,190L673,189L673,188L675,186L676,185L677,185L678,186L678,187L680,187L682,188L681,189L680,189L680,190L679,191Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 96,
  "d": "M673,188L673,189L673,190L672,190L671,191L670,190L671,189L673,188Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 705,
  "d": "M442,97L443,97L445,96L447,96L447,96L447,96L448,97L446,97L446,98L445,98L445,99L444,99L443,99L443,99L441,99L442,99L441,98L442,97Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 246,
  "d": "M475,47L475,48L478,50L476,51L479,54L477,56L479,57L478,59L482,60L481,61L479,63L474,66L470,66L466,67L462,67L461,66L459,65L459,63L458,61L459,60L461,58L466,56L468,55L468,54L464,53L464,53L464,49L460,48L457,46L458,46L461,47L464,47L466,47L469,47L470,45L473,44L476,45L475,47Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 703,
  "d": "M461,91L461,92L460,92L460,93L457,92L457,92L456,93L455,93L455,93L454,93L453,93L453,94L451,94L450,94L449,93L448,92L449,92L449,92L450,92L451,91L451,91L451,91L451,91L452,90L452,90L453,90L453,90L454,90L455,91L457,90L458,90L459,90L461,91Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 203,
  "d": "M444,86L445,87L447,87L447,88L448,88L448,88L450,88L450,89L452,89L453,90L452,90L452,90L451,91L451,91L451,91L451,91L450,92L449,92L449,92L448,92L447,92L445,91L444,91L443,92L441,91L440,90L439,90L438,89L438,88L440,88L440,87L442,87L443,86L443,87L444,86Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 232,
  "d": "M493,168L493,167L494,164L494,162L495,162L496,161L498,160L499,163L499,165L501,166L504,168L505,169L506,170L507,171L508,172L507,172L507,172L506,171L505,170L504,169L503,169L501,168L500,168L499,167L498,168L496,167L496,168L493,168Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 392,
  "d": "M733,113L731,115L731,118L730,119L731,120L730,122L727,123L723,123L719,126L718,125L718,123L714,124L711,125L708,125L711,126L709,130L708,131L707,130L707,128L706,128L705,126L707,125L708,124L710,123L712,121L717,121L719,121L721,117L723,118L726,116L728,115L729,112L729,110L730,109L732,108L733,111L733,113ZM739,102L741,101L742,104L738,105L736,107L733,105L731,108L729,108L729,105L730,104L732,104L733,101L733,99L736,101L738,102L739,102ZM712,126L713,124L714,125L715,124L717,124L717,125L716,126L715,126L714,126L713,127L712,127L712,126Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 600,
  "d": "M278,245L278,246L278,249L280,250L281,249L283,250L283,250L284,252L284,253L285,253L286,253L286,253L286,255L286,256L286,257L285,259L283,261L281,261L279,261L277,260L279,257L278,256L276,255L273,253L271,253L267,249L268,247L268,246L269,244L273,243L275,243L278,244L278,245Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 887,
  "d": "M528,158L530,161L531,163L529,164L529,165L529,165L527,166L523,167L521,169L520,169L519,169L518,170L516,170L515,170L514,171L513,171L513,171L513,172L511,172L511,172L509,172L509,171L509,169L508,169L508,167L507,166L508,166L507,165L508,165L507,164L508,163L508,162L509,161L510,162L510,161L513,161L513,162L516,162L517,162L517,162L518,162L520,160L522,159L528,158Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 682,
  "d": "M490,135L492,135L493,134L494,134L495,133L496,133L497,132L494,130L499,129L499,129L502,129L505,131L512,135L516,135L518,136L519,137L520,137L521,139L522,139L523,140L524,141L524,142L524,142L524,143L525,144L525,144L526,145L526,145L527,145L528,146L528,147L528,149L535,150L536,150L537,151L535,156L528,158L522,159L520,160L518,162L517,162L517,162L516,162L513,162L513,161L510,161L510,162L509,161L508,162L508,163L507,164L507,163L507,162L506,161L505,160L504,159L503,157L502,155L501,155L499,153L499,151L499,150L498,147L497,147L495,146L495,145L495,144L494,143L494,143L493,141L491,139L490,138L489,138L489,136L489,136L490,135Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 10,
  "d": "M299,373L300,373L304,373L307,373L310,374L311,376L311,377L311,378L308,379L304,379L300,380L295,380L290,380L287,379L287,378L292,378L294,377L295,376L296,375L298,374L299,373ZM259,378L264,378L269,379L271,378L272,377L274,378L274,379L273,380L268,380L263,380L260,379L260,379L259,378ZM242,358L243,358L246,358L247,357L247,356L247,355L248,353L250,353L251,354L252,355L253,356L254,357L254,358L254,359L254,360L253,360L251,361L248,361L245,361L246,360L244,361L241,361L239,360L239,359L242,358ZM177,360L178,359L181,360L185,360L187,360L190,360L191,361L189,361L186,361L184,361L180,361L178,361L177,360ZM131,364L131,363L134,363L137,364L140,363L138,364L136,365L133,365L131,364ZM120,363L122,363L124,363L128,364L126,364L123,364L120,363ZM37,375L39,374L43,374L45,375L47,376L47,377L43,377L40,376L39,375L39,375L37,375ZM0,388L0,388L2,387L6,388L7,388L9,387L9,387L10,387L13,388L16,387L16,387L23,386L25,387L26,387L30,388L36,389L41,389L50,390L57,389L66,390L72,390L78,390L84,389L85,388L76,388L68,387L66,387L60,386L61,385L61,384L62,383L62,382L58,382L56,381L53,380L58,380L64,380L67,381L71,380L75,379L77,379L76,378L73,377L69,376L65,376L61,376L56,376L55,375L52,374L50,373L49,371L50,371L52,372L56,372L60,371L62,372L65,372L68,372L71,371L74,370L77,370L77,369L76,368L77,368L80,367L81,368L85,367L87,367L91,367L94,367L97,366L99,366L102,365L104,365L105,365L109,365L112,366L115,366L118,365L121,365L124,366L128,366L131,366L134,366L137,366L140,365L142,365L145,365L148,365L151,364L152,365L153,365L154,366L157,365L159,366L162,367L165,367L168,367L171,367L175,367L178,367L181,367L182,366L181,366L179,365L176,365L175,364L175,363L174,361L176,362L179,362L182,362L184,362L187,363L188,364L191,364L194,363L197,363L199,363L202,363L205,363L207,361L209,362L211,363L214,362L216,363L219,363L222,364L224,364L226,363L227,363L229,363L233,363L235,364L236,364L239,364L242,364L244,363L247,363L250,363L253,362L255,362L257,361L257,360L257,359L256,358L255,358L255,357L254,356L254,355L254,354L255,353L256,352L256,351L256,351L256,350L257,349L258,348L260,347L261,346L263,346L264,345L265,344L267,344L269,344L270,343L272,342L274,342L275,342L277,341L278,341L280,341L279,342L277,343L276,343L274,343L272,343L270,343L269,344L268,345L267,346L267,346L269,347L267,348L265,348L264,349L262,349L261,350L260,351L261,352L262,353L264,353L266,354L267,355L268,356L268,356L269,357L270,358L270,360L271,361L271,362L272,363L271,364L270,365L269,365L266,366L265,367L263,367L260,368L257,368L254,369L251,369L249,370L246,370L242,370L238,371L234,371L235,371L238,372L241,372L242,373L240,374L236,374L233,374L232,375L232,376L235,377L235,378L238,378L243,379L247,379L251,380L255,381L260,381L266,382L270,382L274,383L276,384L277,385L280,384L284,384L288,383L293,382L297,382L302,382L308,382L313,382L314,381L317,381L323,381L327,380L332,380L336,380L341,379L345,379L343,378L342,377L342,376L338,376L333,377L329,377L328,376L329,374L330,374L333,373L337,373L339,372L342,371L344,370L347,370L350,370L352,370L356,369L359,369L362,369L364,368L367,368L370,367L372,366L374,366L375,365L373,364L373,363L375,363L377,362L380,362L382,361L384,360L385,359L387,358L389,359L390,359L393,359L393,359L394,358L397,358L397,359L400,359L403,358L406,358L409,358L410,359L412,359L414,358L417,358L419,358L422,357L424,357L426,356L428,355L429,356L432,356L433,357L435,357L437,357L438,356L441,356L444,356L445,357L446,356L449,355L452,355L454,355L456,356L459,356L460,357L461,357L464,357L467,357L469,357L472,357L474,356L476,356L478,355L481,355L483,355L485,354L486,353L487,352L490,353L490,353L492,354L495,354L496,355L498,355L500,355L501,354L503,353L506,352L508,352L511,352L512,351L514,351L516,350L518,351L520,350L522,349L524,349L526,349L526,348L528,347L530,347L532,346L534,346L536,346L538,347L540,347L540,348L542,349L544,350L547,350L548,350L550,351L552,351L554,351L556,350L558,350L560,351L562,351L565,351L567,351L569,353L569,354L568,355L566,355L565,356L565,357L567,357L567,358L566,359L565,360L567,360L569,361L572,360L573,359L574,359L575,358L577,357L577,356L578,355L580,355L582,355L585,355L587,354L588,354L589,353L590,352L592,351L594,351L596,350L597,350L599,349L601,350L603,349L605,349L608,349L609,349L610,347L611,348L612,349L614,349L616,349L619,349L621,349L623,349L625,349L626,349L628,350L630,349L633,349L635,349L637,349L639,349L640,348L641,347L644,346L646,346L647,347L649,347L652,349L654,349L656,349L659,349L661,348L663,348L665,347L667,347L669,346L671,347L672,348L673,348L676,348L677,349L680,349L683,350L685,349L687,349L689,348L691,348L693,348L695,348L697,348L699,348L701,348L703,348L705,348L708,348L710,348L713,348L715,347L717,347L718,346L718,345L719,346L720,347L720,348L721,348L723,349L726,349L729,349L731,349L734,349L736,348L739,349L741,349L743,349L743,350L744,351L747,351L749,352L752,352L755,353L757,353L760,353L761,352L763,353L765,354L767,354L770,354L773,355L774,356L776,356L778,357L781,357L783,357L786,357L788,357L791,357L794,358L796,358L798,359L800,359L800,360L799,361L798,362L797,363L796,364L793,364L791,365L788,365L787,366L786,367L784,368L783,369L783,369L782,370L782,371L784,372L784,373L785,374L790,374L790,375L786,375L783,376L779,376L777,377L776,378L775,379L774,380L777,381L778,382L780,382L783,383L786,384L790,385L795,385L796,386L802,387L803,387L805,388L811,387L816,388L820,388L0,388Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": null,
  "d": "M485,122L485,122L485,121L487,121L489,121L487,122L487,122L487,122L487,122L486,122L486,122L486,122L486,122L486,122L485,122L485,122Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 196,
  "d": "M485,122L485,122L486,122L486,122L486,122L486,122L486,122L487,122L487,122L487,122L488,122L485,123L484,123L484,122L485,122Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 504,
  "d": "M405,122L406,123L406,125L407,127L407,127L407,128L404,129L403,130L402,130L402,131L399,132L398,133L396,134L394,134L390,136L390,139L390,139L390,140L389,140L388,140L387,140L386,140L384,140L383,142L383,142L382,145L378,147L378,150L377,151L376,152L371,152L371,152L371,151L372,151L373,150L373,149L374,147L375,146L376,146L376,144L376,143L377,142L379,141L380,139L380,139L381,138L383,137L385,136L386,135L388,134L388,131L389,129L389,128L390,126L393,125L394,124L396,122L397,121L398,121L400,122L402,121L404,122L405,122Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 818,
  "d": "M494,151L485,151L476,151L467,151L467,143L467,135L466,133L467,132L467,131L467,130L470,130L473,130L475,131L476,131L478,131L479,130L481,130L482,130L483,131L483,131L485,131L487,131L488,131L489,134L490,134L489,135L488,137L488,138L487,139L487,138L486,137L484,134L484,134L485,136L486,138L488,142L489,143L489,144L491,147L491,147L491,149L494,151L494,151Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 434,
  "d": "M467,151L467,156L464,156L464,157L455,152L446,148L444,149L442,150L441,149L437,148L436,146L435,145L434,146L433,145L433,144L431,142L432,141L432,140L432,139L432,138L433,136L432,135L432,133L433,132L433,131L433,130L434,129L435,129L436,128L436,126L439,127L440,127L442,127L445,128L446,130L448,131L451,132L454,133L455,132L456,131L455,129L456,128L458,127L459,127L462,128L463,129L464,129L465,129L467,129L467,130L467,131L467,132L466,133L467,135L467,143L467,151Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 231,
  "d": "M519,182L512,189L509,189L507,191L506,191L505,191L504,191L503,191L501,192L500,192L499,192L498,192L498,192L497,192L494,190L492,190L492,189L492,188L490,188L489,185L488,185L488,184L487,183L485,183L486,181L487,181L487,181L487,179L488,176L489,176L489,175L490,173L492,172L493,170L493,168L496,168L496,167L498,168L499,167L500,168L501,168L503,169L504,169L505,170L506,171L507,172L506,173L505,174L505,175L505,175L506,176L507,175L507,176L507,177L508,178L509,179L510,180L517,182L519,182Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 262,
  "d": "M507,172L507,172L508,172L509,173L509,173L507,174L508,175L507,176L507,175L506,176L505,175L505,175L505,174L506,173L507,172Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": null,
  "d": "M522,175L522,175L522,176L522,178L522,179L520,180L519,182L517,182L510,180L509,179L508,178L507,177L507,176L508,175L509,175L510,176L511,177L512,177L514,176L516,176L518,175L519,175L520,175L522,175Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 800,
  "d": "M487,202L483,202L480,202L479,203L478,203L477,203L477,201L478,201L478,199L479,198L479,197L480,196L481,195L480,195L480,192L481,192L483,192L485,192L486,192L488,191L489,192L489,193L490,196L489,197L488,199L487,200L487,202Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 646,
  "d": "M479,203L480,204L480,205L479,205L478,205L478,207L476,206L476,205L477,205L477,204L477,203L478,203L479,203Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 70,
  "d": "M452,105L450,104L449,104L449,103L448,102L447,101L446,100L446,100L447,100L448,100L449,100L451,100L452,100L453,100L454,100L454,101L455,102L454,103L454,103L453,104L453,104L452,105Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 807,
  "d": "M461,106L462,107L462,108L462,108L462,109L460,109L459,109L458,109L457,109L457,108L457,107L457,107L457,107L459,106L459,106L460,106L461,106Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 688,
  "d": "M453,98L455,97L456,98L457,98L458,99L459,100L459,101L460,101L461,101L462,101L461,101L462,102L461,102L461,103L462,104L462,105L461,105L461,106L461,106L460,106L459,106L459,106L459,106L460,105L459,105L459,105L459,105L458,104L458,104L457,104L457,104L457,105L456,105L456,105L456,104L455,104L454,104L454,103L454,103L455,102L454,101L454,100L453,100L454,100L453,99L453,98Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 499,
  "d": "M456,105L455,106L455,105L454,106L454,107L454,107L453,106L452,106L452,105L453,104L453,104L454,103L454,104L455,104L456,104L456,105L456,105L456,105Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": null,
  "d": "M457,107L457,106L456,106L456,105L456,105L457,105L457,104L457,104L458,104L458,104L459,105L459,105L459,105L460,105L459,106L459,106L459,106L459,106L457,107L457,107L457,107Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 780,
  "d": "M270,176L271,176L271,176L271,178L269,178L269,178L270,177L270,176Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}, {
  "id": 728,
  "d": "M480,192L478,191L478,190L476,190L475,190L475,191L474,190L472,188L472,188L470,187L470,186L469,185L467,183L467,183L466,182L464,181L465,181L466,180L467,178L467,177L469,177L469,178L470,179L471,179L472,179L473,179L474,179L476,179L476,179L477,178L478,178L478,177L480,178L481,178L483,177L484,175L484,174L483,173L484,173L485,173L486,173L485,175L486,176L487,177L487,178L487,179L487,179L487,181L487,181L486,181L485,183L487,183L488,184L488,185L489,185L490,188L489,189L488,191L486,192L485,192L483,192L481,192L480,192Z",
  "fill": "#e2e8f0",
  "name": "",
  "score": 0
}];
const GeoMapView = ({
  setSelCountry
}) => {
  const [hovered, setHovered] = React.useState(null);
  const W = 820,
    H = 400;

  // Map individual country names to GEO_DATA keys
  const toGeoKey = name => {
    if (["Germany", "France", "Netherlands"].includes(name)) return "European Union";
    if (name === "United Kingdom") return "United Kingdom";
    return name;
  };
  const ranked = GEO_DATA.map(g => ({
    name: g.country,
    total: (g.inn||0) + (g.cmr||0) + (g.str||0),
    inn: g.inn||0,
    cmr: g.cmr||0,
    str: g.str||0,
  })).sort((a,b) => b.total - a.total);
  return <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden"><div className="flex divide-x divide-slate-100"><div className="flex-1 p-5"><div className="relative bg-[#f8fafc] rounded-xl border border-slate-100 overflow-hidden"><svg viewBox="0 0 820 400" preserveAspectRatio="xMidYMid meet" className="w-full" style={{
            height: "auto",
            maxHeight: 340,
            display: "block"
          }}>{WORLD_PATHS.map(p => <path key={p.id} d={p.d} fill={p.fill} stroke="#fff" strokeWidth={p.score > 0 ? "0.8" : "0.3"} style={{
              cursor: "pointer"
            }} onMouseEnter={() => setHovered(p)} onMouseLeave={() => setHovered(null)} onClick={() => setSelCountry(toGeoKey(p.name))} />)}</svg>{hovered && <div className="absolute bottom-3 left-3 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg pointer-events-none z-10"><div className="text-[12px] font-semibold text-[#0f2644]">{hovered.name}</div><div className="text-[12px] text-[#0f2644] mt-0.5 flex items-center gap-1"><span>{hovered.score > 0 ? "Click to view details" : "No profiled provider activity, click for scope note"}</span></div></div>}
          {/* Legend */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 rounded-lg px-2 py-1.5 border border-slate-100"><span className="text-[10px] text-[#0f2644]">Low</span>{["#bbf7d0", "#86efac", "#4ade80", "#15803d"].map((c, i) => <div key={i} className="w-4 h-2.5 rounded-sm" style={{
              background: c
            }} />)}<span className="text-[10px] text-[#0f2644]">High</span></div></div></div><div className="w-[260px] flex-shrink-0 p-5"><div className="text-[12px] font-bold text-[#0f2644] uppercase tracking-wide mb-3">Activities by Region</div><table className="w-full"><thead><tr className="border-b border-slate-100"><th className="text-left pb-2 text-[12px] font-bold text-[#0f2644]">Country / Region</th><th className="text-right pb-2 text-[12px] font-bold text-[#0f2644]">Activities</th><th className="w-6"></th></tr></thead><tbody>{ranked.map((r) => {
            const totalActs = r.total;
            return <tr key={r.name} onClick={() => setSelCountry(r.name)} className="border-b border-slate-100 hover:bg-emerald-50/40 cursor-pointer transition-colors group"><td className="px-2 py-2.5"><span className="text-[12px] font-semibold text-[#0f2644] group-hover:text-[#059669] transition-colors">{r.name}</span></td><td className="px-2 py-2.5 text-right"><span className="text-[12px] font-bold text-[#0f2644]">{totalActs}</span></td><td className="px-2 py-2.5 text-right"><svg width="10" height="10" fill="none" stroke="#cbd5e1" strokeWidth="2" viewBox="0 0 24 24" className="ml-auto group-hover:stroke-[#1EDD7D]"><path d="M5 12h14M12 5l7 7-7 7" /></svg></td></tr>;
          })}</tbody></table></div></div></div>;
};
const PlayersGeographyPanel = ({
  initSubTab = "players",
  initSelPlayer = null,
  onSelPlayerConsumed,
  setTab: setRootTab = null
}) => {
  const [geoDrawerAct, setGeoDrawerAct] = React.useState<any>(null);
  const [subTab, setSubTab] = useState(initSubTab);
  const [viewMode, setViewMode] = useState("card");
  const [sel, setSel] = useState(null);
  const [dtab, setDtab] = useState("overview");
  const [expandedSig, setExpandedSig] = useState<number|null>(null);
  const [selCountry, setSelCountry] = useState(null);

  // Auto-open player drawer when navigated from Overview
  React.useEffect(() => {
    if (initSelPlayer) {
      const player = PLAYERS.find(p => p.name === initSelPlayer);
      if (player) {
        setSel(player);
        setSubTab("players");
      }
      if (onSelPlayerConsumed) onSelPlayerConsumed();
    }
  }, [initSelPlayer]);
  const [filterTiers, setFilterTiers] = useState(new Set());
  const [filterRoles, setFilterRoles] = useState(new Set());
  const [filterRegions, setFilterRegions] = useState(new Set());
  const [filterSubdomains, setFilterSubdomains] = useState(new Set());
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("tier");
  const [filterDominant, setFilterDominant] = useState(new Set());
  const tiers = ["Pioneer", "Established", "Challenger", "Specialist"];
  const roles = Array.from(new Set(PLAYERS.map(p => p.primaryRole))).sort();
  const regions = Array.from(new Set(PLAYERS.map(p => p.country))).sort();
  const allDominants = Array.from(new Set(GEO_DATA.map(g => getDominantLayer(g.inn, g.cmr, g.str).label)));
  const TIER_CLR = {
    Pioneer: {
      bg: "bg-orange-50",
      color: "text-orange-700",
      border: "border-orange-200",
      dot: "bg-orange-400"
    },
    Established: {
      bg: "bg-emerald-50",
      color: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-400"
    },
    Challenger: {
      bg: "bg-emerald-50",
      color: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-400"
    },
    Specialist: {
      bg: "bg-emerald-50",
      color: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-400"
    }
  };
  const filteredPlayers = PLAYERS.filter(p => {
    if (filterTiers.size > 0 && !filterTiers.has(p.tier)) return false;
    if (filterRoles.size > 0 && !filterRoles.has(p.primaryRole)) return false;
    if (filterRegions.size > 0 && !filterRegions.has(p.country)) return false;
    if (filterSubdomains.size > 0 && !p.subdomains.some(s => filterSubdomains.has(s))) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.country.toLowerCase().includes(q) || p.primaryRole.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "tier") {
      const o = {
        Pioneer: 0,
        Established: 1,
        Challenger: 2,
        Specialist: 3
      };
      return (o[a.tier] ?? 9) - (o[b.tier] ?? 9);
    }
    if (sortBy === "name-az") return a.name.localeCompare(b.name);
    if (sortBy === "role") return a.primaryRole.localeCompare(b.primaryRole);
    return 0;
  });
  const filteredGeo = GEO_DATA.filter(g => {
    if (filterDominant.size > 0) {
      if (!filterDominant.has(getDominantLayer(g.inn, g.cmr, g.str).label)) return false;
    }
    return true;
  });
  const hasPlayerFilters = filterTiers.size > 0 || filterRoles.size > 0 || filterRegions.size > 0 || filterSubdomains.size > 0 || search.trim() !== "";
  const hasGeoFilters = filterDominant.size > 0;

  // ── Player Card (grid view) ──
  const PlayerCard = ({ p }) => {
    const tc = TIER_CLR[p.tier] || { bg: "bg-slate-50", color: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" };
    const logoUrl = (PLAYER_LOGOS as any)[p.name];
    const initials = p.name.split(" ").slice(0, 2).map((w: string) => w[0]).join("");
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-3 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group" onClick={() => { setSel(p); setDtab("overview"); }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {logoUrl ? <img src={logoUrl} alt={p.name} className="w-8 h-8 object-contain" onError={(e: any) => { e.currentTarget.style.display = "none"; }} /> : <span className="text-[12px] font-bold text-[#0f2644]">{initials}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-bold text-[#0f2644] leading-snug group-hover:text-[#059669] transition-colors">{p.name}</div>
            <div className="flex items-center gap-1 text-[12px] text-[#0f2644] mt-0.5"><svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="flex-shrink-0 text-slate-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>{p.country}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tc.bg} ${tc.color} ${tc.border}`}>{p.tier}</span>
          <span className="text-[10px] text-[#0f2644] px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100">{p.primaryRole}</span>
        </div>
        <p className="text-[12px] text-[#0f2644] leading-relaxed line-clamp-3">{p.overview}</p>
        <div className="flex flex-wrap gap-1 mt-auto">
          {p.subdomains.slice(0, 2).map((s: string) => <span key={s} className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 leading-tight">{s.replace("Agent Orchestration Frameworks & Developer Infrastructure", "Orchestration & Dev Infra").replace("Customer-Facing Conversational & Voice Agents", "Customer-Facing Agents")}</span>)}
          {p.subdomains.length > 2 && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-100">+{p.subdomains.length - 2}</span>}
        </div>
        <div className="flex justify-end pt-1 border-t border-slate-100">
          <button onClick={(e:any) => { e.stopPropagation(); setSel(p); setDtab("overview"); }} className="flex items-center gap-1.5 text-[12px] font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors group/link">
            View Details<svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="group-hover/link:translate-x-0.5 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    );
  };

  // ── Player Row (table view) ──
  const PlayerRow = ({ p }) => {
    const tc = TIER_CLR[p.tier] || { bg: "bg-slate-50", color: "text-slate-600", border: "border-slate-200" };
    const logoUrl = (PLAYER_LOGOS as any)[p.name];
    const initials = p.name.split(" ").slice(0, 2).map((w: string) => w[0]).join("");
    return (
      <tr className="border-b border-slate-100 hover:bg-emerald-50/30 cursor-pointer transition-colors group" onClick={() => { setSel(p); setDtab("overview"); }}>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {logoUrl ? <img src={logoUrl} alt={p.name} className="w-5 h-5 object-contain" onError={(e: any) => { e.currentTarget.style.display = "none"; }} /> : <span className="text-[9px] font-bold text-[#0f2644]">{initials}</span>}
            </div>
            <span className="text-[12px] font-semibold text-[#0f2644] group-hover:text-[#059669] transition-colors">{p.name}</span>
          </div>
        </td>
        <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tc.bg} ${tc.color} ${tc.border}`}>{p.tier}</span></td>
        <td className="px-4 py-3"><span className="text-[12px] text-[#0f2644]">{p.primaryRole}</span></td>
        <td className="px-4 py-3"><p className="text-[12px] text-[#0f2644] leading-relaxed line-clamp-2 max-w-[240px]">{p.overview}</p></td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1">
            {p.subdomains.map((s: string) => <span key={s} className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">{s.replace("Agent Orchestration Frameworks & Developer Infrastructure", "Orchestration").replace("Customer-Facing Conversational & Voice Agents", "Customer-Facing")}</span>)}
          </div>
        </td>
      </tr>
    );
  };

  // ── Player Detail Drawer ──
  const PlayerDrawer = () => {
    if (!sel) return null;
    const tc = TIER_CLR[sel.tier];
    const initials = sel.name.split(" ").slice(0, 2).map(w => w[0]).join("");
    return <div className="fixed inset-0 z-[500] flex"><div className="flex-1 bg-black/30 backdrop-blur-[2px]" onClick={() => setSel(null)} /><div className="w-[700px] flex-shrink-0 bg-white flex flex-col h-full shadow-2xl border-l border-slate-200"><div className="flex-shrink-0 border-b border-slate-100"><div className="h-1 w-full bg-gradient-to-r from-[#0f2644] to-[#1EDD7D]" /><div className="px-6 py-4 flex items-start gap-4 justify-between"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">{PLAYER_LOGOS[sel.name] ? <img src={PLAYER_LOGOS[sel.name]} alt={sel.name} className="w-10 h-10 object-contain" onError={e => {
                  e.currentTarget.style.display = "none";
                }} /> : null}<span className="text-[15px] font-bold text-[#0f2644]" style={{
                  display: PLAYER_LOGOS[sel.name] ? "none" : "block"
                }}>{initials}</span></div><div><h2 className="text-[17px] font-bold text-[#0f2644] leading-snug">{sel.name}</h2><div className="flex items-center gap-2 mt-1 flex-wrap"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tc.bg} ${tc.color} ${tc.border}`}>{sel.tier}</span><TierTooltip tier={sel.tier} playerName={sel.name} /><span className="text-[13px] text-[#0f2644]">{sel.primaryRole}</span><RoleTooltip role={sel.primaryRole} playerName={sel.name} />{PLAYER_WEBSITES[sel.name] && <a href={`https://${PLAYER_WEBSITES[sel.name]}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[12px] font-medium text-[#2563eb] hover:underline ml-0.5"><svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>{PLAYER_WEBSITES[sel.name]}</a>}</div></div></div><button onClick={() => setSel(null)} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-[#0f2644] hover:bg-slate-50 flex-shrink-0"><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button></div><div className="flex border-b border-slate-100 px-6">{["overview", "signals"].map(t => <button key={t} onClick={() => setDtab(t)} className={`px-3 py-2.5 text-[12px] font-medium capitalize border-b-2 transition-colors ${dtab === t ? "border-[#1EDD7D] text-[#0f2644]" : "border-transparent text-[#0f2644] hover:text-slate-600"}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}</div></div><div className="flex-1 overflow-y-auto px-6 py-5">{dtab === "overview" && (()=>{
  const playerActs = ACT_BY_PLAYER[sel.name] || [];
  const topActs = playerActs.slice(0,5);
  return <div className="space-y-4">
    <p className="text-[12px] text-[#0f2644] leading-relaxed italic border-l-2 border-slate-200 pl-3">{sel.overview}</p>
    {topActs.length > 0 && <div>
      <div className="text-[12px] font-bold text-[#0f2644] mb-2">Key Activities in this Analysis</div>
      <ul className="space-y-2">
        {topActs.map((a:any)=>{
          const layer = ACT_LAYER[a.id] || "innovation";
          const accent = LAYER_COLOR[layer];
          return <li key={a.id} className="flex items-start gap-2 cursor-pointer group" onClick={()=>setGeoDrawerAct(a)}>
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{background:accent}}/>
            <div className="flex-1 min-w-0">
              <span className="text-[12.5px] font-semibold text-[#0f2644] group-hover:text-[#059669] transition-colors leading-snug">{a.headline}</span>
              <span className="text-[12px] font-mono text-[#0f2644] ml-2">{fmtDate(a.date)}</span>
            </div>
          </li>;
        })}
      </ul>
      {playerActs.length > 5 && <p className="text-[12px] text-[#0f2644] mt-1.5 pl-3.5">+{playerActs.length - 5} more (see Signals tab)</p>}
    </div>}
    <div className="grid grid-cols-2 gap-3">
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <div className="text-[12px] font-bold text-[#0f2644] mb-1">HQ Country</div>
        <div className="text-[12px] font-semibold text-[#0f2644]">{sel.country}</div>
      </div>
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <div className="text-[12px] font-bold text-[#0f2644] mb-1">Technology Segments</div>
        <div className="flex flex-wrap gap-1">{sel.subdomains.map((s:string)=><span key={s} className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">{s}</span>)}</div>
      </div>
    </div>
  </div>;
})()}{dtab === "signals" && <div className="space-y-2">{(()=>{
  const profiled = ACT_BY_PLAYER[sel.name] || [];
  if (profiled.length > 0) {
    return profiled.map((a:any, i:number) => {
      const layer = ACT_LAYER[a.id] || "innovation";
      const accent = LAYER_COLOR[layer];
      const layerLabel = {innovation:"Innovation",commercial:"Commercialisation",structural:"Structural"}[layer] || layer;
      return <div key={a.id} className="border border-slate-200 rounded-xl overflow-hidden cursor-pointer hover:border-emerald-300 hover:shadow-sm group transition-all" onClick={()=>setGeoDrawerAct(a)}>
        <div className="flex items-start gap-2.5 px-4 py-3">
          <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{background:accent}}/>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full border" style={{background:`${accent}15`,color:accent,borderColor:`${accent}30`}}>{layerLabel}</span>
              <span className="text-[10px] font-mono text-[#0f2644]">{fmtDate(a.date)}</span>
            </div>
            <p className="text-[12px] font-semibold text-[#000000] leading-snug mb-0.5">{a.headline}</p>
            <p className="text-[12px] text-[#0f2644] italic leading-snug line-clamp-2">{a.whyFlag}</p>
          </div>
          <span className="text-[10px] text-[#059669] font-semibold whitespace-nowrap flex-shrink-0 mt-0.5 group-hover:text-[#047857]">Open →</span>
        </div>
      </div>;
    });
  }
  // Fallback: show sel.signals as chips if no profiled acts found
  return sel.signals.map((s:string, i:number) => {
    const allActs = ACT_BY_PLAYER[sel.name] || [];
    const sigCore = (s.split(" (")[0]||"").toLowerCase();
    const matchedAct = allActs.find((a:any)=>{
      if(!a.headline) return false;
      const hl=a.headline.toLowerCase();
      const words=sigCore.split(" ").filter((w:string)=>w.length>4);
      return words.length>0?words.some((w:string)=>hl.includes(w)):hl.includes(sigCore.substring(0,15));
    }) || allActs[i % Math.max(allActs.length,1)];
    return <div key={i} className={`rounded-xl border transition-all ${matchedAct?"border-slate-200 bg-white cursor-pointer hover:border-emerald-300 hover:shadow-sm":"border-slate-100 bg-slate-50"}`} onClick={()=>matchedAct&&setGeoDrawerAct(matchedAct)}>
      <div className="flex items-center gap-3 p-3">
        <div className="w-2 h-2 rounded-full flex-shrink-0 bg-[#1EDD7D]"/>
        <span className="text-[12px] text-[#0f2644] font-medium flex-1 leading-snug">{s}</span>
        {matchedAct && <span className="text-[10px] text-emerald-600 font-semibold whitespace-nowrap flex-shrink-0">Open →</span>}
      </div>
    </div>;
  });
})()}</div>}</div></div></div>;
  };

  // ── Country Detail Drawer ──
  const CountryDrawer = () => {
    const [cdtab, setCdtab] = useState("overview");
    if (!selCountry) return null;
    const g = GEO_DATA.find(x => x.country === selCountry);
    if (!g) {
      return <div className="fixed inset-0 z-[500] flex"><div className="flex-1 bg-black/30 backdrop-blur-[2px]" onClick={() => setSelCountry(null)} /><div className="w-[480px] flex-shrink-0 bg-white flex flex-col h-full shadow-2xl border-l border-slate-200"><div className="flex-shrink-0 border-b border-slate-100"><div className="h-1 w-full bg-gradient-to-r from-slate-300 to-slate-200" /><div className="px-6 py-4 flex items-start justify-between gap-4"><div><h2 className="text-[17px] font-semibold text-[#0f2644]">{selCountry}</h2><span className="text-[10px] font-bold px-2.5 py-1 rounded-full border bg-slate-50 text-[#0f2644] border-slate-200 mt-1 inline-block">No profiled activity</span></div><button onClick={() => setSelCountry(null)} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-[#0f2644] hover:bg-slate-50 flex-shrink-0"><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button></div></div><div className="flex-1 overflow-y-auto px-6 py-5"><div className="p-4 rounded-xl bg-slate-50 border border-slate-100"><p className="text-[12px] text-[#0f2644] leading-relaxed">No profiled <strong>technology-provider</strong> activity was recorded for {selCountry} within this analysis. The provider landscape for Agentic AI in this evidence window is heavily US-centric, the named innovators, commercialisers and infrastructure builders are almost entirely US-headquartered.</p><p className="text-[12px] text-[#0f2644] leading-relaxed mt-3">Countries with confirmed provider HQ or landmark deployments are highlighted on the map. Deployment (customer) geography is broader than provider geography and is out of scope for this view.</p></div></div></div></div>;
    }

    const COUNTRY_ALIASES: Record<string,string[]> = {
      "United States": ["USA","US","United States"],
      "European Union": ["EU","European Union","Germany","France","Netherlands","Belgium","Austria","Ireland"],
      "United Kingdom": ["UK","United Kingdom","GB"],
      "Sweden": ["Sweden","SE"],
      "Brazil": ["Brazil","BR"],
      "India": ["India","IN"],
    };
    const aliases = COUNTRY_ALIASES[selCountry] || [selCountry];
    const matchesCountry = (ec: string) => aliases.includes(ec);
    const countryPlayers = PLAYERS.filter(p => matchesCountry(p.country));

    // All profiled activities where any entity country matches, deduplicated
    const rawCountryActs = ALL_ACTS_FLAT.filter(a =>
      (a.entities || []).some((e:any) => matchesCountry(e.country))
    );
    const allCountryActs = deduplicateActs(rawCountryActs);
    const innActs  = allCountryActs.filter(a => ACT_LAYER[a.id] === "innovation");
    const cmrActs  = allCountryActs.filter(a => ACT_LAYER[a.id] === "commercial");
    const strActs  = allCountryActs.filter(a => ACT_LAYER[a.id] === "structural");
    const totalActs = allCountryActs.length;

    // ── US-specific: select ~10 representative signals ──────────────────────
    const US_CUTOFF = 100_000_000; // $100M
    const usSelectedActs: any[] = (() => {
      if (selCountry !== "United States") return [];

      // 1. High-value funding rounds (>$100M), sorted by amount descending
      const highFunding = deduplicateActs(
        allCountryActs
          .filter(a => /_fund|inn_rnd_/.test(ACT_TO_KEY[a.id]||"") && parseHeadlineAmount(a.headline) >= US_CUTOFF)
          .sort((a,b) => parseHeadlineAmount(b.headline) - parseHeadlineAmount(a.headline))
      ).slice(0,5);

      // 2. M&A and strategic investments (acquisitions, major stakes)
      const maStrategic = deduplicateActs(
        allCountryActs
          .filter(a => /str_ma/.test(ACT_TO_KEY[a.id]||""))
          .sort((a,b) => parseHeadlineAmount(b.headline) - parseHeadlineAmount(a.headline))
      ).slice(0,4);

      // 3. Regulatory milestones
      const regulatory = deduplicateActs(
        allCountryActs.filter(a => /str_regulatory/.test(ACT_TO_KEY[a.id]||""))
      ).slice(0,3);

      // 4. Key commercial milestones (ARR, Fortune deployments)
      const commercial = deduplicateActs(
        allCountryActs
          .filter(a => ACT_LAYER[a.id] === "commercial" && /\$[\d]|Fortune|ARR|million|billion/i.test(a.headline))
          .sort((a,b) => parseHeadlineAmount(b.headline) - parseHeadlineAmount(a.headline))
      ).slice(0,3);

      // 5. Standards / open-source milestones (diversity)
      const standards = deduplicateActs(
        allCountryActs.filter(a => /str_standards|str_oss/.test(ACT_TO_KEY[a.id]||""))
      ).slice(0,3);

      let selected = deduplicateActs([...highFunding, ...maStrategic, ...regulatory, ...commercial, ...standards]);

      // 6. Fallback: fill to at least 10 with any remaining US activities
      if (selected.length < 10) {
        const selectedIds = new Set(selected.map((a:any) => a.id));
        const remaining = allCountryActs
          .filter(a => !selectedIds.has(a.id))
          .sort((a:any,b:any) => (b.date||"").localeCompare(a.date||""));
        selected = deduplicateActs([...selected, ...remaining]).slice(0, Math.max(10, selected.length));
      }

      return selected.slice(0, 15);
    })();

    // For the restricted (≥10 non-US) view
    const QUALIFYING_KEYS = /(_fund|str_ma|regulatory)/;
    const qualifiedActs = allCountryActs.filter(a => QUALIFYING_KEYS.test(ACT_TO_KEY[a.id] || ""));
    const qualFundingActs = qualifiedActs.filter(a => (ACT_TO_KEY[a.id]||"").includes("_fund"));
    const qualStrategicActs = qualifiedActs.filter(a => (ACT_TO_KEY[a.id]||"").includes("str_ma") || (ACT_TO_KEY[a.id]||"").includes("regulatory"));

    const dominant = getDominantLayer(innActs.length, cmrActs.length, strActs.length);
    const descBullets = g.desc.split(". ").map((s:string)=>s.trim()).filter((s:string)=>s.length > 15);

    // Entities appearing in this country's activities (not necessarily in PLAYERS array)
    const activityEntityNames: string[] = Array.from(new Set(
      allCountryActs.flatMap((a:any) =>
        (a.entities || [])
          .filter((e:any) => matchesCountry(e.country))
          .map((e:any) => e.name as string)
      )
    )).filter((name:string) => !countryPlayers.some((p:any) => p.name === name))
      .filter((name:string) => {
        // Exclude investors, customers, financial institutions from the overview badge list
        const EXCLUDED_ROLES = new Set(["Lead Investor","Co-lead Investor","Investor","Investing Organisation","Funded Company","Funded Startup","Fundraising Company","Enterprise Customer","Pilot Customer","Customer","Early Adopter","Distribution Partner","Platform Partner","Systems Integrator","Design Win Customer and Owner"]);
        const entityRole = allCountryActs.flatMap((a:any) => a.entities || []).find((e:any) => e.name === name)?.role || "";
        return !EXCLUDED_ROLES.has(entityRole);
      });

    const LayerBadge = ({layer}:{layer:string}) => {
      const cfg: Record<string,{color:string,label:string}> = {
        innovation:{color:"#059669",label:"Innovation"},
        commercial:{color:"#16a34a",label:"Commercialisation"},
        structural:{color:"#166534",label:"Structural"},
      };
      const c = cfg[layer] || {color:"#64748b",label:layer};
      return <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full border" style={{background:`${c.color}15`,color:c.color,borderColor:`${c.color}30`}}>{c.label}</span>;
    };

    const ActCard = ({a}:{a:any}) => (
      <div className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-sm cursor-pointer transition-all group bg-white" onClick={()=>setGeoDrawerAct(a)}>
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{background: ACT_LAYER[a.id]==="innovation"?"#059669":ACT_LAYER[a.id]==="commercial"?"#16a34a":"#166534"}}/>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <LayerBadge layer={ACT_LAYER[a.id]||"innovation"} />
            <span className="text-[10px] font-mono text-[#0f2644]">{fmtDate(a.date)}</span>
          </div>
          <p className="text-[12.5px] font-semibold text-[#0f2644] leading-snug group-hover:text-[#059669] transition-colors">{a.headline}</p>
        </div>
        <svg width="10" height="10" fill="none" stroke="#94a3b8" strokeWidth="2.5" viewBox="0 0 24 24" className="flex-shrink-0 mt-1 group-hover:stroke-[#059669]"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </div>
    );

    return <div className="fixed inset-0 z-[500] flex"><div className="flex-1 bg-black/30 backdrop-blur-[2px]" onClick={() => setSelCountry(null)} /><div className="w-[700px] flex-shrink-0 bg-white flex flex-col h-full shadow-2xl border-l border-slate-200">
      <div className="flex-shrink-0 border-b border-slate-100">
        <div className="h-1 w-full bg-gradient-to-r from-[#0f2644] to-[#1EDD7D]" />
        <div className="px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[17px] font-semibold text-[#0f2644]">{g.country}</h2>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-[12px] text-[#0f2644]">{totalActs} profiled {totalActs===1?"activity":"activities"}</span>
            </div>
          </div>
          <button onClick={() => setSelCountry(null)} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-[#0f2644] hover:bg-slate-50 flex-shrink-0">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="flex border-t border-slate-100 px-6">
          {[["overview","Overview",null],["signals","Signals",totalActs > 0 ? totalActs : null]].map(([id,lbl,cnt]:any) => (
            <button key={id} onClick={() => setCdtab(id)} className={`px-3 py-2.5 text-[12px] font-medium border-b-2 transition-colors ${cdtab===id?"border-[#1EDD7D] text-[#0f2644]":"border-transparent text-[#0f2644] hover:text-slate-600"}`}>
              <span className="inline-flex items-center gap-1.5">{lbl}{cnt!=null && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums ${cdtab===id?"bg-[#1EDD7D]/15 text-[#15b865]":"bg-slate-100 text-[#0f2644]"}`}>{cnt}</span>}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* OVERVIEW */}
        {cdtab === "overview" && <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {[["Total",totalActs,"#0f2644"],["Innovation",innActs.length,"#059669"],["Commercialisation",cmrActs.length,"#16a34a"],["Structural",strActs.length,"#166534"]].map(([lbl,val,col])=>(
              <div key={lbl as string} className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                <div className="text-[20px] font-black leading-none mb-1" style={{color:col as string}}>{val}</div>
                <div className="text-[10px] text-[#0f2644] leading-snug">{lbl}</div>
              </div>
            ))}
          </div>
          {totalActs > 0 && <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="text-[10px] font-semibold text-[#0f2644] mb-2">Signal composition</div>
            <div className="flex rounded-full overflow-hidden h-2.5 gap-px">
              {innActs.length>0 && <div className="h-full bg-[#059669]" style={{flex:innActs.length}}/>}
              {cmrActs.length>0 && <div className="h-full bg-[#16a34a]" style={{flex:cmrActs.length}}/>}
              {strActs.length>0 && <div className="h-full bg-[#166534]" style={{flex:strActs.length}}/>}
            </div>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              {[["#059669","Innovation",innActs.length],["#16a34a","Commercialisation",cmrActs.length],["#166534","Structural",strActs.length]].filter(([,,v])=>(v as number)>0).map(([col,lbl,val])=>(
                <div key={lbl as string} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{background:col as string}}/>
                  <span className="text-[9px] text-[#0f2644]">{lbl as string} {val}</span>
                </div>
              ))}
            </div>
          </div>}
          <ul className="space-y-1.5">
            {descBullets.map((s:string,i:number)=>(
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5"/>
                <p className="text-[12.5px] text-[#0f2644] leading-relaxed">{s}{s.endsWith(".")?"":" ."}</p>
              </li>
            ))}
          </ul>
          {/* Players sub-section — shown when there are players or notable entities for this country */}
          {(countryPlayers.length > 0 || activityEntityNames.length > 0) && <div className="border-t border-slate-100 pt-4">
            <div className="text-[12px] font-bold text-[#0f2644] mb-2">{countryPlayers.length > 0 ? "Players" : "Players & Notable Organisations"}</div>
            <div className="flex flex-wrap gap-2">
              {countryPlayers.map((p:any) => {
                const logoUrl = (PLAYER_LOGOS as any)[p.name];
                const initials = p.name.split(" ").slice(0,2).map((w:string)=>w[0]).join("");
                return <button key={p.name} onClick={() => { setSelCountry(null); setTimeout(()=>{setSel(p);setDtab("overview");},100); }} className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 hover:border-[#1EDD7D] hover:shadow-sm transition-all group">
                  <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {logoUrl ? <img src={logoUrl} alt={p.name} className="w-4 h-4 object-contain" onError={(e:any)=>{e.currentTarget.style.display="none";}} /> : <span className="text-[8px] font-bold text-[#0f2644]">{initials}</span>}
                  </div>
                  <div><div className="text-[12px] font-medium text-[#0f2644]">{p.name}</div><div className="text-[9px] text-[#0f2644]">{p.tier} · {p.primaryRole}</div></div>
                </button>;
              })}
              {countryPlayers.length === 0 && activityEntityNames.map((name:string) => {
                const logoUrl = (PLAYER_LOGOS as any)[name];
                const initials = name.split(" ").slice(0,2).map((w:string)=>w[0]).join("");
                // Find the entity's role from activities
                const entityRole = allCountryActs.flatMap((a:any) => a.entities || []).find((e:any) => e.name === name)?.role || "Organisation";
                return <div key={name} className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5">
                  <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {logoUrl ? <img src={logoUrl} alt={name} className="w-4 h-4 object-contain" onError={(e:any)=>{e.currentTarget.style.display="none";}} /> : <span className="text-[8px] font-bold text-[#0f2644]">{initials}</span>}
                  </div>
                  <div><div className="text-[12px] font-medium text-[#0f2644]">{name}</div><div className="text-[9px] text-[#0f2644]">{entityRole}</div></div>
                </div>;
              })}
            </div>
          </div>}
        </div>}

        {/* SIGNALS */}
        {cdtab === "signals" && <div className="px-6 py-5 space-y-4">
          {totalActs === 0
            ? <div className="p-4 rounded-xl bg-slate-50 border border-slate-100"><p className="text-[12px] text-[#0f2644] text-center">No profiled activities found for {g.country} in this analysis.</p></div>

            : selCountry === "United States"
              ? <>
                  <div className="space-y-2">{usSelectedActs.map((a:any)=><ActCard key={a.id} a={a}/>)}</div>
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-[12px] text-[#0f2644] mb-2">Showing {usSelectedActs.length} of {totalActs} profiled activities involving the United States. The full set is available in the Signals tab.</p>
                    <button onClick={() => { setSelCountry(null); if (setRootTab) setRootTab("signals"); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f0fdf4] border border-emerald-200 text-[12px] font-semibold text-[#059669] hover:bg-emerald-100 transition-colors">
                      View all signals <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                </>


              : totalActs < 10
              ? <>
                  <p className="text-[13px] text-[#0f2644]">All {totalActs} profiled {totalActs===1?"activity":"activities"} where {g.country} appears as an entity, across all signal layers.</p>
                  {innActs.length > 0 && <div>
                    <div className="flex items-center gap-1.5 mb-2"><span className="w-2 h-2 rounded-full bg-[#059669]"/><span className="text-[12px] font-bold text-[#059669]">Innovation</span></div>
                    <div className="space-y-2">{innActs.map((a:any)=><ActCard key={a.id} a={a}/>)}</div>
                  </div>}
                  {cmrActs.length > 0 && <div>
                    <div className="flex items-center gap-1.5 mb-2"><span className="w-2 h-2 rounded-full bg-[#16a34a]"/><span className="text-[12px] font-bold text-[#16a34a]">Commercialisation</span></div>
                    <div className="space-y-2">{cmrActs.map((a:any)=><ActCard key={a.id} a={a}/>)}</div>
                  </div>}
                  {strActs.length > 0 && <div>
                    <div className="flex items-center gap-1.5 mb-2"><span className="w-2 h-2 rounded-full bg-[#166534]"/><span className="text-[12px] font-bold text-[#166534]">Structural</span></div>
                    <div className="space-y-2">{strActs.map((a:any)=><ActCard key={a.id} a={a}/>)}</div>
                  </div>}
                  <div className="pt-2 border-t border-slate-100">
                    <button onClick={() => { setSelCountry(null); if (setRootTab) setRootTab("signals"); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f0fdf4] border border-emerald-200 text-[12px] font-semibold text-[#059669] hover:bg-emerald-100 transition-colors">
                      View all signals <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                </>

              : <>
                  <p className="text-[13px] text-[#0f2644]">{totalActs} total activities involve {g.country}. Showing funding rounds, strategic investments, and regulatory milestones only. Click any activity for the full profile.</p>
                  {qualFundingActs.length > 0 && <div>
                    <div className="flex items-center gap-1.5 mb-2"><span className="w-2 h-2 rounded-full bg-[#059669]"/><span className="text-[12px] font-bold text-[#059669]">Funding Deployed</span></div>
                    <div className="space-y-2">{qualFundingActs.map((a:any)=><ActCard key={a.id} a={a}/>)}</div>
                  </div>}
                  {qualStrategicActs.length > 0 && <div>
                    <div className="flex items-center gap-1.5 mb-2"><span className="w-2 h-2 rounded-full bg-[#166534]"/><span className="text-[12px] font-bold text-[#166534]">Strategic Investments and Regulatory</span></div>
                    <div className="space-y-2">{qualStrategicActs.map((a:any)=><ActCard key={a.id} a={a}/>)}</div>
                  </div>}
                  {qualifiedActs.length === 0 && <p className="text-[12px] text-[#0f2644] p-4 bg-slate-50 rounded-xl border border-slate-100">No funding, strategic investment, or regulatory activities are directly tagged to {g.country} in this analysis, though {g.country}-headquartered entities appear in {totalActs} activities across all signal layers.</p>}
                  <div className="pt-2 border-t border-slate-100">
                    <button onClick={() => { setSelCountry(null); if (setRootTab) setRootTab("signals"); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f0fdf4] border border-emerald-200 text-[12px] font-semibold text-[#059669] hover:bg-emerald-100 transition-colors">
                      View all signals <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                </>
          }
        </div>}

      </div>
    </div></div>;
  };

    // ── Geography table row ──
  const GeoRow = ({
    g
  }) => {
    const totalActivities = (g.inn||0) + (g.cmr||0) + (g.str||0);
    return <tr onClick={() => setSelCountry(g.country)} className="border-b border-slate-100 hover:bg-emerald-50/40 cursor-pointer transition-colors group"><td className="px-4 py-3"><span className="text-[13px] font-semibold text-[#0f2644] group-hover:text-[#059669] transition-colors">{g.country}</span></td><td className="px-3 py-3 text-right"><span className="text-[15px] font-bold text-[#0f2644]">{totalActivities}</span></td><td className="px-4 py-3 text-right"><svg width="12" height="12" fill="none" stroke="#cbd5e1" strokeWidth="2" viewBox="0 0 24 24" className="ml-auto group-hover:stroke-[#1EDD7D]"><path d="M5 12h14M12 5l7 7-7 7" /></svg></td></tr>;
  };
  return <React.Fragment><div className="flex items-center justify-between mb-5 gap-4"><div className="flex gap-2">{[{
          id: "players",
          label: "Players",
          color: "#166534",
          count: PLAYERS.length
        }, {
          id: "geography",
          label: "Geography",
          color: "#059669",
          count: 4
        }].map(t => {
          const active = subTab === t.id;
          return <button key={t.id} onClick={() => setSubTab(t.id)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-[12px] font-semibold transition-all ${active ? "text-white border-transparent shadow-md" : "bg-white border-slate-200 text-[#0f2644] hover:border-slate-300 hover:shadow-sm"}`} style={active ? {
            background: t.color
          } : {}}><span className="w-2 h-2 rounded-full flex-shrink-0" style={{
              background: active ? "rgba(255,255,255,0.7)" : t.color
            }} />{t.label}</button>;
        })}</div></div><div className="flex gap-4 items-start">{subTab === "players" && <aside className="w-[220px] flex-shrink-0 bg-white border border-slate-200 rounded-2xl overflow-hidden self-start sticky top-0"><div className="flex items-center justify-between px-4 py-3 border-b border-slate-100"><div className="flex items-center gap-2"><svg width="12" height="12" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg><span className="text-[12px] font-bold text-[#0f2644]">Filter</span></div>{hasPlayerFilters && <button onClick={() => {
            setFilterTiers(new Set());
            setFilterRoles(new Set());
            setFilterRegions(new Set());
            setFilterSubdomains(new Set());
            setSearch("");
          }} className="text-[12px] text-[#1EDD7D] font-semibold hover:underline">Clear all</button>}</div><div className="px-3 py-3 border-b border-slate-100"><div className="relative"><svg width="11" height="11" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24" className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search competitors..." className="w-full pl-7 pr-3 py-1.5 text-[12px] bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#1EDD7D] placeholder:text-slate-400" /></div></div><div className="px-4 py-3 border-b border-slate-100"><div className="text-[15px] font-bold text-[#0f2644] mb-2">Technology Segment</div>{SUBDOMAINS.map(sd => {
            const checked = filterSubdomains.has(sd.name);
            const stageClrMap = {
              Lab: "#15803d",
              Pilot: "#166534",
              "Early Commercial": "#059669",
              Scaling: "#059669"
            };
            const dotColor = stageClrMap[sd.stage] || "#64748b";
            return <label key={sd.id} className="flex items-center gap-2 py-1 cursor-pointer hover:opacity-80"><div onClick={() => {
                const n = new Set(filterSubdomains);
                n.has(sd.name) ? n.delete(sd.name) : n.add(sd.name);
                setFilterSubdomains(n);
              }} className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${checked ? "bg-[#0f2644] border-[#0f2644]" : "border-slate-300"}`}>{checked && <svg width="8" height="8" fill="white" viewBox="0 0 24 24"><polyline stroke="white" strokeWidth="3" fill="none" points="20 6 9 17 4 12" /></svg>}</div><div className="flex items-center gap-1.5 flex-1 min-w-0"><span className="text-[12px] text-[#0f2644] truncate" title={sd.name}>{sd.name}</span></div><span className="text-[12px] text-[#0f2644] flex-shrink-0">{PLAYERS.filter(p => p.subdomains.includes(sd.name)).length}</span></label>;
          })}</div><div className="px-4 py-3 border-b border-slate-100"><div className="flex items-center gap-1.5 mb-2"><div className="text-[15px] font-bold text-[#0f2644]">Player Tier</div><TierFilterTooltip /></div>{tiers.filter(t => t !== "Specialist" || PLAYERS.filter(p => p.tier === t).length > 0).map(t => {
            const tc = TIER_CLR[t];
            const checked = filterTiers.has(t);
            return <label key={t} className="flex items-center gap-2 py-1 cursor-pointer hover:opacity-80"><div onClick={() => {
                const n = new Set(filterTiers);
                n.has(t) ? n.delete(t) : n.add(t);
                setFilterTiers(n);
              }} className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${checked ? "bg-[#0f2644] border-[#0f2644]" : "border-slate-300"}`}>{checked && <svg width="8" height="8" fill="white" viewBox="0 0 24 24"><polyline stroke="white" strokeWidth="3" fill="none" points="20 6 9 17 4 12" /></svg>}</div><div className="flex items-center gap-1.5 flex-1"><span className="text-[12px] font-medium text-[#0f2644]">{t}</span></div><span className="text-[12px] text-[#0f2644]">{PLAYERS.filter(p => p.tier === t).length}</span></label>;
          })}</div><div className="px-4 py-3 border-b border-slate-100"><div className="flex items-center gap-1.5 mb-2"><div className="text-[15px] font-bold text-[#0f2644]">Ecosystem Role</div><RoleFilterTooltip /></div>{roles.map(r => {
            const checked = filterRoles.has(r);
            return <label key={r} className="flex items-center gap-2 py-1 cursor-pointer hover:opacity-80"><div onClick={() => {
                const n = new Set(filterRoles);
                n.has(r) ? n.delete(r) : n.add(r);
                setFilterRoles(n);
              }} className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${checked ? "bg-[#0f2644] border-[#0f2644]" : "border-slate-300"}`}>{checked && <svg width="8" height="8" fill="white" viewBox="0 0 24 24"><polyline stroke="white" strokeWidth="3" fill="none" points="20 6 9 17 4 12" /></svg>}</div><div className="flex items-center gap-1.5 flex-1"><span className="text-[13px] text-[#0f2644]">{r}</span></div><span className="text-[12px] text-[#0f2644]">{PLAYERS.filter(p => p.primaryRole === r).length}</span></label>;
          })}</div></aside>}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {subTab === "players" && <div className="flex items-center justify-between mb-3"><p className="text-[13px] text-[#0f2644]">Showing <span className="font-semibold text-[#0f2644]">{filteredPlayers.length}</span> of <span className="font-semibold">{PLAYERS.length}</span> participants</p><div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200"><button onClick={() => setViewMode("card")} title="Card view" className={`flex items-center justify-center w-7 h-7 rounded-md transition-all ${viewMode === "card" ? "bg-white shadow-sm text-[#0f2644]" : "text-[#0f2644] hover:text-slate-600"}`}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg></button><button onClick={() => setViewMode("table")} title="Table view" className={`flex items-center justify-center w-7 h-7 rounded-md transition-all ${viewMode === "table" ? "bg-white shadow-sm text-[#0f2644]" : "text-[#0f2644] hover:text-slate-600"}`}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button></div></div>}

        {/* PLAYERS, card view */}
        {subTab === "players" && viewMode === "card" && <div className="grid grid-cols-3 gap-3">{filteredPlayers.map((p, i) => <PlayerCard key={i} p={p} />)}</div>}

        {/* PLAYERS, table view */}
        {subTab === "players" && viewMode === "table" && <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden"><table className="w-full border-collapse"><thead><tr className="border-b border-slate-100 bg-slate-50"><th className="px-4 py-2.5 text-left text-[12px] font-bold text-[#0f2644] tracking-wider w-[200px]">Company</th><th className="px-4 py-2.5 text-left text-[12px] font-bold text-[#0f2644] tracking-wider w-[110px]"><span className="flex items-center gap-1">Player Tier<TierFilterTooltip /></span></th><th className="px-4 py-2.5 text-left text-[12px] font-bold text-[#0f2644] tracking-wider w-[130px]"><span className="flex items-center gap-1">Ecosystem Role<RoleFilterTooltip /></span></th><th className="px-4 py-2.5 text-left text-[12px] font-bold text-[#0f2644] tracking-wider w-[260px]">Description</th><th className="px-4 py-2.5 text-left text-[12px] font-bold text-[#0f2644] tracking-wider">Technology Segments</th></tr></thead><tbody>{filteredPlayers.map((p, i) => <PlayerRow key={i} p={p} />)}</tbody></table></div>}

        {/* GEOGRAPHY, map + ranked view */}
        {subTab === "geography" && <React.Fragment>
          {/* ── Geographic Breakdown ── */}
          <div className="mb-4">
            <h3 className="text-[15px] font-bold text-[#0f2644] mb-1">Geographic Breakdown</h3>
            <p className="text-[12px] text-[#0f2644] leading-relaxed">Activities are attributed to the geography most closely associated with the underlying event, organization, or institution. Counts reflect the geographic distribution of activities and may include countries, regions, or Intergovernmental organizations.</p>
          </div>
          <GeoMapView setSelCountry={setSelCountry} />
        </React.Fragment>}
      </div></div><PlayerDrawer /><CountryDrawer />{geoDrawerAct && <ActivityDrawerModal act={geoDrawerAct} sdName="" onClose={()=>setGeoDrawerAct(null)} onSelectActivity={(a)=>setGeoDrawerAct(a)} />}</React.Fragment>;
};
const WeakPanel = () => {
  const [typeFilter, setTypeFilter] = useState("All");
  const [scopeFilter, setScopeFilter] = useState(new Set());
  const [scopeOpen, setScopeOpen] = useState(true);
  const [typeOpen, setTypeOpen] = useState(true);
  const [weakView, setWeakView] = useState("card");

  // Combine all items with a type tag
  const allItems = [...WEAK_SIGNALS.map(ws => ({
    ...ws,
    type: "Weak Signal",
    accentColor: "#166534",
    accentBg: "#fffbeb",
    accentBorder: "#fde68a"
  })), ...CONTRADICTIONS.map(ct => ({
    ...ct,
    type: "Contradiction",
    accentColor: "#dc2626",
    accentBg: "#fef2f2",
    accentBorder: "#fecaca",
    significance: ct.nature,
    evidence: ct.note
  }))];
  const allScopes = Array.from(new Set(allItems.map(i => i.scope))).sort();
  const filtered = allItems.filter(item => {
    if (typeFilter !== "All" && item.type !== typeFilter) return false;
    if (scopeFilter.size > 0 && !scopeFilter.has(item.scope)) return false;
    return true;
  });
  const hasFilters = typeFilter !== "All" || scopeFilter.size > 0;
  const toggleScope = s => {
    const n = new Set(scopeFilter);
    n.has(s) ? n.delete(s) : n.add(s);
    setScopeFilter(n);
  };

  // ── Weak Signal Card ──
  const WeakCard = ({
    item
  }) => {
    const [exp, setExp] = useState(false);
    const isContra = item.type === "Contradiction";
    const ct = isContra ? CONTRADICTIONS.find(c => c.id === item.id) : null;
    return <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-sm transition-all group"><div className="h-1 w-full" style={{
        background: `linear-gradient(90deg,${item.accentColor},${item.accentColor}30)`
      }} /><div className="p-5"><div className="flex items-center gap-2 mb-3"><span className="text-[10px] font-bold px-2 py-0.5 rounded-full border" style={{
            background: item.accentBg,
            color: item.accentColor,
            borderColor: item.accentBorder
          }}>{item.type}</span><span className="text-[12px] font-medium text-[#0f2644]">{item.scope}</span></div><p className="text-[13px] font-semibold text-[#000000] leading-snug mb-3">{item.headline}</p><p className="text-[12px] text-[#0f2644] leading-relaxed mb-3">{item.significance}</p>{!isContra && <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2"><span className="text-[12px] font-semibold text-[#0f2644]">Supporting evidence: </span><span className="text-[12px] text-[#0f2644] italic">{item.evidence}</span></div>}{isContra && ct && <div><button onClick={() => setExp(e => !e)} className="flex items-center gap-1 text-[12px] font-medium text-[#0f2644] hover:text-[#0f2644] transition-colors mt-1"><svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={`transition-transform ${exp ? "rotate-90" : ""}`}><polyline points="9 18 15 12 9 6" /></svg>{exp ? "Hide" : "Show"} findings</button>{exp && <div className="mt-3 space-y-2"><div className="grid grid-cols-2 gap-2">{[["A", ct.findingA], ["B", ct.findingB]].map(([lbl, txt]) => <div key={lbl} className="bg-slate-50 rounded-xl p-3 border border-slate-100"><div className="text-[15px] font-bold text-[#0f2644] mb-1">Finding {lbl}</div><p className="text-[12px] text-[#0f2644] leading-relaxed">{txt}</p></div>)}</div><div className="mt-3 space-y-2"><div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3"><div className="text-[15px] font-bold text-emerald-700 mb-1">Assessment</div><p className="text-[12px] text-[#0f2644] leading-relaxed mb-1">{ct.resolution === "Genuinely unresolved" ? "Genuinely unresolved, both findings are supported and neither dominates the evidence." : ct.resolution === "Evidence leans: Finding A dominant" ? "The weight of evidence supports Finding A. Finding B is present but less supported." : ct.resolution === "Evidence leans: Finding B dominant" ? "The weight of evidence supports Finding B. Finding A is present but less supported." : ct.resolution}</p><p className="text-[12px] text-[#0f2644] leading-relaxed mb-2">{ct.nature}</p><div className="border-t border-emerald-200 pt-2 mt-2"><div className="text-[15px] font-bold text-[#0f2644] mb-1">Watch indicator</div><p className="text-[12px] text-[#0f2644] italic leading-relaxed">{ct.note}</p></div></div></div></div>}</div>}</div></div>;
  };
  return <div className="space-y-4"><div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4"><div className="flex items-center gap-2 mb-1.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2"><path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></svg><span className="text-[12px] font-bold text-amber-800">What weak signals are, and why they're here</span></div><p className="text-[12.5px] text-amber-900/80 leading-relaxed mb-1.5"><strong>Weak signals</strong> are early, single-data-point observations that are not yet strong enough to classify as a confirmed trend, but that may matter disproportionately if they develop. <strong>Contradictions</strong> are places where the evidence points two ways at once. Both are <em>watch items</em>, not conclusions.</p><p className="text-[12.5px] text-amber-900/80 leading-relaxed"><strong>On the overlap with “Strategic Directions”:</strong> some evidence (e.g. agent-payment protocols) appears in both views on purpose, the weak signal is the raw, unconfirmed observation; the strategic direction is the interpreted, forward-looking call we derive <em>from</em> it. The Directions view tells you what we think it means; this view preserves the underlying uncertainty so you can judge it yourself.</p></div><div className="grid grid-cols-2 gap-4">{allItems.map(item => <WeakCard key={item.id} item={item} />)}</div></div>;
};
const HEADLINE_ACTS = [{
  n: 1,
  date: "2026-01",
  label: "Agent Orchestration",
  sigType: "threshold_crossing",
  head: "LangChain and LangGraph achieve stable 1.0 releases, marking the transition from experimental developer tools to stable enterprise infrastructure.",
  sig: "Provides the reliability signal that risk-averse enterprise buyers require for mission-critical applications. The Klarna 85M-user deployment is a direct consequence of this milestone: Klarna cited the stable release as the basis for committing to a 85M-user production deployment.",
  detail: "Prior to the 1.0 release, LangGraph was in active development with breaking API changes across minor versions, which prevented enterprise engineering teams from committing production workloads to it. The 1.0 designation signals API stability, long-term support commitments, and production-grade reliability, three requirements that typically gate enterprise adoption. The timing (Jan 2026) coincided directly with the Klarna partnership announcement, confirming the causal relationship.",
  entities: ["LangChain Inc. (USA · Startup): Maintaining organisation"],
  implications: "Every technology segment's commercial activity in this analysis depends on orchestration framework stability. LangGraph 1.0 is the infrastructure foundation on which Klarna, Nubank, AWS Bedrock AgentCore, and other deployments are built."
}, {
  n: 2,
  date: "2024-10",
  label: "Agent Orchestration Frameworks & Developer Infrastructure",
  sigType: "threshold_crossing",
  head: "Anthropic launches Computer Use API and Model Context Protocol, shifting agents from structured API calls to universal human-like software interaction.",
  sig: "Moves agents beyond structured API calls to unstructured UI interaction, enabling operation of any software regardless of API availability. Triggered immediate US regulatory oversight.",
  detail: "Before Computer Use, agents could only interact with software that exposed structured APIs, ruling out the majority of enterprise software (legacy ERPs, desktop applications, proprietary internal tools). Computer Use removes this constraint by letting agents see a screen and use a keyboard and mouse. MCP is the complementary standard: it provides a structured protocol for connecting agents to external tools, which grew from 50 to 500+ servers within 12 months, indicating industry-wide adoption rather than a single-vendor feature.",
  entities: ["Anthropic (USA · Corporation): Launching party", "Replit (USA · Startup): First production deployment customer"],
  implications: "This is the most structurally consequential single product launch in the evidence bundle because it expands the addressable market for agentic automation to include all software, not just API-enabled software. It also triggered the first US regulatory oversight specifically distinguishing agentic autonomy as a risk category."
}, {
  n: 3,
  date: "2024-09",
  label: "Software Engineering Agents",
  sigType: "inflection",
  head: "OpenAI launches the o1 reasoning model series, introducing a new scaling approach based on inference-time compute rather than training volume.",
  sig: "Introduces a new scaling law that changes how the industry measures progress. Forces competitors to pivot toward reasoning depth as the primary differentiator.",
  detail: "Prior to o1, the dominant scaling approach was to train larger models on more data. o1 introduced a different axis: spending more compute at inference time to think longer before answering. This enables agents to handle multi-step planning tasks that were previously prone to failure due to lack of internal deliberation. The practical consequence for agentic AI is that agents can now tackle complex problem-solving reliably, not just simple instruction-following. Cognition AI integrated o1 into Devin within weeks of launch.",
  entities: ["OpenAI (USA · Corporation): Launching party", "Cognition AI (USA · Startup): Early integration partner"],
  implications: "Forces every major LLM provider to develop comparable reasoning models. Shifts the competitive differentiator from model size and training data volume to inference-time reasoning depth, a different optimisation axis that advantages companies with efficient inference infrastructure."
}];
const HeadlineActivities = () => {
  const [sel, setSel] = useState(null);
  const SIG_COLORS = {
    threshold_crossing: {
      bg: "#f0fdf4",
      color: "#059669",
      border: "#bbf7d0"
    },
    inflection: {
      bg: "#f0fdf4",
      color: "#16a34a",
      border: "#d1fae5"
    },
    strategic_commitment: {
      bg: "#fffbeb",
      color: "#166534",
      border: "#fde68a"
    },
    commercial_first: {
      bg: "#f0fdf4",
      color: "#16a34a",
      border: "#bbf7d0"
    }
  };
  const selHl = sel ? HEADLINE_ACTS.find(h => h.n === sel) : null;
  const sc = selHl ? (SIG_COLORS[selHl.sigType] ?? {bg:"#f8fafc",color:"#64748b",border:"#e2e8f0"}) : null;
  return <React.Fragment><div className="grid grid-cols-3 gap-4">{HEADLINE_ACTS.map(hl => {
        const c = (SIG_COLORS[hl.sigType] ?? {bg:"#f8fafc",color:"#64748b",border:"#e2e8f0"});
        return <div key={hl.n} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md hover:border-slate-300 transition-all"><div className="flex items-start gap-3"><div className="w-7 h-7 rounded-full bg-[#0f2644] text-white flex items-center justify-center text-[12px] font-bold flex-shrink-0 mt-0.5">{hl.n}</div><p className="text-[13px] font-semibold text-[#000000] leading-snug">{hl.head}</p></div><div className="flex flex-wrap gap-1.5"><span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border" style={{
              background: c.bg,
              color: c.color,
              borderColor: c.border
            }}>{hl.label}</span><span className="text-[10px] font-mono text-[#0f2644] px-1.5 py-0.5">{fmtDate(hl.date)}</span></div><div className="space-y-2"><div className="text-[15px] font-bold text-[#0f2644]">Companies Involved</div>{hl.entities.map((e, i) => {
              const companyName = e.split(" (")[0];
              const role = e.split(": ")[1] || "";
              const logo = PLAYER_LOGOS[companyName];
              const initials = companyName.split(" ").slice(0, 2).map(w => w[0]).join("");
              return <div key={i} className="flex items-center gap-2"><div className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden">{logo ? <img src={logo} alt={companyName} className="w-4 h-4 object-contain" onError={e => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement.innerHTML = `<span style="font-size:8px;font-weight:700;color:#64748b">${initials}</span>`;
                  }} /> : <span className="text-[9px] font-bold text-[#0f2644]">{initials}</span>}</div><div className="min-w-0"><span className="text-[12px] font-semibold text-[#0f2644]">{companyName}</span>{role && <span className="text-[10px] text-[#0f2644] ml-1">· {role}</span>}</div></div>;
            })}</div><div className="flex justify-end mt-auto pt-1 border-t border-slate-100"><button onClick={() => setSel(hl.n)} className="flex items-center gap-1.5 text-[12px] font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors group pt-2">View Details<svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="group-hover:translate-x-0.5 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" /></svg></button></div></div>;
      })}</div>{selHl && <div className="fixed inset-0 z-[600] flex"><div className="flex-1 bg-black/30 backdrop-blur-[2px]" onClick={() => setSel(null)} /><div className="w-[700px] flex-shrink-0 bg-white flex flex-col h-full shadow-2xl border-l border-slate-200"><div className="flex-shrink-0 border-b border-slate-100"><div className="h-1 w-full" style={{
            background: `linear-gradient(90deg,${sc.color},${sc.color}30)`
          }} /><div className="px-6 py-5 flex items-start justify-between gap-3"><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-3 flex-wrap"><span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border" style={{
                  background: sc.bg,
                  color: sc.color,
                  borderColor: sc.border
                }}>{selHl.label}</span><span className="text-[10px] font-mono text-[#0f2644]">{fmtDate(selHl.date)}</span></div><h3 className="text-[17px] font-bold text-[#0f2644] leading-snug">{selHl.head}</h3></div><button onClick={() => setSel(null)} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-[#0f2644] hover:bg-slate-50 flex-shrink-0"><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button></div></div><div className="flex-1 overflow-y-auto px-6 py-5 space-y-5"><div><div className="text-[15px] font-bold text-[#0f2644] mb-2">Significance</div><div className="border-l-2 border-[#1EDD7D] pl-3"><p className="text-[12px] text-[#0f2644] leading-relaxed">{selHl.sig}</p></div></div><div><div className="text-[15px] font-bold text-[#0f2644] mb-2">Full Context</div><p className="text-[12px] text-[#0f2644] leading-relaxed">{selHl.detail}</p></div><div className="grid grid-cols-2 gap-4"><div className="bg-slate-50 border border-slate-100 rounded-xl p-4"><div className="text-[15px] font-bold text-[#0f2644] mb-3">Companies Involved</div><ul className="space-y-2">{selHl.entities.map((e, i) => {
                  const companyName = e.split(" (")[0];
                  const role = e.split(": ")[1] || "";
                  const logo = PLAYER_LOGOS[companyName];
                  const initials = companyName.split(" ").slice(0, 2).map(w => w[0]).join("");
                  return <li key={i} className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">{logo ? <img src={logo} alt={companyName} className="w-5 h-5 object-contain" onError={ev => {
                        ev.currentTarget.style.display = "none";
                        ev.currentTarget.parentElement.innerHTML = `<span style="font-size:9px;font-weight:700;color:#64748b">${initials}</span>`;
                      }} /> : <span className="text-[10px] font-bold text-[#0f2644]">{initials}</span>}</div><div className="min-w-0"><div className="text-[12px] font-semibold text-[#0f2644] leading-none">{companyName}</div>{role && <div className="text-[12px] text-[#0f2644] mt-0.5">{role}</div>}</div></li>;
                })}</ul></div><div className="rounded-xl p-4 border" style={{
              background: sc.bg,
              borderColor: sc.border
            }}><div className="text-[15px] font-bold mb-3" style={{
                color: sc.color
              }}>Landscape Implications</div><p className="text-[12px] leading-relaxed" style={{
                color: sc.color
              }}>{selHl.implications}</p></div></div></div></div></div>}</React.Fragment>;
};
// ═══════════════════════════════════════════════════════
// SIGNAL COVERAGE MATRIX, activity density across 16×3 grid
// ═══════════════════════════════════════════════════════
const SignalCoverageMatrix = () => {
  const TYPES = [
    { layer: "inn", color: "#16a34a", label: "Patents Granted", frag: "_left" },
    { layer: "inn", color: "#16a34a", label: "Research Publications", frag: "_pub" },
    { layer: "inn", color: "#16a34a", label: "Funding Deployed", frag: "_fund" },
    { layer: "inn", color: "#16a34a", label: "Startup Formations", frag: "startup" },
    { layer: "inn", color: "#16a34a", label: "Hiring Activity", frag: "hiring" },
    { layer: "inn", color: "#16a34a", label: "R&D Investments", frag: "rnd" },
    { layer: "cmr", color: "#059669", label: "Partnerships", frag: "partnerships" },
    { layer: "cmr", color: "#059669", label: "Pilots", frag: "pilots" },
    { layer: "cmr", color: "#059669", label: "Product Launches", frag: "launches" },
    { layer: "cmr", color: "#059669", label: "Deployments", frag: "deployments" },
    { layer: "cmr", color: "#059669", label: "Design Wins", frag: "designwins" },
    { layer: "str", color: "#166534", label: "M&A & Investments", frag: "_ma_" },
    { layer: "str", color: "#166534", label: "Regulatory Milestones", frag: "regulatory" },
    { layer: "str", color: "#166534", label: "Standards Decisions", frag: "standards" },
    { layer: "str", color: "#166534", label: "Open-Source Releases", frag: "oss" },
    { layer: "str", color: "#166534", label: "Supply Chain Shifts", frag: "supplychain" },
  ];
  const countFor = (t, sdId) => Object.entries(COL_ACTS)
    .filter(([k]) => k.startsWith(t.layer + "_") && k.includes(t.frag) && k.includes(sdId))
    .reduce((s, [, v]) => s + v.length, 0);
  const shade = (c, n) => n === 0 ? "transparent" : n === 1 ? `${c}26` : n === 2 ? `${c}66` : c;
  const txtClr = (n) => n >= 3 ? "#fff" : n === 0 ? "#cbd5e1" : "#0f2644";
  const layerName = { inn: "Innovation", cmr: "Commercialisation", str: "Structural" };
  return <div className="bg-white border border-slate-200 rounded-2xl p-5">
    <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
      <div className="flex items-center gap-2">
        <div className="text-[15px] font-semibold text-[#0f2644]">Signal Coverage Matrix</div>
        <HoverTip hideIcon={true} title="Signal Coverage Matrix" label={<span className="text-[12px] text-[#0f2644] cursor-help">ⓘ</span>} desc="Number of individually profiled, sourced activities in each of the 16 signal types, for each technology segment. Darker cells indicate denser evidence; empty cells indicate where this analysis surfaced no profiled activity for that signal type in that technology segment (a coverage gap, not necessarily an absence of real-world activity)." />
      </div>
      <div className="flex items-center gap-1.5 text-[10px] text-[#0f2644]">
        <span>Fewer</span>
        {[0,1,2,3].map(n => <span key={n} className="w-4 h-4 rounded border border-slate-200" style={{background: n===0?"#f8fafc":shade("#64748b",n)}}/>)}
        <span>More</span>
      </div>
    </div>
    <p className="text-[12px] text-[#0f2644] leading-relaxed mb-4">Where the {ACT_COUNTS.innovation + ACT_COUNTS.commercial + ACT_COUNTS.structural} profiled activities concentrate across the full 16-signal framework, making coverage density and gaps visible at a glance.</p>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left text-[10px] font-bold text-[#0f2644] pb-2 pr-3 align-bottom">Signal Type</th>
            {SUBDOMAINS.map(sd => <th key={sd.id} className="text-center text-[10px] font-semibold text-[#0f2644] pb-2 px-1 align-bottom leading-tight" style={{maxWidth:90}}>{({sd1:"Software Engineering",sd2:"Customer-Facing",sd3:"Orchestration"})[sd.id] || sd.name}</th>)}
            <th className="text-center text-[10px] font-bold text-[#0f2644] pb-2 pl-2 align-bottom">Row</th>
          </tr>
        </thead>
        <tbody>
          {TYPES.map((t, i) => {
            const counts = SUBDOMAINS.map(sd => countFor(t, sd.id));
            const rowTotal = counts.reduce((a, b) => a + b, 0);
            const firstOfLayer = i === 0 || TYPES[i-1].layer !== t.layer;
            return <React.Fragment key={t.label}>
              {firstOfLayer && <tr><td colSpan={SUBDOMAINS.length + 2} className="pt-2 pb-1"><span className="text-[9px] font-bold tracking-wide" style={{color:t.color}}>{layerName[t.layer]}</span></td></tr>}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="text-[12px] text-[#0f2644] py-1 pr-3 whitespace-nowrap">{t.label}</td>
                {counts.map((n, ci) => <td key={ci} className="px-1 py-1">
                  <div className="mx-auto w-full h-7 rounded-md flex items-center justify-center text-[12px] font-bold border" style={{background: n===0?"#f8fafc":shade(t.color,n), color: txtClr(n), borderColor: n===0?"#f1f5f9":"transparent"}}>{n>0?n:"·"}</div>
                </td>)}
                <td className="text-center text-[12px] font-bold text-[#0f2644] pl-2">{rowTotal}</td>
              </tr>
            </React.Fragment>;
          })}
        </tbody>
      </table>
    </div>
  </div>;
};

// ═══════════════════════════════════════════════════════
// METHODOLOGY & DATA QUALITY, for the Summary Insights tab
// ═══════════════════════════════════════════════════════
const MethodologySection = () => {
  const [open, setOpen] = React.useState<string | null>("sources");
  const total = ACT_COUNTS.innovation + ACT_COUNTS.commercial + ACT_COUNTS.structural;
  const Section = ({ id, title, sub, children }: { id: string; title: string; sub: string; children: React.ReactNode }) => {
    const isOpen = open === id;
    return <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <button onClick={() => setOpen(o => o === id ? null : id)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors text-left">
        <div><div className="text-[12px] font-semibold text-[#0f2644]">{title}</div><div className="text-[12px] text-[#0f2644] mt-0.5">{sub}</div></div>
        <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2.5" viewBox="0 0 24 24" className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {isOpen && <div className="px-4 pb-4 pt-1 border-t border-slate-100">{children}</div>}
    </div>;
  };
  const SOURCE_ROWS = [
    { layer: "Innovation", color: "#16a34a", rows: [
      ["Patents Granted", "Google Patents", "Counted as families (not applications) to avoid multi-jurisdiction inflation; CPC G06N/G06F with agentic keyword filters"],
      ["Research Publications", "Google Scholar", "Preprints + published; de-duplicated across versions"],
      ["Funding Deployed", "Crunchbase · PitchBook · Tracxn + press", "Disclosed rounds only; cross-referenced against TechCrunch, Bloomberg, Reuters, Fortune"],
      ["Startup Formations / Hiring / R&D", "Company filings · career pages · research blogs", "Formation and hiring signals corroborated against primary company sources"],
    ]},
    { layer: "Commercialisation", color: "#059669", rows: [
      ["Partnerships / Pilots / Launches", "Company press · customer case studies · third-party press", "Named counterparties required; unnamed pilots excluded"],
      ["Deployments / Design Wins", "Customer announcements · vendor disclosures", "Production deployments with named customers and, where available, disclosed metrics"],
    ]},
    { layer: "Structural", color: "#166534", rows: [
      ["M&A & Investments", "Press · SEC / regulatory filings · company announcements", "Closed or announced transactions; values disclosed where available"],
      ["Regulatory Milestones", "Official government and regulator sources", "Enacted/live measures (e.g. EU AI Act) distinguished from proposals"],
      ["Standards Decisions", "Standards bodies (Linux Foundation, etc.) · protocol orgs", "Formal decisions and protocol adoptions"],
      ["Open-Source Releases", "GitHub · project release notes", "Major/stable releases (e.g. 1.0 GA) and reference implementations"],
    ]},
  ];
  const CONFIDENCE = [
    { tag: "Verified", color: "#059669", bg: "bg-emerald-50 border-emerald-200 text-emerald-700", desc: "Confirmed by a primary source, company announcement, official filing, or on-record figure. Carries a direct source link." },
    { tag: "Corroborated", color: "#059669", bg: "bg-emerald-50 border-emerald-200 text-emerald-700", desc: "Reported consistently across two or more independent secondary sources, but not confirmed by a single authoritative primary source." },
    { tag: "Estimated", color: "#166534", bg: "bg-amber-50 border-amber-200 text-amber-700", desc: "Modelled or derived, e.g. aggregate patent/publication volumes or funding totals adjusted for ~65–75% coverage. Treated as directional, not exact." },
  ];
  return <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
    <div className="flex items-center gap-2 mb-1">
      <svg width="15" height="15" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      <div className="text-[15px] font-semibold text-[#0f2644]">Sources, Methodology &amp; Data Quality</div>
    </div>
    <p className="text-[12px] text-[#0f2644] leading-relaxed mb-4">How this analysis was built, where the data comes from, what is verified versus estimated, and the limitations to keep in mind when acting on it. Every profiled activity carries a source link in the Signals tab.</p>

    <div className="space-y-2.5">
      <Section id="sources" title="Data sources by signal type" sub="Where each layer's evidence is drawn from">
        <div className="space-y-4 mt-2">
          {SOURCE_ROWS.map(grp => <div key={grp.layer}>
            <div className="flex items-center gap-1.5 mb-1.5"><span className="w-2 h-2 rounded-full" style={{background:grp.color}}/><span className="text-[15px] font-bold" style={{color:grp.color}}>{grp.layer}</span></div>
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-[12px]"><tbody>
                {grp.rows.map((r,ri) => <tr key={ri} className={ri%2===0?"bg-white":"bg-slate-50/60"}>
                  <td className="px-3 py-2 font-semibold text-[#0f2644] align-top w-[28%]">{r[0]}</td>
                  <td className="px-3 py-2 text-[#0f2644] align-top w-[34%]">{r[1]}</td>
                  <td className="px-3 py-2 text-[#0f2644] align-top leading-snug">{r[2]}</td>
                </tr>)}
              </tbody></table>
            </div>
          </div>)}
        </div>
      </Section>

      <Section id="confidence" title="Confidence levels" sub="How certainty is graded across the evidence base">
        <div className="space-y-2 mt-2">
          {CONFIDENCE.map(c => <div key={c.tag} className="flex items-start gap-3">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 mt-0.5 ${c.bg}`}>{c.tag}</span>
            <p className="text-[12px] text-[#0f2644] leading-relaxed">{c.desc}</p>
          </div>)}
          <p className="text-[12px] text-[#0f2644] leading-relaxed pt-1 border-t border-slate-100 mt-2">Provider-reported metrics (ARR, resolution rates, deployment counts) are company-disclosed and not independently audited; they are reported as claimed and labelled with their source.</p>
        </div>
      </Section>

      <Section id="classify" title="How the classifications are derived" sub="Signal Momentum · Maturity Stage · Cross-Signal Pattern · Significance Type">
        <div className="space-y-3 mt-2 text-[12px] text-[#0f2644] leading-relaxed">
          <p><strong className="text-[#0f2644]">Signal Momentum:</strong> the average 3-year CAGR across charted innovation metrics (patents granted, research publications, funding deployed), 2022 to 2025. 2026 is excluded as a partial year. The composite is an unweighted average across available metrics. Growth tiers: Hyper-growth (40% or above), High growth (20% to 40%), Moderate growth (5% to 20%), Low growth (0% to 5%), Contracting (below 0%).</p>
          <p><strong className="text-[#0f2644]">Maturity Stage:</strong> qualitative placement (Lab → Pilot → Early Commercial → Scaling) based on the combined weight of evidence across all three layers: research-only = Lab; first named pilots = Pilot; named launches with disclosed revenue/customers = Early Commercial; multiple production deployments plus consolidating M&A or governance = Scaling.</p>
          <p><strong className="text-[#0f2644]">Cross-Signal Pattern:</strong> describes the <em>relationship between</em> the three layers, not the speed of any one. Aligned-Accelerating means all three layers show strong, reinforcing evidence. Innovation-Ahead means research is dominant and commercial activity is thinner. Commercialising means commercial signals are strong while structural evidence remains in the background. Structurally-Gated means governance activity is the most prominent layer.</p>
          <p><strong className="text-[#0f2644]">Significance Type</strong>: every activity carries exactly one significance type explaining why it matters (Commercial First, Threshold Crossing, Strategic Commitment, Decision Gating, Unexpected Participant, Landscape Restructuring, or Inflection). Activities whose type resets the competitive picture, namely Commercial First, Landscape Restructuring, and Inflection, are visually emphasised in the Signals tab with a distinct card border to draw analytical attention.</p>
          <p className="text-[12px] text-[#0f2644]">Every custom classification in this tool has a hover tooltip with its definition at the point of use, and the complete list of classifications is collected in the "Terminology &amp; classifications" section below.</p>
        </div>
      </Section>

      <Section id="terminology" title="Terminology &amp; classifications" sub="Every custom term and classification used in this dashboard, defined in one place">
        <div className="space-y-4 mt-2 text-[12px] text-[#0f2644] leading-relaxed">
          <div>
            <p className="text-[12px] font-bold text-[#0f2644] mb-1.5">Core terms</p>
            <ul className="space-y-1.5">
              <li><strong>Technology Segment:</strong> a constituent area of the technology you entered. The technology is decomposed into technology segments so each can be analysed on its own evidence.</li>
              <li><strong>Key activity:</strong> an important, individually named, dated, and sourced event (funding round, launch, deployment, acquisition, regulation, standard) widely reported by third-party sources. Counts are of curated activities, not exhaustive totals.</li>
              <li><strong>Player:</strong> any named organisation appearing in the evidence: companies, research institutions, standards bodies, or regulators.</li>
              <li><strong>Cross-signal:</strong> analysis of the relationship <em>between</em> the three signal types (Innovation, Commercialisation, Structural), rather than any one signal in isolation.</li>
            </ul>
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#0f2644] mb-1.5">Player tiers, depth of evidence per organisation</p>
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-[12px]"><tbody>
                {Object.entries(TIER_TIPS).map(([label, cfg]: any, i: number) => <tr key={label} className={i%2===0?"bg-white":"bg-slate-50/60"}>
                  <td className="px-3 py-2 font-semibold align-top w-[26%] whitespace-nowrap" style={{color: cfg.color}}>{label}</td>
                  <td className="px-3 py-2 text-[#0f2644] align-top leading-snug">{cfg.desc}</td>
                </tr>)}
              </tbody></table>
            </div>
            <p className="text-[10.5px] text-[#0f2644]/70 italic mt-1.5">Tiers reflect signal presence within this analysis only, not overall size, revenue, or market position. The hover tooltip on each player shows the specific rationale for its tier.</p>
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#0f2644] mb-1.5">Player roles, where an organisation's signals concentrate</p>
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-[12px]"><tbody>
                {Object.entries(ROLE_TIPS).map(([label, cfg]: any, i: number) => <tr key={label} className={i%2===0?"bg-white":"bg-slate-50/60"}>
                  <td className="px-3 py-2 font-semibold text-[#0f2644] align-top w-[26%] whitespace-nowrap">{label}</td>
                  <td className="px-3 py-2 text-[#0f2644] align-top leading-snug">{cfg.desc}</td>
                </tr>)}
              </tbody></table>
            </div>
            <p className="text-[10.5px] text-[#0f2644]/70 italic mt-1.5">A role is a one-line description of where the organisation's evidence concentrates in this analysis, it is descriptive, not a fixed industry classification.</p>
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#0f2644] mb-1.5">Maturity stages</p>
            <ul className="space-y-1">
              <li><strong>Lab:</strong> research and patents only; no commercial products visible (pre-commercial, not inactive).</li>
              <li><strong>Pilot:</strong> first pilots with disclosed partners; products in testing, not full production.</li>
              <li><strong>Early Commercial:</strong> named launches and limited deployments; real revenue or formal partnerships confirmed.</li>
              <li><strong>Scaling:</strong> multiple deployments plus M&A reinforcing momentum; the strongest maturity signal.</li>
            </ul>
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#0f2644] mb-1.5">Cross-signal patterns</p>
            <ul className="space-y-1">
              <li><strong>Aligned-Accelerating:</strong> all three signal types show strong, sustained named evidence and reinforce each other.</li>
              <li><strong>Innovation-Ahead:</strong> research, funding, and formation evidence dominates; deployment and governance are thinner.</li>
              <li><strong>Commercialising:</strong> innovation and commercial layers are strong; structural evidence is present but thinner.</li>
              <li><strong>Structurally-Gated:</strong> regulation, standards, and M&A are the most prominent layer, shaping what all participants can do.</li>
              <li><strong>Divergent:</strong> evidence across layers points in inconsistent directions; signals are not mutually reinforcing.</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section id="limits" title="Known limitations &amp; caveats" sub="What to keep in mind when acting on this analysis">
        <ul className="space-y-2 mt-2">
          {[
            ["Funding coverage", "Estimated 65–75% of actual capital, undisclosed rounds are excluded. Totals are conservative."],
            ["Partial 2026", "January–May only. All 2026 figures are partial-year lower bounds, shown hatched in charts; not a decline."],
            ["Self-reported metrics", "ARR, resolution rates and deployment figures are vendor-disclosed and not independently audited."],
            ["Source-language skew", "Identification skews toward English-language sources; non-English-market activity (e.g. parts of Asia) is likely under-represented as provider activity."],
            ["Profiled vs. total", "Profiled activities are individually sourced events, deliberately distinct from the aggregate volume charts; the two are not the same count by design."],
          ].map((r,i) => <li key={i} className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0 mt-1.5"/>
            <p className="text-[12px] text-[#0f2644] leading-relaxed"><strong className="text-[#0f2644]">{r[0]}:</strong> {r[1]}</p>
          </li>)}
        </ul>
      </Section>
    </div>

    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
      <span className="text-[12px] text-[#0f2644]">{total} profiled activities · {SUBDOMAINS.length} technology segments · 16 signal types · {PLAYERS.length} named players · {GEO_DATA.length} geographies</span>
      <span className="text-[10px] text-[#0f2644]">Ideapoke Technology Activity Landscape · compiled across multiple sources</span>
    </div>
  </div>;
};

const TakeawaysPanel = () => {
  const [insightTab, setInsightTab] = React.useState("insights");
  const weakCount = WEAK_SIGNALS.length + CONTRADICTIONS.length;
  const TABS = [{
    id: "insights",
    label: "Intelligence Brief",
    color: "#059669",
    count: 3,
    tip: "Synthesised takeaways from the full body of evidence, the 3 most consequential headline activities, cross-technology segment comparison, and strategic directions to watch."
  }, {
    id: "weak",
    label: "Weak Signals & Contradictions",
    color: "#166534",
    count: weakCount,
    tip: "Early-stage signals not yet strong enough to classify as confirmed activities, plus contradictions where the evidence points in two directions simultaneously. These are watch items, not conclusions."
  }];
  return <div className="space-y-6"><div className="flex gap-2">{TABS.map(t => {
        const active = insightTab === t.id;
        return <div key={t.id} className="inline-flex items-center gap-1.5"><button onClick={() => setInsightTab(t.id)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-[12px] font-semibold transition-all ${active ? "text-white border-transparent shadow-md" : "bg-white border-slate-200 text-[#0f2644] hover:border-slate-300 hover:shadow-sm"}`} style={active ? {
          background: t.color
        } : {}}><span className="w-2 h-2 rounded-full flex-shrink-0" style={{
            background: active ? "rgba(255,255,255,0.7)" : t.color
          }} />{t.label}</button><HoverTip hideIcon={true} title={t.label} label={<span className="text-[12px] text-[#0f2644] cursor-help">ⓘ</span>} desc={t.tip} /></div>;
      })}</div>{insightTab === "insights" && <React.Fragment><div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-6"><div className="flex items-center gap-2 mb-3"><svg width="15" height="15" fill="none" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><span className="text-[15px] font-semibold text-[#000000] tracking-wide">Executive Summary</span></div><p className="text-[13px] leading-relaxed text-[#000000] mb-3">Across the three technology segments analysed, <strong className="text-[#000000]">agentic AI has moved decisively from research into active commercial deployment</strong>. Every technology segment has named products generating disclosed revenue at named enterprise customers; none remains pre-commercial. All three technology segments have reached Scaling stage, the strongest maturity classification, with multiple independent players generating $1B+ ARR, Fortune 500 production deployments, and platform-level M&A activity simultaneously.</p><p className="text-[13px] leading-relaxed text-[#000000]">The defining structural feature is <strong className="text-[#000000]">convergence on open interoperability standards:</strong> MCP for tool/data connectivity and A2A for agent-to-agent coordination, now adopted across every major foundation lab. The clearest tension is between the speed of commercial deployment and the slower formation of governance: customer-facing agents in particular are commercialising ahead of the standards and regulation that will eventually constrain them.</p></div><div className="bg-white border border-slate-200 rounded-2xl p-5"><div className="flex items-center gap-2 mb-1"><div className="text-[15px] font-bold text-[#000000]">Key Observations</div></div><p className="text-[12px] text-[#0f2644] leading-relaxed mb-4">What the evidence shows across the analysis window — charted volumes 2022 to May 2026, profiled activities concentrated in the last 2 years.</p><div className="grid grid-cols-2 gap-3 mb-4">{(()=>{
  const momResults = SUBDOMAINS.map(sd => {
    const mc = computeMomentum(SD_INN_Y[sd.id]||[]);
    const charts = SD_INN_Y[sd.id]||[];
    const patChart = charts.find((c:any)=>/patent/i.test(c.label||c.title||""));
    const pubChart = charts.find((c:any)=>/publication/i.test(c.label||c.title||""));
    const fundChart = charts.find((c:any)=>/funding/i.test(c.label||c.title||""));
    const getCagr = (ch:any) => {
      if (!ch) return null;
      const yrs = ch.years; const vals = ch.values;
      const s = yrs.indexOf(2022); const e = yrs.indexOf(2025);
      if (s<0||e<0||vals[s]===0) { const s23=yrs.indexOf(2023); return (s23>=0&&vals[s23]>0&&e>=0) ? Math.round((Math.pow(vals[e]/vals[s23],1/2)-1)*100) : null; }
      return Math.round((Math.pow(vals[e]/vals[s],1/3)-1)*100);
    };
    return {name: sd.name, id: sd.id, pct: mc.pct, label: mc.label, color: mc.color,
      patCagr: getCagr(patChart), pubCagr: getCagr(pubChart), fundCagr: getCagr(fundChart)};
  });
  const topCagr = momResults.reduce((a,b)=>a.pct>b.pct?a:b, momResults[0]);
  const funding2025 = SUBDOMAINS.map(sd => {
    const charts = SD_INN_Y[sd.id]||[];
    const fundChart = charts.find((c:any)=>/funding/i.test(c.label||c.title||""));
    const val = fundChart ? (fundChart.values[fundChart.years.indexOf(2025)]||0) : 0;
    return {name: sd.name, val};
  });
  const topFunding = funding2025.reduce((a,b)=>a.val>b.val?a:b, funding2025[0]);
  const hyperCount = momResults.filter(m=>m.pct>=40).length;
  const shortName = (n:string)=>n.replace("Agent Orchestration Frameworks & Developer Infrastructure","Orchestration & Dev Infra").replace("Customer-Facing Conversational & Voice Agents","Customer-Facing Agents");

  const cagrTip = topCagr ? (() => {
    const parts = [];
    if (topCagr.patCagr !== null) parts.push(`Patents ${topCagr.patCagr>0?"+":""}${topCagr.patCagr}%`);
    if (topCagr.pubCagr !== null) parts.push(`Publications ${topCagr.pubCagr>0?"+":""}${topCagr.pubCagr}%`);
    if (topCagr.fundCagr !== null) parts.push(`Funding ${topCagr.fundCagr>0?"+":""}${topCagr.fundCagr}%`);
    const avg = parts.length > 0 ? `(${parts.join(" + ")}) ÷ ${parts.length} = ${topCagr.pct>0?"+":""}${topCagr.pct}%` : "";
    return `Average CAGR is calculated across patents granted, research publications, and funding deployed (2022–2025). Example for ${shortName(topCagr.name)}: ${avg}, placing it in the ${topCagr.label} tier.`;
  })() : "";

  const tiles = [
    {
      label: "Technology segment with highest average CAGR",
      value: shortName(topCagr?.name||""),
      sub: `${topCagr?.pct>0?"+":""}${topCagr?.pct}% avg CAGR · ${topCagr?.label}`,
      green: true,
      tip: cagrTip
    },
    {
      label: "Highest 2025 funding deployed",
      value: shortName(topFunding?.name||""),
      sub: `$${topFunding?.val}M deployed in 2025`,
      green: false,
      tip: `Funding deployed in 2025 reflects disclosed funding rounds and strategic investments tracked for each technology segment. ${shortName(topFunding?.name||"")} recorded the highest total of $${topFunding?.val}M across the segments profiled in this analysis.`
    },
    {
      label: "Technology segments at Hyper-growth",
      value: `${hyperCount} of ${SUBDOMAINS.length}`,
      sub: "All segments at 40% or above average CAGR",
      green: true,
      tip: "Hyper-growth means the average CAGR across patents, publications, and funding is 40% or above. All three technology segments in this analysis meet this threshold."
    },
    {
      label: "Named players with verified signal presence",
      value: String(PLAYERS.length),
      sub: `${PLAYERS.filter(p=>p.tier==="Pioneer").length} Pioneers · ${PLAYERS.filter(p=>p.tier==="Established").length} Established · ${PLAYERS.filter(p=>p.tier==="Challenger").length} Challengers`,
      green: false,
      tip: `The number of distinct organisations identified across the evidence base with a verified signal presence, classified by evidence tier: Pioneer, Established, or Challenger. ${PLAYERS.length} organisations meet this threshold across all three technology segments.`
    }
  ];

  return tiles.map((t,i) => (
    <div key={i} className={`rounded-2xl p-4 border flex flex-col gap-2 ${t.green ? "bg-[#f0fdf4] border-[#86efac]" : "bg-white border-slate-200"}`}>
      <div className="flex items-start justify-between gap-1">
        <div className={`text-[10px] font-bold tracking-[0.04em] leading-snug ${t.green?"text-emerald-700":"text-[#0f2644]"}`}>{t.label}</div>
        {t.tip && <HoverTip hideIcon={true} title={t.label} label={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={t.green?"#16a34a":"#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 cursor-help mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>} desc={t.tip} />}
      </div>
      <div className={`text-[22px] font-black leading-tight ${t.green?"text-[#15803d]":"text-[#0f2644]"}`}>{t.value}</div>
      <div className={`text-[12px] leading-snug ${t.green?"text-emerald-600":"text-[#0f2644]"}`}>{t.sub}</div>
    </div>
  ));
})()}</div><div className="space-y-1.5">{["<strong>Maturity:</strong> all three technology segments are at Scaling stage, the strongest maturity signal the platform assigns. Multiple independent players in each technology segment have confirmed $1B+ ARR, Fortune 500 production deployments, and platform-level M&A simultaneously.","<strong>Where activity concentrates:</strong> Innovation signals run at or ahead of Commercialisation in every technology segment, the field is generating new IP at least as fast as it is monetising. Both funding and patent families reached their highest levels in 2025.","<strong>Cross-signal patterns:</strong> all three technology segments are <em>Aligned-Accelerating:</em> innovation, commercial, and structural signals are reinforcing each other simultaneously within each segment.","<strong>Geography:</strong> the profiled provider landscape is almost entirely US-headquartered; non-US presence appears mainly as large deployments (Klarna, Nubank), not as providers."].map((t,i)=><div key={i} className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0 mt-1.5" /><p className="text-[12px] text-[#0f2644] leading-relaxed" dangerouslySetInnerHTML={{__html:t}} /></div>)}</div></div><div><p className="text-[12px] font-medium text-[#0f2644] tracking-[0.06em] mb-3">3 Headline Activities: Most Consequential</p><HeadlineActivities /></div><div><p className="text-[12px] font-medium text-[#0f2644] tracking-[0.06em] mb-3">Strategic Directions to Watch</p><div className="grid grid-cols-2 gap-4">{[{
            head: "Agent payment protocols are emerging as the next infrastructure layer after computer-use.",
            body: "Agents can now plan, reason, and call APIs, but they cannot autonomously authorise payments. Every workflow that reaches a payment step requires human re-entry. Skyfire's $8.5M seed (Mar 2026) for an agent-to-agent payment protocol is the first dedicated capital allocation to this gap. Stripe's Agent SDK and Visa's payments-for-agents initiative confirm demand-pull from the payments and infrastructure side simultaneously.",
            evidence: "Skyfire Systems raised $8.5M seed to build an AI agent payment protocol, the first dedicated financial infrastructure layer designed specifically for autonomous agent transactions.",
            rationale: "The payment gate is the only remaining manual intervention point identified consistently across enterprise workflow automation deployments in this analysis. No existing infrastructure company has solved it at API scale. Skyfire's seed financing is the first explicit capital allocation to this problem, historically a reliable signal of category formation start. Stripe and Visa's parallel entries confirm this is demand-pull, not supply-push."
          }, {
            head: "Resource exhaustion at scale is creating a new AgentOps product category.",
            body: "Autonomous agent loops that run without supervision can exhaust compute budgets, enter infinite retries, or take irreversible actions without a human checkpoint. Microsoft filed a patent specifically addressing zombie agents, autonomous processes that continue consuming resources after their productive purpose has ended. This was not a problem at scale before late 2024 because agents were not deployed in production at volume.",
            evidence: "Microsoft's Autonomous Agent Lifecycle Management patent (2024-Q3) specifically addresses the zombie agent problem, covering agent spawning, monitoring, and resource-controlled retirement.",
            rationale: "The Microsoft patent (US20240242100A1) names a problem and reserves IP on the solution. The parallel emergence of Arize Phoenix, Datadog Agent Monitoring, and LangSmith's observability layer within 18 months indicates multiple companies independently identified the same operational gap. Independently observable signals converging on the same problem is a reliable indicator of a new category forming."
          }, {
            head: "Agent-native development environments are displacing standalone agent frameworks as the dominant deployment model.",
            body: "Google's $2.4B Windsurf acquihire (Jul 2025) and Cognition's parallel acquisition combined autonomous execution capability with an enterprise developer environment. The implication is that standalone agents, which require the user to separately manage a development environment, are giving way to environment-native agents where the workspace and the agent are a single integrated product.",
            evidence: "Cognition AI acquired the Windsurf IDE entity (after Google's leadership acquihire) and integrated OpenAI o1 reasoning models into Devin, deepening its position across the Software Engineering Agents and Orchestration technology segments simultaneously. Cursor's $29.3B valuation for what is functionally an agent-native IDE further confirms this direction.",
            rationale: "Google's Windsurf acquihire and Cognition's acquisition of the remaining Windsurf entity occurred within the same 30-day window in July 2025. Two independent actors making the same acquisition type simultaneously reflects a shared strategic read that the IDE layer is where enterprise developers will anchor agentic workflows. Cursor's $29.3B valuation for what is functionally an agent-native IDE further confirms this direction."
          }].map((d, i) => {
            const DirectionCard = () => {
              const [evOpen, setEvOpen] = React.useState(false);
              const [ratOpen, setRatOpen] = React.useState(false);
              return <div className="bg-white border-l-4 border-l-[#1EDD7D] border border-slate-100 rounded-xl p-5">
                <div className="text-[12px] font-medium text-[#15b865] tracking-[0.06em] mb-2">Direction {i + 1}</div>
                <p className="text-[15px] font-bold text-[#0f2644] mb-2 leading-snug">{d.head}</p>
                <p className="text-[12px] text-[#0f2644] leading-relaxed mb-3">{d.body}</p>
                <div className="space-y-2">
                  <div className="border border-[#bbf7d0] rounded-lg overflow-hidden">
                    <button onClick={() => setEvOpen(o => !o)} className="w-full flex items-center justify-between px-3 py-2 bg-[#f0fdf4] hover:bg-[#dcfce7] transition-colors text-left">
                      <span className="text-[13px] font-medium text-[#15b865]">Key Signal</span>
                      <svg width="12" height="12" fill="none" stroke="#15b865" strokeWidth="2.5" viewBox="0 0 24 24" className={`flex-shrink-0 transition-transform duration-200 ${evOpen ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
                    </button>
                    {evOpen && <div className="px-3 py-2.5 bg-[#f0fdf4]"><p className="text-[12px] text-emerald-800 leading-relaxed">{d.evidence}</p></div>}
                  </div>
                  {d.rationale && <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <button onClick={() => setRatOpen(o => !o)} className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 transition-colors text-left">
                      <span className="text-[13px] font-medium text-[#15b865]">What It Signals</span>
                      <svg width="12" height="12" fill="none" stroke="#94a3b8" strokeWidth="2.5" viewBox="0 0 24 24" className={`flex-shrink-0 transition-transform duration-200 ${ratOpen ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
                    </button>
                    {ratOpen && <div className="px-3 py-2.5 bg-slate-50"><p className="text-[12px] text-[#0f2644] leading-relaxed">{d.rationale}</p></div>}
                  </div>}
                </div>
              </div>;
            };
            return <DirectionCard key={i} />;
          })}</div></div>
<div className="bg-white border border-slate-200 rounded-2xl p-5">
  <div className="text-[15px] font-bold text-[#0f2644] mb-1">Cross-Technology Segment Comparison</div>
  <p className="text-[12px] text-[#0f2644] mb-4">Key signal metrics compared across all three technology segments, innovation momentum, commercial activity volume, and funding deployed (2025)</p>
  {(()=>{
    const SD_LABELS = {sd1:"Software Engineering Agents",sd2:"Customer-Facing Conversational & Voice Agents",sd3:"Agent Orchestration Frameworks & Developer Infrastructure"};
    const SD_COLORS = {sd1:"#059669",sd2:"#059669",sd3:"#166534"};
    const metrics = SUBDOMAINS.map(sd=>{
      const innCharts = SD_INN_Y[sd.id]||[];
      const mc = computeMomentum(innCharts.filter((ch:any)=>/patent|publication|funding/i.test(ch.label||ch.title||"")));
      const actTot = ["inn_","cmr_","str_"].reduce((s,pfx)=>s+Object.entries(COL_ACTS).filter(([k])=>k.startsWith(pfx)&&k.includes(sd.id)).reduce((r,[,v])=>r+(v as any[]).filter((a:any)=>a.date>="2024").length,0),0);
      const fundChart = innCharts.find((ch:any)=>/funding/i.test(ch.label||ch.title||""));
      const fund2025 = fundChart ? (fundChart.values[fundChart.years.indexOf(2025)]||0) : 0;
      const patChart = innCharts.find((ch:any)=>/patent/i.test(ch.label||ch.title||""));
      const pat2025 = patChart ? (patChart.values[patChart.years.indexOf(2025)]||0) : 0;
      const pubChart = innCharts.find((ch:any)=>/publication/i.test(ch.label||ch.title||""));
      const pub2025 = pubChart ? (pubChart.values[pubChart.years.indexOf(2025)]||0) : 0;
      return {id:sd.id,name:SD_LABELS[sd.id]||sd.name,pct:mc.pct,label:mc.label,color:SD_COLORS[sd.id]||"#64748b",acts:actTot,fund:fund2025,pat:pat2025,pub:pub2025};
    });
    const maxPct = Math.max(...metrics.map(m=>m.pct),1);
    const maxActs = Math.max(...metrics.map(m=>m.acts),1);
    const maxFund = Math.max(...metrics.map(m=>m.fund),1);
    const maxPat = Math.max(...metrics.map(m=>m.pat),1);
    const maxPub = Math.max(...metrics.map(m=>m.pub),1);
    const rows = [
      {key:"pct",label:"Signal Momentum (average CAGR %)",max:maxPct,fmt:(v:number)=>`+${v}%`,tip:<SignalMomentumTooltipContent />},
      {key:"pat",label:"Patents Granted in 2025",max:maxPat,fmt:(v:number)=>v.toLocaleString(),tip:"Patent counts are aggregated year-wise from the individual patent datasets of each technology segment. Each technology segment's dataset is sourced from Google Patents using segment-specific keyword and classification filters."},
      {key:"pub",label:"Research Publications in 2025",max:maxPub,fmt:(v:number)=>v.toLocaleString(),tip:"Publication counts are aggregated year-wise from the individual publication datasets of each technology segment. Each technology segment's dataset is sourced from Google Scholar using segment-specific keyword filters."},
      {key:"fund",label:"Funding Deployed in 2025 (USD Million)",max:maxFund,fmt:(v:number)=>`$${v}M`,tip:"Disclosed funding rounds in 2025. Top 10 identified events per year assumed to represent ~80% of total sector funding. Sources: Crunchbase, PitchBook, Tracxn."},
      {key:"acts",label:"Key Activities Profiled (last 2 years)",max:maxActs,fmt:(v:number)=>String(v),tip:"Total individually named, dated, and sourced activities profiled across all three signal types."},
    ];
    return <div className="grid grid-cols-3 gap-4">
      {rows.map(row=><div key={row.key} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-[12px] font-bold text-[#0f2644] leading-snug">{row.label}</span>
          <HoverTip hideIcon={true} title={row.label} label={<span className="text-[10px] text-[#0f2644] cursor-help">ⓘ</span>} desc={row.tip}/>
        </div>
        <div className="space-y-2.5">
          {metrics.map(m=>{
            const val = (m as any)[row.key];
            const pct = Math.max(val/row.max*100,2);
            return <div key={m.id}>
              <div className="text-[12px] font-medium text-[#0f2644] mb-1 leading-tight">{m.name}</div>
              <div className="bg-slate-200 rounded-full h-5 overflow-hidden">
                <div className="h-full rounded-full flex items-center px-2 transition-all" style={{width:`${pct}%`,background:m.color}}>
                  <span className="text-[9px] font-bold text-white whitespace-nowrap">{row.fmt(val)}</span>
                </div>
              </div>
            </div>;
          })}
        </div>
      </div>)}
    </div>;
  })()}
</div>
</React.Fragment>}

    {/* Weak Signals & Contradictions tab content */}
    {insightTab === "weak" && <WeakPanel />}</div>;
};

// ═══════════════════════════════════════════════════════
// SUBDOMAINS DETAIL PANEL: Tab 3
// Self-contained component using SD_MOM and SUBDOMAINS data
// ═══════════════════════════════════════════════════════

const STAGE_WHY = {
  sd1: "Scaling is warranted by the simultaneous crossing of $1B+ ARR by two independent players: Cursor at $2B and Claude Code at $2.5B run-rate ARR, within the same 12-month window. Cognition's Devin confirmed production deployments at Goldman Sachs, Citi, Dell, and Cisco. GitHub Copilot penetrated 90% of Fortune 100 at 20M active users, with 46% of code AI-generated. Google's $2.4B Windsurf acquihire and SpaceX's $60B acquisition option on Anysphere represent the first platform-level M&A and first non-AI strategic buyer in the category. $2.3B in Series D funding and Accenture's 30,000-professional training commitment confirm broad and reinforcing momentum across all three signals. The evidence is not isolated to a single player, multiple independent players have crossed commercial thresholds simultaneously.",
  sd2: "Scaling is evidenced by multiple concurrent commercial milestones across independent players and structural consolidation. Sierra reached $150M ARR and 40% Fortune 50 penetration, the fastest enterprise SaaS to $100M ARR on record, while Salesforce Agentforce crossed 12,000 enterprise customers in 12 months (faster adoption than Salesforce CRM itself). Decagon confirmed $35M ARR with 80%+ deflection rates across named Fortune 500 customers. The Salesforce–Sierra acquisition ($1.4B) marks the first platform-level consolidation in the category, a structural signal that separates Scaling from Early Commercial. Deutsche Telekom's vendor-of-record selection for PolyAI confirms European adoption at carrier scale. Outcome-based pricing is validated at the largest enterprise scale.",
  sd3: "Scaling classification is supported by infrastructure-grade adoption across independent players, stable open-source releases, and vendor-neutral governance. LangChain confirmed 90M monthly downloads and 35% Fortune 500 reach. MCP reached 100M monthly downloads and was adopted by OpenAI, Google, and Microsoft, cross-competitor adoption that signals infrastructure-tier status. The Linux Foundation AAIF formation in December 2025 removed single-vendor control permanently. Klarna deployed LangGraph to 85M users and Nubank uses orchestration frameworks for real-time credit decisions at 131M customers. These are production-critical deployments at consumer internet scale, not pilots."
};
const PATTERN_WHY = {
  sd1: "All three signal layers are at high intensity and all are accelerating simultaneously, the defining condition for Aligned-Accelerating. Innovation: $400M to Cognition, $2.3B Series D to Anysphere, Accenture's 30,000-person training commitment. Commercial: products in Fortune 500 enterprise production with named customers and disclosed ARR. Structural: Google's $2.4B Windsurf acquihire, SpaceX's $60B Cursor option, and Amazon's $5B Anthropic commitment with $100B compute pledge. No lag between layers, all three are running at high intensity together.",
  sd2: "All three signals are mutually reinforcing. Innovation: Sierra raised $950M at $15.8B, Decagon $250M at $4.5B, and ElevenLabs $180M at $3.3B, the largest funding rounds in the category. Research publications grew from 350 in 2022 to 3,100 in 2025. Commercial: Sierra confirmed $150M ARR and 40% Fortune 50, Agentforce crossed 12,000 enterprise customers, and PolyAI signed Deutsche Telekom across 12 European markets. Structural: the Salesforce–Sierra acquisition ($1.4B) is the first platform-level consolidation; the EU AI Act biometric voice provisions and FCC TCPA ruling create binding governance; and PolyAI-Genesys and ElevenLabs-Twilio partnerships are channel-scale structural commitments. All three layers are running at high intensity together, the defining condition for Aligned-Accelerating.",
  sd3: "All three signal layers at high intensity and all accelerating. Innovation: LangChain $125M at $1.25B, MCP 100M monthly downloads, AGENTS.md at 60,000+ projects. Commercial: LangChain 1.0 and LangGraph 1.0 GA, 35% Fortune 500 adoption, LangSmith 12× YoY trace volume. Structural: Linux Foundation AAIF formation removing single-vendor control of MCP permanently. The AAIF formation is the structural signal that makes this Scaling rather than Early Commercial, governance has been resolved, not just commercialisation."
};
const SD_TOP_ACTS = {
  sd1: {
    inn: [{
      d: "Sep 2025",
      t: "Cognition raises $400M Series C at $10.2B valuation",
      sig: "Strategic Commitment",
      url: "https://techcrunch.com/2025/09/08/cognition-ai-defies-turbulence-with-a-400m-raise-at-10-2b-valuation/",
      detail: "IVP-led round confirming Cognition as the first independent coding agent to cross the decacorn threshold. Co-investors include Kleiner Perkins and Index Ventures. Announced alongside confirmation of production deployments at Goldman Sachs, Citi, Dell, and Cisco."
    }, {
      d: "Feb 2026",
      t: "Claude Code reaches $2.5B run-rate ARR within 8 months of General Availability",
      sig: "Inflection",
      url: "https://www.anthropic.com/news",
      detail: "The fastest Anthropic product to $1B+ ARR. Coding is now Anthropic's largest commercial vertical. Reached $2.5B run-rate ARR approximately 8 months after its June 2025 GA launch, establishing a new benchmark for foundation-lab product velocity."
    }, {
      d: "Aug 2025",
      t: "Anysphere closes $2.3B Series D at $29.3B valuation",
      sig: "Strategic Commitment",
      url: "https://anysphere.inc",
      detail: "Round led with Google and Nvidia as strategic investors. Cursor crossed $2B ARR at time of close. The $29.3B valuation established the category ceiling for pure-play AI-native IDEs and set the benchmark against which all subsequent coding agent valuations are measured."
    }],
    cmr: [{
      d: "Jun 2025",
      t: "Claude Code reaches General Availability",
      sig: "Commercial First",
      url: "https://www.anthropic.com/news/claude-code-ga",
      detail: "First GA release of a foundation-lab coding agent at enterprise scale. Launched with $0 cost during an extended preview phase. Represents the first time a foundation lab shipped a standalone coding agent product rather than an API capability, establishing Claude Code as a direct commercial product."
    }, {
      d: "Nov 2025",
      t: "Cognition Devin deployed at Goldman Sachs, Citi, Dell, Cisco",
      sig: "Strategic Commitment",
      url: "https://www.cognition.ai/blog",
      detail: "Four Fortune 500 production deployments in regulated industries (financial services and enterprise technology). First coding agent to confirm named Wall Street-scale enterprise deployments. Goldman Sachs and Citi represent the first deployments of autonomous coding agents in regulated US financial services."
    }, {
      d: "Jan 2026",
      t: "Uber discloses that 10% of its code is now autonomously generated",
      sig: "Inflection",
      url: "https://techcrunch.com/2026/01/",
      detail: "First major public disclosure of autonomous code generation at a tier-1 consumer technology company. The 10% figure establishes a commercial benchmark, prior to this disclosure, there was no named metric for autonomous code generation share at this scale. Implies approximately 100–150 engineering FTE-equivalent output is being handled by agents."
    }],
    str: [{
      d: "Apr 2026",
      t: "SpaceX holds $60B acquisition option on Anysphere (Cursor)",
      sig: "Landscape Restructuring",
      url: "https://www.bloomberg.com/news/",
      detail: "First non-AI platform strategic buyer (aerospace, logistics, manufacturing infrastructure) identifying a coding agent company as strategically relevant to its core engineering operations. Changes who can compete for the category permanently, if platform-level infrastructure companies begin acquiring coding agents, the competitive structure is no longer purely between AI labs and pure-play startups."
    }, {
      d: "Jul 2025",
      t: "Google acquihires Windsurf (Codeium) leadership for $2.4B",
      sig: "Landscape Restructuring",
      url: "https://techcrunch.com/2025/07/",
      detail: "Foundation lab acquires a coding IDE with 300K+ developer users. Simultaneously, Cognition acquired the remaining Windsurf entity. The combined effect reduced a fragmented landscape to two dominant pure-play positions (Cognition at $25B talks, Anysphere at $29.3B), fundamentally altering the acquisition logic for all remaining entrants."
    }, {
      d: "Dec 2025",
      t: "Amazon $5B Anthropic strategic investment with $100B AWS compute commitment",
      sig: "Strategic Commitment",
      url: "https://www.reuters.com/technology/amazon-anthropic-2025",
      detail: "Amazon's total commitment to Anthropic (training + inference) reached $100B in committed AWS compute. The $5B cash investment accompanies this compute commitment. Establishes AWS Bedrock as the primary enterprise cloud deployment path for Claude Code, creating a structural advantage for Amazon-ecosystem enterprise customers."
    }]
  },
  sd2: {
    inn: [{
      d: "May 2026",
      t: "Sierra raises $950M Series E at $15.8B valuation",
      sig: "Strategic Commitment",
      url: "https://techcrunch.com/",
      detail: "Largest single round in the customer-facing agent category. Post-money valuation of $15.8B confirmed Sierra as the category leader at Fortune-50 scale. The round was led by Sequoia Capital with participation from existing investors. Simultaneously confirmed $150M ARR and 40% Fortune 50 customer penetration, the fastest enterprise SaaS to $100M ARR on record."
    }, {
      d: "Jan 2026",
      t: "Decagon raises $250M Series D at $4.5B valuation",
      sig: "Strategic Commitment",
      url: "https://www.decagon.ai/blog",
      detail: "Three times Decagon's 2024 valuation in six months. Round led by Coatue Management and Index Ventures. Confirmed 100+ enterprise customers including Avis, Mercado Libre, Deutsche Telekom, Notion, and Duolingo. $35M ARR with 80%+ deflection rates. The round simultaneously confirmed the two-leader market structure with Sierra at $15.8B."
    }, {
      d: "Sep 2025",
      t: "Sierra raises $350M Series D at $10B valuation",
      sig: "Inflection",
      url: "https://sierra.ai/blog",
      detail: "First pure-play CX agent company to cross the decacorn threshold. Prior to this round, the highest valuation in the category was below $5B. The round confirmed that outcome-based pricing at Fortune-50 scale generates sufficient revenue to support a $10B+ valuation, validating the business model as commercially sustainable, not just commercially interesting."
    }],
    cmr: [{
      d: "Feb 2026",
      t: "Sierra confirms 40% of Fortune 50 as customers at $150M ARR",
      sig: "Threshold Crossing",
      url: "https://sierra.ai/blog",
      detail: "First public confirmation of $150M ARR and 40% Fortune 50 customer penetration, the fastest enterprise SaaS to $100M ARR on record, achieved in approximately 7 quarters from founding. Outcome-based pricing (customers pay per resolved interaction) is the commercial model. This disclosure validated outcome-based pricing at Fortune-50 scale, not just mid-market."
    }, {
      d: "Nov 2025",
      t: "Deutsche Telekom launches 6-month production pilot with Decagon",
      sig: "Decision Gating",
      url: "https://www.telekom.com/press/ai-agent-pilot",
      detail: "Six-month production pilot at Deutsche Telekom with T.Capital making a concurrent investment in Decagon. The pilot covers European customer service operations in German and English. Decision gating: the pilot outcome will explicitly determine whether Deutsche Telekom commits to a multi-year enterprise agreement. First named European tier-1 telco deploying a pure-play US CX agent at production scale."
    }, {
      d: "Nov 2025",
      t: "Sierra launches Agent OS 2.0 with proactive outreach capabilities",
      sig: "Commercial First",
      url: "https://sierra.ai/blog",
      detail: "Agent OS 2.0 added proactive outreach, agents initiate contact with customers based on account data signals, rather than only responding to inbound queries. This represented the first commercial deployment of outbound-initiated AI agent interactions at Fortune-50 scale, expanding the addressable market for CX agents from inbound support to full customer lifecycle management."
    }],
    str: [{
      d: "Q1 2026",
      t: "Sierra acquires Fragment, Opera Tech, and Receptive AI for EU expansion",
      sig: "Landscape Restructuring",
      url: "https://www.salesforce.com/news",
      detail: "Three simultaneous acquisitions in Q1 2026. Fragment adds EU data residency infrastructure for GDPR compliance. Opera Tech adds multilingual voice processing across 12 European languages. Receptive AI adds enterprise feedback infrastructure for continuous model improvement loops. The combined acquisitions represent Sierra's strategy to establish EU market presence before any European competitor establishes category leadership."
    }, {
      d: "Aug 2025",
      t: "EU AI Act GPAI obligations come into effect",
      sig: "Landscape Restructuring",
      url: "https://eur-lex.europa.eu/ai-act-gpai",
      detail: "General Purpose AI obligations under the EU AI Act became legally effective in August 2025, with full high-risk enforcement from August 2026. All CX agents using Claude, GPT-4, or other GPAI models inherit obligations including transparency requirements, usage logging, and conformity assessments. Creates a compliance cost layer that favors larger vendors with existing EU legal infrastructure."
    }, {
      d: "Nov 2025",
      t: "Intercom confirms Fin AI agent reaches $100M ARR",
      sig: "Commercial First",
      url: "https://techcrunch.com/",
      detail: "First CX agent product from an established customer service platform (rather than a pure-play startup) to reach $100M ARR. Intercom Fin's milestone confirms that platform incumbents with existing customer relationships can convert them to agentic deployments without competing with Sierra or Decagon on greenfield deals. Establishes a third commercial path alongside pure-play and platform-incumbent."
    }]
  },
  sd3: {
    inn: [{
      d: "Oct 2025",
      t: "LangChain raises $125M Series B at $1.25B valuation",
      sig: "Strategic Commitment",
      url: "https://blog.langchain.com",
      detail: "IVP-led, with Sequoia Capital, Benchmark, CapitalG, Sapphire Ventures, ServiceNow Ventures, and Datadog participating. Disclosed at $1.25B valuation, the highest valuation for a pure-play orchestration framework company. Confirmed 90M monthly downloads, 35% Fortune 500 reach, and 12× YoY LangSmith trace volume growth. Round simultaneous with LangChain 1.0 and LangGraph 1.0 General Availability releases."
    }, {
      d: "Feb 2026",
      t: "MCP reaches 100M monthly downloads",
      sig: "Inflection",
      url: "https://www.anthropic.com/mcp-100m-downloads",
      detail: "Confirmed by Anthropic in February 2026. 100M monthly downloads positions MCP alongside Docker and npm as infrastructure-tier standards by adoption volume. The milestone reflects implementation by all major foundation labs (OpenAI, Anthropic, Google, Microsoft) plus 500+ MCP server implementations across third-party vendors. Monthly download growth has been approximately 15% month-over-month since March 2025."
    }, {
      d: "Nov 2025",
      t: "AGENTS.md adopted by 60,000+ open-source projects",
      sig: "Threshold Crossing",
      url: "https://github.com/agents-md/agents-md",
      detail: "AGENTS.md is an open standard specification for declaring agent capabilities in repositories, enabling AI coding agents to understand codebase-specific rules without prompting. Adoption by 60,000+ open-source projects within 12 months of launch represents the fastest GitHub-native standard adoption since README.md standardisation. Co-authored by OpenAI and adopted by the broader ecosystem."
    }],
    cmr: [{
      d: "Oct 2025",
      t: "LangChain 1.0 and LangGraph 1.0 reach stable General Availability",
      sig: "Threshold Crossing",
      url: "https://blog.langchain.com/langchain-langgraph-1dot0/",
      detail: "First stable releases after approximately two years of rapid versioning. The GA releases included a no-code Agent Builder, enterprise compliance packaging (SOC 2, GDPR logging), and confirmed 90M monthly combined downloads and 35% Fortune 500 reach. Klarna cited the LangGraph 1.0 GA as the basis for committing its 85M-user production deployment, the API stability signal that enterprise engineering teams required before committing production workloads."
    }, {
      d: "Jan 2026",
      t: "Klarna deploys LangGraph to 85M users for customer service automation",
      sig: "Strategic Commitment",
      url: "https://techcrunch.com/2026/01/",
      detail: "One of the two largest agentic deployments by user scale in the evidence bundle. Klarna deployed LangGraph-based agents across its entire 85M-user customer base for support and account management. The deployment replaced approximately 700 FTE-equivalent roles. Klarna explicitly cited LangGraph 1.0 stable release as the technical prerequisite for the production commitment."
    }, {
      d: "Mar 2026",
      t: "LangSmith trace volume grows 12× year-over-year",
      sig: "Inflection",
      url: "https://blog.langchain.com/",
      detail: "LangSmith is the LangChain observability and evaluation platform used for monitoring agent deployments in production. 12× YoY trace volume indicates that enterprise agent deployments are scaling from prototype to production monitoring at significant scale, the observability layer is growing faster than new project formation, confirming that existing deployments are expanding rather than only new projects starting."
    }],

  str: [{
      d: "Dec 2025",
      t: "Linux Foundation AAIF formation establishes vendor-neutral MCP governance",
      sig: "Landscape Restructuring",
      url: "https://www.linuxfoundation.org",
      detail: "Anthropic, OpenAI, and Block donated MCP governance to the newly formed Agentic AI Infrastructure Foundation under the Linux Foundation in December 2025. This removes any single vendor's ability to fork, lock in, or control the protocol, the structural change that makes MCP a permanent open standard rather than a vendor-controlled API. The AAIF formation mirrors Docker's transition to the CNCF in 2017, making it safe for enterprises to build on MCP without lock-in risk."
    }, {
      d: "Mar 2025",
      t: "OpenAI adopts MCP, cross-competitor protocol adoption makes MCP mandatory infrastructure",
      sig: "Landscape Restructuring",
      url: "https://openai.com/blog",
      detail: "When OpenAI adopted MCP in March 2025, the protocol transformed from an Anthropic-originated standard into cross-competitor infrastructure. Any developer building on MCP after this point could expect compatibility with OpenAI, Anthropic, and Google foundation models without modification. This was the single event that made MCP adoption rational for all developers regardless of their preferred model provider, comparable to when Apache adopted HTTP."
    }, {
      d: "Oct 2025",
      t: "LangChain 1.0 open-source stable release on GitHub",
      sig: "Commercial First",
      url: "https://github.com/langchain-ai/langchain/releases",
      detail: "The first stable open-source release of LangChain established the stable API surface that enterprise compliance and legal teams require before recommending a framework for production use. The release includes a formal deprecation policy (18-month support window for stable APIs), long-term support commitments, and a security disclosure process, the three governance requirements that enterprise procurement teams typically gate on."
    }]
  }
};
const SD_PATTERNS_ALL = {
  "Aligned-Accelerating": "All three layers show active, sustained evidence across the analysis period. The weight of named events in Innovation, Commercial, and Structural is high and mutually reinforcing, no layer is lagging or absent.",
  "Commercialising": "Innovation and Commercial layers both show strong named evidence. Structural layer is present but the activity base is thinner, governance and M&A events exist but have not yet restructured the competitive landscape.",
  "Innovation-Ahead": "The innovation evidence base is substantially larger than the commercial and structural evidence. Research, funding, and formation activity dominates the named events; deployment and governance activities are less represented.",
  "Structurally-Gated": "Activity is present across layers, but the structural evidence, regulation, standards, or governance decisions, is the most prominent layer. The weight of named events in structural signals suggests the governance environment is shaping what participants can do."
};

const SubdomainsDetailPanel = ({
  initSdId = "sd1",
  setRootSdId,
  setTab
}) => {
  const [selSd, setSelSd] = React.useState(initSdId || "sd1");
  const [infExpanded, setInfExpanded] = React.useState({});
  const [actExpanded, setActExpanded] = React.useState({});
  const [drawerAct, setDrawerAct] = React.useState<any>(null);
  const sd = SUBDOMAINS.find(s => s.id === selSd) || SUBDOMAINS[0];
  const mom = SD_MOM[selSd] || SD_MOM.sd1;
  const acts = SD_TOP_ACTS[selSd] || SD_TOP_ACTS.sd1;
  const stageWhy = STAGE_WHY[selSd] || "";
  const patWhy = PATTERN_WHY[selSd] || "";
  const infs = mom.inf || [];
  const selectSd = id => {
    setSelSd(id);
    setInfExpanded({});
    setActExpanded({});
    if (setRootSdId) setRootSdId(id);
  };
  const tDir = tag => {
    const c = {
      accelerating: "#059669",
      steady: "#166534",
      emerging: "#15803d",
      decelerating: "#dc2626",
      quiet: "#94a3b8",
      active: "#059669",
      limited: "#94a3b8"
    };
    const i = {
      accelerating: "▲ Accelerating",
      steady: "→ Steady",
      emerging: "◎ Emerging",
      decelerating: "▼ Decelerating",
      quiet: "– Quiet",
      active: "● Active",
      limited: "○ Limited"
    };
    return {
      color: c[tag] || "#94a3b8",
      label: i[tag] || tag
    };
  };
  const stageClr = {
    Lab: "text-emerald-700 bg-emerald-50 border-emerald-200",
    Pilot: "text-amber-700 bg-amber-50 border-amber-200",
    "Early Commercial": "text-emerald-700 bg-emerald-50 border-emerald-200",
    Scaling: "text-emerald-700 bg-emerald-50 border-emerald-200"
  };
  const patClr = {
    "Aligned-Accelerating": "text-emerald-700 bg-emerald-50 border-emerald-300",
    "Innovation-Ahead": "text-emerald-700 bg-emerald-50 border-emerald-300",
    "Commercialising": "text-emerald-700 bg-emerald-50 border-emerald-300",
    "Structurally-Gated": "text-amber-700 bg-amber-50 border-amber-300"
  };
  const LAYER_CFG = [{
    key: "inn",
    label: "Innovation",
    bdr: "border-emerald-100",
    bg: "bg-emerald-50/30",
    txt: "text-emerald-900",
    bar: "bg-emerald-500"
  }, {
    key: "cmr",
    label: "Commercial",
    bdr: "border-emerald-100",
    bg: "bg-emerald-50/30",
    txt: "text-emerald-900",
    bar: "bg-emerald-500"
  }, {
    key: "str",
    label: "Structural",
    bdr: "border-amber-100",
    bg: "bg-amber-50/30",
    txt: "text-amber-900",
    bar: "bg-amber-500"
  }];
  const LAYER_BORDER = {
    inn: "var(--blue,#059669)",
    cmr: "var(--green,#10b981)",
    str: "var(--amber,#d97706)"
  };
  return <div className="flex gap-5"><aside className="w-[220px] flex-shrink-0 sticky top-0 self-start max-h-screen overflow-y-auto"><div className="text-[15px] font-bold text-[#0f2644] mb-2 px-1">Select technology segment</div><div className="space-y-1">{SUBDOMAINS.map(s => {
          const active = s.id === selSd;
          const sc = stageClr[s.stage] || "text-[#0f2644] bg-slate-50 border-slate-200";
          return <button key={s.id} onClick={() => selectSd(s.id)} className={`w-full text-left p-3 rounded-xl border transition-all ${active ? "bg-[#0f2644] text-white border-[#0f2644]" : "bg-white text-[#0f2644] border-slate-200 hover:bg-slate-50"}`}><div className="flex items-center justify-between mb-1"><span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold border ${active ? "bg-white/20 text-white border-white/30" : sc}`}>{s.stage}</span></div><div className={`text-[12px] font-semibold leading-snug ${active ? "text-white" : "text-[#0f2644]"}`}>{s.name}</div></button>;
        })}</div></aside><div className="flex-1 min-w-0 space-y-4"><div className="bg-gradient-to-br from-[#f0fdf4] to-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-4"><div className="text-[13px] font-semibold text-[#000000] mb-1.5">Research Summary: {sd.name}</div><div className="space-y-3 mb-3">{sd.summary.split(" // ").filter(s=>s.trim().length>8).map((s,i)=><div key={i} className="flex items-start gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5"/><p className="text-[12px] text-[#0f2644] leading-relaxed">{s.trim()}</p></div>)}</div>{(()=>{const mc=computeMomentum((SD_INN_Y[selSd]||[]).filter((ch:any)=>/patent|publication|funding/i.test(ch.label||ch.title||"")));const actTot=["inn_","cmr_","str_"].reduce((s,pfx)=>s+Object.entries(COL_ACTS).filter(([k])=>k.startsWith(pfx)&&k.includes(selSd)).reduce((r,[,v])=>r+(v as any[]).filter((a:any)=>a.date>="2024").length,0),0);const fundChart=(SD_INN_Y[selSd]||[]).find((c:any)=>/funding/i.test(c.label||c.title||""));const fund2025=fundChart?(fundChart.values[fundChart.years.indexOf(2025)]||0):0;return <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-emerald-200/60"><div className="bg-white/70 rounded-lg p-2.5"><div className="text-[16px] font-black text-[#0f2644]">{mc.pct>0?"+":""}{mc.pct}%</div><div className="text-[10px] text-[#0f2644] leading-tight">Average CAGR</div><div className="text-[9px] font-semibold mt-0.5" style={{color:mc.color}}>{mc.label}</div></div><div className="bg-white/70 rounded-lg p-2.5"><div className="text-[16px] font-black text-[#0f2644]">{actTot}</div><div className="text-[10px] text-[#0f2644] leading-tight">Activities profiled</div><div className="text-[9px] font-semibold text-[#0f2644] mt-0.5">Last 2 years</div></div><div className="bg-white/70 rounded-lg p-2.5"><div className="text-[16px] font-black text-[#0f2644]">${fund2025}M</div><div className="text-[10px] text-[#0f2644] leading-tight">Funding in 2025</div><div className="text-[9px] font-semibold text-[#0f2644] mt-0.5">USD Million</div></div></div>;})()}</div><div className="bg-white border border-slate-200 rounded-2xl p-5"><div className="flex items-start justify-between gap-4 mb-4"><div><h2 className="text-[16px] font-black text-[#0f2644] leading-tight">{sd.name}</h2></div></div>{(()=>{
          const innCharts = (SD_INN_Y[selSd] || []).filter((ch:any)=>/patent|publication|funding/i.test(ch.label||ch.title||""));
          const mc = computeMomentum(innCharts);
          return <>
            {/* ① SIGNAL MOMENTUM, first */}
            <div className="mb-3 p-4 rounded-xl border" style={{background:`${mc.color}08`,borderColor:`${mc.color}30`}}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold text-[#0f2644]">① Signal Momentum</span>
                  <span className="text-[12px] px-2.5 py-0.5 rounded-full font-bold border" style={{color:mc.color,background:`${mc.color}18`,borderColor:`${mc.color}40`}}>{mc.label}</span>
                  <HoverTip hideIcon={true} title="Signal Momentum Methodology" label={<span className="text-[10px] cursor-help text-[#0f2644]">ⓘ</span>} desc={<SignalMomentumTooltipContent />} />
                </div>
                <span className="text-[10px] font-bold text-[#0f2644]">{mc.pct>0?"+":""}{mc.pct}% CAGR · {mc.accelerating?"↑ accelerating":""}</span>
              </div>
              <div className="w-full h-1.5 bg-white/60 rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full transition-all" style={{width:`${mc.score}%`,background:mc.color}}/>
              </div>
              {mc.breakdown && mc.breakdown.length > 0 && <div className="grid grid-cols-3 gap-2 mb-3">
                {[...mc.breakdown].sort((a:any,b:any)=>{
                  const order = ["Patents Granted","Research Publications","Funding Deployed","Funding Deployed (USD Million)"];
                  const ai=order.findIndex(o=>(a.label||"").includes(o.replace(" (USD Million)","")));
                  const bi2=order.findIndex(o=>(b.label||"").includes(o.replace(" (USD Million)","")));
                  return (ai<0?99:ai)-(bi2<0?99:bi2);
                }).map((b:any, bi:number) => {
                  const bpct = Math.round(b.cagr * 100);
                  const shortLabel = (b.label||"").replace(/\s*\(USD.*?\)/, "").replace(/^Named\s+/, "").trim();
                  return <div key={bi} className="p-2 rounded-lg bg-white/70 border border-slate-200/60">
                    <div className="text-[9px] font-semibold text-[#0f2644] tracking-wide truncate">{shortLabel || `Metric ${bi+1}`}</div>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-[15px] font-black tabular-nums" style={{color: mc.color}}>{bpct>0?"+":""}{bpct}%</span>
                      <span className="text-[9px] text-[#0f2644]">CAGR</span>
                    </div>
                    <div className="text-[9px] text-[#0f2644] tabular-nums">{b.v0.toLocaleString()} → {b.v1.toLocaleString()}</div>
                  </div>;
                })}
              </div>}
              {mc.breakdown && mc.breakdown.length > 0 && <div className="mt-2 px-3 py-2.5 bg-white/70 rounded-lg border border-slate-200/60 text-[12px] text-[#0f2644]">
                {(()=>{
                  const sorted = [...mc.breakdown].sort((a:any,b:any)=>{
                    const order=["Patents Granted","Research Publications","Funding Deployed"];
                    const ai=order.findIndex(o=>(a.label||"").includes(o));
                    const bi=order.findIndex(o=>(b.label||"").includes(o));
                    return (ai<0?99:ai)-(bi<0?99:bi);
                  });
                  const parts = sorted.map((b:any)=>`${Math.round(b.cagr*100)>0?"+":""}${Math.round(b.cagr*100)}%`);
                  const formula = parts.join(" + ") + ` = ${parts.reduce((s:number,p:string)=>s+parseInt(p),0)}%`;
                  return <div className="flex flex-col gap-1">
                    <div className="flex items-start gap-1.5 flex-wrap">
                      <span className="font-semibold text-[#0f2644]">Average CAGR</span>
                      <span className="text-[#0f2644]">=</span>
                      <span className="font-mono">
                        ({sorted.map((b:any,i:number)=><span key={i}>{i>0&&<span className="text-[#0f2644] mx-1">+</span>}<span className="text-[#0f2644]">{Math.round(b.cagr*100)>0?"+":""}{Math.round(b.cagr*100)}%</span><span className="text-[#0f2644] ml-0.5 text-[9px]">{(b.label||"").replace(" (USD Million)","").replace("Patents Granted","Pat.").replace("Research Publications","Pub.").replace("Funding Deployed","Fund.")}</span></span>)})
                      </span>
                      <span className="text-[#0f2644]">) ÷ 3</span>
                      <span className="text-[#0f2644]">=</span>
                      <span className="font-black text-[12px]" style={{color:mc.color}}>{mc.pct>0?"+":""}{mc.pct}%</span>
                      <span className="text-[#0f2644]">→</span>
                      <span className="font-semibold" style={{color:mc.color}}>{mc.label}</span>
                    </div>
                  </div>;
                })()}
              </div>}
              
              <p className="text-[12.5px] text-[#0f2644] leading-relaxed">{mom.inn?.g || ""}</p>
            </div>

            {/* ② MATURITY STAGE, second */}
            <div className="mb-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[15px] font-bold text-[#0f2644]">② Maturity Stage</span>
                <span className={`text-[12px] px-2.5 py-0.5 rounded-full font-bold border ${stageClr[sd.stage] || "text-[#0f2644] bg-slate-50 border-slate-200"}`}>{sd.stage}</span>
                <HoverTip hideIcon={true} title={sd.stage} label={<span className="text-[10px] text-[#0f2644] cursor-help">ⓘ</span>} desc={<MaturityStageTooltipContent />} />
              </div>
              <p className="text-[13px] font-semibold text-[#0f2644] mb-2">Basis for classification</p>
              <ul className="space-y-1">{stageWhy.split(". ").filter((s:string)=>s.trim().length>10).map((s:string,i:number)=><li key={i} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0 mt-1.5"/><p className="text-[12.5px] text-[#0f2644] leading-relaxed">{s.trim()}{!s.trim().endsWith(".")?".":""}</p></li>)}</ul>
            </div>

            {/* ③ CROSS-LAYER PATTERN, third */}
            <div className="mb-3 p-4 rounded-xl" style={{background:"linear-gradient(135deg,#f0fdf4,#ecfdf5)",border:"1px solid #86efac"}}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[15px] font-bold text-emerald-700">③ Cross-Signal Pattern</span>
                <span className={`text-[12px] px-2.5 py-0.5 rounded-full font-bold border cursor-help ${patClr[mom.pattern] || "text-[#0f2644] bg-slate-50 border-slate-200"}`}>{mom.pattern}</span>
                <HoverTip hideIcon={true} title={mom.pattern} label={<span className="text-[10px] text-[#0f2644] cursor-help">ⓘ</span>} desc={<CrossSignalPatternTooltipContent />} />
              </div>
              <p className="text-[13px] font-semibold text-emerald-600 mb-2">Why this pattern</p>
              <ul className="space-y-1 mb-3">{patWhy.split(". ").filter((s:string)=>s.trim().length>10).map((s:string,i:number)=><li key={i} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5"/><p className="text-[12.5px] text-[#0f2644] leading-relaxed">{s.trim()}{!s.trim().endsWith(".")?".":""}</p></li>)}</ul>
              <div className="mt-2 pt-3 border-t border-emerald-100/80 space-y-3">
                {([["Innovation", mom.inn?.g||""], ["Commercialisation", mom.cmr?.g||""], ["Structural", mom.str?.g||""]] as [string,string][]).map(([lbl,txt])=>txt&&<div key={lbl}>
                  <span className="text-[12px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 inline-block mb-1.5">{lbl}</span>
                  <ul className="space-y-1">{txt.split(". ").filter(s=>s.trim().length>10).map((s,i,arr)=><li key={i} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5"/><p className="text-[12px] text-[#0f2644] leading-relaxed">{s.trim()}{!s.trim().endsWith(".")?".":""}</p></li>)}</ul>
                </div>)}
              </div>
            </div>
          </>;
        })()}</div><div className="bg-white border border-slate-200 rounded-2xl p-5"><div className="flex items-center justify-between mb-4"><div><h3 className="text-[15px] font-semibold text-[#0f2644]">Inflection Points</h3><p className="text-[12px] text-[#0f2644] mt-0.5">Dated events where this subdomain's trajectory changed direction. Click to read detail.</p></div><InflectionPointsTooltip /></div><div className="space-y-2">{infs.map((inf, i) => {
            const firstColon = inf.indexOf(": ");
            const datePart = firstColon >= 0 ? inf.slice(0, firstColon) : "";
            const afterDate = firstColon >= 0 ? inf.slice(firstColon + 2) : inf;
            const secondColon = afterDate.indexOf(": ");
            const headline = secondColon >= 0 ? afterDate.slice(0, secondColon) : afterDate;
            const detail = secondColon >= 0 ? afterDate.slice(secondColon + 2) : "";
            const expanded = !!infExpanded[i];
            const accentColors = ["#10b981","#f59e0b","#3b82f6","#8b5cf6","#ef4444"];
            const accent = accentColors[i] || "#94a3b8";
            return <div key={i}
              className={`rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-sm ${expanded?"border-slate-300 shadow-sm border":"border border-slate-200"}`}
              style={{borderLeft:`3px solid ${accent}`}}
              onClick={()=>setInfExpanded(p=>({...p,[i]:!p[i]}))}>
              <div className="px-4 py-3.5">
                <div className="text-[12px] font-semibold font-mono mb-1" style={{color:accent}}>{fmtDate(datePart)}</div>
                <div className="text-[13.5px] font-bold text-[#0f2644] leading-snug">{headline}</div>
                {expanded && detail && <p className="text-[12.5px] text-[#0f2644] leading-relaxed mt-2.5 pt-2.5 border-t border-slate-100">{detail}</p>}
              </div>
            </div>;
          })}</div></div><div className="bg-white border border-slate-200 rounded-2xl p-5"><div className="flex items-center justify-between mb-4"><div><h3 className="text-[15px] font-semibold text-[#0f2644]">Activities in the Domain</h3><p className="text-[12px] text-[#0f2644] mt-0.5">Top 3 per signal, click any activity to expand its full profile</p></div></div><div className="grid grid-cols-3 gap-4">{LAYER_CFG.map(({
            key,
            label
          }) => {
            const layerActs = acts[key] || [];
            return <div key={key}><div className="text-[12px] font-semibold text-[#0f2644] mb-2 pb-1.5 border-b border-slate-100">{label} · top 3 activities</div>{layerActs.map((a, i) => {
                const actKey = `${key}-${i}`;
                const expanded = !!actExpanded[actKey];
                const bdrColor = LAYER_BORDER[key];
                return <div key={i} className="mb-2 cursor-pointer hover:shadow-md transition-all group" style={{
                  padding: "8px 10px",
                  borderRadius: "0 6px 6px 0",
                  border: `1px solid #e2e8f0`,
                  borderLeft: `2px solid ${bdrColor}`
                }} onClick={() => {
                  const sigTypeKey = (a.sig||"").toLowerCase().replace(/ /g,"_");
                  const fullAct = ACT_BY_HEADLINE[a.t] || null;
                  const actObj = fullAct || {id:`sd-${key}-${i}`,headline:a.t,date:a.d,sigType:sigTypeKey,description:a.detail,whyFlag:a.detail,entities:[],metrics:{},sourceUrl:a.url,sourceName:"Source"};
                  setDrawerAct(actObj);
                }}><div className="flex items-center justify-between mb-1"><span className="text-[10px] mono text-[#0f2644]">{a.d}</span></div><div className="text-[12px] font-semibold text-[#0f2644] leading-snug mb-1">{a.t}</div><span className="text-[10px] text-[#059669] group-hover:text-[#047857] transition-colors">View full activity profile →</span></div>;
              })}</div>;
          })}</div></div></div>{drawerAct && <ActivityDrawerModal act={drawerAct} onClose={()=>setDrawerAct(null)} onSelectActivity={(a)=>setDrawerAct(a)} />}</div>;
};

// ═══════════════════════════════════════════════════════
// APP SHELL: CHESZ-style sidebar + top tabs
// ═══════════════════════════════════════════════════════
const TOP_TABS = [{
  id: "overview",
  label: "Overview",
  paths: ["M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"]
}, {
  id: "signals",
  label: "Signals",
  paths: ["M22 12 18 12 15 21 9 3 6 12 2 12"]
}, {
  id: "subdomains_detail",
  label: "Technology Segments",
  paths: ["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z", "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 0 3-3h7z"]
}, {
  id: "players_geo",
  label: "Players & Geography",
  paths: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75", "M9 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0"]
}, {
  id: "takeaways",
  label: "Summary Insights",
  paths: ["M9 11l3 3L22 4", "M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"]
}];
const SB_MAIN = [{
  label: "Dashboard",
  icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
}, {
  label: "Research",
  icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></svg>
}, {
  label: "Workflow",
  icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V8l-5-5H5z" /><path d="M15 3v5h5" /><path d="M9 13h6M9 17h4" /></svg>
}, {
  label: "Projects",
  icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" /></svg>
}, {
  label: "Members",
  icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
}];
const SB_SEC = [{
  label: "Pending Requests",
  icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
}, {
  label: "Shares",
  icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
}, {
  label: "Invitation History",
  icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
}, {
  label: "Customer Info",
  icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
}];
// ════════════════════════════════════════════════════════════════════
// ROOT APP
// ════════════════════════════════════════════════════════════════════
export default function TechActivityLandscape(): JSX.Element {
  const [tab, setTab] = useState("overview");
  const [sbActive, setSbActive] = useState(0);
  const [rootSigTab, setRootSigTab] = useState("innovation");
  const [rootPgSubTab, setRootPgSubTab] = useState("players");
  const [rootSelPlayer, setRootSelPlayer] = useState(null);
  const [rootSdId, setRootSdId] = useState("sd1");
  const mainScrollRef = useRef<HTMLElement>(null);

  // Scroll main content area to top whenever the active tab changes
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
  }, [tab]);

  // ── Tab header banners ──
  const TAB_META = {
    signals: {
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
      title: "Signals",
      desc: "Individual activities are captured as signals and grouped into three categories: Innovation, Commercialisation, and Structural. Each signal includes a detailed activity profile, while selected Innovation signals such as patents, publications and funding also include yearly activity data from 2022 onward.",
      accent: "#059669"
    },
    subdomains_detail: {
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
      title: "Technology Segments",
      desc: "Deep-dive profiles of each technology segment, featuring a research summary, signal momentum assessment, maturity classification, cross-signal pattern analysis, key inflection points, and the most significant activities shaping the domain.",
      accent: "#15803d"
    },
    players_geo: {
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
      title: "Players & Geography",
      desc: "The Players and Geography tabs provide profiles of organizations and countries active in the space. Click any profile to explore its key activities, associated signals, and contribution to the technology landscape.",
      accent: "#166534"
    },
    takeaways: {
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
      title: "Summary Insights",
      desc: "Synthesised insights drawn across all technology segments, highlighting key takeaways, headline activities, strategic directions, weak signals, and contradictions that shape the technology's trajectory.",
      accent: "#059669"
    }
  };
  const TabPageHeader = ({
    id
  }) => {
    const meta = TAB_META[id];
    if (!meta) return null;
    const accent = meta.accent || "#1EDD7D";
    return <div className="flex items-start gap-3 mb-6 bg-white border border-slate-200 rounded-xl px-4 py-3.5"><div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{background: `${accent}15`, color: accent}}>{meta.icon}</div><div><h2 className="text-[15px] font-bold text-[#0f2644] mb-0.5">{meta.title}</h2><p className="text-[12px] text-[#0f2644] leading-relaxed">{meta.desc}</p></div></div>;
  };
  const renderContent = () => {
    switch (tab) {
      case "overview":
        return <OverviewPanel setTab={setTab} setRootSigTab={setRootSigTab} setRootPgSubTab={setRootPgSubTab} setRootSelPlayer={setRootSelPlayer} setRootSdId={setRootSdId} />;
      case "signals":
        return <React.Fragment><TabPageHeader id="signals" /><SignalsPanel initSigTab={rootSigTab} initSdId={rootSdId} /></React.Fragment>;
      case "subdomains_detail":
        return <React.Fragment><TabPageHeader id="subdomains_detail" /><SubdomainsDetailPanel initSdId={rootSdId} setRootSdId={setRootSdId} setTab={setTab} /></React.Fragment>;
      case "players_geo":
        return <React.Fragment><TabPageHeader id="players_geo" /><PlayersGeographyPanel initSubTab={rootPgSubTab} initSelPlayer={rootSelPlayer} onSelPlayerConsumed={() => setRootSelPlayer(null)} setTab={setTab} /></React.Fragment>;
      case "takeaways":
        return <React.Fragment><TabPageHeader id="takeaways" /><TakeawaysPanel /></React.Fragment>;
    }
  };
  return <div className="flex flex-col min-h-screen bg-[#f4f6f9] font-sans overflow-hidden"><header className="bg-white border-b border-slate-200 px-6 h-12 flex items-center justify-between sticky top-0 z-[200] flex-shrink-0"><div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-lg bg-[#0f2644] flex items-center justify-center flex-shrink-0"><svg width="14" height="14" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg></div><div className="flex items-center gap-2"><span className="text-[14px] font-bold text-[#0f2644] tracking-tight">TAL</span><span className="text-[#0f2644] text-[14px]">/</span><span className="text-[13px] text-[#0f2644]">Market Intelligence</span></div><div className="h-4 w-px bg-slate-200 mx-1" /><span className="text-[12px] font-medium px-2 py-0.5 rounded-md bg-[#eff6ff] border border-[#bfdbfe] text-[#2563eb] tracking-normal">Agentic AI</span></div><div className="flex items-center gap-1">{["Tour", "Help"].map(l => <button key={l} className="px-3 py-1.5 rounded-md text-[14px] text-[#0f2644] hover:text-slate-800 hover:bg-slate-100 transition-colors">{l}</button>)}<div className="h-4 w-px bg-slate-200 mx-1" /><div className="w-7 h-7 rounded-full bg-[#0f2644] flex items-center justify-center text-[12px] font-semibold text-white tracking-wide">NT</div></div></header><div className="flex flex-1 overflow-hidden h-[calc(100vh-48px)]"><aside className="w-[200px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col z-[80] h-[calc(100vh-48px)] overflow-y-auto"><div className="px-4 pt-4 pb-1"><span className="text-[12px] font-medium text-[#0f2644] tracking-normal">Navigation</span></div><nav className="flex-1 px-2 pb-2 flex flex-col gap-0.5">{SB_MAIN.map((item, i) => <button key={i} onClick={() => setSbActive(i)} className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[14px] w-full text-left transition-colors
                  ${sbActive === i ? "bg-[#f0fdf4] text-[#0f2644] font-medium" : "text-[#0f2644] hover:bg-slate-50 hover:text-slate-700"}`}><span className={`flex-shrink-0 ${sbActive === i ? "text-[#1EDD7D]" : "text-[#0f2644]"}`}>{item.icon}</span><span>{item.label}</span>{sbActive === i && <div className="ml-auto w-1 h-1 rounded-full bg-[#1EDD7D]" />}</button>)}<div className="h-px my-2 bg-slate-100" /><span className="px-3 text-[12px] font-medium text-[#0f2644] tracking-[0.06em] mb-1">More</span>{SB_SEC.map((item, i) => <button key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-md text-[14px] text-[#0f2644] w-full text-left hover:bg-slate-50 hover:text-slate-600 transition-colors"><span className="flex-shrink-0 text-[#0f2644]">{item.icon}</span><span>{item.label}</span></button>)}</nav><div className="px-3 pb-3 border-t border-slate-100 pt-3 flex-shrink-0"><div className="rounded-lg p-3 bg-slate-50 border border-slate-200"><div className="flex items-center justify-between mb-2"><span className="text-[12px] font-medium text-[#0f2644]">Credits</span><span className="text-[13px] text-[#0f2644]">20,954 / 30,000</span></div><div className="w-full h-1.5 rounded-full bg-slate-200 mb-1.5 overflow-hidden"><div className="h-full rounded-full bg-[#1EDD7D]" style={{
                width: "69.8%"
              }} /></div><span className="text-[13px] text-[#0f2644]">9,046 remaining</span></div></div></aside><div className="flex flex-col flex-1 overflow-hidden min-w-0 h-[calc(100vh-48px)]"><div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-4"><div className="min-w-0"><h1 className="text-[15px] font-bold text-[#0f2644] truncate leading-snug">Technology Activity Landscape for Agentic AI</h1></div><div className="flex items-center gap-2 flex-shrink-0"><button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-white text-[12px] font-medium text-[#0f2644] hover:bg-slate-50 hover:border-slate-300 transition-colors"><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>Share</button><button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0f2644] text-[12px] font-medium text-white hover:bg-[#1a3a5c] transition-colors"><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>Download</button></div></div><nav className="flex-shrink-0 bg-white border-b border-slate-200 px-6 flex items-end gap-0.5 shadow-[0_1px_3px_rgba(0,0,0,.05)]">{TOP_TABS.map(t => {
            const isActive = tab === t.id;
            return <button key={t.id} onClick={() => { if (t.id === "signals") { setRootSigTab("innovation"); setRootSdId(null); } setTab(t.id); }} className={`relative flex items-center gap-2 px-4 py-3 text-[14px] whitespace-nowrap transition-all duration-150 outline-none select-none
                    border-b-2 -mb-px
                    ${isActive ? "text-[#0f2644] font-semibold border-[#1EDD7D]" : "text-[#0f2644] font-medium border-transparent hover:text-slate-600 hover:border-slate-200"}`}><svg width="14" height="14" fill="none" stroke={isActive ? "#1EDD7D" : "currentColor"} strokeWidth={isActive ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="flex-shrink-0">{t.paths.map((p, i) => <path key={i} d={p} />)}</svg>{t.label}</button>;
          })}</nav><main ref={mainScrollRef} className="flex-1 overflow-y-auto px-6 py-6">{renderContent()}</main></div></div></div>;
}