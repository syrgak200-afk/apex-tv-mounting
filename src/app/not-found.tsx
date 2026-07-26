import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page Not Found", robots: { index: false, follow: false } };

export default function NotFound() {
  return <main id="main-content" className="section container"><p className="eyebrow eyebrow-dark">404</p><h1>That page is not available.</h1><p>Return to Apex TV Mounting to explore TV installation, wire concealment, and home theater services in Los Angeles and Orange County.</p><Link className="button button-primary" href="/">Return home</Link></main>;
}
