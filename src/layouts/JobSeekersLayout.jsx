import { useState } from "react";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import CandidateTopNav from "../components/JobSeeksersTopNav";

const JobSeekersLayout = () => {

  return (
    <>
      <CandidateTopNav onMenuClick={() => setShowSidebar(true)} />  
      <Container fluid className="p-4 bg-light min-vh-100">
        <Outlet />
      </Container>
    </>
  );
};

export default JobSeekersLayout;
