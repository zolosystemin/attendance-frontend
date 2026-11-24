import React, { useState, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  Modal,
  ProgressBar,
} from "react-bootstrap";

/* =========================
   MOCK DATA (UNCHANGED)
========================= */

const APPLICANTS = Array.from({ length: 28 }, (_, i) => ({
  id: i + 1,
  name: `Applicant ${i + 1}`,
  email: `applicant${i + 1}@mail.com`,
  phone: "9876543210",
  experience: `${1 + (i % 6)} Years`,
  jobTitle: "Frontend Developer",
  skills: ["React", "JavaScript", "CSS", "Node"].slice(0, (i % 4) + 1),
  status: ["New", "Shortlisted", "Rejected", "On Hold"][i % 4],
  matchScore: 60 + (i % 40),
  resumeUrl: "/sample-resume.pdf", // PDF preview supported
  profilePic: `https://i.pravatar.cc/150?img=${i + 10}`,
  qualification: ["B.Tech", "MCA", "B.Sc", "M.Tech"][i % 4],
}));

const STATUS_VARIANT = {
  New: "secondary",
  Shortlisted: "success",
  Rejected: "danger",
  "On Hold": "warning",
};

const STATUSES = ["New", "Shortlisted", "On Hold", "Rejected"];

const Applicants = () => {
  /* =========================
     STATE (EXTENDED, NO BREAKING CHANGE)
  ========================= */

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // NEW (non-intrusive additions)
  const [notes, setNotes] = useState({}); // per applicant notes
  const [showPipeline, setShowPipeline] = useState(false);

  /* =========================
     FILTER + PAGINATION
  ========================= */

  const filtered = useMemo(() => {
    return APPLICANTS.filter(
      (a) =>
        a.name.toLowerCase().includes(search.toLowerCase()) &&
        (!statusFilter || a.status === statusFilter)
    );
  }, [search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  /* =========================
     BULK ACTIONS (UNCHANGED)
  ========================= */

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const bulkUpdateStatus = (status) => {
    alert(`Updated ${selectedIds.length} applicants to ${status}`);
    setSelectedIds([]);
  };

  /* =========================
     UI
  ========================= */

  return (
    <Container fluid className="bg-light min-vh-100 py-4">
      <Row>
        {/* ================= LEFT ================= */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm mb-3">
            <Card.Body>
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Applicants</h4>
                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => setShowPipeline(true)}
                  >
                    Pipeline
                  </Button>
                  <Form.Select
                    style={{ width: 130 }}
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(+e.target.value);
                      setPage(1);
                    }}
                  >
                    {[5, 10, 20, 50].map((s) => (
                      <option key={s} value={s}>
                        {s} / page
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </div>

              {/* Filters */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Control
                    placeholder="Search applicant"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                </Col>
                <Col md={6}>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="">All Status</option>
                    <option>New</option>
                    <option>Shortlisted</option>
                    <option>Rejected</option>
                    <option>On Hold</option>
                  </Form.Select>
                </Col>
              </Row>

              {/* Bulk Actions */}
              {selectedIds.length > 0 && (
                <Card className="mb-3 bg-body-tertiary border">
                  <Card.Body className="d-flex gap-2">
                    <strong>{selectedIds.length} selected</strong>
                    <Button size="sm" variant="success" onClick={() => bulkUpdateStatus("Shortlisted")}>
                      Shortlist
                    </Button>
                    <Button size="sm" variant="warning" onClick={() => bulkUpdateStatus("On Hold")}>
                      On Hold
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => bulkUpdateStatus("Rejected")}>
                      Reject
                    </Button>
                  </Card.Body>
                </Card>
              )}

              {/* Applicants List (UNCHANGED) */}
              {paginated.map((a) => (
                <Card key={a.id} className="mb-2 bg-body-tertiary border">
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <div>
                        <Form.Check inline checked={selectedIds.includes(a.id)} onChange={() => toggleSelect(a.id)} />
                        <strong>{a.name}</strong>
                        <div className="text-muted small">{a.email} · {a.experience}</div>

                        <div className="mt-2">
                          {a.skills.map((s) => (
                            <Badge key={s} bg="light" text="dark" className="me-1">{s}</Badge>
                          ))}
                        </div>

                        <div className="mt-2" style={{ maxWidth: 220 }}>
                          <small>Match Score</small>
                          <ProgressBar now={a.matchScore} label={`${a.matchScore}%`} variant={a.matchScore > 75 ? "success" : "info"} />
                        </div>
                      </div>

                      <div className="text-end">
                        <Badge bg={STATUS_VARIANT[a.status]} className="mb-2">{a.status}</Badge>
                        <div className="d-flex flex-column gap-1">
                          <Button size="sm" variant="outline-primary" onClick={() => setSelected(a)}>View</Button>
                          <Button size="sm" variant="outline-secondary" href={a.resumeUrl}>Download CV</Button>
                          <Form.Select size="sm" onChange={(e) => alert(`Status changed to ${e.target.value} for ${a.name}`)}>
                            <option>Change Status</option>
                            <option>Shortlisted</option>
                            <option>On Hold</option>
                            <option>Rejected</option>
                          </Form.Select>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}

              {/* Pagination */}
              <div className="d-flex justify-content-between mt-3">
                <small>Page {page} of {totalPages}</small>
                <div className="d-flex gap-2">
                  <Button size="sm" variant="outline-secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
                  <Button size="sm" variant="outline-secondary" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* ================= RIGHT ================= */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm mb-3">
            <Card.Body>
              <h6>Hiring Tips</h6>
              <ul className="small text-muted mb-0">
                <li>Shortlist above 75% match</li>
                <li>Respond within 48 hours</li>
                <li>Use skills match wisely</li>
              </ul>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h6>Quick Stats</h6>
              <div className="d-flex justify-content-between"><span>Total</span><strong>{APPLICANTS.length}</strong></div>
              <div className="d-flex justify-content-between"><span>Shortlisted</span><strong>{APPLICANTS.filter((a) => a.status === "Shortlisted").length}</strong></div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ================= VIEW MODAL (EXTENDED, SAME DESIGN) ================= */}
      <Modal show={!!selected} onHide={() => setSelected(null)} centered size="lg">
        <Modal.Header closeButton><Modal.Title>Applicant Profile</Modal.Title></Modal.Header>
        <Modal.Body>
  {selected && (
    <>
      {/* Profile Header */}
      <div className="d-flex align-items-center gap-3 mb-3">
        <img
          src={selected.profilePic}
          alt={selected.name}
          className="rounded-circle border"
          width={80}
          height={80}
        />

        <div>
          <h5 className="mb-1">{selected.name}</h5>
          <div className="text-muted small">{selected.email}</div>
          <Badge bg={STATUS_VARIANT[selected.status]}>
            {selected.status}
          </Badge>
        </div>
      </div>

      <hr />

      {/* Details */}
      <Row className="mb-2">
        <Col md={6}>
          <strong>Qualification</strong>
          <div className="text-muted">{selected.qualification}</div>
        </Col>

        <Col md={6}>
          <strong>Experience</strong>
          <div className="text-muted">{selected.experience}</div>
        </Col>
      </Row>

      <Row className="mb-2">
        <Col md={6}>
          <strong>Applied For</strong>
          <div className="text-muted">{selected.jobTitle}</div>
        </Col>

        <Col md={6}>
          <strong>Match Score</strong>
          <ProgressBar
            now={selected.matchScore}
            label={`${selected.matchScore}%`}
            variant={selected.matchScore > 75 ? "success" : "info"}
          />
        </Col>
      </Row>

      <div className="mt-3">
        <strong>Skills</strong>
        <div className="mt-1">
          {selected.skills.map((s) => (
            <Badge key={s} bg="light" text="dark" className="me-1">
              {s}
            </Badge>
          ))}
        </div>
      </div>

        {/* Resume Preview */}
              <div className="mt-3">
                <strong>Resume Preview</strong>
                <iframe title="resume" src={selected.resumeUrl} style={{ width: "100%", height: 300, border: "1px solid #ddd" }} />
              </div>

    </>
  )}
</Modal.Body>

        <Modal.Footer>
            
            <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
            </Modal.Footer>
      </Modal>

      {/* ================= PIPELINE (KANBAN) ================= */}
      <Modal show={showPipeline} onHide={() => setShowPipeline(false)} size="xl" centered>
        <Modal.Header closeButton><Modal.Title>Applicant Pipeline</Modal.Title></Modal.Header>
        <Modal.Body>
          <Row>
            {STATUSES.map((st) => (
              <Col key={st}>
                <Card className="bg-body-tertiary border">
                  <Card.Header className="fw-bold">{st}</Card.Header>
                  <Card.Body style={{ minHeight: 300 }}>
                    {APPLICANTS.filter((a) => a.status === st).map((a) => (
                      <Card key={a.id} className="mb-2">
                        <Card.Body className="p-2">
                          <strong>{a.name}</strong>
                          <div className="small text-muted">{a.experience}</div>
                          <ProgressBar now={a.matchScore} style={{ height: 6 }} className="mt-1" />
                        </Card.Body>
                      </Card>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Applicants;
