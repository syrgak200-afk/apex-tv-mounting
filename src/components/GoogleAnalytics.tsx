"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { GA_READY_EVENT } from "@/lib/analytics";

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
