"use client";

import { FormEvent, useState } from "react";

const phoneDisplay = "(714) 766-1943";
const phoneHref = "tel:+17147661943";
const email = "Apextvmountla@gmail.com";

const services = [
  ["TV", "TV Mounting", "Secure, considered placement for TVs of every size and room."],
  ["CAB", "Wire Concealment", "A cleaner visual finish with cable-routing options for your space."],
  ["FIRE", "Fireplace & Specialty Walls", "A careful approach for fireplaces, brick, concrete, and more."],
  ["AV", "Home Theater", "TV, soundbar, and entertainment setups that feel thoughtfully planned."],
];

const faqs = [
  ["How do I get a quote?", "Send the form below with your TV size, wall type, and project details. We will follow up with the information needed for a clear quote."],
  ["Can you help with wire concealment?", "Yes. Select wire concealment in your quote request so we can discuss the options that suit your wall and setup."],
  ["Do I need to bring a mount?", "You can provide one, or tell us you need a mount in the form and we can discuss the right fit for your TV and wall."],
  ["What service area do you cover?", "Apex TV Mounting & Installation serves Los Angeles and Orange County. Include your ZIP code so we can confirm availability."],
];

function Arrow() { return <span aria-hidden="true">&rarr;</span>; }

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");
  const localBusinessSchema = { "@context": "https://schema.org", "@type": "LocalBusiness", name: "Apex TV Mounting & Installation", url: "https://www.apex-tv-mounting.com", telephone: "+1-714-766-1943", email, areaServed: ["Los Angeles", "Orange County"], serviceType: ["TV Mounting", "Wire Concealment", "Home Theater Installation"] };
  const closeMenu = () => setMenuOpen(false);
  const submitQuote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const images = Array.from(new FormData(form).getAll("photos")).filter((entry): entry is File => entry instanceof File && entry.size > 0);
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

  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
    <section className="hero" id="top">
      <nav className="nav container" aria-label="Main navigation">
        <a className="brand" href="#top" onClick={closeMenu} aria-label="Apex TV Mounting home"><span>APEX</span><small>TV MOUNTING</small></a>
        <div className="nav-links"><a href="#services">Services</a><a href="#process">Process</a><a href="#gallery">Gallery</a><a href="#quote">Get a quote</a></div>
        <a className="button button-small button-light nav-quote" href="#quote">Get a free quote <Arrow /></a>
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="mobile-menu"><span /><span /><span /><b>Menu</b></button>
      </nav>
      {menuOpen && <div className="mobile-menu is-open" id="mobile-menu"><a href="#services" onClick={closeMenu}>Services</a><a href="#process" onClick={closeMenu}>Our process</a><a href="#gallery" onClick={closeMenu}>Gallery</a><a href="#quote" onClick={closeMenu}>Get a quote</a><a href={phoneHref} onClick={closeMenu}>Call {phoneDisplay}</a></div>}
      <div className="hero-content container"><p className="eyebrow">LOS ANGELES &amp; ORANGE COUNTY</p><h1>Precision you can see.<br /><em>Peace of mind you can feel.</em></h1><p className="hero-copy">TV mounting and installation designed around your room, your routine, and a clean finish you will love coming home to.</p><div className="hero-actions"><a className="button button-primary" href="#quote">Get your 2-minute quote <Arrow /></a><a className="text-link" href={phoneHref}>Call {phoneDisplay}</a></div><div className="hero-proof"><span>CLEAR QUOTES</span><p><strong>Tell us about your setup</strong><br />We will help you plan the next step.</p></div></div><div className="hero-orbit" aria-hidden="true"><div className="orbit-tv"><div className="orbit-screen">APEX</div></div></div>
    </section>
    <section className="trust-bar"><div className="container trust-grid"><p>Clear project communication</p><p>Thoughtful placement</p><p>Clean visual finish</p><p>Quote before work begins</p></div></section>

    <section className="section container" id="services"><div className="section-heading"><div><p className="eyebrow eyebrow-dark">WHAT WE DO</p><h2>Everything your screen needs to feel <em>at home.</em></h2></div><p>From one TV to a complete entertainment wall, every recommendation starts with your space and goals.</p></div><div className="service-grid">{services.map(([icon, title, text]) => <article className="service-card" key={title}><span className="service-icon">{icon}</span><h3>{title}</h3><p>{text}</p><a href="#quote">Tell us about your project <Arrow /></a></article>)}</div></section>

    <section className="dark-section"><div className="container split-feature"><div className="feature-image"><div className="image-note">Clean lines.<br />Better nights in.</div></div><div className="feature-copy"><p className="eyebrow">THE APEX DIFFERENCE</p><h2>It&apos;s more than where your TV goes.</h2><p>It&apos;s how your room feels when the screen is in the right place, the cables are considered, and the result looks intentional.</p><ul><li><span>01</span> Placement planned around your room</li><li><span>02</span> Details discussed before work begins</li><li><span>03</span> A finish designed to look considered</li></ul><a className="button button-outline" href="#quote">Plan your space <Arrow /></a></div></div></section>

    <section className="section warm-section" id="process"><div className="container"><div className="center-heading"><p className="eyebrow eyebrow-dark">SIMPLE BY DESIGN</p><h2>Your setup in <em>three clear steps.</em></h2></div><div className="process-grid">{[["01", "Share your project", "Tell us your TV size, wall type, location, and what you want the finished space to feel like."], ["02", "Get a clear plan", "We will follow up with the questions needed to define the right installation approach."], ["03", "Enjoy the finished space", "Your installation is completed with an eye on the details that make the room feel pulled together."]].map(([number, title, text]) => <article className="process-step" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="section container gallery-section" id="gallery"><div className="section-heading"><div><p className="eyebrow eyebrow-dark">PROJECT GALLERY</p><h2>A place for your <em>best work.</em></h2></div><p>Replace these visual placeholders with your own completed installation photography before launch.</p></div><div className="gallery"><div className="gallery-card gallery-one"><span>Living Room Placeholder</span></div><div className="gallery-card gallery-two"><span>Media Wall Placeholder</span></div><div className="gallery-card gallery-three"><span>Bedroom Setup Placeholder</span></div></div></section>

    <section className="review-section" id="reviews"><div className="container review-layout"><div><p className="eyebrow eyebrow-dark">CUSTOMER FEEDBACK</p><h2>Let real work and real feedback do the <em>talking.</em></h2><div className="rating"><strong>REVIEWS</strong><span>COMING SOON<small>Verified customer reviews will be shared here after approval.</small></span></div></div><p className="review-note">Apex TV Mounting will publish customer feedback only after it has been verified and approved.</p></div></section>

    <section className="section container faq-section"><div className="section-heading"><div><p className="eyebrow eyebrow-dark">GOOD TO KNOW</p><h2>Questions, <em>answered.</em></h2></div></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>

    <section className="quote-section" id="quote"><div className="container quote-layout"><div className="quote-intro"><p className="eyebrow">REQUEST A QUOTE</p><h2>Tell us about your <em>space.</em></h2><p>Share a few details and we will follow up about your installation. Most requests take less than two minutes to complete.</p><div className="quote-contact"><a href={phoneHref}>Call {phoneDisplay}</a><a href={`mailto:${email}`}>{email}</a></div></div><form className="quote-form" onSubmit={submitQuote}>{formStatus === "success" ? <div className="form-success" role="status"><strong>Your quote request is on its way.</strong><p>Thank you. Apex TV Mounting will follow up about your project details.</p></div> : <><input className="honeypot" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" /><div className="form-grid"><label>Full name<input name="name" required autoComplete="name" disabled={formStatus === "loading"} /></label><label>Phone<input name="phone" type="tel" required autoComplete="tel" disabled={formStatus === "loading"} /></label><label>Email<input name="email" type="email" required autoComplete="email" disabled={formStatus === "loading"} /></label><label>ZIP code<input name="zip" inputMode="numeric" required autoComplete="postal-code" disabled={formStatus === "loading"} /></label><label>TV size<select name="tvSize" required defaultValue="" disabled={formStatus === "loading"}><option value="" disabled>Select size</option><option>Under 55 inches</option><option>55 to 64 inches</option><option>65 to 74 inches</option><option>75 inches or larger</option><option>Not sure</option></select></label><label>Wall type<select name="wallType" required defaultValue="" disabled={formStatus === "loading"}><option value="" disabled>Select wall type</option><option>Drywall</option><option>Brick</option><option>Concrete</option><option>Fireplace</option><option>Not sure</option></select></label><label>Mount available?<select name="mountAvailable" required defaultValue="" disabled={formStatus === "loading"}><option value="" disabled>Select one</option><option>Yes</option><option>No</option><option>Not sure</option></select></label><label>Wire concealment?<select name="wireConcealment" required defaultValue="" disabled={formStatus === "loading"}><option value="" disabled>Select one</option><option>Yes</option><option>No</option><option>Not sure</option></select></label><label>Preferred date<input name="preferredDate" type="date" disabled={formStatus === "loading"} /></label><label>Project photos <span className="field-note">Up to 5 JPG, PNG, or WebP files under 1 MB each (4 MB total)</span><input name="photos" type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={formStatus === "loading"} aria-label="Upload project photos" /></label><label className="form-notes">Project notes<textarea name="notes" rows={4} placeholder="Tell us about the room, TV, wall, or anything else that helps." disabled={formStatus === "loading"} /></label></div>{formStatus === "error" && <p className="form-error" role="alert">{formError}</p>}<button className="button button-primary form-submit" type="submit" disabled={formStatus === "loading"}>{formStatus === "loading" ? "Sending request..." : "Request my quote"} <Arrow /></button><p className="form-disclaimer">Submitting this form does not create an appointment. We will follow up to discuss your project.</p></>}</form></div></section>
    <footer className="footer"><div className="container footer-top"><a className="brand footer-brand" href="#top"><span>APEX</span><small>TV MOUNTING</small></a><p>TV mounting &amp; installation<br />in Los Angeles &amp; Orange County.</p><div><a href="#services">Services</a><a href="#process">Process</a><a href="#gallery">Gallery</a><a href="#quote">Get a quote</a></div></div><div className="container footer-bottom"><span>&copy; 2026 Apex TV Mounting &amp; Installation</span><span><a href={phoneHref}>{phoneDisplay}</a> · <a href={`mailto:${email}`}>{email}</a></span></div></footer>
    <div className="mobile-action-bar"><a href={phoneHref}>Call now</a><a href="#quote">Get quote</a></div>
  </main>;
}
