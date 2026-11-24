import { useEffect, useState } from "react";
import {
    Container,
    Card,
    Table,
    Button,
    Badge,
    Spinner,
    Alert
} from "react-bootstrap";

import { getInvoiceList, downloadInvoice } from "../../services/subscription";

export default function Invoices() {

    const [invoiceList, setInvoiceList] = useState([]);
    const [invoiceLoading, setInvoiceLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async () => {

        setInvoiceLoading(true);
        setError("");

        const response = await getInvoiceList();

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
        if (!response || response.status !== "success") {

            setAlertConfig({
                type: "error",
                message: response?.message || "Failed to load invoices."
            });

            setShowAlert(true);
            return;
        }

        if (response.status === "success") {
            setInvoiceList(response.data?.invoices || []);
        }
        setInvoiceLoading(false);
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date)
            .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            })
            .toUpperCase();

    };

    const getBadge = (status) => {

        switch (status) {

            case "PAID":
                return "success";

            case "PENDING":
                return "warning";

            case "FAILED":
                return "danger";

            case "REFUNDED":
                return "secondary";

            default:
                return "primary";

        }

    };

    // invoice generate
    const handleDownload = async (invoiceId) => {
        const response = await downloadInvoice(invoiceId);

        if (response.status !== "success") {
            alert(response.message);
            return;
        }

        const invoice = response.data;
        const invoiceWindow = window.open("", "_blank");
        invoiceWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>${invoice.invoiceNo}</title>
<style>
*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:'Segoe UI',Arial,sans-serif;
}

body{
background:#eef2f7;
padding:40px;
}

.invoice{
max-width:900px;
margin:auto;
background:#fff;
border-radius:18px;
overflow:hidden;
box-shadow:0 15px 50px rgba(0,0,0,.15);

}

.header{
background:linear-gradient(135deg,#0d6efd,#2563eb);
padding:35px;
color:#fff;
display:flex;
justify-content:space-between;
align-items:center;

}

.logo{
font-size:34px;
font-weight:700;

}

.company{
text-align:right;
}

.company h3{
margin-bottom:5px;
}

.section{
padding:30px;
}

.row{
display:flex;
justify-content:space-between;
margin-bottom:30px;
gap:30px;
}

.card{
flex:1;
background:#f8f9fb;
border-radius:12px;
padding:20px;
}

.card h4{
margin-bottom:15px;
color:#0d6efd;
}

.info{
display:flex;
justify-content:space-between;
padding:8px 0;
border-bottom:1px solid #eee;
}

.info:last-child{
border:none;
}

.badge{
display:inline-block;
padding:7px 18px;
border-radius:30px;
font-size:13px;
font-weight:600;
}

.success{
background:#d1fae5;
color:#059669;
}

.pending{
background:#fff7d6;
color:#b7791f;
}

.failed{
background:#ffe5e5;
color:#dc2626;
}

table{
width:100%;
border-collapse:collapse;
margin-top:25px;
}

th{
background:#f1f5f9;
padding:14px;
text-align:left;
}

td{
padding:14px;
border-bottom:1px solid #eee;
}

.total{
background:#0d6efd;
color:#fff;
font-size:22px;
font-weight:700;
}

.modules{
display:flex;
flex-wrap:wrap;
gap:10px;
margin-top:15px;
}

.module{
background:#eef4ff;
padding:8px 14px;
border-radius:30px;
font-size:13px;
font-weight:600;
color:#0d6efd;
}

.footer{
background:#f8f9fb;
padding:25px;
text-align:center;
color:#666;
font-size:13px;
}

@media print{
body{
background:white;
padding:0;
}

.invoice{
box-shadow:none;
border-radius:0;
}
}
</style>
</head>
<body>
<div class="invoice">
<div class="header">
<div>
<div class="logo">
ZOLO SYSTEMS
</div>

<div>
Subscription Invoice
</div>
</div>
<div class="company">
<h3>${invoice.buyerName}</h3>
<div>${invoice.buyerEmail ?? ""}</div>
<div>${invoice.buyerMobile ?? ""}</div>
</div>
</div>
<div class="section">
<div class="row">
<div class="card">
<h4>Invoice Details</h4>
<div class="info">
<span>Invoice No</span>
<strong>${invoice.invoiceNo}</strong>
</div>

<div class="info">
<span>Txn No</span>
<strong>${invoice.transactionId}</strong>
</div>

<div class="info">
<span>Invoice Date</span>
<strong>${formatDate(invoice.invoiceDate)}</strong>
</div>

<div class="info">
<span>Payment Date</span>
<strong>${formatDate(invoice.paymentDate) ?? "-"}</strong>
</div>

</div>
<div class="card">
<h4>Subscription</h4>
<div class="info">
<span>Plan</span>
<strong>${invoice.plan}</strong>
</div>

<div class="info">
<span>Billing</span>
<strong>${invoice.billingCycle}</strong>
</div>

<div class="info">
<span>Method</span>
<strong>${invoice.paymentMethod}</strong>
</div>

<div class="info">
<span>Status</span>

<span class="badge ${invoice.paymentStatus === "PAID"
                ? "success"
                : invoice.paymentStatus === "FAILED"
                    ? "failed"
                    : "pending"
            }">

