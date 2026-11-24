import { useState } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";

export default function PayrollSettings() {

  const [settings, setSettings] = useState({

    // Salary Rules
    attendanceBasedPayroll: true,
    lwpDeduction: true,
    includeOvertime: true,

    // Half Day Rules
    halfDaySalary: "50",

    // Overtime
    overtimeEnabled: true,
    minimumOTMinutes: 30,
    maximumOTHours: 4,
    otCalculation: "Hourly",
    otMultiplier: "1.5x",
    overtimeApproval: true,

    // Payroll Cycle
    payrollCycle: "Monthly",
    salaryDate: 1,

    // Payment
    holidayPaid: true,
    weekendPaid: true,

    // Deductions
    lateDeduction: false,
    absentDeduction: true,

    // Payslip
    generatePayslip: true,
    emailPayslip: true,

  });


  const updateField = (field, value) => {

    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));

  };


  const handleSave = () => {

    console.log(settings);

    alert("Payroll settings saved.");

  };


  const handleReset = () => {

    window.location.reload();

  };


  return (

    <Container fluid className="py-4">


      {/* Header */}

      <Row className="mb-4 align-items-center">

        <Col>

          <h3 className="fw-bold">

            <i className="bi bi-cash-stack me-2"></i>

            Payroll Settings

          </h3>


          <small className="text-muted">

            Configure salary calculation and payroll rules.

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



      {/* Salary Rules */}


      <Card className="shadow-sm mb-4">


        <Card.Header className="fw-bold">

          Salary Rules

        </Card.Header>


        <Card.Body>


          <Row>


            <Col md={4}>

              <Form.Check

                type="switch"

                label="Attendance Based Payroll"

                checked={settings.attendanceBasedPayroll}

                onChange={(e)=>
                  updateField(
                    "attendanceBasedPayroll",
                    e.target.checked
                  )
                }

              />

            </Col>


            <Col md={4}>

              <Form.Check

                type="switch"

                label="LWP Deduction"

                checked={settings.lwpDeduction}

                onChange={(e)=>
                  updateField(
                    "lwpDeduction",
                    e.target.checked
                  )
                }

              />

            </Col>



            <Col md={4}>

              <Form.Check

                type="switch"

                label="Include Overtime"

                checked={settings.includeOvertime}

                onChange={(e)=>
                  updateField(
                    "includeOvertime",
                    e.target.checked
                  )
                }

              />

            </Col>


          </Row>


        </Card.Body>


      </Card>




      {/* Half Day Salary */}


      <Card className="shadow-sm mb-4">


        <Card.Header className="fw-bold">

          Half Day Salary Rule

        </Card.Header>


        <Card.Body>


          <Row>


            <Col md={4}>


              <Form.Group>


                <Form.Label>

                  Half Day Salary Percentage

                </Form.Label>



                <Form.Select

                  value={settings.halfDaySalary}

                  onChange={(e)=>

                    updateField(
                      "halfDaySalary",
                      e.target.value
                    )

                  }

                >

                  <option value="50">

                    50%

                  </option>


                  <option value="75">

                    75%

                  </option>


                  <option value="0">

                    No Salary

                  </option>


                </Form.Select>


              </Form.Group>


            </Col>


          </Row>


        </Card.Body>


      </Card>




      {/* Overtime Payroll */}


      <Card className="shadow-sm mb-4">


        <Card.Header className="fw-bold">

          Overtime Payment

        </Card.Header>


        <Card.Body>


          <Row>


            <Col md={4}>

              <Form.Check

                type="switch"

                label="Enable Overtime"

                checked={settings.overtimeEnabled}

                onChange={(e)=>

                  updateField(
                    "overtimeEnabled",
                    e.target.checked
                  )

                }

              />

            </Col>


            <Col md={4}>


              <Form.Group>


                <Form.Label>

                  Minimum OT Minutes

                </Form.Label>


                <Form.Control

                  type="number"

                  value={settings.minimumOTMinutes}

                  onChange={(e)=>

                    updateField(
                      "minimumOTMinutes",
                      e.target.value
                    )

                  }

                />


              </Form.Group>


            </Col>



            <Col md={4}>


              <Form.Group>


                <Form.Label>

                  Maximum OT Hours / Day

                </Form.Label>


                <Form.Control

                  type="number"

                  value={settings.maximumOTHours}

                  onChange={(e)=>

                    updateField(
                      "maximumOTHours",
                      e.target.value
                    )

                  }

                />


              </Form.Group>


            </Col>


          </Row>



          <Row className="mt-3">


            <Col md={4}>


              <Form.Group>


                <Form.Label>

                  Calculation Method

                </Form.Label>


                <Form.Select

                  value={settings.otCalculation}

                  onChange={(e)=>

                    updateField(
                      "otCalculation",
                      e.target.value
                    )

                  }

                >

                  <option>
                    Hourly
                  </option>

                  <option>
                    Per Minute
                  </option>

                  <option>
                    Fixed
                  </option>


                </Form.Select>


              </Form.Group>


            </Col>



            <Col md={4}>


              <Form.Group>


                <Form.Label>

                  OT Multiplier

                </Form.Label>


                <Form.Select

                  value={settings.otMultiplier}

                  onChange={(e)=>

                    updateField(
                      "otMultiplier",
                      e.target.value
                    )

                  }

                >

                  <option>
                    1x
                  </option>

                  <option>
                    1.25x
                  </option>

                  <option>
                    1.5x
                  </option>

                  <option>
                    2x
                  </option>


                </Form.Select>


              </Form.Group>


            </Col>



            <Col md={4}>


              <Form.Check

                className="mt-4"

                type="switch"

                label="Manager Approval Required"

                checked={settings.overtimeApproval}

                onChange={(e)=>

                  updateField(
                    "overtimeApproval",
                    e.target.checked
                  )

                }

              />


            </Col>


          </Row>


        </Card.Body>


      </Card>





      {/* Payroll Cycle */}


      <Card className="shadow-sm mb-4">


        <Card.Header className="fw-bold">

          Payroll Cycle

        </Card.Header>


        <Card.Body>


          <Row>


            <Col md={6}>


              <Form.Group>


                <Form.Label>

                  Payroll Frequency

                </Form.Label>


                <Form.Select

                  value={settings.payrollCycle}

                  onChange={(e)=>

                    updateField(
                      "payrollCycle",
                      e.target.value
                    )

                  }

                >

                  <option>
                    Monthly
                  </option>

                  <option>
                    Weekly
                  </option>


                </Form.Select>


              </Form.Group>


            </Col>



            <Col md={6}>


              <Form.Group>


                <Form.Label>

                  Salary Processing Date

                </Form.Label>


                <Form.Control

                  type="number"

                  value={settings.salaryDate}

                  onChange={(e)=>

                    updateField(
                      "salaryDate",
                      e.target.value
                    )

                  }

                />


              </Form.Group>


            </Col>


          </Row>


        </Card.Body>


      </Card>




      {/* Payment Rules */}


      <Card className="shadow-sm mb-4">


        <Card.Header className="fw-bold">

          Payment Rules

        </Card.Header>


        <Card.Body>


          <Row>


            <Col md={4}>

              <Form.Check

                type="switch"

                label="Holiday Paid"

                checked={settings.holidayPaid}

                onChange={(e)=>

                  updateField(
                    "holidayPaid",
                    e.target.checked
                  )

                }

              />

            </Col>



            <Col md={4}>

              <Form.Check

                type="switch"

                label="Weekend Paid"

                checked={settings.weekendPaid}

                onChange={(e)=>

                  updateField(
                    "weekendPaid",
                    e.target.checked
                  )

                }

              />

            </Col>



            <Col md={4}>

              <Form.Check

                type="switch"

                label="Absent Deduction"

                checked={settings.absentDeduction}

                onChange={(e)=>

                  updateField(
                    "absentDeduction",
                    e.target.checked
                  )

                }

              />

            </Col>


          </Row>


        </Card.Body>


      </Card>



      {/* Payslip */}


      <Card className="shadow-sm">


        <Card.Header className="fw-bold">

          Payslip Settings

        </Card.Header>


        <Card.Body>


          <Row>


            <Col md={6}>

              <Form.Check

                type="switch"

                label="Generate Payslip Automatically"

                checked={settings.generatePayslip}

                onChange={(e)=>

                  updateField(
                    "generatePayslip",
                    e.target.checked
                  )

                }

              />

            </Col>


            <Col md={6}>

              <Form.Check

                type="switch"

                label="Email Payslip"

                checked={settings.emailPayslip}

                onChange={(e)=>

                  updateField(
                    "emailPayslip",
                    e.target.checked
                  )

                }

              />

            </Col>


          </Row>


        </Card.Body>


      </Card>


    </Container>

  );

}