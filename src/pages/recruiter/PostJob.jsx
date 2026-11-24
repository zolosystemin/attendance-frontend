import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  Alert,
} from "react-bootstrap";

/* =========================
   AVAILABLE SKILLS (MASTER)
========================= */

const BASE_SKILLS = [
  "React",
  "JavaScript",
  "TypeScript",
  "HTML",
  "CSS",
  "Bootstrap",
  "Node.js",
  "Express",
  "MongoDB",
  "REST API",
  "Redux",
  "Git",
];

const PostJob = () => {
  /* =========================
     STATE
  ========================= */

  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    experience: "",
    salary: "",
    description: "",
    status: "draft", // draft | published
  });

  const [skills, setSkills] = useState(BASE_SKILLS);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  /* =========================
     HANDLERS
  ========================= */

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    const skill = skillInput.trim();
    if (!skill) return;

    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setSkillInput("");
  };

  const validate = () => {
    const newErrors = {};
    if (!job.title) newErrors.title = "Job title is required";
    if (!job.company) newErrors.company = "Company name is required";
    if (!job.type) newErrors.type = "Job type is required";
    if (selectedSkills.length === 0)
      newErrors.skills = "Select at least one skill";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (status) => {
    setSuccess("");
    setErrors({});

    if (!validate()) return;

    const payload = {
      ...job,
      status,
      skills: selectedSkills,
    };

    console.log("JOB PAYLOAD 👉", payload);

    setSuccess(
      status === "published"
        ? "Job published successfully!"
        : "Job saved as draft!"
    );
  };

  /* =========================
     UI
  ========================= */

  return (
    <Container fluid className="bg-light min-vh-100 py-0">
      <Row>
        {/* ================= LEFT : FORM ================= */}
        <Col lg={8}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body>
              <h4 className="mb-3">Post a Job</h4>

              {success && <Alert variant="success">{success}</Alert>}

              <Form>
                {/* Title */}
                <Form.Group className="mb-3">
                  <Form.Label>Job Title *</Form.Label>
                  <Form.Control
                    name="title"
                    value={job.title}
                    onChange={handleChange}
                    isInvalid={!!errors.title}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Company */}
                <Form.Group className="mb-3">
                  <Form.Label>Company *</Form.Label>
                  <Form.Control
                    name="company"
                    value={job.company}
                    onChange={handleChange}
                    isInvalid={!!errors.company}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.company}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        name="location"
                        value={job.location}
                        onChange={handleChange}
                        placeholder="Remote / City"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Job Type *</Form.Label>
                      <Form.Select
                        name="type"
                        value={job.type}
                        onChange={handleChange}
                        isInvalid={!!errors.type}
                      >
                        <option value="">Select</option>
                        <option>Full Time</option>
                        <option>Part Time</option>
                        <option>Contract</option>
                        <option>Hybrid</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.type}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Experience</Form.Label>
                      <Form.Control
                        name="experience"
                        value={job.experience}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Salary</Form.Label>
                      <Form.Control
                        name="salary"
                        value={job.salary}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* ================= SKILLS ================= */}
                <Form.Group className="mb-4">
                  <Form.Label>Skills *</Form.Label>

                  {/* Selected */}
                  <div className="mb-2 d-flex flex-wrap gap-2">
                    {selectedSkills.map((skill) => (
                      <Badge
                        key={skill}
                        bg="primary"
                        className="cursor-pointer"
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill} ✕
                      </Badge>
                    ))}
                  </div>

                  {errors.skills && (
                    <div className="text-danger small mb-2">
                      {errors.skills}
                    </div>
                  )}

                  {/* Search + Add */}
                  <div className="d-flex gap-2 mb-2">
                    <Form.Control
                      placeholder="Search or add skill"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                    />
                    <Button variant="outline-secondary" onClick={addCustomSkill}>
                      Add
                    </Button>
                  </div>

                  {/* Available */}
                  <div className="bg-body-tertiary p-3 rounded border d-flex flex-wrap gap-2">
                    {skills
                      .filter((s) =>
                        s.toLowerCase().includes(skillInput.toLowerCase())
                      )
                      .map((skill) => (
                        <Badge
                          key={skill}
                          bg={
                            selectedSkills.includes(skill)
                              ? "secondary"
                              : "light"
                          }
                          text="dark"
                          className="cursor-pointer"
                          onClick={() => toggleSkill(skill)}
                        >
                          {skill}
                        </Badge>
                      ))}
                  </div>
                </Form.Group>

                {/* Description */}
                <Form.Group className="mb-4">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={job.description}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Actions */}
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleSubmit("draft")}
                  >
                    Save Draft
                  </Button>
                  <Button onClick={() => handleSubmit("published")}>
                    Publish Job
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* ================= RIGHT : INFO ================= */}
        <Col lg={4}>
          <Card className="shadow-sm border-0 mb-3">
            <Card.Body>
              <h6>Posting Tips</h6>
              <ul className="small text-muted mb-0">
                <li>Clear title = better visibility</li>
                <li>Add 5–8 relevant skills</li>
                <li>Salary boosts applications</li>
                <li>Remote jobs perform best</li>
              </ul>
            </Card.Body>
          </Card>

          <Card className="shadow-sm border-0">
            <Card.Body>
              <h6>Job Status</h6>
              <Badge bg={job.status === "draft" ? "secondary" : "success"}>
                {job.status.toUpperCase()}
              </Badge>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PostJob;
