import { Reveal } from "@/components/ui/Reveal";

/**
 * "Work that moves people forward." (prompt §23)
 *
 * A brand/value statement, not another portfolio grid. Typography-led,
 * cinematic, and deliberately sparse — no icons, no generated imagery.
 *
 * Depth comes from a single wide mint hairline and a large type block against
 * an otherwise empty field, which is the brand board's own device.
 */
export function WorkThatMoves() {
  return (
    <section aria-labelledby="moves-heading" className="relative bg-obsidian">
      <div className="container-wide py-40 sm:py-56">
        <Reveal>
          <span aria-hidden="true" className="block h-px w-24 bg-mint" />
          <h2
            id="moves-heading"
            className="mt-12 max-w-4xl text-display uppercase text-ivory"
          >
            Work that moves people forward.
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-14 max-w-xl text-body-lg text-silver">
            Technology is only worth building when someone is better off for it —
            a business that runs on less friction, a founder with a product that
            exists, a candidate spending their time on the opportunity instead of
            the paperwork.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
