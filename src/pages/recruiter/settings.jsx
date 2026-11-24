import { useState } from "react";
import {
    Container,
    Card,
    Nav
} from "react-bootstrap";

import CompanySettings from "./CompanySettings";
import EmployeeSettings from "./EmployeeSettings";
import AttendanceSettings from "./AttendanceSettings";
import LeaveSettings from "./LeaveSettings";
import PayrollSettings from "./PayrollSettings";
import HolidayCalendar from "./HolidayCalendar";
import RolePermissionSettings from "./RolePermissionSettings";
import NotificationsSettings from "./NotificationsSettings";

export default function Settings() {
    const [activeTab, setActiveTab] = useState("company");

    return (
        <Container fluid className="mt-3">
            <Card className="shadow-sm">
                <Card.Body>

                    <h3 className="fw-bold mb-3">
                        <i className="bi bi-gear me-2"></i>
                        Settings
                    </h3>

                    <Nav
                        variant="tabs"
                        activeKey={activeTab}
                        onSelect={(key)=>setActiveTab(key)}
                    >

                        <Nav.Item>
                            <Nav.Link eventKey="company">
                                Company
                            </Nav.Link>
                        </Nav.Item>


                        <Nav.Item>
                            <Nav.Link eventKey="employee">
                                Employee
                            </Nav.Link>
                        </Nav.Item>


                        <Nav.Item>
                            <Nav.Link eventKey="attendance">
                                Attendance
                            </Nav.Link>
                        </Nav.Item>


                        <Nav.Item>
                            <Nav.Link eventKey="leave">
                                Leave
                            </Nav.Link>
                        </Nav.Item>


                        <Nav.Item>
                            <Nav.Link eventKey="payroll">
                                Payroll
                            </Nav.Link>
                        </Nav.Item>

                         <Nav.Item>
                            <Nav.Link eventKey="notifications">
                                Notifications
                            </Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                            <Nav.Link eventKey="holiday">
                                Holiday Calendar
                            </Nav.Link>
                        </Nav.Item>                    

                        <Nav.Item>
                            <Nav.Link eventKey="roles">
                                Roles & Permission
                            </Nav.Link>
                        </Nav.Item>

                    </Nav>

                    <div className="mt-4">

                        {
                            activeTab==="company" &&
                            <CompanySettings/>
                        }

                        {
                            activeTab==="employee" &&
                            <EmployeeSettings/>
                        }

                        {
                            activeTab==="attendance" &&
                            <AttendanceSettings/>
                        }

                        {
                            activeTab==="leave" &&
                            <LeaveSettings/>
                        }

                        {
                            activeTab==="payroll" &&
                            <PayrollSettings/>
                        }

                        {
                            activeTab==="notifications" &&
                            <Notifications/>
                        }

                         {
                            activeTab==="holiday" &&
                            <HolidayCalendar/>
                        }

                        {
                            activeTab==="roles" &&
                            <RolePermissionSettings/>
                        }

                    </div>

                </Card.Body>
            </Card>
        </Container>
    );
}
