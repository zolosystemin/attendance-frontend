import { Container, Row, Col, Card, Form, Button, Modal, InputGroup } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "./css/Register.css";
import AppAlert from "../components/Alert.jsx";
import { getCookie, setCookie, deleteCookie } from "../utils/cookie.js";
import { getSession } from "../services/session.js"
import { registerCanndidate } from "../services/registrationService.js";

export default function Register() {
  
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: "info",
    message: ""
  });

  // CALL SESSION API
  const sessionToken = getCookie("_pre_session");

  const { data } = useQuery({
    queryKey: ["session"],
    queryFn: getSession,
    enabled: !sessionToken,
  });

  useEffect(() => {
    if (!data?.data) return;
    console.log("Session API response:", data);

    const { brwId, preSid } = data.data;
    localStorage.setItem("brwId", brwId);
    localStorage.setItem("preSid", preSid);

    setCookie("_pre_session", preSid);
    setCookie("_brw_id", brwId);

  }, [data]);

  useEffect(() => {
    const token = getCookie("_token");
    const role = localStorage.getItem("role");
    if (token && role) {
      navigate(`/${role.toLowerCase()}/dashboard`, { replace: true });
    }
  }, [navigate]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    dateOfBirth: "",
    gender: "",
    password: "",
    confirmPassword: "",
    workStatus: "",
    updatesConsent: false
  });

  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [verified, setVerified] = useState({ email: false, mobile: false });
  const [timer, setTimer] = useState(60);
  const [target, setTarget] = useState("");

  useEffect(() => {
    if (!showOtp || timer === 0) return;
    const t = setInterval(() => setTimer(v => v - 1), 1000);
    return () => clearInterval(t);
  }, [showOtp, timer]);

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);


    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOtpPaste = e => {
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;

    setOtp(pasted.split(""));
  };


  const handleChange = e => {
    const { name, value } = e.target;

    setForm(prev => ({ ...prev, [name]: value }));

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];   // ✅ cleaner
      return newErrors;
    });
  };

  // const handleChange = e =>
  //   setForm({ ...form, [e.target.name]: e.target.value });

  // const sendOtp = type => {
  //   if (type === "email" && !/\S+@\S+\.\S+/.test(form.email)) {

  //     setAlertConfig({
  //       type: "error",
  //       message: "Enter valid email"
  //     });
  //     setShowAlert(true);

  //     return;
  //   }
  //   if (type === "mobile" && form.mobile.length < 8) {
  //     setAlertConfig({
  //       type: "error",
  //       message: "Enter valid Mobile Number"
  //     });
  //     setShowAlert(true);
  //     return;
  //   }
  //   setTarget(type);
  //   setTimer(60);
  //   setShowOtp(true);
  // };

  // const verifyOtp = (enteredOtp) => {
  //   if (enteredOtp === "123456") {
  //     setVerified(v => ({ ...v, [target]: true }));
  //     setShowOtp(false);
  //     setOtp(Array(6).fill("")); // reset
  //   } else {
  //     setAlertConfig({
  //       type: "error",
  //       message: "Invalid OTP"
  //     });
  //     setShowAlert(true);
  //   }
  // };

  /* ================= MASK TARGET ================= */
  const maskTarget = (value) => {
    if (!value) return "";

    // Email
    if (value.includes("@")) {
      const [name, domain] = value.split("@");
      return `${name.slice(0, 2)}***@${domain}`;
    }

    // Mobile
    return value.replace(/.(?=.{4})/g, "*");
  };

  /* ================= VALIDATE FORM ================= */
  const validateForm = () => {
    const errors = {};

    if (!form.firstName) {
      errors.firstName = "First Name is required";
    }

    if (!form.lastName) {
      errors.lastName = "Last Name is required";
    }

    if (!form.dateOfBirth) {
      errors.dateOfBirth = "Date of Birth is required";
    }

    if (!form.gender) {
      errors.gender = "Gender is required";
    }

    if (!form.password) {
      errors.password = "Password is required";
    } else {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
      if (!passwordRegex.test(form.password)) {
        errors.password = "Password must be at least 8 characters long and include letters and numbers";
      }
    }

    if (!form.confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    } else {
      if (form.confirmPassword != form.password) {
        errors.confirmPassword = "Password & confirm password should be same";
      }
    }

    if (!form.workStatus) {
      errors.workStatus = "Work Status is required";
    }

    if (!form.mobile) {
      errors.mobile = "Mobile No is required";
    } else if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      errors.mobile = "Invalid Mobile No";
    }

    if (!form.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Invalid Email";
    }

    return errors;
  };

  const [errors, setErrors] = useState({});
  /* ================= HANDLE SUBMIT ================= */
  const handleSubmit = async e => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return; // stop submit
    }

    // Collect form data
    const getValue = (val) => {
      if (typeof val === "string") val = val.trim();
      return val === "" || val === undefined || val === null ? null : val;
    };

    const data = {
      email: getValue(form.email),
      countryCode: "+91",
      mobile: getValue(form.mobile),
      password: getValue(form.password),
      confirmPassword: getValue(form.password),
      firstName: getValue(form.firstName),
      lastName: getValue(form.lastName),
      dateOfBirth: getValue(form.dateOfBirth),
      gender: getValue(form.gender),
      workStatus: getValue(form.workStatus),
      alloweNotifications: form.updatesConsent || false
    };

    // API call placeholder
    console.log("Register Payload:", form);
    const apiResponse = await registerCanndidate(data);
    //const apiResponse = res?.data || res;

    console.log("Register api response:", apiResponse);

    // Navigate to error page for 500
    if (apiResponse.status === "error") {
      navigate("/error", {
        state: {
          message: apiResponse?.message || "Registration Failed",
          status: apiResponse.status || 500
        }
      });
      return;
    }

    // Reload to page to restore prelogin state if session expired
    if (apiResponse.status === "expire") {
      deleteCookie("_brw_id");
      deleteCookie("_pre_session");
      localStorage.removeItem("brwId");
      localStorage.removeItem("preSid");
      navigate("/register", {
        state: {
          message: apiResponse?.message || "Session Expired. Please try again.",
          status: apiResponse.status || 500
        }
      });
      return;
    }

    if (apiResponse.status === "failure") {

      const rawErrors =
        apiResponse.data ||
        apiResponse.errors ||
        apiResponse.validationErrors ||
        {};

      console.log("RAW ERRORS:", rawErrors);

      const apiErrors = mapApiErrors(rawErrors);

      setErrors(apiErrors); // 🔥 replace instead of merge

      setAlertConfig({
        type: "error",
        message: apiResponse.message || "Please fix highlighted errors"
      });
      setShowAlert(true);

      return; // 🚨 IMPORTANT: stop further execution
    }

    // if (apiResponse.status === "failure" && apiResponse?.data) {
    //   const apiErrors = mapApiErrors(apiResponse.data);

    //   setErrors(prev => ({
    //     ...prev,
    //     ...apiErrors
    //   }));

    //   setAlertConfig({
    //     type: "error",
    //     message: apiResponse.message || "Please fix highlighted errors"
    //   });
    //   setShowAlert(true);
    // }

    if (apiResponse.status === "success") {

      setAlertConfig({
        type: "success",
        message: "Registered successfully"
      });
      setShowAlert(true);

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000); // 3 seconds
    }

    return;
  };

  const mapApiErrors = (apiErrors) => {
    const mapped = {};

    const fieldMap = {
      email: "email",
      countryCode: "countryCode",
      mobile: "mobile",
      password: "password",
      firstName: "firstName",
      lastName: "lastName",
      dateOfBirth: "dateOfBirth",
      gender: "gender",
      workStatus: "workStatus"
    };

    Object.entries(apiErrors).forEach(([key, value]) => {
      const formKey = fieldMap[key] || key;
      mapped[formKey] = value;
    });

    return mapped;
  };

  useEffect(() => {
    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey) {
      const el = document.querySelector(`[name="${firstErrorKey}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus();
    }
  }, [errors]);

  return (
    <Container fluid className="light-auth">
      {showAlert && (
        <AppAlert
          type={alertConfig.type}
          message={alertConfig.message}
          onClose={() => setShowAlert(false)}
        />
      )}
      <Row className="w-100 min-vh-100">

        {/* LEFT – FORM */}
        <Col lg={8} className="form-side">
          <Card className="light-card">
            <Card.Body className="position-relative p-0">
              <div className="form-scroll p-5">

                <Button
                  variant="link"
                  className="back-btn"
                  onClick={() => navigate("/")}
                >
                  ← Back to Home
                </Button>

                <h5>Create your <span className="hireSkills">hireSkills</span> account</h5>
                <small className="text-secondary mt-0 mb-4 d-block">
                  Grow with HireSkills to hire smarter and faster.
                </small>

                <Form onSubmit={handleSubmit}>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email <span style={{ color: "red" }}>*</span></Form.Label>
                        <InputGroup>
                          <Form.Control name="email"
                            value={form.email}
                            onChange={handleChange}
                            isInvalid={!!errors.email} />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                          {/* <Button
                            variant="outline-primary"
                            disabled={verified.email}
                            onClick={() => sendOtp("email")}
                          >
                            {verified.email ? "✔" : "Verify"}
                          </Button> */}
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Mobile <span style={{ color: "red" }}>*</span></Form.Label>

                        <InputGroup className="mobile-group">
                          {/* Country code */}
                          <Form.Select className="country-code">
                            <option>🇮🇳 +91</option>
                            <option>🇺🇸 +1</option>
                          </Form.Select>

                          {/* Mobile input (auto expands) */}
                          <Form.Control
                            name="mobile"
                            value={form.mobile}
                            onChange={handleChange}
                            isInvalid={!!errors.mobile}
                            placeholder="Mobile number"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.mobile}
                          </Form.Control.Feedback>

                          {/* Verify */}
                          {/* <Button
                            variant="outline-primary"
                            disabled={verified.mobile}
                            onClick={() => sendOtp("mobile")}
                          >
                            {verified.mobile ? "✔" : "Verify"}
                          </Button> */}
                        </InputGroup>
                      </Form.Group>
                    </Col>

                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>First Name <span style={{ color: "red" }}>*</span></Form.Label>
                        <Form.Control name="firstName" onChange={handleChange} isInvalid={!!errors.firstName} />
                        <Form.Control.Feedback type="invalid">
                          {errors.firstName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name <span style={{ color: "red" }}>*</span></Form.Label>
                        <Form.Control name="lastName" onChange={handleChange} isInvalid={!!errors.lastName} />
                        <Form.Control.Feedback type="invalid">
                          {errors.lastName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth <span style={{ color: "red" }}>*</span></Form.Label>
                    <Form.Control type="date" name="dateOfBirth" onChange={handleChange} isInvalid={!!errors.dateOfBirth} />
                    <Form.Control.Feedback type="invalid">
                      {errors.dateOfBirth}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>
                      Gender <span style={{ color: "red" }}>*</span>
                    </Form.Label>

                    <div className={`d-flex gap-4 ${errors.gender ? "is-invalid" : ""}`}>
                      <Form.Check
                        type="radio"
                        label="Male"
                        name="gender"
                        value="Male"
                        onChange={handleChange}
                      />
                      <Form.Check
                        type="radio"
                        label="Female"
                        name="gender"
                        value="Female"
                        onChange={handleChange}
                      />
                      <Form.Check
                        type="radio"
                        label="Other"
                        name="gender"
                        value="Other"
                        onChange={handleChange}
                      />
                    </div>

                    {errors.gender && (
                      <div className="invalid-feedback d-block">
                        {errors.gender}
                      </div>
                    )}
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Password <span style={{ color: "red" }}>*</span></Form.Label>
                        <Form.Control type="password" name="password" onChange={handleChange} isInvalid={!!errors.password} />
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>Confirm Password <span style={{ color: "red" }}>*</span></Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          onChange={handleChange}
                          isInvalid={!!errors.confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.confirmPassword}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Work Status */}
                  <Form.Group className="mb-">
                    <Form.Label className="fw-semibold">Work Status <span style={{ color: "red" }}>*</span></Form.Label>

                    <div className="work-status-wrapper">
                      <Form.Check
                        type="radio"
                        name="workStatus"
                        id="experienced"
                        value="EXPERIENCED"
                        checked={form.workStatus === "EXPERIENCED"}
                        onChange={handleChange}
                        isInvalid={!!errors.workStatus}
                        label={
                          <div>
                            <strong>I'm experienced</strong>
                            <div className="text-muted small">
                              I have work experience (excluding internships)
                            </div>
                          </div>
                        }
                        className="work-status-option"
                      />

                      <Form.Check
                        type="radio"
                        name="workStatus"
                        id="fresher"
                        value="FRESHER"
                        checked={form.workStatus === "FRESHER"}
                        onChange={handleChange}
                        isInvalid={!!errors.workStatus}
                        label={
                          <div>
                            <strong>I'm a fresher</strong>
                            <div className="text-muted small">
                              I am a student / Haven't worked after graduation
                            </div>
                          </div>
                        }
                        className="work-status-option"
                      />
                    </div>
                    <Form.Control.Feedback type="invalid" className="d-block">
                      {errors.workStatus}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Updates Consent */}
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      id="updatesConsent"
                      checked={form.updatesConsent}
                      onChange={e =>
                        setForm({ ...form, updatesConsent: e.target.checked })
                      }
                      className={errors.updatesConsent ? "is-invalid" : ""}
                      label={
                        <span className="small text-muted">
                          Send me important updates & promotions via SMS, email, and WhatsApp
                        </span>
                      }
                    />

                    {errors.updatesConsent && (
                      <div className="invalid-feedback d-block">
                        {errors.updatesConsent}
                      </div>
                    )}
                  </Form.Group>

                  <p className="terms-text mt-3">
                    By clicking <strong>Register</strong>, you agree to the{" "}
                    <a href="#">Terms and Conditions</a> &{" "}
                    <a href="#">Privacy Policy</a> of hireSkills
                  </p>

                  <Button type="submit" className="w-100 primary-btn">
                    Register Account
                  </Button>


                  <p className="text-center mt-3 small text-muted">
                    Already have an account?{" "}
                    <Link to="/login" className="register-link">Login</Link>
                  </p>
                </Form>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* RIGHT – BENEFITS */}
        <Col lg={4} className="benefit-side d-none d-lg-flex">
          <div className="benefit-wrapper">
            <h1>HireSkill</h1>
            <p className="tagline">
              Enterprise Hiring & Skill Intelligence
            </p>

            <div className="benefit-card">
              <span>🧠</span>
              <div>
                <h6>AI-Powered Hiring</h6>
                <p>Smart candidate & skill matching</p>
              </div>
            </div>

            <div className="benefit-card">
              <span>🔐</span>
              <div>
                <h6>Enterprise Security</h6>
                <p>End-to-end encrypted data</p>
              </div>
            </div>

            <div className="benefit-card">
              <span>📊</span>
              <div>
                <h6>Real-Time Analytics</h6>
                <p>Measure hiring performance instantly</p>
              </div>
            </div>
          </div>
        </Col>

      </Row>

      {/* OTP MODAL */}
      <Modal
        show={showOtp}
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => setShowOtp(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Verify OTP</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className="text-muted small mb-3">
            OTP has been sent to <strong>
              {target === "email"
                ? maskTarget(form.email)
                : maskTarget(form.mobile)}
            </strong>
          </p>

          <div
            className="d-flex justify-content-between gap-2 mb-3"
            onPaste={handleOtpPaste}
          >
            {otp.map((digit, index) => (
              <Form.Control
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(e.target.value, index)}
                onKeyDown={e => handleOtpKeyDown(e, index)}
                className="otp-input text-center"
              />
            ))}
          </div>

          <div className="d-flex justify-content-between">
            <span className="text-muted">
              {timer > 0 ? `Resend in ${timer}s` : "Didn’t receive OTP?"}
            </span>

            {timer === 0 && (
              <Button variant="link" className="p-0" onClick={() => sendOtp(target)}>
                Resend
              </Button>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={() => verifyOtp(otp.join(""))}>
            Verify
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}