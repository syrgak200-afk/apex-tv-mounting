"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const measurementId = "G-KRW9EM9BT0";
const readyEvent = "apex:ga4-ready";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function sendPageView(path: string) {
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function GoogleAnalyticsPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;

    if (previousPath.current === path) {
      return;
    }

    const track = () => {
      sendPageView(path);
      previousPath.current = path;
    };

    if (typeof window.gtag === "function") {
      track();
      return;
    }

    window.addEventListener(readyEvent, track, { once: true });
    return () => window.removeEventListener(readyEvent, track);
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        id="google-analytics"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            window.gtag = function gtag(){window.dataLayer.push(arguments);}
            window.gtag('js', new Date());
            window.gtag('config', '${measurementId}', { send_page_view: false });
            window.dispatchEvent(new Event('${readyEvent}'));
          `,
        }}
      />
    </>
  );
}
