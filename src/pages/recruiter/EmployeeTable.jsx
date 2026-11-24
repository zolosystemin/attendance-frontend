import {
    Table,
    Badge,
    Button,
    ButtonGroup
} from "react-bootstrap";

import {
    Eye,
    PencilSquare,
    Trash,
    ToggleOn,
    ToggleOff
} from "react-bootstrap-icons";

export default function EmployeeTable({
    employees,
    onView,
    onEdit,
    onDelete,
    onToggle
}) {

    return (

        <Table
            bordered
            hover
            responsive
            className="align-middle"
        >

            <thead className="table-light">
                <tr>
                    <th width="60">#</th>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Status</th>
                    <th width="220">Action</th>
                </tr>
            </thead>
            <tbody>

                {employees.length === 0 ? (
                    <tr>
                        <td
                            colSpan="9"
                            className="text-center text-muted"
                        >
                            No Employee Found
                        </td>
                    </tr>

                ) : (

                    employees.map((emp, index) => (

                        <tr key={emp.id}>
                            <td>{index + 1}</td>
                            <td>{emp.empId}</td>
                            <td>{emp.name}</td>
                            <td>{emp.email}</td>
                            <td>{emp.mobile}</td>
                            <td>{emp.department}</td>
                            <td>{emp.designation}</td>
                            <td>
                                <Badge
                                    bg={emp.status ? "success" : "secondary"}
                                >
                                    {emp.status ? "Active" : "Disabled"}
                                </Badge>
                            </td>

                            <td>
                                <ButtonGroup>
                                    {/* View */}
                                    <Button
                                        variant="info"
                                        size="sm"
                                        title="View"
                                        onClick={() => onView(emp)}                                    >
                                        <Eye />
                                    </Button>

                                    {/* Edit */}
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        title="Edit"
                                        onClick={() => onEdit(emp)}                                    >
                                        <PencilSquare />
                                    </Button>

                                    {/* Enable / Disable */}
                                    <Button
                                        variant={emp.status ? "warning" : "success"}
                                        size="sm"
                                        title={emp.status ? "Disable" : "Enable"}
                                        onClick={() => onToggle(emp)}                                  >
                                        {emp.status ? <ToggleOff /> : <ToggleOn />}
                                    </Button>

                                    {/* Delete */}
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        title="Delete"
                                        onClick={() => onDelete(emp)}
                                    >
                                        <Trash />
                                    </Button>
                                </ButtonGroup>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </Table>
    );
}