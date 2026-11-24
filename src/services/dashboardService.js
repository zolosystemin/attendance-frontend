import api from "./api";

export const getCandidateDashboard = () =>
  api.get("/candidate/dashboard");

export const getRecruiterDashboard = () =>
  api.get("/recruiter/dashboard");

export const getAdminDashboard = () =>
  api.get("/admin/dashboard");

