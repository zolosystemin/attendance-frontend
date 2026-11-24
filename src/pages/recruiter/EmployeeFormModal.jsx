import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import { PersonPlusFill, PencilSquare } from "react-bootstrap-icons";
import AppAlert from "../../components/Alert.jsx";
import { registerEmployee, updateEmployee } from "../../services/companyService.js";
import { getEmployeeSettings } from "../../services/companyService.js";

const initialForm = {
  empId: "",
  status: true,
  fullName: "",
  Department: "",
  designation: "",
  Employment_Type: "Permanent",
  emailId: "",
  mobileNo: "",
  gender: "",
  blood_Group: "",
  date_of_Birth: "",
  date_of_Joining: "",
  latitude: "",
  longitude: "",
  em_contact_Name: "",
  em_relation: "",
  em_Mobile: "",
  em_Email: "",
  address: "",
  employeePhoto: null,
  aadhaarNumber: "",
  panNumber: "",
  bankAccountHolder: "",
  bankName: "",
  accountNumber: "",
  confirmAccountNumber: "",
  ifscCode: "",
  bankBranch: ""
};

const DEFAULT_SETTINGS = {
  retirementAge: 60,
  startingNumber: 1001,
  requireAadhaar: false,
  requireEmergencyContact: false,
  requirePAN: false,
  requireBankDetails: false,
  probationPeriod: 3,
  noticePeriod: 30,
  allowDocumentUpload: false,
  autoEmployeeId: true,
  allowProfileUpdate: true,
  enableEmployeePortal: true,
  employeePrefix: "EMP",
  requirePhoto: false
};

