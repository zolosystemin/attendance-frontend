import {
    Card,
    Form,
    Button,
    Row,
    Col,
    Badge
} from "react-bootstrap";
import { useState } from "react";

export default function SecurityNotifications() {
    const [settings, setSettings] = useState({
    newLogin: true,
    failedLogin: true,
    passwordChange: true,
    profileUpdate: true,

    twoFA: true,
    backupCodes: true,
    trustedDevices: true,

    apiKey: true,
    apiKeyDeleted: true,
    webhook: false,

    suspicious: true,
    blockedLogin: true,
    location: true,

    memberAdded: true,
    roleChanged: true,
    invitation: true,

    payment: true,
    invoice: true,
    subscription: true
});

    const toggle = (key) => {
        setSettings({
            ...settings,
            [key]: !settings[key]
        });
    };

    const notificationCategories = [
    {
        title: "Account Alerts",
        icon: "bi-person-lock",
        items: [
            {
                key: "newLogin",
                title: "New Login Notification",
                desc: "Receive alerts whenever your account is accessed from a new browser or device."
            },
            {
                key: "failedLogin",
                title: "Failed Login Attempts",
                desc: "Be notified after multiple unsuccessful login attempts."
            },
            {
                key: "passwordChange",
                title: "Password Changed",
                desc: "Notification whenever your account password is updated."
            },
            {
                key: "profileUpdate",
                title: "Profile Information Changed",
                desc: "Alert when your account information is modified."
            }
        ]
    },

    {
        title: "Authentication",
        icon: "bi-shield-lock",
        items: [
            {
                key: "twoFA",
                title: "Two-Factor Authentication",
                desc: "Notify when two-factor authentication is enabled, disabled or modified."
            },
            {
                key: "backupCodes",
                title: "Recovery Codes Generated",
                desc: "Alert whenever new recovery codes are generated."
            },
            {
                key: "trustedDevices",
                title: "Trusted Devices Updated",
                desc: "Receive notifications when trusted devices are added or removed."
            }
        ]
    },

    {
        title: "API & Developer",
        icon: "bi-code-slash",
        items: [
            {
                key: "apiKey",
                title: "API Key Created",
                desc: "Notify when a new API key is generated."
            },
            {
                key: "apiKeyDeleted",
                title: "API Key Revoked",
                desc: "Receive alerts whenever an API key is deleted."
            },
            {
                key: "webhook",
                title: "Webhook Changes",
                desc: "Notification when webhook configurations are modified."
            }
        ]
    },

    {
        title: "Security Monitoring",
        icon: "bi-shield-exclamation",
        items: [
            {
                key: "suspicious",
                title: "Suspicious Activity",
                desc: "Alerts for unusual login patterns or account behavior."
            },
            {
                key: "blockedLogin",
                title: "Blocked Login",
                desc: "Notification when access is blocked due to security policies."
            },
            {
                key: "location",
                title: "New Location Login",
                desc: "Receive alerts when login occurs from a new geographic location."
            }
        ]
    },

    {
        title: "Organization",
        icon: "bi-building",
        items: [
            {
                key: "memberAdded",
                title: "Member Added",
                desc: "Notify when a new member joins your organization."
            },
            {
                key: "roleChanged",
                title: "Role Changed",
                desc: "Receive alerts when user roles or permissions are modified."
            },
            {
                key: "invitation",
                title: "Invitation Accepted",
                desc: "Notification when invited users join the organization."
            }
        ]
    },

    {
        title: "Billing",
        icon: "bi-credit-card",
        items: [
            {
                key: "payment",
                title: "Payment Successful",
                desc: "Notification after successful subscription payment."
            },
            {
                key: "invoice",
                title: "Invoice Generated",
                desc: "Receive alerts whenever a new invoice is available."
            },
            {
                key: "subscription",
                title: "Subscription Renewal",
                desc: "Notify before subscription renewal or expiry."
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
                            <i className="bi bi-bell-fill text-primary me-2"></i>
                            Security Notifications
                        </h5>
                        <p className="text-muted mb-0">
                            Control alerts related to account security events.
                        </p>
                    </div>
                    <Badge bg="success">
                        <i className="bi bi-shield-check me-1"></i>
                        Protection Active
                    </Badge>
                </div>

                <Row className="g-4">
    {notificationCategories.map((category) => (
        <Col lg={6} key={category.title}>
            <Card className="border-0 shadow-sm h-100">
                <Card.Body>

                    <div className="d-flex align-items-center mb-3">
                        <div
                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                            style={{ width: 46, height: 46 }}
                        >
                            <i className={`bi ${category.icon}`}></i>
                        </div>

                        <div>
                            <h5 className="mb-0">{category.title}</h5>
                            <small className="text-muted">
                                {category.items.length} notification settings
                            </small>
                        </div>
                    </div>

                    {category.items.map((item) => (
                        <div
                            key={item.key}
                            className="d-flex justify-content-between align-items-start py-3 border-top"
                        >
                            <div className="me-3">
                                <h6 className="mb-1">{item.title}</h6>
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
                    ))}
                </Card.Body>
            </Card>
        </Col>
    ))}
</Row>
                <hr className="my-4" />

                <div className="d-flex justify-content-between align-items-center">

                    <div>
                        <h6 className="mb-1">
                            Instant Security Alerts
                        </h6>

                        <small className="text-muted">
                            Critical security events will be sent immediately.
                        </small>
                    </div>

                    <Button>
                        <i className="bi bi-check-circle me-2"></i>
                        Save Settings
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}