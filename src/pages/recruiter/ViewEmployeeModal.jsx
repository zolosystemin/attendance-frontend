import {
  Modal,
  Button,
  Row,
  Col,
  Badge,
} from "react-bootstrap";

import { PersonCircle } from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import { getEmployeeDetails } from "../../services/companyService.js";

export default function ViewEmployeeModal({
  show,
  onHide,
  employee
}) {

  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {

      if (!show || !employee?.id) {
        return;
      }

      try {

        setLoading(true);

        const response = await getEmployeeDetails(employee.id);

        console.log(
          "EMPLOYEE DETAILS RESPONSE:",
          response
        );

        if (response.status === "success") {
          const emp = response.data?.employee;

          setEmployeeData({
            id: emp.id,
            empId: emp.employeeId,
            name: emp.fullName,
            email: emp.emailId,
            mobile: emp.mobileNo,
            department: emp.department,
            designation: emp.designation,
            status: emp.isActive,
            dob: emp.dob,
            gender: emp.gender,
            bloodGroup: emp.bloodGroup,
            employmentType: emp.employmentType,
            guardianName: emp.guardianName,
            guardianRelation: emp.guardianRelation,
            guardianEmailId: emp.guardianEmailId,
            guardianWhatsAppNo: emp.guardianWhatsAppNo,
            address: emp.address,
            dateOfJoining: emp.dateOfJoining,
            companyName: emp.companyName
          });
        }
      } catch (error) {
        console.error(
          "FETCH EMPLOYEE DETAILS ERROR",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [show, employee]);

  if (!employeeData) {
    return null;
  }

  const InfoItem = ({ label, value }) => (
    <Col md={6} className="mb-3">

      <div className="text-muted small">
        {label}
      </div>

      <div className="fw-semibold">
        {value || "-"}
      </div>

    </Col>
  );

  return (

    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
    >

      <Modal.Header closeButton>

        <Modal.Title>
          Employee Details
        </Modal.Title>

      </Modal.Header>

      <Modal.Body>

        {loading ? (

          <div className="text-center">
            Loading employee details...
          </div>

        ) : (
          <>

            <Row className="align-items-center border-bottom pb-3 mb-4">
              <Col xs="auto">
                <PersonCircle
                  size={70}
                  className="text-secondary"
                />
              </Col>

              <Col>
                <h4 className="mb-1">
                  {employeeData.name}
                </h4>

                <div className="text-muted">
                  {employeeData.designation}
                </div>

                <Badge
                  bg={
                    employeeData.status
                      ? "success"
                      : "secondary"
                  }
                  className="mt-2"
                >
                  {
                    employeeData.status
                      ? "Active"
                      : "Disabled"
                  }
                </Badge>

              </Col>
            </Row>

            <h6 className="border-bottom pb-2 mb-3">
              Employee Information
            </h6>

            <Row>

              <InfoItem
                label="Employee ID"
                value={employeeData.empId}
              />

              <InfoItem
                label="Email"
                value={employeeData.email}
              />

              <InfoItem
                label="Mobile Number"
                value={employeeData.mobile}
              />

              <InfoItem
                label="Department"
                value={employeeData.department}
              />

              <InfoItem
                label="Designation"
                value={employeeData.designation}
              />

              <InfoItem
                label="Employment Type"
                value={employeeData.employmentType}
              />

              <InfoItem
                label="Gender"
                value={employeeData.gender}
              />

              <InfoItem
                label="Blood Group"
                value={employeeData.bloodGroup}
              />

              <InfoItem
                label="Date of Joining"
                value={employeeData.dateOfJoining}
              />

              <InfoItem
                label="Address"
                value={employeeData.address}
              />

              <InfoItem
                label="Guardian Name"
                value={employeeData.guardianName}
              />

              <InfoItem
                label="Guardian Mobile"
                value={employeeData.guardianWhatsAppNo}
              />
            </Row>

          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onHide}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}