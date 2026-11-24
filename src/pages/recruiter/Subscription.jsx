import { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Badge,
    Spinner,
    Alert
} from "react-bootstrap";
import { getSubscriptionTypes } from "../../services/subscription";
import "./css/Subscription.css";

export default function Subscription() {
    const [loading, setLoading] = useState(true);
    const [plans, setPlans] = useState([]);
    const [subscribed, setSubscribed] = useState(false);
    const [currentSubscription, setCurrentSubscription] = useState(null);
    const [billingCycle, setBillingCycle] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadSubscription();
    }, []);

    // -----------------------------
    // API
    // -----------------------------
    const loadSubscription = async () => {

        setLoading(true);
        setError("");

        const response = await getSubscriptionTypes();

        console.log("API Response:", response);

        if (response.status === "Session expired, Please login again") {
            deleteCookie("_token");
            localStorage.clear();
            setAlertConfig({
                type: "error",
                message:
                    response.message
            });
            setShowAlert(true);

            setTimeout(() => {
                navigate("/login");
            }, 2000);

            return;
        }
        
        if (response.status === "success") {

            const data = response.data;

            setPlans(data.plans || []);
            setSubscribed(data.subscribed);
            setCurrentSubscription(data.currentSubscription);
            setBillingCycle(data.billingCycle);
        } else {
            setAlertConfig({
                type: "error",
                message: response?.message || "Failed to load invoices."
            });

            setShowAlert(true);
            return;
        }
        setLoading(false);
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).toUpperCase();
    };

    // -----------------------------
    // Button Click
    // -----------------------------
    const handlePlanClick = (plan) => {
        console.log(plan);
    };

    // -----------------------------
    // Loading Screen
    // -----------------------------
    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" />
                <h5 className="mt-3">
                    Loading Subscription...
                </h5>
            </Container>
        );
    }

    // -----------------------------
    // Main Page
    // -----------------------------
    return (
        <Container fluid className="subscription-page py-4">
            {/* Header */}
            <Row className="mb-4">
                <Col>
                    <div className="subscription-header">

                        <div>
                            <h2 className="fw-bold mb-1">
                                Subscription & Billing
                            </h2>

                            <p className="mb-0">
                                Manage your subscription and billing details.
                            </p>
                        </div>

                        <Badge
                            bg="light"
                            text="dark"
                            className="billing-badge"
                        >
                            {billingCycle} Billing
                        </Badge>

                    </div>
                </Col>
            </Row>

            {/* Error */}
            {
                error &&
                <Alert variant="danger">
                    {error}
                </Alert>
            }

            {/* Current Subscription */}
            {subscribed && currentSubscription && (

                <Card className="subscription-summary mb-4">
                    <Card.Body>
                        <Row className="align-items-center">
                            <Col lg={8}>
                                <div className="d-flex align-items-center">
                                    <div className="summary-icon">
                                        <i className="bi bi-award-fill"></i>
                                    </div>

                                    <div className="ms-3">
                                        <h3 className="mb-1">
                                            {currentSubscription.plan}
                                        </h3>
                                        <Badge bg="success">
                                            {currentSubscription.status}
                                        </Badge>
                                    </div>

                                </div>
                            </Col>

                            <Col
                                lg={4}
                                className="text-lg-end mt-3 mt-lg-0"
                            >
                                <Button>
                                    Manage Subscription
                                </Button>
                            </Col>
                        </Row>

                        <hr />
                        <Row>
                            <Col md={3}>
                                <small className="text-muted">
                                    Billing
                                </small>
                                <div className="fw-semibold">
                                    {billingCycle}
                                </div>
                            </Col>

                            <Col md={3}>
                                <small className="text-muted">
                                    Start Date
                                </small>

                                <div className="fw-semibold">
                                    {formatDate(currentSubscription.startDate)}
                                </div>

                            </Col>

                            <Col md={3}>
                                <small className="text-muted">
                                    Next Billing
                                </small>

                                <div className="fw-semibold">
                                    {formatDate(currentSubscription.renewalDate)}
                                </div>

                            </Col>

                            <Col md={3}>
                                <small className="text-muted">
                                    Auto Renew
                                </small>
                                <div className="fw-semibold">
                                    {
                                        currentSubscription.autoRenew
                                            ? "Enabled"
                                            : "Disabled"
                                    }
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}

            {/* Plans */}

            <Row className="g-4">

                {plans.length === 0 ? (
                    <Col>
                        <Card className="shadow-sm border-0">
                            <Card.Body className="text-center py-5">
                                <i className="bi bi-credit-card display-1 text-muted"></i>
                                <h4 className="mt-4">
                                    No Subscription Plans Available
                                </h4>
                                <p className="text-muted">
                                    Please contact administrator.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>

                ) : (
                    plans.map((plan) => {
                        const isCurrent =
                            subscribed &&
                            currentSubscription &&
                            currentSubscription.plan === plan.plan;

                        const isPremium =
                            plan.plan === "PREMIUM";

                        return (
                            <Col
                                md={6}
                                xl={6}
                                key={plan.plan}
                            >

                                <Card
                                    className={`subscription-card h-100 ${isCurrent ? "active-plan" : ""
                                        }`}
                                >
                                    {
                                        !isCurrent &&
                                        subscribed &&
                                        currentSubscription?.plan === "BASIC" &&
                                        plan.plan === "PREMIUM" &&

                                        <div className="upgrade-badge">
                                            🚀 Recommended Upgrade
                                        </div>
                                    }

                                    <Card.Body className="p-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h3 className="fw-bold mb-1">
                                                    {plan.displayName}
                                                </h3>
                                                <small className="text-muted">
                                                    Perfect for growing companies
                                                </small>
                                            </div>

                                            {isCurrent && (
                                                <Badge bg="success">
                                                    Current
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="price-box mt-4">
                                            <h1 className="price">
                                                ₹{plan.monthlyPrice}
                                            </h1>
                                            <span>
                                                / {billingCycle}
                                            </span>
                                        </div>
                                        <hr />
                                        <h6 className="fw-bold mb-3">
                                            Included Modules
                                        </h6>
                                        {plan.modules.map((module) => (
                                            <div
                                                className="feature-item"
                                                key={module}
                                            >
                                                <i className="bi bi-check-circle-fill text-success me-2"></i>
                                                {module.replaceAll("_", " ")}
                                            </div>
                                        ))}

                                        <div className="d-grid mt-4">
                                            {!subscribed ? (
                                                <Button
                                                    size="lg"
                                                    onClick={() =>
                                                        handlePlanClick(plan)
                                                    }
                                                >
                                                    Choose Plan
                                                </Button>

                                            ) : isCurrent ? (
                                                // <Button
                                                //     variant="outline-success"
                                                //     size="lg"
                                                //     disabled
                                                // >
                                                    
                                                // </Button>
                                                <h4>Current Plan</h4>

                                            ) : (
                                                <Button
                                                    variant="primary"
                                                    size="lg"
                                                    onClick={() =>
                                                        handlePlanClick(plan)
                                                    }
                                                >
                                                    Upgrade Plan
                                                </Button>

                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })
                )}
            </Row>
        </Container>
    );
}