/**
 * Career & Recruiting content.
 *
 * TRUTHFULNESS IS THE BINDING CONSTRAINT HERE (prompt §25, §26, §78;
 * DOC1 §43; DOC5 §5.6).
 *
 * Every line below describes only what GENRA does: handle the application
 * workflow from information the candidate supplies. Nothing promises a job, an
 * interview, an offer, placement, a response time or any outcome, and no
 * statistic appears anywhere.
 *
 * Per prompt §27 there is deliberately NO "What We Don't Promise" section. The
 * boundaries are carried inside the process copy — step 04 states plainly who
 * owns employer communication and hiring decisions — so the page reads as
 * straightforward rather than defensive.
 */

export const recruitingAudience = [
  "International students",
  "Recent graduates",
  "Early-career professionals",
  "Candidates targeting US employment",
] as const;

export const recruitingProcess = [
  {
    number: "01",
    title: "Your profile",
    description:
      "Provide your resume, professional information and preferences.",
  },
  {
    number: "02",
    title: "Target roles",
    description:
      "Define the types of roles and opportunities you are targeting.",
  },
  {
    number: "03",
    title: "Application workflow",
    description:
      "GENRA handles the application workflow based on the information you provide.",
  },
  {
    number: "04",
    title: "Opportunities",
    description:
      "You remain responsible for employer communication, interviews, hiring decisions and employment outcomes.",
  },
] as const;

/**
 * What the recruiting form asks for.
 *
 * Mirrors DOC5 §5.8–§5.13 and the resolved decisions: name and email are
 * required (D1), everything else optional, resume is PDF only (D6).
 * Shown on the page so a candidate knows what is involved before starting.
 */
export const recruitingInputs = [
  {
    title: "Contact details",
    description: "Your name and email, so the team can reach you. Phone optional.",
  },
  {
    title: "Education",
    description: "Optional — level of study, university and graduation year.",
  },
  {
    title: "Work authorisation",
    description:
      "Optional. It helps identify which opportunities are relevant, and you can decline to say.",
  },
  {
    title: "Target role and location",
    description: "Optional — the roles, industries and places you are aiming for.",
  },
  {
    title: "Resume",
    description: "Optional. PDF, up to 10 MB. Stored privately, never public.",
  },
] as const;

/**
 * Work authorisation options offered in the form.
 * DOC4 §4.11: the database stores this as free text, and the list is editable
 * application content rather than a hard-coded enum.
 */
export const visaStatusOptions = [
  "F-1",
  "F-1 OPT",
  "STEM OPT",
  "H-1B",
  "H-4 EAD",
  "J-1",
  "Other",
  "Prefer not to say",
] as const;

/** Education options (DOC5 §5.9). */
export const educationOptions = [
  "Bachelor's",
  "Master's",
  "PhD",
  "Recently graduated",
  "Working professional",
  "Other",
] as const;
