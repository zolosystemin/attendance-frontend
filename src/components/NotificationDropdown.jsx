import { Dropdown, Badge, ListGroup } from "react-bootstrap";

const NotificationDropdown = () => {
  const notifications = [
    {
      id: 1,
      icon: "bi-briefcase",
      title: "New job matched",
      desc: "Frontend Developer – React",
      time: "2 mins ago"
    },
    {
      id: 2,
      icon: "bi-person-check",
      title: "Profile incomplete",
      desc: "Complete your profile to get more matches",
      time: "1 hour ago"
    },
    {
      id: 3,
      icon: "bi-camera-video",
      title: "Mock interview scheduled",
      desc: "Technical interview at 5 PM",
      time: "Yesterday"
    }
  ];

  return (
    <Dropdown align="end">
      {/* Toggle */}
      <Dropdown.Toggle
        variant="light"
        className="border-0 position-relative fw-medium"
      >
        <i className="bi bi-bell fs-5"></i>

        <Badge
          bg="danger"
          pill
          className="position-absolute top-0 start-100 translate-middle"
        >
          {notifications.length}
        </Badge>
      </Dropdown.Toggle>

      {/* Menu */}
      <Dropdown.Menu
        className="shadow-sm p-0"
        style={{ width: "340px" }}
      >
        <div className="px-3 py-2 border-bottom fw-semibold">
          Notifications
        </div>

        <ListGroup variant="flush">
          {notifications.map((n) => (
            <ListGroup.Item key={n.id} action className="py-2">
              <div className="d-flex gap-3">
                <div className="text-primary fs-5">
                  <i className={`bi ${n.icon}`}></i>
                </div>

                <div>
                  <div className="fw-medium">{n.title}</div>
                  <div className="small text-muted">{n.desc}</div>
                  <div className="small text-muted">{n.time}</div>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>

        <div className="text-center border-top p-2">
          <small className="text-primary fw-medium">
            View all notifications
          </small>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationDropdown;
