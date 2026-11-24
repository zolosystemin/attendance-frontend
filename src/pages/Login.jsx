import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
  Person,
  People,
  PersonBadge,
  ClockHistory,
  BarChart,
  Lock,
  Eye,
  EyeSlash,
  ShieldCheck,
  ArrowRight,
  CheckCircleFill,
  Laptop,
  Globe2,
  Fingerprint,
  Activity,
  Cpu,
  BellFill,
  ShieldLock,
} from "react-bootstrap-icons";

import logoImg from "../assets/logo.png";
import "./css/Login.css";

import AppAlert from "../components/Alert";

import { REGEX } from "../utils/regex";
import { validateUser } from "../services/loginService";
import { getSession } from "../services/session";
import {
  getCookie,
  setCookie,
  deleteCookie,
} from "../utils/cookie";

const activities = [
  {
    icon: <People />,
    title: "HR Management",
    subtitle: "Employee lifecycle management",
  },
  {
    icon: <PersonBadge />,
    title: "Identity & Access",
    subtitle: "SSO, MFA & user provisioning",
  },
  {
    icon: <ClockHistory />,
    title: "Attendance",
    subtitle: "Face recognition & GPS tracking",
  },
  {
    icon: <BarChart />,
    title: "Analytics",
    subtitle: "Real-time business insights",
  },
];

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [showAlert, setShowAlert] =
    useState(false);

  const [alertConfig, setAlertConfig] =
    useState({
      type: "info",
      message: "",
    });

  const [formData, setFormData] =
    useState({
      username: "",
      password: "",
    });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      navigate(`/${role.toLowerCase()}/dashboard`, {
        replace: true,
      });
    }
  }, [navigate]);

  const sessionToken = getCookie("_pre_session");

  const { data } = useQuery({
    queryKey: ["session"],
    queryFn: getSession,
    enabled: !sessionToken,
  });

  useEffect(() => {
    if (!data?.data) return;

    const { brwId, preSid } = data.data;

    localStorage.setItem("brwId", brwId);
    localStorage.setItem("preSid", preSid);

    setCookie("_pre_session", preSid);
    setCookie("_brw_id", brwId);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // validation function for login form
  function validate() {
    const username = formData.username.trim();
    const password = formData.password;

    if (!username) {
      setAlertConfig({
        type: "error",
        message: "Username is required"
      });

      setShowAlert(true);
      return false;
    }

    if (
      !REGEX.EMAIL.test(username) &&
      !REGEX.MOBILE.test(username)
    ) {
      setAlertConfig({
        type: "error",
        message:
          "Please enter a valid username (email or mobile number)"
      });

      setShowAlert(true);
      return false;
    }

    if (!password) {
      setAlertConfig({
        type: "error",
        message: "Password is required"
      });

      setShowAlert(true);
      return false;
    }

    if (password.length < 6) {
      setAlertConfig({
        type: "error",
        message: "Password must be at least 6 characters"
      });

      setShowAlert(true);
      return false;
    }

    return true;
  }

  // handle form submission
  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setShowAlert(false);

    try {
      const { username, password } = formData;

      const res = await validateUser(
        username,
        password
      );

      console.log(res.status);
      if (res.status === "expire") {
          deleteCookie("_brw_id");
          deleteCookie("_pre_session");
          deleteCookie("_session_id");
          localStorage.clear();
          setAlertConfig({
            type: "error",
            message: res.message
          });
          setShowAlert(true);

          setTimeout(() => {
            location.reload();
          }, 2000);

          return;
        }
       
      if (res.status === 200 || res.status === "success") {
        const apiResponse = res;
        console.log("API Response [R]:", apiResponse);

        if (apiResponse.pageName === "mf") {
          localStorage.setItem(
            "sessionId",
            apiResponse.data.preSid
          );

          navigate("/twofactorauth");
          return;
        }

        let role =
          apiResponse.data.role.toLowerCase();

        setAlertConfig({
          type: "success",
          message: "Login successful"
        });

        setShowAlert(true);

        localStorage.setItem(
          "token",
          apiResponse.data.tokenId
        );

        localStorage.setItem(
          "username",
          apiResponse.data.fullName
        );

        setCookie(
          "_session_id",
          apiResponse.data.tokenId,
          8
        );

        setCookie(
          "_token",
          apiResponse.data.token,
          2
        );

        if (role === "company") {
          localStorage.setItem(
            "role",
            "recruiter"
          );
        } else {
          localStorage.setItem(
            "role",
            role
          );
        }

        setTimeout(() => {
          if (role === "candidate") {
            navigate("/candidate/dashboard");
          } else if (
            role === "recruiter" ||
            role === "company"
          ) {
            navigate("/recruiter/dashboard");
          } else if (role === "admin") {
            navigate("/admin/dashboard");
          }
        }, 800);

      } else {        

        setAlertConfig({
          type: "error",
          message: res.message
        });

        setShowAlert(true);
        setIdentifier("");
        setPassword("");

      }

    } catch (error) {

      setFormData({
        username: "",
        password: ""
      });

      setAlertConfig({
        type: "error",
        message:
          error?.res?.data?.message ||
          "Invalid username or password"
      });

      setShowAlert(true);

    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {showAlert && (
        <AppAlert
          type={alertConfig.type}
          message={alertConfig.message}
          onClose={() => setShowAlert(false)}
        />
      )}

      <div className="login-page">

        {/* Animated Background */}
        <div className="bg-circle one"></div>
        <div className="bg-circle two"></div>
        <div className="bg-circle three"></div>


        {/* LEFT PANEL */}
        <div className="login-left">
          <div className="brand">
            <img src={logoImg} alt="logo" />
            <div>
              <h3>ZOLO SYSTEMS</h3>
              <span>Enterprise Identity Platform</span>
            </div>
          </div>

          <div className="login-card">

            {/* <span className="login-badge">
            <ShieldCheck />
            Enterprise Identity Platform
          </span> */}

            <h1>
              Welcome Back
            </h1>

            <p className="subtitle">
              Sign in securely to access your enterprise
              applications and workforce platform.
            </p>

            <form onSubmit={handleSubmit}>

              <label>Username</label>

              <div className="input-group-custom">

                <Person />

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Email or Mobile Number"
                />

              </div>

              <label>Password</label>

              <div className="input-group-custom">

                <Lock />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeSlash />
                  ) : (
                    <Eye />
                  )}
                </button>

              </div>

              <div className="options">

                <label className="remember">
                  <input type="checkbox" />
                  Remember me
                </label>

                <Link
                  to="/forgot-password"
                  className="forgot"
                >
                  Forgot Password?
                </Link>

              </div>

              <button
                className="login-btn"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Signing In...
                  </>
                ) : (
                  <>
                    Secure Sign In
                    <ArrowRight />
                  </>
                )}
              </button>

            </form>

            <div className="register-panel">
              <div>
                <h5>New Organization?</h5>

                <p>
                  Register your company and
                  start using Zolo Enterprise.
                </p>

              </div>

              <button
                className="register-btn"
                onClick={() =>
                  navigate("/partner")
                }
              >
                Register
              </button>
            </div>

          </div>

        </div>
        {/* RIGHT PANEL */}
        <div className="login-right">
          <div className="hero-content">

            <h2>
              Secure Workforce
              <br />
              Access Management
            </h2>

            <p>
              Empower your organization with a unified identity platform
              featuring secure authentication, single sign-on, role-based
              access control, and enterprise-grade security.
            </p>

            {/* Security Features */}

            <div className="activity-card2">

              <h4>Platform Security</h4>

              {activities.map((item) => (
                <div className="activity-row" key={item.title}>

                  <div className="activity-icon">
                    {item.icon}
                  </div>

                  <div className="activity-content">
                    <strong>{item.title}</strong>
                    <span>{item.subtitle}</span>
                  </div>

                </div>
              ))}

            </div>

            {/* Statistics */}

            <div className="dashboard-grid">

              <div className="dashboard-card">
                <Cpu size={32} />
                <h3>1.8M+</h3>
                <span>Secure Logins</span>
              </div>

              <div className="dashboard-card">
                <ShieldCheck size={32} />
                <h3>99.99%</h3>
                <span>Platform Uptime</span>
              </div>

              <div className="dashboard-card">
                <Globe2 size={32} />
                <h3>34+</h3>
                <span>Organizations</span>
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}