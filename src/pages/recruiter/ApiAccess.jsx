import {
    Card,
    Button,
    Badge,
    Row,
    Col,
    Modal
} from "react-bootstrap";
import { useState } from "react";
export default function ApiAccess() {
    const [show, setShow] = useState(false);
    const [keys, setKeys] = useState([
        {
            id: 1,
            name: "Production API",
            key: "rk_live_xxxxxxxxxxxx",
            environment: "Production",
            created: "12 July 2026",
            lastUsed: "Today",
            permissions: [
                "Candidates",
                "Jobs",
                "Applications"
            ],
            status: "Active"
        },

        {
            id: 2,
            name: "Testing API",
            key: "rk_test_xxxxxxxxxxxx",
            environment: "Testing",
            created: "05 July 2026",
            lastUsed: "Never",
            permissions: [
                "Read Only"
            ],
            status: "Active"
        }
    ]);
    const revokeKey = (id) => {
        setKeys(
            keys.filter(k => k.id !== id)
        );
    };

    return (
        <Card className="card-modern shadow-sm">
            <Card.Body>
                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h5 className="mb-1">
                            <i className="bi bi-code-slash text-primary me-2"></i>
                            API Access Management
                        </h5>

                        <p className="text-muted mb-0">
                            Create and manage API keys for integrations.
                        </p>

                    </div>

                    <Button
                        onClick={() => setShow(true)}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        Generate API Key
                    </Button>

                </div>

                <Row className="g-4">
                    {keys.map((api) => (

                        <Col md={12} key={api.id}>
                            <div
                                className="border rounded p-3"
                                style={{
                                    background: "#fafafa"
                                }}
                            >
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 className="mb-1">
                                            {api.name}
                                        </h6>

                                        <Badge
                                            bg={api.environment === "Production" ? "danger" : "warning"}
                                            className="me-2"
                                        >
                                            {api.environment}
                                        </Badge>

                                        <Badge bg="success">
                                            {api.status}
                                        </Badge>

                                    </div>

                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => revokeKey(api.id)}
                                    >
                                        <i className="bi bi-trash me-1"></i>
                                        Revoke
                                    </Button>

                                </div>

                                <hr />

                                <Row>
                                    <Col md={6}>
                                        <label className="text-muted small">
                                            API Key
                                        </label>

                                        <div className="bg-white border rounded p-2">
                                            <code>
                                                {api.key}
                                            </code>

                                            <Button
                                                size="sm"
                                                variant="light"
                                                className="float-end"
                                            >
                                                <i className="bi bi-copy"></i>
                                            </Button>

                                        </div>

                                    </Col>

                                    <Col md={3}>
                                        <label className="text-muted small">
                                            Created
                                        </label>

                                        <p>
                                            <i className="bi bi-calendar me-2"></i>
                                            {api.created}
                                        </p>

                                    </Col>

                                    <Col md={3}>
                                        <label className="text-muted small">
                                            Last Used
                                        </label>

                                        <p>
                                            <i className="bi bi-clock me-2"></i>
                                            {api.lastUsed}
                                        </p>
                                    </Col>

                                </Row>

                                <div className="mt-3">
                                    <label className="text-muted small">
                                        Permissions
                                    </label>

                                    <div>
                                        {
                                            api.permissions.map((p, i) => (
                                                <Badge
                                                    bg="primary"
                                                    className="me-2"
                                                    key={i}
                                                >
                                                    {p}
                                                </Badge>
                                            ))
                                        }
                                    </div>
                                </div>

                            </div>

                        </Col>
                    ))
                    }
                </Row>
                {
                    keys.length === 0 &&
                    <div className="text-center py-5">
                        <i className="bi bi-key fs-1 text-muted"></i>
                        <h6 className="mt-3">
                            No API Keys
                        </h6>

                        <p className="text-muted">
                            Generate your first API key to connect external applications.
                        </p>
                    </div>
                }

                {/* GENERATE MODAL */}
                <Modal
                    show={show}
                    onHide={() => setShow(false)}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Generate API Key
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p className="text-muted">
                            Create a new API key for your application.
                        </p>

                        <div className="mb-3">
                            <label>
                                Key Name
                            </label>

                            <input
                                className="form-control"
                                placeholder="Example: ATS Integration"
                            />
                        </div>

                        <div>
                            <label>
                                Permissions
                            </label>

                            <div className="mt-2">
                                <Badge bg="primary" className="me-2">
                                    Candidates
                                </Badge>

                                <Badge bg="primary" className="me-2">
                                    Jobs
                                </Badge>

                                <Badge bg="primary">
                                    Applications
                                </Badge>
                            </div>
                        </div>

                    </Modal.Body>

                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => setShow(false)}
                        >
                            Cancel
                        </Button>

                        <Button>
                            Generate Key
                        </Button>

                    </Modal.Footer>

                </Modal>
            </Card.Body>
        </Card>
    )
}