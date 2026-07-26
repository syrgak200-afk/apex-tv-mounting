"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const categories = ["All", "TV Mounting", "Above Fireplace", "Wire Concealment"] as const;

const projects = [
  ...Array.from({ length: 10 }, (_, index) => ({ category: "TV Mounting", image: `/portfolio/tv-mounting-${String(index + 4).padStart(2, "0")}.webp`, title: `TV mounting installation ${index + 1}`, alt: `Completed wall-mounted television installation, project ${index + 1}` })),
  ...Array.from({ length: 3 }, (_, index) => ({ category: "Above Fireplace", image: `/portfolio/above-fireplace-${String(index + 1).padStart(2, "0")}.webp`, title: `Fireplace TV installation ${index + 1}`, alt: `Completed television installation above a fireplace, project ${index + 1}` })),
  ...Array.from({ length: 5 }, (_, index) => ({ category: "Wire Concealment", image: `/portfolio/wire-concealment-${String(index + 14).padStart(2, "0")}.webp`, title: `Clean cable finish ${index + 1}`, alt: `Wall-mounted television installation with cable concealment, project ${index + 1}` })),
] as const;

export function ProjectGallery() {
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const visibleProjects = useMemo(() => selectedCategory === "All" ? projects : projects.filter((project) => project.category === selectedCategory), [selectedCategory]);
  const activeProject = activeIndex === null ? null : visibleProjects[activeIndex];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") setActiveIndex((current) => current === null ? current : (current + 1) % visibleProjects.length);
      if (event.key === "ArrowLeft") setActiveIndex((current) => current === null ? current : (current - 1 + visibleProjects.length) % visibleProjects.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visibleProjects.length]);

  return <section className="section container gallery-section" id="gallery" aria-labelledby="gallery-heading">
    <div className="section-heading gallery-heading"><div><p className="eyebrow eyebrow-dark">INSTALLATION PORTFOLIO</p><h2 id="gallery-heading">Real installs, finished <em>with intention.</em></h2></div><p>Explore every supplied Apex TV Mounting project photo—organized by the installation detail that matters most.</p></div>
    <div className="gallery-filters" aria-label="Filter installation portfolio">{categories.map((category) => <button type="button" key={category} className={selectedCategory === category ? "is-active" : ""} onClick={() => { setSelectedCategory(category); setActiveIndex(null); }}>{category}</button>)}</div>
    <div className="project-masonry" aria-live="polite">{visibleProjects.map((project, index) => <button type="button" className="project-card" key={project.image} onClick={() => setActiveIndex(index)} aria-label={`Open ${project.category}: ${project.title}`}><Image src={project.image} alt={project.alt} width={960} height={1280} sizes="(max-width: 719px) 100vw, (max-width: 1050px) 50vw, 33vw" loading="lazy" quality={76} /><span className="project-card-overlay"><small>{project.category}</small><strong>{project.title}</strong></span></button>)}</div>
    {activeProject && <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={`${activeProject.category} installation image`} onMouseDown={() => setActiveIndex(null)}><div className="lightbox-content" onMouseDown={(event) => event.stopPropagation()}><button type="button" className="lightbox-close" onClick={() => setActiveIndex(null)} aria-label="Close image">×</button><Image src={activeProject.image} alt={activeProject.alt} width={960} height={1280} sizes="92vw" priority quality={82} /><div><small>{activeProject.category}</small><strong>{activeProject.title}</strong></div></div></div>}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "ImageGallery", name: "Apex TV Mounting Installation Portfolio", image: projects.map((project) => ({ "@type": "ImageObject", contentUrl: `https://www.apex-tv-mounting.com${project.image}`, description: project.alt })) }) }} />
  </section>;
}
