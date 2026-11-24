import { useState, useEffect } from "react";
import { Container, Card, Row, Col, Form, Button, Table, Badge } from "react-bootstrap";
import { getHolidayCalanderList, saveHolidayCalendar } from "../../services/companyService.js";
import AppAlert from "../../components/Alert";

export default function HolidayCalendar() {
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] =
        useState({
            type: "info",
            message: "",
        });

    const [holidays, setHolidays] = useState([]);

    const fetchHolidayCalendar = async () => {
        try {
            setLoading(true);
            const result = await getHolidayCalanderList();
            console.log("Holiday List Response:", result);

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
                console.log("FULL RESPONSE:", JSON.stringify(result));

                const list = result?.data?.holidayList || result?.holidayList || [];
                setHolidays(list);
            } else {
                setAlertConfig({
                    type: "error",
                    message:
                        result.message ||
                        "Unable to fetch holiday calendar."
                });
                setShowAlert(true);
            }

        } catch (error) {
            console.error("Holiday List Error:", error);
            setAlertConfig({
                type: "error",
                message: "Unable to fetch holiday calendar."
            });
            setShowAlert(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHolidayCalendar();
    }, []);

    const addHoliday = () => {

        setHolidays([
            ...holidays,
            {
                date: "",
                name: "",
                type: "Company Holiday",
                paid: true
            }
        ]);
    };

    const updateHoliday = (index, field, value) => {
        const list = [...holidays];
        list[index][field] = value;
        setHolidays(list);
    };

    const deleteHoliday = (id, index) => {

        setHolidays(
            holidays.filter((holiday, i) =>
                id ? holiday.id !== id : i !== index
            )
        );
    };

    const handleSaveHolidayCalendar = async () => {
        console.log("Save clicked");

        try {
            if (holidays.length === 0) {
                setAlertConfig({
                    type: "warning",
                    message: "Please add at least one holiday."
                });
                setShowAlert(true);
                return;
            }

            for (let holiday of holidays) {
                if (!holiday.date || !holiday.name) {
                    setAlertConfig({
                        type: "warning",
                        message: "Holiday date and name are required."
                    });
                    setShowAlert(true);
                    return;
                }
            }

            setLoading(true);
            console.log("Sending:", holidays);

            const result = await saveHolidayCalendar(
                holidays
            );
            console.log("Response:", result);
            if (result.status === "success") {
                setAlertConfig({
                    type: "success",
                    message:
                        result.message ||
                        "Holiday calendar saved successfully."
                });
                setShowAlert(true);
                fetchHolidayCalendar();

            } else {
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

                setAlertConfig({
                    type: "error",
                    message:
                        result.message ||
                        "Unable to save holiday calendar."
                });
                setShowAlert(true);
            }
        } catch (error) {
            setAlertConfig({
                type: "error",
                message:
                    "Unable to save holiday calendar."
            });
            setShowAlert(true);
        } finally {
            setLoading(false);
        }
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
            {/* HEADER */}
            <Row className="mb-3 align-items-center">
                <Col>
                    <h3 className="fw-bold">
                        <i className="bi bi-calendar-event me-2"></i>
                        Holiday Calendar
                    </h3>

                    <small className="text-muted">
                        Manage company holidays and paid holidays.
                    </small>
                </Col>

                <Col md="auto">
                    <Button
                        variant="primary"
                        onClick={handleSaveHolidayCalendar}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Calendar"}
                    </Button>
                </Col>
            </Row>

            <Card className="shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">
                        Company Holidays
                    </span>

                    <Button
                        size="sm"
                        onClick={addHoliday}
                    >
                        <i className="bi bi-plus-lg me-1"></i>
                        Add Holiday
                    </Button>
                </Card.Header>

                <Card.Body>
                    <Table
                        bordered
                        hover
                        responsive
                    >
                        <thead>
                            <tr>
                                <th width="180">
                                    Date
                                </th>
                                <th>
                                    Holiday Name
                                </th>
                                <th width="200">
                                    Type
                                </th>
                                <th width="120">
                                    Paid
                                </th>
                                <th width="80">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                holidays.map((holiday, index) => (
                                    <tr key={holiday.id ?? `new-${index}`}>
                                        <td>
                                            <Form.Control
                                                type="date"
                                                value={holiday.date}
                                                onChange={
                                                    e =>
                                                        updateHoliday(
                                                            index,
                                                            "date",
                                                            e.target.value
                                                        )
                                                }
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                value={holiday.name}
                                                placeholder="Holiday name"
                                                onChange={
                                                    e =>
                                                        updateHoliday(
                                                            index,
                                                            "name",
                                                            e.target.value
                                                        )
                                                }
                                            />
                                        </td>
                                        <td>
                                            <Form.Select

                                                value={holiday.type}
                                                onChange={
                                                    e =>
                                                        updateHoliday(
                                                            index,
                                                            "type",
                                                            e.target.value
                                                        )
                                                }
                                            >
                                                <option>
                                                    National
                                                </option>

                                                <option>
                                                    Festival
                                                </option>

                                                <option>
                                                    Company Holiday
                                                </option>

                                                <option>
                                                    Optional
                                                </option>

                                            </Form.Select>
                                        </td>

                                        <td className="text-center">
                                            <Form.Check
                                                type="switch"
                                                checked={
                                                    holiday.paid
                                                }
                                                onChange={
                                                    e =>
                                                        updateHoliday(
                                                            index,
                                                            "paid",
                                                            e.target.checked
                                                        )
                                                }
                                            />
                                            {
                                                holiday.paid &&
                                                <Badge bg="success">
                                                    Paid
                                                </Badge>
                                            }
                                        </td>
                                        <td className="text-center">
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() =>
                                                    deleteHoliday(
                                                        holiday.id,
                                                        index
                                                    )
                                                }
                                            >
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
}