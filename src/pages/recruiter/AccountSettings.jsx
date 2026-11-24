import {
  Container, Row, Col, Card, Form, Button,
  Tab, Nav, Modal, Badge, InputGroup, FormControl, ProgressBar
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/AccountSettings.css";

import LoginRestrictions from "./LoginRestrictions";
import ApiAccess from "./ApiAccess";
// import EmailPreferences from "./EmailPreferences";
import SecurityNotifications from "./SecurityNotifications";
import { changePassword, getUserSession, removeSession } from "../../services/accountService.js";
import AppAlert from "../../components/Alert";
import { logoutUser } from "../../services/loginService.js";

function AccountSettings() {
   const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] =
    useState({
      type: "info",
      message: "",
    });

  const [twoFA, setTwoFA] = useState(true);
  const [method, setMethod] = useState("otp");

  const [verified, setVerified] = useState({
    email: true,
    mobile: false,
    whatsapp: false,
  });

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [currentMethod, setCurrentMethod] = useState("");

  const handleMethodSelect = (type) => {
    setMethod(type);

    if (type === "otp" && !verified.mobile) {
      setCurrentMethod("mobile");
      setShowOtpModal(true);
    } else if (type === "whatsapp" && !verified.whatsapp) {
      setCurrentMethod("whatsapp");
      setShowOtpModal(true);
    } else if (type === "email" && !verified.email) {
      setCurrentMethod("email");
      setShowOtpModal(true);
    }
  };


  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // SESSIONS DATA
  const [sessions, setSessions] = useState([]);

  const fetchSessions = async () => {
  const res = await getUserSession();

  if (res.status === "success") {

    const currentJwtId = localStorage.getItem("token");

    const sessionData = res.data.sessions.map(session => ({
      id: session.id,
      device: `${session.browser} on ${session.os}`,
      location: "Unknown",
      ip: session.ip,
      lastActive: new Date(session.createdAt).toLocaleString(),
      current: session.jwtId === currentJwtId,
      jwtId: session.jwtId,
      status: session.status
    }));

    setSessions(sessionData);
  }
};

useEffect(() => {
    fetchSessions();
}, []);

  const [selectedSession, setSelectedSession] = useState(null); 

const handleRemove = async () => {
    if (!selectedSession) return;
    setLoading(true);
    try {
        const res = await removeSession(selectedSession.jwtId);
        if (res.status === "success") {
            setAlertConfig({
                type: "success",
                message: res.message
            });
            setShowAlert(true);
            setSelectedSession(null);
            fetchSessions();
        } else {
            setAlertConfig({
                type: "error",
                message: res.message
            });
            setShowAlert(true);
        }
    } catch (err) {
        setAlertConfig({
            type: "error",
            message: "Unable to remove session."
        });
        setShowAlert(true);
    } finally {
        setLoading(false);
    }
};

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const getStrength = (pwd) => {
    let score = 0;

    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    return score;
  };

  const strength = getStrength(passwords.new);

  const strengthLabel = [
    "Very Weak",
    "Weak",
    "Fair",
    "Strong",
    "Excellent",
  ];

  const strengthColor = [
    "danger",
    "warning",
    "info",
    "primary",
    "success",
  ];

  const handleChange = (field, value) => {
    setPasswords({ ...passwords, [field]: value });
  };

  const isMatch = passwords.new && passwords.new === passwords.confirm;

  // PASSWORD UPDATE
  const handlePasswordUpdate = async () => {

    if (!passwords.current) {
      setAlertConfig({
        type: "error",
        message: "Current password is required."
      });
      setShowAlert(true);
      return;
    }

    if (!passwords.new) {
      setAlertConfig({
        type: "error",
        message: "New password is required."
      });
      setShowAlert(true);
      return;
    }

    if (passwords.current === passwords.new) {
      setAlertConfig({
        type: "warning",
        message: "New password cannot be the same as current password."
      });
      setShowAlert(true);
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setAlertConfig({
        type: "error",
        message: "Passwords do not match."
      });
      setShowAlert(true);
      return;
    }

    if (strength < 2) {
      setAlertConfig({
        type: "warning",
        message: "Please choose a stronger password."
      });
      setShowAlert(true);
      return;
    }

    setLoading(true);
    try {

      const payload = {
        currentPassword: passwords.current.trim(),
        newPassword: passwords.new.trim()
      };

      const res = await changePassword(payload);
      if (res.status === "success") {

        setAlertConfig({
          type: "success",
          message: res?.message || "Password changed successfully. Logging out..."
        });

        setShowAlert(true);

        setShow({
          current: false,
          new: false,
          confirm: false
        });

        setPasswords({
          current: "",
          new: "",
          confirm: ""
        });

        // Wait so the user can see the success message
        setTimeout(async () => {
          try {
            await logoutUser();
          } finally {
            deleteCookie("_token");
            localStorage.clear();
            sessionStorage.clear();
            navigate("/login", { replace: true });
          }
        }, 1500);
      } else {

        setAlertConfig({
          type: "error",
          message: res.message || "Failed to update password"
        });
        setShowAlert(true);
      }

    } catch (error) {
      console.debug(error)
      setAlertConfig({
        type: "error",
        message: error.response?.data?.message ||
          "Unable to change password."
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="settings-page">
      {showAlert && (
        <AppAlert
          type={alertConfig.type}
          message={alertConfig.message}
          onClose={() => setShowAlert(false)}
        />
      )}

      <div className="settings-wrapper">

        <div className="page-header">
          <h3>Security & Settings</h3>
          <p className="text-muted">Manage your account security and preferences</p>
        </div>

        <Tab.Container defaultActiveKey="security">
          <Row className="g-4">

            {/* SIDEBAR */}
            <Col md={3}>
              <div className="sidebar">
                <Nav className="flex-column">
                  <Nav.Link eventKey="security"><i className="bi bi-shield-lock"></i> Security</Nav.Link>
                  <Nav.Link eventKey="password"><i className="bi bi-key"></i> Password</Nav.Link>
                  <Nav.Link eventKey="sessions"><i className="bi bi-laptop"></i> Sessions</Nav.Link>
                  <Nav.Link eventKey="login">
                    <i className="bi bi-globe"></i>
                    Login Restrictions
                  </Nav.Link>


                  <Nav.Link eventKey="api">
                    <i className="bi bi-code-slash"></i>
                    API Access
                  </Nav.Link>


                  {/* <Nav.Link eventKey="email">
                    <i className="bi bi-envelope"></i>
                    Email Preferences
                  </Nav.Link> */}


                  <Nav.Link eventKey="alerts">
                    <i className="bi bi-bell"></i>
                    Security Notifications
                  </Nav.Link>
                </Nav>
              </div>
            </Col>

            {/* CONTENT */}
            <Col md={9}>
              <Tab.Content>

                {/* SECURITY */}
                <Tab.Pane eventKey="security">
                  <Card className="card-modern">
                    <Card.Body>

                      <div className="card-header-custom">
                        <div>
                          <h5>Two-Factor Authentication</h5>
                          <small>Protect your account with an extra layer</small>
                        </div>

                        <Form.Check
                          type="switch"
                          checked={twoFA}
                          onChange={() => setTwoFA(!twoFA)}
                        />
                      </div>

                      {twoFA && (
                        <>
                          <hr />

                          <h6 className="section-title">Verification Methods</h6>

                          <div className="method-grid">

                            {/* SMS */}
                            <div
                              className={`method-box ${method === "otp" && "active"}`}
                              onClick={() => handleMethodSelect("otp")}
                            >
                              <div className="method-left">
                                <i className="bi bi-phone"></i>
                                <div>
                                  <strong>SMS OTP</strong>
                                  <p>Receive code via mobile</p>
                                </div>
                              </div>

                              {verified.mobile
                                ? <Badge bg="success"><i className="bi bi-check-circle"></i> Verified</Badge>
                                : <Button size="sm" variant="outline-primary">Verify</Button>}
                            </div>

                            {/* WhatsApp */}
                            <div
                              className={`method-box ${method === "whatsapp" && "active"}`}
                              onClick={() => handleMethodSelect("whatsapp")}
                            >
                              <div className="method-left">
                                <i className="bi bi-whatsapp"></i>
                                <div>
                                  <strong>WhatsApp OTP</strong>
                                  <p>Secure OTP via WhatsApp</p>
                                </div>
                              </div>

                              {verified.whatsapp
                                ? <Badge bg="success"><i className="bi bi-check-circle"></i> Verified</Badge>
                                : <Button size="sm" variant="outline-primary">Verify</Button>}
                            </div>

                            {/* EMAIL */}
                            <div
                              className={`method-box ${method === "email" && "active"}`}
                              onClick={() => handleMethodSelect("email")}
                            >
                              <div className="method-left">
                                <i className="bi bi-envelope"></i>
                                <div>
                                  <strong>Email OTP</strong>
                                  <p>Receive OTP on email</p>
                                </div>
                              </div>

                              {verified.email
                                ? <Badge bg="success"><i className="bi bi-check-circle"></i> Verified</Badge>
                                : <Button size="sm" variant="outline-primary">Verify</Button>}
                            </div>

                            {/* AUTH APP */}
                            <div
                              className={`method-box ${method === "auth" && "active"}`}
                              onClick={() => setMethod("auth")}
                            >
                              <div className="method-left">
                                <i className="bi bi-shield"></i>
                                <div>
                                  <strong>Authenticator App</strong>
                                  <p>Use Google Authenticator</p>
                                </div>
                              </div>
                            </div>

                          </div>

                          {method === "auth" && (
                            <div className="auth-card">
                              <div className="text-center">
                                <div className="qr-box mb-2">QR</div>
                                <small className="text-muted">
                                  Scan using authenticator app
                                </small>
                              </div>

                              <Form.Control placeholder="Enter 6-digit code" className="mt-3" />
                              <Button size="sm" className="mt-2">Verify</Button>
                            </div>
                          )}
                        </>
                      )}
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* PASSWORD */}
                <Tab.Pane eventKey="password">
                  <Card className="card-modern">
                    <Card.Body>

                      <div className="mb-3">
                        <h5>Password & Security</h5>
                        <small className="text-muted">
                          Use a strong password to keep your account secure
                        </small>
                      </div>

                      {/* CURRENT PASSWORD */}
                      <Form.Group className="mb-3">
                        <Form.Label>Current Password</Form.Label>
                        <InputGroup>
                          <FormControl
                            type={show.current ? "text" : "password"}
                            value={passwords.current}
                            onChange={(e) => handleChange("current", e.target.value)}
                          />
                          <Button variant="outline-secondary" onClick={() =>
                            setShow({ ...show, current: !show.current })
                          }>
                            <i className={`bi ${show.current ? "bi-eye-slash" : "bi-eye"}`}></i>
                          </Button>
                        </InputGroup>
                      </Form.Group>

                      {/* NEW PASSWORD */}
                      <Form.Group className="mb-2">
                        <Form.Label>New Password</Form.Label>
                        <InputGroup>
                          <FormControl
                            type={show.new ? "text" : "password"}
                            value={passwords.new}
                            onChange={(e) => handleChange("new", e.target.value)}
                          />
                          <Button variant="outline-secondary" onClick={() =>
                            setShow({ ...show, new: !show.new })
                          }>
                            <i className={`bi ${show.new ? "bi-eye-slash" : "bi-eye"}`}></i>
                          </Button>
                        </InputGroup>
                      </Form.Group>

                      {/* STRENGTH METER */}
                      {passwords.new && (
                        <div className="mb-3">
                          <ProgressBar
                            now={(strength / 5) * 100}
                            variant={strengthColor[strength - 1] || "danger"}
                            className="mb-1"
                            style={{ height: "6px" }}
                          />
                          <small className={`text-${strengthColor[strength - 1] || "danger"}`}>
                            {strengthLabel[strength - 1] || "Too Weak"}
                          </small>
                        </div>
                      )}

                      {/* CONFIRM PASSWORD */}
                      <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <InputGroup>
                          <FormControl
                            type={show.confirm ? "text" : "password"}
                            value={passwords.confirm}
                            onChange={(e) => handleChange("confirm", e.target.value)}
                            isInvalid={passwords.confirm && !isMatch}
                            isValid={passwords.confirm && isMatch}
                          />
                          <Button variant="outline-secondary" onClick={() =>
                            setShow({ ...show, confirm: !show.confirm })
                          }>
                            <i className={`bi ${show.confirm ? "bi-eye-slash" : "bi-eye"}`}></i>
                          </Button>
                        </InputGroup>

                        {!isMatch && passwords.confirm && (
                          <small className="text-danger">Passwords do not match</small>
                        )}
                      </Form.Group>

                      {/* PASSWORD RULES */}
                      <div className="password-rules mb-3">
                        <small className="text-muted d-block">Password must contain:</small>
                        <ul>
                          <li>At least 8 characters</li>
                          <li>1 uppercase letter</li>
                          <li>1 number</li>
                          <li>1 special character</li>
                        </ul>
                      </div>

                      {/* ACTION */}
                      <Button
                        disabled={
                          loading ||
                          !passwords.current ||
                          !passwords.new ||
                          !passwords.confirm ||
                          !isMatch ||
                          strength < 3
                        }
                        onClick={handlePasswordUpdate}
                      >
                        {loading ? "Updating..." : "Update Password"}
                      </Button>

                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* SESSIONS */}
                <Tab.Pane eventKey="sessions">
                  <Card className="card-modern">
                    <Card.Body>

                      <div className="mb-3">
                        <h5>Active Sessions</h5>
                        <small className="text-muted">
                          Manage and monitor devices logged into your account
                        </small>
                      </div>

                      <div className="session-list">
                        {sessions.map(session => (
                          <div
                            key={session.id}
                            className={`session-card ${session.current ? "current" : ""}`}
                          >
                            <div className="session-icon">
                              <i className={`bi ${session.current ? "bi-laptop" : "bi-phone"}`}></i>
                            </div>

                            <div className="session-details">
                              <div className="d-flex justify-content-between align-items-center">
                                <strong>{session.device}</strong>

                                {session.current && (
                                  <Badge bg="success">Current Device</Badge>
                                )}
                              </div>

                              <div className="session-meta">
                                <span>
                                  <i className="bi bi-wifi"></i> {session.ip}
                                </span>

                                <span>
                                  <i className="bi bi-clock"></i> {session.lastActive}
                                </span>

                                <span>
                                  <Badge bg={session.status === "LOGIN" ? "success" : "secondary"}>
                                    {session.status}
                                  </Badge>
                                </span>
                              </div>
                            </div>

                            {!session.current && (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => setSelectedSession(session)}
                              >
                                Logout
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* LOGOUT ALL */}
                      <div className="mt-4 text-end">
                        <Button variant="danger">
                          Logout All Devices
                        </Button>
                      </div>

                    </Card.Body>
                  </Card>

                  {/* CONFIRM REMOVE */}
                  <Modal
                    show={!!selectedSession}
                    onHide={() => setSelectedSession(null)}
                    centered
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Remove Session</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                      {selectedSession && (
                        <>
                          <p>
                            Remove access for <strong>{selectedSession.device}</strong>?
                          </p>
                          <small className="text-muted">
                            This device will be logged out immediately.
                          </small>
                        </>
                      )}
                    </Modal.Body>

                    <Modal.Footer>
                      <Button variant="secondary" onClick={() => setSelectedSession(null)}>
                        Cancel
                      </Button>
                      <Button variant="danger" onClick={handleRemove}>
                        Remove
                      </Button>
                    </Modal.Footer>
                  </Modal>

                </Tab.Pane>

                <Tab.Pane eventKey="login">
                  <LoginRestrictions />
                </Tab.Pane>


                <Tab.Pane eventKey="api">
                  <ApiAccess />
                </Tab.Pane>


                {/* <Tab.Pane eventKey="email">
                  <EmailPreferences />
                </Tab.Pane> */}


                <Tab.Pane eventKey="alerts">
                  <SecurityNotifications />
                </Tab.Pane>

              </Tab.Content>
            </Col>

          </Row>
        </Tab.Container>

        {/* OTP MODAL */}
        <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Verify {currentMethod}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p className="text-muted">
              Enter the OTP sent to your {currentMethod}
            </p>

            <Form.Control placeholder="Enter OTP" className="mb-3" />

            <Button
              className="w-100"
              onClick={() => {
                setVerified(prev => ({
                  ...prev,
                  [currentMethod]: true
                }));
                setShowOtpModal(false);
              }}
            >
              Verify
            </Button>
          </Modal.Body>
        </Modal>

      </div>
    </Container>
  );
}
export default AccountSettings;