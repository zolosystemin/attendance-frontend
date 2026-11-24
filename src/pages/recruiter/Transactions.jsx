import {
    Container,
    Card,
    Table,
    Badge
} from "react-bootstrap";

export default function Transactions() {
    const transactions = [
        {
            id: "TXN1001",
            date: "2026-01-05",
            amount: "₹2499",
            status: "Success"
        },
        {
            id: "TXN1002",
            date: "2026-02-05",
            amount: "₹2499",
            status: "Success"
        }
    ];

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm">
                <Card.Header className="fw-bold">
                    <i className="bi bi-clock-history me-2"></i>
                    Payment Transactions
                </Card.Header>

                <Card.Body>
                    <Table bordered hover responsive>

                        <thead>
                            <tr>
                                <th>
                                    Transaction ID
                                </th>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Amount
                                </th>

                                <th>
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                transactions.map(txn => (
                                    <tr key={txn.id}>

                                        <td>
                                            {txn.id}
                                        </td>

                                        <td>
                                            {txn.date}
                                        </td>

                                        <td>
                                            {txn.amount}
                                        </td>

                                        <td>
                                            <Badge bg="success">
                                                {txn.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
}