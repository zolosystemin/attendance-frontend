import "./css/Contact.css";
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from "react-bootstrap";
import { useState } from "react";

/* -------------------------------
   CATEGORY CONFIG
-------------------------------- */
const CATEGORY_CONFIG = {
  "job-support": {
    label: "Job & Applications",
    email: "jobs@hireskills.com",
    keywords: ["job", "apply", "interview", "application"],
  },
  profile: {
    label: "Profile & Skills",
    email: "profile@hireskills.com",
    keywords: ["profile", "resume", "cv", "skill"],
  },
  technical: {
    label: "Technical Issue",
    email: "tech@hireskills.com",
    keywords: ["error", "bug", "issue", "not working"],
  },
  account: {
    label: "Account & Login",
    email: "accounts@hireskills.com",
    keywords: ["login", "password", "otp"],
  },
  recruiter: {
    label: "Recruiter Inquiry",
    email: "recruiter@hireskills.com",
    keywords: ["hire", "recruit", "talent"],
  },
  other: {
    label: "Other",
    email: "support@hireskills.com",
    keywords: [],
  },
};

/* -------------------------------
   AI CATEGORY DETECTION
-------------------------------- */
function detectCategoryAI(message) {
  if (!message) return "other";

  const text = message.toLowerCase();
  let best = { key: "other", score: 0 };

  Object.entries(CATEGORY_CONFIG).forEach(([key, cfg]) => {
    let score = 0;
    cfg.keywords.forEach((word) => {
      if (text.includes(word)) score++;
    });
    if (score > best.score) best = { key, score };
  });

  return best.key;
}

export default function Contact() {
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [mobile, setMobile] = useState("");
  const [ticketId, setTicketId] = useState("");

  const generateTicketId = () =>
    `HS-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleSubmit = (e) => {
    e.preventDefault();

    const id = generateTicketId();
    setTicketId(id);

    const payload = {
      to: CATEGORY_CONFIG[category]?.email || "support@hireskills.com",
      category,
      subject,
      message,
      mobile,
      ticketId: id,
    };

    console.log("Support Payload:", payload);
    alert("Message sent successfully!");
  };

  return (
    <>
      {/* Header */}
      <div className="contact-hero">
        <Container className="text-center">
          <h1 className="fw-bold">
            <i className="bi bi-headset me-2" />
            Contact Support
          </h1>
          <p className="opacity-75">We’re here to help you — fast and smart</p>
        </Container>
      </div>

      {/* Full Width Map */}
<div className="contact-map">
  <iframe
    title="Nirman Vihar Office"
    src="https://www.google.com/maps?q=Nirman%20Vihar,Delhi,India&output=embed"
    loading="lazy"
    style={{ width: "100%", height: "400px", border: 0 }}
  />
</div>


      {/* Contact Section */}
      <Container className="py-5">
        <Row className="g-4">
          {/* Info */}
          <Col md={5}>
            <Card className="contact-card">
              <Card.Body>
                <h4 className="fw-bold mb-3">
                  <i className="bi bi-info-circle me-2" />
                  Get in Touch
                </h4>

                <p>
                  <i className="bi bi-envelope text-primary me-2" />
                  support@hireskills.com
                </p>

                <p>
                  <i className="bi bi-telephone text-success me-2" />
                  <a href="tel:+919534837300">+91 95348 37300</a>
                </p>

                <p>
                  <i className="bi bi-whatsapp text-success me-2" />
                  <a
                    href="https://wa.me/919534837300"
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp Support
                  </a>
                </p>

                <p className="text-muted mt-4">
                  <i className="bi bi-clock me-2" />
                  Mon – Sat, 9 AM – 6 PM
                </p>

                <p className="text-muted">
                  <i className="bi bi-geo-alt me-2" />
                   653, Nirman Vihar,
                  East Delhi, Delhi, 110092
                </p>
              </Card.Body>
            </Card>
          </Col>

          {/* Form */}
          <Col md={7}>
            <Card className="contact-card">
              <Card.Body>
                <h4 className="fw-bold mb-3">
                  <i className="bi bi-send me-2" />
                  Send a Message
                </h4>

                {ticketId && (
                  <Alert variant="success">
                    <i className="bi bi-ticket-perforated me-2" />
                    Ticket ID: <strong>{ticketId}</strong>
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    {/* Full Name */}
                    <Col md={6}>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-person-fill" />
                        </InputGroup.Text>
                        <Form.Control placeholder="Full Name" required />
                      </InputGroup>
                    </Col>

                    {/* Email */}
                    <Col md={6}>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-envelope-fill" />
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          placeholder="Email Address"
                          required
                        />
                      </InputGroup>
                    </Col>

                    {/* Mobile */}
                    <Col md={6}>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-telephone-fill" />
                        </InputGroup.Text>
                        <Form.Control
                          type="tel"
                          placeholder="Mobile Number"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                        />
                      </InputGroup>
                    </Col>

                    {/* Category */}
                    <Col md={6}>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-card-checklist" />
                        </InputGroup.Text>
                        <Form.Select
                          value={category}
                          onChange={(e) => {
                            setCategory(e.target.value);
                            setSubject(
                              `Regarding ${CATEGORY_CONFIG[e.target.value]?.label || ""}`
                            );
                          }}
                        >
                          <option value="">Select Category</option>
                          {Object.entries(CATEGORY_CONFIG).map(([key, c]) => (
                            <option key={key} value={key}>
                              {c.label}
                            </option>
                          ))}
                        </Form.Select>
                      </InputGroup>
                    </Col>

                    {/* Subject */}
                    <Col md={12}>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-file-text-fill" />
                        </InputGroup.Text>
                        <Form.Control
                          value={subject}
                          placeholder="Subject"
                          onChange={(e) => setSubject(e.target.value)}
                        />
                      </InputGroup>
                    </Col>

                    {/* Message */}
                    <Col md={12}>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-chat-left-text-fill" />
                        </InputGroup.Text>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          placeholder="Describe your issue..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onBlur={() =>
                            setCategory((prev) => prev || detectCategoryAI(message))
                          }
                        />
                      </InputGroup>                      
                    </Col>

                    <Col md={12}>
                      <Button
                        type="submit"
                        size="lg"
                        className="rounded-pill px-5 mt-2"
                      >
                        <i className="bi bi-send me-2" />
                        Send Message
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
