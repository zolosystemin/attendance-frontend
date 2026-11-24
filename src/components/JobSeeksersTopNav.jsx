import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { useNavigate, Link, useLocation } from "react-router-dom";
import NotificationDropdown from "../components/NotificationDropdown";
import { deleteCookie } from "../utils/cookie.js";
import "./css/JobSeekersTopNav.css";

const JobSeekersTopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.log("Logout API failed");
    }

    localStorage.clear();
    sessionStorage.clear();

    deleteCookie("_token");
    deleteCookie("_session_id");

    navigate("/login");
  };

  // ✅ ACTIVE STATES (strict single-source logic)
  const isDashboardActive = path === "/candidate/dashboard";

  const isJobsActive = [
    "/candidate/jobs",
    "/candidate/applications",
    "/candidate/saved-jobs"
  ].includes(path);

  const isLearningActive = [
    "/candidate/courses",
    "/candidate/mock-interviews",
    "/candidate/certifications",
    "/candidate/mocktests"
  ].includes(path);

  return (
    <Navbar
      bg="white"
      expand="lg"
      className="border-bottom shadow-sm px-3"
      sticky="top"
    >
      <Container fluid>

        {/* Brand */}
        <Navbar.Brand
          as={Link}
          to="/candidate/dashboard"
          className="fw-bold text-primary fs-4"
        >
          <i className="bi bi-briefcase me-2"></i>
          HireSkill
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="candidate-navbar" />

        <Navbar.Collapse id="candidate-navbar">

          {/* MAIN NAV */}
          <Nav className="mx-auto fw-medium gap-lg-3">

            {/* Dashboard */}
            <Nav.Link
              as={Link}
              to="/candidate/dashboard"
              className={isDashboardActive ? "active-nav nav-link" : "nav-link"}
            >
              <i className="bi bi-speedometer2 me-1"></i>
              Dashboard
            </Nav.Link>

            {/* Jobs Dropdown */}
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle
                as={Nav.Link}
                className={isJobsActive ? "active-nav nav-link" : "nav-link"}
              >
                <i className="bi bi-briefcase me-1"></i>
                Jobs
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow-sm">

                <Dropdown.Item as={Link} to="/candidate/jobs"
                  className={path === "/candidate/jobs" ? "active-nav" : ""}
                >
                  Matched Jobs
                </Dropdown.Item>

                <Dropdown.Item as={Link} to="/candidate/applications"
                  className={path === "/candidate/applications" ? "active-nav" : ""}
                >
                  My Applications
                </Dropdown.Item>

                <Dropdown.Item as={Link} to="/candidate/saved-jobs"
                  className={path === "/candidate/saved-jobs" ? "active-nav" : ""}
                >
                  Saved Jobs
                </Dropdown.Item>

              </Dropdown.Menu>
            </Dropdown>

            {/* Learning Dropdown */}
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle
                as={Nav.Link}
                className={isLearningActive ? "active-nav nav-link" : "nav-link"}
              >
                <i className="bi bi-mortarboard me-1"></i>
                Learning
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow-sm">

                <Dropdown.Item as={Link} to="/candidate/courses"
                  className={path === "/candidate/courses" ? "active-nav" : ""}
                >
                  Courses
                </Dropdown.Item>

                <Dropdown.Item as={Link} to="/candidate/mock-interviews"
                  className={path === "/candidate/mock-interviews" ? "active-nav" : ""}
                >
                  Mock Interviews
                </Dropdown.Item>

                <Dropdown.Item as={Link} to="/candidate/certifications"
                  className={path === "/candidate/certifications" ? "active-nav" : ""}
                >
                  Certifications
                </Dropdown.Item>

                <Dropdown.Item as={Link} to="/candidate/mocktests"
                  className={path === "/candidate/mocktests" ? "active-nav" : ""}
                >
                  Mock Tests
                </Dropdown.Item>

              </Dropdown.Menu>
            </Dropdown>

          </Nav>

          {/* RIGHT SECTION */}
          <Nav className="ms-auto align-items-lg-center gap-lg-4">
            <NotificationDropdown />

            {/* User Menu */}
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                className="border-0 fw-medium d-flex align-items-center gap-2"
              >
                <i className="bi bi-person-circle fs-5"></i>
                <span className="d-lg-inline d-none">Candidate</span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow-sm">

                <Dropdown.Item as={Link} to="/candidate/profile/edit">
                  My Profile
                </Dropdown.Item>

                <Dropdown.Item as={Link} to="/candidate/settings">
                  Account Settings
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item className="text-danger" onClick={handleLogout}>
                  Logout
                </Dropdown.Item>

              </Dropdown.Menu>
            </Dropdown>
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default JobSeekersTopNav;