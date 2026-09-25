import { Hero } from "@/components/hero/Hero";
import { SplitSection } from "@/components/sections/SplitSection";
import { WhatWeBuild } from "@/components/sections/WhatWeBuild";
import { Process } from "@/components/sections/Process";
import { BrandStatement } from "@/components/sections/BrandStatement";
import { Capabilities } from "@/components/sections/Capabilities";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { WorkThatMoves } from "@/components/sections/WorkThatMoves";
import { Testimonials } from "@/components/sections/Testimonials";
import { RecruitingIntro } from "@/components/sections/RecruitingIntro";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { FinalCTA } from "@/components/sections/FinalCTA";

/**
 * Homepage.
 *
 * Section order is exactly prompt §6:
 *   1. Hero animation            ─┐
 *   2. GENRA brand resolution    ─┘ both inside <Hero>
 *   3. Software / Recruiting split
 *   4. What We Build
 *   5. Process
 *   6. Build. Automate. Advance.
 *   7. Modern technology / capabilities
 *   8. Ideas We've Brought to Life   — renders nothing, no verified projects
 *   9. Work That Moves People Forward
 *  10. Recruiting introduction
 *  11. About
 *  12. Final project CTA
 *  13. Footer                       — in the root layout
 *
 * §6 also warns the page must not feel overcrowded. Every section here is
 * typography-led: no card grids, no icon rows, no statistics, no stock imagery.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <SplitSection />
      <WhatWeBuild />
      <Process />
      <BrandStatement />
      <Capabilities />
      <SelectedWork />
      <WorkThatMoves />
      <Testimonials />
      <RecruitingIntro />
      <AboutPreview />
      <FinalCTA />
    </>
  );
}
