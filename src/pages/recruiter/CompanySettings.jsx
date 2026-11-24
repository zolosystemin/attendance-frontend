import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button, OverlayTrigger, Tooltip
} from "react-bootstrap";
import {
  getCompanySettings,
  updateCompanySettings,
  getEntryPoints,
  saveEntryPoints,
  deleteEntryPoint as deleteEntryPointApi
} from "../../services/companyService.js";
import AppAlert from "../../components/Alert";
import { deleteCookie } from "../../utils/cookie.js";

export default function CompanySettings() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] =
    useState({
      type: "info",
      message: "",
    });

  const [entryPoints, setEntryPoints] = useState([
    {
      id: null,
      entryName: "",
      latitude: "",
      longitude: "",
      radiusMeters: 100,
      active: true
    }
  ]);

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [editable, setEditable] = useState({
    companyGst: false,
    companyPan: false,
    companyRegistrationNo: false,
    tanNo: false,
  });

  const [company, setCompany] = useState({
    companyName: "",
    companyType: "",
    companyDescription: "",
    companyEmail: "",
    phone: "",
    website: "",

    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",

    gst: "",
    pan: "",
    cin: "",
    tan: "",

    timezone: "Asia/Kolkata",
    currency: "INR",
    financialYear: "April - March",
    dateFormat: "DD/MM/YYYY",
  });

  const addEntryPoint = () => {
    setEntryPoints([
      ...entryPoints,
      {
        id: null,
        entryName: "",
        latitude: "",
        longitude: "",
        radiusMeters: 100,
        active: true
      }
    ]);
  };

  const updateEntryPoint = (index, field, value) => {
    const list = [...entryPoints];
    list[index][field] = value;
    setEntryPoints(list);
  };

  const deleteEntryPoint = async (index) => {

    const point = entryPoints[index];

    if (!point) {
      return;
    }

    if (point.id) {

      const response = await deleteEntryPointApi(point.id);
      console.log("Delete Response:", response);

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
      if (!response || response.status !== "success") {

        setAlertConfig({
          type: "error",
          message: response?.message || "Failed to delete entry point."
        });

        setShowAlert(true);
        return;
      }

      setAlertConfig({
        type: "success",
        message: response.message || "Entry point deleted successfully."
      });

      setShowAlert(true);
    }


    const list = entryPoints.filter((_, i) => i !== index);

    if (list.length === 0) {

      setEntryPoints([
        {
          id: null,
          entryName: "",
          latitude: "",
          longitude: "",
          radiusMeters: 100,
          active: true
        }
      ]);

    } else {

      setEntryPoints(list);

    }

  };


  const updateField = (field, value) => {

    setCompany((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const loadCompanySettings = async () => {
    setLoading(true);

    const response = await getCompanySettings();

    console.log("Company Settings Response :", response);

    if (response.message === "JWT token is expired") {
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

    if (response.status === "success") {
      const data = response.data.company;

      setCompany({
        companyName: data.companyName || "",
        companyType: data.companyType || "",
        companyDescription: data.companyDescription || "",
        companyEmail: data.companyEmail || "",
        phone: data.phone || "",

        websiteUrl: data.websiteUrl || "",

        companyAddress: data.companyAddress || "",
        city: data.city || "",
        state: data.state || "",
        country: data.country || "",
        zipCode: data.zipCode || "",

        companyGst: data.companyGst || "",
        companyPan: data.companyPan || "",
        companyRegistrationNo: data.companyRegistrationNo || "",
        tanNo: data.tanNo || "",

        timeZone: data.timeZone || "Asia/Kolkata",
        currency: data.currency || "INR",
        financialYear: data.financialYear || "April - March",
        dateFormat: data.dateFormat || "DD/MM/YYYY",
      });

      setEditable({
        companyGst: !data.companyGst,
        companyPan: !data.companyPan,
        companyRegistrationNo: !data.companyRegistrationNo,
        tanNo: !data.tanNo,
      });
    } else {

      setAlertConfig({
        type: "error",
        message: response.message,
      });
      setShowAlert(true);

    }

    setLoading(false);
  };

  useEffect(() => {
    loadCompanySettings();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Company Information
    if (!company.companyName?.trim()) {
      newErrors.companyName = "Company name is required.";
    }

    if (!company.companyType?.trim()) {
      newErrors.companyType = "Please select company type.";
    }

    if (!company.companyDescription?.trim()) {
      newErrors.companyDescription = "Company description is required.";
    }

    if (!company.companyEmail?.trim()) {
      newErrors.companyEmail = "Company email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(company.companyEmail)
    ) {
      newErrors.companyEmail = "Please enter a valid email address.";
    }

    if (!company.phone?.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[6-9]\d{9}$/.test(company.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }

    if (
      company.websiteUrl &&
      !/^https?:\/\/([\w-]+\.)+[\w-]{2,}(\/.*)?$/i.test(company.websiteUrl)
    ) {
      newErrors.websiteUrl = "Please enter a valid website URL.";
    }

    // Address
    if (!company.companyAddress?.trim()) {
      newErrors.companyAddress = "Company address is required.";
    }

    if (!company.city?.trim()) {
      newErrors.city = "City is required.";
    }

    if (!company.state?.trim()) {
      newErrors.state = "State is required.";
    }

    if (!company.country?.trim()) {
      newErrors.country = "Country is required.";
    }

    if (!company.zipCode?.trim()) {
      newErrors.zipCode = "Pincode is required.";
    } else if (!/^\d{6}$/.test(company.zipCode)) {
      newErrors.zipCode = "Pincode must be 6 digits.";
    }

    // Business Details (only if editable)
    // PAN
    if (editable.companyPan && company.companyPan?.trim()) {
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(company.companyPan.trim())) {
        newErrors.companyPan = "Invalid PAN Number.";
      }
    }

    // CIN
    if (editable.companyRegistrationNo && company.companyRegistrationNo?.trim()) {
      if (!/^[A-Z0-9]{10,30}$/i.test(company.companyRegistrationNo.trim())) {
        newErrors.companyRegistrationNo = "Invalid CIN.";
      }
    }

    // TAN
    if (editable.tanNo && company.tanNo?.trim()) {
      if (!/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/i.test(company.tanNo.trim())) {
        newErrors.tanNo = "Invalid TAN Number.";
      }
    }

    // GST
    if (editable.companyGst && company.companyGst?.trim()) {
      if (
        !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/i.test(company.companyGst.trim())
      ) {
        newErrors.companyGst = "Invalid GST Number.";
      }
    }

    // Regional Settings
    if (!company.timeZone?.trim()) {
      newErrors.timeZone = "Time zone is required.";
    }

    if (!company.currency?.trim()) {
      newErrors.currency = "Currency is required.";
    }

    if (!company.financialYear?.trim()) {
      newErrors.financialYear = "Financial year is required.";
    }

    if (!company.dateFormat?.trim()) {
      newErrors.dateFormat = "Date format is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const handleSave = async () => {

    if (!validateForm()) {

      setAlertConfig({
        type: "warning",
        message: "Please correct the highlighted fields."
      });
      setShowAlert(true);
      return;
    }

    setLoading(true);

    const payload = {
      email: company.companyEmail,
      mobile: company.phone,
      companyName: company.companyName,
      companyType: company.companyType,
      registrationNo: company.companyRegistrationNo,
      companyPan: company.companyPan || "",
      companyGst: company.companyGst || "",
      tanNo: company.tanNo || "",
      companyAddress: company.companyAddress,
      city: company.city,
      state: company.state,
      country: company.country,
      zipCode: company.zipCode,
      websiteUrl: company.websiteUrl || "",
      companyLogoUrl: company.companyLogoUrl || "",
      description: company.companyDescription,
      currency: company.currency,
      timeZone: company.timeZone,
      financialYear: company.financialYear,
      dateFormat: company.dateFormat
    };

    const response = await updateCompanySettings(payload);

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

    if (response.status === "success") {

      setAlertConfig({
        type: "success",
        message: response.message || "Company settings updated successfully."
      });
      setShowAlert(true);
      setTimeout(() => {
        handleReset();   // or await loadCompanySettings();
      }, 1000);

    } else {

      setAlertConfig({
        type: "error",
        message: response.message || "Failed to update company settings."
      });

      // If backend sends validation errors
      if (response.errors) {
        setErrors(response.errors);
      }
    }

    setShowAlert(true);
    setLoading(false);
  };

  // entry point setings 
  const loadEntryPoints = async () => {
    const response = await getEntryPoints();

    console.log("Entry Point Response:", response);

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

    if (response.status === "success") {

      const list = response.data?.entryPointList || [];

      setEntryPoints(
        list.map((point) => ({
          id: point.id || null,
          entryName: point.entryName || "",
          latitude: point.latitude || "",
          longitude: point.longitude || "",
          radiusMeters: point.radiusMeters || 100,
          active: point.active ?? true
        }))
      );

    } else {

      setAlertConfig({
        type: "error",
        message: response.message || "Failed to load entry points."
      });

      setShowAlert(true);
    }
  };

  useEffect(() => {
    loadEntryPoints();
  }, []);

  const handleSaveEntryPoints = async () => {
    try {

      const payload = entryPoints.map((point) => ({
        id: point.id || null,
        entryName: point.entryName || "",
        latitude: point.latitude ? Number(point.latitude) : null,
        longitude: point.longitude ? Number(point.longitude) : null,
        radiusMeters: point.radiusMeters
          ? Number(point.radiusMeters)
          : 100,
        active: Boolean(point.active)
      }));

      console.log("Entry Point Payload:", payload);

      const response = await saveEntryPoints(payload);

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

      if (response.status === "success") {

        setAlertConfig({
          type: "success",
          message:
            response.message ||
            "Company Entry point updated successfully."
        });

        setShowAlert(true);

        setTimeout(() => {
          handleReset();
        }, 1000);

      } else {

        setAlertConfig({
          type: "error",
          message:
            response.message ||
            "Failed to update company Entry point settings."
        });

        if (response.errors) {
          setErrors(response.errors);
        }

        setShowAlert(true);
      }

      setLoading(false);

    } catch (error) {

      console.error("Save Entry Point Error:", error);

      setAlertConfig({
        type: "error",
        message: "Failed to save entry points."
      });

      setShowAlert(true);
      setLoading(false);
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

      <Row className="mb-4 align-items-center">
        <Col>
          <h3 className="fw-bold">
            <i className="bi bi-building me-2"></i>
            Company Settings
          </h3>

          <small className="text-muted">
            Manage company information and regional preferences.
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

      {/* Company Information */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="fw-bold">
          Company Information
        </Card.Header>

        <Card.Body>

          <Row>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Company Name</Form.Label>

                <Form.Control
                  value={company.companyName}
                  readOnly={true}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.companyName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Company Type
                </Form.Label>

                <Form.Select
                  value={company.companyType || ""}
                  isInvalid={!!errors.companyType}
                  onChange={(e) => updateField("companyType", e.target.value)}
                >
                  <option value="">Select company type</option>
                  <option value="private_limited">Private Limited (Pvt Ltd)</option>
                  <option value="public_limited">Public Limited (Ltd)</option>
                  <option value="llp">Limited Liability Partnership (LLP)</option>
                  <option value="opc">One Person Company (OPC)</option>
                  <option value="partnership">Partnership Firm</option>
                  <option value="sole_proprietorship">Sole Proprietorship</option>
                  <option value="trust">Trust</option>
                  <option value="society">Society</option>
                  <option value="ngo">NGO</option>
                  <option value="government">Government / PSU</option>
                  <option value="other">Other</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.companyType}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Form.Group className="mb-4">
              <Form.Label>Description <span style={{ color: "red" }}>*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="companyDescription"
                value={company.companyDescription}
                onChange={(e) =>
                  updateField("companyDescription", e.target.value)
                }
                placeholder="Enter company description"
                isInvalid={!!errors.companyDescription}
              />
              <Form.Control.Feedback type="invalid">
                {errors.companyDescription}
              </Form.Control.Feedback>
            </Form.Group>

          </Row>

          <Row>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Company Email</Form.Label>

                <Form.Control
                  type="email"
                  value={company.companyEmail}
                  isInvalid={!!errors.companyEmail}
                  onChange={(e) =>
                    updateField("companyEmail", e.target.value)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.companyEmail}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>

                <Form.Control
                  value={company.phone}
                  isInvalid={!!errors.phone}
                  onChange={(e) =>
                    updateField("phone", e.target.value)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Website</Form.Label>

                <Form.Control
                  value={company.websiteUrl}
                  isInvalid={!!errors.websiteUrl}
                  onChange={(e) =>
                    updateField("websiteUrl", e.target.value)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.websiteUrl}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

          </Row>

        </Card.Body>
      </Card>

      {/* Address */}

      <Card className="shadow-sm mb-4">

        <Card.Header className="fw-bold">
          Address
        </Card.Header>

        <Card.Body>

          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>

            <Form.Control
              as="textarea"
              rows={3}
              value={company.companyAddress}
              isInvalid={!!errors.companyAddress}
              onChange={(e) =>
                updateField("companyAddress", e.target.value)
              }
            />
            <Form.Control.Feedback type="invalid">
              {errors.companyAddress}
            </Form.Control.Feedback>
          </Form.Group>

          <Row>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>

                <Form.Control
                  value={company.city}
                  isInvalid={!!errors.city}
                  onChange={(e) =>
                    updateField("city", e.target.value)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.city}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>State</Form.Label>

                <Form.Control
                  value={company.state}
                  isInvalid={!!errors.state}
                  onChange={(e) =>
                    updateField("state", e.target.value)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.state}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Country</Form.Label>

                <Form.Select
                  value={company.country || ""}
                  isInvalid={!!errors.country}
                  onChange={(e) => updateField("country", e.target.value)}
                >
                  <option value="">Select Country</option>
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Singapore">Singapore</option>
                  <option value="UAE">United Arab Emirates</option>
                  <option value="Japan">Japan</option>
                  <option value="China">China</option>
                  <option value="Other">Other</option>
                </Form.Select>

                <Form.Control.Feedback type="invalid">
                  {errors.country}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Pincode</Form.Label>

                <Form.Control
                  value={company.zipCode}
                  isInvalid={!!errors.zipCode}
                  onChange={(e) =>
                    updateField("zipCode", e.target.value)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.zipCode}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

          </Row>

        </Card.Body>
      </Card>

      {/* Business Details */}

      <Card className="shadow-sm mb-4">

        <Card.Header className="fw-bold">
          Business Details
        </Card.Header>

        <Card.Body>

          <Row>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>GST Number</Form.Label>
                <Form.Control
                  value={company.companyGst || ""}
                  isInvalid={!!errors.companyGst}
                  readOnly={!editable.companyGst}
                  onChange={(e) => updateField("companyGst", e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.companyGst}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>PAN</Form.Label>
                <Form.Control
                  value={company.companyPan || ""}
                  isInvalid={!!errors.companyPan}
                  readOnly={!editable.companyPan}
                  onChange={(e) => updateField("companyPan", e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.companyPan}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>CIN</Form.Label>
                <Form.Control
                  value={company.companyRegistrationNo || ""}
                  isInvalid={!!errors.companyRegistrationNo}
                  readOnly={!editable.companyRegistrationNo}
                  onChange={(e) => updateField("companyRegistrationNo", e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.companyRegistrationNo}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>TAN</Form.Label>
                <Form.Control
                  value={company.tanNo || ""}
                  isInvalid={!!errors.tanNo}
                  readOnly={!editable.tanNo}
                  onChange={(e) => updateField("tanNo", e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.tanNo}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

          </Row>

        </Card.Body>

      </Card>

      {/* Regional Settings */}

      <Card className="shadow-sm">

        <Card.Header className="fw-bold">
          Regional Settings
        </Card.Header>

        <Card.Body>

          <Row>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Time Zone</Form.Label>

                <Form.Select
                  value={company.timeZone}
                  isInvalid={!!errors.timeZone}
                  onChange={(e) =>
                    updateField("timeZone", e.target.value)
                  }
                >
                  <option>Asia/Kolkata</option>
                  <option>UTC</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.timeZone}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Currency</Form.Label>

                <Form.Select
                  value={company.currency}
                  isInvalid={!!errors.currency}
                  onChange={(e) =>
                    updateField("currency", e.target.value)
                  }
                >
                  <option>INR</option>
                  <option>USD</option>
                  <option>EUR</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.currency}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Financial Year</Form.Label>

                <Form.Select
                  value={company.financialYear}
                  isInvalid={!!errors.financialYear}
                  onChange={(e) =>
                    updateField("financialYear", e.target.value)
                  }
                >
                  <option>April - March</option>
                  <option>January - December</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.financialYear}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Date Format</Form.Label>

                <Form.Select
                  value={company.dateFormat}
                  isInvalid={!!errors.dateFormat}
                  onChange={(e) =>
                    updateField("dateFormat", e.target.value)
                  }
                >
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.dateFormat}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

          </Row>

        </Card.Body>

      </Card>

      {/* Entry Point Settings */}
      <Card className="shadow-sm mt-4">

        <Card.Header className="fw-bold d-flex justify-content-between align-items-center">

          <span>
            Entry Point Settings
          </span>

          <Button
            size="sm"
            onClick={addEntryPoint}
          >
            <i className="bi bi-plus-lg me-1"></i>
            Add Entry Point
          </Button>

        </Card.Header>

        <Card.Body>
          {entryPoints.map((point, index) => (
            <Row
              key={index}
              className="mb-3 align-items-end"
            >
              <Col md={3}>
                <Form.Group>

                  <Form.Label>
                    Entry Point Name
                  </Form.Label>

                  <Form.Control
                    value={point.entryName || ""}
                    placeholder="Main Gate"
                    onChange={(e) =>
                      updateEntryPoint(
                        index,
                        "entryName",
                        e.target.value
                      )
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group>

                  <Form.Label>
                    Latitude
                  </Form.Label>

                  <Form.Control
                    type="number"
                    step="any"
                    value={point.latitude || ""}
                    placeholder="e.g. 30.7046"
                    onChange={(e) =>
                      updateEntryPoint(
                        index,
                        "latitude",
                        e.target.value
                      )
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group>

                  <Form.Label>
                    Longitude
                  </Form.Label>

                  <Form.Control
                    type="number"
                    step="any"
                    value={point.longitude || ""}
                    placeholder="e.g. 76.7179"
                    onChange={(e) =>
                      updateEntryPoint(
                        index,
                        "longitude",
                        e.target.value
                      )
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group>

                  <Form.Label>
                    Attendance Radius (Meter)

                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip>
                          Example: If radius is 100 meters, employees must be within
                          100 meters of this entry point to mark attendance.
                        </Tooltip>
                      }
                    >
                      <i
                        className="bi bi-info-circle ms-2 text-primary"
                        style={{ cursor: "pointer" }}
                      ></i>
                    </OverlayTrigger>

                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="10"
                    value={point.radiusMeters || ""}
                    placeholder="100"
                    onChange={(e) =>
                      updateEntryPoint(
                        index,
                        "radiusMeters",
                        e.target.value
                      )
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={2}>

                <Form.Check
                  type="switch"
                  label="Active"
                  checked={Boolean(point.active)}
                  onChange={(e) =>
                    updateEntryPoint(
                      index,
                      "active",
                      e.target.checked
                    )
                  }
                />
              </Col>

              <Col md={1}>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={entryPoints.length === 1}
                  className="d-flex align-items-center justify-content-center"
                  onClick={() => deleteEntryPoint(index)}
                >
                  <i className="bi bi-trash-fill"></i>
                </Button>

              </Col>
            </Row>
          ))
          }
        </Card.Body>
        <Card.Footer className="d-flex justify-content-end">
          <Button
            variant="primary"
            onClick={handleSaveEntryPoints}
          >
            <i className="bi bi-check-lg me-1"></i>
            Save Settings
          </Button>
        </Card.Footer>
      </Card>

    </Container>
  );
}