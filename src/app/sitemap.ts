import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/**
 * Sitemap.
 *
 * TODO(business-facts): a sitemap needs absolute URLs, which needs the
 * production domain. `site.url` is null until the owner supplies one
 * (DOC1 §50 Q4), so this falls back to NEXT_PUBLIC_SITE_URL from the
 * environment and, failing that, emits nothing rather than publishing a
 * sitemap full of wrong origins.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url ?? process.env.NEXT_PUBLIC_SITE_URL;
  if (!base) return [];

  const origin = base.replace(/\/$/, "");
  const lastModified = new Date();

  return [
    { url: `${origin}/`, priority: 1, changeFrequency: "monthly" as const },
    { url: `${origin}/software`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${origin}/recruiting`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${origin}/about`, priority: 0.6, changeFrequency: "yearly" as const },
    { url: `${origin}/contact`, priority: 0.7, changeFrequency: "yearly" as const },
    { url: `${origin}/privacy`, priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${origin}/terms`, priority: 0.3, changeFrequency: "yearly" as const },
  ].map((entry) => ({ ...entry, lastModified }));
}