export default function EmployeeFormModal({
  show,
  onHide,
  employee,
  isEdit,
  employees,
  setEmployees,
  navigate,
  fetchEmployees,
  deleteCookie,
  mapApiErrors
}) {

  const username = localStorage.getItem("username");
  const [location, setLocation] = useState("Default");
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: "info",
    message: ""
  });

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    if (!show) return;

    let cancelled = false;

    const fetchSettings = async () => {
      setSettingsLoading(true);
      setSettingsLoaded(false);

      try {
        const response = await getEmployeeSettings();

        if (cancelled) return;

        console.log("Get Employee Settings API response:", response);

        // Support both Axios response and already-extracted response
        const result = response?.data?.data
          ? response.data
          : response;

        if (result?.status === "expire") {
          deleteCookie("_token");
          localStorage.clear();
          navigate("/login");
          return;
        }

        if (result?.status !== "success") {
          setAlertConfig({
            type: "error",
            message: result?.message || "Unable to load employee settings."
          });
          setShowAlert(true);
          return;
        }

        const employeeSettings = result?.data;

        if (!employeeSettings || typeof employeeSettings !== "object") {
          throw new Error("Employee settings data is missing.");
        }

        setSettings({
          ...DEFAULT_SETTINGS,
          ...employeeSettings
        });

        setSettingsLoaded(true);

      } catch (error) {
        console.error("Employee settings error:", error);

        if (!cancelled) {
          setAlertConfig({
            type: "error",
            message: "Unable to load employee settings."
          });

          setShowAlert(true);
        }
      } finally {
        if (!cancelled) {
          setSettingsLoading(false);
        }
      }
    };

    fetchSettings();

    return () => {
      cancelled = true;
    };

  }, [show, navigate]);


  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (!form.employeePhoto) {
      setPhotoPreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(form.employeePhoto);
    setPhotoPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [form.employeePhoto]);

  useEffect(() => {
    if (isEdit && employee) {
      setForm({
        ...initialForm,
        empId: employee.empId || "",
        fullName: employee.name || "",
        Department: employee.department || "",
        designation: employee.designation || "",
        Employment_Type:
          employee.employmentType || "Permanent",
        emailId: employee.email || "",
        mobileNo: employee.mobile || "",
        gender: employee.gender || "",
        blood_Group: employee.bloodGroup || "",
        date_of_Birth:
          employee.dob || "",
        date_of_Joining:
          employee.dateOfJoining || "",
        latitude:
          employee.latitude || "",
        longitude:
          employee.longitude || "",
        em_contact_Name:
          employee.guardianName || "",
        em_relation:
          employee.guardianRelation || "",
        em_Mobile:
          employee.guardianWhatsAppNo || "",
        em_Email:
          employee.guardianEmailId || "",
        address:
          employee.address || "",
        status:
          employee.status
      });

      setLocation(
        employee.entryPoint || "Default"
      );
    }
    else {
      setForm(initialForm);
    }
  }, [employee, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));

  };

  const validateForm = () => {
    const validationErrors = {};

    if (!form.fullName.trim()) {
      validationErrors.fullName = "Employee Name is required";
    }

    if (!form.emailId.trim()) {
      validationErrors.emailId = "Email is required";
    }
    else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailId)
    ) {
      validationErrors.emailId = "Invalid Email";
    }

    if (!form.mobileNo.trim()) {
      validationErrors.mobileNo = "Mobile Number is required";
    }
    else if (
      !/^[6-9]\d{9}$/.test(form.mobileNo)
    ) {
      validationErrors.mobileNo = "Invalid Mobile Number";
    }

    if (!form.gender) {
      validationErrors.gender = "Gender is required";
    }

    if (!form.Department) {
      validationErrors.Department = "Department is required";
    }

    if (!form.designation.trim()) {
      validationErrors.designation = "Designation is required";
    }

    // Aadhaar validation
    if (settings.requireAadhaar) {
      if (!form.aadhaarNumber.trim()) {
        validationErrors.aadhaarNumber = "Aadhaar number is required";
      } else if (!/^\d{12}$/.test(form.aadhaarNumber)) {
        validationErrors.aadhaarNumber = "Enter valid 12-digit Aadhaar";
      }
    }

    // PAN validation
    if (settings.requirePAN) {
      if (!form.panNumber.trim()) {
        validationErrors.panNumber = "PAN number is required";
      } else if (
        !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.panNumber.toUpperCase())
      ) {
        validationErrors.panNumber = "Enter valid PAN number";
      }
    }

    // Photo validation
    if (
      settings.requirePhoto &&
      !form.employeePhoto &&
      !employee?.photoUrl
    ) {
      validationErrors.employeePhoto = "Employee photo is required";
    }

    // Bank validation
    if (settings.requireBankDetails) {
      const bankFields = {
        bankAccountHolder: "Account holder name",
        bankName: "Bank name",
        accountNumber: "Account number",
        confirmAccountNumber: "Confirm account number",
        ifscCode: "IFSC code"
      };

      Object.entries(bankFields).forEach(([key, label]) => {
        if (!form[key]?.trim()) {
          validationErrors[key] = `${label} is required`;
        }
      });

      const accountNumber = form.accountNumber?.trim();
      const confirmAccountNumber = form.confirmAccountNumber?.trim();

      if (
        accountNumber &&
        confirmAccountNumber &&
        accountNumber !== confirmAccountNumber
      ) {
        validationErrors.confirmAccountNumber =
          "Account numbers do not match";
      }

      if (
        form.ifscCode &&
        !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifscCode.trim().toUpperCase())
      ) {
        validationErrors.ifscCode = "Invalid IFSC code";
      }
    }


    // Emergency contact validation 
    if (settings.requireEmergencyContact) {

      if (!form.em_contact_Name?.trim()) {
        validationErrors.em_contact_Name =
          "Emergency contact name is required";
      }

      if (!form.em_relation?.trim()) {
        validationErrors.em_relation =
          "Emergency contact relationship is required";
      }

      if (!form.em_Mobile?.trim()) {
        validationErrors.em_Mobile =
          "Emergency contact mobile number is required";
      } else if (!/^[6-9]\d{9}$/.test(form.em_Mobile.trim())) {
        validationErrors.em_Mobile =
          "Enter a valid 10-digit mobile number";
      }

      // Email is optional, but validate if provided
      if (form.em_Email?.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(form.em_Email.trim())) {
          validationErrors.em_Email =
            "Enter a valid emergency contact email";
        }
      }
    }

    return validationErrors;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!settingsLoaded || settingsLoading) {
      setAlertConfig({
        type: "warning",
        message: "Please wait until employee settings are loaded."
      });
      setShowAlert(true);
      return;
    }

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      fullName: form.fullName.trim(),
      department: form.Department,
      designation: form.designation,
      employment_type: form.Employment_Type,
      companyName: username,
      emailId: form.emailId.trim(),
      mobileNo: form.mobileNo,
      gender: form.gender,
      blood_group: form.blood_Group,
      date_of_birth: form.date_of_Birth,
      date_of_joining: form.date_of_Joining,

      entryPoint: location,
      latitude: location === "Other" ? form.latitude : null,
      longitude: location === "Other" ? form.longitude : null,

      address: form.address,

      employeeId: isEdit
        ? employee.empId
        : settings.autoEmployeeId
          ? null
          : form.empId.trim(),

      ...(isEdit && {
        id: employee.id,
        isActive: form.status
      }),

      aadhaarNumber: settings.requireAadhaar
        ? form.aadhaarNumber.trim()
        : null,

      panNumber: settings.requirePAN
        ? form.panNumber.trim().toUpperCase()
        : null,

      bankDetails: settings.requireBankDetails
        ? {
          accountHolderName: form.bankAccountHolder,
          bankName: form.bankName,
          accountNumber: form.accountNumber,
          ifscCode: form.ifscCode.toUpperCase(),
          branch: form.bankBranch
        }
        : null,

      guardianName: settings.requireEmergencyContact
        ? form.em_contact_Name
        : null,

      guardianRelation: settings.requireEmergencyContact
        ? form.em_relation
        : null,

      guardianWhatsAppNo: settings.requireEmergencyContact
        ? form.em_Mobile
        : null,

      guardianEmailId: settings.requireEmergencyContact
        ? form.em_Email
        : null,

      probationPeriod: settings.probationPeriod,
      noticePeriod: settings.noticePeriod
    };
    console.log("PAYLOAD", payload);

    try {
      let apiresp;

      if (isEdit) {
        apiresp = await updateEmployee(payload);
      } else {
        const formData = {
          employee: payload,
          employeePhoto: form.employeePhoto
        };

        apiresp = await registerEmployee(formData);
      }
      const response = apiresp;
      console.log("API RESPONSE", response);

      if (response.status === "expire") {
        deleteCookie("_token");
        localStorage.clear();
        navigate("/login");
        return;
      }

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

      console.log("API RESPONSE", response.status);
      if (response.status === "failure") {
        setAlertConfig({
          type: "error",
          message: response.message || "Please fix highlighted errors"
        });

        setShowAlert(true);

        if (mapApiErrors) {
          setErrors(
            mapApiErrors(
              response.errors ||
              response.data ||
              {}
            )
          );
        }
        return;
      }

      if (response.status?.toLowerCase() === "success") {
        setAlertConfig({
          type: "success",
          message: isEdit
            ? "Employee updated successfully"
            : "Employee added successfully"
        });

        setShowAlert(true);
        setErrors({});
        setForm(initialForm);

        // reload employee list
        await fetchEmployees();

        setTimeout(() => {
          onHide();
        }, 300);

      }
    }
    catch (error) {
      console.error(error);
      setAlertConfig({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Failed to add employee"
      });

      setShowAlert(true);
    }
  };

  const bankOptions = [
    { name: "State Bank of India" },
    { name: "HDFC Bank Limited" },
    { name: "ICICI Bank Limited" },
    { name: "Axis Bank Limited" },
    { name: "Punjab National Bank" },
    { name: "Bank of Baroda" },
    { name: "Canara Bank" },
    { name: "Kotak Mahindra Bank Limited" },
    { name: "Union Bank of India" },
    { name: "IDFC FIRST Bank Limited" },
    { name: "IndusInd Bank Limited" },
    { name: "Yes Bank Limited" },
    { name: "Federal Bank Limited" },
    { name: "Indian Bank" },
    { name: "Bank of India" }
  ];

  // const mapApiErrors = (apiErrors) => {
  //     const mapped = {};

  //     const fieldMap = {
  //       fullName: fullName,
  //       Department: Department,
  //       designation: designation,
  //       Employment_Type: Employment_Type,
  //       emailId: emailId,
  //       mobileNo: mobileNo,
  //       gender: gender,
  //       blood_Group: blood_Group,
  //       date_of_Birth: date_of_Birth,
  //       date_of_Joining: date_of_Joining,
  //       latitude: latitude,
  //       longitude: longitude,
  //       em_contact_Name: em_contact_Name,
  //       em_relation: em_relation,
  //       em_Mobile: em_Mobile,
  //       em_Email: em_Email,
  //       address: address         
  //     };

  //     Object.entries(apiErrors).forEach(([key, value]) => {
  //       const formKey = fieldMap[key] || key;
  //       mapped[formKey] = value;
  //     });

  //     return mapped;
  //   };

  //   useEffect(() => {
  //     const firstErrorKey = Object.keys(errors)[0];
  //     if (firstErrorKey) {
  //       const el = document.querySelector(`[name="${firstErrorKey}"]`);
  //       el?.scrollIntoView({ behavior: "smooth", block: "center" });
  //       el?.focus();
  //     }
  //   }, [errors]);

  // }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      scrollable
    >

      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2 fw-bold">
          {isEdit ? (
            <>
              <PencilSquare size={22} />
              Edit Employee
            </>
          ) : (
            <>
              <PersonPlusFill size={22} />
              New Employee
            </>
          )}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form autoComplete="off">

          {showAlert && (
            <AppAlert
              type={alertConfig.type}
              message={alertConfig.message}
              onClose={() => setShowAlert(false)}
            />
          )}

          <Row>
            {(isEdit ) && (
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Employee ID</Form.Label>

                  <Form.Control
                    type="text"
                    name="empId"
                    value={form.empId || ""}
                    onChange={isEdit ? undefined : handleChange}
                    placeholder="Enter Employee ID"
                    readOnly={isEdit}
                    disabled={isEdit}
                  />

                  {!isEdit && (
                    <Form.Text className="text-muted">
                      Enter employee ID manually.
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            )}

            {/* Name */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Employee Name</Form.Label>

                <Form.Control
                  type="text"
                  name="fullName"
                  placeholder="Enter Employee Name"
                  value={form.fullName}
                  onChange={handleChange}
                  isInvalid={!!errors.fullName}
                />

                <Form.Control.Feedback type="invalid">
                  {errors.fullName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Date of Birth */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Date of Birth</Form.Label>

                <Form.Control
                  type="date"
                  name="date_of_Birth"
                  value={form.date_of_Birth}
                  onChange={handleChange}
                  isInvalid={!!errors.date_of_Birth}
                />

                <Form.Control.Feedback type="invalid">
                  {errors.date_of_Birth}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Email */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="emailId"
                  placeholder="Enter Email"
                  value={form.emailId}
                  onChange={handleChange}
                  isInvalid={!!errors.emailId}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.emailId}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Mobile */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="mobileNo"
                  placeholder="Enter Mobile Number"
                  value={form.mobileNo}
                  onChange={handleChange}
                  isInvalid={!!errors.mobileNo}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.mobileNo}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Aadhaar & PAN */}
            {settings.requireAadhaar && (
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Aadhaar Number <span className="text-danger">*</span>
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="aadhaarNumber"
                    maxLength={12}
                    placeholder="Enter Aadhaar Number"
                    value={form.aadhaarNumber}
                    onChange={handleChange}
                    isInvalid={!!errors.aadhaarNumber}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.aadhaarNumber}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            )}

            {settings.requirePAN && (
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    PAN Number <span className="text-danger">*</span>
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="panNumber"
                    maxLength={10}
                    placeholder="ABCDE1234F"
                    value={form.panNumber}
                    onChange={handleChange}
                    isInvalid={!!errors.panNumber}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.panNumber}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            )}

            {/* Gender */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  isInvalid={!!errors.gender}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.gender}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Blood Group */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Blood Group</Form.Label>
                <Form.Select
                  name="blood_Group"
                  value={form.blood_Group}
                  onChange={handleChange}
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Department */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Select
                  name="Department"
                  value={form.Department}
                  onChange={handleChange}
                  isInvalid={!!errors.Department}
                >
                  <option value="">Select Department</option>
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Sales">Sales</option>
                  <option value="Support">Support</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.Department}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Designation */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  type="text"
                  name="designation"
                  placeholder="Enter Designation"
                  value={form.designation}
                  onChange={handleChange}
                  isInvalid={!!errors.designation}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.designation}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Location */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="Default">Default</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Latitude & Longitude */}
            {location === "Other" && (
              <>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Latitude</Form.Label>
                    <Form.Control
                      type="text"
                      name="latitude"
                      placeholder="Latitude"
                      value={form.latitude}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Longitude</Form.Label>
                    <Form.Control
                      type="text"
                      name="longitude"
                      placeholder="Longitude"
                      value={form.longitude}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </>
            )}
          </Row>

          <Row>

            {/* Bank Details */}
            {settings.requireBankDetails && (
              <>
                <Col xs={12}>
                  <hr />
                  <h5 className="mb-3">Bank Details</h5>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Account Holder Name *</Form.Label>
                    <Form.Control
                      name="bankAccountHolder"
                      value={form.bankAccountHolder}
                      onChange={handleChange}
                      isInvalid={!!errors.bankAccountHolder}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.bankAccountHolder}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Bank Name <span className="text-danger">*</span>
                    </Form.Label>

                    <Form.Control
                      type="text"
                      list="employee-bank-list"
                      placeholder="Search or select your bank..."
                      value={form.bankName}
                      autoComplete="off"
                      onChange={(e) => {
                        setForm(prev => ({
                          ...prev,
                          bankName: e.target.value
                        }));

                        setErrors(prev => ({
                          ...prev,
                          bankName: ""
                        }));
                      }}
                      isInvalid={!!errors.bankName}
                    />

                    <datalist id="employee-bank-list">
                      {bankOptions.map((bank, index) => (
                        <option key={index} value={bank.name} />
                      ))}
                    </datalist>

                    <Form.Control.Feedback type="invalid">
                      {errors.bankName}
                    </Form.Control.Feedback>

                    <Form.Text className="text-muted">
                      Start typing your bank name to see suggestions.
                    </Form.Text>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Account Number *</Form.Label>
                    <Form.Control
                      type="password"
                      name="accountNumber"
                      value={form.accountNumber}
                      onChange={handleChange}
                      isInvalid={!!errors.accountNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.accountNumber}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Confirm Account Number <span className="text-danger">*</span>
                    </Form.Label>

                    <Form.Control
                      type="password"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="Re-enter account number"
                      value={form.confirmAccountNumber}
                      onChange={(e) => {
                        const value = e.target.value;

                        setForm(prev => ({
                          ...prev,
                          confirmAccountNumber: value
                        }));

                        setErrors(prev => ({
                          ...prev,
                          confirmAccountNumber:
                            value.trim() &&
                              value.trim() !== form.accountNumber.trim()
                              ? "Account numbers do not match"
                              : ""
                        }));
                      }}
                      isInvalid={!!errors.confirmAccountNumber}
                      isValid={
                        !!form.confirmAccountNumber &&
                        form.accountNumber.trim() === form.confirmAccountNumber.trim()
                      }
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.confirmAccountNumber}
                    </Form.Control.Feedback>

                    <Form.Control.Feedback type="valid">
                      <i className="bi bi-check-circle-fill me-1" />
                      Account numbers match
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>IFSC Code *</Form.Label>
                    <Form.Control
                      name="ifscCode"
                      maxLength={11}
                      value={form.ifscCode}
                      onChange={handleChange}
                      isInvalid={!!errors.ifscCode}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.ifscCode}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Branch</Form.Label>
                    <Form.Control
                      name="bankBranch"
                      value={form.bankBranch}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </>
            )}

            {/* Employee Photo */}
            {(settings.requirePhoto) && (
              <Col md={12}>
                <hr className="my-4" />

                <div className="mb-3">
                  <h5 className="mb-1">Employee Photo</h5>
                  <small className="text-muted">
                    Upload a professional photograph of the employee.
                  </small>
                </div>

                <div className="border rounded-3 p-3 p-md-4 bg-light">
                  <Row className="align-items-center g-4">

                    {/* Photo Preview */}
                    <Col xs={12} md={3} className="text-center">
                      <div
                        className="mx-auto rounded-circle border bg-white d-flex align-items-center justify-content-center overflow-hidden"
                        style={{
                          width: "140px",
                          height: "140px",
                          borderStyle: "dashed",
                          borderWidth: "2px"
                        }}
                      >
                        {photoPreview || employee?.photoUrl ? (
                          <img
                            src={photoPreview || employee.photoUrl}
                            alt="Employee Preview"
                            className="w-100 h-100"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div className="text-center text-muted">
                            <i
                              className="bi bi-person-circle"
                              style={{ fontSize: "55px" }}
                            />
                            <div className="small mt-1">No Photo</div>
                          </div>
                        )}
                      </div>

                      <div className="small text-muted mt-2">
                        Photo Preview
                      </div>
                    </Col>

                    {/* Upload Area */}
                    <Col xs={12} md={9}>
                      <div className="border border-2 border-dashed rounded-3 bg-white p-3 p-md-4 text-center">

                        <i
                          className="bi bi-cloud-arrow-up text-primary"
                          style={{ fontSize: "35px" }}
                        />

                        <h6 className="mt-2 mb-1">
                          {form.employeePhoto
                            ? "Photo selected successfully"
                            : "Upload employee photograph"}
                        </h6>

                        <p className="text-muted small mb-3">
                          Drag and select a photo using the browse button.
                        </p>

                        <Form.Control
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="mx-auto"
                          style={{ maxWidth: "350px" }}
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;

                            if (file) {
                              const allowedTypes = [
                                "image/jpeg",
                                "image/png",
                                "image/webp"
                              ];

                              if (!allowedTypes.includes(file.type)) {
                                setErrors(prev => ({
                                  ...prev,
                                  employeePhoto: "Only JPG, PNG and WEBP images are allowed."
                                }));
                                e.target.value = "";
                                return;
                              }

                              if (file.size > 5 * 1024 * 1024) {
                                setErrors(prev => ({
                                  ...prev,
                                  employeePhoto: "Photo size must not exceed 5 MB."
                                }));
                                e.target.value = "";
                                return;
                              }
                            }

                            setForm(prev => ({
                              ...prev,
                              employeePhoto: file
                            }));

                            setErrors(prev => ({
                              ...prev,
                              employeePhoto: ""
                            }));
                          }}
                          isInvalid={!!errors.employeePhoto}
                        />

                        <Form.Control.Feedback type="invalid">
                          {errors.employeePhoto}
                        </Form.Control.Feedback>

                        <div className="small text-muted mt-2">
                          <i className="bi bi-info-circle me-1" />
                          JPG, PNG or WEBP · Maximum size 5 MB
                        </div>

                        {form.employeePhoto && (
                          <div className="mt-3 text-success small">
                            <i className="bi bi-check-circle-fill me-1" />
                            {form.employeePhoto.name}
                          </div>
                        )}

                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            )}
          </Row>

          {settings.requireEmergencyContact && (
            <>
              <hr />
              <h5 className="mb-3">Emergency Contact</h5>

              <Row>
                {/* Contact Name */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="em_contact_Name"
                      placeholder="Enter Contact Name"
                      value={form.em_contact_Name}
                      onChange={handleChange}
                      isInvalid={!!errors.em_contact_Name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.em_contact_Name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Relation */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Relation</Form.Label>
                    <Form.Select
                      name="em_relation"
                      value={form.em_relation}
                      onChange={handleChange}
                      isInvalid={!!errors.em_relation}
                    >
                      <option value="">Select Relation</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Friend">Friend</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.em_relation}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Mobile */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="em_Mobile"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="Enter 10-digit Mobile Number"
                      value={form.em_Mobile}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 10);

                        setForm(prev => ({
                          ...prev,
                          em_Mobile: value
                        }));

                        setErrors(prev => ({
                          ...prev,
                          em_Mobile: ""
                        }));
                      }}
                      isInvalid={!!errors.em_Mobile}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.em_Mobile}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Email */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="em_Email"
                      placeholder="Enter Email Address"
                      value={form.em_Email}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.em_Email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

              </Row>
            </>
          )}

          {isEdit && (
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>

                  <Form.Select
                    value={form.status === false ? "false" : "true"}
                    onChange={(e) =>
                      setForm(prev => ({
                        ...prev,
                        status: e.target.value === "true"
                      }))
                    }
                  >
                    <option value="true">Active</option>
                    <option value="false">Disabled</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          )}
        </Form>

      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={onHide}
        >
          Cancel
        </Button>

        <Button
          variant="primary"
          onClick={handleSave}
          disabled={settingsLoading || !settingsLoaded}
        >
          {settingsLoading
            ? "Loading Settings..."
            : isEdit
              ? "Update Employee"
              : "Save Employee"}
        </Button>
      </Modal.Footer>
    </Modal>
  );

}