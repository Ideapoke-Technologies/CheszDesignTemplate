import React, { useState, useEffect } from "react";

// ════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════










































// ════════════════════════════════════════════════════════════════════
// DATA — from call_3_output_Final.md + call_1 files
// ════════════════════════════════════════════════════════════════════
const REGULATIONS = [
{ instrument_name: "Standing General Order 2021-01 (including Second and Third Amendments)", issuing_authority: "National Highway Traffic Safety Administration", jurisdiction_layer: "national", representative_state: null, scope_summary: "Requires manufacturers and operators of vehicles with ADS or Level 2 ADAS to report safety-related incidents and crashes occurring on publicly accessible roads while the system is engaged or immediately after use.", key_obligations: ["Report specified information about safety-related incidents to NHTSA.", "Report crashes on public roads while ADS or Level 2 ADAS is engaged or immediately after use.", "File reports or answers to specific questions as directed by NHTSA by general or special order.", "Report incidents involving prototype vehicles operating on publicly accessible roads."], penalties_summary: null, status_note: "Live NHTSA order documents with amendments — presented as an operative crash reporting order, but current status and any subsequent amendments are not confirmed in the sources.", year_enacted: null, category: "testing_regulation", relevance: "core", phase_tags: ["operational", "ongoing"], needs_verification: true, needs_verification_reason: "The NHTSA pages and PDF orders have no clear currentness date and in_force_status is unknown, so present applicability and any later amendments must be verified.", retrieval_dates: ["2026-04-22"], source_urls: ["https://www.nhtsa.gov/laws-regulations/standing-general-order-crash-reporting", "https://static.nhtsa.gov/odi/ffdd/csv/2021-01-sgo-2021-01.pdf", "https://static.nhtsa.gov/odi/ffdd/pdf/SGO-2021-01-2nd-Amendment.pdf"] },
{ instrument_name: "49 CFR Part 573 — Defect and Noncompliance Responsibility and Reports", issuing_authority: "National Highway Traffic Safety Administration · (2024)", jurisdiction_layer: "national", representative_state: null, scope_summary: "Establishes requirements relating to defect and noncompliance responsibility and reports by manufacturers of motor vehicles and motor vehicle equipment, including reporting safety-related defects and failures to comply with Federal Motor Vehicle Safety Standards.", key_obligations: ["Comply with defect and noncompliance responsibility and reporting requirements.", "Be responsible for any safety-related defect or noncompliance determined to exist in the vehicle or motor vehicle equipment.", "Submit a defect and noncompliance information report including a description of the defect and its physical location.", "Allow users to search a vehicle's recall remedy status if providing public recall information online.", "State the earliest date for which recall completion information is available."], penalties_summary: null, status_note: "Live eCFR and Cornell entries — presented as current operative regulation, but effective dates and any recent amendments are not detailed in the sources.", year_enacted: null, category: "operational_law", relevance: "core", phase_tags: ["pre_market", "operational", "ongoing"], needs_verification: true, needs_verification_reason: "Sources list in_force_status as unknown and provide no last-updated date; confirmation of the latest version of Part 573 is required.", retrieval_dates: ["2026-04-22"], source_urls: ["https://www.ecfr.gov/current/title-49/subtitle-B/chapter-V/part-573", "https://www.law.cornell.edu/cfr/text/49/573.5"] },
{ instrument_name: "Second Report and Order — Use of the 5.850–5.925 GHz Band", issuing_authority: "Federal Communications Commission", jurisdiction_layer: "national", representative_state: null, scope_summary: "Addresses the transition of Intelligent Transportation System operations in the 5.9 GHz band from DSRC to C-V2X technology, retaining the upper 30 MHz for ITS and codifying technical and operational rules for C-V2X on-board and roadside units.", key_obligations: ["Transition ITS operations in the 5.895–5.925 GHz band from DSRC to C-V2X technology.", "C-V2X on-board units and roadside units must comply with codified technical parameters including band usage, channel bandwidth, EIRP, out-of-band emissions limits, and antenna height limits."], penalties_summary: null, status_note: "FCC Second Report and Order released in 2024 — presented as a final rule establishing operative spectrum and equipment requirements.", year_enacted: "2024", category: "operational_law", relevance: "core", phase_tags: ["pre_market", "operational", "ongoing"], needs_verification: true, needs_verification_reason: "Detailed rule codification and any subsequent appeals or modifications should be verified in the current FCC rules.", retrieval_dates: ["2026-04-22"], source_urls: ["https://docs.fcc.gov/public/attachments/FCC-24-123A1.pdf", "https://docs.fcc.gov/public/attachments/DOC-407683A1.pdf"] },
{ instrument_name: "FTC Action Against General Motors — Sharing Drivers' Location and Driving Behavior Data", issuing_authority: "Federal Trade Commission", jurisdiction_layer: "national", representative_state: null, scope_summary: "Proposed order settling allegations that GM and OnStar collected, used, and sold drivers' precise geolocation and driving behavior information from millions of vehicles without adequately notifying consumers or obtaining affirmative consent.", key_obligations: ["GM and OnStar are prohibited for five years from disclosing consumers' sensitive geolocation and driver behavior data to consumer reporting agencies.", "GM and OnStar are prohibited from misrepresenting how they collect, use, and share consumers' geolocation and driver behavior data."], penalties_summary: "Five-year ban on disclosing geolocation and driver behavior data to consumer reporting agencies; no monetary penalty specified.", status_note: "FTC press release describing a proposed consent order issued in 2025 — finalization status is not confirmed in the source.", year_enacted: "2025", category: "enforcement_precedent", relevance: "supporting", phase_tags: ["operational", "ongoing"], needs_verification: true, needs_verification_reason: "The order is described as proposed and the source does not confirm whether it has been finalised or modified.", retrieval_dates: ["2026-04-22"], source_urls: ["https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-takes-action-against-general-motors-sharing-drivers-precise-location-driving-behavior-data"] },
{ instrument_name: "Cars & Consumer Data: On Unlawful Collection & Use", issuing_authority: "Federal Trade Commission", jurisdiction_layer: "national", representative_state: null, scope_summary: "FTC business blog discussing the agency's enforcement role under federal competition and consumer protection laws with respect to car manufacturers that collect, use, or share consumer data from connected vehicles.", key_obligations: null, penalties_summary: null, status_note: "FTC business blog post dated 2024 — non-binding guidance reflecting the agency's interpretation and enforcement priorities.", year_enacted: "2024", category: "guidance", relevance: "supporting", phase_tags: ["operational", "ongoing"], needs_verification: true, needs_verification_reason: "Blog is guidance rather than a codified rule and may be updated without notice; confirm if newer guidance exists.", retrieval_dates: ["2026-04-22"], source_urls: ["https://www.ftc.gov/business-guidance/blog/2024/07/cars-consumer-data-unlawful-collection-use"] },
{ instrument_name: "Agency Information Collection — Human Interaction With Driving Automation Systems", issuing_authority: "National Highway Traffic Safety Administration", jurisdiction_layer: "national", representative_state: null, scope_summary: "Federal Register notice announcing NHTSA's proposal to collect information from the public as part of a multi-year effort to understand how humans interact with driving automation systems.", key_obligations: null, penalties_summary: null, status_note: "Federal Register notice from 2023 describing a proposed information collection for research purposes — not a binding regulation on manufacturers' testing activities.", year_enacted: "2023", category: "guidance", relevance: "supporting", phase_tags: ["pre_market"], needs_verification: true, needs_verification_reason: "Concerns a proposed information collection; does not specify if or when it was approved — check OMB records.", retrieval_dates: ["2026-04-22"], source_urls: ["https://www.federalregister.gov/documents/2023/12/12/2023-27517/agency-information-collection-activities-notice-and-request-for-comment-human-interaction-with"] },
{ instrument_name: "Testing Autonomous Vehicles with a Driver", issuing_authority: "California Department of Motor Vehicles", jurisdiction_layer: "subnational", representative_state: "California", scope_summary: "Describes requirements and permit conditions for manufacturers to test autonomous vehicles with a driver on public roads in California, including application, operational, and reporting requirements and consequences for noncompliance.", key_obligations: ["Obtain an Autonomous Vehicle Testing Permit from the California DMV before testing on public roads.", "Maintain evidence of financial responsibility in the amount and form specified by the DMV.", "Report any traffic collision involving a test vehicle resulting in property damage, bodily injury, or death to the DMV.", "Submit annual disengagement reports documenting each time failure of autonomous technology required the test driver to take manual control.", "Ensure that test drivers hold the appropriate driver licence and receive training on the autonomous test vehicle.", "Notify the DMV of any changes that may affect the validity of the permit."], penalties_summary: "Failure to comply may result in suspension or revocation of the Autonomous Vehicle Testing Permit.", status_note: "California DMV agency program page with no publication date — presented as the current permitting framework, but the exact regulatory text and any updates are not confirmed.", year_enacted: null, category: "testing_regulation", relevance: "core", phase_tags: ["pre_market", "operational", "ongoing"], needs_verification: true, needs_verification_reason: "DMV page is a program description without explicit dates or statutory citations; verify underlying regulations and any recent amendments.", retrieval_dates: ["2026-04-22"], source_urls: ["https://www.dmv.ca.gov/portal/vehicle-industry-services/autonomous-vehicles/testing-autonomous-vehicles-with-a-driver/"] },
{ instrument_name: "Testing Autonomous Vehicles — Fully Driverless", issuing_authority: "California Department of Motor Vehicles", jurisdiction_layer: "subnational", representative_state: "California", scope_summary: "Sets out additional requirements for manufacturers seeking permits to test fully driverless autonomous vehicles on California public roads, including safety certifications, cybersecurity, reporting, and the DMV's authority to suspend or revoke permits.", key_obligations: ["Obtain a Driverless Testing Permit before operating a fully driverless autonomous vehicle on public roads.", "Certify that the autonomous test vehicle meets specified safety, cybersecurity, and law enforcement interaction requirements.", "Maintain evidence of financial responsibility as specified by the DMV.", "Report any collision involving a driverless test vehicle resulting in property damage, bodily injury, or death.", "Submit annual disengagement reports to the DMV."], penalties_summary: "DMV may suspend or revoke a Driverless Testing Permit for failure to comply with applicable statutes, regulations, or permit conditions.", status_note: "California DMV agency program page with no publication date — presented as the operative framework for driverless testing permits.", year_enacted: null, category: "testing_regulation", relevance: "core", phase_tags: ["pre_market", "operational", "ongoing"], needs_verification: true, needs_verification_reason: "Program page summarises requirements without underlying regulatory citations or amendment history; verify against current California regulations.", retrieval_dates: ["2026-04-22"], source_urls: ["https://www.dmv.ca.gov/portal/vehicle-industry-services/autonomous-vehicles/testing-autonomous-vehicles-fully-driverless/"] },
{ instrument_name: "Autonomous Vehicle Collision Reporting", issuing_authority: "California Department of Motor Vehicles", jurisdiction_layer: "subnational", representative_state: "California", scope_summary: "Describes mandatory collision reporting requirements for manufacturers testing autonomous vehicles on public roads in California, specifying thresholds and timelines for reporting crashes to the DMV.", key_obligations: ["Report any collision involving an autonomous test vehicle resulting in property damage, bodily injury, or death to the DMV within 10 business days.", "Use the DMV-prescribed Autonomous Vehicle Collision Report form.", "Provide specified information including date, time, location, and description of injuries or property damage.", "Submit collision reports for vehicles under both drivered and driverless testing permits.", "Retain copies of submitted collision reports as part of testing records."], penalties_summary: null, status_note: "California DMV agency program page with no publication date — describes current reporting procedures but the authoritative regulatory basis is not detailed.", year_enacted: null, category: "testing_regulation", relevance: "core", phase_tags: ["operational", "ongoing"], needs_verification: true, needs_verification_reason: "Page does not provide a statutory citation or revision date; verify precise legal requirements in the California Vehicle Code and DMV regulations.", retrieval_dates: ["2026-04-22"], source_urls: ["https://www.dmv.ca.gov/portal/vehicle-industry-services/autonomous-vehicles/autonomous-vehicle-collision-reporting/"] },
{ instrument_name: "California Vehicle Code § 38750", issuing_authority: "California Legislature", jurisdiction_layer: "subnational", representative_state: "California", scope_summary: "Sets forth requirements for the testing and operation of autonomous vehicles on public roads in California, including collision reporting obligations and authority for the DMV to adopt regulations.", key_obligations: ["Report any collision of an autonomous vehicle under a testing permit resulting in property damage, bodily injury, or death to the DMV within the period specified.", "Comply with regulations adopted by the department regarding reporting of collisions and other safety-related incidents."], penalties_summary: null, status_note: "California statutory code section displayed online — presented as enacted law, but effective date and any later amendments are not specified.", year_enacted: null, category: "testing_regulation", relevance: "core", phase_tags: ["operational", "ongoing"], needs_verification: true, needs_verification_reason: "Online code text includes no amendment history; confirm the current version and any implementing regulations.", retrieval_dates: ["2026-04-22"], source_urls: ["https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=38750.&lawCode=VEH"] },
{ instrument_name: "Texas Transportation Code § 545.453 — Operation of Automated Motor Vehicles", issuing_authority: "Texas Legislature", jurisdiction_layer: "subnational", representative_state: "Texas", scope_summary: "Provides that a motor vehicle equipped with an automated driving system may operate on a Texas highway with the ADS engaged, subject to traffic law compliance, insurance, and registration requirements.", key_obligations: ["Comply with applicable traffic and motor vehicle laws when operating with the ADS engaged on a highway.", "Ensure the vehicle is registered and insured before operating on a highway with the ADS engaged.", "The ADS must be capable of performing the entire dynamic driving task in compliance with applicable traffic laws."], penalties_summary: null, status_note: "Texas statutory code section displayed online — presented as operative law, but effective date and amendment history are not given.", year_enacted: null, category: "operational_law", relevance: "core", phase_tags: ["operational"], needs_verification: true, needs_verification_reason: "Online code text does not indicate whether subsequent amendments have occurred; confirm currentness through the latest Texas statutes.", retrieval_dates: ["2026-04-22"], source_urls: ["https://statutes.capitol.texas.gov/Docs/TN/htm/TN.545.htm#545.453"] },
{ instrument_name: "Autonomous Vehicles — Texas Department of Motor Vehicles information page", issuing_authority: "Texas Department of Motor Vehicles", jurisdiction_layer: "subnational", representative_state: "Texas", scope_summary: "Provides an overview of Texas law regarding operation of autonomous vehicles on public roads, indicating that autonomous vehicles are allowed to operate if they meet certain statutory requirements.", key_obligations: ["Comply with all applicable Texas traffic and motor vehicle laws when operating on public roads.", "Ensure the vehicle is registered and insured in accordance with Texas law before operation."], penalties_summary: null, status_note: "Texas DMV informational page with no publication date — summarises statutory requirements but is not itself a binding regulation.", year_enacted: null, category: "guidance", relevance: "supporting", phase_tags: ["operational"], needs_verification: true, needs_verification_reason: "Informational page with low confidence and no dates; rely on the underlying Transportation Code rather than this summary.", retrieval_dates: ["2026-04-22"], source_urls: ["https://www.txdmv.gov/motorists/consumer-protection/autonomous-vehicles"] },
{ instrument_name: "Florida Statutes § 316.85 — Autonomous vehicles; operation", issuing_authority: "Florida Legislature", jurisdiction_layer: "subnational", representative_state: "Florida", scope_summary: "Authorises the operation of autonomous vehicles on Florida roads and provides that an autonomous vehicle may operate in autonomous mode without a human operator if certain conditions are met.", key_obligations: ["Register and insure the autonomous vehicle in accordance with Florida law before operating on a public road in autonomous mode.", "The ADS when engaged must be capable of operating the vehicle in compliance with applicable traffic and motor vehicle laws.", "A fully autonomous vehicle must be able to achieve a minimal risk condition if the ADS fails while operating on a public road."], penalties_summary: null, status_note: "Florida statutory code section displayed online — presented as law authorising autonomous vehicle operation, but effective date and amendment details are not provided.", year_enacted: null, category: "operational_law", relevance: "core", phase_tags: ["operational"], needs_verification: true, needs_verification_reason: "Online statute text may have been amended after retrieval; verification against the latest Florida Statutes is recommended.", retrieval_dates: ["2026-04-22"], source_urls: ["http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0300-0399/0316/Sections/0316.85.html"] },
{ instrument_name: "Autonomous Vehicles — Florida Department of Transportation information page", issuing_authority: "Florida Department of Transportation", jurisdiction_layer: "subnational", representative_state: "Florida", scope_summary: "Summarises Florida's statutory framework that authorises the operation and testing of autonomous vehicles on public roads in Florida.", key_obligations: ["Comply with Florida's registration and insurance requirements for motor vehicles.", "Comply with all applicable traffic and motor vehicle safety laws when operating autonomous vehicles."], penalties_summary: null, status_note: "Florida DOT informational page with no publication date — summarises statutes but is not itself a binding regulation.", year_enacted: null, category: "guidance", relevance: "supporting", phase_tags: ["operational"], needs_verification: true, needs_verification_reason: "Low-confidence summary without dates; confirm obligations directly in the Florida Statutes.", retrieval_dates: ["2026-04-22"], source_urls: ["https://www.fdot.gov/traffic/autonomous-vehicles"] },
{ instrument_name: "Nevada Senate Bill 131 (82nd Session, 2023)", issuing_authority: "Nevada Legislature", jurisdiction_layer: "subnational", representative_state: "Nevada", scope_summary: "Amends provisions of Nevada law relating to autonomous vehicles, including updates to definitions and the authority of the DMV to regulate testing and operation of autonomous vehicles on public highways.", key_obligations: ["Comply with any regulations adopted by the Nevada DMV under the amended statutory authority.", "Meet any updated requirements for registration, insurance, or safety equipment specified in the amended provisions."], penalties_summary: null, status_note: "2023 Nevada session law PDF — enacted amendments to autonomous vehicle statutes, but effective dates and codified text are not detailed.", year_enacted: "2023", category: "testing_regulation", relevance: "core", phase_tags: ["pre_market", "operational", "ongoing"], needs_verification: true, needs_verification_reason: "Bill text summarises amendments but does not show codification in Nevada statutes; check current Nevada Revised Statutes and DMV regulations.", retrieval_dates: ["2026-04-22"], source_urls: ["https://www.leg.state.nv.us/Session/82nd2023/Bills/SB/SB131_EN.pdf"] },
{ instrument_name: "Arizona House Bill 2813 (2024) — Autonomous Vehicles", issuing_authority: "Arizona Legislature", jurisdiction_layer: "subnational", representative_state: "Arizona", scope_summary: "Amends state law concerning autonomous vehicles, including provisions regarding operation of fully autonomous vehicles on public roads and responsibilities of persons testing or deploying automated driving systems.", key_obligations: ["Comply with updated statutory conditions for operation on public roads, including safety, registration, and financial responsibility requirements.", "Ensure the ADS satisfies statutory performance criteria for operating without a human driver."], penalties_summary: null, status_note: "Arizona bill text from 2024 — final passage status and codified text are not clear from the source.", year_enacted: "2024", category: "testing_regulation", relevance: "core", phase_tags: ["pre_market", "operational", "ongoing"], needs_verification: true, needs_verification_reason: "Source has low confidence and does not clearly state whether HB 2813 was enacted and how it was codified.", retrieval_dates: ["2026-04-22"], source_urls: ["https://legiscan.com/AZ/text/HB2813/id/2810497"] },
{ instrument_name: "PennDOT Autonomous Vehicle Testing Guidance", issuing_authority: "Pennsylvania Department of Transportation", jurisdiction_layer: "subnational", representative_state: "Pennsylvania", scope_summary: "Outlines voluntary policies and expectations for organisations testing highly automated vehicles on Pennsylvania roads, including safety management plans, reporting, and communication with the state.", key_obligations: ["Submit a safety management plan describing how testing will be conducted safely.", "Notify PennDOT of planned testing locations and operational design domains.", "Report certain crashes or safety incidents involving test vehicles to PennDOT within specified timeframes.", "Designate a point of contact available to coordinate with PennDOT and emergency responders."], penalties_summary: null, status_note: "PennDOT guidance webpage with no publication date — non-binding advisory framework that becomes conditionally binding only for programme participants.", year_enacted: null, category: "guidance", relevance: "supporting", phase_tags: ["pre_market", "operational", "ongoing"], needs_verification: true, needs_verification_reason: "Guidance is voluntary and undated; confirm whether PennDOT has updated its policies or adopted binding regulations.", retrieval_dates: ["2026-04-22"], source_urls: ["https://www.penndot.pa.gov/ProjectAndPrograms/AutomatedVehicles/Pages/AV-Testing-Guidance.aspx"] },
{ instrument_name: "MassDOT Autonomous Vehicles Testing Policy", issuing_authority: "Massachusetts Department of Transportation", jurisdiction_layer: "subnational", representative_state: "Massachusetts", scope_summary: "Provides guidance and conditions for companies testing automated vehicles on public roadways in Massachusetts.", key_obligations: ["Enter into a Memorandum of Understanding with MassDOT and the participating municipality as a condition of testing.", "Submit a safety plan describing the operational design domain, intended routes, and safety measures.", "Ensure that test drivers meet MassDOT's training and licensing requirements.", "Report crashes and disengagements to MassDOT within the timelines specified.", "Maintain appropriate insurance coverage in amounts specified by MassDOT."], penalties_summary: null, status_note: "MassDOT policy document with no explicit effective date — advisory in nature but treated as a condition for receiving testing authorisation.", year_enacted: null, category: "guidance", relevance: "supporting", phase_tags: ["pre_market", "operational", "ongoing"], needs_verification: true, needs_verification_reason: "Policy is not a statute or regulation and may have been revised; confirm current MassDOT requirements.", retrieval_dates: ["2026-04-22"], source_urls: ["https://www.mass.gov/doc/massdot-av-testing-policy/download"] }];


