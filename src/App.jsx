import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Employer from "./pages/Employers";
import Register from "./pages/Register";
import PartnerRegister from "./pages/PartnerRegister";
import TwoFactorAuth from "./pages/TwoFactorAuth";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Privacy from "./pages/privacyPolicy";
import TermaCondition from "./pages/TermsConditions";
import ForgotPassword from "./components/ForgotPassword.jsx";

import JobSeekerDashboard from "./pages/jonseekers/JobSeekerDashboard";
import CandidateProfile from "./pages/jonseekers/CandidateProfile"

import SubscriptionGuard from "./components/SubscriptionGuard.jsx";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import JobsList from "./pages/recruiter/JobsLists";
import PostJob from "./pages/recruiter/PostJob";
import Applicants from "./pages/recruiter/Applicants";
import RecruiterProfile from "./pages/recruiter/recruiterprofile";
import AccountSettings from "./pages/recruiter/AccountSettings";
import Employee from "./pages/recruiter/Employee";
import AttendanceLogs from "./pages/recruiter/AttendanceLogs";
import AttendanceSettings from "./pages/recruiter/AttendanceSettings";
import RolePermissionSettings from "./pages/recruiter/RolePermissionSettings";
import PayrollSettings from "./pages/recruiter/PayrollSettings";
import LeaveSettings from "./pages/recruiter/LeaveSettings";
import EmployeeSettings from "./pages/recruiter/EmployeeSettings";
import CompanySettings from "./pages/recruiter/CompanySettings";
import HolidayCalendar from "./pages/recruiter/HolidayCalendar";
import Invoices from "./pages/recruiter/Invoices";
import Transactions from "./pages/recruiter/Transactions";
import Subscription from "./pages/recruiter/Subscription";
import SubscriptionPlans from "./pages/recruiter/SubscriptionPlan.jsx";
import SubscriptionPayment from "./pages/recruiter/SubscriptionPayment.jsx";
import NotificationsSettings from "./pages/recruiter/NotificationsSettings.jsx";


import Error from "./pages/Error";

import Footer from "./components/Footer";
import Header from "./components/Headers";
import ScrollToTop from "./components/ScrollToTop";
import HireSkillsLoader from "./components/HireSkillsLoader";

// Layouts
import CandidateLayout from "./layouts/JobSeekersLayout";
import RecruiterLayout from "./layouts/RecruiterLayout";

// Role Guard
import RoleRoute from "./routes/RoleRoute";

import { getBrowserFingerprint } from "./services/browserFingerPrint";

const hideHeaderRoutes = [
  "/login",
  "/register",
  "/partner",
  "/",
  "/candidate",
  "/recruiter",
  "/twofactorauth",
  "/error",
  "/forgot-password"
];

const hideFooterRoutes = [
  "/login",
  "/",
  "/register",
  "/partner",
  "/candidate",
  "/twofactorauth",
  "/error",
  "/forgot-password"
];

function AppLayout() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBrowserFingerprint();
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <HireSkillsLoader fullPage />;
  }

  return (
    <>
      {!hideHeaderRoutes.some((route) =>
        location.pathname.startsWith(route)
      ) && <Header />}

      <Routes>
        {/* ===== Public Routes ===== */}
        <Route path="/error" element={<Error />} />
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/partner" element={<PartnerRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/employer" element={<Employer />} />
        <Route path="/twofactorauth" element={<TwoFactorAuth />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/conditions" element={<TermaCondition />} />
        {/* ===== Candidate Routes (ROLE PROTECTED) ===== */}
        <Route
          path="/candidate"
          element={
            <RoleRoute allowedRoles={["candidate"]}>
              <CandidateLayout />
            </RoleRoute>
          }
        >
          <Route path="dashboard" element={<JobSeekerDashboard />} />

          {<Route path="profile/edit" element={<CandidateProfile />} />}
        </Route>

        {/* ===== Recruiter Routes (future) ===== */}
        {
          <Route
            path="/recruiter"
            element={
              <RoleRoute allowedRoles={["recruiter"]}>
                <RecruiterLayout />
              </RoleRoute>
            }
          >
          
            <Route path="subscription-plans" element={<SubscriptionPlans />} />
            <Route path="payment-confirmation" element={<SubscriptionPayment />} />
            <Route path="profile" element={<RecruiterProfile />} />
              <Route path="settings" element={<AccountSettings />} />
              <Route path="billing/subscription" element={<Subscription />} />
              <Route path="billing/transactions" element={<Transactions />} />
              <Route path="billing/invoices" element={<Invoices />} />

            <Route element={<SubscriptionGuard />}>
              <Route path="dashboard" element={<RecruiterDashboard />} />
              <Route path="employee" element={<Employee />} />
              <Route path="jobs" element={<JobsList />} />
              <Route path="jobs/new" element={<PostJob />} />
              <Route path="jobs/applicants" element={<Applicants />} />              
              <Route path="attendance-logs" element={<AttendanceLogs />} />
              <Route path="attendance-settings" element={<AttendanceSettings />} />
              <Route path="role-permission-settings" element={<RolePermissionSettings />} />
              <Route path="payroll-settings" element={<PayrollSettings />} />
              <Route path="leave-settings" element={<LeaveSettings />} />
              <Route path="employee-settings" element={<EmployeeSettings />} />
              <Route path="company-settings" element={<CompanySettings />} />
              <Route path="holiday-settings" element={<HolidayCalendar />} />
              <Route path="notifications-settings" element={<NotificationsSettings />} />
            </Route>

          </Route>
        }

        {/* ===== Admin Routes (future) ===== */}
        {/* 
        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </RoleRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
        */}
      </Routes>

      {!hideFooterRoutes.some((route) =>
        location.pathname.startsWith(route)
      ) && <Footer />}
    </>
  );
}

export default function App() {


  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLayout />
    </BrowserRouter>
  );
}
