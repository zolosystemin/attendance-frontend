import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import AppAlert from "../components/Alert.jsx";
import "./css/Login.css";
import { otpGenerateForTwoMF } from "../services/loginService.js"

function TwoFactorAuth() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: choose method, 2: enter OTP
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ type: "info", message: "" });

  const [selectedMethod, setSelectedMethod] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(60); // 1 min countdown for resend
  const [canResend, setCanResend] = useState(false);
  

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Select device for OTP
  function handleMethodSelect(method) {

      const getOtpType = (method) => {
      const map = {
        mobile: 1,
        email: 2,
        app: 3,
        token: 4
      };
      return map[method] ?? null;
    };

    const otpType = getOtpType(method);

    if (!otpType) {
      setAlertConfig({
        type: "error",
        message: "Invalid Device Type"
      });
      setShowAlert(true);
      return;
    }

    console.log("otpType : ", otpType);
    try{
      const res = otpGenerateForTwoMF(otpType);
      console.log("res : " , res);
      if(res === 200){

        setSelectedMethod(method);
        setStep(2);
        setOtp("");
        setTimer(60);
        setCanResend(false);
        setAlertConfig({ type: "info", message: `OTP sent via ${method}` });
        setShowAlert(true);
      }

    }catch(err){

    }
   
 
  }

  function handleBack() {
    setStep(1);
    setSelectedMethod("");
    setOtp("");
    setShowAlert(false);
  }

  function handleOtpChange(e) {
    setOtp(e.target.value);
  }

  async function handleSubmitOtp(e) {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setAlertConfig({ type: "error", message: "OTP must be 6 digits" });
      setShowAlert(true);
      return;
    }

    setLoading(true);
    setShowAlert(false);

    try {
      // TODO: verify OTP API call
      // const res = await verifyOtp({ otp, method: selectedMethod });
      const res = { data: { success: true, role: "candidate" } }; // Mock

      if (!res.data.success) {
        setAlertConfig({ type: "error", message: "Invalid OTP, try again" });
        setShowAlert(true);
        return;
      }

      setAlertConfig({
        type: "success",
        message: "OTP verified successfully!",
      });
      setShowAlert(true);

      setTimeout(() => {
        if (res.data.role === "candidate") navigate("/candidate/dashboard");
        else if (res.data.role === "recruiter")
          navigate("/recruiter/dashboard");
        else if (res.data.role === "admin") navigate("/admin/dashboard");
      }, 800);
    } catch (error) {
      setAlertConfig({
        type: "error",
        message: error.message || "OTP verification failed",
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  }

  function handleResend() {
    setTimer(60);
    setCanResend(false);
    setAlertConfig({
      type: "info",
      message: `OTP resent via ${selectedMethod}`,
    });
    setShowAlert(true);
    // TODO: call API to resend OTP
    // resendOtp(selectedMethod);
  }

  return (
    <Container fluid className="login-wrapper">
      {showAlert && (
        <AppAlert
          type={alertConfig.type}
          message={alertConfig.message}
          onClose={() => setShowAlert(false)}
        />
      )}

      <Row className="login-row">
        {/* LEFT */}
        <Col md={6} className="login-left d-none d-md-flex">
          <Button
            variant="link"
            className="login-back-btn login-back-btn-left"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </Button>

          <div className="left-content animate-fade">
            <h1>HireSkill</h1>
            <p className="subtitle">
              Enterprise Hiring & Skill Management Platform
            </p>
          </div>
          <div className="curve-divider"></div>
        </Col>

        {/* RIGHT */}
        <Col md={6} className="login-right">
          <Card className="login-card shadow-lg border-0">
            <Card.Body className="p-5">
              {step === 1 && (
                <>
                  <h3 className="fw-bold mb-4 text-center">
                    Choose 2FA Method
                  </h3>
                  <div className="d-grid gap-3">
                    <Button onClick={() => handleMethodSelect("mobile")}>
                      Mobile (SMS)
                    </Button>
                    <Button onClick={() => handleMethodSelect("email")}>
                      Email
                    </Button>
                    <Button onClick={() => handleMethodSelect("app")}>
                      Authenticator App
                    </Button>
                    <Button onClick={() => handleMethodSelect("token")}>
                      Security Token
                    </Button>
                  </div>

                  <div className="text-end mt-3">
                    <Link to="/login" className="small-link">
                      use different account?
                    </Link>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h3 className="fw-bold mb-4 text-center">Enter OTP</h3>
                  <p className="text-center text-muted">
                    OTP sent via {selectedMethod}.
                    {timer > 0
                      ? ` Resend in ${timer}s`
                      : " You can resend OTP now."}
                  </p>

                  <Form onSubmit={handleSubmitOtp}>
                    <Form.Group className="mb-3">
                      <Form.Label>OTP</Form.Label>
                      <Form.Control
                        type="text"
                        value={otp}
                        onChange={handleOtpChange}
                        placeholder="6-digit code"
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-between mb-3">
                      <Link
                        type="button"
                        onClick={handleBack}
                        className="small-link"
                      >
                        ← Back
                      </Link>

                      {canResend && (
                        <Link
                          type="button"
                          onClick={handleResend}
                          className="small-link"
                        >
                          Resend OTP
                        </Link>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-100 btn-primary"
                      disabled={loading}
                    >
                      Verify OTP
                    </Button>
                  </Form>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default TwoFactorAuth;
