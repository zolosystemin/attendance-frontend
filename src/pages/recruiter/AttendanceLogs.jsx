import { useState } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  Table,
  Badge, Alert
} from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import AppAlert from "../../components/Alert.jsx";
import { getAttendanceLogs } from "../../services/companyService";
import { getCookie, setCookie, deleteCookie } from "../../utils/cookie.js";
import { useNavigate } from "react-router-dom";

export default function AttendanceLogs() {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    type: "info",
    message: ""
  });

  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(String(currentMonth));

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const [empId, setEmpId] = useState("");
  const [employee, setEmployee] = useState(null);
  const [logs, setLogs] = useState([]);
  const [empIdError, setEmpIdError] = useState(false);

  const handleSearch = async () => {
    if (!empId.trim()) {
      setEmpIdError(true);
      setAlertConfig({
        type: "error",
        message: "Please enter Employee ID."
      });
      setShowAlert(true);
      return;
    }
    setEmpIdError(false);

    try {
      const response = await getAttendanceLogs(empId.trim(), selectedMonth);

      if (response.message === "JWT token is expired") {
        deleteCookie("_token");
        localStorage.clear();
        setAlertConfig({
          type: "error",
          message:
            response.message ||
            "Session expired. Please login again."
        });
        setShowAlert(true);

        setTimeout(() => {
          navigate("/login");
        }, 2000);

        return;
      }

      if (response.status !== "success") {

        if (response.message?.toLowerCase().includes("attendance records")) {

          setEmployee(response.data?.employee || null);
          setLogs([]);

          setAlertConfig({
            type: "warning",
            message: "No attendance records found for this month."
          });

          setShowAlert(true);
          return;
        }

        setAlertConfig({
          type: "danger",
          message: response.message || "Unable to fetch attendance logs."
        });

        setShowAlert(true);

        setEmployee(null);
        setLogs([]);

        return;
      }

      const data = response.data || {};

      setEmployee(data.employee || null);
      setLogs(data.attendanceLogs || []);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");

      //setEmployee(null);
      setLogs([]);
    }
  };

  const getBadge = (status) => {
    switch (status) {

      case "Present":
        return <Badge bg="success">Present</Badge>;

      case "Late":
        return (
          <Badge bg="warning" text="dark">
            Late
          </Badge>
        );

      case "Absent":
        return <Badge bg="danger">Absent</Badge>;

      case "Half Day":
        return <Badge bg="primary">Half Day</Badge>;

      case "Holiday":
        return (
          <span className="fw-bold text-danger">
            Holiday
          </span>
        );

      case "Weekend":
        return (
          <span className="fw-bold text-danger">
            Weekend
          </span>
        );

      default:
        return (
          <Badge bg="secondary">
            {status}
          </Badge>
        );
    }
  };

  const getMonthRangeLabel = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const rangeMap = {
      "13": 2,
      "14": 3,
      "15": 6
    };

    if (rangeMap[selectedMonth]) {
      const monthsCount = rangeMap[selectedMonth];
      const startDate = new Date(
        currentYear,
        currentMonth - monthsCount + 1,
        1
      );

      const startMonth = startDate.toLocaleString("default", {
        month: "long"
      });

      const endMonth = currentDate.toLocaleString("default", {
        month: "long"
      });

      return `${startMonth} ${startDate.getFullYear()} - ${endMonth} ${currentYear}`;
    }
    return months[Number(selectedMonth) - 1];
  };
  const monthLabel = getMonthRangeLabel();

  const exportPDF = () => {

    if (!employee) {
      alert("Please search an employee first.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setFontSize(18);
    doc.text(
      `Employee Attendance Report - ${monthLabel}`,
      14,
      18
    );

    doc.setFontSize(11);

    doc.text(`Employee ID : ${employee.empId}`, 14, 30);
    doc.text(`Name : ${employee.name}`, 14, 37);
    doc.text(`Department : ${employee.department}`, 14, 44);
    doc.text(`Designation : ${employee.designation}`, 14, 51);
    doc.text(`Period/Month : ${monthLabel}`, 14, 58);

    autoTable(doc, {
      startY: 66,

      head: [[
        "Date",
        "Day",
        "Check In",
        "Check Out",
        "Hours",
        "Status"
      ]],

      body: logs.map(log => [
        log.date,
        log.day,
        log.inTime,
        log.outTime,
        log.hours,
        log.status
      ]),

      headStyles: {
        fillColor: [13, 110, 253]
      },

      didParseCell: function (data) {

        if (data.section === "body") {
          const status = data.row.raw[5];

          if (status === "Holiday" || status === "Weekend") {
            data.cell.styles.textColor = [220, 53, 69];
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.fillColor = [255, 235, 238]; // light red background
          }
        }

      }

    });
    const fileMonthLabel = monthLabel.replace(/ /g, "_").replace(/-/g, "to");
    doc.save(
      `${employee.empId}_${fileMonthLabel}_Attendance_Report.pdf`
    );
  };

  return (
    <Container fluid className="mt-0">
      {showAlert && (
        <AppAlert
          type={alertConfig.type}
          message={alertConfig.message}
          onClose={() => setShowAlert(false)}
        />
      )}
      <Card className="shadow-sm">
        <Card.Header className="fw-bold">
          <i className="bi bi-calendar-check-fill me-2"></i>
          Attendance Logs
        </Card.Header>
        <Card.Body>

          <Row className="align-items-end">

            <Col md={4}>
              <Form.Group>
                <Form.Label>Employee ID</Form.Label>
                <Form.Control
                  placeholder="EMP001"
                  value={empId}
                  isInvalid={empIdError}
                  onChange={(e) => {
                    setEmpId(e.target.value);
                    if (empIdError) {
                      setEmpIdError(false);
                    }
                  }}
                />

                {/* <Form.Control.Feedback type="invalid">
                  Please enter a valid Employee ID.
                </Form.Control.Feedback> */}
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Month</Form.Label>

                <Form.Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {months.map((month, index) => (
                    <option key={index} value={index + 1}>
                      {month}
                    </option>
                  ))}

                  <option value="13">Last 2 Months</option>
                  <option value="14">Last 3 Months</option>
                  <option value="15">Last 6 Months</option>

                </Form.Select>

              </Form.Group>
            </Col>

            <Col md="auto" className="d-flex gap-2">

              <Button onClick={handleSearch}>
                <i className="bi bi-search me-2"></i>
                Search
              </Button>

              <Button
                variant="success"
                onClick={exportPDF}
                disabled={!employee}
              >
                <i className="bi bi-file-earmark-pdf-fill me-2"></i>
                Export PDF
              </Button>

            </Col>

          </Row>

        </Card.Body>
      </Card>

      {employee && (

        <Card className="shadow-sm mt-4">
          <Card.Header className="fw-bold">
            <i className="bi bi-person-badge-fill me-2"></i>
            Employee Details
          </Card.Header>

          <Card.Body>
            <Row>

              <Col md={3}>
                <strong>Employee ID</strong>
                <br />
                {employee.empId}
              </Col>

              <Col md={3}>
                <strong>Name</strong>
                <br />
                {employee.name}
              </Col>

              <Col md={3}>
                <strong>Department</strong>
                <br />
                {employee.department}
              </Col>

              <Col md={3}>
                <strong>Designation</strong>
                <br />
                {employee.designation}
              </Col>

            </Row>
          </Card.Body>
        </Card>

      )}

      {employee && (

        <Card className="shadow-sm mt-4">
          <Card.Header className="fw-bold">
            <i className="bi bi-clock-history me-2"></i>
            Attendance History
          </Card.Header>

          <Card.Body>

            <Table
              bordered
              hover
              responsive
            >

              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Working Hours</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {logs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center"
                    >
                      No attendance records found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log, index) => (

                    <tr
                      key={index}
                      className={
                        log.status === "Holiday" || log.status === "Weekend"
                          ? "table-danger"
                          : ""
                      }
                    >
                      <td className="fw-semibold">{log.date}</td>
                      <td className="fw-semibold">{log.day}</td>
                      <td className="fw-semibold">{log.inTime}</td>
                      <td className="fw-semibold">{log.outTime}</td>
                      <td className="fw-semibold">{log.hours}</td>
                      <td>{getBadge(log.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>

            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}