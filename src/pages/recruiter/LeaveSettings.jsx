import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
import { getAttendanceSettings, updateAttendanceSettings } from "../../services/companyService.js";
import AppAlert from "../../components/Alert";
import { deleteCookie } from "../../utils/cookie.js";

export default function LeaveSettings() {
  const [errors, setErrors] = useState({});

  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] =
    useState({
      type: "info",
      message: "",
    });

  useEffect(() => {
    fetchLeaveSettings();
  }, []);

  const [settings, setSettings] = useState({
    annualLeave: 18,
    casualLeave: 12,
    earnedLeave: 15,
    sickLeave: 10,
    maternityLeave: 180,
    paternityLeave: 15,

    compOff: true,
    carryForward: true,
    carryForwardLimit: 30,
    leaveEncashment: false,

    sandwichLeave: false,
    halfDayLeave: true,
    negativeLeave: false,

    managerApproval: true,
    hrApproval: false,
    advanceNotice: 2,
  });

  const fetchLeaveSettings = async () => {
    try {
      const result = await getAttendanceSettings(1);
      console.log("result : ", result.data);

       if (result.status === "JWT token is expired") {
                    deleteCookie("_token");
                    localStorage.clear();
                    setAlertConfig({
                        type: "error",
                        message:
                            result.message  
                    });
                    setShowAlert(true);
                    
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                   
                    return;
                }
       
      if (result.status === "success") {
        const d = result.data;

        setSettings(prev => ({
          ...prev,

          annualLeave: d.annualLeave ?? prev.annualLeave,
          casualLeave: d.casualLeave ?? prev.casualLeave,
          earnedLeave: d.earnedLeave ?? prev.earnedLeave,
          sickLeave: d.sickLeave ?? prev.sickLeave,
          maternityLeave: d.maternityLeave ?? prev.maternityLeave,
          paternityLeave: d.paternityLeave ?? prev.paternityLeave,

          compOff: d.compOff ?? prev.compOff,
          carryForward: d.carryForward ?? prev.carryForward,
          carryForwardLimit: d.carryForwardLimit ?? prev.carryForwardLimit,
          leaveEncashment: d.leaveEncashment ?? prev.leaveEncashment,

          sandwichLeave: d.sandwichLeave ?? prev.sandwichLeave,
          halfDayLeave: d.halfDayLeave ?? prev.halfDayLeave,
          negativeLeave: d.negativeLeave ?? prev.negativeLeave,

          managerApproval: d.leaveManagerApproval ?? prev.managerApproval,
          hrApproval: d.leaveHrApproval ?? prev.hrApproval,
          advanceNotice: d.advanceNoOfDays ?? prev.advanceNotice,
        }));
      } else {
          
         setAlertConfig({
        type: "error",
        message: result.message ||"Unable to load settings.",
      });
      setShowAlert(true);
      }
    } catch (err) {
      console.error(err);
      setAlertConfig({
        type: "error",
        message: "Unable to fetch leave settings.",
      });
      setShowAlert(true);
    }
  };

  const updateField = (field, value) => {

    setSettings(prev => ({
      ...prev,
      [field]: value
    }));

    setErrors(prev => ({
      ...prev,
      [field]: ""
    }));

    if (field === "carryForward" && value === false) {
      setErrors(prev => ({
        ...prev,
        carryForwardLimit: ""
      }));
    }

  };

  const validate = () => {
    const newErrors = {};

    const numberFields = [
      { key: "annualLeave", label: "Annual Leave" },
      { key: "casualLeave", label: "Casual Leave" },
      { key: "earnedLeave", label: "Earned Leave" },
      { key: "sickLeave", label: "Sick Leave" },
      { key: "maternityLeave", label: "Maternity Leave" },
      { key: "paternityLeave", label: "Paternity Leave" },
      { key: "carryForwardLimit", label: "Carry Forward Limit" },
      { key: "advanceNotice", label: "Advance Notice" },
    ];

    numberFields.forEach(({ key, label }) => {

      if (key === "carryForwardLimit" && !settings.carryForward) {
        return;
      }
      const value = Number(settings[key]);

      if (isNaN(value) || value < 0) {
        newErrors[key] = `${label} must be a valid number greater than or equal to 0.`;
      }
    });

    if (
      settings.carryForward &&
      Number(settings.carryForwardLimit) <= 0
    ) {
      newErrors.carryForwardLimit =
        "Carry Forward Limit should be greater than 0.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setAlertConfig({
        type: "warning",
        message: "Please correct the highlighted fields.",
      });
      setShowAlert(true);
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    console.log(settings);
    try {

      const payload = {
        annualLeave: Number(settings.annualLeave),
        casualLeave: Number(settings.casualLeave),
        earnedLeave: Number(settings.earnedLeave),
        sickLeave: Number(settings.sickLeave),
        maternityLeave: Number(settings.maternityLeave),
        paternityLeave: Number(settings.paternityLeave),
        compOff: settings.compOff,
        carryForward: settings.carryForward,
        carryForwardLimit: Number(settings.carryForwardLimit),
        leaveEncashment: settings.leaveEncashment,
        sandwichLeave: settings.sandwichLeave,
        halfDayLeave: settings.halfDayLeave,
        negativeLeave: settings.negativeLeave,
        leaveManagerApproval: settings.managerApproval,
        leaveHrApproval: settings.hrApproval,
        advanceNoOfDays: Number(settings.advanceNotice)
      };

      const result = await updateAttendanceSettings(payload, 1);

       if (result.status === "JWT token is expired") {
                    deleteCookie("_token");
                    localStorage.clear();
                    setAlertConfig({
                        type: "error",
                        message:
                            result.message  
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

    } catch (err) {
      console.error(err);
      setAlertConfig({
        type: "error",
        message: "Unable to update leave settings."
      });
      setShowAlert(true);
    }
  };

  const handleReset = () => {
    window.location.reload();
  };

  console.log("showAlert:", showAlert);
console.log("alertConfig:", alertConfig);

  return (
    <Container fluid className="py-4">

      {showAlert && (
              <AppAlert
                type={alertConfig.type}
                message={alertConfig.message}
                onClose={() => setShowAlert(false)}
              />
            )}

      <Row className="mb-4 align-items-center">
        <Col>
          <h3 className="fw-bold">
            <i className="bi bi-calendar-check me-2"></i>
            Leave Settings
          </h3>

          <small className="text-muted">
            Configure leave policies and approval workflow.
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

          <Button
            onClick={handleSave}
          >
            Save Settings
          </Button>
        </Col>
      </Row>

      {/* Leave Types */}

      <Card className="shadow-sm mb-4">
        <Card.Header className="fw-bold">
          Leave Types
        </Card.Header>

        <Card.Body>

          <Row>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Annual Leave</Form.Label>

                <Form.Control
                  type="number"
                  value={settings.annualLeave}
                  isInvalid={!!errors.annualLeave}
                  onChange={(e) =>
                    updateField("annualLeave", e.target.value)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.annualLeave}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Casual Leave</Form.Label>

                <Form.Control
                  type="number"
                  value={settings.casualLeave}
                  isInvalid={!!errors.casualLeave}
                  onChange={(e) =>
                    updateField("casualLeave", e.target.value)
                  }
                />

                <Form.Control.Feedback type="invalid">
                  {errors.casualLeave}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Earned Leave</Form.Label>

                <Form.Control
                  type="number"
                  value={settings.earnedLeave}
                  isInvalid={!!errors.earnedLeave}
                  onChange={(e) =>
                    updateField("earnedLeave", e.target.value)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.earnedLeave}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

          </Row>

          <Row>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Sick Leave</Form.Label>

                <Form.Control
                  type="number"
                  value={settings.sickLeave}
                  isInvalid={!!errors.sickLeave}
                  onChange={(e) =>
                    updateField("sickLeave", e.target.value)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.sickLeave}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Maternity Leave</Form.Label>

                <Form.Control
                  type="number"
                  value={settings.maternityLeave}
                  isInvalid={!!errors.maternityLeave}
                  onChange={(e) =>
                    updateField("maternityLeave", e.target.value)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.maternityLeave}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Paternity Leave</Form.Label>

                <Form.Control
                  type="number"
                  value={settings.paternityLeave}
                  isInvalid={!!errors.paternityLeave}
                  onChange={(e) =>
                    updateField("paternityLeave", e.target.value)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.paternityLeave}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

          </Row>

        </Card.Body>

      </Card>

      {/* Leave Rules */}

      <Card className="shadow-sm mb-4">

        <Card.Header className="fw-bold">
          Leave Rules
        </Card.Header>

        <Card.Body>

          <Row>

            <Col md={3}>
              <Form.Check
                type="switch"
                label="Enable Comp Off"
                checked={settings.compOff}
                onChange={(e) =>
                  updateField("compOff", e.target.checked)
                }
              />
            </Col>

            <Col md={3}>
              <Form.Check
                type="switch"
                label="Carry Forward"
                checked={settings.carryForward}
                onChange={(e) =>
                  updateField("carryForward", e.target.checked)
                }
              />
            </Col>

            <Col md={3}>
              <Form.Check
                type="switch"
                label="Leave Encashment"
                checked={settings.leaveEncashment}
                onChange={(e) =>
                  updateField("leaveEncashment", e.target.checked)
                }
              />
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Carry Forward Limit</Form.Label>
                <Form.Control
                  type="number"
                  disabled={!settings.carryForward}
                  value={settings.carryForwardLimit}
                  isInvalid={!!errors.carryForwardLimit}
                  onChange={(e) =>
                    updateField("carryForwardLimit", e.target.value)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.carryForwardLimit}
                </Form.Control.Feedback>

              </Form.Group>
            </Col>

          </Row>

        </Card.Body>

      </Card>

      {/* Leave Restrictions */}

      <Card className="shadow-sm mb-4">

        <Card.Header className="fw-bold">
          Leave Restrictions
        </Card.Header>

        <Card.Body>

          <Row>

            <Col md={4}>
              <Form.Check
                type="switch"
                label="Enable Sandwich Leave"
                checked={settings.sandwichLeave}
                onChange={(e) =>
                  updateField("sandwichLeave", e.target.checked)
                }
              />
            </Col>

            <Col md={4}>
              <Form.Check
                type="switch"
                label="Allow Half Day Leave"
                checked={settings.halfDayLeave}
                onChange={(e) =>
                  updateField("halfDayLeave", e.target.checked)
                }
              />
            </Col>

            <Col md={4}>
              <Form.Check
                disabled={true}
                type="switch"
                label="Allow Negative Leave"
                checked={settings.negativeLeave}
                onChange={(e) =>
                  updateField("negativeLeave", e.target.checked)
                }
              />
            </Col>

          </Row>

        </Card.Body>

      </Card>

      {/* Approval Workflow */}

      <Card className="shadow-sm">

        <Card.Header className="fw-bold">
          Approval Workflow
        </Card.Header>

        <Card.Body>

          <Row>

            <Col md={3}>
              <Form.Check
                type="switch"
                label="Manager Approval"
                checked={settings.managerApproval}
                onChange={(e) =>
                  updateField("managerApproval", e.target.checked)
                }
              />
            </Col>

            <Col md={3}>
              <Form.Check
                type="switch"
                label="HR Approval"
                checked={settings.hrApproval}
                onChange={(e) =>
                  updateField("hrApproval", e.target.checked)
                }
              />
            </Col>


            <Col md={3}>
              <Form.Group>
                <Form.Label>Advance Notice (Days)</Form.Label>

                <Form.Control
                  type="number"
                  value={settings.advanceNotice}
                  isInvalid={!!errors.advanceNotice}
                  onChange={(e) =>
                    updateField("advanceNotice", e.target.value)
                  }
                />

                <Form.Control.Feedback type="invalid">
                  {errors.advanceNotice}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

          </Row>

        </Card.Body>

      </Card>

    </Container>
  );
}