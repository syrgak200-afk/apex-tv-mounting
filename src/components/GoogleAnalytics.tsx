"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export const GA_MEASUREMENT_ID = "G-KRW9EM9BT0";
export const GA_READY_EVENT = "apex:ga4-ready";

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

    window.addEventListener(GA_READY_EVENT, track, { once: true });
    return () => window.removeEventListener(GA_READY_EVENT, track);
  }, [pathname, searchParams]);

  return null;
}
