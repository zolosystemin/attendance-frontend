import api from "./api";

export const createNotification = async (data) => {
    try {
        const response = await api.post(
            "/company/notification/new",
            data
        );

        return response.data;

    } catch (error) {
        console.error(
            "CREATE NOTIFICATION ERROR",
            error
        );

        if (error.response) {

            if (error.response.status === 500) {
                return {
                    status: "error",
                    httpStatus: 500,
                    message:
                        error.response.data?.message ||
                        "Internal Server Error"
                };
            }

            if (
                error.response.status === 401 ||
                error.response.status === 403
            ) {
                return {
                    status: "expire",
                    httpStatus: error.response.status,
                    message:
                        error.response.data?.message ||
                        "Session expired. Please login again.",
                    pageName: "login"
                };
            }
             
            return error.response.data;
        }

        if (error.request) {
            return {
                status: "failure",
                message: "No response from server."
            };
        }

        return {
            status: "failure",
            message:
                error.message ||
                "Something went wrong."
        };
    }
};

export const getNotificationList = async () => {
    try {
        const response = await api.post(
            "/company/notification/list"
        );
        return response.data;

    } catch (error) {
        console.error(
            "GET NOTIFICATION LIST ERROR",
            error
        );

        if (error.response) {
            if (error.response.status === 500) {
                return {
                    status: "error",
                    httpStatus: 500,
                    message:
                        error.response.data?.message ||
                        "Internal Server Error"
                };
            }

            if (
                error.response.status === 401 ||
                error.response.status === 403
            ) {
                return {
                    status: "expire",
                    httpStatus: error.response.status,
                    message:
                        error.response.data?.message ||
                        "Session expired. Please login again.",
                    pageName: "login"
                };
            }

            return error.response.data;
        }

        if (error.request) {
            return {
                status: "failure",
                message: "No response from server."
            };
        }

        return {
            status: "failure",
            message:
                error.message ||
                "Something went wrong."
        };
    }
};

export const deleteNotifications = async (notificationIds) => {
    try {

        const response = await api.post(
            "/company/notification/delete",
            {
                notificationIds: notificationIds
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "DELETE NOTIFICATIONS ERROR",
            error
        );

        if (error.response) {

            if (error.response.status === 500) {
                return {
                    status: "error",
                    httpStatus: 500,
                    message:
                        error.response.data?.message ||
                        "Internal Server Error"
                };
            }

            if (
                error.response.status === 401 ||
                error.response.status === 403
            ) {
                return {
                    status: "expire",
                    httpStatus: error.response.status,
                    message:
                        error.response.data?.message ||
                        "Session expired. Please login again.",
                    pageName: "login"
                };
            }

            return error.response.data;
        }

        if (error.request) {
            return {
                status: "failure",
                message: "No response from server."
            };
        }

        return {
            status: "failure",
            message:
                error.message ||
                "Something went wrong."
        };
    }
};

export const getNotificationById = async (notificationId) => {
    try {

        const response = await api.post(
            "/company/notification/view",
            null,
            {
                params: {
                    notificationId
                }
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "GET NOTIFICATION BY ID ERROR",
            error
        );

        if (error.response) {

            if (error.response.status === 500) {
                return {
                    status: "error",
                    httpStatus: 500,
                    message:
                        error.response.data?.message ||
                        "Internal Server Error"
                };
            }

            if (
                error.response.status === 401 ||
                error.response.status === 403
            ) {
                return {
                    status: "expire",
                    httpStatus: error.response.status,
                    message:
                        error.response.data?.message ||
                        "Session expired. Please login again.",
                    pageName: "login"
                };
            }

            return error.response.data;
        }

        if (error.request) {
            return {
                status: "failure",
                message: "No response from server."
            };
        }

        return {
            status: "failure",
            message:
                error.message ||
                "Something went wrong."
        };
    }
};

// Update existing notification / draft
export const updateNotification = async (notificationId, payload) => {
    try {

        const response = await api.post(
            `/company/notification/edit/${notificationId}`,
            payload
        );

        return response.data;

    } catch (error) {

        console.error(
            "UPDATE NOTIFICATION ERROR",
            error
        );

        if (error.response) {

            // Session expired / unauthorized
            if (
                error.response.status === 401 ||
                error.response.status === 403
            ) {
                return {
                    status: "expire",
                    httpStatus: error.response.status,
                    message:
                        error.response.data?.message ||
                        "Session expired. Please login again.",
                    pageName: "login"
                };
            }

            // Internal server error
            if (error.response.status === 500) {
                return {
                    status: "error",
                    httpStatus: 500,
                    message:
                        error.response.data?.message ||
                        "Internal Server Error"
                };
            }

            // Other API errors
            return error.response.data;
        }

        // Request sent but no response received
        if (error.request) {
            return {
                status: "failure",
                message: "No response from server."
            };
        }

        // Axios / client-side error
        return {
            status: "failure",
            message:
                error.message ||
                "Something went wrong."
        };
    }
};