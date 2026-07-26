"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Carousel } from "@/components/Carousel";

type Review = {
  id: string;
  author: string;
  excerpt: string;
  image: string;
  width: number;
  height: number;
};

// These excerpts were read directly from the supplied Facebook Marketplace
// screenshots. The cropped image shown from "View original" is the source for
// each quote; no review copy, names, or ratings have been generated.
const featuredReviews: readonly Review[] = [
  {
    id: "jordan",
    author: "Jordan",
    excerpt: "Excellent service - professional, courteous and a job well done",
    image: "/reviews/cropped/02-jordan.webp",
    width: 850,
    height: 400,
  },
  {
    id: "jojo",
    author: "JoJo",
    excerpt: "Fast and very nice service! Thank you so much!",
    image: "/reviews/cropped/05-jojo.webp",
    width: 850,
    height: 386,
  },
  {
    id: "victor",
    author: "Victor",
    excerpt:
      "Very fast n clean work for the price. Did both my living room n bedroom tv wall mount. Highly recommend.",
    image: "/reviews/cropped/04-victor.webp",
    width: 800,
    height: 457,
  },
  {
    id: "ilse",
    author: "Ilse",
    excerpt: "He was amazing and super fast!! A total professional!",
    image: "/reviews/cropped/04-ilse.webp",
    width: 800,
    height: 394,
  },
  {
    id: "carmen",
    author: "Carmen",
    excerpt: "Syrgak did an incredible and fast job, great communication!",
    image: "/reviews/cropped/08-carmen.webp",
    width: 830,
    height: 426,
  },
  {
    id: "shaun",
    author: "Shaun",
    excerpt: "Well done ! Took tops 15 minutes! Super friendly and efficient!",
    image: "/reviews/cropped/09-shaun.webp",
    width: 830,
    height: 379,
  },
];

function ReviewOriginal({ review, onClose }: { review: Review; onClose: () => void }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div
      className="gallery-lightbox review-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Original Facebook Marketplace review from ${review.author}`}
      onMouseDown={onClose}
    >
      <div
        className="lightbox-content review-lightbox-content"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="lightbox-close"
          onClick={onClose}
          aria-label="Close original review"
          autoFocus
        >
          <span aria-hidden="true">×</span>
        </button>
        <Image
          src={review.image}
          alt={`Original Facebook Marketplace review from ${review.author}`}
          width={review.width}
          height={review.height}
          sizes="92vw"
          priority
          quality={86}
        />
        <div>
          <small>ORIGINAL REVIEW</small>
          <strong>{review.author} · Facebook Marketplace</strong>
        </div>
      </div>
    </div>
  );
}

/**
 * A small, no-autoplay review carousel using the shared native scroll-snap
 * carousel. It keeps the written excerpt primary and the untouched Marketplace
 * crop available as source evidence.
 */
export function ReviewsSection() {
  const [activeReview, setActiveReview] = useState<Review | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const hadOpenReviewRef = useRef(false);

  useEffect(() => {
    if (activeReview) {
      hadOpenReviewRef.current = true;
      return;
    }

    if (hadOpenReviewRef.current) {
      lastTriggerRef.current?.focus();
      hadOpenReviewRef.current = false;
    }
  }, [activeReview]);

  const openReview = (review: Review, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger;
    setActiveReview(review);
  };

  return (
    <section className="review-section" id="reviews" aria-labelledby="reviews-heading">
      <div className="container">
        <div className="review-intro">
          <div>
            <p className="eyebrow eyebrow-dark">CUSTOMER FEEDBACK</p>
            <h2 id="reviews-heading">
              Feedback from real <em>customers.</em>
            </h2>
          </div>
          <p>
            Read the original Facebook Marketplace review behind every excerpt.
          </p>
        </div>

        <Carousel
          ariaLabel="Customer review excerpts"
          className="reviews-carousel"
          viewportClassName="reviews-carousel-viewport"
          trackClassName="reviews-carousel-track"
          slideClassName="reviews-carousel-slide"
          controlsClassName="reviews-carousel-controls"
          dotsClassName="reviews-carousel-dots"
          previousLabel="Show previous customer review"
          nextLabel="Show next customer review"
        >
          {featuredReviews.map((review) => (
            <figure className="review-card" key={review.id}>
              <blockquote>{`“${review.excerpt}”`}</blockquote>
              <figcaption>
                <span>{review.author}</span>
                <span>Facebook Marketplace</span>
              </figcaption>
              <button
                type="button"
                className="review-original-link"
                onClick={(event) => openReview(review, event.currentTarget)}
              >
                View original <span className="sr-only">review from {review.author}</span><span aria-hidden="true">→</span>
              </button>
            </figure>
          ))}
        </Carousel>
      </div>

      {activeReview ? (
        <ReviewOriginal review={activeReview} onClose={() => setActiveReview(null)} />
      ) : null}
    </section>
  );
}