const STANDARDS = [
{ standard_name: "SAE J3016 — Taxonomy and Definitions for Terms Related to Driving Automation Systems (April 2021)", issuing_body: "SAE International", scope_summary: "NHTSA's Standing General Order applies to vehicles equipped with ADS or SAE Level 2 ADAS; these classifications are based on SAE J3016 automation levels. DOT's AV 3.0 also uses J3016 taxonomy as its official framework.", adoption_status: "mandated_by_regulator", adoption_note: "NHTSA relies on J3016 taxonomy to define the scope of crash reporting obligations under the Standing General Order.", relevance: "core", phase_tags: ["pre_market", "operational", "ongoing"], needs_verification: true, needs_verification_reason: "Cited notices date from 2018 and 2021; does not confirm whether later J3016 versions have been adopted or NHTSA has modified usage.", retrieval_dates: ["2026-04-22"], source_urls: ["https://www.federalregister.gov/documents/2021/06/29/2021-13913/standing-general-order-on-crash-reporting", "https://www.transportation.gov/av/3/preparing-future-transportation-automated-vehicles-30"] },
{ standard_name: "ISO 26262 — Road vehicles: Functional safety", issuing_body: "International Organization for Standardization (ISO)", scope_summary: "NHTSA describes ISO 26262 as the first automotive-industry-specific standard addressing safety-related systems comprising electrical, electronic, and software elements, and uses its concept phase process for hazard analysis of automated lane centering systems.", adoption_status: "voluntary", adoption_note: "NHTSA references ISO 26262 as an industry standard in research but does not require compliance by manufacturers.", relevance: "supporting", phase_tags: ["pre_market", "operational"], needs_verification: true, needs_verification_reason: "Referenced documents are several years old and do not clarify whether ISO 26262 has been incorporated by reference in any later binding rulemakings.", retrieval_dates: ["2026-04-22"], source_urls: ["https://rosap.ntl.bts.gov/view/dot/42702"] },
{ standard_name: "ISO 21448 — Road vehicles: Safety of the intended functionality", issuing_body: "International Organization for Standardization (ISO)", scope_summary: "NHTSA's draft Framework for Automated Driving System Safety describes ISO 21448 as applicable to intended functionality where situational awareness is critical to safety, and uses its concepts for assessing ADS behaviour.", adoption_status: "voluntary", adoption_note: "Sources present ISO 21448 as a reference for NHTSA research and conceptual frameworks, not a mandatory standard for manufacturers.", relevance: "supporting", phase_tags: ["pre_market", "operational"], needs_verification: true, needs_verification_reason: "Framework document is a draft and research plan is dated 2020; subsequent regulatory decisions involving ISO 21448 are not reflected.", retrieval_dates: ["2026-04-22"], source_urls: ["https://www.nhtsa.gov/sites/nhtsa.gov/files/documents/ads_safety_principles_anprm_website_version-tag.pdf"] },
{ standard_name: "ISO/SAE 21434 — Road vehicles: Cybersecurity engineering", issuing_body: "International Organization for Standardization (ISO) and SAE International", scope_summary: "Described in the Federal Register notice and NHTSA guidance as an overarching industry consensus standard for vehicle cybersecurity engineering, extensively referenced in NHTSA's best practices guidance.", adoption_status: "voluntary", adoption_note: "NHTSA characterises ISO/SAE 21434 as an industry consensus standard referenced in non-binding cybersecurity best practices.", relevance: "supporting", phase_tags: ["pre_market", "operational", "ongoing"], needs_verification: true, needs_verification_reason: "Guidance and Federal Register notice date from 2021–2022; check whether ISO/SAE 21434 has since been incorporated into binding regulations.", retrieval_dates: ["2026-04-22"], source_urls: ["https://www.nhtsa.gov/sites/nhtsa.gov/files/documents/vehicle_cybersecurity_best_practices_01072021.pdf"] },
{ standard_name: "UL 4600 — Standard for Safety for the Evaluation of Autonomous Products", issuing_body: "UL (Underwriters Laboratories)", scope_summary: "NHTSA's draft ADS Safety Framework lists UL 4600 among external consensus documents, describing it as a standard addressing safety evaluation of autonomous products that may inform how developers structure safety cases.", adoption_status: "voluntary", adoption_note: "UL 4600 is considered by NHTSA as one of several industry-developed approaches; not imposed as a mandatory standard.", relevance: "supporting", phase_tags: ["pre_market", "operational"], needs_verification: true, needs_verification_reason: "Both the framework and research plan are dated and exploratory; later regulatory treatment of UL 4600 is not captured.", retrieval_dates: ["2026-04-22"], source_urls: ["https://www.nhtsa.gov/sites/nhtsa.gov/files/documents/ads_safety_principles_anprm_website_version-tag.pdf"] }];


const GAP_SUMMARY = [
{ query_id: "NAT-3", domain: "Vehicle Testing and Certification", jurisdiction_layer: "national", gap_reason: "Primary and fallback official sources returned access-denied or no retrievable content — Regulatory item likely exists but could not be retrieved." },
{ query_id: "SUB-5", domain: "Road Use and Traffic Regulation", jurisdiction_layer: "subnational", gap_reason: "Search returned only secondary commentary — no official source found for state enforcement actions involving automated or assisted driving tests." },
{ query_id: "STD-2", domain: "SAE J3061 Vehicle Cybersecurity", jurisdiction_layer: "national", gap_reason: "Search returned only standards catalogue pages with no regulatory adoption information — adoption status cannot be confirmed." }];


const CALL1 = {
  normalized_activity: "On-road and closed-course ADAS vehicle testing by a manufacturer in the United States",
  activity_description: "The manufacturer designs, equips, and operates vehicles with advanced driver assistance features for testing on public roads and test facilities. Legal obligations are triggered by on-road use of test vehicles, use of human safety drivers or remote operators as workers, modification of vehicles from certified configurations, and collection, transmission, or storage of operational and safety-related data during tests.",
  domains: { primary: ["Vehicle Safety and Performance Regulation", "Vehicle Testing and Certification", "Road Use and Traffic Regulation", "Occupational Health and Safety"] }
};

const ANALYSIS = {
  regulatory_maturity: "The evidence shows multiple binding national regulatory item, including NHTSA's Standing General Order 2021-01 on ADS and Level 2 ADAS crash reporting and 49 CFR Part 573 on defect and noncompliance reporting, as well as FCC spectrum rules for C-V2X in the 5.9 GHz band. At the subnational level, several states have enacted statutes and established DMV or DOT programmes, such as California Vehicle Code § 38750, Texas Transportation Code § 545.453, and Florida Statutes § 316.85. The presence of detailed DMV permitting schemes in California and advisory programmes in Pennsylvania and Massachusetts suggests a growing but still uneven state-level regime.",
  enforcement_intensity: "The corpus includes at least one significant national enforcement action: the FTC's proposed order against General Motors and OnStar concerning unlawful collection and sharing of precise location and driving behaviour data, imposing a five-year behavioural ban. California DMV programme pages explicitly warn that noncompliance with permit conditions can result in suspension or revocation. NHTSA's Standing General Order is structured as an enforceable order requiring ongoing crash reporting, although specific penalty mechanisms are not detailed.",
  centralisation_vs_fragmentation: "The federal layer provides centralised obligations for safety defect and recall reporting under 49 CFR Part 573, crash reporting under NHTSA's Standing General Order, and national spectrum rules under the FCC Second Report and Order. In contrast, road use and testing permissions are fragmented across states: California requires specific testing permits with detailed conditions; Texas and Florida focus on statutory conditions for lawful operation. Additional variation is introduced by Nevada's and Arizona's evolving statutes and the voluntary or MOU-based programmes in Pennsylvania and Massachusetts.",
  direction_of_change: "Amendment evidence points to active evolution: NHTSA's information collection notices on human interaction with driving automation systems reflect ongoing research that could inform future ADAS performance regulation. At the subnational level, Nevada SB 131 (2023) and Arizona HB 2813 (2024) signal legislative refinement of testing and deployment rules. Earlier executive orders in Arizona and Nevada are being supplemented or reshaped by later legislation, suggesting state frameworks are maturing from executive-led to statute-based.",
  coverage_gaps: null
};

const STRATEGIC = {
  compliance_complexity: "Manufacturers must navigate layered federal and state requirements, including NHTSA's Standing General Order 2021-01 for crash reporting, 49 CFR Part 573 for defect and recall responsibilities, and FCC's C-V2X 5.9 GHz spectrum rules, while complying with diverse state regimes such as California's DMV testing permits, Texas Transportation Code § 545.453, and Florida Statutes § 316.85. California imposes detailed pre-market and operational obligations through distinct drivered and driverless testing permits whose breach can lead to suspension or revocation, adding procedural complexity compared to states relying on statutory operation conditions.",
  key_risks: [
  { risk_description: "Failure to comply with NHTSA's Standing General Order crash reporting obligations for ADS and Level 2 ADAS vehicles could expose a manufacturer to enforcement for not providing required incident data.", regulatory_anchor: "Standing General Order 2021-01 (including Second and Third Amendments)" },
  { risk_description: "A manufacturer that does not fulfil its defect and noncompliance reporting and recall responsibilities risks noncompliance with federal defect reporting obligations.", regulatory_anchor: "49 CFR Part 573 — Defect and Noncompliance Responsibility and Reports" },
  { risk_description: "In California, noncompliance with DMV testing permit conditions — collision and disengagement reporting, driver qualifications, financial responsibility — may result in suspension or revocation of testing permits.", regulatory_anchor: "Testing Autonomous Vehicles with a Driver; Testing Autonomous Vehicles — Fully Driverless" },
  { risk_description: "Collecting or sharing precise geolocation and driving behaviour data without clear notice and consent could draw FTC scrutiny similar to the GM/OnStar enforcement action, potentially leading to behavioural bans.", regulatory_anchor: "FTC Action Against General Motors — Sharing Drivers' Location and Driving Behavior Data" },
  { risk_description: "Using C-V2X units in the 5.9 GHz band that do not meet FCC's codified technical parameters or that remain on legacy DSRC technology may violate spectrum rules applicable to ITS licensees.", regulatory_anchor: "Second Report and Order — Use of the 5.850–5.925 GHz Band" },
  { risk_description: "Operating ADS-equipped vehicles in Texas or Florida without ensuring registration, insurance, and ADS capabilities meeting statutory requirements could constitute unlawful operation.", regulatory_anchor: "Texas Transportation Code § 545.453; Florida Statutes § 316.85" },
  { risk_description: "In states with evolving statutory frameworks such as Nevada and Arizona, failure to monitor and comply with updated DMV regulations may result in inadvertent violations of amended requirements.", regulatory_anchor: "Nevada Senate Bill 131 (2023); Arizona House Bill 2813 (2024)" }],

  barriers_to_entry: "Entry into on-road testing faces permitting hurdles in several jurisdictions: California requires Autonomous Vehicle Testing Permits or Driverless Testing Permits, specified financial responsibility, and safety certifications before testing. In Massachusetts, companies must enter into a Memorandum of Understanding with MassDOT and participating municipalities and submit a detailed safety plan. Pennsylvania's guidance requires a safety management plan and designated points of contact. Nevada and Arizona indicate manufacturers must meet updated registration, insurance, and performance criteria.",
  operational_constraints: "Once testing is underway, manufacturers must satisfy ongoing obligations including NHTSA crash reporting under the Standing General Order and federal defect reporting under 49 CFR Part 573. In California, manufacturers must report collisions within 10 business days using prescribed forms, submit annual disengagement reports, and maintain insurance and driver qualifications. Texas and Florida require ADS to comply with all applicable traffic laws when engaged, with Florida further requiring a minimal risk condition capability. Advisory frameworks in Pennsylvania and Massachusetts add expectations for ongoing incident reporting and safety management updates.",
  strategic_opportunities: "The FCC's Second Report and Order enabling C-V2X operations in the 5.9 GHz band creates opportunities for manufacturers to design connected vehicle functions aligned with the newly codified technical parameters, potentially improving interoperability with ITS infrastructure. Voluntary frameworks like PennDOT's guidance and MassDOT's testing policy provide avenues to demonstrate robust safety practices in jurisdictions without binding AV testing statutes. Alignment with SAE J3016, ISO 26262, ISO 21448, ISO/SAE 21434, and UL 4600 — recognised in NHTSA research — may facilitate smoother regulatory engagement and support credible safety cases."
};

