import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's built-in scale. The project's type
 * tokens (globals.css `--text-*`) look like colour utilities to it, so
 * `cn("text-action", "text-ink")` would drop the size as a "conflicting"
 * colour. Registering them as font sizes keeps both.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "h2",
            "h3",
            "body-lg",
            "body",
            "action",
            "caption",
            "eyebrow",
          ],
        },
      ],
    },
  },
});

/** Merge conditional class names, resolving Tailwind conflicts last-wins. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