${invoice.paymentStatus}
</span>
</div>
</div>
</div>
<h3 style="margin-bottom:15px">
Amount Summary
</h3>
<table>
<tr>
<th>Description</th>
<th style="text-align:right">
Amount
</th>
</tr>
<tr>
<td>
Subscription Fee
</td>
<td style="text-align:right">
₹ ${Number(invoice.baseAmount).toFixed(2)}
</td>
</tr>
<tr>
<td>
GST
</td>
<td style="text-align:right">
₹ ${Number(invoice.taxAmount).toFixed(2)}
</td>
</tr>
<tr>

<td>
Discount
</td>

<td style="text-align:right">
- ₹ ${Number(invoice.discountAmount).toFixed(2)}
</td>

</tr><tr class="total"><td>
Total Paid
</td><td style="text-align:right">
₹ ${Number(invoice.totalAmount).toFixed(2)}
</td></tr></table>

<h3 style="margin-top:35px">Included Modules</h3>
<div class="modules">
${invoice.modules.map(module => `
<div class="module">
${module.replaceAll("_", " ")}
</div>
`).join("")}
</div>
</div>

<div class="footer">
<strong>Thank you for choosing ZOLO SYSTEMS HRMS</strong>
<br><br>
This is a computer-generated invoice and does not require a signature.
<br>
support@zolosystems.com | <www className="attendance">www.zolosystems.com</www>
</div>
</div>
<script>
window.onload=function(){
window.print();
}
</script>
</body>
</html>
`);
        invoiceWindow.document.close();
        invoiceWindow.print();
    };

    return (

        <Container fluid className="py-4">

            <Card className="shadow-sm border-0">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                        <i className="bi bi-receipt me-2"></i>
                        Billing History
                    </h5>

                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={loadInvoices}
                    >
                        <i className="bi bi-arrow-clockwise me-1"></i>
                        Refresh
                    </Button>
                </Card.Header>

                <Card.Body>
                    {
                        error &&
                        <Alert variant="danger">
                            {error}
                        </Alert>
                    }

                    {
                        invoiceLoading ?
                            (
                                <div className="text-center py-5">
                                    <Spinner animation="border" />
                                </div>
                            ) : invoiceList.length === 0 ?
                                (
                                    <div className="text-center py-5 text-muted">
                                        <i className="bi bi-receipt-cutoff fs-1"></i>
                                        <h5 className="mt-3">
                                            No invoices found
                                        </h5>
                                    </div>
                                ) : (
                                    <Table
                                        hover
                                        responsive
                                        className="align-middle"
                                    >

                                        <thead>
                                            <tr>
                                                <th>Invoice No</th>
                                                <th>Plan</th>
                                                <th>Date</th>
                                                <th>Base Amount</th>
                                                <th>Tax</th>
                                                <th>Total</th>
                                                <th>Payment Method</th>
                                                <th>Status</th>
                                                <th className="text-center">Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {invoiceList.map((invoice) => (

                                                <tr key={invoice.invoiceId}>

                                                    <td>
                                                        <strong>{invoice.invoiceNo}</strong>
                                                    </td>

                                                    <td>
                                                        {invoice.plan}
                                                    </td>

                                                    <td>
                                                        {formatDate(invoice.invoiceDate)}
                                                    </td>

                                                    <td>
                                                        ₹{Number(invoice.baseAmount).toFixed(2)}
                                                    </td>

                                                    <td>
                                                        ₹{Number(invoice.taxAmount).toFixed(2)}
                                                    </td>

                                                    <td className="fw-bold text-primary">
                                                        ₹{Number(invoice.totalAmount).toFixed(2)}
                                                    </td>

                                                    <td>

                                                        <Badge bg="light" text="dark">

                                                            <i className="bi bi-credit-card me-1"></i>

                                                            {invoice.paymentMethod}

                                                        </Badge>

                                                    </td>

                                                    <td>

                                                        <Badge bg={getBadge(invoice.paymentStatus)}>

                                                            {invoice.paymentStatus}

                                                        </Badge>

                                                    </td>

                                                    <td className="text-center">

                                                        <Button
                                                            size="sm"
                                                            variant="outline-primary"
                                                            onClick={() => handleDownload(invoice.invoiceId)}
                                                        >
                                                            <i className="bi bi-download me-1"></i>

                                                            Download
                                                        </Button>

                                                    </td>

                                                </tr>

                                            ))}

                                        </tbody>
                                    </Table>
                                )
                    }
                </Card.Body>
            </Card>
        </Container>
    );
}