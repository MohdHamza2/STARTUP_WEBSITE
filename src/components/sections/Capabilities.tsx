import Image from "next/image";
import { capabilities } from "@/content/services";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "Built with modern technology." (prompt §21)
 *
 * Explicitly NOT a technology logo wall — §21 rules that out, and §50 rules out
 * the generic logo-collage look generally. Six capability categories, set as
 * text, with only a hairline between them.
 *
 * The categories describe what GENRA actually builds with the approved stack.
 * No framework is named, because naming them would either be a logo wall in
 * words or a claim about tools not in this project.
 */
/** `image` is passed on /software only; the homepage keeps this section
    typographic, because its neighbour (BrandStatement) already carries a photo. */
export function Capabilities({ image }: { image?: { src: string; alt: string } }) {
  return (
    <section aria-labelledby="capabilities-heading" className="bg-paper">
      <div className="container-wide section-y">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-24">
          <Reveal>
            <h2
              id="capabilities-heading"
              className="text-h2 text-ink"
            >
              Built with modern technology.
            </h2>
            <p className="mt-6 text-body-lg text-muted">
              Technology should serve the outcome.
            </p>
            {image && (
              <Image
                src={image.src}
                alt={image.alt}
                width={1600}
                height={1067}
                sizes="(min-width: 1024px) 26rem, 100vw"
                className="photo mt-14 aspect-[4/3] w-full object-cover"
              />
            )}
          </Reveal>

          <ul className="grid gap-px bg-line sm:grid-cols-2">
            {capabilities.map((capability, i) => (
              <Reveal
                as="li"
                key={capability.title}
                delay={Math.min(i * 0.05, 0.3)}
                className="bg-paper"
              >
                <div className="h-full px-0 py-7 sm:px-7">
                  <h3 className="font-display text-h3 text-ink">
                    {capability.title}
                  </h3>
                  <p className="mt-3 text-body text-muted">
                    {capability.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
