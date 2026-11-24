import React from "react";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";

const PrivacyPolicy = () => {
    return (
        <Container fluid className="bg-light py-5">
            <Row className="justify-content-center">
                <Col md={10} lg={9}>
                    <Card className="shadow border-0 rounded-4">
                        <Card.Body className="p-4 p-md-5">

                            {/* HEADER */}
                            <div className="text-center mb-4">
                                <h2 className="fw-bold">Privacy Policy</h2>
                                <p className="text-muted small mb-0">
                                    Last updated: March 17, 2026
                                </p>
                            </div>

                            {/* SECTION */}
                            <h5 className="fw-semibold mt-4">1. Introduction</h5>
                            <p className="text-muted">
                                Welcome to <strong>HireSkills</strong> ("Company", "we", "our", "us"), an IT-enabled recruitment platform.
                                We are committed to protecting the privacy and security of personal data belonging to job seekers
                                ("Candidates") and employers ("Clients/Companies"). This Privacy Policy explains how we collect,
                                use, process, store, and disclose your information when you access or use our platform and services.
                            </p>

                            <h5 className="fw-semibold mt-4">2. Scope</h5>
                            <p className="text-muted">
                                This Privacy Policy applies to all users of HireSkills, including candidates, employers, recruiters,
                                and visitors accessing our website, mobile applications, and related services.
                            </p>

                            <h5 className="fw-semibold mt-4">3. Information We Collect</h5>

                            <p className="fw-medium">a. Candidate Information</p>
                            <ListGroup className="mb-3">
                                <ListGroup.Item className="border-0 ps-0">• Full name, email address, mobile number</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Resume/CV, employment history, education details</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Skills, certifications, preferences</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Location and job search activity</ListGroup.Item>
                            </ListGroup>

                            <p className="fw-medium">b. Employer / Company Information</p>
                            <ListGroup className="mb-3">
                                <ListGroup.Item className="border-0 ps-0">• Company name, registration details</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Authorized contact person details</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Billing and transaction information</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Job postings and hiring activity</ListGroup.Item>
                            </ListGroup>

                            <p className="fw-medium">c. Technical & Usage Data</p>
                            <ListGroup className="mb-3">
                                <ListGroup.Item className="border-0 ps-0">• IP address, browser type, device information</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Log data, session activity, cookies</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Platform usage analytics</ListGroup.Item>
                            </ListGroup>

                            <h5 className="fw-semibold mt-4">4. Purpose of Data Processing</h5>
                            <ListGroup className="mb-3">
                                <ListGroup.Item className="border-0 ps-0">• Facilitate job matching between candidates and employers</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Enable employers to search, view, and contact candidates</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Provide account management and customer support</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Improve platform functionality and user experience</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Send transactional and service-related communications</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Ensure legal compliance and fraud prevention</ListGroup.Item>
                            </ListGroup>

                            <h5 className="fw-semibold mt-4">5. Legal Basis for Processing</h5>
                            <p className="text-muted">
                                We process personal data based on user consent, contractual necessity, compliance with legal obligations,
                                and legitimate business interests such as improving services and preventing misuse.
                            </p>

                            <h5 className="fw-semibold mt-4">6. Data Sharing and Disclosure</h5>
                            <p className="text-muted">
                                We do not sell personal data. However, we may share data with:
                            </p>
                            <ListGroup className="mb-3">
                                <ListGroup.Item className="border-0 ps-0">• Registered employers for recruitment purposes</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Trusted service providers (hosting, analytics, payment gateways)</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Government or legal authorities when required by law</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• In case of mergers, acquisitions, or business restructuring</ListGroup.Item>
                            </ListGroup>

                            <h5 className="fw-semibold mt-4">7. Data Retention</h5>
                            <p className="text-muted">
                                We retain personal data only for as long as necessary to fulfill the purposes outlined in this policy,
                                comply with legal obligations, resolve disputes, and enforce agreements.
                            </p>

                            <h5 className="fw-semibold mt-4">8. Data Security</h5>
                            <p className="text-muted">
                                We implement industry-standard technical and organizational security measures, including encryption,
                                secure servers, and access controls, to protect your data. However, no system is completely secure.
                            </p>

                            <h5 className="fw-semibold mt-4">9. Cookies and Tracking Technologies</h5>
                            <p className="text-muted">
                                We use cookies and similar technologies to enhance user experience, analyze traffic, and personalize content.
                                Users may control cookie preferences through browser settings.
                            </p>

                            <h5 className="fw-semibold mt-4">10. User Rights</h5>
                            <ListGroup className="mb-3">
                                <ListGroup.Item className="border-0 ps-0">• Access and review your personal data</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Request correction or updates</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Request deletion of data</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Withdraw consent where applicable</ListGroup.Item>
                            </ListGroup>

                            <h5 className="fw-semibold mt-4">11. Third-Party Links</h5>
                            <p className="text-muted">
                                Our platform may contain links to third-party websites. We are not responsible for their privacy practices.
                            </p>

                            <h5 className="fw-semibold mt-4">12. Changes to this Policy</h5>
                            <p className="text-muted">
                                We may update this Privacy Policy periodically. Updated versions will be posted on this page with the revised date.
                            </p>

                            <h5 className="fw-semibold mt-4">13. Contact Us</h5>
                            <p className="text-muted">
                                <strong>HireSkills</strong><br />
                                Email: support@hireskills.com<br />
                                Website: www.hireskills.com
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PrivacyPolicy;