import { Container, Row, Col, Button, Card, Accordion, Modal, Form } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import "./css/Employer.css";

export default function Employers() {
  /* ================= SEO & Body Class ================= */
  useEffect(() => {
    document.title = "HireSkills for Employers | Stress-Free Hiring & Employment";

    let metaDesc = document.querySelector("meta[name='description']");
    const isNewMeta = !metaDesc;

    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content =
      "HireSkills helps companies hire, employ and manage talent with zero payroll, compliance or HR stress.";

    document.body.classList.add("employer-light");

    /* ================= Reveal Animation ================= */
    const elements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    elements.forEach(el => observer.observe(el));

    return () => {
      if (isNewMeta && metaDesc) document.head.removeChild(metaDesc);
      document.body.classList.remove("employer-light");
      observer.disconnect();
    };
  }, []);

  /* ================= Inquiry Modal ================= */
  const [showInquiry, setShowInquiry] = useState(false);
  const handleOpenInquiry = () => setShowInquiry(true);
  const handleCloseInquiry = () => setShowInquiry(false);

  const handleSendInquiry = () => {
    const data = {
      name: document.getElementById("inquiryName").value,
      email: document.getElementById("inquiryEmail").value,
      phone: document.getElementById("inquiryPhone").value,
      message: document.getElementById("inquiryMessage").value,
    };
    console.log("Inquiry submitted:", data);
    setShowInquiry(false);
  };

  return (
    <div className="employer-page">
      <SeoSchema />

      {/* HERO */}
      <section className="employer-hero">
        <Container>
          <Row className="align-items-center">
            <Col md={7} className="reveal text-center text-md-start">
              <h1>
                We Handle <span className="highlight">Hiring & Employment</span>
                <br />
                You Focus on <span className="typing-text">Business</span>
              </h1>
              <p className="lead mt-3">
                We hire, employ and manage talent for you — payroll, compliance, HR & operations handled end-to-end.
              </p>
              <p>📞 Get Staff in 7–10 Days</p>
              <div className="d-flex gap-3 mt-4 flex-wrap">
                <Button size="lg" href="/partner">
                  Start Hiring
                </Button>
                <Button size="lg" variant="outline-light" onClick={handleOpenInquiry}>
                  Send Inquiry
                </Button>
              </div>
            </Col>

            <Col md={5} className="d-none d-md-block reveal">
              <img
                src="/images/employer-hero.png"
                alt="Stress-Free Hiring Illustration"
                className="hero-img"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* WHO THIS IS FOR */}
      <section className="employer-section who-this-for">
        <Container>
          <h2 className="section-title text-primary">Who This Is For</h2>
          <p className="text-center text-muted mb-5">
            Our managed hiring model is ideal for companies that want to scale teams without HR, payroll, or compliance complexity.
          </p>
          <Row className="g-4 justify-content-center">
            {[
              { title: "Startups & SMEs", text: "Growing teams (5–200 staff) that want speed without building an HR department." },
              { title: "High-Attrition Roles", text: "Operator, support, and sales teams with frequent hiring and replacement needs." },
              { title: "Process-Driven Companies", text: "Businesses that need reliable staff with attendance, discipline, and accountability." },
              { title: "Cost-Conscious Employers", text: "Companies looking to reduce hiring costs and avoid payroll & compliance risks." }
            ].map((item, i) => (
              <Col md={3} sm={6} key={i} className="reveal">
                <Card className="who-card h-100">
                  <Card.Body>
                    <h5>{item.title}</h5>
                    <p>{item.text}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* STATS */}
      <section className="employer-section">
        <Container>
          <Row className="text-center">
            <Stat value={50} label="Professionals Hired" />
            <Stat value={5} label="Companies Served" />
            <Stat value={99} label="Compliance Accuracy %" />
            <Stat value={7} label="Avg Hiring Days" />
          </Row>
        </Container>
      </section>

      {/* WHAT WE DO */}
      <section className="employer-section">
        <Container>
          <h2 className="section-title reveal text-primary">What We Do</h2>
          <Row>
            {[
              ["Hire Talent", "We source, screen and onboard candidates."],
              ["Employ Talent", "HireSkills manages employment, payroll, and statutory compliance on its payroll."],
              ["Manage Talent", "We handle HR operations, payroll, and statutory compliance."]
            ].map((item, i) => (
              <Col md={4} key={i} className="reveal">
                <Card className="info-card">
                  <Card.Body>
                    <Card.Title>{item[0]}</Card.Title>
                    <Card.Text>{item[1]}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* HIRING TIMELINE */}
      {/* <section className="employer-section">
        <Container>
          <h3 className="section-title text-primary text-center">Hiring & Deployment Timeline</h3>
          <p className="text-center text-muted">
            From requirement to productive staff — in as little as 7–10 working days.
          </p>

          <div className="timeline">
            {[
              { title: "Requirement & Alignment", subtitle: "Day 0–1", desc: "Share role, headcount, location and start date. We align on expectations and pricing." },
              { title: "Screening & Shortlisting", subtitle: "Day 2–5", desc: "Candidates are sourced, assessed and pre-screened for readiness." },
              { title: "Deployment & Onboarding", subtitle: "Day 6–10", desc: "Staff deployed on our payroll with attendance and reporting set up." },
              { title: "Ongoing Workforce Management", subtitle: "Continuous", desc: "We manage salary, compliance, attendance, and replacements." }
            ].map((item, i) => (
              <div className="timeline-item reveal" key={i}>
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <span className="timeline-badge">{item.subtitle}</span>
                  <h5>{item.title}</h5>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section> */}

      {/* CASE STUDIES / MARQUEE */}
      <section className="employer-section stats-marquee">
        <Container>
          <h2 className="section-title text-primary text-center reveal">Proven Hiring Results</h2>
          <div className="marquee-wrapper">
            <div className="marquee-track">
              {[
                { company: "PayFlux", logo: "/logos/payflux.svg", industry: "FinTech Startup", title: "5 → 40 engineers", text: "Scaled in just 3 months" },
                { company: "ShopKart", logo: "/logos/shopkart.svg", industry: "E-commerce Brand", title: "35% HR cost reduced", text: "Single monthly invoice" },
                { company: "CloudDesk", logo: "/logos/clouddesk.svg", industry: "SaaS Company", title: "Pan-India Hiring", text: "Remote onboarding across states" },
                { company: "EnterCorp", logo: "/logos/entercorp.svg", industry: "Enterprise Client", title: "25+ Support Staff", text: "Zero payroll overhead" },
                { company: "QuickHire", logo: "/logos/quickhire.svg", industry: "Startup", title: "Hiring in 7 days", text: "From JD to onboarding" }
              ].concat(/* duplicate for seamless loop */).map((c, i) => (
                <div className="marquee-card" key={i}>
                  <Card className="case-card marquee-case">
                    <Card.Body>
                      <div className="company-row">
                        <img src={c.logo} alt={c.company} className="company-logo" onError={e => (e.target.style.display = "none")} />
                        <div>
                          <h6 className="company-name">{c.company}</h6>
                          <span className="case-tag">{c.industry}</span>
                        </div>
                      </div>
                      <h5 className="mt-3">{c.title}</h5>
                      <p className="mt-1">{c.text}</p>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="employer-section faqs">
        <Container>
          <h2 className="section-title text-primary text-center mb-4">Frequently Asked Questions</h2>
          <Accordion className="reveal faq-accordion" flush>
            {[
              { q: "Who is the legal employer?", a: "Zolo Systems OPC Private Limited is the legal employer and manages employment contracts, payroll, statutory compliance, and HR operations." },
              { q: "How does HireSkills help reduce hiring costs?", a: "By handling payroll, compliance, and HR operations, HireSkills helps companies save up to 30–40% in operational and administrative costs." },
              { q: "How fast can we onboard new hires?", a: "Candidates can typically be onboarded within 5–7 working days, from offer rollout to compliant employment and payroll setup." },
              { q: "Can we scale our team quickly?", a: "Yes. You can scale your workforce up or down without adding HR, payroll, or compliance overhead to your internal team." },
              { q: "Do you support pan-India or remote hiring?", a: "Yes. HireSkills enables compliant hiring across all Indian states, including remote and hybrid teams." },
              { q: "Who handles payroll, PF, ESI, and compliance?", a: "Zolo Systems manages end-to-end payroll processing, PF, ESI, TDS, statutory filings, and monthly consolidated invoicing." },
              { q: "Is there a security deposit?", a: "Yes. A refundable one-month billing security deposit is required to ensure uninterrupted salary processing and statutory compliance." },
              { q: "Is HireSkills suitable for startups and enterprises?", a: "Absolutely. We work with early-stage startups, fast-scaling companies, and enterprises that need flexible, compliant hiring solutions." }
            ].map((item, i) => (
              <Accordion.Item eventKey={i.toString()} key={i}>
                <Accordion.Header>{item.q}</Accordion.Header>
                <Accordion.Body>{item.a}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Container>
      </section>

      {/* CTA */}
      <section className="employer-cta reveal">
        <Container className="text-center">
          <h2>Ready to Hire Without the Headache?</h2>
          <p>Let HireSkills manage employment while you grow.</p>
          <Button size="lg" variant="light" className="cta-btn" href="/partner">
           Register Now
          </Button>
        </Container>
      </section>

      <StickyCTA />

      {/* SEND INQUIRY MODAL */}
      <Modal show={showInquiry} onHide={handleCloseInquiry} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>Send Inquiry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="inquiryName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Your full name" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="inquiryEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="your@example.com" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="inquiryPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="tel" placeholder="+91 98765 43210" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="inquiryMessage">
              <Form.Label>Message</Form.Label>
              <Form.Control as="textarea" rows={4} placeholder="Write your message..." />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseInquiry}>Close</Button>
          <Button variant="primary" onClick={handleSendInquiry}>Send</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StickyCTA() {
  return (
    <div className="sticky-cta">
      <div className="sticky-cta-inner">
        <span>Let HireSkills handle hiring & employment — stress free.</span>
        <Button size="sm" href="/partner">Start Hiring</Button>
      </div>
    </div>
  );
}

function SeoSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "HireSkills",
          url: "https://hireskills.com",
          description: "End-to-end hiring, employment, payroll & compliance management.",
          areaServed: "IN"
        })
      }}
    />
  );
}

function Stat({ value, label }) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;

      let current = 0;
      const step = Math.max(1, Math.floor(value / 60));
      const timer = setInterval(() => {
        current += step;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(current);
        }
      }, 16);

      observer.disconnect();
    }, { threshold: 0.4 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <Col md={3} ref={ref} className="reveal">
      <div className="stat-card">
        <h2>{count}+</h2>
        <p>{label}</p>
      </div>
    </Col>
  );
}
