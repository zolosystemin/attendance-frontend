import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { getEmployeeSettings, updateEmployeeSettings } from "../../services/companyService.js";
import AppAlert from "../../components/Alert";
import { deleteCookie } from "../../utils/cookie.js";

export default function EmployeeSettings() {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployeeSettings();
  }, []);

  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] =
    useState({
      type: "info",
      message: "",
    });

  const [settings, setSettings] = useState({
    autoEmployeeId: true,
    employeePrefix: "EMP",
    startingNumber: 1001,

    probationPeriod: 6,
    noticePeriod: 30,
    retirementAge: 60,

    requirePhoto: true,
    requireAadhaar: true,
    requirePAN: true,
    requireBankDetails: true,
    requireEmergencyContact: true,

    allowProfileUpdate: true,
    allowDocumentUpload: true,
    enableEmployeePortal: true,
  });

  const updateField = (field, value) => {

    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: ""
    }));
  };

  const loadEmployeeSettings = async () => {
    try {
      setLoading(true);
      const response = await getEmployeeSettings();
      console.log("Employee Settings Response :", response);

      if (response.status === "JWT token is expired") {
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

      if (response?.status === "success" && response?.data) {
        setSettings((prev) => ({
          ...prev,
          ...response.data
        }));

      } else {
        setShowAlert(true);
        setAlertConfig({
          type: "danger",
          message: response.message || "Unable to load settings"
        });
      }

    } catch (error) {
      console.error("Employee Settings Error:", error);

      setShowAlert(true);
      setAlertConfig({
        type: "danger",
        message: "Something went wrong"
      });

    } finally {
      setLoading(false);
    }
  };

  const validateSettings = () => {

    let newErrors = {};

    if (!settings.employeePrefix?.trim()) {
      newErrors.employeePrefix = "Employee prefix is required";
    }

    if (settings.employeePrefix?.length > 10) {
      newErrors.employeePrefix = "Maximum 10 characters allowed";
    }


    if (settings.autoEmployeeId) {

      if (!settings.startingNumber) {
        newErrors.startingNumber = "Starting number is required";
      }

      if (Number(settings.startingNumber) <= 0) {
        newErrors.startingNumber = "Must be greater than zero";
      }
    }


    if (
      Number(settings.probationPeriod) < 0 ||
      Number(settings.probationPeriod) > 24
    ) {
      newErrors.probationPeriod =
        "Must be between 0 and 24 months";
    }


    if (
      Number(settings.noticePeriod) < 0 ||
      Number(settings.noticePeriod) > 365
    ) {
      newErrors.noticePeriod =
        "Must be between 0 and 365 days";
    }


    if (
      Number(settings.retirementAge) < 18 ||
      Number(settings.retirementAge) > 100
    ) {
      newErrors.retirementAge =
        "Must be between 18 and 100";
    }


    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {

    const isValid = validateSettings();
    if (!isValid) {
      return;
    }

    try {
      console.log("Saving Employee Settings:", settings);
      const response = await updateEmployeeSettings(settings);
      console.log("Save Response:", response);

      if (response.status === "JWT token is expired") {
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

      if (response?.status === "success") {
        setAlertConfig({
          type: "success",
          message: response.message ||
            "Employee settings updated successfully."
        });

        setShowAlert(true);
        setTimeout(() => {
          handleReset();   // or await loadCompanySettings();
        }, 1000);

      } else {
        setShowAlert(true);
        setAlertConfig({
          type: "danger",
          message: response.message ||
            "Failed to update settings."
        });
      }

    } catch (error) {
      console.error("Save Employee Settings Error:", error);
      setShowAlert(true);
      setAlertConfig({
        type: "danger",
        message: "Something went wrong."
      });

    }

  };

  const handleReset = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        Loading...
      </Container>
    );
  }

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
            <i className="bi bi-people me-2"></i>
            Employee Settings
          </h3>

          <small className="text-muted">
            Configure employee profile and employment settings.
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
            variant="primary"
            onClick={handleSave}
          >
            Save Settings
          </Button>
        </Col>
      </Row>

      {/* Employee ID */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="fw-bold">
          Employee ID Configuration
        </Card.Header>

        <Card.Body>
          <Row>

            <Col md={4}>
              <Form.Check
                type="switch"
                label="Auto Generate Employee ID"
                checked={settings?.autoEmployeeId || false}
                onChange={(e) =>
                  updateField("autoEmployeeId", e.target.checked)
                }
              />
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Employee Prefix</Form.Label>

                <Form.Control
                  value={settings.employeePrefix}
                  disabled={settings.autoEmployeeId}
                  isInvalid={!!errors.employeePrefix}
                  onChange={(e) =>
                    updateField("employeePrefix", e.target.value)
                  }
                />

                <Form.Control.Feedback type="invalid">
                  {errors.employeePrefix}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Starting Number</Form.Label>

                <Form.Control
                  type="number"
                  value={settings.startingNumber}
                  disabled={settings.autoEmployeeId}
                  isInvalid={!!errors.startingNumber}
                  onChange={(e) =>
                    updateField(
                      "startingNumber",
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.startingNumber}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

          </Row>

        </Card.Body>
      </Card>

      {/* Employment */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="fw-bold">
          Employment Settings
        </Card.Header>

        <Card.Body>
          <Row>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Probation Period (Months)</Form.Label>

                <Form.Control
                  type="number"
                  value={settings.probationPeriod}
                  isInvalid={!!errors.probationPeriod}
                  onChange={(e) =>
                    updateField(
                      "probationPeriod",
                      e.target.value === ""
                        ? ""
                        : Number(e.target.value)
                    )
                  }
                />

                <Form.Control.Feedback type="invalid">
                  {errors.probationPeriod}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Notice Period (Days)</Form.Label>

                <Form.Control
                  type="number"
                  value={settings.noticePeriod}
                  isInvalid={!!errors.noticePeriod}
                  onChange={(e) =>
                    updateField(
                      "noticePeriod",
                      e.target.value === ""
                        ? ""
                        : Number(e.target.value)
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.noticePeriod}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Retirement Age</Form.Label>

                <Form.Control
                  type="number"
                  value={settings.retirementAge}
                  isInvalid={!!errors.retirementAge}
                  onChange={(e) =>
                    updateField(
                      "retirementAge",
                      e.target.value === ""
                        ? ""
                        : Number(e.target.value)
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.retirementAge}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

          </Row>
        </Card.Body>
      </Card>

      {/* Required Documents */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="fw-bold">
          Required Employee Information
        </Card.Header>

        <Card.Body>
          <Row>

            <Col md={4}>
              <Form.Check
                type="switch"
                label="Require Photo"
                checked={settings.requirePhoto || false}
                onChange={(e) =>
                  updateField("requirePhoto", e.target.checked)
                }
              />
            </Col>

            <Col md={4}>
              <Form.Check
                type="switch"
                label="Require Aadhaar"
                checked={settings.requireAadhaar || false}
                onChange={(e) =>
                  updateField("requireAadhaar", e.target.checked)
                }
              />
            </Col>

            <Col md={4}>
              <Form.Check
                type="switch"
                label="Require PAN"
                checked={settings.requirePAN || false}
                onChange={(e) =>
                  updateField("requirePAN", e.target.checked)
                }
              />
            </Col>

          </Row>

          <Row className="mt-3">

            <Col md={4}>
              <Form.Check
                type="switch"
                label="Require Bank Details"
                checked={settings.requireBankDetails || false}
                onChange={(e) =>
                  updateField("requireBankDetails", e.target.checked)
                }
              />
            </Col>

            <Col md={4}>
              <Form.Check
                type="switch"
                label="Require Emergency Contact"
                checked={settings.requireEmergencyContact || false}
                onChange={(e) =>
                  updateField("requireEmergencyContact", e.target.checked)
                }
              />
            </Col>

          </Row>

        </Card.Body>
      </Card>

      {/* Employee Portal */}
      <Card className="shadow-sm">

        <Card.Header className="fw-bold">
          Employee Portal
        </Card.Header>

        <Card.Body>
          <Row>

            <Col md={4}>
              <Form.Check
                type="switch"
                label="Allow Profile Update"
                checked={settings.allowProfileUpdate || false}
                onChange={(e) =>
                  updateField("allowProfileUpdate", e.target.checked)
                }
              />
            </Col>

            <Col md={4}>
              <Form.Check
                type="switch"
                label="Allow Document Upload"
                checked={settings.allowDocumentUpload || false}
                onChange={(e) =>
                  updateField("allowDocumentUpload", e.target.checked)
                }
              />
            </Col>

            <Col md={4}>
              <Form.Check
                type="switch"
                label="Enable Employee Portal"
                checked={settings.enableEmployeePortal || false}
                onChange={(e) =>
                  updateField("enableEmployeePortal", e.target.checked)
                }
              />
            </Col>

          </Row>

        </Card.Body>
      </Card>

    </Container>
  );
}