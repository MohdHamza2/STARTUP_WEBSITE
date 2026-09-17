import { Hero } from "@/components/hero/Hero";
import { BrandStatement } from "@/components/sections/BrandStatement";

/**
 * Homepage.
 *
 * Section order follows prompt §6:
 *   1. Hero animation           → <Hero>
 *   2. GENRA brand resolution   → inside <Hero>, final beat
 *   3-13                        → added phase by phase below
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandStatement />
    </>
  );
}
