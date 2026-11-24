import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  ProgressBar,
  Image,
  Alert,
  ListGroup,
} from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaUserEdit,
  FaFileUpload,
  FaCheckCircle,
  FaBriefcase,
  FaGraduationCap,
} from "react-icons/fa";

const CandidateDashboard = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [success, setSuccess] = useState("");

  const [profile, setProfile] = useState({
    name: "Atul Kumar",
    title: "Full Stack Developer",
    email: "atul@gmail.com",
    mobile: "9876543210",
    location: "Delhi, India",
    experience: "2 Years",
    education: "B.Tech Computer Science",
    skills: "React, Spring Boot, MySQL",
    bio: "Passionate developer looking for growth opportunities.",
    image: "https://via.placeholder.com/120",
    candidateType: "Fresher", // Fresher | Experienced
    resume: null,
    resumeHistory: [
      { name: "Resume_v1.pdf", date: "2025-01-10" },
      { name: "Resume_v2.pdf", date: "2025-03-22" },
    ],
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setSuccess("Profile updated successfully!");
    setIsEdit(false);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newResume = {
        name: file.name,
        date: new Date().toISOString().split("T")[0],
      };

      setProfile((prev) => ({
        ...prev,
        resume: file.name,
        resumeHistory: [newResume, ...prev.resumeHistory],
      }));
    }
  };

  const calculateCompletion = () => {
    const fields = [
      profile.name,
      profile.title,
      profile.mobile,
      profile.location,
      profile.experience,
      profile.education,
      profile.skills,
      profile.bio,
      profile.resume,
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  };

  const completion = calculateCompletion();

  return (
    <Container fluid className="bg-light min-vh-100 p-4">
      <Row className="g-4">

        {/* LEFT */}
        <Col lg={8}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-0 shadow-lg rounded-4">
              <Card.Body>

                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <Image
                      src={profile.image}
                      roundedCircle
                      width={90}
                      height={90}
                      className="border border-3 border-primary"
                    />
                    <div>
                      <h4 className="mb-0">{profile.name}</h4>
                      <div className="text-muted">{profile.title}</div>
                      <Badge bg="info" className="mt-1">
                        {profile.candidateType}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    onClick={() => (isEdit ? handleSave() : setIsEdit(true))}
                    variant={isEdit ? "success" : "primary"}
                  >
                    <FaUserEdit className="me-1" /> {isEdit ? "Save" : "Edit"}
                  </Button>
                </div>

                {success && <Alert variant="success">{success}</Alert>}

                {/* FORM */}
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Name</Form.Label>
                      <Form.Control name="name" value={profile.name} disabled={!isEdit} onChange={handleChange} />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Title</Form.Label>
                      <Form.Control name="title" value={profile.title} disabled={!isEdit} onChange={handleChange} />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Experience</Form.Label>
                      <Form.Control name="experience" value={profile.experience} disabled={!isEdit} onChange={handleChange} />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Education</Form.Label>
                      <Form.Control name="education" value={profile.education} disabled={!isEdit} onChange={handleChange} />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Skills</Form.Label>
                      <Form.Control name="skills" value={profile.skills} disabled={!isEdit} onChange={handleChange} />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>About</Form.Label>
                      <Form.Control as="textarea" rows={3} name="bio" value={profile.bio} disabled={!isEdit} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                </Row>

                {/* RESUME UPLOAD */}
                <div className="mt-4">
                  <h6><FaFileUpload /> Resume</h6>
                  <Form.Control type="file" onChange={handleResumeUpload} />

                  {profile.resume && (
                    <div className="mt-2 text-success">
                      <FaCheckCircle /> Latest: {profile.resume}
                    </div>
                  )}
                </div>

                {/* RESUME HISTORY */}
                <div className="mt-4">
                  <h6>Previous Resumes</h6>
                  <ListGroup>
                    {profile.resumeHistory.map((r, i) => (
                      <ListGroup.Item key={i} className="d-flex justify-content-between">
                        {r.name}
                        <small className="text-muted">{r.date}</small>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>

              </Card.Body>
            </Card>
          </motion.div>
        </Col>

        {/* RIGHT */}
        <Col lg={4}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>

            {/* PROFILE STRENGTH */}
            <Card className="border-0 shadow-sm rounded-4 mb-3">
              <Card.Body>
                <h6>Profile Strength</h6>
                <ProgressBar striped animated now={completion} label={`${completion}%`} />
              </Card.Body>
            </Card>

            {/* CAREER SUMMARY */}
            <Card className="border-0 shadow-sm rounded-4 mb-3">
              <Card.Body>
                <h6>Career Snapshot</h6>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <FaBriefcase /> {profile.experience}
                </div>
                <div className="d-flex align-items-center gap-2">
                  <FaGraduationCap /> {profile.education}
                </div>
              </Card.Body>
            </Card>

            {/* QUICK ACTIONS */}
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body>
                <h6>Quick Actions</h6>
                <div className="d-grid gap-2">
                  <Button variant="outline-primary">Apply Jobs</Button>
                  <Button variant="outline-success">Update Resume</Button>
                </div>
              </Card.Body>
            </Card>

          </motion.div>
        </Col>

      </Row>
    </Container>
  );
};

export default CandidateDashboard;
