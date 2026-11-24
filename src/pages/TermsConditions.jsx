import React from "react";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";

const TermsConditions = () => {
    return (
        <Container fluid className="bg-light py-5">
            <Row className="justify-content-center">
                <Col md={10} lg={9}>
                    <Card className="shadow border-0 rounded-4">
                        <Card.Body className="p-4 p-md-5">

                            {/* HEADER */}
                            <div className="text-center mb-4">
                                <h2 className="fw-bold">Terms & Conditions</h2>
                                <p className="text-muted small mb-0">
                                    Last updated: March 17, 2026
                                </p>
                            </div>

                            {/* SECTION */}
                            <h5 className="fw-semibold mt-4">1. Introduction</h5>
                            <p className="text-muted">
                                Welcome to <strong>HireSkills</strong> ("Platform", "Company", "we", "our", "us").
                                These Terms and Conditions ("Terms") govern your access to and use of our website,
                                applications, and services. By registering or using our platform, you agree to be
                                bound by these Terms.
                            </p>

                            <h5 className="fw-semibold mt-4">2. Eligibility</h5>
                            <p className="text-muted">
                                You must be at least 18 years old and capable of entering into legally binding
                                agreements under applicable law to use this platform. By using HireSkills, you
                                represent and warrant that you meet these requirements.
                            </p>

                            <h5 className="fw-semibold mt-4">3. User Accounts</h5>
                            <p className="text-muted">
                                Users must register and provide accurate, complete, and updated information.
                                You are responsible for maintaining the confidentiality of your account credentials
                                and for all activities under your account.
                            </p>

                            <h5 className="fw-semibold mt-4">4. Services Provided</h5>
                            <p className="text-muted">
                                HireSkills provides an online platform that enables:
                            </p>
                            <ListGroup className="mb-3">
                                <ListGroup.Item className="border-0 ps-0">• Candidates to create profiles and apply for jobs</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Employers to post job listings and search for candidates</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Communication between candidates and employers</ListGroup.Item>
                            </ListGroup>

                            <h5 className="fw-semibold mt-4">5. User Responsibilities</h5>
                            <ListGroup className="mb-3">
                                <ListGroup.Item className="border-0 ps-0">• Provide truthful and accurate information</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Use the platform only for lawful purposes</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Not impersonate any individual or entity</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Not upload harmful, offensive, or misleading content</ListGroup.Item>
                            </ListGroup>

                            <h5 className="fw-semibold mt-4">6. Employer Obligations</h5>
                            <ListGroup className="mb-3">
                                <ListGroup.Item className="border-0 ps-0">• Ensure job postings are genuine and lawful</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Not misuse candidate data</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Comply with applicable labor and employment laws</ListGroup.Item>
                            </ListGroup>

                            <h5 className="fw-semibold mt-4">7. Candidate Obligations</h5>
                            <ListGroup className="mb-3">
                                <ListGroup.Item className="border-0 ps-0">• Provide accurate resume and profile details</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Not submit false or misleading applications</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Maintain confidentiality of login credentials</ListGroup.Item>
                            </ListGroup>

                            <h5 className="fw-semibold mt-4">8. Prohibited Activities</h5>
                            <ListGroup className="mb-3">
                                <ListGroup.Item className="border-0 ps-0">• Fraudulent activities or misrepresentation</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Unauthorized access to the platform</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Data scraping, mining, or harvesting</ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0">• Distribution of malware or harmful code</ListGroup.Item>
                            </ListGroup>

                            <h5 className="fw-semibold mt-4">9. Intellectual Property</h5>
                            <p className="text-muted">
                                All content, trademarks, logos, and software on the platform are the property of
                                HireSkills or its licensors and are protected under applicable intellectual property laws.
                            </p>

                            <h5 className="fw-semibold mt-4">10. Privacy</h5>
                            <p className="text-muted">
                                Your use of the platform is also governed by our Privacy Policy. By using our services,
                                you consent to the collection and use of your information as described therein.
                            </p>

                            <h5 className="fw-semibold mt-4">11. Payments and Fees</h5>
                            <p className="text-muted">
                                Certain services may be subject to fees. All payments are non-refundable unless otherwise stated.
                                HireSkills reserves the right to modify pricing at its discretion.
                            </p>

                            <h5 className="fw-semibold mt-4">12. Limitation of Liability</h5>
                            <p className="text-muted">
                                HireSkills shall not be liable for any direct, indirect, incidental, or consequential damages
                                arising from the use of the platform, including but not limited to job outcomes, hiring decisions,
                                or loss of data.
                            </p>

                            <h5 className="fw-semibold mt-4">13. Disclaimer</h5>
                            <p className="text-muted">
                                The platform is provided on an "as-is" and "as-available" basis. We do not guarantee
                                job placement, candidate selection, or uninterrupted access to services.
                            </p>

                            <h5 className="fw-semibold mt-4">14. Termination</h5>
                            <p className="text-muted">
                                We reserve the right to suspend or terminate accounts that violate these Terms
                                without prior notice.
                            </p>

                            <h5 className="fw-semibold mt-4">15. Governing Law</h5>
                            <p className="text-muted">
                                These Terms shall be governed by and construed in accordance with the laws of India.
                                Any disputes shall be subject to the exclusive jurisdiction of courts located in [Your City].
                            </p>

                            <h5 className="fw-semibold mt-4">16. Changes to Terms</h5>
                            <p className="text-muted">
                                We may update these Terms from time to time. Continued use of the platform constitutes
                                acceptance of the revised Terms.
                            </p>

                            <h5 className="fw-semibold mt-4">17. Contact Us</h5>
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

export default TermsConditions;