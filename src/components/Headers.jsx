import React from "react";
import {  Navbar,  Nav,  Container,  NavDropdown,  Button} from "react-bootstrap";
import {  Building,  PeopleFill,  ShieldLockFill,  CodeSlash,  Tools,  PersonWorkspace,  Server} from "react-bootstrap-icons";
import logoImg from "../assets/logo.png";
import { Link } from "react-router-dom";

const Headers = () => {
  return (
    <Navbar
      expand="lg"
      fixed="top"
      className="enterprise-navbar"
    >
      <Container fluid="xl">

        <Navbar.Brand
          href="/"
          className="brand-logo d-flex align-items-center"
        >
          <img
            src={logoImg}
            alt="Logo"
            className="brand-logo-img" width={40}
          />

          <div className="brand-content ms-2">
            <div className="brand-title">
              Zolo Systems
            </div>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle />

        <Navbar.Collapse>

          <Nav className="mx-auto">

            <NavDropdown
              title="Products"
              id="products-dropdown"
              className="enterprise-dropdown"
            >

              <NavDropdown.Item href="#hrms">
                <PeopleFill className="me-2" />
                HRMS Platform
              </NavDropdown.Item>

              <NavDropdown.Item href="#idp">
                <ShieldLockFill className="me-2" />
                Identity Provider
              </NavDropdown.Item>

              <NavDropdown.Item href="#attendance">
                Attendance Management
              </NavDropdown.Item>

              <NavDropdown.Item href="#payroll">
                Payroll Management
              </NavDropdown.Item>

            </NavDropdown>

            <NavDropdown
              title="Services"
              id="services-dropdown"
            >

              <NavDropdown.Item>
                <CodeSlash className="me-2" />
                Enterprise Development
              </NavDropdown.Item>

              <NavDropdown.Item>
                <Tools className="me-2" />
                AMC & Support
              </NavDropdown.Item>

              <NavDropdown.Item>
                <Server className="me-2" />
                Infrastructure Services
              </NavDropdown.Item>

              <NavDropdown.Item>
                <PersonWorkspace className="me-2" />
                Manpower Solutions
              </NavDropdown.Item>

            </NavDropdown>

            <NavDropdown
              title="Solutions"
              id="solutions-dropdown"
            >
              <NavDropdown.Item>
                Healthcare
              </NavDropdown.Item>

              <NavDropdown.Item>
                Education
              </NavDropdown.Item>

              <NavDropdown.Item>
                Manufacturing
              </NavDropdown.Item>

              <NavDropdown.Item>
                Financial Services
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
              title="Company"
              id="company-dropdown"
            >
              <NavDropdown.Item>
                About Us
              </NavDropdown.Item>

              <NavDropdown.Item>
                Careers
              </NavDropdown.Item>

              <NavDropdown.Item>
                Partners
              </NavDropdown.Item>

              <NavDropdown.Item>
                Contact Us
              </NavDropdown.Item>
            </NavDropdown>

          </Nav>

          <div className="d-flex align-items-center gap-3">

            <Button
              as={Link}
              to="/login"
              variant="outline-primary"
              className="signin-btn"
            >
              Sign In
            </Button>

            <Button
              as={Link}
              to="/demo"
              variant="primary"
              className="demo-btn"
            >
              Schedule Demo
            </Button>

          </div>

        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
};
export default Headers;