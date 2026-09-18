import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceCatalog } from "@/components/sections/ServiceCatalog";
import { Process } from "@/components/sections/Process";
import { Capabilities } from "@/components/sections/Capabilities";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { cta } from "@/config/site";

export const metadata: Metadata = {
  title: "Software Solutions",
  description:
    "GENRA builds digital products, software systems and automation for ideas, startups and businesses — MVPs, SaaS, web applications, business software and AI-powered systems.",
  alternates: { canonical: "/software" },
  openGraph: {
    title: "GENRA — Software Solutions",
    description:
      "GENRA builds digital products, software systems and automation for ideas, startups and businesses.",
    url: "/software",
  },
};

/**
 * /software
 *
 * Structure per prompt §16–§19. The hero is related to the homepage but not a
 * duplicate of it (§16) — no frame sequence, no workstation.
 *
 * Claims are limited to what GENRA does. No client names, metrics, logos or case
 * studies appear, because none are verified (§18, §53). `SelectedWork` renders
 * nothing while `content/projects.ts` is empty.
 */
export default function SoftwarePage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Software Solutions"
        lead={{ first: "You have the idea.", second: "We build the system." }}
        body="GENRA builds digital products, software systems and automation for ideas, startups and businesses."
        cta={{ label: cta.software, href: "#start" }}
      />
      <ServiceCatalog />
      <Process />
      <Capabilities />
      <SelectedWork />
      <FinalCTA />
    </>
  );
}
