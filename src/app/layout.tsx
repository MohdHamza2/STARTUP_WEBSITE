import type { Metadata, Viewport } from "next";
import { Sora, Inter } from "next/font/google";
import { site } from "@/config/site";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import "./globals.css";

/**
 * Brand kit §4: Sora for display typography and the GENRA wordmark,
 * Inter for body copy and interface elements. No other family is loaded.
 */
const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  /**
   * TODO(business-facts): metadataBase requires the production domain.
   * While site.url is null, Next resolves Open Graph URLs relative to the
   * deployment origin, which is correct-but-unstable. Set site.url once the
   * domain exists (DOC1 §50 Q4) and canonical URLs become absolute.
   */
  ...(site.url ? { metadataBase: new URL(site.url) } : {}),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <head>
        {/*
          Scroll reveals start hidden and are revealed by JavaScript. Without
          JS that would leave the page blank, so force them visible. Content
          must never depend on the animation system (DOC5 §5.34).
        */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a href="#main" className="sr-only-focusable">
          Skip to content
        </a>
        <SmoothScroll />
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
