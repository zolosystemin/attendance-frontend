import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ProgressBar,
  Alert,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getCandidateDashboard } from "../../services/mockDashboardService";
import "./css/JobSeekerDashboard.css";
import HireSkillsLoader from "../../components/HireSkillsLoader";

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    getCandidateDashboard()
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

  const candidate = dashboard;

  const statsUI = [
    {
      title: "Matched Jobs",
      value: candidate.stats.matchedJobs,
      icon: "bi-briefcase",
      color: "primary",
    },
    {
      title: "Mock Interviews",
      value: candidate.stats.mockInterviews,
      icon: "bi-camera-video",
      color: "warning",
    },
    {
      title: "Enrolled Courses",
      value: candidate.stats.enrolledCourses,
      icon: "bi-journal-text",
      color: "info",
    },
    {
      title: "Completed Courses",
      value: candidate.stats.completedCourses,
      icon: "bi-award",
      color: "success",
    },
    {
      title: "Mock Tests",
      value: candidate.stats.mockTests,
      icon: "bi-clipboard-check",
      color: "mock",
    },
    {
      title: "Job Applied",
      value: candidate.stats.jobsApplied,
      icon: "bi-person-workspace",
      color: "applied",
    },
  ];

  const handleApply = (jobId) => {
    setAppliedJobs((prev) => [...prev, jobId]);
  };

  return (

    <div className="min-vh-100 bg-light">

      <Container fluid >        

        {/* Welcome Card */}
        <Card className="shadow-sm border-0 mb-4 animate-fade welcome-card">
          <Card.Body className="d-flex align-items-center">
            <i className="bi bi-person-circle fs-1 me-3" />
            <div>
              <h5 className="mb-1">Welcome back 👋</h5>
              <small>Let’s get you closer to your next job</small>
            </div>
          </Card.Body>
        </Card>

        {/* Profile Alert */}
        {!candidate.profileCompleted && (
          <Alert variant="warning" className="shadow-sm">
            <strong>
              <i className="bi bi-exclamation-triangle-fill me-2" />
              Profile Incomplete
            </strong>
            <div className="mt-2">
              <Button size="sm" onClick={() => navigate("/profile/edit")}>
                Complete Profile
              </Button>
            </div>
          </Alert>
        )}

        {/* Strength Cards */}
        <Row className="mb-4">
          {[
            {
              title: "Profile Strength",
              value: candidate.profileStrength,
              icon: "bi-person-check",
            },
            {
              title: "Resume Strength",
              value: candidate.resumeStrength,
              icon: "bi-file-earmark-text",
            },
          ].map((item) => (
            <Col md={6} className="mb-3" key={item.title}>
              <Card className="hover-lift shadow-sm border-0">
                <Card.Body>
                  <Card.Title>
                    <i className={`bi ${item.icon} me-2`} />
                    {item.title}
                  </Card.Title>
                  <ProgressBar
                    now={item.value}
                    label={`${item.value}%`}
                    variant={
                      item.value >= 80
                        ? "success"
                        : item.value >= 50
                          ? "primary"
                          : "danger"
                    }
                  />

                  <div className="d-flex justify-content-between mt-2">
                    <small className="text-muted">Improve score</small>
                    <Button size="sm" variant="outline-primary">
                      Upgrade Now
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

          ))}
        </Row>

        {/* Stats */}
        <Row className="mb-4">
          {statsUI.map((item) => (
            <Col md={3} className="mb-2" key={item.title}>
              <Card className={`hover-lift hover-${item.color} shadow-sm border-0`}>
                <Card.Body className="text-center">
                  <i
                    className={`bi ${item.icon} fs-1 text-${item.color} mb-2`}
                  />
                  <h3 className="fw-bold">{item.value}</h3>
                  <div className="text-muted">{item.title}</div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Jobs & Courses */}
        <Row>
          {/* Matched Jobs */}
          <Col md={8}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Card.Title>
                  <i className="bi bi-briefcase me-2" />
                  Matched Jobs
                </Card.Title>

                <div
                  style={{
                    maxHeight:
                      candidate.matchedJobs.length > 5 ? "320px" : "auto",
                    overflowY:
                      candidate.matchedJobs.length > 5 ? "auto" : "visible",
                  }}
                >
                  {candidate.matchedJobs.map((job) => {
                    const isApplied = appliedJobs.includes(job.id);

                    return (
                      <div
                        key={job.id}
                        className="d-flex justify-content-between align-items-center border-bottom py-3 job-row"
                      >
                        <div>
                          <strong>{job.role}</strong>
                          <div className="text-muted">
                            {job.company} · {job.location}
                          </div>
                        </div>

                        {isApplied ? (
                          <Badge bg="success">Applied</Badge>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleApply(job.id)}
                          >
                            Apply
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Recommended Courses */}
          <Col md={4}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Card.Title>
                  <i className="bi bi-mortarboard me-2" />
                  Recommended Courses
                </Card.Title>

                {candidate.recommendedCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="hover-lift shadow-sm border-0 mb-3 animate-fade"
                  >
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{course.title}</h6>
                          <Badge bg="secondary">{course.level}</Badge>
                        </div>
                        <Button size="sm" variant="outline-success">
                          Enroll
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default JobSeekerDashboard;
