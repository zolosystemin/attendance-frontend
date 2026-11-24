import { useState, useMemo, useEffect } from "react";
import {
    Container, Card, Table, Row, Col, Button, Form, Badge, InputGroup,
    Modal, ButtonGroup, ToggleButton, Dropdown,
} from "react-bootstrap";
import {
    createNotification, getNotificationList, getNotificationById,
    updateNotification, deleteNotifications
} from "../../services/notificationService.js";
import AppAlert from "../../components/Alert";
import { deleteCookie } from "../../utils/cookie.js";

export default function NotificationsSettings() {
    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] =
        useState({
            type: "info",
            message: "",
        });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [typeFilter, setTypeFilter] = useState("All");
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const [sortOption, setSortOption] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // View Notification Modal
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [loadingNotification, setLoadingNotification] = useState(false);

    //delete notification
    const [selectedNotificationIds, setSelectedNotificationIds] = useState([]);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const fetchNotifications = async () => {
        try {

            setLoadingNotifications(true);
            const response = await getNotificationList();

            /* ================= SESSION EXPIRED ================= */
            if (response?.message === "JWT token is expired" || response?.status === "expire") {
                setAlertConfig({
                    type: "error",
                    message:
                        response?.message ||
                        "Session expired. Please login again."
                });
                deleteCookie("token");
                deleteCookie("session_id");
                localStorage.clear();
                setShowAlert(true);
                return;
            }

            /* ================= SUCCESS ================= */
            if (response?.status === "success") {
                setNotifications(
                    Array.isArray(response?.notifications)
                        ? response.notifications
                        : []
                );
                return;
            }

            /* ================= FAILURE ================= */
            setNotifications([]);
            setAlertConfig({
                type: "error",
                message:
                    response?.message ||
                    "Unable to fetch notifications."
            });
            setShowAlert(true);

        } catch (error) {           
            setNotifications([]);
            setAlertConfig({
                type: "error",
                message: "Unable to fetch notifications."
            });
            setShowAlert(true);
        } finally {
            setLoadingNotifications(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const formatAudience = (audience) => {
        if (!audience) {
            return "-";
        }

        switch (audience.toUpperCase()) {
            case "ALL":
                return "All Employees";

            case "HR":
                return "HR";

            case "FINANCE":
                return "Finance";

            case "MANAGER":
                return "Manager";

            case "SUPPORT":
                return "Support";

            case "IT":
                return "IT Department";

            case "EMPLOYEE":
                return "Employee";

            default:
                return audience;
        }
    };

    const formatPriority = (priority) => {
        if (!priority) {
            return "-";
        }

        switch (priority.toUpperCase()) {
            case "CRITICAL":
                return "Critical";

            case "HIGH":
                return "High";

            case "MEDIUM":
                return "Medium";

            case "LOW":
                return "Low";

            default:
                return priority;
        }
    };

    const formatStatus = (status) => {
        if (!status) {
            return "-";
        }

        switch (status.toUpperCase()) {
            case "PUBLISHED":
                return "Published";

            case "SCHEDULED":
                return "Scheduled";

            case "DRAFT":
                return "Draft";

            default:
                return status;
        }
    };

    const getPriority = (priority) => {
        switch (priority?.toUpperCase()) {

            case "CRITICAL":
                return "danger";

            case "HIGH":
                return "warning";

            case "MEDIUM":
                return "primary";

            case "LOW":
                return "secondary";

            default:
                return "secondary";
        }
    };

    const getStatus = (status) => {
        switch (status?.toUpperCase()) {

            case "PUBLISHED":
                return "success";

            case "SCHEDULED":
                return "warning";

            case "DRAFT":
                return "secondary";

            default:
                return "primary";
        }
    };

    const formatType = (type) => {
        if (!type) {
            return "-";
        }

        switch (type.toUpperCase()) {
            case "ANNOUNCEMENT":
                return "Announcement";

            case "HOLIDAY":
                return "Holiday";

            case "ALERT":
                return "Alert";

            case "EMERGENCY":
                return "Emergency";

            default:
                return type;
        }
    };

    const getType = (type) => {
        switch (type?.toUpperCase()) {
            case "ANNOUNCEMENT":
                return "primary";

            case "HOLIDAY":
                return "success";

            case "ALERT":
                return "warning";

            case "EMERGENCY":
                return "danger";

            default:
                return "secondary";
        }
    };

    // Handle Refresh
    const handleRefresh = async () => {
        setSearch("");
        setStatusFilter("All");
        setTypeFilter("All");
        setSortOption("newest");
        await fetchNotifications();
    };

    // ================= FILTER + SORT =================
    const filteredNotifications = useMemo(() => {

        const searchText = search.toLowerCase().trim();
        const filtered = notifications.filter((item) => {

            const matchesSearch =
                !searchText ||
                item.title?.toLowerCase().includes(searchText) ||
                item.message?.toLowerCase().includes(searchText) ||
                item.audienceType?.toLowerCase().includes(searchText) ||
                item.priority?.toLowerCase().includes(searchText) ||
                item.status?.toLowerCase().includes(searchText) ||
                item.type?.toLowerCase().includes(searchText);

            const matchesStatus =
                statusFilter === "All" ||
                item.status?.toUpperCase() ===
                statusFilter.toUpperCase();

            const matchesType =
                typeFilter === "All" ||
                item.type?.toUpperCase() ===
                typeFilter.toUpperCase();

            return (
                matchesSearch &&
                matchesStatus &&
                matchesType
            );
        });

        // Sorting
        return [...filtered].sort((a, b) => {
            switch (sortOption) {

                case "newest":
                    return (
                        new Date(b.createdOn || 0) -
                        new Date(a.createdOn || 0)
                    );

                case "oldest":
                    return (
                        new Date(a.createdOn || 0) -
                        new Date(b.createdOn || 0)
                    );

                case "titleAsc":
                    return (a.title || "").localeCompare(
                        b.title || ""
                    );

                case "titleDesc":
                    return (b.title || "").localeCompare(
                        a.title || ""
                    );

                case "priority": {

                    const priorityOrder = {
                        CRITICAL: 1,
                        HIGH: 2,
                        MEDIUM: 3,
                        LOW: 4
                    };

                    return (
                        (priorityOrder[a.priority?.toUpperCase()] || 99) -
                        (priorityOrder[b.priority?.toUpperCase()] || 99)
                    );
                }

                default:
                    return 0;
            }
        });

    }, [
        notifications,
        search,
        statusFilter,
        typeFilter,
        sortOption
    ]);

    // ================= PAGINATION =================
    const totalPages = Math.ceil(
        filteredNotifications.length / itemsPerPage
    );

    const paginatedNotifications = useMemo(() => {

        const startIndex =
            (currentPage - 1) * itemsPerPage;

        const endIndex =
            startIndex + itemsPerPage;

        return filteredNotifications.slice(
            startIndex,
            endIndex
        );

    }, [
        filteredNotifications,
        currentPage,
        itemsPerPage
    ]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [
        search,
        statusFilter,
        typeFilter,
        sortOption,
        itemsPerPage
    ]);

    const notificationStats = useMemo(() => {
        const total = notifications.length;
        const published = notifications.filter(
            item => item.status?.toUpperCase() === "PUBLISHED"
        ).length;

        const scheduled = notifications.filter(
            item => item.status?.toUpperCase() === "SCHEDULED"
        ).length;

        const draft = notifications.filter(
            item => item.status?.toUpperCase() === "DRAFT"
        ).length;

        return {
            total,
            published,
            scheduled,
            draft
        };
    }, [notifications]);

    // Create Notifications
    const [publishType, setPublishType] = useState("now");
    const [activeTab, setActiveTab] = useState("general");
    const [scheduleDate, setScheduleDate] = useState("");
    const [scheduleTime, setScheduleTime] = useState("");
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState({
        title: "",
        audienceType: "ALL",
        priority: "MEDIUM",
        type: "ANNOUNCEMENT",
        message: "",
        scheduledAt: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setNotification((prev) => ({
            ...prev,
            [name]: value
        }));

        // Clear field error when user starts fixing it
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const showError = (message) => {
        setAlertConfig({
            type: "error",
            message: message
        });
        setShowAlert(true);
    };

    const validateNotification = (mode = publishType) => {
        const newErrors = {};
        /* ================= TITLE ================= */
        if (!notification.title?.trim()) {
            newErrors.title = "Notification title is required.";
        }
        /* ================= TYPE ================= */
        if (!notification.type) {
            newErrors.type = "Notification type is required.";
        }
        /* ================= AUDIENCE ================= */
        if (!notification.audienceType) {
            newErrors.audienceType = "Audience is required.";
        }
        /* ================= PRIORITY ================= */
        if (!notification.priority) {
            newErrors.priority = "Priority is required.";
        }
        /* ================= MESSAGE ================= */
        if (!notification.message?.trim()) {
            newErrors.message = "Notification message is required.";
        }
        /* ================= SCHEDULE ================= */
        if (mode === "schedule") {

            if (!scheduleDate) {
                newErrors.scheduleDate =
                    "Publish date is required.";
            }

            if (!scheduleTime) {
                newErrors.scheduleTime =
                    "Publish time is required.";
            }

            if (scheduleDate && scheduleTime) {
                const scheduledDateTime =
                    new Date(`${scheduleDate}T${scheduleTime}`);

                if (scheduledDateTime <= new Date()) {
                    newErrors.scheduleDate =
                        "Scheduled date and time must be in the future.";
                    newErrors.scheduleTime =
                        "Scheduled date and time must be in the future.";
                }
            }
        }
        /* ================= SET ERRORS ================= */
        setErrors(newErrors);

        /* ================= ALERT ================= */
        if (Object.keys(newErrors).length > 0) {
            const firstError = Object.values(newErrors)[0];
            showError(firstError);
            return false;
        }
        return true;
    };

    const handleCreateNotification = async (mode = publishType) => {

        if (!validateNotification(mode)) {
            return;
        }

        try {
            setSaving(true);

            const scheduledAt =
                mode === "schedule"
                    ? `${scheduleDate}T${scheduleTime}:00`
                    : null;

            const payload = {
                title: notification.title.trim(),
                message: notification.message.trim(),
                type: notification.type,
                priority: notification.priority,
                audienceType: notification.audienceType,
                publishMode:
                    mode === "draft"
                        ? "DRAFT"
                        : mode === "now"
                            ? "IMMEDIATE"
                            : "SCHEDULED",
                scheduledAt
            };           
            let response;

            // UPDATE EXISTING DRAFT 
            if (editingNotification) {

                response = await updateNotification(
                    editingNotification.notificationId,
                    payload
                );

            } else {
                // CREATE NEW 
                response = await createNotification(payload);
            }

            if (response?.message === "JWT token is expired" || response?.status === "expire") {
                deleteCookie("_token");
                deleteCookie("_session_id");
                localStorage.clear();
                setAlertConfig({
                    type: "error",
                    message:
                        response.message ||
                        "Session expired. Please login again."
                });
                setShowAlert(true);

                setTimeout(() => {
                    navigate("/login");
                }, 2000);
                return;
            }

            if (
                response?.status === "success" ||
                response?.status === "PUBLISHED" ||
                response?.status === "DRAFT" ||
                response?.status === "SCHEDULED"
            ) {

                setShowCreateModal(false);
                resetNotificationForm();
                setEditingNotification(null);
                await fetchNotifications();

                setAlertConfig({
                    type: "success",
                    message:
                        response?.message ||
                        (
                            editingNotification
                                ? "Notification updated successfully."
                                : "Notification created successfully."
                        )
                });

                setShowAlert(true);
                return;
            }

            setAlertConfig({
                type: "error",
                message:
                    response?.message ||
                    "Unable to save notification."
            });
            setShowAlert(true);
        } catch (error) {
           
            setAlertConfig({
                type: "error",
                message:
                    error?.response?.data?.message ||
                    "Unable to save notification."
            });
            setShowAlert(true);

        } finally {
            setSaving(false);
        }
    };

    const resetNotificationForm = () => {

        setNotification({
            title: "",
            audienceType: "ALL",
            priority: "MEDIUM",
            type: "ANNOUNCEMENT",
            message: "",
            scheduledAt: null
        });

        setPublishType("now");
        setScheduleDate("");
        setScheduleTime("");
        setErrors({});

        setEditingNotification(null);
    };

    // ================= SELECTION =================
    const handleSelectNotification = (notificationId) => {
        setSelectedNotificationIds((prev) => {
            if (prev.includes(notificationId)) {
                return prev.filter((id) => id !== notificationId);
            }
            return [...prev, notificationId];
        });
    };

    const handleSelectAll = () => {
        const currentPageIds = paginatedNotifications.map(
            (item) => item.notificationId
        );

        const allSelected = currentPageIds.every((id) =>
            selectedNotificationIds.includes(id)
        );

        if (allSelected) {
            // Unselect current page
            setSelectedNotificationIds((prev) =>
                prev.filter((id) => !currentPageIds.includes(id))
            );
        } else {
            // Select current page
            setSelectedNotificationIds((prev) => [
                ...new Set([...prev, ...currentPageIds])
            ]);
        }
    };

    const isAllCurrentPageSelected =
        paginatedNotifications.length > 0 &&
        paginatedNotifications.every((item) =>
            selectedNotificationIds.includes(item.notificationId)
        );

    const isSomeCurrentPageSelected =
        paginatedNotifications.some((item) =>
            selectedNotificationIds.includes(item.notificationId)
        );

    // ================= DELETE NOTIFICATIONS =================
    const handleDeleteNotifications = async () => {

        if (
            !selectedNotificationIds ||
            selectedNotificationIds.length === 0
        ) {
            setAlertConfig({
                type: "error",
                message:
                    "Please select at least one notification"
            });
            setShowAlert(true);
            return;
        }

        try {
            setDeleting(true);      
            const response = await deleteNotifications(
                selectedNotificationIds
            );            

            // Session expired
            if (response?.message === "JWT token is expired" || response?.status === "expire") {
                deleteCookie("_token");
                deleteCookie("_session_id");
                localStorage.clear();
                setAlertConfig({
                    type: "error",
                    message:
                        response.message ||
                        "Session expired. Please login again."
                });
                setShowAlert(true);

                setTimeout(() => {
                    navigate("/login");
                }, 2000);
                return;
            }

            // Success
            if (response?.status === "success") {
                setShowDeleteModal(false);
                setSelectedNotificationIds([]);
                await fetchNotifications();
                setAlertConfig({
                    type: "success",
                    message:
                        response?.message ||
                        "Notification(s) deleted successfully."
                });
                setShowAlert(true);
                return;
            }

            // Failure
            setAlertConfig({
                type: "error",
                message:
                    response?.message ||
                    "Unable to delete notification(s)."
            });
            setShowAlert(true);

        } catch (error) {

            setAlertConfig({
                type: "error",
                message:
                    error?.response?.data?.message ||
                    "Unable to delete notification(s)."
            });
            setShowAlert(true);
        } finally {
            setDeleting(false);
        }
    };

    const handleViewNotification = async (notificationId) => {
        try {
            setLoadingNotification(true);
            const response = await getNotificationById(notificationId);           

            // ================= SESSION EXPIRED =================
            if (response?.message === "JWT token is expired" || response?.status === "expire") {
                deleteCookie("_token");
                deleteCookie("_session_id");
                localStorage.clear();
                setAlertConfig({
                    type: "error",
                    message:
                        response.message ||
                        "Session expired. Please login again."
                });
                setShowAlert(true);

                setTimeout(() => {
                    navigate("/login");
                }, 2000);
                return;
            }

            // HANDLE DIFFERENT POSSIBLE API RESPONSE STRUCTURES
            let notificationData = null;

            if (
                response &&
                typeof response === "object" &&
                response.notificationId != null
            ) {
                notificationData = response;
            } else if (
                response?.notification &&
                response.notification.notificationId != null
            ) {
                notificationData = response.notification;
            } else if (
                response?.data &&
                response.data.notificationId != null
            ) {
                notificationData = response.data;
            }else if (
                response?.result &&
                response.result.notificationId != null
            ) {
                notificationData = response.result;
            }

            // ================= SUCCESS =================
            if (notificationData) {
                setSelectedNotification(notificationData);
                setShowViewModal(true);
                return;
            }

            // ================= NO DATA =================       
            setAlertConfig({
                type: "error",
                message:
                    "Notification details not available."
            });
            setShowAlert(true);

        } catch (error) {
            setAlertConfig({
                type: "error",
                message:
                    error?.response?.data?.message ||
                    "Unable to fetch notification."
            });
            setShowAlert(true);
        } finally {
            setLoadingNotification(false);
        }
    };

    // Draft, Schedule, Publish Notification
    const [editingNotification, setEditingNotification] = useState(null);
    const handleEditDraft = (draft) => {

        setEditingNotification(draft);
        setNotification({
            title: draft.title || "",
            audienceType: draft.audienceType || "ALL",
            priority: draft.priority || "MEDIUM",
            type: draft.type || "ANNOUNCEMENT",
            message: draft.message || "",
            scheduledAt: draft.scheduledAt || null
        });

        if (draft.scheduledAt) {
            const date = new Date(draft.scheduledAt);

            setScheduleDate(
                date.toISOString().split("T")[0]
            );
            setScheduleTime(
                date.toTimeString().slice(0, 5)
            );

        } else {
            setScheduleDate("");
            setScheduleTime("");
        }

        setPublishType("draft");
        setErrors({});

        setShowViewModal(false);
        setSelectedNotification(null);
        setShowCreateModal(true);
    };

    const handlePublishDraft = async (draft) => {

        try {
            setLoadingNotification(true);
            const response = await publishNotification(
                draft.notificationId
            );

            if (response?.message === "JWT token is expired" || response?.status === "expire") {
                deleteCookie("_token");
                deleteCookie("_session_id");
                localStorage.clear();
                setAlertConfig({
                    type: "error",
                    message:
                        response.message ||
                        "Session expired. Please login again."
                });
                setShowAlert(true);
                return;
            }

            if (
                response?.status === "success" ||
                response?.status === "PUBLISHED"
            ) {

                setShowViewModal(false);
                setSelectedNotification(null);

                await fetchNotifications();
                setAlertConfig({
                    type: "success",
                    message:
                        response?.message ||
                        "Notification published successfully."
                });
                setShowAlert(true);
                return;
            }

            setAlertConfig({
                type: "error",
                message:
                    response?.message ||
                    "Unable to publish notification."
            });
            setShowAlert(true);

        } catch (error) {
            setAlertConfig({
                type: "error",
                message:
                    error?.response?.data?.message ||
                    "Unable to publish notification."
            });
            setShowAlert(true);

        } finally {
            setLoadingNotification(false);
        }
    };

    return (
        <Container fluid className="py-4">
            {showAlert && (
                <AppAlert
                    type={alertConfig.type}
                    message={alertConfig.message}
                    onClose={() => setShowAlert(false)}
                />
            )}

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
                <div>
                    <h2 className="fw-bold mb-1">
                        <i className="bi bi-bell-fill text-primary me-2"></i>
                        Notifications
                    </h2>

                    <p className="text-muted mb-0">
                        Create, publish and manage employee announcements across the organization.
                    </p>

                </div>

                <div className="d-flex gap-2 mt-3 mt-lg-0">

                    <Button
                        variant="light"
                        className="border"
                    >
                        <i className="bi bi-download me-2"></i>
                        Export
                    </Button>

                    {selectedNotificationIds.length > 0 && (
                        <Button
                            variant="outline-danger"
                            onClick={() => setShowDeleteModal(true)}
                            disabled={deleting}
                        >
                            <i className="bi bi-trash me-2"></i>

                            Delete
                            {" "}
                            ({selectedNotificationIds.length})
                        </Button>
                    )}

                    <Button
                        variant="outline-secondary"
                        onClick={handleRefresh}
                        disabled={loadingNotifications}
                    >
                        {loadingNotifications ? (
                            <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                            />
                        ) : (
                            <i className="bi bi-arrow-clockwise"></i>
                        )}
                    </Button>

                    <Button
                        variant="primary"
                        onClick={() => {
                            resetNotificationForm();
                            setEditingNotification(null);
                            setShowCreateModal(true);
                        }}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        Create Notification
                    </Button>

                </div>
            </div>

            {/* Analytics Dashboard */}
            <Row className="g-4 mb-4">

                {/* Total */}
                <Col xl={3} md={6}>
                    <Card className="analytics-card h-100 border-0 shadow-sm">
                        <Card.Body>

                            <div className="d-flex justify-content-between align-items-start">

                                <div>
                                    <span className="analytics-label">
                                        Total Notifications
                                    </span>

                                    <h2 className="analytics-value mb-1">
                                        {notificationStats.total}
                                    </h2>

                                    <small className="text-muted">
                                        All notifications created
                                    </small>
                                </div>

                                <div className="analytics-icon bg-primary-subtle text-primary">
                                    <i className="bi bi-bell-fill"></i>
                                </div>

                            </div>

                            <div className="mt-4">
                                <div className="d-flex justify-content-between mb-1">
                                    <small className="text-muted">
                                        Overall volume
                                    </small>

                                    <small className="fw-semibold">
                                        100%
                                    </small>
                                </div>

                                <div className="progress" style={{ height: "6px" }}>
                                    <div
                                        className="progress-bar bg-primary"
                                        style={{ width: "100%" }}
                                    />
                                </div>
                            </div>

                        </Card.Body>
                    </Card>
                </Col>

                {/* Published */}
                <Col xl={3} md={6}>
                    <Card className="analytics-card h-100 border-0 shadow-sm">
                        <Card.Body>

                            <div className="d-flex justify-content-between align-items-start">

                                <div>
                                    <span className="analytics-label">
                                        Published
                                    </span>

                                    <h2 className="analytics-value mb-1">
                                        {notificationStats.published}
                                    </h2>

                                    <small className="text-muted">
                                        Successfully published
                                    </small>
                                </div>

                                <div className="analytics-icon bg-success-subtle text-success">
                                    <i className="bi bi-check-circle-fill"></i>
                                </div>

                            </div>

                            <div className="mt-4">
                                <div className="d-flex justify-content-between mb-1">

                                    <small className="text-muted">
                                        Publication rate
                                    </small>

                                    <small className="fw-semibold text-success">
                                        {notificationStats.total > 0
                                            ? Math.round(
                                                (notificationStats.published /
                                                    notificationStats.total) *
                                                100
                                            )
                                            : 0}
                                        %
                                    </small>
                                </div>

                                <div className="progress" style={{ height: "6px" }}>
                                    <div
                                        className="progress-bar bg-success"
                                        style={{
                                            width: `${notificationStats.total > 0
                                                ? (notificationStats.published /
                                                    notificationStats.total) *
                                                100
                                                : 0
                                                }%`
                                        }}
                                    />
                                </div>
                            </div>

                        </Card.Body>
                    </Card>
                </Col>

                {/* Scheduled */}
                <Col xl={3} md={6}>
                    <Card className="analytics-card h-100 border-0 shadow-sm">
                        <Card.Body>

                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <span className="analytics-label">
                                        Scheduled
                                    </span>

                                    <h2 className="analytics-value mb-1">
                                        {notificationStats.scheduled}
                                    </h2>

                                    <small className="text-muted">
                                        Upcoming notifications
                                    </small>
                                </div>

                                <div className="analytics-icon bg-warning-subtle text-warning">
                                    <i className="bi bi-calendar-event-fill"></i>
                                </div>

                            </div>

                            <div className="mt-4">
                                <div className="d-flex justify-content-between mb-1">
                                    <small className="text-muted">
                                        Scheduled rate
                                    </small>

                                    <small className="fw-semibold text-warning">
                                        {notificationStats.total > 0
                                            ? Math.round(
                                                (notificationStats.scheduled /
                                                    notificationStats.total) *
                                                100
                                            )
                                            : 0}
                                        %
                                    </small>
                                </div>

                                <div className="progress" style={{ height: "6px" }}>
                                    <div
                                        className="progress-bar bg-warning"
                                        style={{
                                            width: `${notificationStats.total > 0
                                                ? (notificationStats.scheduled /
                                                    notificationStats.total) *
                                                100
                                                : 0
                                                }%`
                                        }}
                                    />
                                </div>
                            </div>

                        </Card.Body>
                    </Card>
                </Col>

                {/* Draft */}
                <Col xl={3} md={6}>
                    <Card className="analytics-card h-100 border-0 shadow-sm">
                        <Card.Body>

                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <span className="analytics-label">
                                        Draft
                                    </span>

                                    <h2 className="analytics-value mb-1">
                                        {notificationStats.draft}
                                    </h2>

                                    <small className="text-muted">
                                        Awaiting publication
                                    </small>
                                </div>

                                <div className="analytics-icon bg-secondary-subtle text-secondary">
                                    <i className="bi bi-file-earmark-text-fill"></i>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="d-flex justify-content-between mb-1">
                                    <small className="text-muted">
                                        Draft rate
                                    </small>

                                    <small className="fw-semibold text-secondary">
                                        {notificationStats.total > 0
                                            ? Math.round(
                                                (notificationStats.draft /
                                                    notificationStats.total) *
                                                100
                                            )
                                            : 0}
                                        %
                                    </small>
                                </div>

                                <div className="progress" style={{ height: "6px" }}>
                                    <div
                                        className="progress-bar bg-secondary"
                                        style={{
                                            width: `${notificationStats.total > 0
                                                ? (notificationStats.draft /
                                                    notificationStats.total) *
                                                100
                                                : 0
                                                }%`
                                        }}
                                    />
                                </div>
                            </div>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Search */}
            <Card className="search-toolbar mb-4">
                <Card.Body>
                    <Row className="align-items-center g-3">

                        <Col xl={4} lg={4}>
                            <InputGroup className="search-box">

                                <InputGroup.Text>
                                    <i className="bi bi-search"></i>
                                </InputGroup.Text>

                                <Form.Control
                                    placeholder="Search notifications..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />

                            </InputGroup>
                        </Col>

                        <Col xl={2} lg={2}>
                            <Form.Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">All Status</option>
                                <option value="PUBLISHED">Published</option>
                                <option value="SCHEDULED">Scheduled</option>
                                <option value="DRAFT">Draft</option>
                            </Form.Select>
                        </Col>

                        <Col xl={2} lg={2}>
                            <Form.Select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="All">All Types</option>
                                <option value="ANNOUNCEMENT">Announcement</option>
                                <option value="HOLIDAY">Holiday</option>
                                <option value="ALERT">Alert</option>
                                <option value="EMERGENCY">Emergency</option>
                            </Form.Select>
                        </Col>

                        <Col xl={4} lg={4}>
                            <div className="toolbar-actions">
                                <Dropdown as={ButtonGroup} className="me-2">

                                    <Button variant="primary">
                                        <i className="bi bi-sort-down me-2"></i>
                                        Sort
                                    </Button>

                                    <Dropdown.Toggle
                                        split
                                        variant="primary"
                                        id="sort-dropdown"
                                    />

                                    <Dropdown.Menu align="end">
                                        <Dropdown.Item onClick={() => setSortOption("newest")}>
                                            <i className="bi bi-sort-down me-2"></i>
                                            Newest First
                                        </Dropdown.Item>

                                        <Dropdown.Item onClick={() => setSortOption("oldest")}>
                                            <i className="bi bi-sort-up me-2"></i>
                                            Oldest First
                                        </Dropdown.Item>

                                        <Dropdown.Divider />

                                        <Dropdown.Item onClick={() => setSortOption("titleAsc")}>
                                            <i className="bi bi-sort-alpha-down me-2"></i>
                                            Title A → Z
                                        </Dropdown.Item>

                                        <Dropdown.Item onClick={() => setSortOption("titleDesc")}>
                                            <i className="bi bi-sort-alpha-up me-2"></i>
                                            Title Z → A
                                        </Dropdown.Item>

                                        <Dropdown.Divider />

                                        <Dropdown.Item onClick={() => setSortOption("priority")}>
                                            <i className="bi bi-exclamation-triangle me-2"></i>
                                            Priority
                                        </Dropdown.Item>

                                    </Dropdown.Menu>

                                </Dropdown>

                                <Button variant="warning">
                                    <i className="bi bi-download me-2"></i>
                                    Export
                                </Button>

                            </div>
                        </Col>

                    </Row>
                </Card.Body>
            </Card>

            {/* Table */}
            <Card className="shadow-sm border-0">
                <Table hover responsive className="align-middle mb-0">

                    <thead className="table-light">
                        <tr>

                            <th style={{ width: "40px" }}>
                                <Form.Check
                                    checked={isAllCurrentPageSelected}
                                    onChange={handleSelectAll}
                                    ref={(element) => {
                                        if (element) {
                                            element.indeterminate =
                                                isSomeCurrentPageSelected &&
                                                !isAllCurrentPageSelected;
                                        }
                                    }}
                                    aria-label="Select all notifications"
                                />
                            </th>

                            <th>
                                Notification
                            </th>

                            <th>
                                Type
                            </th>

                            <th>
                                Audience
                            </th>

                            <th>
                                Priority
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Date
                            </th>

                            <th
                                className="text-center"
                                style={{ width: "130px" }}
                            >
                                Actions
                            </th>

                        </tr>
                    </thead>

                    <tbody>
                        {loadingNotifications ? (
                            <tr>
                                <td colSpan="8" className="text-center py-5">

                                    <div className="spinner-border text-primary mb-2" />

                                    <div className="text-muted">
                                        Loading notifications...
                                    </div>

                                </td>
                            </tr>

                        ) : paginatedNotifications.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center py-5">

                                    <div className="empty-state">
                                        <div className="empty-state-icon">
                                            <i className="bi bi-bell-slash"></i>
                                        </div>

                                        <h6 className="fw-semibold mt-3">
                                            No notifications found
                                        </h6>

                                        <p className="text-muted mb-0">
                                            Try changing your search or status filter.
                                        </p>
                                    </div>

                                </td>
                            </tr>

                        ) : (
                            paginatedNotifications.map((item) => (
                                <tr key={item.notificationId}>

                                    {/* Checkbox */}
                                    <td>
                                        <Form.Check
                                            checked={selectedNotificationIds.includes(
                                                item.notificationId
                                            )}
                                            onChange={() =>
                                                handleSelectNotification(
                                                    item.notificationId
                                                )
                                            }
                                            aria-label={`Select ${item.title}`}
                                        />
                                    </td>

                                    {/* Notification */}
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div className="notification-avatar me-3">
                                                <i className="bi bi-megaphone-fill"></i>
                                            </div>

                                            <div className="min-width-0">

                                                <div className="fw-semibold text-truncate">
                                                    {item.title || "-"}
                                                </div>

                                                <small
                                                    className="text-muted d-block text-truncate"
                                                    style={{ maxWidth: "280px" }}
                                                >
                                                    {item.message || "No message"}
                                                </small>

                                            </div>
                                        </div>
                                    </td>

                                    {/* Type */}
                                    <td>
                                        <Badge
                                            bg={getType(item.type)}
                                            className="fw-normal"
                                        >
                                            <i className="bi bi-megaphone me-1"></i>
                                            {formatType(item.type)}
                                        </Badge>
                                    </td>


                                    {/* Audience */}
                                    <td>
                                        <span className="audience-chip">
                                            <i className="bi bi-people-fill me-1"></i>
                                            {formatAudience(item.audienceType)}
                                        </span>
                                    </td>

                                    {/* Priority */}
                                    <td>

                                        <Badge
                                            bg={getPriority(item.priority)}
                                            className="fw-normal"
                                        >
                                            {formatPriority(item.priority)}
                                        </Badge>
                                    </td>

                                    {/* Status */}
                                    <td>
                                        <Badge
                                            bg={getStatus(item.status)}
                                            className="fw-normal"
                                        >
                                            <i
                                                className={`bi ${item.status?.toUpperCase() === "PUBLISHED"
                                                    ? "bi-check-circle"
                                                    : item.status?.toUpperCase() === "SCHEDULED"
                                                        ? "bi-clock"
                                                        : "bi-file-earmark"
                                                    } me-1`}
                                            />
                                            {formatStatus(item.status)}
                                        </Badge>
                                    </td>

                                    {/* Date */}
                                    <td>
                                        <div className="small">
                                            {item.status?.toUpperCase() === "SCHEDULED" &&
                                                item.scheduledAt ? (
                                                <>
                                                    <div className="fw-semibold">
                                                        {new Date(
                                                            item.scheduledAt
                                                        ).toLocaleDateString(
                                                            "en-IN",
                                                            {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric"
                                                            }
                                                        )}
                                                    </div>

                                                    <small className="text-muted">
                                                        {new Date(
                                                            item.scheduledAt
                                                        ).toLocaleTimeString(
                                                            "en-IN",
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit"
                                                            }
                                                        )}
                                                    </small>
                                                </>

                                            ) : item.status?.toUpperCase() === "PUBLISHED" &&
                                                item.publishedAt ? (
                                                <>
                                                    <div className="fw-semibold">
                                                        {new Date(
                                                            item.publishedAt
                                                        ).toLocaleDateString(
                                                            "en-IN",
                                                            {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric"
                                                            }
                                                        )}
                                                    </div>

                                                    <small className="text-muted">
                                                        {new Date(
                                                            item.publishedAt
                                                        ).toLocaleTimeString(
                                                            "en-IN",
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit"
                                                            }
                                                        )}
                                                    </small>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="fw-semibold">
                                                        {item.createdOn
                                                            ? new Date(
                                                                item.createdOn
                                                            ).toLocaleDateString(
                                                                "en-IN",
                                                                {
                                                                    day: "2-digit",
                                                                    month: "short",
                                                                    year: "numeric"
                                                                }
                                                            )
                                                            : "-"
                                                        }
                                                    </div>
                                                    <small className="text-muted">
                                                        Created
                                                    </small>
                                                </>
                                            )}
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center gap-1">

                                            <Button
                                                size="sm"
                                                variant="light"
                                                className="border"
                                                title="View"
                                                onClick={() => handleViewNotification(item.notificationId)}
                                            >
                                                <i className="bi bi-eye"></i>
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="light"
                                                className="border text-danger"
                                                title="Delete"
                                                onClick={() => {
                                                    setSelectedNotificationIds([
                                                        item.notificationId
                                                    ]);

                                                    setShowDeleteModal(true);
                                                }}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>

                <div className="d-flex justify-content-between align-items-center p-3 border-top">
                    {/* Left side */}
                    <div className="d-flex align-items-center gap-2">
                        <small className="text-muted">
                            Showing{" "}
                            {filteredNotifications.length === 0
                                ? 0
                                : (currentPage - 1) * itemsPerPage + 1}
                            {" "}to{" "}
                            {Math.min(
                                currentPage * itemsPerPage,
                                filteredNotifications.length
                            )}
                            {" "}of{" "}
                            {filteredNotifications.length}
                            {" "}notifications
                        </small>

                        <Form.Select
                            size="sm"
                            style={{ width: "80px" }}
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </Form.Select>
                    </div>

                    {/* Right side */}
                    {totalPages > 1 && (
                        <div className="d-flex align-items-center gap-1">
                            <Button
                                size="sm"
                                variant="outline-secondary"
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage(prev => prev - 1)
                                }
                            >
                                <i className="bi bi-chevron-left"></i>
                            </Button>

                            {Array.from(
                                { length: totalPages },
                                (_, index) => index + 1
                            ).map(page => (

                                <Button
                                    key={page}
                                    size="sm"
                                    variant={
                                        currentPage === page
                                            ? "primary"
                                            : "outline-secondary"
                                    }
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </Button>
                            ))}

                            <Button
                                size="sm"
                                variant="outline-secondary"
                                disabled={currentPage === totalPages}
                                onClick={() =>
                                    setCurrentPage(prev => prev + 1)
                                }
                            >
                                <i className="bi bi-chevron-right"></i>
                            </Button>

                        </div>
                    )}
                </div>
            </Card>

            {/* Model */}
            <Modal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                size="xl"
                centered
                scrollable
                backdrop="static"
                dialogClassName="notification-modal"
            >
                <Modal.Header className="border-0 pb-0">
                    <div className="w-100 d-flex justify-content-between align-items-start">

                        <div>
                            <h4 className="fw-bold mb-1">
                                <i className="bi bi-megaphone-fill text-primary me-2"></i>

                                {editingNotification
                                    ? "Edit Notification"
                                    : "Create Notification"
                                }
                            </h4>

                            <small className="text-muted">
                                Publish announcements for your Portal and Mobile App.
                            </small>
                        </div>

                        <Badge bg={
                            publishType === "draft"
                                ? "secondary"
                                : publishType === "schedule"
                                    ? "warning"
                                    : "success"
                        }
                            className="px-3 py-2"
                        >
                            {publishType === "draft"
                                ? "Draft"
                                : publishType === "schedule"
                                    ? "Scheduled"
                                    : "Publish Now"}
                        </Badge>

                    </div>
                </Modal.Header>

                <Modal.Body className="pt-4">
                    <Row className="g-4">

                        {/* LEFT */}
                        <Col lg={8}>
                            <Card className="shadow-sm border-0 mb-4">
                                <Card.Body>
                                    <h6 className="fw-bold mb-4">
                                        <i className="bi bi-pencil-square me-2 text-primary"></i>
                                        Notification Details
                                    </h6>

                                    <Row className="g-3">
                                        <Col md={12}>
                                            <Form.Group>

                                                <Form.Label>
                                                    Title
                                                </Form.Label>

                                                <Form.Control
                                                    size="lg"
                                                    name="title"
                                                    value={notification.title}
                                                    onChange={handleChange}
                                                    placeholder="Enter notification title"
                                                    isInvalid={!!errors.title}
                                                />

                                                <Form.Control.Feedback type="invalid">
                                                    {errors.title}
                                                </Form.Control.Feedback>

                                            </Form.Group>
                                        </Col>

                                        <Col md={4}>
                                            <Form.Group>

                                                <Form.Label>
                                                    Type
                                                </Form.Label>

                                                <Form.Select
                                                    name="type"
                                                    value={notification.type}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.type}
                                                >
                                                    <option value="ANNOUNCEMENT">
                                                        Announcement
                                                    </option>

                                                    <option value="HOLIDAY">
                                                        Holiday
                                                    </option>

                                                    <option value="ALERT">
                                                        Alert
                                                    </option>

                                                    <option value="EMERGENCY">
                                                        Emergency
                                                    </option>
                                                </Form.Select>

                                                <Form.Control.Feedback type="invalid">
                                                    {errors.type}
                                                </Form.Control.Feedback>

                                            </Form.Group>
                                        </Col>

                                        <Col md={4}>
                                            <Form.Group>

                                                <Form.Label>
                                                    Audience
                                                </Form.Label>

                                                <Form.Select
                                                    name="audienceType"
                                                    value={notification.audienceType}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.audienceType}
                                                >
                                                    <option value="ALL">
                                                        All Employees
                                                    </option>

                                                    <option value="HR">
                                                        HR
                                                    </option>

                                                    <option value="FINANCE">
                                                        Finance
                                                    </option>

                                                    <option value="MANAGER">
                                                        Manager
                                                    </option>

                                                    <option value="SUPPORT">
                                                        Support
                                                    </option>

                                                    <option value="IT">
                                                        IT Department
                                                    </option>

                                                    <option value="EMPLOYEE">
                                                        Employee
                                                    </option>
                                                </Form.Select>

                                                <Form.Control.Feedback type="invalid">
                                                    {errors.audienceType}
                                                </Form.Control.Feedback>

                                            </Form.Group>
                                        </Col>

                                        <Col md={4}>
                                            <Form.Group>

                                                <Form.Label>
                                                    Priority
                                                </Form.Label>

                                                <Form.Select
                                                    name="priority"
                                                    value={notification.priority}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.priority}
                                                >
                                                    <option value="LOW">
                                                        Low
                                                    </option>

                                                    <option value="MEDIUM">
                                                        Medium
                                                    </option>

                                                    <option value="HIGH">
                                                        High
                                                    </option>

                                                    <option value="CRITICAL">
                                                        Critical
                                                    </option>
                                                </Form.Select>

                                                <Form.Control.Feedback type="invalid">
                                                    {errors.priority}
                                                </Form.Control.Feedback>

                                            </Form.Group>
                                        </Col>

                                        <Col md={12}>
                                            <Form.Group>

                                                <Form.Label>
                                                    Message
                                                </Form.Label>

                                                <Form.Control
                                                    as="textarea"
                                                    rows={8}
                                                    name="message"
                                                    value={notification.message}
                                                    onChange={handleChange}
                                                    placeholder="Write your notification..."
                                                    isInvalid={!!errors.message}
                                                />

                                                <Form.Control.Feedback type="invalid">
                                                    {errors.message}
                                                </Form.Control.Feedback>

                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            {/* Publish */}
                            <Card className="shadow-sm border-0">
                                <Card.Body>
                                    <h6 className="fw-bold mb-4">
                                        <i className="bi bi-calendar-event me-2 text-primary"></i>
                                        Publish Settings
                                    </h6>

                                    <Row>
                                        <ButtonGroup className="w-100 mb-4">
                                            <ToggleButton
                                                id="draft"
                                                type="radio"
                                                variant={publishType === "draft" ? "primary" : "outline-primary"}
                                                name="publish"
                                                value="draft"
                                                checked={publishType === "draft"}
                                                onChange={(e) => setPublishType(e.currentTarget.value)}
                                            >
                                                <i className="bi bi-file-earmark me-2"></i>
                                                Draft
                                            </ToggleButton>

                                            <ToggleButton
                                                id="now"
                                                type="radio"
                                                variant={publishType === "now" ? "success" : "outline-success"}
                                                name="publish"
                                                value="now"
                                                checked={publishType === "now"}
                                                onChange={(e) => setPublishType(e.currentTarget.value)}
                                            >
                                                <i className="bi bi-send me-2"></i>
                                                Publish Now
                                            </ToggleButton>

                                            <ToggleButton
                                                id="schedule"
                                                type="radio"
                                                variant={publishType === "schedule" ? "warning" : "outline-warning"}
                                                name="publish"
                                                value="schedule"
                                                checked={publishType === "schedule"}
                                                onChange={(e) => setPublishType(e.currentTarget.value)}
                                            >
                                                <i className="bi bi-calendar-event me-2"></i>
                                                Schedule
                                            </ToggleButton>
                                        </ButtonGroup>
                                    </Row>

                                    {publishType === "schedule" && (
                                        <Card className="border-0 bg-light mt-3">
                                            <Card.Body>
                                                <Row className="g-3">

                                                    <Col md={6}>
                                                        <Form.Group>

                                                            <Form.Label>
                                                                Publish Date
                                                            </Form.Label>

                                                            <Form.Control
                                                                type="date"
                                                                value={scheduleDate}
                                                                min={
                                                                    new Date()
                                                                        .toISOString()
                                                                        .split("T")[0]
                                                                }
                                                                onChange={(e) => {

                                                                    setScheduleDate(e.target.value);

                                                                    if (errors.scheduleDate) {
                                                                        setErrors((prev) => ({
                                                                            ...prev,
                                                                            scheduleDate: ""
                                                                        }));
                                                                    }
                                                                }}
                                                                isInvalid={!!errors.scheduleDate}
                                                            />

                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.scheduleDate}
                                                            </Form.Control.Feedback>

                                                        </Form.Group>
                                                    </Col>

                                                    <Col md={6}>
                                                        <Form.Group>

                                                            <Form.Label>
                                                                Publish Time
                                                            </Form.Label>

                                                            <Form.Control
                                                                type="time"
                                                                value={scheduleTime}
                                                                onChange={(e) => {

                                                                    setScheduleTime(e.target.value);

                                                                    if (errors.scheduleTime) {
                                                                        setErrors((prev) => ({
                                                                            ...prev,
                                                                            scheduleTime: ""
                                                                        }));
                                                                    }
                                                                }}
                                                                isInvalid={!!errors.scheduleTime}
                                                            />

                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.scheduleTime}
                                                            </Form.Control.Feedback>

                                                        </Form.Group>
                                                    </Col>

                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    )}

                                    <hr />
                                    <Row>
                                        <Col md={6}>
                                            <Form.Check
                                                label="Pin on Dashboard"
                                            />
                                        </Col>

                                        <Col md={6}>
                                            <Form.Check
                                                label="Show Popup on Login"
                                            />
                                        </Col>

                                        <Col md={6}>
                                            <Form.Check
                                                defaultChecked
                                                label="Push Notification"
                                            />
                                        </Col>

                                        <Col md={6}>
                                            <Form.Check
                                                label="Require Acknowledgement"
                                            />
                                        </Col>

                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* RIGHT */}
                        <Col lg={4}>
                            <Card className="shadow-sm border-0 sticky-top">

                                <Card.Header className="bg-white">
                                    <h6 className="mb-0 fw-bold">
                                        <i className="bi bi-phone me-2 text-primary"></i>
                                        Live Preview
                                    </h6>
                                </Card.Header>

                                <Card.Body>
                                    <div className="border rounded-4 p-4 bg-light">

                                        <Badge
                                            bg={getType(notification.type)}
                                            className="mb-3"
                                        >
                                            {formatType(notification.type)}
                                        </Badge>

                                        <h5>
                                            {notification.title || "Notification Title"}
                                        </h5>

                                        <hr />
                                        <p
                                            style={{
                                                minHeight: 180,
                                                whiteSpace: "pre-wrap"
                                            }}
                                        >
                                            {notification.message ||
                                                "Notification preview will appear here..."}
                                        </p>

                                        <hr />
                                        <div className="d-flex justify-content-between">

                                            <small className="text-muted">
                                                Portal
                                            </small>

                                            <Badge
                                                bg={
                                                    publishType === "draft"
                                                        ? "secondary"
                                                        : publishType === "schedule"
                                                            ? "warning"
                                                            : "success"
                                                }
                                            >
                                                {publishType === "draft"
                                                    ? "Draft"
                                                    : publishType === "schedule"
                                                        ? "Scheduled"
                                                        : "Published"}
                                            </Badge>

                                        </div>

                                    </div>

                                    <div className="mt-4">

                                        <small className="text-muted d-block mb-2">
                                            Delivery
                                        </small>

                                        <Badge bg="primary" className="me-2">
                                            Portal
                                        </Badge>

                                        <Badge bg="dark">
                                            Mobile App
                                        </Badge>

                                    </div>

                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer className="border-0">
                    <Button
                        variant="light"
                        onClick={() => {
                            setShowCreateModal(false);
                            resetNotificationForm();
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="outline-primary"
                        disabled={saving}
                        onClick={() => handleCreateNotification("draft")}
                    >
                        {saving ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-file-earmark me-2"></i>
                                Save Draft
                            </>
                        )}
                    </Button>

                    <Button
                        variant="primary"
                        disabled={saving}
                        onClick={() => handleCreateNotification(publishType)}
                    >
                        {saving ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-send-fill me-2"></i>
                                {publishType === "schedule"
                                    ? "Schedule Notification"
                                    : "Publish Notification"}
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ================= DELETE CONFIRMATION MODAL ================= */}
            <Modal
                show={showDeleteModal}
                onHide={() => {
                    if (!deleting) {
                        setShowDeleteModal(false);
                    }
                }}
                centered
                backdrop="static"
            >
                <Modal.Header closeButton={!deleting}>
                    <Modal.Title className="fw-bold">
                        <i className="bi bi-exclamation-triangle-fill text-danger me-2"></i>
                        Delete Notification
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="text-center py-3">
                        <div
                            className="rounded-circle bg-danger-subtle
                           text-danger d-inline-flex
                           align-items-center justify-content-center mb-3"
                            style={{
                                width: "70px",
                                height: "70px",
                                fontSize: "28px"
                            }}
                        >
                            <i className="bi bi-trash-fill"></i>
                        </div>
                        <h5 className="fw-semibold">
                            Are you sure?
                        </h5>
                        <p className="text-muted mb-0">
                            You are about to delete{" "}
                            <strong>
                                {selectedNotificationIds.length}
                            </strong>{" "}
                            notification
                            {selectedNotificationIds.length > 1
                                ? "s"
                                : ""}.
                            <br />
                            This action cannot be undone.
                        </p>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="light"
                        className="border"
                        disabled={deleting}
                        onClick={() =>
                            setShowDeleteModal(false)
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="danger"
                        disabled={deleting}
                        onClick={handleDeleteNotifications}
                    >
                        {deleting ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-trash-fill me-2"></i>
                                Delete
                                {" "}
                                {selectedNotificationIds.length}
                                {" "}
                                Notification
                                {selectedNotificationIds.length > 1
                                    ? "s"
                                    : ""}
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ================= VIEW NOTIFICATION MODAL ================= */}
            <Modal
                show={showViewModal}
                onHide={() => {
                    if (!loadingNotification) {
                        setShowViewModal(false);
                        setSelectedNotification(null);
                    }
                }}
                centered
                size="lg"
                scrollable
            >
                <Modal.Header closeButton={!loadingNotification}>
                    <Modal.Title className="fw-bold">
                        <i className="bi bi-bell-fill text-primary me-2"></i>
                        Notification Details
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {loadingNotification ? (
                        <div className="text-center py-5">

                            <div
                                className="spinner-border text-primary mb-3"
                                role="status"
                            />

                            <div className="text-muted">
                                Loading notification...
                            </div>

                        </div>

                    ) : selectedNotification ? (
                        <div>

                            {/* Title */}
                            <div className="mb-4">

                                <small className="text-muted d-block mb-1">
                                    TITLE
                                </small>

                                <h4 className="fw-bold mb-0">
                                    {selectedNotification.title || "-"}
                                </h4>

                            </div>

                            {/* Badges */}
                            <div className="d-flex flex-wrap gap-4 mb-4">
                                {/* Type */}
                                <div>
                                    <small className="text-muted d-block mb-1">
                                        TYPE
                                    </small>

                                    <Badge
                                        bg={getType(selectedNotification.type)}
                                        className="px-3 py-2 fw-normal"
                                    >
                                        <i className="bi bi-megaphone me-1"></i>
                                        {formatType(selectedNotification.type)}
                                    </Badge>
                                </div>

                                {/* Priority */}
                                <div>
                                    <small className="text-muted d-block mb-1">
                                        PRIORITY
                                    </small>

                                    <Badge
                                        bg={getPriority(selectedNotification.priority)}
                                        className="px-3 py-2 fw-normal"
                                    >
                                        <i className="bi bi-exclamation-circle me-1"></i>
                                        {formatPriority(selectedNotification.priority)}
                                    </Badge>
                                </div>

                                {/* Status */}
                                <div>
                                    <small className="text-muted d-block mb-1">
                                        STATUS
                                    </small>

                                    <Badge
                                        bg={getStatus(selectedNotification.status)}
                                        className="px-3 py-2 fw-normal"
                                    >
                                        <i className="bi bi-info-circle me-1"></i>
                                        {formatStatus(selectedNotification.status)}
                                    </Badge>
                                </div>

                                {/* Audience */}
                                <div>
                                    <small className="text-muted d-block mb-1">
                                        AUDIENCE
                                    </small>

                                    <Badge
                                        bg="light"
                                        text="dark"
                                        className="border px-3 py-2 fw-normal"
                                    >
                                        <i className="bi bi-people-fill me-1"></i>
                                        {formatAudience(selectedNotification.audienceType)}
                                    </Badge>
                                </div>
                            </div>

                            {/* Information */}
                            <Row className="g-3 mb-4">

                                <Col md={6}>
                                    <Card className="border-0 bg-light h-100">
                                        <Card.Body>
                                            <small className="text-muted d-block">
                                                Audience
                                            </small>

                                            <div className="fw-semibold mt-1">
                                                <i className="bi bi-people-fill me-2 text-primary"></i>
                                                {formatAudience(
                                                    selectedNotification.audienceType
                                                )}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col md={6}>
                                    <Card className="border-0 bg-light h-100">
                                        <Card.Body>
                                            <small className="text-muted d-block">
                                                Notification Type
                                            </small>

                                            <div className="fw-semibold mt-1">
                                                {formatType(
                                                    selectedNotification.type
                                                )}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col md={6}>
                                    <Card className="border-0 bg-light h-100">
                                        <Card.Body>
                                            <small className="text-muted d-block">
                                                Priority
                                            </small>

                                            <div className="fw-semibold mt-1">
                                                {formatPriority(
                                                    selectedNotification.priority
                                                )}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col md={6}>
                                    <Card className="border-0 bg-light h-100">
                                        <Card.Body>
                                            <small className="text-muted d-block">
                                                Status
                                            </small>

                                            <div className="fw-semibold mt-1">
                                                {formatStatus(
                                                    selectedNotification.status
                                                )}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            {/* Message */}
                            <Card className="border shadow-sm mb-4">
                                <Card.Header className="bg-white">
                                    <h6 className="fw-bold mb-0">
                                        <i className="bi bi-chat-left-text me-2 text-primary"></i>
                                        Message
                                    </h6>
                                </Card.Header>

                                <Card.Body>
                                    <div
                                        className="text-muted"
                                        style={{
                                            whiteSpace: "pre-wrap",
                                            lineHeight: "1.7"
                                        }}
                                    >
                                        {selectedNotification.message || "-"}
                                    </div>
                                </Card.Body>
                            </Card>

                            {/* Dates */}
                            <Row className="g-3">
                                <Col md={4}>

                                    <small className="text-muted d-block">
                                        Created On
                                    </small>

                                    <div className="fw-semibold">

                                        {selectedNotification.createdOn
                                            ? new Date(
                                                selectedNotification.createdOn
                                            ).toLocaleString(
                                                "en-IN"
                                            )
                                            : "-"
                                        }
                                    </div>
                                </Col>

                                <Col md={4}>

                                    <small className="text-muted d-block">
                                        Published At
                                    </small>

                                    <div className="fw-semibold">
                                        {selectedNotification.publishedAt
                                            ? new Date(
                                                selectedNotification.publishedAt
                                            ).toLocaleString(
                                                "en-IN"
                                            )
                                            : "-"
                                        }
                                    </div>
                                </Col>

                                <Col md={4}>
                                    <small className="text-muted d-block">
                                        Scheduled At
                                    </small>

                                    <div className="fw-semibold">
                                        {selectedNotification.scheduledAt
                                            ? new Date(
                                                selectedNotification.scheduledAt
                                            ).toLocaleString(
                                                "en-IN"
                                            )
                                            : "-"
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </div>

                    ) : (

                        <div className="text-center text-muted py-5">
                            Notification details not available.
                        </div>

                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="light"
                        className="border"
                        onClick={() => {
                            setShowViewModal(false);
                            setSelectedNotification(null);
                        }}
                        disabled={loadingNotification}
                    >
                        Close
                    </Button>

                    {/* Draft Actions */}
                    {selectedNotification?.status?.toUpperCase() === "DRAFT" && (
                        <>
                            <Button
                                variant="outline-primary"
                                onClick={() => handleEditDraft(selectedNotification)}
                                disabled={loadingNotification}
                            >
                                <i className="bi bi-pencil-square me-2"></i>
                                Edit Draft
                            </Button>

                            <Button
                                variant="success"
                                onClick={() => handlePublishDraft(selectedNotification)}
                                disabled={loadingNotification}
                            >
                                <i className="bi bi-send-fill me-2"></i>
                                Publish Now
                            </Button>
                        </>
                    )}
                </Modal.Footer>
            </Modal>

        </Container>
    );
}