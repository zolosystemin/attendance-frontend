import {
  Container, Row, Col, Card, Form, Button, Modal, InputGroup
} from "react-bootstrap";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppAlert from "../components/Alert.jsx";
import { REGEX } from "../utils/regex";
import { getCookie, setCookie, deleteCookie } from "../utils/cookie.js";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "../services/session.js"
import { verifyCompanyWithMCA, registerCompany } from "../services/registrationService.js";
import logoImg from "../assets/logo.png";

export default function PartnerRegister() {
  const navigate = useNavigate();
  const [isVerifyingCompany, setIsVerifyingCompany] = useState(false);
  const [verifiedCompany, setVerifiedCompany] = useState(false);

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

  // CALL SESSION API
  const [hasPreSid, setHasPreSid] = useState(false);

  useEffect(() => {
    setHasPreSid(!!localStorage.getItem("preSid"));
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [showCnfPassword, setShowCnfPassword] = useState(false);

  /* ================= ALERT ================= */
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: "info",
    message: ""
  });

  /* ================= FORM ================= */
  const [form, setForm] = useState({
    company_name: "",
    company_registration_no: "",
    company_type: "",
    company_pan: "",
    company_gst: "",
    director_name: "",
    Year_of_estd: "",
    Company_logo: "",
    company_address: "",
    company_country: "",
    company_turnover: "",
    company_description: "",
    no_of_employee: "",
    website_url: "",
    email: "",
    mobile: "",
    password: "",
    cnfpassword: ""
  });

  /* ================= OTP ================= */
  const [showOtp, setShowOtp] = useState(false);
  const [resetKey, setResetKey] = useState(0);
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

  // reset otp
  const resetOtp = () => {
    setOtp(Array(6).fill(""));
    setResetKey(prev => prev + 1);
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

  // Generate OTP
  const sendOtp = async (type) => {

    console.log("sendOtp triggered:", type);
    if (type === "email" && !REGEX.EMAIL.test(form.email)) {
      setAlertConfig({ type: "error", message: "Enter valid email" });
      setShowAlert(true);
      return;
    }

    // if (type === "mobile" && form.mobile.length < 8) {
    //   setAlertConfig({ type: "error", message: "Enter valid Mobile Number" });
    //   setShowAlert(true);
    //   return;
    // }

    let otpType = type === "email" ? 2 : 1;
    let otpRecipient = type === "email" ? form.email : form.mobile;
    setTarget(type);  // IMPORTANT

    try {
      const res = await generateRegistrationOtp(otpType, otpRecipient);
      //console.log("res : " , res);

      // Storing pression and brwid in session
      localStorage.setItem("preSid", res.data.preSid);
      localStorage.setItem("brwId", res.data.brwId);

      // Navigate to error page for 500
      if (res.status === "error") {
        navigate("/error", {
          state: {
            message: res.message,       // send the server message
            status: err.response.status
          }
        });
        return; // stop further execution
      }

      if (res.status === "success") {
        setTimer(60);
        setShowOtp(true);
      } else {
        setAlertConfig({ type: "error", message: res.message });
        setShowAlert(true);
        return;
      }
    } catch (err) {
      setAlertConfig({ type: "error", message: err.message });
      setShowAlert(true);
      return;
    }
  };

  // resend otp
  const resendOtp = async () => {

    const res = await resendRegistrationOtp();

    if (res.status === "error") {
      navigate("/error", {
        state: {
          message: res?.message || "Internal Server Error",
          status: res.status || 500
        }
      });
      return;
    }

    if (res.status === "success") {
      resetOtp();
      setTimer(60);
      setShowOtp(true);  // keep modal open only on success  

      setAlertConfig({
        type: "success",
        message: res.message
      });
      setShowAlert(true);
    } else {
      setAlertConfig({
        type: "error",
        message: res.message || "Failed to resend otp"
      });
      setShowAlert(true);
    }
  }

  // verify otp
  const verifyOtp = async (enteredOtp) => {

    const res = await verifyRegistrationOtp(enteredOtp);
    //console.log("res : ", res);

    // Navigate to error page for 500
    if (res.status === "error") {
      navigate("/error", {
        state: {
          message: res?.message || "Internal Server Error",
          status: res.status || 500
        }
      });
      return;
    }

    if (res.status === "success") {
      setVerified(v => ({ ...v, [target]: true }));
      setShowOtp(false);
      setOtp(Array(6).fill("")); // reset

    } else {
      setAlertConfig({
        type: "error",
        message: res.message || "Invalod OTP"
      });
      setShowAlert(true);
    }
  };

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

    if (!form.company_name) {
      errors.company_name = "Company Name is required";
    }

    if (!form.company_type) {
      errors.company_type = "Company Type is required";
    }

    if (!form.company_registration_no) {
      errors.company_registration_no = "Registration Number is required";
    }

    if (!form.director_name) {
      errors.director_name = "Director Name is required";
    }

    if (!form.Year_of_estd) {
      errors.Year_of_estd = "Year of Establishment is required";
    }

    // if (!form.Company_logo) {
    //   errors.Company_logo = "Company Logo is required";
    // }

    if (!form.company_address) {
      errors.company_address = "Company Address is required";
    }

    if (!form.company_description) {
      errors.company_description = "Description is required";
    }

    if (!form.no_of_employee) {
      errors.no_of_employee = "Number of Employees is required";
    }

    if (!form.company_country) {
      errors.company_country = "Company Country is required";
    }

    if (!form.company_turnover) {
      errors.company_turnover = "Company Turnover is required";
    }

    if (!form.password) {
      errors.password = "Password is required";
    } else {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
      if (!passwordRegex.test(form.password)) {
        errors.password = "Password must be at least 8 characters long and include letters and numbers";
      }
    }

    if (!form.cnfpassword) {
      errors.cnfpassword = "Confirm password is required";
    } else {
      if (form.cnfpassword != form.password) {
        errors.cnfpassword = "Password & confirm password should be same";
      }
    }

    if (!form.mobile) {
      errors.mobile = "Mobile No is required";
    } else {
      const pattern = /^[6-9]\d{9}$/;

      if (!pattern.test(form.mobile)) {
        errors.mobile = "Invalid Mobile No";
      }
    }

    if (!form.email) {
      errors.email = "Email is required";
    } else {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!pattern.test(form.email)) {
        errors.email = "Invalid Email";
      }
    }

    return errors;
  };

  /* ================= handleVerifyCompany ================= */
  // Convert API company class to your company_type dropdown values
  const getCompanyType = (companyClass) => {
    if (!companyClass) return "";

    const value = companyClass.trim().toLowerCase();

    if (value.includes("one person")) return "opc";
    if (value.includes("private")) return "private_limited";
    if (value.includes("public")) return "public_limited";
    if (value.includes("limited liability partnership") || value === "llp") {
      return "llp";
    }

    return "other";
  };

  // Convert Indian/Foreign classification to country name
  const getCountryName = (companyOrigin) => {
    if (!companyOrigin) return "";

    const value = companyOrigin.trim().toLowerCase();

    if (value.includes("indian")) return "India";

    // The API classification does not identify the actual foreign country.
    // Leave it blank so the user can select the correct country.
    if (value.includes("foreign")) return "";

    return "";
  };

  // Check whether the company is active
  const isCompanyActive = (companyStatus) => {
    return companyStatus?.trim().toLowerCase() === "active";
  };

  const handleVerifyCompany = async () => {
    const cin = form.company_registration_no?.trim().toUpperCase();

    if (!cin) {
      setErrors(prev => ({
        ...prev,
        company_registration_no: "Please enter Company Registration Number"
      }));
      return;
    }

    try {
      setIsVerifyingCompany(true);
      setVerifiedCompany(false);

      const response = await verifyCompanyWithMCA({ cin });

      // Session expired
      if (response?.status === "expire") {
        deleteCookie("_brw_id");
        deleteCookie("_pre_session");

        localStorage.removeItem("brwId");
        localStorage.removeItem("preSid");

        navigate("/partner", {
          state: {
            message: response.message || "Session expired. Please try again.",
            status: response.status
          }
        });

        return;
      }

      // Server error
      if (response?.status === "error") {
        navigate("/error", {
          state: {
            message: response.message || "Company verification failed",
            status: response.httpStatus || 500
          }
        });

        return;
      }

      if (response?.status !== "success" || !response?.data) {
        setAlertConfig({
          type: "error",
          message: response?.message || "Unable to verify company"
        });
        setShowAlert(true);
        return;
      }

      const company = response.data;

      // Ensure returned CIN matches entered CIN
      if (
        company.CIN?.trim().toUpperCase() !== cin
      ) {
        setAlertConfig({
          type: "error",
          message: "Company registration number does not match."
        });
        setShowAlert(true);
        return;
      }

      // IMPORTANT: Block inactive companies
      if (!isCompanyActive(company.CompanyStatus)) {
        setForm(prev => ({
          ...prev,
          company_name: "",
          company_type: "",
          company_address: "",
          company_country: "",
          Year_of_estd: "",
          company_description: ""
        }));

        setAlertConfig({
          type: "error",
          message: `Registration is not allowed. Company status is "${company.CompanyStatus || "Unknown"}". Only Active companies can register.`
        });

        setShowAlert(true);
        return;
      }

      // Convert API date to HTML date input format
      const registrationDate = company.CompanyRegistrationdate_date || "";

      const validDate = /^\d{4}-\d{2}-\d{2}$/.test(registrationDate)
        ? registrationDate
        : "";

      // Populate registration form
      setForm(prev => ({
        ...prev,

        company_registration_no: company.CIN || cin,
        company_name: company.CompanyName || "",
        company_type: getCompanyType(company.CompanyClass),
        company_address: company.Registered_Office_Address || "",
        company_country: getCountryName(company["CompanyIndian/Foreign Company"]),
        Year_of_estd: validDate,
        company_description: company.CompanyIndustrialClassification || ""
      }));

      setVerifiedCompany(true);

      setErrors(prev => {
        const updated = { ...prev };
        delete updated.company_registration_no;
        delete updated.company_name;
        delete updated.company_type;
        delete updated.company_address;
        delete updated.company_country;
        delete updated.Year_of_estd;
        delete updated.company_description;
        return updated;
      });

      setAlertConfig({
        type: "success",
        message: "Company verified successfully. Company status: Active."
      });

      setShowAlert(true);

    } catch (error) {
      console.error("Company verification failed:", error);

      setAlertConfig({
        type: "error",
        message: "Unable to verify company. Please try again."
      });

      setShowAlert(true);

    } finally {
      setIsVerifyingCompany(false);
    }
  };


  const [errors, setErrors] = useState({});

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!verifiedCompany) {
      setAlertConfig({
        type: "error",
        message: "Please verify your CIN and ensure that the company is Active before registration."
      });

      setShowAlert(true);
      return;
    }

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return; // stop submit
    }

    // if (!verified.email || !verified.mobile) {
    //   setAlertConfig({
    //     type: "error",
    //     message: "Please verify email first"
    //   });
    //   setShowAlert(true);
    //   return;
    // }

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
      companyName: getValue(form.company_name),
      companyType: getValue(form.company_type),
      registrationNo: getValue(form.company_registration_no),
      directorName: getValue(form.director_name),
      yearEstablished: getValue(form.Year_of_estd)?.split("-")[0],
      companyAddress: getValue(form.company_address),
      country: getValue(form.company_country),
      description: getValue(form.company_description),
      companyLogoUrl: getValue(form.Company_logo),
      companyPan: getValue(form.company_pan),
      companyGst: getValue(form.company_gst),
      employeeCount: getValue(form.no_of_employee),
      turnover: getValue(form.company_turnover),
      websiteUrl: getValue(form.website_url)
    };

    // API call placeholder
    console.log("Partner Register Payload:", form);
    const apiResponse = await registerCompany(data);
    // const apiResponse = res?.data || res;

    console.log("Partner Register api response:", apiResponse);

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
      navigate("/partner", {
        state: {
          message: apiResponse?.message || "Session Expired. Please try again.",
          status: apiResponse.status || 500
        }
      });
      return;
    }

    if (apiResponse.status === "failure" && apiResponse?.data) {
      const apiErrors = mapApiErrors(apiResponse.data);

      setErrors(prev => ({
        ...prev,
        ...apiErrors
      }));

      setAlertConfig({
        type: "error",
        message: apiResponse.message || "Please fix highlighted errors"
      });
      setShowAlert(true);
    }

    if (apiResponse.status === "success") {

      setAlertConfig({
        type: "success",
        message: "Partner registered successfully"
      });
      setShowAlert(true);

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000); // 3 seconds
    }

  };

  const mapApiErrors = (apiErrors) => {
    const mapped = {};

    const fieldMap = {
      companyGst: "company_gst",
      companyPan: "company_pan",
      yearEstablished: "Year_of_estd",
      companyName: "company_name",
      companyType: "company_type",
      registrationNo: "company_registration_no",
      directorName: "director_name",
      companyAddress: "company_address",
      description: "company_description",
      employeeCount: "no_of_employee",
      turnover: "company_turnover",
      websiteUrl: "website_url"
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
        <Col lg={7} className="form-side">
          <Card className="light-card">
            <Card.Body className="position-relative p-0">

              <div className="form-scroll p-5">

                <div className="brand">
                  <img src={logoImg} alt="logo" />
                  <div>
                    <h3>ZOLO SYSTEMS</h3>
                    <span>Enterprise Identity Platform</span>
                  </div>
                </div>

                <div className="onboarding-banner">

                  <div className="header-row">

                    <div>
                      <h3 className="hero-badge1">
                        Company Registration
                      </h3>

                      <p>
                        Register your company and start managing
                        services within minutes.
                      </p>
                    </div>


                    <Button
                      variant="light"
                      className="home-btn"
                      onClick={() => navigate("/")}
                    >
                      <i className="bi bi-house-door"></i>
                    </Button>

                  </div>
                </div>

                <Form onSubmit={handleSubmit}>
                  {/* EMAIL + MOBILE */}
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email <span style={{ color: "red" }}>*</span></Form.Label>
                        <InputGroup>
                          <Form.Control
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            isInvalid={!!errors.email}
                          />

                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                          {/* <Button
                            type="button"
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
                          <Form.Select className="country-code">
                            <option>🇮🇳 +91</option>
                          </Form.Select>
                          <Form.Control
                            name="mobile"
                            placeholder="Mobile number"
                            value={form.mobile}
                            onChange={handleChange}
                            isInvalid={!!errors.mobile}
                          />

                          <Form.Control.Feedback type="invalid">
                            {errors.mobile}
                          </Form.Control.Feedback>
                          {/* <Button
                            type="button"
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

                  {/* COMPANY DETAILS */}
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Registration No <span style={{ color: "red" }}>*</span>
                        </Form.Label>

                        <InputGroup>
                          <Form.Control
                            name="company_registration_no"
                            value={form.company_registration_no}
                            onChange={(e) => {
                              handleChange(e);
                              setVerifiedCompany(false);
                            }}
                            isInvalid={!!errors.company_registration_no}
                            disabled={isVerifyingCompany}
                          />

                          <Button
                            variant={verifiedCompany ? "success" : "primary"}
                            onClick={handleVerifyCompany}
                            disabled={isVerifyingCompany || verifiedCompany}
                          >
                            {isVerifyingCompany
                              ? "Verifying..."
                              : verifiedCompany
                                ? "Verified"
                                : "Verify CIN"}
                          </Button>

                          {errors.company_registration_no && (
                            <Form.Control.Feedback type="invalid">
                              {errors.company_registration_no}
                            </Form.Control.Feedback>
                          )}
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Company Name <span style={{ color: "red" }}>*</span>
                        </Form.Label>

                        <Form.Control
                          name="company_name"
                          value={form.company_name}
                          onChange={handleChange}
                          isInvalid={!!errors.company_name}
                        />

                        <Form.Control.Feedback type="invalid">
                          {errors.company_name}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Form.Group className="mb-4">
                      <Form.Label>Description <span style={{ color: "red" }}>*</span></Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="company_description"
                        value={form.company_description}
                        onChange={handleChange}
                        isInvalid={!!errors.company_description}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.company_description}
                      </Form.Control.Feedback>
                    </Form.Group>


                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Company Type <span style={{ color: "red" }}>*</span>
                        </Form.Label>

                        <Form.Select
                          name="company_type"
                          value={form.company_type}
                          onChange={handleChange}
                          isInvalid={!!errors.company_type}
                        >
                          <option value="">Select company type</option>

                          {/* Corporate */}
                          <option value="private_limited">Private Limited (Pvt Ltd)</option>
                          <option value="public_limited">Public Limited (Ltd)</option>
                          <option value="llp">Limited Liability Partnership (LLP)</option>
                          <option value="opc">One Person Company (OPC)</option>

                          {/* Partnership & Individual */}
                          <option value="partnership">Partnership Firm</option>
                          <option value="sole_proprietorship">Sole Proprietorship</option>

                          {/* Non-Profit / Others */}
                          <option value="trust">Trust</option>
                          <option value="society">Society</option>
                          <option value="ngo">NGO</option>
                          <option value="government">Government / PSU</option>
                          <option value="other">Other</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.company_type}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Year of Establishment<span style={{ color: "red" }}>*</span></Form.Label>
                        <Form.Control
                          type="date"
                          name="Year_of_estd"
                          value={form.Year_of_estd}
                          onChange={handleChange}
                          isInvalid={!!errors.Year_of_estd}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.Year_of_estd}
                        </Form.Control.Feedback
                        >
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>PAN</Form.Label>
                        <Form.Control
                          name="company_pan"
                          value={form.company_pan}
                          onChange={handleChange}
                          isInvalid={!!errors.company_pan}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.company_pan}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>GST</Form.Label>
                        <Form.Control
                          name="company_gst"
                          value={form.company_gst}
                          onChange={handleChange}
                          isInvalid={!!errors.company_gst}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.company_gst}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Director Name <span style={{ color: "red" }}>*</span></Form.Label>
                        <Form.Control
                          name="director_name"
                          value={form.director_name}
                          onChange={handleChange}
                          isInvalid={!!errors.director_name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.director_name}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Company Address <span style={{ color: "red" }}>*</span></Form.Label>
                    <Form.Control
                      name="company_address"
                      value={form.company_address}
                      onChange={handleChange}
                      isInvalid={!!errors.company_address}

                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.company_address}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Country <span style={{ color: "red" }}>*</span>
                        </Form.Label>

                        <Form.Select
                          name="company_country"
                          value={form.company_country}
                          onChange={handleChange}
                          isInvalid={!!errors.company_country}
                        >
                          <option value="">Select Country</option>
                          <option value="India">🇮🇳 India</option>
                          <option value="Nepal">🇳🇵 Nepal</option>
                          <option value="United States">🇺🇸 United States of America</option>
                          <option value="UAE">🇦🇪 United Arab Emirates</option>
                          <option value="Japan">🇯🇵 Japan</option>
                          <option value="Russia">🇷🇺 Russia</option>
                          <option value="China">🇨🇳 China</option>
                          <option value="South Korea">🇰🇷 South Korea</option>
                          <option value="Other">Other</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.company_country}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Company Turnover <span style={{ color: "red" }}>*</span></Form.Label>

                        <Form.Select
                          name="company_turnover"
                          value={form.company_turnover}
                          onChange={handleChange}
                          isInvalid={!!errors.company_turnover}
                        >
                          <option value="">Select Turnover</option>
                          <option value="<10cr">Less than ₹10 Cr</option>
                          <option value="10-50cr">₹10 Cr – ₹50 Cr</option>
                          <option value="50-100cr">₹50 Cr – ₹100 Cr</option>
                          <option value="100-500cr">₹100 Cr – ₹500 Cr</option>
                          <option value="500cr+">₹500 Cr+</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.company_turnover}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          No. of Employees <span style={{ color: "red" }}>*</span>
                        </Form.Label>

                        <Form.Select
                          name="no_of_employee"
                          value={form.no_of_employee}
                          onChange={handleChange}
                          isInvalid={!!errors.no_of_employee}
                        >
                          <option value="">Select range</option>
                          <option value="10">Less than 10</option>
                          <option value="20">10 – 20</option>
                          <option value="50">20 – 50</option>
                          <option value="100">50 – 100</option>
                          <option value="200">100 – 200</option>
                          <option value="500">200 – 500</option>
                          <option value="1000">500+</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.no_of_employee}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Company Logo URL </Form.Label>
                        <Form.Control
                          name="Company_logo"
                          value={form.Company_logo}
                          placeholder="https://example.com/logo.png"
                          onChange={handleChange}
                          isInvalid={!!errors.Company_logo}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.Company_logo}
                        </Form.Control.Feedback
                        >
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Website URL
                        </Form.Label>

                        <Form.Control
                          name="website_url"
                          value={form.website_url}
                          placeholder="https://www.yourcompany.com"
                          onChange={handleChange}
                          isInvalid={!!errors.website_url}
                        />

                        <Form.Control.Feedback type="invalid">
                          {errors.website_url}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* PASSWORD DETAILS */}
                  {/* PASSWORD */}
                  <Form.Label>
                    Password
                  </Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>

                  {/* CONFIRM PASSWORD */}
                  <Form.Label>
                    Retype Password
                  </Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type={showCnfPassword ? "text" : "password"}
                      name="cnfpassword"
                      value={form.cnfpassword}
                      onChange={handleChange}
                      isInvalid={!!errors.cnfpassword}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowCnfPassword(!showCnfPassword)}
                    >
                      <i className={showCnfPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {errors.cnfpassword}
                    </Form.Control.Feedback>
                  </InputGroup>

                  <p className="terms-text mt-3">
                    By clicking <strong>Register</strong>, you agree to the{" "}
                    <a target="_blank" href="/conditions" rel="noopener noreferrer">Terms and Conditions</a> &{" "}
                    <a target="_blank" href="/privacy" rel="noopener noreferrer">Privacy Policy</a> of ZOLO SYSTEMS
                  </p>

                  <Button type="submit" className="w-100 primary-btn">
                    Register Company
                  </Button>

                  <p className="text-center mt-3 small text-muted">
                    Already a partner?{" "}
                    <Link to="/login" className="register-link">
                      Login
                    </Link>
                  </p>
                </Form>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* RIGHT – BENEFITS */}
        <Col lg={5} className="benefit-side">
          <div className="benefit-wrapper mt-5 pt-5">

            <h1>
              Build Your Team Faster
            </h1>

            <p className="tagline">
              Register your company and access a smart hiring ecosystem
              designed to help you find, manage, and grow talent efficiently.
            </p>

            {/* Metrics */}
            <div className="stats-grid">
              <div className="stat-card">
                <h3>50K+</h3>
                <span>Employers</span>
              </div>

              <div className="stat-card">
                <h3>1M+</h3>
                <span>Candidates</span>
              </div>

              <div className="stat-card">
                <h3>98%</h3>
                <span>Success Rate</span>
              </div>

              <div className="stat-card">
                <h3>24/7</h3>
                <span>Support</span>
              </div>
            </div>

            {/* Features */}
            <div className="benefit-card">
              <div className="icon-box">🔒</div>
              <div>
                <h6>Enterprise Security</h6>
                <p>
                  Secure data handling with privacy-first architecture.
                </p>
              </div>
            </div>

            {/* Trust Section */}
            <div className="trust-section">
              <small>Trusted by growing teams worldwide</small>

              <div className="trust-logos">
                <span>STARTUPS</span>
                <span>SMEs</span>
                <span>ENTERPRISES</span>
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
        onHide={() => { resetOtp(); setShowOtp(false); }}
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
            key={resetKey}
            className="d-flex justify-content-between gap-2 mb-3"
            onPaste={handleOtpPaste}
          >
            {otp.map((digit, index) => (
              <Form.Control
                key={`${resetKey}-${index}`}
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
              <Button type="button" variant="link" className="p-0" onClick={() => resendOtp(target)}>
                Resend
              </Button>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button type="button"
            onClick={() => verifyOtp(otp.join(""))}>
            Verify
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}