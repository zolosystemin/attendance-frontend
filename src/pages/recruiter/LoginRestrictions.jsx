import {
    Card,
    Form,
    Row,
    Col,
    Button,
    Badge,
    InputGroup
} from "react-bootstrap";
import { useState } from "react";

export default function LoginRestrictions() {
    const [settings, setSettings] = useState({
        countries: ["India"],
        maxAttempts: 5,
        ipAddresses: [],
        ip: "",
        remember: true,
        autoLock: true,
        sessionTimeout: "30"
    });


    const update = (field, value) => {

        setSettings(prev => ({
            ...prev,
            [field]: value
        }));

    };

    const addIpAddress = () => {
        const ip = settings.ip.trim();
        if (!ip) return;

        if (settings.ipAddresses.includes(ip)) {
            return;
        }

        setSettings(prev => ({
            ...prev,
            ipAddresses: [
                ...prev.ipAddresses,
                ip
            ],
            ip: ""
        }));
    };

    const removeIp = (index) => {
        setSettings(prev => ({
            ...prev,
            ipAddresses:
                prev.ipAddresses.filter(
                    (_, i) => i !== index
                )
        }));
    };

    const countries = [
        "India",
        "USA",
        "UK",
        "Canada",
        "Australia"
    ];


    return (
        <Card className="card-modern shadow-sm">
            <Card.Body>
                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h5 className="mb-1">
                            <i className="bi bi-globe2 text-primary me-2"></i>
                            Login Restrictions
                        </h5>

                        <p className="text-muted mb-0">
                            Control login access and protect your account.
                        </p>
                    </div>

                    <Badge bg="success">
                        <i className="bi bi-shield-check me-1"></i>
                        Security Enabled
                    </Badge>
                </div>

                {/* COUNTRY RESTRICTION */}
                <div
                    className="border rounded p-3 mb-4"
                    style={{
                        background: "#fafafa"
                    }}
                >

                    <h6>
                        <i className="bi bi-geo-alt me-2"></i>
                        Location Restrictions
                    </h6>

                    <p className="text-muted small">
                        Allow login only from selected countries.
                    </p>

                    <div className="d-flex flex-wrap gap-2">
                        {
                            countries.map(country => (
                                <div
                                    key={country}
                                    className={
                                        `border rounded px-3 py-2 ${settings.countries.includes(country)
                                            ?
                                            "bg-primary text-white"
                                            :
                                            "bg-white"
                                        }`
                                    }
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        let list;
                                        if (settings.countries.includes(country)) {
                                            list =
                                                settings.countries.filter(
                                                    c => c !== country
                                                );
                                        }
                                        else {
                                            list = [
                                                ...settings.countries,
                                                country
                                            ];
                                        }
                                        update("countries", list);
                                    }}
                                >
                                    {country}
                                </div>
                            ))
                        }

                    </div>
                </div>

                {/* LOGIN PROTECTION */}
                <div
                    className="border rounded p-3 mb-4"
                    style={{
                        background: "#fafafa"
                    }}
                >

                    <h6>
                        <i className="bi bi-lock me-2"></i>
                        Login Protection
                    </h6>

                    <Row className="g-3">

                        <Col md={6}>

                            <Form.Label>
                                Maximum Failed Attempts
                            </Form.Label>

                            <Form.Control
                                type="number"
                                value={settings.maxAttempts}
                                onChange={(e) =>
                                    update(
                                        "maxAttempts",
                                        e.target.value
                                    )
                                }
                            />
                        </Col>


                        <Col md={6}>

                            <Form.Label>
                                Session Timeout
                            </Form.Label>

                            <Form.Select
                                value={
                                    settings.sessionTimeout
                                }

                                onChange={(e) =>
                                    update(
                                        "sessionTimeout",
                                        e.target.value
                                    )
                                }
                            >
                                <option value="15">
                                    15 Minutes
                                </option>

                                <option value="30">
                                    30 Minutes
                                </option>

                                <option value="60">
                                    1 Hour
                                </option>

                                <option value="120">
                                    2 Hours
                                </option>
                            </Form.Select>

                        </Col>
                    </Row>
                </div>

                {/* IP RESTRICTION */}
                <div
                    className="border rounded p-3 mb-4"
                    style={{
                        background: "#fafafa"
                    }}
                >

                    <h6>
                        <i className="bi bi-router me-2"></i>
                        IP Address Restriction
                    </h6>

                    <p className="text-muted small">
                        Allow only specific IP addresses.
                    </p>

                    <InputGroup>
                        <Form.Control
                            placeholder="192.168.1.10"
                            value={settings.ip}
                            onChange={(e) =>
                                update(
                                    "ip",
                                    e.target.value
                                )
                            }
                        />

                        <Button
                            variant="primary"
                            onClick={addIpAddress}
                        >
                            <i className="bi bi-plus-lg"></i>
                        </Button>
                    </InputGroup>

                    {
                        settings.ipAddresses.length > 0 &&
                        <div className="mt-3">

                            {
                                settings.ipAddresses.map(
                                    (ip, index) => (

                                        <div

                                            key={index}

                                            className="
                                        d-flex
                                        justify-content-between
                                        align-items-center
                                        border
                                        rounded
                                        p-2
                                        mb-2
                                        bg-white
                                        "
                                        >

                                            <span>
                                                <i className="bi bi-globe me-2 text-primary"></i>
                                                {ip}
                                            </span>

                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() =>
                                                    removeIp(index)
                                                }
                                            >
                                                <i className="bi bi-trash"></i>
                                            </Button>

                                        </div>
                                    ))}

                        </div>
                    }
                </div>

                {/* TRUSTED DEVICES */}
                <div
                    className="border rounded p-3 mb-4"
                    style={{
                        background: "#fafafa"
                    }}
                >

                    <h6>
                        <i className="bi bi-laptop me-2"></i>
                        Trusted Devices
                    </h6>

                    <Row className="g-3">
                        <Col md={6}>
                            <Form.Check
                                type="switch"
                                label="Remember trusted devices"
                                checked={
                                    settings.remember
                                }
                                onChange={(e) =>
                                    update(
                                        "remember",
                                        e.target.checked
                                    )
                                }
                            />
                        </Col>

                        <Col md={6}>
                            <Form.Check
                                type="switch"
                                label="Automatically lock suspicious activity"
                                checked={
                                    settings.autoLock
                                }
                                onChange={(e) =>
                                    update(
                                        "autoLock",
                                        e.target.checked
                                    )
                                }
                            />
                        </Col>

                    </Row>

                </div>

                <div className="text-end">
                    <Button>
                        <i className="bi bi-check-circle me-2"></i>
                        Save Restrictions
                    </Button>
                </div>

            </Card.Body>

        </Card>
    );
}