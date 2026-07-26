"use client";

import Image from "next/image";
import { InlineCarousel } from "@/components/InlineCarousel";

const projects = [
  {
    src: "/portfolio/above-fireplace-02.webp",
    alt: "Television mounted above a stone fireplace",
    position: "center",
  },
  {
    src: "/portfolio/tv-mounting-08.webp",
    alt: "Television mounted above a fireplace in a bright living room",
    position: "center",
  },
  {
    src: "/portfolio/wire-concealment-15.webp",
    alt: "Wall-mounted television with a soundbar and clean cable routing",
    position: "center",
  },
  {
    src: "/portfolio/tv-mounting-07.webp",
    alt: "Large wall-mounted television in a finished room",
    position: "center",
  },
  {
    src: "/portfolio/tv-mounting-11.webp",
    alt: "Wall-mounted television in a high-rise living space",
    position: "center",
  },
] as const;

export function ProjectCarousel() {
  return (
    <section className="project-section section" id="work" aria-labelledby="recent-work-heading">
      <div className="container">
        <div className="section-heading section-heading-compact">
          <div>
            <p className="eyebrow">RECENT WORK</p>
            <h2 id="recent-work-heading">Recent installations.</h2>
          </div>
          <p>Real Apex projects completed across Los Angeles and surrounding areas.</p>
        </div>
        <InlineCarousel
          ariaLabel="Recent Apex installation projects"
          className="project-carousel"
          nextLabel="Show next project"
          previousLabel="Show previous project"
          slideClassName="project-carousel-slide"
        >
          {projects.map((project) => (
            <figure className="project-carousel-card" key={project.src}>
              <Image
                alt={project.alt}
                fill
                loading="lazy"
                sizes="(max-width: 719px) 82vw, (max-width: 1049px) 45vw, 31vw"
                src={project.src}
                style={{ objectFit: "cover", objectPosition: project.position }}
              />
            </figure>
          ))}
        </InlineCarousel>
        <button
          className="text-link project-all-link"
          type="button"
          onClick={() => {
            const portfolio = document.getElementById("full-portfolio");
            if (portfolio instanceof HTMLDetailsElement) portfolio.open = true;
            portfolio?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
          }}
        >
          View all work <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
