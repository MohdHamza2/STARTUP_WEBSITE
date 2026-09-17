import Image from "next/image";
import { projects } from "@/content/projects";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "Ideas we've brought to life." (prompt §22)
 *
 * Renders nothing while no verified project exists.
 *
 * §22 offers two options: omit the section, or ship an empty structural one that
 * can be populated later. Taken literally, an empty-but-visible section reads as
 * broken to a visitor, so this takes the spirit of both — the component and its
 * layout exist and are wired to `projects`, but output nothing until there is
 * something true to show. Adding one verified entry makes the section appear.
 *
 * The layout is large-format visual storytelling rather than a case-study card
 * grid, which §22 rules out.
 */
export function SelectedWork() {
  if (projects.length === 0) return null;

  return (
    <section aria-labelledby="work-heading" className="bg-obsidian">
      <div className="container-wide py-32 sm:py-40">
        <Reveal>
          <p className="text-eyebrow uppercase text-graphite">Selected work</p>
          <h2 id="work-heading" className="mt-5 max-w-3xl text-h2 uppercase text-ivory">
            Ideas we&apos;ve brought to life.
          </h2>
        </Reveal>

        <div className="mt-24 space-y-32">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={Math.min(i * 0.06, 0.24)}>
              <article className="grid gap-10 lg:grid-cols-[1fr_minmax(0,24rem)] lg:items-end lg:gap-20">
                {project.image && (
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-card-dark">
                    <Image
                      src={project.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  {project.year && (
                    <p className="font-display text-caption text-graphite">
                      {project.year}
                    </p>
                  )}
                  <h3 className="mt-3 font-display text-h3 text-ivory">
                    {project.title}
                  </h3>
                  <p className="mt-4 text-body text-silver">{project.summary}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
