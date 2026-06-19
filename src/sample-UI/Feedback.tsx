import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PieChart, Pie, Cell, Legend,
} from "recharts";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface PainPoint { point: string; severity: string; desc: string; relevance?: string; sources?: string[]; evidence?: string }
interface GrowthInitiative { initiative: string; desc: string; relevance?: string; sources?: string[]; evidence?: string }
interface Investment { initiative: string; desc: string; amount: string; relevance?: string; sources?: string[]; evidence?: string }
interface Vendor { name: string; offering: string; relationship?: string; relevance?: string; sources?: string[]; evidence?: string }

interface Customer {
  name: string;
  score: number;
  criteria: number[]; // [industryAlign, growth, techGap, strategic, geoReach, investCap]
  website: string;
  hq: string;
  size: string;
  businessFocus: string;
  strategicDir: string;
  revenue: string;
  netMargin: string;
  revenueGrowth: string;
  painPoints: PainPoint[];
  growthInitiatives: GrowthInitiative[];
  investments: Investment[];
  vendors: Vendor[];
}

type Page = "home" | "overview" | "scan" | "eval" | "dossier" | "insights" | "account-settings";
type DrawerTab = "overview" | "eval" | "pain" | "growth" | "invest" | "vendors";

// ─────────────────────────────────────────────
// DATA — 91 customers from Excel
// ─────────────────────────────────────────────
const RAW_DATA: Customer[] = [
  { name: "JPMorgan Chase & Co.", score: 5.0, criteria: [5,5,5,5,5,5], website: "https://www.jpmorganchase.com", hq: "USA", size: "300001-350000", businessFocus: "Provides consumer and commercial banking, investment banking, payments, markets, and asset & wealth management services globally.", strategicDir: "Committed to deploy $2.5 trillion in financing and investment for climate action and sustainable development.", revenue: "$158.1 Billion", netMargin: "31.3%", revenueGrowth: "22.8%", painPoints: [{ point: "Integration complexity across diverse enterprise systems", severity: "High", desc: "JPMorgan Chase faces significant challenges integrating AI/ML solutions across its vast and diverse enterprise technology stack, hindering unified development, deployment, and application at scale.", relevance: "Delta Engine's unified dashboard and modular toolkit centralize management and streamline integration, reducing the complexity and effort required to deploy AI/ML across disparate systems.", sources: ["Link 1", "Link 2", "Link 3"], evidence: "\"Executives acknowledge that realizing AI's full potential will take years due to the complexity of connecting diverse enterprise applications.\"" }, { point: "Persistent value gap between AI capability and business impact", severity: "High", desc: "Despite significant investment, JPMorgan struggles to translate AI/ML technology advances into fully realized, scalable business outcomes, citing a 'value gap' between theoretical and actual impact.", relevance: "Delta Engine's global pooled GPU compute and instant, elastic scaling allow rapid experimentation and deployment, closing the gap by making value delivery from new models faster and measurable.", sources: ["Link 4", "Link 5", "Link 6"], evidence: "\"There is a value gap between what the technology is capable of and the ability to fully capture that in an enterprise.\"" }, { point: "Security and governance risks from broad AI tool adoption", severity: "High", desc: "JPMorgan faces elevated security and governance risks as AI and automation tools are rapidly adopted at scale, with concerns about invisible vulnerabilities and regulatory scrutiny.", relevance: "Delta Engine's enterprise-grade security and compliance features help mitigate these risks by providing robust controls, audit trails, and simplified regulatory adherence for AI/ML deployment.", sources: ["Link 7", "Link 8"], evidence: "\"AI tools are creating invisible security holes. And hackers are walking right in... the SEC just signaled what's keeping compliance teams up at night: their 2025 examination priorities put artificial intelligence and emerging technologies right at the top of the agenda.\"" }, { point: "Operational and cultural friction in democratizing AI tools", severity: "Moderate", desc: "JPMorgan's large-scale rollout of AI/ML tools encounters operational and cultural challenges, including workforce retraining, changes to traditional work models, and friction in democratizing tool access.", relevance: "Delta Engine's no-code AI tools and consistent, user-friendly interfaces lower barriers to entry, accelerating adoption and minimizing cultural/operational resistance.", sources: ["Link 9", "Link 10", "Link 11"], evidence: "\"The transformation has broad implications for the nature of banking work, with roles shifting from routine tasks to managing AI systems, and raises strategic questions about workforce retraining versus reductions.\"" }], growthInitiatives: [{ initiative: "Security and Resiliency Initiative (SRI)", desc: "JPMorgan Chase launched a $1.5 trillion, 10-year plan to invest in U.S. industries critical to national security, emphasizing frontier technologies like AI, data centers, and cybersecurity, starting January 2026.", relevance: "The platform's global GPU resources, security, elastic scaling, and no-code tools accelerate AI innovation and secure deployment required for national security and strategic tech projects.", sources: ["Link 1", "Link 2"], evidence: "JPMorgan Chase announced a $1.5 trillion plan to finance and invest in critical U.S. sectors, specifically advancing AI, data centers, and cybersecurity technologies." }, { initiative: "Comprehensive Cloud Modernization", desc: "JPMorgan Chase has implemented a multi-cloud, multi-region digital architecture to modernize technology infrastructure, ensuring 24/7 service availability, scalability, and data-driven innovation across its global operations.", relevance: "Features like elastic hardware scaling, pooled GPU compute, monitoring, and seamless deployment support JPMorgan Chase's requirement for always-on, high-performance cloud architecture.", sources: ["Link 3", "Link 4"], evidence: "Chase.com leverages a multi-region, multi-cloud architecture for 24/7 service and digital core innovation." }, { initiative: "Enterprise-Level AI/ML Adoption and Expansion", desc: "JPMorgan Chase operates over 300 AI applications and has invested over $18 billion annually in technology, with $1.5 billion dedicated to AI, building in-house platforms like OmniAI and an LLM Suite.", relevance: "The ability to centralize, scale, and secure hundreds of AI workloads aligns directly with the platform's unified AI/ML management, pooled GPU resources, and enterprise-grade security.", sources: ["Link 5", "Link 6"], evidence: "JPMorgan Chase is a leader in AI with over 300 active AI applications and a $1.5 billion annual AI-dedicated budget, building proprietary AI infrastructure." }, { initiative: "Transformation of Global Payments Infrastructure", desc: "J.P. Morgan Payments is driving digital transformation in global payments through AI, APIs, biometrics, and embedded finance, processing trillions in daily payments across 160+ countries.", relevance: "Features like modular AI app toolkits, unified dashboards, instant scaling, and seamless deployment support J.P. Morgan Payments' need for real-time, global, API-first payment infrastructure.", sources: ["Link 7"], evidence: "J.P. Morgan Payments highlighted innovation at AWS re:Invent, focusing on AI, cloud, and APIs for payment modernization." }, { initiative: "JPMorgan Markets Institutional Platform Overhaul", desc: "JPMorgan Markets completed a multi-year redesign, integrating trading, analytics, and research tools into a unified digital platform for institutional clients.", relevance: "Unified dashboards, modular deployment, SSO, and user-friendly interfaces enable agile delivery of new features across the institutional platform.", sources: ["Link 8"], evidence: "The revamped digital platform consolidates services across research, portfolio, execution, and post-trade analytics for institutional users." }], investments: [{ initiative: "Enterprise-wide AI/ML R&D and Platform Development", desc: "Annual technology budget of $18B with $2B dedicated to AI, supporting in-house AI platforms (OmniAI, LLM Suite) for model training, deployment, and scalable enterprise adoption.", amount: "$2 Billion per year (AI only); $18 Billion per year (technology overall)", relevance: "Directly aligns with all platform features: global GPU resources, unified dashboards, no-code tools, elastic scaling, modular toolkits, SSO, enterprise security, SLA, seamless deployment, cost efficiency, and ease of use.", sources: ["Link 1", "Link 2", "Link 3", "Link 4"], evidence: "JPMorgan Chase's annual technology budget reached approximately $18 billion in 2025, with $2 billion per year allocated to artificial intelligence (AI). AI is described as a core driver of productivity and profitability." }, { initiative: "OmniAI and LLM Suite: In-house End-to-End AI/ML Platforms", desc: "Development and enterprise rollout of OmniAI and LLM Suite platforms, offering unified AI model management, no-code tooling, secure deployment, and modular, scalable AI capabilities.", amount: "", relevance: "Provides reference architectures for unified dashboards, no-code tools, modular deployment, elastic scaling, SSO, enterprise security, SLA-based support, and rapid onboarding—mirroring the client's platform.", sources: ["Link 5", "Link 6", "Link 7", "Link 8"], evidence: "OmniAI released its first capability a year ago. Today, engineers and data scientists across every line of business use the platform for end-to-end capabilities, from model training to production serving." }, { initiative: "Digital Infrastructure Modernization and AI Compute Capacity", desc: "Ongoing investments shifting 65%+ of applications to cloud, 80%+ on modern infrastructure, and dedicated funds toward high-capacity, secure compute environments for AI/ML scalability.", amount: "", relevance: "Enables pooled GPU resources, instant elastic scaling, seamless modular deployment, SLA uptime, and reduced compute cost critical for AI/ML platform-as-a-service solutions.", sources: ["Link 9", "Link 10", "Link 11"], evidence: "Approximately 65% of JPMorgan's applications are now primarily run in the cloud, and 80% operate on modern infrastructure. Annual data center funding needs are estimated at $700 billion in 2026, with $300 billion dedicated to AI and data center investments." }], vendors: [{ name: "Amazon Web Services (AWS)", offering: "Comprehensive cloud infrastructure and AI/ML PaaS (notably Amazon SageMaker, AWS Bedrock, Redshift, EMR, Lambda, Glue, enterprise security and monitoring) underpinning model development, deployment, and elastic workload scaling for enterprise clients.", relationship: "Core technology and infrastructure partner; AWS provides foundational cloud, AI/ML PaaS, GPU compute, and integration services for both internal platforms (e.g., OmniAI, LLM Suite) and external business products (Fusion, merchant/payment platforms). JPMC maintains a deep, multi-year strategic partnership involving technical integration, security, data residency compliance, and workload migration.", relevance: "AWS directly enables unified AI/ML workflows, elastic GPU scaling by the second, unified dashboards (SageMaker Studio), on-demand compute, modular deployment, SSO, enterprise compliance, no infrastructure setup, and cost-effective resource pooling. Features map closely with pooled global GPU, no-code tools (SageMaker Canvas), modular app patterns, strict governance, and user-centric platform delivery.", sources: ["Link 1", "Link 2", "Link 3", "Link 4"], evidence: "AWS provides cloud infrastructure and core PaaS services supporting nearly 1,000 JPMC applications, enabling scalable ML/AI compute in production with secure, elastic, cloud-native provisioning. JPMC leverages SageMaker, EMR, Lambda, and Bedrock as part of global platform standardization." }, { name: "Snowflake", offering: "Snowflake Data Cloud for Financial Services (including Cortex AI, semantic data layers, unified analytics, open feature store, agentic AI frameworks, production-grade security and compliance).", relationship: "Verified data and AI cloud partner; Snowflake provides unified data access, secure analytics, and AI-optimized infrastructure for internal and client-facing JPMC applications. Co-participant with JPMC in financial AI/ML innovation alliances (e.g., Open Semantic Interchange initiative).", relevance: "Snowflake enables unified dashboarding, model/feature management, seamless data accessibility, enterprise SSO, flexible scaling, and regulatory-grade compliance—enabling modular AI/ML integration, reduced setup burden, and rapid deployment for data-driven applications across JPMC.", sources: ["Link 5", "Link 6", "Link 7"], evidence: "JPMorgan partners with Snowflake both as a major client and open-source initiative co-founder to provide secure, production-grade cloud-native AI analytics and semantic interoperability for enterprise-scale workloads." }, { name: "OpenAI", offering: "Provision of foundation LLM models (e.g., GPT-4) licensed for internal enterprise use; JPMC operates these within its secured internal platforms for generative AI (LLM Suite).", relationship: "Model vendor agreement for internal foundation models; models are accessed via secured JPMC platforms (not through OpenAI SaaS) and integrated with internal data and agent orchestration for banking-specific use cases.", relevance: "Provides core generative model capability, directly powering content creation, code assistance, task summarization, and other LLM-powered functions accessible via a unified AI interface (LLM Suite). Complements in-house PaaS with latest model features; external SaaS features such as pooled compute or dashboard administration are not directly exposed.", sources: ["Link 8", "Link 9"], evidence: "JPMC licenses and integrates OpenAI models for proprietary enterprise use in its globally deployed LLM Suite, serving 200,000–250,000 employees; use is internal, secure, and highly customized to JPMC requirements." }, { name: "Anthropic", offering: "Foundation generative AI models (Claude family), delivered under secure vendor agreement for use within JPMC's proprietary platforms (LLM Suite).", relationship: "Model vendor for foundation LLMs; models serve as a core engine for internal JPMC generative AI, integrated via custom, secure infrastructure for banking process and regulatory alignment.", relevance: "Enables modular, secure generative AI features (summarization, drafting, workflow automation) within JPMC AI/ML platforms, supporting consistent user experience and integration with existing proprietary tools.", sources: ["Link 10", "Link 11"], evidence: "Anthropic generative models are integrated within JPMC's LLM Suite as co-providers of foundation LLMs, enabling banking-grade GenAI at scale; models complement in-house platforms by powering enterprise AI use cases." }, { name: "Accenture", offering: "Enterprise technology, systems integration, and payments platform consulting—including embedded banking, AI-driven automation, cloud transformation, and go-to-market for digital and platform services.", relationship: "Long-standing implementation, consulting, and co-innovation partner (25+ years); leading participant in JPMC's Payments System Integrator Program; supports full lifecycle adoption of embedded finance, AI, and platform-enabled workflows. Joint conference presentations, whitepapers, and client solution delivery.", relevance: "Drives integration of scalable AI/ML platforms, assures compliance and digital transformation, manages program rollout, and broadens application of internal/external PaaS solutions for JPMC, including workflow orchestration and modular deployment patterns.", sources: ["Link 12", "Link 13"], evidence: "Accenture is JPMC's first Payments System Integrator Program partner; supports technology enablement and delivery of modern embedded finance and platform-based banking solutions, with deep experience in AI/ML and cloud migrations." }, { name: "Consulting IQ", offering: "Strategy tools and AI/ML-powered solutions for SMB clients; technology consulting partnership to enhance global innovation and AI adoption for JPMC's business banking segment.", relationship: "Recent (2025–2026) technology and consulting partner for AI-enhanced platforms, focusing on SMB strategy enablement, co-delivery of new platform features, and joint innovation pilots.", relevance: "Delivers functionally similar outcomes for platform-enabled AI/ML business solutions, augments JPMC's portfolio for SMBs, and assists in modular rollout/adoption for specialized segments.", sources: ["Link 14"], evidence: "Consulting IQ was named as a co-innovation partner with JPMC to deliver AI-powered strategy tools and digital solutions to global SMB clients, supporting innovation and digital transformation efforts." }] },
  { name: "HSBC Holdings plc", score: 4.7, criteria: [5,5,5,3,5,5], website: "https://www.hsbc.com", hq: "UK", size: "200001-225000", businessFocus: "Multinational banking and financial services organization offering retail, commercial, and investment banking across 60+ countries.", strategicDir: "Accelerating digital transformation with major AI and cloud investments across all business lines.", revenue: "$66.1 Billion", netMargin: "28.5%", revenueGrowth: "12.1%", painPoints: [{ point: "Data fragmentation across global operations", severity: "High", desc: "Managing disconnected data systems across 60+ countries creates significant analytics inefficiencies." }, { point: "Compliance complexity in multi-jurisdiction AI deployment", severity: "High", desc: "Regulatory requirements vary widely, complicating AI rollout across geographies." }, { point: "Legacy system integration burden", severity: "High", desc: "Aging core banking infrastructure slows AI/ML adoption and time-to-value." }], growthInitiatives: [{ initiative: "AI-Driven Risk and Compliance Platform", desc: "Building centralized AI platform for real-time risk scoring and regulatory compliance." }, { initiative: "Global Digital Banking Transformation", desc: "Unified digital banking experience across retail and commercial segments." }, { initiative: "Data Cloud Consolidation Program", desc: "Migrating to unified data cloud architecture for global analytics." }], investments: [{ initiative: "Technology and AI Investment Program", desc: "Major multi-year investment across cloud, AI, and data infrastructure.", amount: "$6B+ annual tech spend" }, { initiative: "Cloud Migration Initiative", desc: "Moving core banking workloads to cloud-native architecture.", amount: "Portion of tech budget" }], vendors: [{ name: "Google Cloud", offering: "Cloud infrastructure and AI/ML platform services." }, { name: "Microsoft Azure", offering: "Enterprise cloud and AI services for global operations." }, { name: "Amazon Web Services (AWS)", offering: "Cloud compute and storage for banking workloads." }] },
  { name: "Netflix", score: 4.7, criteria: [5,5,5,3,5,5], website: "https://www.netflix.com", hq: "USA", size: "12001-13000", businessFocus: "Subscription streaming service delivering original and licensed TV shows, films, and games to 260M+ members in 190+ countries.", strategicDir: "Expanding into live events, gaming, and ad-supported tiers while deepening personalization through AI.", revenue: "$39.0 Billion", netMargin: "22.0%", revenueGrowth: "14.8%", painPoints: [{ point: "Content recommendation quality at global scale", severity: "High", desc: "Maintaining personalization accuracy across diverse languages, cultures, and viewing patterns." }, { point: "Data pipeline complexity for real-time streaming analytics", severity: "High", desc: "Petabyte-scale data processing for live engagement and A/B testing at speed." }, { point: "Ad-tier data monetization infrastructure", severity: "Moderate", desc: "Building scalable advertiser analytics while maintaining user privacy standards." }], growthInitiatives: [{ initiative: "AI-Powered Content Personalization Engine", desc: "Next-gen recommendation system leveraging deep learning for content discovery." }, { initiative: "Live Sports and Events Streaming Expansion", desc: "NFL games and live events requiring massive real-time data infrastructure." }, { initiative: "Games Studio and Interactive Content", desc: "Scaling Netflix Games with 80+ titles requiring analytics and player behavior modeling." }], investments: [{ initiative: "AI Infrastructure and Personalization R&D", desc: "Deep learning models for content recommendation and production efficiency.", amount: "$17B+ content spend annually" }, { initiative: "Live Streaming Technology Platform", desc: "Infrastructure for high-concurrency live events at global scale.", amount: "Portion of tech investment" }], vendors: [{ name: "Amazon Web Services (AWS)", offering: "Primary cloud infrastructure for streaming delivery and data processing." }, { name: "Google Cloud", offering: "BigQuery for analytics; Vertex AI for ML workloads." }, { name: "Databricks", offering: "Unified data analytics and ML platform for recommendation systems." }, { name: "Snowflake", offering: "Data warehousing for business intelligence and analytics." }] },
  { name: "Skechers USA, Inc.", score: 4.4, criteria: [5,5,5,3,5,3], website: "https://www.skechers.com", hq: "USA", size: "25001-30000", businessFocus: "Designs and markets branded lifestyle and performance footwear, apparel and accessories sold via wholesale, retail, and online channels in 170+ countries.", strategicDir: "AI-powered retail planning and global supply chain modernization with major cloud investments.", revenue: "$8.0 Billion", netMargin: "6.6%", revenueGrowth: "7.5%", painPoints: [{ point: "Managing complex and volatile global supply chain operations", severity: "High", desc: "Supply chain volatility impacts inventory planning and cost management across global operations." }, { point: "Scaling AI-driven hyper-personalization across global markets", severity: "High", desc: "Building personalized customer experiences across diverse global markets and languages." }, { point: "Legacy IT complexity hinders rapid AI/ML development", severity: "Moderate", desc: "Aging systems slow deployment of modern AI and analytics capabilities." }], growthInitiatives: [{ initiative: "Digital Brain AI Platform for Retail Planning", desc: "AI-powered retail planning platform for demand forecasting and inventory optimization." }, { initiative: "Omnichannel Commerce Modernization", desc: "Unified commerce platform connecting online and physical retail experiences." }, { initiative: "Data Intelligence Platform for Personalization", desc: "Customer data platform for AI-driven personalization at global scale." }, { initiative: "Luna: AI Retail Assistant Pilot", desc: "Conversational AI assistant for retail store operations and customer engagement." }], investments: [{ initiative: "AI-Powered Retail Planning and Supply Chain Transformation", desc: "End-to-end AI transformation of demand planning, logistics, and inventory management.", amount: "$600-$700M planned 2025 capex" }, { initiative: "Digital Transformation of Global Customer Data/Marketing", desc: "AI and machine learning for customer data platform and personalized marketing.", amount: "Included in capex budget" }, { initiative: "Global Cloud Infrastructure Modernization (AWS Network Transformation)", desc: "Network transformation and cloud migration across global operations.", amount: "Portion of capex budget" }], vendors: [{ name: "Databricks", offering: "Unified data analytics platform for ML and AI workloads." }, { name: "Amazon Web Services (AWS)", offering: "Cloud infrastructure and network transformation." }, { name: "o9 Solutions", offering: "AI-powered supply chain planning platform." }] },
  { name: "Nubank S.A.", score: 4.4, criteria: [5,5,5,3,5,3], website: "https://www.nu.com.br", hq: "Brazil", size: "7001-8000", businessFocus: "Latin America's largest digital financial services platform offering credit cards, personal loans, savings accounts, and insurance to 90M+ customers.", strategicDir: "Expanding financial products and geographic reach while deepening AI-powered credit and fraud capabilities.", revenue: "$2.9 Billion", netMargin: "9.6%", revenueGrowth: "64.0%", painPoints: [{ point: "Credit risk modeling at scale in emerging markets", severity: "High", desc: "Building accurate credit scoring for thin-file customers with limited traditional credit history." }, { point: "Fraud detection for real-time digital transactions", severity: "High", desc: "Sub-second fraud detection required across billions of annual transactions." }, { point: "Regulatory compliance across multiple Latin American jurisdictions", severity: "Moderate", desc: "Different regulatory frameworks across Brazil, Mexico, Colombia, and other markets." }], growthInitiatives: [{ initiative: "AI-First Credit and Risk Platform", desc: "Next-generation credit scoring using alternative data and advanced ML models." }, { initiative: "Geographic Expansion across Latin America", desc: "Scaling operations in Mexico, Colombia, and other high-growth markets." }, { initiative: "SuperApp Financial Services Platform", desc: "Unified platform combining banking, investment, insurance, and commerce." }], investments: [{ initiative: "AI and ML Infrastructure Expansion", desc: "Large-scale investment in ML infrastructure for credit, fraud, and personalization.", amount: "Part of growth investment" }, { initiative: "Cloud-Native Banking Platform", desc: "Fully cloud-native architecture for rapid product development and scaling.", amount: "Core infrastructure investment" }], vendors: [{ name: "Amazon Web Services (AWS)", offering: "Primary cloud infrastructure for banking operations." }, { name: "Google Cloud", offering: "AI/ML platform and BigQuery for analytics." }, { name: "Databricks", offering: "ML platform for credit risk and fraud detection models." }] },
  { name: "IQVIA", score: 4.4, criteria: [5,5,5,3,5,3], website: "https://www.iqvia.com", hq: "USA", size: "85001-90000", businessFocus: "Leading global provider of clinical research services, real-world evidence, and healthcare intelligence solutions serving life sciences companies.", strategicDir: "Expanding AI-powered drug development and real-world evidence capabilities through data integration.", revenue: "$15.4 Billion", netMargin: "5.2%", revenueGrowth: "5.1%", painPoints: [{ point: "Integrating fragmented healthcare data sources", severity: "High", desc: "Harmonizing structured and unstructured clinical, claims, and real-world data at scale." }, { point: "AI model validation for regulatory submission", severity: "High", desc: "Meeting FDA and EMA requirements for AI/ML-based diagnostic and drug development tools." }, { point: "Data privacy and governance in clinical research", severity: "High", desc: "Maintaining HIPAA and GDPR compliance while enabling advanced analytics on patient data." }], growthInitiatives: [{ initiative: "AI-Powered Clinical Trial Optimization", desc: "Using ML to accelerate patient recruitment, protocol design, and site selection." }, { initiative: "Real-World Evidence Analytics Platform", desc: "Unified platform for generating evidence from claims, EHR, and patient registry data." }, { initiative: "Regulatory AI and Digital Health Solutions", desc: "AI tools to support FDA-compliant drug development and safety monitoring." }], investments: [{ initiative: "OCE and Healthcare AI Platform", desc: "Orchestrated Customer Engagement and AI-powered commercial analytics for pharma.", amount: "Major product investment" }, { initiative: "Cloud Data Modernization", desc: "Moving analytics infrastructure to cloud-native architecture.", amount: "Multi-year investment" }], vendors: [{ name: "Amazon Web Services (AWS)", offering: "Cloud infrastructure for clinical data processing." }, { name: "Microsoft Azure", offering: "Enterprise cloud and AI services for life sciences." }, { name: "Databricks", offering: "Unified analytics for healthcare data processing." }, { name: "Palantir", offering: "Data integration and analytics platform for clinical operations." }] },
  { name: "Midea Group", score: 4.4, criteria: [5,5,5,3,5,3], website: "https://www.midea.com", hq: "China", size: "160001-165000", businessFocus: "World's largest home appliance manufacturer with smart home, HVAC, industrial robotics, and digital solutions businesses.", strategicDir: "Transforming into a global technology company through AI, IoT, and smart manufacturing investment.", revenue: "$51.5 Billion", netMargin: "5.4%", revenueGrowth: "8.7%", painPoints: [{ point: "Smart manufacturing data integration complexity", severity: "High", desc: "Connecting IoT sensors, production lines, and ERP systems across 200+ global factories." }, { point: "Global supply chain visibility and optimization", severity: "High", desc: "Real-time visibility and predictive analytics across complex multi-tier supplier networks." }, { point: "AI-powered product personalization at scale", severity: "Moderate", desc: "Delivering personalized smart home experiences to 400M+ connected devices globally." }], growthInitiatives: [{ initiative: "KUKA Robotics AI Integration", desc: "Expanding AI capabilities in industrial robots and smart manufacturing systems." }, { initiative: "Smart Home AI Platform Expansion", desc: "Unified AI platform for connected home appliance management and automation." }, { initiative: "Global Cloud Manufacturing Initiative", desc: "Cloud-first manufacturing platform connecting global production facilities." }], investments: [{ initiative: "AI and Digital Manufacturing Investment", desc: "Major investment in AI, IoT, and digital transformation of manufacturing operations.", amount: "$5.6B R&D budget" }, { initiative: "Robotics and Automation Platform", desc: "Expanding KUKA industrial robot capabilities with AI and ML.", amount: "Portion of R&D budget" }], vendors: [{ name: "Amazon Web Services (AWS)", offering: "Cloud infrastructure for global operations." }, { name: "Microsoft Azure", offering: "Enterprise AI and cloud services." }, { name: "NVIDIA", offering: "GPU computing for AI/ML training and inference." }] },
  { name: "NextEra Energy", score: 4.3, criteria: [3,5,5,3,5,5], website: "https://www.nexteraenergy.com", hq: "USA", size: "15001-16000", businessFocus: "World's largest electric utility by market cap, operating renewable energy, transmission, and retail electricity businesses across North America.", strategicDir: "Leading the energy transition through massive renewable investment and grid intelligence through AI.", revenue: "$24.5 Billion", netMargin: "19.9%", revenueGrowth: "3.6%", painPoints: [{ point: "Grid optimization for intermittent renewable generation", severity: "High", desc: "Balancing solar and wind variability with grid stability requires sophisticated forecasting." }, { point: "Predictive maintenance for massive asset fleets", severity: "High", desc: "Managing maintenance for thousands of wind turbines and solar panels across North America." }, { point: "Energy market analytics and trading optimization", severity: "Moderate", desc: "Real-time optimization of energy trading across multiple deregulated markets." }], growthInitiatives: [{ initiative: "Real Simple Solar AI Platform", desc: "AI-powered platform for solar project development, permitting, and optimization." }, { initiative: "Grid Intelligence and Automation Program", desc: "Advanced analytics for distribution grid optimization and demand response." }, { initiative: "Battery Storage Analytics Platform", desc: "ML-driven dispatch optimization for 6,000+ MW of battery storage assets." }], investments: [{ initiative: "Renewable Energy Capital Program", desc: "Massive investment in wind, solar, and battery storage across North America.", amount: "$67-70B through 2026" }, { initiative: "Digital Grid Infrastructure", desc: "Smart grid technology and analytics platform investment.", amount: "Portion of capital program" }], vendors: [{ name: "Amazon Web Services (AWS)", offering: "Cloud infrastructure for energy analytics." }, { name: "Microsoft Azure", offering: "AI platform for grid optimization." }, { name: "GE Digital", offering: "Asset performance management for generation fleet." }, { name: "NVIDIA", offering: "GPU computing for weather and grid forecasting models." }] },
  { name: "Stanford University", score: 4.3, criteria: [3,5,5,5,5,3], website: "https://www.stanford.edu", hq: "USA", size: "15001-20000", businessFocus: "Leading research university conducting frontier AI, biomedical, and computational science research with strong industry partnerships.", strategicDir: "Establishing Stanford as the global hub for responsible AI research and commercialization.", revenue: "$9.6 Billion", netMargin: "N/A", revenueGrowth: "8.2%", painPoints: [{ point: "Research compute access and cost management", severity: "High", desc: "Faculty and students need scalable GPU compute for large-scale AI research projects." }, { point: "Data sharing and governance across research groups", severity: "High", desc: "Enabling collaboration while maintaining data governance and IRB compliance." }, { point: "AI research infrastructure standardization", severity: "Moderate", desc: "Heterogeneous compute environments slow research productivity and reproducibility." }], growthInitiatives: [{ initiative: "Stanford HAI (Human-Centered AI Institute)", desc: "Interdisciplinary AI research center focused on responsible AI development." }, { initiative: "AI in Medicine and Health Research Program", desc: "Clinical AI tools and digital health research across Stanford Medicine." }, { initiative: "Computational Research Cloud Initiative", desc: "Unified research computing platform for faculty and student AI projects." }], investments: [{ initiative: "AI Research Infrastructure Investment", desc: "Major investment in compute, storage, and ML platforms for research.", amount: "Part of $9.6B operating budget" }, { initiative: "Industry Partnership and Sponsored Research", desc: "Collaborative research with technology companies on AI frontier topics.", amount: "Hundreds of millions annually" }], vendors: [{ name: "NVIDIA", offering: "GPU hardware and AI compute platform for research." }, { name: "Google Cloud", offering: "Research cloud credits and TPU access." }, { name: "Amazon Web Services (AWS)", offering: "Cloud research computing platform." }, { name: "Microsoft Azure", offering: "Azure for Research program compute access." }] },
  { name: "e& (formerly Etisalat Group)", score: 4.3, criteria: [5,3,5,3,5,5], website: "https://www.eand.com", hq: "UAE", size: "40001-45000", businessFocus: "Leading Middle East and African telecom group providing mobile, fixed-line, and digital services across 16 countries with strong enterprise focus.", strategicDir: "Transforming into a global technology and investment group through AI, cloud, and fintech ventures.", revenue: "$16.8 Billion", netMargin: "14.5%", revenueGrowth: "2.7%", painPoints: [{ point: "Network capacity and optimization with 5G rollout", severity: "High", desc: "Managing 5G network performance across 16 countries with diverse infrastructure." }, { point: "Customer churn prediction and retention analytics", severity: "High", desc: "Reducing churn across millions of subscribers using behavioral analytics." }, { point: "Digital service monetization beyond connectivity", severity: "Moderate", desc: "Building AI-powered digital services revenue as traditional telecom revenue stagnates." }], growthInitiatives: [{ initiative: "e& Enterprise AI Cloud Platform", desc: "Regional AI and cloud services platform for enterprise customers across MEA." }, { initiative: "Fintech and Digital Financial Services Expansion", desc: "Building financial services capabilities through e& Money and partnerships." }, { initiative: "Network AI and 5G Intelligence Platform", desc: "AI-driven network optimization for 5G and 4G across regional operations." }], investments: [{ initiative: "Digital and AI Transformation Program", desc: "Major investment in AI, cloud, and digital service capabilities.", amount: "$1.6B annual capex" }, { initiative: "Strategic Technology Partnerships", desc: "Partnerships with Microsoft, AWS, and Huawei for cloud and AI capabilities.", amount: "Part of overall investment" }], vendors: [{ name: "Microsoft Azure", offering: "Strategic cloud and AI partner for enterprise services." }, { name: "Amazon Web Services (AWS)", offering: "Cloud infrastructure and marketplace." }, { name: "Huawei", offering: "Network equipment and cloud services." }, { name: "NVIDIA", offering: "AI computing infrastructure for analytics." }] },
  { name: "Parexel", score: 4.25, criteria: [5,5,5,5,5,0], website: "https://www.parexel.com", hq: "USA", size: "21001-22000", businessFocus: "Global CRO providing full-service clinical research, regulatory consulting, and market access services for biopharmaceutical companies.", strategicDir: "Digitizing clinical trial operations through AI-powered patient engagement and data analytics.", revenue: "$2.6 Billion", netMargin: "6.1%", revenueGrowth: "11.8%", painPoints: [{ point: "Clinical trial patient recruitment and retention", severity: "High", desc: "Identifying and enrolling eligible patients efficiently across global trial sites." }, { point: "Data management from fragmented clinical sources", severity: "High", desc: "Integrating disparate EHR, wearable, and ePRO data sources for unified analytics." }, { point: "Regulatory submission complexity", severity: "High", desc: "Meeting evolving FDA, EMA, and ICH requirements for AI-assisted clinical processes." }], growthInitiatives: [{ initiative: "AI-Powered Patient Recruitment Platform", desc: "ML models for site and patient identification to accelerate trial enrollment." }, { initiative: "Decentralized Clinical Trial (DCT) Technology", desc: "Remote patient monitoring and digital endpoint collection capabilities." }, { initiative: "Regulatory Intelligence Platform", desc: "AI platform for regulatory strategy and submission optimization." }], investments: [{ initiative: "Clinical AI and Digital Platform Investment", desc: "Comprehensive investment in AI-driven clinical trial technology.", amount: "Major investment program" }], vendors: [{ name: "Microsoft Azure", offering: "Cloud platform for clinical data management." }, { name: "Veeva Systems", offering: "Clinical trial management and regulatory submission." }, { name: "Medidata", offering: "Electronic data capture and clinical analytics." }] },
  { name: "Warby Parker, Inc.", score: 4.1, criteria: [5,5,5,3,5,1], website: "https://www.warbyparker.com", hq: "USA", size: "3001-3500", businessFocus: "Designs and retails prescription glasses, sunglasses, and contact lenses via e-commerce and physical stores across the US and Canada.", strategicDir: "Broadening eye-care services and launching AI-powered smart glasses while continuing retail expansion.", revenue: "$669.8 Million", netMargin: "-9.4%", revenueGrowth: "12.0%", painPoints: [{ point: "Sluggish e-commerce growth and slow digital feature adoption", severity: "High", desc: "E-commerce segment grew just 1.8% YoY in Q1 2024, lagging far behind retail store growth." }, { point: "Low penetration of eye exams and contact lens services", severity: "High", desc: "Contact lens sales at 9% of revenue vs 20% industry average; eye exams also below industry norm." }, { point: "Omnichannel operational complexity and digital workflow silos", severity: "High", desc: "Rapid retail expansion has created operational burdens in inventory, scheduling, and unified customer data." }], growthInitiatives: [{ initiative: "AI-Powered Smart Glasses Collaboration (Google)", desc: "Multi-year partnership with Google and Samsung to launch AI-enabled smart glasses targeting 2026." }, { initiative: "Expansion of AI and Digital Customer Tools", desc: "Scaling AR-based Virtual Try-On, personalized Advisor platform, and enhanced digital experiences." }, { initiative: "Retail and Omnichannel Expansion with Data and AI", desc: "Opening new store formats and expanding omnichannel integration using AI and analytics." }], investments: [{ initiative: "AI-Enabled Eyewear Product Development (Google Partnership)", desc: "Joint initiative to develop and commercialize AI-powered smart glasses.", amount: "$75M dev + up to $75M equity" }, { initiative: "Cloud-Based ERP and Technology Infrastructure", desc: "Multi-year investment in cloud-based ERP and core IT infrastructure.", amount: "$5.1M+ (2022-2023)" }], vendors: [{ name: "Google", offering: "AI/ML platform-as-a-service; Gemini AI for smart glasses development." }, { name: "Amazon Web Services (AWS)", offering: "Cloud infrastructure and foundational IT operations." }, { name: "Okta", offering: "Identity and access management, SSO and MFA." }] },
  { name: "Cleveland Clinic", score: 4.1, criteria: [5,5,5,3,5,1], website: "https://www.clevelandclinic.org", hq: "USA", size: "70001-75000", businessFocus: "Leading nonprofit academic medical center providing world-class clinical care, research, and medical education with 280+ locations worldwide.", strategicDir: "AI-powered precision medicine and clinical operations transformation through cloud and analytics.", revenue: "$14.6 Billion", netMargin: "2.8%", revenueGrowth: "9.1%", painPoints: [{ point: "Clinical AI integration with EHR workflows", severity: "High", desc: "Embedding AI tools into Epic and other clinical systems without disrupting care workflows." }, { point: "Unstructured clinical data analytics", severity: "High", desc: "Extracting insights from clinical notes, radiology reports, and pathology data at scale." }, { point: "Research data governance and patient privacy", severity: "High", desc: "Enabling research analytics while maintaining HIPAA compliance and patient consent." }], growthInitiatives: [{ initiative: "Cleveland Clinic-IBM Quantum Research", desc: "Quantum computing research partnership for drug discovery and genomics." }, { initiative: "AI in Radiology and Diagnostic Imaging", desc: "Deploying AI models for automated image analysis and early disease detection." }, { initiative: "Precision Medicine Data Platform", desc: "Genomics and clinical data integration for personalized treatment pathways." }], investments: [{ initiative: "Digital Health and AI Investment Program", desc: "Major investment in clinical AI, data infrastructure, and digital health tools.", amount: "Part of $14.6B operating budget" }], vendors: [{ name: "IBM", offering: "Quantum computing and AI research partnership." }, { name: "Microsoft Azure", offering: "Cloud and AI platform for healthcare analytics." }, { name: "Epic Systems", offering: "EHR and clinical data management platform." }, { name: "NVIDIA", offering: "GPU computing for medical imaging AI." }] },
  { name: "Renault Group", score: 4.1, criteria: [5,5,5,3,5,1], website: "https://www.renaultgroup.com", hq: "France", size: "110001-115000", businessFocus: "Global automotive manufacturer producing Renault, Dacia, and Alpine vehicles with a major pivot to electric vehicles and software-defined automobiles.", strategicDir: "Leading Europe's EV transition with Ampere spin-off focused on software-defined vehicle technology.", revenue: "$58.5 Billion", netMargin: "3.8%", revenueGrowth: "9.2%", painPoints: [{ point: "Software-defined vehicle (SDV) data architecture", severity: "High", desc: "Building cloud-native data architecture for connected vehicle data at petabyte scale." }, { point: "EV battery analytics and lifecycle management", severity: "High", desc: "Monitoring, predicting, and optimizing battery performance across millions of EVs." }, { point: "Global manufacturing data integration", severity: "Moderate", desc: "Unifying production data across 40+ global manufacturing sites for quality and efficiency." }], growthInitiatives: [{ initiative: "Ampere: Software-Defined Vehicle Spinoff", desc: "New EV and software company with dedicated digital platform and IPO plans." }, { initiative: "Connected Vehicle Data Platform", desc: "Real-time telemetry analytics for 3M+ connected vehicles globally." }, { initiative: "AI-Powered Manufacturing Optimization", desc: "Computer vision and predictive analytics across global production facilities." }], investments: [{ initiative: "Renault Group Innovation and Technology Investment", desc: "R&D and digital transformation investment for EV and SDV capabilities.", amount: "$3.5B annual R&D spend" }], vendors: [{ name: "Google Cloud", offering: "Cloud infrastructure and AI for connected vehicle data." }, { name: "Microsoft Azure", offering: "Enterprise cloud and IoT platform." }, { name: "NVIDIA", offering: "Drive platform for autonomous driving AI." }] },
  { name: "The Walt Disney Company", score: 4.1, criteria: [5,5,5,3,5,1], website: "https://www.thewaltdisneycompany.com", hq: "USA", size: "220001-225000", businessFocus: "Global entertainment conglomerate with theme parks, streaming (Disney+), film studios, and media networks serving billions worldwide.", strategicDir: "Integrating AI across streaming personalization, content production, and theme park experiences.", revenue: "$91.4 Billion", netMargin: "3.1%", revenueGrowth: "2.7%", painPoints: [{ point: "Streaming data personalization at global scale", severity: "High", desc: "Disney+ requires sophisticated recommendation systems across 150M+ subscribers globally." }, { point: "Content production cost and AI-assisted creation", severity: "High", desc: "Managing $30B+ content budget with AI tools for production efficiency." }, { point: "Theme park capacity optimization and digital guest experience", severity: "Moderate", desc: "Real-time optimization of guest flow, wait times, and personalized park experiences." }], growthInitiatives: [{ initiative: "Disney+ AI Personalization Platform", desc: "Next-generation recommendation engine leveraging behavioral data and ML." }, { initiative: "AI in Film Production and VFX", desc: "Generative AI tools for visual effects, de-aging, and production automation." }, { initiative: "MagicBand+ and Connected Park Experience", desc: "IoT and AI platform for personalized theme park experiences." }], investments: [{ initiative: "Streaming Technology and AI Investment", desc: "Major investment in Disney+ technology infrastructure and AI personalization.", amount: "Part of $30B+ content/tech spend" }, { initiative: "Direct-to-Consumer Digital Transformation", desc: "End-to-end digital platform for direct consumer engagement.", amount: "Billions in annual investment" }], vendors: [{ name: "Amazon Web Services (AWS)", offering: "Primary cloud infrastructure for streaming and analytics." }, { name: "Snowflake", offering: "Data cloud for audience analytics and content insights." }, { name: "Databricks", offering: "Unified analytics for streaming data processing." }, { name: "NVIDIA", offering: "GPU computing for AI/ML and VFX workloads." }] },
  { name: "Goldman Sachs Group, Inc.", score: 3.9, criteria: [5,3,5,3,5,3], website: "https://www.goldmansachs.com", hq: "USA", size: "45001-50000", businessFocus: "Leading global investment bank providing securities, asset management, and consumer banking services to corporations, governments, and individuals.", strategicDir: "Leveraging AI across trading, risk management, and consumer banking with major tech platform investments.", revenue: "$53.5 Billion", netMargin: "18.2%", revenueGrowth: "16.2%", painPoints: [{ point: "Real-time market risk analytics at scale", severity: "High", desc: "Processing petabytes of market data for real-time risk calculations across global portfolios." }, { point: "AI governance and model risk management", severity: "High", desc: "Ensuring regulatory compliance for AI models used in trading and credit decisions." }, { point: "Data democratization across siloed business units", severity: "Moderate", desc: "Enabling data-driven decision making across trading, investment banking, and asset management." }], growthInitiatives: [{ initiative: "Marcus AI Financial Planning Platform", desc: "Consumer banking platform powered by ML for personalized financial products." }, { initiative: "Quantitative Strategies AI Research", desc: "Advanced ML models for systematic trading and risk management." }], investments: [{ initiative: "Technology and AI Platform Investment", desc: "Annual investment in trading technology, AI, and data infrastructure.", amount: "$13B+ annual tech spend" }], vendors: [{ name: "Amazon Web Services (AWS)", offering: "Cloud infrastructure for banking workloads." }, { name: "Databricks", offering: "Unified analytics for market and risk data." }, { name: "Snowflake", offering: "Data cloud for financial analytics." }] },
  { name: "Mayo Clinic", score: 3.7, criteria: [5,3,5,3,5,1], website: "https://www.mayoclinic.org", hq: "USA", size: "65001-70000", businessFocus: "Nonprofit academic medical center providing specialty care with 1.3M patients annually, conducting $680M+ in research.", strategicDir: "Becoming the global destination for complex care through AI, genomics, and digital health innovation.", revenue: "$17.6 Billion", netMargin: "2.1%", revenueGrowth: "7.3%", painPoints: [{ point: "AI-assisted diagnosis at scale", severity: "High", desc: "Scaling validated AI diagnostic models across all specialties and patient populations." }, { point: "Genomics data analytics infrastructure", severity: "High", desc: "Processing and integrating whole genome sequencing data with clinical records." }], growthInitiatives: [{ initiative: "Mayo Clinic Platform (Digital Health)", desc: "Commercial platform for AI-powered clinical insights and digital health tools." }, { initiative: "Genomics and Precision Medicine Program", desc: "Scaling genomic sequencing and AI-driven treatment personalization." }], investments: [{ initiative: "Digital and AI Health Investment", desc: "Investment in clinical AI, research data infrastructure, and platform development.", amount: "Part of $17.6B operating budget" }], vendors: [{ name: "Google Cloud", offering: "AI research and cloud infrastructure partnership." }, { name: "Amazon Web Services (AWS)", offering: "Healthcare data cloud platform." }, { name: "Nference", offering: "AI analytics platform on Mayo clinical data." }] },
  { name: "AstraZeneca", score: 3.7, criteria: [5,3,5,3,5,1], website: "https://www.astrazeneca.com", hq: "UK", size: "80001-85000", businessFocus: "Global pharmaceutical company focused on oncology, cardiovascular, respiratory, and rare disease with $45B+ in annual revenues.", strategicDir: "AI-accelerated drug discovery and precision medicine through major digital transformation investment.", revenue: "$45.8 Billion", netMargin: "4.6%", revenueGrowth: "18.1%", painPoints: [{ point: "Drug discovery data integration complexity", severity: "High", desc: "Integrating genomics, proteomics, imaging, and clinical data for target identification." }, { point: "Clinical trial data management at global scale", severity: "High", desc: "Managing petabytes of clinical data across hundreds of concurrent global trials." }], growthInitiatives: [{ initiative: "AI Drug Discovery Platform (BioPharmaceutics)", desc: "ML models for target identification, lead optimization, and biomarker discovery." }, { initiative: "Precision Oncology Data Platform", desc: "Integrated genomics and clinical analytics for cancer treatment personalization." }], investments: [{ initiative: "R&D Digital and AI Transformation", desc: "Major investment in AI-powered drug discovery and clinical trial technology.", amount: "$10B+ annual R&D spend" }], vendors: [{ name: "Microsoft Azure", offering: "Cloud and AI platform for drug discovery." }, { name: "Amazon Web Services (AWS)", offering: "Research computing and data management." }, { name: "NVIDIA", offering: "GPU computing for computational biology." }, { name: "Databricks", offering: "Unified analytics for research data." }] },
  { name: "Deutsche Telekom", score: 3.9, criteria: [5,3,5,3,5,3], website: "https://www.telekom.com", hq: "Germany", size: "220001-225000", businessFocus: "Europe's largest telecommunications company providing mobile, broadband, TV, and enterprise ICT solutions across 25 countries.", strategicDir: "Transforming into a digital telco with AI-powered network operations and enterprise cloud services.", revenue: "$120.5 Billion", netMargin: "5.8%", revenueGrowth: "5.4%", painPoints: [{ point: "Network AI and autonomous operations", severity: "High", desc: "AI-driven automation of network operations across complex multi-technology infrastructure." }, { point: "Enterprise cloud service competitive differentiation", severity: "High", desc: "Building differentiated cloud and AI services for enterprise customers." }], growthInitiatives: [{ initiative: "T-Systems AI and Cloud Platform", desc: "Enterprise AI and cloud services division focused on industrial clients." }, { initiative: "Network AI Operations Center", desc: "AI-powered autonomous network operations and predictive maintenance." }], investments: [{ initiative: "Technology and Digitalization Investment", desc: "Annual investment in network modernization and digital transformation.", amount: "$22B annual capex" }], vendors: [{ name: "Microsoft Azure", offering: "Strategic cloud partner for enterprise services." }, { name: "Amazon Web Services (AWS)", offering: "Cloud infrastructure and marketplace." }, { name: "Google Cloud", offering: "AI/ML services and cloud platform." }] },
  { name: "BMW Group", score: 3.6, criteria: [5,3,5,3,5,1], website: "https://www.bmwgroup.com", hq: "Germany", size: "150001-155000", businessFocus: "Premium automotive manufacturer producing BMW, MINI, and Rolls-Royce vehicles with major investment in electric and autonomous driving.", strategicDir: "Neue Klasse architecture for software-defined EVs with AI-powered manufacturing and customer experience.", revenue: "$155.2 Billion", netMargin: "4.1%", revenueGrowth: "2.1%", painPoints: [{ point: "Software-defined vehicle data platform scalability", severity: "High", desc: "Managing real-time telemetry from millions of connected vehicles for OTA updates." }, { point: "Manufacturing AI and quality analytics", severity: "High", desc: "Computer vision and predictive quality control across precision manufacturing." }], growthInitiatives: [{ initiative: "Neue Klasse Software-Defined Vehicle Platform", desc: "Next-gen EV architecture with advanced AI and connectivity features." }, { initiative: "Manufacturing Intelligence with Synaptix", desc: "AI-powered manufacturing analytics platform for global production facilities." }], investments: [{ initiative: "Electrification and Digital Transformation", desc: "Major investment in EV technology, software platforms, and manufacturing intelligence.", amount: "$6.3B annual R&D spend" }], vendors: [{ name: "Amazon Web Services (AWS)", offering: "Connected vehicle data cloud platform." }, { name: "Microsoft Azure", offering: "AI and IoT platform for manufacturing." }, { name: "Qualcomm", offering: "Snapdragon Ride platform for autonomous driving." }, { name: "NVIDIA", offering: "Drive platform for autonomous vehicle AI." }] },
  { name: "Wayfair LLC", score: 3.3, criteria: [5,3,5,3,5,1], website: "https://www.wayfair.com", hq: "USA", size: "10001-15000", businessFocus: "E-commerce company focused on home goods, furniture, decor, and housewares serving customers across North America and Europe.", strategicDir: "AI-powered commerce platform with visual search, personalization, and autonomous customer service.", revenue: "$12.0 Billion", netMargin: "-6.1%", revenueGrowth: "-1.8%", painPoints: [{ point: "High operational cost and scaling barriers for AI/ML", severity: "High", desc: "AI/ML infrastructure costs impact profitability as company works toward sustained profitability." }, { point: "Fragmented legacy systems and technical debt", severity: "High", desc: "Aging systems slow deployment of modern AI and commerce capabilities." }], growthInitiatives: [{ initiative: "AI-Powered Muse Visual Inspiration Engine", desc: "Visual AI platform for product discovery and room design inspiration." }, { initiative: "Agentic AI Commerce Platform", desc: "Autonomous AI agents for personalized shopping and customer service." }], investments: [{ initiative: "AI/ML Integration in Retail Operations", desc: "Comprehensive investment in AI for catalog, commerce, and customer experience.", amount: "Major tech investment" }], vendors: [{ name: "Google Cloud", offering: "Vertex AI and Gemini for catalog automation and search." }, { name: "Amazon Web Services (AWS)", offering: "Cloud infrastructure for e-commerce operations." }] },
  { name: "Levi Strauss & Co.", score: 3.3, criteria: [5,3,5,3,5,1], website: "https://www.levistrauss.com", hq: "USA", size: "15001-20000", businessFocus: "Produces and markets denim and casual apparel under Levi's, Dockers, and Beyond Yoga brands through wholesale, retail, and e-commerce channels globally.", strategicDir: "Enterprise agentic AI platform and supply chain optimization through major Microsoft and cloud partnerships.", revenue: "$6.2 Billion", netMargin: "4.0%", revenueGrowth: "-1.0%", painPoints: [{ point: "Fragmented data and lack of unified insights", severity: "High", desc: "Disparate data systems across global wholesale, retail, and e-commerce channels." }, { point: "Complex, costly global IT and AI infrastructure", severity: "High", desc: "Managing technology costs across global brand portfolio and distribution channels." }], growthInitiatives: [{ initiative: "Enterprise Agentic AI Platform (Microsoft Partnership)", desc: "AI-powered automation platform for business processes with Microsoft." }, { initiative: "AI-Driven E-Commerce Enhancement", desc: "Personalization and conversion optimization across direct digital channels." }], investments: [{ initiative: "Enterprise AI Platform and Digital Transformation", desc: "Comprehensive AI and digital investment program across all business functions.", amount: "Multi-year investment" }], vendors: [{ name: "Microsoft", offering: "Azure AI and Copilot for enterprise AI platform." }, { name: "Google Cloud", offering: "Cloud infrastructure and AI services." }, { name: "SAS", offering: "Advanced analytics and AI modeling platform." }] },
  { name: "Toyota Motor Corporation", score: 4.0, criteria: [5,3,5,3,5,3], website: "https://www.toyota-global.com", hq: "Japan", size: "360001-365000", businessFocus: "World's largest automaker by volume producing Toyota and Lexus vehicles with major investments in electrification, hydrogen, and autonomous driving.", strategicDir: "Multi-pathway electrification strategy alongside AI-powered manufacturing and connected vehicle platform.", revenue: "$308.5 Billion", netMargin: "8.2%", revenueGrowth: "6.3%", painPoints: [{ point: "Connected vehicle data platform at massive scale", severity: "High", desc: "Managing real-time telemetry from 10M+ connected vehicles globally." }, { point: "Supply chain resilience and visibility post-disruption", severity: "High", desc: "Building AI-powered supply chain intelligence after pandemic disruptions." }], growthInitiatives: [{ initiative: "Woven City: Connected Mobility Lab", desc: "Smart city testbed for autonomous and connected vehicle technologies." }, { initiative: "Arene SDK: Software-Defined Vehicle Platform", desc: "Open software platform for vehicle application development and AI integration." }], investments: [{ initiative: "Electrification and Digital Technology Investment", desc: "Major investment in BEV technology, fuel cells, and digital platforms.", amount: "$70B+ planned through 2030" }], vendors: [{ name: "Amazon Web Services (AWS)", offering: "Connected vehicle cloud platform (Toyota Connected)." }, { name: "Microsoft Azure", offering: "AI and cloud for manufacturing operations." }, { name: "NVIDIA", offering: "Drive platform for autonomous driving." }, { name: "Databricks", offering: "Analytics platform for vehicle and manufacturing data." }] },
];

// Fill remaining customers with abbreviated data for remaining 67
const EXTRA_CUSTOMERS: Customer[] = [
  { name: "NBCUniversal", score: 3.95, criteria: [5,3,5,3,5,3], website: "https://www.nbcuniversal.com", hq: "USA", size: "35001-40000", businessFocus: "Media and entertainment company with broadcast networks, Peacock streaming, film studios, and theme parks.", strategicDir: "Peacock streaming growth and AI-powered content production and advertising.", revenue: "$25.2 Billion", netMargin: "8.4%", revenueGrowth: "4.7%", painPoints: [{ point: "Streaming platform data analytics scale", severity: "High", desc: "Managing Peacock viewership analytics and recommendation data at scale." }], growthInitiatives: [{ initiative: "Peacock AI Personalization", desc: "ML-driven content recommendations for Peacock streaming platform." }], investments: [{ initiative: "Streaming Technology Investment", desc: "Platform and AI investment for Peacock competitive growth.", amount: "Billions annually" }], vendors: [{ name: "Amazon Web Services (AWS)", offering: "Cloud infrastructure for streaming." }, { name: "Snowflake", offering: "Data analytics platform." }] },
  { name: "Schneider Electric", score: 4.0, criteria: [3,5,5,3,5,3], website: "https://www.se.com", hq: "France", size: "135001-140000", businessFocus: "Global leader in energy management and automation providing hardware, software, and services for data centers, buildings, and industrial operations.", strategicDir: "EcoStruxure IoT platform and AI-powered energy management for digital and green transformation.", revenue: "$39.6 Billion", netMargin: "8.1%", revenueGrowth: "7.5%", painPoints: [{ point: "Industrial IoT data integration complexity", severity: "High", desc: "Connecting and harmonizing data from millions of industrial sensors and controllers." }], growthInitiatives: [{ initiative: "EcoStruxure AI Platform Expansion", desc: "AI-powered energy management and industrial automation platform." }], investments: [{ initiative: "Digital and AI Transformation", desc: "Software and AI platform investment for industrial applications.", amount: "$4B+ R&D annually" }], vendors: [{ name: "Microsoft Azure", offering: "Cloud and AI partnership for EcoStruxure." }, { name: "NVIDIA", offering: "GPU computing for industrial AI." }] },
  { name: "TELUS", score: 3.6, criteria: [5,3,5,3,5,1], website: "https://www.telus.com", hq: "Canada", size: "100001-105000", businessFocus: "Canadian telecommunications company providing wireless, internet, TV, and enterprise solutions with strong health and agriculture verticals.", strategicDir: "Leveraging connectivity assets for AI-powered health, agriculture, and enterprise solutions.", revenue: "$19.4 Billion", netMargin: "5.6%", revenueGrowth: "6.1%", painPoints: [{ point: "Network AI and automation across 5G and broadband", severity: "High", desc: "AI-driven optimization of 5G and broadband network operations." }], growthInitiatives: [{ initiative: "TELUS Health AI Platform", desc: "AI and data platform for digital health services." }], investments: [{ initiative: "Technology and Network Investment", desc: "Capital investment in network and digital platforms.", amount: "$3.5B annual capex" }], vendors: [{ name: "Amazon Web Services (AWS)", offering: "Cloud infrastructure." }, { name: "Google Cloud", offering: "AI and analytics services." }] },
  { name: "Singtel", score: 2.8, criteria: [5,1,5,1,5,1], website: "https://www.singtel.com", hq: "Singapore", size: "20001-22000", businessFocus: "Singapore's largest telecommunications company providing mobile, broadband, and enterprise services across Asia-Pacific.", strategicDir: "Digital telco transformation with AI and cloud services for enterprise customers in APAC.", revenue: "$12.1 Billion", netMargin: "7.3%", revenueGrowth: "3.8%", painPoints: [{ point: "Digital service revenue growth beyond connectivity", severity: "High", desc: "Building enterprise AI and cloud services to offset declining traditional revenues." }], growthInitiatives: [{ initiative: "Singtel AI Cloud for Enterprise", desc: "APAC-focused enterprise AI and cloud services platform." }], investments: [{ initiative: "Digital and AI Investment Program", desc: "Investment in digital services and AI capabilities.", amount: "Part of capex program" }], vendors: [{ name: "Amazon Web Services (AWS)", offering: "Cloud platform partner." }, { name: "Google Cloud", offering: "AI services partner." }] },
  { name: "SK Telecom", score: 2.8, criteria: [5,1,5,1,5,1], website: "https://www.sktelecom.com", hq: "South Korea", size: "25001-27000", businessFocus: "South Korea's largest mobile operator pioneering AI-native network operations and generative AI services.", strategicDir: "AI transformation across network operations, enterprise services, and consumer AI products.", revenue: "$18.9 Billion", netMargin: "8.5%", revenueGrowth: "2.3%", painPoints: [{ point: "AI-native network operations at scale", severity: "High", desc: "Building truly autonomous network with AI at every layer of operations." }], growthInitiatives: [{ initiative: "AICT Company Transformation", desc: "AI and ICT convergence strategy creating new enterprise revenue streams." }], investments: [{ initiative: "AI and Digital Transformation", desc: "Major investment in AI infrastructure and services.", amount: "KRW 2.5T+ planned" }], vendors: [{ name: "Amazon Web Services (AWS)", offering: "Cloud partner for AI workloads." }, { name: "NVIDIA", offering: "GPU infrastructure for AI." }] },
  { name: "Telefónica", score: 3.5, criteria: [5,3,5,1,5,3], website: "https://www.telefonica.com", hq: "Spain", size: "95001-100000", businessFocus: "Major European and Latin American telecommunications group operating in 14 countries with strong enterprise ICT services.", strategicDir: "AI-powered network and service transformation with Telefónica Tech driving enterprise AI and cloud.", revenue: "$44.1 Billion", netMargin: "3.2%", revenueGrowth: "1.8%", painPoints: [{ point: "Network AI and operational efficiency", severity: "High", desc: "AI-driven automation to reduce operational costs across complex multi-country network." }], growthInitiatives: [{ initiative: "Telefónica Tech AI and Cloud Services", desc: "Enterprise AI, cloud, and cybersecurity services division." }], investments: [{ initiative: "Network and Digital Transformation Capex", desc: "Investment in fiber, 5G, and digital platforms.", amount: "$9.8B annual capex" }], vendors: [{ name: "Microsoft Azure", offering: "Strategic cloud and AI partner." }, { name: "Amazon Web Services (AWS)", offering: "Cloud infrastructure." }, { name: "Google Cloud", offering: "AI services." }] },
  { name: "Porto Seguro", score: 3.6, criteria: [5,3,5,3,5,1], website: "https://www.portoseguro.com.br", hq: "Brazil", size: "15001-18000", businessFocus: "Brazil's second-largest insurance group offering auto, home, health, and financial protection products through digital and traditional channels.", strategicDir: "Digital insurance transformation with AI-powered underwriting, claims, and customer experience.", revenue: "$8.3 Billion", netMargin: "7.4%", revenueGrowth: "12.8%", painPoints: [{ point: "AI-powered fraud detection and claims management", severity: "High", desc: "Automating fraud detection and claims processing across millions of policies." }], growthInitiatives: [{ initiative: "Digital Insurance Platform Modernization", desc: "Cloud-native insurance platform with AI across the policy lifecycle." }], investments: [{ initiative: "Digital Transformation Program", desc: "Investment in cloud, AI, and digital channels.", amount: "Major ongoing investment" }], vendors: [{ name: "Amazon Web Services (AWS)", offering: "Cloud infrastructure for insurance operations." }, { name: "Google Cloud", offering: "AI/ML platform." }] },
  { name: "Mengniu Dairy", score: 3.4, criteria: [5,3,5,1,5,1], website: "https://www.mengniu.com.cn", hq: "China", size: "45001-50000", businessFocus: "China's second-largest dairy company producing fresh milk, yogurt, ice cream, and infant formula with expanding international presence.", strategicDir: "Smart dairy transformation with AI-powered supply chain, quality control, and consumer personalization.", revenue: "$16.9 Billion", netMargin: "2.9%", revenueGrowth: "3.2%", painPoints: [{ point: "Supply chain quality traceability", severity: "High", desc: "End-to-end tracking of dairy supply from farm to shelf for quality assurance." }], growthInitiatives: [{ initiative: "Smart Factory and AI Quality Control", desc: "AI-powered computer vision for dairy quality inspection and production optimization." }], investments: [{ initiative: "Digital and Smart Manufacturing", desc: "Investment in smart factory and supply chain digitalization.", amount: "Part of $16.9B operations" }], vendors: [{ name: "Alibaba Cloud", offering: "Cloud infrastructure and AI services in China." }, { name: "Huawei", offering: "Industrial IoT and cloud platform." }] },
  { name: "ENGIE", score: 3.2, criteria: [3,3,5,1,5,3], website: "https://www.engie.com", hq: "France", size: "165001-170000", businessFocus: "Global energy company operating renewable energy, power generation, and energy services in 70+ countries with sustainability focus.", strategicDir: "Accelerating renewable energy transition with AI-powered grid and energy management.", revenue: "$93.9 Billion", netMargin: "2.1%", revenueGrowth: "-4.2%", painPoints: [{ point: "Renewable energy grid integration complexity", severity: "High", desc: "Managing variability of wind and solar across complex multi-country grids." }], growthInitiatives: [{ initiative: "AI-Powered Energy Management Platform", desc: "Digital platform for AI-optimized energy trading, forecasting, and grid management." }], investments: [{ initiative: "Green and Digital Transformation", desc: "Investment in renewables and digital capabilities.", amount: "$12B annual capex" }], vendors: [{ name: "Microsoft Azure", offering: "Cloud and AI for energy operations." }, { name: "Amazon Web Services (AWS)", offering: "Cloud infrastructure." }] },
  { name: "Iberdrola", score: 3.2, criteria: [3,3,5,1,5,3], website: "https://www.iberdrola.com", hq: "Spain", size: "40001-42000", businessFocus: "Global energy leader in renewable generation, power grids, and customer solutions operating in 40+ countries.", strategicDir: "Digital utility transformation with AI grid management and smart energy services.", revenue: "$41.5 Billion", netMargin: "10.2%", revenueGrowth: "5.3%", painPoints: [{ point: "Smart grid AI and predictive outage management", severity: "High", desc: "AI-powered grid management for complex multi-country transmission networks." }], growthInitiatives: [{ initiative: "Digital Grid AI Program", desc: "AI platform for grid optimization, predictive maintenance, and energy trading." }], investments: [{ initiative: "Grid and Digital Transformation", desc: "Investment in smart grid infrastructure and AI capabilities.", amount: "$12B+ annual capex" }], vendors: [{ name: "Microsoft Azure", offering: "AI and cloud for grid operations." }, { name: "IBM", offering: "Grid management analytics." }] },
  { name: "SoftBank Corp.", score: 3.2, criteria: [5,1,5,3,5,1], website: "https://www.softbank.jp", hq: "Japan", size: "40001-45000", businessFocus: "Japan's third-largest mobile carrier evolving into an AI company with major technology investment portfolio globally.", strategicDir: "AI-first transformation led by Masayoshi Son with Vision Fund AI investments and SoftBank AI Lab.", revenue: "$43.7 Billion", netMargin: "4.2%", revenueGrowth: "2.8%", painPoints: [{ point: "AI platform development for enterprise customers", severity: "High", desc: "Building competitive AI services for enterprise customers in Japan." }], growthInitiatives: [{ initiative: "SoftBank AI Lab and AGI Research", desc: "Frontier AI research initiative with major computational investment." }], investments: [{ initiative: "AI Infrastructure and Vision Fund", desc: "Massive AI infrastructure and startup investment program.", amount: "$100B+ Vision Fund" }], vendors: [{ name: "NVIDIA", offering: "GPU infrastructure for AI." }, { name: "Amazon Web Services (AWS)", offering: "Cloud platform." }] },
  { name: "Grupo Globo S.A.", score: 3.6, criteria: [5,3,5,3,5,1], website: "https://www.globo.com", hq: "Brazil", size: "15001-20000", businessFocus: "Brazil's largest media conglomerate with TV networks, streaming (Globoplay), news, and digital media properties.", strategicDir: "Digital media transformation and Globoplay streaming growth with AI content and personalization.", revenue: "$5.2 Billion", netMargin: "9.1%", revenueGrowth: "8.4%", painPoints: [{ point: "Streaming platform data infrastructure", severity: "High", desc: "Building Globoplay analytics and personalization at scale in Brazil." }], growthInitiatives: [{ initiative: "Globoplay AI Personalization", desc: "AI recommendation engine for Brazil's largest streaming platform." }], investments: [{ initiative: "Digital Transformation and Streaming", desc: "Investment in Globoplay technology and content.", amount: "Part of operations" }], vendors: [{ name: "Google Cloud", offering: "Cloud and AI for media operations." }, { name: "Amazon Web Services (AWS)", offering: "Cloud infrastructure." }] },
];

const ALL_CUSTOMERS = [...RAW_DATA, ...EXTRA_CUSTOMERS];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const CRITERIA_LABELS = ["Industry Alignment", "Growth", "Tech/Solution Gaps", "Strategic Initiatives", "Geo Reach", "Investment Capacity"];
const CRITERIA_WEIGHTS = ["20%", "20%", "20%", "15%", "10%", "15%"];
const SCORE_COLORS = { high: "#1EDD7D", medium: "#f59e0b", low: "#ef4444" };

function getScoreTier(score: number): "High" | "Medium" | "Low" {
  if (score >= 4.0) return "High";
  if (score >= 2.5) return "Medium";
  return "Low";
}
function getScoreBg(score: number) {
  const tier = getScoreTier(score);
  if (tier === "High") return "bg-[#edfdf5] text-[#15b865] border-[#a7f3d0]";
  if (tier === "Medium") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-red-50 text-red-600 border-red-200";
}
function getSevBg(sev: string) {
  if (sev === "High") return "bg-red-50 text-red-600 border border-red-200";
  if (sev === "Moderate") return "bg-amber-50 text-amber-700 border border-amber-200";
  return "bg-slate-100 text-slate-500";
}

const PIE_COLORS = ["#1EDD7D", "#0f2644", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"];
const HQ_DIST = [
  { name: "USA", value: 47 }, { name: "Canada", value: 5 }, { name: "Brazil", value: 4 },
  { name: "France", value: 4 }, { name: "India", value: 4 }, { name: "UK", value: 3 },
  { name: "Japan", value: 3 }, { name: "Spain", value: 3 }, { name: "Other", value: 18 },
];
const VENDOR_DIST = [
  { vendor: "AWS", count: 30 }, { vendor: "Google Cloud", count: 17 }, { vendor: "NVIDIA", count: 16 },
  { vendor: "Microsoft", count: 18 }, { vendor: "Databricks", count: 8 }, { vendor: "Snowflake", count: 7 },
  { vendor: "OpenAI", count: 7 }, { vendor: "IBM", count: 5 },
];

// ─────────────────────────────────────────────
// SIDEBAR & NAV CONFIG
// ─────────────────────────────────────────────
const SIDEBAR_ITEMS = [
  { label: "Overview",              icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { label: "Potential Customer Scan", icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg> },
  { label: "Customer Profiles",     icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> },
  { label: "Excluded Companies",    icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> },
  { label: "Evaluation",            icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { label: "Dossier Profiles",      icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  { label: "Insights",              icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
];
const NAV_TABS = [
  { id: "overview"  as Page, label: "Overview",               icon: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { id: "scan"      as Page, label: "Potential Customer Scan", icon: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg> },
  { id: "eval"      as Page, label: "Evaluation",              icon: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { id: "dossier"   as Page, label: "Dossier Profiles",        icon: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  { id: "insights"  as Page, label: "Insights",                icon: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
];
// ─────────────────────────────────────────────
// RANKED LOGO ROW — circular Clearbit logo + name row
// ─────────────────────────────────────────────
function RankedLogoRow({ rank, name, domain, brandColor, initials, sub, score, tier, highlight }: {
  rank: number; name: string; domain: string; brandColor: string; initials: string;
  sub: string; score: number; tier: string; highlight?: boolean;
}) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className={`flex items-center gap-3 py-2.5 px-2 rounded-xl transition-colors ${highlight ? "bg-[#edfdf5] border border-[#a7f3d0]" : "hover:bg-slate-50 border border-transparent"}`}>
      {/* Rank number */}
      <span className="text-[11px] text-slate-300 font-semibold w-5 flex-shrink-0 text-right">{rank}</span>

      {/* Logo — rounded square white box, Clearbit fetched live from internet */}
      <div className="w-9 h-9 rounded-lg flex-shrink-0 border border-slate-200 bg-white shadow-sm flex items-center justify-center overflow-hidden" style={{ minWidth: 36 }}>
        {!imgErr ? (
          <img
            src={`https://logo.clearbit.com/${domain}`}
            alt={name}
            width={28}
            height={28}
            style={{ objectFit: "contain", width: 28, height: 28 }}
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full rounded-lg flex items-center justify-center text-white text-[10px] font-black"
            style={{ backgroundColor: brandColor }}>
            {initials}
          </div>
        )}
      </div>

      {/* Name + sub */}
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-bold text-[#0f2644] truncate">{name}</div>
        <div className="text-[10px] text-slate-400 truncate">{sub}</div>
      </div>

      {/* Score */}
      <div className="flex flex-col items-end flex-shrink-0">
        <span className="text-[13px] font-black text-[#15b865]">{score.toFixed(1)}</span>
        <span className="text-[9px] text-slate-400">{tier}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// POTENTIAL CUSTOMER SCAN PAGE
// Product Analysis + Market Analysis with Core / Adjacent / Emerging clusters
// ─────────────────────────────────────────────

interface MarketCompanyDetail {
  name: string;
  location: string;
  website: string;
  score: number;
  logoColor: string;
  logoInitials: string;
  description: string;
  sources: { label: string; url: string }[];
}

interface MarketCluster {
  name: string;
  avgScore: number;
  reasoning: string;
  marketSummary: string;
  companies: string[];
  companyCount: number;
  companyDetails: MarketCompanyDetail[];
}

const CORE_MARKETS: MarketCluster[] = [
  {
    name: "Financial Services",
    avgScore: 9.0,
    reasoning: "Banks, insurers and exchanges must develop, govern and deploy fraud-detection, risk and regulatory models rapidly while maintaining strict compliance. Firms such as Nasdaq and American Express publicly use managed AI platforms, showing high, current demand for secure, unified PaaS ML solutions.",
    marketSummary: "Financial institutions are large-scale data consumers managing real-time transaction streams, regulatory reporting, and fraud analytics. They require robust, secure, unified AI/ML platform solutions to drive automation, optimize risk models, and accelerate enterprise AI adoption, benefiting from pooled compute, elasticity, and turnkey deployment.",
    companies: ["JPMorgan Chase & Co.", "HSBC Holdings plc", "Goldman Sachs Group, Inc."],
    companyCount: 6,
    companyDetails: [
      { name: "JPMorgan Chase & Co.", location: "USA", website: "https://www.jpmorganchase.com", score: 5.0, logoColor: "#003087", logoInitials: "JP", description: "JPMorgan Chase demonstrates explicit, current adoption of pooled GPU compute, no-code AI tools, elastic scaling, and modular orchestration for AI/ML via OmniAI and LLM Suite platforms, with $2B dedicated AI budget annually.", sources: [{ label: "Link 1", url: "https://www.jpmorganchase.com/technology" }, { label: "Link 2", url: "https://www.databricks.com/customers" }] },
      { name: "HSBC Holdings plc", location: "UK", website: "https://www.hsbc.com", score: 4.7, logoColor: "#DB0011", logoInitials: "HS", description: "HSBC is actively modernizing its global data infrastructure and AI/ML workflows, deploying cloud-native analytics platforms with enterprise-grade security and compliance across 60+ countries.", sources: [{ label: "Link 1", url: "https://www.hsbc.com/news-and-media/media-releases" }] },
      { name: "Goldman Sachs Group, Inc.", location: "USA", website: "https://www.goldmansachs.com", score: 3.9, logoColor: "#1A1A1A", logoInitials: "GS", description: "Goldman Sachs leverages AI/ML for trading algorithms and risk modeling, with dedicated data engineering teams requiring scalable GPU compute and unified ML deployment platforms.", sources: [{ label: "Link 1", url: "https://www.goldmansachs.com/intelligence/pages/the-economics-of-artificial-intelligence.html" }] },
    ],
  },
  {
    name: "Retail & eCommerce",
    avgScore: 8.8,
    reasoning: "Retailers run recommendation, demand-forecasting and supply-chain models that change hour-by-hour; they therefore prize on-demand GPUs, instant scaling and unified ML workflows. Multiple large chains already use Databricks, SageMaker and Vertex AI, proving the pain is urgent and solutions are being adopted.",
    marketSummary: "Retailers deploy massive personalization, inventory, and logistics AI models requiring elastic compute and unified workflows. They need rapid deployment without deep data-science overhead, benefiting from no-code tools and turnkey ML infrastructure.",
    companies: ["Warby Parker, Inc.", "Wayfair LLC", "Levi Strauss & Co.", "Skechers USA, Inc.", "Nubank S.A."],
    companyCount: 5,
    companyDetails: [
      { name: "Warby Parker, Inc.", location: "USA", website: "https://www.warbyparker.com", score: 4.1, logoColor: "#1A73E8", logoInitials: "WP", description: "Warby Parker is scaling AI-powered digital tools including AR Virtual Try-On and personalized Advisor platform, with a $75M Google partnership for AI smart glasses development requiring unified ML infrastructure.", sources: [{ label: "Link 1", url: "https://www.warbyparker.com/technology" }, { label: "Link 2", url: "https://investors.warbyparker.com" }] },
      { name: "Wayfair LLC", location: "USA", website: "https://www.wayfair.com", score: 3.3, logoColor: "#7B2D8B", logoInitials: "WF", description: "Wayfair's AI-powered Muse visual inspiration engine and agentic commerce platform require scalable GPU compute for computer vision and NLP workloads across 30M+ product catalog items.", sources: [{ label: "Link 1", url: "https://www.aboutwayfair.com/careers/tech-blog" }] },
      { name: "Levi Strauss & Co.", location: "USA", website: "https://www.levistrauss.com", score: 3.3, logoColor: "#C41E3A", logoInitials: "LS", description: "Levi's enterprise agentic AI platform partnership with Microsoft targets supply chain AI, e-commerce personalization, and business process automation across global wholesale and retail channels.", sources: [{ label: "Link 1", url: "https://www.levistrauss.com/news" }] },
    ],
  },
  {
    name: "Healthcare & Life Sciences",
    avgScore: 8.5,
    reasoning: "Drug-discovery, genomics and clinical-decision companies need massive, bundlable GPU compute and simplified pipelines for sensitive data. Regeneron and HCA Healthcare have adopted Databricks and Vertex AI, evidencing active uptake of all-in-one AI/ML platforms with enterprise-grade security.",
    marketSummary: "Healthcare organizations manage sensitive patient data, genomics, and clinical trial pipelines requiring HIPAA-compliant, secure AI/ML infrastructure. Unified platforms reduce deployment friction while enabling rapid scaling of diagnostic and drug discovery models.",
    companies: ["Mayo Clinic", "Cleveland Clinic", "Takeda Pharmaceutical Company Limited", "IQVIA"],
    companyCount: 7,
    companyDetails: [
      { name: "Mayo Clinic", location: "USA", website: "https://www.mayoclinic.org", score: 3.7, logoColor: "#005EB8", logoInitials: "MC", description: "Mayo Clinic Platform commercializes AI-powered clinical insights and digital health tools, requiring scalable GPU compute for genomics and medical imaging AI across 1.3M annual patients.", sources: [{ label: "Link 1", url: "https://www.mayoclinic.org/about-mayo-clinic/mayo-clinic-platform" }, { label: "Link 2", url: "https://www.google.com/health" }] },
      { name: "Cleveland Clinic", location: "USA", website: "https://www.clevelandclinic.org", score: 4.1, logoColor: "#00B5E2", logoInitials: "CC", description: "Cleveland Clinic's IBM Quantum partnership and AI in Radiology programs require unified GPU compute for medical imaging, genomics, and precision medicine across 280+ global locations.", sources: [{ label: "Link 1", url: "https://my.clevelandclinic.org/about/innovations" }] },
      { name: "IQVIA", location: "USA", website: "https://www.iqvia.com", score: 4.4, logoColor: "#E31837", logoInitials: "IQ", description: "IQVIA's OCE AI platform and real-world evidence analytics require HIPAA-compliant, scalable ML infrastructure to harmonize structured and unstructured clinical, claims, and patient data at global scale.", sources: [{ label: "Link 1", url: "https://www.iqvia.com/solutions/technologies" }, { label: "Link 2", url: "https://www.databricks.com/customers/iqvia" }] },
    ],
  },
  {
    name: "Media & Entertainment",
    avgScore: 8.5,
    reasoning: "Studios and streamers require scalable GPU power for personalisation, content tagging and generative media tasks. Warner Bros, Discovery and Netflix have migrated these workloads to managed AI platforms, demonstrating market readiness for accessible, end-to-end AI development environments.",
    marketSummary: "Media companies leverage AI for content recommendation, automated tagging, VFX, and audience analytics. They need elastic GPU pools for bursty generative AI workloads and unified pipelines from data ingestion to model deployment at global streaming scale.",
    companies: ["The Walt Disney Company", "Netflix", "Paramount Global", "NBCUniversal"],
    companyCount: 6,
    companyDetails: [
      { name: "The Walt Disney Company", location: "USA", website: "https://www.thewaltdisneycompany.com", score: 4.1, logoColor: "#000099", logoInitials: "WD", description: "Disney+ requires next-generation AI recommendation systems across 150M+ subscribers and generative AI tools for VFX production, demanding scalable GPU compute and unified ML pipelines.", sources: [{ label: "Link 1", url: "https://thewaltdisneycompany.com/disneyplus" }, { label: "Link 2", url: "https://www.snowflake.com/customers/disney" }] },
      { name: "Netflix", location: "USA", website: "https://www.netflix.com", score: 4.7, logoColor: "#E50914", logoInitials: "NF", description: "Netflix deploys Databricks for unified analytics underpinning recommendation systems, live sports streaming infrastructure, and A/B testing across 260M+ global subscribers.", sources: [{ label: "Link 1", url: "https://netflixtechblog.com" }, { label: "Link 2", url: "https://www.databricks.com/customers/netflix" }] },
      { name: "NBCUniversal", location: "USA", website: "https://www.nbcuniversal.com", score: 3.95, logoColor: "#FF6600", logoInitials: "NC", description: "Peacock streaming growth demands AI personalization infrastructure and advertising analytics at scale, requiring elastic GPU compute for real-time recommendation and content intelligence workloads.", sources: [{ label: "Link 1", url: "https://www.peacocktv.com/about" }] },
    ],
  },
  {
    name: "Industrial Manufacturing",
    avgScore: 4.9,
    reasoning: "Manufacturers deploy predictive-maintenance and quality-inspection models on large IoT streams; elastic GPU pools and no-code tools lessen data-science skill gaps on factory floors. Shell and Renault publicly leverage Databricks/Vertex AI, confirming urgent, recognised need for unified ML PaaS.",
    marketSummary: "Industrial manufacturers need AI/ML for predictive maintenance, quality control vision, and supply chain optimization across global factory networks. Elastic GPU access and no-code deployment tools reduce dependency on scarce data science talent on the shop floor.",
    companies: ["Renault Group", "AstraZeneca", "Midea Group"],
    companyCount: 5,
    companyDetails: [
      { name: "Renault Group", location: "France", website: "https://www.renaultgroup.com", score: 4.1, logoColor: "#FFCC00", logoInitials: "RN", description: "Renault's Ampere software-defined vehicle spinoff requires cloud-native data architecture for petabyte-scale connected vehicle telemetry and AI-powered manufacturing optimization across 40+ global plants.", sources: [{ label: "Link 1", url: "https://www.renaultgroup.com/en/news-on-air/news/ampere/" }, { label: "Link 2", url: "https://cloud.google.com/customers/renault" }] },
      { name: "Midea Group", location: "China", website: "https://www.midea.com", score: 4.4, logoColor: "#E30E0E", logoInitials: "MD", description: "Midea's smart factory AI initiative connects IoT sensors across 200+ factories and 400M+ smart home devices, requiring unified ML platforms for quality control, supply chain optimization and product personalization.", sources: [{ label: "Link 1", url: "https://www.midea.com/en/innovation" }] },
      { name: "AstraZeneca", location: "UK", website: "https://www.astrazeneca.com", score: 3.7, logoColor: "#830051", logoInitials: "AZ", description: "AstraZeneca's AI drug discovery platform requires GPU-intensive computational biology workflows spanning genomics, proteomics, and clinical trial data management across hundreds of concurrent global trials.", sources: [{ label: "Link 1", url: "https://www.astrazeneca.com/r-d/data-science-and-ai.html" }, { label: "Link 2", url: "https://azure.microsoft.com/en-us/blog/astrazeneca" }] },
    ],
  },
];

const ADJACENT_MARKETS: MarketCluster[] = [
  {
    name: "Higher Education & Research",
    avgScore: 9.2,
    reasoning: "Academic institutions and labs require massive, on-demand GPU power for scientific computing and research but often lack dedicated infrastructure teams. The platform provides a pay-as-you-go, no-setup environment, enabling researchers to run complex simulations and train large models without managing hardware.",
    marketSummary: "Universities and research labs need on-demand, elastic GPU compute for frontier AI, genomics, and physics simulations without dedicated infrastructure teams. Pay-as-you-go platforms with no-setup environments directly address the research computing bottleneck and budget constraints.",
    companies: ["Stanford University", "Georgia Institute of Technology (Georgia Tech)", "National University of Singapore", "Carnegie Mellon University"],
    companyCount: 10,
    companyDetails: [
      { name: "Stanford University", location: "USA", website: "https://www.stanford.edu", score: 4.3, logoColor: "#8C1515", logoInitials: "SU", description: "Stanford HAI and School of Engineering require elastic GPU compute for large language model research, multi-modal AI, and biomedical data science across 50+ research groups conducting frontier AI work.", sources: [{ label: "Link 1", url: "https://hai.stanford.edu" }, { label: "Link 2", url: "https://cloud.google.com/edu/researchers" }] },
      { name: "Georgia Institute of Technology", location: "USA", website: "https://www.gatech.edu", score: 4.0, logoColor: "#B3A369", logoInitials: "GT", description: "Georgia Tech's AI research programs and MATRIX AI Consortium require scalable compute infrastructure for robotics, NLP, and applied ML research spanning industry partnership projects.", sources: [{ label: "Link 1", url: "https://www.gatech.edu/research/ai" }, { label: "Link 2", url: "https://matrix.gatech.edu" }] },
      { name: "National University of Singapore", location: "Singapore", website: "https://www.nus.edu.sg", score: 3.3, logoColor: "#003D7C", logoInitials: "NS", description: "NUS leads AI research across healthcare, finance, and smart city domains, requiring scalable compute for multi-disciplinary AI projects and government-funded national AI initiatives in Singapore.", sources: [{ label: "Link 1", url: "https://www.nus.edu.sg/about/research" }] },
    ],
  },
  {
    name: "Government & Public Sector",
    avgScore: 9.0,
    reasoning: "Agencies manage large-scale datasets for urban planning, resource allocation, and fraud detection. The platform's enterprise-grade security, compliance, and no-code features enable civil servants to build and deploy AI applications securely, improving public services without extensive technical overhead.",
    marketSummary: "Government agencies require secure, compliant AI/ML platforms for citizen services, fraud detection, and public safety analytics. FedRAMP-compliant infrastructure and no-code tools are critical for democratizing AI adoption across agencies with limited technical capacity.",
    companies: ["U.S. Department of Homeland Security (DHS)", "City of Los Angeles (SmartLA 2028 Initiative)", "Swiss Public Sector"],
    companyCount: 6,
    companyDetails: [
      { name: "U.S. Department of Homeland Security (DHS)", location: "USA", website: "https://www.dhs.gov", score: 2.75, logoColor: "#002868", logoInitials: "DH", description: "DHS requires FedRAMP-authorized AI platforms for border security analytics, fraud detection, and cybersecurity threat modeling across massive government datasets with strict compliance requirements.", sources: [{ label: "Link 1", url: "https://www.dhs.gov/artificial-intelligence" }] },
      { name: "City of Los Angeles (SmartLA 2028)", location: "USA", website: "https://smartla.org", score: 2.95, logoColor: "#003DA5", logoInitials: "LA", description: "SmartLA 2028 initiative leverages AI for traffic optimization, public safety, and service delivery ahead of the 2028 Olympics, requiring scalable ML infrastructure for real-time urban data analytics.", sources: [{ label: "Link 1", url: "https://smartla.lacity.org" }] },
      { name: "Swiss Public Sector (ETH Zurich, EPFL)", location: "Switzerland", website: "https://www.admin.ch", score: 2.95, logoColor: "#FF0000", logoInitials: "CH", description: "Switzerland's national data science strategy and supercomputing centers (CSCS) at ETH Zurich and EPFL require scalable GPU infrastructure for national AI research and government analytics programs.", sources: [{ label: "Link 1", url: "https://www.cscs.ch" }, { label: "Link 2", url: "https://www.epfl.ch/research/domains/ai" }] },
    ],
  },
  {
    name: "Energy & Utilities",
    avgScore: 9.1,
    reasoning: "Energy firms analyze massive IoT sensor data from grids, pipelines, and turbines for predictive maintenance and demand forecasting. The platform's elastic GPU compute and unified workflows enable rapid model deployment to optimise energy distribution and prevent outages, without requiring deep MLOps expertise.",
    marketSummary: "Energy and utility companies deploy ML models for grid optimization, renewable generation forecasting, and predictive asset maintenance. Real-time IoT sensor analytics and elastic compute are critical for managing distributed energy assets and preventing costly outages.",
    companies: ["Schneider Electric", "ENGIE", "Iberdrola", "NextEra Energy"],
    companyCount: 5,
    companyDetails: [
      { name: "Schneider Electric", location: "France", website: "https://www.se.com", score: 4.0, logoColor: "#3DCD58", logoInitials: "SE", description: "Schneider's EcoStruxure AI platform connects millions of industrial IoT sensors for energy management and automation, requiring scalable ML infrastructure to analyze petabyte-scale operational data.", sources: [{ label: "Link 1", url: "https://www.se.com/ww/en/work/solutions/ecosystem/EcoStruxure" }, { label: "Link 2", url: "https://azure.microsoft.com/en-us/customers/schneider-electric" }] },
      { name: "NextEra Energy", location: "USA", website: "https://www.nexteraenergy.com", score: 4.3, logoColor: "#00A9E0", logoInitials: "NE", description: "NextEra manages 6,000+ MW of battery storage and vast solar/wind assets requiring AI-powered dispatch optimization, weather forecasting models, and predictive maintenance for turbine fleets.", sources: [{ label: "Link 1", url: "https://www.nexteraenergy.com/innovation" }, { label: "Link 2", url: "https://cloud.google.com/customers/nextera" }] },
      { name: "ENGIE", location: "France", website: "https://www.engie.com", score: 3.2, logoColor: "#00AAFF", logoInitials: "EN", description: "ENGIE's digital energy management platform requires ML models for renewable generation forecasting, grid balancing, and carbon accounting across operations in 70+ countries.", sources: [{ label: "Link 1", url: "https://www.engie.com/en/innovation-transition-energetique/innovation-research" }] },
    ],
  },
  {
    name: "Logistics & Transportation",
    avgScore: 9.0,
    reasoning: "This industry relies on optimizing complex, dynamic systems like route planning, fleet management, and warehouse automation. The platform's ability to rapidly build, deploy, and scale ML models on real-time data streams allows companies to reduce fuel costs, improve delivery times, and forecast capacity demand.",
    marketSummary: "Logistics companies deploy real-time ML for route optimization, demand forecasting, and warehouse robotics orchestration. Elastic GPU infrastructure enables rapid model iteration as supply chain conditions change, reducing fuel costs and improving delivery performance.",
    companies: ["MGN Logistics", "MD Logistics", "Best Home Furnishings", "Crane Worldwide Logistics"],
    companyCount: 4,
    companyDetails: [
      { name: "MGN Logistics", location: "USA", website: "https://www.mgnlogistics.com", score: 1.65, logoColor: "#FF6B00", logoInitials: "MG", description: "MGN Logistics focuses on supply chain optimization requiring ML models for route planning, carrier selection, and freight analytics to improve delivery performance and reduce operational costs.", sources: [{ label: "Link 1", url: "https://www.mgnlogistics.com" }] },
      { name: "MD Logistics", location: "USA", website: "https://www.mdlogistics.com", score: 2.75, logoColor: "#004B8D", logoInitials: "ML", description: "MD Logistics manages complex pharmaceutical and healthcare supply chains requiring precise ML-driven demand forecasting and cold chain optimization across temperature-sensitive distribution networks.", sources: [{ label: "Link 1", url: "https://www.mdlogistics.com/solutions" }] },
      { name: "Crane Worldwide Logistics", location: "USA", website: "https://www.craneww.com", score: 2.55, logoColor: "#E31837", logoInitials: "CW", description: "Crane Worldwide deploys freight intelligence tools for international logistics optimization, requiring scalable analytics infrastructure for customs compliance and multi-modal transportation planning.", sources: [{ label: "Link 1", url: "https://www.craneww.com/technology" }] },
    ],
  },
  {
    name: "Agriculture Technology (AgriTech)",
    avgScore: 8.9,
    reasoning: "Agri-tech companies process vast amounts of drone, satellite, and sensor data to model crop yields, detect disease, and optimise resource use. The platform's no-code tools and scalable compute empower agronomists and domain experts to build and deploy computer vision and predictive models directly.",
    marketSummary: "AgriTech companies need GPU-accelerated computer vision and satellite imagery analytics for precision agriculture. No-code ML deployment enables agronomists to build crop yield and disease models without deep data science expertise, maximizing sustainable farming outcomes.",
    companies: ["CarbonFarm", "Tomorrow.io", "Farmonaut", "RegenCrops"],
    companyCount: 4,
    companyDetails: [
      { name: "CarbonFarm", location: "USA", website: "https://www.carbonfarm.us", score: 2.15, logoColor: "#2D7D32", logoInitials: "CF", description: "CarbonFarm uses satellite and sensor data to quantify carbon sequestration and optimize regenerative farming practices, requiring scalable ML infrastructure for geospatial data processing.", sources: [{ label: "Link 1", url: "https://www.carbonfarm.us" }] },
      { name: "Tomorrow.io", location: "USA", website: "https://www.tomorrow.io", score: 2.55, logoColor: "#1976D2", logoInitials: "TM", description: "Tomorrow.io's weather intelligence platform processes massive atmospheric sensor and satellite data requiring elastic GPU compute for hyperlocal weather forecasting ML models serving agriculture and logistics.", sources: [{ label: "Link 1", url: "https://www.tomorrow.io/weather-api" }] },
      { name: "Farmonaut", location: "India", website: "https://www.farmonaut.com", score: 2.3, logoColor: "#388E3C", logoInitials: "FM", description: "Farmonaut delivers satellite-based precision agriculture analytics to smallholder farmers, using ML models for crop health monitoring, yield prediction, and irrigation optimization.", sources: [{ label: "Link 1", url: "https://www.farmonaut.com/about" }] },
    ],
  },
];

const EMERGING_MARKETS: MarketCluster[] = [
  {
    name: "Telecom Operators",
    avgScore: 9.6,
    reasoning: "Carriers experiment with AI PaaS to optimize 5G networks and customer analytics (AT&T, Azure, Verizon pilots); elastic GPUs handle bursty traffic models while no-code interfaces let network engineers build ML without deep data-science teams, indicating emerging demand.",
    marketSummary: "Telecom operators are large-scale communications providers managing extensive networks, mobile and fixed-line services, and high-growth 5G/edge deployments. They require robust, secure, unified AI/ML platform solutions to drive automation, optimise network operations, launch new digital services, and accelerate enterprise AI adoption, benefiting from pooled compute, elasticity, and turnkey deployment.",
    companies: ["Singtel", "Deutsche Telekom", "TELUS", "Telefónica", "SK Telecom", "SoftBank Corp.", "e& (formerly Etisalat Group)"],
    companyCount: 7,
    companyDetails: [
      { name: "Singtel", location: "Singapore", website: "https://www.singtel.com", score: 2.8, logoColor: "#E30613", logoInitials: "SG", description: "Singtel demonstrates explicit, current adoption of pooled GPU compute (GPU-aaS), no-code AI tools, elastic scaling, and modular orchestration for AI/ML validated by NVIDIA partnerships and enterprise service launches. Partnerships with Nscale and Bridge Alliance show commitment to global, user-friendly, and cost-efficient AI platforms. Need is highly explicit and evidenced.", sources: [{ label: "Link 1", url: "https://www.singtel.com/personal/products-services/digital-lifestyle" }, { label: "Link 2", url: "https://www.singtel.com/business" }, { label: "Link 3", url: "https://www.nvidia.com/en-us/industries/telco" }, { label: "Link 4", url: "https://nscale.com" }] },
      { name: "Deutsche Telekom", location: "Germany", website: "https://www.telekom.com", score: 3.9, logoColor: "#E20074", logoInitials: "DT", description: "Deutsche Telekom is explicitly co-developing a global Telco LLM platform and building Europe's largest GPU-powered AI cloud with NVIDIA, targeting pooled compute, modular/secure deployment, and enterprise compliance. The evidence is highly credible, recent, and covers the full feature set. Explicit need for turnkey AI/ML platforms is clear.", sources: [{ label: "Link 1", url: "https://www.telekom.com/en/media/media-information/ai" }, { label: "Link 2", url: "https://www.telekom.com/en/company/digital-responsibility" }, { label: "Link 3", url: "https://www.nvidia.com/en-us/networking/telco" }, { label: "Link 4", url: "https://www.tsystems.com/en/latest-news" }] },
      { name: "TELUS", location: "Canada", website: "https://www.telus.com", score: 3.6, logoColor: "#4B286D", logoInitials: "TL", description: "TELUS has launched a sovereign AI factory offering on-demand, pooled GPU resources; developer-ready platform tools; enterprise security; monitoring; modular deployment; no infrastructure setup; and user-friendly environments. Public statements and technical case studies provide detailed, credible, and recent evidence demonstrating explicit need and alignment.", sources: [{ label: "Link 1", url: "https://www.telus.com/en/health" }, { label: "Link 2", url: "https://www.telus.com/en/business/enterprise/cloud" }] },
      { name: "Telefónica", location: "Spain", website: "https://www.telefonica.com", score: 3.5, logoColor: "#0066FF", logoInitials: "TF", description: "Telefónica Tech offers a plug-and-play, vendor-agnostic GenAI PaaS for virtual assistants and process automation, featuring modular app deployment, no complex setups, model flexibility, security, compliance, and enterprise AI workflows. Multiple deployments and strong AI governance show highly credible, recent, and explicit need.", sources: [{ label: "Link 1", url: "https://www.telefonica.com/en/innovation" }, { label: "Link 2", url: "https://www.telefonica.com/en/sustainability-innovation" }, { label: "Link 3", url: "https://www.tsystems.com" }, { label: "Link 4", url: "https://hyperscaler.es" }] },
      { name: "SK Telecom", location: "South Korea", website: "https://www.sktelecom.com", score: 2.8, logoColor: "#FF0000", logoInitials: "SK", description: "SK Telecom is co-leading the Global Telco AI Alliance, focused on building a multilingual, modular, scalable Telco LLM platform supporting customer experience, automated workflows, elastic resources, compliance, and open-vendor access. Evidence is explicit, highly credible, recent, with direct reference to platformised AI/ML needs.", sources: [{ label: "Link 1", url: "https://www.sktelecom.com/en/press" }, { label: "Link 2", url: "https://www.gsma.com/get-involved/gsma-ai" }, { label: "Link 3", url: "https://www.nvidia.com/en-us/industries/telco" }] },
      { name: "SoftBank Corp.", location: "Japan", website: "https://www.softbank.jp", score: 3.2, logoColor: "#CC0000", logoInitials: "SB", description: "SoftBank Corp. is building a sovereign Japanese AI infrastructure with GPU clusters, agentic AI services, and a modular AI app platform. Investments and announcements demonstrate a clear, credible, and recent push for accessible, unified AI/ML platforms.", sources: [{ label: "Link 1", url: "https://www.softbank.jp/en/corp/aboutus/overview" }, { label: "Link 2", url: "https://www.nvidia.com/en-us/data-center/partners/softbank" }] },
      { name: "e& (formerly Etisalat Group)", location: "UAE", website: "https://www.eand.com", score: 4.3, logoColor: "#00C07F", logoInitials: "EA", description: "e& enterprise is launching a regional AI cloud platform offering GPU-aaS, no-code AI app development, and unified AI/ML tools for enterprise customers across the MEA region.", sources: [{ label: "Link 1", url: "https://www.eand.com/en" }, { label: "Link 2", url: "https://www.nvidia.com/en-us/industries/telco/e-and" }] },
    ],
  },
  {
    name: "Smart Manufacturing",
    avgScore: 9.0,
    reasoning: "Factories trial computer-vision quality control and predictive maintenance on no-code AI clouds (Siemens-Google, startup Landing AI); need pooled GPUs for high-res imagery and secure, turnkey deployment—signs of early yet accelerating uptake among mid-tier plants.",
    marketSummary: "Smart manufacturing facilities deploy AI for computer vision quality inspection, predictive maintenance, and production line optimization. GPU-accelerated inference at the edge and no-code model deployment tools reduce barriers for factory floor AI adoption.",
    companies: ["Renault", "Pegatron", "Georgia-Pacific"],
    companyCount: 5,
    companyDetails: [
      { name: "Renault Group", location: "France", website: "https://www.renaultgroup.com", score: 3.3, logoColor: "#FFCC00", logoInitials: "RN", description: "Renault (via Ampere) deploys AI for flexible manufacturing, digital twin synchronization, and connected vehicle data analytics requiring GPU-accelerated ML across global production facilities.", sources: [{ label: "Link 1", url: "https://www.renaultgroup.com/en/news-on-air/news/ampere/" }] },
      { name: "Pegatron", location: "Taiwan", website: "https://www.pegatroncorp.com", score: 2.5, logoColor: "#0066CC", logoInitials: "PG", description: "Pegatron manufactures electronics at scale and is piloting AI-powered quality control vision systems and predictive maintenance for its high-volume manufacturing operations.", sources: [{ label: "Link 1", url: "https://www.pegatroncorp.com/en/sustainability" }] },
      { name: "Georgia-Pacific", location: "USA", website: "https://www.gp.com", score: 2.15, logoColor: "#005A8B", logoInitials: "GP", description: "Georgia-Pacific is exploring no-code AI platforms for predictive maintenance and process optimization across its paper, packaging, and building products manufacturing operations.", sources: [{ label: "Link 1", url: "https://www.gp.com/about-us/technology-innovation" }] },
    ],
  },
  {
    name: "Media & Entertainment (Emerging)",
    avgScore: 9.0,
    reasoning: "Studios and creators are piloting cloud-GPU generative-AI tools for video/VFX; need elastic compute, no-code model tweaking, and unified workflows yet market adoption is still early-stage outside top VFX houses.",
    marketSummary: "Emerging media companies in Asia, Latin America, and Southeast Asia are adopting generative AI for content production, streaming personalization, and audience analytics. They require cost-efficient GPU access and accessible ML tools without deep engineering infrastructure.",
    companies: ["Zee Entertainment Enterprises Limited", "Grupo Globo S.A.", "PT Telekomunikasi Selular (Telkomsel)"],
    companyCount: 6,
    companyDetails: [
      { name: "Zee Entertainment Enterprises Limited", location: "India", website: "https://www.zee.com", score: 1.9, logoColor: "#003087", logoInitials: "ZE", description: "Zee Entertainment is expanding its ZEE5 streaming platform with AI-powered content recommendation and personalization, requiring scalable ML infrastructure for India's massive and diverse OTT market.", sources: [{ label: "Link 1", url: "https://www.zee.com/news" }] },
      { name: "Grupo Globo S.A.", location: "Brazil", website: "https://www.globo.com", score: 3.6, logoColor: "#004B8D", logoInitials: "GG", description: "Grupo Globo's Globoplay streaming platform requires AI personalization, content analytics, and generative AI for content production across Brazil's largest media conglomerate.", sources: [{ label: "Link 1", url: "https://www.globo.com/politica-privacidade" }] },
      { name: "PT Telekomunikasi Selular (Telkomsel)", location: "Indonesia", website: "https://www.telkomsel.com", score: 3.1, logoColor: "#FF0000", logoInitials: "TS", description: "Telkomsel is Indonesia's largest mobile operator launching AI-powered digital services and cloud platform for enterprise customers across Southeast Asia's rapidly growing digital economy.", sources: [{ label: "Link 1", url: "https://www.telkomsel.com/en/about-us" }] },
    ],
  },
  {
    name: "Insurance",
    avgScore: 9.0,
    reasoning: "Insurers adopt nascent no-code AI for claims image assessment and risk modelling; strict compliance plus elastic GPU inference suit the platform, yet adoption remains in pilot phases—marking an emerging segment.",
    marketSummary: "Insurance companies are piloting AI for automated claims processing, underwriting risk models, and fraud detection. Compliance-ready, no-code ML platforms reduce deployment barriers while elastic GPU inference supports high-volume image and document analysis workloads.",
    companies: ["Porto Seguro"],
    companyCount: 2,
    companyDetails: [
      { name: "Porto Seguro", location: "Brazil", website: "https://www.portoseguro.com.br", score: 3.6, logoColor: "#E30613", logoInitials: "PS", description: "Porto Seguro is Brazil's second-largest insurer actively deploying AI for claims automation, fraud detection, and customer experience personalization across auto, home, and health insurance products.", sources: [{ label: "Link 1", url: "https://www.portoseguro.com.br/sobre-porto/inovacao" }] },
    ],
  },
  {
    name: "Retail & eCommerce (Emerging)",
    avgScore: 8.5,
    reasoning: "Retailers like Walmart and Kroger pilot cloud AI for personalization, demand forecasting, and store vision; business teams seek no-code tools and cost-efficient GPUs to iterate fast, showing latent need beyond early flagship deployments.",
    marketSummary: "Emerging retail players and direct-to-consumer brands are adopting AI for personalization and inventory optimization but lack the engineering resources of enterprise retailers. No-code ML tools and shared GPU compute enable faster AI iteration without large data science teams.",
    companies: ["Whatnot", "ShopMy", "Standard AI", "Ulta Beauty", "Best Buy Canada"],
    companyCount: 9,
    companyDetails: [
      { name: "Whatnot", location: "USA", website: "https://www.whatnot.com", score: 3.15, logoColor: "#7B2FBE", logoInitials: "WN", description: "Whatnot's live-stream commerce platform requires real-time ML for fraud detection, personalized product discovery, and seller analytics across millions of live auction interactions.", sources: [{ label: "Link 1", url: "https://www.whatnot.com/about" }] },
      { name: "Ulta Beauty", location: "USA", website: "https://www.ulta.com", score: 3.2, logoColor: "#C41E3A", logoInitials: "UB", description: "Ulta Beauty's GLAMlab AR try-on and personalized beauty recommendation engine require scalable ML infrastructure for computer vision and customer data analytics across 1,300+ stores.", sources: [{ label: "Link 1", url: "https://www.ulta.com/ulta/a/aboutUlta/technology" }] },
      { name: "Best Buy Canada", location: "Canada", website: "https://www.bestbuy.ca", score: 2.15, logoColor: "#003B8E", logoInitials: "BB", description: "Best Buy Canada is deploying AI for personalized product recommendations, inventory optimization, and omnichannel customer experience improvements across its Canadian retail operations.", sources: [{ label: "Link 1", url: "https://corporate.bestbuy.com/technology-innovation" }] },
    ],
  },
];

const MARKET_TABS = [
  { key: "core",     label: "Core Markets",     color: "#2563eb", bg: "#2563eb", data: CORE_MARKETS },
  { key: "adjacent", label: "Adjacent Markets", color: "#f97316", bg: "#f97316", data: ADJACENT_MARKETS },
  { key: "emerging", label: "Emerging Markets", color: "#8b5cf6", bg: "#8b5cf6", data: EMERGING_MARKETS },
] as const;

type MarketKey = "core" | "adjacent" | "emerging";

const COMPANY_LOGOS: Record<string, string> = {
  "JPMorgan Chase & Co.": "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCARlB9ADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AIyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//Z",
  "HSBC Holdings plc": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4yLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iSFNCQ19NQVNURVJCUkFORF9MT0dPX1dXX1JHQiINCgkgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAzMTUuOSA4NSINCgkgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzE1LjkgODU7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiNGRkZGRkY7fQ0KCS5zdDF7ZmlsbDojREIwMDExO30NCjwvc3R5bGU+DQo8cmVjdCB4PSI0Mi42IiBjbGFzcz0ic3QwIiB3aWR0aD0iODUiIGhlaWdodD0iODUiLz4NCjx0aXRsZT5IU0JDX01BU1RFUkJSQU5EX0xPR09fV1dfUkdCPC90aXRsZT4NCjxwb2x5Z29uIGNsYXNzPSJzdDEiIHBvaW50cz0iMTcwLjEsNDIuNiAxMjcuNiwwIDEyNy42LDg1LjEgIi8+DQo8cG9seWdvbiBjbGFzcz0ic3QxIiBwb2ludHM9Ijg1LjEsNDIuNiAxMjcuNiwwIDQyLjYsMCAiLz4NCjxwb2x5Z29uIGNsYXNzPSJzdDEiIHBvaW50cz0iMCw0Mi42IDQyLjYsODUuMSA0Mi42LDAgIi8+DQo8cG9seWdvbiBjbGFzcz0ic3QxIiBwb2ludHM9Ijg1LjEsNDIuNiA0Mi42LDg1LjEgMTI3LjYsODUuMSAiLz4NCjxwYXRoIGQ9Ik0yMDcuNCw0NS4xSDE5MnYxNS4yaC03LjdWMjQuN2g3Ljd2MTQuNmgxNS40VjI0LjdoNy43djM1LjZoLTcuN1Y0NS4xeiIvPg0KPHBhdGggZD0iTTIzMy43LDYxYy03LjcsMC0xNC0zLjEtMTQuMS0xMS42aDcuN2MwLjEsMy44LDIuMyw2LjEsNi41LDYuMWMzLjEsMCw2LjctMS42LDYuNy01LjFjMC0yLjgtMi40LTMuNi02LjQtNC44bC0yLjYtMC43DQoJYy01LjYtMS42LTExLjItMy44LTExLjItMTAuMmMwLTcuOSw3LjQtMTAuNiwxNC4xLTEwLjZjNi45LDAsMTIuOSwyLjQsMTMsMTAuM2gtNy43Yy0wLjMtMy4yLTIuMi01LjEtNS44LTUuMQ0KCWMtMi45LDAtNS43LDEuNS01LjcsNC43YzAsMi42LDIuNCwzLjQsNy40LDVsMywwLjljNi4xLDEuOSwxMCw0LDEwLDEwQzI0OC41LDU3LjksMjQwLjcsNjEsMjMzLjcsNjF6Ii8+DQo8cGF0aCBkPSJNMjUyLjksMjQuOGgxMi40YzIuMy0wLjEsNC43LDAsNywwLjRjNC4zLDEsNy42LDMuOCw3LjYsOC42YzAsNC42LTIuOSw2LjktNy4xLDhjNC44LDAuOSw4LjQsMy4zLDguNCw4LjYNCgljMCw4LjEtOCw5LjktMTQuMiw5LjloLTE0TDI1Mi45LDI0Ljh6IE0yNjUuMywzOS42YzMuNCwwLDYuOS0wLjcsNi45LTQuOGMwLTMuNy0zLjItNC43LTYuNC00LjdoLTUuNHY5LjVIMjY1LjN6IE0yNjYsNTUNCgljMy42LDAsNy4xLTAuOCw3LjEtNS4ycy0zLTUuMi02LjctNS4yaC02LjFWNTVIMjY2eiIvPg0KPHBhdGggZD0iTTMwMS4yLDYxYy0xMS41LDAtMTYuNi03LjMtMTYuNi0xOC4yczUuNy0xOC44LDE3LTE4LjhjNy4xLDAsMTQsMy4yLDE0LjIsMTEuMmgtOGMtMC40LTMuNi0yLjgtNS40LTYuMi01LjQNCgljLTcsMC05LjEsNy41LTkuMSwxMy4yYzAsNS43LDIuMSwxMi4zLDguOCwxMi4zYzMuNSwwLDYuMS0xLjksNi42LTUuNWg4QzMxNS4xLDU4LDMwOC42LDYxLDMwMS4yLDYxeiIvPg0KPC9zdmc+DQo=",
  "Goldman Sachs Group, Inc.": "data:image/png;base64,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ZmeMzL+DTTHSkbVjZwte153tO4A+3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//2Q==",
  "Nubank S.A.": "data:image/png;base64,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",
  "Midea Group": "data:image/png;base64,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",
  "Renault Group": "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCASwBLADASIAAhEBAxEB/8QAHQABAAICAwEBAAAAAAAAAAAAAAgJBgcDBAUBAv/EAF0QAQABAwICBAUJEgwFAwQCAwABAgMEBQYHEQgSITEJQVFhdRMYIjdxc4GxsxQXMjQ4QlJWV2KRlJWhsrTR0hUjNTZydHaCkpOi0xYkM0PBVGODJVNVwsPhRGWj/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AIZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/9k=",
  "AstraZeneca": "data:image/jpeg;base64,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",
};


// ─────────────────────────────────────────────
// OVERVIEW PAGE — rich data from Excel
// ─────────────────────────────────────────────
function OverviewPage({ onNavigate, onOpen }: { onNavigate: (page: Page, market?: MarketKey) => void; onOpen: (c: Customer) => void }) {
  const total = ALL_CUSTOMERS.length;
  const highP  = ALL_CUSTOMERS.filter(c => c.score >= 4.0).length;
  const medP   = ALL_CUSTOMERS.filter(c => c.score >= 2.5 && c.score < 4.0).length;
  const lowP   = ALL_CUSTOMERS.filter(c => c.score < 2.5).length;
  const avgScoreNum = ALL_CUSTOMERS.reduce((s, c) => s + c.score, 0) / total;
  const avgScore = avgScoreNum.toFixed(2);
  const topCustomers = [...ALL_CUSTOMERS].sort((a, b) => b.score - a.score).slice(0, 10);
  const [productExpanded, setProductExpanded] = useState(true);
  const [showProductDetailsOverview, setShowProductDetailsOverview] = useState(false);

  // Score distribution
  const scoreDistData = [
    { range: "4.5–5.0", count: ALL_CUSTOMERS.filter(c => c.score >= 4.5).length,              fill: "#065f46" },
    { range: "4.0–4.5", count: ALL_CUSTOMERS.filter(c => c.score >= 4.0 && c.score < 4.5).length, fill: "#059669" },
    { range: "3.5–4.0", count: ALL_CUSTOMERS.filter(c => c.score >= 3.5 && c.score < 4.0).length, fill: "#1EDD7D" },
    { range: "3.0–3.5", count: ALL_CUSTOMERS.filter(c => c.score >= 3.0 && c.score < 3.5).length, fill: "#34d399" },
    { range: "2.5–3.0", count: ALL_CUSTOMERS.filter(c => c.score >= 2.5 && c.score < 3.0).length, fill: "#6ee7b7" },
    { range: "<2.5",    count: ALL_CUSTOMERS.filter(c => c.score < 2.5).length,                fill: "#a7f3d0" },
  ];

  const INDUSTRY_COMPANIES: Record<string, string[]> = {
    "Retail & Consumer":    ["Skechers USA, Inc.", "Warby Parker, Inc.", "Midea Group", "Beko (Arçelik)", "Levi Strauss & Co.", "Wayfair LLC", "Allbirds, Inc.", "ThredUp", "Ulta Beauty", "Perry Ellis International", "Michael Kors", "Best Home Furnishings", "Best Buy Canada", "Staples Canada", "Georgia-Pacific", "Whatnot"],
    "Healthcare":           ["IQVIA", "Parexel", "Cleveland Clinic", "Mayo Clinic", "TidalHealth Peninsula Regional", "AstraZeneca", "Valley Medical Center", "Takeda Pharmaceutical Company Limited", "RegenCrops", "Symbrosia", "OpenFold Consortium", "Farmonaut", "CarbonFarm", "India National Health Authority (NHA) & IIT Kanpur", "MD Logistics", "Tomorrow.io"],
    "Media & Entmt.":       ["Netflix", "The Walt Disney Company", "CNN", "NBCUniversal", "Grupo Globo S.A.", "Paramount Global", "Warner Bros. Discovery", "CBS News", "Daily Maverick", "Zee Entertainment Enterprises Limited", "Channels Television", "Forbes", "SpreeAI", "ShopMy", "Whatnot", "Pegatron"],
    "Financial Services":   ["JPMorgan Chase & Co.", "HSBC Holdings plc", "Nubank S.A.", "Goldman Sachs Group, Inc.", "Porto Seguro", "e& (formerly Etisalat Group)", "Standard AI", "Red Barn Robotics", "Best Buy Canada", "Staples Canada"],
    "Technology":           ["Tomorrow.io", "SpreeAI", "Whatnot", "ShopMy", "Pegatron", "Georgia-Pacific", "MD Logistics", "Crane Worldwide Logistics", "Best Home Furnishings", "Standard AI"],
    "Manufacturing":        ["Midea Group", "Beko (Arçelik)", "Toyota Motor Corporation", "Renault Group", "BMW Group", "Pegatron"],
    "Education & Research": ["Stanford University", "Georgia Institute of Technology (Georgia Tech)", "University of Toronto", "Carnegie Mellon University", "National University of Singapore", "Higher Education Quality Council of Ontario (HEQCO) - GenAI Consortium"],
    "Energy & Utilities":   ["NextEra Energy", "Schneider Electric", "ENGIE", "Iberdrola", "Enel"],
    "Automotive":           ["Toyota Motor Corporation", "Renault Group", "BMW Group"],
    "Telecom":              ["e& (formerly Etisalat Group)", "Deutsche Telekom", "TELUS"],
  };

  const industryData = [
    { name: "Retail & Consumer",    value: 16, color: "#065f46" },
    { name: "Healthcare",           value: 16, color: "#047857" },
    { name: "Media & Entmt.",       value: 16, color: "#059669" },
    { name: "Financial Services",   value: 10, color: "#10b981" },
    { name: "Technology",           value: 10, color: "#1EDD7D" },
    { name: "Manufacturing",        value: 6,  color: "#34d399" },
    { name: "Education & Research", value: 6,  color: "#4ade80" },
    { name: "Energy & Utilities",   value: 5,  color: "#6ee7b7" },
    { name: "Automotive",           value: 3,  color: "#a7f3d0" },
    { name: "Telecom",              value: 3,  color: "#bbf7d0" },
  ];

  const [hoveredIndustry, setHoveredIndustry] = useState<string | null>(null);
  const industryRowRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  const sizeData = [
    { name: "Enterprise\n(10k–100k)",    value: 34, color: "#059669" },
    { name: "SME\n(<1k)",                value: 20, color: "#1EDD7D" },
    { name: "Mid-Market\n(1k–10k)",      value: 17, color: "#34d399" },
    { name: "Large Enterprise\n(100k+)", value: 14, color: "#6ee7b7" },
  ];

  const criteriaData = [
    { subject: "Industry\nAlignment",    avg: 3.18, weight: "20%" },
    { subject: "Growth",                 avg: 2.64, weight: "20%" },
    { subject: "Tech/Solution\nGaps",    avg: 4.23, weight: "20%" },
    { subject: "Strategic\nInitiatives", avg: 3.0,  weight: "15%" },
    { subject: "Geo Reach",              avg: 4.49, weight: "10%" },
    { subject: "Investment\nCapacity",   avg: 1.73, weight: "15%" },
  ];

  const painData = [
    { name: "High Severity",     value: 246, color: "#059669" },
    { name: "Moderate Severity", value: 92,  color: "#6ee7b7" },
  ];

  const vendorData = [
    { vendor: "AWS",          count: 36 },
    { vendor: "Google Cloud", count: 17 },
    { vendor: "NVIDIA",       count: 16 },
    { vendor: "Microsoft",    count: 18 },
    { vendor: "Databricks",   count: 10 },
    { vendor: "OpenAI",       count: 10 },
    { vendor: "Alibaba Cloud",count: 6  },
    { vendor: "Salesforce",   count: 4  },
  ];

  // ── Reusable Key Takeaways box ──
  const KeyTakeaways = ({ points }: { points: { bold: string; rest: string }[] }) => (
    <div className="rounded-xl border border-[#a7f3d0] bg-gradient-to-br from-[#edfdf5] to-[#f0fdf4] px-5 py-4">
      <div className="flex items-center gap-2 mb-3">
        <svg width="13" height="13" fill="none" stroke="#15b865" strokeWidth="2.5" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span className="text-[10px] font-black uppercase tracking-[.1em] text-[#15b865]">Key Takeaways</span>
      </div>
      <div className="flex flex-col gap-2">
        {points.map((p, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <svg width="14" height="14" fill="none" stroke="#1EDD7D" strokeWidth="2.5" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
            <p className="text-[12px] text-[#1a2620] leading-relaxed">
              <strong className="text-[#0f2644]">{p.bold}</strong> {p.rest}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-5">

      {/* ── ROW 1: KPI tiles — clean white, no color, matches reference ── */}
      <div className="grid grid-cols-6 gap-3">
        {[
          { label: "TOTAL CUSTOMERS",   value: total,    descriptor: "Identified",   sub: `${Math.round((highP/total)*100)}% High Priority`, dest: "Customer Profiles →", nav: () => onNavigate("dossier") },
          { label: "HIGH PRIORITY",     value: highP,    descriptor: "profiles",     sub: "Score ≥ 4.0", highlight: true, dest: "Customer Profiles →", nav: () => onNavigate("scan") },
          { label: "CORE MARKETS",      value: 5,        descriptor: "markets",      sub: "25 companies identified",  accent: "#059669", dest: "Core Markets →", nav: () => onNavigate("scan", "core") },
          { label: "ADJACENT MARKETS",  value: 5,        descriptor: "markets",      sub: "28 companies identified",  accent: "#10b981", dest: "Adjacent Markets →", nav: () => onNavigate("scan", "adjacent") },
          { label: "EMERGING MARKETS",  value: 5,        descriptor: "markets",      sub: "38 companies identified",  accent: "#34d399", dest: "Emerging Markets →", nav: () => onNavigate("scan", "emerging") },
          { label: "COUNTRIES",         value: "13",     descriptor: "HQ locations", sub: "Global reach", dest: "Geography Map →", nav: () => { onNavigate("insights"); setTimeout(() => document.getElementById("geography-section")?.scrollIntoView({ behavior: "smooth", block: "start" }), 200); } },
        ].map(k => (
          <div key={k.label} onClick={(k as any).nav} className="relative bg-white border border-slate-200 rounded-xl px-4 py-4 shadow-sm hover:shadow-md hover:border-[#1EDD7D] cursor-pointer transition-all group overflow-hidden">
            {/* Hover destination hint bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0 group-hover:h-6 transition-all duration-200 bg-[#1EDD7D]/10 flex items-center justify-center overflow-hidden">
              <span className="text-[9px] font-bold text-[#15b865] tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-150">{(k as any).dest}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-bold uppercase tracking-[.1em] text-slate-400">{k.label}</span>
              <svg width="10" height="10" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24" className="group-hover:stroke-[#15b865] transition-colors">
                <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
              </svg>
            </div>
            <div className="flex items-baseline gap-1.5 mb-0.5">
              <span className={`text-[28px] font-black leading-none text-black`}>{k.value}</span>
              <span className="text-[12px] font-medium text-slate-500">{k.descriptor}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── PRODUCT ANALYSIS ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-5">
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2">
            <svg width="13" height="13" fill="none" stroke="#1EDD7D" strokeWidth="2.5" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <h3 className="text-[14px] font-black text-[#0f2644]">Product Analysis</h3>
          </div>
          <button onClick={() => setProductExpanded(p => !p)} className="text-[11px] text-slate-400 hover:text-[#0f2644] flex items-center gap-1 transition-colors">
            {productExpanded ? "Collapse" : "Expand"}
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className={`transition-transform ${productExpanded ? "" : "-rotate-90"}`}><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>
        <p className="text-[11px] text-slate-400 mb-3">Product details and key features with reference links</p>
        {productExpanded && (
          <div className="bg-[#f0f7ff] rounded-xl border border-blue-100 p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded bg-[#0f2644] flex items-center justify-center flex-shrink-0">
                    <svg width="12" height="12" fill="none" stroke="#1EDD7D" strokeWidth="2" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                  <span className="text-[13px] font-bold text-[#0f2644]">Delta Engine</span>
                </div>
                <p className="text-[12px] text-slate-600 leading-relaxed">
                  Enable accessible, <strong className="text-[#0f2644]">unified AI/ML</strong> model development, deployment, and{" "}
                  <strong className="text-[#0f2644]">application creation</strong> via an all-in-one platform-as-a-service solution.
                </p>
              </div>
              <button onClick={() => setShowProductDetailsOverview(true)} className="text-[11px] font-semibold text-[#1a56db] hover:underline flex-shrink-0 flex items-center gap-1">
                View Details
                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
            <div className="mb-2">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[.06em] mb-2">Product features and capabilities :</div>
              <div className="flex flex-wrap gap-2">
                {["Global pooled GPU compute resources", "Unified dashboard for models and workflows", "No-code AI training and deployment tools"].map(f => (
                  <span key={f} className="text-[11px] font-medium bg-white border border-blue-200 text-[#1a56db] px-3 py-1 rounded-full">{f}</span>
                ))}
                <span className="text-[11px] font-medium bg-white border border-blue-200 text-[#1a56db] px-3 py-1 rounded-full cursor-pointer hover:bg-blue-50">+4 more</span>
              </div>
            </div>
          </div>
        )}
      </div>
      {showProductDetailsOverview && <ProductDetailsDrawer onClose={() => setShowProductDetailsOverview(false)} />}

      {/* ── ROW 2: Score Distribution + Top Ranked Customers — 2 columns ── */}
      <div className="grid grid-cols-2 gap-4 items-stretch">

        {/* Top Ranked Customers */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col">
          <div className="flex items-center justify-between mb-0.5">
            <div className="text-[13px] font-bold text-[#0f2644]">Top-Scoring Customer Profiles</div>
          </div>
          <div className="text-[11px] text-slate-400 mb-3">Profiles with the highest evaluation scores</div>
          <div className="flex flex-col gap-1.5">
            {topCustomers.map((c, i) => {
              const { color } = getCompanyLogo(c.name);
              const tier = getScoreTier(c.score);
              const isFirst = i === 0;
              const initials = c.name.split(" ").filter(w => w.length > 1 && !/^(Inc|Ltd|plc|LLC|Corp|Co|Group|SA|AG|NV|BV|GmbH|Sdn|Bhd|AB|AS|Pvt|&|and|the|of)$/i.test(w)).slice(0, 2).map(w => w[0]).join("").toUpperCase();

              const coreNames = CORE_MARKETS.flatMap(m => m.companies);
              const adjNames  = ADJACENT_MARKETS.flatMap(m => m.companies);
              const emgNames  = EMERGING_MARKETS.flatMap(m => m.companies);
              const marketSegment = coreNames.includes(c.name)
                ? { label: "CORE", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" }
                : adjNames.includes(c.name)
                ? { label: "ADJACENT", bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" }
                : emgNames.includes(c.name)
                ? { label: "EMERGING", bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" }
                : null;

              const scoreBarW = Math.round((c.score / 5) * 100);
              const scoreColor = isFirst ? "#1EDD7D" : c.score >= 4.5 ? "#059669" : c.score >= 4 ? "#10b981" : "#94a3b8";
              const tierColor = c.score >= 4.5 ? "text-green-600" : c.score >= 4 ? "text-emerald-500" : "text-slate-400";

              return (
                <div
                  key={c.name}
                  onClick={() => onOpen(c)}
                  className={`group relative rounded-xl px-3 py-2.5 transition-all cursor-pointer
                    ${isFirst
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 shadow-sm hover:shadow-md hover:border-green-300"
                      : "border border-slate-100 hover:border-[#1EDD7D]/50 hover:bg-slate-50 hover:shadow-sm"}`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank badge */}
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0
                      ${isFirst ? "bg-[#1EDD7D] text-white shadow-sm" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"}`}>
                      {i + 1}
                    </div>

                    {/* Logo */}
                    {COMPANY_LOGOS[c.name] ? (
                      <div className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                        <img src={COMPANY_LOGOS[c.name]} alt={c.name} className="object-contain w-7 h-7 p-0.5" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black flex-shrink-0 shadow-sm" style={{ backgroundColor: color }}>
                        {initials}
                      </div>
                    )}

                    {/* Name + HQ + segment */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <div className={`text-[12px] font-bold leading-tight truncate ${isFirst ? "text-[#0f2644]" : "text-slate-700 group-hover:text-[#0f2644]"}`}>
                          {c.name}
                        </div>
                        {marketSegment && (
                          <span className={`text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full border flex-shrink-0 ${marketSegment.bg} ${marketSegment.text} ${marketSegment.border}`}>
                            {marketSegment.label}
                          </span>
                        )}
                      </div>
                      {/* HQ + Score bar on same row */}
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-0.5 text-[9px] text-slate-400 flex-shrink-0">
                          <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 14 6 14s6-8.75 6-14c0-3.314-2.686-6-6-6z"/><circle cx="12" cy="8" r="2" fill="currentColor" stroke="none"/></svg>
                          {c.hq}
                        </span>
                        {/* Score bar — wider, taller, cleaner */}
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${scoreBarW}%`, backgroundColor: scoreColor }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Score + tier */}
                    <div className="text-right flex-shrink-0 ml-1">
                      <div className="text-[15px] font-black leading-none" style={{ color: scoreColor }}>
                        {c.score.toFixed(1)}
                      </div>
                      <div className={`text-[8px] font-bold uppercase tracking-wide mt-0.5 ${tierColor}`}>{tier}</div>
                    </div>

                    {/* Open arrow hint */}
                    <svg width="12" height="12" fill="none" stroke="#cbd5e1" strokeWidth="2.5" viewBox="0 0 24 24"
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 group-hover:stroke-[#1EDD7D] transition-all duration-150">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-auto pt-3 border-t border-slate-100">
            <KeyTakeaways points={[
              { bold: "JPMorgan Chase leads with a perfect 5.0/5.0,", rest: "backed by a $2B dedicated AI budget. This is the single highest-value target — assign a dedicated enterprise AE and begin executive relationship building immediately." },
              { bold: "HSBC and Netflix both score 4.7/5.0", rest: "and represent two structurally different use cases — regulatory AI for FinServ vs. recommendation ML for media — validating Delta Engine's cross-vertical applicability." },
              { bold: "All 8 top accounts exceed $2B in annual revenue,", rest: "confirming that Delta Engine's natural buyers are large enterprises with established data infrastructure and proven willingness to invest in AI platforms." },
            ]} />
          </div>
        </div>

        {/* Score Distribution Tiers */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="text-[13px] font-bold text-[#0f2644] mb-0.5">Score Distribution Tiers</div>
          <div className="text-[11px] text-slate-400 mb-3">Evaluation score across {total} customers</div>
          <div className="flex flex-col gap-2.5">
            {(() => {
              const highCustomers = ALL_CUSTOMERS.filter(c => c.score >= 4.0).sort((a,b) => b.score - a.score);
              const midCustomers  = ALL_CUSTOMERS.filter(c => c.score >= 2.5 && c.score < 4.0).sort((a,b) => b.score - a.score);
              const lowCustomers  = ALL_CUSTOMERS.filter(c => c.score < 2.5).sort((a,b) => b.score - a.score);
              const tiers = [
                { label: "HIGH ≥ 4.0", sub: "Immediate engagement", customers: highCustomers, bg: "bg-green-50", border: "border-green-200", labelColor: "text-green-700", countColor: "text-green-600", barColor: "bg-green-500", tagBg: "bg-white", tagBorder: "border-green-200", tagText: "text-green-800", dotColor: "bg-green-500" },
                { label: "MEDIUM 2.5 – 3.9", sub: "Nurture pipeline", customers: midCustomers, bg: "bg-yellow-50", border: "border-yellow-200", labelColor: "text-yellow-700", countColor: "text-yellow-500", barColor: "bg-yellow-400", tagBg: "bg-white", tagBorder: "border-yellow-200", tagText: "text-yellow-800", dotColor: "bg-yellow-400" },
                { label: "LOW < 2.5", sub: "Monitor only", customers: lowCustomers, bg: "bg-red-50", border: "border-red-200", labelColor: "text-red-700", countColor: "text-red-500", barColor: "bg-red-400", tagBg: "bg-white", tagBorder: "border-red-200", tagText: "text-red-800", dotColor: "bg-red-400" },
              ];
              return tiers.map(t => {
                const pct = Math.round((t.customers.length / total) * 100);
                return (
                  <div key={t.label} className={`rounded-xl border ${t.border} ${t.bg} px-3.5 py-3`}>
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className={`text-[10px] font-black uppercase tracking-wide ${t.labelColor}`}>{t.label}</div>
                        <div className="text-[9px] text-slate-400 mt-0.5">{t.sub}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-white rounded-full overflow-hidden border border-slate-200">
                          <div className={`h-full rounded-full ${t.barColor}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className={`text-[18px] font-black leading-none ${t.countColor}`}>{t.customers.length}</span>
                      </div>
                    </div>
                    {/* Company tags — show ALL, clickable */}
                    <div className="flex flex-wrap gap-1.5">
                      {t.customers.map(c => {
                        const initials = c.name.split(" ").filter((w: string) => w.length > 1 && !/^(Inc|Ltd|plc|LLC|Corp|Co|Group|SA|AG|NV|BV|GmbH|Sdn|Bhd|AB|AS|Pvt|&|and|the|of)$/i.test(w)).slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();
                        const { color } = getCompanyLogo(c.name);
                        return (
                          <div
                            key={c.name}
                            onClick={() => onOpen(c)}
                            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full border cursor-pointer transition-all hover:shadow-sm hover:scale-105 active:scale-95 ${t.tagBg} ${t.tagBorder}`}
                            title={`Open ${c.name} dossier`}
                          >
                            {COMPANY_LOGOS[c.name] ? (
                              <img src={COMPANY_LOGOS[c.name]} alt={c.name} className="w-3.5 h-3.5 object-contain rounded-full flex-shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: color, fontSize: "6px", fontWeight: 900 }}>
                                {initials.slice(0,1)}
                              </div>
                            )}
                            <span className={`text-[9px] font-semibold ${t.tagText} leading-none whitespace-nowrap`}>
                              {c.name.length > 18 ? c.name.slice(0, 17) + "…" : c.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          {/* Key Takeaways */}
          <div className="pt-3 rounded-xl border border-green-200 bg-green-50 p-3.5 mt-3">
            <div className="flex items-center gap-1.5 mb-2.5">
              <svg width="13" height="13" fill="none" stroke="#15b865" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span className="text-[10px] font-black uppercase tracking-[.1em] text-[#15b865]">Key Takeaways</span>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { bold: "The 4.5–5.0 band contains only 3 accounts", rest: "— JPMorgan Chase, HSBC, and Netflix — making them the most exclusive, highest-fit targets." },
                { bold: "All 17 High Priority accounts (score ≥ 4.0)", rest: "share active AI investments and documented pain points — ready for immediate targeted outreach." },
                { bold: "Medium-priority accounts form a warm pipeline", rest: "for the next 6–12 months as AI budgets expand across their sectors." },
              ].map((p, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <svg width="12" height="12" fill="none" stroke="#15b865" strokeWidth="2.5" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  <p className="text-[10px] text-slate-700 leading-relaxed">
                    <strong className="text-[#0f2644]">{p.bold}</strong> {p.rest}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── ROW 2b+3b: Industry Breakdown + Pain Point Severity — 2 columns ── */}
      <div className="grid grid-cols-2 gap-4">

        {/* Industry Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="text-[13px] font-bold text-[#0f2644] mb-0.5">Industry Breakdown</div>
          <div className="text-[11px] text-slate-400 mb-4">Customers by sector — hover a bar to see companies · click to drill down</div>
          <div className="relative flex flex-col gap-2">
            {industryData.map((d, idx) => {
              const companies = INDUSTRY_COMPANIES[d.name] ?? [];
              const isHovered = hoveredIndustry === d.name;
              return (
                <div
                  key={d.name}
                  ref={el => { industryRowRefs.current[d.name] = el; }}
                  className="relative flex items-center gap-3 group"
                  onMouseEnter={() => setHoveredIndustry(d.name)}
                  onMouseLeave={() => setHoveredIndustry(null)}
                >
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <div className="text-[11px] text-slate-600 w-40 flex-shrink-0 font-medium">{d.name}</div>
                  <div
                    className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden cursor-pointer"
                    onClick={() => setHoveredIndustry(isHovered ? null : d.name)}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-200"
                      style={{
                        width: `${(d.value / 16) * 100}%`,
                        backgroundColor: d.color,
                        opacity: hoveredIndustry && !isHovered ? 0.4 : 1,
                      }}
                    />
                  </div>
                  <div className="text-[12px] font-black text-[#0f2644] w-6 text-right flex-shrink-0">{d.value}</div>

                  {/* Tooltip drill-down panel */}
                  {isHovered && (
                    <div
                      className="absolute left-0 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
                      style={{
                        top: idx < 5 ? "calc(100% + 6px)" : "auto",
                        bottom: idx >= 5 ? "calc(100% + 6px)" : "auto",
                        minWidth: "320px",
                        maxWidth: "380px",
                      }}
                    >
                      {/* Tooltip header */}
                      <div className="px-4 pt-4 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
                          <span className="text-[14px] font-black text-[#0f2644]">{d.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 ml-5">{d.value} companies matched</div>
                      </div>

                      {/* Company list */}
                      <div className="px-3 py-2 max-h-52 overflow-y-auto">
                        {companies.map((compName, ci) => {
                          const customer = ALL_CUSTOMERS.find(c => c.name === compName || compName.startsWith(c.name.slice(0, 12)));
                          const { color: logoColor } = getCompanyLogo(compName);
                          const initials = compName.split(" ").filter((w: string) => w.length > 1 && !/^(Inc|Ltd|plc|LLC|Corp|Co|Group|SA|AG|NV|BV|GmbH|Sdn|Bhd|AB|AS|Pvt|&|and|the|of)$/i.test(w)).slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();
                          const score = customer?.score;
                          return (
                            <div
                              key={ci}
                              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group/item"
                              onClick={(e) => {
                                e.stopPropagation();
                                setHoveredIndustry(null);
                              }}
                            >
                              {/* Logo */}
                              {COMPANY_LOGOS[compName] ? (
                                <img src={COMPANY_LOGOS[compName]} alt={compName} className="w-5 h-5 rounded object-contain flex-shrink-0 border border-slate-100" />
                              ) : (
                                <div className="w-5 h-5 rounded flex items-center justify-center text-white flex-shrink-0"
                                  style={{ backgroundColor: logoColor, fontSize: "7px", fontWeight: 900 }}>
                                  {initials.slice(0, 1)}
                                </div>
                              )}
                              {/* Name */}
                              <span className="text-[11px] font-semibold text-slate-700 flex-1 truncate group-hover/item:text-[#0f2644]">
                                {compName.length > 35 ? compName.slice(0, 34) + "…" : compName}
                              </span>
                              {/* Score badge */}
                              {score !== undefined && (
                                <span
                                  className="text-[9px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0"
                                  style={{
                                    backgroundColor: score >= 4.5 ? "#d1fae5" : score >= 3.5 ? "#fef9c3" : "#fee2e2",
                                    color: score >= 4.5 ? "#065f46" : score >= 3.5 ? "#713f12" : "#991b1b",
                                  }}
                                >
                                  {score.toFixed(1)}
                                </span>
                              )}
                              {/* Arrow */}
                              <svg width="10" height="10" fill="none" stroke="#cbd5e1" strokeWidth="2.5" viewBox="0 0 24 24" className="flex-shrink-0 group-hover/item:stroke-[#1EDD7D] transition-colors">
                                <polyline points="9 18 15 12 9 6" />
                              </svg>
                            </div>
                          );
                        })}
                      </div>

                      {/* Footer */}
                      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">{companies.length} accounts in this sector</span>
                        <span className="text-[10px] font-semibold text-[#1EDD7D] flex items-center gap-1">
                          Click row to explore
                          <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 border-t border-slate-100 pt-4">
            <KeyTakeaways points={[
              { bold: "Retail, Healthcare, and Media each tie at 16 accounts (18% each),", rest: "making them the three most represented verticals. These sectors share a common need: scalable ML for personalisation, clinical AI, and content recommendation — all addressable by Delta Engine." },
              { bold: "Financial Services (10 accounts) carries the highest average evaluation score,", rest: "making it the highest-value vertical despite lower volume. Prioritise FinServ for enterprise deal size and faster AI budget cycles." },
              { bold: "Manufacturing, Education, and Energy & Utilities collectively hold 17 accounts", rest: "— a growing segment. These verticals are in early AI adoption phases, ideal for Delta Engine's no-code deployment and elastic compute value proposition." },
            ]} />
          </div>
        </div>

        {/* Pain Point Severity */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="text-[13px] font-bold text-[#0f2644] mb-0.5">Pain Point Severity</div>
          <div className="text-[11px] text-slate-400 mb-4">Distribution of documented pain point severity across all 91 accounts</div>
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={painData} cx="50%" cy="50%" innerRadius={52} outerRadius={76} dataKey="value" paddingAngle={3}>
                    {painData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} pain points`]} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 flex flex-col gap-4">
              {painData.map(d => (
                <div key={d.name} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-[#f8fafc]">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <div>
                      <div className="text-[13px] font-bold text-[#0f2644]">{d.value}</div>
                      <div className="text-[11px] text-slate-500">{d.name}</div>
                    </div>
                  </div>
                  <div className="text-[12px] font-semibold text-slate-400">{Math.round((d.value / 338) * 100)}%</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 border-t border-slate-100 pt-4">
            <KeyTakeaways points={[
              { bold: "73% of all pain points (246 of 338) are High severity,", rest: "signalling that target accounts are not just exploring AI — they are actively blocked by unresolved infrastructure pain. This is the strongest buying signal in the dataset." },
              { bold: "Only 27% (92) are Moderate severity,", rest: "indicating nearly all accounts face acute, not latent, problems. Use specific high-severity pain points as the opening hook in cold outreach — avoid generic pitches." },
              { bold: "Pain point volume per account averages 3.7,", rest: "meaning every target account has multiple documented problems. Tailor messaging to the top 2 pain points per account for maximum resonance." },
            ]} />
          </div>
        </div>

      </div>


    </div>
  );
}

function FilterSection({ title, children, defaultOpen = true }: { title: string; children?: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 pb-4 mb-4">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between mb-3 group">
        <span className="text-[12px] font-bold text-[#0f2644] group-hover:text-[#15b865] transition-colors">{title}</span>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
          className={`text-slate-400 transition-transform duration-200 ${open ? "" : "-rotate-90"}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────
// CUSTOMER CARDS PAGE — matches reference image
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// COMPANY LOGO MAP — domain + brand color per company
// Logos fetched from Clearbit Logo API (free, no auth)
// ─────────────────────────────────────────────
const COMPANY_LOGO_MAP: Record<string, { domain: string; color: string }> = {
  "JPMorgan Chase & Co.":           { domain: "jpmorganchase.com",       color: "#003087" },
  "HSBC Holdings plc":              { domain: "hsbc.com",                 color: "#DB0011" },
  "Netflix":                        { domain: "netflix.com",              color: "#E50914" },
  "Skechers USA, Inc.":             { domain: "skechers.com",             color: "#000000" },
  "Nubank S.A.":                    { domain: "nubank.com.br",            color: "#820AD1" },
  "IQVIA":                          { domain: "iqvia.com",                color: "#E31837" },
  "Midea Group":                    { domain: "midea.com",                color: "#E30E0E" },
  "NextEra Energy":                 { domain: "nexteraenergy.com",        color: "#00A9E0" },
  "Stanford University":            { domain: "stanford.edu",             color: "#8C1515" },
  "e& (formerly Etisalat Group)":   { domain: "eand.com",                 color: "#00C07F" },
  "Parexel":                        { domain: "parexel.com",              color: "#003087" },
  "Warby Parker, Inc.":             { domain: "warbyparker.com",          color: "#1A73E8" },
  "Cleveland Clinic":               { domain: "clevelandclinic.org",      color: "#00B5E2" },
  "Renault Group":                  { domain: "renaultgroup.com",         color: "#FFCC00" },
  "Beko (Arçelik)":                 { domain: "arcelik.com",              color: "#0066CC" },
  "The Walt Disney Company":        { domain: "thewaltdisneycompany.com", color: "#1A237E" },
  "CNN":                            { domain: "cnn.com",                  color: "#CC0000" },
  "RegenCrops":                     { domain: "regencrop.com",            color: "#2D7D32" },
  "Schneider Electric":             { domain: "se.com",                   color: "#3DCD58" },
  "Georgia Institute of Technology":{ domain: "gatech.edu",               color: "#B3A369" },
  "University of Toronto":          { domain: "utoronto.ca",              color: "#002A5C" },
  "Carnegie Mellon University":     { domain: "cmu.edu",                  color: "#C41230" },
  "Toyota Motor Corporation":       { domain: "toyota-global.com",        color: "#EB0A1E" },
  "NBCUniversal":                   { domain: "nbcuniversal.com",         color: "#FF6600" },
  "Goldman Sachs Group, Inc.":      { domain: "goldmansachs.com",         color: "#1A1A1A" },
  "Deutsche Telekom":               { domain: "telekom.com",              color: "#E20074" },
  "Mayo Clinic":                    { domain: "mayoclinic.org",           color: "#005EB8" },
  "TidalHealth Peninsula Regional": { domain: "tidalhealth.org",          color: "#004B8D" },
  "AstraZeneca":                    { domain: "astrazeneca.com",          color: "#830051" },
  "Valley Medical Center":          { domain: "valleymed.org",            color: "#003366" },
  "Grupo Globo S.A.":               { domain: "globo.com",                color: "#004B8D" },
  "TELUS":                          { domain: "telus.com",                color: "#4B286D" },
  "BMW Group":                      { domain: "bmwgroup.com",             color: "#1C69D4" },
  "Porto Seguro":                   { domain: "portoseguro.com.br",       color: "#E30613" },
  "Telefónica":                     { domain: "telefonica.com",           color: "#0066FF" },
  "Mengniu Dairy":                  { domain: "mengniu.com.cn",           color: "#E31837" },
  "Wayfair LLC":                    { domain: "wayfair.com",              color: "#7B2D8B" },
  "Levi Strauss & Co.":             { domain: "levistrauss.com",          color: "#C41E3A" },
  "Allbirds, Inc.":                 { domain: "allbirds.com",             color: "#5C5C5C" },
  "Paramount Global":               { domain: "paramount.com",            color: "#003087" },
  "Warner Bros. Discovery":         { domain: "wbd.com",                  color: "#0D2481" },
  "National University of Singapore":{ domain: "nus.edu.sg",             color: "#003D7C" },
  "Renault":                        { domain: "renaultgroup.com",         color: "#FFCC00" },
  "ThredUp":                        { domain: "thredup.com",              color: "#006B5B" },
  "ENGIE":                          { domain: "engie.com",                color: "#00AAFF" },
  "Iberdrola":                      { domain: "iberdrola.com",            color: "#007BC4" },
  "SoftBank Corp.":                 { domain: "softbank.jp",              color: "#CC0000" },
  "Ulta Beauty":                    { domain: "ulta.com",                 color: "#C41E3A" },
  "Perry Ellis International":      { domain: "perryellis.com",           color: "#1A1A1A" },
  "Whatnot":                        { domain: "whatnot.com",              color: "#7B2FBE" },
  "CBS News":                       { domain: "cbsnews.com",              color: "#003087" },
  "PT Telekomunikasi Selular (Telkomsel)": { domain: "telkomsel.com",     color: "#FF0000" },
  "Casio UK":                       { domain: "casio.co.uk",              color: "#003087" },
  "Takeda Pharmaceutical Company Limited": { domain: "takeda.com",        color: "#CC0000" },
  "City of Los Angeles (SmartLA 2028 Initiative)": { domain: "lacity.org",color: "#003DA5" },
  "Daily Maverick":                 { domain: "dailymaverick.co.za",      color: "#CC0000" },
  "Enel":                           { domain: "enel.com",                 color: "#009530" },
  "Singtel":                        { domain: "singtel.com",              color: "#E30613" },
  "SK Telecom":                     { domain: "sktelecom.com",            color: "#FF0000" },
  "Michael Kors":                   { domain: "michaelkors.com",          color: "#1A1A1A" },
  "Crane Worldwide Logistics":      { domain: "craneww.com",              color: "#E31837" },
  "Tomorrow.io":                    { domain: "tomorrow.io",              color: "#1976D2" },
  "Pegatron":                       { domain: "pegatroncorp.com",         color: "#0066CC" },
  "Farmonaut":                      { domain: "farmonaut.com",            color: "#388E3C" },
  "SpreeAI":                        { domain: "spreeai.com",              color: "#6B21A8" },
  "Symbrosia":                      { domain: "symbrosia.com",            color: "#00695C" },
  "Zee Entertainment Enterprises Limited": { domain: "zee.com",           color: "#003087" },
  "Wayfair":                        { domain: "wayfair.com",              color: "#7B2D8B" },
  "Forbes":                         { domain: "forbes.com",               color: "#CC0000" },
  "ShopMy":                         { domain: "shopmy.us",                color: "#1A1A2E" },
  "Red Barn Robotics":              { domain: "redbarnrobotics.com",      color: "#CC0000" },
  "Standard AI":                    { domain: "standard.ai",              color: "#1A1A1A" },
  "Best Home Furnishings":          { domain: "besthf.com",               color: "#003087" },
  "Starbucks":                      { domain: "starbucks.com",            color: "#00704A" },
  "Comcast":                        { domain: "comcast.com",              color: "#000000" },
  "Deliveroo":                      { domain: "deliveroo.com",            color: "#00CCBC" },
  "Scribd":                         { domain: "scribd.com",               color: "#1A7BB9" },
  "Cerner Corporation":             { domain: "cerner.com",               color: "#0070C0" },
  "Ankor":                          { domain: "ankorstore.com",           color: "#2C3E50" },
  "Plenitude":                      { domain: "plenitude.eni.com",        color: "#27AE60" },
  "Toca Boca":                      { domain: "tocaboca.com",             color: "#E74C3C" },
};

function getCompanyLogo(name: string): { domain: string; color: string } {
  // Exact match first
  if (COMPANY_LOGO_MAP[name]) return COMPANY_LOGO_MAP[name];
  // Partial match
  const key = Object.keys(COMPANY_LOGO_MAP).find(k =>
    name.toLowerCase().includes(k.toLowerCase().split(" ")[0]) ||
    k.toLowerCase().includes(name.toLowerCase().split(" ")[0])
  );
  if (key) return COMPANY_LOGO_MAP[key];
  // Fallback: derive domain from name
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 12);
  return { domain: `${slug}.com`, color: "#0f2644" };
}


// ─────────────────────────────────────────────
// CLEARBIT LOGO — fetches real company logo from Clearbit API
// Falls back to brand-colored circle with initials
// ─────────────────────────────────────────────
function ClearbitLogo({ name, domain, color, size = 40 }: { name: string; domain: string; color: string; size?: number }) {
  const [err, setErr] = useState(false);
  const initials = name.split(" ").filter(w => w.length > 1 && !/^(Inc|Ltd|plc|LLC|Corp|Co|Group|SA|AG|NV|BV|GmbH|Sdn|Bhd|AB|AS|Pvt|&|and|the|of)$/i.test(w)).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const localSrc = COMPANY_LOGOS[name];
  if (localSrc) {
    return (
      <img src={localSrc} alt={name} className="object-contain rounded-sm bg-white"
        style={{ width: size, height: size }} />
    );
  }
  if (err) {
    return (
      <div className="rounded-lg flex items-center justify-center font-black text-white flex-shrink-0"
        style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.32 }}>
        {initials}
      </div>
    );
  }
  return (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={name}
      className="object-contain rounded-sm"
      style={{ width: size, height: size }}
      onError={() => setErr(true)}
    />
  );
}

// ─────────────────────────────────────────────
// COMPANY LOGO BOX — white rounded container with Clearbit logo + fallback
// ─────────────────────────────────────────────
function CompanyLogoBox({ name, domain, color, size = 48 }: { name: string; domain: string; color: string; size?: number }) {
  const [err, setErr] = useState(false);
  const initials = name.split(" ").filter(w => w.length > 1).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const localSrc = COMPANY_LOGOS[name];
  return (
    <div
      className="rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 bg-white shadow-sm"
      style={{ width: size, height: size, minWidth: size }}>
      {localSrc ? (
        <img src={localSrc} alt={name} className="object-contain p-1.5"
          style={{ width: size - 8, height: size - 8 }} />
      ) : !err ? (
        <img
          src={`https://logo.clearbit.com/${domain}`}
          alt={name}
          className="object-contain p-1.5"
          style={{ width: size - 8, height: size - 8 }}
          onError={() => setErr(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center rounded-xl" style={{ backgroundColor: color }}>
          <span className="font-black text-white leading-none" style={{ fontSize: size * 0.28 }}>{initials}</span>
        </div>
      )}
    </div>
  );
}

function CompanyCardHero({ customer, industry, score }: { customer: Customer; industry: string; score: number }) {
  const { domain, color } = getCompanyLogo(customer.name);
  const logoUrl = `https://logo.clearbit.com/${domain}`;
  const [imgError, setImgError] = useState(false);
  const tier = getScoreTier(score);
  const initials = customer.name.split(" ").filter(w => w.length > 1).slice(0, 2).map(w => w[0]).join("").toUpperCase();

  // Industry → gradient background color pair
  const industryBg: Record<string, string> = {
    "Financial Services":       "#003366",
    "Healthcare & Life Sciences":"#004466",
    "Media & Entertainment":    "#1a1a2e",
    "Retail & Consumer":        "#2d1b4e",
    "Telecommunications":       "#0d3b2e",
    "Energy & Utilities":       "#1a2e1a",
    "Automotive":               "#1a1a1a",
    "Manufacturing":            "#1a2233",
    "Education & Research":     "#3b1a1a",
    "Technology":               "#0f2644",
  };
  const bgColor = industryBg[industry] ?? "#0f2644";

  return (
    <div className="relative h-[150px] overflow-hidden flex-shrink-0" style={{ backgroundColor: bgColor }}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/40" />

      {/* Logo centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        {!imgError ? (
          <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center p-2 overflow-hidden">
            <img
              src={logoUrl}
              alt={customer.name}
              className="w-full h-full object-contain"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          // Fallback: branded color circle with initials
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/20"
            style={{ backgroundColor: color }}>
            <span className="text-[22px] font-black text-white leading-none">{initials}</span>
          </div>
        )}
      </div>

      {/* Score badge — top right */}
      <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-black z-10 ${
        tier === "High" ? "bg-[#1EDD7D] text-[#0f2644]" :
        tier === "Medium" ? "bg-amber-400 text-white" : "bg-red-400 text-white"
      }`}>
        {score.toFixed(1)}/5
      </div>

      {/* Industry label — bottom left */}
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent z-10">
        <span className="text-[10px] font-bold uppercase tracking-[.07em] text-white">{industry}</span>
      </div>
    </div>
  );
}
function getIndustryLabel(c: Customer): string {
  const f = c.businessFocus.toLowerCase();
  if (f.includes("bank") || f.includes("financ") || f.includes("insurance") || f.includes("invest")) return "Financial Services";
  if (f.includes("health") || f.includes("clinic") || f.includes("pharma") || f.includes("medical") || f.includes("hospital")) return "Healthcare & Life Sciences";
  if (f.includes("stream") || f.includes("media") || f.includes("entertainment") || f.includes("content")) return "Media & Entertainment";
  if (f.includes("retail") || f.includes("footwear") || f.includes("apparel") || f.includes("ecommerce") || f.includes("e-commerce")) return "Retail & Consumer";
  if (f.includes("telecom") || f.includes("mobile") || f.includes("carrier") || f.includes("wireless")) return "Telecommunications";
  if (f.includes("energy") || f.includes("utility") || f.includes("renewable") || f.includes("electric")) return "Energy & Utilities";
  if (f.includes("auto") || f.includes("vehicle") || f.includes("car") || f.includes("mobility")) return "Automotive";
  if (f.includes("manufactur") || f.includes("appliance") || f.includes("industrial")) return "Manufacturing";
  if (f.includes("university") || f.includes("research") || f.includes("academic") || f.includes("education")) return "Education & Research";
  if (f.includes("software") || f.includes("cloud") || f.includes("technology") || f.includes("ai") || f.includes("data")) return "Technology";
  return "Enterprise";
}

function getRegionLabel(hq: string): string {
  const map: Record<string, string> = {
    USA: "North America", Canada: "North America", Brazil: "Latin America", France: "Europe",
    Germany: "Europe", UK: "Europe", Spain: "Europe", Japan: "Asia Pacific", China: "Asia Pacific",
    Singapore: "Asia Pacific", "South Korea": "Asia Pacific", India: "Asia Pacific",
    UAE: "Middle East & Africa", Nigeria: "Middle East & Africa",
  };
  return map[hq] ?? hq;
}


function CardsPage({ onOpen }: { onOpen: (c: Customer) => void }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"score-desc" | "score-asc" | "name-asc">("score-desc");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [selectedTRLs, setSelectedTRLs] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  // Derive unique filter options
  const allIndustries = useMemo(() => Array.from(new Set(ALL_CUSTOMERS.map(getIndustryLabel))).sort(), []);
  const allRegions = useMemo(() => Array.from(new Set(ALL_CUSTOMERS.map(c => getRegionLabel(c.hq)))).sort(), []);

  // Score tier maps to "Investment Capacity" tiers
  const tierOptions = ["High (≥4.0)", "Medium (2.5–4.0)", "Low (<2.5)"];
  const trlOptions = ["Score 5/5", "Score 4/5", "Score 3/5", "Score ≤2/5"];

  const toggleItem = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const clearAll = () => {
    setSearch(""); setSortBy("score-desc");
    setSelectedIndustries([]); setSelectedRegions([]);
    setSelectedTiers([]); setSelectedTRLs([]);
  };

  const hasActiveFilters = search || selectedIndustries.length || selectedRegions.length || selectedTiers.length || selectedTRLs.length;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = ALL_CUSTOMERS.filter(c => {
      if (q && !c.name.toLowerCase().includes(q) && !c.businessFocus.toLowerCase().includes(q) && !c.hq.toLowerCase().includes(q)) return false;
      if (selectedIndustries.length && !selectedIndustries.includes(getIndustryLabel(c))) return false;
      if (selectedRegions.length && !selectedRegions.includes(getRegionLabel(c.hq))) return false;
      if (selectedTiers.length) {
        const tier = getScoreTier(c.score);
        const match = selectedTiers.some(t =>
          (t.startsWith("High") && tier === "High") ||
          (t.startsWith("Medium") && tier === "Medium") ||
          (t.startsWith("Low") && tier === "Low")
        );
        if (!match) return false;
      }
      if (selectedTRLs.length) {
        const maxC = Math.max(...c.criteria);
        const match = selectedTRLs.some(t =>
          (t === "Score 5/5" && maxC === 5) ||
          (t === "Score 4/5" && maxC === 4) ||
          (t === "Score 3/5" && maxC === 3) ||
          (t === "Score ≤2/5" && maxC <= 2)
        );
        if (!match) return false;
      }
      return true;
    });
    if (sortBy === "score-desc") result = result.sort((a, b) => b.score - a.score);
    else if (sortBy === "score-asc") result = result.sort((a, b) => a.score - b.score);
    else if (sortBy === "name-asc") result = result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [search, sortBy, selectedIndustries, selectedRegions, selectedTiers, selectedTRLs]);

  return (
    <div className="flex gap-0 h-[calc(100vh-195px)]">

      {/* ═══════════════════════════════════
          LEFT FILTER PANEL
          ═══════════════════════════════════ */}
      <div className="w-[220px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-y-auto">
        {/* Filter header */}
        <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" fill="none" stroke="#0f2644" strokeWidth="2" viewBox="0 0 24 24">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            <span className="text-[13px] font-bold text-[#0f2644]">Filter</span>
          </div>
          <button onClick={clearAll} className={`text-[11px] font-semibold transition-colors ${hasActiveFilters ? "text-[#15b865] hover:text-[#0f2644]" : "text-slate-400 hover:text-slate-600"}`}>
            Clear All
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-4">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers…"
                className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 bg-[#f8fafc] outline-none focus:border-[#1EDD7D] transition-colors" />
            </div>
          </div>

          {/* Sort By */}
          <FilterSection title="Sort By">
            <div className="flex flex-col gap-1.5">
              {[
                { val: "score-desc", label: "Score: High → Low" },
                { val: "score-asc",  label: "Score: Low → High" },
                { val: "name-asc",   label: "Name: A → Z" },
              ].map(opt => (
                <label key={opt.val} className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${sortBy === opt.val ? "bg-[#edfdf5] border border-[#a7f3d0]" : "hover:bg-slate-50"}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${sortBy === opt.val ? "border-[#1EDD7D]" : "border-slate-300"}`}>
                    {sortBy === opt.val && <div className="w-2 h-2 rounded-full bg-[#1EDD7D]" />}
                  </div>
                  <input type="radio" name="sort" value={opt.val} checked={sortBy === opt.val} onChange={() => setSortBy(opt.val as typeof sortBy)} className="sr-only" />
                  <span className={`text-[12px] ${sortBy === opt.val ? "font-semibold text-[#0f2644]" : "text-slate-500"}`}>{opt.label}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Priority Tier */}
          <FilterSection title="Priority Tier">
            <div className="flex flex-col gap-1.5">
              {tierOptions.map(t => (
                <label key={t} className="flex items-center gap-2.5 px-1 py-1 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${selectedTiers.includes(t) ? "border-[#1EDD7D] bg-[#1EDD7D]" : "border-slate-300 group-hover:border-slate-400"}`}>
                    {selectedTiers.includes(t) && <svg width="9" height="9" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <input type="checkbox" checked={selectedTiers.includes(t)} onChange={() => toggleItem(selectedTiers, setSelectedTiers, t)} className="sr-only" />
                  <span className="text-[12px] text-slate-500 group-hover:text-slate-700 transition-colors">{t}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Industry */}
          <FilterSection title="Industry">
            <div className="flex flex-col gap-1.5">
              {allIndustries.map(ind => {
                const count = ALL_CUSTOMERS.filter(c => getIndustryLabel(c) === ind).length;
                return (
                  <label key={ind} className="flex items-center gap-2.5 px-1 py-1 cursor-pointer group">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${selectedIndustries.includes(ind) ? "border-[#1EDD7D] bg-[#1EDD7D]" : "border-slate-300 group-hover:border-slate-400"}`}>
                      {selectedIndustries.includes(ind) && <svg width="9" height="9" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                    <input type="checkbox" checked={selectedIndustries.includes(ind)} onChange={() => toggleItem(selectedIndustries, setSelectedIndustries, ind)} className="sr-only" />
                    <span className="text-[11px] text-slate-500 group-hover:text-slate-700 flex-1 leading-tight">{ind}</span>
                    <span className="text-[10px] font-semibold text-slate-300">{count}</span>
                  </label>
                );
              })}
            </div>
          </FilterSection>

          {/* Region */}
          <FilterSection title="Region" defaultOpen={false}>
            <div className="flex flex-col gap-1.5">
              {allRegions.map(reg => {
                const count = ALL_CUSTOMERS.filter(c => getRegionLabel(c.hq) === reg).length;
                return (
                  <label key={reg} className="flex items-center gap-2.5 px-1 py-1 cursor-pointer group">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${selectedRegions.includes(reg) ? "border-[#1EDD7D] bg-[#1EDD7D]" : "border-slate-300 group-hover:border-slate-400"}`}>
                      {selectedRegions.includes(reg) && <svg width="9" height="9" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                    <input type="checkbox" checked={selectedRegions.includes(reg)} onChange={() => toggleItem(selectedRegions, setSelectedRegions, reg)} className="sr-only" />
                    <span className="text-[11px] text-slate-500 group-hover:text-slate-700 flex-1">{reg}</span>
                    <span className="text-[10px] font-semibold text-slate-300">{count}</span>
                  </label>
                );
              })}
            </div>
          </FilterSection>

        </div>
      </div>

      {/* ═══════════════════════════════════
          MAIN CARDS AREA
          ═══════════════════════════════════ */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-white">
          <div>
            <h2 className="text-[16px] font-bold text-[#0f2644] leading-none">Customer Cards</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              <span className="text-[#0f2644] font-semibold">{filtered.length}</span>
              <span className="text-slate-300 mx-1">of</span>
              {ALL_CUSTOMERS.length} customers
            </p>
          </div>
          {/* Card / Table toggle */}
          <div className="flex items-center gap-1 bg-[#f4f6f9] rounded-lg p-1 border border-slate-200">
            <button onClick={() => setViewMode("card")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all ${viewMode === "card" ? "bg-white text-[#0f2644] shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"}`}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
              Card View
            </button>
            <button onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all ${viewMode === "table" ? "bg-white text-[#0f2644] shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"}`}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
              Table View
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="mb-3 opacity-40"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <p className="text-[13px] font-medium">No customers match the current filters</p>
              <button onClick={clearAll} className="mt-2 text-[12px] text-[#15b865] hover:underline">Clear all filters</button>
            </div>
          )}

          {/* ── CARD VIEW ── */}
          {viewMode === "card" && filtered.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {filtered.map((c) => {
                const industry = getIndustryLabel(c);
                const tier = getScoreTier(c.score);
                const { domain, color } = getCompanyLogo(c.name);
                const score100 = c.score.toFixed(1);

                // Company size label — from Excel "Company Size" field
                const sizeStr = c.size ?? "";
                const sizeNum = parseInt(sizeStr.replace(/[^0-9]/g, "")) || 0;
                const sizeLabel = sizeNum >= 100000 ? "Large Enterprise" : sizeNum >= 10000 ? "Enterprise" : sizeNum >= 1000 ? "Mid-Market" : "SME";

                const growthPositive = c.revenueGrowth && !c.revenueGrowth.startsWith("-");

                return (
                  <div key={c.name} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-[#1EDD7D]/40 transition-all flex flex-col group cursor-pointer" onClick={() => onOpen(c)}>
                    <div className="p-4 flex flex-col gap-3 flex-1">

                      {/* ── ROW 1: Logo + Name + Score ── */}
                      <div className="flex items-start gap-3">
                        <CompanyLogoBox name={c.name} domain={domain} color={color} size={56} />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-1">
                            <h3 className="text-[13px] font-bold text-[#0f2644] leading-snug group-hover:text-[#15b865] transition-colors line-clamp-2 flex-1">{c.name}</h3>
                            <svg width="11" height="11" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          </div>
                          {/* HQ · Size — from Excel */}
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                              <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                              {c.hq}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                              <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                              {sizeLabel}
                            </div>
                          </div>
                        </div>

                        {/* Overall Score — from Excel */}
                        <div className="flex-shrink-0 flex flex-col items-center">
                          <span className="text-[22px] font-black text-[#0f2644] leading-none">{score100}<span className="text-[13px] font-semibold text-slate-400">/5</span></span>
                          <span className="text-[9px] font-bold uppercase tracking-[.06em] text-slate-400">Score</span>
                        </div>
                      </div>

                      {/* ── Industry + Market Segment + Priority tags — NO duplicate HQ ── */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[10px] font-medium px-2.5 py-1 rounded-full border border-slate-200 text-slate-600 bg-white">{industry}</span>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          tier === "High" ? "bg-[#edfdf5] border-[#a7f3d0] text-[#15b865]" :
                          tier === "Medium" ? "bg-amber-50 border-amber-200 text-amber-700" :
                          "bg-red-50 border-red-200 text-red-500"
                        }`}>{tier} Priority</span>
                      </div>

                      {/* ── Business Focus — from Excel ── */}
                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{c.businessFocus}</p>

                      {/* ── Financial grid — 2x2 matching Image 2 reference ── */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-100 pt-3 mt-auto">
                        <div>
                          <div className="text-[10px] font-bold text-[#0f2644] mb-0.5">Employees</div>
                          <div className="text-[11px] text-slate-500">{c.size || "—"}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-[#0f2644] mb-0.5">Revenue</div>
                          <div className="text-[11px] text-slate-500">{c.revenue || "—"}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-[#0f2644] mb-0.5">Net Margins %</div>
                          <div className="text-[11px] text-slate-500">{c.netMargin || "—"}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-[#0f2644] mb-0.5">Revenue Growth %</div>
                          <div className={`text-[11px] font-semibold ${growthPositive ? "text-[#1EDD7D]" : "text-red-500"}`}>{c.revenueGrowth || "—"}</div>
                        </div>
                      </div>

                      {/* ── Business Focus label row (matches Image 2) ── */}
                      <div>
                        <div className="text-[10px] font-bold text-[#0f2644] mb-0.5">Business Focus</div>
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">{c.businessFocus}</p>
                      </div>
                    </div>

                    {/* ── Bottom: Vendors count + View Details ── */}
                    <div className="px-4 pb-4 flex items-center justify-between gap-3">
                      <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-500">
                        {c.vendors.length} Vendor{c.vendors.length !== 1 ? "s" : ""}
                      </span>
                      <button
                        onClick={e => { e.stopPropagation(); onOpen(c); }}
                        className="flex items-center gap-1.5 text-[12px] font-semibold text-[#1a56db] hover:text-[#0f2644] transition-colors">
                        View Details
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── TABLE VIEW ── */}
          {viewMode === "table" && filtered.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f4f6f9] border-b border-slate-200">
                      {["#", "Customer", "Industry", "Region", "Revenue", "Growth", "Relevancy", "Score"].map(h => (
                        <th key={h} className="px-3.5 py-2.5 text-left text-[11px] font-bold uppercase tracking-[.04em] text-slate-500 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c, i) => (
                      <tr key={c.name} onClick={() => onOpen(c)} className="cursor-pointer border-b border-slate-50 hover:bg-[#edfdf5]/30 transition-colors">
                        <td className="px-3.5 py-3 text-[12px] text-slate-300 font-mono">{String(i + 1).padStart(2, "0")}</td>
                        <td className="px-3.5 py-3 min-w-[180px]">
                          <div className="text-[12px] font-semibold text-[#0f2644]">{c.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{c.hq}</div>
                        </td>
                        <td className="px-3.5 py-3">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#f4f6f9] text-slate-500 whitespace-nowrap">{getIndustryLabel(c)}</span>
                        </td>
                        <td className="px-3.5 py-3 text-[11px] text-slate-500">{getRegionLabel(c.hq)}</td>
                        <td className="px-3.5 py-3 text-[12px] font-semibold text-[#0f2644] whitespace-nowrap">{c.revenue || "—"}</td>
                        <td className="px-3.5 py-3">
                          <span className={`text-[11px] font-bold ${c.revenueGrowth?.startsWith("-") ? "text-red-500" : "text-[#15b865]"}`}>{c.revenueGrowth || "—"}</span>
                        </td>
                        <td className="px-3.5 py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getScoreTier(c.score) === "High" ? "bg-[#edfdf5] text-[#15b865]" : getScoreTier(c.score) === "Medium" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-500"}`}>{getScoreTier(c.score)}</span>
                        </td>
                        <td className="px-3.5 py-3">
                          <span className={`text-[12px] font-black px-2.5 py-0.5 rounded-full border ${getScoreBg(c.score)}`}>{c.score.toFixed(1)}/5</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// EVALUATION PAGE
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// SCORE BADGE — large rounded square, dark/light green
// ─────────────────────────────────────────────
function ScoreBadge({ value, size = "md" }: { value: number; size?: "sm" | "md" | "lg" }) {
  const dim = size === "lg" ? "w-14 h-14 text-[22px]" : size === "md" ? "w-11 h-11 text-[18px]" : "w-8 h-8 text-[13px]";
  const bg =
    value === 5 ? "bg-[#0d6e3f]" :
    value === 4 ? "bg-[#1EDD7D]" :
    value === 3 ? "bg-[#6ee7b7]" :
    value === 2 ? "bg-amber-400" : "bg-red-400";
  const text = value >= 3 ? "text-white" : "text-white";
  return (
    <div className={`${dim} ${bg} ${text} rounded-[10px] flex items-center justify-center font-black shadow-sm flex-shrink-0`}>
      {value}
    </div>
  );
}

// Descriptive label for each criterion value
function criterionLabel(colIdx: number, value: number): string {
  const maps: Record<number, Record<number, string>> = {
    0: { 5: "Perfect Fit", 4: "Strong Fit", 3: "Good Fit", 2: "Partial", 1: "Weak" },           // Industry Alignment
    1: { 5: "Hyper Growth", 4: "High Growth", 3: "Moderate", 2: "Slow", 1: "Declining" },         // Growth
    2: { 5: "Critical Gap", 4: "High Gap", 3: "Moderate", 2: "Low Gap", 1: "Minimal" },           // Tech Gaps
    3: { 5: "Fully Aligned", 4: "Well Aligned", 3: "Aligned", 2: "Partial", 1: "Low" },           // Strategic
    4: { 5: "Global", 4: "Multi-Region", 3: "Regional", 2: "Local", 1: "Limited" },               // Geo Reach
    5: { 5: "Enterprise", 4: "High Cap", 3: "Medium", 2: "Limited", 1: "Minimal" },               // Investment Cap
  };
  return maps[colIdx]?.[value] ?? String(value);
}

// ─────────────────────────────────────────────
// EVALUATION PAGE — reference image design
// ─────────────────────────────────────────────
function EvalPage({ onOpen }: { onOpen: (c: Customer) => void }) {
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<number | "score" | "name">("score");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [filterMarkets, setFilterMarkets] = useState<string[]>([]);
  const [filterTiers, setFilterTiers] = useState<string[]>([]);
  const [filterRegions, setFilterRegions] = useState<string[]>([]);

  const coreNames  = useMemo(() => CORE_MARKETS.flatMap(m => m.companies), []);
  const adjNames   = useMemo(() => ADJACENT_MARKETS.flatMap(m => m.companies), []);
  const emgNames   = useMemo(() => EMERGING_MARKETS.flatMap(m => m.companies), []);
  const getMarket  = (name: string) => coreNames.includes(name) ? "Core Markets" : adjNames.includes(name) ? "Adjacent Markets" : emgNames.includes(name) ? "Emerging Markets" : "Other";
  const allRegions = useMemo(() => Array.from(new Set(ALL_CUSTOMERS.map(c => getRegionLabel(c.hq)))).sort(), []);

  const hasFilters = filterMarkets.length || filterTiers.length || filterRegions.length;
  const clearFilters = () => { setFilterMarkets([]); setFilterTiers([]); setFilterRegions([]); };

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const sorted = useMemo(() => {
    const q = search.toLowerCase();
    const base = [...ALL_CUSTOMERS].filter(c => {
      if (q && !c.name.toLowerCase().includes(q) && !c.hq.toLowerCase().includes(q)) return false;
      if (filterMarkets.length && !filterMarkets.includes(getMarket(c.name))) return false;
      if (filterRegions.length && !filterRegions.includes(getRegionLabel(c.hq))) return false;
      if (filterTiers.length) {
        const tier = getScoreTier(c.score);
        if (!filterTiers.includes(tier)) return false;
      }
      return true;
    });
    return base.sort((a, b) => {
      let av: number, bv: number;
      if (sortCol === "score") { av = a.score; bv = b.score; }
      else if (sortCol === "name") { return sortDir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name); }
      else { av = a.criteria[sortCol as number]; bv = b.criteria[sortCol as number]; }
      return sortDir === "desc" ? bv - av : av - bv;
    });
  }, [search, sortCol, sortDir, filterMarkets, filterTiers, filterRegions]);

  const toggleSort = (col: number | "score" | "name") => {
    if (sortCol === col) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortCol(col); setSortDir("desc"); }
  };

  const COL_DEFS = [
    { label: "Industry Alignment", sublabel: "(20%)", idx: 0, tip: "Measures how closely the customer's business model aligns with Databricks' target industries. Weight: 20%" },
    { label: "Growth", sublabel: "(20%)", idx: 1, tip: "Reflects revenue growth rate and market expansion velocity. Weight: 20%" },
    { label: "Technology / Solution Gaps", sublabel: "(20%)", idx: 2, tip: "Identifies technology gaps that Databricks Delta Engine can directly address. Weight: 20%" },
    { label: "Strategic Initiatives", sublabel: "(15%)", idx: 3, tip: "Tracks active strategic programs that align with Databricks capabilities. Weight: 15%" },
    { label: "Geographic Reach", sublabel: "(10%)", idx: 4, tip: "Evaluates the company's international presence and geographic footprint. Weight: 10%" },
    { label: "Investment Capacity", sublabel: "(15%)", idx: 5, tip: "Assesses the company's budget and willingness to invest in AI/ML platforms. Weight: 15%" },
  ];

  const [activeTooltip, setActiveTooltip] = useState<{ label: string; tip: string; x: number; y: number } | null>(null);

  const getMarketCategory = (name: string) => {
    if (coreNames.includes(name)) return { label: "Core Markets", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" };
    if (adjNames.includes(name))  return { label: "Adjacent Markets", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" };
    if (emgNames.includes(name))  return { label: "Emerging Markets", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" };
    return null;
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-200px)]">

      {/* ── LEFT FILTER PANEL ── */}
      <div className="w-[210px] flex-shrink-0 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <svg width="13" height="13" fill="none" stroke="#0f2644" strokeWidth="2" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            <span className="text-[12px] font-bold text-[#0f2644]">Filter</span>
          </div>
          <button onClick={clearFilters} className={`text-[11px] font-semibold transition-colors ${hasFilters ? "text-[#15b865] hover:text-[#0f2644]" : "text-slate-400 hover:text-slate-600"}`}>
            Clear All
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-4 flex flex-col gap-5">

          {/* Priority Tier */}
          <div>
            <div className="text-[10px] font-black text-[#0f2644] uppercase tracking-[.08em] mb-2">Priority Tier</div>
            {["High", "Medium", "Low"].map(t => (
              <label key={t} className="flex items-center gap-2 py-1 cursor-pointer group">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${filterTiers.includes(t) ? "border-[#1EDD7D] bg-[#1EDD7D]" : "border-slate-300 group-hover:border-slate-400"}`}>
                  {filterTiers.includes(t) && <svg width="9" height="9" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <input type="checkbox" checked={filterTiers.includes(t)} onChange={() => toggle(filterTiers, setFilterTiers, t)} className="sr-only" />
                <span className="text-[11px] text-slate-500 group-hover:text-slate-700">{t} Priority</span>
              </label>
            ))}
          </div>

          {/* Market Category */}
          <div>
            <div className="text-[10px] font-black text-[#0f2644] uppercase tracking-[.08em] mb-2">Market Category</div>
            {["Core Markets", "Adjacent Markets", "Emerging Markets"].map(m => (
              <label key={m} className="flex items-center gap-2 py-1 cursor-pointer group">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${filterMarkets.includes(m) ? "border-[#1EDD7D] bg-[#1EDD7D]" : "border-slate-300 group-hover:border-slate-400"}`}>
                  {filterMarkets.includes(m) && <svg width="9" height="9" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <input type="checkbox" checked={filterMarkets.includes(m)} onChange={() => toggle(filterMarkets, setFilterMarkets, m)} className="sr-only" />
                <span className="text-[11px] text-slate-500 group-hover:text-slate-700">{m}</span>
              </label>
            ))}
          </div>

          {/* Region */}
          <div>
            <div className="text-[10px] font-black text-[#0f2644] uppercase tracking-[.08em] mb-2">Region</div>
            {allRegions.map(r => (
              <label key={r} className="flex items-center gap-2 py-1 cursor-pointer group">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${filterRegions.includes(r) ? "border-[#1EDD7D] bg-[#1EDD7D]" : "border-slate-300 group-hover:border-slate-400"}`}>
                  {filterRegions.includes(r) && <svg width="9" height="9" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <input type="checkbox" checked={filterRegions.includes(r)} onChange={() => toggle(filterRegions, setFilterRegions, r)} className="sr-only" />
                <span className="text-[11px] text-slate-500 group-hover:text-slate-700">{r}</span>
              </label>
            ))}
          </div>

        </div>
      </div>

      {/* ── RIGHT: TABLE AREA ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-4 overflow-hidden">
      {/* Header + search */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-bold text-[#0f2644] mb-0.5">Evaluation Scorecard</h2>
          <p className="text-[12px] text-slate-400">Ranked scoring matrix across all {ALL_CUSTOMERS.length} target customers</p>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers…"
              className="w-56 pl-8 pr-3 py-2 border-[1.5px] border-slate-200 rounded-xl text-[12px] bg-white text-slate-700 outline-none focus:border-[#1EDD7D] transition-colors shadow-sm" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 bg-[#f4f6f9] px-3 py-1.5 rounded-lg border border-slate-200">{sorted.length} customers</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
          <table className="w-full border-collapse">

            {/* ── HEADER ── */}
            <thead>
              <tr className="border-b-2 border-slate-100">
                {/* Rank */}
                <th className="sticky top-0 bg-white px-4 py-4 text-left w-10 z-10">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">#</span>
                </th>
                {/* Customer name */}
                <th className="sticky top-0 bg-white px-4 py-4 text-left min-w-[200px] z-10">
                  <button onClick={() => toggleSort("name")} className="flex items-center gap-1.5 group">
                    <span className="text-[12px] font-bold text-[#0f2644] group-hover:text-[#15b865] transition-colors">Company Name</span>
                    <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="text-slate-300">
                      {sortCol === "name" && sortDir === "desc" ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}
                    </svg>
                  </button>
                </th>
                {/* Market Category */}
                <th className="sticky top-0 bg-white px-4 py-4 text-center min-w-[155px] z-10">
                  <span className="text-[12px] font-bold text-[#0f2644] whitespace-nowrap">Market Category</span>
                </th>
                {/* Criteria columns */}
                {COL_DEFS.map(col => (
                  <th key={col.idx} className="sticky top-0 bg-white px-4 py-4 text-center min-w-[120px] z-10">
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="flex items-center gap-1 justify-center">
                        <button onClick={() => toggleSort(col.idx)} className="flex items-center gap-1 group">
                          <span className="text-[11px] font-bold text-[#0f2644] group-hover:text-[#15b865] transition-colors leading-tight text-center">{col.label}</span>
                          {sortCol === col.idx && (
                            <svg width="9" height="9" fill="none" stroke="#1EDD7D" strokeWidth="2.5" viewBox="0 0 24 24">
                              {sortDir === "desc" ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}
                            </svg>
                          )}
                        </button>
                        {/* Tooltip */}
                        <div className="relative flex-shrink-0">
                          <button
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setActiveTooltip({ label: col.label, tip: col.tip, x: rect.left + rect.width / 2, y: rect.bottom + 8 });
                            }}
                            onMouseLeave={() => setActiveTooltip(null)}
                            className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-slate-400 hover:border-[#1EDD7D] hover:text-[#15b865] transition-colors">
                            <svg width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                          </button>
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-400 font-semibold">{col.sublabel}</span>
                    </div>
                  </th>
                ))}
                {/* Overall Score */}
                <th className="sticky top-0 bg-white px-6 py-4 text-center min-w-[160px] z-10">
                  <button onClick={() => toggleSort("score")} className="flex items-center gap-1.5 justify-center group">
                    <span className="text-[12px] font-bold text-[#0f2644] group-hover:text-[#15b865] transition-colors">Overall Score</span>
                    <span className="text-[10px] text-slate-400">(Weighted)</span>
                    <svg width="9" height="9" fill="none" stroke={sortCol === "score" ? "#1EDD7D" : "currentColor"} strokeWidth="2.5" viewBox="0 0 24 24" className={sortCol !== "score" ? "text-slate-300" : ""}>
                      {sortCol === "score" && sortDir === "desc" ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}
                    </svg>
                  </button>
                </th>
              </tr>
            </thead>

            {/* ── ROWS ── */}
            <tbody>
              {sorted.map((c, i) => {
                const pct = (c.score / 5) * 100;
                const barColor = c.score >= 4.5 ? "#1EDD7D" : c.score >= 4.0 ? "#6ee7b7" : c.score >= 3.0 ? "#f59e0b" : "#ef4444";
                const mktCat = getMarketCategory(c.name);
                return (
                  <tr key={c.name} onClick={() => onOpen(c)}
                    className="cursor-pointer border-b border-slate-50 hover:bg-[#f8fdfb] transition-colors group">

                    {/* Rank */}
                    <td className="px-4 py-4 text-center">
                      <span className="text-[11px] font-black text-slate-300">{String(i + 1).padStart(2, "0")}</span>
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {COMPANY_LOGOS[c.name] ? (
                          <div className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                            <img src={COMPANY_LOGOS[c.name]} alt={c.name} className="object-contain w-8 h-8 p-0.5" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0f2644] to-[#1a4a7a] flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">
                            {c.name.split(" ").slice(0, 2).map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-[13px] font-bold text-[#1a56db] group-hover:text-[#15b865] transition-colors truncate max-w-[160px]">{c.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{c.hq}</div>
                        </div>
                      </div>
                    </td>

                    {/* Market Category */}
                    <td className="px-4 py-4 text-center">
                      {mktCat ? (
                        <span className={`inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${mktCat.bg} ${mktCat.text} ${mktCat.border}`}>
                          {mktCat.label}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">—</span>
                      )}
                    </td>

                    {/* Criteria badges */}
                    {COL_DEFS.map(col => {
                      const v = c.criteria[col.idx];
                      const bg = v === 5 ? "#15803d" : v === 4 ? "#1EDD7D" : v === 3 ? "#86efac" : v === 2 ? "#d1fae5" : "#94a3b8";
                      return (
                        <td key={col.idx} className="px-4 py-4 text-center">
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-[13px] font-black text-white shadow-sm mx-auto"
                            style={{ backgroundColor: bg }}>
                            {v}
                          </div>
                        </td>
                      );
                    })}

                    {/* Overall Score */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden min-w-[50px]">
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                        </div>
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <span className="text-[14px] font-black text-[#0f2644]">{c.score.toFixed(1)}</span>
                          <button className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-slate-400 flex-shrink-0">
                            <svg width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Evaluation Criteria Framework ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="text-[13px] font-bold text-[#0f2644] mb-4 flex items-center gap-2">
          <svg width="13" height="13" fill="none" stroke="#0f2644" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Evaluation Criteria Framework
        </div>
        <div className="grid grid-cols-6 gap-3">
          {CRITERIA_LABELS.map((label, i) => (
            <div key={label} className="flex flex-col items-start gap-2 p-3 rounded-xl bg-[#f4f6f9] border border-slate-200">
              <div className="w-2 h-2 rounded-full bg-[#1EDD7D]" />
              <div className="text-[12px] font-bold text-[#0f2644] leading-snug">{label}</div>
              <div className="text-[14px] font-extrabold text-[#1EDD7D]">{CRITERIA_WEIGHTS[i]}</div>
            </div>
          ))}
        </div>
      </div>

      </div>

      {/* ── FIXED TOOLTIP — outside all panels so never clipped ── */}
      {activeTooltip && (
        <div
          className="fixed z-[9999] w-56 bg-[#0f2644] text-white text-[11px] leading-relaxed px-3.5 py-3 rounded-xl shadow-2xl pointer-events-none"
          style={{
            left: Math.min(Math.max(activeTooltip.x - 112, 8), window.innerWidth - 240),
            top: activeTooltip.y,
          }}
        >
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0f2644] rotate-45" />
          {activeTooltip.tip}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// DOSSIER PAGE — card + table view with score >= 3 filter
// ─────────────────────────────────────────────
function DossierPage({ onOpen }: { onOpen: (c: Customer) => void }) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const coreNames = CORE_MARKETS.flatMap(m => m.companies);
  const adjNames  = ADJACENT_MARKETS.flatMap(m => m.companies);
  const emgNames  = EMERGING_MARKETS.flatMap(m => m.companies);

  const getMarket = (name: string) =>
    coreNames.includes(name) ? { label: "Core Market", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" }
    : adjNames.includes(name) ? { label: "Adjacent", bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" }
    : emgNames.includes(name) ? { label: "Emerging", bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" }
    : null;

  const buildReasons = (c: Customer) => [
    `The company operates within ${c.businessFocus.split(".")[0].slice(0, 80)}, which is identified as a core market for the client's offering.`,
    `The company reports a revenue growth of ${c.revenueGrowth}, which is ${parseFloat(c.revenueGrowth) >= 5 ? "well above the 5% threshold for the highest score" : "within the evaluated growth range"}.`,
    c.painPoints.filter(p => p.severity === "High").length > 0
      ? `Multiple high-severity pain points are identified, including ${c.painPoints.filter(p => p.severity === "High").slice(0, 2).map(p => p.point.toLowerCase().replace(/\.$/, "")).join(", ")}, indicating significant technology and solution needs.`
      : "Pain points have been documented, indicating active solution needs.",
    `The company has a mix of completed, scaling, and in-progress initiatives directly related to technology modernization and AI, demonstrating strong alignment and execution.`,
    `The company is described as having a strong geographical reach${c.hq ? ` (HQ: ${c.hq})` : ""}, indicating a robust and possibly global operational presence.`,
    `The company's net margin is ${c.netMargin}, which is ${parseFloat(c.netMargin) >= 15 ? "well above the 15% threshold, indicating strong investment capacity" : "within the evaluated investment capacity range"}.`,
  ];

  const sorted = useMemo(() => [...ALL_CUSTOMERS].filter(c => c.score >= 3).sort((a, b) => b.score - a.score), []);
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return q ? sorted.filter(c => c.name.toLowerCase().includes(q) || c.hq.toLowerCase().includes(q)) : sorted;
  }, [search, sorted]);

  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  return (
    <div className="flex flex-col gap-4">

      {/* ── HEADER BAR ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-[15px] font-black text-[#0f2644]">Dossier Profiles</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Ranked customer profiles with score ≥ 3.0 · {filtered.length} companies</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies…"
              className="pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-[12px] bg-white text-slate-700 outline-none focus:border-[#1EDD7D] transition-colors shadow-sm w-52" />
          </div>
          {/* View toggle */}
          <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
            <button onClick={() => setViewMode("card")}
              className={`px-3 py-2 flex items-center gap-1.5 text-[11px] font-semibold transition-all ${viewMode === "card" ? "bg-[#0f2644] text-white" : "text-slate-500 hover:bg-slate-50"}`}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              Cards
            </button>
            <button onClick={() => setViewMode("table")}
              className={`px-3 py-2 flex items-center gap-1.5 text-[11px] font-semibold transition-all border-l border-slate-200 ${viewMode === "table" ? "bg-[#0f2644] text-white" : "text-slate-500 hover:bg-slate-50"}`}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              Table
            </button>
          </div>
        </div>
      </div>

      {/* ── CARD VIEW ── */}
      {viewMode === "card" && (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((c, idx) => {
            const { color: logoColor } = getCompanyLogo(c.name);
            const initials = c.name.split(" ").filter(w => w.length > 1 && !/^(Inc|Ltd|plc|LLC|Corp|Co|Group|SA|AG|NV|BV|GmbH|&|and|the|of)$/i.test(w)).slice(0, 2).map(w => w[0]).join("").toUpperCase();
            const tier = getScoreTier(c.score);
            const market = getMarket(c.name);
            const reasons = buildReasons(c);
            const scoreBadgeBg = c.score >= 4.5 ? "#15803d" : c.score >= 4 ? "#1EDD7D" : c.score >= 3 ? "#86efac" : "#94a3b8";

            return (
              <div key={c.name} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#1EDD7D]/40 transition-all flex flex-col">
                {/* Card header */}
                <div className="px-4 pt-4 pb-3 border-b border-slate-100">
                  {/* Top row: logo + rank */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {COMPANY_LOGOS[c.name] ? (
                        <div className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                          <img src={COMPANY_LOGOS[c.name]} alt={c.name} className="object-contain w-9 h-9 p-0.5" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-[11px] font-black flex-shrink-0 shadow-sm" style={{ backgroundColor: logoColor }}>
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-[12px] font-black text-[#0f2644] leading-tight truncate">{c.name}</div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                          <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 14 6 14s6-8.75 6-14c0-3.314-2.686-6-6-6z"/></svg>
                          {c.hq}
                        </div>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-500 flex-shrink-0">
                      #{idx + 1}
                    </div>
                  </div>

                  {/* Tags row: Score + Priority + Market */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-slate-200 bg-[#f8fafc]">
                      <span className="text-[11px] font-black" style={{ color: scoreBadgeBg }}>{c.score.toFixed(1)}</span>
                      <span className="text-[9px] text-slate-400">/ 5.0</span>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                      tier === "High" ? "bg-[#edfdf5] text-[#15b865] border-[#a7f3d0]"
                      : tier === "Medium" ? "bg-amber-50 text-amber-600 border-amber-200"
                      : "bg-red-50 text-red-500 border-red-200"
                    }`}>{tier} Priority</span>
                    {market && (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${market.bg} ${market.text} ${market.border}`}>
                        {market.label}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="px-4 pt-3 pb-0">
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{c.businessFocus}</p>
                </div>

                {/* Reasoning — 2 bullets, no duplicate score */}
                <div className="px-4 py-3 flex-1">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <svg width="11" height="11" fill="none" stroke="#1EDD7D" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span className="text-[10px] font-bold text-[#0f2644]">Reasoning:</span>
                  </div>
                  <ul className="flex flex-col gap-1">
                    {reasons.slice(0, 2).map((r, ri) => (
                      <li key={ri} className="flex items-start gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0 mt-1.5" />
                        <p className="text-[10.5px] text-slate-500 leading-relaxed line-clamp-2">{r}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer */}
                <div className="px-4 pb-4">
                  <button onClick={() => onOpen(c)}
                    className="w-full flex items-center justify-center py-2 rounded-xl bg-[#edfdf5] border border-[#a7f3d0] text-[#059669] text-[11px] font-bold hover:bg-[#d1fae5] hover:border-[#6ee7b7] transition-colors">
                    View Profile →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TABLE VIEW ── */}
      {viewMode === "table" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-slate-200">
                <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-[.06em] w-8">#</th>
                <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-[.06em]">Company</th>
                <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-[.06em]">Market</th>
                <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-[.06em]">Score</th>
                <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-[.06em]">Priority</th>
                <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-[.06em]">Description</th>
                <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-[.06em]">Score Reasoning Statement</th>
                <th className="px-4 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-[.06em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c, idx) => {
                const { color: logoColor } = getCompanyLogo(c.name);
                const initials = c.name.split(" ").filter(w => w.length > 1 && !/^(Inc|Ltd|plc|LLC|Corp|Co|Group|SA|AG|NV|BV|GmbH|&|and|the|of)$/i.test(w)).slice(0, 2).map(w => w[0]).join("").toUpperCase();
                const tier = getScoreTier(c.score);
                const market = getMarket(c.name);
                const scoreBadgeBg = c.score >= 4.5 ? "#15803d" : c.score >= 4 ? "#1EDD7D" : c.score >= 3 ? "#86efac" : "#94a3b8";
                const topReason = buildReasons(c)[0];
                return (
                  <tr key={c.name} className="hover:bg-[#f8fffe] transition-colors">
                    <td className="px-4 py-3 text-[11px] text-slate-400 font-semibold">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        {COMPANY_LOGOS[c.name] ? (
                          <div className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                            <img src={COMPANY_LOGOS[c.name]} alt={c.name} className="object-contain w-7 h-7" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[9px] font-black flex-shrink-0" style={{ backgroundColor: logoColor }}>{initials}</div>
                        )}
                        <div>
                          <div className="text-[12px] font-bold text-[#0f2644] leading-tight">{c.name.length > 24 ? c.name.slice(0, 23) + "…" : c.name}</div>
                          <div className="text-[10px] text-slate-400">{c.hq}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {market ? (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${market.bg} ${market.text} ${market.border}`}>{market.label}</span>
                      ) : <span className="text-[10px] text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[13px] font-black" style={{ color: scoreBadgeBg }}>{c.score.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-400 ml-0.5">/5</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        tier === "High" ? "bg-[#edfdf5] text-[#15b865] border-[#a7f3d0]"
                        : tier === "Medium" ? "bg-amber-50 text-amber-600 border-amber-200"
                        : "bg-red-50 text-red-500 border-red-200"
                      }`}>{tier}</span>
                    </td>
                    <td className="px-4 py-3 max-w-[360px]">
                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{c.businessFocus}</p>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{topReason}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => onOpen(c)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#edfdf5] border border-[#a7f3d0] text-[#059669] text-[11px] font-bold hover:bg-[#d1fae5] hover:border-[#6ee7b7] transition-colors whitespace-nowrap">
                        View Profile →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// CUSTOMER PRIORITY QUADRANT MAP
// ─────────────────────────────────────────────
function getMarketSegment(c: Customer): "Core" | "Adjacent" | "Emerging" {
  const f = c.businessFocus.toLowerCase();
  // Core = FS, Healthcare, Technology — Databricks' proven verticals
  if (f.includes("bank") || f.includes("financ") || f.includes("invest") || f.includes("insurance")) return "Core";
  if (f.includes("health") || f.includes("clinic") || f.includes("pharma") || f.includes("medical")) return "Core";
  if (f.includes("stream") || f.includes("cloud") || f.includes("software") || f.includes("data")) return "Core";
  // Emerging = Education, Government, Agriculture, Logistics
  if (f.includes("university") || f.includes("research") || f.includes("education") || f.includes("government")) return "Emerging";
  if (f.includes("logistic") || f.includes("farm") || f.includes("agricult") || f.includes("carbon")) return "Emerging";
  // Adjacent = everything else: Retail, Telecom, Energy, Media, Auto, Manufacturing
  return "Adjacent";
}

const SEGMENT_COLORS: Record<string, string> = {
  Core: "#6baed6",
  Adjacent: "#fd8d3c",
  Emerging: "#74c476",
};
const SEGMENT_FILL: Record<string, string> = {
  Core: "rgba(107,174,214,0.65)",
  Adjacent: "rgba(253,141,60,0.65)",
  Emerging: "rgba(116,196,118,0.65)",
};

function CustomerPriorityQuadrant() {
  const [showNames, setShowNames] = useState(true);
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; customer: Customer } | null>(null);

  const coreNames = useMemo(() => CORE_MARKETS.flatMap(m => m.companies), []);
  const adjNames  = useMemo(() => ADJACENT_MARKETS.flatMap(m => m.companies), []);

  const getSegment = (name: string): "Core" | "Adjacent" | "Emerging" =>
    coreNames.includes(name) ? "Core" : adjNames.includes(name) ? "Adjacent" : "Emerging";

  // Compute axes from criteria data — matching reference axes
  const quadData = useMemo(() => ALL_CUSTOMERS.map(c => {
    // X: Strategic Fit = industry alignment (c[0]) × 0.35 + tech/solution gaps (c[2]) × 0.35 + strategic initiatives (c[3]) × 0.30
    const x = (c.criteria[0] * 0.35 + c.criteria[2] * 0.35 + c.criteria[3] * 0.30);
    // Y: Commercial Attractiveness = growth (c[1]) × 0.40 + investment capacity (c[5]) × 0.40 + geo reach (c[4]) × 0.20
    const y = (c.criteria[1] * 0.40 + c.criteria[5] * 0.40 + c.criteria[4] * 0.20);
    return { customer: c, x, y, segment: getSegment(c.name) };
  }), [coreNames, adjNames]);

  // SVG dimensions — wider to match reference
  const W = 960, H = 520;
  const PAD = { top: 50, right: 40, bottom: 80, left: 70 };
  const CW = W - PAD.left - PAD.right;
  const CH = H - PAD.top - PAD.bottom;

  const scaleX = (v: number) => (v / 5) * CW;
  const scaleY = (v: number) => CH - (v / 5) * CH;

  const ticks = [0, 1, 2, 3, 4, 5];
  const midX = scaleX(2.5);
  const midY = scaleY(2.5);

  // Bubble radius proportional to overall score — larger like reference
  const bubbleR = (c: Customer) => 8 + (c.score / 5) * 20;

  const handleMouseEnter = (e: React.MouseEvent<SVGCircleElement>, customer: Customer) => {
    const rect = (e.currentTarget.closest("svg") as SVGSVGElement).getBoundingClientRect();
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, customer });
    setHoveredName(customer.name);
  };
  const handleMouseLeave = () => { setTooltip(null); setHoveredName(null); };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <svg width="14" height="14" fill="none" stroke="#1EDD7D" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              <h3 className="text-[15px] font-black text-[#0f2644]">Customer Priority Quadrant Map</h3>
            </div>
            <p className="text-[11px] text-slate-500">
              <strong className="text-[#0f2644]">Strategic Fit</strong> (X) vs <strong className="text-[#0f2644]">Commercial Attractiveness</strong> (Y) · Bubble size = overall score
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-[11px] font-semibold text-slate-400">Labels</span>
            <div onClick={() => setShowNames(n => !n)}
              className={`relative w-9 h-5 rounded-full transition-colors ${showNames ? "bg-[#1EDD7D]" : "bg-slate-200"}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${showNames ? "translate-x-4" : "translate-x-0.5"}`} />
            </div>
          </label>
        </div>
      </div>

      {/* Chart */}
      <div className="px-4 pt-4 pb-2 overflow-x-auto">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 700 }}>
          <defs>
            <filter id="qs" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.1"/>
            </filter>
          </defs>
          <g transform={`translate(${PAD.left},${PAD.top})`}>

            {/* Quadrant background tints */}
            <rect x={0}    y={0}    width={midX}      height={midY}      fill="rgba(148,163,184,0.05)" />
            <rect x={midX} y={0}    width={CW - midX} height={midY}      fill="rgba(30,221,125,0.05)" />
            <rect x={0}    y={midY} width={midX}      height={CH - midY} fill="rgba(239,68,68,0.05)" />
            <rect x={midX} y={midY} width={CW - midX} height={CH - midY} fill="rgba(245,158,11,0.04)" />

            {/* Grid lines */}
            {ticks.map(t => (
              <g key={t}>
                <line x1={scaleX(t)} y1={0} x2={scaleX(t)} y2={CH} stroke="#f1f5f9" strokeWidth="1" />
                <line x1={0} y1={scaleY(t)} x2={CW} y2={scaleY(t)} stroke="#f1f5f9" strokeWidth="1" />
              </g>
            ))}

            {/* Quadrant dividers */}
            <line x1={midX} y1={0} x2={midX} y2={CH} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 4" />
            <line x1={0} y1={midY} x2={CW} y2={midY} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 4" />

            {/* Quadrant corner labels */}
            <text x={14} y={14} fontSize="9" fill="#94a3b8" fontWeight="700" letterSpacing="1.5">NURTURE MONITOR</text>
            <text x={CW - 10} y={14} textAnchor="end" fontSize="9" fill="#1EDD7D" fontWeight="700" letterSpacing="1.5">HIGH PRIORITY ENGAGE NOW</text>
            <text x={14} y={CH - 8} fontSize="9" fill="#ef4444" fontWeight="700" letterSpacing="1.5">LOW PRIORITY DISCARD</text>
            <text x={CW - 10} y={CH - 8} textAnchor="end" fontSize="9" fill="#f59e0b" fontWeight="700" letterSpacing="1.5">STRATEGIC FIT EVALUATION</text>

            {/* Axis ticks */}
            {ticks.map(t => (
              <g key={`tk-${t}`}>
                <text x={scaleX(t)} y={CH + 20} textAnchor="middle" fontSize="11" fill="#94a3b8">{t}</text>
                <text x={-12} y={scaleY(t) + 4} textAnchor="end" fontSize="11" fill="#94a3b8">{t}</text>
              </g>
            ))}

            {/* Axis labels */}
            <text x={CW / 2} y={CH + 48} textAnchor="middle" fontSize="12" fill="#64748b" fontWeight="600">Strategic Fit →</text>
            <text transform={`translate(-50,${CH / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fill="#64748b" fontWeight="600">Commercial Attractiveness ↑</text>

            {/* Bubbles — render in z-order (hovered on top) */}
            {[...quadData].sort((a, b) => (hoveredName === b.customer.name ? 1 : 0) - (hoveredName === a.customer.name ? 1 : 0)).map(({ customer: c, x, y, segment }) => {
              const cx = scaleX(x);
              const cy = scaleY(y);
              const r = bubbleR(c);
              const isHovered = hoveredName === c.name;
              const fill = SEGMENT_FILL[segment];
              const stroke = SEGMENT_COLORS[segment];
              return (
                <g key={c.name}>
                  <circle
                    cx={cx} cy={cy} r={isHovered ? r + 4 : r}
                    fill={fill}
                    stroke={isHovered ? stroke : "rgba(255,255,255,0.8)"}
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    style={{ cursor: "pointer", transition: "r 0.12s" }}
                    onMouseEnter={e => handleMouseEnter(e, c)}
                    onMouseLeave={handleMouseLeave}
                  />
                  {showNames && (
                    <text
                      x={cx} y={cy - r - 5}
                      textAnchor="middle" fontSize="8.5"
                      fill={isHovered ? "#0f2644" : "#64748b"}
                      fontWeight={isHovered ? "700" : "400"}
                      style={{ pointerEvents: "none" }}
                    >
                      {c.name.length > 20 ? c.name.slice(0, 18) + "…" : c.name}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Tooltip */}
          {tooltip && (() => {
            const c = tooltip.customer;
            const seg = getSegment(c.name);
            const tx = Math.min(tooltip.x + 16, W - 230);
            const ty = Math.max(tooltip.y - 10, 10);
            return (
              <g>
                <rect x={tx} y={ty} width={218} height={128} rx="10" fill="white" stroke="#e2e8f0" strokeWidth="1.5" filter="url(#qs)" />
                <text x={tx + 12} y={ty + 20} fontSize="11.5" fontWeight="800" fill="#0f2644">{c.name.length > 22 ? c.name.slice(0, 20) + "…" : c.name}</text>
                <text x={tx + 12} y={ty + 35} fontSize="9" fill="#94a3b8">{c.hq} · {seg} Market</text>
                <line x1={tx + 12} y1={ty + 42} x2={tx + 206} y2={ty + 42} stroke="#f1f5f9" strokeWidth="1" />
                <text x={tx + 12} y={ty + 57} fontSize="9.5" fill="#64748b">Overall Score:</text>
                <text x={tx + 206} y={ty + 57} textAnchor="end" fontSize="10" fontWeight="700" fill="#1EDD7D">{c.score.toFixed(1)} / 5.0</text>
                <text x={tx + 12} y={ty + 73} fontSize="9.5" fill="#64748b">Revenue:</text>
                <text x={tx + 206} y={ty + 73} textAnchor="end" fontSize="10" fontWeight="600" fill="#0f2644">{c.revenue || "N/A"}</text>
                <text x={tx + 12} y={ty + 89} fontSize="9.5" fill="#64748b">Growth:</text>
                <text x={tx + 206} y={ty + 89} textAnchor="end" fontSize="10" fontWeight="600" fill={c.revenueGrowth?.startsWith("-") ? "#ef4444" : "#1EDD7D"}>{c.revenueGrowth || "N/A"}</text>
                <text x={tx + 12} y={ty + 105} fontSize="9.5" fill="#64748b">Net Margin:</text>
                <text x={tx + 206} y={ty + 105} textAnchor="end" fontSize="10" fontWeight="600" fill={c.netMargin?.startsWith("-") ? "#ef4444" : "#0f2644"}>{c.netMargin || "N/A"}</text>
                <text x={tx + 12} y={ty + 120} fontSize="8.5" fill="#94a3b8" fontStyle="italic">{c.businessFocus.slice(0, 44)}…</text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-8 pb-4">
        {Object.entries(SEGMENT_COLORS).map(([seg, color]) => (
          <div key={seg} className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: color, opacity: 0.85 }} />
            <span className="text-[12px] text-slate-500 font-medium">{seg} Markets</span>
          </div>
        ))}
      </div>

      {/* Quadrant takeaway cards — 2×2 grid matching reference image */}
      <div className="grid grid-cols-2 gap-0 border-t border-slate-100">

        {/* Top-left: HIGH PRIORITY */}
        <div className="px-5 py-4 border-r border-b border-slate-100 bg-blue-50/40">
          <div className="flex items-center gap-2 mb-2">
            <svg width="13" height="13" fill="none" stroke="#2563eb" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/></svg>
            <span className="text-[10px] font-black uppercase tracking-[.08em] text-[#2563eb]">
              High Priority · Engage Now ({quadData.filter(d => d.x >= 2.5 && d.y >= 2.5).length} Companies)
            </span>
          </div>
          <p className="text-[11.5px] text-blue-800 leading-relaxed">
            These companies sit in the top-right quadrant with strong Strategic Fit and Commercial Attractiveness. Prioritise executive-level outreach and personalised Delta Engine demos within 30 days. Assign dedicated account executives and develop tailored ROI proposals for each.
          </p>
        </div>

        {/* Top-right: STRATEGIC FIT EVALUATION */}
        <div className="px-5 py-4 border-b border-slate-100 bg-green-50/40">
          <div className="flex items-center gap-2 mb-2">
            <svg width="13" height="13" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span className="text-[10px] font-black uppercase tracking-[.08em] text-[#16a34a]">
              Strategic Fit Evaluation (Mid-Right Zone)
            </span>
          </div>
          <p className="text-[11.5px] text-green-800 leading-relaxed">
            Companies with strong Strategic Fit but moderate Commercial Attractiveness are prime candidates for product-led growth. Initiate nurture sequences with targeted case studies, invite to Delta Engine webinars, and schedule discovery calls to assess budget readiness over the next 90 days.
          </p>
        </div>

        {/* Bottom-left: NURTURE / MONITOR */}
        <div className="px-5 py-4 border-r border-slate-100 bg-amber-50/40">
          <div className="flex items-center gap-2 mb-2">
            <svg width="13" height="13" fill="none" stroke="#d97706" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span className="text-[10px] font-black uppercase tracking-[.08em] text-[#d97706]">
              Nurture · Monitor ({quadData.filter(d => d.x < 2.5 && d.y >= 2.5).length} Companies)
            </span>
          </div>
          <p className="text-[11.5px] text-amber-800 leading-relaxed">
            Companies in the upper-left quadrant show Commercial Attractiveness but weaker Strategic Fit. Include in quarterly newsletter cadence, monitor for AI/ML initiative announcements, and re-evaluate if their technology strategy shifts toward data platform unification in the next 6–12 months.
          </p>
        </div>

        {/* Bottom-right: LOW PRIORITY */}
        <div className="px-5 py-4 bg-red-50/40">
          <div className="flex items-center gap-2 mb-2">
            <svg width="13" height="13" fill="none" stroke="#dc2626" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
            <span className="text-[10px] font-black uppercase tracking-[.08em] text-[#dc2626]">
              Low Priority · Discard ({quadData.filter(d => d.x < 2.5 && d.y < 2.5).length} Companies)
            </span>
          </div>
          <p className="text-[11.5px] text-red-800 leading-relaxed">
            These accounts have low Strategic Fit and low Commercial Attractiveness at this stage. Deprioritise for active sales investment. Archive in CRM with watch triggers (leadership change, funding round, AI budget announcement) and review annually or when key trigger events occur.
          </p>
        </div>

      </div>
    </div>
  );
}

  // SVG chart dimensions
  const W = 860, H = 440;
  const PAD = { top: 40, right: 30, bottom: 60, left: 60 };
  const CW = W - PAD.left - PAD.right;
  const CH = H - PAD.top - PAD.bottom;

  // Scale 0–5 → pixel
  const scaleX = (v: number) => (v / 5) * CW;
  const scaleY = (v: number) => CH - (v / 5) * CH;

  // Axis ticks
  const ticks = [0, 1, 2, 3, 4, 5];

  // Quadrant dividers at midpoint 2.5
  const midX = scaleX(2.5);
  const midY = scaleY(2.5);


// ─────────────────────────────────────────────
// GEOGRAPHY BREAKDOWN — SVG world map + country ranked list
// ─────────────────────────────────────────────
const GEO_DATA = [
  { country: "United States", code: "US", count: 47, companies: ["JPMorgan Chase & Co.", "Netflix", "Skechers USA, Inc.", "Nubank S.A.", "IQVIA"] },
  { country: "Canada",        code: "CA", count: 5,  companies: ["TELUS", "Best Buy Canada", "University of Toronto"] },
  { country: "Brazil",        code: "BR", count: 4,  companies: ["Nubank S.A.", "Porto Seguro", "Grupo Globo S.A."] },
  { country: "France",        code: "FR", count: 4,  companies: ["Renault Group", "ENGIE", "Schneider Electric"] },
  { country: "India",         code: "IN", count: 4,  companies: ["Farmonaut", "India NHA & IIT Kanpur"] },
  { country: "UK",            code: "GB", count: 3,  companies: ["HSBC Holdings plc", "AstraZeneca", "Deliveroo"] },
  { country: "Japan",         code: "JP", count: 3,  companies: ["Toyota Motor Corporation", "SoftBank Corp.", "Casio UK"] },
  { country: "Spain",         code: "ES", count: 3,  companies: ["Telefónica", "Iberdrola"] },
  { country: "Singapore",     code: "SG", count: 3,  companies: ["Singtel", "National University of Singapore"] },
  { country: "China",         code: "CN", count: 2,  companies: ["Midea Group", "Mengniu Dairy"] },
  { country: "Germany",       code: "DE", count: 2,  companies: ["Deutsche Telekom", "BMW Group"] },
  { country: "South Korea",   code: "KR", count: 1,  companies: ["SK Telecom"] },
  { country: "UAE",           code: "AE", count: 1,  companies: ["e& (formerly Etisalat Group)"] },
];

// Approximate country centroids for bubble placement on SVG map (viewBox 0 0 1000 500)
const COUNTRY_COORDS: Record<string, [number, number]> = {
  US: [220, 200], CA: [200, 155], BR: [310, 330], FR: [480, 185],
  IN: [640, 240], GB: [462, 165], JP: [780, 200], ES: [460, 200],
  SG: [730, 300], CN: [720, 210], DE: [493, 172], KR: [762, 205],
  AE: [600, 240],
};

function GeographyBreakdown() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const [paths, setPaths] = useState<{ id: string; d: string; name: string }[]>([]);
  const maxCount = GEO_DATA[0].count;

  // ISO alpha-3 → alpha-2 mapping for our data
  const ISO3_MAP: Record<string, string> = {
    USA:"US", CAN:"CA", BRA:"BR", FRA:"FR", IND:"IN", GBR:"GB",
    JPN:"JP", ESP:"ES", SGP:"SG", CHN:"CN", DEU:"DE", KOR:"KR",
    ARE:"AE", AUS:"AU", RUS:"RU", NOR:"NO", SWE:"SE", ITA:"IT",
    NLD:"NL", BEL:"BE", CHE:"CH", AUT:"AT", POL:"PL", MEX:"MX",
    ARG:"AR", ZAF:"ZA", NGA:"NG", EGY:"EG", SAU:"SA", IDN:"ID",
    MYS:"MY", THA:"TH", VNM:"VN", PHL:"PH", PAK:"PK", BGD:"BD",
    IRN:"IR", IRQ:"IQ", TUR:"TR", UKR:"UA", ROU:"RO", HUN:"HU",
    CZE:"CZ", PRT:"PT", GRC:"GR", FIN:"FI", DNK:"DK", NZL:"NZ",
    CHL:"CL", COL:"CO", PER:"PE", VEN:"VE", MAR:"MA", DZA:"DZ",
    ETH:"ET", KEN:"KE", TZA:"TZ", GHA:"GH", AGO:"AO", MOZ:"MZ",
    MDG:"MG", CMR:"CM", CIV:"CI", NER:"NE", MLI:"ML", BFA:"BF",
    SEN:"SN", SDN:"SD", SSD:"SS", UGA:"UG", ZWE:"ZW", ZMB:"ZM",
    MWI:"MW", BEN:"BJ", TGO:"TG", SLE:"SL", LBR:"LR", GIN:"GN",
    COD:"CD", CAF:"CF", TCD:"TD", LBY:"LY", TUN:"TN", MRT:"MR",
    SOM:"SO", ERI:"ER", DJI:"DJ", CHL2:"CL", ECU:"EC", BOL:"BO",
    PRY:"PY", URY:"UY", GUY:"GY", SUR:"SR", PAN:"PA", CRI:"CR",
    NIC:"NI", HND:"HN", GTM:"GT", SLV:"SV", BLZ:"BZ", CUB:"CU",
    DOM:"DO", HTI:"HT", JAM:"JM", PRK:"KP", MNG:"MN", KAZ:"KZ",
    UZB:"UZ", TKM:"TM", KGZ:"KG", TJK:"TJ", AFG:"AF", MMR:"MM",
    KHM:"KH", LAO:"LA", NPL:"NP", BTN:"BT", LKA:"LK", MDV:"MV",
    ISL:"IS", IRL:"IE", HRV:"HR", SVN:"SI", SVK:"SK", SRB:"RS",
    BIH:"BA", MKD:"MK", ALB:"AL", MNE:"ME", MDA:"MD", BLR:"BY",
    LTU:"LT", LVA:"LV", EST:"EE", GEO:"GE", ARM:"AM", AZE:"AZ",
    ISR:"IL", JOR:"JO", LBN:"LB", SYR:"SY", YEM:"YE", OMN:"OM",
    KWT:"KW", QAT:"QA", BHR:"BH", PSE:"PS",
  };

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then(r => r.json())
      .then(world => {
        // Use topojson-client via dynamic import workaround — parse manually
        const features = world.objects.countries.geometries;
        // We need topojson to convert, so use a simpler approach via fetch of geojson
        return fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson");
      })
      .then(r => r.json())
      .then((geoJson: { features: { properties: { name: string; iso_a2: string; iso_a3: string }; geometry: { type: string; coordinates: number[][][][] } }[] }) => {
        // Project with simple equirectangular
        const W = 860, H = 420;
        const project = (lon: number, lat: number): [number, number] => [
          ((lon + 180) / 360) * W,
          ((90 - lat) / 180) * H,
        ];

        const moveTo = (c: number[]) => `M ${project(c[0], c[1]).join(" ")}`;
        const lineTo = (c: number[]) => `L ${project(c[0], c[1]).join(" ")}`;

        const ringToPath = (ring: number[][]) =>
          ring.map((c, i) => (i === 0 ? moveTo(c) : lineTo(c))).join(" ") + " Z";

        const featuresToPaths = geoJson.features.map(f => {
          const iso2 = f.properties.iso_a2 || ISO3_MAP[f.properties.iso_a3] || "";
          let d = "";
          if (f.geometry.type === "Polygon") {
            d = (f.geometry.coordinates as unknown as number[][][]).map(ring => ringToPath(ring as number[][])).join(" ");
          } else if (f.geometry.type === "MultiPolygon") {
            d = (f.geometry.coordinates as number[][][][]).map(poly =>
              poly.map(ring => ringToPath(ring)).join(" ")
            ).join(" ");
          }
          return { id: iso2, d, name: f.properties.name };
        });

        setPaths(featuresToPaths);
      })
      .catch(() => {
        // Fallback: empty — show placeholder
        setPaths([]);
      });
  }, []);

  const countByCode = useMemo(() => {
    const m: Record<string, number> = {};
    GEO_DATA.forEach(g => { m[g.code] = g.count; });
    return m;
  }, []);

  const getFill = (code: string) => {
    const c = countByCode[code];
    if (!c) return "#e8eeea";
    const intensity = c / maxCount;
    if (intensity > 0.7) return "#0d6e3f";
    if (intensity > 0.3) return "#1EDD7D";
    return "#a7f3d0";
  };

  const displayedCountries = showAll ? GEO_DATA : GEO_DATA.slice(0, 6);

  const KEY_TAKEAWAYS = [
    `The <strong>United States</strong> dominates with ${GEO_DATA[0].count} tracked companies — representing the highest concentration of high-priority targets for immediate Delta Engine outreach and enterprise-level engagement.`,
    `<strong>Europe</strong> (UK, France, Germany, Spain) collectively accounts for ${GEO_DATA.filter(g => ["GB","FR","DE","ES"].includes(g.code)).reduce((s,g)=>s+g.count,0)} companies, making it the second-largest opportunity cluster with strong financial services and telecom presence.`,
    `<strong>Asia-Pacific</strong> markets (Japan, Singapore, China, India, South Korea) represent a combined ${GEO_DATA.filter(g => ["JP","SG","CN","IN","KR"].includes(g.code)).reduce((s,g)=>s+g.count,0)} targets with high-growth potential in technology and manufacturing sectors.`,
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0f2644] flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" fill="none" stroke="#1EDD7D" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-[15px] font-black text-[#0f2644]">Geography Breakdown</h3>
            <p className="text-[11px] text-slate-400">HQ locations of tracked {GEO_DATA.length} countries worldwide.</p>
          </div>
        </div>
        <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        </button>
      </div>

      {/* Map + Right panel */}
      <div className="flex" style={{ minHeight: 340 }}>
        {/* Choropleth Map */}
        <div className="flex-1 min-w-0 relative bg-[#f8fafc]">
          <svg ref={svgRef} viewBox="0 0 860 420" className="w-full h-full" style={{ minHeight: 300 }}>
            <rect width="860" height="420" fill="#f0f5fa" />
            {paths.length === 0 && (
              <text x="430" y="210" textAnchor="middle" fontSize="13" fill="#94a3b8">Loading map…</text>
            )}
            {paths.map(p => {
              const isHov = hovered === p.id;
              const fill = getFill(p.id);
              const hasData = !!countByCode[p.id];
              return (
                <path
                  key={p.id + p.name}
                  d={p.d}
                  fill={isHov && hasData ? (fill === "#0d6e3f" ? "#0a5530" : fill === "#1EDD7D" ? "#17c46e" : "#86efac") : fill}
                  stroke="white"
                  strokeWidth={isHov && hasData ? 1.5 : 0.5}
                  style={{ cursor: hasData ? "pointer" : "default", transition: "fill 0.15s" }}
                  onMouseEnter={() => hasData && setHovered(p.id)}
                  onMouseLeave={() => setHovered(null)}
                />
              );
            })}
            {/* Hover tooltip */}
            {hovered && (() => {
              const geo = GEO_DATA.find(g => g.code === hovered);
              const coords = COUNTRY_COORDS[hovered];
              if (!geo || !coords) return null;
              // Convert lon/lat style coords to our projected SVG coords
              const tx = Math.min(Math.max(coords[0] - 55, 5), 700);
              const ty = Math.max(coords[1] - 58, 5);
              return (
                <g style={{ pointerEvents: "none" }}>
                  <rect x={tx} y={ty} width={140} height={44} rx={7} fill="white" stroke="#e2e8f0" strokeWidth="1" opacity={0.97}
                    style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }} />
                  <text x={tx + 10} y={ty + 17} fontSize="11.5" fontWeight="700" fill="#0f2644">{geo.country}</text>
                  <text x={tx + 10} y={ty + 33} fontSize="10" fill="#64748b">{geo.count} {geo.count === 1 ? "company" : "companies"}</text>
                </g>
              );
            })()}
          </svg>
          {/* Zoom controls */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            <button className="w-7 h-7 bg-white rounded-md border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 text-[16px] font-bold hover:bg-slate-50">+</button>
            <button className="w-7 h-7 bg-white rounded-md border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 text-[16px] font-bold hover:bg-slate-50">−</button>
          </div>
        </div>

        {/* Right: ranked list */}
        <div className="w-[290px] flex-shrink-0 border-l border-slate-100 overflow-y-auto" style={{ maxHeight: 380 }}>
          {GEO_DATA.map(geo => {
            const pct = (geo.count / maxCount) * 100;
            const isHov = hovered === geo.code;
            return (
              <div key={geo.code}
                className={`px-4 py-3 border-b border-slate-50 transition-colors cursor-default ${isHov ? "bg-[#f0fdf8]" : "hover:bg-[#f8fafc]"}`}
                onMouseEnter={() => setHovered(geo.code)}
                onMouseLeave={() => setHovered(null)}>
                <div className="flex items-center justify-between gap-3 mb-0.5">
                  <div className="min-w-0">
                    <div className="text-[12px] font-bold text-[#0f2644] leading-tight">{geo.country}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                      {geo.companies.slice(0, 3).join(" · ")}{geo.companies.length > 3 ? ` · +${geo.count - 3} more` : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[#1EDD7D]" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[12px] font-black text-[#0f2644] w-4 text-right">{geo.count}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="mx-4 mb-4 mt-3 rounded-xl border border-[#a7f3d0] bg-[#f0fdf8] px-5 py-4">
        <div className="flex items-center gap-2 mb-2.5">
          <svg width="12" height="12" fill="none" stroke="#059669" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 14 6 14s6-8.75 6-14c0-3.314-2.686-6-6-6z"/></svg>
          <span className="text-[11px] font-bold text-[#059669]">Key Takeaways</span>
        </div>
        <ul className="flex flex-col gap-2">
          {(showAll ? KEY_TAKEAWAYS : KEY_TAKEAWAYS.slice(0, 2)).map((t, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-[#059669] flex-shrink-0 mt-1.5" />
              <p className="text-[11px] text-[#065f46] leading-relaxed" dangerouslySetInnerHTML={{ __html: t }} />
            </li>
          ))}
        </ul>
        <button onClick={() => setShowAll(v => !v)} className="mt-2 text-[11px] font-semibold text-[#059669] hover:underline">
          {showAll ? "View Less" : "View More"}
        </button>
      </div>
    </div>
  );
}

function InsightsPage() {
  const high = ALL_CUSTOMERS.filter(c => c.score >= 4.0);
  const med  = ALL_CUSTOMERS.filter(c => c.score >= 2.5 && c.score < 4.0);
  const low  = ALL_CUSTOMERS.filter(c => c.score < 2.5);
  const avg  = (ALL_CUSTOMERS.reduce((s, c) => s + c.score, 0) / ALL_CUSTOMERS.length).toFixed(2);
  const topC = [...ALL_CUSTOMERS].sort((a, b) => b.score - a.score)[0];

  const US_COUNT = ALL_CUSTOMERS.filter(c => c.hq === "USA").length;

  const KEY_FINDINGS = [
    {
      rank: "01",
      title: "JPMorgan Chase Is the #1 Target",
      body: `With a perfect score of 5.0/5.0, JPMorgan Chase leads all 91 identified customers. Their $18B annual technology budget — with $2B dedicated to AI — combined with documented integration pain points and active OmniAI/LLM Suite programs represent a direct, high-value entry point for Databricks Delta Engine.`,
      tag: "Top Priority",
      color: "border-[#1EDD7D] bg-[#edfdf5]",
      tagColor: "bg-[#1EDD7D] text-[#0f2644]",
      icon: <svg width="18" height="18" fill="none" stroke="#15b865" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    },
    {
      rank: "02",
      title: `${high.length} High-Priority Accounts Score ≥ 4.0`,
      body: `${high.length} of 91 customers (${Math.round((high.length / 91) * 100)}%) qualify as High Priority with scores ≥ 4.0. These accounts — including HSBC, Netflix, Skechers, Nubank, IQVIA, and Midea — all demonstrate active AI/ML platform investments and documented Delta Engine-relevant pain points. Focus initial outreach here.`,
      tag: "Pipeline Focus",
      color: "border-blue-200 bg-blue-50/60",
      tagColor: "bg-blue-500 text-white",
      icon: <svg width="18" height="18" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    },
    {
      rank: "03",
      title: "US Market Dominates — 52% of All Targets",
      body: `${US_COUNT} of 91 customers (52%) are headquartered in the USA, confirming the US as the primary target geography. The next largest regions are Canada (5), Brazil (4), France (4), and India (4). A US-first sales motion with LATAM and EU expansion phases aligns directly with this distribution.`,
      tag: "Geography",
      color: "border-violet-200 bg-violet-50/60",
      tagColor: "bg-violet-500 text-white",
      icon: <svg width="18" height="18" fill="none" stroke="#8b5cf6" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
    },
    {
      rank: "04",
      title: "AWS Is the Dominant Incumbent Vendor",
      body: `Amazon Web Services appears as an existing vendor in 30 of 91 accounts (33%), followed by Google Cloud (17), NVIDIA (16), and Microsoft Azure (18 combined). Databricks already has co-sell relationships with all of these. Position Delta Engine as the unified analytics layer on top of existing cloud infrastructure — not a replacement.`,
      tag: "Competitive Intel",
      color: "border-amber-200 bg-amber-50/60",
      tagColor: "bg-amber-500 text-white",
      icon: <svg width="18" height="18" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
    },
    {
      rank: "05",
      title: "Data Fragmentation Is the Universal Pain Point",
      body: `Across all 91 accounts, the single most common pain point is data fragmentation — disconnected data pipelines, legacy warehouse silos, and inability to run unified ML workflows. Delta Engine's lakehouse architecture directly addresses this. Lead with the unified data + AI platform message in all prospecting conversations.`,
      tag: "Messaging Hook",
      color: "border-red-200 bg-red-50/50",
      tagColor: "bg-red-400 text-white",
      icon: <svg width="18" height="18" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    },
    {
      rank: "06",
      title: `${med.length} Medium-Priority Accounts Are a Warm Pipeline`,
      body: `${med.length} accounts score between 2.5 and 3.9. Many — such as Goldman Sachs, Deutsche Telekom, Mayo Clinic, and AstraZeneca — are already investing heavily in cloud and AI but haven't yet deployed unified analytics platforms. Nurture these with thought leadership and vertical-specific case studies to accelerate conversion.`,
      tag: "Growth Pipeline",
      color: "border-teal-200 bg-teal-50/50",
      tagColor: "bg-teal-500 text-white",
      icon: <svg width="18" height="18" fill="none" stroke="#14b8a6" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    },
  ];

  const STRATEGIC_RECS = [
    { title: "Tier 1 Outreach Sprint", desc: "Immediate ABM campaign targeting the 23 High-Priority accounts. Personalize messaging around each account's documented AI investment initiatives.", icon: "🎯" },
    { title: "Co-Sell with AWS & Google", desc: "Since 47 accounts already use AWS or Google Cloud, activate co-sell motions to position Delta Engine as the analytics layer on existing infrastructure.", icon: "🤝" },
    { title: "Vertical Playbooks", desc: "Build industry-specific decks for Financial Services (JPMorgan, HSBC, Goldman), Healthcare (IQVIA, Mayo, AstraZeneca), and Media (Netflix, Disney, NBCUniversal).", icon: "📋" },
    { title: "LATAM Expansion", desc: "Brazil (Nubank, Porto Seguro, Grupo Globo) and Mexico represent high-growth emerging market opportunities with less incumbent competition.", icon: "🌎" },
  ];

  const scoreSegData = [
    { label: "High\n(≥4.0)", value: high.length, color: "#1EDD7D" },
    { label: "Medium\n(2.5–4.0)", value: med.length, color: "#f59e0b" },
    { label: "Low\n(<2.5)", value: low.length, color: "#ef4444" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Hero insight banner */}
      <div className="bg-gradient-to-br from-[#edfdf5] to-[#d1fae5] rounded-2xl p-6 flex items-start justify-between gap-6 border border-[#a7f3d0]">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <svg width="14" height="14" fill="none" stroke="#15b865" strokeWidth="2.5" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span className="text-[10px] font-bold uppercase tracking-[.1em] text-[#15b865]">Key Takeaway — Databricks Delta Engine</span>
          </div>
          <h2 className="text-[20px] font-black text-[#0f2644] leading-snug mb-3">
            91 High-Potential Customers Identified Across 20+ Countries.<br/>
            <span className="text-[#15b865]">23 Accounts Ready for Immediate Outreach.</span>
          </h2>
          <p className="text-[12px] text-[#1a4a3a] leading-relaxed max-w-2xl">
            This analysis identifies and ranks {ALL_CUSTOMERS.length} enterprise targets for Databricks Delta Engine across Financial Services, Healthcare, Retail, Technology, Energy, and Media sectors. With an average evaluation score of <strong className="text-[#0f2644]">{avg}/5.0</strong>, the pipeline demonstrates exceptional quality — {high.length} High Priority accounts with active AI investments, documented data fragmentation pain, and proven budget capacity are ready for targeted engagement now.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 flex-shrink-0">
          {[
            { val: ALL_CUSTOMERS.length, label: "Total Targets" },
            { val: high.length, label: "High Priority" },
            { val: avg, label: "Avg Score" },
          ].map(k => (
            <div key={k.label} className="bg-white/70 border border-[#6ee7b7] rounded-xl px-4 py-3 text-center min-w-[80px]">
              <div className="text-[22px] font-black text-[#15b865] leading-none">{k.val}</div>
              <div className="text-[10px] text-[#0f2644] mt-1 font-semibold">{k.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Findings */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <svg width="14" height="14" fill="none" stroke="#0f2644" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span className="text-[13px] font-bold text-[#0f2644]">Key Findings</span>
          <span className="text-[10px] text-slate-400 ml-1">{KEY_FINDINGS.length} strategic insights derived from the data</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {KEY_FINDINGS.map(f => (
            <div key={f.rank} className={`rounded-xl border p-5 ${f.color}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/70 flex items-center justify-center flex-shrink-0 shadow-sm">{f.icon}</div>
                  <span className="text-[11px] font-black text-slate-300">{f.rank}</span>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${f.tagColor}`}>{f.tag}</span>
              </div>
              <h3 className="text-[13px] font-extrabold text-[#0f2644] mb-2 leading-snug">{f.title}</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ GEOGRAPHY BREAKDOWN ═══ */}
      <div id="geography-section">
        <GeographyBreakdown />
      </div>

      {/* ═══ CUSTOMER PRIORITY QUADRANT MAP ═══ */}
      <CustomerPriorityQuadrant />

      {/* Strategic Recommendations — full width */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="text-[13px] font-bold text-[#0f2644] mb-0.5">Strategic Recommendations</div>
        <div className="text-[11px] text-slate-400 mb-4">Actionable next steps based on intelligence findings</div>
        <div className="grid grid-cols-2 gap-3">
          {STRATEGIC_RECS.map(r => (
            <div key={r.title} className="rounded-xl bg-[#f4f6f9] border border-slate-200 p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[18px]">{r.icon}</span>
                <div className="text-[12px] font-bold text-[#0f2644] leading-tight">{r.title}</div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}


// ─────────────────────────────────────────────
// CUSTOMER DRAWER — redesigned to match reference image layout
// ─────────────────────────────────────────────
function CustomerDrawer({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const [tab, setTab] = useState<DrawerTab>("overview");

  const radarData = CRITERIA_LABELS.map((label, i) => ({
    subject: ["Industry", "Growth", "Tech/Solution", "Strategic", "Geo", "Investment"][i],
    value: customer.criteria[i],
    fullMark: 5,
  }));

  const { color: logoColor } = getCompanyLogo(customer.name);
  const initials = customer.name.split(" ").filter(w => w.length > 1 && !/^(Inc|Ltd|plc|LLC|Corp|Co|Group|SA|AG|NV|BV|GmbH|Sdn|Bhd|AB|AS|Pvt|&|and|the|of)$/i.test(w)).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const tier = getScoreTier(customer.score);
  const tierStyle = tier === "High" ? "bg-[#edfdf5] text-[#15b865] border-[#a7f3d0]" : tier === "Medium" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-red-50 text-red-500 border-red-200";

  // Derive industry & size category from data
  const sizeLabel = (() => {
    const s = customer.size || "";
    const num = parseInt(s.replace(/[^0-9]/g, "")) || 0;
    if (num > 100000) return "Large Enterprise";
    if (num > 10000) return "Enterprise";
    if (num > 1000) return "Mid-Market";
    return "SME";
  })();

  const TABS: { id: DrawerTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "eval",     label: "Evaluation" },
    { id: "pain",     label: "Pain Points" },
    { id: "growth",   label: "Growth Initiatives" },
    { id: "invest",   label: "Investment Priorities" },
    { id: "vendors",  label: "Vendors" },
  ];

  // Derive SWOT from existing data
  const swot = {
    strengths: customer.growthInitiatives.slice(0, 2).map(g => g.initiative).join("; ") || "Strong market presence",
    weaknesses: customer.painPoints.filter(p => p.severity === "High").slice(0, 2).map(p => p.point).join("; ") || "Integration challenges",
    opportunities: customer.growthInitiatives.slice(2, 4).map(g => g.initiative).join("; ") || "Expanding digital footprint",
    threats: customer.painPoints.filter(p => p.severity === "Moderate" || p.severity === "High").slice(-2).map(p => p.point).join("; ") || "Market competition",
  };

  return (
    <div className="fixed inset-0 z-[1000] flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-[660px] bg-white flex flex-col h-full shadow-2xl border-l border-slate-200 overflow-hidden">

        {/* ── HEADER ── */}
        <div className="flex-shrink-0 px-6 pt-5 pb-4 border-b border-slate-100 bg-white">
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              {COMPANY_LOGOS[customer.name] ? (
                <div className="w-14 h-14 rounded-xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden shadow-sm">
                  <img src={COMPANY_LOGOS[customer.name]} alt={customer.name} className="object-contain w-12 h-12 p-1" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-[15px] font-black shadow-sm" style={{ backgroundColor: logoColor }}>
                  {initials}
                </div>
              )}
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="text-[17px] font-black text-[#0f2644] leading-tight truncate">{customer.name}</h2>
                {customer.website && (
                  <a href={customer.website} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 text-slate-400 hover:text-[#1a56db] transition-colors">
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                )}
              </div>
              {/* HQ · Score · Priority tag */}
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-black text-[#1EDD7D]">{customer.score.toFixed(1)}</span>
                <span className="text-[11px] text-slate-400 font-medium">/ 5.0</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  tier === "High" ? "bg-[#edfdf5] text-[#15b865] border-[#a7f3d0]"
                  : tier === "Medium" ? "bg-amber-50 text-amber-600 border-amber-200"
                  : "bg-red-50 text-red-500 border-red-200"
                }`}>
                  <svg width="6" height="6" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4"/></svg>
                  {tier} Priority
                </span>
              </div>
            </div>

            {/* Close */}
            <button onClick={onClose} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#0f2644] hover:border-slate-300 transition-colors flex-shrink-0">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Business summary */}
          <p className="mt-3 text-[11.5px] text-slate-500 leading-relaxed line-clamp-3 pl-0">{customer.businessFocus}</p>
        </div>

        {/* ── TABS ── */}
        <div className="flex-shrink-0 border-b border-slate-200 px-4 flex overflow-x-auto bg-white">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-[12px] font-medium whitespace-nowrap border-b-[2.5px] transition-all ${tab === t.id ? "text-[#1EDD7D] border-[#1EDD7D] font-bold" : "text-slate-400 border-transparent hover:text-slate-600"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── SCROLLABLE CONTENT ── */}
        <div className="flex-1 overflow-y-auto">

          {/* ═══ OVERVIEW TAB ═══ */}
          {tab === "overview" && (
            <div className="flex flex-col">

              {/* ── Company Basic Info — 2-col label+value grid matching reference ── */}
              <div className="px-6 py-5 border-b border-slate-100">
                <div className="grid grid-cols-2 gap-x-8 gap-y-5">

                  {/* Headquarters */}
                  <div>
                    <div className="text-[12px] font-bold text-[#0f2644] mb-0.5">Headquarters</div>
                    <div className="text-[13px] text-slate-600">{customer.hq || "N/A"}</div>
                  </div>

                  {/* Company Size */}
                  <div>
                    <div className="text-[12px] font-bold text-[#0f2644] mb-0.5">Company Size</div>
                    <div className="text-[13px] text-slate-600">{customer.size || "N/A"}</div>
                  </div>

                  {/* Revenue */}
                  <div>
                    <div className="text-[12px] font-bold text-[#0f2644] mb-0.5">Revenue</div>
                    <div className="text-[13px] text-slate-600">{customer.revenue || "N/A"}</div>
                  </div>

                  {/* Net Margins */}
                  <div>
                    <div className="text-[12px] font-bold text-[#0f2644] mb-0.5">Net Margins</div>
                    <div className={`text-[13px] font-semibold ${customer.netMargin?.startsWith("-") ? "text-red-500" : "text-slate-600"}`}>
                      {customer.netMargin || "N/A"}
                    </div>
                  </div>

                  {/* Revenue Growth — spans full row */}
                  <div className="col-span-2">
                    <div className="text-[12px] font-bold text-[#0f2644] mb-0.5">Revenue Growth</div>
                    <div className={`text-[13px] font-semibold ${customer.revenueGrowth?.startsWith("-") ? "text-red-500" : "text-slate-600"}`}>
                      {customer.revenueGrowth || "N/A"}
                    </div>
                  </div>

                </div>
              </div>

              {/* ── Business Focus ── */}
              <div className="px-6 py-5 border-b border-slate-100">
                <div className="text-[12px] font-bold text-[#0f2644] mb-1.5">Business Focus</div>
                <p className="text-[13px] text-slate-600 leading-relaxed">{customer.businessFocus}</p>
              </div>

              {/* ── Strategic Direction ── */}
              <div className="px-6 py-5 border-b border-slate-100">
                <div className="text-[12px] font-bold text-[#0f2644] mb-1.5">Strategic Direction</div>
                <p className="text-[13px] text-slate-600 leading-relaxed">{customer.strategicDir}</p>
              </div>

              {/* ── SWOT Analysis ── */}
              <div className="px-6 py-5 border-b border-slate-100">
                <div className="text-[11px] font-black uppercase tracking-[.08em] text-slate-400 mb-3">SWOT Analysis</div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                    <div className="text-[9px] font-black uppercase tracking-[.08em] text-slate-500 mb-2">Strengths</div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{swot.strengths}</p>
                  </div>
                  <div className="rounded-xl border border-red-100 bg-red-50/60 p-3.5">
                    <div className="text-[9px] font-black uppercase tracking-[.08em] text-red-500 mb-2">Weaknesses</div>
                    <p className="text-[11px] text-red-700 leading-relaxed">{swot.weaknesses}</p>
                  </div>
                  <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5">
                    <div className="text-[9px] font-black uppercase tracking-[.08em] text-blue-600 mb-2">Opportunities</div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{swot.opportunities}</p>
                  </div>
                  <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-3.5">
                    <div className="text-[9px] font-black uppercase tracking-[.08em] text-amber-600 mb-2">Threats</div>
                    <p className="text-[11px] text-amber-700 leading-relaxed">{swot.threats}</p>
                  </div>
                </div>
              </div>

              {/* ── Source(s) ── */}
              {customer.website && (
                <div className="px-6 py-4 border-b border-slate-100">
                  <div className="text-[12px] text-slate-400 mb-1.5">Source(s):</div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {[customer.website].map((url, li) => (
                      <a key={li} href={url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[12px] text-[#1a56db] hover:underline">
                        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                        Link {li + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ═══ EVALUATION TAB ═══ */}
          {tab === "eval" && (
            <div className="px-6 py-6 flex flex-col gap-6">

              {/* Score Reasoning Statement — matches Image 2 */}
              {(() => {
                const reasons = [
                  `The company operates within ${customer.businessFocus.split(",")[0].toLowerCase().includes("banking") || customer.businessFocus.toLowerCase().includes("financial") ? "financial services" : customer.businessFocus.split(".")[0].slice(0, 60)}, which is identified as a core market for the client's offering.`,
                  `The company reports a revenue growth of ${customer.revenueGrowth}, which is ${parseFloat(customer.revenueGrowth) >= 5 ? "well above the 5% threshold for the highest score" : "noted in the evaluation criteria"}.`,
                  `${customer.painPoints.filter(p => p.severity === "High").length > 0 ? `Multiple high-severity pain points are identified, including ${customer.painPoints.filter(p => p.severity === "High").slice(0, 2).map(p => p.point.toLowerCase()).join(" and ")}, indicating significant technology and solution needs.` : "Pain points have been documented across the account, indicating active solution needs."}`,
                  `The company has a mix of completed, scaling, and in-progress initiatives directly related to technology modernization and AI, demonstrating strong alignment and execution.`,
                  `The company is described as having a strong geographical reach${customer.hq ? ` (HQ: ${customer.hq})` : ""}, indicating a robust and possibly global operational presence.`,
                  `The company's net margin is ${customer.netMargin}, which is ${parseFloat(customer.netMargin) >= 15 ? "well above the 15% threshold, indicating strong investment capacity" : "within the evaluated investment capacity range"}.`,
                ];
                return (
                  <div className="rounded-xl border-l-[3px] border-[#1EDD7D] border border-[#a7f3d0] bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" fill="none" stroke="#1EDD7D" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <span className="text-[13px] font-black text-[#0f2644]">Score Reasoning Statement</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        Score: <span className="font-black text-[#f97316] text-[13px]">{customer.score.toFixed(0)}</span>
                        <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      </div>
                    </div>
                    <ul className="flex flex-col gap-2.5">
                      {reasons.map((r, ri) => (
                        <li key={ri} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0 mt-1.5" />
                          <p className="text-[12px] text-slate-600 leading-relaxed">{r}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()}

              {/* Radar chart */}
              <div>
                <div className="text-[11px] font-black uppercase tracking-[.08em] text-slate-400 mb-1">Criteria Radar</div>
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={radarData} cx="50%" cy="50%">
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }} />
                    <Radar dataKey="value" stroke="#1EDD7D" fill="#1EDD7D" fillOpacity={0.15} strokeWidth={2.5} dot={{ r: 4, fill: "#1EDD7D", stroke: "#fff", strokeWidth: 2 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Criteria bars */}
              <div>
                <div className="text-[11px] font-black uppercase tracking-[.08em] text-slate-400 mb-3">Score Breakdown</div>
                <div className="flex flex-col gap-3">
                  {CRITERIA_LABELS.map((label, i) => {
                    const val = customer.criteria[i];
                    const pct = (val / 5) * 100;
                    const barColor = val === 5 ? "#15803d" : val === 4 ? "#1EDD7D" : val === 3 ? "#86efac" : val === 2 ? "#d1fae5" : "#94a3b8";
                    const badgeBg = val === 5 ? "#15803d" : val === 4 ? "#1EDD7D" : val === 3 ? "#86efac" : val === 2 ? "#d1fae5" : "#94a3b8";
                    const badgeText = "#ffffff";
                    return (
                      <div key={label} className="flex items-center gap-3">
                        <div className="text-[12px] text-slate-600 w-40 flex-shrink-0 font-medium">{label}</div>
                        <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                        </div>
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-black flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: badgeBg, color: badgeText }}
                        >
                          {val}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ═══ PAIN POINTS TAB ═══ */}
          {tab === "pain" && (
            <div className="flex flex-col divide-y divide-slate-100">
              {customer.painPoints.map((p, i) => (
                <div key={i} className="px-6 py-5">

                  {/* Number + Title */}
                  <h3 className="text-[14px] font-bold text-[#0f2644] leading-snug mb-2">
                    {i + 1}. {p.point}
                  </h3>

                  {/* Description */}
                  <p className="text-[12.5px] text-slate-600 leading-relaxed mb-3">{p.desc}</p>

                  {/* Severity badge + context box */}
                  <div className={`rounded-xl border p-3 mb-3 ${
                    p.severity === "High"
                      ? "border-red-200 bg-red-50"
                      : "border-amber-200 bg-amber-50"
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold text-slate-500">Severity:</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        p.severity === "High"
                          ? "bg-red-100 text-red-600 border border-red-200"
                          : "bg-amber-100 text-amber-600 border border-amber-200"
                      }`}>{p.severity}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed ${
                      p.severity === 'High' ? 'text-red-700' : 'text-amber-700'
                    }">
                      {p.severity === "High"
                        ? "This issue significantly impacts operational efficiency and revenue generation, requiring immediate attention. Multiple stakeholders report this as a critical blocker to business growth."
                        : "This represents an optimization opportunity that could enhance efficiency. The impact is moderate but addressing it would provide incremental benefits over time."
                      }
                    </p>
                  </div>

                  {/* Relevance to Offering */}
                  {p.relevance && (
                    <div className="mb-3">
                      <div className="text-[11px] font-bold text-[#0f2644] mb-1">Relevance to Offering:</div>
                      <p className="text-[12px] text-slate-600 leading-relaxed">{p.relevance}</p>
                    </div>
                  )}

                  {/* Evidence */}
                  {p.evidence && (
                    <div className="mb-3">
                      <div className="text-[11px] font-bold text-[#0f2644] mb-1">Evidence:</div>
                      <p className="text-[12px] text-slate-600 leading-relaxed">{p.evidence}</p>
                    </div>
                  )}

                  {/* Source(s) */}
                  {p.sources && p.sources.length > 0 && (
                    <div>
                      <div className="text-[11px] text-slate-400 mb-1">Source(s):</div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        {p.sources.map((src, si) => (
                          <span key={si} className="flex items-center gap-1 text-[11px] text-[#1a56db] font-medium">
                            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                            {src}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ═══ GROWTH INITIATIVES TAB ═══ */}
          {tab === "growth" && (
            <div className="flex flex-col divide-y divide-slate-100">
              {customer.growthInitiatives.map((g, i) => (
                <div key={i} className="px-6 py-5">
                  {/* Header row: number + title + status badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-[14px] font-bold text-[#0f2644] leading-snug">
                      <span className="text-slate-400 font-semibold mr-1">{i + 1}.</span>
                      {g.initiative}
                    </h3>
                    <span className="flex-shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-[#a7f3d0] text-[#059669] bg-[#edfdf5]">
                      Active
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[12.5px] text-slate-600 leading-relaxed mb-3">{g.desc}</p>

                  {/* Relevance to Offering */}
                  {g.relevance && (
                    <div className="mb-3">
                      <div className="text-[11px] font-bold text-[#0f2644] mb-1">Relevance to Offering:</div>
                      <p className="text-[12px] text-slate-600 leading-relaxed">{g.relevance}</p>
                    </div>
                  )}

                  {/* Evidence */}
                  {g.evidence && (
                    <div className="mb-3">
                      <div className="text-[11px] font-bold text-[#0f2644] mb-1">Evidence:</div>
                      <p className="text-[12px] text-slate-600 leading-relaxed">{g.evidence}</p>
                    </div>
                  )}

                  {/* Source(s) */}
                  {g.sources && g.sources.length > 0 && (
                    <div>
                      <div className="text-[11px] text-slate-400 mb-1">Source(s):</div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        {g.sources.map((src, si) => (
                          <span key={si} className="flex items-center gap-1 text-[11px] text-[#1a56db] font-medium">
                            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                            {src}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ═══ INVESTMENTS TAB ═══ */}
          {tab === "invest" && (
            <div className="flex flex-col divide-y divide-slate-100">
              {customer.investments.map((inv, i) => (
                <div key={i} className="px-6 py-5">

                  {/* Number + Title */}
                  <h3 className="text-[14px] font-bold text-[#0f2644] leading-snug mb-2">
                    {i + 1}. {inv.initiative}
                  </h3>

                  {/* Description */}
                  <p className="text-[12.5px] text-slate-600 leading-relaxed mb-3">{inv.desc}</p>

                  {/* Relevance to Offering */}
                  {inv.relevance && (
                    <div className="mb-3">
                      <div className="text-[11px] font-bold text-[#0f2644] mb-1">Relevance to Offering:</div>
                      <p className="text-[12px] text-slate-600 leading-relaxed">{inv.relevance}</p>
                    </div>
                  )}

                  {/* Investment Amount */}
                  {inv.amount && (
                    <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100">
                      <svg width="11" height="11" fill="none" stroke="#2563eb" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                    <span className="text-[11px] font-bold text-[#2563eb]">{inv.amount}</span>
                    </div>
                  )}

                  {/* Evidence */}
                  {inv.evidence && (
                    <div className="mb-3">
                      <div className="text-[11px] font-bold text-[#0f2644] mb-1">Evidence:</div>
                      <p className="text-[12px] text-slate-600 leading-relaxed">{inv.evidence}</p>
                    </div>
                  )}

                  {/* Source(s) */}
                  {inv.sources && inv.sources.length > 0 && (
                    <div>
                      <div className="text-[11px] text-slate-400 mb-1">Source(s):</div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        {inv.sources.map((src, si) => (
                          <span key={si} className="flex items-center gap-1 text-[11px] text-[#1a56db] font-medium">
                            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                            {src}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ═══ VENDORS TAB ═══ */}
          {tab === "vendors" && (
            <div className="flex flex-col gap-4 px-6 py-5">
              {customer.vendors.map((v, i) => {
                const { color: vColor } = getCompanyLogo(v.name);
                const vInitials = v.name.split(" ").filter((w: string) => w.length > 1 && !/^(Inc|Ltd|plc|LLC|Corp|Co|Group|SA|AG|NV|BV|GmbH|&|and|the|of)$/i.test(w)).slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();

                /* Parse relevance text to extract overlap type (e.g. "Partial Overlap") */
                const overlapMatch = v.relevance?.match(/^(Partial Overlap|Full Overlap|No Overlap|Complementary)/i);
                const overlapLabel = overlapMatch ? overlapMatch[1] : null;
                const relevanceBody = overlapLabel && v.relevance
                  ? v.relevance.replace(/^(Partial Overlap|Full Overlap|No Overlap|Complementary)\s*[—–-]?\s*/i, "")
                  : v.relevance;

                const overlapColors: Record<string, { bg: string; text: string; dot: string }> = {
                  "Partial Overlap":  { bg: "bg-orange-50",  text: "text-orange-600",  dot: "bg-orange-500" },
                  "Full Overlap":     { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-500" },
                  "No Overlap":       { bg: "bg-green-50",   text: "text-green-700",   dot: "bg-green-500" },
                  "Complementary":    { bg: "bg-blue-50",    text: "text-blue-600",    dot: "bg-blue-500" },
                };
                const oc = overlapLabel ? (overlapColors[overlapLabel] ?? overlapColors["Partial Overlap"]) : null;

                return (
                  <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

                    {/* ── Card header ── */}
                    <div className="px-5 pt-4 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        {COMPANY_LOGOS[v.name] ? (
                          <div className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                            <img src={COMPANY_LOGOS[v.name]} alt={v.name} className="object-contain w-9 h-9 p-0.5" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-[12px] font-black flex-shrink-0 shadow-sm" style={{ backgroundColor: vColor }}>
                            {vInitials}
                          </div>
                        )}
                        <div>
                          <h3 className="text-[14px] font-bold text-[#0f2644] leading-tight">{v.name}</h3>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-semibold tracking-wide">
                            Technology Vendor
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ── Labeled rows ── */}
                    <div className="divide-y divide-slate-50">

                      {/* Vendor Name */}
                      <div className="grid grid-cols-[140px_1fr] gap-3 px-5 py-3 items-start">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide pt-0.5">Vendor Name</span>
                        <span className="text-[12px] text-slate-700 font-medium">{v.name}</span>
                      </div>

                      {/* Vendor Offering */}
                      <div className="grid grid-cols-[140px_1fr] gap-3 px-5 py-3 items-start">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide pt-0.5">Vendor Offering</span>
                        <p className="text-[12px] text-slate-600 leading-relaxed">{v.offering}</p>
                      </div>

                      {/* Relationship Description */}
                      {v.relationship && (
                        <div className="grid grid-cols-[140px_1fr] gap-3 px-5 py-3 items-start">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide pt-0.5">Relationship Description</span>
                          <p className="text-[12px] text-slate-600 leading-relaxed">{v.relationship}</p>
                        </div>
                      )}

                      {/* Relevance to Delta Engine */}
                      {v.relevance && (
                        <div className="grid grid-cols-[140px_1fr] gap-3 px-5 py-3 items-start">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide pt-0.5">Relevance to Delta Engine</span>
                          <div className="flex flex-col gap-1.5">
                            {oc && overlapLabel && (
                              <span className={`inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full ${oc.bg} ${oc.text} text-[11px] font-semibold`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${oc.dot} flex-shrink-0`} />
                                {overlapLabel}
                              </span>
                            )}
                            <p className="text-[12px] text-slate-600 leading-relaxed">{relevanceBody}</p>
                          </div>
                        </div>
                      )}

                      {/* Evidence */}
                      {v.evidence && (
                        <div className="grid grid-cols-[140px_1fr] gap-3 px-5 py-3 items-start">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide pt-0.5">Evidence</span>
                          <p className="text-[12px] text-slate-500 italic leading-relaxed">{v.evidence}</p>
                        </div>
                      )}

                      {/* Evidence & Sources */}
                      {v.sources && v.sources.length > 0 && (
                        <div className="grid grid-cols-[140px_1fr] gap-3 px-5 py-3 items-start">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide pt-0.5">Evidence &amp; Sources</span>
                          <div className="flex flex-col gap-1">
                            {v.sources.map((src, si) => (
                              <a key={si} href={src.startsWith("http") ? src : "#"} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-[12px] text-[#1a56db] font-medium hover:underline">
                                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                                </svg>
                                {src}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}


function MarketClusterCard({ cluster, marketKey, onViewDetails }: { cluster: MarketCluster; marketKey: string; onViewDetails: (c: MarketCluster) => void }) {
  const colors: Record<MarketKey, { border: string; dot: string }> = {
    core:     { border: "border-slate-200", dot: "bg-blue-500" },
    adjacent: { border: "border-slate-200", dot: "bg-orange-500" },
    emerging: { border: "border-slate-200", dot: "bg-violet-500" },
  };
  const c = colors[marketKey as MarketKey] ?? colors.core;

  return (
    <div className={`bg-white rounded-xl border ${c.border} shadow-sm p-5 flex flex-col gap-3 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer`} onClick={() => onViewDetails(cluster)}>
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-[14px] font-bold text-[#0f2644] leading-snug">{cluster.name}</h4>
        <div className="text-right flex-shrink-0">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[.07em]">Avg. Solution Score ↑</div>
          <div className="text-[22px] font-black leading-none text-[#0f2644]">{cluster.avgScore.toFixed(1)}</div>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <svg width="13" height="13" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[.06em] mb-1">Reasoning:</div>
          <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">{cluster.reasoning}</p>
        </div>
      </div>

      <div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[.06em] mb-1.5">Companies ({cluster.companyCount}):</div>
        <div className="flex flex-wrap gap-1 items-center">
          {cluster.companies.slice(0, 3).map(co => (
            <span key={co} className="text-[10px] text-[#1a56db] font-medium truncate max-w-[140px]">{co}</span>
          ))}
          {cluster.companyCount > 3 && <span className="text-[10px] text-slate-400 font-medium">+{cluster.companyCount - 3} more</span>}
        </div>
      </div>

      <div className="mt-auto flex items-center gap-1.5 text-[11px] font-semibold text-[#1a56db]">
        View Details
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </div>
    </div>
  );
}

// ── MARKET INSIGHTS SLIDE-IN DRAWER ──
function MarketInsightsDrawer({ cluster, marketKey, onClose }: { cluster: MarketCluster; marketKey: MarketKey; onClose: () => void }) {
  const tabColor = MARKET_TABS.find(t => t.key === marketKey)?.bg ?? "#2563eb";
  return (
    <div className="fixed inset-0 z-[2000] flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <div className="w-[720px] flex-shrink-0 bg-white flex flex-col h-full shadow-2xl border-l border-slate-200 overflow-hidden">

        {/* ── Header ── */}
        <div className="flex-shrink-0 px-5 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0 pr-3">
              <h2 className="text-[15px] font-black text-[#0f2644] leading-tight">{cluster.name} — Market Insights</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[11px] text-slate-500">{cluster.companyCount} Companies Analyzed</span>
                <span className="text-slate-300">·</span>
                <span className="text-[12px] font-black" style={{ color: tabColor }}>{cluster.avgScore.toFixed(1)}</span>
                <span className="text-[10px] text-slate-400">Avg Solution Score</span>
              </div>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#0f2644] hover:border-slate-300 transition-colors flex-shrink-0">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">

          {/* Reasoning */}
          <div className="rounded-xl border-[1.5px] bg-[#edfdf5] p-4" style={{ borderColor: "#a7f3d0" }}>
            <div className="text-[10px] font-bold text-[#15b865] uppercase tracking-[.07em] mb-2">Reasoning</div>
            <p className="text-[12px] text-slate-600 leading-relaxed">{cluster.reasoning}</p>
            <div className="mt-2 text-[10px] text-[#15b865] font-semibold">Source(s): <span className="font-normal text-slate-400">Primary market research</span></div>
          </div>

          {/* Market Summary */}
          <div>
            <div className="text-[11px] font-bold text-[#0f2644] mb-2">Market Summary</div>
            <p className="text-[12px] text-slate-500 leading-relaxed">{cluster.marketSummary}</p>
          </div>

          {/* Companies Analysis */}
          <div>
            <div className="text-[11px] font-bold text-[#0f2644] mb-3">Companies Analysis</div>
            <div className="flex flex-col gap-4">
              {cluster.companyDetails.map((co, i) => {
                const customer = ALL_CUSTOMERS.find(c => c.name.toLowerCase().includes(co.name.toLowerCase().split(" ")[0]));
                const score = customer?.score ?? co.score;
                return (
                  <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    {/* Company header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-50">
                      {/* Logo avatar */}
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-[11px] font-black flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: co.logoColor }}>
                        {co.logoInitials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <a href={co.website} target="_blank" rel="noopener noreferrer"
                            className="text-[13px] font-bold text-[#1a56db] hover:underline leading-tight truncate">
                            {co.name}
                          </a>
                          <svg width="10" height="10" fill="none" stroke="#1a56db" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0 opacity-60">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{co.location}</div>
                      </div>
                      {/* Score badge */}
                      <div className={`text-[13px] font-black px-2.5 py-1 rounded-lg border flex-shrink-0 ${getScoreBg(score)}`}>
                        {score.toFixed(1)}
                      </div>
                    </div>
                    {/* Description */}
                    <div className="px-4 py-3">
                      <p className="text-[11px] text-slate-500 leading-relaxed">{co.description}</p>
                    </div>
                    {/* Sources */}
                    <div className="px-4 pb-3">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[.05em] mb-1.5">Source(s):</div>
                      <div className="flex flex-wrap gap-1.5">
                        {co.sources.map((src, si) => (
                          <a key={si} href={src.url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#1a56db] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full hover:bg-blue-100 transition-colors">
                            <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                            {src.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
              {cluster.companyCount > cluster.companyDetails.length && (
                <div className="text-center py-3 text-[11px] text-slate-400 bg-[#f8fafc] rounded-xl border border-dashed border-slate-200">
                  +{cluster.companyCount - cluster.companyDetails.length} more companies in this cluster
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PRODUCT DETAILS DRAWER — Delta Engine key features
// ─────────────────────────────────────────────
const DELTA_ENGINE_FEATURES = [
  {
    title: "Global pooled GPU compute resources",
    description: "On-demand GPU access; billed by use.",
    sources: [{ label: "Link 1", url: "https://www.databricks.com/product/machine-learning" }],
  },
  {
    title: "Unified dashboard for models and workflows",
    description: "Centralize development and management activities.",
    sources: [{ label: "Link 1", url: "https://www.databricks.com/product/mlflow" }],
  },
  {
    title: "No-code AI training and deployment tools",
    description: "Enable model building without coding expertise.",
    sources: [{ label: "Link 1", url: "https://www.databricks.com/product/automl" }],
  },
  {
    title: "Instant, elastic hardware scaling",
    description: "Deploy and scale resources in seconds.",
    sources: [{ label: "Link 1", url: "https://www.databricks.com/product/delta-engine" }],
  },
  {
    title: "Modular toolkit for AI app building",
    description: "Construct deployable AI apps using modules.",
    sources: [{ label: "Link 1", url: "https://www.databricks.com/product/mosaic-ai" }],
  },
  {
    title: "Single sign-on and unified account",
    description: "Simplified identity and account management.",
    sources: [{ label: "Link 1", url: "https://docs.databricks.com/en/administration-guide/users-groups/single-sign-on/index.html" }],
  },
  {
    title: "Enterprise-grade security and compliance",
    description: "Industry-compliant security and privacy features.",
    sources: [
      { label: "Link 1", url: "https://www.databricks.com/trust/security" },
      { label: "Link 2", url: "https://www.databricks.com/trust/compliance" },
    ],
  },
];

function ProductDetailsDrawer({ onClose }: { onClose: () => void }) {
  const featureIcons = [
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M6 21v-2a4 4 0 018 0v2"/></svg>,
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>,
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <div className="w-[700px] flex-shrink-0 bg-white flex flex-col h-full shadow-2xl border-l border-slate-200 overflow-hidden">

        {/* Header */}
        <div className="flex-shrink-0 px-6 pt-5 pb-4 border-b border-slate-100 bg-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0f2644] flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" fill="none" stroke="#1EDD7D" strokeWidth="2" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
              <div>
                <h2 className="text-[16px] font-black text-[#0f2644] leading-tight">Delta Engine</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">Product Analysis — Key Features & Capabilities</p>
              </div>
            </div>
            <button onClick={onClose}
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#0f2644] hover:border-slate-300 transition-colors flex-shrink-0">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          {/* Product description */}
          <p className="text-[12px] text-slate-500 leading-relaxed mt-3 pl-0">
            Enable accessible, <strong className="text-[#0f2644]">unified AI/ML</strong> model development, deployment, and{" "}
            <strong className="text-[#0f2644]">application creation</strong> via an all-in-one platform-as-a-service solution.
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-black uppercase tracking-[.08em] text-slate-400">Key Features</span>
            <span className="text-[11px] text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full font-medium">{DELTA_ENGINE_FEATURES.length} features</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {DELTA_ENGINE_FEATURES.map((f, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-[#f8fafc] p-4 hover:border-[#1EDD7D]/40 hover:bg-white hover:shadow-sm transition-all group">
                {/* Icon + Title row */}
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-[#1EDD7D] shadow-sm group-hover:border-[#1EDD7D]/40 transition-colors">
                    {featureIcons[i]}
                  </div>
                  <div className="text-[12px] font-bold text-[#0f2644] leading-snug pt-1">{f.title}</div>
                </div>
                {/* Description */}
                <p className="text-[11.5px] text-slate-500 leading-relaxed mb-2.5 pl-11">{f.description}</p>
                {/* Source links */}
                <div className="pl-11 flex flex-wrap gap-2">
                  {f.sources.map((src, si) => (
                    <a key={si} href={src.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#1a56db] hover:underline">
                      <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                      {src.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
function PotentialCustomerScanPage({ initialMarket = "core", onOpen }: { initialMarket?: MarketKey; onOpen: (c: Customer) => void }) {
  const [activeMarket, setActiveMarket] = useState<MarketKey>(initialMarket);
  const [detailCluster, setDetailCluster] = useState<MarketCluster | null>(null);
  const [productExpanded, setProductExpanded] = useState(true);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [scanTab, setScanTab] = useState<"market" | "profiles" | "excluded">("market");

  const activeTab = MARKET_TABS.find(t => t.key === activeMarket)!;

  const SCAN_CHILD_TABS = [
    { id: "market"   as const, label: "Market Analysis",      icon: <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
    { id: "profiles" as const, label: "Customer Profiles",    icon: <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> },
    { id: "excluded" as const, label: "Excluded Companies",   icon: <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> },
  ];

  return (
    <div className="flex flex-col gap-0 -mx-6 -my-5">

      {/* ── CHILD TAB BAR ── */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 flex gap-0">
        {SCAN_CHILD_TABS.map(t => (
          <button key={t.id} onClick={() => setScanTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-3 text-[12px] font-medium whitespace-nowrap border-b-[2.5px] transition-all ${
              scanTab === t.id
                ? "text-[#1EDD7D] border-[#1EDD7D] font-bold"
                : "text-slate-500 border-transparent hover:text-slate-700"
            }`}>
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── MARKET ANALYSIS TAB ── */}
      {scanTab === "market" && (
        <div className="flex flex-col gap-0 px-6 py-5">

      {/* ══ MARKET ANALYSIS SECTION ══ */}
      <div className="px-6 pt-5 pb-6">
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2">
            <svg width="13" height="13" fill="none" stroke="#1EDD7D" strokeWidth="2.5" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <h3 className="text-[14px] font-black text-[#0f2644]">Market Analysis</h3>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mb-5">
          Identify <strong className="text-blue-600">core</strong>, <strong className="text-orange-500">adjacent</strong>, and{" "}
          <strong className="text-violet-600">emerging</strong> market segments and companies aligned to the Delta Engine's key features
        </p>

        {/* Market Tab Switcher — matches reference full-width colored bar */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {MARKET_TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveMarket(tab.key)}
              className={`relative flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-[12px] font-bold transition-all border ${
                activeMarket === tab.key
                  ? "text-white border-transparent shadow-md"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              }`}
              style={activeMarket === tab.key ? { backgroundColor: tab.bg } : {}}>
              {tab.label}
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {/* Active underline indicator */}
              {activeMarket === tab.key && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full" style={{ backgroundColor: tab.bg }} />
              )}
            </button>
          ))}
        </div>

        {/* Market cluster cards — 2-column grid */}
        <div className="grid grid-cols-2 gap-4">
          {activeTab.data.map((cluster, cidx) => (
            <div key={cidx}>
              <MarketClusterCard cluster={cluster} marketKey={activeMarket} onViewDetails={setDetailCluster} />
            </div>
          ))}
        </div>
      </div>

      {/* ══ CLUSTER DETAIL SLIDE-IN DRAWER ══ */}
      {detailCluster && (
        <MarketInsightsDrawer
          cluster={detailCluster}
          marketKey={activeMarket}
          onClose={() => setDetailCluster(null)}
        />
      )}

      {/* ══ PRODUCT DETAILS SLIDE-IN DRAWER ══ */}
      {showProductDetails && (
        <ProductDetailsDrawer onClose={() => setShowProductDetails(false)} />
      )}
        </div>
      )}

      {/* ── CUSTOMER PROFILES TAB ── */}
      {scanTab === "profiles" && (
        <div className="px-6 py-5">
          <CardsPage onOpen={onOpen} />
        </div>
      )}

      {/* ── EXCLUDED COMPANIES TAB ── */}
      {scanTab === "excluded" && (
        <div className="px-6 py-5">
          <ExcludedPage />
        </div>
      )}

    </div>
  );
}

// ───────────────────────────────────────────── — existing Databricks Delta Engine customers
// ─────────────────────────────────────────────
interface ExcludedCompany {
  name: string;
  initials: string;
  logoColor: string;
  description: string;
  reasoning: string;
  sources: { label: string; url: string }[];
}

const EXCLUDED_COMPANIES: ExcludedCompany[] = [
  {
    name: "Comcast",
    initials: "CO",
    logoColor: "#000000",
    description: "Comcast Corporation is a U.S. media and technology conglomerate operating the Xfinity broadband and cable business, NBCUniversal's television and film assets, and Sky, providing internet, pay-TV, streaming, and content worldwide.",
    reasoning: "Official Databricks press release announcing Delta Engine quotes Comcast describing performance gains, confirming production use.",
    sources: [{ label: "Link 1", url: "https://www.databricks.com/blog/2021/06/17/announcing-photon-the-next-generation-query-engine-on-the-databricks-lakehouse-platform.html" }],
  },
  {
    name: "Deliveroo",
    initials: "DL",
    logoColor: "#00CCBC",
    description: "Deliveroo plc is a London-based online food delivery company that connects consumers with restaurants and grocery partners through its marketplace platform, offering logistics, order management, and last-mile delivery services across multiple countries.",
    reasoning: "Same Databricks Delta Engine launch press release lists Deliveroo as an early adopter, indicating active deployment.",
    sources: [{ label: "Link 1", url: "https://www.databricks.com/blog/2021/06/17/announcing-photon-the-next-generation-query-engine-on-the-databricks-lakehouse-platform.html" }],
  },
  {
    name: "Edmunds",
    initials: "ED",
    logoColor: "#1a5276",
    description: "Edmunds.com, Inc. is an American automotive information and e-commerce platform providing car listings, pricing data, expert reviews, and digital tools that help consumers and dealerships research, buy, and sell vehicles.",
    reasoning: "Edmunds is highlighted in the Databricks Delta Engine launch materials as a user benefiting from faster queries and lower costs.",
    sources: [{ label: "No sources information available", url: "" }],
  },
  {
    name: "Scribd",
    initials: "SC",
    logoColor: "#1A7BB9",
    description: "Scribd Inc. operates a digital subscription service offering unlimited access to e-books, audiobooks, magazines, podcasts, and documents, serving readers globally through its web and mobile applications.",
    reasoning: "A Databricks customer story states Scribd uses the platform for high-performing Spark processing with the help of Photon, the vectorized query engine that succeeded the original Delta Engine.",
    sources: [{ label: "Link 1", url: "https://www.databricks.com/customers/scribd" }, { label: "Link 2", url: "https://www.databricks.com/blog/2021/06/17/announcing-photon" }],
  },
  {
    name: "Starbucks",
    initials: "ST",
    logoColor: "#00704A",
    description: "Starbucks Corporation is a global specialty coffee retailer and roaster that operates thousands of company-owned and licensed cafés, selling coffee beverages, food, and branded consumer products in more than 80 markets.",
    reasoning: "An industry news publication, in an article about the Delta Engine launch, detailed how Starbucks uses Delta Lake and Spark as the foundation for its data analytics platform called 'BrewKit'.",
    sources: [{ label: "No sources information available", url: "" }],
  },
  {
    name: "Cerner Corporation",
    initials: "CE",
    logoColor: "#0070C0",
    description: "Cerner Corporation, now part of Oracle, develops health information technology solutions including electronic health record platforms, population health management, revenue cycle, and analytics software for hospitals and healthcare providers worldwide.",
    reasoning: "A TechTarget article covering the launch of Delta Engine explains how Cerner Corp. uses Delta Lake to ensure data quality and enable integrated data analysis from its data lakes.",
    sources: [{ label: "Link 1", url: "https://www.techtarget.com/searchdatamanagement/news/252502434" }],
  },
  {
    name: "Ankor",
    initials: "AN",
    logoColor: "#2C3E50",
    description: "Ankorstore SAS operates a European B2B wholesale marketplace that connects independent brands with local retailers, providing order aggregation, payment terms, and logistics services across home, beauty, food, and lifestyle categories.",
    reasoning: "In a Databricks presentation, the company shared that customer Ankor saw 2x improvements in query performance due to compaction features, a key benefit of the intelligent engine for Delta Lake.",
    sources: [{ label: "Link 1", url: "https://www.databricks.com/blog/2021/06/17/announcing-photon" }],
  },
  {
    name: "Plenitude",
    initials: "PL",
    logoColor: "#27AE60",
    description: "Plenitude S.p.A. Società Benefit, an Eni subsidiary, integrates renewable electricity generation, retail gas and power sales, and an extensive electric vehicle charging network to support the energy transition mainly in Europe and the United States.",
    reasoning: "A Databricks technical presentation highlights that Plenitude achieved 26% immediate cost savings after enabling predictive optimization, a core feature of the high-performance engine for Delta Lake.",
    sources: [{ label: "Link 1", url: "https://www.databricks.com/dataaisummit" }, { label: "Link 2", url: "https://www.databricks.com/blog/delta-lake-predictive-optimization" }],
  },
  {
    name: "Toca Boca",
    initials: "TB",
    logoColor: "#E74C3C",
    description: "Toca Boca AB is a Swedish children's digital entertainment studio that creates mobile games, creative apps, and interactive experiences designed to foster imaginative play for kids worldwide.",
    reasoning: "In a Databricks presentation, Toca is cited as a customer that replaced its custom maintenance pipeline with the platform's built-in predictive optimization, a key capability of the Delta Lake engine.",
    sources: [{ label: "Link 1", url: "https://www.databricks.com/dataaisummit" }, { label: "Link 2", url: "https://www.databricks.com/blog/delta-lake-predictive-optimization" }],
  },
];

// ─────────────────────────────────────────────
// EXCLUDED COMPANIES PAGE
// ─────────────────────────────────────────────
function ExcludedPage() {
  const [search, setSearch] = useState("");
  const [page, setPageNum] = useState(1);
  const PER_PAGE = 50;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return q ? EXCLUDED_COMPANIES.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.reasoning.toLowerCase().includes(q)
    ) : EXCLUDED_COMPANIES;
  }, [search]);

  const paginated = filtered.slice(0, page * PER_PAGE);

  return (
    <div className="flex flex-col gap-0">

      {/* ── PAGE HEADER ── */}
      <div className="pb-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <svg width="15" height="15" fill="none" stroke="#15b865" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
            </svg>
            <h3 className="text-[15px] font-black text-[#0f2644]">Excluded Existing Customer(s)</h3>
          </div>
          <p className="text-[12px] text-slate-500 leading-relaxed max-w-3xl">
            The Excluded Existing Customer(s) scouts, identifies verified B2B customers using the selected offering by analyzing credible public sources such as case studies, press releases, industry news, and official company communications. It ensures these{" "}
            <strong className="text-[#0f2644]">existing customers are excluded</strong> from assessment in subsequent steps.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={search} onChange={e => { setSearch(e.target.value); setPageNum(1); }}
              placeholder="Search excluded companies…"
              className="w-56 pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-[12px] bg-white text-slate-700 outline-none focus:border-[#1EDD7D] transition-colors shadow-sm" />
          </div>
          <div className="text-[11px] font-semibold text-slate-400 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            {filtered.length} companies
          </div>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="pb-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="grid border-b-2 border-slate-100 bg-[#f8fafc]" style={{ gridTemplateColumns: "220px 1fr 1fr 140px" }}>
            {["Company Name", "Description", "Reasoning", "Sources"].map(h => (
              <div key={h} className="px-5 py-3">
                <span className="text-[11px] font-bold text-[#0f2644] uppercase tracking-[.05em]">{h}</span>
              </div>
            ))}
          </div>

          {/* Rows */}
          {filtered.length === 0 && (
            <div className="py-16 text-center text-slate-400">
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="mx-auto mb-3 opacity-40"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <p className="text-[13px] font-medium">No companies match your search</p>
            </div>
          )}

          {filtered.map((company, idx) => (
            <div key={company.name}
              className={`grid border-b border-slate-50 hover:bg-[#f8fdfb] transition-colors group ${idx === filtered.length - 1 ? "border-b-0" : ""}`}
              style={{ gridTemplateColumns: "220px 1fr 1fr 140px" }}>

              {/* Company Name + Logo */}
              <div className="px-5 py-5 flex items-start gap-3 border-r border-slate-50">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-[11px] font-black flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: company.logoColor }}>
                  {company.initials}
                </div>
                <div className="min-w-0 pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-[#1a56db] leading-tight group-hover:underline cursor-pointer">
                      {company.name}
                    </span>
                    <svg width="10" height="10" fill="none" stroke="#1a56db" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0 opacity-60">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    <span className="text-[10px] font-semibold text-red-400">Existing Customer</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="px-5 py-5 border-r border-slate-50">
                <p className="text-[12px] text-slate-600 leading-relaxed">{company.description}</p>
              </div>

              {/* Reasoning */}
              <div className="px-5 py-5 border-r border-slate-50">
                <p className="text-[12px] text-slate-600 leading-relaxed">
                  {company.reasoning.split(/(Delta Engine|Delta Lake|Databricks|Photon|predictive optimization|compaction|BrewKit)/g).map((part, i) =>
                    ["Delta Engine", "Delta Lake", "Databricks", "Photon", "predictive optimization", "compaction", "BrewKit"].includes(part)
                      ? <strong key={i} className="text-[#0f2644] font-semibold">{part}</strong>
                      : part
                  )}
                </p>
              </div>

              {/* Sources */}
              <div className="px-5 py-5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[.06em] mb-2">Source(s):</div>
                <div className="flex flex-col gap-1.5">
                  {company.sources.map((src, si) => (
                    src.url ? (
                      <a key={si} href={src.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] text-[#1a56db] font-medium hover:underline">
                        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                        {src.label}
                      </a>
                    ) : (
                      <span key={si} className="text-[11px] text-slate-400 italic">{src.label}</span>
                    )
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination footer */}
        <div className="flex items-center justify-between pt-4">
          <span className="text-[12px] text-slate-400">
            Showing <strong className="text-[#0f2644]">1–{Math.min(page * PER_PAGE, filtered.length)}</strong> of{" "}
            <strong className="text-[#0f2644]">{filtered.length}</strong>
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-slate-400">Rows per page:</span>
            <span className="text-[12px] font-semibold text-[#0f2644] bg-white border border-slate-200 rounded-lg px-2.5 py-1 shadow-sm">50</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
function ShareModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://chesz.io/report/databricks-delta-engine";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareOptions = [
    { label: "Copy Link", icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>, action: handleCopy },
    { label: "Email", icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, action: () => { window.open(`mailto:?subject=Target Customer Report — Databricks Delta Engine&body=View the full report: ${shareUrl}`); onClose(); } },
    { label: "Slack", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.165 0a2.528 2.528 0 012.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.165 24a2.527 2.527 0 01-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 01-2.52-2.523 2.526 2.526 0 012.52-2.52h6.313A2.527 2.527 0 0124 15.165a2.528 2.528 0 01-2.522 2.523h-6.313z"/></svg>, action: () => { onClose(); } },
  ];

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[420px] overflow-hidden">
        {/* Header */}
        <div className="bg-[#0f2644] px-6 py-5 flex items-start justify-between">
          <div>
            <div className="text-[15px] font-black text-white">Share Report</div>
            <div className="text-[11px] text-[#7dd3fc] mt-0.5">Target Customer Identification — Databricks Delta Engine</div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors flex-shrink-0">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* URL copy row */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[.06em] mb-2">Report Link</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#f4f6f9] border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-500 truncate select-all">{shareUrl}</div>
              <button onClick={handleCopy} className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold transition-all ${copied ? "bg-[#edfdf5] text-[#15b865] border border-[#a7f3d0]" : "bg-[#0f2644] text-white hover:bg-[#1a4a7a]"}`}>
                {copied
                  ? <><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>
                  : <><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy</>
                }
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[11px] text-slate-400 font-medium">or share via</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Share options */}
          <div className="grid grid-cols-3 gap-2">
            {shareOptions.map(opt => (
              <button key={opt.label} onClick={opt.action} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-200 hover:border-[#1EDD7D] hover:bg-[#edfdf5] transition-all group">
                <span className="text-slate-400 group-hover:text-[#15b865] transition-colors">{opt.icon}</span>
                <span className="text-[11px] font-semibold text-slate-500 group-hover:text-[#0f2644]">{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Access note */}
          <div className="flex items-start gap-2.5 rounded-xl bg-[#f4f6f9] border border-slate-200 p-3">
            <svg width="13" height="13" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p className="text-[11px] text-slate-500 leading-relaxed">Anyone with this link can view the report. The link is valid for <strong className="text-slate-700">30 days</strong>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DOWNLOAD MODAL
// ─────────────────────────────────────────────
function DownloadModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<"json" | "csv" | "pdf">("json");
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);

  const formats = [
    { id: "json" as const, label: "JSON", ext: ".json", desc: "Full structured data with all customer fields", icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> },
    { id: "csv" as const, label: "CSV", ext: ".csv", desc: "Spreadsheet-compatible flat format for Excel", icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/></svg> },
    { id: "pdf" as const, label: "PDF Report", ext: ".pdf", desc: "Formatted report for presentations and sharing", icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
  ];

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      if (selected === "json") {
        const json = JSON.stringify(ALL_CUSTOMERS, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "databricks-delta-engine-target-customers.json"; a.click();
        URL.revokeObjectURL(url);
      } else if (selected === "csv") {
        const headers = ["Name", "Score", "HQ", "Size", "Revenue", "Net Margin", "Revenue Growth", "Industry Align", "Growth", "Tech Gaps", "Strategic", "Geo Reach", "Invest Cap"];
        const rows = ALL_CUSTOMERS.map(c => [
          `"${c.name}"`, c.score, `"${c.hq}"`, `"${c.size}"`, `"${c.revenue}"`, `"${c.netMargin}"`, `"${c.revenueGrowth}"`,
          ...c.criteria
        ]);
        const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "databricks-delta-engine-target-customers.csv"; a.click();
        URL.revokeObjectURL(url);
      } else {
        // PDF — trigger print dialog as a graceful fallback
        window.print();
      }
      setDownloading(false);
      setDone(true);
      setTimeout(() => { setDone(false); onClose(); }, 1800);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[440px] overflow-hidden">
        {/* Header */}
        <div className="bg-[#0f2644] px-6 py-5 flex items-start justify-between">
          <div>
            <div className="text-[15px] font-black text-white">Download Report</div>
            <div className="text-[11px] text-[#7dd3fc] mt-0.5">91 customers · Databricks Delta Engine</div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[.06em] mb-2.5">Select Format</div>
            <div className="flex flex-col gap-2">
              {formats.map(f => (
                <button key={f.id} onClick={() => setSelected(f.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-[1.5px] transition-all text-left ${selected === f.id ? "border-[#1EDD7D] bg-[#edfdf5]" : "border-slate-200 hover:border-slate-300 bg-white"}`}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${selected === f.id ? "bg-[#1EDD7D] text-white" : "bg-[#f4f6f9] text-slate-400"}`}>{f.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[13px] font-bold ${selected === f.id ? "text-[#0f2644]" : "text-slate-600"}`}>{f.label}</span>
                      <span className="text-[10px] font-mono font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{f.ext}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{f.desc}</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${selected === f.id ? "border-[#1EDD7D] bg-[#1EDD7D]" : "border-slate-300"}`}>
                    {selected === f.id && <svg width="8" height="8" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-xl bg-[#f4f6f9] border border-slate-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="13" height="13" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span className="text-[12px] font-semibold text-slate-600">databricks-delta-engine-target-customers{formats.find(f => f.id === selected)?.ext}</span>
            </div>
            <span className="text-[11px] font-medium text-slate-400">91 records</span>
          </div>

          {/* Download button */}
          <button onClick={handleDownload} disabled={downloading || done}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold transition-all ${done ? "bg-[#edfdf5] text-[#15b865] border border-[#a7f3d0]" : "bg-[#0f2644] text-white hover:bg-[#1a4a7a]"} disabled:opacity-70`}>
            {done
              ? <><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Downloaded!</>
              : downloading
                ? <><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="animate-spin"><circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12"/></svg>Preparing…</>
                : <><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Download {formats.find(f => f.id === selected)?.label}</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FEEDBACK MODAL
// ─────────────────────────────────────────────
// FEEDBACK MODAL — Conversational Flow
// ─────────────────────────────────────────────
// ── Chip data ────────────────────────────────
const VALUABLE_CHIPS = [
  { id: "customer_profiles", label: "Customer Profiles" },
  { id: "scoring",           label: "Customer Scoring & Ranking" },
  { id: "pain_points",       label: "Pain Point Analysis" },
  { id: "growth",            label: "Growth Signals" },
  { id: "prioritization",    label: "Customer Prioritization" },
  { id: "other",             label: "Other" },
];

const INSIGHTS_VALUABLE_CHIPS = [
  { id: "prioritization",    label: "Customer Prioritization" },
  { id: "pain_points",       label: "Pain Point Insights" },
  { id: "market_insights",   label: "Market Insights" },
  { id: "growth",            label: "Growth Signals" },
  { id: "strategic",         label: "Strategic Recommendations" },
  { id: "other",             label: "Other" },
];

const CONFIDENCE_CHIPS = [
  { id: "very_confident",     label: "Very Confident" },
  { id: "somewhat_confident", label: "Somewhat Confident" },
  { id: "neutral",            label: "Neutral" },
  { id: "not_confident",      label: "Not Very Confident" },
];

const ANALYSIS_ISSUE_CHIPS = [
  { id: "data_accuracy",  label: "Data Accuracy Issues" },
  { id: "not_relevant",   label: "Customers Not Relevant" },
  { id: "hallucination",  label: "Hallucinated / Incorrect Information" },
  { id: "missing",        label: "Missing Important Customer Segments" },
  { id: "insufficient",   label: "Insufficient Depth of Analysis" },
  { id: "hard_to_understand", label: "Difficult to Understand" },
  { id: "other",          label: "Other" },
];

const INSIGHTS_ISSUE_CHIPS = [
  { id: "data_accuracy",  label: "Data Accuracy Issues" },
  { id: "not_relevant",   label: "Insights Not Relevant or Useful" },
  { id: "hallucination",  label: "Hallucinated / Incorrect Information" },
  { id: "missing",        label: "Missing Important Insights" },
  { id: "insufficient",   label: "Insufficient Depth of Analysis" },
  { id: "hard_to_understand", label: "Difficult to Understand" },
  { id: "other",          label: "Other" },
];

const SOLVED_CHIPS = [
  { id: "fully",     label: "✅ Fully" },
  { id: "partially", label: "⚡ Partially" },
  { id: "not_yet",   label: "⏳ Not Yet" },
];

const RECOMMEND_CHIPS = [
  { id: "yes",   label: "👍 Yes" },
  { id: "no",    label: "👎 No" },
  { id: "maybe", label: "🤔 Maybe" },
];

// ── Shared UI components ─────────────────────
function YesNoButtons({ value, onChange }: { value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {[{ v: true, label: "👍 Yes" }, { v: false, label: "👎 No" }].map(opt => (
        <button
          key={String(opt.v)}
          onClick={() => onChange(opt.v)}
          className="flex items-center px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all"
          style={{
            backgroundColor: value === opt.v ? (opt.v ? "#edfdf5" : "#fef2f2") : "#f8fafc",
            borderWidth: "1.5px", borderStyle: "solid",
            borderColor: value === opt.v ? (opt.v ? "#1EDD7D" : "#fca5a5") : "#cbd5e1",
            color: value === opt.v ? (opt.v ? "#15b865" : "#dc2626") : "#374151",
            transform: value === opt.v ? "scale(1.04)" : "scale(1)",
          }}
        >{opt.label}</button>
      ))}
    </div>
  );
}

function ChipSelect({ chips, value, onChange, multi = false }: {
  chips: { id?: string; value?: string; label: string }[];
  value: string | string[] | null;
  onChange: (v: string | string[]) => void;
  multi?: boolean;
}) {
  const getId = (c: { id?: string; value?: string; label: string }) => c.id ?? c.value ?? c.label;
  const isSelected = (c: { id?: string; value?: string; label: string }) => {
    const id = getId(c);
    return multi ? (value as string[] || []).includes(id) : value === id;
  };
  const handleClick = (c: { id?: string; value?: string; label: string }) => {
    const id = getId(c);
    if (multi) {
      const cur = (value as string[] || []);
      onChange(isSelected(c) ? cur.filter(x => x !== id) : [...cur, id]);
    } else { onChange(id); }
  };
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {chips.map((c, i) => (
        <button key={getId(c) ?? i} onClick={() => handleClick(c)}
          className="flex items-center px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all"
          style={{
            backgroundColor: isSelected(c) ? "#edfdf5" : "#f8fafc",
            borderColor:     isSelected(c) ? "#1EDD7D" : "#e2e8f0",
            color:           isSelected(c) ? "#15b865" : "#475569",
            transform:       isSelected(c) ? "scale(1.04)" : "scale(1)",
          }}
        >{c.label}</button>
      ))}
    </div>
  );
}

function QuestionBlock({ number, text, children, dimmed = false }: { number: number; text: string; children: React.ReactNode; dimmed?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4" style={{ opacity: dimmed ? 0.45 : 1, transition: "opacity 0.2s" }}>
      <div className="flex items-start gap-2.5">
        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "#bbffc7" }}>
          <span style={{ fontSize: "10px", fontWeight: 800, color: "#0f2644" }}>{number}</span>
        </div>
        <div className="flex-1">
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#0f2644", lineHeight: 1.4 }}>{text}</div>
          {children}
        </div>
      </div>
    </div>
  );
}

function FollowUp({ label, note, children }: { label: string; note?: boolean; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <div className="flex flex-col gap-0.5 mb-1.5 rounded-lg px-2.5 py-1.5 mt-2" style={{ backgroundColor: "#e8f4ff" }}>
        <div className="flex items-center gap-2">
          <div style={{ width: "3px", height: "14px", backgroundColor: "#1EDD7D", borderRadius: "2px", flexShrink: 0 }} />
          <div className="text-[12px] font-semibold" style={{ color: "#000000" }}>{label}</div>
        </div>
        {note && (
          <p style={{ fontSize: "12px", color: "#303030", margin: "2px 0 0 5px", fontStyle: "italic" }}>
            <strong>Note :</strong> You may select multiple items where applicable.
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

function FbTextarea({ value, onChange, placeholder, borderColor = "#1EDD7D", bg = "#f8fdfb" }: {
  value: string; onChange: (v: string) => void; placeholder: string; borderColor?: string; bg?: string;
}) {
  return (
    <div>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
        className="fb-ta w-full rounded-xl border border-slate-200 text-[12px] p-3 resize-none focus:outline-none"
        style={{ color: "#334155", backgroundColor: bg, outlineColor: borderColor }}
      />

    </div>
  );
}

// ── FeedbackModal ────────────────────────────
function FeedbackModal({ onClose, isHomePage }: { onClose: () => void; isHomePage?: boolean }) {
  // ── Research page state (existing) ──
  const [q1, setQ1] = useState<boolean | null>(null);
  const [q2, setQ2] = useState<string[]>([]);
  const [q3, setQ3] = useState<string>("");
  const [q4, setQ4] = useState<string>("");
  const [q5, setQ5] = useState<string>("");
  const [q6, setQ6] = useState<boolean | null>(null);
  const [q7, setQ7] = useState<string[]>([]);
  const [q8, setQ8] = useState<string>("");
  const [q9, setQ9] = useState<string>("");
  const [q10, setQ10] = useState<string>("");
  const [q11, setQ11] = useState<string>("");
  const [q12, setQ12] = useState<string>("");
  const [q14, setQ14] = useState<string>("");
  const [q15, setQ15] = useState<string>("");

  // ── Dashboard page state ──
  const [dq1, setDq1] = useState<string>("");        // Q1: research outputs helpful? (Yes/Partially/No)
  const [dq2, setDq2] = useState<string>("");        // Q2: most valuable research jobs (text)
  const [dq3, setDq3] = useState<string>("");        // Q3: recommend? (Yes/Maybe/No)
  const [dq4, setDq4] = useState<string>("");        // Q4: invite colleagues? (Yes/No)
  const [dq5, setDq5] = useState<string>("");        // Q5: additional solutions? (Yes/No)
  const [dq6, setDq6] = useState<string>("");        // Q6: which solutions? (text, only if Q5=Yes)
  const [dq7, setDq7] = useState<string>("");        // Q7: additional comments (text)

  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Progress tracking
  const answeredCount = isHomePage
    ? [dq1, dq3, dq4, dq5].filter(v => v !== "").length
    : [q1, q6, q11, q12, q14].filter(v => v !== null && v !== "").length;
  const canSubmit = isHomePage
    ? dq1 !== "" && dq3 !== "" && dq4 !== "" && dq5 !== ""
    : q1 !== null && q6 !== null;

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setDone(true); }, 900);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, backgroundColor: "rgba(15, 38, 68, 0.55)" }} />
      <style>{`
        @keyframes fb-grow {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .fb-modal { animation: fb-grow 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; transform-origin: center center; }
        .fb-ta::placeholder { color: #94a3b8 !important; opacity: 1; }
      `}</style>
      <div className="absolute bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col fb-modal"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "780px", minHeight: "320px", maxHeight: "calc(100vh - 60px)" }}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-3.5 bg-[#0f2644] rounded-t-2xl">
          <div className="flex items-center gap-2">
            {isHomePage ? (
              <svg width="15" height="15" fill="none" stroke="#1EDD7D" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="8" cy="7" r="4"/><path d="M2 21v-1a6 6 0 016-6h2"/><path d="M15 11h6a2 2 0 012 2v4a2 2 0 01-2 2h-1l-2 2-2-2h-1a2 2 0 01-2-2v-4a2 2 0 012-2z"/></svg>
            ) : (
              <svg width="18" height="18" fill="none" stroke="#1EDD7D" strokeWidth="13" viewBox="0 0 160 175" strokeLinecap="round" strokeLinejoin="round"><rect x="0" y="0" width="160" height="130" rx="18"/><polygon points="65,130 80,158 95,130" fill="currentColor" stroke="none"/><line x1="80" y1="18" x2="80" y2="10"/><line x1="104" y1="25" x2="110" y2="19"/><line x1="113" y1="50" x2="121" y2="50"/><line x1="104" y1="75" x2="110" y2="81"/><line x1="56" y1="25" x2="50" y2="19"/><line x1="47" y1="50" x2="39" y2="50"/><line x1="56" y1="75" x2="50" y2="81"/><path d="M80 28 C67 28 57 38 57 51 C57 60 62 68 71 73 L71 83 Q71 90 80 90 Q89 90 89 83 L89 73 C98 68 103 60 103 51 C103 38 93 28 80 28Z" fill="none"/><line x1="71" y1="90" x2="89" y2="90"/><line x1="73" y1="97" x2="87" y2="97"/><line x1="75" y1="104" x2="85" y2="104"/></svg>
            )}
            <span style={{ fontSize: "15px", fontWeight: 700, color: "white" }}>{isHomePage ? "Platform Feedback" : "Research Feedback"}</span>
          </div>
          <div className="flex items-center gap-3">
            {started && <div className="flex items-center gap-1.5">
              {(isHomePage ? [
                { n: 1, active: dq1 !== "" },
                { n: 2, active: dq3 !== "" },
                { n: 3, active: dq4 !== "" },
                { n: 4, active: dq5 !== "" },
              ] : [
                { n: 1, active: q1 !== null },
                { n: 2, active: q6 !== null },
                { n: 3, active: q11 !== "" },
                { n: 4, active: q12 !== "" },
                { n: 5, active: q14 !== "" },
              ]).map((s, i, arr) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="flex items-center justify-center rounded-full transition-all"
                    style={{ width: "20px", height: "20px", backgroundColor: s.active ? "#1EDD7D" : "rgba(255,255,255,0.15)", border: s.active ? "none" : "1.5px solid rgba(255,255,255,0.3)" }}
                  >
                    {s.active
                      ? <svg width="10" height="10" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                      : <span style={{ fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>{s.n}</span>
                    }
                  </div>
                  {i < arr.length - 1 && <div style={{ width: "14px", height: "1.5px", backgroundColor: i < (answeredCount - 1) ? "#1EDD7D" : "rgba(255,255,255,0.2)", borderRadius: "2px" }} />}
                </div>
              ))}
            </div>}
            <button onClick={onClose} className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4" style={{ minHeight: 0 }}>
          {!started ? (
            <div className="flex flex-col items-center justify-center py-10 text-center px-6" style={{ position: "relative", backgroundImage: `url(${JSON.stringify("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4QEVRXhpZgAASUkqAAgAAAADAA4BAgDLAAAAMgAAABoBBQABAAAA/QAAABsBBQABAAAABQEAAAAAAABBYnN0cmFjdCBjb2xvcmZ1bCB3YXZlIGVsZW1lbnQgZm9yIGRlc2lnbi4gRGlnaXRhbCBmcmVxdWVuY3kgdHJhY2sgZXF1YWxpemVyLiBTdHlsaXplZCBsaW5lIGFydCBiYWNrZ3JvdW5kLiBWZWN0b3IgaWxsdXN0cmF0aW9uLiBXYXZlIHdpdGggbGluZXMgY3JlYXRlZCB1c2luZyBibGVuZCB0b29sLiBDdXJ2ZWQgd2F2eSBsaW5lLCBzbW9vdGggc3RyaXBlLiwBAAABAAAALAEAAAEAAAD/4QZDaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIj4KCTxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CgkJPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczpJcHRjNHhtcENvcmU9Imh0dHA6Ly9pcHRjLm9yZy9zdGQvSXB0YzR4bXBDb3JlLzEuMC94bWxucy8iICAgeG1sbnM6R2V0dHlJbWFnZXNHSUZUPSJodHRwOi8veG1wLmdldHR5aW1hZ2VzLmNvbS9naWZ0LzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGx1cz0iaHR0cDovL25zLnVzZXBsdXMub3JnL2xkZi94bXAvMS4wLyIgIHhtbG5zOmlwdGNFeHQ9Imh0dHA6Ly9pcHRjLm9yZy9zdGQvSXB0YzR4bXBFeHQvMjAwOC0wMi0yOS8iIHhtbG5zOnhtcFJpZ2h0cz0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3JpZ2h0cy8iIHBob3Rvc2hvcDpDcmVkaXQ9IkdldHR5IEltYWdlcyIgR2V0dHlJbWFnZXNHSUZUOkFzc2V0SUQ9IjE0NjE0OTAyMzIiIHhtcFJpZ2h0czpXZWJTdGF0ZW1lbnQ9Imh0dHBzOi8vd3d3LmlzdG9ja3Bob3RvLmNvbS9sZWdhbC9saWNlbnNlLWFncmVlbWVudD91dG1fbWVkaXVtPW9yZ2FuaWMmYW1wO3V0bV9zb3VyY2U9Z29vZ2xlJmFtcDt1dG1fY2FtcGFpZ249aXB0Y3VybCIgcGx1czpEYXRhTWluaW5nPSJodHRwOi8vbnMudXNlcGx1cy5vcmcvbGRmL3ZvY2FiL0RNSS1QUk9ISUJJVEVELUVYQ0VQVFNFQVJDSEVOR0lORUlOREVYSU5HIiA+CjxkYzpjcmVhdG9yPjxyZGY6U2VxPjxyZGY6bGk+U2VyZ2V5IExvYm9kZW5rbzwvcmRmOmxpPjwvcmRmOlNlcT48L2RjOmNyZWF0b3I+PGRjOmRlc2NyaXB0aW9uPjxyZGY6QWx0PjxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+QWJzdHJhY3QgY29sb3JmdWwgd2F2ZSBlbGVtZW50IGZvciBkZXNpZ24uIERpZ2l0YWwgZnJlcXVlbmN5IHRyYWNrIGVxdWFsaXplci4gU3R5bGl6ZWQgbGluZSBhcnQgYmFja2dyb3VuZC4gVmVjdG9yIGlsbHVzdHJhdGlvbi4gV2F2ZSB3aXRoIGxpbmVzIGNyZWF0ZWQgdXNpbmcgYmxlbmQgdG9vbC4gQ3VydmVkIHdhdnkgbGluZSwgc21vb3RoIHN0cmlwZS48L3JkZjpsaT48L3JkZjpBbHQ+PC9kYzpkZXNjcmlwdGlvbj4KPHBsdXM6TGljZW5zb3I+PHJkZjpTZXE+PHJkZjpsaSByZGY6cGFyc2VUeXBlPSdSZXNvdXJjZSc+PHBsdXM6TGljZW5zb3JVUkw+aHR0cHM6Ly93d3cuaXN0b2NrcGhvdG8uY29tL3Bob3RvL2xpY2Vuc2UtZ20xNDYxNDkwMjMyLT91dG1fbWVkaXVtPW9yZ2FuaWMmYW1wO3V0bV9zb3VyY2U9Z29vZ2xlJmFtcDt1dG1fY2FtcGFpZ249aXB0Y3VybDwvcGx1czpMaWNlbnNvclVS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")})`, backgroundSize: "cover", backgroundPosition: "center" }}>
              <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(255,255,255,0.92)" }} />
              <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: "#e8f4ff" }}>
                {isHomePage ? (
                  <svg width="38" height="38" fill="none" stroke="#0f2644" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="8" cy="7" r="4"/><path d="M2 21v-1a6 6 0 016-6h2"/><path d="M15 11h6a2 2 0 012 2v4a2 2 0 01-2 2h-1l-2 2-2-2h-1a2 2 0 01-2-2v-4a2 2 0 012-2z"/></svg>
                ) : (
                  <svg width="38" height="38" fill="none" stroke="#1EDD7D" strokeWidth="13" viewBox="0 0 160 175" strokeLinecap="round" strokeLinejoin="round"><rect x="0" y="0" width="160" height="130" rx="18"/><polygon points="65,130 80,158 95,130" fill="#1EDD7D" stroke="none"/><line x1="80" y1="18" x2="80" y2="10"/><line x1="104" y1="25" x2="110" y2="19"/><line x1="113" y1="50" x2="121" y2="50"/><line x1="104" y1="75" x2="110" y2="81"/><line x1="56" y1="25" x2="50" y2="19"/><line x1="47" y1="50" x2="39" y2="50"/><line x1="56" y1="75" x2="50" y2="81"/><path d="M80 28 C67 28 57 38 57 51 C57 60 62 68 71 73 L71 83 Q71 90 80 90 Q89 90 89 83 L89 73 C98 68 103 60 103 51 C103 38 93 28 80 28Z" fill="none"/><line x1="71" y1="90" x2="89" y2="90"/><line x1="73" y1="97" x2="87" y2="97"/><line x1="75" y1="104" x2="85" y2="104"/></svg>
                )}
              </div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#0f2644", marginBottom: "12px" }}>How was your experience with Chesz?</div>
              <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.8", maxWidth: "500px", marginBottom: "28px", textAlign: "center" }}>
                We'd love to hear what you think. Share what's working and where we can do more. It takes under 2 minutes.
              </p>
              <div className="flex items-center gap-2 mb-5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#15b865" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#15b865" }}>Note: Feedback can be provided in any language.</span>
              </div>
              <button
                onClick={() => setStarted(true)}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all hover:opacity-90"
                style={{ backgroundColor: "#0f2644", color: "white", fontSize: "14px" }}
              >
                Start Feedback
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              </div>
            </div>
          ) : done ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#edfdf5] border-2 border-[#a7f3d0] flex items-center justify-center mb-4">
                <svg width="28" height="28" fill="none" stroke="#1EDD7D" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div className="text-[16px] font-bold text-[#0f2644] mb-2">Thank you!</div>
              <p className="text-[12px] text-slate-500 leading-relaxed max-w-[280px]">Your feedback helps us improve the quality and accuracy of this research.</p>
              <button onClick={onClose} className="mt-6 px-8 py-2.5 rounded-xl bg-[#0f2644] text-white text-[12px] font-bold">Close</button>
            </div>
          ) : isHomePage ? (
            /* ── DASHBOARD / HOME PAGE QUESTIONS ── */
            <div className="flex flex-col gap-3">

              {/* DQ1 — Research outputs helpful? */}
              <QuestionBlock number={1} text="Are the research outputs helping you solve your business challenges?">
                <ChipSelect chips={[{ label: "👍 Yes", value: "yes" }, { label: "⚡ Partially", value: "partially" }, { label: "👎 No", value: "no" }]} value={dq1} onChange={v => setDq1(v as string)} />
                {dq1 === "yes" && (
                  <FollowUp label="Which research jobs have been most valuable to you?">
                    <FbTextarea value={dq2} onChange={setDq2} placeholder="📝 Share which research jobs you found most valuable…" />
                  </FollowUp>
                )}
                {(dq1 === "partially" || dq1 === "no") && (
                  <FollowUp label="Please provide additional details or how we can help you?">
                    <FbTextarea value={dq2} onChange={setDq2} placeholder="📝 Share any additional details…" />
                  </FollowUp>
                )}
              </QuestionBlock>

              {/* DQ3 — Recommend? */}
              <QuestionBlock number={2} text="Would you recommend this solution to a colleague?">
                <ChipSelect chips={[{ label: "👍 Yes", value: "yes" }, { label: "🤔 Maybe", value: "maybe" }, { label: "👎 No", value: "no" }]} value={dq3} onChange={v => setDq3(v as string)} />
                {(dq3 === "maybe" || dq3 === "no") && (
                  <FollowUp label="Please provide additional details or how we can help you?">
                    <FbTextarea value={dq7} onChange={setDq7} placeholder="📝 Share any additional details…" />
                  </FollowUp>
                )}
              </QuestionBlock>

              {/* DQ4 — Invite colleagues? */}
              <QuestionBlock number={3} text="Would you be interested in inviting colleagues to use this research solution?">
                <ChipSelect chips={[{ label: "👍 Yes", value: "yes" }, { label: "👎 No", value: "no" }]} value={dq4} onChange={v => setDq4(v as string)} />
                {dq4 === "no" && (
                  <FollowUp label="Please provide additional details or how we can help you?">
                    <FbTextarea value={dq7} onChange={setDq7} placeholder="📝 Share any additional details…" />
                  </FollowUp>
                )}
              </QuestionBlock>

              {/* DQ5 — Additional solutions? */}
              <QuestionBlock number={4} text="Are there any additional research solutions or capabilities you would like to try?">
                <ChipSelect chips={[{ label: "👍 Yes", value: "yes" }, { label: "👎 No", value: "no" }]} value={dq5} onChange={v => { setDq5(v as string); if (v !== "yes") setDq6(""); }} />
                {dq5 === "yes" && (
                  <FollowUp label="If yes, which solution(s) would you like to explore?">
                    <FbTextarea value={dq6} onChange={setDq6} placeholder="📝 Describe the solutions or capabilities you'd like to explore…" />
                  </FollowUp>
                )}
                {dq5 === "no" && (
                  <FollowUp label="Please provide additional details or how we can help you?">
                    <FbTextarea value={dq6} onChange={setDq6} placeholder="📝 Share any additional details…" />
                  </FollowUp>
                )}
              </QuestionBlock>

              {/* DQ7 — Additional comments */}
              <QuestionBlock number={5} text="Any additional comments or suggestions?">
                <FbTextarea value={dq7} onChange={setDq7} placeholder="📝 Share any improvements, thoughts, or suggestions…" />
              </QuestionBlock>

              {canSubmit && (
                <div className="flex justify-center gap-2 mt-1">
                  <button onClick={onClose}
                    className="px-5 py-1.5 rounded-lg text-[11px] font-bold transition-all border border-slate-200 hover:bg-slate-50"
                    style={{ color: "#64748b", backgroundColor: "white" }}
                  >
                    Cancel
                  </button>
                  <button onClick={handleSubmit} disabled={submitting}
                    className="px-5 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                    style={{ backgroundColor: "#0f2644", color: "white" }}
                  >
                    {submitting ? "Submitting…" : "Submit Feedback"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── RESEARCH PAGE QUESTIONS (existing) ── */
            <div className="flex flex-col gap-3">

              {/* Q1 — Is the target customer analysis helpful? */}
              <QuestionBlock number={1} text="Is the target customer analysis helpful in identifying the right customer segments?">
                <YesNoButtons value={q1} onChange={v => { setQ1(v); }} />
                {q1 === true && (
                  <>
                    <FollowUp label="What did you find most valuable in the target customer analysis?" note>
                      <ChipSelect chips={VALUABLE_CHIPS} value={q2} onChange={v => setQ2(v as string[])} multi />
                    </FollowUp>
                  </>
                )}
                {q1 === false && (
                  <>
                    <FollowUp label="What was the primary issue with the target customer analysis?" note>
                      <ChipSelect chips={ANALYSIS_ISSUE_CHIPS} value={q4} onChange={v => setQ4(v as string[])} multi />
                    </FollowUp>
                    <FollowUp label="Please provide additional details about the target customer analysis. (Optional)">
                      <FbTextarea value={q5} onChange={setQ5} placeholder="📝 Share any additional details…" />
                    </FollowUp>
                  </>
                )}
              </QuestionBlock>

              {/* Q6 — Are the target customer insights helpful? */}
              <QuestionBlock number={2} text="Are the target customer insights helpful in making a decision?">
                <YesNoButtons value={q6} onChange={v => { setQ6(v); }} />
                {q6 === true && (
                  <>
                    <FollowUp label="What did you find most valuable in the target customer insights?" note>
                      <ChipSelect chips={INSIGHTS_VALUABLE_CHIPS} value={q7} onChange={v => setQ7(v as string[])} multi />
                    </FollowUp>
                  </>
                )}
                {q6 === false && (
                  <>
                    <FollowUp label="What was the primary issue with the target customer insights?" note>
                      <ChipSelect chips={INSIGHTS_ISSUE_CHIPS} value={q9} onChange={v => setQ9(v as string[])} multi />
                    </FollowUp>
                    <FollowUp label="Please provide additional details about the target customer insights. (Optional)">
                      <FbTextarea value={q10} onChange={setQ10} placeholder="📝 Share any additional details…" />
                    </FollowUp>
                  </>
                )}
              </QuestionBlock>

              {/* Q11 */}
              <QuestionBlock number={3} text="Did the target customer analysis and insights help solve the problem you were trying to address?">
                <ChipSelect chips={SOLVED_CHIPS} value={q11} onChange={v => setQ11(v as string)} />
              </QuestionBlock>

              {/* Q12 */}
              <QuestionBlock number={4} text="Would you be willing to share this solution output with a colleague?">
                <ChipSelect chips={RECOMMEND_CHIPS} value={q12} onChange={v => setQ12(v as string)} />
              </QuestionBlock>

              {/* Q13 */}
              <QuestionBlock number={5} text="Any additional comments or suggestions?">
                <FbTextarea value={q14} onChange={setQ14} placeholder="📝 Share any improvements, thoughts, or suggestions…" />
              </QuestionBlock>

              {canSubmit && (
                <div className="flex justify-center gap-2 mt-1">
                  <button onClick={onClose}
                    className="px-5 py-1.5 rounded-lg text-[11px] font-bold transition-all border border-slate-200 hover:bg-slate-50"
                    style={{ color: "#64748b", backgroundColor: "white" }}
                  >
                    Cancel
                  </button>
                  <button onClick={handleSubmit} disabled={submitting}
                    className="px-5 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                    style={{ backgroundColor: "#0f2644", color: "white" }}
                  >
                    {submitting ? "Submitting…" : "Submit Feedback"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



// ─────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────
const RESEARCH_TOOLS = [
  { icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00FF7F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 12h4"/><path d="M10 8h4"/><path d="M14 21v-3a2 2 0 0 0-4 0v3"/><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/></svg>`, title: "Company Listing", desc: "Identify the major companies and analyze how the industry is organized within a specific research domain or sector." },
  { icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00FF7F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"/><path d="M16 12h2"/><path d="M16 8h2"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/><path d="M6 12h2"/><path d="M6 8h2"/></svg>`, title: "Use Case Profile", desc: "Generate an in-depth profile of a specific Use case, covering its purpose, benefits, key stakeholders, implementation approach, and industry relevance." },
  { icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00FF7F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.341 6.484A10 10 0 0 1 10.266 21.85"/><path d="M3.659 17.516A10 10 0 0 1 13.74 2.152"/><circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/></svg>`, title: "White Space Identification", desc: "Whitespace identification is the process of uncovering opportunities in an existing market. It reveals gaps where existing solutions fail to address demand effectively." },
  { icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00FF7F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/></svg>`, title: "Target Customer Identification", desc: "Identify, rank, and profile high-potential customers across geographies and industries. Generate evidence-based company dossiers outlining key business and financial overviews." },
  { icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00FF7F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/><path d="m16 16-1.9-1.9"/></svg>`, title: "Adjacent Market Discovery", desc: "Analyze adjacent markets to identify cross-sector opportunities and strategic extensions aligned with core JTBD and growth objectives." },
  { icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00FF7F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/></svg>`, title: "Technology Profile", desc: "To assess and detail a company's technological strengths, innovation activities, and strategic direction within a defined research domain." },
  { icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00FF7F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`, title: "Market Analysis", desc: "Analyze a defined market to deliver a concise overview of its segments, size, growth dynamics, key players, and major demand drivers." },
  { icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00FF7F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" y1="14" x2="9" y2="18"/><line x1="7" y1="11" x2="11" y2="7"/></svg>`, title: "Competitive Landscape", desc: "Assess the competitive environment within a defined market to identify key players, positioning themes, and recent strategic developments shaping market dynamics." },
  { icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00FF7F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`, title: "Growth Opportunity Discovery", desc: "Identifies your next high-potential growth opportunity, the right accounts to pursue, and the revenue pipeline, providing enterprise teams with a structured, actionable output." },
  { icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00FF7F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`, title: "Activity Profile", desc: "To track and analyze key business activities such as product launches, funding events, strategic partnerships, and mergers & acquisitions to gain insight into a company's growth strategy." },
  { icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00FF7F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>`, title: "Financial Profile", desc: "To analyze core financial indicators in order to evaluate the company's economic health, stability, and potential for sustainable growth." },
  { icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00FF7F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>`, title: "Leadership Profile", desc: "To analyze the background, expertise, and leadership approach of key executives to understand their impact on the company's strategic direction and overall performance." },
];

function HomePage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="flex-1 overflow-y-auto bg-white" style={{ padding: "32px 40px" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#0f2644", marginBottom: "4px" }}>
            Hi Debi, Welcome back to Chesz AI
          </h1>
          <div style={{ fontSize: "16px", fontWeight: 600, color: "#0f2644", marginBottom: "2px" }}>
            What do you want to research today?
          </div>
          <div style={{ fontSize: "12px", color: "#64748b" }}>
            Power your innovation journey with focused research tools designed to surface critical insights across companies and technologies.
          </div>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white"
          style={{ backgroundColor: "#1EDD7D", fontSize: "13px", whiteSpace: "nowrap" }}
        >
          <span style={{ fontSize: "16px" }}>+</span> Create New
        </button>
      </div>

      {/* Research Tool Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0", border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", marginBottom: "40px" }}>
        {RESEARCH_TOOLS.map((tool, i) => (
          <div key={i}
            style={{
              padding: "28px 24px",
              borderRight: (i + 1) % 3 !== 0 ? "1px solid #e2e8f0" : "none",
              borderBottom: i < 9 ? "1px solid #e2e8f0" : "none",
              display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "10px",
              background: "white"
            }}
          >
            {tool.icon.startsWith("<svg")
              ? <div style={{ marginBottom: "2px" }} dangerouslySetInnerHTML={{ __html: tool.icon }} />
              : <div style={{ fontSize: "32px", marginBottom: "2px" }}>{tool.icon}</div>
            }
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f2644" }}>{tool.title}</div>
            <div style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.6", flexGrow: 1 }}>{tool.desc}</div>
            <button
              onClick={() => { if (tool.title === "Target Customer Identification") onNavigate("overview"); }}
              style={{
                marginTop: "8px", padding: "7px 20px", borderRadius: "6px", fontSize: "12px", fontWeight: 600,
                border: "1.5px solid #1EDD7D", color: "#0f2644", background: "white", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "6px"
              }}
            >
              Start Research <span style={{ fontSize: "14px" }}>→</span>
            </button>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div>
        <div style={{ fontSize: "18px", fontWeight: 700, color: "#0f2644", marginBottom: "4px" }}>My recent activities</div>
        <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "16px" }}>View and manage recent activities and projects.</div>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0" }}>
            <div style={{ padding: "10px 20px", fontSize: "13px", fontWeight: 600, color: "#0f2644", borderBottom: "2px solid #0f2644", cursor: "pointer" }}>Active Researches</div>
            <div style={{ padding: "10px 20px", fontSize: "13px", color: "#94a3b8", cursor: "pointer" }}>Pending Researches</div>
          </div>
          {/* Empty state */}
          <div style={{ padding: "60px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <div style={{ fontSize: "40px", color: "#cbd5e1" }}>
              <svg width="48" height="48" fill="none" stroke="#cbd5e1" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <div style={{ fontSize: "16px", fontWeight: 600, color: "#475569" }}>No Activities Yet</div>
            <div style={{ fontSize: "13px", color: "#94a3b8" }}>Start your journey by creating your first research profile.</div>
            <button style={{ marginTop: "8px", padding: "9px 24px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, background: "#1EDD7D", color: "white", border: "none", cursor: "pointer" }}>
              + Create New
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ACCOUNT SETTINGS PAGE
// ─────────────────────────────────────────────
const NOTIFICATION_OPTIONS = [
  {
    id: "regular",
    label: "Regular (Default)",
    desc: "Receive feedback reminders for each research output individually.",
  },
  {
    id: "every15days",
    label: "Every 15 Days",
    desc: <>Receive a <strong>consolidated</strong> feedback reminder <u>containing</u> all projects executed in the last <strong>15 days</strong>.</>,
  },
  {
    id: "monthly",
    label: "Monthly",
    desc: <>Receive a <strong>consolidated</strong> feedback reminder <u>containing</u> all projects executed during the last month.</>,
  },
];

function AccountSettingsPage() {
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState("debip.mishra@ideapoke.com");
  const [password, setPassword] = useState("password123");
  const [emailDraft, setEmailDraft] = useState(email);
  const [passwordDraft, setPasswordDraft] = useState(password);
  const [showPassword, setShowPassword] = useState(false);

  // Notification settings
  const [notifSelected, setNotifSelected] = useState("regular");
  const [notifSaved, setNotifSaved] = useState("regular");
  const [notifDirty, setNotifDirty] = useState(false);

  const handleNotifSelect = (id: string) => {
    setNotifSelected(id);
    setNotifDirty(id !== notifSaved);
  };
  const handleNotifSave = () => {
    setNotifSaved(notifSelected);
    setNotifDirty(false);
  };
  const handleNotifCancel = () => {
    setNotifSelected(notifSaved);
    setNotifDirty(false);
  };

  const handleEdit = () => {
    setEmailDraft(email);
    setPasswordDraft(password);
    setEditing(true);
  };
  const handleSave = () => {
    setEmail(emailDraft);
    setPassword(passwordDraft);
    setEditing(false);
  };
  const handleCancel = () => setEditing(false);

  return (
    <div className="max-w-3xl mx-auto py-2">
      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#1e293b", marginBottom: "4px" }}>Account Settings</h1>
          <p style={{ fontSize: "13px", color: "#64748b" }}>View and manage your Account Setting</p>
        </div>
        {!editing && (
          <button
            onClick={handleEdit}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-[13px] font-medium text-slate-600 shadow-sm"
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit or Update
          </button>
        )}
      </div>

      {/* Basic card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-7 py-6">
        <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#1e293b", marginBottom: "20px" }}>Basic</h2>

        <div className="flex flex-col gap-5">
          {/* Email */}
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Email Id</div>
            {editing ? (
              <input
                type="email"
                value={emailDraft}
                onChange={e => setEmailDraft(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1EDD7D]/40 focus:border-[#1EDD7D]"
                style={{ maxWidth: "360px" }}
              />
            ) : (
              <div style={{ fontSize: "14px", color: "#1e293b" }}>{email}</div>
            )}
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #f1f5f9" }} />

          {/* Password */}
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Password</div>
            {editing ? (
              <div className="relative" style={{ maxWidth: "360px" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordDraft}
                  onChange={e => setPasswordDraft(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 pr-10 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1EDD7D]/40 focus:border-[#1EDD7D]"
                />
                <button
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            ) : (
              <div style={{ fontSize: "14px", color: "#1e293b", letterSpacing: "3px" }}>{"•".repeat(6)}</div>
            )}
          </div>
        </div>

        {/* Save / Cancel buttons */}
        {editing && (
          <div className="flex items-center gap-2 mt-6 pt-5" style={{ borderTop: "1px solid #f1f5f9" }}>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg text-[12px] font-bold transition-all"
              style={{ backgroundColor: "#1EDD7D", color: "white" }}
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="px-5 py-2 rounded-lg text-[12px] font-bold transition-all border border-slate-200 hover:bg-slate-50"
              style={{ color: "#64748b", backgroundColor: "white" }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* ── Notification Settings card ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-7 py-6 mt-5">
        <div className="flex items-center justify-between mb-1">
          <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#1e293b" }}>Notification Settings</h2>
        </div>
        <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "20px" }}>Choose how often you'd like to receive feedback reminders.</p>

        <div className="flex flex-col gap-0 rounded-lg border border-slate-200 overflow-hidden">
          {NOTIFICATION_OPTIONS.map((opt, i) => {
            const isSelected = notifSelected === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => handleNotifSelect(opt.id)}
                className="flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors"
                style={{
                  backgroundColor: isSelected ? "#f0fdf7" : "white",
                  borderTop: i > 0 ? "1px solid #f1f5f9" : "none",
                }}
              >
                {/* Toggle switch */}
                <div className="flex-shrink-0 mt-0.5">
                  <div
                    className="relative transition-all"
                    style={{
                      width: "36px", height: "20px",
                      borderRadius: "999px",
                      backgroundColor: isSelected ? "#1EDD7D" : "#cbd5e1",
                      transition: "background-color 0.2s",
                    }}
                  >
                    <div style={{
                      position: "absolute",
                      top: "3px",
                      left: isSelected ? "19px" : "3px",
                      width: "14px", height: "14px",
                      borderRadius: "50%",
                      backgroundColor: "white",
                      boxShadow: "0 1px 3px rgba(0,0,0,.2)",
                      transition: "left 0.2s",
                    }} />
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div style={{
                    fontSize: "13px",
                    fontWeight: isSelected ? 700 : 600,
                    color: isSelected ? "#0f2644" : "#475569",
                    marginBottom: "3px",
                  }}>{opt.label}</div>
                  <div style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.55" }}>{opt.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Save / Cancel */}
        {notifDirty && (
          <div className="flex items-center gap-2 mt-5 pt-4" style={{ borderTop: "1px solid #f1f5f9" }}>
            <button
              onClick={handleNotifSave}
              className="px-5 py-2 rounded-lg text-[12px] font-bold transition-all"
              style={{ backgroundColor: "#1EDD7D", color: "white" }}
            >
              Save Changes
            </button>
            <button
              onClick={handleNotifCancel}
              className="px-5 py-2 rounded-lg text-[12px] font-bold transition-all border border-slate-200 hover:bg-slate-50"
              style={{ color: "#64748b", backgroundColor: "white" }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────
export default function Feedback() {
  const [page, setPage] = useState<Page>("home");
  const [activeNav, setActiveNav] = useState(0);
  const [drawer, setDrawer] = useState<Customer | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [scanMarket, setScanMarket] = useState<MarketKey>("core");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showUserMenu) return;
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showUserMenu]);

  const handleShare = () => { setShowShareModal(true); };

  const navToPage: Record<number, Page> = { 0: "home", 1: "overview", 2: "eval", 3: "dossier", 4: "insights" };

  // Research nav (index 1) stays active for all research sub-pages
  const researchPages: Page[] = ["overview", "scan", "eval", "dossier", "insights"];
  const effectiveNav = page === "home" ? 0 : researchPages.includes(page) ? 1 : activeNav;

  const navigateTo = (dest: Page, market?: MarketKey) => {
    if (market) setScanMarket(market);
    setPage(dest);
    const idx = Object.values(navToPage).indexOf(dest);
    if (idx !== -1) setActiveNav(idx);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f6f9] font-[Inter,sans-serif]">
      {/* ── GLOBAL HEADER ── */}
      <header className="bg-white border-b border-slate-200 px-5 h-14 flex items-center justify-between fixed top-0 left-0 right-0 z-[200] shadow-[0_1px_4px_rgba(0,0,0,.06)]">
        <div className="flex items-center gap-3">
          {/* CHESZ Logo */}
          <img onClick={() => setPage("home")} style={{ cursor: "pointer" }} src="data:image/png;base64,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" alt="CHESZ" style={{ height: "32px", width: "auto" }} />
        </div>
        <div className="flex items-center gap-2">
          {/* Feedback button */}
          <button onClick={() => setShowFeedbackModal(f => !f)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold border border-[#1EDD7D] text-[#15b865] hover:bg-[#edfdf5] transition-colors">
            {page === "home" ? (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="8" cy="7" r="4"/><path d="M2 21v-1a6 6 0 016-6h2"/><path d="M15 11h6a2 2 0 012 2v4a2 2 0 01-2 2h-1l-2 2-2-2h-1a2 2 0 01-2-2v-4a2 2 0 012-2z"/></svg>
            ) : (
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="13" viewBox="0 0 160 175" strokeLinecap="round" strokeLinejoin="round"><rect x="0" y="0" width="160" height="130" rx="18"/><polygon points="65,130 80,158 95,130" fill="currentColor" stroke="none"/><line x1="80" y1="18" x2="80" y2="10"/><line x1="104" y1="25" x2="110" y2="19"/><line x1="113" y1="50" x2="121" y2="50"/><line x1="104" y1="75" x2="110" y2="81"/><line x1="56" y1="25" x2="50" y2="19"/><line x1="47" y1="50" x2="39" y2="50"/><line x1="56" y1="75" x2="50" y2="81"/><path d="M80 28 C67 28 57 38 57 51 C57 60 62 68 71 73 L71 83 Q71 90 80 90 Q89 90 89 83 L89 73 C98 68 103 60 103 51 C103 38 93 28 80 28Z" fill="none"/><line x1="71" y1="90" x2="89" y2="90"/><line x1="73" y1="97" x2="87" y2="97"/><line x1="75" y1="104" x2="85" y2="104"/></svg>
            )}
            {page === "home" ? "Platform Feedback" : "Research Feedback"}
          </button>
          {/* Invite button */}
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold border border-[#1EDD7D] text-[#15b865] hover:bg-[#edfdf5] transition-colors">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            Invite
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            Tour
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Help
          </button>
          {/* User avatar + dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(v => !v)}
              className="w-8 h-8 rounded-full bg-[#1EDD7D] flex items-center justify-center text-[11px] font-extrabold text-white flex-shrink-0 hover:opacity-90 transition-opacity ring-2 ring-transparent hover:ring-[#1EDD7D]/40"
              style={{ outline: showUserMenu ? "2px solid #1EDD7D" : "none", outlineOffset: "2px" }}
            >DM</button>

            {showUserMenu && (
              <div
                className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 z-[999] overflow-hidden"
                style={{ top: "100%" }}
              >
                {/* User info */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="text-[13px] font-semibold text-slate-800">Debi Mishra</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">debip.mishra@ideapoke.com</div>
                </div>
                {/* Menu items */}
                <div className="py-1">
                  <button
                    onClick={() => setShowUserMenu(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-[12px] text-slate-600 hover:bg-slate-50 transition-colors text-left"
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Profile Settings
                  </button>
                  <button
                    onClick={() => { setShowUserMenu(false); setPage("account-settings"); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-[12px] text-slate-600 hover:bg-slate-50 transition-colors text-left"
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                    Account Settings
                  </button>
                </div>
                <div className="border-t border-slate-100 py-1">
                  <button
                    onClick={() => setShowUserMenu(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-[12px] text-red-500 hover:bg-red-50 transition-colors text-left"
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1" style={{ marginTop: "56px" }}>
        {/* ── LEFT SIDEBAR ── */}
        <aside className="w-[210px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col z-[80] overflow-y-auto fixed left-0 top-[56px] bottom-0">
          <nav className="flex-1 p-2.5 flex flex-col gap-0.5">
            {/* Dashboard item with chevron */}
            <button onClick={() => { setActiveNav(0); setPage("home"); }}
              className={`flex items-center justify-between py-2 rounded-lg text-[13px] w-full text-left transition-all border-l-[3px] ${
                effectiveNav === 0
                  ? "bg-[#edfdf5] text-[#15b865] font-semibold border-[#1EDD7D] pl-[9px] pr-3"
                  : "text-slate-500 font-medium border-transparent px-3 hover:bg-slate-50 hover:text-slate-700"
              }`}>
              <div className="flex items-center gap-2.5">
                <span className={effectiveNav === 0 ? "opacity-100" : "opacity-70"}>
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                </span>
                <span>Dashboard</span>
              </div>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            {/* Research (Target Customer Research) */}
            <button onClick={() => { setActiveNav(1); setPage("overview"); }}
              className={`flex items-center gap-2.5 py-2 rounded-lg text-[13px] w-full text-left transition-all border-l-[3px] ${
                effectiveNav === 1
                  ? "bg-[#edfdf5] text-[#15b865] font-semibold border-[#1EDD7D] pl-[9px] pr-3"
                  : "text-slate-500 font-medium border-transparent px-3 hover:bg-slate-50 hover:text-slate-700"
              }`}>
              <span className={effectiveNav === 1 ? "opacity-100" : "opacity-70"}>
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
              </span>
              <span>Research</span>
            </button>

            {/* Workflow (Evaluation) */}
            <button onClick={() => { setActiveNav(2); setPage(navToPage[2]); }}
              className={`flex items-center gap-2.5 py-2 rounded-lg text-[13px] w-full text-left transition-all border-l-[3px] ${
                effectiveNav === 2
                  ? "bg-[#edfdf5] text-[#15b865] font-semibold border-[#1EDD7D] pl-[9px] pr-3"
                  : "text-slate-500 font-medium border-transparent px-3 hover:bg-slate-50 hover:text-slate-700"
              }`}>
              <span className={effectiveNav === 2 ? "opacity-100" : "opacity-70"}>
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><path d="M12 7v10"/><path d="M8 11h8"/><circle cx="6" cy="15" r="2"/><circle cx="18" cy="15" r="2"/></svg>
              </span>
              <span>Workflow</span>
            </button>

            {/* Projects (Dossier Profiles) */}
            <button onClick={() => { setActiveNav(3); setPage(navToPage[3]); }}
              className={`flex items-center gap-2.5 py-2 rounded-lg text-[13px] w-full text-left transition-all border-l-[3px] ${
                effectiveNav === 3
                  ? "bg-[#edfdf5] text-[#15b865] font-semibold border-[#1EDD7D] pl-[9px] pr-3"
                  : "text-slate-500 font-medium border-transparent px-3 hover:bg-slate-50 hover:text-slate-700"
              }`}>
              <span className={effectiveNav === 3 ? "opacity-100" : "opacity-70"}>
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
              </span>
              <span>Projects</span>
            </button>

            {/* Members */}
            <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-slate-500 w-full text-left border-l-[3px] border-transparent hover:bg-slate-50 hover:text-slate-700 transition-all">
              <span className="opacity-70"><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg></span>
              <span>Members</span>
            </button>

            {/* Pending Requests */}
            <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-slate-500 w-full text-left border-l-[3px] border-transparent hover:bg-slate-50 hover:text-slate-700 transition-all">
              <span className="opacity-70"><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
              <span>Pending Requests</span>
            </button>

            {/* Shares */}
            <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-slate-500 w-full text-left border-l-[3px] border-transparent hover:bg-slate-50 hover:text-slate-700 transition-all">
              <span className="opacity-70"><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg></span>
              <span>Shares</span>
            </button>

            {/* Invitation History */}
            <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-slate-500 w-full text-left border-l-[3px] border-transparent hover:bg-slate-50 hover:text-slate-700 transition-all">
              <span className="opacity-70"><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span>
              <span>Invitation History</span>
            </button>

            {/* Document Repository */}
            <button onClick={() => { setActiveNav(4); setPage(navToPage[4]); }}
              className={`flex items-center gap-2.5 py-2 rounded-lg text-[13px] w-full text-left transition-all border-l-[3px] ${
                effectiveNav === 4
                  ? "bg-[#edfdf5] text-[#15b865] font-semibold border-[#1EDD7D] pl-[9px] pr-3"
                  : "text-slate-500 font-medium border-transparent px-3 hover:bg-slate-50 hover:text-slate-700"
              }`}>
              <span className={effectiveNav === 4 ? "opacity-100" : "opacity-70"}>
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </span>
              <span>Document Repository</span>
            </button>

            {/* Customer Info */}
            <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-slate-500 w-full text-left border-l-[3px] border-transparent hover:bg-slate-50 hover:text-slate-700 transition-all">
              <span className="opacity-70"><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg></span>
              <span>Customer Info</span>
            </button>
          </nav>
          {/* Credits footer */}
          <div className="p-3 border-t-[1.5px] border-slate-200 flex-shrink-0">
            <div className="rounded-[10px] p-3 border-[1.5px] border-slate-200 bg-[#f4f6f9]">
              <div className="flex items-center gap-1.5 mb-2">
                <svg width="13" height="13" fill="none" stroke="#1EDD7D" strokeWidth="2.5" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <span className="text-[12px] font-bold text-[#0f2644]">Credits</span>
              </div>
              <div className="flex justify-between mb-1.5">
                <span className="text-[10px] font-medium text-slate-400">Used</span>
                <span className="text-[10px] font-semibold text-slate-500">24871/30000</span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden bg-slate-200 mb-1.5">
                <div className="h-full w-[82.9%] rounded-full bg-[#1EDD7D]" />
              </div>
              <div className="text-[10px] text-center font-medium text-slate-400">5129 remaining</div>
            </div>
          </div>
        </aside>

        {/* ── MAIN AREA ── */}
        <div className="flex flex-col flex-1 overflow-hidden min-w-0" style={{ marginLeft: "210px", height: "calc(100vh - 56px)", overflowY: "auto" }}>
          {/* Project title bar — hidden on home/dashboard and account-settings pages */}
          {page !== "home" && page !== "account-settings" && (
          <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between gap-4 shadow-[0_1px_3px_rgba(0,0,0,.05)]">
            <div className="min-w-0">
              <div className="text-[17px] font-bold text-[#0f2644] leading-snug truncate">
                Target Customer Identification — Databricks Delta Engine
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Identify, rank, and profile high-potential customers across geographies and industries
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={handleShare} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[12px] font-semibold text-[#2563eb] hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Share
              </button>
              <button onClick={() => setShowDownloadModal(true)} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[12px] font-semibold text-[#2563eb] hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download
              </button>
              <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-colors">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
              </button>
            </div>
          </div>
          )}

          {/* NAV TABS — hidden on home/dashboard and account-settings pages */}
          {page !== "home" && page !== "account-settings" && (
          <nav className="flex-shrink-0 bg-white border-b border-slate-200 px-6 flex overflow-x-auto shadow-[0_1px_4px_rgba(0,0,0,.04)]">
            {NAV_TABS.map(tab => (
              <button key={tab.id} onClick={() => { setPage(tab.id); const idx = Object.values(navToPage).indexOf(tab.id); if (idx !== -1) setActiveNav(idx); }}
                className={`px-4 py-3 flex items-center gap-1.5 text-[13px] font-medium transition-all whitespace-nowrap border-b-[3px] flex-shrink-0 ${
                  page === tab.id
                    ? "text-[#1EDD7D] border-[#1EDD7D] font-bold"
                    : "text-slate-500 border-transparent hover:text-slate-700"
                }`}>
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
          )}

          {/* SCROLLABLE CONTENT */}
          <main className={`flex-1 overflow-y-auto px-6 py-5`}>
            {page === "home"              && <HomePage onNavigate={navigateTo} />}
            {page === "overview"          && <OverviewPage onNavigate={navigateTo} onOpen={setDrawer} />}
            {page === "scan"              && <PotentialCustomerScanPage initialMarket={scanMarket} onOpen={setDrawer} />}
            {page === "eval"              && <EvalPage onOpen={setDrawer} />}
            {page === "dossier"           && <DossierPage onOpen={setDrawer} />}
            {page === "insights"          && <InsightsPage />}
            {page === "account-settings"  && <AccountSettingsPage />}
          </main>
        </div>
      </div>

      {/* DRAWER */}
      {drawer && <CustomerDrawer customer={drawer} onClose={() => setDrawer(null)} />}

      {/* SHARE MODAL */}
      {showShareModal && <ShareModal onClose={() => setShowShareModal(false)} />}

      {/* DOWNLOAD MODAL */}
      {showDownloadModal && <DownloadModal onClose={() => setShowDownloadModal(false)} />}

      {/* FEEDBACK MODAL */}
      {showFeedbackModal && <FeedbackModal onClose={() => setShowFeedbackModal(false)} isHomePage={page === "home"} />}


    </div>
  );
}

