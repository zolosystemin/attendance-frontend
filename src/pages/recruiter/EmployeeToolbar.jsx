import {
    Row,
    Col,
    Form,
    InputGroup,
    Button,
    Dropdown,
    ButtonGroup
} from "react-bootstrap";

import {
    Search,
    PersonPlus,
    Upload,
    Download
} from "react-bootstrap-icons";

export default function EmployeeToolbar({
    onSearch,
    onAdd,
    onImport,
    onExportExcel,
    onExportCSV,
    onDownloadTemplate
}) {

    return (

        <Row className="mb-3">

            <Col lg={4} md={5} sm={12} className="mb-2">

                <InputGroup>

                    <InputGroup.Text>
                        <Search />
                    </InputGroup.Text>

                   <Form.Control
                        placeholder="Search employee..."
                        onChange={(e) => onSearch?.(e.target.value)}
                    />

                </InputGroup>

            </Col>

            <Col lg={8} md={7} sm={12} className="text-md-end">

                {/* Export */}

                <Dropdown as={ButtonGroup} className="me-2 mb-2">

                    <Button variant="outline-success">

                        Export

                    </Button>

                    <Dropdown.Toggle
                        split
                        variant="outline-success"
                    />

                    <Dropdown.Menu>

                        <Dropdown.Item onClick={onExportExcel}>
                            Export Excel
                        </Dropdown.Item>

                        <Dropdown.Item onClick={onExportCSV}>
                            Export CSV
                        </Dropdown.Item>

                    </Dropdown.Menu>

                </Dropdown>


                {/* Import */}

                <Button
                    variant="warning"
                    className="me-2 mb-2"
                    onClick={onImport}
                >

                    <Upload className="me-2" />

                    Bulk Import

                </Button>

                {/* Add */}

                <Button
                    variant="primary"
                    className="mb-2"
                    onClick={onAdd}
                >

                    <PersonPlus className="me-2" />

                    Add Employee

                </Button>

            </Col>

        </Row>

    );

}