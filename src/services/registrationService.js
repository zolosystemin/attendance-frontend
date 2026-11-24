import api from "./api";

export const generateRegistrationOtp = async (otpType, otpRecipient) => {
    try {
        const res = await api.post("/api/app/otp/generate", {
            otpType,
            otpRecipient
        });
        console.log(res);
        return res.data;
    } catch (err) {
        if (err.response) {
            return err.response.data;
        } else if (err.request) {
            // Request made but no response
            return res = "No response from server. Please try again.";
        }
    }
}

export const resendRegistrationOtp = async () => {
    try {
        const res = await api.post("/api/app/otp/resend");
        return res.data;
    } catch (err) {
        if (err.response) {
            return err.response.data;
        } else if (err.request) {
            // Request made but no response
            return res = "No response from server. Please try again.";
        }
    }
}

export const verifyRegistrationOtp = async (otp) => {

    try {
        const res = await api.post("/api/app/otp/verify", { otp });
        return res.data;
    } catch (err) {
        if (err.response) {
            return err.response.data;
        } else if (err.request) {
            // Request made but no response
            return res = "No response from server. Please try again.";
        }
    }
}

export const registerCompany = async (data) => {
    try {
        const response = await api.post("/auth/register/company", data);
        return response.data;
    } catch (err) {
        console.error("Register Company Error:", err);

        if (err.response) {
            // Handle HTTP 500
            if (err.response.status === 500) {
                return {
                    status: "error",
                    httpStatus: 500,
                    message:
                        err.response.data?.message ||
                        "Internal Server Error"
                };
            }

            // Return backend response (401, 403, 404, etc.)
            return err.response.data;
        }

        if (err.request) {
            return {
                status: "failure",
                message: "No response from server. Please try again."
            };
        }

        return {
            status: "failure",
            message: err.message || "Something went wrong."
        };
    }
};

export const registerCanndidate = async (data) => {
    let res;
    try {
        res = await api.post("/auth/register/candidate", data);
        return res.data;
    } catch (err) {
        if (err.response) {
            return res = err.response;
        } else if (err.request) {
            // Request made but no response
            return res = "No response from server. Please try again.";
        }
        return { error: "Something went wrong." };
    }
}

export const verifyCompanyWithMCA = async (data) => {
    try {
        const res = await api.post(
            "/auth/company/verify",
            data
        );

        return res.data;

    } catch (error) {
        console.error("Company verification failed:", error);

        // Server responded with an HTTP error
        if (error.response) {
            const httpStatus = error.response.status;
            const responseData = error.response.data || {};

            // Session expired / unauthorized
            if (httpStatus === 401 || httpStatus === 403) {
                return {
                    status: "expire",
                    httpStatus,
                    message:
                        responseData.message ||
                        "Session expired. Please login again.",
                    pageName: responseData.pageName || "login",
                    data: responseData.data || {}
                };
            }

            // Internal server error
            if (httpStatus >= 500) {
                return {
                    status: "error",
                    httpStatus,
                    message:
                        responseData.message ||
                        "Internal Server Error",
                    pageName: responseData.pageName || "",
                    data: responseData.data || {}
                };
            }

            // Other HTTP errors (400, 404, 429, etc.)
            return {
                ...responseData,
                httpStatus
            };
        }

        // Request sent but no response received
        if (error.request) {
            return {
                status: "failure",
                message: "No response from server. Please try again.",
                httpStatus: 0
            };
        }

        // Request configuration or other errors
        return {
            status: "failure",
            message: error.message || "Something went wrong.",
            httpStatus: 0
        };
    }
};