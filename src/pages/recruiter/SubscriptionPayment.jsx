import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    CheckCircleFill,
    ShieldCheck,
    ArrowRight,
    Receipt,
} from "react-bootstrap-icons";
import { Container, Card, Row, Col, Button } from "react-bootstrap";

import "./css/SubscriptionPayment.css";

import { confirmSubscription } from "../../services/subscription";
import { deleteCookie } from "../../utils/cookie.js";
import AppAlert from "../../components/Alert.jsx";

const SubscriptionPayment = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        type: "info",
        message: ""
    });

    const params = new URLSearchParams(location.search);
    const invoiceNo = params.get("invoiceNo") || "";
    const plan = params.get("plan") || "";
    const employees = Number(params.get("employees") || 0);

    const handleConfirmSubscription = async () => {

        if (loading) {
            return;
        }

        try {

            const payload = {
                plan: plan,
                paymentMethod: "FREE",
                paymentStatus: "PAID",
                gatewayResponse: "6_MONTH_FREE_TRIAL",
                transactionId: `FREE-${Date.now()}-${Math.random()
                    .toString(36)
                    .substring(2, 8)
                    .toUpperCase()}`
            };

            setLoading(true);

            console.log(
                "CONFIRM SUBSCRIPTION API CALLED"
            );

            const response =
                await confirmSubscription(payload);

            console.log(
                "CONFIRM SUBSCRIPTION RESPONSE:",
                response
            );

            // =========================
            // SUCCESS
            // =========================
            if (response?.status === "success") {

                setAlertConfig({
                    type: "success",
                    message:
                        response?.message ||
                        "Subscription activated successfully."
                });

                setShowAlert(true);

                setTimeout(() => {
                    navigate("/");
                }, 1500);
                return;
            }

            // =========================
            // SESSION EXPIRED
            // =========================
            if (
                response?.status === "expire" ||
                response?.httpStatus === 401
            ) {

                deleteCookie("_token");

                localStorage.clear();

                setAlertConfig({
                    type: "error",
                    message:
                        response?.message ||
                        "Session expired. Please login again."
                });

                setShowAlert(true);

                setTimeout(() => {

                    navigate("/login");

                }, 1500);

                return;
            }

            // =========================
            // API ERROR
            // =========================
            setAlertConfig({
                type: "error",
                message:
                    response?.message ||
                    "Unable to activate subscription."
            });

            setShowAlert(true);

        } catch (error) {

            console.error(
                "CONFIRM SUBSCRIPTION ERROR:",
                error
            );

            const message =
                error?.response?.data?.message ||
                "Unable to activate subscription. Please try again.";

            setAlertConfig({
                type: "error",
                message
            });

            setShowAlert(true);

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="subscription-payment-page">

            {showAlert && (
                <AppAlert
                    type={alertConfig.type}
                    message={alertConfig.message}
                    onClose={() => setShowAlert(false)}
                />
            )}

            <Container>

                {/* SUCCESS */}
                <div className="payment-success">

                    <div className="success-icon">
                        <CheckCircleFill size={48} />
                    </div>

                    <h1>
                        Your Subscription is Free!
                    </h1>

                    <p>
                        Enjoy all subscription features completely free
                        for the next <strong>6 months</strong>.
                    </p>

                </div>

                <Row className="g-4">
                    {/* SUBSCRIPTION DETAILS */}
                    <Col lg={7}>
                        <Card className="payment-card">
                            <div className="card-title">
                                <Receipt size={21} />
                                <h5>
                                    Subscription Details
                                </h5>
                            </div>

                            <div className="details-list">
                                <div className="detail-row">
                                    <span>
                                        Invoice Number
                                    </span>

                                    <strong>
                                        {invoiceNo || "Generated"}
                                    </strong>
                                </div>

                                <div className="detail-row">
                                    <span>
                                        Subscription Plan
                                    </span>

                                    <strong>
                                        {plan || "Subscription"}
                                    </strong>
                                </div>

                                <div className="detail-row">
                                    <span>
                                        Employees
                                    </span>

                                    <strong>
                                        {employees}
                                    </strong>
                                </div>

                                <div className="detail-row">
                                    <span>
                                        Subscription Period
                                    </span>

                                    <strong>
                                        6 Months
                                    </strong>
                                </div>

                                <div className="detail-row">
                                    <span>
                                        Payment Status
                                    </span>

                                    <span className="status-badge">
                                        FREE
                                    </span>

                                </div>
                            </div>
                        </Card>

                    </Col>

                    {/* PAYMENT SUMMARY */}
                    <Col lg={5}>

                        <Card className="payment-summary-card">
                            <h5>
                                Payment Summary
                            </h5>

                            <div className="summary-row">

                                <span>
                                    Subscription
                                </span>

                                <span>
                                    ₹0.00
                                </span>

                            </div>

                            <div className="summary-row">

                                <span>
                                    GST
                                </span>

                                <span>
                                    ₹0.00
                                </span>

                            </div>

                            <hr />

                            <div className="total-row">

                                <span>
                                    Payable Today
                                </span>

                                <strong>
                                    ₹0.00
                                </strong>

                            </div>

                            {/* ACTION */}
                            <div className="payment-actions">
                                <Button
                                    className="continue-button"
                                    onClick={() => handleConfirmSubscription()}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                            />
                                            Activating Subscription...
                                        </>
                                    ) : (
                                        <>
                                            Claim And Continue
                                            <ArrowRight
                                                size={18}
                                                className="ms-2"
                                            />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* SECURITY / INFORMATION */}
                <Card className="activation-card">
                    <div className="activation-icon">
                        <ShieldCheck size={25} />
                    </div>

                    <div>
                        <h6>
                            You're all set!
                        </h6>

                        <p>
                            Your subscription is currently free.
                            No payment method or payment gateway is
                            required during the free period.
                        </p>
                    </div>
                </Card>

                {/* FUTURE PAYMENT NOTE */}
                <div className="future-payment-note">
                    <strong>
                        Payment gateway
                    </strong>

                    <span>
                        Payment processing will be available when
                        paid subscriptions are introduced.
                    </span>
                </div>

            </Container>
        </div>
    );
};
export default SubscriptionPayment;