"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { ProjectCarousel } from "@/components/ProjectCarousel";
import { ProjectGallery } from "@/components/ProjectGallery";
import { QuoteQuiz } from "@/components/QuoteQuiz";
import { ReviewsSection } from "@/components/ReviewsSection";
import { SectionReveal } from "@/components/SectionReveal";

const phoneDisplay = "(714) 766-1943";
const phoneHref = "tel:+17147661943";
const email = "Apextvmountla@gmail.com";

const services = [
  {
    title: "TV Mounting",
    description: "Standard, tilt, and selected full-motion installations for TVs of different sizes.",
  },
  {
    title: "Wire Solutions",
    description: "External raceways and in-wall concealment options, depending on wall conditions.",
  },
  {
    title: "Specialty Installations",
    description: "Fireplaces, Samsung Frame TVs, soundbars, large TVs, and complex wall surfaces.",
  },
];

const faqs = [
  [
    "How is the preliminary price calculated?",
    "The preliminary estimate is based on the TV, wall, mount, wire preferences, fireplace details, and requested equipment you select in the quote quiz.",
  ],
  [
    "Can you mount on brick, concrete, or plaster?",
    "Yes. These wall conditions need photo review so Apex can confirm the right installation approach before providing a reliable quote.",
  ],
  [
    "Can wires be hidden inside the wall?",
    "In-wall concealment is an option for some walls. The quote quiz and project photos help Apex review the conditions first.",
  ],
  [
    "Can Apex provide a mount?",
    "Yes. Tell us in the quiz that you need a mount, and Apex will confirm a compatible option for your TV and wall.",
  ],
  [
    "How is appointment availability confirmed?",
    "Preferred dates and times are requests. Apex confirms availability directly after the project details are reviewed.",
  ],
] as const;

const processSteps = [
  ["01", "Tell us about the TV and wall"],
  ["02", "Add photos for a more reliable review"],
  ["03", "Confirm the scope, price, and appointment"],
  ["04", "We complete the installation"],
] as const;

