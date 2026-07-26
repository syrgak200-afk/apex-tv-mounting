const services = [
  { icon: "⌁", title: "TV Mounting", text: "Clean, secure mounting for TVs of every size—from cozy bedrooms to statement living rooms." },
  { icon: "◫", title: "Wire Concealment", text: "Keep the view polished with in-wall or surface cable management tailored to your space." },
  { icon: "⌂", title: "Home Theater", text: "Thoughtful placement, soundbar setup, and a viewing experience that feels made for you." },
  { icon: "✦", title: "Same-Day Service", text: "Need it done today? Our local team makes fast, professional installation simple." },
];

const faqs = [
  ["How much does TV mounting cost?", "Every setup is different. We give you clear, upfront pricing before work begins—no surprises, no vague add-ons."],
  ["Can you hide my TV wires?", "Yes. We offer clean in-wall concealment and discreet external solutions, depending on your wall type and setup."],
  ["Do I need to provide a TV mount?", "You can, or we can bring a premium mount that fits your TV, wall, and viewing needs."],
  ["What areas do you serve?", "We proudly serve Los Angeles and Orange County, with flexible appointment windows throughout the week."],
];

function Arrow() {
  return <span aria-hidden="true">→</span>;
}

export default function Home() {
  return (
    <main>
      <section className="hero" id="top">
        <nav className="nav container" aria-label="Main navigation">
          <a className="brand" href="#top" aria-label="Apex TV Mounting home"><span>APEX</span><small>TV MOUNTING</small></a>
          <div className="nav-links"><a href="#services">Services</a><a href="#process">Our Process</a><a href="#reviews">Reviews</a></div>
          <a className="button button-small button-light" href="#contact">Get a free quote <Arrow /></a>
        </nav>

        <div className="hero-content container">
          <p className="eyebrow">LOS ANGELES &amp; ORANGE COUNTY</p>
          <h1>Mount it right.<br /><em>Enjoy it more.</em></h1>
          <p className="hero-copy">Premium TV mounting and clean installation, thoughtfully finished by local pros who care about every detail.</p>
          <div className="hero-actions"><a className="button button-primary" href="#contact">Book your installation <Arrow /></a><a className="text-link" href="tel:+13105550198">Call (310) 555-0198</a></div>
          <div className="hero-proof"><span>★★★★★</span><p><strong>5.0 average rating</strong><br />from happy local homeowners</p></div>
        </div>
        <div className="hero-orbit" aria-hidden="true"><div className="orbit-tv"><div className="orbit-screen">APEX</div></div></div>
      </section>

      <section className="trust-bar"><div className="container trust-grid"><p>Licensed &amp; insured</p><p>Upfront pricing</p><p>1-year workmanship warranty</p><p>Respectful local technicians</p></div></section>

      <section className="section container" id="services">
        <div className="section-heading"><div><p className="eyebrow eyebrow-dark">WHAT WE DO</p><h2>Everything your screen needs to feel <em>at home.</em></h2></div><p>Whether it&apos;s one TV or a full entertainment space, we make the final result look effortless.</p></div>
        <div className="service-grid">{services.map((service) => <article className="service-card" key={service.title}><span className="service-icon">{service.icon}</span><h3>{service.title}</h3><p>{service.text}</p><a href="#contact" aria-label={`Learn about ${service.title}`}>Learn more <Arrow /></a></article>)}</div>
      </section>

      <section className="dark-section"><div className="container split-feature"><div className="feature-image"><div className="image-note">Clean lines.<br />Better nights in.</div></div><div className="feature-copy"><p className="eyebrow">THE APEX DIFFERENCE</p><h2>It&apos;s more than where your TV goes.</h2><p>It&apos;s how your room feels when every cable disappears, every angle is right, and everything just works.</p><ul><li><span>01</span> Precise placement for your room and routine</li><li><span>02</span> Meticulous protection of your home</li><li><span>03</span> A clean finish you&apos;ll be proud to show off</li></ul><a className="button button-outline" href="#contact">Plan your space <Arrow /></a></div></div></section>

      <section className="section warm-section" id="process"><div className="container"><div className="center-heading"><p className="eyebrow eyebrow-dark">SIMPLE BY DESIGN</p><h2>Your perfect setup in <em>three easy steps.</em></h2></div><div className="process-grid">{[["01", "Tell us your vision", "Share your TV size, wall type, and what you want your space to feel like."], ["02", "Choose your time", "Pick an appointment that works. We&apos;ll confirm everything before we arrive."], ["03", "Sit back & enjoy", "Our pros handle the install, clean up completely, and make sure you love the result."]].map(([number, title, text]) => <article className="process-step" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

      <section className="section container gallery-section"><div className="section-heading"><div><p className="eyebrow eyebrow-dark">RECENT INSTALLS</p><h2>Made to look like it was always <em>there.</em></h2></div><a className="text-link dark-link" href="#contact">See what&apos;s possible <Arrow /></a></div><div className="gallery"><div className="gallery-card gallery-one"><span>Living Room</span></div><div className="gallery-card gallery-two"><span>Media Wall</span></div><div className="gallery-card gallery-three"><span>Bedroom Setup</span></div></div></section>

      <section className="review-section" id="reviews"><div className="container review-layout"><div><p className="eyebrow eyebrow-dark">HOMEOWNER LOVE</p><h2>We&apos;re invited into your home. We take that <em>seriously.</em></h2><div className="rating"><strong>5.0</strong><span>★★★★★<small>Based on verified local reviews</small></span></div></div><blockquote>“They were on time, incredibly careful, and the result is flawless. Our living room finally feels finished.”<footer>— Maya R., Los Angeles</footer></blockquote></div></section>

      <section className="section container faq-section"><div className="section-heading"><div><p className="eyebrow eyebrow-dark">GOOD TO KNOW</p><h2>Questions, <em>answered.</em></h2></div></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>

      <section className="contact-section" id="contact"><div className="container contact-card"><div><p className="eyebrow">READY WHEN YOU ARE</p><h2>Let&apos;s make your favorite room even <em>better.</em></h2><p>Tell us what you&apos;re planning. We&apos;ll make the installation the easiest part.</p></div><div className="contact-actions"><a className="button button-primary" href="tel:+13105550198">Call (310) 555-0198 <Arrow /></a><a className="button button-outline" href="mailto:hello@apextvmounting.com">Email for a quote</a><small>Response within one business day</small></div></div></section>

      <footer className="footer"><div className="container footer-top"><a className="brand footer-brand" href="#top"><span>APEX</span><small>TV MOUNTING</small></a><p>Premium TV mounting &amp; installation<br />in Los Angeles &amp; Orange County.</p><div><a href="#services">Services</a><a href="#process">Process</a><a href="#reviews">Reviews</a><a href="#contact">Contact</a></div></div><div className="container footer-bottom"><span>© 2026 Apex TV Mounting &amp; Installation</span><span>Licensed · Insured · Local</span></div></footer>
    </main>
  );
}
