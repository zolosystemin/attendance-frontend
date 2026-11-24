import "./css/About.css";
import CoreValuesImg from "../assets/core-values.png";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useState, useEffect } from "react";

/* Typing text effect */
function TypingText({ text, speed = 120 }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <h1 className="typing-react">{displayed}</h1>;
}

export default function About() {
  return (
    <>
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          color: "white",
        }}
      >
        <Container className="py-5 text-center">
          <TypingText text="About HireSkills" />
          <p className="mt-3 subtitle">
            Building careers, connecting talent, and empowering organizations
          </p>
        </Container>
      </div>

      {/* Company Overview */}
      <Container className="py-5">
        <Row className="align-items-center">
          <Col md={6}>
            <h2 className="fw-bold">Who We Are</h2>
            <p className="text-muted mt-3">
              HireSkills, a flagship product of Zolo Systems, is an enterprise hiring and skill management platform that helps organizations discover top talent, streamline recruitment, and manage workforce operations efficiently.
            </p>
            <p className="text-muted">
             With a focus on innovation, reliability, and simplicity, HireSkills empowers businesses to hire smarter, manage employees seamlessly, and stay focused on growth—all without the headache of administrative overhead.
            </p>
          </Col>
          <Col md={6}>
  <div
    style={{
      height: "330px",
      borderRadius: "24px",
      overflow: "hidden",
      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    }}
  >
    <img
      src={CoreValuesImg}
      alt="Our Core Values"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  </div>
</Col>
        </Row>
      </Container>

      {/* Mission & Vision */}
      <Container className="py-5">
        <Row className="text-center mb-4">
          <Col>
            <h2 className="fw-bold">Our Mission & Vision</h2>
            <p className="text-muted mt-2">
              Driving innovation in IT services and empowering talent globally.
            </p>
          </Col>
        </Row>
        <Row className="g-4 text-center">
          <Col md={6}>
            <Card className="h-100 shadow-sm border-0 rounded-4 p-4">
              <i className="bi bi-bullseye text-primary fs-1 mb-3" />
              <h5 className="fw-bold">Our Mission</h5>
              <p className="text-muted mt-2">
                Provide skill-driven workforce solutions, connecting the right talent
                with the right opportunities.
              </p>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="h-100 shadow-sm border-0 rounded-4 p-4">
              <i className="bi bi-eye-fill text-primary fs-1 mb-3" />
              <h5 className="fw-bold">Our Vision</h5>
              <p className="text-muted mt-2">
                To be a global leader in talent solutions and IT services, enabling
                sustainable growth for businesses and professionals alike.
              </p>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Milestones / Journey */}
      <Container className="py-5">
        <Row className="text-center mb-4">
          <Col>
            <h2 className="fw-bold">Our Journey</h2>
            <p className="text-muted mt-2">
              Key milestones and phases of Zolo Systems’ growth.
            </p>
          </Col>
        </Row>
        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100 shadow-sm border-0 rounded-4 p-4 text-center">
              <i className="bi bi-flag-fill text-primary fs-1 mb-3" />
              <h5 className="fw-bold mt-2">Phase 1: Foundation</h5>
              <p className="text-muted mt-2">
                Company established and initial IT services launched.
              </p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 shadow-sm border-0 rounded-4 p-4 text-center">
              <i className="bi bi-lightning-fill text-primary fs-1 mb-3" />
              <h5 className="fw-bold mt-2">Phase 2: Expansion</h5>
              <p className="text-muted mt-2">
                Professional training programs and workforce solutions introduced.
              </p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 shadow-sm border-0 rounded-4 p-4 text-center">
              <i className="bi bi-trophy-fill text-primary fs-1 mb-3" />
              <h5 className="fw-bold mt-2">Phase 3: Growth</h5>
              <p className="text-muted mt-2">
                Served 500+ companies and 10k+ professionals worldwide.
              </p>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Stats */}
      <div style={{ background: "#f8fafc" }}>
        <Container className="py-5">
          <Row className="text-center">
            <Col md={3}>
              <h2 className="fw-bold text-primary">10K+</h2>
              <p className="text-muted">Skilled Professionals</p>
            </Col>
            <Col md={3}>
              <h2 className="fw-bold text-primary">500+</h2>
              <p className="text-muted">Companies Served</p>
            </Col>
            <Col md={3}>
              <h2 className="fw-bold text-primary">95%</h2>
              <p className="text-muted">Client Satisfaction</p>
            </Col>
            <Col md={3}>
              <h2 className="fw-bold text-primary">24/7</h2>
              <p className="text-muted">Support Availability</p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Team Section */}
      {/* <Container className="py-5">
        <Row className="text-center mb-4">
          <Col>
            <h2 className="fw-bold">Meet Our Team</h2>
            <p className="text-muted mt-2">
              A passionate team dedicated to empowering talent and businesses.
            </p>
          </Col>
        </Row>
        <Row className="g-4 justify-content-center">
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm rounded-4 p-4 text-center">
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: "#7c3aed",
                  margin: "0 auto",
                }}
              />
              <h5 className="fw-bold mt-3">John Doe</h5>
              <p className="text-muted">CEO</p>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm rounded-4 p-4 text-center">
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: "#4f46e5",
                  margin: "0 auto",
                }}
              />
              <h5 className="fw-bold mt-3">Jane Smith</h5>
              <p className="text-muted">CTO</p>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm rounded-4 p-4 text-center">
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: "#a855f7",
                  margin: "0 auto",
                }}
              />
              <h5 className="fw-bold mt-3">Alice Lee</h5>
              <p className="text-muted">Head of HR</p>
            </Card>
          </Col>
        </Row>
      </Container> */}

      {/* Call to Action */}
      <div className="bg-dark text-white text-center py-5">
        <Container>
          <h2 className="fw-bold">Join Our Mission</h2>
          <p className="mt-3 text-muted">
            Connect with Zolo Systems to advance your career or hire top talent.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="mt-3 rounded-pill px-5"
            href="/register"
          >
            Get Started
          </Button>
        </Container>
      </div>
    </>
  );
}
