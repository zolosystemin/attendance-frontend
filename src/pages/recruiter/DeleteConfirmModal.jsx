import { Modal, Button } from "react-bootstrap";
import { ExclamationTriangleFill } from "react-bootstrap-icons";

export default function DeleteConfirmModal({
    show,
    onHide,
    employee,
    onConfirm
}) {

    if (!employee) return null;

    return (

        <Modal
            show={show}
            onHide={onHide}
            centered
        >

            <Modal.Header closeButton>

                <Modal.Title className="text-danger">

                    <ExclamationTriangleFill className="me-2" />

                    Delete Employee

                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                <p className="mb-2">

                    Are you sure you want to delete this employee?

                </p>

                <div className="border rounded p-3 bg-light">

                    <strong>{employee.name}</strong>

                    <br />

                    <small className="text-muted">
                        {employee.empId}
                    </small>

                </div>

                <p className="text-danger mt-3 mb-0">

                    This action cannot be undone.

                </p>

            </Modal.Body>

            <Modal.Footer>

                <Button
                    variant="secondary"
                    onClick={onHide}
                >
                    Cancel
                </Button>

                <Button
                    variant="danger"
                    onClick={onConfirm}
                >
                    Delete
                </Button>

            </Modal.Footer>

        </Modal>

    );

}