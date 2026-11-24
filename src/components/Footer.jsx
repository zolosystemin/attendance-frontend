import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  EnvelopeFill,
  TelephoneFill,
  GeoAltFill
} from "react-bootstrap-icons";

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5">
      <Container>
        <Row>
          <Col md={4}>
            <h4>EnterpriseHub</h4>

            <p className="text-secondary">
              HRMS, Identity Provider and Enterprise Services.
            </p>
          </Col>

          <Col md={2}>
            <h5>Products</h5>

            <ul className="list-unstyled">
              <li>HRMS</li>
              <li>Identity Provider</li>
            </ul>
          </Col>

          <Col md={3}>
            <h5>Services</h5>

            <ul className="list-unstyled">
              <li>Web Development</li>
              <li>AMC Support</li>
              <li>Manpower</li>
              <li>Infrastructure</li>
            </ul>
          </Col>

          <Col md={3}>
            <h5>Contact</h5>

            <p>
              <EnvelopeFill /> info@enterprisehub.com
            </p>

            <p>
              <TelephoneFill /> +91 9876543210
            </p>

            <p>
              <GeoAltFill /> New Delhi, India
            </p>
          </Col>
        </Row>

        <hr />

        <div className="text-center py-3">
          © 2026 EnterpriseHub. All Rights Reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;