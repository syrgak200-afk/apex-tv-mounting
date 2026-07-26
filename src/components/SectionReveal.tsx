"use client";

import {
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type SectionRevealProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children: ReactNode;
};

export function SectionReveal({ as: Tag = "div", children, className, ...props }: SectionRevealProps) {
  const elementRef = useRef<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setReady(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setRevealed(true);
        observer.disconnect();
      },
      { threshold: 0.08 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      {...props}
      className={["section-reveal", ready ? "is-ready" : "", revealed ? "is-visible" : "", className].filter(Boolean).join(" ")}
      ref={elementRef}
    >
      {children}
    </Tag>
  );
}
