import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/**
 * robots.txt
 *
 * The sitemap line is emitted only when a production domain is known —
 * pointing crawlers at a sitemap that resolves against the wrong origin is
 * worse than omitting it. TODO(business-facts).
 */
export default function robots(): MetadataRoute.Robots {
  const base = site.url ?? process.env.NEXT_PUBLIC_SITE_URL;
  const origin = base?.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    ...(origin ? { sitemap: `${origin}/sitemap.xml` } : {}),
  };
}
