import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://apex-tv-mounting.vercel.app"),
  title: "Apex TV Mounting & Installation | Los Angeles & Orange County",
  description: "Premium TV mounting, wire concealment, and home theater installation in Los Angeles and Orange County.",
  keywords: ["TV mounting Los Angeles", "TV installation Orange County", "wire concealment", "home theater installation"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Apex TV Mounting & Installation | Precision You Can See.",
    description: "Premium TV mounting, wire concealment, and home theater installation in Los Angeles and Orange County.",
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Apex TV Mounting & Installation",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apex TV Mounting & Installation | Precision You Can See.",
    description: "Premium TV mounting, wire concealment, and home theater installation in Los Angeles and Orange County.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
