export const menuByRole = {
  candidate: [
    { label: "Dashboard", path: "/dashboard", icon: "bi-speedometer2" },
    { label: "Jobs", path: "/jobs", icon: "bi-briefcase" },
    { label: "Courses", path: "/courses", icon: "bi-mortarboard" },
  ],

  recruiter: [
    { label: "Dashboard", path: "/recruiter/dashboard", icon: "bi-speedometer2" },
    { label: "Post Job", path: "/recruiter/jobs/create", icon: "bi-plus-circle" },
    { label: "Candidates", path: "/recruiter/candidates", icon: "bi-people" },
  ],

  admin: [
    { label: "Dashboard", path: "/admin/dashboard", icon: "bi-shield-lock" },
    { label: "Users", path: "/admin/users", icon: "bi-people" },
    { label: "Reports", path: "/admin/reports", icon: "bi-bar-chart" },
  ],
};
