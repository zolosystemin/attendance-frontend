import {
    Modal,
    Button,
    Form
} from "react-bootstrap";
export default function ImportEmployeeModal({ show, onHide }) {

    return (
        <Modal
            show={show}
            onHide={onHide}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Import Employees
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Download template before importing.
                </p>
                <Button
                    variant="outline-primary"
                    className="mb-3"
                >
                    Download Template
                </Button>
                <Form.Group>
                    <Form.Control
                        type="file"
                        accept=".xlsx,.csv"
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={onHide}
                >
                    Cancel
                </Button>
                <Button>
                    Upload
                </Button>
            </Modal.Footer>
        </Modal>
    )
}