function Arrow() {
  return <span aria-hidden="true">→</span>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.apex-tv-mounting.com/#organization",
        name: "Apex TV Mounting & Installation",
        url: "https://www.apex-tv-mounting.com",
        email,
        telephone: "+1-714-766-1943",
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://www.apex-tv-mounting.com/#localbusiness",
        name: "Apex TV Mounting & Installation",
        url: "https://www.apex-tv-mounting.com",
        telephone: "+1-714-766-1943",
        email,
        parentOrganization: { "@id": "https://www.apex-tv-mounting.com/#organization" },
        areaServed: [
          { "@type": "City", name: "Los Angeles" },
          { "@type": "AdministrativeArea", name: "Orange County" },
        ],
        serviceType: ["TV Mounting", "Wire Concealment", "Home Theater Installation"],
      },
      {
        "@type": "Service",
        name: "TV Mounting and Installation",
        serviceType: "TV mounting",
        provider: { "@id": "https://www.apex-tv-mounting.com/#localbusiness" },
        areaServed: ["Los Angeles", "Orange County"],
        url: "https://www.apex-tv-mounting.com",
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };

  const closeMenu = () => setMenuOpen(false);

  const submitQuote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const images = Array.from(new FormData(form).getAll("photos")).filter(
      (entry): entry is File => entry instanceof File && entry.size > 0,
    );
    const maxImageBytes = 1024 * 1024;
    const maxTotalImageBytes = 4 * 1024 * 1024;

    if (images.some((image) => image.size > maxImageBytes) || images.reduce((total, image) => total + image.size, 0) > maxTotalImageBytes) {
      setFormStatus("error");
      setFormError("Please upload up to 5 JPG, PNG, or WebP photos under 1 MB each, with a 4 MB total limit.");
      return;
    }

    setFormStatus("loading");
    setFormError("");
    try {
      const response = await fetch("/api/quote", { method: "POST", body: new FormData(form) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We could not send your request.");
      setFormStatus("success");
    } catch (error) {
      setFormStatus("error");
      setFormError(error instanceof Error ? error.message : "We could not send your request.");
    }
  };

  return (
    <>
      <header className="site-header" id="top">
        <nav className="site-nav container" aria-label="Main navigation">
          <a className="brand" href="#top" onClick={closeMenu}>
            <span>APEX</span>
            <small>TV MOUNTING</small>
          </a>
          <div className="desktop-nav-links">
            <a href="#services">Services</a>
            <a href="#work">Work</a>
            <a href="#quote">Quote</a>
            <a href="#reviews">Reviews</a>
            <a href={phoneHref}>Call Now</a>
          </div>
          <div className="nav-actions">
            <a className="button button-primary button-small nav-quote" href="#quote">Get a Quote <Arrow /></a>
            <button
              className="menu-toggle"
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span className="sr-only">Menu</span>
            </button>
          </div>
        </nav>
        {menuOpen ? (
          <div className="mobile-menu container" id="mobile-menu">
            <a href="#services" onClick={closeMenu}>Services</a>
            <a href="#work" onClick={closeMenu}>Work</a>
            <a href="#quote" onClick={closeMenu}>Quote</a>
            <a href="#reviews" onClick={closeMenu}>Reviews</a>
            <a href={phoneHref} onClick={closeMenu}>Call {phoneDisplay}</a>
          </div>
        ) : null}
      </header>

      <main id="main-content">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">TV MOUNTING &amp; INSTALLATION · LOS ANGELES</p>
              <h1>Precision mounting.<br /><em>A cleaner finished space.</em></h1>
              <p>TV mounting, wire concealment, fireplace installations, Frame TVs, and soundbars—planned around your wall, equipment, and room.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#quote">Get My Preliminary Quote <Arrow /></a>
                <a className="button button-secondary" href={phoneHref}>Call {phoneDisplay}</a>
              </div>
              <p className="hero-note">Real project photos · Preferred times confirmed directly</p>
            </div>
            <div className="hero-image">
              <Image
                alt="Television mounted above a fireplace in a bright living room"
                className="hero-photo"
                fetchPriority="high"
                height={1200}
                loading="eager"
                priority
                sizes="(max-width: 719px) calc(100vw - 40px), (max-width: 1049px) 46vw, 520px"
                src="/portfolio/above-fireplace-03.webp"
                width={960}
              />
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Apex service details">
          <div className="container trust-strip-list">
            <span>Real installation photos</span>
            <span>Preliminary pricing before scheduling</span>
            <span>Photos accepted with every quote</span>
            <span>Los Angeles + selected Orange County areas</span>
          </div>
        </section>

        <SectionReveal as="section" className="section services-section" id="services">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">SERVICES</p>
                <h2>Installation options for your space.</h2>
              </div>
            </div>
            <div className="service-list">
              {services.map((service) => (
                <article className="service-item" key={service.title}>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <a href="#quote">Start this quote <Arrow /></a>
                </article>
              ))}
            </div>
          </div>
        </SectionReveal>

        <SectionReveal><ProjectCarousel /></SectionReveal>
        <details className="full-portfolio" id="full-portfolio">
          <summary className="container">Browse the full project portfolio <span aria-hidden="true">+</span></summary>
          <ProjectGallery />
        </details>

        <SectionReveal as="section" className="quote-section" id="quote">
          <div className="container quote-layout">
            <div className="quote-intro">
              <p className="eyebrow">PRELIMINARY QUOTE</p>
              <h2>Get a preliminary quote.</h2>
              <p>Answer a few quick questions about your TV, wall, mount, and preferred installation.</p>
              <p className="quote-contact"><a href={phoneHref}>Call {phoneDisplay}</a><a href={`mailto:${email}`}>{email}</a></p>
            </div>
            <div className="quote-panel">
              <QuoteQuiz />
              <details className="quote-form-fallback">
                <summary>Prefer the full quote form?</summary>
                <form className="quote-form" onSubmit={submitQuote}>
                  {formStatus === "success" ? (
                    <div className="form-success" role="status">
                      <strong>Your quote request is on its way.</strong>
                      <p>Thank you. Apex TV Mounting will follow up about your project details.</p>
                    </div>
                  ) : (
                    <>
                      <input className="honeypot" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                      <div className="form-grid">
                        <label>Full name<input name="name" required autoComplete="name" disabled={formStatus === "loading"} /></label>
                        <label>Phone<input name="phone" type="tel" required autoComplete="tel" disabled={formStatus === "loading"} /></label>
                        <label>Email<input name="email" type="email" required autoComplete="email" disabled={formStatus === "loading"} /></label>
                        <label>ZIP code<input name="zip" inputMode="numeric" required autoComplete="postal-code" disabled={formStatus === "loading"} /></label>
                        <label>TV size<select name="tvSize" required defaultValue="" disabled={formStatus === "loading"}><option value="" disabled>Select size</option><option>Under 55 inches</option><option>55 to 64 inches</option><option>65 to 74 inches</option><option>75 inches or larger</option><option>Not sure</option></select></label>
                        <label>Wall type<select name="wallType" required defaultValue="" disabled={formStatus === "loading"}><option value="" disabled>Select wall type</option><option>Drywall</option><option>Brick</option><option>Concrete</option><option>Fireplace</option><option>Not sure</option></select></label>
                        <label>Mount available?<select name="mountAvailable" required defaultValue="" disabled={formStatus === "loading"}><option value="" disabled>Select one</option><option>Yes</option><option>No</option><option>Not sure</option></select></label>
                        <label>Wire concealment?<select name="wireConcealment" required defaultValue="" disabled={formStatus === "loading"}><option value="" disabled>Select one</option><option>Yes</option><option>No</option><option>Not sure</option></select></label>
                        <label>Preferred date<input name="preferredDate" type="date" disabled={formStatus === "loading"} /></label>
                        <label>Project photos <span className="field-note">Up to 5 JPG, PNG, or WebP files under 1 MB each (4 MB total)</span><input name="photos" type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={formStatus === "loading"} aria-label="Upload project photos" /></label>
                        <label className="form-notes">Project notes<textarea name="notes" rows={4} placeholder="Tell us about the room, TV, wall, or anything else that helps." disabled={formStatus === "loading"} /></label>
                      </div>
                      {formStatus === "error" ? <p className="form-error" role="alert">{formError}</p> : null}
                      <button className="button button-primary form-submit" type="submit" disabled={formStatus === "loading"}>{formStatus === "loading" ? "Sending request..." : "Request my quote"} <Arrow /></button>
                      <p className="form-disclaimer">Submitting this form does not create an appointment. We will follow up to discuss your project.</p>
                    </>
                  )}
                </form>
              </details>
            </div>
          </div>
        </SectionReveal>

        <SectionReveal as="section" className="section process-section" id="process">
          <div className="container">
            <div className="section-heading"><div><p className="eyebrow">HOW IT WORKS</p><h2>Simple from the first photo to the finished setup.</h2></div></div>
            <ol className="process-list">
              {processSteps.map(([number, text]) => <li key={number}><span>{number}</span><p>{text}</p></li>)}
            </ol>
          </div>
        </SectionReveal>

        <SectionReveal><ReviewsSection /></SectionReveal>

        <SectionReveal as="section" className="section faq-section">
          <div className="container">
            <div className="section-heading"><div><p className="eyebrow">FAQ</p><h2>Before you request a quote.</h2></div></div>
            <div className="faq-list">
              {faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}
            </div>
          </div>
        </SectionReveal>

        <section className="final-cta">
          <div className="container final-cta-grid">
            <div><p className="eyebrow">NEXT STEP</p><h2>Ready to plan your installation?</h2><p>Share your TV, wall, and preferred date. Photos help us review the project more accurately.</p></div>
            <div className="final-cta-actions"><a className="button button-primary" href="#quote">Start My Quote <Arrow /></a><a className="button button-outline-light" href={phoneHref}>Call {phoneDisplay}</a></div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div><a className="brand footer-brand" href="#top"><span>APEX</span><small>TV MOUNTING</small></a><p>TV mounting and installation for Los Angeles and selected Orange County areas.</p></div>
          <div><h2>Contact</h2><a href={phoneHref}>{phoneDisplay}</a><a href={`mailto:${email}`}>{email}</a></div>
          <div><h2>Explore</h2><a href="#services">Services</a><a href="#work">Work</a><a href="#quote">Quote</a><a href="#reviews">Reviews</a></div>
        </div>
        <div className="container footer-bottom"><span>© 2026 Apex TV Mounting &amp; Installation</span><span>Los Angeles + selected Orange County areas</span></div>
      </footer>
      <div className="mobile-action-bar"><a href={phoneHref}>Call</a><a href="#quote">Get Quote</a></div>
    </>
  );
}
