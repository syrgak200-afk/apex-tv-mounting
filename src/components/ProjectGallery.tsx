"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const categories = ["All", "TV Mounting", "Above Fireplace", "Frame TV", "Wire Concealment", "Soundbar Installation", "Commercial Projects"] as const;
const projects = [
  { title: "Living room media wall", category: "TV Mounting", image: "/gallery/tv-mounting.webp", alt: "Wall-mounted television above a warm wood media console with fully concealed cables", width: 1600, height: 1067 },
  { title: "Stone fireplace installation", category: "Above Fireplace", image: "/gallery/frame-tv-fireplace.webp", alt: "Framed art television professionally mounted above a modern stone fireplace", width: 1067, height: 1600 },
  { title: "Gallery-mode display", category: "Frame TV", image: "/gallery/frame-tv-fireplace.webp", alt: "Frame-style television displaying landscape art on a textured stone feature wall", width: 1067, height: 1600 },
  { title: "Clean cable finish", category: "Wire Concealment", image: "/gallery/tv-mounting.webp", alt: "Minimal living room television installation with no visible cables", width: 1600, height: 1067 },
  { title: "Office lounge soundbar", category: "Soundbar Installation", image: "/gallery/commercial-soundbar.webp", alt: "Wall-mounted commercial display with a centered soundbar in a modern office lounge", width: 1600, height: 1067 },
  { title: "Commercial presentation wall", category: "Commercial Projects", image: "/gallery/commercial-soundbar.webp", alt: "Professional office lounge display installation on a wood-paneled commercial wall", width: 1600, height: 1067 },
] as const;

export function ProjectGallery() {
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const visibleProjects = selectedCategory === "All" ? projects : projects.filter((project) => project.category === selectedCategory);
  const activeProject = activeIndex === null ? null : visibleProjects[activeIndex];
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (activeIndex !== null && event.key === "ArrowRight") setActiveIndex((activeIndex + 1) % visibleProjects.length);
      if (activeIndex !== null && event.key === "ArrowLeft") setActiveIndex((activeIndex - 1 + visibleProjects.length) % visibleProjects.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, visibleProjects.length]);
  return <section className="section container gallery-section" id="gallery" aria-labelledby="gallery-heading"><div className="section-heading gallery-heading"><div><p className="eyebrow eyebrow-dark">INSTALLATION PORTFOLIO</p><h2 id="gallery-heading">Details that belong <em>in the picture.</em></h2></div><p>Explore a selection of considered TV, sound, and cable-management installations designed for the way each space is used.</p></div><div className="gallery-filters" aria-label="Filter installation portfolio">{categories.map((category) => <button type="button" key={category} className={selectedCategory === category ? "is-active" : ""} onClick={() => { setSelectedCategory(category); setActiveIndex(null); }}>{category}</button>)}</div><div className="project-masonry" aria-live="polite">{visibleProjects.map((project, index) => <button type="button" className="project-card" key={project.category} onClick={() => setActiveIndex(index)} aria-label={`Open ${project.category}: ${project.title}`}><Image src={project.image} alt={project.alt} width={project.width} height={project.height} sizes="(max-width: 719px) 100vw, (max-width: 1050px) 50vw, 33vw" loading="lazy" quality={78} /><span className="project-card-overlay"><small>{project.category}</small><strong>{project.title}</strong></span></button>)}</div>{activeProject && <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={`${activeProject.category} installation image`} onMouseDown={() => setActiveIndex(null)}><div className="lightbox-content" onMouseDown={(event) => event.stopPropagation()}><button type="button" className="lightbox-close" onClick={() => setActiveIndex(null)} aria-label="Close image">×</button><Image src={activeProject.image} alt={activeProject.alt} width={activeProject.width} height={activeProject.height} sizes="92vw" priority quality={85} /><div><small>{activeProject.category}</small><strong>{activeProject.title}</strong></div></div></div>}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "ImageGallery", name: "Apex TV Mounting Installation Portfolio", image: projects.map((project) => ({ "@type": "ImageObject", contentUrl: `https://www.apex-tv-mounting.com${project.image}`, description: project.alt })) }) }} /></section>;
}
