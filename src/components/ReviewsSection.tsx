"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { InlineCarousel } from "@/components/InlineCarousel";

type Review = {
  author: string;
  excerpt: string;
  image: string;
  height: number;
  width: number;
};

// Each excerpt below was manually checked against its matching supplied
// Marketplace crop. No review copy, name, rating, location, or date is added.
const reviews: readonly Review[] = [
  { author: "Jordan", excerpt: "Excellent service - professional, courteous and a job well done", image: "/reviews/cropped/02-jordan.webp", width: 850, height: 400 },
  { author: "JoJo", excerpt: "Fast and very nice service! Thank you so much!", image: "/reviews/cropped/05-jojo.webp", width: 850, height: 386 },
  { author: "Victor", excerpt: "Very fast n clean work for the price. Did both my living room n bedroom tv wall mount. Highly recommend.", image: "/reviews/cropped/04-victor.webp", width: 800, height: 457 },
  { author: "Ilse", excerpt: "He was amazing and super fast!! A total professional!", image: "/reviews/cropped/04-ilse.webp", width: 800, height: 394 },
  { author: "Carmen", excerpt: "Syrgak did an incredible and fast job, great communication!", image: "/reviews/cropped/08-carmen.webp", width: 830, height: 426 },
  { author: "Shaun", excerpt: "Well done! Took tops 15 minutes! Super friendly and efficient!", image: "/reviews/cropped/09-shaun.webp", width: 830, height: 379 },
];

export function ReviewsSection() {
  const [openReview, setOpenReview] = useState<Review | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!openReview) triggerRef.current?.focus();
  }, [openReview]);

  return (
    <section className="review-section section" id="reviews" aria-labelledby="reviews-heading">
      <div className="container">
        <div className="section-heading section-heading-compact">
          <div>
            <p className="eyebrow">CUSTOMER REVIEWS</p>
            <h2 id="reviews-heading">What customers say.</h2>
          </div>
          <p>Each excerpt is paired with its original Facebook Marketplace review.</p>
        </div>
        <InlineCarousel
          ariaLabel="Customer review excerpts"
          className="reviews-carousel"
          nextLabel="Show next customer review"
          previousLabel="Show previous customer review"
          slideClassName="review-carousel-slide"
        >
          {reviews.map((review) => (
            <figure className="review-card" key={review.author}>
              <blockquote>“{review.excerpt}”</blockquote>
              <figcaption>
                <strong>{review.author}</strong>
                <span>Facebook Marketplace</span>
              </figcaption>
              <button
                className="review-original-button"
                onClick={(event) => {
                  triggerRef.current = event.currentTarget;
                  setOpenReview(review);
                }}
                type="button"
              >
                View original <span className="sr-only">review from {review.author}</span><span aria-hidden="true">→</span>
              </button>
            </figure>
          ))}
        </InlineCarousel>
      </div>
      {openReview ? (
        <div
          className="gallery-lightbox review-lightbox"
          role="dialog"
          aria-label={`Original Facebook Marketplace review from ${openReview.author}`}
          aria-modal="true"
          onMouseDown={() => setOpenReview(null)}
        >
          <div className="lightbox-content review-lightbox-content" onMouseDown={(event) => event.stopPropagation()}>
            <button className="lightbox-close" type="button" onClick={() => setOpenReview(null)} aria-label="Close original review">
              <span aria-hidden="true">×</span>
            </button>
            <Image
              alt={`Original Facebook Marketplace review from ${openReview.author}`}
              height={openReview.height}
              priority
              sizes="(max-width: 719px) 92vw, 720px"
              src={openReview.image}
              width={openReview.width}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
