import { useState } from "react";
import {
    Container,
    Card,
    Pagination,
    Row,
    Col,
    Form,
    Modal,
    Button,
    Alert
} from "react-bootstrap";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCookie, setCookie, deleteCookie } from "../../utils/cookie.js";
import { getEmployeeList, deleteEmployee, updateEmployeeStatus } from "../../services/companyService.js";


import EmployeeToolbar from "./EmployeeToolbar";
import EmployeeTable from "./EmployeeTable";
import EmployeeFormModal from "./EmployeeFormModal";
import ViewEmployeeModal from "./ViewEmployeeModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import ImportEmployeeModal from "./ImportEmployeeModal";

export default function Employee() {
    const navigate = useNavigate();
    const companyId = localStorage.getItem("username");

    /* ================= ALERT ================= */
    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        type: "info",
        message: ""
    });

    useEffect(() => {
        const token = getCookie("_token");
        const role = localStorage.getItem("role");
        if (!token && !role) {
            navigate(`/${role.toLowerCase()}/dashboard`, { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        if (!showAlert) return;

        const timer = setTimeout(() => {
            setShowAlert(false);
        }, 3000); // 3 seconds

        return () => clearTimeout(timer);
    }, [showAlert]);

    const [employees, setEmployees] = useState([]);
    useEffect(() => {
        fetchEmployees();
    }, [companyId]);

    const fetchEmployees = async () => {

        try {
            if (!companyId) {
                console.log("Company ID missing");
                return;
            }

            const response = await getEmployeeList(companyId);
            console.log("EMPLOYEE RESPONSE:", response);

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

            if (response.status === "success") {
                const employeeData = response.data?.employees || [];
                const formattedEmployees = employeeData.map(emp => ({
                    ...emp,

                    id: emp.id,
                    empId: emp.employeeId,

                    name: emp.fullName,
                    email: emp.emailId,
                    mobile: emp.mobileNo,

                    department: emp.department,
                    designation: emp.designation,

                    status: emp.isActive
                }));
                setEmployees(formattedEmployees);

            } else {
                setEmployees([]);
                setAlertConfig({
                    type: "danger",
                    message: response.message || "No employee found"
                });
                setShowAlert(true);
            }
        } catch (error) {
            console.error(
                "FETCH EMPLOYEE ERROR",
                error
            );

            setAlertConfig({
                type: "danger",
                message: "Failed to load employees"
            });
            setShowAlert(true);
        }
    };

    const [searchTerm, setSearchTerm] = useState("");

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showStatusConfirm, setShowStatusConfirm] = useState(false);
    const [statusEmployee, setStatusEmployee] = useState(null);

    const [showAddEdit, setShowAddEdit] = useState(false);
    const [showView, setShowView] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showImport, setShowImport] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Add Employee
    const handleAdd = () => {
        setSelectedEmployee(null);
        setIsEdit(false);
        setShowAddEdit(true);
    };

    // Edit Employee
    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setIsEdit(true);
        setShowAddEdit(true);
    };

    // View Employee
    const handleView = (employee) => {
        setSelectedEmployee(employee);
        setShowView(true);
    };

    // Delete
    const handleDelete = (employee) => {
        setSelectedEmployee(employee);
        setShowDelete(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await deleteEmployee(selectedEmployee.empId);

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

            if (response.status === "success") {
                // Remove from UI
                setEmployees(prev =>
                    prev.filter(emp => emp.id !== selectedEmployee.id)
                );

                setAlertConfig({
                    type: "success",
                    message: response.message
                });
                setShowAlert(true);

                setShowDelete(false);
                setSelectedEmployee(null);

                // Reset page if current page becomes empty
                if (currentEmployees.length === 1 && currentPage > 1) {
                    setCurrentPage(prev => prev - 1);
                }
            } else {
                setAlertConfig({
                    type: "danger",
                    message: response.message
                });
                setShowAlert(true);
            }

        } catch (error) {
            console.error("DELETE ERROR:", error);

            setAlertConfig({
                type: "danger",
                message: "Failed to delete employee."
            });
            setShowAlert(true);
        }
    };

    // Toggle Status
    const handleToggle = (employee) => {
        setStatusEmployee(employee);
        setShowStatusConfirm(true);
    };

    const confirmStatusChange = async () => {
        try {

            const response = await updateEmployeeStatus(statusEmployee.empId);

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

            if (response.status === "success") {

                setEmployees(prev =>
                    prev.map(emp =>
                        emp.id === statusEmployee.id
                            ? {
                                ...emp,
                                status: !emp.status
                            }
                            : emp
                    )
                );

                setAlertConfig({
                    type: "success",
                    message: response.message
                });

                setShowAlert(true);

                setShowStatusConfirm(false);
                setStatusEmployee(null);
                setSelectedEmployee(null);

            } else {

                setAlertConfig({
                    type: "danger",
                    message: response.message
                });

                setShowAlert(true);
            }

        } catch (error) {
            console.error(error);

            setAlertConfig({
                type: "danger",
                message: "Failed to update employee status."
            });
            setShowAlert(true);
        }
    };

    // Filter employees based on search term
    const filteredEmployees = employees.filter((emp) => {
        const keyword = searchTerm.toLowerCase();
        return (
            (emp.empId || "").toLowerCase().includes(keyword) ||
            (emp.name || "").toLowerCase().includes(keyword) ||
            (emp.email || "").toLowerCase().includes(keyword) ||
            (emp.mobile || "").toLowerCase().includes(keyword) ||
            (emp.department || "").toLowerCase().includes(keyword) ||
            (emp.designation || "").toLowerCase().includes(keyword)
        );
    });

    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);

    return (
        <Container fluid className="mt-0">

            <Card>
                <Card.Body>

                    {showAlert && (
                        <Alert
                            variant={alertConfig.type === "success" ? "success" : "danger"}
                            dismissible
                            onClose={() => setShowAlert(false)}
                        >
                            {alertConfig.message}
                        </Alert>
                    )}

                    <h3 className="mb-3">Employee Management</h3>

                    <EmployeeToolbar
                        onAdd={handleAdd}
                        onImport={() => setShowImport(true)}
                        onSearch={(value) => {
                            setSearchTerm(value);
                            setCurrentPage(1);
                        }}
                        onExportExcel={() => { }}
                        onExportCSV={() => { }}
                        onDownloadTemplate={() => { }}
                    />

                    <EmployeeTable
                        employees={currentEmployees}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggle={handleToggle}
                    />

                    <Row className="align-items-center mt-3">
                        <Col md={6}>
                            <small className="text-muted">
                                Showing {filteredEmployees.length === 0 ? 0 : indexOfFirst + 1}
                                {" "}to{" "}
                                {Math.min(indexOfLast, filteredEmployees.length)}
                                {" "}of{" "}
                                {filteredEmployees.length} entries
                            </small>
                        </Col>

                        <Col md={6}
                            className="d-flex justify-content-end align-items-center">

                            <Form.Select
                                style={{ width: "70px", height: "38px" }}
                                className="me-2 my-1"
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </Form.Select>

                            {totalPages > 0 && (
                                <Pagination className="mt-3">
                                    <Pagination.Prev
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                    />

                                    {[...Array(totalPages)].map((_, index) => (

                                        <Pagination.Item
                                            key={index}
                                            active={currentPage === index + 1}
                                            onClick={() => setCurrentPage(index + 1)}
                                        >
                                            {index + 1}
                                        </Pagination.Item>

                                    ))}

                                    <Pagination.Next
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                    />

                                </Pagination>)}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <EmployeeFormModal
                show={showAddEdit}
                onHide={() => setShowAddEdit(false)}
                employee={selectedEmployee}
                isEdit={isEdit}
                employees={employees}
                setEmployees={setEmployees}
                navigate={navigate}
                setAlertConfig={setAlertConfig}
                setShowAlert={setShowAlert}
                deleteCookie={deleteCookie}
                fetchEmployees={fetchEmployees}
                mapApiErrors={(errors) => errors || {}
                }
            />

            <ViewEmployeeModal
                show={showView}
                onHide={() => setShowView(false)}
                employee={selectedEmployee}
            />

            <DeleteConfirmModal
                show={showDelete}
                onHide={() => setShowDelete(false)}
                employee={selectedEmployee}
                onConfirm={confirmDelete}
            />

            <ImportEmployeeModal
                show={showImport}
                onHide={() => setShowImport(false)}
            />

            <Modal
                show={showStatusConfirm}
                onHide={() => {
                    setShowStatusConfirm(false);
                    setStatusEmployee(null);
                }}
                centered
            >

                <Modal.Header closeButton>

                    <Modal.Title>
                        Confirm Status Change
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    {statusEmployee && (
                        <>
                            <p>
                                Are you sure you want to
                                <strong>
                                    {statusEmployee.status ? " Disable " : " Enable "}
                                </strong>
                                employee?
                            </p>

                            <div className="border rounded p-3 bg-light">
                                <strong>{statusEmployee.name}</strong>
                                <br />
                                <small>{statusEmployee.empId}</small>
                            </div>
                        </>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setShowStatusConfirm(false);
                            setStatusEmployee(null);
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant={statusEmployee?.status ? "warning" : "success"}
                        onClick={confirmStatusChange}
                    >
                        {statusEmployee?.status ? "Disable" : "Enable"}
                    </Button>

                </Modal.Footer>
            </Modal>
        </Container>
    );
}