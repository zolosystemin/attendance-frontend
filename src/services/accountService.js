import api from "./api";

export const changePassword = async (payload) => {
    try {
        const response = await api.post(
            "/company/change/password",
            payload
        );
        return response.data;
    } catch (error) {
        console.error("CHANGE PASSWORD ERROR", error);

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

export const getUserSession = async () => {
    try {
        const response = await api.get("/company/user/session");
        return response.data;
    } catch (error) {
        console.error("GET USER SESSION ERROR", error);

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

export const removeSession = async (jwtId) => {
    try {
        const response = await api.post(
            "/company/remove/session",
            { jwtId }
        );

        return response.data;
    } catch (error) {
        console.error("REMOVE SESSION ERROR", error);

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
            message: error.message || "Something went wrong."
        };
    }
};