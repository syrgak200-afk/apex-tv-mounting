import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import { GoogleAnalyticsPageView } from "@/components/GoogleAnalytics";
import { MicrosoftClarity } from "@/components/MicrosoftClarity";
import { GA_MEASUREMENT_ID, GA_READY_EVENT } from "@/lib/analytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.apex-tv-mounting.com"),
  title: "Apex TV Mounting & Installation | Los Angeles & Orange County",
  description: "Premium TV mounting, wire concealment, and home theater installation in Los Angeles and Orange County.",
  keywords: ["TV mounting Los Angeles", "TV installation Orange County", "wire concealment", "home theater installation"],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: {
    title: "Apex TV Mounting & Installation | Precision You Can See.",
    description: "Premium TV mounting, wire concealment, and home theater installation in Los Angeles and Orange County.",
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Apex TV Mounting & Installation",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Apex TV Mounting & Installation" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apex TV Mounting & Installation | Precision You Can See.",
    description: "Premium TV mounting, wire concealment, and home theater installation in Los Angeles and Orange County.",
    images: ["/opengraph-image"],
  },
  verification: {
    google: "gcFnoDOx5aXBMjgZTwE8TpVS1tjoSfX5zBjlFzkfAVA",
  },
};

export const viewport = { themeColor: "#1f1713", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {children}
        <MicrosoftClarity />
        <Script
          id="google-analytics"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            window.gtag = function gtag(){window.dataLayer.push(arguments);}
            window.gtag('js', new Date());
            window.gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
            window.dispatchEvent(new Event('${GA_READY_EVENT}'));
          `}
        </Script>
        <Suspense fallback={null}>
          <GoogleAnalyticsPageView />
        </Suspense>
      </body>
    </html>
  );
}
