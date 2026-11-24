import api from "./api";

// validate user by username and password
export const validateUser = async (identifier, password) => {
    try {
        const res = await api.post("/auth/login/validate/user", {
            identifier,
            password
        });

        console.log("Validate User API response:", res);

        return res.data; // Return only API response
    } catch (err) {
        console.error("Validate User Error:", err);

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

// logout user
export const logoutUser = async () => {
    try {
        const res = await api.post("/auth/logout");
        console.log("Logout API response:", res);
        return res.data; // Return only API response
    } catch (err) {
        console.error("Logout Error:", err);

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


// OTP Generate API FOR 2nd MF
export const otpGenerateForTwoMF = async (otpType) => {
    try {
        const res = await api.post("/api/app/mf/otp/generate", null, { params: { otpType } });
        return res;
    } catch (err) {
        if (err.response) {
            const message =
                err.response.data?.message ||
                err.response.data?.error ||
                "Invalid Device Type";

            // Navigate to error page for 500
            if (err.response.status === 500) {
                navigate("/error", {
                    state: {
                        message: message,
                        status: err.response.status
                    }
                });
                return;
            }
            return message;
        } else if (err.request) {
            // Request made but no response
            throw new Error("No response from server. Please try again.");
        }
    }
}

export const forgotPasswordRequest = async (identifier) => {
    try {
        const response = await api.post(
            "/auth/recover/password",
            {
                identifier: identifier
            }
        );
        return response.data;
    } catch (err) {
         
        if (err.response) {
            if (err.response.status === 500) {
                return {
                    status: "error",
                    httpStatus: 500,
                    message:
                        err.response.data?.message ||
                        "Internal Server Error"
                };
            }
            return err.response.data;
        }

        if (err.request) {
            return {
                status: "failure",
                message:
                    "No response from server."
            };
        }

        return {
            status: "failure",
            message:
                err.message ||
                "Something went wrong."
        };
    }
};

export const VerifyOtpRequest = async (otp) => {
    try {
        const response = await api.post(
            "/auth/otp/verify",
            {
                otp: otp
            }
        );
        return response.data;
    } catch (err) {
         
        if (err.response) {
            if (err.response.status === 500) {
                return {
                    status: "error",
                    httpStatus: 500,
                    message:
                        err.response.data?.message ||
                        "Internal Server Error"
                };
            }
            return err.response.data;
        }

        if (err.request) {
            return {
                status: "failure",
                message:
                    "No response from server."
            };
        }

        return {
            status: "failure",
            message:
                err.message ||
                "Something went wrong."
        };
    }
};

export const ChangePasswordRequest = async (password) => {
    try {
        const response = await api.post(
            "/auth/change/password",
            {
                newPassword: password
            }
        );
        return response.data;
    } catch (err) {
         
        if (err.response) {
            if (err.response.status === 500) {
                return {
                    status: "error",
                    httpStatus: 500,
                    message:
                        err.response.data?.message ||
                        "Internal Server Error"
                };
            }
            return err.response.data;
        }

        if (err.request) {
            return {
                status: "failure",
                message:
                    "No response from server."
            };
        }

        return {
            status: "failure",
            message:
                err.message ||
                "Something went wrong."
        };
    }
};