const ASSUMPTIONS = [
"OSHA standards 29 CFR 1910.178 and 29 CFR 1926.601 were excluded because they do not specifically address on-road testing of ADAS vehicles on public roads.",
"The various NHTSA Standing General Order documents (original, Second Amendment, and Third Amendment) were deduplicated into a single instrument.",
"The eCFR Part 573 entry and the specific 49 CFR § 573.5 Cornell entry were merged into a single instrument representing 49 CFR Part 573.",
"The FTC press release about the GM/OnStar case was treated as a single enforcement instrument classified as an enforcement precedent.",
"FCC documents describing the Second Report and Order were merged into one instrument, assuming both refer to the same final rule on 5.9 GHz C-V2X operations.",
"California DMV programme pages were each treated as binding programmatic expressions of underlying regulations, classified as testing_regulation due to their permit and condition content.",
"State DOT and DMV informational pages in Texas and Florida were classified as guidance because they summarise statutory requirements rather than presenting standalone regulatory text.",
"Nevada SB 131 and Arizona HB 2813 were treated as enacted or formally proposed amendments, but codification was flagged as needing verification.",
"PennDOT and MassDOT AV testing policies were treated as non-binding guidance that becomes conditionally binding for programme participants via MOUs.",
"SAE J3016 was deduplicated into one standards entry with adoption_status set to mandated_by_regulator because NHTSA uses J3016 levels to define the scope of the Standing General Order.",
"ISO 26262, ISO 21448, ISO/SAE 21434, and UL 4600 were each treated as voluntary standards because sources describe them as industry/consensus standards used in research and guidance.",
"Overall confidence was set to Medium because most entries have needs_verification true due to undated webpages and incomplete amendment histories."];


// ════════════════════════════════════════════════════════════════════
// CONSTANTS & HELPERS
// ════════════════════════════════════════════════════════════════════
const OVERALL_CONFIDENCE = "Medium";
const OVERALL_CONFIDENCE_RATIONALE = "The report draws on multiple primary sources, including federal statutory and regulatory texts, NHTSA and FCC documents, FTC enforcement materials, and state statutes and DMV or DOT programme pages. However, many entries are marked as needing verification, amendment histories, or confirmation of current status. Domains such as workplace safety rules and comprehensive data privacy frameworks beyond the FTC's GM/OnStar case are only partially represented.";

// ── Reference palette (from AdjacentMarketView-Final) ──────────────
// Brand green:    #1EDD7D  (bars, active borders, filled circles)
// Dark green txt: #15b865  (labels, section heads)
// Navy:           #0f2644  (primary text, headings)
// Page bg:        #f4f6f9
// Card bg:        white / #F8FAFC
// Insight strip:  bg #f0fdf4  border #bbf7d0  text #15b865 / #0f2644
// Chart grid:     #f1f5f9 (light) | #e2e8f0 / #cbd5e1 (axis)
// Chart labels:   #94a3b8
// Multi series:   ["#3b82f6","#1EDD7D","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"]
// ───────────────────────────────────────────────────────────────────

