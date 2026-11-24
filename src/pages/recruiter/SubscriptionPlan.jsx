import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Modal, Alert  } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  People, PersonCheck, CalendarCheck, Wallet2, PersonBadge, GeoAlt, CheckCircleFill, StarFill, ArrowRight, ShieldCheck,
  ArrowLeftRight, PauseCircle, Headset, Dash, Plus, Receipt,
} from "react-bootstrap-icons";

import "./css/SubscriptionPage.css";
import { getSubscriptionTypes, redeemCoupon, createSubscriptionInvoice } from "../../services/subscription";
import { deleteCookie } from "../../utils/cookie.js";
import AppAlert from "../../components/Alert.jsx";

const MODULE_ICONS = {
  ATTENDANCE: PersonCheck,
  LEAVE: CalendarCheck,
  PAYROLL: Wallet2,
  VISITOR: PersonBadge,
  GEO_TRACKING: GeoAlt,
};

const SubscriptionPlan = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: "info",
    message: ""
  });
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // INVOICE / BILLING CYCLE
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponResponse, setCouponResponse] = useState(null);

  // GST / TAXs
  const TAX_RATE = 18;

  const loadSubscriptionTypes = async () => {

    try {
      setLoading(true);
      setError("");

      const response = await getSubscriptionTypes();

      console.log("SUBSCRIPTION TYPE RESPONSE:", response);
      if (response?.status === "success") {
        setPlans(
          response.data?.plans || []
        );

      } else
        if (response?.message === "JWT token is expired" || response?.status === "expire") {
          deleteCookie("_token");
          deleteCookie("_session_id");
          localStorage.clear();
          setAlertConfig({
            type: "error",
            message:
              response.message ||
              "Unable to load subscription plans."
          });
          setShowAlert(true);

          setTimeout(() => {
            navigate("/login");
          }, 2000);

          return;
        }
        else {
          setAlertConfig({
            type: "error",
            message:
              response.message ||
              "Unable to load subscription plans."
          });
          setShowAlert(true);
        }
    } catch (error) {
      console.error(
        "LOAD SUBSCRIPTION TYPES ERROR",
        error
      );

      setAlertConfig({
        type: "error",
        message:
          "Unable to load subscription plans."
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptionTypes();
  }, []);

  const [employees, setEmployees] = useState(20);
  const MIN_EMPLOYEES = 1;

  const getPlanTotal = (plan) => {
    return Number(plan.monthlyPrice || 0) * employees;
  };

  const decreaseEmployees = () => {
    setEmployees((current) => Math.max(MIN_EMPLOYEES, current - 1));
  };

  const increaseEmployees = () => {
    setEmployees((current) => current + 1);
  };

  const handleEmployeeChange = (event) => {
    const value = Number(event.target.value);

    if (!Number.isNaN(value)) {
      setEmployees(Math.max(MIN_EMPLOYEES, value));
    }
  };

  const choosePlan = (plan) => {

    const amount = getPlanTotal(plan);
    const invoicePreview = {
        plan: plan.plan,
        displayName: plan.displayName,
        employees,
        pricePerEmployee: Number(plan.monthlyPrice),
        amount,
        billingCycle: "Monthly",
        modules: plan.modules || [],
    };

    // Reset coupon
    setCouponCode("");
    setCouponApplied(false);
    setCouponDiscount(0);
    setCouponError("");
    setCouponResponse(null);

    setSelectedPlan(invoicePreview);
    setShowInvoice(true);
};

  const applyCoupon = async () => {

  const code = couponCode.trim().toUpperCase();

  if (!code) {
    setCouponError("Please enter a coupon code.");
    return;
  }

  if (!selectedPlan) {
    setCouponError("Please select a subscription plan.");
    return;
  }

  try {

    setCouponError("");
    setLoading(true);

    console.log("REDEEM COUPON REQUEST:", {
      couponCode: code,
      planName: selectedPlan.plan,
      employees: selectedPlan.employees,
      subtotal: selectedPlan.amount
    });

    const response = await redeemCoupon({
      couponCode: code,
      planName: selectedPlan.plan,
      employees: selectedPlan.employees,
      subtotal: selectedPlan.amount
    });

    console.log("REDEEM COUPON RESPONSE:", response);

    if (!response || response.status !== "success") {

      setCouponApplied(false);
      setCouponDiscount(0);
      setCouponResponse(null);

      setCouponError(
        response?.message ||
        "Invalid or expired coupon code."
      );

      return;
    } 

    const couponData = response.data || response;
    const discount = Number(couponData.discount || 0);

    setCouponResponse(couponData);
    setCouponDiscount(discount);
    setCouponApplied(true);
    setCouponError("");

  } catch (error) {

    console.error("APPLY COUPON ERROR:", error);

    setCouponApplied(false);
    setCouponDiscount(0);
    setCouponResponse(null);

    const message =
      error?.response?.data?.message ||
      error?.response?.data?.data?.message ||
      "Unable to validate coupon.";

    setCouponError(message);

  } finally {
    setLoading(false);
  }
};

  const getTaxableAmount = () => {
    const subtotal = selectedPlan?.amount || 0;
    return Math.max(
      0,
      subtotal - couponDiscount
    );
  };

  const getTaxAmount = () => {
    const taxableAmount = getTaxableAmount();
    return taxableAmount * (TAX_RATE / 100);
  };

  const getFinalAmount = () => {
    const taxableAmount = getTaxableAmount();
    const tax = getTaxAmount();
    return taxableAmount + tax;
  };

  // CHECKOUT
  const generateInvoice = async () => {

    if (!selectedPlan) {
        setCouponError("Please select a subscription plan.");
        return;
    }

    try {

        setLoading(true);

        const taxableAmount = getTaxableAmount();
        const taxAmount = getTaxAmount();
        const totalAmount = getFinalAmount();

        const payload = {

            // Subscription
            plan: selectedPlan.plan,
            // Billing
            startDate: new Date()
                .toISOString()
                .split("T")[0],
            autoRenew: true,
            // Coupon
            referalCode: couponApplied
                ? couponCode
                : null,
            // Amounts
            baseAmount: Number(selectedPlan.amount),
            taxAmount: Number(taxAmount.toFixed(2)),
            discountAmount: Number(
                couponDiscount.toFixed(2)
            ),

            totalAmount: Number(
                totalAmount.toFixed(2)
            ),

            // Invoice
            invoiceDate: new Date()
                .toISOString()
                .split("T")[0],

            dueDate: new Date()
                .toISOString()
                .split("T")[0]
        };

        console.log(
            "CREATE INVOICE REQUEST:",
            payload
        );

        const response =
            await createSubscriptionInvoice(payload);

        console.log(
            "CREATE INVOICE RESPONSE:",
            response
        );

        if (response?.status !== "success") {
            setAlertConfig({
                type: "error",
                message:
                    response?.message ||
                    "Unable to generate invoice."
            });

            setShowAlert(true);
            return;
        }

        /*
         * Backend generated invoice
         */
        const invoiceData =
            response.data || response;

        setShowInvoice(false);

      /*
       * Navigate to checkout using backend invoice
       */
      navigate(
        `/recruiter/payment-confirmation` +
        `?invoiceNo=${encodeURIComponent(invoiceData.invoiceNo || "")}` +
        `&plan=${encodeURIComponent(selectedPlan.plan)}` +
        `&employees=${selectedPlan.employees}`
      );

    } catch (error) {
        console.error(
            "GENERATE INVOICE ERROR:",
            error
        );

        setAlertConfig({
            type: "error",
            message:
                "Unable to generate invoice. Please try again."
        });

        setShowAlert(true);
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="subscription-page">

      {loading && (
        <div className="subscription-loading">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <p>Loading subscription plans...</p>
        </div>
      )}

      {showAlert && (
        <Alert
          variant={alertConfig.type === "success" ? "success" : "danger"}
          dismissible
          onClose={() => setShowAlert(false)}
        >
          {alertConfig.message}
        </Alert>
      )}

      {/* Background decoration */}
      <div className="subscription-bg-shape subscription-bg-shape-one" />
      <div className="subscription-bg-shape subscription-bg-shape-two" />

      <Container className="subscription-container">

        {/* ================= HERO ================= */}
        {/* <div className="subscription-hero text-center">
          <span className="pricing-eyebrow">
            SIMPLE & TRANSPARENT PRICING
          </span>

          <h1>
            Choose the right plan
            <br />
            <span>for your workforce</span>
          </h1>

          <p>
            Simple, transparent pricing. Pay only for your employees.
          </p>

           
          <div className="billing-toggle-wrapper">
            <button
              type="button"
              className={
                billingCycle === "monthly"
                  ? "billing-option active"
                  : "billing-option"
              }
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </button>

            <button
              type="button"
              className={
                billingCycle === "yearly"
                  ? "billing-option active"
                  : "billing-option"
              }
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly
              <span className="save-badge">
                Save 20%
              </span>
            </button>
          </div>
        </div> */}

        {/* ================= EMPLOYEE SELECTOR ================= */}
        <Card className="employee-selector-card">
          <Row className="align-items-center g-4">

            <Col lg={5}>
              <div className="employee-question">

                <div className="employee-icon">
                  <People size={28} />
                </div>

                <div>
                  <h5>
                    How many employees do you have?
                  </h5>

                  <p>
                    Add or remove employees anytime.
                  </p>
                </div>

              </div>
            </Col>

            <Col lg={3}>
              <div className="employee-counter">

                <button
                  type="button"
                  className="counter-button"
                  onClick={decreaseEmployees}
                  disabled={employees <= MIN_EMPLOYEES}
                >
                  <Dash size={18} />
                </button>

                <div className="employee-number">
                  <Form.Control
                    type="number"
                    min="1"
                    value={employees}
                    onChange={handleEmployeeChange}
                  />

                  <span>Employees</span>
                </div>

                <button
                  type="button"
                  className="counter-button"
                  onClick={increaseEmployees}
                >
                  <Plus size={18} />
                </button>

              </div>
            </Col>

            <Col lg={4}>
              <div className="price-summary">

                {plans.map((plan, index) => (
                  <React.Fragment key={plan.plan}>

                    {index > 0 && (
                      <div className="summary-divider" />
                    )}

                    <div
                      className={`summary-price ${plan.plan === "PREMIUM"
                        ? "premium-summary"
                        : ""
                        }`}>
                      <span>
                        {plan.displayName} Plan
                      </span>

                      <small>
                        ₹{plan.monthlyPrice} × {employees}
                      </small>

                      <strong>
                        ₹{getPlanTotal(plan).toLocaleString("en-IN")}
                        <em>/month</em>
                      </strong>
                    </div>

                  </React.Fragment>
                ))}

              </div>
            </Col>

          </Row>


          <div className="premium-saving">
            <span>
              <CheckCircleFill size={16} />
              Premium difference
            </span>

            {/* <strong>
                ₹{monthlyPremiumDifference.toLocaleString("en-IN")}
                /month
              </strong> */}
          </div>


          {/* {billingCycle === "yearly" && (
            <div className="premium-saving yearly-saving">
              <span>
                <CheckCircleFill size={16} />
                Annual Premium savings
              </span>

              <strong>
                ₹{yearlySavings.toLocaleString("en-IN")}
              </strong>
            </div>
          )} */}
        </Card>

        {/* ================= PLANS ================= */}
        <Row className="plans-row g-4">

          {plans.map((plan) => {

            const isPremium = plan.plan === "PREMIUM";

            const PlanIcon = isPremium
              ? StarFill
              : PersonCheck;

            const displayPrice = getPlanTotal(plan);

            return (
              <Col lg={6} key={plan.plan}>

                <Card
                  className={`plan-card ${isPremium
                    ? "premium-card"
                    : "basic-card"
                    }`}
                >

                  {isPremium && (
                    <div className="popular-badge">
                      MOST POPULAR
                    </div>
                  )}

                  <Card.Body>

                    {/* Plan header */}
                    <div className="plan-header">

                      <div
                        className={`plan-icon ${isPremium
                          ? "purple"
                          : "green"
                          }`}
                      >
                        <PlanIcon size={30} />
                      </div>

                      <div>
                        <h2>
                          {plan.displayName}
                        </h2>

                        <p className="plan-description">
                          {isPremium
                            ? "Everything you need to manage your workforce efficiently."
                            : "Essential tools to manage attendance and leave seamlessly."
                          }
                        </p>
                      </div>

                    </div>

                    {/* Price + Features */}
                    <div className="plan-content">

                      <div className="plan-price">

                        <strong>
                          ₹{displayPrice.toLocaleString("en-IN")}
                        </strong>

                        <span>/ month</span>

                        <small>
                          for {employees} employees
                        </small>

                      </div>

                      <div className="features">

                        <h6>
                          What's included
                        </h6>

                        <div className="feature-line" />

                        {plan.modules?.map((module) => {

                          const ModuleIcon =
                            MODULE_ICONS[module] ||
                            CheckCircleFill;

                          const moduleName = module
                            .replaceAll("_", " ")
                            .toLowerCase()
                            .replace(
                              /\b\w/g,
                              (char) => char.toUpperCase()
                            );

                          return (
                            <div
                              className="feature-item"
                              key={module}
                            >

                              <div className="feature-check">
                                <CheckCircleFill size={17} />
                              </div>

                              <ModuleIcon size={17} />

                              <span>
                                {moduleName}
                              </span>

                            </div>
                          );
                        })}

                      </div>

                    </div>

                    {/* CTA */}
                    <Button
                      className={`plan-button ${isPremium
                        ? "premium-button"
                        : "basic-button"
                        }`}
                      onClick={() => choosePlan(plan)}
                    >
                      Choose {plan.displayName}

                      <ArrowRight size={20} />
                    </Button>

                  </Card.Body>

                </Card>

              </Col>
            );
          })}

        </Row>

        {/* ================= BENEFITS ================= */}
        <Card className="benefits-card border-0">

          <Row className="g-0">

            <Col md={3}>
              <div className="benefit-item">

                <div className="benefit-icon green">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <strong>No Hidden Charges</strong>
                  <span>
                    Transparent & simple pricing
                  </span>
                </div>

              </div>
            </Col>

            <Col md={3}>
              <div className="benefit-item">

                <div className="benefit-icon blue">
                  <ArrowLeftRight size={22} />
                </div>

                <div>
                  <strong>Switch Anytime</strong>
                  <span>
                    Change plan as you grow
                  </span>
                </div>

              </div>
            </Col>

            <Col md={3}>
              <div className="benefit-item">

                <div className="benefit-icon orange">
                  <PauseCircle size={22} />
                </div>

                <div>
                  <strong>Cancel Anytime</strong>
                  <span>
                    No lock-in. No hassle.
                  </span>
                </div>

              </div>
            </Col>

            <Col md={3}>
              <div className="benefit-item">

                <div className="benefit-icon purple">
                  <Headset size={22} />
                </div>

                <div>
                  <strong>24/7 Support</strong>
                  <span>
                    We're here to help you
                  </span>
                </div>

              </div>
            </Col>

          </Row>

        </Card>

      </Container>
 
      <Modal
        show={showInvoice}
        onHide={() => setShowInvoice(false)}
        centered
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-2">
            <Receipt size={24} />
            Subscription Invoice
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>

          {selectedPlan && (
            <div className="invoice-preview">

              {/* Invoice header */}
              <div className="invoice-header">
                <div>
                  <h5>Subscription Invoice</h5>
                  <small>
                    Invoice #{selectedPlan.invoiceId}
                  </small>
                </div>

                <div className="text-end">
                  <small>
                    Billing Cycle
                  </small>

                  <strong className="d-block">
                    {selectedPlan.billingCycle}
                  </strong>
                </div>
              </div>

              <hr />

              {/* Plan */}
              <div className="invoice-plan">

                <div>
                  <span className="invoice-label">
                    Subscription Plan
                  </span>

                  <h4>
                    {selectedPlan.displayName}
                  </h4>
                </div>

                <div className="text-end">
                  <span className="invoice-label">
                    Employees
                  </span>

                  <h5>
                    {selectedPlan.employees}
                  </h5>
                </div>

              </div>

              {/* Pricing */}
              <div className="invoice-table">

                <div className="invoice-row invoice-row-header">
                  <span>Description</span>
                  <span>Amount</span>
                </div>

                <div className="invoice-row">
                  <span>
                    {selectedPlan.displayName} Plan
                    <small className="d-block text-muted">
                      ₹{selectedPlan.pricePerEmployee} ×{" "}
                      {selectedPlan.employees} employees
                    </small>
                  </span>

                  <strong>
                    ₹{selectedPlan.amount.toLocaleString("en-IN")}
                  </strong>
                </div>

              </div>

              {/* Coupon */}
              <div className="coupon-card">

                <div className="coupon-header">

                  <div className="coupon-title">

                    <div className="coupon-icon">
                      %
                    </div>

                    <div>
                      <h6>Have a promo code?</h6>
                      <span>
                        Apply a coupon to get a discount on your subscription.
                      </span>
                    </div>

                  </div>

                  {couponApplied && (
                    <span className="coupon-applied-badge">
                      <CheckCircleFill size={13} />
                      Applied
                    </span>
                  )}

                </div>


                {!couponApplied ? (

                  <>
                    <div className="coupon-input-wrapper">

                      <Form.Control
                        type="text"
                        placeholder="Enter promo code"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(
                            e.target.value.toUpperCase()
                          );
                          setCouponError("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            applyCoupon();
                          }
                        }}
                        maxLength={30}
                        className="coupon-input"
                      />

                      <Button
                        type="button"
                        className="coupon-apply-btn"
                        onClick={applyCoupon}
                        disabled={!couponCode.trim()}
                      >
                        Apply
                      </Button>

                    </div>

                    <div className="coupon-hint">
                      Enter your promo code and click Apply.
                    </div>

                    {couponError && (
                      <div className="coupon-error">
                        <span>!</span>
                        {couponError}
                      </div>
                    )}
                  </>

                ) : (

                  <div className="coupon-applied-box">

                    <div className="coupon-applied-left">

                      <div className="coupon-success-icon">
                        <CheckCircleFill size={18} />
                      </div>

                      <div>
                        <strong>{couponCode}</strong>

                        <span>
                          Coupon applied successfully
                        </span>
                      </div>

                    </div>

                    <div className="coupon-applied-right">

                      <strong>
                        -₹{couponDiscount.toLocaleString("en-IN", {
                          maximumFractionDigits: 2
                        })}
                      </strong>

                      <button
                        type="button"
                        className="coupon-remove-btn"
                        onClick={() => {
                          setCouponCode("");
                          setCouponDiscount(0);
                          setCouponApplied(false);
                          setCouponError("");
                        }}
                      >
                        Remove
                      </button>

                    </div>

                  </div>

                )}

              </div>

              {/* Modules */}
              <div className="invoice-modules">

                <h6>
                  Included Modules
                </h6>

                <div className="module-list">

                  {selectedPlan.modules.map((module) => {

                    const moduleName = module
                      .replaceAll("_", " ")
                      .toLowerCase()
                      .replace(
                        /\b\w/g,
                        (char) => char.toUpperCase()
                      );

                    return (
                      <span
                        className="module-badge"
                        key={module}
                      >
                        <CheckCircleFill size={14} />
                        {moduleName}
                      </span>
                    );
                  })}

                </div>

              </div>

              {/* Total */}
              <div className="invoice-calculation">

                {/* Subtotal */}
                <div className="invoice-calculation-row">

                  <span>
                    Subtotal
                  </span>

                  <strong>
                    ₹{selectedPlan.amount.toLocaleString("en-IN")}
                  </strong>

                </div>


                {/* Discount */}
                {couponApplied && couponDiscount > 0 && (
                  <div className="invoice-calculation-row discount-row">

                    <span>
                      Coupon Discount
                      <small> ({couponCode})</small>
                    </span>

                    <strong>
                      -₹{couponDiscount.toLocaleString("en-IN", {
                        maximumFractionDigits: 2
                      })}
                    </strong>

                  </div>
                )}


                {/* Taxable Amount */}
                <div className="invoice-calculation-row">

                  <span>
                    Taxable Amount
                  </span>

                  <strong>
                    ₹{getTaxableAmount().toLocaleString("en-IN", {
                      maximumFractionDigits: 2
                    })}
                  </strong>

                </div>


                {/* GST */}
                <div className="invoice-calculation-row tax-row">

                  <span>
                    GST ({TAX_RATE}%)
                  </span>

                  <strong>
                    ₹{getTaxAmount().toLocaleString("en-IN", {
                      maximumFractionDigits: 2
                    })}
                  </strong>

                </div>


                {/* Final Total */}
                <div className="invoice-total">

                  <span>
                    Total Payable
                  </span>

                  <strong>
                    ₹{getFinalAmount().toLocaleString("en-IN", {
                      maximumFractionDigits: 2
                    })}
                    <small>/month</small>
                  </strong>

                </div>

              </div>

              {/* Confirmation message */}
              <div className="checkout-question">

                <CheckCircleFill size={18} />

                <div>
                  <strong>
                    Ready to continue?
                  </strong>

                  <p>
                    Review your subscription details above
                    and proceed to checkout to complete
                    your purchase.
                  </p>
                </div>

              </div>

            </div>
          )}

        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="light"
            onClick={() => setShowInvoice(false)}
          >
            Cancel
          </Button>

          <Button
            className="premium-button"
            onClick={generateInvoice}
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                />

                Generating Invoice...
              </>
            ) : (
              <>
                Proceed to Checkout
                <ArrowRight
                  size={18}
                  className="ms-2"
                />
              </>
            )}
          </Button>

        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default SubscriptionPlan;