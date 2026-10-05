import Image from "next/image";
import Link from "next/link";
import { cta } from "@/config/site";

/**
 * /recruiting hero.
 *
 * Deliberately a different composition from both the homepage ring and the
 * /software split: a full-width headline, the action beside the supporting
 * line, and a wide photograph below. The photograph (a person reviewing
 * application papers in a bright office) is calm and human: no handshake, no
 * staged meeting, no technology imagery. Credited in assets/images/SOURCES.md.
 *
 * No outcome is promised (§24–§28): the copy describes the work GENRA does,
 * not a job, interview or placement. The CTA is "Get Started", never
 * "Start a Project".
 */
export function RecruitingHero() {
  return (
    <section className="bg-paper">
      <div className="container-wide pt-28 sm:pt-32 lg:pt-36">
        <h1 className="max-w-4xl text-display text-ink">
          Spend less time applying.{" "}
          <span className="text-accent">Focus on the opportunity.</span>
        </h1>
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
          <p className="max-w-xl text-body-lg text-muted">
            You tell us the roles you want and share your profile. GENRA works
            through the applications from the information you provide.
          </p>
          <Link
            href="#apply"
            className="inline-flex w-fit items-center rounded-pill bg-ink px-8 py-4 text-action font-semibold text-paper transition-[background-color,transform] duration-[var(--duration-fast)] ease-[var(--ease-genra)] hover:bg-graphite active:scale-[0.98]"
          >
            {cta.recruiting}
          </Link>
        </div>
      </div>

      <div className="container-wide mt-14 sm:mt-16">
        <Image
          src="/images/pages/recruiting-graduate.webp"
          alt="A graduate raising a mortarboard in front of a university building"
          width={2400}
          height={1600}
          priority
          sizes="(min-width: 1344px) 1296px, 100vw"
          className="photo aspect-[4/3] w-full object-cover object-[55%_25%] sm:aspect-[16/9] lg:aspect-[21/9]"
        />
      </div>
    </section>
  );
}
