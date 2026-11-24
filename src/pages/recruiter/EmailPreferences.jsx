import {
    Card,
    Form,
    Button,
    Row,
    Col,
    Badge
} from "react-bootstrap";
import { useState } from "react";

export default function EmailPreferences() {

    const [settings, setSettings] = useState({

        login: true,
        password: true,

        candidate: true,
        interview: true,
        application: true,

        invoice: true,
        payment: true,
        subscription: true

    });
    const toggle = (key) => {

        setSettings({
            ...settings,
            [key]: !settings[key]
        });

    };

    const categories = [
        {
            title: "Account Alerts",
            icon: "bi-person-lock",
            items: [
                {
                    key: "login",
                    title: "New Login Notification",
                    desc: "Receive alerts when your account is accessed."
                },
                {
                    key: "password",
                    title: "Password Changed",
                    desc: "Notification when your password is updated."
                }
            ]
        },
        {
            title: "Recruitment Updates",
            icon: "bi-people",
            items: [
                {
                    key: "candidate",
                    title: "New Applicant Received",
                    desc: "Get notified when a candidate applies."
                },
                {
                    key: "interview",
                    title: "Interview Reminder",
                    desc: "Receive upcoming interview reminders."
                },
                {
                    key: "application",
                    title: "Application Status Updates",
                    desc: "Candidate workflow and status changes."
                }
            ]
        },
        {
            title: "Billing & Subscription",
            icon: "bi-credit-card",
            items: [
                {
                    key: "invoice",
                    title: "Invoice Generated",
                    desc: "Receive invoices and billing documents."
                },
                {
                    key: "payment",
                    title: "Payment Failed",
                    desc: "Alert when payment processing fails."
                },
                {
                    key: "subscription",
                    title: "Subscription Updates",
                    desc: "Plan renewal and subscription changes."
                }
            ]
        }
    ];

    return (
        <Card className="card-modern shadow-sm">
            <Card.Body>
                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>
                        <h5 className="mb-1">
                            <i className="bi bi-envelope-fill text-primary me-2"></i>
                            Email Preferences
                        </h5>

                        <p className="text-muted mb-0">
                            Choose which emails you want to receive.
                        </p>

                    </div>

                    <Badge bg="success">
                        <i className="bi bi-envelope-check me-1"></i>
                        Email Active
                    </Badge>
                </div>

                <Row className="g-4">
                    {
                        categories.map((category, index) => (
                            <Col md={12} key={index}>
                                <div
                                    className="border rounded p-3"
                                    style={{
                                        background: "#fafafa"
                                    }}
                                >

                                    <div className="d-flex align-items-center mb-3">
                                        <div
                                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                                            style={{
                                                width: "42px",
                                                height: "42px"
                                            }}
                                        >
                                            <i className={`bi ${category.icon}`}></i>
                                        </div>

                                        <div>
                                            <h6 className="mb-0">
                                                {category.title}
                                            </h6>
                                            <small className="text-muted">
                                                Manage {category.title.toLowerCase()} emails
                                            </small>
                                        </div>
                                    </div>

                                    <Row className="g-3">
                                        {
                                            category.items.map((item) => (

                                                <Col md={6} key={item.key}>

                                                    <div
                                                        className="bg-white border rounded p-3 d-flex justify-content-between align-items-center"
                                                    >
                                                        <div>
                                                            <strong className="d-block">
                                                                {item.title}
                                                            </strong>
                                                            <small className="text-muted">
                                                                {item.desc}
                                                            </small>
                                                        </div>
                                                        <Form.Check
                                                            type="switch"
                                                            checked={settings[item.key]}
                                                            onChange={() => toggle(item.key)}
                                                        />
                                                    </div>
                                                </Col>
                                            ))
                                        }
                                    </Row>
                                </div>
                            </Col>
                        ))
                    }
                </Row>

                <hr className="my-4" />

                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="mb-1">
                            Email Delivery
                        </h6>
                        <small className="text-muted">
                            Critical account and security emails cannot be disabled.
                                                    </small>
                    </div>

                    <Button>
                        <i className="bi bi-check-circle me-2"></i>
                        Save Preferences
                    </Button>
                </div>
            </Card.Body>
        </Card>
    )
}