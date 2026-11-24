import React, { useState, useMemo, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Badge,
    Button,
    Form,
    Pagination,
    Modal,
    Dropdown,
} from "react-bootstrap";

/* =========================
   DEMO JOB DATA
========================= */

const JOBS = [
    {
        id: 1,
        title: "Frontend Developer",
        company: "TechNova",
        location: "Remote",
        type: "Full Time",
        experience: "2–4 Years",
        salary: "₹8–12 LPA",
        postedDaysAgo: 2,
        status: "Open",
    },
    {
        id: 2,
        title: "React Engineer",
        company: "CodeLabs",
        location: "Bangalore",
        type: "Part Time",
        experience: "3–5 Years",
        salary: "₹10–15 LPA",
        postedDaysAgo: 10,
        status: "Open",
    },
    {
        id: 3,
        title: "UI Developer",
        company: "DesignHub",
        location: "Hyderabad",
        type: "Contract",
        experience: "1–3 Years",
        salary: "₹6–9 LPA",
        postedDaysAgo: 25,
        status: "Closed",
    },
];

/* =========================
   COMPONENT
========================= */

const JobList = () => {
    const [jobs, setJobs] = useState(JOBS);

    /* Filters */
    const [search, setSearch] = useState("");
    const [types, setTypes] = useState([]);
    const [locations, setLocations] = useState([]);
    const [postedWithin, setPostedWithin] = useState("");

    /* Pagination */
    const [pageSize, setPageSize] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    /* Edit Modal */
    const [showEdit, setShowEdit] = useState(false);
    const [editJob, setEditJob] = useState(null);

    const toggleFilter = (value, list, setList) => {
        setList((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value]
        );
    };

    /* ================= FILTER ================= */

    const filteredJobs = useMemo(() => {
        return jobs.filter((job) => {
            return (
                (!search ||
                    job.title.toLowerCase().includes(search.toLowerCase()) ||
                    job.company.toLowerCase().includes(search.toLowerCase())) &&
                (types.length === 0 || types.includes(job.type)) &&
                (locations.length === 0 || locations.includes(job.location)) &&
                (!postedWithin || job.postedDaysAgo <= postedWithin)
            );
        });
    }, [jobs, search, types, locations, postedWithin]);

    /* ================= PAGINATION ================= */

    const totalPages = Math.ceil(filteredJobs.length / pageSize);

    const paginatedJobs = filteredJobs.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search, types, locations, postedWithin, pageSize]);

    /* ================= JOB ACTIONS ================= */

    const openEdit = (job) => {
        setEditJob(job);
        setShowEdit(true);
    };

    const deleteJob = (id) => {
        setJobs((prev) => prev.filter((j) => j.id !== id));
    };

    const toggleStatus = (id) => {
        setJobs((prev) =>
            prev.map((j) =>
                j.id === id
                    ? { ...j, status: j.status === "Open" ? "Closed" : "Open" }
                    : j
            )
        );
    };

    return (
        <Container fluid className="py-4 " >
            <Row >
                {/* ================= LEFT FILTERS ================= */}
                <Col md={3} >
                    <Card className="mb-3 shadow-sm border-0">
                        <Card.Body>
                            <Form.Control
                                placeholder="Search job / company"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </Card.Body>
                    </Card>

                    <Card className="mb-3 shadow-sm border-0">
                        <Card.Body>
                            <strong>Posted Within</strong>
                            <Form.Select
                                value={postedWithin}
                                onChange={(e) => setPostedWithin(e.target.value)}
                            >
                                <option value="">Any time</option>
                                <option value="7">Last 7 days</option>
                                <option value="14">Last 14 days</option>
                                <option value="30">Last 30 days</option>
                            </Form.Select>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3 shadow-sm border-0">
                        <Card.Body>
                            <strong>Job Type</strong>
                            {["Full Time","Part Time", "Contract"].map((t) => (
                                <Form.Check
                                    key={t}
                                    label={t}
                                    checked={types.includes(t)}
                                    onChange={() => toggleFilter(t, types, setTypes)}
                                />
                            ))}
                        </Card.Body>
                    </Card>

                    <Card className="mb-3 shadow-sm border-0">
                        <Card.Body>
                            <strong>Location</strong>
                            {["Remote", "Bangalore", "Hyderabad", "Delhi NCR"].map((l) => (
                                <Form.Check
                                    key={l}
                                    label={l}
                                    checked={locations.includes(l)}
                                    onChange={() =>
                                        toggleFilter(l, locations, setLocations)
                                    }
                                />
                            ))}
                        </Card.Body>
                    </Card>
                    
                </Col>

                {/* ================= JOB LIST ================= */}
                <Col md={6} >
                    <div className="bg-light border rounded-3 px-4 py-3 mb-4">
                        <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center gap-2">
                            <h2 className="mb-0 fw-semibold">All Posted Jobs</h2>

                            <Form.Select
                                size="sm"
                                style={{ width: 140 }}
                                value={pageSize}
                                onChange={(e) => setPageSize(Number(e.target.value))}
                            >
                                {[5, 10, 20, 50].map((s) => (
                                    <option key={s} value={s}>
                                        {s} / page
                                    </option>
                                ))}
                            </Form.Select>
                        </div>
                    </div>

                    {paginatedJobs.map((job) => (
                        <Card key={job.id} className="mb-3 shadow-sm border-0 job-card">
                            <Card.Body>
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <h5>{job.title}</h5>
                                        <div className="text-muted">
                                            {job.company} · {job.location}
                                        </div>

                                        <div className="mt-2">
                                            <Badge bg="light" text="dark" className="me-2">
                                                {job.type}
                                            </Badge>
                                            <Badge bg="light" text="dark" className="me-2">
                                                {job.experience}
                                            </Badge>
                                            <Badge bg="light" text="dark">
                                                {job.salary}
                                            </Badge>
                                        </div>

                                        <small className="text-muted d-block mt-2">
                                            Posted {job.postedDaysAgo} days ago
                                        </small>
                                    </div>

                                    <Dropdown>
                                        <Dropdown.Toggle size="sm" variant="outline-secondary">
                                            Actions
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => openEdit(job)}>
                                                Edit
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => toggleStatus(job.id)}>
                                                {job.status === "Open" ? "Close Job" : "Reopen Job"}
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item
                                                className="text-danger"
                                                onClick={() => deleteJob(job.id)}
                                            >
                                                Delete
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}

                    {totalPages > 1 && (
                        <Pagination className="justify-content-center">
                            {[...Array(totalPages)].map((_, i) => (
                                <Pagination.Item
                                    key={i}
                                    active={currentPage === i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    )}
                </Col>

                {/* ================= RIGHT ADD / PROMO SECTION ================= */}
                <Col md={3}>
                    <Card className="mb-3 shadow-sm border-0 text-center">
                        <Card.Body>
                            <h6>🚀 Boost Your Profile</h6>
                            <p className="text-muted small">
                                Get noticed by top recruiters faster.
                            </p>
                            <Button size="sm" variant="primary">
                                Upgrade Now
                            </Button>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3 shadow-sm border-0">
                        <Card.Body>
                            <h6>💡 Job Tips</h6>
                            <ul className="small text-muted ps-3">
                                <li>Update resume weekly</li>
                                <li>Apply within 7 days</li>
                                <li>Highlight key skills</li>
                            </ul>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm border-0 bg-light">
                        <Card.Body className="text-center">
                            <strong>Ad Space</strong>
                            <p className="small text-muted mb-0">
                                Your banner or promotion here
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* ================= EDIT MODAL ================= */}
            <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Job</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editJob && (
                        <>
                            <Form.Group className="mb-2">
                                <Form.Label>Job Title</Form.Label>
                                <Form.Control defaultValue={editJob.title} />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Location</Form.Label>
                                <Form.Control defaultValue={editJob.location} />
                            </Form.Group>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEdit(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary">Save</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default JobList;
