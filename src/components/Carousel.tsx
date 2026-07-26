"use client";

import {
  Children,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./Carousel.module.css";

type CarouselProps = {
  /** A concise description of the carousel's content, for example "Featured installations". */
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  viewportClassName?: string;
  trackClassName?: string;
  slideClassName?: string;
  controlsClassName?: string;
  dotsClassName?: string;
  previousLabel?: string;
  nextLabel?: string;
  /** Slides do not wrap by default, which makes the start and end of a set explicit. */
  loop?: boolean;
  initialIndex?: number;
  showControls?: boolean;
  showDots?: boolean;
  onIndexChange?: (index: number) => void;
};

type PointerStart = {
  id: number;
  x: number;
  y: number;
};

const visuallyHidden: CSSProperties = {
  border: 0,
  clip: "rect(0 0 0 0)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: "1px",
};

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function getSlideScrollLeft(viewport: HTMLElement, slide: HTMLElement) {
  return slide.getBoundingClientRect().left - viewport.getBoundingClientRect().left + viewport.scrollLeft;
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
}

/**
 * A small, CSS-scroll-snap carousel. It deliberately has no autoplay or external
 * dependency, so each use can be styled for its own editorial context.
 */
export function Carousel({
  ariaLabel,
  children,
  className,
  viewportClassName,
  trackClassName,
  slideClassName,
  controlsClassName,
  dotsClassName,
  previousLabel = "Previous slide",
  nextLabel = "Next slide",
  loop = false,
  initialIndex = 0,
  showControls = true,
  showDots = true,
  onIndexChange,
}: CarouselProps) {
  const slides = useMemo(() => Children.toArray(children), [children]);
  const [activeIndex, setActiveIndex] = useState(() => Math.min(Math.max(initialIndex, 0), Math.max(slides.length - 1, 0)));
  const prefersReducedMotion = usePrefersReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const pointerStartRef = useRef<PointerStart | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const onIndexChangeRef = useRef(onIndexChange);
  const hasReportedInitialIndexRef = useRef(false);
  const viewportId = useId();

  const setCurrentIndex = useCallback((nextIndex: number) => {
    setActiveIndex((currentIndex) => currentIndex === nextIndex ? currentIndex : nextIndex);
  }, []);

  useEffect(() => {
    onIndexChangeRef.current = onIndexChange;
  }, [onIndexChange]);

  useEffect(() => {
    if (!hasReportedInitialIndexRef.current) {
      hasReportedInitialIndexRef.current = true;
      return;
    }
    onIndexChangeRef.current?.(activeIndex);
  }, [activeIndex]);

  const normalizeIndex = useCallback((index: number) => {
    if (slides.length === 0) return 0;
    if (loop) return (index + slides.length) % slides.length;
    return Math.min(Math.max(index, 0), slides.length - 1);
  }, [loop, slides.length]);

  const scrollToIndex = useCallback((index: number, shouldFocus = false) => {
    const viewport = viewportRef.current;
    if (!viewport || slides.length === 0) return;

    const nextIndex = normalizeIndex(index);
    const slide = viewport.querySelector<HTMLElement>(`[data-carousel-slide-index="${nextIndex}"]`);
    if (!slide) return;

    viewport.scrollTo({
      left: getSlideScrollLeft(viewport, slide),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
    setCurrentIndex(nextIndex);

    if (shouldFocus) viewport.focus({ preventScroll: true });
  }, [normalizeIndex, prefersReducedMotion, setCurrentIndex, slides.length]);

  const getNearestIndex = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return 0;

    const slidesInViewport = Array.from(viewport.querySelectorAll<HTMLElement>("[data-carousel-slide-index]"));
    const viewportCenter = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const slide of slidesInViewport) {
      const slideBounds = slide.getBoundingClientRect();
      const slideCenter = slideBounds.left + slideBounds.width / 2;
      const distance = Math.abs(slideCenter - viewportCenter);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = Number(slide.dataset.carouselSlideIndex ?? 0);
      }
    }

    return nearestIndex;
  }, []);

  const handleScroll = useCallback(() => {
    if (animationFrameRef.current !== null) return;
    animationFrameRef.current = window.requestAnimationFrame(() => {
      animationFrameRef.current = null;
      setCurrentIndex(getNearestIndex());
    });
  }, [getNearestIndex, setCurrentIndex]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (slides.length < 2) return;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToIndex(activeIndex + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToIndex(activeIndex - 1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      scrollToIndex(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      scrollToIndex(slides.length - 1);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary) return;
    pointerStartRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const pointerStart = pointerStartRef.current;
    pointerStartRef.current = null;
    if (!pointerStart || pointerStart.id !== event.pointerId || slides.length < 2) return;

    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    const hasHorizontalIntent = Math.abs(deltaX) > Math.abs(deltaY);

    if (!hasHorizontalIntent || Math.abs(deltaX) < 42) return;
    scrollToIndex(activeIndex + (deltaX < 0 ? 1 : -1));
  };

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || typeof ResizeObserver === "undefined") return;

    const resizeObserver = new ResizeObserver(() => {
      const currentSlide = viewport.querySelector<HTMLElement>(`[data-carousel-slide-index="${activeIndex}"]`);
      if (!currentSlide) return;
      viewport.scrollTo({ left: getSlideScrollLeft(viewport, currentSlide), behavior: "auto" });
    });
    resizeObserver.observe(viewport);

    return () => {
      resizeObserver.disconnect();
      if (animationFrameRef.current !== null) window.cancelAnimationFrame(animationFrameRef.current);
    };
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex <= slides.length - 1) return;
    setCurrentIndex(Math.max(slides.length - 1, 0));
  }, [activeIndex, setCurrentIndex, slides.length]);

  const atStart = activeIndex === 0;
  const atEnd = activeIndex === slides.length - 1;
  const canNavigate = slides.length > 1;

  return (
    <section className={joinClassNames(styles.root, "carousel", className)} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div
        className={joinClassNames(styles.viewport, "carousel-viewport", viewportClassName)}
        id={viewportId}
        ref={viewportRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { pointerStartRef.current = null; }}
        style={{ touchAction: "pan-y" }}
      >
        <div className={joinClassNames(styles.track, "carousel-track", trackClassName)}>
          {slides.map((slide, index) => (
            <div
              aria-label={`${index + 1} of ${slides.length}`}
              aria-roledescription="slide"
              aria-current={index === activeIndex ? "true" : undefined}
              className={joinClassNames(styles.slide, "carousel-slide", slideClassName)}
              data-carousel-slide-index={index}
              key={(slide as { key?: string | null }).key ?? index}
              role="group"
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {canNavigate && showControls ? (
        <div className={joinClassNames(styles.controls, "carousel-controls", controlsClassName)}>
          <button
            aria-controls={viewportId}
            aria-label={previousLabel}
            className="carousel-control carousel-control-previous"
            disabled={!loop && atStart}
            onClick={() => scrollToIndex(activeIndex - 1, true)}
            type="button"
          >
            <span aria-hidden="true">{"\u2190"}</span>
          </button>
          <button
            aria-controls={viewportId}
            aria-label={nextLabel}
            className="carousel-control carousel-control-next"
            disabled={!loop && atEnd}
            onClick={() => scrollToIndex(activeIndex + 1, true)}
            type="button"
          >
            <span aria-hidden="true">{"\u2192"}</span>
          </button>
        </div>
      ) : null}

      {canNavigate && showDots ? (
        <div className={joinClassNames(styles.dots, "carousel-dots", dotsClassName)} aria-label={`${ariaLabel} pagination`}>
          {slides.map((slide, index) => (
            <button
              aria-controls={viewportId}
              aria-current={index === activeIndex ? "true" : undefined}
              aria-label={`Go to slide ${index + 1} of ${slides.length}`}
              className={joinClassNames(styles.dot, "carousel-dot", index === activeIndex ? "is-active" : undefined)}
              key={(slide as { key?: string | null }).key ?? index}
              onClick={() => scrollToIndex(index, true)}
              type="button"
            >
              <span aria-hidden="true" />
            </button>
          ))}
        </div>
      ) : null}

      <p aria-atomic="true" aria-live="polite" style={visuallyHidden}>
        {slides.length > 0 ? `Slide ${activeIndex + 1} of ${slides.length}` : "No slides"}
      </p>
    </section>
  );
}
