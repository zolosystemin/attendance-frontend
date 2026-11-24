import React, { useState } from "react";
import {
    Container, Row, Col, Card, Button, Image,
    Modal, Form, Badge, ProgressBar
} from "react-bootstrap";

import {
    FaEdit, FaCamera, FaCrown, FaPowerOff,
    FaShieldAlt, FaStar, FaCheckCircle,
    FaLinkedin, FaGithub, FaTwitter,
    FaBuilding, FaMapMarkerAlt, FaChartLine,
    FaRegNewspaper
} from "react-icons/fa";

const RecruiterProfile = () => {

    const [edit, setEdit] = useState(false);
    const [upgrade, setUpgrade] = useState(false);
    const [deactivate, setDeactivate] = useState(false);
    const [editSocial, setEditSocial] = useState(false);

    // MAIN PROFILE (UNCHANGED STRUCTURE)
    const [profile, setProfile] = useState({
        name: "Aman Verma",
        company: "HireHub AI",
        location: "New Delhi, India",
        email: "aman@hirehub.ai",
        mobile: "+91 9876543210",
        website: "https://hirehub.ai",

        bio: "AI-powered recruitment platform helping companies hire top talent 10x faster.",

        plan: "Pro",
        status: "Active",

        rating: 4.8,
        trustScore: 89,
        healthScore: 84,

        linkedin: "linkedin.com/in/amanverma",
        github: "github.com/amanverma",
        twitter: "twitter.com/amanverma",

        gst: "07ABCDE1234F1Z5",
        pan: "ABCDE1234F",
        employees: "120+",
        turnover: "₹25 Cr",

        fundingStage: "Series A",
        investors: "Sequoia Capital, Accel, AngelList India",

        activity: [
            "Launched AI Resume Screening Engine",
            "Hired 25+ engineers",
            "Expanded to UAE market",
            "Processed 1M+ candidates"
        ],

        profileImage:
            "https://randomuser.me/api/portraits/men/32.jpg"
    });

    // EDIT BUFFER (SAFE EDIT SYSTEM)
    const [editData, setEditData] = useState(profile);
    const [newImage, setNewImage] = useState(null);

    const openEdit = () => {
        setEditData(profile);
        setNewImage(null);
        setEdit(true);
    };

    const saveEdit = () => {
        setProfile({
            ...profile,
            ...editData,
            profileImage: newImage || profile.profileImage
        });
        setEdit(false);
    };

    const handleDeactivate = () => {
        setProfile({ ...profile, status: "Deactivated" });
        setDeactivate(false);
    };

    return (
        <Container fluid className="bg-light py-4">

            {/* ================= HEADER (UNCHANGED + ENHANCED ONLY) ================= */}
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">

                <div style={{
                    height: "180px",
                    background: "linear-gradient(135deg,#0a66c2,#004182)"
                }} />

                <Card.Body>

                    <div className="d-flex justify-content-between flex-wrap">

                        {/* LEFT PROFILE */}
                        <div className="d-flex gap-3">

                            <div style={{ position: "relative", marginTop: "-60px" }}>

                                <Image
                                    src={newImage || profile.profileImage}
                                    roundedCircle
                                    width={120}
                                    height={120}
                                    className="border border-4 border-white shadow"
                                />

                            </div>

                            <div>

                                <h3 className="mb-1">
                                    {profile.name} <FaCheckCircle className="text-primary" />
                                </h3>

                                <div className="text-muted">
                                    <FaBuilding className="me-2" />
                                    {profile.company}
                                </div>

                                <div className="text-muted">
                                    <FaMapMarkerAlt className="me-2" />
                                    {profile.location}
                                </div>

                                <div className="mt-2 small text-muted">
                                    {profile.email} | {profile.mobile}
                                </div>

                                {/* BADGES (UNCHANGED) */}
                                <div className="mt-2 d-flex gap-2 flex-wrap">

                                    <Badge bg="success">{profile.status}</Badge>

                                    <Badge bg="warning" text="dark">
                                        <FaStar className="me-1" />
                                        {profile.rating}
                                    </Badge>

                                    <Badge bg="primary">
                                        <FaShieldAlt className="me-1" />
                                        Trust {profile.trustScore}
                                    </Badge>

                                    <Badge bg="info">{profile.plan}</Badge>

                                </div>

                            </div>

                        </div>

                        {/* ACTIONS */}
                        <div className="d-flex flex-column gap-2 mt-3 mt-md-0">

                            <Button onClick={openEdit}>
                                <FaEdit className="me-2" />
                                Edit Profile
                            </Button>

                            <Button variant="outline-warning" onClick={() => setUpgrade(true)}>
                                <FaCrown className="me-2" />
                                Upgrade
                            </Button>

                            <Button variant="outline-danger" onClick={() => setDeactivate(true)}>
                                <FaPowerOff className="me-2" />
                                Deactivate
                            </Button>

                        </div>

                    </div>

                    {/* PROGRESS (UNCHANGED) */}
                    <div className="mt-3">
                        <small>AI Trust Score</small>
                        <ProgressBar now={profile.trustScore} className="mb-2" />

                        <small>AI Company Health Score</small>
                        <ProgressBar now={profile.healthScore} variant="success" />
                    </div>

                </Card.Body>
            </Card>

            {/* ================= ABOUT (UNCHANGED) ================= */}
            <Card className="mt-4 border-0 shadow-sm rounded-4">
                <Card.Body>
                    <h5>About</h5>
                    <p className="text-muted">{profile.bio}</p>
                </Card.Body>
            </Card>

            {/* ================= SOCIAL (UNCHANGED) ================= */}
            <Card className="mt-4 border-0 shadow-sm rounded-4">
  <Card.Body>

    <div className="d-flex justify-content-between align-items-center">
      <h5 className="mb-0">Social Links</h5>

      <Button
        size="sm"
        variant={editSocial ? "success" : "outline-primary"}
        onClick={() => setEditSocial(!editSocial)}
      >
        {editSocial ? "Done" : "Edit"}
      </Button>
    </div>

    {/* ================= VIEW MODE ================= */}
    {!editSocial ? (
      <div className="d-flex flex-column gap-2 mt-3">

        {profile.linkedin && (
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <FaLinkedin className="me-2 text-primary" />
              {profile.linkedin}
            </div>
          </div>
        )}

        {profile.github && (
          <div>
            <FaGithub className="me-2" />
            {profile.github}
          </div>
        )}

        {profile.twitter && (
          <div>
            <FaTwitter className="me-2 text-info" />
            {profile.twitter}
          </div>
        )}

      </div>
    ) : (

      /* ================= EDIT MODE ================= */
      <div className="mt-3">

        <Form.Control
          className="mb-2"
          placeholder="LinkedIn URL"
          value={profile.linkedin}
          onChange={(e) =>
            setProfile({ ...profile, linkedin: e.target.value })
          }
        />

        <Form.Control
          className="mb-2"
          placeholder="GitHub URL"
          value={profile.github}
          onChange={(e) =>
            setProfile({ ...profile, github: e.target.value })
          }
        />

        <Form.Control
          className="mb-2"
          placeholder="Twitter URL"
          value={profile.twitter}
          onChange={(e) =>
            setProfile({ ...profile, twitter: e.target.value })
          }
        />

        {/* REMOVE ACTION */}
        <div className="d-flex gap-2 mt-2">

          <Button
            size="sm"
            variant="danger"
            onClick={() =>
              setProfile({
                ...profile,
                linkedin: "",
                github: "",
                twitter: ""
              })
            }
          >
            Clear All
          </Button>

        </div>

      </div>

    )}

  </Card.Body>
</Card>

            {/* ================= COMPANY DETAILS (UNCHANGED) ================= */}
            <Card className="mt-4 border-0 shadow-sm rounded-4">
                <Card.Body>

                    <h5>Company Details</h5>

                    <Row className="g-3 mt-2">

                        <Col md={6}><b>PAN:</b> {profile.pan}</Col>
                        <Col md={6}><b>GST:</b> {profile.gst}</Col>
                        <Col md={6}><b>Employees:</b> {profile.employees}</Col>
                        <Col md={6}><b>Turnover:</b> {profile.turnover}</Col>

                    </Row>

                </Card.Body>
            </Card>

            {/* ================= FUNDING (UNCHANGED) ================= */}
            <Card className="mt-4 border-0 shadow-sm rounded-4">
                <Card.Body>

                    <h5>Funding</h5>

                    <div><b>Stage:</b> {profile.fundingStage}</div>
                    <div><b>Investors:</b> {profile.investors}</div>

                </Card.Body>
            </Card>

            {/* ================= ACTIVITY (UNCHANGED) ================= */}
            <Card className="mt-4 border-0 shadow-sm rounded-4">
                <Card.Body>

                    <h5>
                        <FaRegNewspaper className="me-2" />
                        Company Activity
                    </h5>

                    <ul className="mt-2">
                        {profile.activity.map((a, i) => (
                            <li key={i}>
                                <FaChartLine className="me-2 text-primary" />
                                {a}
                            </li>
                        ))}
                    </ul>

                </Card.Body>
            </Card>

            {/* ================= EDIT MODAL (IMPROVED BUT SAME STRUCTURE) ================= */}
            <Modal show={edit} onHide={() => setEdit(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    {/* PROFILE IMAGE */}
                    <Form.Group className="mb-3">
                        <Form.Label>Profile Image</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) setNewImage(URL.createObjectURL(file));
                            }}
                        />
                    </Form.Group>

                    {/* BASIC INFO */}
                    <Form.Control
                        className="mb-2"
                        placeholder="Name"
                        value={editData.name}
                        onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                        }
                    />

                    <Form.Control
                        className="mb-2"
                        placeholder="Company"
                        value={editData.company}
                        onChange={(e) =>
                            setEditData({ ...editData, company: e.target.value })
                        }
                    />

                    <Form.Control
                        className="mb-2"
                        placeholder="Location"
                        value={editData.location}
                        onChange={(e) =>
                            setEditData({ ...editData, location: e.target.value })
                        }
                    />

                    <Form.Control
                        style={{ height: "70px" }}
                        as="textarea"
                        rows={3}
                        placeholder="Write a short professional summary..."
                        value={editData.bio}
                        onChange={(e) =>
                            setEditData({ ...editData, bio: e.target.value })
                        }
                    />

                    {/* ================= COMPANY DETAILS ================= */}
                    <br />
                    <h6 className="text-muted">Company Details</h6>

                    <Form.Control
                        className="mb-2"
                        placeholder="PAN"
                        value={editData.pan}
                        onChange={(e) =>
                            setEditData({ ...editData, pan: e.target.value })
                        }
                    />

                    <Form.Control
                        className="mb-2"
                        placeholder="GST"
                        value={editData.gst}
                        onChange={(e) =>
                            setEditData({ ...editData, gst: e.target.value })
                        }
                    />

                    <Form.Control
                        className="mb-2"
                        placeholder="Employees"
                        value={editData.employees}
                        onChange={(e) =>
                            setEditData({ ...editData, employees: e.target.value })
                        }
                    />

                    <Form.Control
                        className="mb-2"
                        placeholder="Turnover"
                        value={editData.turnover}
                        onChange={(e) =>
                            setEditData({ ...editData, turnover: e.target.value })
                        }
                    />

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEdit(false)}>
                        Cancel
                    </Button>
                    <Button onClick={saveEdit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ================= UPGRADE (UNCHANGED) ================= */}
            <Modal show={upgrade} onHide={() => setUpgrade(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Upgrade Plan</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Card className="p-3 mb-2">Pro</Card>
                    <Card className="p-3 border-primary">Enterprise</Card>
                </Modal.Body>
            </Modal>

            {/* ================= DEACTIVATE (SAFE) ================= */}
            <Modal show={deactivate} onHide={() => setDeactivate(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-danger">
                        Deactivate Account
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Are you sure you want to deactivate your account?
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDeactivate(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeactivate}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container>
    );
};

export default RecruiterProfile;