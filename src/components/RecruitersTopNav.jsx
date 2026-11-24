import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { logoutUser } from "../services/loginService.js";
import { deleteCookie } from "../utils/cookie.js";
import NotificationDropdown from "../components/NotificationDropdown";
import AppAlert from "../components/Alert";
import "./css/JobSeekersTopNav.css";
import logoImg from "../assets/logo.png";

const RecruitersTopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAlert, setShowAlert] = useState(false);
  const [username, setUsername] = useState("");

  const [alertConfig, setAlertConfig] =
    useState({
      type: "info",
      message: "",
    });

  const path = location.pathname;

  useEffect(() => {
    const user = localStorage.getItem("username");

    if (user) {
      const firstName = user.split(" ")[0];
      setUsername(firstName);
    }
  }, []);

  // ✅ SINGLE SOURCE OF TRUTH (unchanged logic, just safer)
  const isJobsActive = [
    "/recruiter/jobs",
    "/recruiter/jobs/new",
    "/recruiter/jobs/drafts",
    "/recruiter/job-templates"
  ].includes(path);

  const isCandidatesActive = [
    "/recruiter/jobs/applicants",
    "/recruiter/candidates/shortlisted",
    "/recruiter/candidates/hired"
  ].includes(path);

  const isBillingActive = [
    "/recruiter/billing/subscription",
    "/recruiter/billing/transactions",
    "/recruiter/billing/invoices"
  ].includes(path);

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      console.log("Logout response:", response.message);

      // Clear all Local Storage
      localStorage.clear();

      // Clear all Session Storage
      sessionStorage.clear();

      // Delete all accessible cookies
      document.cookie.split(";").forEach((cookie) => {
        const name = cookie.split("=")[0].trim();

        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

        // If your cookies were set with a domain, you may also need:
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;

        // For cookies set on the parent domain (optional)
        const parts = window.location.hostname.split(".");
        if (parts.length > 2) {
          const parentDomain = "." + parts.slice(-2).join(".");
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${parentDomain};`;
        }
      });

      setAlertConfig({
        type: "error",
        message: response.message,
      });
      setShowAlert(true);
      navigate("/login", { replace: true });

    } catch (err) {
      console.error("Logout Error:", err);
      setAlertConfig({
        type: "error",
        message: response.message || "Unable to logout. Please try again.",
      });
      setShowAlert(true);
    }
  };

  return (
    <Navbar bg="white" expand="lg" className="border-bottom shadow-sm px-3" sticky="top">
      <Container fluid>
        {showAlert && (
          <AppAlert
            type={alertConfig.type}
            message={alertConfig.message}
            onClose={() => setShowAlert(false)}
          />
        )}

        {/* Brand */}
        <Navbar.Brand as={Link} to="/recruiter/dashboard" className="fw-bold text-primary fs-4">
          <img src={logoImg} alt="Logo" height={40} />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="candidate-navbar" />
        <Navbar.Collapse id="candidate-navbar">

          <Nav className="mx-auto fw-medium gap-lg-3">

            {/* Dashboard (FIXED: no NavLink mix issue) */}
            <Nav.Link
              as={Link}
              to="/recruiter/dashboard"
              className={path === "/recruiter/dashboard" ? "active-nav nav-link" : "nav-link"}
            >
              <i className="bi bi-speedometer2 me-1"></i>
              Dashboard
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/recruiter/employee"
              className={path === "/recruiter/employee" ? "active-nav nav-link" : "nav-link"}
            >
              <i className="bi bi-person-lines-fill me-2"></i>
              Employees
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/recruiter/attendance-logs"
              className={
                path === "/recruiter/attendance-logs"
                  ? "active-nav nav-link"
                  : "nav-link"
              }
            >
              <i className="bi-calendar-check-fill me-2"></i>
              Attendance
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="#"
              className={
                path === "/recruiter/reports"
                  ? "active-nav nav-link"
                  : "nav-link"
              }
            >
              <i className="bi-bar-chart-fill me-2"></i>
              Reports
            </Nav.Link>

            {/* Jobs */}
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle
                as={Nav.Link}
                className={isJobsActive ? "active-nav nav-link" : "nav-link"}
              >
                <i className="bi bi-gear me-1"></i>
                Settings
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow-sm">

                <Dropdown.Item
                  as={Link}
                  to="/recruiter/company-settings"
                  className={path === "/recruiter/company-settings" ? "active-nav" : ""}
                >
                  <i className="bi bi-building me-2"></i>
                  Company
                </Dropdown.Item>

                <Dropdown.Item
                  as={Link}
                  to="/recruiter/employee-settings"
                  className={path === "/recruiter/employee-settings" ? "active-nav" : ""}
                >
                  <i className="bi bi-people-fill me-2"></i>
                  Employees
                </Dropdown.Item>

                <Dropdown.Item
                  as={Link}
                  to="/recruiter/attendance-settings"
                  className={path === "/recruiter/attendance-settings" ? "active-nav" : ""}
                >
                  <i className="bi bi-calendar2-check-fill me-2"></i>
                  Attendance
                </Dropdown.Item>

                <Dropdown.Item
                  as={Link}
                  to="/recruiter/leave-settings"
                  className={path === "/recruiter/leave-settings" ? "active-nav" : ""}
                >
                  <i className="bi bi-calendar-check-fill me-2"></i>
                  Leave
                </Dropdown.Item>

                <Dropdown.Item
                  as={Link}
                  to="/recruiter/payroll-settings"
                  className={path === "/recruiter/payroll-settings" ? "active-nav" : ""}
                >
                  <i className="bi bi-cash-stack me-2"></i>
                  Payroll
                </Dropdown.Item>

                <Dropdown.Item
                  as={Link}
                  to="/recruiter/notifications-settings"
                  className={path === "/recruiter/notifications-settings" ? "active-nav" : ""}
                >
                  <i className="bi bi-bell-fill me-2"></i>
                  Notifications
                </Dropdown.Item>

                <Dropdown.Item
                  as={Link}
                  to="/recruiter/holiday-settings"
                  className={path === "/recruiter/holiday-settings" ? "active-nav" : ""}
                >
                  <i className="bi bi-calendar-event-fill me-2"></i>
                  Holiday Calendar
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item
                  as={Link}
                  to="/recruiter/role-permission-settings"
                  className={path === "/recruiter/role-permission-settings" ? "active-nav" : ""}
                >
                  <i className="bi bi-shield-lock-fill me-2"></i>
                  Roles & Permissions
                </Dropdown.Item>

              </Dropdown.Menu>
            </Dropdown>

            {/* Billing */}
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle
                as={Nav.Link}
                className={isBillingActive ? "active-nav nav-link" : "nav-link"}
              >
                <i className="bi bi-credit-card me-1"></i>
                Billing
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow-sm">

                <Dropdown.Item
                  as={Link}
                  to="/recruiter/billing/subscription"
                  className={path === "/recruiter/billing/subscription" ? "active-nav" : ""}
                >
                  Subscription
                </Dropdown.Item>

                <Dropdown.Item
                  as={Link}
                  to="/recruiter/billing/transactions"
                  className={path === "/recruiter/billing/transactions" ? "active-nav" : ""}
                >
                  Transactions
                </Dropdown.Item>

                <Dropdown.Item
                  as={Link}
                  to="/recruiter/billing/invoices"
                  className={path === "/recruiter/billing/invoices" ? "active-nav" : ""}
                >
                  Invoices
                </Dropdown.Item>

              </Dropdown.Menu>
            </Dropdown>

          </Nav>

          {/* RIGHT SIDE */}
          <Nav className="ms-auto align-items-lg-center gap-lg-4">
            <NotificationDropdown />

            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                className="border-0 fw-medium d-flex align-items-center gap-2"
              >
                <i className="bi bi-person-circle fs-5"></i>
                <span className="d-lg-inline d-none">
                  {username || "Recruiter"}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow-sm">
                <Dropdown.Item as={Link} to="/recruiter/profile">
                  My Profile
                </Dropdown.Item>

                <Dropdown.Item as={Link} to="/recruiter/settings">
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
export default RecruitersTopNav;