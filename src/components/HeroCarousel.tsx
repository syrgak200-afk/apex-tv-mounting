"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Carousel } from "@/components/Carousel";

const images = [
  { src: "/portfolio/above-fireplace-02.webp", alt: "Apex television installation above a stone fireplace", position: "center" },
  { src: "/portfolio/tv-mounting-09.webp", alt: "Apex television and soundbar installation in a living room", position: "center" },
  { src: "/portfolio/above-fireplace-03.webp", alt: "Apex television installation above a fireplace", position: "center" },
];

export function HeroCarousel() {
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => {
    // Phones retain the static, server-rendered LCP image. The carousel is a
    // desktop/tablet enhancement only, so it cannot replace the mobile LCP.
    if (!window.matchMedia("(min-width: 720px)").matches) return;

    const enable = () => setEnhanced(true);
    const timer = window.setTimeout(enable, 1800);
    const idle = typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(enable, { timeout: 3500 }) : null;
    window.addEventListener("pointerdown", enable, { once: true, passive: true });
    window.addEventListener("keydown", enable, { once: true });
    return () => { window.clearTimeout(timer); if (idle !== null && typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle); window.removeEventListener("pointerdown", enable); window.removeEventListener("keydown", enable); };
  }, []);
  const first = images[0];
  if (!enhanced) return <div className="hero-static"><Image src={first.src} alt={first.alt} fill priority fetchPriority="high" loading="eager" sizes="(max-width: 719px) calc(100vw - 40px), (max-width: 1050px) 48vw, 54vw" style={{ objectFit: "cover", objectPosition: "center 45%" }} /></div>;
  return <Carousel ariaLabel="Selected Apex installations" className="hero-carousel" viewportClassName="hero-carousel-viewport" trackClassName="hero-carousel-track" slideClassName="hero-carousel-slide" controlsClassName="hero-carousel-controls" dotsClassName="hero-carousel-dots" previousLabel="Show previous installation" nextLabel="Show next installation">
    {images.map((image, index) => <figure key={image.src}><Image src={image.src} alt={image.alt} fill priority={index === 0} fetchPriority={index === 0 ? "high" : "auto"} loading={index === 0 ? "eager" : "lazy"} sizes="(max-width: 719px) calc(100vw - 40px), (max-width: 1050px) 48vw, 54vw" style={{ objectFit: "cover", objectPosition: index === 0 ? "center 45%" : image.position }} /></figure>)}
  </Carousel>;
}
