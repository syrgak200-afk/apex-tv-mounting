"use client";

import Image from "next/image";
import { Carousel } from "@/components/Carousel";

const projects = [
  { src: "/portfolio/above-fireplace-02.webp", alt: "Television mounted above a stone fireplace" },
  { src: "/portfolio/tv-mounting-09.webp", alt: "Television and soundbar installation" },
  { src: "/portfolio/above-fireplace-03.webp", alt: "Television mounted above a fireplace" },
  { src: "/portfolio/tv-mounting-05.webp", alt: "Completed wall-mounted television installation" },
  { src: "/portfolio/wire-concealment-15.webp", alt: "Completed television installation with cable routing" },
];

export function FeaturedWorkCarousel() {
  return <section className="featured-work section" id="gallery" aria-labelledby="featured-work-heading"><div className="container"><div className="featured-work-heading"><div><p className="eyebrow eyebrow-dark">FEATURED WORK</p><h2 id="featured-work-heading">A considered finish, <em>room by room.</em></h2></div><a href="#full-portfolio" className="text-link">View all projects <span aria-hidden="true">→</span></a></div><Carousel ariaLabel="Featured Apex installation projects" className="featured-carousel" viewportClassName="featured-carousel-viewport" trackClassName="featured-carousel-track" slideClassName="featured-carousel-slide" controlsClassName="featured-carousel-controls" dotsClassName="featured-carousel-dots" previousLabel="Show previous featured project" nextLabel="Show next featured project">{projects.map((project,index)=><button type="button" key={project.src} className="featured-work-card" aria-label={`Open featured project ${index+1}`} onClick={() => document.getElementById("full-portfolio")?.scrollIntoView({behavior:"smooth"})}><Image src={project.src} alt={project.alt} fill sizes="(max-width: 719px) 82vw, (max-width: 1050px) 45vw, 31vw" loading={index === 0 ? "eager" : "lazy"} style={{objectFit:"cover"}} /></button>)}</Carousel></div></section>;
}
