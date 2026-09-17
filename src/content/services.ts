/**
 * GENRA service catalog.
 *
 * This is the approved nine-service catalog (prompt §14/§15). It explicitly
 * supersedes the older six-category list in DOC1 §21 and the eleven project-type
 * list in DOC3.1 §3.9 / DOC4 §4.13 — recorded as conflict C3 in
 * Reports/Implementation_Plan.md §2 and Decision 1 in Brain.md §11.
 *
 * DOC4 §4.13 requires that project types live as application configuration
 * rather than a rigid database enum, and `software_leads.project_type` is
 * VARCHAR(100). So this file is the single source of truth for:
 *   - the /software page catalog
 *   - the homepage "What We Build" index
 *   - the project form's "Type of Project" dropdown
 *
 * Content shape maps 1:1 onto a future Sanity document (DOC2 §45 Phase 3), so
 * moving it into the CMS later does not change any call site.
 */

export type ServiceLine = "software" | "recruiting";

export interface Service {
  /** Two-digit index as presented in the UI ("01" … "09"). */
  readonly number: string;
  /** Stable machine value. Persisted to software_leads.project_type. */
  readonly value: string;
  readonly title: string;
  /** Concise supporting copy. Prompt §17 — do not overstate capability. */
  readonly description: string;
  readonly line: ServiceLine;
}

export const services: readonly Service[] = [
  {
    number: "01",
    value: "MVP_DEVELOPMENT",
    title: "MVP Development",
    description: "Turn an idea into a functional first product.",
    line: "software",
  },
  {
    number: "02",
    value: "SAAS_DEVELOPMENT",
    title: "SaaS Development",
    description: "Build scalable cloud and subscription software.",
    line: "software",
  },
  {
    number: "03",
    value: "END_TO_END_SOFTWARE_PRODUCTION",
    title: "End-to-End Software Production",
    description:
      "From concept and architecture through development and launch, build the complete digital product.",
    line: "software",
  },
  {
    number: "04",
    value: "WEB_APPLICATION",
    title: "Web Application",
    description:
      "Build browser-based applications and platforms around real workflows.",
    line: "software",
  },
  {
    number: "05",
    value: "BUSINESS_SOFTWARE",
    title: "Business Software",
    description:
      "Create software designed around specific operational and business needs.",
    line: "software",
  },
  {
    number: "06",
    value: "PORTFOLIO_WEBSITES",
    title: "Portfolio Websites",
    description:
      "Build distinctive websites that present people, businesses, products and work professionally.",
    line: "software",
  },
  {
    number: "07",
    value: "AI_POWERED_APPLICATIONS",
    title: "AI-Powered Applications",
    description:
      "Integrate useful AI capabilities where they create meaningful value.",
    line: "software",
  },
  {
    number: "08",
    value: "AUTOMATION_SYSTEMS",
    title: "Automation Systems",
    description: "Automate repetitive processes and connect workflows.",
    line: "software",
  },
  {
    /**
     * Career & Recruiting is a separate service line, not a software
     * development category (prompt §14, §15). It appears in the catalog and in
     * the project-form dropdown, but selecting it routes the submission through
     * the recruiting workflow — see prompt §31.
     */
    number: "09",
    value: "CAREER_AND_RECRUITING",
    title: "Career & Recruiting",
    description:
      "You find the opportunity. GENRA handles the application workflow.",
    line: "recruiting",
  },
] as const;

/** The eight software-line services, for pages that must exclude recruiting. */
export const softwareServices = services.filter((s) => s.line === "software");

/**
 * "Type of Project" dropdown options (prompt §31).
 * The nine catalog services in order, followed by Other.
 * E2E asserts this list matches the approved catalog exactly.
 */
export const OTHER_PROJECT_TYPE = "OTHER";

export const projectTypeOptions = [
  ...services.map((s) => ({ value: s.value, label: s.title })),
  { value: OTHER_PROJECT_TYPE, label: "Other" },
] as const;

/** Machine values accepted by the server for project_type. */
export const projectTypeValues = projectTypeOptions.map((o) => o.value);

/**
 * GENRA delivery process (prompt §19).
 * Five steps — presented through typography and whitespace, never as five
 * icon cards.
 */
export const processSteps = [
  {
    number: "01",
    title: "Understand",
    description:
      "Establish what the product actually needs to do, and for whom.",
  },
  {
    number: "02",
    title: "Design",
    description: "Shape the architecture, the interface and the decisions.",
  },
  {
    number: "03",
    title: "Build",
    description: "Develop the system, verifying as it goes rather than after.",
  },
  {
    number: "04",
    title: "Launch",
    description: "Ship it, with the operational pieces in place.",
  },
  {
    number: "05",
    title: "Advance",
    description: "Improve what is working and extend what comes next.",
  },
] as const;

/**
 * Capability categories (prompt §21).
 * Deliberately NOT a technology logo wall. Only capabilities this project's
 * approved stack actually supports.
 */
export const capabilities = [
  {
    title: "AI & Automation",
    description:
      "Applied where it removes real work, not applied to everything.",
  },
  {
    title: "Web Applications",
    description: "Browser-based platforms built around real workflows.",
  },
  {
    title: "Cloud Systems",
    description: "Hosted, managed infrastructure without operational sprawl.",
  },
  {
    title: "APIs & Integrations",
    description: "Systems that talk to the systems you already run.",
  },
  {
    title: "Data Systems",
    description: "Structured, queryable data with auditability built in.",
  },
  {
    title: "Internal Platforms",
    description: "Tools built for the people who operate the business.",
  },
] as const;
