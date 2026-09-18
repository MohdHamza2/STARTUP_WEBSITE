import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoTone = "dark" | "light";

interface LogoProps {
  /** Background the logo sits on. "dark" = on Obsidian, "light" = on Ivory. */
  tone?: LogoTone;
  /** Hide the wordmark and render the mark alone (compact UI, small sizes). */
  markOnly?: boolean;
  /** Mark height in px. The wordmark scales with it. */
  size?: number;
  className?: string;
}

/**
 * GENRA logo lockup.
 *
 * The mark is the supplied brand asset and is never redrawn (prompt §2:
 * "Do NOT create a new logo"). The flat variants are used rather than the
 * mint-gradient ones — prompt §2 forbids glow/gradient/blur on the dark logo,
 * and the brand kit §2 calls the gradient "an accent, not the default".
 *
 * The wordmark is live Sora 600 text rather than an image. That is faithful,
 * not a substitution: brand kit §4 defines the wordmark AS Sora SemiBold 600
 * with wide spacing. Live text stays crisp at every size, scales with the user's
 * font settings, and is readable by assistive technology.
 *
 * The mint underline follows the brand board's primary and dark-mode lockups.
 */
export function Logo({
  tone = "dark",
  markOnly = false,
  size = 28,
  className,
}: LogoProps) {
  const src = tone === "dark" ? "/brand/mark-ivory.png" : "/brand/mark-obsidian.png";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        priority
        aria-hidden="true"
        style={{ height: size, width: size }}
      />
      {!markOnly && (
        <span className="inline-flex flex-col items-start gap-1">
          <span
            className={cn(
              "font-display font-semibold leading-none",
              tone === "dark" ? "text-ivory" : "text-obsidian",
            )}
            style={{ fontSize: size * 0.62, letterSpacing: "0.22em" }}
          >
            GENRA
          </span>
          <span
            aria-hidden="true"
            className="block bg-mint"
            style={{ height: 2, width: size * 0.86 }}
          />
        </span>
      )}
      {/* The visible wordmark is decorative text; this is the accessible name. */}
      <span className="sr-only">GENRA — home</span>
    </span>
  );
}
