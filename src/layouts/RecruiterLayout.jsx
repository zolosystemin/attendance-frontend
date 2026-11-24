import { useState } from "react";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import RecruitersTopNav from "../components/RecruitersTopNav";

const RecruiterLayout = () => {
  return (
    <>
      <RecruitersTopNav onMenuClick={() => setShowSidebar(true)} />  
      <Container fluid className="p-4 bg-light min-vh-100">
        <Outlet />
      </Container>
    </>
  );
};

export default RecruiterLayout;