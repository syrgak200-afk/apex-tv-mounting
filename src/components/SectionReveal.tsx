"use client";

import {
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "./SectionReveal.module.css";

type RevealElement = "article" | "aside" | "div" | "li" | "section";

type SectionRevealProps = HTMLAttributes<HTMLElement> & {
  /** Use the semantic wrapper that best fits the section being revealed. */
  as?: RevealElement;
  children: ReactNode;
  /** A short optional stagger, expressed in milliseconds. */
  delay?: number;
  /** How far the section rises into place, in pixels. */
  distance?: number;
  /** IntersectionObserver threshold. Defaults to a small visible portion. */
  threshold?: number;
  /** IntersectionObserver root margin. */
  rootMargin?: string;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * A progressive-enhancement reveal wrapper.
 *
 * Server-rendered content starts visible. Once the browser confirms motion is
 * appropriate, off-screen sections fade upward the first time they enter view.
 */
export function SectionReveal({
  as: Tag = "div",
  children,
  className,
  delay = 0,
  distance = 22,
  rootMargin = "0px 0px -8%",
  style,
  threshold = 0.08,
  ...rest
}: SectionRevealProps) {
  const Component = Tag as ElementType;
  const elementRef = useRef<HTMLElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const element = elementRef.current;

    if (
      !element ||
      window.matchMedia(REDUCED_MOTION_QUERY).matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    // Avoid an above-the-fold flash: sections already on screen stay visible.
    const rect = element.getBoundingClientRect();
    const startsInView = rect.top < window.innerHeight && rect.bottom > 0;

    if (startsInView) {
      setIsReady(true);
      setIsVisible(true);
      return;
    }

    setIsReady(true);
    setIsVisible(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        setIsVisible(true);
        observer.disconnect();
      },
      { rootMargin, threshold },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  const revealStyle = {
    ...style,
    "--section-reveal-delay": `${Math.max(delay, 0)}ms`,
    "--section-reveal-distance": `${Math.max(distance, 0)}px`,
  } as CSSProperties;

  return (
    <Component
      {...(rest as Record<string, unknown>)}
      className={[styles.reveal, className].filter(Boolean).join(" ")}
      data-reveal-ready={isReady}
      data-reveal-visible={isVisible}
      ref={elementRef}
      style={revealStyle}
    >
      {children}
    </Component>
  );
}
