"use client";

import {
  Children,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./InlineCarousel.module.css";

type InlineCarouselProps = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  slideClassName?: string;
  previousLabel: string;
  nextLabel: string;
};

function classNames(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function InlineCarousel({
  ariaLabel,
  children,
  className,
  slideClassName,
  previousLabel,
  nextLabel,
}: InlineCarouselProps) {
  const slides = useMemo(() => Children.toArray(children), [children]);
  const [activeIndex, setActiveIndex] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const viewportId = useId();
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reducedMotionRef.current = query.matches;
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const scrollToIndex = useCallback((index: number, focusViewport = false) => {
    const viewport = viewportRef.current;
    if (!viewport || slides.length === 0) return;

    const nextIndex = Math.min(Math.max(index, 0), slides.length - 1);
    const slide = viewport.querySelector<HTMLElement>(`[data-slide-index="${nextIndex}"]`);
    if (!slide) return;

    viewport.scrollTo({
      left: slide.offsetLeft - viewport.offsetLeft,
      behavior: reducedMotionRef.current ? "auto" : "smooth",
    });
    setActiveIndex(nextIndex);
    if (focusViewport) viewport.focus({ preventScroll: true });
  }, [slides.length]);

  const updateActiveSlide = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const center = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
    const closest = Array.from(viewport.querySelectorAll<HTMLElement>("[data-slide-index]")).reduce(
      (best, slide) => {
        const bounds = slide.getBoundingClientRect();
        const distance = Math.abs(bounds.left + bounds.width / 2 - center);
        return distance < best.distance ? { distance, index: Number(slide.dataset.slideIndex) } : best;
      },
      { distance: Number.POSITIVE_INFINITY, index: 0 },
    );
    setActiveIndex(closest.index);
  }, []);

  const onScroll = () => {
    if (frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      updateActiveSlide();
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToIndex(activeIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToIndex(activeIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      scrollToIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      scrollToIndex(slides.length - 1);
    }
  };

  useEffect(() => () => {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
  }, []);

  const canNavigate = slides.length > 1;

  return (
    <section className={classNames(styles.root, className)} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div
        className={styles.viewport}
        id={viewportId}
        onKeyDown={onKeyDown}
        onScroll={onScroll}
        ref={viewportRef}
        tabIndex={0}
      >
        <div className={styles.track}>
          {slides.map((slide, index) => (
            <div
              aria-label={`${index + 1} of ${slides.length}`}
              aria-roledescription="slide"
              aria-current={index === activeIndex ? "true" : undefined}
              className={classNames(styles.slide, slideClassName)}
              data-slide-index={index}
              key={(slide as { key?: string | null }).key ?? index}
              role="group"
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {canNavigate ? (
        <div className={styles.footer}>
          <div className={styles.controls}>
            <button
              aria-controls={viewportId}
              aria-label={previousLabel}
              disabled={activeIndex === 0}
              onClick={() => scrollToIndex(activeIndex - 1, true)}
              type="button"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              aria-controls={viewportId}
              aria-label={nextLabel}
              disabled={activeIndex === slides.length - 1}
              onClick={() => scrollToIndex(activeIndex + 1, true)}
              type="button"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
          <div aria-label={`${ariaLabel} pagination`} className={styles.dots}>
            {slides.map((slide, index) => (
              <button
                aria-controls={viewportId}
                aria-current={index === activeIndex ? "true" : undefined}
                aria-label={`Go to slide ${index + 1} of ${slides.length}`}
                className={styles.dot}
                key={(slide as { key?: string | null }).key ?? index}
                onClick={() => scrollToIndex(index, true)}
                type="button"
              >
                <span aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
