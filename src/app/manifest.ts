import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/**
 * Web app manifest.
 *
 * Icon sizes follow the brand kit §7 (192 and 512), generated from the supplied
 * mark by `scripts/build-brand-icons.mjs`.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b0b",
    theme_color: "#0b0b0b",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
