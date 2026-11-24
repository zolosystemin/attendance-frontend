import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, ProgressBar, Alert, Badge, } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getRecruiterDashboard } from "../../services/mockDashboardService";
import "../jonseekers/css/JobSeekerDashboard.css";
import HireSkillsLoader from "../../components/HireSkillsLoader";

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");


  // DAHBOARD FLOW STARTS HERE
  useEffect(() => {
    getRecruiterDashboard()
      .then((res) => setDashboard(res.data))
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="dashboard-loader">
        <HireSkillsLoader />
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  const recruiter = dashboard;

  const quickActions = [
    {
      title: "Add Employee",
      icon: "bi-person-plus-fill",
      color: "primary",
      path: "/recruiter/add-employee",
    },
    {
      title: "Attendance",
      icon: "bi-calendar-check-fill",
      color: "success",
      path: "/recruiter/attendance",
    },
    {
      title: "Payroll",
      icon: "bi-cash-stack",
      color: "warning",
      path: "/recruiter/payroll",
    },
    {
      title: "Leave",
      icon: "bi-calendar-event-fill",
      color: "danger",
      path: "/recruiter/leave",
    },
    {
      title: "Reports",
      icon: "bi-bar-chart-fill",
      color: "info",
      path: "/recruiter/reports",
    },
    {
      title: "Settings",
      icon: "bi-gear-fill",
      color: "secondary",
      path: "/recruiter/company-settings",
    },
  ];

  const statsUI = [
    {
      title: "Total Employees",
      value: recruiter?.stats?.totalEmployees || 245,
      icon: "bi-people-fill",
      color: "primary",
    },
    {
      title: "Present Today",
      value: recruiter?.stats?.present || 228,
      icon: "bi-check-circle-fill",
      color: "success",
    },
    {
      title: "Absent Today",
      value: recruiter?.stats?.absent || 10,
      icon: "bi-x-circle-fill",
      color: "danger",
    },
    {
      title: "On Leave",
      value: recruiter?.stats?.onLeave || 7,
      icon: "bi-calendar-minus-fill",
      color: "warning",
    },
    {
      title: "Pending Leaves",
      value: recruiter?.stats?.pendingLeave || 12,
      icon: "bi-hourglass-split",
      color: "info",
    },
    {
      title: "Payroll Pending",
      value: recruiter?.stats?.payrollPending || 3,
      icon: "bi-cash-stack",
      color: "secondary",
    },
  ];

  const recentActivities = [
    {
      icon: "bi-person-plus-fill",
      color: "success",
      title: "Rahul Sharma joined IT Department",
      time: "10 mins ago",
    },
    {
      icon: "bi-calendar-check-fill",
      color: "primary",
      title: "Attendance marked successfully",
      time: "25 mins ago",
    },
    {
      icon: "bi-cash-stack",
      color: "warning",
      title: "Payroll generated for June",
      time: "1 hour ago",
    },
    {
      icon: "bi-calendar-event-fill",
      color: "danger",
      title: "Holiday added for Independence Day",
      time: "Yesterday",
    },
  ];

  const holidays = [
    {
      date: "15 Aug",
      title: "Independence Day",
    },
    {
      date: "02 Oct",
      title: "Gandhi Jayanti",
    },
    {
      date: "25 Dec",
      title: "Christmas",
    },
  ];

  const birthdays = [
    {
      name: "Amit Kumar",
      department: "IT",
    },
    {
      name: "Priya Singh",
      department: "HR",
    },
  ];

  return (
    <div className="min-vh-100 bg-light py-3">

      <Container fluid>

        <Row className="mb-4">

          <Col lg={8}>

            <Card className="border-0 shadow hero-card">

              <Card.Body className="p-4">

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <h3 className="text-white fw-bold">
                      Good Morning 👋
                    </h3>

                    <p className="text-white mb-1">
                      Welcome back Administrator
                    </p>

                    <small className="text-white opacity-75">
                      Manage your HRMS from one place.
                    </small>

                  </div>

                  <div className="text-end">

                    <h1 className="text-white fw-bold">
                      {recruiter?.stats?.totalEmployees || 245}
                    </h1>

                    <small className="text-white">
                      Employees
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <h5 className="fw-bold">
                    Today's Attendance
                  </h5>

                  <Badge bg="success">
                    {recruiter?.attendance?.percentage || 93}%
                  </Badge>
                </div>

                <ProgressBar
                  className="my-3"
                  variant="success"
                  now={recruiter?.attendance?.percentage || 93}
                />

                <Row>
                  <Col className="text-center">
                    <h5 className="text-success fw-bold">
                      {recruiter?.stats?.present || 228}
                    </h5>
                    <small>Present</small>
                  </Col>
                  <Col className="text-center">
                    <h5 className="text-danger fw-bold">
                      {recruiter?.stats?.absent || 10}
                    </h5>
                    <small>Absent</small>
                  </Col>

                  <Col className="text-center">

                    <h5 className="text-warning fw-bold">
                      {recruiter?.stats?.onLeave || 7}
                    </h5>
                    <small>Leave</small>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ================= Quick Actions ================= */}

        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>

            <div className="d-flex justify-content-between align-items-center mb-3">

              <div>

                <h5 className="fw-bold mb-0">
                  Quick Actions
                </h5>

                <small className="text-muted">
                  Frequently used HRMS operations
                </small>

              </div>

            </div>

            <Row>

              {quickActions.map((item) => (

                <Col
                  xl={2}
                  lg={4}
                  md={4}
                  sm={6}
                  xs={6}
                  className="mb-3"
                  key={item.title}
                >

                  <Card
                    className="quick-card border-0 h-100"
                    onClick={() => navigate(item.path)}
                  >

                    <Card.Body className="text-center">

                      <div className={`quick-icon bg-${item.color}`}>

                        <i
                          className={`bi ${item.icon} text-white fs-3`}
                        />

                      </div>

                      <h6 className="mt-3 mb-1">
                        {item.title}
                      </h6>

                    </Card.Body>

                  </Card>

                </Col>

              ))}

            </Row>

          </Card.Body>
        </Card>

        {/* ================= KPI ================= */}

        <Row className="mb-4">

          {statsUI.map((item) => (

            <Col
              xl={2}
              lg={4}
              md={6}
              sm={6}
              className="mb-3"
              key={item.title}
            >

              <Card className="stat-card border-0 shadow-sm h-100">

                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <small className="text-muted">
                        {item.title}
                      </small>

                      <h2 className="fw-bold mt-2 mb-0">
                        {item.value}
                      </h2>

                    </div>
                    <div className={`stat-icon bg-${item.color}`}>
                      <i
                        className={`bi ${item.icon} text-white fs-4`}
                      />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}

        </Row>

        {/* ================= Attendance + Activity ================= */}

        <Row className="mb-4">
          <Col lg={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>

                <div className="d-flex justify-content-between">
                  <h5 className="fw-bold">
                    Attendance Summary
                  </h5>
                  <Badge bg="success">
                    Today
                  </Badge>
                </div>

                <div className="mt-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Present</span>
                    <strong>
                      {recruiter?.stats?.present || 228}
                    </strong>
                  </div>

                  <ProgressBar
                    now={90}
                    variant="success"
                    className="mb-3"
                  />

                  <div className="d-flex justify-content-between mb-2">
                    <span>Absent</span>
                    <strong>
                      {recruiter?.stats?.absent || 10}
                    </strong>
                  </div>

                  <ProgressBar
                    now={5}
                    variant="danger"
                    className="mb-3"
                  />

                  <div className="d-flex justify-content-between mb-2">

                    <span>Leave</span>

                    <strong>
                      {recruiter?.stats?.onLeave || 7}
                    </strong>

                  </div>

                  <ProgressBar
                    now={3}
                    variant="warning"
                  />

                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold">
                    Recent Activities
                  </h5>

                  <Button
                    size="sm"
                    variant="outline-primary"
                  >
                    View All
                  </Button>

                </div>

                {recentActivities.map((item, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center mb-4"
                  >
                    <div
                      className={`activity-icon bg-${item.color}`}
                    >
                      <i
                        className={`bi ${item.icon} text-white`}
                      />
                    </div>

                    <div className="ms-3">
                      <div className="fw-semibold">
                        {item.title}
                      </div>
                      <small className="text-muted">
                        {item.time}
                      </small>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {/* ================= Employees + Holidays ================= */}

        <Row className="mb-4">
          {/* Recent Employees */}
          <Col lg={8}>

            <Card className="border-0 shadow-sm h-100">

              <Card.Body>

                <div className="d-flex justify-content-between align-items-center mb-4">

                  <div>

                    <h5 className="fw-bold mb-0">
                      Recent Employees
                    </h5>

                    <small className="text-muted">
                      Latest joined employees
                    </small>

                  </div>

                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigate("/recruiter/employees")}
                  >
                    View All
                  </Button>

                </div>

                <div className="table-responsive">

                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Department</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-circle bg-primary">
                              A
                            </div>
                            <div className="ms-3">
                              <div className="fw-semibold">
                                Amit Kumar
                              </div>
                              <small className="text-muted">
                                EMP001
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>IT</td>
                        <td>
                          <Badge bg="success">
                            Active
                          </Badge>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-circle bg-success">
                              P
                            </div>

                            <div className="ms-3">
                              <div className="fw-semibold">
                                Priya Singh
                              </div>
                              <small className="text-muted">
                                EMP002
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>HR</td>
                        <td>
                          <Badge bg="success">
                            Active
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-circle bg-warning">
                              R
                            </div>
                            <div className="ms-3">
                              <div className="fw-semibold">
                                Rahul Verma
                              </div>
                              <small className="text-muted">
                                EMP003
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>Finance</td>
                        <td>
                          <Badge bg="warning">
                            Probation
                          </Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Holidays */}

          <Col lg={4}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h5 className="fw-bold mb-4">
                  Upcoming Holidays
                </h5>
                {holidays.map((holiday, index) => (
                  <div
                    key={index}
                    className="holiday-item"
                  >
                    <div className="holiday-date">
                      {holiday.date}
                    </div>
                    <div className="ms-3">
                      <div className="fw-semibold">
                        {holiday.title}
                      </div>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>

            {/* Birthdays */}

            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h5 className="fw-bold mb-4">
                  🎂 Birthdays
                </h5>

                {birthdays.map((item, index) => (
                  <div
                    key={index}
                    className="birthday-item"
                  >
                    <div className="birthday-avatar">
                      {item.name.charAt(0)}
                    </div>
                    <div className="ms-3">
                      <div className="fw-semibold">
                        {item.name}
                      </div>
                      <small className="text-muted">
                        {item.department}
                      </small>
                    </div>
                  </div>
                ))}

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default RecruiterDashboard;