import { useState } from "react";
import {
    Container,
    Card,
    Row,
    Col,
    Form,
    Button,
    Table
} from "react-bootstrap";


export default function RolePermissionSettings() {


    const [roles,setRoles] = useState([
        {
            id:1,
            name:"Admin",
            description:"Full system access"
        },
        {
            id:2,
            name:"HR Manager",
            description:"Employee and attendance management"
        },
        {
            id:3,
            name:"Manager",
            description:"Team level approvals"
        },
        {
            id:4,
            name:"Employee",
            description:"Self service access"
        }
    ]);


    const [permissions,setPermissions] = useState({

        employee:{
            view:true,
            add:true,
            edit:true,
            delete:false
        },

        attendance:{
            view:true,
            approve:true,
            modify:false
        },


        leave:{
            apply:true,
            approve:false,
            cancel:false
        },


        payroll:{
            view:false,
            process:false
        },


        reports:{
            view:true,
            export:false
        }

    });



    const updatePermission=(module,field)=>{

        setPermissions(prev=>({

            ...prev,

            [module]:{

                ...prev[module],

                [field]:!prev[module][field]

            }

        }));

    }



    const saveSettings=()=>{

        console.log({
            roles,
            permissions
        });


        alert(
            "Role & Permission settings saved"
        );

    }



    return (

    <Container fluid className="py-4">


        {/* HEADER */}

        <Row className="mb-3 align-items-center">

            <Col>

                <h3 className="fw-bold">

                    <i className="bi bi-shield-lock me-2"></i>

                    Role & Permission Control

                </h3>


                <small className="text-muted">
                    Manage user roles and system access permissions.
                </small>


            </Col>


            <Col md="auto">

                <Button
                    variant="primary"
                    onClick={saveSettings}
                >
                    Save Settings
                </Button>

            </Col>


        </Row>



        {/* ROLE LIST */}


        <Card className="shadow-sm mb-4">


            <Card.Header className="fw-bold">

                System Roles

            </Card.Header>


            <Card.Body>


                <Table bordered hover responsive>


                    <thead>

                    <tr>

                        <th>
                            Role
                        </th>

                        <th>
                            Description
                        </th>

                        <th>
                            Status
                        </th>

                    </tr>

                    </thead>


                    <tbody>


                    {
                    roles.map(role=>(


                    <tr key={role.id}>


                        <td>
                            {role.name}
                        </td>


                        <td>
                            {role.description}
                        </td>


                        <td>

                            <Form.Check
                                type="switch"
                                defaultChecked
                            />


                        </td>


                    </tr>


                    ))
                    }


                    </tbody>


                </Table>


            </Card.Body>


        </Card>




        {/* PERMISSION MATRIX */}



        <Card className="shadow-sm mb-4">


            <Card.Header className="fw-bold">

                Permission Matrix

            </Card.Header>



            <Card.Body>


            {
            Object.keys(permissions).map(module=>(


                <Card
                    className="mb-3"
                    key={module}
                >

                    <Card.Header className="text-capitalize">

                        {module}

                    </Card.Header>



                    <Card.Body>


                    <Row>


                    {
                    Object.keys(
                        permissions[module]
                    )
                    .map(permission=>(


                    <Col md={3} key={permission}>


                        <Form.Check

                            type="switch"

                            label={
                                permission
                            }


                            checked={
                                permissions[module][permission]
                            }


                            onChange={()=>{

                                updatePermission(
                                    module,
                                    permission
                                )

                            }}

                        />


                    </Col>


                    ))
                    }


                    </Row>


                    </Card.Body>


                </Card>


            ))
            }



            </Card.Body>


        </Card>



        {/* CUSTOM ROLE */}


        <Card className="shadow-sm">


            <Card.Header className="fw-bold">

                Create Custom Role

            </Card.Header>


            <Card.Body>


                <Row>


                    <Col md={6}>

                        <Form.Group>

                            <Form.Label>
                                Role Name
                            </Form.Label>


                            <Form.Control
                                placeholder="Enter role name"
                            />


                        </Form.Group>


                    </Col>



                    <Col md={6}>


                        <Form.Group>

                            <Form.Label>
                                Description
                            </Form.Label>


                            <Form.Control
                                placeholder="Role description"
                            />


                        </Form.Group>


                    </Col>


                </Row>


                <Button
                    className="mt-3"
                    variant="success"
                >

                    Add Role

                </Button>


            </Card.Body>


        </Card>


    </Container>

    );

}