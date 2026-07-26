"use client";

import Image from "next/image";
import { useState } from "react";

const reviewScreenshots = [
  { image: "/reviews/facebook-marketplace-01.webp", alt: "Facebook Marketplace review screenshot featuring Hilary, Jordan, and Teresa" },
  { image: "/reviews/facebook-marketplace-02.webp", alt: "Facebook Marketplace review screenshot featuring Emily, Kristopher, and Albert" },
  { image: "/reviews/facebook-marketplace-03.webp", alt: "Facebook Marketplace review screenshot featuring Bing, Andrew, and Nima" },
  { image: "/reviews/facebook-marketplace-04.webp", alt: "Facebook Marketplace review screenshot featuring Ilse, JoJo, and Emani" },
  { image: "/reviews/facebook-marketplace-05.webp", alt: "Facebook Marketplace review screenshot featuring Victor, Imu, and Youssef" },
  { image: "/reviews/facebook-marketplace-06.webp", alt: "Facebook Marketplace review screenshot featuring Kian, Will, and Joyce" },
  { image: "/reviews/facebook-marketplace-07.webp", alt: "Facebook Marketplace review screenshot featuring Nautica, Essie, and John" },
  { image: "/reviews/facebook-marketplace-08.webp", alt: "Facebook Marketplace review screenshot featuring Yesenia, Carmen, and Shaun" },
  { image: "/reviews/facebook-marketplace-09.webp", alt: "Facebook Marketplace review screenshot featuring Cory, Brenda, and Sergio" },
] as const;

const readableReviews = [
  ["Excellent service — professional, courteous and a job well done!", "Jordan"],
  ["Fast and very nice service! Thank you so much!", "JoJo"],
  ["Very fast n clean work for the price. Did both my living room n bedroom tv wall mount. Highly recommend.", "Victor"],
  ["He was amazing and super fast!! A total professional!", "Ilse"],
  ["Syrgak did an incredible and fast job, great communication!", "Carmen"],
  ["Well done! Took tops 15 minutes! Super friendly and efficient!", "Shaun"],
] as const;

export function ReviewsSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeReview = activeIndex === null ? null : reviewScreenshots[activeIndex];

  return <section className="review-section" id="reviews" aria-labelledby="reviews-heading"><div className="container">
    <div className="review-intro"><div><p className="eyebrow eyebrow-dark">CUSTOMER FEEDBACK</p><h2 id="reviews-heading">Feedback from real <em>customers.</em></h2></div><p>Readable excerpts below are transcribed from the original Facebook Marketplace review screenshots. Open any screenshot to view the original.</p></div>
    <div className="review-quotes">{readableReviews.map(([quote, author]) => <figure key={author}><blockquote>“{quote}”</blockquote><figcaption>— {author}, Facebook Marketplace</figcaption></figure>)}</div>
    <div className="review-proof" aria-label="Original customer review screenshots">{reviewScreenshots.map((review, index) => <button type="button" key={review.image} className="review-screenshot" onClick={() => setActiveIndex(index)} aria-label={`Open original review screenshot ${index + 1}`}><Image src={review.image} alt={review.alt} width={855} height={1280} sizes="(max-width: 719px) 46vw, (max-width: 1050px) 30vw, 220px" loading="lazy" quality={76} /></button>)}</div>
    {activeReview && <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Original customer review screenshot" onMouseDown={() => setActiveIndex(null)}><div className="lightbox-content review-lightbox-content" onMouseDown={(event) => event.stopPropagation()}><button type="button" className="lightbox-close" onClick={() => setActiveIndex(null)} aria-label="Close review image">×</button><Image src={activeReview.image} alt={activeReview.alt} width={855} height={1280} sizes="92vw" priority quality={84} /><div><small>ORIGINAL REVIEW SCREENSHOT</small></div></div></div>}
  </div></section>;
}
