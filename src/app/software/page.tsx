import type { Metadata } from "next";
import { SoftwareHero } from "@/components/sections/SoftwareHero";
import { ServiceCatalog } from "@/components/sections/ServiceCatalog";
import { Process } from "@/components/sections/Process";
import { Capabilities } from "@/components/sections/Capabilities";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "Software Solutions",
  description:
    "GENRA builds digital products, software systems and automation for ideas, startups and businesses: MVPs, SaaS, web applications, business software and AI-powered systems.",
  alternates: { canonical: "/software" },
  openGraph: {
    title: "GENRA | Software Solutions",
    description:
      "GENRA builds digital products, software systems and automation for ideas, startups and businesses.",
    url: "/software",
    // A page-level openGraph replaces the root one, image included.
    images: "/opengraph-image.png",
  },
};

/**
 * /software
 *
 * Order per the owner revision of 2026-10-03: an image-led hero of its own,
 * then the project form (inside FinalCTA, anchor #start), then the catalog,
 * process and capabilities. The form is the second thing a visitor meets.
 *
 * Claims are limited to what GENRA does. No client names, metrics, logos or case
 * studies appear, because none are verified (§18, §53). `SelectedWork` renders
 * nothing while `content/projects.ts` is empty.
 */
export default function SoftwarePage() {
  return (
    <>
      <SoftwareHero />
      <FinalCTA
        placement="lead"
        heading={
          <>
            Build something <span className="text-accent">real.</span>
          </>
        }
        lead="Tell us what you are trying to build: the product, who it is for, and roughly where you are with it."
      />
      <ServiceCatalog />
      <Process />
      <Capabilities
        image={{
          src: "/images/sections/architecture.webp",
          alt: "Two people mapping out a system on a whiteboard, one holding a laptop",
        }}
      />
      <SelectedWork />
    </>
  );
}
