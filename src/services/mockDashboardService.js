import dashboardData from "../mock/dashboard.json";

export const getCandidateDashboard = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: dashboardData.candidate });
    }, 800);
  });

export const getRecruiterDashboard = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: dashboardData.recruiter });
    }, 800);
  });

export const getAdminDashboard = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: dashboardData.admin });
    }, 800);
 });
