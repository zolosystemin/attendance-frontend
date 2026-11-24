import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Envelope,
  ShieldLock,
  ArrowRight,
  ArrowLeft,
  CheckCircleFill,
} from "react-bootstrap-icons";
import {  getCookie,  setCookie,  deleteCookie,} from "../utils/cookie";

import "./css/ForgotPassword.css";
import logoImg from "../assets/logo.png";
import AppAlert from "../components/Alert";
import { forgotPasswordRequest, VerifyOtpRequest, ChangePasswordRequest } from "../services/loginService.js";

export default function ForgotPassword() {

  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [identifierError, setIdentifierError] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: "info",
    message: "",
  });

  // OTP RESET
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [loading, setLoading] = useState(false);

  const maskIdentifier = (value) => {
    if (!value || value.length <= 6) return value;
    const firstTwo = value.slice(0, 3);
    const lastFour = value.slice(-2);
    const masked = "*".repeat(value.length - 6);

    return `${firstTwo}${masked}${lastFour}`;
  };

  // PASSWORD RESET REQUEST
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!identifier.trim()) {
      setIdentifierError(true);
      setAlertConfig({
        type: "error",
        message: "Please enter a valid email or mobile number",
      });
      setShowAlert(true);
      return;
    }
    setIdentifierError(false);

    try {
      setLoading(true);
      const response = await forgotPasswordRequest(identifier);
      console.log("resp : ", response);

      if (response.status === "exceeds") {
        setStep(2);
        setAlertConfig({
          type: "error",
          message: "You have exceeded the maximum OTP verification attempts. Please try later",
        });
        setShowAlert(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }

      if (response.status === "expire") {
        deleteCookie("_brw_id");
        deleteCookie("_pre_session");
        localStorage.clear();
        setAlertConfig({
          type: "error",
          message:
            response.message
        });
        setShowAlert(true);

        setTimeout(() => {
          navigate("/");
        }, 2000);

        return;
      }

      if (response.status === "success") {
        setStep(2);
        setAlertConfig({
          type: "success",
          message: `OTP has been sent to  ${maskIdentifier(identifier)}`,
        });
        setShowAlert(true);
      } else {
        setAlertConfig({
          type: "error",
          message: response.message
        });
        setShowAlert(true);
      }

    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP FOR PASSWORD RESET
  const verifyOtp = async () => {
    if (!otp.trim()) {
      setOtpError(true);

      setAlertConfig({
        type: "error",
        message: "Please enter OTP",
      });
      setShowAlert(true);
      return;
    }
    setOtpError(false);

    try {
      const responses = await VerifyOtpRequest(otp);
      console.log("resp : ", responses);

      if (responses.status === "exceeds") {
        setStep(2);
        setAlertConfig({
          type: "error",
          message: "You have exceeded the maximum OTP verification attempts. Please try later",
        });
        setShowAlert(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }

      if (responses.status === "success") {
        setStep(3);
        setAlertConfig({
          type: "success",
          message: `OTP verified successfully.`,
        });
        setShowAlert(true);
      } else {
        setAlertConfig({
          type: "error",
          message: responses.message
        });
        setShowAlert(true);
      }

    } finally {
      setLoading(false);
    }
  };

  // CHANGE PASSWORD METHOD
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordRules = {
    minLength: newPassword.length >= 8,
    maxLength: newPassword.length <= 20,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /\d/.test(newPassword),
    special: /[@$!%*?&]/.test(newPassword),
  };
  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  const resetPassword = async () => {
    try {

      if (!newPassword || !confirmPassword) {
        setAlertConfig({
          type: "error",
          message: "Please fill all fields",
        });
        setShowAlert(true);
        return;
      }

      if (newPassword !== confirmPassword) {
        setAlertConfig({
          type: "error",
          message: "Passwords do not match",
        });
        setShowAlert(true);
        return;
      }

      if (!isPasswordValid) {
        setAlertConfig({
          type: "error",
          message: "Password does not meet the required criteria.",
        });
        setShowAlert(true);
        return;
      }

      const resp = await ChangePasswordRequest(newPassword);
      console.log("resp : ", resp);
      if (resp.status === "exceeds") {
        setAlertConfig({
          type: "error",
          message: "You have exceeded the maximum OTP verification attempts. Please try later",
        });
        setShowAlert(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }

      if (resp.status === "success") {
        setAlertConfig({
          type: "success",
          message: "Password reset successfully.",
        });

        setShowAlert(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setAlertConfig({
          type: "error",
          message: resp.message
        });
        setShowAlert(true);
      }

    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="forgot-container">
      {showAlert && (
        <AppAlert
          type={alertConfig.type}
          message={alertConfig.message}
          onClose={() => setShowAlert(false)}
        />
      )}
      {/* LEFT */}
      <div className="forgot-left">

        <div className="brand">
          <img src={logoImg} alt="logo" />
          <div>
            <h3>ZOLO SYSTEMS</h3>
            <span>Enterprise Identity Platform</span>
          </div>
        </div>

        <div className="forgot-card">
          {step === 1 && (
            <>
              <span className="page-tag">
                Account Recovery
              </span>

              <h2>Forgot Password?</h2>
              <p>
                Don't worry. Enter your registered email address or mobile number to verify your identity and securely reset your password.
              </p>

              <form onSubmit={handleSubmit}>
                <label>Email or Mobile</label>

                <div className={`input-box ${identifierError ? "o-check-error" : ""}`}>
                  <Envelope />
                  <input
                    type="text"
                    placeholder="Email address or Mobile Number"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (e.target.value.trim()) {
                        setIdentifierError(false);
                      }
                    }}
                  />
                </div>

                <button
                  type="button"
                  className="reset-btn"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="btn-loader"></span>
                      Verifying User...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight />
                    </>
                  )}
                </button>

              </form>
            </>
          )}
          {step === 2 && (
            <div className="otp-section">

              <span className="page-tag">
                OTP Verification
              </span>

              <h2>Verify OTP</h2>

              <p>
                We have sent a verification code to
                <strong> {maskIdentifier(identifier)}</strong>
              </p>

              <label>Enter OTP</label>

              <div className={`input-box ${otpError ? "o-check-error" : ""}`}>
                <ShieldLock />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                    setOtp(value);
                  }}
                />
              </div>

              <button
                type="button"
                className="reset-btn"
                onClick={verifyOtp}
              >
                {loading ? "Sending OTP..." : "Verify OTP"}
                <ArrowRight />
              </button>

            </div>
          )}

          {step === 3 && (
            <div className="reset-password-section">

              <span className="page-tag">
                Create New Password
              </span>

              <h2>Reset Password</h2>
              <p>
                Create a strong password for your account.
              </p>

              <label>New Password</label>

              <div className="input-box">
                <ShieldLock />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  maxLength={20}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <label>Confirm Password</label>

              <div className="input-box">
                <ShieldLock />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  maxLength={20}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <ul className="password-rules">
                <li className={passwordRules.minLength ? "valid" : "invalid"}>
                  {passwordRules.minLength ? "✓" : "✗"} Minimum 8 characters
                </li>

                {/* <li className={passwordRules.maxLength ? "valid" : "invalid"}>
                  {passwordRules.maxLength ? "✓" : "✗"} Maximum 8 characters
                </li> */}

                <li className={passwordRules.uppercase ? "valid" : "invalid"}>
                  {passwordRules.uppercase ? "✓" : "✗"} One uppercase letter (A-Z)
                </li>

                <li className={passwordRules.lowercase ? "valid" : "invalid"}>
                  {passwordRules.lowercase ? "✓" : "✗"} One lowercase letter (a-z)
                </li>

                <li className={passwordRules.number ? "valid" : "invalid"}>
                  {passwordRules.number ? "✓" : "✗"} One number (0-9)
                </li>

                <li className={passwordRules.special ? "valid" : "invalid"}>
                  {passwordRules.special ? "✓" : "✗"} One special character (@$!%*?&)
                </li>
              </ul>

              {confirmPassword && (
                <p
                  className={
                    newPassword === confirmPassword
                      ? "password-match success"
                      : "password-match error"
                  }
                >
                  {newPassword === confirmPassword
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </p>
              )}

              <button
                className="reset-btn"
                onClick={resetPassword}
                disabled={!isPasswordValid || newPassword !== confirmPassword}
              >
                Update Password
                <ArrowRight />
              </button>

            </div>
          )}

          <Link to="/login" className="back-link">
            <ArrowLeft />
            Back to Login
          </Link>

        </div>

      </div>

      {/* RIGHT */}

      <div className="forgot-right">
        <div className="overlay"></div>
        <div className="hero">
          <span className="security-tag">
            Enterprise Security
          </span>

          <h1>
            Protect your
            <br />
            Digital Identity
          </h1>

          <p>
            Password recovery is protected with multi-factor verification,
            encrypted communication and device validation.
          </p>

          <div className="stats">

            <div className="stat-card">
              <h3>99.99%</h3>
              <span>Platform Uptime</span>
            </div>

            <div className="stat-card">
              <h3>256-bit</h3>
              <span>Encryption</span>
            </div>

            <div className="stat-card">
              <h3>MFA</h3>
              <span>Protected Reset</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}