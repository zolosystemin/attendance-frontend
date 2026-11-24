import React from "react";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge
} from "react-bootstrap";


import {

ArrowRight,
ShieldLockFill,
PeopleFill,
CloudFill,
CheckCircleFill,
Fingerprint,
Server,
LockFill,
Building,
GraphUpArrow,
Globe2

} from "react-bootstrap-icons";


import "./css/Home.css";



const solutions=[

{
icon:<Fingerprint size={40}/>,
title:"ZS Identity Cloud",
desc:"Enterprise identity security platform.",
features:[
"Single Sign-On",
"MFA Authentication",
"Role Based Access",
"Identity Lifecycle"
]
},


{
icon:<PeopleFill size={40}/>,
title:"ZS Workforce",
desc:"Complete employee technology platform.",
features:[
"HR Management",
"Attendance",
"Payroll",
"Analytics"
]
},


{
icon:<CloudFill size={40}/>,
title:"ZS Cloud Platform",
desc:"Secure enterprise cloud infrastructure.",
features:[
"Cloud Hosting",
"Monitoring",
"Security",
"Deployment"
]
}

];



const products=[

{
title:"ZS Identity",
icon:<ShieldLockFill size={60}/>,
desc:
"Unified enterprise identity provider for secure access management.",
tags:[
"SSO",
"MFA",
"OAuth",
"RBAC"
]

},


{
title:"ZS Workforce",
icon:<PeopleFill size={60}/>,
desc:
"Modern HRMS platform to automate workforce operations.",
tags:[
"HRMS",
"Payroll",
"Attendance",
"Recruitment"
]

}


];



export default function Home(){


return (

<>


{/* HERO */}

<section className="enterprise-hero">


<Container>

<Row className="align-items-center">


<Col lg={7}>


<div className="hero-badge">

ZS Enterprise Technology Platform

</div>



<h1 className="hero-title">

Build Secure

<span>
Digital Enterprises
</span>

</h1>



<p className="hero-description">

ZS enables organizations with secure identity,
workforce automation, cloud infrastructure and
enterprise software solutions.

</p>



<div className="hero-buttons">


<Button size="lg">

Explore Platform

<ArrowRight className="ms-2"/>

</Button>


<Button
variant="outline-primary"
size="lg"
>

Contact Sales

</Button>


</div>



<div className="hero-stats">


<div>

<h3>
1M+
</h3>

<span>
Secure Transactions
</span>

</div>



<div>

<h3>
99.99%
</h3>

<span>
Availability
</span>

</div>



<div>

<h3>
50+
</h3>

<span>
Organizations
</span>

</div>


</div>



</Col>



<Col lg={5}>


<div className="hero-dashboard">


<div className="dashboard-header">

<LockFill/>

ZS Security Platform

</div>



<div className="dashboard-item">

<Fingerprint/>

<div>

<strong>
Identity Management
</strong>

<span>
SSO • MFA • RBAC
</span>

</div>


</div>




<div className="dashboard-item">

<PeopleFill/>

<div>

<strong>
Workforce Automation
</strong>

<span>
HRMS • Payroll • Attendance
</span>

</div>

</div>




<div className="dashboard-item">

<Server/>

<div>

<strong>
Cloud Infrastructure
</strong>

<span>
Secure Enterprise Hosting
</span>

</div>


</div>


</div>


</Col>



</Row>

</Container>


</section>





{/* TRUST */}


<section className="trust-section">


<Container>


<h5>
Trusted Technology Ecosystem
</h5>



<Row className="g-3">


{
[
"Microsoft",
"AWS",
"Google Cloud",
"Oracle",
"SAP",
"VMware"
]
.map(item=>(


<Col md={2} key={item}>


<div className="trust-box">

{item}

</div>


</Col>


))
}


</Row>


</Container>


</section>





{/* SOLUTIONS */}


<section className="section-space">


<Container>


<div className="section-heading">

<h2>
Enterprise Solutions
</h2>

<p>
Secure platforms designed for modern organizations.
</p>

</div>



<Row className="g-4">


{
solutions.map((item,index)=>(


<Col lg={4} key={index}>


<Card className="solution-card">


<Card.Body>


<div className="solution-icon">

{item.icon}

</div>


<h3>
{item.title}
</h3>


<p>
{item.desc}
</p>



<ul>


{
item.features.map(x=>(

<li key={x}>

<CheckCircleFill/>

{x}

</li>

))
}


</ul>


</Card.Body>


</Card>


</Col>


))
}



</Row>


</Container>


</section>





{/* WHY ZS */}


<section className="why-section">


<Container>


<div className="section-heading">

<h2>
Why Choose ZS
</h2>

</div>



<Row className="g-4">


{
[
["10+","Years Experience"],
["1M+","Secure Users"],
["99.99%","Platform Uptime"],
["24x7","Enterprise Support"]

]
.map(item=>(


<Col md={3} key={item[1]}>


<div className="metric-card">

<h2>
{item[0]}
</h2>

<p>
{item[1]}
</p>

</div>


</Col>


))
}


</Row>


</Container>


</section>





{/* SECURITY */}



<section className="security-section">


<Container>


<Row className="align-items-center">


<Col lg={6}>


<h2>

Security First Architecture

</h2>



<p>

Built with enterprise security principles
to protect identities, applications and data.

</p>



<ul className="security-points">


<li>
<CheckCircleFill/>
 Zero Trust Security
</li>


<li>
<CheckCircleFill/>
 Multi Factor Authentication
</li>


<li>
<CheckCircleFill/>
 Role Based Access Control
</li>


<li>
<CheckCircleFill/>
 End To End Encryption
</li>


</ul>


</Col>



<Col lg={6}>


<div className="security-box">


<ShieldLockFill size={90}/>


<h3>
Enterprise Ready
</h3>


<p>
Secure. Scalable. Reliable.
</p>


</div>


</Col>


</Row>


</Container>


</section>





{/* INDUSTRIES */}



<section className="industry-section">


<Container>


<div className="section-heading">

<h2>
Industries We Serve
</h2>

</div>



<Row>


{
[
"Banking",
"Manufacturing",
"Healthcare",
"Education",
"Government",
"Enterprise"
]
.map(x=>(


<Col md={2} key={x}>


<div className="industry-card">

<Building/>

{x}

</div>


</Col>


))
}


</Row>


</Container>


</section>





{/* CTA */}


<section className="cta-section">


<Container>


<Row className="align-items-center">


<Col lg={8}>


<h2>

Transform Your Enterprise With ZS

</h2>


<p>

Build secure identity, automate workforce
and modernize your technology ecosystem.

</p>


</Col>



<Col lg={4} className="text-end">


<Button size="lg" variant="light">

Get Started

<ArrowRight className="ms-2"/>

</Button>


</Col>


</Row>


</Container>


</section>



</>

)

}