"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const categories = ["All", "TV Mounting", "Above Fireplace", "Wire Concealment"] as const;

const projects = [
  ...Array.from({ length: 10 }, (_, index) => ({ category: "TV Mounting", image: `/portfolio/tv-mounting-${String(index + 4).padStart(2, "0")}.webp`, alt: `Completed wall-mounted television installation ${index + 1}` })),
  ...Array.from({ length: 3 }, (_, index) => ({ category: "Above Fireplace", image: `/portfolio/above-fireplace-${String(index + 1).padStart(2, "0")}.webp`, alt: `Completed television installation above a fireplace ${index + 1}` })),
  ...Array.from({ length: 5 }, (_, index) => ({ category: "Wire Concealment", image: `/portfolio/wire-concealment-${String(index + 14).padStart(2, "0")}.webp`, alt: `Wall-mounted television installation with cable concealment ${index + 1}` })),
] as const;

export function ProjectGallery() {
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const visibleProjects = useMemo(
    () => selectedCategory === "All" ? projects : projects.filter((project) => project.category === selectedCategory),
    [selectedCategory],
  );
  const activeProject = activeIndex === null ? null : visibleProjects[activeIndex];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (activeIndex === null) return;
      if (event.key === "ArrowRight") setActiveIndex((current) => current === null ? current : (current + 1) % visibleProjects.length);
      if (event.key === "ArrowLeft") setActiveIndex((current) => current === null ? current : (current - 1 + visibleProjects.length) % visibleProjects.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, visibleProjects.length]);

  return (
    <section className="section container gallery-section" id="gallery" aria-labelledby="gallery-heading">
      <div className="section-heading gallery-heading">
        <div>
          <p className="eyebrow">FULL PORTFOLIO</p>
          <h2 id="gallery-heading">More completed work.</h2>
        </div>
        <p>Browse all available Apex project photos by installation type.</p>
      </div>
      <div className="gallery-filters" aria-label="Filter installation portfolio">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={selectedCategory === category ? "is-active" : ""}
            onClick={() => {
              setSelectedCategory(category);
              setActiveIndex(null);
            }}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="project-masonry" aria-live="polite">
        {visibleProjects.map((project, index) => (
          <button
            type="button"
            className="project-card"
            key={project.image}
            onClick={() => setActiveIndex(index)}
            aria-label={`Open ${project.category} image ${index + 1}`}
          >
            <Image src={project.image} alt={project.alt} width={960} height={1280} sizes="(max-width: 719px) 100vw, (max-width: 1050px) 50vw, 33vw" loading="lazy" quality={76} />
          </button>
        ))}
      </div>
      {activeProject ? (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={`${activeProject.category} installation image`} onMouseDown={() => setActiveIndex(null)}>
          <div className="lightbox-content" onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className="lightbox-close" onClick={() => setActiveIndex(null)} aria-label="Close image">×</button>
            <Image src={activeProject.image} alt={activeProject.alt} width={960} height={1280} sizes="92vw" priority quality={82} />
            <div><small>{activeProject.category}</small></div>
          </div>
        </div>
      ) : null}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "ImageGallery", name: "Apex TV Mounting Installation Portfolio", image: projects.map((project) => ({ "@type": "ImageObject", contentUrl: `https://www.apex-tv-mounting.com${project.image}`, description: project.alt })) }) }} />
    </section>
  );
}