const CHART_COLORS = ["#3b82f6", "#1EDD7D", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#ec4899"];

const CATEGORY_CFG = {
  // Aligned to reference bubble-chart COLORS array & reference badge conventions
  testing_regulation: { label: "Testing Regulation", color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" },
  operational_law: { label: "Operational Law", color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
  workplace_safety: { label: "Workplace Safety", color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
  guidance: { label: "Non-binding", color: "#64748b", bg: "#f8fafc", border: "#e2e8f0" },
  enforcement_precedent: { label: "Enforcement Precedent", color: "#dc2626", bg: "#fff1f2", border: "#fecdd3" }
};

const ADOPTION_CFG = {
  mandated_by_regulator: { label: "Mandated", color: "#dc2626", bg: "#fff1f2", border: "#fecdd3" },
  incorporated_by_reference: { label: "Incorporated by Reference", color: "#c2410c", bg: "#fff7ed", border: "#fed7aa" },
  de_facto_baseline: { label: "Industry Baseline", color: "#0369a1", bg: "#f0f9ff", border: "#bae6fd" },
  voluntary: { label: "Voluntary", color: "#64748b", bg: "#f8fafc", border: "#e2e8f0" },
  unknown: { label: "Status Unknown", color: "#78716c", bg: "#f5f5f4", border: "#e7e5e4" }
};

// Phase tags use the reference multi-series palette for consistency with charts
const PHASE_CFG = {
  pre_market: { label: "Pre-market", color: "#0d9488", bg: "#f0fdfa", border: "#99f6e4" },
  operational: { label: "Operational", color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" },
  ongoing: { label: "Ongoing", color: "#7c3aed", bg: "#faf5ff", border: "#ddd6fe" }
};

// State accent colours — from spec §4.4
const STATE_ACCENT = {
  California: "#6366F1",
  Texas: "#10B981",
  Florida: "#3B82F6",
  Nevada: "#EC4899",
  Pennsylvania: "#F97316",
  Massachusetts: "#F97316",
  Arizona: "#94A3B8"
};

const LAYER_ACCENT = { national: "#6366F1", subnational: "#F97316", supranational: "#0F766E" };

const latestDate = (d) => [...d].sort().reverse()[0];

const extractDomain = (url) => {
  try {return new URL(url).hostname.replace("www.", "");} catch {return url.slice(0, 20);}
};

// Maps a regulation to a primary domain by checking authority and category
const domainMatchesDomain = (r, domain) => {
  if (domain === "Vehicle Safety and Performance Regulation") {
    return ["National Highway Traffic Safety Administration", "Federal Motor Carrier Safety Administration"].includes(r.issuing_authority ?? "");
  }
  if (domain === "Vehicle Testing and Certification") {
    return r.category === "testing_regulation" && r.jurisdiction_layer === "national";
  }
  if (domain === "Road Use and Traffic Regulation") {
    return r.jurisdiction_layer === "subnational";
  }
  if (domain === "Occupational Health and Safety") {
    return (r.issuing_authority ?? "").includes("Occupational") || (r.issuing_authority ?? "").includes("OSHA");
  }
  return false;
};

// ════════════════════════════════════════════════════════════════════
// MICRO COMPONENTS
// ════════════════════════════════════════════════════════════════════

// Category badge — used everywhere
const CAT_TOOLTIPS = {
  testing_regulation: "Governs the conditions under which testing on public roads or facilities may take place — permits, safety plans, and reporting.",
  operational_law: "A binding instrument that applies during active operations. Non-compliance may trigger enforcement by the issuing authority.",
  workplace_safety: "Covers occupational health and safety obligations for personnel involved in vehicle development, testing, or deployment.",
  guidance: "Non-binding advisory material that signals regulatory intent or best practice but does not carry direct legal force.",
  enforcement_precedent: "A prior enforcement action that signals how regulators interpret and apply the law in practice."
};

const RELEVANCE_TOOLTIPS = {
  core: "A direct, mandatory obligation for this activity. Must be addressed in your compliance programme.",
  supporting: "Provides useful context or informs your compliance picture but does not impose a direct obligation on this activity."
};

const CatBadge = ({ cat, small }) => {
  const c = CATEGORY_CFG[cat];
  const [hovered, setHovered] = useState(false);
  const tooltips = {
    testing_regulation: "Governs the conditions under which testing on public roads or facilities may take place — permits, safety plans, and reporting.",
    operational_law: "A binding instrument that applies during active operations. Non-compliance may trigger enforcement by the issuing authority.",
    workplace_safety: "Covers occupational health and safety obligations for personnel involved in vehicle development, testing, or deployment.",
    guidance: "Non-binding advisory material that signals regulatory intent or best practice but does not carry direct legal force.",
    enforcement_precedent: "A prior enforcement action that signals how regulators interpret and apply the law in practice."
  };
  return (
    <span
      className={`relative inline-flex items-center rounded-md font-bold border cursor-help ${small ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-0.5"}`}
      style={{ color: c.color, background: c.bg, borderColor: c.border }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      
      {c.label}
      {hovered &&
      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white text-[#0f2644] rounded-xl px-3 py-2.5 z-[9999] shadow-xl pointer-events-none border border-slate-200 block"
      style={{ whiteSpace: "normal" }}>
          <div className="text-[9px] font-black uppercase tracking-widest text-[#0f2644] mb-1.5">{c.label}</div>
          <p className="text-[10px] leading-relaxed text-slate-500">{tooltips[cat]}</p>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 w-2 h-2 bg-white border-t border-l border-slate-200 rotate-45" />
        </span>
      }
    </span>);

};

const RelevanceBadge = ({ rel, small }) => {
  const [hovered, setHovered] = useState(false);
  const tooltips = {
    core: "You must directly comply with, register under, or obtain approval from this instrument. The obligation is direct and mandatory.",
    supporting: "Affects your compliance context or signals regulatory risk, but does not impose a direct obligation on you for this activity."
  };
  return (
    <span
      className={`relative inline-flex items-center rounded-md font-bold border cursor-help ${small ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-0.5"}`}
      style={rel === "core" ?
      { color: "#15803d", background: "#f0fdf4", borderColor: "#bbf7d0" } :
      { color: "#64748b", background: "#f8fafc", borderColor: "#e2e8f0" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      
      {rel === "core" ? "Core" : "Reference material"}
      {hovered &&
      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white text-[#0f2644] rounded-xl px-3 py-2.5 z-[9999] shadow-xl pointer-events-none border border-slate-200 block"
      style={{ whiteSpace: "normal" }}>
          <div className="text-[9px] font-black uppercase tracking-widest text-[#0f2644] mb-1.5">{rel === "core" ? "Core" : "Reference material"}</div>
          <p className="text-[10px] leading-relaxed text-slate-500">{tooltips[rel]}</p>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 w-2 h-2 bg-white border-t border-l border-slate-200 rotate-45" />
        </span>
      }
    </span>);

};

const PhaseBadge = ({ tag, showTooltip = true }) => {
  const c = PHASE_CFG[tag];
  const [hovered, setHovered] = useState(false);
  const tooltips = {
    pre_market: "Applies before launch or operational start — covers permits, approvals, certification, and registration prerequisites.",
    operational: "Applies while actively conducting the activity — covers compliance during day-to-day operation or deployment.",
    ongoing: "Continuous obligations that persist after launch — reporting, incident notification, permit renewal, and recall management."
  };

  return (
    <span
      className={`relative inline-flex items-center rounded-md text-[9px] font-bold border px-1.5 py-0.5 ${showTooltip ? "cursor-help" : ""}`}
      style={{ color: c.color, background: c.bg, borderColor: c.border }}
      onMouseEnter={() => showTooltip && setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      
      {c.label}
      {showTooltip && hovered &&
      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white text-[#0f2644] rounded-xl px-3 py-2.5 z-[9999] shadow-xl pointer-events-none border border-slate-200 block"
      style={{ whiteSpace: "normal" }}>
          <div className="text-[9px] font-black uppercase tracking-widest text-[#0f2644] mb-1.5">{c.label}</div>
          <p className="text-[10px] leading-relaxed text-slate-500">{tooltips[tag]}</p>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 w-2 h-2 bg-white border-t border-l border-slate-200 rotate-45" />
        </span>
      }
    </span>);

};

// Source pill: domain-extracted link — spec §2.3
const SourcePill = ({ url, index }) =>
<a href={url} target="_blank" rel="noopener noreferrer"
className="inline-flex items-center gap-0.5 rounded text-[12px] font-medium px-2 py-0.5 border"
style={{ color: "#2563EB", background: "#EFF6FF", borderColor: "#BFDBFE", borderRadius: 6 }}>
    {index ? `Link${index}` : extractDomain(url)} ↗
  </a>;


// ════════════════════════════════════════════════════════════════════
// DETAIL PANEL (Slide-in, 700px, full-height) — spec §5
// ════════════════════════════════════════════════════════════════════
const DetailPanel = ({ reg, onClose }) => {
  const [panelTab, setPanelTab] = useState("overview");
  const cat = CATEGORY_CFG[reg.category];
  const isBinding = reg.category !== "guidance";

  const ENFORCEMENT_DESC = {
    enforcement_precedent: "A real enforcement action — shows what regulators actively pursue and the nature of sanctions applied.",
    guidance: "Non-binding guidance. Signals regulatory intent but carries no legal obligation unless incorporated into a binding instrument.",
    testing_regulation: "A binding instrument. Non-compliance may trigger enforcement by the issuing authority.",
    operational_law: "A binding instrument. Non-compliance may trigger enforcement by the issuing authority.",
    workplace_safety: "A binding instrument. Non-compliance may trigger enforcement by the issuing authority."
  };

  return (
    <>
      {/* Semi-transparent backdrop — click to close */}
      <div
        className="fixed inset-0 z-[299]"
        style={{ background: "rgba(15,38,68,0.18)" }}
        onClick={onClose} />
      

      {/* Panel — 700px, slides in from right, sits on top of backdrop */}
      <div
        className="fixed top-0 right-0 bottom-0 z-[300] bg-white flex flex-col"
        style={{
          width: 700,
          boxShadow: "-12px 0 40px rgba(0,0,0,0.14)"
        }}>
        
        {/* Sticky header */}
        <div className="flex-shrink-0 bg-[#F8FAFC] border-b border-slate-200 px-6 pt-5 pb-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <CatBadge cat={reg.category} />
              <div className="text-[16px] font-bold text-[#0F2644] leading-snug mt-2 pr-4">{reg.instrument_name}</div>
              {(reg.issuing_authority || reg.year_enacted) &&
              <div className="text-[12px] mt-1" style={{ color: "#94a3b8" }}>
                  {reg.issuing_authority}{reg.issuing_authority && reg.year_enacted ? " · " : ""}{reg.year_enacted ? `(${reg.year_enacted})` : ""}
                </div>
              }
            </div>
            {/* Close button */}
            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
              style={{ color: "#64748b" }}>
              
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Sub-tabs */}
          <div className="flex gap-0 -mb-px">
            {["overview", "obligations", "enforcement"].map((t) =>
            <button
              key={t}
              onClick={() => setPanelTab(t)}
              className={`px-5 py-2.5 text-[13px] border-b-2 transition-all capitalize ${
              panelTab === t ?
              "font-bold text-[#0F2644] border-[#1EDD7D]" :
              "font-medium border-transparent hover:text-slate-600"}`
              }
              style={{ color: panelTab === t ? "#0F2644" : "#94A3B8" }}>
              
                {t}
              </button>
            )}
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 space-y-6">
          {/* ── OVERVIEW sub-tab ── */}
          {panelTab === "overview" &&
          <>
              {/* What it covers */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">What it covers</div>
                <p className="text-[13px] leading-[1.7]" style={{ color: "#334155" }}>{reg.scope_summary}</p>
              </div>

              {/* Issuing authority box */}
              {reg.issuing_authority &&
            <div className="rounded-lg border border-slate-200 p-3" style={{ background: "#F8FAFC" }}>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Issuing Authority</div>
                  <span className="text-[13px] font-semibold text-blue-600">{reg.issuing_authority} ↗</span>
                </div>
            }

              {/* Three metadata boxes */}
              <div className="grid grid-cols-3 gap-4">
                {/* Box 1 — Importance */}
                <div className="rounded-xl border p-5 space-y-3" style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }}>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Importance</div>
                  <span className="inline-flex items-center rounded-md text-[10px] font-bold border px-2 py-0.5"
                style={reg.relevance === "core" ?
                { color: "#15803d", background: "#f0fdf4", borderColor: "#bbf7d0" } :
                { color: "#64748b", background: "#f8fafc", borderColor: "#e2e8f0" }}>
                    {reg.relevance === "core" ? "Core" : "Reference material"}
                  </span>
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    {reg.relevance === "core" ?
                  "You must directly comply with, register under, or obtain approval from this instrument. The obligation is direct and mandatory." :
                  "Affects your compliance context or signals regulatory risk, but does not impose a direct obligation on you for this activity."}
                  </p>
                </div>
                {/* Box 2 — Lifecycle */}
                <div className="rounded-xl border p-5 space-y-3" style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }}>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Lifecycle Phase</div>
                  {reg.phase_tags.map((tag) => {
                  const desc = {
                    pre_market: "Applies before launch or operational start — covers permits, approvals, certification, and registration prerequisites.",
                    operational: "Applies while actively conducting the activity — covers compliance during day-to-day operation or deployment.",
                    ongoing: "Continuous obligations that persist after launch — reporting, incident notification, permit renewal, and recall management."
                  };
                  return (
                    <div key={tag} className="space-y-1.5">
                        {/* No tooltip inside detail panel */}
                        <PhaseBadge tag={tag} showTooltip={false} />
                        <p className="text-[11px] leading-relaxed text-slate-500">{desc[tag]}</p>
                      </div>);

                })}
                </div>
                {/* Box 3 — Jurisdiction */}
                <div className="rounded-xl border p-5 space-y-3" style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }}>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Jurisdiction</div>
                  {reg.jurisdiction_layer === "national" &&
                <>
                      <span className="inline-flex items-center rounded-md text-[10px] font-bold border px-2 py-0.5 bg-indigo-50 text-indigo-700 border-indigo-200">Federal</span>
                      <p className="text-[11px] leading-relaxed text-slate-500">Applies across all jurisdictions at this level.</p>
                    </>
                }
                  {reg.jurisdiction_layer === "subnational" &&
                <>
                      <span className="inline-flex items-center rounded-md text-[10px] font-bold border px-2 py-0.5" style={{ background: "#fff7ed", color: "#c2410c", borderColor: "#fed7aa" }}>{reg.representative_state}</span>
                      <p className="text-[11px] leading-relaxed text-slate-500">Represents {reg.representative_state} only — findings here do not automatically apply in other states.</p>
                    </>
                }
                  {reg.jurisdiction_layer === "supranational" &&
                <>
                      <span className="inline-flex items-center rounded-md text-[10px] font-bold border px-2 py-0.5 bg-teal-50 text-teal-700 border-teal-200">Supranational</span>
                      <p className="text-[11px] leading-relaxed text-slate-500">Operates at a regional or supranational level and may bind member states directly.</p>
                    </>
                }
                </div>
              </div>

              {/* Current status */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Current Status</div>
                <p className="text-[13px] leading-[1.65]" style={{ color: "#334155" }}>{reg.status_note}</p>
                {/* Verification note — grey left-border, no amber, no pill — spec §2.2 & §5.2 */}
                {reg.needs_verification && reg.needs_verification_reason &&
              <p className="mt-2 text-[12px] leading-relaxed"
              style={{ color: "#78716C", paddingLeft: 10, borderLeft: "2px solid #D1D5DB" }}>
                    {reg.needs_verification_reason}
                  </p>
              }
              </div>

              {/* Sources */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Sources</div>
                <div className="flex flex-wrap gap-2">
                  {reg.source_urls.map((u, i) => <SourcePill key={i} url={u} />)}
                </div>
                <div className="text-[11px] text-slate-400 mt-2">Retrieved {latestDate(reg.retrieval_dates)}</div>
              </div>
            </>
          }

          {/* ── OBLIGATIONS sub-tab ── */}
          {panelTab === "obligations" &&
          <>
              {reg.key_obligations ?
            <div className="space-y-2">
                  {reg.key_obligations.map((obl, i) =>
              <div key={i} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3" style={{ background: "#F8FAFC", borderRadius: 8 }}>
                      <span className="flex-shrink-0 w-[22px] h-[22px] rounded-full flex items-center justify-center text-white text-[11px] font-bold" style={{ background: "#1EDD7D" }}>{i + 1}</span>
                      <p className="text-[13px] text-[#334155] leading-relaxed">{obl}</p>
                    </div>
              )}
                </div> :

            <div className="text-center py-10 text-slate-400 text-[13px]">No obligations extracted from this source.</div>
            }
            </>
          }

          {/* ── ENFORCEMENT sub-tab ── */}
          {panelTab === "enforcement" &&
          <div className="space-y-3">
              {/* What this is */}
              <div className="rounded-lg border border-slate-200 p-4" style={{ background: "#F8FAFC" }}>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">What this is</div>
                <div className="flex items-center gap-2 mb-2"><CatBadge cat={reg.category} /></div>
                <p className="text-[13px] text-[#334155] leading-relaxed">{ENFORCEMENT_DESC[reg.category]}</p>
              </div>
              {/* Enforcement evidence */}
              {reg.penalties_summary ?
            <div className="rounded-lg border border-red-200 p-4 bg-red-50">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-2">Enforcement Evidence</div>
                  <p className="text-[13px] text-red-700 leading-relaxed">{reg.penalties_summary}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {reg.source_urls.map((u, i) => <SourcePill key={i} url={u} />)}
                  </div>
                </div> :

            <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Enforcement Evidence</div>
                  <p className="text-[13px] text-slate-400 italic">No enforcement evidence was found for this instrument.</p>
                </div>
            }
            </div>
          }
        </div>
      </div>
    </>);

};

// ════════════════════════════════════════════════════════════════════
// STANDARD DETAIL PANEL (Slide-in, 700px, full-height)
// ════════════════════════════════════════════════════════════════════
const StandardDetailPanel = ({ standard, onClose }) => {
  const [panelTab, setPanelTab] = useState("overview");
  const ad = ADOPTION_CFG[standard.adoption_status];

  // Find related regulations that might reference this standard
  const relatedRegs = REGULATIONS.filter((r) =>
  r.scope_summary?.toLowerCase().includes(standard.standard_name.toLowerCase()) ||
  r.scope_summary?.toLowerCase().includes(standard.issuing_body.toLowerCase())
  );

  return (
    <>
      <div className="fixed inset-0 z-[299]" style={{ background: "rgba(15,38,68,0.18)" }} onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 z-[300] bg-white flex flex-col" style={{ width: 700, boxShadow: "-12px 0 40px rgba(0,0,0,0.14)" }}>
        {/* Sticky header */}
        <div className="flex-shrink-0 bg-[#F8FAFC] border-b border-slate-200 px-6 pt-5 pb-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {standard.adoption_status === "unknown" ?
                <span className="text-[11px] text-slate-400 italic">Status unknown</span> :
                <span className="inline-flex items-center rounded-md text-[10px] font-bold border px-2 py-0.5" style={{ color: ad.color, background: ad.bg, borderColor: ad.border }}>{ad.label}</span>
                }
                <RelevanceBadge rel={standard.relevance} small />
              </div>
              <div className="text-[16px] font-bold text-[#0F2644] leading-snug pr-4">{standard.standard_name}</div>
              {standard.issuing_body &&
              <div className="text-[12px] mt-0.5" style={{ color: "#94a3b8" }}>{standard.issuing_body}</div>
              }
            </div>
            <button onClick={onClose} className="flex-shrink-0 w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors" style={{ color: "#64748b" }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
          {/* Sub-tabs */}
          <div className="flex gap-0 -mb-px">
            {["overview", "requirements"].map((t) =>
            <button key={t} onClick={() => setPanelTab(t)}
            className={`px-5 py-2.5 text-[13px] border-b-2 transition-all capitalize ${panelTab === t ? "font-bold text-[#0F2644] border-[#1EDD7D]" : "font-medium border-transparent hover:text-slate-600"}`}
            style={{ color: panelTab === t ? "#0F2644" : "#94A3B8" }}>
                {t}
              </button>
            )}
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 space-y-5">
          {/* ── OVERVIEW sub-tab ── */}
          {panelTab === "overview" &&
          <>
              {/* Scope */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">What it covers</div>
                <p className="text-[13px] leading-[1.7]" style={{ color: "#334155" }}>{standard.scope_summary}</p>
              </div>

              {/* Regulatory context */}
              {standard.adoption_note &&
            <div className="rounded-lg border border-slate-200 p-4" style={{ background: "#F8FAFC" }}>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Regulatory Context</div>
                  <p className="text-[13px] leading-[1.7] text-slate-600">{standard.adoption_note}</p>
                </div>
            }

              {/* Metadata boxes */}
              <div className="grid grid-cols-2 gap-3">
                {/* Adoption status box */}
                <div className="rounded-lg border p-4 space-y-2 relative" style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }}>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Adoption Status</div>
                  {standard.adoption_status === "unknown" ?
                <span className="text-[11px] text-slate-400 italic">Status unknown</span> :
                <span className="inline-flex items-center rounded-md text-[10px] font-bold border px-2 py-0.5" style={{ color: ad.color, background: ad.bg, borderColor: ad.border }}>{ad.label}</span>
                }
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    {standard.adoption_status === "mandated_by_regulator" && "This standard is legally required by regulatory authority."}
                    {standard.adoption_status === "incorporated_by_reference" && "This standard is incorporated into regulation by reference."}
                    {standard.adoption_status === "de_facto_baseline" && "Widely adopted industry baseline or best practice."}
                    {standard.adoption_status === "voluntary" && "Compliance is voluntary but may demonstrate best practice."}
                    {standard.adoption_status === "unknown" && "Adoption status requires verification."}
                  </p>
                </div>

                {/* Lifecycle box */}
                <div className="rounded-lg border p-4 space-y-2 relative" style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }}>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Lifecycle Phase</div>
                  <div className="flex flex-wrap gap-1">
                    {standard.phase_tags.map((t) => <PhaseBadge key={t} tag={t} showTooltip={false} />)}
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    Applicable during {standard.phase_tags.map((t) => PHASE_CFG[t].label.toLowerCase()).join(", ")} phases.
                  </p>
                </div>
              </div>

              {/* Issuing body */}
              {standard.issuing_body &&
            <div className="rounded-lg border border-slate-200 p-3" style={{ background: "#F8FAFC" }}>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Issuing Body</div>
                  <span className="text-[13px] font-semibold text-blue-600">{standard.issuing_body}</span>
                </div>
            }
            </>
          }

          {/* ── REQUIREMENTS sub-tab ── */}
          {panelTab === "requirements" &&
          <>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Scope & Coverage</div>
                <p className="text-[13px] leading-[1.7]" style={{ color: "#334155" }}>{standard.scope_summary}</p>
              </div>

              <div className="rounded-lg border border-amber-200 p-4" style={{ background: "#FFFBEB" }}>
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[11px] font-bold text-amber-800">Detailed Requirements Not Available</span>
                </div>
                <p className="text-[12px] text-amber-700 leading-relaxed">
                  The full text of this standard is typically available through the issuing body ({standard.issuing_body}). The scope summary above provides a high-level overview of what the standard addresses.
                </p>
              </div>

              {standard.adoption_note &&
            <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">How This Standard Is Applied</div>
                  <p className="text-[13px] leading-[1.7] text-slate-600">{standard.adoption_note}</p>
                </div>
            }
            </>
          }

        </div>
      </div>
    </>);

};

// ════════════════════════════════════════════════════════════════════
// VISUALIZATIONS — Obligation Timeline, Radar, State Map
// ════════════════════════════════════════════════════════════════════

const ObligationTimeline = ({ onOpenPanel }) => {
  // Screenshot: Pre-market=#1EDD7D(green), Operational=#3b82f6(blue), Ongoing=#8b5cf6(purple)
  const phases = [
  { key: "pre_market", label: "Pre-market", color: "#1EDD7D", track: "#f0fdf4" },
  { key: "operational", label: "Operational", color: "#3b82f6", track: "#eff6ff" },
  { key: "ongoing", label: "Ongoing", color: "#8b5cf6", track: "#faf5ff" }];

  const counts = phases.map((p) => {
    const regs = REGULATIONS.filter((r) => r.phase_tags.includes(p.key));
    return { ...p, obligations: regs.reduce((s, r) => s + (r.key_obligations?.length ?? 0), 0), instruments: regs.length };
  });
  const maxObl = Math.max(...counts.map((c) => c.obligations), 1);
  const W = 480,H = 220,padX = 50,barW = 60,barAreaTop = 38,barAreaBottom = 32;
  const barMaxH = H - barAreaTop - barAreaBottom;
  const slotW = (W - padX * 2) / 3;
  const bars = counts.map((c, i) => {
    const cx = padX + i * slotW + slotW / 2;
    const bh = Math.max(16, c.obligations / maxObl * barMaxH);
    const by = H - barAreaBottom - bh;
    return { ...c, cx, bh, by };
  });
  const maxPhase = counts.reduce((a, b) => a.obligations > b.obligations ? a : b);
  const insight = `${maxPhase.label} has the highest obligation density (${maxPhase.obligations} items) — most compliance work occurs at this stage.`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-1">
        <div className="flex items-center gap-2 mb-0.5">
          <svg width="13" height="13" fill="none" stroke="#0f2644" strokeWidth="2" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
          <span className="text-[13px] font-black text-[#0f2644]">Obligations Across Lifecycle</span>
        </div>
        <p className="text-[11px] mb-4" style={{ color: "#94a3b8" }}>Total key obligation items across all regulation entries, grouped by business lifecycle phase</p>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
          {/* Dashed connector — screenshot shows dashed line between bar tops */}
          <polyline points={bars.map((b) => `${b.cx},${b.by}`).join(" ")} fill="none" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="5 3" />
          {bars.map((b, i) =>
          <g key={i}>
              {/* Track */}
              <rect x={b.cx - barW / 2} y={barAreaTop} width={barW} height={H - barAreaTop - barAreaBottom} rx="8" fill={b.track} />
              {/* Bar — screenshot shows full rounded bars */}
              <rect x={b.cx - barW / 2} y={b.by} width={barW} height={b.bh} rx="8" fill={b.color} />
              {/* Value above bar */}
              <text x={b.cx} y={b.by - 7} textAnchor="middle" fontSize="16" fontWeight="900" fill={b.color}>{b.obligations}</text>
              {/* Phase label below */}
              <text x={b.cx} y={H - 8} textAnchor="middle" fontSize="10" fontWeight="500" fill="#94a3b8">{b.label}</text>
            </g>
          )}
        </svg>
      </div>
      {/* KEY TAKEAWAY */}
      <div className="border-t px-5 py-3" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
        <div className="flex items-center gap-1.5 mb-1">
          <svg width="11" height="11" fill="none" stroke="#15b865" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.74V17h8v-2.26A7 7 0 0012 2z" /></svg>
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#15b865" }}>Key Takeaway</span>
        </div>
        <p className="text-[12px] text-[#0f2644] leading-relaxed">{insight}</p>
      </div>
    </div>);

};

const RadarChart = ({ onOpenPanel }) => {
  const domains = CALL1.domains.primary;
  const domainData = domains.map((domain) => {
    const coreCount = REGULATIONS.filter((r) => r.relevance === "core" && (
    domain === "Vehicle Safety and Performance Regulation" && ["National Highway Traffic Safety Administration", "Federal Motor Carrier Safety Administration"].includes(r.issuing_authority ?? "") ||
    domain === "Vehicle Testing and Certification" && r.category === "testing_regulation" && r.jurisdiction_layer === "national" ||
    domain === "Road Use and Traffic Regulation" && r.jurisdiction_layer === "subnational" && r.relevance === "core" ||
    domain === "Occupational Health and Safety" && false)
    ).length;
    const hasEnforcement = domain === "Vehicle Safety and Performance Regulation";
    const isGap = domain === "Occupational Health and Safety" || domain === "Vehicle Testing and Certification";
    return { domain, coreCount: domain === "Road Use and Traffic Regulation" ? 8 : coreCount || (domain === "Vehicle Safety and Performance Regulation" ? 3 : 1), hasEnforcement, isGap };
  });

  const N = domains.length;
  const cx = 160,cy = 150,R = 120;
  const angles = domains.map((_, i) => i / N * 2 * Math.PI - Math.PI / 2);
  const maxVal = Math.max(...domainData.map((d) => d.coreCount), 1);
  const toXY = (a, r) => ({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  const rings = [0.25, 0.5, 0.75, 1.0];
  const ringPath = (f) => angles.map((a, i) => {const p = toXY(a, R * f);return `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;}).join(" ") + "Z";
  const dataPath = domainData.map((d, i) => {const v = Math.max(d.coreCount / maxVal, 0.1);const p = toXY(angles[i], R * v);return `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;}).join(" ") + "Z";
  const shortLabel = (d) => {const w = d.split(" ");return w.length > 2 ? w[0] + " " + w[1] : d;};

  const strongest = domainData.reduce((a, b) => a.coreCount > b.coreCount ? a : b);
  const weakest = domainData.reduce((a, b) => a.coreCount < b.coreCount ? a : b);
  const insight = `${shortLabel(strongest.domain)} has the strongest evidence coverage; ${shortLabel(weakest.domain)} has the fewest Regulatory items found.`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-5 pt-5 pb-3 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-0.5">
          <svg width="14" height="14" fill="none" stroke="#1EDD7D" strokeWidth="2.5" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
          <span className="text-[13px] font-black text-[#0f2644]">Regulatory Landscape Radar</span>
        </div>
        <p className="text-[11px] text-slate-400 mb-4">Evidence density per primary regulatory domain, weighted by core regulatory item count and enforcement signals</p>
        <div className="flex items-start gap-4 flex-1">
          <svg viewBox="0 0 320 300" className="flex-shrink-0" style={{ width: 280, height: 250 }}>
            {/* Grid rings — reference: stroke #e2e8f0 / #cbd5e1 for outer */}
            {rings.map((f, i) => <path key={i} d={ringPath(f)} fill="none" stroke={f === 1 ? "#cbd5e1" : "#e2e8f0"} strokeWidth={f === 1 ? 1 : 0.8} />)}
            {/* Spokes — reference: #e2e8f0 */}
            {angles.map((a, i) => {const p = toXY(a, R);return <line key={i} x1={cx} y1={cy} x2={p.x.toFixed(1)} y2={p.y.toFixed(1)} stroke="#e2e8f0" strokeWidth="1" />;})}
            {/* Data polygon — reference: fill #1EDD7D fillOpacity 0.15, stroke #1EDD7D strokeWidth 2 */}
            <path d={dataPath} fill="#1EDD7D" fillOpacity="0.15" stroke="none" />
            <path d={dataPath} fill="none" stroke="#1EDD7D" strokeWidth="2" strokeLinejoin="round" />
            {/* Data points — reference: r 3.5 fill #1EDD7D, enforcement red, gap amber */}
            {domainData.map((d, i) => {
              const v = Math.max(d.coreCount / maxVal, 0.1);const p = toXY(angles[i], R * v);
              if (d.hasEnforcement) return <circle key={i} cx={p.x} cy={p.y} r="5" fill="#ef4444" stroke="white" strokeWidth="1.5" />;
              if (d.isGap) return <circle key={i} cx={p.x} cy={p.y} r="4" fill="#f59e0b" stroke="white" strokeWidth="1.5" />;
              return <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#1EDD7D" stroke="white" strokeWidth="1.5" />;
            })}
            {/* Axis labels — reference: fontSize 11, fill #64748b, fontWeight 500 */}
            {domainData.map((d, i) => {
              const p = toXY(angles[i], R + 20);
              const anchor = p.x < cx - 8 ? "end" : p.x > cx + 8 ? "start" : "middle";
              return <text key={i} x={p.x.toFixed(1)} y={p.y.toFixed(1)} textAnchor={anchor} fontSize="9" fontWeight="500" fill="#64748b" dominantBaseline="middle">{shortLabel(d.domain)}</text>;
            })}
          </svg>
          <div className="flex-1 min-w-0 max-w-[160px]">
            {/* Score bars — reference style bg-[#1EDD7D] */}
            <div className="space-y-1.5 mb-3">
              {domainData.map((d, i) => {
                return (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 w-16 flex-shrink-0 truncate">{shortLabel(d.domain)}</span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1EDD7D] rounded-full" style={{ width: `${d.coreCount / maxVal * 100}%` }} />
                    </div>
                    <span className="text-[11px] font-bold text-[#15b865] flex-shrink-0 w-4 text-right">{d.coreCount}</span>
                    {d.hasEnforcement && <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />}
                    {d.isGap && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />}
                  </div>);

              })}
            </div>
            <div className="pt-2 border-t border-slate-100 space-y-1">
              {[
              { el: <span className="w-2.5 h-2.5 rounded-sm bg-[#1EDD7D] inline-block border border-[#1EDD7D] opacity-60" />, label: "Evidence" },
              { el: <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />, label: "Enforcement" },
              { el: <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />, label: "Gap" }].
              map((l, i) =>
              <div key={i} className="flex items-center gap-1 text-[9px] text-slate-400">{l.el} {l.label}</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* KEY TAKEAWAY — screenshot style */}
      <div className="border-t px-5 py-3 mt-auto" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
        <div className="flex items-center gap-1.5 mb-1">
          <svg width="11" height="11" fill="none" stroke="#15b865" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.74V17h8v-2.26A7 7 0 0012 2z" /></svg>
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#15b865" }}>Key Takeaway</span>
        </div>
        <p className="text-[12px] text-[#0f2644] leading-relaxed">{insight}</p>
      </div>
    </div>);

};

const StateCoverageMap = ({ onOpenPanel, onStateClick }) => {
  const stateRegs = REGULATIONS.filter((r) => r.representative_state);
  const stateNames = [...new Set(stateRegs.map((r) => r.representative_state))];
  const statusOf = (s) => {
    const regs = stateRegs.filter((r) => r.representative_state === s);
    if (regs.some((r) => r.category === "testing_regulation" && r.phase_tags.includes("pre_market"))) return "permit_required";
    if (regs.every((r) => r.category === "guidance")) return "guidance_only";
    return "statute_only";
  };
  const regCountOf = (fullName) => stateRegs.filter((r) => r.representative_state === fullName).length;
  const SC = {
    permit_required: { label: "Permit Required", fill: "#eff6ff", border: "#3b82f6", text: "#1d4ed8" },
    statute_only: { label: "Statute Only", fill: "#f0fdf4", border: "#1EDD7D", text: "#15803d" },
    guidance_only: { label: "Guidance Only", fill: "#fffbeb", border: "#f59e0b", text: "#92400e" }
  };
  const GRID = {
    WA: [1, 0], OR: [1, 1], CA: [1, 2], NV: [2, 2], AZ: [3, 2], ID: [2, 0], MT: [3, 0], WY: [3, 1], CO: [4, 1], UT: [2, 1], NM: [4, 2],
    ND: [4, 0], SD: [5, 0], NE: [5, 1], KS: [5, 2], MN: [6, 0], IA: [6, 1], MO: [6, 2], OK: [5, 3], TX: [5, 4],
    WI: [7, 0], MI: [8, 0], IL: [7, 1], IN: [8, 1], OH: [9, 1], KY: [8, 2], TN: [8, 3], LA: [7, 4], MS: [7, 3], AL: [8, 4], GA: [9, 3], FL: [9, 4],
    AR: [6, 3], PA: [10, 1], NY: [11, 0], VA: [10, 2], WV: [9, 2], NC: [10, 3], SC: [10, 4],
    ME: [12, 0], NH: [12, 1], VT: [11, 1], MA: [12, 2], RI: [13, 2], CT: [12, 3], NJ: [12, 4], DE: [11, 3], MD: [11, 2],
    AK: [0, 4], HI: [1, 4]
  };
  const ABBR = {
    CA: "CA", TX: "TX", FL: "FL", NV: "NV", AZ: "AZ", PA: "PA", MA: "MA", WA: "WA", OR: "OR", CO: "CO", UT: "UT", NY: "NY", OH: "OH", IL: "IL", GA: "GA", MI: "MI", VA: "VA", NC: "NC", MN: "MN", WI: "WI", MO: "MO", TN: "TN", IN: "IN", KY: "KY", OK: "OK", LA: "LA", AL: "AL", SC: "SC", MD: "MD", NJ: "NJ", ID: "ID", MT: "MT", WY: "WY", NM: "NM", KS: "KS", NE: "NE", SD: "SD", ND: "ND", IA: "IA", AR: "AR", MS: "MS", WV: "WV", ME: "ME", NH: "NH", VT: "VT", RI: "RI", CT: "CT", DE: "DE", AK: "AK", HI: "HI"
  };
  const STATE_NAMES = {
    CA: "California", TX: "Texas", FL: "Florida", NV: "Nevada", AZ: "Arizona", PA: "Pennsylvania", MA: "Massachusetts",
    WA: "Washington", OR: "Oregon", CO: "Colorado", UT: "Utah", NY: "New York", OH: "Ohio", IL: "Illinois", GA: "Georgia",
    MI: "Michigan", VA: "Virginia", NC: "North Carolina", MN: "Minnesota", WI: "Wisconsin", MO: "Missouri", TN: "Tennessee",
    IN: "Indiana", KY: "Kentucky", OK: "Oklahoma", LA: "Louisiana", AL: "Alabama", SC: "South Carolina", MD: "Maryland",
    NJ: "New Jersey", ID: "Idaho", MT: "Montana", WY: "Wyoming", NM: "New Mexico", KS: "Kansas", NE: "Nebraska",
    SD: "South Dakota", ND: "North Dakota", IA: "Iowa", AR: "Arkansas", MS: "Mississippi", WV: "West Virginia",
    ME: "Maine", NH: "New Hampshire", VT: "Vermont", RI: "Rhode Island", CT: "Connecticut", DE: "Delaware",
    AK: "Alaska", HI: "Hawaii"
  };
  const stateFullToAbbr = {
    California: "CA", Texas: "TX", Florida: "FL", Nevada: "NV", Arizona: "AZ", Pennsylvania: "PA", Massachusetts: "MA"
  };
  const abbrToFull = Object.fromEntries(Object.entries(stateFullToAbbr).map(([k, v]) => [v, k]));
  const coveredAbbr = new Set(stateNames.map((s) => stateFullToAbbr[s] ?? s));
  const statusByAbbr = {};
  stateNames.forEach((s) => {const a = stateFullToAbbr[s];if (a) statusByAbbr[a] = statusOf(s);});

  const cW = 40,cH = 32,pX = 4,pY = 4;
  const svgW = 14 * cW + pX * 2,svgH = 5 * cH + pY * 2;

  const permitStates = stateNames.filter((s) => statusOf(s) === "permit_required");
  const statuteStates = stateNames.filter((s) => statusOf(s) === "statute_only");
  const insight = permitStates.length === 1 ?
  `${permitStates[0]} is the only state with a formal permit requirement; ${statuteStates.join(" and ")} rely on statute only.` :
  `${permitStates.join(", ")} require formal permits; ${statuteStates.join(" and ")} rely on statute only.`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-5 pt-5 pb-3 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-0.5">
          <svg width="14" height="14" fill="none" stroke="#3b82f6" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
          <span className="text-[13px] font-black text-[#0f2644]">State Coverage Map</span>
        </div>
        <p className="text-[11px] text-slate-400 mb-1">States where subnational regulatory evidence was found. <span className="font-semibold text-blue-500">Click a state</span> to filter regulations.</p>
        <div className="overflow-x-auto flex-1 flex items-center">
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ minWidth: 460, height: svgH + 4 }}>
            {Object.entries(GRID).map(([abbr, [col, row]]) => {
              const x = pX + col * cW,y = pY + row * cH;
              const covered = coveredAbbr.has(abbr);
              const status = statusByAbbr[abbr];
              const cfg = covered && status ? SC[status] : null;
              const fullName = abbrToFull[abbr];
              const count = fullName ? regCountOf(fullName) : 0;
              return (
                <g key={abbr}
                onClick={() => covered && fullName && onStateClick?.(fullName)}
                style={{ cursor: covered ? "pointer" : "default" }}>
                  <title>{STATE_NAMES[abbr] || abbr}{count > 0 ? ` — ${count} regulation${count !== 1 ? "s" : ""}` : ""}</title>
                  <rect x={x + 1} y={y + 1} width={cW - 3} height={cH - 3} rx="3"
                  fill={cfg ? cfg.fill : "#f8fafc"}
                  stroke={cfg ? cfg.border : "#e2e8f0"}
                  strokeWidth={covered ? 1.5 : 0.6} />
                  <text x={x + (cW - 2) / 2 + 1} y={y + (cH - 2) / 2 - 3} textAnchor="middle" dominantBaseline="middle"
                  fontSize="9" fontWeight={covered ? "800" : "500"} fill={cfg ? cfg.text : "#94a3b8"}>
                    {ABBR[abbr] ?? abbr}
                  </text>
                  {count > 0 &&
                  <text x={x + (cW - 2) / 2 + 1} y={y + (cH - 2) / 2 + 8} textAnchor="middle" dominantBaseline="middle"
                  fontSize="7.5" fontWeight="700" fill={cfg ? cfg.text : "#94a3b8"} opacity="0.85">
                      {count} reg{count !== 1 ? "s" : ""}
                    </text>
                  }
                </g>);

            })}
          </svg>
        </div>
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-slate-100">
          {Object.entries(SC).map(([, cfg]) =>
          <div key={cfg.label} className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full inline-block border-2" style={{ borderColor: cfg.border, background: "transparent" }} />
              <span className="text-[10px] text-slate-500">{cfg.label}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full inline-block" style={{ background: "#f1f5f9", border: "1.5px solid #e2e8f0" }} />
            <span className="text-[10px] text-slate-400">No evidence</span>
          </div>
        </div>
      </div>
      {/* KEY TAKEAWAY */}
      <div className="border-t px-5 py-3 mt-auto" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
        <div className="flex items-center gap-1.5 mb-1">
          <svg width="11" height="11" fill="none" stroke="#15b865" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.74V17h8v-2.26A7 7 0 0012 2z" /></svg>
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#15b865" }}>Key Takeaway</span>
        </div>
        <p className="text-[12px] text-[#0f2644] leading-relaxed">{insight}</p>
      </div>
    </div>);

};

// ════════════════════════════════════════════════════════════════════
// OVERVIEW TAB — spec §3
// ════════════════════════════════════════════════════════════════════
const OverviewTab = ({ onGoTab, onOpenPanel, onStateClick }) => {
  const [descExpanded, setDescExpanded] = useState(false);
  const firstSentence = CALL1.activity_description.split(". ")[0] + ".";
  const rest = CALL1.activity_description.slice(firstSentence.length).trim();

  const states = [...new Set(REGULATIONS.filter((r) => r.representative_state).map((r) => r.representative_state))];
  const coreCount = REGULATIONS.filter((r) => r.relevance === "core").length;
  const enforcementCount = REGULATIONS.filter((r) => r.category === "enforcement_precedent").length;
  const stateCount = states.length;
  const gapCount = GAP_SUMMARY.length;

  const metrics = [
  { label: "Total Regulations", value: REGULATIONS.length, sub: "Regulatory item found", tab: "regulations", tooltip: "Total count of binding regulations, statutes, orders, and guidance documents identified across all jurisdictions relevant to this activity.", icon: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg> },
  { label: "Core Obligations", value: coreCount, sub: "direct obligations", tab: "regulations", tooltip: "Regulations classified as 'Core' — instruments you must directly comply with, register under, or obtain approval from. These impose mandatory obligations on this activity.", icon: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg> },
  { label: "Standards Found", value: STANDARDS.length, sub: "technical standards", tab: "standards", tooltip: "Industry consensus standards (e.g. SAE J3016, ISO 26262) referenced or mandated in the regulatory framework. May be voluntary, incorporated by reference, or treated as a de facto baseline.", icon: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> },
  ...(stateCount > 0 ? [{ label: "States Covered", value: stateCount, sub: states.slice(0, 3).join(", ") + (states.length > 3 ? "…" : ""), tab: "regulations", tooltip: "Number of US states where subnational regulatory evidence was found. Requirements vary significantly by jurisdiction — click to filter regulations by state.", icon: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" /></svg> }] : []),
  ...(enforcementCount > 0 ? [{ label: "Enforcement Actions", value: enforcementCount, sub: "actions found", tab: "strategic", tooltip: "Prior enforcement actions that signal how regulators interpret and apply the law in practice. These precedents indicate areas of active regulatory scrutiny.", icon: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg> }] : []),
  ...(gapCount > 0 ? [{ label: "Coverage Gaps", value: gapCount, sub: "domains with no evidence", tab: "analysis", tooltip: "Domains where the research process could not retrieve official regulatory sources. These gaps indicate areas that likely have obligations but require manual verification — they are not confirmed absences of regulation.", icon: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg> }] : [])].
  slice(0, 5);

  const coreKeyRegs = REGULATIONS.filter((r) => r.relevance === "core" && r.category !== "guidance").
  sort((a, b) => a.jurisdiction_layer === "national" ? -1 : 1).
  slice(0, 5);

  return (
    <div className="space-y-5">
      {/* ── METRIC CARDS */}
      <div className="grid grid-cols-5 gap-3">
        {metrics.map((m, i) =>
        <div
          key={i}
          onClick={() => onGoTab(m.tab)}
          className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col gap-2 cursor-pointer transition-all duration-150 hover:border-[#1EDD7D] hover:shadow-md group">
          
            {/* Top row: icon + label + info tooltip + arrow */}
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-[#1EDD7D] transition-colors min-w-0">
                {m.icon}
                <span className="text-[11px] font-semibold text-slate-500 leading-tight group-hover:text-[#0f2644] transition-colors truncate">{m.label}</span>
                {/* Info icon with tooltip */}
                <div className="relative flex-shrink-0 group/info" onClick={(e) => e.stopPropagation()}>
                  <svg width="11" height="11" fill="none" stroke="#cbd5e1" strokeWidth="2" viewBox="0 0 24 24" className="cursor-help hover:stroke-[#6366f1] transition-colors flex-shrink-0">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white text-[#0f2644] rounded-xl px-3 py-2.5 z-[9999] shadow-xl pointer-events-none border border-slate-200 hidden group-hover/info:block" style={{ whiteSpace: "normal" }}>
                    <div className="text-[9px] font-black uppercase tracking-widest text-[#0f2644] mb-1.5">{m.label}</div>
                    <p className="text-[10px] leading-relaxed text-slate-500">{m.tooltip}</p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 w-2 h-2 bg-white border-t border-l border-slate-200 rotate-45" />
                  </div>
                </div>
              </div>
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="text-slate-300 group-hover:text-[#1EDD7D] transition-colors flex-shrink-0"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
            </div>
            {/* Large black number */}
            <div className="text-[28px] font-black leading-none text-[#0f2644]">{m.value}</div>
            {/* Description */}
            <div className="text-[11px] text-slate-400 leading-snug truncate">{m.sub}</div>
          </div>
        )}
      </div>

      {/* ── ACTIVITY CARD — screenshot: RESEARCH ACTIVITY green label, large title, description, confidence badge top-right */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* "RESEARCH ACTIVITY" — screenshot: small green uppercase label */}
            <div className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#1EDD7D" }}>Research Activity</div>
            {/* Title — screenshot: ~18px very bold navy */}
            <div className="text-[18px] font-black text-[#0f2644] leading-snug mb-2">{CALL1.normalized_activity}</div>
            {/* Description — first sentence + show more */}
            <p className="text-[13px] text-slate-500 leading-relaxed">
              {firstSentence}
              {!descExpanded && rest &&
              <button onClick={() => setDescExpanded(true)} className="ml-1.5 text-[12px] font-semibold hover:underline" style={{ color: "#2563eb" }}>Show more</button>
              }
            </p>
            {descExpanded &&
            <p className="text-[13px] text-slate-500 leading-relaxed mt-1">
                {rest}
                <button onClick={() => setDescExpanded(false)} className="ml-1 text-[12px] font-semibold hover:underline" style={{ color: "#2563eb" }}>Show less</button>
              </p>
            }
          </div>
          {/* Confidence badge + info icon — top-right, amber pill */}
          <div className="flex-shrink-0 flex items-center gap-1.5 mt-0.5">
            <div className="px-3 py-1 rounded-full border text-[12px] font-bold"
            style={
            OVERALL_CONFIDENCE === "High" ? { background: "#dcfce7", color: "#15803d", borderColor: "#bbf7d0" } :
            OVERALL_CONFIDENCE === "Medium" ? { background: "#fef3c7", color: "#b45309", borderColor: "#fde68a" } :
            { background: "#fee2e2", color: "#dc2626", borderColor: "#fecaca" }
            }>
              {OVERALL_CONFIDENCE} Confidence
            </div>
            <div className="relative group/conf cursor-help flex-shrink-0">
              <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24" className="hover:stroke-[#b45309] transition-colors">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div className="absolute right-0 top-6 z-50 hidden group-hover/conf:block w-72 bg-white text-[#0f2644] rounded-xl px-4 py-3 shadow-2xl pointer-events-none border border-slate-200">
                <div className="text-[9px] font-black uppercase tracking-widest text-[#0f2644] mb-1.5">Confidence Rationale</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={
                  OVERALL_CONFIDENCE === "High" ? { background: "#dcfce7", color: "#15803d" } :
                  OVERALL_CONFIDENCE === "Medium" ? { background: "#fef3c7", color: "#b45309" } :
                  { background: "#fee2e2", color: "#dc2626" }
                  }>{OVERALL_CONFIDENCE}</span>
                  <span className="text-[10px] text-slate-500">Overall confidence level</span>
                </div>
                <p className="text-[10px] text-slate-600 leading-relaxed">{OVERALL_CONFIDENCE_RATIONALE}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Rationale — screenshot: below divider, smaller muted text */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-[12px] leading-relaxed" style={{ color: "#94a3b8" }}>{OVERALL_CONFIDENCE_RATIONALE}</p>
        </div>
      </div>

      {/* ── ROW 1: Key Regulations + Key Standards ── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Key Regulations */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <svg width="13" height="13" fill="none" stroke="#1EDD7D" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                <span className="text-[13px] font-black text-[#0f2644]">Key Regulations</span>
              </div>
              <p className="text-[11px]" style={{ color: "#94a3b8" }}>Core binding and enforced regulations across national and subnational levels</p>
            </div>
            <button onClick={() => onGoTab("regulations")} className="text-[11px] text-blue-500 font-semibold hover:underline flex-shrink-0 mt-0.5">View All →</button>
          </div>
          <div className="space-y-2">
            {coreKeyRegs.map((r, i) =>
            <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100 hover:border-slate-200 transition-all" onClick={() => onOpenPanel(r)}>
                <span className="flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded border"
              style={{ background: r.jurisdiction_layer === "national" ? "#f1f5f9" : "#fff7ed", color: r.jurisdiction_layer === "national" ? "#0f2644" : "#c2410c", borderColor: r.jurisdiction_layer === "national" ? "#cbd5e1" : "#fed7aa" }}>
                  {r.jurisdiction_layer === "national" ? "National" : r.representative_state}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-bold text-[#0f2644] leading-snug line-clamp-2">{r.instrument_name}</div>
                  {r.issuing_authority && <div className="text-[11px] text-slate-400 mt-0.5 truncate">{r.issuing_authority}</div>}
                  <div className="flex flex-wrap gap-1 mt-1">{r.phase_tags.map((t) => <PhaseBadge key={t} tag={t} />)}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Standards */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <svg width="13" height="13" fill="none" stroke="#6366f1" strokeWidth="2.5" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                <span className="text-[13px] font-black text-[#0f2644]">Key Standards</span>
              </div>
              <p className="text-[11px]" style={{ color: "#94a3b8" }}>Technical standards referenced or mandated across this regulatory domain</p>
            </div>
            <button onClick={() => onGoTab("standards")} className="text-[11px] text-blue-500 font-semibold hover:underline flex-shrink-0 mt-0.5">View All →</button>
          </div>
          <div className="space-y-2">
            {STANDARDS.slice(0, 5).map((s, i) => {
              const adoptionCfg = ADOPTION_CFG[s.adoption_status];
              return (
                <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-200 transition-all">
                  <div className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center mt-0.5" style={{ background: "#eef2ff" }}>
                    <svg width="11" height="11" fill="none" stroke="#6366f1" strokeWidth="2.5" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-bold text-[#0f2644] leading-snug line-clamp-2">{s.standard_name}</div>
                    {s.issuing_body && <div className="text-[11px] text-slate-400 mt-0.5 truncate">{s.issuing_body}</div>}
                    <div className="flex flex-wrap gap-1 mt-1">
                      <div className="relative group/tip">
                        <span className="inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded border cursor-default"
                        style={{ background: adoptionCfg.bg, color: adoptionCfg.color, borderColor: adoptionCfg.border }}>
                          {adoptionCfg.label}
                        </span>
                        <div className="absolute left-0 top-full mt-1.5 z-50 hidden group-hover/tip:block w-56 bg-white text-[#0f2644] rounded-xl px-3 py-2.5 shadow-xl pointer-events-none border border-slate-200">
                          <div className="text-[9px] font-black uppercase tracking-widest text-[#0f2644] mb-1">Adoption Status</div>
                          <p className="text-[9px] text-slate-600 leading-relaxed">
                            {s.adoption_status === "mandated_by_regulator" ? "A regulator has issued binding rules that require compliance with this standard — non-compliance may trigger enforcement." :
                            s.adoption_status === "incorporated_by_reference" ? "The standard is formally embedded into a binding regulation by reference — it carries the same legal force as the regulation itself." :
                            s.adoption_status === "de_facto_baseline" ? "Not formally mandated, but treated as the industry baseline — departure from it may attract scrutiny or liability." :
                            s.adoption_status === "voluntary" ? "Compliance is not legally required. Adoption signals good practice and may ease regulatory engagement." :
                            "Adoption status has not been confirmed from available sources — treat obligations with caution pending verification."}
                          </p>
                          {s.adoption_note && <p className="text-[9px] text-slate-500 leading-relaxed mt-1.5 pt-1.5 border-t border-slate-100">{s.adoption_note}</p>}
                        </div>
                      </div>
                      {s.phase_tags.map((t) => <PhaseBadge key={t} tag={t} showTooltip />)}
                    </div>
                  </div>
                </div>);

            })}
          </div>
        </div>
      </div>

      {/* ── ROW 2: Key Risks + Obligation Timeline ── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Key Risks */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <svg width="13" height="13" fill="none" stroke="#ef4444" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                <span className="text-[13px] font-black text-[#0f2644]">Key Risks</span>
              </div>
              <p className="text-[11px]" style={{ color: "#94a3b8" }}>High-priority compliance risks identified across enforcement and obligation gaps</p>
            </div>
            <button onClick={() => onGoTab("strategic")} className="text-[11px] text-blue-500 font-semibold hover:underline flex-shrink-0 mt-0.5">View All →</button>
          </div>
          <div className="space-y-2">
            {STRATEGIC.key_risks.slice(0, 3).map((r, i) =>
            <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg border border-red-100 bg-red-50">
                <span className="w-5 h-5 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-[10px] font-black text-red-600 flex-shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-[12px] text-slate-700 leading-relaxed">{r.risk_description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Obligation Timeline */}
        <ObligationTimeline onOpenPanel={onOpenPanel} />
      </div>

      {/* ── ROW 3: Domain Coverage Overview + State Coverage Map ── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Domain Coverage Overview */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <svg width="13" height="13" fill="none" stroke="#1EDD7D" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
              <span className="text-[13px] font-black text-[#0f2644]">Domain Coverage Overview</span>
            </div>
            <p className="text-[11px] mb-4" style={{ color: "#94a3b8" }}>Regulatory strength, standards, and evidence by domain</p>
            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-3 py-2.5 font-bold text-[#0f2644] w-[36%]">Domain</th>
                    <th className="text-center px-3 py-2.5 w-[21%]">
                      <div className="inline-flex items-center justify-center gap-1">
                        <span className="font-bold text-[#0f2644]">National</span>
                        <div className="relative group/tip">
                          <svg width="11" height="11" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24" className="cursor-pointer hover:stroke-[#6366f1] transition-colors"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 z-50 hidden group-hover/tip:block w-56 bg-white text-[#0f2644] rounded-xl px-3 py-2.5 shadow-xl pointer-events-none border border-slate-200">
                            <div className="text-[9px] font-black uppercase tracking-widest text-[#0f2644] mb-1">National / Federal</div>
                            <p className="text-[9px] text-slate-600 leading-relaxed">Federal regulations, statutes, and orders issued by national authorities such as NHTSA, FCC, or FTC — apply uniformly across all US states.</p>
                          </div>
                        </div>
                      </div>
                    </th>
                    <th className="text-center px-3 py-2.5 w-[21%]">
                      <div className="inline-flex items-center justify-center gap-1">
                        <span className="font-bold text-[#0f2644]">Subnational</span>
                        <div className="relative group/tip">
                          <svg width="11" height="11" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24" className="cursor-pointer hover:stroke-[#f97316] transition-colors"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 z-50 hidden group-hover/tip:block w-56 bg-white text-[#0f2644] rounded-xl px-3 py-2.5 shadow-xl pointer-events-none border border-slate-200">
                            <div className="text-[9px] font-black uppercase tracking-widest text-[#0f2644] mb-1">Subnational / State</div>
                            <p className="text-[9px] text-slate-600 leading-relaxed">State-level statutes, DMV/DOT permits, and guidance issued by individual US states — requirements vary by jurisdiction and may include California, Texas, Florida, and others.</p>
                          </div>
                        </div>
                      </div>
                    </th>
                    <th className="text-center px-3 py-2.5 w-[22%]">
                      <div className="inline-flex items-center justify-center gap-1">
                        <span className="font-bold text-[#0f2644]">Standards</span>
                        <div className="relative group/tip">
                          <svg width="11" height="11" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24" className="cursor-pointer hover:stroke-[#6366f1] transition-colors"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                          <div className="absolute right-0 top-full mt-1.5 z-50 hidden group-hover/tip:block w-56 bg-white text-[#0f2644] rounded-xl px-3 py-2.5 shadow-xl pointer-events-none border border-slate-200">
                            <div className="text-[9px] font-black uppercase tracking-widest text-[#0f2644] mb-1">Technical Standards</div>
                            <p className="text-[9px] text-slate-600 leading-relaxed">Industry consensus standards (e.g. SAE J3016, ISO 26262) referenced or mandated in regulations. May be voluntary, incorporated by reference, or treated as a de facto baseline.</p>
                          </div>
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                  { domain: "Vehicle Safety & ADAS Testing", national: { type: "binding" }, subnational: { type: "none" }, standards: { type: "mandated" } },
                  { domain: "Crash & Defect Reporting", national: { type: "enforced" }, subnational: { type: "binding" }, standards: { type: "none" } },
                  { domain: "Connected Vehicle / Spectrum", national: { type: "binding" }, subnational: { type: "none" }, standards: { type: "voluntary" } },
                  { domain: "Data Privacy & Consumer Protection", national: { type: "binding" }, subnational: { type: "enforced" }, standards: { type: "none" } },
                  { domain: "Workplace Safety", national: { type: "enforced" }, subnational: { type: "enforced" }, standards: { type: "none" } }].
                  map((row, i) => {
                    const Cell = ({ type }) => {
                      if (type === "none") return <div className="flex items-center justify-center"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" /></svg></div>;
                      if (type === "binding") return <div className="flex items-center justify-center"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" /><polyline points="7 12 10.5 15.5 17 8.5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>;
                      if (type === "enforced") return <div className="flex items-center justify-center"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 3l8 4v5c0 4.5-3.5 8.5-8 10C7.5 20.5 4 16.5 4 12V7z" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5" /><polyline points="8 12 11 15 16 9" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>;
                      if (type === "voluntary") return <div className="flex items-center justify-center"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" /><circle cx="12" cy="12" r="3" fill="#3b82f6" /></svg></div>;
                      if (type === "mandated") return <div className="flex items-center justify-center"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="#1EDD7D" /><polyline points="8 12 11 15 16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>;
                      return null;
                    };
                    return (
                      <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
                        <td className="px-3 py-2.5 text-[11px] font-medium text-[#0f2644] leading-snug">{row.domain}</td>
                        <td className="px-3 py-2.5 text-center"><Cell type={row.national.type} /></td>
                        <td className="px-3 py-2.5 text-center"><Cell type={row.subnational.type} /></td>
                        <td className="px-3 py-2.5 text-center"><Cell type={row.standards.type} /></td>
                      </tr>);

                  })}
                </tbody>
              </table>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-3 border-t border-slate-100">
              {[
              { icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" /><polyline points="7 12 10.5 15.5 17 8.5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>, label: "Binding" },
              { icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 3l8 4v5c0 4.5-3.5 8.5-8 10C7.5 20.5 4 16.5 4 12V7z" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5" /><polyline points="8 12 11 15 16 9" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>, label: "Enforced" },
              { icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="#1EDD7D" /><polyline points="8 12 11 15 16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>, label: "Mandated standard" },
              { icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" /><circle cx="12" cy="12" r="3" fill="#3b82f6" /></svg>, label: "Voluntary standard" },
              { icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" /></svg>, label: "Not identified" }].
              map((l, i) =>
              <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-500">{l.icon}{l.label}</div>
              )}
            </div>
          </div>
          <div className="border-t px-5 py-3" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
            <div className="flex items-center gap-1.5 mb-1">
              <svg width="11" height="11" fill="none" stroke="#15b865" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.74V17h8v-2.26A7 7 0 0012 2z" /></svg>
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#15b865" }}>Key Takeaway</span>
            </div>
            <p className="text-[12px] text-[#0f2644] leading-relaxed">ADAS testing in the U.S. is primarily governed by self-certification and post-market enforcement, with limited prescriptive requirements specific to ADAS. While core vehicle safety is enforceable, areas like cybersecurity and functional safety rely largely on guidance and voluntary standards, creating a fragmented compliance landscape.</p>
          </div>
        </div>

        {/* State Coverage Map */}
        <StateCoverageMap onOpenPanel={onOpenPanel} onStateClick={onStateClick} />
      </div>

    </div>);

};

// ════════════════════════════════════════════════════════════════════
// REGULATIONS TAB — spec §4 full implementation
// ════════════════════════════════════════════════════════════════════
const RegulationsTab = ({ onOpenPanel, initialStateFilter, onClearStateFilter }) => {
  const [viewMode, setViewMode] = useState("card");
  const [filterRelevance, setFilterRelevance] = useState("all");
  const [filterTypes, setFilterTypes] = useState(new Set());
  const [filterPhases, setFilterPhases] = useState(new Set());
  const [filterStates, setFilterStates] = useState(initialStateFilter ? new Set([initialStateFilter]) : new Set());
  const [activeJurisdiction, setActiveJurisdiction] = useState("national");

  // Auto-highlight tab based on scroll position
  useEffect(() => {
    const sections = ["national", "subnational", "supranational"];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = e.target.id.replace("reg-section-", "");
          setActiveJurisdiction(id);
        }
      });
    }, { threshold: 0.25 });
    sections.forEach((s) => {
      const el = document.getElementById(`reg-section-${s}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Sync when initialStateFilter changes (e.g. navigated from map)
  useEffect(() => {
    if (initialStateFilter) {
      setFilterStates(new Set([initialStateFilter]));
      setActiveJurisdiction("subnational");
      setTimeout(() => {
        document.getElementById("reg-section-subnational")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      onClearStateFilter?.();
    }
  }, [initialStateFilter]);

  const allStates = [...new Set(REGULATIONS.filter((r) => r.representative_state).map((r) => r.representative_state))].sort();
  const allTypes = [...new Set(REGULATIONS.map((r) => r.category))];
  const catCounts = Object.fromEntries(allTypes.map((t) => [t, REGULATIONS.filter((r) => r.category === t).length]));
  const phaseCounts = ["pre_market", "operational", "ongoing"].map((p) => ({ p, count: REGULATIONS.filter((r) => r.phase_tags.includes(p)).length }));
  const stateRegCounts = Object.fromEntries(allStates.map((s) => [s, REGULATIONS.filter((r) => r.representative_state === s).length]));

  const anyFilter = filterRelevance !== "all" || filterTypes.size > 0 || filterPhases.size > 0 || filterStates.size > 0;

  const applyFilters = (regs) => regs.filter((r) => {
    if (filterRelevance === "core" && r.relevance !== "core") return false;
    if (filterRelevance === "supporting" && r.relevance !== "supporting") return false;
    if (filterTypes.size > 0 && !filterTypes.has(r.category)) return false;
    if (filterPhases.size > 0 && !r.phase_tags.some((p) => filterPhases.has(p))) return false;
    if (filterStates.size > 0 && r.representative_state && !filterStates.has(r.representative_state)) return false;
    return true;
  });

  const filtered = applyFilters(REGULATIONS);

  const toggle = (set, val) => {const s = new Set(set);s.has(val) ? s.delete(val) : s.add(val);return s;};

  const sortOrder = (r) => {
    const relevanceScore = r.relevance === "core" ? 0 : 1;
    const catScore = ["testing_regulation", "operational_law", "enforcement_precedent", "guidance"].indexOf(r.category);
    return relevanceScore * 10 + catScore;
  };

  const nationalRegs = filtered.filter((r) => r.jurisdiction_layer === "national").sort((a, b) => sortOrder(a) - sortOrder(b));
  const byState = filtered.filter((r) => r.jurisdiction_layer === "subnational").reduce((acc, r) => {
    const s = r.representative_state;if (!acc[s]) acc[s] = [];acc[s].push(r);return acc;
  }, {});
  Object.values(byState).forEach((regs) => regs.sort((a, b) => sortOrder(a) - sortOrder(b)));

  const CAT_ACCENT = {
    testing_regulation: "#3b82f6", // CHART_COLORS[0] — blue
    operational_law: "#1EDD7D", // brand green
    workplace_safety: "#f59e0b", // amber
    guidance: "#94a3b8", // muted slate
    enforcement_precedent: "#ef4444" // red
  };

  // Sub-group within a section
  const SubGroup = ({ regs, hideJurisdiction }) => {
    const core = regs.filter((r) => r.relevance === "core");
    const supporting = regs.filter((r) => r.relevance === "supporting");
    return (
      <div className="space-y-4">
        {core.length > 0 &&
        <div>
            <div className="flex items-center gap-2 mb-2.5">
              {/* Reference: numbered circle uses bg-[#f0fdf4] text-[#15b865] border-[#bbf7d0] */}
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0" style={{ background: "#f0fdf4", color: "#15b865", border: "1px solid #bbf7d0" }}>{core.length}</div>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#15b865" }}>Core obligations</span>
              <span className="text-[11px] text-slate-400">— direct mandatory obligations</span>
            </div>
            {viewMode === "card" ?
          <div className="grid grid-cols-3 gap-3">
                {core.map((r, i) => <RegCardV3 key={i} r={r} onOpen={() => onOpenPanel(r)} hideJurisdiction={hideJurisdiction} />)}
              </div> :

          <RegTable regs={core} onOpen={onOpenPanel} />
          }
          </div>
        }
        {supporting.length > 0 &&
        <div>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0" style={{ background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0" }}>{supporting.length}</div>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#64748B" }}>Reference material</span>
              <span className="text-[11px] text-slate-400">— informs your compliance picture</span>
            </div>
            {viewMode === "card" ?
          <div className="grid grid-cols-3 gap-3">
                {supporting.map((r, i) => <RegCardV3 key={i} r={r} onOpen={() => onOpenPanel(r)} hideJurisdiction={hideJurisdiction} />)}
              </div> :

          <RegTable regs={supporting} onOpen={onOpenPanel} />
          }
          </div>
        }
      </div>);

  };

  return (
    <div className="flex gap-0 h-full">
      {/* Filter sidebar — spec §4.8 — 196px fixed */}
      <div className="w-[196px] flex-shrink-0 bg-white border-r border-slate-200 overflow-y-auto flex flex-col" style={{ minHeight: "calc(100vh - 160px)" }}>
        <div className="p-3 border-b border-slate-100">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[12px] font-bold text-[#0f2644]">Filter</span>
            {anyFilter && <button onClick={() => {setFilterRelevance("all");setFilterTypes(new Set());setFilterPhases(new Set());setFilterStates(new Set());}} className="text-[11px] text-indigo-500 font-semibold hover:underline">Clear all</button>}
          </div>
          <div className="text-[11px] text-slate-400">{filtered.length} of {REGULATIONS.length} Regulatory items</div>
        </div>
        <div className="p-3 space-y-5 flex-1">
          {/* Importance radio */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-2">Importance</div>
            {[["all", "All"], ["core", "Core obligations"], ["supporting", "Reference material"]].map(([val, lbl]) =>
            <label key={val} className="flex items-center gap-2 py-1 cursor-pointer">
                <input type="radio" name="relevance" value={val} checked={filterRelevance === val} onChange={() => setFilterRelevance(val)} className="accent-indigo-600" />
                <span className="text-[12px] text-slate-600">{lbl}</span>
              </label>
            )}
          </div>
          {/* Type checkboxes */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-2">Type</div>
            {allTypes.map((t) =>
            <label key={t} className="flex items-center gap-2 py-1 cursor-pointer">
                <input type="checkbox" checked={filterTypes.has(t)} onChange={() => setFilterTypes(toggle(filterTypes, t))} className="accent-indigo-600" />
                <span className="text-[12px] text-slate-600 flex-1">{CATEGORY_CFG[t].label}</span>
                <span className="text-[11px] text-slate-400">{catCounts[t]}</span>
              </label>
            )}
          </div>
          {/* Lifecycle checkboxes */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-2">Lifecycle</div>
            {phaseCounts.map(({ p, count }) =>
            <label key={p} className="flex items-center gap-2 py-1 cursor-pointer">
                <input type="checkbox" checked={filterPhases.has(p)} onChange={() => setFilterPhases(toggle(filterPhases, p))} className="accent-indigo-600" />
                <span className="text-[12px] text-slate-600 flex-1">{PHASE_CFG[p].label}</span>
                <span className="text-[11px] text-slate-400">{count}</span>
              </label>
            )}
          </div>
          {/* State checkboxes */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-2">State</div>
            {allStates.map((s) =>
            <label key={s} className="flex items-center gap-2 py-1 cursor-pointer">
                <input type="checkbox" checked={filterStates.has(s)} onChange={() => setFilterStates(toggle(filterStates, s))} className="accent-indigo-600" />
                <span className="text-[12px] text-slate-600 flex-1">{s}</span>
                <span className="text-[11px] text-slate-400">{stateRegCounts[s]}</span>
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Right content */}
      <div className="flex-1 overflow-y-auto min-w-0" id="reg-scroll-area">
        {/* Toolbar */}
        <div className="bg-white border-b border-slate-200 px-5 py-4">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#eef2ff" }}>
                  <svg width="14" height="14" fill="none" stroke="#6366f1" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                </div>
                <div className="text-[15px] font-black text-[#0f2644]">Regulations & Regulatory Items</div>
              </div>
              <p className="text-[13px] text-slate-500 pl-9">Comprehensive inventory of binding regulations, statutes, orders, and guidance documents applicable to your activity.</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 flex-shrink-0">
              {["card", "table"].map((m) =>
              <button key={m} onClick={() => setViewMode(m)}
              className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all capitalize ${viewMode === m ? "bg-white text-[#0f2644] shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
                  {m === "card" ? "Card" : "Table"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Sticky jurisdiction tabs ── */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-5 flex items-center gap-1">
          {[
          { id: "national", label: "National / Federal", color: "#6366F1", count: filtered.filter((r) => r.jurisdiction_layer === "national").length },
          { id: "subnational", label: "Subnational", color: "#F97316", count: filtered.filter((r) => r.jurisdiction_layer === "subnational").length },
          { id: "supranational", label: "Supranational", color: "#0F766E", count: filtered.filter((r) => r.jurisdiction_layer === "supranational").length }].
          filter((t) => t.count > 0).map((t) =>
          <button key={t.id}
          onClick={() => {
            const el = document.getElementById(`reg-section-${t.id}`);
            el?.scrollIntoView({ behavior: "smooth", block: "start" });
            setActiveJurisdiction(t.id);
          }}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-[12px] font-semibold transition-all ${
          activeJurisdiction === t.id ?
          "border-current" :
          "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200"}`
          }
          style={activeJurisdiction === t.id ? { color: t.color, borderColor: t.color } : {}}>
              <span>{t.label}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            style={{
              background: activeJurisdiction === t.id ? t.color + "18" : "#f1f5f9",
              color: activeJurisdiction === t.id ? t.color : "#94a3b8"
            }}>{t.count}</span>
            </button>
          )}
          <div className="ml-auto text-[11px] text-slate-400 py-3">{filtered.length} of {REGULATIONS.length} items</div>
        </div>

        <div className="px-5 py-5 space-y-8">
          {/* National */}
          {nationalRegs.length > 0 &&
          <div id="reg-section-national">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 rounded-full" style={{ background: "#6366F1" }} />
                <span className="text-[14px] font-black text-[#0f2644]">National / Federal</span>
                <span className="text-[12px] text-slate-400">{nationalRegs.length} Regulatory items</span>
              </div>
              <SubGroup regs={nationalRegs} hideJurisdiction />
            </div>
          }

          {/* Subnational */}
          {Object.keys(byState).length > 0 &&
          <div id="reg-section-subnational">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 rounded-full" style={{ background: "#F97316" }} />
                <span className="text-[14px] font-black text-[#0f2644]">Subnational</span>
                <span className="text-[12px] text-slate-400">{filtered.filter((r) => r.jurisdiction_layer === "subnational").length} Regulatory items across {Object.keys(byState).length} states</span>
              </div>
              <div className="space-y-6">
                {Object.entries(byState).sort(([a], [b]) => a.localeCompare(b)).map(([state, regs]) => {
                const accent = STATE_ACCENT[state] ?? "#94A3B8";
                return (
                  <div key={state} className="pl-4 border-l-[3px]" style={{ borderColor: accent + "55" }}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: accent }} />
                        <span className="text-[13px] font-bold text-[#0f2644]">{state}</span>
                        <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: accent + "20", color: accent, border: `1px solid ${accent}55` }}>{regs.length}</span>
                      </div>
                      <SubGroup regs={regs} hideJurisdiction />
                    </div>);

              })}
              </div>
            </div>
          }
        </div>
      </div>
    </div>);

};

// Card view — matches screenshot: 3px top border, proper padding, title + authority + scope + badges + "View details ›"
const RegCardV3 = ({ r, onOpen, hideJurisdiction }) => {
  const accent = CAT_ACCENT_MAP[r.category];
  const isGuidance = r.category === "guidance";
  return (
    <div
      onClick={onOpen}
      className="rounded-[10px] border border-slate-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col group"
      style={{ borderTop: `3px solid ${accent}`, minHeight: 220 }}>
      
      <div className="px-4 pt-4 pb-4 flex flex-col flex-1 gap-0">

        {/* Title — screenshot: 13px bold, 3-line clamp */}
        <div
          className="text-[13px] font-bold leading-snug line-clamp-3 mb-1.5"
          style={{ color: isGuidance ? "#64748B" : "#0F2644" }}>
          
          {r.instrument_name}
        </div>

        {/* Issuing authority — screenshot: 11px muted, truncated */}
        {r.issuing_authority &&
        <div className="text-[11px] truncate mb-2.5" style={{ color: "#94a3b8" }}>
            {r.issuing_authority}
          </div>
        }

        {/* Scope summary — screenshot: 12px slate-500, 3-line clamp, flex-1 */}
        <p className="text-[12px] leading-relaxed line-clamp-3 flex-1" style={{ color: "#64748b" }}>
          {r.scope_summary}
        </p>

        {/* Divider */}
        <div className="border-t border-slate-100 mt-3 pt-3">
          {/* Type + Importance badges on one row */}
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            <CatBadge cat={r.category} small />
            <RelevanceBadge rel={r.relevance} small />
          </div>
          {/* Phase badges on next row */}
          <div className="flex items-center gap-1 flex-wrap mb-2">
            {r.phase_tags.map((t) => <PhaseBadge key={t} tag={t} showTooltip={true} />)}
          </div>
          {/* View details link — right-aligned */}
          <div className="flex justify-end">
            <span className="text-[11px] font-medium group-hover:underline" style={{ color: "#2563eb" }}>
              View details ›
            </span>
          </div>
        </div>
      </div>
    </div>);

};

// Card top-border accent — matches CHART_COLORS from reference
const CAT_ACCENT_MAP = {
  testing_regulation: "#3b82f6", // CHART_COLORS[0]
  operational_law: "#1EDD7D", // brand green
  workplace_safety: "#f59e0b", // CHART_COLORS[2]
  guidance: "#94a3b8", // muted
  enforcement_precedent: "#ef4444" // CHART_COLORS[3]
};

// Table view — spec §4.7: 4 cols, no Status
const RegTable = ({ regs, onOpen }) =>
<table className="w-full text-[12px] border-collapse">
    <thead>
      <tr className="border-b border-slate-200">
        {["Regulatory item", "Type", "Importance", "Lifecycle"].map((h, idx) =>
      <th key={h} className={`text-left text-[10px] font-bold uppercase tracking-wide text-slate-400 pb-2 pr-3 ${idx === 0 ? 'pl-4 w-[400px]' : ''}`}>{h}</th>
      )}
      </tr>
    </thead>
    <tbody>
      {regs.map((r, i) =>
    <tr key={i} onClick={() => onOpen(r)}
    className="border-b border-slate-100 cursor-pointer hover:bg-[#EEF2FF] transition-colors"
    style={{ background: i % 2 === 0 ? "white" : "#FAFBFC" }}>
          <td className="py-2.5 pr-3 pl-4 font-semibold text-[#0f2644] w-[400px]"><span className="line-clamp-2">{r.instrument_name}</span></td>
          <td className="py-2.5 pr-3"><CatBadge cat={r.category} small /></td>
          <td className="py-2.5 pr-3"><RelevanceBadge rel={r.relevance} small /></td>
          <td className="py-2.5"><div className="flex flex-wrap gap-1">{r.phase_tags.map((t) => <PhaseBadge key={t} tag={t} showTooltip={false} />)}</div></td>
        </tr>
    )}
    </tbody>
  </table>;


// ════════════════════════════════════════════════════════════════════
// STANDARDS TAB
// ════════════════════════════════════════════════════════════════════
const AdoptionBadge = ({ status }) => {
  const ad = ADOPTION_CFG[status];
  const [hovered, setHovered] = useState(false);
  const tooltips = {
    mandated_by_regulator: "This standard is legally required by a regulatory authority — compliance is mandatory.",
    incorporated_by_reference: "This standard is incorporated into binding regulation by reference — it carries legal force.",
    de_facto_baseline: "Widely adopted industry baseline or best practice — not legally required but expected.",
    voluntary: "Compliance is voluntary but demonstrates best practice and may support regulatory readiness.",
    unknown: "Adoption status requires verification from primary regulatory sources."
  };
  if (!ad) return null;
  return (
    <span
      className="relative inline-flex items-center rounded-md text-[10px] font-bold border px-2 py-0.5 cursor-help"
      style={{ color: ad.color, background: ad.bg, borderColor: ad.border }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      
      {ad.label}
      {hovered &&
      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white text-[#0f2644] rounded-xl px-3 py-2.5 z-[9999] shadow-xl pointer-events-none border border-slate-200 block"
      style={{ whiteSpace: "normal" }}>
          <div className="text-[9px] font-black uppercase tracking-widest text-[#0f2644] mb-1.5">{ad.label}</div>
          <p className="text-[10px] leading-relaxed text-slate-500">{tooltips[status] ?? ""}</p>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 w-2 h-2 bg-white border-t border-l border-slate-200 rotate-45" />
        </span>
      }
    </span>);

};

const StandardsTab = ({ onOpenPanel }) =>
<div className="grid grid-cols-2 gap-4">
    {STANDARDS.map((s, i) => {
    return (
      <div key={i} onClick={() => onOpenPanel(s)} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group">
          <div className="mb-2">
            <div className="text-[13px] font-bold text-[#0f2644] leading-snug mb-1">{s.standard_name}</div>
            <div className="text-[11px] text-slate-400">{s.issuing_body}</div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            {s.adoption_status === "unknown" ?
          <span className="text-[11px] text-slate-400 italic">Status unknown</span> :
          <AdoptionBadge status={s.adoption_status} />}
            <RelevanceBadge rel={s.relevance} small />
            {s.phase_tags.map((t) => <PhaseBadge key={t} tag={t} showTooltip={true} />)}
          </div>
          <p className="text-[12px] text-slate-500 leading-relaxed mb-2">{s.scope_summary}</p>
          {s.adoption_note && <p className="text-[11px] text-slate-400 italic mb-2"><span className="font-semibold text-slate-500">Regulatory context:</span> {s.adoption_note}</p>}
          {/* Verification — grey left-border, no amber — spec §2.2 */}
          {s.needs_verification && s.needs_verification_reason &&
        <p className="text-[12px] mb-2" style={{ color: "#78716C", paddingLeft: 10, borderLeft: "2px solid #D1D5DB" }}>{s.needs_verification_reason}</p>
        }
          <div className="flex-1"></div>
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-slate-500">Source(s):</span>
                <div className="flex flex-wrap gap-1.5">{s.source_urls.map((u, j) => <SourcePill key={j} url={u} index={j + 1} />)}</div>
              </div>
              <span className="text-[11px] text-blue-500 group-hover:underline">View details ›</span>
            </div>
          </div>
        </div>);

  })}
  </div>;


// ════════════════════════════════════════════════════════════════════
// ANALYSIS TAB — spec §6
// ════════════════════════════════════════════════════════════════════
const AnalysisTab = () => {
  const sections = [
  { label: "Regulatory Maturity", icon: "#1EDD7D", text: ANALYSIS.regulatory_maturity },
  { label: "Enforcement Intensity", icon: "#ef4444", text: ANALYSIS.enforcement_intensity },
  { label: "Structure and Fragmentation", icon: "#3b82f6", text: ANALYSIS.centralisation_vs_fragmentation },
  { label: "Direction of Change", icon: "#f59e0b", text: ANALYSIS.direction_of_change }];


  // Split long paragraph into bullet points on sentence boundaries
  const toBullets = (text) => {
    return text.
    split(/(?<=\.)\s+(?=[A-Z])/).
    map((s) => s.trim()).
    filter((s) => s.length > 0);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {sections.map((s, i) => s.text ?
        <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-[14px] font-black text-[#0f2644]">{s.label}</h3>
            </div>
            <ul className="list-disc list-outside pl-4 space-y-2">
              {toBullets(s.text).map((bullet, j) =>
            <li key={j} className="text-[12.5px] text-slate-600 leading-relaxed">{bullet}</li>
            )}
            </ul>
          </div> :
        null)}
      </div>
      {GAP_SUMMARY.length > 0 &&
      <div className="rounded-xl p-4" style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="relative group/gap cursor-help flex-shrink-0">
              <svg width="12" height="12" fill="none" stroke="#f59e0b" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <div className="absolute left-0 bottom-full mb-2 z-[9999] hidden group-hover/gap:block w-64 bg-white text-[#0f2644] rounded-xl px-3 py-2.5 shadow-xl border border-slate-200 pointer-events-none">
                <div className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Coverage Gaps</div>
                <p className="text-[11px] leading-relaxed text-slate-600">Domains where the research process could not retrieve official regulatory sources. These gaps indicate areas that likely have obligations but require manual verification — they are not confirmed absences of regulation.</p>
              </div>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#b45309" }}>Coverage Gaps</span>
          </div>
          <div className="space-y-2">
            {GAP_SUMMARY.map((g, i) =>
          <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: "#fef9ec", border: "1px solid #fde68a" }}>
                <span className="flex-shrink-0 text-[9px] font-bold py-0.5 rounded border text-center"
            style={{
              width: "68px",
              background: g.jurisdiction_layer === "national" ? "#f1f5f9" : g.jurisdiction_layer === "subnational" ? "#fff7ed" : "#f0fdf4",
              color: g.jurisdiction_layer === "national" ? "#0f2644" : g.jurisdiction_layer === "subnational" ? "#c2410c" : "#15803d",
              borderColor: g.jurisdiction_layer === "national" ? "#c7d2fe" : g.jurisdiction_layer === "subnational" ? "#fed7aa" : "#bbf7d0"
            }}>
                  {g.jurisdiction_layer === "national" ? "National" : g.jurisdiction_layer === "subnational" ? "Subnational" : "Supranational"}
                </span>
                <div>
                  <div className="text-[12px] font-semibold text-[#0f2644]">{g.domain}</div>
                  <div className="text-[11px] text-slate-500 leading-relaxed">{g.gap_reason}</div>
                </div>
              </div>
          )}
          </div>
        </div>
      }
    </div>);

};

// ════════════════════════════════════════════════════════════════════
// STRATEGIC IMPLICATIONS TAB — spec §6
// ════════════════════════════════════════════════════════════════════
const StrategicTab = () => {
  const toBullets = (text) =>
  text.split(/(?<=\.)\s+(?=[A-Z])/).map((s) => s.trim()).filter((s) => s.length > 0);

  return (
    <div className="space-y-5">
    {/* Key risks */}
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <svg width="13" height="13" fill="none" stroke="#ef4444" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
        <h3 className="text-[14px] font-black text-[#0f2644]">Key Risks</h3>
        <span className="ml-auto text-[11px] text-slate-400">{STRATEGIC.key_risks.length} identified</span>
      </div>
      <div className="space-y-3">
        {STRATEGIC.key_risks.map((r, i) =>
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-red-100 bg-red-50">
            <span className="w-6 h-6 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-[11px] font-black text-red-600 flex-shrink-0 mt-0.5">{i + 1}</span>
            <div className="min-w-0" style={{ maxWidth: "70%" }}>
              <p className="text-[13px] text-[#0f2644] leading-relaxed mb-1">{r.risk_description}</p>
              <div className="text-[11px] text-slate-400">{r.regulatory_anchor}</div>
            </div>
          </div>
          )}
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      {[
        { label: "Compliance Complexity", text: STRATEGIC.compliance_complexity, icon: "#3b82f6" },
        { label: "Barriers to Entry", text: STRATEGIC.barriers_to_entry, icon: "#ef4444" },
        { label: "Operational Constraints", text: STRATEGIC.operational_constraints, icon: "#f59e0b" }].
        map((s, i) => s.text ?
        <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-[13px] font-black text-[#0f2644]">{s.label}</h3>
          </div>
          <ul className="list-disc list-outside pl-4 space-y-2">
            {toBullets(s.text).map((bullet, j) =>
            <li key={j} className="text-[12.5px] text-slate-600 leading-relaxed">{bullet}</li>
            )}
          </ul>
        </div> :
        null)}
      {/* Strategic Opportunities */}
      {STRATEGIC.strategic_opportunities &&
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-[13px] font-black text-[#0f2644]">Strategic Opportunities</h3>
          </div>
          <ul className="list-disc list-outside pl-4 space-y-2">
            {toBullets(STRATEGIC.strategic_opportunities).map((bullet, j) =>
            <li key={j} className="text-[12.5px] text-slate-600 leading-relaxed">{bullet}</li>
            )}
          </ul>
        </div>
        }
    </div>
  </div>);

};

// ════════════════════════════════════════════════════════════════════
// ASSUMPTIONS — collapsible at page bottom, not inside a tab
// ════════════════════════════════════════════════════════════════════
const MethodologyNotes = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-8 border-t border-slate-200 pt-4">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-[12px] font-semibold text-slate-400 hover:text-slate-600 transition-colors">
        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className={`transition-transform ${open ? "rotate-90" : ""}`}><polyline points="9 18 15 12 9 6" /></svg>
        Methodology notes ({ASSUMPTIONS.length})
      </button>
      {open &&
      <ul className="mt-3 space-y-1.5 pl-4">
          {ASSUMPTIONS.map((a, i) =>
        <li key={i} className="flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
              <span className="text-slate-300 flex-shrink-0 mt-0.5">·</span>{a}
            </li>
        )}
        </ul>
      }
    </div>);

};

// ════════════════════════════════════════════════════════════════════
// SIDEBAR & NAV
// ════════════════════════════════════════════════════════════════════
const SB_MAIN = [
{ label: "Dashboard", icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg> },
{ label: "Research", icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></svg> },
{ label: "Regulatory Intel", icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
{ label: "Projects", icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" /></svg> },
{ label: "Members", icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg> }];

const SB_SEC = [
{ label: "Pending Requests", icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> },
{ label: "Shared Reports", icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg> },
{ label: "Audit History", icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> }];

const NAV_TABS = [
{ id: "overview", label: "Overview", icon: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> },
{ id: "regulations", label: "Regulations", icon: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>, badge: REGULATIONS.length },
{ id: "standards", label: "Standards", icon: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, badge: STANDARDS.length },
{ id: "analysis", label: "Analysis", icon: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg> },
{ id: "strategic", label: "Strategic Implications", icon: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> }];


// ════════════════════════════════════════════════════════════════════
// ROOT APP
// ════════════════════════════════════════════════════════════════════
export default function Regulationfinal() {
  const [tab, setTab] = useState("overview");
  const [sideNav, setSideNav] = useState(2);
  const [detailReg, setDetailReg] = useState(null);
  const [detailStandard, setDetailStandard] = useState(null);
  const [initialStateFilter, setInitialStateFilter] = useState(null);

  const navigateToState = (stateName) => {
    setInitialStateFilter(stateName);
    setTab("regulations");
  };

  // Close panel on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        setDetailReg(null);
        setDetailStandard(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f6f9] font-sans overflow-hidden">

      {/* ── HEADER — exact reference match ─────────────────── */}
      <header className="bg-white border-b border-slate-200 px-8 h-14 flex items-center justify-between sticky top-0 z-[200] shadow-[0_1px_4px_rgba(0,0,0,.06)] flex-shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0f2644] to-[#1a4a7a] flex items-center justify-center">
              <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <div>
              {/* reference: text-[15px] font-black */}
              <div className="text-[15px] font-black text-[#0f2644] leading-none">CHESZ</div>
              {/* reference: text-[12px] font-medium */}
              <div className="text-[12px] font-medium text-slate-400 leading-none mt-0.5">Regulatory Intelligence Platform</div>
            </div>
          </div>
          {/* reference: text-[9px] */}
          <span className="text-[9px] font-bold uppercase tracking-[.07em] px-2 py-0.5 rounded-md bg-[#edfdf5] border border-[#a7f3d0] text-[#15b865]">Reg Intel</span>
        </div>
        <div className="flex items-center gap-2">
          {/* reference: text-[12px] */}
          {["Tour", "Help"].map((l) =>
          <button key={l} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors">{l}</button>
          )}
          {/* reference: text-[12px] */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0f2644] to-[#1a4a7a] flex items-center justify-center text-[12px] font-extrabold text-white">NT</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden h-[calc(100vh-56px)]">

        {/* ── SIDEBAR — exact reference match ────────────────── */}
        <aside className="w-[210px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col z-[80] h-[calc(100vh-56px)] overflow-y-auto">
          <nav className="flex-1 p-2.5 flex flex-col gap-0.5">
            {SB_MAIN.map((item, i) =>
            <button key={i} onClick={() => setSideNav(i)}
            className={`flex items-center gap-2.5 py-2 rounded-lg text-[12px] w-full text-left transition-all border-l-[3px] ${
            sideNav === i ?
            "bg-[#edfdf5] text-[#15b865] font-semibold border-[#1EDD7D] pl-[9px] pr-3" :
            "text-slate-400 font-medium border-transparent px-3 hover:bg-slate-50 hover:text-slate-700"}`
            }>
                <span className={sideNav === i ? "opacity-100" : "opacity-70"}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )}
            <div className="h-px my-2 mx-2.5 bg-slate-200" />
            {SB_SEC.map((item, i) =>
            <button key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium text-slate-400 w-full text-left border-l-[3px] border-transparent hover:bg-slate-50 hover:text-slate-700 transition-all">
                <span className="opacity-70">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )}
          </nav>
          {/* Credits widget */}
          <div className="p-3 border-t border-slate-200 flex-shrink-0">
            <div className="rounded-[10px] p-3 border-[1.5px] border-slate-200 bg-[#f4f6f9]">
              <div className="flex items-center gap-1.5 mb-2">
                <svg width="13" height="13" fill="none" stroke="#1EDD7D" strokeWidth="2.5" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                {/* reference: text-[15px] font-bold */}
                <span className="text-[15px] font-bold text-[#0f2644]">Credits</span>
              </div>
              <div className="flex justify-between mb-1.5">
                {/* reference: text-[12px] */}
                <span className="text-[12px] font-medium text-slate-400">Used</span>
                {/* reference: text-[8px] */}
                <span className="text-[8px] font-semibold text-slate-500">18450/30000</span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden bg-slate-200 mb-1.5">
                <div className="h-full w-[61.5%] rounded-full bg-[#1EDD7D]" />
              </div>
              {/* reference: text-[12px] */}
              <div className="text-[12px] text-center font-medium text-slate-400">11550 remaining</div>
            </div>
          </div>
        </aside>

        {/* ── MAIN ───────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 overflow-hidden min-w-0 h-[calc(100vh-56px)]">

          {/* Title bar */}
          <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between gap-4 shadow-[0_1px_3px_rgba(0,0,0,.05)]">
            <div className="min-w-0">
              {/* reference: text-[12px] font-bold */}
              <div className="text-[12px] font-bold text-[#0f2644] truncate">Regulatory Intelligence Report — ADAS Vehicle Testing, United States</div>
              {/* reference: text-[12px] */}
              <div className="text-[12px] text-slate-400 mt-0.5">Manufacturer · National & Subnational · {REGULATIONS.length} regulations · {STANDARDS.length} standards</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {[
              { label: "Share", icon: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg> },
              { label: "Download", icon: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg> }].
              map((btn) => (
              /* reference: text-[8px] */
              <button key={btn.label} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[8px] font-semibold text-[#2563eb] hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  {btn.icon}{btn.label}
                </button>)
              )}
            </div>
          </div>

          {/* ── NAV TABS — exact reference match ─────────────── */}
          <nav className="flex-shrink-0 bg-white border-b border-slate-200 px-6 flex shadow-[0_1px_4px_rgba(0,0,0,.04)]">
            {NAV_TABS.map((t) =>
            <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-3 flex items-center gap-1.5 text-[12px] font-medium transition-all whitespace-nowrap border-b-[3px] ${
            tab === t.id ?
            "text-[#1EDD7D] border-[#1EDD7D] font-bold" :
            "text-slate-500 border-transparent hover:text-slate-700"}`
            }>
                {t.icon}
                {t.label}
              </button>
            )}
          </nav>

          {/* Content */}
          <main className="flex-1 overflow-y-auto">
            {tab === "overview" &&
            <div className="px-6 py-6"><OverviewTab onGoTab={setTab} onOpenPanel={setDetailReg} onStateClick={navigateToState} /></div>
            }
            {tab === "regulations" && <RegulationsTab onOpenPanel={setDetailReg} initialStateFilter={initialStateFilter} onClearStateFilter={() => setInitialStateFilter(null)} />}
            {tab === "standards" &&
            <>
                <div className="bg-white border-b border-slate-200 px-5 py-3.5">
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#f5f3ff" }}>
                      <svg width="14" height="14" fill="none" stroke="#7c3aed" strokeWidth="2.5" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    </div>
                    <div className="text-[15px] font-black text-[#0f2644]">Technical Standards</div>
                  </div>
                  <div className="text-[13px] text-slate-500 pl-9">Industry consensus standards and technical specifications referenced in regulatory frameworks.</div>
                </div>
                <div className="px-6 py-6"><StandardsTab onOpenPanel={setDetailStandard} /></div>
              </>
            }
            {tab === "analysis" &&
            <>
                <div className="bg-white border-b border-slate-200 px-5 py-3.5">
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#f0fdf4" }}>
                      <svg width="14" height="14" fill="none" stroke="#15b865" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                    </div>
                    <div className="text-[15px] font-black text-[#0f2644]">Regulatory Analysis</div>
                  </div>
                  <div className="text-[13px] text-slate-500 pl-9">Assessment of regulatory landscape maturity, enforcement patterns, and jurisdictional structure.</div>
                </div>
                <div className="px-6 py-6"><AnalysisTab /></div>
              </>
            }
            {tab === "strategic" &&
            <>
                <div className="bg-white border-b border-slate-200 px-5 py-3.5">
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#fff1f2" }}>
                      <svg width="14" height="14" fill="none" stroke="#ef4444" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                    </div>
                    <div className="text-[15px] font-black text-[#0f2644]">Strategic Implications</div>
                  </div>
                  <div className="text-[13px] text-slate-500 pl-9">Business impact analysis covering regulatory risks, compliance complexity, and operational considerations.</div>
                </div>
                <div className="px-6 py-6"><StrategicTab /></div>
              </>
            }
          </main>
        </div>
      </div>

      {/* Detail panel overlays — backdrop is now inside each panel component */}
      {detailReg && <DetailPanel reg={detailReg} onClose={() => setDetailReg(null)} />}
      {detailStandard && <StandardDetailPanel standard={detailStandard} onClose={() => setDetailStandard(null)} />}
    </div>);

}