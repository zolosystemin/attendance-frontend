import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  Table,
  Badge,
} from "react-bootstrap";
import { getAttendanceSettings, updateAttendanceSettings } from "../../services/companyService.js";
import AppAlert from "../../components/Alert";
import { deleteCookie } from "../../utils/cookie.js";

export default function AttendanceSettings() {

  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] =
    useState({
      type: "info",
      message: "",
    });

  useEffect(() => {
    fetchAttendanceSettings();
  }, []);

  const [settings, setSettings] = useState({
    // Company Schedule
    shiftName: "General Shift",
    startTime: "09:00",
    endTime: "18:00",
    lunchBreak: "60",
    graceTime: "15",
    minHours: "9",
    monthlyHours: "208",

    workingDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },

    // Attendance Rules
    lateMarkAfter: "09:15",
    halfDayHours: 4,
    absentHours: 2,
    lateMarksBeforeHalfDay: 3,
    halfDaysBeforeLeaveDeduction: 2,
    missingPunch: "Pending Approval",
    autoMarkAbsent: true,
    attendanceApprovalRequired: true,

    // Overtime
    enableOvertime: true,
    minimumOtMinutes: 30,
    maximumOtPerDay: 4,
    overtimeCalculationMethod: "Hourly",
    overtimeMultiplier: "1x",
    overtimeApprovalRequired: true,

    // Attendance Mode
    biometric: true,
    gps: false,
    faceRecognition: true,
    mobileApp: true,
    webLogin: false,
    allowManualCorrection: true,
    managerApprovalRequired: true,
    saturdayType: "off",

    // Leave Policy
    annualLeave: 18,
    casualLeave: 12,
    earnedLeave: 15,
    sickLeave: 10,
    paidLeave: 5,

    compOff: true,
    carryForward: true,
    carryForwardLimit: 30,
    leaveEncashment: false,
  });

  const [policy, setPolicy] = useState(`Employees must complete minimum working hours every day.

• Three late marks = One Half Day
• Two Half Days = One Leave
• Overtime requires manager approval
• Company holidays are paid.
`);

  const fetchAttendanceSettings = async () => {
    try {
      const result = await getAttendanceSettings(0);

      if (result.status === "JWT token is expired") {
        deleteCookie("_token");
        localStorage.clear();
        setAlertConfig({
          type: "error",
          message:
            result.message ||
            "Unable to save holiday calendar."
        });
        setShowAlert(true);

        setTimeout(() => {
          navigate("/login");
        }, 2000);

        return;
      }

      if (result.status === "success") {
        const d = result.data;

        setSettings({

          shiftName: d.shiftName ?? "",
          startTime: d.startTime?.substring(0, 5) ?? "",
          endTime: d.endTime?.substring(0, 5) ?? "",
          lunchBreak: d.lunchBreak ?? 0,
          graceTime: d.graceTime ?? 0,
          minHours: d.minWorkHours ?? 0,
          monthlyHours: d.minMonthlyWorkHours ?? 0,
          workingDays: d.workingDays ?? {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: false,
            sunday: false,
          },
          saturdayType: d.saturdayType ?? "off",
          lateMarkAfter: d.lateMarkAfter?.substring(0, 5) ?? "",
          halfDayHours: d.halfDayHours ?? 0,
          absentHours: d.absentHours ?? 0,
          lateMarksBeforeHalfDay: d.lateMarksBeforeHalfDay ?? 0,
          halfDaysBeforeLeaveDeduction:
            d.halfDaysBeforeLeaveDeduction ?? 0,
          missingPunch: d.missingPunch ?? "Pending Approval",
          autoMarkAbsent: d.autoMarkAbsent ?? false,
          attendanceApprovalRequired:
            d.attendanceApprovalRequired ?? false,
          enableOvertime: d.overtimeEnabled ?? false,
          minimumOtMinutes: d.minimumOtMinutes ?? 0,
          maximumOtPerDay: d.maximumOtPerDay ?? 0,
          overtimeCalculationMethod:
            d.overtimeCalculationMethod ?? "Hourly",
          overtimeMultiplier:
            d.overtimeMultiplier ?? "1x",
          overtimeApprovalRequired:
            d.overtimeManagerApproval ?? false,
          biometric: d.biometric ?? false,
          gps: d.gps ?? false,
          faceRecognition: d.faceRecognition ?? true,
          mobileApp: d.mobileApp ?? true,
          webLogin: d.webLogin ?? false,
          allowManualCorrection:
            d.allowManualCorrection ?? false,
          managerApprovalRequired:
            d.managerApprovalRequired ?? false,
        });
      } else {

        setAlertConfig({
          type: "error",
          message: result.message || "Unable to fetch attendance settings."
        });
        setShowAlert(true);
      }
    } catch (err) {
      console.error(err);
      setAlertConfig({
        type: "error",
        message: "Unable to fetch attendance settings."
      });
      setShowAlert(true);
    }
  };

  const updateField = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateWorkingDay = (day) => {
    setSettings((prev) => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        [day]: !prev.workingDays[day],
      },
    }));
  };

  const validate = () => {

    if (!settings.shiftName.trim()) {
      setAlertConfig({
        type: "warning",
        message: "Shift Name is required."
      });
      setShowAlert(true);
      return false;
    }

    if (!settings.startTime) {
      setAlertConfig({
        type: "warning",
        message: "Start Time is required."
      });
      setShowAlert(true);
      return false;
    }

    if (!settings.endTime) {
      setAlertConfig({
        type: "warning",
        message: "End Time is required."
      });
      setShowAlert(true);
      return false;
    }

    if (settings.startTime >= settings.endTime) {
      setAlertConfig({
        type: "warning",
        message: "End Time must be greater than Start Time."
      });
      setShowAlert(true);
      return false;
    }

    if (Number(settings.lunchBreak) < 0) {
      setAlertConfig({
        type: "warning",
        message: "Lunch Break cannot be negative."
      });
      setShowAlert(true);
      return false;
    }

    if (Number(settings.graceTime) < 0) {
      setAlertConfig({
        type: "warning",
        message: "Grace Time cannot be negative."
      });
      setShowAlert(true);
      return false;
    }

    if (Number(settings.minHours) <= 0) {
      setAlertConfig({
        type: "warning",
        message: "Minimum Working Hours should be greater than 0."
      });
      setShowAlert(true);
      return false;
    }

    if (Number(settings.monthlyHours) <= 0) {
      if (!Object.values(settings.workingDays).some(Boolean)) {
        setAlertConfig({
          type: "warning",
          message: "Select at least one working day."
        });
        setShowAlert(true);
        return false;
      }

      if (Number(settings.graceTime) > 120) {
        setAlertConfig({
          type: "warning",
          message: "Grace Time cannot exceed 120 minutes."
        });
        setShowAlert(true);
        return false;
      }

      if (Number(settings.lunchBreak) > 240) {
        setAlertConfig({
          type: "warning",
          message: "Lunch Break cannot exceed 240 minutes."
        });
        setShowAlert(true);
        return false;
      }

    }

    if (Number(settings.halfDayHours) < Number(settings.absentHours)) {
      setAlertConfig({
        type: "warning",
        message: "Half Day hours cannot be less than Absent hours."
      });
      setShowAlert(true);
      return false;
    }

    if (settings.enableOvertime) {

      if (Number(settings.minimumOtMinutes) <= 0) {
        setAlertConfig({
          type: "warning",
          message: "Minimum OT Minutes should be greater than 0."
        });
        setShowAlert(true);
        return false;
      }

      if (Number(settings.maximumOtPerDay) <= 0) {
        setAlertConfig({
          type: "warning",
          message: "Maximum OT Per Day should be greater than 0."
        });
        setShowAlert(true);
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {

    if (!validate()) return;
    console.log(settings);

    const payload = {
      shiftName: settings.shiftName,
      startTime: settings.startTime,
      endTime: settings.endTime,
      lunchBreak: Number(settings.lunchBreak),
      graceTime: Number(settings.graceTime),
      minWorkHours: Number(settings.minHours),
      minMonthlyWorkHours: Number(settings.monthlyHours),
      workingDays: settings.workingDays,
      saturdayType: settings.saturdayType,
      lateMarkAfter: settings.lateMarkAfter,
      halfDayHours: Number(settings.halfDayHours),
      absentHours: Number(settings.absentHours),
      lateMarksBeforeHalfDay: Number(settings.lateMarksBeforeHalfDay),
      halfDaysBeforeLeaveDeduction: Number(settings.halfDaysBeforeLeaveDeduction),
      missingPunch: settings.missingPunch,
      autoMarkAbsent: settings.autoMarkAbsent,
      attendanceApprovalRequired: settings.attendanceApprovalRequired,
      overtimeEnabled: settings.enableOvertime,
      minimumOtMinutes: Number(settings.minimumOtMinutes),
      maximumOtPerDay: Number(settings.maximumOtPerDay),
      overtimeCalculationMethod: settings.overtimeCalculationMethod,
      overtimeMultiplier: settings.overtimeMultiplier,
      overtimeManagerApproval: settings.overtimeApprovalRequired,
      biometric: settings.biometric,
      gps: settings.gps,
      faceRecognition: settings.faceRecognition,
      mobileApp: settings.mobileApp,
      webLogin: settings.webLogin,
      allowManualCorrection: settings.allowManualCorrection,
      managerApprovalRequired: settings.managerApprovalRequired,
    };

    const result = await updateAttendanceSettings(payload, 0);

    if (result.status === "JWT token is expired") {
      deleteCookie("_token");
      localStorage.clear();
      setAlertConfig({
        type: "error",
        message:
          result.message ||
          "Unable to save holiday calendar."
      });
      setShowAlert(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

      return;
    }

    if (result.status === "success") {

      setAlertConfig({
        type: "success",
        message: result.message || "Settings updated successfully."
      });

      setShowAlert(true);

      setTimeout(() => {
        handleReset();
      }, 1000);

    } else {

      setAlertConfig({
        type: "error",
        message: result.message || "Failed to update settings."
      });

      setShowAlert(true);
    }
  };

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <Container fluid className="py-4">

      {showAlert && (
        <AppAlert
          type={alertConfig.type}
          message={alertConfig.message}
          onClose={() => setShowAlert(false)}
        />
      )}

      {/* Header */}

      <Row className="mb-3 align-items-center">
        <Col>
          <h3 className="fw-bold">
            <i className="bi bi-calendar-week me-2"></i>
            Attendance Settings
          </h3>

          <small className="text-muted">
            Configure attendance policies applicable to all employees.
          </small>
        </Col>

        <Col md="auto">
          <Button
            variant="outline-secondary"
            className="me-2"
            onClick={handleReset}
          >
            Reset
          </Button>

          <Button variant="primary" onClick={handleSave}>
            Save Settings
          </Button>
        </Col>
      </Row>

      {/* ====================================================== */}
      {/* Company Working Schedule */}
      {/* ====================================================== */}

      <Card className="shadow-sm mb-4">
        <Card.Header className="fw-bold">
          <i className="bi bi-calendar-week me-2"></i>
          Company Working Schedule
        </Card.Header>

        <Card.Body>

          <Row>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Shift Name</Form.Label>
                <Form.Control
                  value={settings.shiftName}
                  onChange={(e) =>
                    updateField("shiftName", e.target.value)
                  }
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Start Time</Form.Label>

                <Form.Control
                  type="time"
                  value={settings.startTime}
                  onChange={(e) =>
                    updateField("startTime", e.target.value)
                  }
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>End Time</Form.Label>

                <Form.Control
                  type="time"
                  value={settings.endTime}
                  onChange={(e) =>
                    updateField("endTime", e.target.value)
                  }
                />
              </Form.Group>
            </Col>

          </Row>

          <Row>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Lunch Break (Minutes)</Form.Label>

                <Form.Control
                  type="number"
                  value={settings.lunchBreak}
                  onChange={(e) =>
                    updateField("lunchBreak", Number(e.target.value))
                  }
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Grace Time (Minutes)</Form.Label>

                <Form.Control
                  type="number"
                  value={settings.graceTime}
                  onChange={(e) =>
                    updateField("graceTime", Number(e.target.value))
                  }
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Minimum Working Hours</Form.Label>

                <Form.Control
                  type="number"
                  value={settings.minHours}
                  onChange={(e) =>
                    updateField("minHours", Number(e.target.value))
                  }
                />
              </Form.Group>
            </Col>

          </Row>

          <Row>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Monthly Working Hours</Form.Label>

                <Form.Control
                  type="number"
                  value={settings.monthlyHours}
                  onChange={(e) =>
                    updateField("monthlyHours", Number(e.target.value))
                  }
                />
              </Form.Group>
            </Col>

          </Row>

          <hr />

          <h6 className="fw-bold mb-3">
            Working Days
          </h6>

          <Row>

            <Col md={2}>
              <Form.Check
                label="Monday"
                checked={settings.workingDays.monday}
                onChange={() => updateWorkingDay("monday")}
              />
            </Col>

            <Col md={2}>
              <Form.Check
                label="Tuesday"
                checked={settings.workingDays.tuesday}
                onChange={() => updateWorkingDay("tuesday")}
              />
            </Col>

            <Col md={2}>
              <Form.Check
                label="Wednesday"
                checked={settings.workingDays.wednesday}
                onChange={() => updateWorkingDay("wednesday")}
              />
            </Col>

            <Col md={2}>
              <Form.Check
                label="Thursday"
                checked={settings.workingDays.thursday}
                onChange={() => updateWorkingDay("thursday")}
              />
            </Col>

            <Col md={2}>
              <Form.Check
                label="Friday"
                checked={settings.workingDays.friday}
                onChange={() => updateWorkingDay("friday")}
              />
            </Col>

            <Col md={2}>
              <Form.Check
                label="Saturday"
                checked={settings.workingDays.saturday}
                onChange={() => updateWorkingDay("saturday")}
              />
            </Col>

          </Row>

          <Row className="mt-3">

            <Col md={2}>
              <Form.Check
                label="Sunday"
                checked={settings.workingDays.sunday}
                onChange={() => updateWorkingDay("sunday")}
              />
            </Col>

          </Row>

          <hr />

          <Form.Group>

            <Form.Label className="fw-bold">
              Saturday Policy
            </Form.Label>

            <Form.Select
              value={settings.saturdayType}
              onChange={(e) =>
                updateField("saturdayType", e.target.value)
              }
            >
              <option value="working">
                Every Saturday Working
              </option>

              <option value="alternate">
                Alternate Saturday
              </option>

              <option value="13">
                1st & 3rd Working
              </option>

              <option value="24">
                2nd & 4th Working
              </option>

              <option value="off">
                All Saturday Off
              </option>

            </Form.Select>

          </Form.Group>

        </Card.Body>
      </Card>

      {/* ====================================================== */}
      {/* Attendance Rules */}
      {/* ====================================================== */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="fw-bold">
          <i className="bi bi-clock-history me-2"></i>
          Attendance Rules
        </Card.Header>

        <Card.Body>
          <Row>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Late Mark After</Form.Label>
                <Form.Control
                  type="time"
                  value={settings.lateMarkAfter}
                  onChange={(e) =>
                    updateField("lateMarkAfter", e.target.value)
                  }
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Half Day If Working Hours Less Than</Form.Label>
                <Form.Control
                  type="number"
                  value={settings.halfDayHours}
                  onChange={(e) =>
                    updateField("halfDayHours", Number(e.target.value))
                  }
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Absent If Working Hours Less Than</Form.Label>
                <Form.Control
                  type="number"
                  value={settings.absentHours}
                  onChange={(e) =>
                    updateField("absentHours", Number(e.target.value))
                  }
                />
              </Form.Group>
            </Col>

          </Row>

          <Row>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Late Marks Before Half Day</Form.Label>
                <Form.Control
                  type="number"
                  value={settings.lateMarksBeforeHalfDay}
                  onChange={(e) =>
                    updateField(
                      "lateMarksBeforeHalfDay",
                      Number(e.target.value)
                    )
                  }
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Half Days Before Leave Deduction</Form.Label>
                <Form.Control
                  type="number"
                  value={settings.halfDaysBeforeLeaveDeduction}
                  onChange={(e) =>
                    updateField(
                      "halfDaysBeforeLeaveDeduction",
                      Number(e.target.value)
                    )
                  }
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Missing Punch</Form.Label>
                <Form.Select
                  value={settings.missingPunch}
                  onChange={(e) =>
                    updateField("missingPunch", e.target.value)
                  }
                >
                  <option>Pending Approval</option>
                  <option>Absent</option>
                  <option>Half Day</option>
                  <option>Ignore</option>
                </Form.Select>
              </Form.Group>
            </Col>

          </Row>

          <Row>

            <Col md={4}>
              <Form.Check
                type="switch"
                label="Auto Mark Absent"
                checked={settings.autoMarkAbsent}
                onChange={(e) =>
                  updateField("autoMarkAbsent", e.target.checked)
                }
              />
            </Col>

            <Col md={4}>
              <Form.Check
                type="switch"
                label="Attendance Approval Required"
                checked={settings.attendanceApprovalRequired}
                onChange={(e) =>
                  updateField("attendanceApprovalRequired", e.target.checked)
                }
              />
            </Col>

          </Row>

        </Card.Body>
      </Card>

      {/* ====================================================== */}
      {/* Overtime Policy */}
      {/* ====================================================== */}
      <Card className="shadow-sm mb-4">

        <Card.Header className="fw-bold">
          <i className="bi bi-stopwatch me-2"></i>
          Overtime Policy
        </Card.Header>

        <Card.Body>

          <Row>

            <Col md={4}>
              <Form.Check
                type="switch"
                label="Enable Overtime"
                checked={settings.enableOvertime}
                onChange={(e) =>
                  updateField("enableOvertime", e.target.checked)
                }
              />
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Minimum OT (Minutes)</Form.Label>
                <Form.Control
                  type="number"
                  value={settings.minimumOtMinutes}
                  disabled={!settings.enableOvertime}
                  onChange={(e) =>
                    updateField("minimumOtMinutes", Number(e.target.value))
                  }
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Maximum OT Per Day</Form.Label>
                <Form.Control
                  type="number"
                  value={settings.maximumOtPerDay}
                  disabled={!settings.enableOvertime}
                  onChange={(e) =>
                    updateField("maximumOtPerDay", Number(e.target.value))
                  }
                />
              </Form.Group>
            </Col>

          </Row>

          <hr />

          <Row>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Calculation Method</Form.Label>

                <Form.Select
                  value={settings.overtimeCalculationMethod}
                  disabled={!settings.enableOvertime}
                  onChange={(e) =>
                    updateField("overtimeCalculationMethod", e.target.value)
                  }
                >
                  <option>Hourly</option>
                  <option>Fixed</option>
                </Form.Select>

              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>OT Multiplier</Form.Label>

                <Form.Select
                  value={settings.overtimeMultiplier}
                  disabled={!settings.enableOvertime}
                  onChange={(e) =>
                    updateField("overtimeMultiplier", e.target.value)
                  }
                >
                  <option>1x</option>
                  <option>1.25x</option>
                  <option>1.5x</option>
                  <option>2x</option>
                </Form.Select>

              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Check
                type="switch"
                label="Manager Approval Required"
                checked={settings.overtimeApprovalRequired}
                disabled={!settings.enableOvertime}
                onChange={(e) =>
                  updateField("overtimeApprovalRequired", e.target.checked)
                }
              />
            </Col>

          </Row>

        </Card.Body>
      </Card>

      {/* ====================================================== */}
      {/* Attendance Mode */}
      {/* ====================================================== */}
      <Card className="shadow-sm mb-4">

        <Card.Header className="fw-bold">
          <i className="bi bi-fingerprint me-2"></i>
          Attendance Mode
        </Card.Header>

        <Card.Body>

          <Row>

            <Col md={3}>
              <Form.Check
                label="Biometric"
                checked={settings.biometric}
                onChange={(e) =>
                  updateField("biometric", e.target.checked)
                }
              />
            </Col>

            <Col md={3}>
              <Form.Check
                label="GPS"
                checked={settings.gps}
                onChange={(e) =>
                  updateField("gps", e.target.checked)
                }
              />
            </Col>

            <Col md={3}>
              <Form.Check
                label="Face Recognition"
                checked={settings.faceRecognition}
                onChange={(e) =>
                  updateField("faceRecognition", e.target.checked)
                }
              />
            </Col>

            <Col md={3}>
              <Form.Check
                label="Mobile App"
                checked={settings.mobileApp}
                onChange={(e) =>
                  updateField("mobileApp", e.target.checked)
                }
              />
            </Col>

          </Row>

          <Row className="mt-3">

            <Col md={3}>
              <Form.Check
                label="Web Login"
                checked={settings.webLogin}
                onChange={(e) =>
                  updateField("webLogin", e.target.checked)
                }
              />
            </Col>

          </Row>

          <hr />

          <Row>

            <Col md={4}>
              <Form.Check
                type="switch"
                label="Allow Manual Correction"
                checked={settings.allowManualCorrection}
                onChange={(e) =>
                  updateField("allowManualCorrection", e.target.checked)
                }
              />
            </Col>

            <Col md={4}>
              <Form.Check
                type="switch"
                label="Manager Approval Required"
                checked={settings.managerApprovalRequired}
                onChange={(e) =>
                  updateField("managerApprovalRequired", e.target.checked)
                }
              />
            </Col>

          </Row>

        </Card.Body>

      </Card>

      {/* ====================================================== */}
      <div className="text-end mb-5">

        <Button
          variant="secondary"
          className="me-2"
          onClick={handleReset}
        >
          Reset
        </Button>

        <Button
          variant="primary"
          onClick={handleSave}
        >
          <i className="bi bi-check-circle me-2"></i>

          Save Attendance Settings
        </Button>

      </div>
    </Container>
  );
}