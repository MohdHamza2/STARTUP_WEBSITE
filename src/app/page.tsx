import { ServiceHero } from "@/components/hero/ServiceHero";
import { SplitSection } from "@/components/sections/SplitSection";
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
 *   1. Hero — the nine services as a scroll-driven Molten Ring
 *      (replaced the frame-sequence hero and its brand beat, 2026-10-03)
 *   3. Software / Recruiting split
 *   4. What We Build — retired 2026-10-03: the hero now IS the nine-service
 *      index, so a second list straight after it only repeated it
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
      <ServiceHero />
      <SplitSection />
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
